#!/usr/bin/env node

/**
 * Simple Poster Placeholder Generator
 * Creates solid color placeholders for videos until you can generate real posters
 *
 * Usage: node generate-placeholder-posters.mjs
 */

import fs from "fs/promises";
import path from "path";
import { createCanvas } from "canvas";

const VIDEO_EXTENSIONS = [".mp4", ".mov", ".avi", ".mkv", ".webm"];

async function findVideoFiles(dir) {
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
          if (VIDEO_EXTENSIONS.includes(ext)) {
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

async function createPlaceholder(videoPath, outputPath) {
  try {
    // Create 1080x1920 canvas (vertical video)
    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext("2d");

    // Black background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 1080, 1920);

    // Add text
    ctx.fillStyle = "#ffffff";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Loading...", 540, 960);

    // Save as JPEG
    const buffer = canvas.toBuffer("image/jpeg", { quality: 0.85 });
    await fs.writeFile(outputPath, buffer);

    return true;
  } catch (error) {
    console.error(`Error creating placeholder:`, error.message);
    return false;
  }
}

async function main() {
  console.log("========================================");
  console.log("  Placeholder Poster Generator");
  console.log("========================================");
  console.log("");
  console.log("⚠️  This creates simple black placeholders");
  console.log("   For real posters, install FFmpeg first!");
  console.log("");

  const inputPath = "public/videos";
  const videoFiles = await findVideoFiles(inputPath);

  if (videoFiles.length === 0) {
    console.log("No video files found.");
    return;
  }

  console.log(`Found ${videoFiles.length} video file(s)\n`);

  let successCount = 0;
  let skipCount = 0;

  for (let i = 0; i < videoFiles.length; i++) {
    const videoPath = videoFiles[i];
    const videoDir = path.dirname(videoPath);
    const videoName = path.basename(videoPath, path.extname(videoPath));
    const posterPath = path.join(videoDir, `${videoName}-poster.jpg`);

    console.log(`[${i + 1}/${videoFiles.length}] ${path.basename(videoPath)}`);

    // Check if exists
    try {
      await fs.access(posterPath);
      console.log("  ⊘ Already exists, skipping...\n");
      skipCount++;
      continue;
    } catch {
      // Continue
    }

    // Create placeholder
    const success = await createPlaceholder(videoPath, posterPath);

    if (success) {
      console.log(`  ✓ Created placeholder\n`);
      successCount++;
    }
  }

  console.log("========================================");
  console.log("  Summary");
  console.log("========================================");
  console.log("");
  console.log(`  ✓ Created: ${successCount}`);
  console.log(`  ⊘ Skipped: ${skipCount}`);
  console.log("");
  console.log("To create real posters, install FFmpeg:");
  console.log("  winget install FFmpeg");
  console.log("");
}

main().catch(console.error);
