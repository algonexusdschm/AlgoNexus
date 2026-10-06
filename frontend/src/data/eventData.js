// Data store for TechAstra College Tech Fest

export const EVENT_DETAILS = {
  name: "TechAstra 2026",
  tagline: "48 Hours. One Problem. Unlimited Possibilities.",
  edition: "4th National Edition",
  dates: "To Be Announced Soon",
  datesAnnounced: false,
  targetDate: "2026-10-16T09:00:00+05:30",
  venue: "Smt. Chandibai Himathmal Mansukhani College",
  location: "Smt. Chandibai Himathmal Mansukhani College, Ulhasnagar, Maharashtra",
  college: "Smt. Chandibai Himathmal Mansukhani College",
  department: "Department of Data Science",
  club: "Club Data Decoder",
  email: "algonexusdschm@gmail.com",
  phone: "+91 80100 86323",
  organizers: "Club Data Decoder, Department of Data Science, Smt. Chandibai Himathmal Mansukhani College",
  prizePool: "₹1,00,000",
  participantsExpected: "300+ Hackers (Open For All)",
  collegesExpected: "80+ Universities Across India"
};

export const PAST_YEAR_GALLERY = [
  {
    id: 1,
    title: "TechAstra Organizing Committee & Student Council",
    category: "Organizers & Council",
    year: "Last Event",
    caption: "The entire student organizing committee and faculty mentors gathered in the tech lab after the triumph of our last event.",
    image: "/images/gallery/gallery_team_all.jpg",
    tags: ["OrganizingTeam", "StudentCouncil", "DepartmentOfDataScience", "CHMCollege", "LastEventMemories"]
  },
  {
    id: 2,
    title: "Core Event Leadership & Executive Leads",
    category: "Core Leads",
    year: "Last Event",
    caption: "Student executive leads and event coordinators in formal attire managing hackathon tracks, stage logistics, and registrations.",
    image: "/images/gallery/gallery_core_leads.jpg",
    tags: ["CoreLeadership", "EventLeads", "ExecutiveCommittee"]
  },
  {
    id: 3,
    title: "Faculty Mentors & Department Coordinators",
    category: "Faculty & Mentors",
    year: "Last Event",
    caption: "Guiding faculty members and student heads whose steadfast mentorship and encouragement powered TechAstra.",
    image: "/images/gallery/gallery_faculty_mentors.jpg",
    tags: ["FacultyMentors", "DepartmentHeads", "Guidance"]
  },
  {
    id: 4,
    title: "TechAstra Department Inauguration & Felicitations",
    category: "Celebrations & Faculty",
    year: "Last Event",
    caption: "Faculty coordinators, professors, and organizing student committee members celebrating the grand launch and felicitations of TechAstra.",
    image: "/images/gallery/gallery_department_celebration.jpg",
    tags: ["Inauguration", "DepartmentCelebration", "FacultyAndStudents", "LastEventMemories"]
  },
  {
    id: 5,
    title: "Stage Ceremonies & Faculty Dignitaries",
    category: "Stage & Ceremonies",
    year: "Last Event",
    caption: "Honorable faculty members, department heads, and anchor leads gracing the grand inauguration stage of TechAstra.",
    image: "/images/gallery/gallery_stage_dignitaries.jpg",
    tags: ["Inauguration", "Dignitaries", "DepartmentHeads", "StageEvent"]
  },
  {
    id: 6,
    title: "Grand Valedictory & Traditional Celebration",
    category: "Celebrations",
    year: "Last Event",
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
      "Dedicated Workstation & High-Speed Wi-Fi Zone",
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
      "Guaranteed Entry to 48-Hr Flagship Hackathon",
      "Covers entire team of up to 4 members",
      "Midnight Meals, Energy Drinks & Snacks",
      "Direct 1-on-1 Mentorship from Tech Leads",
      "Eligible for ₹2.5L+ Cash Prizes & Pool Awards",
      "Cloud Developer Sandbox & Infrastructure Access"
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
      "Direct 1-on-1 Mentorship & Industry Jury Feedback",
      "Fast-Track Gate Check-in & Priority Wi-Fi Zone",
      "VIP Certificate of Excellence & Networking Access"
    ],
    popular: false,
    color: "from-amber-500 to-rose-600"
  }
];

export const FAQ_LIST = [
  {
    q: "Who is eligible to participate in TechAstra 2026?",
    a: "Any undergraduate or postgraduate student currently enrolled in any recognized college/university across India is welcome to participate! Valid College ID is mandatory at the gate."
  },
  {
    q: "Can I participate individually in the hackathon?",
    a: "The Flagship Hackathon allows teams of 2 to 4 members. You can either register with your squad or join our discord/on-campus team formation mixer on Day 1. Solo attendees can also participate in Algorithmic Duels and Workshops!"
  },
  {
    q: "How does the payment and ticket confirmation work?",
    a: "Payments are processed directly via official UPI (Google Pay, PhonePe, Paytm, BHIM, QR code). Upon submitting your 12-digit UTR/transaction reference, your official entry ticket and unique QR pass are generated instantly."
  },
  {
    q: "Will accommodation and food be provided?",
    a: "Yes! All registered participants receive complimentary meals, refreshments, and midnight snacks during hackathon hours. Outstation hostel accommodation can be requested post-registration."
  },
  {
    q: "Where is the venue and how do I contact the organizing committee?",
    a: "TechAstra 2026 is hosted on-campus at Smt. Chandibai Himathmal Mansukhani College, organized by the Department of Data Science under Club Data Decoder. For queries, sponsorships, or urgent support, reach out via email at algonexusdschm@gmail.com or mobile at +91 80100 86323."
  }
];
