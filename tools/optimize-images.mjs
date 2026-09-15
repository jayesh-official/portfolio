/*
 * Local image optimizer (requires: npm i)
 * Overwrites source images with production-optimized versions.
 *   - Laracon JPGs: max 1600px long edge, quality 80 (mozjpeg, progressive)
 *   - avatar.png: 720px wide (optimized PNG) + avatar.webp companion
 *   - certificates: max 1600px, optimized PNG
 * Originals are backed up outside the repo by the setup script.
 */
import sharp from "sharp";
import { readFileSync, writeFileSync, copyFileSync, unlinkSync, statSync } from "node:fs";

const JPG_OPTS = { quality: 80, mozjpeg: true, progressive: true };

function replace(src, tmpPath, buf) {
  writeFileSync(tmpPath, buf);
  copyFileSync(tmpPath, src);
  unlinkSync(tmpPath);
}

async function jpegs() {
  let total = 0;
  for (let n = 1; n <= 15; n++) {
    const src = `img/laracon/${n}.jpg`;
    const before = statSync(src).size;
    const buf = await sharp(readFileSync(src))
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg(JPG_OPTS)
      .toBuffer();
    replace(src, `img/laracon/${n}.opt.jpg`, buf);
    console.log(`laracon/${n}.jpg  ${(before / 1024).toFixed(0)}KB -> ${(buf.length / 1024).toFixed(0)}KB`);
    total += buf.length;
  }
  console.log(`Laracon total: ${(total / 1024 / 1024).toFixed(2)} MB`);
}

async function avatar() {
  const before = statSync("img/avatar.png").size;
  const png = await sharp(readFileSync("img/avatar.png"))
    .resize({ width: 720, withoutEnlargement: true })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  replace("img/avatar.png", "img/avatar.opt.png", png);
  const webp = await sharp(readFileSync("img/avatar.png")).webp({ quality: 82 }).toBuffer();
  writeFileSync("img/avatar.webp", webp);
  console.log(`avatar.png ${(before / 1024).toFixed(0)}KB -> ${(png.length / 1024).toFixed(0)}KB   avatar.webp ${(webp.length / 1024).toFixed(0)}KB`);
}

async function certificates() {
  let total = 0;
  for (let n = 1; n <= 4; n++) {
    const src = `img/certificates/${n}.png`;
    const before = statSync(src).size;
    const buf = await sharp(readFileSync(src))
      .resize({ width: 1600, withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toBuffer();
    replace(src, `img/certificates/${n}.opt.png`, buf);
    console.log(`certificates/${n}.png  ${(before / 1024).toFixed(0)}KB -> ${(buf.length / 1024).toFixed(0)}KB`);
    total += buf.length;
  }
  console.log(`Certificates total: ${(total / 1024).toFixed(0)} KB`);
}

await jpegs();
await avatar();
await certificates();
console.log("Image optimization complete.");