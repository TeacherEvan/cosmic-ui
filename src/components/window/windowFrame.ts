import type { Paths } from "@/utils/frame";

/**
 * Four-corner cut window border, sized to its parent by the Frame renderer
 * (ResizeObserver re-fits on drag/resize). Reuses the library's own SVG renderer.
 * Fills use valid raw CSS (color-mix) since Frame assigns these straight to style.fill.
 */
export const WINDOW_FRAME: Paths = [
  {
    show: true,
    style: {
      strokeWidth: "1",
      stroke: "var(--color-primary)",
      fill: "color-mix(in oklab, var(--color-primary), transparent 94%)",
    },
    path: [
      ["M", "20", "0"],
      ["L", "100% - 20", "0"],
      ["L", "100%", "20"],
      ["L", "100%", "100% - 20"],
      ["L", "100% - 20", "100%"],
      ["L", "20", "100%"],
      ["L", "0", "100% - 20"],
      ["L", "0", "20"],
      ["L", "20", "0"],
    ],
  },
  {
    show: true,
    style: {
      strokeWidth: "1",
      stroke: "color-mix(in oklab, var(--color-primary), transparent 65%)",
      fill: "transparent",
    },
    path: [
      ["M", "20", "44"],
      ["L", "100% - 20", "44"],
    ],
  },
  {
    show: true,
    style: {
      strokeWidth: "1",
      stroke: "color-mix(in oklab, var(--color-signal), transparent 50%)",
      fill: "transparent",
    },
    name: "accent-tick",
    path: [
      ["M", "0", "20"],
      ["L", "10", "20"],
      ["L", "20", "10"],
      ["L", "20", "0"],
    ],
  },
];
