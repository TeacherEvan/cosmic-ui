import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { twMerge } from "tailwind-merge";
import { X, Minus, Square } from "lucide-react";
import { Frame } from "@/components/ui/frame";
import { WINDOW_FRAME } from "./windowFrame";
import { useWindows, REGISTRY_MAP, WINDOW_CONST, type WinState } from "@/store/windows";

const HANDLES = [
  "n",
  "s",
  "e",
  "w",
  "ne",
  "nw",
  "se",
  "sw",
] as const;

export function Window({ win }: { win: WinState }) {
  const { focus, close, minimize, toggleMax, move, resize } = useWindows();
  const meta = REGISTRY_MAP[win.id];
  const dragRef = useRef<{ ox: number; oy: number; px: number; py: number } | null>(null);
  const sizeRef = useRef<{ ow: number; oh: number; px: number; py: number; dir: string } | null>(null);

  if (win.minimized) return null;

  const onDragStart = (e: ReactPointerEvent) => {
    if (win.maximized) return;
    focus(win.id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { ox: win.x, oy: win.y, px: e.clientX, py: e.clientY };
  };
  const onDragMove = (e: ReactPointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.px;
    const dy = e.clientY - dragRef.current.py;
    move(
      win.id,
      Math.max(0, dragRef.current.ox + dx),
      Math.max(WINDOW_CONST.TOPBAR, dragRef.current.oy + dy),
    );
  };
  const onDragEnd = () => {
    dragRef.current = null;
  };

  const onResizeStart = (dir: string) => (e: ReactPointerEvent) => {
    if (win.maximized) return;
    e.stopPropagation();
    focus(win.id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    sizeRef.current = { ow: win.w, oh: win.h, px: e.clientX, py: e.clientY, dir };
  };
  const onResizeMove = (e: ReactPointerEvent) => {
    if (!sizeRef.current) return;
    const dx = e.clientX - sizeRef.current.px;
    const dy = e.clientY - sizeRef.current.py;
    const { dir, ow, oh } = sizeRef.current;
    const minW = 320;
    const minH = 240;
    let { x, y, w, h } = { x: win.x, y: win.y, w: ow, h: oh };
    if (dir.includes("e")) w = Math.max(minW, ow + dx);
    if (dir.includes("s")) h = Math.max(minH, oh + dy);
    if (dir.includes("w")) {
      w = Math.max(minW, ow - dx);
      x = win.x - (w - ow);
    }
    if (dir.includes("n")) {
      h = Math.max(minH, oh - dy);
      y = win.y - (h - oh);
    }
    if (dir.includes("w") || dir.includes("n")) move(win.id, x, y);
    resize(win.id, w, h);
  };
  const onResizeEnd = () => {
    sizeRef.current = null;
  };

  const Comp = meta.Component;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const style = win.maximized
    ? {
        left: 8,
        top: WINDOW_CONST.TOPBAR + 8,
        width: "calc(100vw - 16px)",
        height: `calc(100vh - ${WINDOW_CONST.TOPBAR + WINDOW_CONST.DOCK + 16}px)`,
      }
    : isMobile
      ? {
          left: 0,
          top: WINDOW_CONST.TOPBAR,
          width: "100vw",
          height: `calc(100vh - ${WINDOW_CONST.TOPBAR + WINDOW_CONST.DOCK}px)`,
        }
      : { left: win.x, top: win.y, width: win.w, height: win.h };

  return (
    <div
      role="dialog"
      aria-label={meta.title}
      onPointerDown={() => focus(win.id)}
      className="group/win fixed z-10 open-anim"
      style={{ ...style, zIndex: win.z }}
    >
      {/* border uses the library's own Frame renderer */}
      <Frame paths={WINDOW_FRAME} className="pointer-events-none" />
      <div className="absolute inset-0 bg-haze/70 backdrop-blur-xl" />

      {/* titlebar */}
      <div
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
        className="relative h-11 flex items-center gap-3 px-4 cursor-grab active:cursor-grabbing select-none"
      >
        <meta.Icon className="size-4 text-primary shrink-0" />
        <span className="font-orbitron text-sm tracking-widest text-star/90">
          {meta.title}
        </span>
        <span className="font-mono text-[10px] text-primary/50 ms-1">
          {meta.id.toUpperCase()}
        </span>
        <div className="ms-auto flex items-center gap-1.5">
          <button
            aria-label="Minimize"
            onClick={() => minimize(win.id)}
            className="size-7 grid place-items-center text-star/60 hover:text-star hover:bg-primary/15 transition-colors"
          >
            <Minus className="size-3.5" />
          </button>
          <button
            aria-label="Maximize"
            onClick={() => toggleMax(win.id)}
            className="size-7 grid place-items-center text-star/60 hover:text-star hover:bg-primary/15 transition-colors"
          >
            <Square className="size-3" />
          </button>
          <button
            aria-label="Close"
            onClick={() => close(win.id)}
            className="size-7 grid place-items-center text-star/60 hover:text-accent hover:bg-accent/15 transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {/* body (scrollable instead of page scroll) */}
      <div className="absolute inset-x-0 bottom-0 top-11 overflow-y-auto overflow-x-hidden font-roboto text-base">
        <div className="p-1">
          <Comp />
        </div>
      </div>

      {/* resize handles (hidden on mobile/maximized) */}
      {!win.maximized && !isMobile && (
        <>
          {HANDLES.map((h) => (
            <div
              key={h}
              onPointerDown={onResizeStart(h)}
              onPointerMove={onResizeMove}
              onPointerUp={onResizeEnd}
              onPointerCancel={onResizeEnd}
              className={twMerge(
                "absolute z-20",
                h === "n" && "top-0 inset-x-2 h-1.5 cursor-ns-resize",
                h === "s" && "bottom-0 inset-x-2 h-1.5 cursor-ns-resize",
                h === "e" && "right-0 inset-y-2 w-1.5 cursor-ew-resize",
                h === "w" && "left-0 inset-y-2 w-1.5 cursor-ew-resize",
                h === "ne" && "top-0 right-0 size-3 cursor-nesw-resize",
                h === "nw" && "top-0 left-0 size-3 cursor-nwse-resize",
                h === "se" && "bottom-0 right-0 size-3 cursor-nwse-resize",
                h === "sw" && "bottom-0 left-0 size-3 cursor-nesw-resize",
              )}
            />
          ))}
        </>
      )}
    </div>
  );
}
