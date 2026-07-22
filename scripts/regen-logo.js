/*
 * Regenerates every logo / favicon / app-icon from the new logo emblem.
 * Source: public/images/icon/logo-new.png (portrait: emblem 693x693 on top, "HK-BAU" text below).
 * We crop the emblem (drop the wordmark) and derive all sized assets.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ICON = path.join(__dirname, "..", "public", "images", "icon");
const PUB = path.join(__dirname, "..", "public");
const SRC = path.join(ICON, "logo-new.png");

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

function buildIco(items) {
  // items: [{ size, buf(png) }]
  const count = items.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);
  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  const blobs = [];
  items.forEach((it, i) => {
    const b = i * 16;
    dir.writeUInt8(it.size >= 256 ? 0 : it.size, b + 0); // width
    dir.writeUInt8(it.size >= 256 ? 0 : it.size, b + 1); // height
    dir.writeUInt8(0, b + 2); // palette
    dir.writeUInt8(0, b + 3); // reserved
    dir.writeUInt16LE(1, b + 4); // color planes
    dir.writeUInt16LE(32, b + 6); // bits per pixel
    dir.writeUInt32LE(it.buf.length, b + 8); // data size
    dir.writeUInt32LE(offset, b + 12); // data offset
    offset += it.buf.length;
    blobs.push(it.buf);
  });
  return Buffer.concat([header, dir, ...blobs]);
}

(async () => {
  const meta = await sharp(SRC).metadata();
  // emblem = top square (auto-detected as 693x693; fall back to min(w, w))
  const side = Math.min(meta.width, meta.height, 693);
  const emblem = await sharp(SRC)
    .extract({ left: 0, top: 0, width: meta.width, height: side })
    .trim()
    .resize(1024, 1024, { fit: "contain", background: TRANSPARENT })
    .png()
    .toBuffer();

  const contain = (size, bg) =>
    sharp(emblem).resize(size, size, { fit: "contain", background: bg }).png().toBuffer();

  // padded icon on a solid background (for maskable / apple)
  async function padded(size, scale, bg) {
    const inner = Math.round(size * scale);
    const em = await sharp(emblem)
      .resize(inner, inner, { fit: "contain", background: TRANSPARENT })
      .png()
      .toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
      .composite([{ input: em, gravity: "center" }])
      .png()
      .toBuffer();
  }

  // 1) main logo — transparent, matches how the old logo sits on header/footer/spinner
  await sharp(await contain(256, TRANSPARENT)).toFile(path.join(ICON, "logo.png"));

  // 2) browser-tab pngs — transparent
  fs.writeFileSync(path.join(PUB, "favicon-96x96.png"), await contain(96, TRANSPARENT));

  // 3) apple-touch — white bg (iOS renders transparency as black), slight margin
  fs.writeFileSync(path.join(PUB, "apple-touch-icon.png"), await padded(180, 0.92, WHITE));

  // 4) maskable manifest icons — solid white bg, emblem inside the ~80% safe zone
  fs.writeFileSync(path.join(PUB, "web-app-manifest-192x192.png"), await padded(192, 0.74, WHITE));
  fs.writeFileSync(path.join(PUB, "web-app-manifest-512x512.png"), await padded(512, 0.74, WHITE));

  // 5) favicon.svg — same wrapper style as before: an <image> embedding a base64 png
  const svgPng = await contain(160, TRANSPARENT);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="160" height="160" viewBox="0 0 160 160"><image width="160" height="160" xlink:href="data:image/png;base64,${svgPng.toString("base64")}"/></svg>`;
  fs.writeFileSync(path.join(PUB, "favicon.svg"), svg);

  // 6) favicon.ico — multi-size (16/32/48) png-in-ico
  const sizes = [16, 32, 48];
  const items = [];
  for (const s of sizes) items.push({ size: s, buf: await contain(s, TRANSPARENT) });
  fs.writeFileSync(path.join(PUB, "favicon.ico"), buildIco(items));

  console.log("Regenerated: logo.png, favicon-96x96.png, apple-touch-icon.png,");
  console.log("web-app-manifest-192/512.png, favicon.svg, favicon.ico");
})();
