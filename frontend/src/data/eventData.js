// Data store for AlgoNexus College Tech Fest

export const EVENT_DETAILS = {
  name: "AlgoNexus 2026",
  tagline: "Architecting the Future of Code & Intelligence",
  edition: "4th National Edition",
  dates: "October 16 - 18, 2026",
  targetDate: "2026-10-16T09:00:00+05:30",
  venue: "Auditorium & Tech Hub, Main Campus",
  location: "Silicon Hall & Central Labs, Bangalore / Delhi",
  organizers: "Department of Computer Science & Engineering, Tech Nexus Council",
  prizePool: "₹2,50,000+",
  participantsExpected: "2,000+ Hackers & Coders",
  collegesExpected: "80+ Universities Across India"
};

export const PAST_YEAR_GALLERY = [
  {
    id: 1,
    title: "AlgoNexus Organizing Committee & Student Council",
    category: "Organizers & Council",
    year: "2025",
    caption: "The entire student organizing committee and faculty mentors gathered in the tech lab after the triumph of AlgoNexus 2025.",
    image: "/images/gallery/gallery_team_all.jpg",
    tags: ["OrganizingTeam", "StudentCouncil", "DepartmentOfCSE", "AlgoNexus2025"]
  },
  {
    id: 2,
    title: "Core Event Leadership & Executive Leads",
    category: "Core Leads",
    year: "2025",
    caption: "Student executive leads and event coordinators in formal attire managing hackathon tracks, stage logistics, and registrations.",
    image: "/images/gallery/gallery_core_leads.jpg",
    tags: ["CoreLeadership", "EventLeads", "ExecutiveCommittee"]
  },
  {
    id: 3,
    title: "Faculty Mentors & Department Coordinators",
    category: "Faculty & Mentors",
    year: "2025",
    caption: "Guiding faculty members and student heads whose steadfast mentorship and encouragement powered AlgoNexus.",
    image: "/images/gallery/gallery_faculty_mentors.jpg",
    tags: ["FacultyMentors", "DepartmentHeads", "Guidance"]
  },
  {
    id: 4,
    title: "AlgoNexus Department Inauguration & Felicitations",
    category: "Celebrations & Faculty",
    year: "2025",
    caption: "Faculty coordinators, professors, and organizing student committee members celebrating the grand launch and felicitations of AlgoNexus.",
    image: "/images/gallery/gallery_department_celebration.jpg",
    tags: ["Inauguration", "DepartmentCelebration", "FacultyAndStudents", "AlgoNexus2025"]
  },
  {
    id: 5,
    title: "Stage Ceremonies & Faculty Dignitaries",
    category: "Stage & Ceremonies",
    year: "2025",
    caption: "Honorable faculty members, department heads, and anchor leads gracing the grand inauguration stage of AlgoNexus.",
    image: "/images/gallery/gallery_stage_dignitaries.jpg",
    tags: ["Inauguration", "Dignitaries", "DepartmentHeads", "StageEvent"]
  },
  {
    id: 6,
    title: "Grand Valedictory & Traditional Celebration",
    category: "Celebrations",
    year: "2025",
    caption: "Student council heads and faculty coordinators in festive attire celebrating the triumphant culmination of the fest.",
    image: "/images/gallery/gallery_cultural_celebration.jpg",
    tags: ["Valedictory", "StudentCouncil", "Celebration", "FestiveMoments"]
  }
];

export const EVENT_TRACKS = [
  {
    id: "ai-data",
    name: "AI & Neural Frontiers",
    icon: "BrainCircuit",
    desc: "Build autonomous agents, multi-modal LLM workflows, predictive models, or computer vision systems.",
    prize: "₹60,000 Cash Pool"
  },
  {
    id: "web3-cloud",
    name: "Web3 & Cloud Architectures",
    icon: "Globe",
    desc: "Decentralized applications, smart contracts, high-throughput microservices, and serverless computing.",
    prize: "₹50,000 Cash Pool"
  },
  {
    id: "algo-cp",
    name: "Algorithmic Duels (CP)",
    icon: "Code2",
    desc: "Rapid-fire data structure sprints, dynamic programming battles, and graph theorem challenges.",
    prize: "₹45,000 Cash Pool"
  },
  {
    id: "cyber-ctf",
    name: "Cybersecurity & CTF",
    icon: "ShieldAlert",
    desc: "Reverse engineering, binary exploitation, web vulnerabilities, and digital forensic capture-the-flag.",
    prize: "₹45,000 Cash Pool"
  },
  {
    id: "iot-robotics",
    name: "IoT & Embedded Robotics",
    icon: "Cpu",
    desc: "Smart robotics, edge computing hardware, drone navigation, and industrial automation solutions.",
    prize: "₹50,000 Cash Pool"
  }
];

export const REGISTRATION_TIERS = [
  {
    id: "solo-coder",
    name: "Solo Hacker Pass",
    badge: "Most Popular for Coders",
    price: 299,
    currency: "INR",
    type: "individual",
    features: [
      "Access to Algorithmic Duels & Speed Coding",
      "Attend All Keynotes & Tech Workshops",
      "Official AlgoNexus Swag Kit (T-Shirt + Stickers)",
      "Free Lunch & Refreshments during Fest",
      "Official Certificate of Participation"
    ],
    popular: false,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "hackathon-squad",
    name: "Hackathon Squad (Team 2-4)",
    badge: "Flagship Hackathon",
    price: 799,
    currency: "INR",
    type: "team",
    features: [
      "Guaranteed Entry to 36-Hr Flagship Hackathon",
      "Covers entire team of up to 4 members",
      "Midnight Meals, Energy Drinks & Snacks",
      "Direct 1-on-1 Mentorship from Tech Leads",
      "Eligible for ₹2.5L+ Cash Prizes & Pool Awards",
      "Team Swag Boxes & Cloud Credits ($100 each)"
    ],
    popular: true,
    color: "from-indigo-500 to-purple-600"
  },
  {
    id: "all-access-vip",
    name: "All-Access Delegate VIP",
    badge: "Exclusive Experience",
    price: 1299,
    currency: "INR",
    type: "individual",
    features: [
      "Everything in Solo Hacker Pass",
      "VIP Seating at Keynotes & Fireside Chats",
      "Exclusive Invite to Sponsor Dinner & Networking",
      "Direct Resume Referral to Hiring Partners",
      "Fast-Track Gate Check-in & Priority Wi-Fi Zone",
      "Limited Edition AlgoNexus Hoodie"
    ],
    popular: false,
    color: "from-amber-500 to-rose-600"
  }
];

export const FAQ_LIST = [
  {
    q: "Who is eligible to participate in AlgoNexus 2026?",
    a: "Any undergraduate or postgraduate student currently enrolled in any recognized college/university across India is welcome to participate! Valid College ID is mandatory at the gate."
  },
  {
    q: "Can I participate individually in the hackathon?",
    a: "The Flagship Hackathon allows teams of 2 to 4 members. You can either register with your squad or join our discord/on-campus team formation mixer on Day 1. Solo attendees can also participate in Algorithmic Duels and Workshops!"
  },
  {
    q: "How does the payment and ticket confirmation work?",
    a: "Payments are processed securely via Razorpay (UPI, GPay, PhonePe, Paytm, Debit/Credit Cards, Net Banking). Upon successful payment, your digital entry pass with a unique QR code is generated instantly for download."
  },
  {
    q: "Will accommodation and food be provided?",
    a: "Yes! All registered participants receive complimentary meals, refreshments, and midnight snacks during hackathon hours. Outstation hostel accommodation can be requested post-registration."
  }
];
