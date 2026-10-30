# 04: Conversational chat, prompt composer and audio dock

**What to build:** Transform text chat and bottom audio controls into a conversational OpenAI experience with a ChatGPT-style prompt input capsule, flat message stream, and floating control dock.

**Blocked by:** 03: Voice stage, channel navigation and participant cards

**Status:** ready-for-agent

- [ ] Chat panel messages render as a flat, readable conversational stream with clean author/timestamp lines rather than bulky speech balloons.
- [ ] Self messages use a flat elevated dark surface (`#2f2f2f`) with white text; other messages use subtle borders with `#ececec` text.
- [ ] Chat composer is styled as a rounded ChatGPT prompt bar (`#212121`, border radius 12px) with a circular white send button and dark icon.
- [ ] Desktop audio dock renders as a floating dark capsule with subtle borders and blur effects.
- [ ] Microphone and speaker mute states display distinct coral red (`#ef4444`) warning backgrounds and icons.
- [ ] Volume slider hover panels open as dark cards with emerald green slider tracks and clear numeric level indicators.
- [ ] Screen share remote player displays a letterboxed black stage (`#000000`) and floating control pills.
- [ ] Automated tests verify chat and dock selector rules, variable prefixing, and contrast hierarchy.
