# Cosmic UI

Create interfaces that feel out of this world. Futuristic components for modern apps. Free and open source.

![hero](public/preview.jpeg)

## Documentation

Visit https://cosmic-ui.com/docs to view the documentation.

## Navigation model (Cosmic OS)

The docs site runs as a **Cosmic OS** desktop rather than a scrolling page. Each component opens as its own draggable, resizable window:

- **Dock** (bottom) — launch and re-focus open windows.
- **Launchpad** — grid of every component; click a tile to open its window.
- **Command palette** — press <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> to search and open any component.
- Windows focus on click, minimize, and toggle full-screen; on mobile they become docked full-width sheets.

Source lives in `src/store/windows.tsx` (window manager) and `src/components/window/*` (shell + windows).

## Local development

```bash
yarn install
yarn dev        # start the dev server (http://localhost:5173)
yarn build      # type-check + production build to dist/
yarn lint       # eslint
```

## License

Licensed under the [MIT license](https://github.com/rizkimuhammada/cosmic-ui/blob/main/LICENSE.md).
