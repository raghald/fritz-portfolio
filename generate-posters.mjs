#!/usr/bin/env node

/**
 * Video Poster Generator using @ffmpeg/ffmpeg (WebAssembly)
 * No system FFmpeg installation required!
 *
 * Usage:
 *   node generate-posters.mjs
 *   node generate-posters.mjs --input public/videos
 *   node generate-posters.mjs --input public/videos/gallery --quality 85
 */

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import fs from "fs/promises";
import path from "path";

// Parse command line arguments
const args = process.argv.slice(2);
let inputPath = "public/videos";
let quality = 85;
let format = "jpg";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--input" && args[i + 1]) {
    inputPath = args[i + 1];
    i++;
  } else if (args[i] === "--quality" && args[i + 1]) {
    quality = parseInt(args[i + 1], 10);
    i++;
  } else if (args[i] === "--format" && args[i + 1]) {
    format = args[i + 1];
    i++;
  }
}

console.log("========================================");
console.log("  Video Poster Generator (Node.js)");
console.log("========================================");
console.log("");
console.log("Settings:");
console.log(`  Input: ${inputPath}`);
console.log(`  Quality: ${quality}`);
console.log(`  Format: ${format}`);
console.log("");
console.log("⚠️  First run will download FFmpeg WASM (~30MB)");
console.log("    This only happens once!");
console.log("");

// Find all video files recursively
async function findVideoFiles(dir) {
  const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
  const files = [];

  async function scan(currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          await scan(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (videoExtensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning ${currentDir}:`, error.message);
    }
  }

  await scan(dir);
  return files;
}

// Generate poster from video
async function generatePoster(ffmpeg, videoPath, outputPath) {
  try {
    console.log(`  Processing: ${path.basename(videoPath)}`);

    // Read video file
    const videoData = await fs.readFile(videoPath);
    const videoName = "input" + path.extname(videoPath);

    // Write to FFmpeg virtual filesystem
    await ffmpeg.writeFile(videoName, videoData);

    // Extract first frame
    const outputName = `output.${format}`;
    const qualityArg = format === "jpg" ? ["-q:v", quality.toString()] : [];

    await ffmpeg.exec([
      "-i",
      videoName,
      "-vframes",
      "1",
      ...qualityArg,
      outputName,
    ]);

    // Read output
    const posterData = await ffmpeg.readFile(outputName);

    // Write to disk
    await fs.writeFile(outputPath, posterData);

    // Get file size
    const stats = await fs.stat(outputPath);
    const sizeKB = (stats.size / 1024).toFixed(2);

    console.log(`  ✓ Created: ${path.basename(outputPath)} (${sizeKB} KB)`);

    // Cleanup
    await ffmpeg.deleteFile(videoName);
    await ffmpeg.deleteFile(outputName);

    return true;
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  try {
    // Initialize FFmpeg
    console.log("Initializing FFmpeg...");
    const ffmpeg = new FFmpeg();

    // Load FFmpeg WASM
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });

    console.log("✓ FFmpeg loaded\n");

    // Find video files
    const fullInputPath = path.resolve(inputPath);
    console.log(`Scanning: ${fullInputPath}`);

    const videoFiles = await findVideoFiles(fullInputPath);

    if (videoFiles.length === 0) {
      console.log("No video files found.");
      return;
    }

    console.log(`Found ${videoFiles.length} video file(s)\n`);

    // Process each video
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    for (let i = 0; i < videoFiles.length; i++) {
      const videoPath = videoFiles[i];
      const videoDir = path.dirname(videoPath);
      const videoName = path.basename(videoPath, path.extname(videoPath));
      const posterName = `${videoName}-poster.${format}`;
      const posterPath = path.join(videoDir, posterName);

      console.log(
        `[${i + 1}/${videoFiles.length}] ${path.basename(videoPath)}`
      );

      // Check if poster already exists
      try {
        await fs.access(posterPath);
        console.log("  ⊘ Poster already exists, skipping...");
        skipCount++;
        continue;
      } catch {
        // File doesn't exist, continue
      }

      // Generate poster
      const success = await generatePoster(ffmpeg, videoPath, posterPath);

      if (success) {
        successCount++;
      } else {
        failCount++;
      }

      console.log("");
    }

    // Summary
    console.log("========================================");
    console.log("  Summary");
    console.log("========================================");
    console.log("");
    console.log(`Total videos processed: ${videoFiles.length}`);
    console.log(`  ✓ Successfully generated: ${successCount}`);
    console.log(`  ⊘ Skipped (already exist): ${skipCount}`);
    if (failCount > 0) {
      console.log(`  ✗ Failed: ${failCount}`);
    }
    console.log("");

    if (successCount > 0) {
      console.log("Next steps:");
      console.log("  1. Check generated posters in:", fullInputPath);
      console.log("  2. Video components will automatically use posters");
      console.log("  3. Commit posters to your repository");
      console.log("");
    }

    console.log("Done! 🎉");
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

main();
