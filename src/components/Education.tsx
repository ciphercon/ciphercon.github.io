import GlitchText from "./GlitchText";

const EDUCATION = [
  {
    school: "IIT Guwahati (E&ICT Academy)",
    program: "Post Graduation Advance Certification, Cyber Security",
    detail: "Aug 2024 – Sep 2025 · Malware Analysis, Applied Cryptography, AI for Cyber Security",
  },
  {
    school: "Lovely Professional University",
    program: "B.Tech, Computer Science and Engineering",
    detail: "2015 – 2019 · Cyber Security",
  },
];

// Sorted most-recent-first, as issued on LinkedIn.
const CERTIFICATIONS = [
  { title: "Azure 900", issuer: "Microsoft", date: "Feb 2022" },
  { title: "Netwitness Threat Hunter II CTF", issuer: "RSA Security", date: "Oct 2021" },
  { title: "RSA Netwitness Platform Analysis", issuer: "RSA Security", date: "Oct 2021" },
  { title: "Python Badge for Selenium", issuer: "UnitedHealth Group", date: "Sep 2021" },
  { title: "Splunk Fundamentals", issuer: "UnitedHealth Group", date: "Apr 2021" },
  { title: "Cryptocurrency for Law Enforcement (Public Version)", issuer: "CISA", date: "Apr 2020" },
  { title: "The Definitive Ethical Hacking Course", issuer: "Udemy", date: "Mar 2020" },
  { title: "The Complete Ethical Hacking Course for 201/2017", issuer: "Udemy", date: "Mar 2020" },
  { title: "The Complete Ethical Hacking Course: Beginner to Advanced", issuer: "Udemy", date: "Mar 2020" },
  { title: "Cyber Security & Ethical Hacking Trainer", issuer: "Teach Tech Services", date: "Jul 2019" },
  { title: "SAP ABAP TAW10 & TAW12", issuer: "SAP", date: "Oct 2018" },
  { title: "Penetration Testing And Ethical Hacking", issuer: "Cybrary", date: "Oct 2018" },
  { title: "Introduction to Cyber Attacks", issuer: "Coursera", date: "Sep 2018" },
  { title: "Blockchain Basics and Fundamentals", issuer: "Coursera", date: "Aug 2018" },
  { title: "Usable Security", issuer: "Coursera", date: "Aug 2018" },
  { title: "End User Security", issuer: "Cybrary", date: "Jun 2018" },
  { title: "Rajasthan Hackathon Certificate of Merit", issuer: "DoIT&C, Govt. of Rajasthan", date: "Mar 2018" },
  { title: "Create a Subnet", issuer: "Cybrary", date: "Nov 2017" },
  { title: "Understand Cloud Computing", issuer: "Cybrary", date: "Nov 2017" },
  { title: "Computer and Network Security", issuer: "Cybrary", date: "Nov 2017" },
  { title: "PHP For Beginner To Advance", issuer: "Udemy", date: "Jul 2017" },
  { title: "Web Developer Bootcamp", issuer: "Udemy", date: "Jul 2017" },
  { title: "Cloud Computing Workshop", issuer: "ISO", date: "Aug 2015" },
];

export default function Education() {
  return (
    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
          <GlitchText text="Education" />
        </h3>
        <ul className="space-y-4">
          {EDUCATION.map((item, i) => (
            <li key={item.school}>
              <p className="font-semibold">
                <GlitchText
                  text={item.program}
                  startDelay={i * 150}
                  tickMs={25}
                  lockEvery={2}
                  charsPerTick={2}
                />
              </p>
              <p className="text-sm text-foreground/60">
                <GlitchText
                  text={`${item.school} · ${item.detail}`}
                  startDelay={i * 150 + 200}
                  tickMs={20}
                  lockEvery={1}
                  charsPerTick={2}
                />
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
          <GlitchText text={`Certifications (${CERTIFICATIONS.length})`} />
        </h3>
        <ul
          className="max-h-80 space-y-3 overflow-y-auto pr-2"
          data-lenis-prevent
        >
          {CERTIFICATIONS.map((cert, i) => (
            <li key={`${cert.title}-${cert.date}`} className="text-sm">
              <p className="text-foreground/80">
                <GlitchText
                  text={cert.title}
                  startDelay={i * 40}
                  tickMs={20}
                  lockEvery={1}
                  charsPerTick={2}
                />
              </p>
              <p className="text-xs text-muted">
                <GlitchText
                  text={`${cert.issuer} · ${cert.date}`}
                  startDelay={i * 40 + 100}
                  tickMs={20}
                  lockEvery={1}
                  charsPerTick={2}
                />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
