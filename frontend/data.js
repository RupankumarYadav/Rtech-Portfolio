/* ============================================================
   data.js — RTech Portfolio Data File
   
   ✅ Yahan se saara data update karo
   ✅ Koi bhi cheez change karni ho — sirf yahi file kholo
   ✅ Backend connect hone ke baad yeh file replace ho jayegi
   ============================================================ */

const PORTFOLIO_DATA = {

  /* ── PERSONAL INFO ─────────────────────────────────────── */
  personal: {
    name:        "Rupan Kumar Yadav",
    brand:       "RTech",
    role:        "Full Stack Developer",
    tagline:     "I build powerful backends with Java & Spring Boot and beautiful frontends with HTML, CSS & JavaScript.",
    location:    "India",
    email:       "rupantech2026@gmail.com",          // ←  email 
    phone:       "+91 91235 43857",                 // ← phone 
    github:      "github.com/RupankumarYadav",     // ← GitHub 
    linkedin:    "linkedin.com/in/rupan-kumar-yadav",   // ← LinkedIn 
    degree:      "B.Tech CS",
    status:      "Available",
    available:   true,
    photo:       "",  // ← photo path daalo jaise "assets/photo.jpg"
  },

  /* ── TYPING ROLES (hero section mein type hote hain) ───── */
  roles: [
    "Full Stack Developer",
    "Java Backend Developer",
    "Web Developer",
    "MySQL Expert",
  ],

  /* ── HERO STATS ─────────────────────────────────────────── */
  stats: [
    { number: "2+",  label: "Years Learning"  },
    { number: "10+", label: "Projects Built"  },
    { number: "5+",  label: "Technologies"    },
  ],

  /* ── ABOUT ──────────────────────────────────────────────── */
  about: [
    "I am <strong>Rupan Kumar Yadav</strong>, a passionate Full Stack Developer from India. <strong>RTech</strong> is my personal brand where I showcase my technology journey.",
    "I build robust backend systems using Java and Spring Boot, and create clean, responsive frontend interfaces using HTML, CSS and JavaScript. MySQL is my primary database.",
    "My goal is to build software that solves real problems and delivers an excellent user experience.",
  ],

  /* ── EDUCATION ──────────────────────────────────────────── */
  education: [
    {
      year:   "2023 - 2027",
      degree: "B.Tech — Computer Science & Engineering",
      school: "Jagannath University Jaipur",   // ← university naam 
    },
    {
      year:   "2020 - 2022",
      degree: "12th — Science (PCM)",
      school: "MAHATMA GANDHI COLL,SUNDARPUR,DARBHANGA",       // ←  school naam
    },
    {
      year:   "2020",
      degree: "10th — CBSE Board",
      school: "NAVUTTKRAMIT M S BHAIRAGHAI, MADHUBANI",       // ← school 
    },
  ],

  /* ── SKILLS ─────────────────────────────────────────────── */
  // ✅ Naye skill cards add karne ke liye bas neeche add karo
  skills: [
    {
      icon: "☕",
      name: "Backend",
      color: "purple",
      tags: ["Java", "Spring Boot", "Spring MVC", "REST API", "Hibernate", "JPA", "Maven"],
    },
    {
      icon: "🌐",
      name: "Frontend",
      color: "cyan",
      tags: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "Responsive Design", "Fetch API"],
    },
    {
      icon: "🗄️",
      name: "Database",
      color: "green",
      tags: ["MySQL", "PostgreSQL", "MongoDB", "Redis"],
    },
    {
      icon: "🛠️",
      name: "Tools",
      color: "orange",
      tags: ["Git", "GitHub", "Docker", "Postman", "IntelliJ IDEA", "VS Code"],
    },
    {
      icon: "🧩",
      name: "Core Concepts",
      color: "purple",
      tags: ["DSA", "OOP", "System Design", "Microservices", "Agile"],
    },
    {
      icon: "🚀",
      name: "Currently Learning",
      color: "cyan",
      tags: ["React.js", "AWS", "Kubernetes", "CI/CD"],
    },
  ],

  /* ── PROJECTS ───────────────────────────────────────────── */
  // ✅ Naye projects add karne ke liye bas neeche add karo
  // banner colors: "blue" | "teal" | "purple" | "red" | "green" | "orange"
  projects: [
    {
      id:          "ecommerce-platform",
      emoji:       "🛒",
      banner:      "blue",
      title:       "E-Commerce Platform",
      description: "Full-stack shopping platform with product management, cart system, order tracking and payment integration.",
      tech:        ["Java", "Spring Boot", "HTML/CSS/JS", "MySQL"],
      github:      "#",   // ←  GitHub link 
      demo:        "#",   // ←  Live Demo link 
    },
    {
      id:          "task-management",
      emoji:       "📋",
      banner:      "teal",
      title:       "Task Management System",
      description: "Project management tool with Kanban boards, team collaboration, task assignment and deadline tracking.",
      tech:        ["Spring Boot", "JavaScript", "MySQL", "JWT Auth"],
      github:      "#",
      demo:        "#",
    },
    {
      id:          "hospital-management",
      emoji:       "🏥",
      banner:      "purple",
      title:       "Hospital Management System",
      description: "Comprehensive HMS with patient registration, doctor scheduling, appointment booking and billing module.",
      tech:        ["Java", "Hibernate", "MySQL", "HTML/CSS"],
      github:      "#",
      demo:        "#",
    },
    {
      id:          "chat-app",
      emoji:       "💬",
      banner:      "red",
      title:       "Real-Time Chat App",
      description: "WebSocket-based chat with rooms, private messaging, online status and message history in MySQL.",
      tech:        ["Spring WebSocket", "JavaScript", "MySQL", "STOMP"],
      github:      "#",
      demo:        "#",
    },
  ],

  /* ── ACHIEVEMENTS & CERTIFICATIONS ─────────────────────── */
  // ✅ Naye achievements add karne ke liye bas copy paste karo
  achievements: [
    {
      icon: "🏆",
      title: "Java Full Stack Development",
      issuer: "Apna College / Udemy",
      date: "2024",
      color: "purple",
      link: "#"
    },
    {
      icon: "📜",
      title: "MySQL Database Management",
      issuer: "Coursera",
      date: "2024",
      color: "cyan",
      link: "#"
    },
    {
      icon: "⭐",
      title: "Spring Boot Microservices",
      issuer: "Udemy",
      date: "2023",
      color: "green",
      link: "#"
    },
    {
      icon: "🎯",
      title: "DSA Problem Solving",
      issuer: "LeetCode / GeeksforGeeks",
      date: "2023",
      color: "orange",
      link: "#"
    },
    
  ],

};
