# Video Poster Generator Script

# This PowerShell script automatically generates poster images (first frames) from all videos
# Usage: .\generate-posters.ps1 -InputPath "public/videos" -Quality 85

param(
    [Parameter(Mandatory=$false)]
    [string]$InputPath = "public/videos",
    
    [Parameter(Mandatory=$false)]
    [int]$Quality = 85,
    
    [Parameter(Mandatory=$false)]
    [string]$OutputSuffix = "-poster",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("jpg", "webp", "png")]
    [string]$Format = "jpg"
)

# Check if FFmpeg is installed
function Test-FFmpeg {
    try {
        $null = ffmpeg -version 2>&1
        return $true
    } catch {
        return $false
    }
}

# Generate poster from video
function New-VideoPoster {
    param(
        [string]$VideoPath,
        [string]$OutputPath,
        [int]$Quality,
        [string]$Format
    )
    
    try {
        Write-Host "  Generating poster from: $VideoPath" -ForegroundColor Cyan
        
        # FFmpeg command to extract first frame
        if ($Format -eq "jpg") {
            ffmpeg -i "$VideoPath" -vframes 1 -q:v $Quality "$OutputPath" -y 2>&1 | Out-Null
        } elseif ($Format -eq "webp") {
            ffmpeg -i "$VideoPath" -vframes 1 -quality $Quality "$OutputPath" -y 2>&1 | Out-Null
        } else {
            ffmpeg -i "$VideoPath" -vframes 1 "$OutputPath" -y 2>&1 | Out-Null
        }
        
        if (Test-Path $OutputPath) {
            $fileSize = (Get-Item $OutputPath).Length / 1KB
            $roundedSize = [math]::Round($fileSize, 2)
            Write-Host "  [OK] Created: $OutputPath ($roundedSize KB)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "  [ERROR] Failed to create poster" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "  ✗ Error: $_" -ForegroundColor Red
        return $false
    }
}

# Main script
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Video Poster Generator" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Check FFmpeg
if (-not (Test-FFmpeg)) {
    Write-Host "ERROR: FFmpeg is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install FFmpeg:" -ForegroundColor Yellow
    Write-Host "  1. Download from: https://ffmpeg.org/download.html" -ForegroundColor Cyan
    Write-Host "  2. Extract and add to PATH" -ForegroundColor Cyan
    Write-Host "  3. Or use: winget install FFmpeg" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host "[OK] FFmpeg found" -ForegroundColor Green
Write-Host ""

# Resolve input path
$fullInputPath = Resolve-Path -Path $InputPath -ErrorAction SilentlyContinue
if (-not $fullInputPath) {
    Write-Host "ERROR: Input path not found: $InputPath" -ForegroundColor Red
    exit 1
}

Write-Host "Settings:" -ForegroundColor Yellow
Write-Host "  Input Path: $fullInputPath"
Write-Host "  Quality: $Quality"
Write-Host "  Format: $Format"
Write-Host "  Suffix: $OutputSuffix"
Write-Host ""

# Find all video files (recursively)
$videoExtensions = @("*.mp4", "*.mov", "*.avi", "*.mkv", "*.webm")
$videoFiles = @()
foreach ($ext in $videoExtensions) {
    $videoFiles += Get-ChildItem -Path $fullInputPath -Filter $ext -Recurse
}

if ($videoFiles.Count -eq 0) {
    Write-Host "No video files found in: $fullInputPath" -ForegroundColor Yellow
    exit 0
}

Write-Host "Found $($videoFiles.Count) video file(s)" -ForegroundColor Green
Write-Host ""

# Process each video
$successCount = 0
$skipCount = 0
$failCount = 0

foreach ($video in $videoFiles) {
    $videoName = [System.IO.Path]::GetFileNameWithoutExtension($video.Name)
    $videoDir = $video.DirectoryName
    $posterName = "$videoName$OutputSuffix.$Format"
    $posterPath = Join-Path $videoDir $posterName
    
    Write-Host "[$($successCount + $skipCount + $failCount + 1)/$($videoFiles.Count)] Processing: $($video.Name)"
    
    # Check if poster already exists
    if (Test-Path $posterPath) {
        Write-Host "  [SKIP] Poster already exists, skipping..." -ForegroundColor Yellow
        $skipCount++
        continue
    }
    
    # Generate poster
    $result = New-VideoPoster -VideoPath $video.FullName -OutputPath $posterPath -Quality $Quality -Format $Format
    
    if ($result) {
        $successCount++
    } else {
        $failCount++
    }
    
    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Summary" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Total videos processed: $($videoFiles.Count)"
Write-Host "  [OK] Successfully generated: $successCount" -ForegroundColor Green
Write-Host "  [SKIP] Skipped (already exist): $skipCount" -ForegroundColor Yellow
if ($failCount -gt 0) {
    Write-Host "  [ERROR] Failed: $failCount" -ForegroundColor Red
}
Write-Host ""

if ($successCount -gt 0) {
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Check generated posters in: $fullInputPath" -ForegroundColor White
    Write-Host "  2. Video components will automatically use posters with -poster suffix" -ForegroundColor White
    Write-Host "  3. Commit posters to your repository" -ForegroundColor White
    Write-Host ""
}

Write-Host "Done!" -ForegroundColor Green
