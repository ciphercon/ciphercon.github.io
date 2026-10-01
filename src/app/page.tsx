import Stage from "@/components/stage/Stage";
import Vlogs from "@/components/sections/Vlogs";
import Credentials from "@/components/sections/Credentials";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      {/* The footer is fixed underneath; main reserves its height so it
          gets revealed (curtain) as the last section scrolls away. */}
      <main id="top" data-surface="dark" className="relative z-[1] mb-[var(--footer-h,60vh)] bg-black">
        <Stage />
        <Vlogs />
        <Credentials />
        <div id="footer-sentinel" aria-hidden="true" />
      </main>
      <Footer />
    </>
  );
}
