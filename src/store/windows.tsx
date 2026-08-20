import {
  createContext,
  useContext,
  useReducer,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { REGISTRY_MAP, type AppId } from "@/registry";

export interface WinState {
  id: AppId;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

interface State {
  windows: WinState[];
  topZ: number;
}

type Action =
  | { type: "open"; id: AppId }
  | { type: "close"; id: AppId }
  | { type: "focus"; id: AppId }
  | { type: "minimize"; id: AppId }
  | { type: "toggleMax"; id: AppId }
  | { type: "move"; id: AppId; x: number; y: number }
  | { type: "resize"; id: AppId; w: number; h: number };

const DEFAULT_W = 560;
const DEFAULT_H = 520;
const TOPBAR = 56;
const DOCK = 76;

function nextPos(count: number) {
  // cascade new windows so they don't stack perfectly
  const offset = (count % 6) * 34;
  return {
    x: 90 + offset,
    y: TOPBAR + 24 + offset,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "open": {
      const existing = state.windows.find((w) => w.id === action.id);
      if (existing) {
        return {
          ...state,
          topZ: state.topZ + 1,
          windows: state.windows.map((w) =>
            w.id === action.id
              ? { ...w, minimized: false, z: state.topZ + 1 }
              : w,
          ),
        };
      }
      const z = state.topZ + 1;
      const { x, y } = nextPos(state.windows.length);
      const win: WinState = {
        id: action.id,
        x,
        y,
        w: DEFAULT_W,
        h: DEFAULT_H,
        z,
        minimized: false,
        maximized: false,
      };
      return { windows: [...state.windows, win], topZ: z };
    }
    case "close":
      return { ...state, windows: state.windows.filter((w) => w.id !== action.id) };
    case "focus": {
      const z = state.topZ + 1;
      return {
        ...state,
        topZ: z,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, z, minimized: false } : w,
        ),
      };
    }
    case "minimize":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: true } : w,
        ),
      };
    case "toggleMax": {
      const z = state.topZ + 1;
      return {
        ...state,
        topZ: z,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, maximized: !w.maximized, minimized: false, z }
            : w,
        ),
      };
    }
    case "move":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, x: action.x, y: action.y } : w,
        ),
      };
    case "resize":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, w: action.w, h: action.h } : w,
        ),
      };
    default:
      return state;
  }
}

interface Ctx {
  windows: WinState[];
  open: (id: AppId) => void;
  close: (id: AppId) => void;
  focus: (id: AppId) => void;
  minimize: (id: AppId) => void;
  toggleMax: (id: AppId) => void;
  move: (id: AppId, x: number, y: number) => void;
  resize: (id: AppId, w: number, h: number) => void;
}

const WindowCtx = createContext<Ctx | null>(null);

export function WindowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    windows: [],
    topZ: 10,
  });
  const zRef = useRef(state.topZ);
  zRef.current = state.topZ;

  const open = useCallback((id: AppId) => dispatch({ type: "open", id }), []);
  const close = useCallback((id: AppId) => dispatch({ type: "close", id }), []);
  const focus = useCallback((id: AppId) => dispatch({ type: "focus", id }), []);
  const minimize = useCallback((id: AppId) => dispatch({ type: "minimize", id }), []);
  const toggleMax = useCallback((id: AppId) => dispatch({ type: "toggleMax", id }), []);
  const move = useCallback((id: AppId, x: number, y: number) => dispatch({ type: "move", id, x, y }), []);
  const resize = useCallback((id: AppId, w: number, h: number) => dispatch({ type: "resize", id, w, h }), []);

  return (
    <WindowCtx.Provider value={{ windows: state.windows, open, close, focus, minimize, toggleMax, move, resize }}>
      {children}
    </WindowCtx.Provider>
  );
}

export function useWindows() {
  const ctx = useContext(WindowCtx);
  if (!ctx) throw new Error("useWindows must be used within WindowProvider");
  return ctx;
}

export const WINDOW_CONST = { TOPBAR, DOCK, DEFAULT_W, DEFAULT_H };
export { REGISTRY_MAP };
