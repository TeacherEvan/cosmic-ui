import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Frame } from "@/components/ui/frame";
import { Window } from "./Window";
import { Dock } from "./Dock";
import { Launchpad } from "./Launchpad";
import { CommandPalette } from "./CommandPalette";
import { useWindows, WINDOW_CONST } from "@/store/windows";

const TOP_FRAME = JSON.parse(
  '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-primary)","fill":"color-mix(in oklab, var(--color-primary), transparent 92%)"},"path":[["M","0","0"],["L","100% - 6","0"],["L","100% - 11","100% - 64"],["L","100% + 0","0% + 29"],["L","0","11"],["L","0","0"]]}]',
);

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () =>
      setT(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  return <span className="font-mono text-xs text-primary/70 tabular-nums">{t}</span>;
}

export function Desktop() {
  const { windows, open } = useWindows();
  const [launchpad, setLaunchpad] = useState(false);
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
      }
      if (e.key === "Escape") {
        setPalette(false);
        setLaunchpad(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className={twMerge([
        "fixed inset-0 overflow-hidden",
        "before:fixed before:inset-0 before:bg-noise before:z-[-2]",
        "after:bg-temper after:opacity-15 after:bg-contain after:fixed after:inset-0 after:blur-xl after:z-[-2] after:pointer-events-none",
      ])}
    >
      {/* ambient space grid */}
      <div className="fixed inset-0 z-[-3] bg-void bg-[linear-gradient(rgba(20,160,230,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(20,160,230,0.05)_1px,transparent_1px)] [background-size:48px_48px]" />

      {/* top HUD bar */}
      <div
        className="fixed inset-x-0 top-0 z-50 h-14 flex items-center px-4 gap-4 border-b border-primary/20 bg-haze/60 backdrop-blur-xl"
        style={{ paddingTop: 0 }}
      >
        <div
          className="relative h-full flex items-center px-3 -ml-4"
          style={{ flex: "0 0 auto" }}
        >
          <Frame paths={TOP_FRAME} className="pointer-events-none" />
          <span className="font-orbitron font-bold text-star tracking-[0.25em] text-shadow-lg text-shadow-primary/40">
            COSMIC OS
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-primary/50">
          <Clock />
          <span className="text-primary/30">·</span>
          <span>{windows.length} window{windows.length === 1 ? "" : "s"}</span>
          <span className="text-primary/30">·</span>
          <span className="text-signal/70">ONLINE</span>
        </div>
        <button
          onClick={() => setPalette(true)}
          className="ms-auto flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-1.5 text-star/70 hover:text-star hover:bg-primary/15 transition-colors font-mono text-[11px]"
        >
          Search Docs…
          <span className="text-primary/40">⌘K</span>
        </button>
      </div>

      {/* window layer */}
      <div className="absolute inset-0" style={{ top: WINDOW_CONST.TOPBAR }}>
        {windows.map((w) => (
          <Window key={w.id} win={w} />
        ))}
        {windows.length === 0 && (
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <div>
              <div className="font-orbitron text-3xl sm:text-5xl text-star tracking-widest text-shadow-lg text-shadow-primary/40 mb-4">
                COSMIC UI
              </div>
              <p className="font-roboto text-star/60 max-w-md mx-auto mb-8">
                A multi-window mission control for out-of-this-world components.
                Open modules from the launchpad — no scrolling required.
              </p>
              <button
                onClick={() => {
                  open("button");
                  open("colors");
                }}
                className="font-orbitron text-sm tracking-widest border border-primary/40 bg-primary/10 text-star px-6 py-2.5 hover:bg-primary/20 transition-colors"
              >
                LAUNCH DEMO
              </button>
            </div>
          </div>
        )}
      </div>

      <Dock onLaunchpad={() => setLaunchpad(true)} />
      <Launchpad open={launchpad} onClose={() => setLaunchpad(false)} />
      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </div>
  );
}
