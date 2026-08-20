import { twMerge } from "tailwind-merge";
import { LayoutGrid, Github } from "lucide-react";
import { useWindows, REGISTRY_MAP } from "@/store/windows";

export function Dock({
  onLaunchpad,
}: {
  onLaunchpad: () => void;
}) {
  const { windows, focus, minimize } = useWindows();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] h-16 flex items-center justify-center px-4"
      style={{ paddingBottom: 8 }}
    >
      <div className="relative flex items-center gap-2 px-3 h-14 border border-primary/30 bg-haze/80 backdrop-blur-xl shadow-lg shadow-primary/10">
        {/* launchpad */}
        <button
          onClick={onLaunchpad}
          aria-label="Launchpad"
          className="size-11 grid place-items-center text-primary hover:bg-primary/15 transition-colors"
        >
          <LayoutGrid className="size-5" />
        </button>

        <span className="w-px h-7 bg-primary/20" />

        {/* open windows */}
        <div className="flex items-center gap-1.5 max-w-[60vw] overflow-x-auto">
          {windows.length === 0 && (
            <span className="font-mono text-[11px] text-primary/40 px-2">
              no windows · open one from launchpad
            </span>
          )}
          {windows.map((w) => {
            const meta = REGISTRY_MAP[w.id];
            const active = !w.minimized;
            return (
              <button
                key={w.id}
                onClick={() => {
                  if (w.minimized) {
                    focus(w.id);
                  } else {
                    minimize(w.id);
                  }
                }}
                title={meta.title}
                className={twMerge(
                  "relative size-11 grid place-items-center border transition-colors",
                  active
                    ? "border-signal/60 bg-primary/15 text-signal"
                    : "border-primary/20 bg-transparent text-star/60 hover:text-star",
                )}
              >
                <meta.Icon className="size-5" />
              </button>
            );
          })}
        </div>

        <span className="w-px h-7 bg-primary/20" />

        <a
          href="https://github.com/rizkimuhammada/cosmic-ui"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="size-11 grid place-items-center text-star/70 hover:text-star hover:bg-primary/15 transition-colors"
        >
          <Github className="size-5" />
        </a>
      </div>
    </div>
  );
}
