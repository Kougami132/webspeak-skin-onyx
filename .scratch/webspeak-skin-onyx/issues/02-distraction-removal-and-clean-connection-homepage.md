# 02: Distraction removal and clean connection homepage

**What to build:** Deliver a distraction-free, professional OpenAI-styled connection homepage by suppressing external project/community links, removing flashy gaming animations, and restyling the login card with high-contrast primary actions.

**Blocked by:** 01: Core packaging pipeline and Onyx dark scaffold

**Status:** completed

- [x] Top header buttons for GitHub (`.github-button`), QQ group (`.qq-button`), Bilibili (`.bilibili-button`), changelog (`.changelog-button`), and version badge (`.version-badge`) are hidden via `display: none !important`.
- [x] Homepage social links section suppresses external promotion links while retaining and styling the administrative console link (`a[href="/admin"]`).
- [x] QQ community modal backdrop and popup dialog are suppressed.
- [x] Distracting gaming animations (sonar waves, waveform bars, visitor counter orbit/sparks) are hidden.
- [x] Primary connect button uses high-contrast solid white background with dark text (`#ffffff` / `#0d0d0d`) and subtle hover transition.
- [x] Form input fields use dark charcoal backgrounds (`#2f2f2f`) with subtle borders and clear focus feedback.
- [x] Quick servers and recent server history list items render with clean micro-borders and subtle hover highlights.
- [x] Automated tests verify that all suppression selectors and homepage visual tokens are present and syntactically valid.
