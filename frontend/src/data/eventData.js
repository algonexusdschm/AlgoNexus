// Data store for TechAstra 2026: AI in EduTech National Hackathon

export const EVENT_DETAILS = {
  name: "TechAstra 2026",
  subtitle: "AI in EduTech National Hackathon",
  tagline: "Building the Future of Education with Intelligent Systems: AI • ML • RAG • NLP • CV",
  edition: "Flagship National Edition",
  dates: "To Be Announced Soon",
  datesAnnounced: false,
  registrationOpen: true,
  targetDate: "2026-10-16T09:00:00+05:30",
  venue: "Smt. Chandibai Himathmal Mansukhani College",
  location: "Smt. Chandibai Himathmal Mansukhani College, Ulhasnagar, Maharashtra",
  college: "Smt. Chandibai Himathmal Mansukhani College",
  department: "Department of Data Science",
  club: "Club Data Decoder",
  email: "algonexusdschm@gmail.com",
  phone: "+91 9604449724",
  helpline: "+91 9604449724",
  organizers: "Club Data Decoder, Department of Data Science, Smt. Chandibai Himathmal Mansukhani College",
  prizePool: "₹1,00,000",
  participantsExpected: "300+ Innovators & Hackers",
  collegesExpected: "80+ Universities Across India",
  
  // College & Department Leadership
  principal: {
    title: "Principal",
    name: "Dr. Manju Lalwani Pathak",
    college: "Smt. Chandibai Himathmal Mansukhani College"
  },
  coordinator: {
    title: "Course Co-ordinator",
    name: "Dr. Shiji Johnson",
    role: "Course Co-ordinator, Department of Data Science"
  },
  teachers: [
    { name: "Ms. Razia Khan", role: "Assistant Professor, Department of Data Science" },
    { name: "Ms. Kalyani Patil", role: "Assistant Professor, Department of Data Science" },
    { name: "Mr. Anshul Chimnani", role: "Assistant Professor, Department of Data Science" }
  ]
};

export const FACULTY_COMMITTEE = [
  {
    role: "Principal",
    name: "Dr. Manju Lalwani Pathak",
    dept: "Smt. CHM College",
    badge: "Principal",
    accent: "amber"
  },
  {
    role: "Course Co-ordinator",
    name: "Dr. Shiji Johnson",
    dept: "Department of Data Science",
    badge: "Course Co-ordinator",
    accent: "blue"
  },
  {
    role: "Teacher",
    name: "Ms. Razia Khan",
    dept: "Department of Data Science",
    badge: "Teacher",
    accent: "indigo"
  },
  {
    role: "Teacher",
    name: "Ms. Kalyani Patil",
    dept: "Department of Data Science",
    badge: "Teacher",
    accent: "sky"
  },
  {
    role: "Teacher",
    name: "Mr. Anshul Chimnani",
    dept: "Department of Data Science",
    badge: "Teacher",
    accent: "purple"
  }
];

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
    caption: "Honorable faculty coordinators, department mentors, and anchor student leads gathered during TechAstra ceremonies.",
    image: "/images/gallery/gallery_stage_dignitaries.jpg",
    tags: ["Inauguration", "Dignitaries", "DepartmentHeads", "StageEvent"]
  },
  {
    id: 6,
    title: "Grand Valedictory & Fest Celebrations",
    category: "Celebrations",
    year: "Last Event",
    caption: "Student council leads, organizing committee members, and coordinators celebrating the triumphant culmination of the fest.",
    image: "/images/gallery/gallery_cultural_celebration.jpg",
    tags: ["Valedictory", "StudentCouncil", "Celebration", "FestiveMoments"]
  }
];

export const EVENT_TRACKS = [
  {
    id: "rag-knowledge",
    node: "RAG",
    name: "RAG & Knowledge Retrieval in EduTech",
    icon: "Database",
    color: "from-blue-600 to-cyan-500",
    badge: "Vector Knowledge",
    desc: "Build factual retrieval engines, verified textbook search systems, and automated curriculum grounded Q&A with vector embeddings.",
    prize: "₹30,000 Cash Pool"
  },
  {
    id: "nlp-tutoring",
    node: "NLP",
    name: "NLP & Intelligent Tutoring Systems",
    icon: "BrainCircuit",
    color: "from-purple-600 to-indigo-500",
    badge: "Conversational AI",
    desc: "Create 24/7 multimodal AI mentors, real-time code debugging assistants, automated rubric essay grading, and vernacular language translators.",
    prize: "₹30,000 Cash Pool"
  },
  {
    id: "cv-classroom",
    node: "CV",
    name: "Computer Vision & Spatial Classrooms",
    icon: "Scan",
    color: "from-emerald-600 to-teal-500",
    badge: "Visual Intelligence",
    desc: "Digitize handwritten math equations, build smart attention & engagement analytics, remote AI proctoring, and AR spatial learning labs.",
    prize: "₹25,000 Cash Pool"
  },
  {
    id: "ml-predictive",
    node: "ML",
    name: "Machine Learning & Adaptive Pacing",
    icon: "Network",
    color: "from-amber-500 to-orange-500",
    badge: "Predictive Analytics",
    desc: "Develop dynamic difficulty adjustment engines, early dropout warning algorithms, and personalized curriculum path recommenders.",
    prize: "₹25,000 Cash Pool"
  },
  {
    id: "ai-agents",
    node: "AI Core",
    name: "Autonomous Agents for Education",
    icon: "Cpu",
    color: "from-cyan-500 to-blue-600",
    badge: "Foundation Models",
    desc: "End-to-end multi-agent educational workflows where autonomous AI teachers, graders, and research assistants collaborate seamlessly.",
    prize: "₹30,000 Cash Pool"
  }
];

export const REGISTRATION_TIERS = [
  {
    id: "hackathon-squad",
    name: "Hackathon Squad Pass (Team 2-4)",
    badge: "Flagship Squad Pass",
    price: 1000,
    currency: "INR",
    type: "team",
    features: [
      "Guaranteed Entry to 48-Hour Flagship Hackathon",
      "Covers entire team of up to 4 members (Flat ₹1,000 / squad pass)",
      "Midnight Meals, Energy Drinks, Lunch & Snacks",
      "Direct 1-on-1 Mentorship from Leading AI & Data Science Industry Experts",
      "Eligible for ₹1,00,000+ Cash Prize Pool & Track Awards",
      "High-Speed Campus Wi-Fi & AI Developer Sandbox Access",
      "Official Verified Participation Certificates & Swag Kits"
    ],
    popular: true,
    color: "from-blue-600 to-indigo-600"
  }
];

export const FAQ_LIST = [
  {
    q: "Who is eligible to participate in TechAstra 2026?",
    a: "Any undergraduate or postgraduate student currently enrolled in any recognized college/university across India is welcome to participate! Valid College ID is mandatory at the gate."
  },
  {
    q: "Can I participate individually in the hackathon?",
    a: "The Flagship Hackathon allows teams of 2 to 4 members. You can either register with your squad or join our team formation mixer on Day 1. Solo innovators can also participate in individual tracks and tech keynotes!"
  },
  {
    q: "What tools and models are permitted in the AI in EduTech hackathon?",
    a: "All open-source and proprietary foundation models, APIs, vector databases (Pinecone, Chroma, Milvus, Qdrant), LangChain, LlamaIndex, PyTorch, TensorFlow, and Hugging Face are fully permitted. Submissions must include genuine implementation and integration."
  },
  {
    q: "How does the payment and ticket confirmation work?",
    a: "Payments are processed directly via official UPI (Google Pay, PhonePe, Paytm, BHIM, QR code). Upon submitting your 12-digit UTR/transaction reference, your official entry ticket and unique QR pass are generated instantly."
  },
  {
    q: "Will accommodation and food be provided?",
    a: "Yes! All registered participants receive complimentary meals, refreshments, and midnight snacks during hackathon hours. Outstation accommodation guidance can be requested post-registration."
  },
  {
    q: "Where is the venue and how do I contact the organizing committee?",
    a: "TechAstra 2026 is hosted on-campus at Smt. Chandibai Himathmal Mansukhani College, organized by the Department of Data Science under Club Data Decoder. Under the leadership of Principal Dr. Manju Lalwani Pathak, Course Co-ordinator Dr. Shiji Johnson, and Teachers Ms. Razia Khan, Ms. Kalyani Patil, and Mr. Anshul Chimnani. Reach out via email at algonexusdschm@gmail.com or mobile at +91 9604449724."
  }
];
