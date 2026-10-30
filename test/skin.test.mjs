import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";

test("manifest.json structure and constraints", () => {
  const manifestPath = "src/manifest.json";
  assert.ok(existsSync(manifestPath), "src/manifest.json must exist");

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  assert.equal(manifest.schemaVersion, 3, "schemaVersion must be 3");
  assert.equal(manifest.packageType, "open-skin", "packageType must be open-skin");
  assert.equal(manifest.id, "community.onyx", "id must be community.onyx");
  assert.equal(manifest.name, "Onyx", "name must be Onyx");
  assert.equal(manifest.author, "webspeak-skin-onyx");
  assert.equal(manifest.license, "MIT");
  assert.equal(manifest.minAppVersion, "0.2.8", "minAppVersion must be >= 0.2.8");
  assert.equal(manifest.entry, "skin.css");
  assert.equal(manifest.preview, "assets/preview.png");
  assert.deepEqual(manifest.workspace, { apiVersion: 1, mode: "persistent" });
});

test("skin.json distribution metadata parity", () => {
  assert.ok(existsSync("skin.json"), "skin.json must exist in repo root");
  const skinJson = JSON.parse(readFileSync("skin.json", "utf8"));
  const manifest = JSON.parse(readFileSync("src/manifest.json", "utf8"));

  assert.equal(skinJson.schemaVersion, 1);
  assert.equal(skinJson.id, manifest.id);
  assert.equal(skinJson.name, manifest.name);
  assert.equal(skinJson.version, manifest.version);
  assert.equal(skinJson.author, manifest.author);
  assert.equal(skinJson.license, manifest.license);
  assert.equal(skinJson.minAppVersion, manifest.minAppVersion);
  assert.equal(skinJson.package.path, "onyx.wskin");
  assert.equal(skinJson.package.ref, `v${manifest.version}`);

  const archiveBytes = readFileSync("onyx.wskin");
  const computedSha = createHash("sha256").update(archiveBytes).digest("hex");
  assert.equal(skinJson.package.sha256, computedSha, "SHA-256 in skin.json must match actual archive");
});

test("onyx.wskin ZIP container integrity", () => {
  const bytes = readFileSync("onyx.wskin");
  assert.ok(bytes.byteLength > 22, "Archive must be larger than empty ZIP");
  assert.ok(bytes.byteLength <= 20 * 1024 * 1024, "Archive must be <= 20 MiB");

  const eocdSig = 0x06054b50;
  let eocdOffset = -1;
  for (let i = bytes.byteLength - 22; i >= 0; i--) {
    if (bytes.readUInt32LE(i) === eocdSig) {
      eocdOffset = i;
      break;
    }
  }
  assert.ok(eocdOffset >= 0, "Valid EOCD signature found");

  const entryCount = bytes.readUInt16LE(eocdOffset + 10);
  assert.equal(entryCount, 3, "Expected exactly 3 files: manifest.json, skin.css, assets/preview.png");

  const centralOffset = bytes.readUInt32LE(eocdOffset + 16);
  let cur = centralOffset;
  const centralSig = 0x02014b50;
  const foundFiles = [];

  for (let idx = 0; idx < entryCount; idx++) {
    assert.equal(bytes.readUInt32LE(cur), centralSig, "Central directory entry signature matches");
    const nameLen = bytes.readUInt16LE(cur + 28);
    const extraLen = bytes.readUInt16LE(cur + 30);
    const commentLen = bytes.readUInt16LE(cur + 32);
    const filename = bytes.toString("utf8", cur + 46, cur + 46 + nameLen);
    foundFiles.push(filename);
    cur += 46 + nameLen + extraLen + commentLen;
  }

  assert.deepEqual(foundFiles, ["manifest.json", "skin.css", "assets/preview.png"]);
});

test("assets/preview.png validity", () => {
  const pngBytes = readFileSync("src/assets/preview.png");
  const pngHeader = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  assert.ok(pngBytes.subarray(0, 8).equals(pngHeader), "preview.png has valid PNG magic bytes");

  const width = pngBytes.readUInt32BE(16);
  const height = pngBytes.readUInt32BE(20);
  assert.equal(width, 640);
  assert.equal(height, 360);
});

test("skin.css PostCSS and WebSpeak safety rules", () => {
  const css = readFileSync("src/skin.css", "utf8");
  assert.ok(Buffer.byteLength(css) <= 512 * 1024, "CSS must be under 512 KiB");

  function selectorUsesPublicHook(selector) {
    try {
      const parsed = selectorParser().astSync(selector);
      return parsed.nodes.length > 0 && parsed.nodes.every((item) => {
        let scoped = false;
        item.walk((node) => {
          if (node.type === "attribute" && ["data-ws-part", "data-ws-page", "data-ws-plugin-part"].includes(node.attribute.toLowerCase())) scoped = true;
          if (node.type === "pseudo" && node.value.toLowerCase() === ":root") scoped = true;
        });
        return scoped;
      });
    } catch {
      return false;
    }
  }

  const root = postcss.parse(css);
  const errors = [];

  root.walkRules((rule) => {
    if (rule.parent?.type === "rule") {
      errors.push(`Nested rule: ${rule.selector}`);
    }
    if (!selectorUsesPublicHook(rule.selector)) {
      errors.push(`Selector lacks public hook: ${rule.selector}`);
    }
  });

  root.walkDecls((decl) => {
    const prop = decl.prop.toLowerCase();
    if (prop.startsWith("--") && !/^--skin-[a-z0-9_-]+$/i.test(prop)) {
      errors.push(`Custom CSS variable must start with --skin-: ${prop}`);
    }
  });

  assert.equal(errors.length, 0, `CSS validation errors: ${errors.join("; ")}`);
});

test("element hiding rules for external links, QQ modal, and homepage animations", () => {
  const css = readFileSync("src/skin.css", "utf8");

  // Header suppression
  assert.ok(css.includes(".github-button"), "Must suppress .github-button");
  assert.ok(css.includes(".qq-button"), "Must suppress .qq-button");
  assert.ok(css.includes(".bilibili-button"), "Must suppress .bilibili-button");
  assert.ok(css.includes(".changelog-button"), "Must suppress .changelog-button");
  assert.ok(css.includes(".version-badge"), "Must suppress .version-badge");

  // Homepage social links & QQ modal suppression
  assert.ok(css.includes('[data-ws-part="home.social-links"] a[href*="github"]'));
  assert.ok(css.includes('[data-ws-part="home.social-links"] a[href*="qq"]'));
  assert.ok(css.includes('[data-ws-part="home.social-links"] a[href*="bilibili"]'));
  assert.ok(css.includes('.qq-modal-backdrop'));
  assert.ok(css.includes('[data-ws-part="home.community-dialog"]'));

  // Homepage animation removal
  assert.ok(css.includes('[data-ws-part="home.join-card.sonar"]'));
  assert.ok(css.includes('[data-ws-part="home.join-card.waveform"]'));
  assert.ok(css.includes('[data-ws-part="home.visitors.orbit"]'));
  assert.ok(css.includes('[data-ws-part="home.visitors.spark"]'));
  assert.ok(css.includes('.join-card-effects'));

  // Admin link retained and styled
  assert.ok(css.includes('[data-ws-part="home.social-links"] a[href="/admin"]'));
});

test("connection homepage OpenAI visual tokens and controls", () => {
  const css = readFileSync("src/skin.css", "utf8");

  // Primary connect button white background
  assert.ok(css.includes('[data-ws-part="home.connect"]'));
  assert.ok(css.includes("--skin-onyx-primary-btn"));

  // Form input field styling
  assert.ok(css.includes('[data-ws-part="home.field"]'));
  assert.ok(css.includes('[data-ws-part="home.field-label"]'));

  // Quick server history list items
  assert.ok(css.includes('[data-ws-part="home.server-history.item"]'));
  assert.ok(css.includes('[data-ws-part="home.server-history.select"]'));
});

test("voice stage, channel navigation and participant cards styling", () => {
  const css = readFileSync("src/skin.css", "utf8");

  // Server rail & channel tree
  assert.ok(css.includes('[data-ws-part="voice.favorite-servers.rail"]'));
  assert.ok(css.includes('[data-ws-part="voice.channel-group.heading"]'));

  // Artwork suppression in stage
  assert.ok(css.includes('[data-ws-part="voice.activity.artwork"]'));
  assert.ok(css.includes('[data-ws-part="voice.member-panel"]::before'));

  // Voice member cards & speaking states
  assert.ok(css.includes('[data-ws-part="voice.member"]'));
  assert.ok(css.includes('[data-ws-part="voice.member.avatar"]'));
  assert.ok(css.includes('[data-ws-part="voice.member.name"]'));
  assert.ok(css.includes('[data-ws-part="voice.member.status"]'));
  assert.ok(css.includes('[data-ws-speaking="true"]'));

  // Avatar uniform fallback (no rainbow)
  assert.ok(css.includes('[data-ws-part="voice.member.avatar"]'));

  // Screen share live indicator
  assert.ok(css.includes('[data-ws-part="voice.member.live-indicator"]'));
});


