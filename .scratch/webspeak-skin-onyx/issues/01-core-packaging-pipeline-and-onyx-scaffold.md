# 01: Core packaging pipeline and Onyx dark scaffold

**What to build:** Establish the baseline package structure, manifest declaration, zero-dependency ZIP packaging pipeline, preview asset, and automated schema/integrity tests for the Onyx skin.

**Blocked by:** None (can start immediately)

**Status:** completed

- [x] `src/manifest.json` is configured for WebSpeak `schemaVersion: 3`, `packageType: "open-skin"`, and `minAppVersion: "0.2.8"`.
- [x] Persistent workspace policy is declared under `"workspace": { "apiVersion": 1, "mode": "persistent" }`.
- [x] Root `skin.json` matches manifest fields (id, name, version, author, license, minAppVersion) and points to `onyx.wskin`.
- [x] Preview asset is generated as a valid 640x360 PNG image under `src/assets/preview.png`.
- [x] `src/skin.css` baseline defines the Onyx dark color tokens, strictly prefixed with `--skin-onyx-*`.
- [x] Packaging script (`scripts/build.mjs`) builds a valid, unencrypted `.wskin` ZIP archive and calculates the 64-character SHA-256 hash for `skin.json`.
- [x] Automated test suite verifies manifest schema constraints, archive file integrity, and checksum parity between `onyx.wskin` and `skin.json`.
