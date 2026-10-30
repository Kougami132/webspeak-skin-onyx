# 05: Integrated modals, disconnect capsule and distribution parity

**What to build:** Complete the skin with unified dark dialog modals, floating reconnect capsule for persistent workspace mode, responsive mobile layout, reduced-motion accessibility, and 100% distribution-ready archive parity.

**Blocked by:** 04: Conversational chat, prompt composer and audio dock

**Status:** completed

- [x] Password dialogs (channel and server), audio settings modal, identity import modal, and favorite server modal render with dark matte styling (`#212121`), subtle borders, and blurred backdrops.
- [x] Dropdown select menus (audio devices, relays) render with dark options, clear hover states, and smooth open transitions.
- [x] Persistent workspace disconnect state displays as a top-centered floating capsule (`voice.connection-status`) with a single-click reconnect action.
- [x] Mobile viewport (width < 740px) 4-tab navigation bar provides touch-friendly 44px hit targets and safe area insets.
- [x] Accessibility rule `prefers-reduced-motion: reduce` dampens all transitions and animations to instant.
- [x] Demo page (`[data-ws-page="demo"]`) supports full dark theme styling.
- [x] Build script generates `onyx.wskin` and syncs SHA-256 in `skin.json`.
- [x] Full automated test suite passes green with timeout protection, verifying all schema, checksum, and selector constraints.
