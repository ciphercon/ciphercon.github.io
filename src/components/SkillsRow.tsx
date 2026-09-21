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
