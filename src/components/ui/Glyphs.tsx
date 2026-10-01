/** Small vector glyphs. All use currentColor. */

type SvgProps = { className?: string };

/** Site mark: an angular shield around a chevron "A". */
export function Mark({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M12 1.6 20.6 5v7.2L12 22.6 3.4 12.2V5Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="miter"
      />
      <path d="M7.4 16 12 7.3 16.6 16" stroke="currentColor" strokeWidth="2.1" />
    </svg>
  );
}

function Bitmap({ rows, className }: { rows: string[]; className?: string }) {
  const h = rows.length;
  const w = rows[0].length;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {rows.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "#" ? (
            <rect key={`${x}-${y}`} x={x + 0.12} y={y + 0.12} width={0.76} height={0.76} fill="currentColor" />
          ) : null
        )
      )}
    </svg>
  );
}

export function PixelArrow({ className }: SvgProps) {
  return (
    <Bitmap
      className={className}
      rows={["....#..", ".....#.", "#######", ".....#.", "....#.."]}
    />
  );
}

export function PixelArrowDown({ className }: SvgProps) {
  return (
    <Bitmap className={className} rows={["..#..", "..#..", "#.#.#", ".###.", "..#.."]} />
  );
}

export function ArrowUpRight({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="none">
      <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function DownloadIcon({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="none">
      <path d="M8 2v8.5M4.5 7 8 10.5 11.5 7M3 13.5h10" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
