// All site content lives here. Edit this file; the pages render from it.
// Empty arrays/strings hide their section, so nothing placeholder-y shows up live.
window.PORTFOLIO = {
  name: "Christian Fields",
  role: "IT Analyst & Cybersecurity Activist",
  location: "Orlando, FL",
  version: "Version 1.0.0 (portfolio/production)",
  // Logo shown on the title screen (transparent background).
  logo: "logo.webp",
  // Picture in the top-left account chip. Empty = initials instead.
  avatar: "https://avatars.githubusercontent.com/u/167286637?v=4",

  about: [
    "Hey, I’m Christian Fields.",
    "I enjoy building things, breaking things, and figuring out how they work. It started with learning to program, " +
      "which eventually led to releasing my first piece of software. That experience taught me that building something " +
      "that works is one thing; building something people actually use is another.",
    "Somewhere along the way, security caught my attention, and I’ve been equally drawn to defending systems and " +
      "breaking them. The best way I know to understand something is to take it apart.",
    "Today, I work across cybersecurity and IT operations, with a particular interest in where security, software " +
      "development, and business intersect. If something sparks my curiosity, I’ll happily lose a few nights to it.",
    "Outside of work, you’ll usually find me gaming, working out, or hanging out with friends.",
  ],

  skills: {
    "Security": ["Zero-trust allowlisting", "Patch management", "Identity & access management", "MFA", "Hash verification", "SIEM / Wazuh", "Kali Linux"],
    "Systems & Tools": ["Windows", "macOS", "Linux", "Windows Server", "Microsoft 365", "Active Directory", "Entra ID / Azure AD",
      "SCCM", "Intune", "Group Policy", "Hyper-V", "DNS / DHCP", "VPN", "Citrix", "Epic EHR", "ServiceNow", "Jira"],
    "Programming & Scripting": ["PowerShell", "JavaScript", "HTML", "CSS", ".NET Framework", "Python"],
  },

  // Each: { name, description?, tags, url?, points?, images? }. `points` or `images` add a "View Details" page.
  projects: [
    {
      name: "X&F Enterprises LLC",
      tags: ["HTML", "CSS", "JavaScript", "UX/UI", "SEO", "Email Marketing"],
      points: [
        "Cultivated and sustained client relationships through regular communication, progress reporting, and handling any business relations.",
        "Developed and maintained responsive, user-friendly websites using HTML, CSS, and JavaScript, integrating 3D models to enhance visual appeal and user experience.",
        "Devised and implemented UX/UI designs with a focus on user-centric principles to elevate website usability and visual appeal.",
        "Conducted website performance optimizations, leading to enhanced loading speeds and user experiences.",
        "Conducted thorough keyword research and analysis to pinpoint opportunities for enhancing website visibility and driving increased traffic.",
        "Stayed up to date on industry trends and best practices, sharing knowledge through tutorials and courses with both team members and clients.",
        "Managed email marketing initiatives, from list management to content creation and performance tracking.",
        "Conducted routine website maintenance tasks, including updates, backups, security checks, and bug fixes.",
      ],
      images: [
        { src: "projects/xf/aimable-fitness.webp", alt: "Aimable Fitness: personal training site with a dark, bold hero" },
        { src: "projects/xf/kbg-consulting.webp", alt: "KBG: business consulting site in navy and gold" },
        { src: "projects/xf/spearpoint-fishing.webp", alt: "Spearpoint Fishing: fishing club site with an underwater marlin hero" },
        { src: "projects/xf/durand-team.webp", alt: "The Durand Team: real estate site shown on phone and tablet" },
      ],
    },
    {
      name: "SIEM Home Lab with Wazuh",
      description:
        "Built a SIEM/XDR home lab with Wazuh on Ubuntu 22.04, monitoring Windows and Linux " +
        "endpoints. Generated attacks from Kali Linux, then detected, analyzed, and responded to them.",
      tags: ["Wazuh", "SIEM", "Kali", "VMware"],
      url: "https://github.com/C3-Security/SIEM-HOME-LAB-WITH-WAZUH",
    },
    {
      name: "Crypto Price Alerts",
      description:
        "Python GUI that polls the CoinMarketCap API every 60 seconds and sends desktop " +
        "notifications when BTC, ETH, or SOL hit a price target or stop loss.",
      tags: ["Python", "Tkinter", "API"],
      url: "https://github.com/C3-Security/Crypto-Price-Alerts",
    },
  ],

  // `icon` (github | linkedin) also adds the link to the top-right shortcut buttons.
  links: [
    { name: "LinkedIn", icon: "linkedin", motd: "Connect with me professionally", url: "https://www.linkedin.com/in/christian-fields-45a98b244/" },
    { name: "GitHub", icon: "github", motd: "Check out my code repositories", url: "https://github.com/C3-Security" },
  ],

  // Empty hides the email contact entry and sends the contact form to LinkedIn instead.
  email: "hello@christianfields.dev",

  // Link to a PDF (e.g. "resume.pdf" in this folder). Empty = "Download PDF" is hidden.
resumeUrl: "resume.pdf",

  // Newest first. Each: { title, org, dates, place, points: [] }
  experience: [
    {
      title: "Patch Management Specialist",
      org: "ThreatLocker",
      dates: "Dec 2024 – Aug 2025",
      place: "Maitland, FL",
      points: [
        "Developed and tested PowerShell scripts to automate update deployment for client-facing applications, published to the client portal for use across client environments.",
        "Triaged and resolved configuration, patch deployment, and update failures by capturing log files, analyzing environment variables, and executing remediation steps across client domains.",
        "Designed and maintained an internal multi-OS virtual lab environment used for software validation, patch testing, and security hardening prior to client deployment, reducing failed updates and policy conflicts in production.",
      ],
    },
    {
      title: "Application Technician",
      org: "ThreatLocker",
      dates: "Jul 2024 – Dec 2024",
      place: "Maitland, FL",
      points: [
        "Managed endpoint security policy deployment and application allowlisting across 100,000+ Windows and macOS endpoints in a multi-tenant zero-trust environment, supporting enterprise clients across multiple industries.",
        "Performed MD5/SHA256 hash verification and reviewed file paths, DLL dependencies, and executable behavior to support secure application allowlisting.",
        "Developed structured application bypass rules using file path and extension-based exceptions while maintaining strict zero-trust controls.",
        "Developed secure application environments using Hyper-V, facilitating seamless testing and deployment of critical software solutions.",
      ],
    },
    {
      title: "IT Service Desk Agent",
      org: "Orlando Health",
      dates: "Dec 2022 – Jul 2024",
      place: "Orlando, FL",
      points: [
        "Served as the first line of support for enterprise healthcare application incidents, requests, and technical issues across calls, tickets, and electronic communication channels in a live clinical environment.",
        "Resolved or escalated 200+ weekly tickets covering hardware, software, network, VPN, Citrix, Epic EHR, and phone-related issues, consistently maintaining a 98% customer satisfaction rate.",
        "Administered identity and access management for 30,000+ users via Active Directory, Microsoft 365, and Entra ID — including account resets, group assignments, and MFA compliance verification — while upholding HIPAA and customer security standards.",
        "Escalated issues to on-call personnel for prompt resolution of critical incidents.",
        "Maintained accurate documentation throughout the full support lifecycle — including incidents, resolutions, and escalation details — to drive continuous improvement and knowledge sharing.",
      ],
    },
  ],

  // Each: { degree, school, dates }
  education: [
    { degree: "B.S. Information Technology (BSIT to MSITM)", school: "Western Governors University", dates: "Expected 2028" },
    { degree: "Bachelor of Computer Science", school: "Keiser University", dates: "2019 – 2021" },
  ],

  // Each: { name, issuer }
  certifications: [
    { name: "CompTIA Security+", issuer: "CompTIA" },
    { name: "CompTIA Network+", issuer: "CompTIA" },
  ],
};
