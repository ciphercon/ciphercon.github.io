// Sorted most-recent-first, as issued on LinkedIn. `blurb` is a one-line
// gloss written for the site — not official cert copy. `logo` picks an
// image when the cert name or issuer has a recognizable public logo
// (Wikimedia Commons, freely licensed); otherwise a text monogram —
// Teach Tech Services, Cybrary, and DoIT&C don't have one readily
// available.
export type Logo =
  | { type: "image"; src: string }
  | { type: "monogram"; text: string };

const image = (src: string): Logo => ({ type: "image", src });
const monogram = (text: string): Logo => ({ type: "monogram", text });

export const CERTIFICATIONS = [
  { title: "Azure 900", issuer: "Microsoft", date: "Feb 2022", blurb: "Cloud fundamentals, proven — the bedrock for securing Microsoft's ecosystem.", logo: image("/logos/certs/azure.svg") },
  { title: "Netwitness Threat Hunter II CTF", issuer: "RSA Security", date: "Oct 2021", blurb: "Hunted threats under fire in RSA's capture-the-flag arena.", logo: image("/logos/certs/rsa.svg") },
  { title: "RSA Netwitness Platform Analysis", issuer: "RSA Security", date: "Oct 2021", blurb: "Mastered network forensics on one of the industry's deepest packet-analysis platforms.", logo: image("/logos/certs/rsa.svg") },
  { title: "Python Badge for Selenium", issuer: "UnitedHealth Group", date: "Sep 2021", blurb: "Automated the tedious away — browser workflows scripted at scale.", logo: image("/logos/certs/python.svg") },
  { title: "Splunk Fundamentals", issuer: "UnitedHealth Group", date: "Apr 2021", blurb: "Turned raw logs into real answers with Splunk's core toolkit.", logo: image("/logos/certs/splunk.svg") },
  { title: "Cryptocurrency for Law Enforcement (Public Version)", issuer: "CISA", date: "Apr 2020", blurb: "Traced digital money trails through the blockchain, CISA-certified.", logo: image("/logos/certs/cisa.svg") },
  { title: "The Definitive Ethical Hacking Course", issuer: "Udemy", date: "Mar 2020", blurb: "Learned to think like an attacker, one exploit at a time.", logo: image("/logos/certs/udemy.svg") },
  { title: "The Complete Ethical Hacking Course for 201/2017", issuer: "Udemy", date: "Mar 2020", blurb: "Full-spectrum offensive security, from recon to reporting.", logo: image("/logos/certs/udemy.svg") },
  { title: "The Complete Ethical Hacking Course: Beginner to Advanced", issuer: "Udemy", date: "Mar 2020", blurb: "Went from first scan to full penetration test.", logo: image("/logos/certs/udemy.svg") },
  { title: "Cyber Security & Ethical Hacking Trainer", issuer: "Teach Tech Services", date: "Jul 2019", blurb: "Turned hard-won hacking skills into lessons for the next generation.", logo: monogram("TTS") },
  { title: "SAP ABAP TAW10 & TAW12", issuer: "SAP", date: "Oct 2018", blurb: "Learned to speak the language enterprise systems run on.", logo: image("/logos/certs/sap.svg") },
  { title: "Penetration Testing And Ethical Hacking", issuer: "Cybrary", date: "Oct 2018", blurb: "Broke systems on purpose, so real attackers couldn't.", logo: monogram("CYB") },
  { title: "Introduction to Cyber Attacks", issuer: "Coursera", date: "Sep 2018", blurb: "Studied the anatomy of an attack, from the ground up.", logo: image("/logos/certs/coursera.svg") },
  { title: "Blockchain Basics and Fundamentals", issuer: "Coursera", date: "Aug 2018", blurb: "Decoded the trust machine powering crypto and beyond.", logo: image("/logos/certs/coursera.svg") },
  { title: "Usable Security", issuer: "Coursera", date: "Aug 2018", blurb: "Security that people actually use — because unusable security fails.", logo: image("/logos/certs/coursera.svg") },
  { title: "End User Security", issuer: "Cybrary", date: "Jun 2018", blurb: "The human firewall, reinforced.", logo: monogram("CYB") },
  { title: "Rajasthan Hackathon Certificate of Merit", issuer: "DoIT&C, Govt. of Rajasthan", date: "Mar 2018", blurb: "Built under pressure, recognized by the state.", logo: monogram("RJ") },
  { title: "Create a Subnet", issuer: "Cybrary", date: "Nov 2017", blurb: "Carved order out of IP chaos, one subnet at a time.", logo: monogram("CYB") },
  { title: "Understand Cloud Computing", issuer: "Cybrary", date: "Nov 2017", blurb: "Grasped the infrastructure behind the cloud everyone relies on.", logo: monogram("CYB") },
  { title: "Computer and Network Security", issuer: "Cybrary", date: "Nov 2017", blurb: "Locked down the fundamentals — hosts, networks, and everything between.", logo: monogram("CYB") },
  { title: "PHP For Beginner To Advance", issuer: "Udemy", date: "Jul 2017", blurb: "Built the web from the backend up.", logo: image("/logos/certs/php.svg") },
  { title: "Web Developer Bootcamp", issuer: "Udemy", date: "Jul 2017", blurb: "Went from zero to shipping real web apps.", logo: image("/logos/certs/udemy.svg") },
  { title: "Cloud Computing Workshop", issuer: "ISO", date: "Aug 2015", blurb: "Early days in the cloud, before it was everywhere.", logo: image("/logos/certs/iso.svg") },
];
