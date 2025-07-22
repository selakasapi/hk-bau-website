const fs = require('fs');
const path = require('path');
const THUMB_WIDTH = 400; // same as in make-thumbnails.sh

function getJpegSize(buf) {
  let offset = 2; // Skip SOI marker
  while (offset < buf.length) {
    if (buf[offset] !== 0xFF) throw new Error('Invalid JPEG marker');
    const marker = buf[offset + 1];
    offset += 2;
    if (marker === 0xD8 || marker === 0xD9 || marker === 0x01 || (marker >= 0xD0 && marker <= 0xD7)) {
      continue; // markers without length
    }
    const len = buf.readUInt16BE(offset);
    if (marker >= 0xC0 && marker <= 0xC3) { // SOF markers
      const height = buf.readUInt16BE(offset + 3);
      const width = buf.readUInt16BE(offset + 5);
      return { width, height };
    }
    offset += len;
  }
  throw new Error('SOF marker not found');
}

const baseDir = path.join(__dirname, '../Website/images');
const result = {};

for (const folder of fs.readdirSync(baseDir)) {
  if (!folder.endsWith('-referenzen')) continue;
  const folderPath = path.join(baseDir, folder);
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg'));
  if (!files.length) continue;
  const map = {};
  for (const file of files) {
    const buf = fs.readFileSync(path.join(folderPath, file));
    const { width, height } = getJpegSize(buf);
    const thumbWidth = THUMB_WIDTH;
    const thumbHeight = Math.round(height * THUMB_WIDTH / width);
    map[file] = { width: thumbWidth, height: thumbHeight };
  }
  result[folder] = map;
}

const outFile = path.join(__dirname, '../Website/js/image-dimensions.json');
fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
console.log('Wrote', outFile);
