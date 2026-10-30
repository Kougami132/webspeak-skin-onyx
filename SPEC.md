# Spec: WebSpeak Skin Onyx (OpenAI Dark Aesthetic)

## Problem Statement

WebSpeak provides a browser-based client for TeamSpeak servers, but its default skins are either bright daylight glass or game-centric with neon effects, decorative animations (sonar rings, waveform bars), and visible external promotion badges (GitHub repository buttons, QQ community group popups, and Bilibili links).

Users and server administrators seeking a modern, professional, and minimalist voice workspace—akin to OpenAI / ChatGPT's desktop and web applications—currently lack a dedicated skin. Furthermore, existing skins clutter the interface with external project and community links that are unsuitable for custom, private, or enterprise TeamSpeak deployments.

## Solution

Build `community.onyx` ("Onyx"), a standalone, portable `schemaVersion: 3` open-skin package (`.wskin`) and distribution metadata (`skin.json`) for WebSpeak >= 0.2.8. 

The skin delivers an authentic OpenAI dark aesthetic:
- A deep charcoal and obsidian palette (`#171717` / `#212121` / `#2f2f2f`) with subtle micro-borders (`rgba(255, 255, 255, 0.08)`).
- High-contrast pure white primary action buttons (`#ffffff` with `#0d0d0d` text).
- Signature OpenAI emerald green (`#10a37f`) for live status indicators, speaking participant rings, and active controls.
- Complete removal of GitHub, QQ group, Bilibili, and changelog buttons, while cleanly preserving access to the administrative console (`/admin`).
- Elimination of redundant gaming animations and artwork overlays in favor of calm, readable conversational and workspace surfaces.
- Persistent workspace support via WebSpeak Workspace API v1, ensuring returning visitors stay directly inside their client workspace without re-encountering the landing connection page.

## User Stories

1. As a TeamSpeak web user, I want the client background and cards to use OpenAI's neutral charcoal dark palette, so that the interface feels calm, modern, and easy on the eyes during long voice sessions.
2. As a TeamSpeak web user, I want primary buttons (such as "Enter Voice" and dialog confirmations) to have high-contrast solid white backgrounds with dark text, so that the primary call to action is immediately recognizable.
3. As a TeamSpeak web user, I want participants speaking in the voice room to display a clean OpenAI emerald green outline ring, so that active speakers are instantly obvious without distracting neon glow effects.
4. As a server host, I want all GitHub repository links and badges hidden from the header and footer, so that the client does not expose external open-source project links to my end users.
5. As a server host, I want all QQ group promotional buttons and QR code modals hidden, so that the interface remains neutral and unbranded by third-party community groups.
6. As a server host, I want Bilibili and changelog links hidden from the header, so that my users have a focused voice experience without external redirect links.
7. As an administrator, I want the settings/admin console button (`/admin`) to remain accessible on the connection page, so that I can easily navigate to the administration panel even when public community links are hidden.
8. As a TeamSpeak web user, I want decorative sonar rings and animated waveform bars removed from the connection card, so that the login form feels fast, clean, and professional.
9. As a TeamSpeak web user, I want member cards in the voice stage to have matte, flat surfaces with rounded corners and no intrusive mascot art, so that participant cards are uncluttered.
10. As a TeamSpeak web user, I want member avatars without a custom uploaded image to use a uniform dark gray circle with white text instead of random rainbow colors, so that user lists maintain visual consistency.
11. As a TeamSpeak web user, I want text chat messages to render as a flat conversational stream rather than bulky rounded speech balloons, so that discussion history is compact and legible.
12. As a TeamSpeak web user, I want the chat input composer to resemble the ChatGPT prompt bar (a rounded dark container with a circular send action), so that message drafting feels familiar and intuitive.
13. As a TeamSpeak web user, I want the desktop audio dock (mic/speaker controls) to look like a floating dark control pill, so that sound controls sit quietly at the bottom of the screen.
14. As a TeamSpeak web user, I want microphone mute and output mute buttons to show a distinct coral red accent when muted, so that privacy states are unmistakable.
15. As a TeamSpeak web user, I want hover panels for input and output volume sliders to open in sleek dark cards with emerald progress tracks, so that fine audio adjustment is easy and visually consistent.
16. As a TeamSpeak web user, I want the server channel tree on the left sidebar to use clean typography and subtle background highlights, so that channel navigation is unobtrusive.
17. As a TeamSpeak web user, I want the active voice channel to feature a distinct left emerald accent indicator and clear typography, so that my current room location is always obvious.
18. As a TeamSpeak web user, I want screen share feeds to render with letterboxed black backdrops and minimalist floating control pills, so that video presentations look crisp and undistorted.
19. As a TeamSpeak web user, I want dialog modals (server password, audio configuration, identity import, and favorites) to have semi-transparent blurred backdrops and dark matte surfaces, so that modal workflows feel integrated.
20. As a returning user, I want my session to remain inside the persistent workspace upon browser refresh or disconnect, so that I do not get repeatedly thrown back to the initial landing form.
21. As a disconnected user in the workspace, I want a floating top pill with network status and a reconnect button, so that I can re-enter voice with a single click.
22. As a multilingual user, I want all interface text to continue displaying in my chosen language (Chinese, English, German, Russian, or Japanese), so that the skin does not break native translations.
23. As an instance administrator, I want the skin to display my server's custom configured brand title dynamically, so that the client reflects my server's branding without hardcoding "OpenAI" or "ChatGPT".
24. As a mobile user, I want the bottom navigation bar and mobile panels to be touch-friendly with at least 44px hit targets and safe-area inset padding, so that the mobile experience is ergonomic.
25. As a user with `prefers-reduced-motion` enabled, I want all CSS transitions and animations dampened to instant speeds, so that accessibility preferences are respected.
26. As a system administrator, I want a self-contained `.wskin` archive that imports directly through `/admin/skins` with zero core code edits, so that deployment requires no rebuild of WebSpeak.
27. As a skin store curator, I want a valid `skin.json` at the root of the repository matching the archive SHA-256, so that the skin can be registered in the central WebSpeak skin store index.

## Implementation Decisions

### 1. Schema & Package Architecture
- **Schema Selection**: Implement as WebSpeak `schemaVersion: 3` (`packageType: "open-skin"`). Schema v1 and v2 forbid `display: none` and layout restructuring on required controls in the CSS validator; Schema v3 permits layout adjustments, element suppression, and custom component scoping.
- **Workspace Policy**: Opt into WebSpeak Workspace API v1 by declaring `"workspace": { "apiVersion": 1, "mode": "persistent" }` in `manifest.json`. This enables returning visitors and disconnected sessions to retain the workspace shell and server rail rather than reverting to the join landing page.
- **Portability & Zero Core Changes**: The entire skin implementation resides strictly within the skin package. No changes, monkey-patches, or custom components are introduced into WebSpeak's core source (`WebClient.vue`, shared contracts, or host controls).

### 2. OpenAI Visual Identity & Theme Tokens
- **Color Scheme**: Enforce `color-scheme: dark` at `:root`.
- **Palette Definition**:
  - Base / Sidebar Background: `#171717`
  - Surface / Stage / Cards: `#212121`
  - Elevated / Inputs / Hover: `#2f2f2f`
  - Active / Selection: `#383838`
  - Borders: `rgba(255, 255, 255, 0.08)` (subtle) and `rgba(255, 255, 255, 0.16)` (hover/elevated)
  - Typography: `#ececec` (primary), `#b4b4b4` (secondary/muted), `#737373` (subtle/placeholder)
  - OpenAI Accents: `#10a37f` (emerald green) for active/speaking states; `#ef4444` (coral red) for mute/disconnect
  - Primary Buttons: Pure solid `#ffffff` fill with `#0d0d0d` text and `#e5e5e5` hover
- **Prefix Requirement**: All custom CSS variables must strictly use the `--skin-` prefix (`--skin-onyx-*`) to pass WebSpeak's `compileSkinCss` validator.

### 3. Element Hiding Specification
- **Top Header**:
  - Hide `.github-button`, `.qq-button`, `.bilibili-button`, `.changelog-button`, and `.version-badge` via `display: none !important`.
  - Retain gateway status badge, language switcher, skin switcher, and administrative guide button.
- **Homepage Social Section**:
  - Hide `[data-ws-part="home.social-links"] a[href*="github"]`, `a[href*="qq"]`, and `a[href*="bilibili"]`.
  - Retain `[data-ws-part="home.social-links"] a[href="/admin"]` and style it as a clean dark icon button.
- **Modals**:
  - Hide `.qq-modal-backdrop` and `[data-ws-part="home.community-dialog"]`.
- **Decorations**:
  - Hide `[data-ws-part="home.join-card.sonar"]`, `[data-ws-part="home.join-card.waveform"]`, `[data-ws-part="home.visitors.orbit"]`, `[data-ws-part="home.visitors.spark"]`, and `.join-card-effects`.
  - Hide `[data-ws-part="voice.activity.artwork"]` and clear `[data-ws-part="voice.member-panel"]::before` background.

### 4. Typography & Localization Strategy
- **Font Stack**: Use the native modern system sans-serif font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`). Avoid external WOFF2 bundles to eliminate layout shift, font-download delays, and cross-language font rendering discrepancies.
- **No `content.json`**: Do not bundle a `content.json` text override file. WebSpeak automatically handles 100% of interface translations across Chinese, English, German, Russian, and Japanese.
- **Dynamic Brand Adaptability**: Render `home.brand` through typography and sizing without hardcoding static text, allowing any server administrator's configured `brandName` to display cleanly.

### 5. Packaging & Distribution Artifacts
- **Package Container (`.wskin`)**: A standard, unencrypted ZIP file containing:
  - `manifest.json`: Root metadata with `id: "community.onyx"`, `schemaVersion: 3`, `minAppVersion: "0.2.8"`, `entry: "skin.css"`, and `preview: "assets/preview.png"`.
  - `skin.css`: Single stylesheet with flat, scoped selectors (`:root`, `[data-ws-part]`, `[data-ws-page]`).
  - `assets/preview.png`: 640x360 PNG preview graphic.
- **Skin Store Metadata (`skin.json`)**: Placed at repository root containing matching `id`, `version`, `author`, `license`, `minAppVersion`, and `package` object (`ref`, `path`, `sha256`).
- **Build Pipeline**: Self-contained Node.js ESM script (`scripts/build.mjs`) using native `node:zlib` and `node:crypto` to generate `onyx.wskin` and synchronize the 64-character SHA-256 hash in `skin.json`.

## Testing Decisions

### What Makes a Good Test
Tests must verify external behavioral contracts and schema validity rather than private implementation details:
- **Manifest Integrity**: Check that `src/manifest.json` conforms to WebSpeak `schemaVersion: 3` open-skin rules (safe lowercase ID, valid semver, required files declared, valid workspace policy).
- **Metadata Parity**: Assert that root `skin.json` exactly matches `manifest.json` on version, author, license, and that `package.sha256` is the exact hash of the built `onyx.wskin`.
- **ZIP Container Integrity**: Verify that `onyx.wskin` is a valid ZIP archive without ZIP64 or multi-disk extensions, file paths are UTF-8 and relative, CRC32 checks pass, and compressed sizes align.
- **Asset Conformance**: Verify that `assets/preview.png` is valid PNG binary data with dimensions matching 640x360 and size well below the 16 MiB package limit.
- **CSS Selector & Variable Safety**: Parse `src/skin.css` with PostCSS to ensure:
  - No nested style rules.
  - Every selector branch uses a public hook (`:root`, `[data-ws-part]`, or `[data-ws-page]`).
  - All custom variables start with `--skin-`.
  - Overall file size is under the 512 KiB WebSpeak validator limit.
- **Hiding Verification**: Assert that selectors targeting `.github-button`, `.qq-button`, `.bilibili-button`, `.changelog-button`, `.version-badge`, and social promotion links exist and are styled with `display: none !important`.

### Prior Art
- WebSpeak official skin tests: `src/admin/skin-registry.test.ts`, `web/test/skin-store.test.ts`, and `web/test/skin-workspace.test.ts`.

## Out of Scope

- **Custom JavaScript/Wasm**: WebSpeak v3 skins do not execute JavaScript. Authors cannot and should not introduce executable scripts; all logic relies on host widgets and declarative CSS.
- **Light Theme Variant**: Onyx is intentionally dedicated exclusively to OpenAI's signature dark aesthetic; light mode is omitted to keep the experience focused and maintainable.
- **Admin Console Restyling (`/admin/**`)**: WebSpeak strictly isolates the administration backend from skin styling; `/admin` always uses WebSpeak's built-in styles.
- **External Web Font Embedding**: Custom downloadable WOFF2 fonts are excluded in favor of system fonts.

## Further Notes

- The project uses pure standard Node.js libraries (`node:zlib`, `node:crypto`, `node:fs`) for artifact packaging, avoiding unneeded binary dependencies.
- PostCSS and selector parsers are retained as developer dependencies solely to run pre-publish static validation checks before deploying `.wskin`.
