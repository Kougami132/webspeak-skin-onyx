import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import zlib from "node:zlib";

function createPng(width, height, getPixel) {
  const stride = width * 4;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (stride + 1);
    raw[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      const pxOffset = rowOffset + 1 + x * 4;
      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = a;
    }
  }

  function chunk(type, data) {
    const len = data.byteLength;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, "ascii");
    data.copy(buf, 8);
    const crc = zlib.crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = chunk("IDAT", zlib.deflateSync(raw, { level: 9 }));
  const iend = chunk("IEND", Buffer.alloc(0));

  return Buffer.concat([header, chunk("IHDR", ihdr), idat, iend]);
}

const W = 640;
const H = 360;

const pngBuffer = createPng(W, H, (x, y) => {
  let r = 23, g = 23, b = 23, a = 255; // #171717

  // Outer app shell window: 24 <= x <= 616, 20 <= y <= 340
  if (x >= 24 && x <= 616 && y >= 20 && y <= 340) {
    if (x === 24 || x === 616 || y === 20 || y === 340) return [47, 47, 47, 255]; // #2f2f2f
    r = 33; g = 33; b = 33; // #212121

    // Top Bar
    if (y <= 58) {
      r = 23; g = 23; b = 23;
      if (y === 58) return [47, 47, 47, 255];
      if (x >= 40 && x <= 100 && y >= 32 && y <= 46) {
        if (x === 40 || x === 100 || y === 32 || y === 46) return [47, 47, 47, 255];
        return [38, 38, 38, 255];
      }
      if (x >= 48 && x <= 52 && y >= 37 && y <= 41) return [16, 163, 127, 255]; // #10a37f
      if (x >= 120 && x <= 220 && y >= 38 && y <= 40) return [115, 115, 115, 255];
      if ((x >= 520 && x <= 550 && y >= 30 && y <= 48) || (x >= 560 && x <= 596 && y >= 30 && y <= 48)) {
        if (x === 520 || x === 550 || x === 560 || x === 596 || y === 30 || y === 48) return [47, 47, 47, 255];
        return [38, 38, 38, 255];
      }
    }

    // Left Server Rail
    if (x <= 75 && y > 58) {
      r = 23; g = 23; b = 23;
      if (x === 75) return [47, 47, 47, 255];
      if (x >= 38 && x <= 62 && y >= 76 && y <= 100) return [47, 47, 47, 255];
      if (x >= 26 && x <= 28 && y >= 82 && y <= 94) return [16, 163, 127, 255];
      if (x >= 38 && x <= 62 && y >= 114 && y <= 138) return [38, 38, 38, 255];
    }

    // Left Channel Sidebar
    if (x > 75 && x <= 210 && y > 58) {
      r = 23; g = 23; b = 23;
      if (x === 210) return [47, 47, 47, 255];
      if (x >= 90 && x <= 196 && y >= 74 && y <= 94) {
        if (x === 90 || x === 196 || y === 74 || y === 94) return [47, 47, 47, 255];
        return [33, 33, 33, 255];
      }
      if (x >= 86 && x <= 200 && y >= 110 && y <= 136) {
        r = 38; g = 38; b = 38;
        if (x >= 86 && x <= 88) return [16, 163, 127, 255];
      }
      if (x >= 96 && x <= 170 && y >= 152 && y <= 156) return [115, 115, 115, 255];
      if (y >= 296) {
        if (y === 296) return [47, 47, 47, 255];
        const dx = x - 102, dy = y - 317;
        if (dx * dx + dy * dy <= 144) return [16, 163, 127, 255];
        if (x >= 124 && x <= 180 && y >= 314 && y <= 318) return [236, 236, 236, 255];
      }
    }

    // Main Stage Area
    if (x > 210 && x <= 470 && y > 58) {
      r = 33; g = 33; b = 33;
      if (x >= 230 && x <= 335 && y >= 80 && y <= 185) {
        if (x === 230 || x === 335 || y === 80 || y === 185) return [47, 47, 47, 255];
        r = 23; g = 23; b = 23;
        const dx = x - 282, dy = y - 125;
        const d2 = dx * dx + dy * dy;
        if (d2 <= 576) {
          if (d2 >= 440) return [16, 163, 127, 255]; // Speaking Ring!
          return [47, 47, 47, 255];
        }
        if (x >= 260 && x <= 305 && y >= 162 && y <= 166) return [236, 236, 236, 255];
      }
      if (x >= 345 && x <= 450 && y >= 80 && y <= 185) {
        if (x === 345 || x === 450 || y === 80 || y === 185) return [47, 47, 47, 255];
        r = 23; g = 23; b = 23;
        const dx = x - 397, dy = y - 125;
        if (dx * dx + dy * dy <= 576) return [56, 56, 56, 255];
        if (x >= 375 && x <= 420 && y >= 162 && y <= 166) return [180, 180, 180, 255];
      }
      if (x >= 230 && x <= 450 && y >= 270 && y <= 314) {
        if (x === 230 || x === 450 || y === 270 || y === 314) return [56, 56, 56, 255];
        return [38, 38, 38, 255];
      }
    }

    // Right Chat Panel
    if (x > 470 && y > 58) {
      r = 23; g = 23; b = 23;
      if (x === 471) return [47, 47, 47, 255];
      if (y >= 68 && y <= 92 && x >= 485 && x <= 535) return [38, 38, 38, 255];
      if (x >= 482 && x <= 602 && y >= 282 && y <= 316) {
        if (x === 482 || x === 602 || y === 282 || y === 316) return [47, 47, 47, 255];
        const dx = x - 588, dy = y - 299;
        if (dx * dx + dy * dy <= 81) return [255, 255, 255, 255]; // White Send Circle
        return [33, 33, 33, 255];
      }
    }
  }

  return [r, g, b, a];
});

mkdirSync(dirname("src/assets/preview.png"), { recursive: true });
writeFileSync("src/assets/preview.png", pngBuffer);
console.log(`Generated preview.png (${pngBuffer.byteLength} bytes)`);
