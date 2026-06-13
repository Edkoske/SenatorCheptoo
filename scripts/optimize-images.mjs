import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const assetsDir = path.resolve("assets");

const jobs = [
  { file: "1781336661765.jpg", maxWidth: 900, quality: 82 },
  { file: "1781336561631.jpg", maxWidth: 900, quality: 82 },
  { file: "1781336665506.jpg", maxWidth: 900, quality: 82 },
  { file: "1781336673487.jpg", maxWidth: 900, quality: 82 },
  { file: "1781336677044.jpg", maxWidth: 900, quality: 82 },
  { file: "1781336705341.jpg", maxWidth: 900, quality: 82 },
  { file: "senator-cheptoo-portrait.png", maxWidth: 120, quality: 90 },
  {
    file: "senator-cheptoo-bg-tent.jpg",
    out: "senator-cheptoo-bg-tent.jpg",
    maxWidth: 1600,
    quality: 78,
  },
  {
    file: "senator-cheptoo-bg-tent.jpg",
    out: "senator-cheptoo-bg-tent-mobile.jpg",
    maxWidth: 800,
    quality: 72,
  },
];

const formatKb = (bytes) => `${Math.round(bytes / 1024)} KB`;

for (const job of jobs) {
  const input = path.join(assetsDir, job.file);
  const outputName = job.out || job.file;
  const output = path.join(assetsDir, outputName);

  if (!fs.existsSync(input)) {
    console.warn(`Skip missing: ${job.file}`);
    continue;
  }

  const before = fs.statSync(input).size;
  let pipeline = sharp(input).rotate().resize({ width: job.maxWidth, withoutEnlargement: true });

  if (outputName.endsWith(".jpg")) {
    pipeline = pipeline.jpeg({ quality: job.quality, mozjpeg: true });
  } else if (outputName.endsWith(".png")) {
    pipeline = pipeline.png({ quality: job.quality, compressionLevel: 9, palette: true });
  }

  const buffer = await pipeline.toBuffer();
  fs.writeFileSync(output, buffer);
  console.log(`${outputName}: ${formatKb(before)} → ${formatKb(buffer.length)}`);
}
