export const HERO_PHOTO = "/hero-cutout.webp";

let ready: Promise<void> | null = null;

/** Resolves once the hero photo has downloaded and decoded (or failed). */
export function heroPhotoReady(): Promise<void> {
  if (!ready) {
    const im = new Image();
    im.src = HERO_PHOTO;
    ready = im.decode().catch(() => undefined);
  }
  return ready;
}
