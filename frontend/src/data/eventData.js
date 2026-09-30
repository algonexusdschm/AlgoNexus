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
    title: "36-Hour Hackathon Arena at 2:00 AM",
    category: "Hackathons",
    year: "2025",
    caption: "Teams burning the midnight oil to build AI-driven solutions during the intense 36-hr coding sprint.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    tags: ["Hackathon", "NightCoding", "AI/ML"]
  },
  {
    id: 2,
    title: "Grand Keynote on Distributed AI",
    category: "Stage & Keynotes",
    year: "2025",
    caption: "Chief Guest & Industry Architect delivering the keynote to over 1,200 enthusiastic engineering students.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    tags: ["Keynote", "MainAuditorium", "TechTalks"]
  },
  {
    id: 3,
    title: "1v1 Speed Algo Debugging Arena",
    category: "Competitions",
    year: "2025",
    caption: "High-stakes algorithmic duels on projector screens with real-time test case validation.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    tags: ["CompetitiveProgramming", "SpeedCoding", "C++"]
  },
  {
    id: 4,
    title: "Robo-Combat & Autonomous Maze Solvers",
    category: "Competitions",
    year: "2025",
    caption: "Custom microcontroller bots competing in obstacle navigation and wired battle bots cage match.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    tags: ["Robotics", "IoT", "Hardware"]
  },
  {
    id: 5,
    title: "Winners Holding Grand Cheque ₹1,00,000",
    category: "Prize Ceremony",
    year: "2025",
    caption: "Team 'BitShift' from IIT Madras taking home the AlgoNexus 2025 Grand Champion trophy & cash prize.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    tags: ["Prizes", "Champions", "Celebration"]
  },
  {
    id: 6,
    title: "Hands-on Generative AI & LLM Workshop",
    category: "Stage & Keynotes",
    year: "2025",
    caption: "Practical masterclass on fine-tuning open source models and deploying vector embeddings.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    tags: ["Workshop", "GenAI", "HandsOn"]
  },
  {
    id: 7,
    title: "Food Truck Street & Networking Lounge",
    category: "Campus Vibes",
    year: "2025",
    caption: "Vibrant college lawns with music, midnight coffee, waffle booths, and startup founder networking.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    tags: ["Networking", "CampusLife", "NightFest"]
  },
  {
    id: 8,
    title: "Hardware Hackers & Embedded Breadboards",
    category: "Hackathons",
    year: "2025",
    caption: "Soldering and tinkering with ESP32s, sensors, and drones during the 24-hr IoT track.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    tags: ["IoT", "Makers", "Hardware"]
  },
  {
    id: 9,
    title: "Closing Musical Night & After-Party",
    category: "Campus Vibes",
    year: "2025",
    caption: "Electrifying EDM concert celebrating three days of non-stop creativity and engineering brilliance.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    tags: ["MusicNight", "AfterParty", "Vibes"]
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
