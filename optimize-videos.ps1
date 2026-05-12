# ============================================
# Video Optimization Script for Web
# ============================================
# This script uses FFmpeg to optimize videos for web delivery
# Maintains quality while significantly reducing file size
#
# Prerequisites:
# - Install FFmpeg: https://ffmpeg.org/download.html
# - Add FFmpeg to your system PATH
#
# Usage:
# .\optimize-videos.ps1
# Or specify a custom directory:
# .\optimize-videos.ps1 -InputDir "C:\path\to\videos"
# ============================================

param(
    [string]$InputDir = ".\public\videos",
    [string]$OutputDir = ".\public\videos\optimized",
    [string]$Quality = "23",  # 18-28 range (lower = better quality, larger file)
    [switch]$WebM = $false     # Also create WebM versions for better compression
)

# Check if FFmpeg is installed
function Test-FFmpeg {
    try {
        $null = ffmpeg -version 2>&1
        return $true
    }
    catch {
        Write-Host "❌ FFmpeg is not installed or not in PATH!" -ForegroundColor Red
        Write-Host "Please install FFmpeg from: https://ffmpeg.org/download.html" -ForegroundColor Yellow
        return $false
    }
}

# Main optimization function
function Optimize-Video {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [string]$CRF = "23"
    )

    Write-Host "📹 Processing: $(Split-Path $InputPath -Leaf)" -ForegroundColor Cyan

    # Get input file size
    $inputSize = (Get-Item $InputPath).Length / 1MB

    # H.264 optimization (MP4) - best compatibility
    $mp4Output = $OutputPath -replace "\.[^.]+$", ".mp4"
    Write-Host "   → Creating optimized MP4..." -ForegroundColor Gray
    
    ffmpeg -i "$InputPath" `
        -c:v libx264 `
        -crf $CRF `
        -preset slow `
        -movflags +faststart `
        -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" `
        -c:a aac `
        -b:a 128k `
        -ar 44100 `
        -y `
        "$mp4Output" 2>&1 | Out-Null

    if (Test-Path $mp4Output) {
        $mp4Size = (Get-Item $mp4Output).Length / 1MB
        $savings = [math]::Round((($inputSize - $mp4Size) / $inputSize) * 100, 1)
        Write-Host "   ✅ MP4: $([math]::Round($inputSize, 2))MB → $([math]::Round($mp4Size, 2))MB (saved $savings%)" -ForegroundColor Green
    }

    # Optional: Create WebM version for even better compression
    if ($WebM) {
        $webmOutput = $OutputPath -replace "\.[^.]+$", ".webm"
        Write-Host "   → Creating WebM version..." -ForegroundColor Gray
        
        ffmpeg -i "$InputPath" `
            -c:v libvpx-vp9 `
            -crf $CRF `
            -b:v 0 `
            -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" `
            -c:a libopus `
            -b:a 96k `
            -y `
            "$webmOutput" 2>&1 | Out-Null

        if (Test-Path $webmOutput) {
            $webmSize = (Get-Item $webmOutput).Length / 1MB
            $webmSavings = [math]::Round((($inputSize - $webmSize) / $inputSize) * 100, 1)
            Write-Host "   ✅ WebM: $([math]::Round($inputSize, 2))MB → $([math]::Round($webmSize, 2))MB (saved $webmSavings%)" -ForegroundColor Green
        }
    }
}

# Main script execution
Write-Host "🎬 Video Optimization Script" -ForegroundColor Magenta
Write-Host "==============================" -ForegroundColor Magenta
Write-Host ""

# Check FFmpeg
if (-not (Test-FFmpeg)) {
    exit 1
}

# Create output directory
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    Write-Host "📁 Created output directory: $OutputDir" -ForegroundColor Yellow
}

# Get all video files
$videoFiles = Get-ChildItem -Path $InputDir -Include *.mp4,*.mov,*.avi,*.mkv,*.webm -Recurse

if ($videoFiles.Count -eq 0) {
    Write-Host "❌ No video files found in: $InputDir" -ForegroundColor Red
    exit 1
}

Write-Host "📊 Found $($videoFiles.Count) video file(s) to optimize" -ForegroundColor Cyan
Write-Host "📊 Quality (CRF): $Quality (lower = better quality)" -ForegroundColor Cyan
Write-Host "📊 Output directory: $OutputDir" -ForegroundColor Cyan
Write-Host ""

$totalInput = 0
$totalOutput = 0

# Process each video
foreach ($video in $videoFiles) {
    $relativePath = $video.FullName.Substring($InputDir.Length).TrimStart('\')
    $outputPath = Join-Path $OutputDir $relativePath
    $outputFolder = Split-Path $outputPath -Parent
    
    # Create subdirectories if needed
    if (-not (Test-Path $outputFolder)) {
        New-Item -ItemType Directory -Path $outputFolder -Force | Out-Null
    }
    
    Optimize-Video -InputPath $video.FullName -OutputPath $outputPath -CRF $Quality
    
    $totalInput += (Get-Item $video.FullName).Length
    $outputFile = $outputPath -replace "\.[^.]+$", ".mp4"
    if (Test-Path $outputFile) {
        $totalOutput += (Get-Item $outputFile).Length
    }
    
    Write-Host ""
}

# Summary
$totalInputMB = $totalInput / 1MB
$totalOutputMB = $totalOutput / 1MB
$totalSavings = [math]::Round((($totalInput - $totalOutput) / $totalInput) * 100, 1)

Write-Host "==============================" -ForegroundColor Magenta
Write-Host "📊 Optimization Summary" -ForegroundColor Magenta
Write-Host "==============================" -ForegroundColor Magenta
Write-Host "Total input size:  $([math]::Round($totalInputMB, 2)) MB" -ForegroundColor White
Write-Host "Total output size: $([math]::Round($totalOutputMB, 2)) MB" -ForegroundColor White
Write-Host "Total savings:     $totalSavings%" -ForegroundColor Green
Write-Host ""
Write-Host "✨ Optimization complete! Check the '$OutputDir' folder." -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "   - Use CRF 18-23 for high quality (larger files)" -ForegroundColor Gray
Write-Host "   - Use CRF 24-28 for good quality (smaller files)" -ForegroundColor Gray
Write-Host "   - Add -WebM flag to also create WebM versions" -ForegroundColor Gray
Write-Host "   - Test videos on your website before replacing originals" -ForegroundColor Gray