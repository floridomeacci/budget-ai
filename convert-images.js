const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = './assets/images';
const destDir = './public/images/characters';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

async function convert() {
  for (let i = 1; i <= 9; i++) {
    const src = path.join(srcDir, `character${i}.png`);
    const dest = path.join(destDir, `character${i}.webp`);
    await sharp(src).webp({ quality: 85 }).toFile(dest);
    console.log(`Converted: ${dest}`);
  }
}

convert().catch(console.error);
