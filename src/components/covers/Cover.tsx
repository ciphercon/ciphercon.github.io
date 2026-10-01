import { useId } from "react";
import type { CoverVariant } from "@/data/projects";

/**
 * Generated cover art for projects that have no screenshots. Each variant
 * is a small UI mock-up themed to the project, on a shared dark → teal
 * glow background (echoing the device-shot style of the reference).
 */

const W = 400;
const H = 290;
const C = {
  cyan: "#5ef2ff",
  green: "#6bff9e",
  white: "#e6f7ff",
  dim: "rgba(230,247,255,0.16)",
  faint: "rgba(230,247,255,0.07)",
  red: "#ff5a5f",
  amber: "#ffb547",
  violet: "#a98bff",
};
const MONO = { fontFamily: "var(--font-dm-mono), monospace" } as const;
const HEAD = { fontFamily: "var(--font-rajdhani), sans-serif", fontWeight: 700 } as const;

function Bar({ x, y, w, h = 6, fill = C.dim, r = 3 }: { x: number; y: number; w: number; h?: number; fill?: string; r?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} />;
}

function Window({ x, y, w, h, title }: { x: number; y: number; w: number; h: number; title?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="rgba(8,20,32,0.82)" stroke="rgba(94,242,255,0.28)" />
      <circle cx={x + 12} cy={y + 11} r={2.6} fill={C.red} opacity={0.85} />
      <circle cx={x + 21} cy={y + 11} r={2.6} fill={C.amber} opacity={0.85} />
      <circle cx={x + 30} cy={y + 11} r={2.6} fill={C.green} opacity={0.85} />
      {title && (
        <text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize={8} fill={C.white} opacity={0.6} style={MONO}>
          {title}
        </text>
      )}
      <line x1={x} x2={x + w} y1={y + 22} y2={y + 22} stroke="rgba(94,242,255,0.18)" />
    </g>
  );
}

function Chip({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  const w = label.length * 5.4 + 12;
  return (
    <g>
      <rect x={x} y={y - 8} width={w} height={12} rx={6} fill={color} opacity={0.18} />
      <text x={x + 6} y={y + 1.5} fontSize={7} fill={color} style={MONO}>
        {label}
      </text>
    </g>
  );
}

function Phone({ x, y, w = 120, h = 236, children }: { x: number; y: number; w?: number; h?: number; children: React.ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={18} fill="#0a1422" stroke="rgba(94,242,255,0.4)" strokeWidth={2} />
      <rect x={x + w / 2 - 18} y={y + 7} width={36} height={8} rx={4} fill="#000" />
      <g>{children}</g>
    </g>
  );
}

function IOC() {
  const rows: Array<[string, string, string, string]> = [
    ["IP", "185.220.101.4", "MALICIOUS", C.red],
    ["SHA256", "9f86d081…0a08", "SUSPICIOUS", C.amber],
    ["DOMAIN", "login-micr0soft.co", "PHISHING", C.red],
    ["URL", "hxxp://cdn-upd[.]io", "BENIGN", C.green],
    ["IP", "45.153.160.2", "C2", C.violet],
  ];
  return (
    <g>
      <Window x={34} y={34} w={332} h={214} title="ioc-submit // osint" />
      <text x={50} y={78} fontSize={8} fill={C.cyan} style={MONO}>TYPE</text>
      <text x={110} y={78} fontSize={8} fill={C.cyan} style={MONO}>INDICATOR</text>
      <text x={262} y={78} fontSize={8} fill={C.cyan} style={MONO}>VERDICT</text>
      {rows.map(([t, v, verdict, color], i) => (
        <g key={i}>
          <line x1={46} x2={354} y1={88 + i * 26} y2={88 + i * 26} stroke={C.faint} />
          <text x={50} y={104 + i * 26} fontSize={8.5} fill={C.white} opacity={0.75} style={MONO}>{t}</text>
          <text x={110} y={104 + i * 26} fontSize={8.5} fill={C.white} style={MONO}>{v}</text>
          <Chip x={262} y={102 + i * 26} label={verdict} color={color} />
        </g>
      ))}
      <text x={50} y={234} fontSize={7.5} fill={C.green} style={MONO}>AUTO-SUBMITTING 14/32</text>
      <Bar x={170} y={229} w={180} h={5} />
      <Bar x={170} y={229} w={79} h={5} fill={C.green} />
    </g>
  );
}

function SIEM() {
  const bars = [12, 18, 9, 22, 30, 16, 48, 70, 38, 26, 20, 58, 34, 18, 14, 24, 40, 28];
  return (
    <g>
      <text x={34} y={42} fontSize={15} fill={C.white} style={HEAD} letterSpacing={1.5}>HUNT // DAY 3 OF 5</text>
      <Chip x={268} y={38} label="T1059.001" color={C.cyan} />
      <Window x={34} y={56} w={332} h={92} title="process events / 24h" />
      {bars.map((b, i) => (
        <rect key={i} x={48 + i * 17.5} y={140 - b} width={11} height={b} rx={1.5} fill={i === 7 || i === 11 ? C.red : C.cyan} opacity={i === 7 || i === 11 ? 0.9 : 0.55} />
      ))}
      <rect x={34} y={158} width={332} height={44} rx={7} fill="rgba(8,20,32,0.82)" stroke="rgba(107,255,158,0.3)" />
      <text x={46} y={176} fontSize={8.5} fill={C.green} style={MONO}>event.category:process and</text>
      <text x={46} y={191} fontSize={8.5} fill={C.white} style={MONO}>process.name:powershell.exe and args:*-enc*</text>
      {[
        ["ALERTS", "128"],
        ["TTPs", "14"],
        ["HOSTS", "2.3K"],
      ].map(([k, v], i) => (
        <g key={k}>
          <rect x={34 + i * 113} y={212} width={104} height={44} rx={7} fill="rgba(8,20,32,0.7)" stroke={C.faint} />
          <text x={46 + i * 113} y={229} fontSize={7.5} fill={C.cyan} style={MONO}>{k}</text>
          <text x={46 + i * 113} y={249} fontSize={17} fill={C.white} style={HEAD}>{v}</text>
        </g>
      ))}
    </g>
  );
}

function QA() {
  return (
    <g>
      <Phone x={140} y={26}>
        <text x={154} y={58} fontSize={10} fill={C.white} style={HEAD} letterSpacing={0.8}>QUERY SOLUTION</text>
        <rect x={152} y={70} width={92} height={36} rx={9} fill="rgba(94,242,255,0.16)" />
        <text x={159} y={84} fontSize={6.5} fill={C.white} style={MONO}>How do eigenvalues</text>
        <text x={159} y={95} fontSize={6.5} fill={C.white} style={MONO}>relate to stability?</text>
        <rect x={168} y={114} width={88} height={46} rx={9} fill="rgba(107,255,158,0.18)" />
        <text x={175} y={128} fontSize={6.5} fill={C.green} style={MONO}>Dr. Mehta · PhD</text>
        <Bar x={175} y={135} w={70} h={4} />
        <Bar x={175} y={143} w={56} h={4} />
        <Bar x={175} y={151} w={63} h={4} />
        <rect x={152} y={170} width={96} height={30} rx={8} fill="rgba(8,20,32,0.9)" stroke={C.faint} />
        <circle cx={164} cy={185} r={5} fill={C.red} />
        <text x={174} y={188} fontSize={6.5} fill={C.white} style={MONO}>LIVE · 12:40</text>
        <rect x={152} y={232} width={96} height={18} rx={9} fill={C.cyan} opacity={0.85} />
        <text x={200} y={244} textAnchor="middle" fontSize={7} fill="#04121c" style={HEAD}>ASK AN EXPERT</text>
      </Phone>
      <g opacity={0.55}>
        <rect x={40} y={70} width={80} height={52} rx={10} fill="rgba(8,20,32,0.8)" stroke={C.faint} />
        <text x={50} y={90} fontSize={7} fill={C.cyan} style={MONO}>EXPERTS</text>
        <text x={50} y={110} fontSize={16} fill={C.white} style={HEAD}>240+</text>
        <rect x={280} y={150} width={84} height={52} rx={10} fill="rgba(8,20,32,0.8)" stroke={C.faint} />
        <text x={290} y={170} fontSize={7} fill={C.cyan} style={MONO}>AVG. WAIT</text>
        <text x={290} y={190} fontSize={16} fill={C.white} style={HEAD}>2 MIN</text>
      </g>
    </g>
  );
}

function Chat() {
  return (
    <g>
      <Window x={40} y={30} w={320} h={230} title="securtext — incident summarizer" />
      <rect x={176} y={66} width={170} height={26} rx={10} fill="rgba(94,242,255,0.2)" />
      <text x={186} y={83} fontSize={8} fill={C.white} style={MONO}>Summarize incident #4821</text>
      <rect x={54} y={104} width={250} height={112} rx={10} fill="rgba(107,255,158,0.1)" stroke="rgba(107,255,158,0.3)" />
      <text x={66} y={122} fontSize={8} fill={C.green} style={MONO}>▸ SUMMARY</text>
      {[
        "Initial access via phishing (T1566).",
        "Encoded PowerShell on 3 hosts.",
        "C2 beacon to 45.153.160.2 blocked.",
        "Recommend: isolate, reset creds.",
      ].map((t, i) => (
        <text key={i} x={66} y={142 + i * 17} fontSize={8} fill={C.white} opacity={0.9} style={MONO}>
          {t}
        </text>
      ))}
      <rect x={54} y={228} width={292} height={20} rx={10} fill="rgba(8,20,32,0.9)" stroke={C.faint} />
      <text x={66} y={241} fontSize={7.5} fill={C.white} opacity={0.5} style={MONO}>Ask a follow-up…</text>
      <circle cx={334} cy={238} r={7} fill={C.cyan} />
    </g>
  );
}

function Chain() {
  const blocks: Array<[string, string, string]> = [
    ["#102", "PICKED UP", "0x9a1f…c3"],
    ["#103", "IN TRANSIT", "0x4be0…71"],
    ["#104", "DELIVERED", "0xd27c…0e"],
  ];
  return (
    <g>
      <text x={34} y={50} fontSize={15} fill={C.white} style={HEAD} letterSpacing={1.5}>CHAIN OF CUSTODY</text>
      <text x={34} y={66} fontSize={8} fill={C.cyan} style={MONO}>hyperledger fabric · channel: courier</text>
      {blocks.map(([id, status, hash], i) => {
        const x = 34 + i * 116;
        return (
          <g key={id}>
            <rect x={x} y={92} width={96} height={118} rx={10} fill="rgba(8,20,32,0.85)" stroke={i === 2 ? C.green : "rgba(94,242,255,0.35)"} strokeWidth={i === 2 ? 1.6 : 1} />
            <text x={x + 12} y={114} fontSize={8} fill={C.cyan} style={MONO}>BLOCK {id}</text>
            <text x={x + 12} y={140} fontSize={12} fill={C.white} style={HEAD}>{status}</text>
            <Bar x={x + 12} y={152} w={70} h={4} />
            <Bar x={x + 12} y={162} w={52} h={4} />
            <text x={x + 12} y={194} fontSize={7.5} fill={i === 2 ? C.green : C.white} opacity={0.8} style={MONO}>{hash}</text>
            {i < 2 && (
              <g>
                <line x1={x + 96} x2={x + 116} y1={151} y2={151} stroke={C.cyan} strokeWidth={1.5} />
                <circle cx={x + 106} cy={151} r={3} fill={C.cyan} />
              </g>
            )}
          </g>
        );
      })}
      <rect x={34} y={226} width={332} height={30} rx={8} fill="rgba(107,255,158,0.1)" stroke="rgba(107,255,158,0.3)" />
      <text x={48} y={245} fontSize={8} fill={C.green} style={MONO}>✓ endorsed by 3/3 peers · tamper-evident</text>
    </g>
  );
}

function Shop() {
  const items = [C.green, C.amber, C.red, C.cyan, C.violet, C.green];
  return (
    <g>
      <Window x={30} y={28} w={340} h={234} title="swisto.in" />
      <text x={46} y={72} fontSize={18} fill={C.white} style={HEAD} letterSpacing={2}>SWISTO</text>
      <text x={46} y={86} fontSize={7.5} fill={C.cyan} style={MONO}>groceries in 30 min</text>
      <rect x={286} y={60} width={68} height={22} rx={11} fill={C.cyan} opacity={0.9} />
      <text x={320} y={74} textAnchor="middle" fontSize={7.5} fill="#04121c" style={HEAD}>CART · 3</text>
      {items.map((c, i) => {
        const x = 46 + (i % 3) * 104;
        const y = 98 + Math.floor(i / 3) * 76;
        return (
          <g key={i}>
            <rect x={x} y={y} width={94} height={66} rx={8} fill="rgba(8,20,32,0.85)" stroke={C.faint} />
            <circle cx={x + 22} cy={y + 24} r={12} fill={c} opacity={0.75} />
            <Bar x={x + 42} y={y + 16} w={40} h={5} />
            <Bar x={x + 42} y={y + 27} w={28} h={5} />
            <text x={x + 10} y={y + 56} fontSize={8} fill={C.white} style={HEAD}>₹{(i + 2) * 30}</text>
            <rect x={x + 64} y={y + 46} width={22} height={13} rx={4} fill={C.green} opacity={0.25} />
            <text x={x + 75} y={y + 56} textAnchor="middle" fontSize={8} fill={C.green} style={HEAD}>+</text>
          </g>
        );
      })}
      <Chip x={252} y={98 - 12} label="PENTEST ✓" color={C.green} />
    </g>
  );
}

function Identity() {
  const rings = [64, 52, 40, 28, 16];
  return (
    <g>
      <g transform="translate(110 150)">
        {rings.map((r, i) => (
          <path
            key={r}
            d={`M ${-r} 8 A ${r} ${r} 0 0 1 ${r} 8`}
            fill="none"
            stroke={i % 2 ? C.cyan : C.green}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={i === 2 ? "14 8" : i === 4 ? "6 6" : undefined}
            opacity={0.85}
          />
        ))}
        <path d="M -60 30 Q 0 70 60 30" fill="none" stroke={C.cyan} strokeWidth={4} strokeLinecap="round" opacity={0.5} />
      </g>
      <rect x={196} y={52} width={170} height={190} rx={12} fill="rgba(8,20,32,0.86)" stroke="rgba(94,242,255,0.35)" />
      <text x={212} y={78} fontSize={11} fill={C.white} style={HEAD} letterSpacing={1.2}>IDENTITY BLOCK</text>
      {[
        ["NAME", "████████ ██"],
        ["DOB", "██/██/████"],
        ["ID", "████-████-██"],
      ].map(([k, v], i) => (
        <g key={k}>
          <text x={212} y={104 + i * 30} fontSize={7.5} fill={C.cyan} style={MONO}>{k}</text>
          <text x={212} y={117 + i * 30} fontSize={9} fill={C.white} opacity={0.85} style={MONO}>{v}</text>
        </g>
      ))}
      <line x1={212} x2={350} y1={196} y2={196} stroke={C.faint} />
      <text x={212} y={214} fontSize={7.5} fill={C.green} style={MONO}>SHA-256 0x7a3f…e91b</text>
      <text x={212} y={229} fontSize={7.5} fill={C.green} style={MONO}>AES-256 · VERIFIED ✓</text>
    </g>
  );
}

function Captcha({ id }: { id: string }) {
  const chars = ["x", "7", "K", "p", "9", "Q"];
  return (
    <g>
      <rect x={50} y={52} width={300} height={120} rx={10} fill="rgba(8,20,32,0.86)" stroke="rgba(94,242,255,0.35)" />
      <g clipPath={`url(#${id}-cap)`}>
        {Array.from({ length: 14 }, (_, i) => (
          <path
            key={i}
            d={`M 50 ${70 + i * 8} C 130 ${40 + ((i * 37) % 90)}, 240 ${150 - ((i * 23) % 90)}, 350 ${60 + ((i * 53) % 100)}`}
            fill="none"
            stroke={i % 3 ? C.faint : "rgba(94,242,255,0.25)"}
          />
        ))}
        {chars.map((ch, i) => (
          <text
            key={i}
            x={86 + i * 40}
            y={128 + ((i * 17) % 22) - 10}
            fontSize={44}
            fill={i % 2 ? C.cyan : C.green}
            transform={`rotate(${((i * 29) % 40) - 20} ${86 + i * 40} 118)`}
            style={{ ...HEAD, fontWeight: 600 }}
            opacity={0.92}
          >
            {ch}
          </text>
        ))}
      </g>
      <rect x={50} y={186} width={230} height={34} rx={8} fill="rgba(8,20,32,0.86)" stroke={C.faint} />
      <text x={62} y={207} fontSize={9} fill={C.white} opacity={0.55} style={MONO}>type the characters</text>
      <rect x={290} y={186} width={60} height={34} rx={8} fill={C.cyan} opacity={0.9} />
      <text x={320} y={207} textAnchor="middle" fontSize={9} fill="#04121c" style={HEAD}>VERIFY</text>
      <text x={50} y={246} fontSize={7.5} fill={C.green} style={MONO}>python · PIL · random warp + noise</text>
    </g>
  );
}

function Terminal() {
  const code: Array<[string, string]> = [
    ["#include", ' "budget.h"'],
    ["struct", " Entry { double amt; Cat c; };"],
    ["double", " total(const Ledger& l) {"],
    ["  for", " (auto& e : l) sum += e.amt;"],
    ["  return", " sum;"],
    ["}", ""],
  ];
  const bars = [52, 70, 44, 86, 61, 38];
  return (
    <g>
      <Window x={30} y={30} w={210} h={228} title="budget.cpp" />
      {code.map(([k, rest], i) => (
        <text key={i} x={44} y={74 + i * 18} fontSize={8} style={MONO}>
          <tspan fill={C.violet}>{k}</tspan>
          <tspan fill={C.white}>{rest}</tspan>
        </text>
      ))}
      <text x={44} y={196} fontSize={8} fill={C.green} style={MONO}>$ ./budget --month sep</text>
      <text x={44} y={214} fontSize={8} fill={C.white} style={MONO}>Total: ₹42,180  Saved: 18%</text>
      <rect x={44} y={226} width={6} height={10} fill={C.green}>
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
      </rect>
      <rect x={252} y={30} width={118} height={228} rx={8} fill="rgba(8,20,32,0.82)" stroke="rgba(94,242,255,0.28)" />
      <text x={264} y={52} fontSize={8} fill={C.cyan} style={MONO}>MONTHLY</text>
      {bars.map((b, i) => (
        <rect key={i} x={266 + i * 16} y={230 - b * 1.6} width={10} height={b * 1.6} rx={2} fill={i === 3 ? C.red : C.green} opacity={0.75} />
      ))}
    </g>
  );
}

function Calendar() {
  const booked = new Set([3, 8, 9, 15, 17, 22, 26]);
  const active = 17;
  return (
    <g>
      <text x={34} y={48} fontSize={15} fill={C.white} style={HEAD} letterSpacing={1.5}>1:1 MENTORING</text>
      <text x={34} y={64} fontSize={8} fill={C.cyan} style={MONO}>careers in cyber · interview prep</text>
      <rect x={34} y={78} width={206} height={178} rx={10} fill="rgba(8,20,32,0.85)" stroke="rgba(94,242,255,0.3)" />
      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
        <text key={i} x={52 + i * 28} y={98} fontSize={7.5} fill={C.cyan} textAnchor="middle" style={MONO}>{d}</text>
      ))}
      {Array.from({ length: 28 }, (_, i) => {
        const x = 40 + (i % 7) * 28;
        const y = 106 + Math.floor(i / 7) * 36;
        const on = booked.has(i);
        return (
          <g key={i}>
            <rect x={x} y={y} width={24} height={30} rx={5} fill={i === active ? C.green : on ? "rgba(94,242,255,0.22)" : C.faint} />
            <text x={x + 12} y={y + 19} textAnchor="middle" fontSize={8} fill={i === active ? "#04121c" : C.white} style={MONO}>{i + 1}</text>
          </g>
        );
      })}
      <rect x={252} y={78} width={114} height={178} rx={10} fill="rgba(8,20,32,0.85)" stroke={C.faint} />
      <text x={264} y={100} fontSize={7.5} fill={C.cyan} style={MONO}>OCT 18</text>
      <text x={264} y={122} fontSize={13} fill={C.white} style={HEAD}>SESSION</text>
      <text x={264} y={138} fontSize={8} fill={C.white} opacity={0.7} style={MONO}>30 min · video</text>
      {["10:00", "11:30", "16:00"].map((t, i) => (
        <g key={t}>
          <rect x={264} y={152 + i * 26} width={90} height={20} rx={6} fill={i === 1 ? C.green : "rgba(94,242,255,0.14)"} />
          <text x={309} y={166 + i * 26} textAnchor="middle" fontSize={8} fill={i === 1 ? "#04121c" : C.white} style={MONO}>{t}</text>
        </g>
      ))}
    </g>
  );
}

export default function Cover({ variant, className }: { variant: CoverVariant; className?: string }) {
  const uid = useId().replace(/[:«»]/g, "");
  const art = {
    ioc: <IOC />,
    siem: <SIEM />,
    qa: <QA />,
    chat: <Chat />,
    chain: <Chain />,
    shop: <Shop />,
    identity: <Identity />,
    captcha: <Captcha id={uid} />,
    terminal: <Terminal />,
    calendar: <Calendar />,
  }[variant];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#040a14" />
          <stop offset="0.62" stopColor="#06202a" />
          <stop offset="1" stopColor="#0b4a3c" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="0.5" cy="1.05" r="0.75">
          <stop offset="0" stopColor="#21ff8a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#21ff8a" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${uid}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgba(94,242,255,0.05)" />
        </pattern>
        <clipPath id={`${uid}-cap`}>
          <rect x={50} y={52} width={300} height={120} rx={10} />
        </clipPath>
      </defs>
      <rect width={W} height={H} fill={`url(#${uid}-bg)`} />
      <rect width={W} height={H} fill={`url(#${uid}-grid)`} />
      <rect width={W} height={H} fill={`url(#${uid}-glow)`} />
      {art}
    </svg>
  );
}
