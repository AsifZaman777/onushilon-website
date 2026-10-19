const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../public/images/photos-original');
const destDir = path.join(__dirname, '../public/images/photos');
const generalDir = path.join(__dirname, '../public/images');

async function processPhotos() {
  const files = fs.readdirSync(srcDir).filter(f => /\.(jpe?g|png)$/i.test(f));
  let totalBefore = 0;
  let totalAfterWebp = 0;
  let totalAfterJpg = 0;

  console.log('='.repeat(75));
  console.log('OPTIMIZING ONUSHILON PHOTOS');
  console.log('='.repeat(75));

  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const parsed = path.parse(file);
    const baseName = parsed.name;
    const statBefore = fs.statSync(srcPath);
    totalBefore += statBefore.size;

    const outWebp = path.join(destDir, `${baseName}.webp`);
    const outJpg = path.join(destDir, `${baseName}.jpg`);
    const outThumb = path.join(destDir, `${baseName}-thumb.webp`);

    // 1. High-resolution web version (max 1400px)
    await sharp(srcPath)
      .rotate() // auto-orient based on EXIF
      .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(outWebp);

    // 2. High-resolution optimized JPEG fallback (max 1400px, mozjpeg)
    await sharp(srcPath)
      .rotate()
      .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true, progressive: true })
      .toFile(outJpg);

    // 3. Compact thumbnail (max 420px) for mentor circles & avatar previews
    await sharp(srcPath)
      .rotate()
      .resize({ width: 420, height: 420, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toFile(outThumb);

    const sizeBefore = (statBefore.size / 1024 / 1024).toFixed(2);
    const sizeWebp = (fs.statSync(outWebp).size / 1024).toFixed(1);
    const sizeJpg = (fs.statSync(outJpg).size / 1024).toFixed(1);
    const sizeThumb = (fs.statSync(outThumb).size / 1024).toFixed(1);

    totalAfterWebp += fs.statSync(outWebp).size;
    totalAfterJpg += fs.statSync(outJpg).size;

    console.log(
      `${file.padEnd(26)} | Original: ${sizeBefore.padStart(5)} MB | WebP: ${sizeWebp.padStart(6)} KB | JPG: ${sizeJpg.padStart(6)} KB | Thumb: ${sizeThumb.padStart(5)} KB`
    );
  }

  // Also optimize root images (moment-*.jpg) if they exist
  const rootImages = ['moment-celebration.jpg', 'moment-collab.jpg', 'moment-lecture.jpg', 'moment-mentor.jpg'];
  for (const imgName of rootImages) {
    const imgPath = path.join(generalDir, imgName);
    if (fs.existsSync(imgPath)) {
      const parsed = path.parse(imgName);
      const imgBuffer = fs.readFileSync(imgPath);
      
      const outWebp = path.join(generalDir, `${parsed.name}.webp`);
      await sharp(imgBuffer)
        .rotate()
        .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outWebp);

      const optimizedJpgBuffer = await sharp(imgBuffer)
        .rotate()
        .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true, progressive: true })
        .toBuffer();

      fs.writeFileSync(imgPath, optimizedJpgBuffer);
    }
  }

  const beforeMB = (totalBefore / 1024 / 1024).toFixed(2);
  const afterWebpMB = (totalAfterWebp / 1024 / 1024).toFixed(2);
  const savedPercent = (((totalBefore - totalAfterWebp) / totalBefore) * 100).toFixed(1);

  console.log('='.repeat(75));
  console.log(`TOTAL PAYLOAD BEFORE: ${beforeMB} MB`);
  console.log(`TOTAL PAYLOAD AFTER:  ${afterWebpMB} MB`);
  console.log(`BANDWIDTH SAVINGS:    ${savedPercent}% REDUCTION`);
  console.log('='.repeat(75));
}

processPhotos().catch(err => {
  console.error('Error during image optimization:', err);
  process.exit(1);
});
