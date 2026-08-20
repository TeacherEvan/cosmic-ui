import {
  Rocket,
  MousePointerClick,
  Palette,
  Frame as FrameIcon,
  Menu as MenuIcon,
  TriangleAlert,
  Rows3,
  Square,
  PanelsTopLeft,
  Bell,
  TextCursorInput,
  AlignLeft,
  ToggleRight,
  CircleDot,
  CheckSquare,
  BarChart3,
  ListFilter,
  type LucideIcon,
} from "lucide-react";

import Home from "@/pages/home";
import Button from "@/pages/button";
import Colors from "@/pages/colors";
import FramePage from "@/pages/frame";
import Menu from "@/pages/menu";
import Alert from "@/pages/alert";
import Accordion from "@/pages/accordion";
import Dialog from "@/pages/dialog";
import Tabs from "@/pages/tabs";
import Toast from "@/pages/toast";
import Input from "@/pages/input";
import Textarea from "@/pages/textarea";
import Switch from "@/pages/switch";
import RadioGroup from "@/pages/radio-group";
import Checkbox from "@/pages/checkbox";
import Chart from "@/pages/chart";
import Combobox from "@/pages/combobox";
import Introduction from "@/pages/introduction";
import HowToUse from "@/pages/how-to-use";

export type AppId =
  | "home"
  | "introduction"
  | "how-to-use"
  | "button"
  | "colors"
  | "frame"
  | "menu"
  | "alert"
  | "accordion"
  | "dialog"
  | "tabs"
  | "toast"
  | "input"
  | "textarea"
  | "switch"
  | "radio-group"
  | "checkbox"
  | "chart"
  | "combobox";

export interface AppMeta {
  id: AppId;
  title: string;
  Icon: LucideIcon;
  Component: React.ComponentType;
  /** launchpad grouping */
  group: "Getting Started" | "Components";
}

export const REGISTRY: AppMeta[] = [
  { id: "home", title: "Mission Control", Icon: Rocket, Component: Home, group: "Getting Started" },
  { id: "introduction", title: "Introduction", Icon: FrameIcon, Component: Introduction, group: "Getting Started" },
  { id: "how-to-use", title: "How to Use", Icon: ListFilter, Component: HowToUse, group: "Getting Started" },
  { id: "button", title: "Button", Icon: MousePointerClick, Component: Button, group: "Components" },
  { id: "colors", title: "Colors", Icon: Palette, Component: Colors, group: "Components" },
  { id: "frame", title: "Frame", Icon: FrameIcon, Component: FramePage, group: "Components" },
  { id: "menu", title: "Menu", Icon: MenuIcon, Component: Menu, group: "Components" },
  { id: "alert", title: "Alert", Icon: TriangleAlert, Component: Alert, group: "Components" },
  { id: "accordion", title: "Accordion", Icon: Rows3, Component: Accordion, group: "Components" },
  { id: "dialog", title: "Dialog", Icon: Square, Component: Dialog, group: "Components" },
  { id: "tabs", title: "Tabs", Icon: PanelsTopLeft, Component: Tabs, group: "Components" },
  { id: "toast", title: "Toast", Icon: Bell, Component: Toast, group: "Components" },
  { id: "input", title: "Input", Icon: TextCursorInput, Component: Input, group: "Components" },
  { id: "textarea", title: "Textarea", Icon: AlignLeft, Component: Textarea, group: "Components" },
  { id: "switch", title: "Switch", Icon: ToggleRight, Component: Switch, group: "Components" },
  { id: "radio-group", title: "Radio Group", Icon: CircleDot, Component: RadioGroup, group: "Components" },
  { id: "checkbox", title: "Checkbox", Icon: CheckSquare, Component: Checkbox, group: "Components" },
  { id: "chart", title: "Chart", Icon: BarChart3, Component: Chart, group: "Components" },
  { id: "combobox", title: "Combobox", Icon: ListFilter, Component: Combobox, group: "Components" },
];

export const REGISTRY_MAP: Record<AppId, AppMeta> = Object.fromEntries(
  REGISTRY.map((a) => [a.id, a]),
) as Record<AppId, AppMeta>;
