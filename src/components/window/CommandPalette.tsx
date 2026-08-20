import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Search } from "lucide-react";
import { REGISTRY } from "@/registry";
import { useWindows } from "@/store/windows";

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { open: openWin } = useWindows();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  if (!open) return null;

  const results = REGISTRY.filter((a) =>
    a.title.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-start pt-[18vh] bg-void/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl border border-primary/30 bg-haze/95 backdrop-blur-xl shadow-2xl shadow-primary/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-primary/20">
          <Search className="size-4 text-primary/70" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search modules…"
            className="flex-1 bg-transparent outline-none font-roboto text-sm text-star placeholder:text-star/30"
          />
          <span className="font-mono text-[10px] text-primary/40">⌘K</span>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 && (
            <div className="px-4 py-6 text-center font-mono text-xs text-star/40">
              no module matches “{q}”
            </div>
          )}
          {results.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                openWin(a.id);
                onClose();
              }}
              className={twMerge(
                "w-full flex items-center gap-3 px-4 py-2.5 text-left",
                "hover:bg-primary/15 transition-colors text-star/80 hover:text-star",
              )}
            >
              <a.Icon className="size-4 text-primary" />
              <span className="font-roboto text-sm">{a.title}</span>
              <span className="ms-auto font-mono text-[10px] text-primary/40 uppercase">
                {a.group}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
