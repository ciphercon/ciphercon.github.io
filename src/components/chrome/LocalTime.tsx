"use client";

import { useEffect, useState } from "react";

/** Live wall-clock time in a given IANA zone, e.g. "1:17 PM". */
export default function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 10_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  // Rendered client-side only so server and client markup always match.
  return <span suppressHydrationWarning>{time ?? "--:-- --"}</span>;
}
