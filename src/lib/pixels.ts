/**
 * Block-grid helpers for the pixel transitions (loader dissolve, scene
 * wipes, image reveals). A grid is a list of cells, each with a threshold
 * `t` in [0, 1]: at progress p a cell is "on" once p ≥ t. The order function
 * decides the shape of the wave (sweep, radial…), a seeded PRNG adds noise.
 */

export type Cell = { x: number; y: number; w: number; h: number; t: number; r: number };

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type OrderFn = (col: number, row: number, cols: number, rows: number, rand: number) => number;

/** Right → left sweep with a noisy, scattered frontier. */
export const sweepFromRight =
  (noise = 0.35): OrderFn =>
  (c, _r, cols, _rows, rand) =>
    (1 - (c + 0.5) / cols) * (1 - noise) + rand * noise;

/** Left → right sweep. */
export const sweepFromLeft =
  (noise = 0.35): OrderFn =>
  (c, _r, cols, _rows, rand) =>
    ((c + 0.5) / cols) * (1 - noise) + rand * noise;

/** Radial from the centre outwards. */
export const fromCenter =
  (noise = 0.3): OrderFn =>
  (c, r, cols, rows, rand) => {
    const dx = (c + 0.5) / cols - 0.5;
    const dy = ((r + 0.5) / rows - 0.5) * (rows / cols);
    const max = Math.hypot(0.5, 0.5 * (rows / cols));
    return (Math.hypot(dx, dy) / max) * (1 - noise) + rand * noise;
  };

/** Bottom → top (used by the edge bands between normal-flow sections). */
export const sweepFromBottom =
  (noise = 0.4): OrderFn =>
  (_c, r, _cols, rows, rand) =>
    (1 - (r + 0.5) / rows) * (1 - noise) + rand * noise;

export function buildCells(
  width: number,
  height: number,
  size: number,
  order: OrderFn,
  seed = 1
): Cell[] {
  const rand = mulberry32(seed);
  const cols = Math.max(1, Math.ceil(width / size));
  const rows = Math.max(1, Math.ceil(height / size));
  const cells: Cell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * size;
      const y = r * size;
      const rr = rand();
      cells.push({
        x,
        y,
        w: Math.min(size, width - x),
        h: Math.min(size, height - y),
        t: Math.min(0.999, Math.max(0, order(c, r, cols, rows, rr))),
        r: rand(),
      });
    }
  }
  return cells;
}

/**
 * CSS `clip-path: path(...)` string covering every cell that is on at
 * progress p (or off, when `invert`). Horizontal neighbours are merged into
 * runs to keep the path short.
 */
export function cellsToPath(cells: Cell[], p: number, invert = false): string {
  let d = "";
  let runX = 0;
  let runY = -1;
  let runW = 0;
  let runH = 0;
  const flush = () => {
    if (runW > 0) d += `M${runX} ${runY}h${runW}v${runH}h${-runW}Z`;
    runW = 0;
  };
  for (const c of cells) {
    const on = (p >= c.t) !== invert;
    if (!on) {
      flush();
      continue;
    }
    if (runW > 0 && c.y === runY && c.x === runX + runW) {
      runW += c.w;
    } else {
      flush();
      runX = c.x;
      runY = c.y;
      runW = c.w;
      runH = c.h;
    }
  }
  flush();
  // An empty path would clip nothing out in some engines; use a zero rect.
  return d ? `path('${d}')` : "path('M0 0h0v0h0Z')";
}
