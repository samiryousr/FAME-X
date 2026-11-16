# FAME-X Enterprise Engineering Standards

This document establishes the official engineering, architecture, security, and UI/UX standards for the FAME-X platform. All codebase modifications must strictly adhere to these 6 pillars.

---

## Pillar 1: Clean Architecture & Modular Components
- **Single Responsibility Principle (SRP)**: No component should exceed 250-300 lines of code. If a component grows beyond this, extract sub-components, custom hooks, or utility functions.
- **No "God Files"**: Separate UI rendering, data services, and business logic.
- **Directory Structure**:
  - `components/` for shared UI.
  - `components/admin/` for admin dashboard modules.
  - `lib/` for client/server services and Firebase/Cloudinary SDKs.
  - `app/api/` for zero-trust, authenticated server endpoints.

---

## Pillar 2: Security & OWASP Top 10 Standards
- **Zero-Trust Backend**: Every admin mutation endpoint (`/api/...`) must authenticate the user via Firebase ID tokens and enforce strict origin matching (`originHost === host`).
- **Resilient Verification**: Token verification must gracefully handle network latency/timeouts with secure local cryptographic JWT validation as a fallback.
- **Rate Limiting**: All sensitive endpoints must enforce IP/UID rate limiting (Upstash Redis or in-memory fallback) to prevent abuse and DDoS.
- **Input Sanitization**: File uploads must strictly validate MIME types (whitelist: AVIF, JPEG, PNG, WebP) and maximum payload sizes (<= 4MB).
- **No Secret Leaks**: Never expose private API keys (`CLOUDINARY_API_SECRET`, service account keys) to client-side code (`NEXT_PUBLIC_`).

---

## Pillar 3: UI/UX & Responsive Cyber-Aesthetic
- **Mobile-First Responsiveness**: All layouts must be thoroughly verified on mobile viewports (375px - 430px) as well as desktop viewports.
- **Unified Design Tokens**: Consistent use of FAME-X colors:
  - Neon Accent: `#a6f45d`
  - Deep Dark Surfaces: `#070d08`, `#0b140d`, `#111913`
  - Subtle Borders: `#a6f45d]/15` to `#a6f45d]/30`
- **60 FPS Performance**: Use CSS transforms and opacity for animations. Avoid triggering layout reflows during scroll or hover.

---

## Pillar 4: Algorithms, Optimization & Memory Safety
- **Clean Event Cleanup**: Every `addEventListener`, `ResizeObserver`, `IntersectionObserver`, and `setInterval` MUST be returned in the `useEffect` cleanup return function to prevent memory leaks.
- **Efficient Filtering**: Use O(1) Hash Maps and indexed collections for category lookups rather than repeated nested array scans.
- **Asset Optimization**: Deliver images through CDN with auto-format and auto-quality (`f_auto, q_auto`).

---

## Pillar 5: Code Quality & Enterprise TypeScript
- **Strict Typing**: Never use `any`. Always provide explicit TypeScript types or interfaces.
- **No Unused Code**: Maintain 0 ESLint warnings and 0 TypeScript errors across the repository.
- **Atomic Commits**: Keep changes targeted, cohesive, and easily reviewable.

---

## Pillar 6: User-Centric Admin Workflows
- **Interactive Productivity**: Admin interfaces must provide real-time search, category filtering, immediate status toggling (Quick Toggles), and custom confirmation dialogs.
