import { twMerge } from "tailwind-merge";
import { X } from "lucide-react";
import { REGISTRY } from "@/registry";
import { useWindows } from "@/store/windows";

const GROUPS: Array<"Getting Started" | "Components"> = [
  "Getting Started",
  "Components",
];

export function Launchpad({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { open: openWin } = useWindows();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-void/80 backdrop-blur-md p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[80vh] overflow-y-auto border border-primary/30 bg-haze/90 backdrop-blur-xl p-6 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close launchpad"
          className="absolute top-4 right-4 size-8 grid place-items-center text-star/60 hover:text-star hover:bg-primary/15"
        >
          <X className="size-4" />
        </button>
        <div className="font-orbitron text-2xl text-star tracking-widest mb-1">
          LAUNCHPAD
        </div>
        <div className="font-mono text-[11px] text-primary/50 mb-8">
          select a module to open a window
        </div>

        {GROUPS.map((g) => (
          <div key={g} className="mb-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/50 mb-3">
              {g}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {REGISTRY.filter((a) => a.group === g).map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    openWin(a.id);
                    onClose();
                  }}
                  className={twMerge(
                    "group flex flex-col items-center gap-2 py-5 px-2 border border-primary/20 bg-primary/5",
                    "hover:border-signal/60 hover:bg-primary/15 transition-colors text-star/80 hover:text-star",
                  )}
                >
                  <a.Icon className="size-6 text-primary group-hover:text-signal transition-colors" />
                  <span className="font-roboto text-xs text-center leading-tight">
                    {a.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
