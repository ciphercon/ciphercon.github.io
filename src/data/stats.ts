// Stat + tool cards for the lime checkerboard grid. Positions are grid cells
// (col, row) on a 7×3 board; filled cells follow a checkerboard so every
// card touches its neighbours only at the corners.

export type IconSource =
  | { kind: "image"; src: string }
  | { kind: "glyph"; name: "windows" | "chevron" | "mark" }
  | { kind: "text"; text: string };

export type GridCard =
  | { type: "stat"; col: number; row: number; label: string; value: string }
  | { type: "tool"; col: number; row: number; label: string; icon: IconSource }
  | { type: "logo"; col: number; row: number };

export const STATS_GRID_COLS = 7;

export const STATS_GRID: GridCard[] = [
  { type: "stat", col: 0, row: 0, label: "Years of exp", value: "8+" },
  { type: "tool", col: 2, row: 0, label: "Defender XDR", icon: { kind: "glyph", name: "windows" } },
  { type: "stat", col: 4, row: 0, label: "YouTube views", value: "15M+" },
  { type: "tool", col: 6, row: 0, label: "Python", icon: { kind: "image", src: "/logos/certs/python.svg" } },

  { type: "stat", col: 1, row: 1, label: "Certifications", value: "23+" },
  { type: "stat", col: 3, row: 1, label: "Publications", value: "3+" },
  { type: "tool", col: 5, row: 1, label: "Splunk", icon: { kind: "glyph", name: "chevron" } },

  { type: "logo", col: 0, row: 2 },
  { type: "stat", col: 2, row: 2, label: "AI projects", value: "10+" },
  { type: "tool", col: 4, row: 2, label: "Sentinel", icon: { kind: "image", src: "/logos/certs/azure.svg" } },
  { type: "tool", col: 6, row: 2, label: "KQL", icon: { kind: "text", text: "KQL" } },
];
