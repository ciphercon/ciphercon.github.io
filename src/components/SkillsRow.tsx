const TOOLS = ["Figma", "Claude", "Photoshop", "Illustrator"];

export default function SkillsRow() {
  return (
    <div className="flex flex-wrap gap-3">
      {TOOLS.map((tool) => (
        <span
          key={tool}
          className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-widest text-foreground/80"
        >
          {tool}
        </span>
      ))}
    </div>
  );
}
