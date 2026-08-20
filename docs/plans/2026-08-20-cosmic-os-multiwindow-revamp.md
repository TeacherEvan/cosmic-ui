# Cosmic OS — Multi-Window Docs Revamp

> **For Hermes:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace cosmic-ui's scroll-based docs navigation with a "mission control" desktop where every component opens as a draggable/resizable HUD window — no page-scrolling to navigate.

**Architecture:** Keep the React 19 + Vite + Tailwind v4 stack and the existing component pages verbatim. Introduce a window manager (context + reducer) and a desktop shell. The library's signature `Frame` SVG renderer (`src/utils/frame.ts`) is reused as window chrome so every floating window wears the same angular cut-corner border as the header. Navigation = open/focus/minimize windows via a Dock + Launchpad + ⌘K command palette, not vertical scroll.

**Tech Stack:** React 19, react-router 7 (kept for root), @zag-js/* (kept), the existing `Frame`/`utils/frame.ts` renderer, Tailwind v4, lucide-react, GSAP/Motion (available, used sparingly for window open).

**Effort:** ~1.5 weeks | **Surfaces touched:** 1 app shell + 1 new window system + 18 pages (rendered inside windows, unchanged) | **New tables:** 0 | **Feature flag:** none (full revamp)

---

## Design Tokens (locked)

- Palette: `--void #05080F`, `--primary #14A0E6`, `--accent #CA4122`, `--haze #16222F`, `--star #E8F1FF`, `--signal #5BE3C9`
- Type: Orbitron (window chrome + hero only), Roboto (body), IBM Plex Mono (HUD readouts/IDs)
- Signature: existing `Frame` angular renderer used as window border (4-corner cut paths)
- Motion: window open = scale/blur-in (respect `prefers-reduced-motion`); drag/resize = pointer events, no animation

---

## Milestone Timeline

### Milestone 1: Window store + Desktop shell (Day 1–2)
State container + desktop canvas. No component pages yet — just the deck, background, and HUD readout.

- `src/store/windows.tsx` — context + reducer (open, close, focus, minimize, toggleMax, move, resize, reorder z)
- `src/components/window/Desktop.tsx` — fixed deck, cosmic bg (reuse noise/temper/Frame), corner HUD readout (clock, open count, FPS passthrough)
- `src/App.tsx` — rewrite: render `<Desktop/>` + window layer + `<Dock/>`; drop the old scroll Outlet layout
- `src/router/index.tsx` — simplify to single `/` -> `<App/>`; keep page imports for the registry

### Milestone 2: Window component (Day 2–3)
The floating HUD panel. Reuses `Frame` for border.

- `src/components/window/Window.tsx` — drag (pointer), 8 resize handles, focus-on-pointer-down (z-order), min/max/close buttons, titlebar in Orbitron, scrollable body
- `src/components/window/windowFrame.ts` — 4-corner cut `Paths` JSON for `Frame`
- `src/registry.tsx` — app id -> { title, icon, component } for all 18 pages

### Milestone 3: Navigation surfaces (Day 3–4)
Multi-window navigation replacing scroll.

- `src/components/window/Dock.tsx` — bottom-center dock: Launchpad toggle + open-window chips + minimize/restore
- `src/components/window/Launchpad.tsx` — grid of app tiles (icons, not 01/02/03); opens windows
- `src/components/window/CommandPalette.tsx` — ⌘K / Search-Docs button opens a palette that launches windows
- `src/components/window/Boot.tsx` — Home route becomes a "boot/launchpad" screen (mission control), not a scrolling landing

### Milestone 4: Wire pages + polish (Day 4–5)
- Render each existing page component inside a `Window` body (scrollable) via registry
- Mobile: windows become full-width sheets; Dock becomes bottom sheet
- Reduced-motion: disable open animation; keep drag/resize
- `npm run lint` + `npm run typecheck` + `npm run build` green

---

## Data Flow

### Open a component (window launch)
User                  Dock/Launchpad/Palette        WindowStore              Desktop
  │                         │                          │                       │
  ├─ click "Button" ───────▶│                          │                       │
  │                         ├─ open('button') ────────▶│                       │
  │                         │                          ├─ push window w/ z ───▶│
  │                         │                          │                       ├─ render <Window>
  │                         │                          │                       │   └─ <Registry.button.component/>
  │                         │                          │                       │

### Focus / z-order (pointer down)
Window ── onPointerDown ──▶ store.focus(id) ──▶ bump z-index ──▶ Desktop re-renders order

### Resize / move (pointer drag)
Window ── pointermove ──▶ store.move(id,x,y) / store.resize(id,w,h) ──▶ local state (throttled) ──▶ re-render

---

## Mockups

### A · Desktop with two windows open + Dock
┌───────────────────────────────────────────────────────────────────────┐
│  COSMIC OS            [sys] 14:02 · 2 windows · 60fps        ⌘K search │  <- top HUD bar (Frame chrome)
│                                                                         │
│        ┌─ Button ─┐                          ┌─ Colors ──────────────┐  │
│        │ preview   │                         │  swatch grid          │  │
│        │ [code]    │                         │  primary accent ...   │  │
│        └───────────┘                          └───────────────────────┘  │
│                                                                         │
│   ·················· starfield/parallax bg ···························· │
│                                                                         │
│              [◎ Launchpad]  [Button] [Colors]              <- Dock       │
└───────────────────────────────────────────────────────────────────────┘

### B · Launchpad (navigation = grid, not scroll list)
┌──────────────────────────────────────────────────────────────────┐
│  LAUNCHPAD                                                        │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                     │
│  │ ⟳  │ │ ▦  │ │ ☰  │ │ ◉  │ │ ▤  │ │ ⌨  │  ... 18 tiles ...  │
│  │Home│ │Btn │ │Menu│ │Clr │ │Tab │ │In  │                     │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘                     │
│  (icons + label; click opens a window; no 01/02/03 numbering)   │
└──────────────────────────────────────────────────────────────────┘

---

## Risk Table

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `Frame` renderer path math breaks on 4-corner window border | Medium | High | Author `windowFrame.ts` paths; verify border renders + resize re-fits via ResizeObserver (renderer already observes parent) |
| Window drag/resize janky on mobile | Medium | Medium | Pointer events + touch-action:none; mobile = full-width sheet |
| 18 pages assume `Wrapper`/Outlet context | Low | Medium | Render pages inside a plain scroll container; registry imports components directly, no Outlet |
| Build/type break from removing `Outlet` | Medium | High | Keep `react-router` root; App no longer uses `<Outlet/>`; typecheck after |
| Reduced-motion users get motion sickness | Low | Medium | Gate open animation behind `prefers-reduced-motion` |

---

## Verify Visual & Transform Claims Against Live Source

- **Window border = `Frame` renderer:** `Frame` renders SVG sized to parent and re-fits on ResizeObserver (`utils/frame.ts`). Window must give `Frame` a `position:relative` sized parent and pass 4-corner cut `Paths`. Assert the `Frame` element + class in test, not computed transform (jsdom can't read SVG transforms).
- **Drag z-order:** focus on `pointerdown` must set highest z-index in store; verify store state, not pixels.
- **Reduced motion:** open animation wrapped in `@media (prefers-reduced-motion: no-preference)`; verify CSS rule present via grep.

## Verify Build (mechanical gate)

- `npm run lint` → 0 errors
- `npm run typecheck` (`tsc -b`) → 0 errors
- `npm run build` (vite) → succeeds, emits dist/
