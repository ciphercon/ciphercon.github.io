"use client";

import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

/**
 * Demo asset from Rive's public CDN, used here only to prove the wiring
 * works end-to-end. Swap `src` for your own .riv file (exported from the
 * Rive editor) and update `stateMachines` to match its state machine name.
 */
export default function RiveDemo() {
  const { RiveComponent } = useRive({
    src: "https://cdn.rive.app/animations/vehicles.riv",
    stateMachines: "bumpy",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-zinc-900">
      <RiveComponent />
    </div>
  );
}
