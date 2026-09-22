import GlitchText from "./GlitchText";

const TOOLS = [
  "Threat Hunting",
  "Detection Engineering",
  "Penetration Testing",
  "Cloud Security",
  "Azure Sentinel",
  "Splunk",
  "Carbon Black",
  "MITRE ATT&CK",
  "Python",
  "KQL",
];

export default function SkillsRow() {
  return (
    <div className="flex flex-wrap gap-3">
      {TOOLS.map((tool, i) => (
        <span
          key={tool}
          className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-widest text-foreground/80"
        >
          <GlitchText
            text={tool}
            startDelay={i * 80}
            tickMs={20}
            lockEvery={1}
            charsPerTick={2}
          />
        </span>
      ))}
    </div>
  );
}
