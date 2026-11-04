import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';

function createPng(width, height, r, g, b) {
  // Generates an uncompressed/deflated raw truecolor PNG (8-bit RGB)
  // with a nursing green background and white cross
  const rowSize = width * 3 + 1; // 1 filter byte per line
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const crossWidth = Math.round(width * 0.22);
  const crossLength = Math.round(width * 0.65);
  const halfW = crossWidth / 2;
  const halfL = crossLength / 2;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 3;
      
      const inV = Math.abs(x - cx) <= halfW && Math.abs(y - cy) <= halfL;
      const inH = Math.abs(y - cy) <= halfW && Math.abs(x - cx) <= halfL;
      const inCross = inV || inH;

      if (inCross) {
        rawData[pixelOffset] = 250;     // R
        rawData[pixelOffset + 1] = 252; // G
        rawData[pixelOffset + 2] = 250; // B
      } else {
        rawData[pixelOffset] = r;       // R
        rawData[pixelOffset + 1] = g;   // G
        rawData[pixelOffset + 2] = b;   // B
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crc = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 2; // Color type 2: RGB
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const pub = path.resolve('public');
fs.writeFileSync(path.join(pub, 'pwa-192x192.png'), createPng(192, 192, 45, 82, 62));
fs.writeFileSync(path.join(pub, 'pwa-512x512.png'), createPng(512, 512, 45, 82, 62));
fs.writeFileSync(path.join(pub, 'apple-touch-icon.png'), createPng(180, 180, 45, 82, 62));
fs.writeFileSync(path.join(pub, 'favicon.ico'), createPng(64, 64, 45, 82, 62));

console.log('PNG Icons successfully created!');
