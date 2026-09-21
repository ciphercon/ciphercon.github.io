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

const CERTIFICATIONS = [
  "CompTIA Security+",
  "CompTIA Cloud+",
  "NetWitness Incident Responder",
  "Certified Blockchain Developer",
  "Python Developer (UHG)",
];

export default function Education() {
  return (
    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
          Education
        </h3>
        <ul className="space-y-4">
          {EDUCATION.map((item) => (
            <li key={item.school}>
              <p className="font-semibold">{item.program}</p>
              <p className="text-sm text-foreground/60">
                {item.school} · {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
          Certifications
        </h3>
        <ul className="space-y-2">
          {CERTIFICATIONS.map((cert) => (
            <li key={cert} className="text-sm text-foreground/70">
              {cert}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
