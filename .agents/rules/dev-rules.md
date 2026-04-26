---
trigger: always_on
---

# Core Project Rules
1. **Premium Aesthetics**: Every UI must be "App-Ready." Use curated HSL color palettes, modern typography (Inter/Outfit), and glassmorphism. Avoid browser defaults.
2. **Tech Stack**: Use Vite + React + Vanilla CSS. Do not use Tailwind unless explicitly requested.
3. **Mobile-First Architecture**: Design for touch interaction (min 44px hit targets) and small screens first. Use fluid layouts (rem/em/vh/vw).
4. **No Placeholders**: Always generate real visual assets or use professional iconography. No "lorem ipsum."
5. **Modular Architecture**: Never build monolithic pages. Split logic into custom hooks (`src/hooks/`) and UI into sub-components (`src/components/feature-name/`). A single file should rarely exceed 200 lines.
6. **Clean Structure**: Maintain a strict `src/components`, `src/hooks`, `src/services`, and `src/styles` folder hierarchy.
7. **SEO & Performance**: Implement semantic HTML, meta tags, and optimized asset loading by default.
