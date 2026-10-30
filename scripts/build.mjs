import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import zlib from "node:zlib";

function createZip(files) {
  const fileRecords = [];
  const localHeaders = [];
  let offset = 0;

  for (const [name, content] of Object.entries(files)) {
    const nameBuf = Buffer.from(name, "utf8");
    const dataBuf = Buffer.isBuffer(content) ? content : Buffer.from(content);
    const crc = zlib.crc32(dataBuf);
    const compressed = zlib.deflateRawSync(dataBuf);
    const useStored = compressed.byteLength >= dataBuf.byteLength;
    const finalData = useStored ? dataBuf : compressed;
    const compression = useStored ? 0 : 8;

    const localHeader = Buffer.alloc(30 + nameBuf.byteLength);
    localHeader.writeUInt32LE(0x04034b50, 0); // signature
    localHeader.writeUInt16LE(20, 4); // version needed 2.0
    localHeader.writeUInt16LE(0x0800, 6); // flags: UTF-8
    localHeader.writeUInt16LE(compression, 8); // compression method
    localHeader.writeUInt16LE(0, 10); // mod time
    localHeader.writeUInt16LE(0, 12); // mod date
    localHeader.writeUInt32LE(crc, 14); // crc32
    localHeader.writeUInt32LE(finalData.byteLength, 18); // compressed size
    localHeader.writeUInt32LE(dataBuf.byteLength, 22); // uncompressed size
    localHeader.writeUInt16LE(nameBuf.byteLength, 26); // filename length
    localHeader.writeUInt16LE(0, 28); // extra field length
    nameBuf.copy(localHeader, 30);

    localHeaders.push(localHeader, finalData);
    fileRecords.push({
      nameBuf,
      crc,
      compressedSize: finalData.byteLength,
      expandedSize: dataBuf.byteLength,
      compression,
      localOffset: offset,
    });

    offset += localHeader.byteLength + finalData.byteLength;
  }

  const centralOffset = offset;
  const centralRecords = [];

  for (const rec of fileRecords) {
    const cdHeader = Buffer.alloc(46 + rec.nameBuf.byteLength);
    cdHeader.writeUInt32LE(0x02014b50, 0); // signature
    cdHeader.writeUInt16LE((3 << 8) | 20, 4); // version made by: Unix, 2.0
    cdHeader.writeUInt16LE(20, 6); // version needed: 2.0
    cdHeader.writeUInt16LE(0x0800, 8); // flags: UTF-8
    cdHeader.writeUInt16LE(rec.compression, 10); // compression
    cdHeader.writeUInt16LE(0, 12); // mod time
    cdHeader.writeUInt16LE(0, 14); // mod date
    cdHeader.writeUInt32LE(rec.crc, 16); // crc32
    cdHeader.writeUInt32LE(rec.compressedSize, 20); // compressed size
    cdHeader.writeUInt32LE(rec.expandedSize, 24); // expanded size
    cdHeader.writeUInt16LE(rec.nameBuf.byteLength, 28); // filename length
    cdHeader.writeUInt16LE(0, 30); // extra length
    cdHeader.writeUInt16LE(0, 32); // comment length
    cdHeader.writeUInt16LE(0, 34); // disk start
    cdHeader.writeUInt16LE(0, 36); // internal attr
    cdHeader.writeUInt32LE(0x81a40000, 38); // external attr: regular file -rw-r--r--
    cdHeader.writeUInt32LE(rec.localOffset, 42); // local header offset
    rec.nameBuf.copy(cdHeader, 46);

    centralRecords.push(cdHeader);
    offset += cdHeader.byteLength;
  }

  const centralSize = offset - centralOffset;
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // signature
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // disk with start of central directory
  eocd.writeUInt16LE(fileRecords.length, 8); // entries on disk
  eocd.writeUInt16LE(fileRecords.length, 10); // total entries
  eocd.writeUInt32LE(centralSize, 12); // central directory size
  eocd.writeUInt32LE(centralOffset, 16); // central directory offset
  eocd.writeUInt16LE(0, 20); // comment length

  return Buffer.concat([...localHeaders, ...centralRecords, eocd]);
}

function build() {
  const rootDir = process.cwd();
  const srcDir = join(rootDir, "src");
  const manifestPath = join(srcDir, "manifest.json");

  if (!existsSync(manifestPath)) {
    throw new Error("Missing src/manifest.json");
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  console.log(`Building skin: ${manifest.name} (${manifest.id}) v${manifest.version}`);

  const filesToPack = {};

  filesToPack["manifest.json"] = readFileSync(manifestPath);

  const cssPath = join(srcDir, manifest.entry);
  if (!existsSync(cssPath)) throw new Error(`Declared CSS entry not found: ${manifest.entry}`);
  filesToPack[manifest.entry] = readFileSync(cssPath);

  if (manifest.preview) {
    const previewPath = join(srcDir, manifest.preview);
    if (!existsSync(previewPath)) throw new Error(`Declared preview asset not found: ${manifest.preview}`);
    filesToPack[manifest.preview] = readFileSync(previewPath);
  }

  const archive = createZip(filesToPack);
  const outArchiveName = "onyx.wskin";
  const outArchivePath = join(rootDir, outArchiveName);
  writeFileSync(outArchivePath, archive);

  const sha256 = createHash("sha256").update(archive).digest("hex");
  console.log(`Created ${outArchiveName} (${archive.byteLength} bytes)`);
  console.log(`SHA-256: ${sha256}`);

  const skinJson = {
    schemaVersion: 1,
    id: manifest.id,
    name: manifest.name,
    version: manifest.version,
    author: manifest.author,
    license: manifest.license,
    description: manifest.description || "",
    minAppVersion: manifest.minAppVersion,
    package: {
      ref: `v${manifest.version}`,
      path: outArchiveName,
      sha256: sha256,
    },
  };

  const skinJsonPath = join(rootDir, "skin.json");
  writeFileSync(skinJsonPath, JSON.stringify(skinJson, null, 2) + "\n");
  console.log(`Updated skin.json`);

  return { archive, sha256, manifest };
}

build();
