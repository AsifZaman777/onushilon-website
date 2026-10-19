"use client";
import { useRef, useState, useEffect } from "react";
import {
  motion, AnimatePresence, useScroll, useTransform, useSpring,
  useMotionValue, useInView, animate, useReducedMotion,
} from "framer-motion";
import { IMG, LOGO, PHONE, PHONE_HREF, WHATSAPP_URL, HERO_CARD_STREAMS, ALL_PHOTOS } from "../lib/assets";

const NAV = [
  ["home", "Home"],
  ["story", "Our story"],
  ["courses", "Courses"],
  ["mentors", "Mentors"],
  ["practice", "Practice"],
  ["moments", "Class moments"],
  ["why", "Why us"],
  ["voices", "Students"],
  ["faq", "FAQ"],
  ["join", "Enrol"],
];

const COURSES = [
  {
    id: "robotic",
    t: "Robotics & STEM Automation",
    c: "Robotics & Tech",
    d: "4 months",
    l: "Hands-on Lab",
    p: "৳5,500",
    i: "c4",
    mentor: "Engr. Nayeem Siddique (Robotics Specialist)",
    schedule: "Fri & Sat • 4:00 PM",
    seats: "6 seats left",
    topics: ["Microcontroller Architecture & Arduino", "Sensor Integration & Motor Drivers", "Autonomous Line & Maze Following Bots", "Final Exhibition Hardware Capstone"],
  },
  {
    id: "art",
    t: "Creative Arts & Painting Studio",
    c: "Arts & Sports",
    d: "3 months",
    l: "Studio sessions",
    p: "৳3,600",
    i: "c5",
    mentor: "Shabnam Mustari (Fine Arts Master)",
    schedule: "Sun & Wed • 4:30 PM",
    seats: "8 seats left",
    topics: ["Graphite Shading & Perspective Rules", "Acrylic & Watercolor Color Theory", "Composition & Landscape Painting", "Annual Academy Exhibition Showcase"],
  },
  {
    id: "hsc",
    t: "HSC Physics & Chemistry",
    c: "Academic",
    d: "6 months",
    l: "Live + recorded",
    p: "৳4,500",
    i: "c1",
    mentor: "Engr. Tanvir Ahmed (BUET)",
    schedule: "Sun, Tue & Thu • 8:00 PM",
    seats: "14 seats left",
    topics: ["Kinematics & Dynamics", "Electricity & Magnetism", "Organic Chemistry Mechanisms", "Weekly CQ & MCQ Mock Tests"],
  },
  {
    id: "webdev",
    t: "Web Development & Coding Basics",
    c: "Skills",
    d: "4 months",
    l: "Project based",
    p: "৳6,000",
    i: "c3",
    mentor: "Arif Hossain (Senior Frontend Dev)",
    schedule: "Fri & Sat • 9:00 PM",
    seats: "6 seats left",
    topics: ["HTML5 & Modern Flex/Grid", "JavaScript ES6+ & DOM Logic", "React & Interactive UI Components", "Building 5 Real Portfolio Projects"],
  },
  {
    id: "karate",
    t: "Karate & Self Defense Academy",
    c: "Arts & Sports",
    d: "6 months",
    l: "Dojo sessions",
    p: "৳3,200",
    i: "c7",
    mentor: "Sensei Mahmudul Hasan (Black Belt 3rd Dan)",
    schedule: "Sat & Mon • 7:00 AM",
    seats: "10 seats left",
    topics: ["Kihon (Stances, Punches & Blocks)", "Kata Forms & Mindful Breathing", "Kumite Self-Defense Techniques", "Official Belt Rank Grading Exams"],
  },
  {
    id: "spoken",
    t: "Spoken English & Fluency",
    c: "Language",
    d: "3 months",
    l: "Live classes",
    p: "৳2,800",
    i: "c2",
    mentor: "Farhana Kabir (IELTS 8.5)",
    schedule: "Mon & Wed • 7:30 PM",
    seats: "8 seats left",
    topics: ["Phonics & Accent Reduction", "Everyday Conversation Fluency", "Public Speaking Mastery", "1-on-1 Speaking Drill Breakouts"],
  },
  {
    id: "hardware",
    t: "Hardware, Circuits & Repair",
    c: "Robotics & Tech",
    d: "3 months",
    l: "Lab workshop",
    p: "৳4,800",
    i: "c6",
    mentor: "Mehedi Hasan (Electronics Lead)",
    schedule: "Tue & Thu • 5:00 PM",
    seats: "7 seats left",
    topics: ["Multimeter & Circuit Diagnostics", "PC Assembly & Component Troubleshooting", "Soldering & Power Supply Testing", "Real Device Maintenance Drills"],
  },
  {
    id: "green",
    t: "Grow With Green: Nature & STEM",
    c: "Academic",
    d: "2 months",
    l: "Outdoor & Lab",
    p: "৳2,500",
    i: "c8",
    mentor: "Dr. Farzana Yasmin (Agricultural Scientist)",
    schedule: "Fri morning • 9:00 AM",
    seats: "12 seats left",
    topics: ["Botany & Photosynthesis Experiments", "Soil Chemistry & Composting Labs", "Urban Hydroponics & Gardening", "Ecosystem Preservation Projects"],
  },
  {
    id: "ssc",
    t: "SSC Higher Mathematics",
    c: "Academic",
    d: "5 months",
    l: "Live + recorded",
    p: "৳3,800",
    i: "c9",
    mentor: "Shafiqul Islam (DU Applied Math)",
    schedule: "Sat, Mon & Wed • 6:30 PM",
    seats: "12 seats left",
    topics: ["Algebra, Sets & Functions", "Trigonometric Identities & Heights", "Geometry Proofs with Shortcuts", "10 Years Past Board Paper Drills"],
  },
];

const MENTORS = [
  {
    id: "m_robotic",
    name: "Engr. Nayeem Siddique",
    role: "Robotics & STEM Lead",
    edu: "Mechatronics Engineer (BUET)",
    dept: "Robotics & Tech",
    badge: "🤖",
    badgeFull: "Robotics Lab",
    img: "/images/photos/robotic_class1.jpg",
    course: "Robotics & STEM Automation",
    stats: "6+ Yrs • 1,200+ Students",
    bio: "Passionate about empowering young innovators to design circuits, write clean microcontroller code, and construct functional autonomous bots from scratch.",
  },
  {
    id: "m_art",
    name: "Shabnam Mustari",
    role: "Master Fine Arts Mentor",
    edu: "Faculty of Fine Arts (DU)",
    dept: "Creative Arts",
    badge: "🎨",
    badgeFull: "Fine Arts",
    img: "/images/photos/art_class1.jpg",
    course: "Creative Arts & Painting Studio",
    stats: "8+ Yrs • 950+ Artists",
    bio: "Technique is learned through patient brushwork; vision is unlocked when mentors encourage freedom of expression.",
  },
  {
    id: "m_physics",
    name: "Engr. Tanvir Ahmed",
    role: "Physics & Chemistry Lead",
    edu: "B.Sc. Engineering (BUET)",
    dept: "Academic & Science",
    badge: "🔬",
    badgeFull: "Science Lab",
    img: "/images/photos/classroom1.jpg",
    course: "HSC Physics & Chemistry",
    stats: "9+ Yrs • 3,400+ Achievers",
    bio: "No memorizing formulas without visualizing the motion. Solve the physical logic first, and the numbers follow naturally.",
  },
  {
    id: "m_webdev",
    name: "Arif Hossain",
    role: "Web & Software Lead",
    edu: "Senior Frontend Developer",
    dept: "Robotics & Tech",
    badge: "💻",
    badgeFull: "Coding Lab",
    img: "/images/photos/computer_learning.jpg",
    course: "Web Development & Coding Basics",
    stats: "7+ Yrs • 1,500+ Devs Trained",
    bio: "You only learn code by writing bugs and fixing them live. We build real, deployable portfolio projects in every single sprint.",
  },
  {
    id: "m_karate",
    name: "Sensei Mahmudul Hasan",
    role: "Chief Martial Arts Sensei",
    edu: "Black Belt 3rd Dan Medalist",
    dept: "Arts & Sports",
    badge: "🥋",
    badgeFull: "Karate Dojo",
    img: "/images/photos/karate_class1.jpg",
    course: "Karate & Self Defense Academy",
    stats: "10+ Yrs • 800+ Belts Graded",
    bio: "True karate is not about fighting; it builds unwavering focus, mental discipline, humility, and everyday courage.",
  },
  {
    id: "m_spoken",
    name: "Farhana Kabir",
    role: "Spoken English Coach",
    edu: "IELTS 8.5 • British Council",
    dept: "Language & Skills",
    badge: "🗣️",
    badgeFull: "Spoken Fluency",
    img: "/images/photos/learn_with_fun.jpg",
    course: "Spoken English & Fluency",
    stats: "5+ Yrs • 2,100+ Speakers",
    bio: "Fluency is a habit, not an exam. Our interactive drills break hesitation from day one and give students real stage confidence.",
  },
  {
    id: "m_hardware",
    name: "Mehedi Hasan",
    role: "Hardware & Electronics Lead",
    edu: "Electronics Lab Director",
    dept: "Robotics & Tech",
    badge: "⚡",
    badgeFull: "Hardware Lab",
    img: "/images/photos/harware_fix_learning.jpg",
    course: "Hardware, Circuits & Repair",
    stats: "6+ Yrs • 900+ Lab Grads",
    bio: "Understanding how motherboards, power supplies, and traces work demystifies technology and sparks genuine engineering curiosity.",
  },
  {
    id: "m_math",
    name: "Shafiqul Islam",
    role: "Higher Mathematics Lead",
    edu: "M.Sc. Applied Math (DU)",
    dept: "Academic & Science",
    badge: "📐",
    badgeFull: "Math Session",
    img: "/images/photos/classroom3.jpg",
    course: "SSC Higher Mathematics",
    stats: "8+ Yrs • 2,800+ Achievers",
    bio: "Mathematics becomes joyous when you see the shortcut and the algebraic proof working together in harmony.",
  },
  {
    id: "m_agri",
    name: "Dr. Farzana Yasmin",
    role: "Green Science & Biology",
    edu: "Ph.D. Agricultural Science",
    dept: "Academic & Science",
    badge: "🌱",
    badgeFull: "Green Science",
    img: "/images/photos/grow_with_green.jpg",
    course: "Young Green Innovators",
    stats: "7+ Yrs • 650+ Researchers",
    bio: "Nurturing ecological awareness through hands-on botanical experiments and scientific discovery creates responsible scientists.",
  },
  {
    id: "m_iot",
    name: "Sadman Al-Amin",
    role: "IoT & Automation Coach",
    edu: "B.Sc. CSE • Embedded Systems",
    dept: "Robotics & Tech",
    badge: "⚙️",
    badgeFull: "IoT Automation",
    img: "/images/photos/robotic_class3.jpg",
    course: "Robotics & STEM Automation",
    stats: "5+ Yrs • 780+ Builders",
    bio: "Connecting physical hardware to intelligent cloud dashboards gives students the superpower of building real-world smart devices.",
  },
];

const MOMENTS = [
  {
    id: "m1",
    t: "Sensor Programming & Mechanics",
    c: "Robotics & STEM",
    tag: "Robotics Lab",
    img: "m1",
    desc: "Learners calibrating infrared sensors and programming motor drivers on autonomous obstacle-avoiding chassis.",
  },
  {
    id: "m2",
    t: "Fine Art Shading & Perspective Workshop",
    c: "Creative Arts",
    tag: "Art Studio",
    img: "m2",
    desc: "Students mastering light, shadow, and tonal gradations using graphite and charcoal under guidance.",
  },
  {
    id: "m3",
    t: "Interactive Science & Physics Classroom",
    c: "Academic",
    tag: "Smart Classroom",
    img: "m3",
    desc: "Step-by-step problem breakdown on kinematics and vector mechanics with live student participation.",
  },
  {
    id: "m4",
    t: "Martial Arts Dojo & Physical Discipline",
    c: "Active & Sports",
    tag: "Karate Dojo",
    img: "m4",
    desc: "Instilling focus, agility, self-defense discipline, and posture alignment in our weekly karate class.",
  },
  {
    id: "m5",
    t: "Digital Literacy & Computer Basics Lab",
    c: "Tech & Coding",
    tag: "Computer Lab",
    img: "m5",
    desc: "Hands-on software exploration, keyboard mastery, and coding fundamentals in our dedicated workstation lab.",
  },
  {
    id: "m6",
    t: "Hardware Diagnostics & Circuit Assembly",
    c: "Tech & Coding",
    tag: "Hardware Lab",
    img: "m6",
    desc: "Testing motherboard continuity, breadboard circuits, and diagnosing power supply issues safely.",
  },
  {
    id: "m7",
    t: "Grow With Green Outdoor Science Discovery",
    c: "Academic",
    tag: "Nature & Botany",
    img: "m7",
    desc: "Hands-on environmental botany where young students learn plant life cycles, soil ecosystems, and sustainability.",
  },
  {
    id: "m8",
    t: "Championship Bot Chassis Assembling",
    c: "Robotics & STEM",
    tag: "Robotics Lab",
    img: "m8",
    desc: "Constructing custom gear assemblies and aluminum frames for regional STEM robotics exhibitions.",
  },
  {
    id: "m9",
    t: "Color Theory & Creative Painting",
    c: "Creative Arts",
    tag: "Art Studio",
    img: "m9",
    desc: "Young artists blending primary and complementary hues to produce imaginative canvas paintings.",
  },
  {
    id: "m10",
    t: "Capstone Project Peer Collaboration",
    c: "Robotics & Tech",
    tag: "Project Lab",
    img: "m10",
    desc: "Students combining coding, hardware, and design to build full working prototypes together.",
  },
  {
    id: "m11",
    t: "Interactive Team Logic & Fun Challenges",
    c: "Academic",
    tag: "Fun & Learning",
    img: "m11",
    desc: "Engaging classroom games and collaborative quizzes that make complex concepts unforgettable.",
  },
  {
    id: "m12",
    t: "STEM Robotics Starter Workshop",
    c: "Robotics & STEM",
    tag: "Robotics Lab",
    img: "m12",
    desc: "Beginning robotics students discovering gear ratios, pulley dynamics, and foundational circuits.",
  },
];

const PRACTICE_TASKS = [
  {
    subject: "HSC Physics",
    topic: "Work, Power & Energy",
    question: "A body of mass 2 kg is dropped from a height of 10m. What is its kinetic energy just before hitting the ground? (Take g = 9.8 m/s²)",
    options: ["98 Joules", "196 Joules", "392 Joules", "49 Joules"],
    correct: 1,
    explanation: "By conservation of mechanical energy, Potential Energy at top = Kinetic Energy at bottom. KE = m × g × h = 2 kg × 9.8 m/s² × 10m = 196 Joules.",
    mentorNote: "Classic conservation of energy! Remember: you don't even need to calculate velocity first.",
  },
  {
    subject: "Spoken English",
    topic: "Natural Fluency",
    question: "Which response sounds most natural when a colleague thanks you for helping them with an important project?",
    options: [
      "No problem, don't mention it at all!",
      "I was strictly obligated by my duty to assist.",
      "Glad I could help! Let me know if you need anything else.",
      "It is my extreme formal pleasure and honor.",
    ],
    correct: 2,
    explanation: "'Glad I could help!' is warm, polite, and universally used in both conversational and professional workplace environments.",
    mentorNote: "Tone is as vital as grammar! Natural friendly phrasing leaves the strongest positive impression.",
  },
  {
    subject: "Web Development",
    topic: "Modern CSS",
    question: "What is the cleanest modern CSS rule to center a child item both horizontally and vertically inside its container?",
    options: [
      "display: flex; justify-content: center; align-items: center;",
      "margin: auto; float: center; align: center;",
      "text-align: center; vertical-align: middle;",
      "position: absolute; left: 50%; right: 50%;",
    ],
    correct: 0,
    explanation: "Flexbox with 'justify-content: center' (main axis) and 'align-items: center' (cross axis) centers children predictably across any viewport.",
    mentorNote: "Spot on! Flexbox or CSS Grid ('display: grid; place-items: center;') are current industry best practices.",
  },
];

const FAQS = [
  {
    q: "What happens if I miss a live class?",
    a: "Every live class is recorded in HD and posted on your student portal within 2 hours. You get lifetime access to all recordings, the mentor's slide annotations, and daily practice sets.",
  },
  {
    q: "How does the 24-hour mentor feedback work?",
    a: "After each lesson, you solve and submit your practice task on the student portal. Your assigned subject mentor reviews your steps, calculations, or code line-by-line and leaves personalized written and audio notes within 24 hours.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept bKash, Nagad, Rocket, all major local credit/debit cards, and bank transfers. For courses 4 months or longer, you can pay in two convenient monthly installments with 0% extra fee.",
  },
  {
    q: "Will I receive a verified certificate upon completion?",
    a: "Yes! Students who submit at least 80% of daily practice tasks and pass the final mock exam receive a verified digital certificate shareable on LinkedIn and your CV.",
  },
  {
    q: "Can I pause or transfer batches if my college exams clash?",
    a: "Yes! We provide one free batch pause or transfer per student so your learning journey adapts seamlessly around your academic exam schedule.",
  },
];

const STORY = [
  ["2014", "Five students, one rented room, and a rule: every lesson ends with practice."],
  ["2018", "We opened a second branch and began recording every class for revision."],
  ["2022", "Onushilon went online. Students from 40 districts joined live."],
  ["Today", "Over 12,000 learners practise with us every week."],
];

const VOICES = [
  ["The art mentors here don't just teach techniques; they helped me discover my own painting style. Seeing my artwork on exhibition was a dream come true!", "Tasnim Akter", "Creative Arts & Design graduate", "t1"],
  ["Building and programming an autonomous robot with my own hands was unforgettable. The robotics lab mentors guided us through every sensor and circuit.", "Sadman Sakib", "Robotics & STEM batch 2024", "t2"],
  ["Practice every single day finally made physics equations click for me. My mentor reviewed every step of my solution, not just the final number.", "Nusrat Jahan", "HSC Science achiever, Dhaka", "t3"],
  ["I was terrified of speaking English in public. The interactive fun sessions and 1-on-1 speaking drills completely transformed my fluency and confidence.", "Rafiul Islam", "Spoken English graduate", "t4"],
];

/* Image with a coloured placeholder until a file path is set in lib/assets.js */
const Pic = ({ k, alt = "", cls = "", style, children }) => (
  <div className={`ph ${cls}`} style={style}>
    {IMG[k] && <img src={IMG[k]} alt={alt} loading="lazy" />}
    {children}
  </div>
);

function Count({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const v = useMotionValue(0);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(v, to, { duration: 2, ease: "easeOut", onUpdate: (x) => setN(Math.round(x)) });
    return c.stop;
  }, [inView, to, v]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

function Tilt({ children, className, onClick }) {
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 200, damping: 18 }), sy = useSpring(ry, { stiffness: 200, damping: 18 });
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  return (
    <motion.div
      className={className}
      style={{ rotateX: sx, rotateY: sy, transformPerspective: 900 }}
      onMouseMove={move}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
      onClick={onClick}
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
    >
      {children}
    </motion.div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress, scrollY } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  useEffect(() => {
    setScrolled(scrollY.get() > 100);
    const unsub = scrollY.on("change", (latest) => {
      setScrolled(latest > 100);
    });
    return () => unsub();
  }, [scrollY]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    NAV.forEach(([id]) => document.getElementById(id) && io.observe(document.getElementById(id)));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <motion.div className="bar" style={{ scaleX: bar }} />
      <AnimatePresence>
        {scrolled ? (
          <motion.nav
            key="full-nav"
            className="nav"
            aria-label="Main"
            initial={{ y: -70, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: -70, opacity: 0, x: "-50%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="#home" className="logo">
              {LOGO ? <img src={LOGO} alt="Onushilon" /> : <><i>অ</i>Onushilon</>}
            </a>
            <div className="links">
              {NAV.slice(1, -1).map(([id, l]) => (
                <a key={id} href={`#${id}`} className={active === id ? "on" : ""}>{l}</a>
              ))}
              <a href="#join" className="btn" style={{ padding: "10px 22px" }}>Enrol now</a>
            </div>
            <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>{open ? "✕" : "☰"}</button>
          </motion.nav>
        ) : (
          <motion.button
            key="hero-menu-btn"
            className={`hero-menu-btn ${open ? "open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="burger-icon">
              <span className="line l1" />
              <span className="line l2" />
              <span className="line l3" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div
            className="sheet"
            initial={{ clipPath: "circle(0% at 95% 4%)" }}
            animate={{ clipPath: "circle(150% at 95% 4%)" }}
            exit={{ clipPath: "circle(0% at 95% 4%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <button className="sheet-close" onClick={() => setOpen(false)} aria-label="Close menu">✕</button>
            {NAV.map(([id, l], i) => (
              <motion.a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.05 }}
              >
                {l}
              </motion.a>
            ))}
            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-call sheet-call"
              onClick={() => setOpen(false)}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              💬 Chat & Call on WhatsApp
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function RisingHeroBox({
  stream,
  className = "",
  style = {},
  interval = 8000,
  initialDelay = 0,
  parallaxY,
  parallaxRotate,
  onPhotoClick,
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    let timer;
    const timeout = setTimeout(() => {
      timer = setInterval(() => {
        if (!pausedRef.current) {
          setIndex((prev) => (prev + 1) % stream.length);
        }
      }, interval);
    }, initialDelay);

    return () => {
      clearTimeout(timeout);
      if (timer) clearInterval(timer);
    };
  }, [interval, initialDelay, stream.length]);

  const current = stream[index % stream.length];

  return (
    <motion.div
      className={`hero-box-anchor ${className}`}
      style={{ y: parallaxY, rotate: parallaxRotate, ...style }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${current.src}-${index}`}
          className="hero-moving-box"
          initial={{ y: 220, opacity: 0, scale: 0.94 }}
          animate={{
            y: [200, 0, -12],
            opacity: [0, 1, 1],
            scale: [0.94, 1, 1],
            transition: {
              y: { times: [0, 0.16, 1], duration: 7.0, ease: ["easeOut", "linear"] },
              opacity: { times: [0, 0.14, 1], duration: 7.0, ease: "easeInOut" },
              scale: { times: [0, 0.16, 1], duration: 7.0, ease: "easeOut" },
            }
          }}
          exit={{
            y: -220,
            opacity: 0,
            scale: 0.94,
            transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
          }}
          onClick={() => onPhotoClick && onPhotoClick(current)}
          title="Click to view full photo • Hover to pause"
        >
          <img
            src={current.src}
            alt={current.title}
            className="hero-card-img"
            loading="eager"
          />
          <div className="hero-card-overlay">
            <span className="hero-badge">{current.badge}</span>
          </div>
          <span className="hero-card-pause-hint">⏸ Paused</span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function Hero({ onPhotoClick }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const k = reduce ? 0 : 1;
  const y1 = useTransform(p, [0, 1], [0, -260 * k]);
  const y2 = useTransform(p, [0, 1], [0, 180 * k]);
  const y3 = useTransform(p, [0, 1], [0, -120 * k]);
  const r1 = useTransform(p, [0, 1], [-6, 14 * k]);
  const ty = useTransform(p, [0, 1], [0, 120 * k]);
  const fade = useTransform(p, [0.5, 1], [1, 0]);
  const words = ["Learn", "by", "practice."];

  return (
    <section id="home" className="hero" ref={ref}>
      <div className="hero-in">
        <motion.div className="glow" style={{ y: y2 }} />
        
        {/* The whole box comes from the bottom, rises up with fade, stays calmly, and hides at top */}
        <RisingHeroBox
          stream={HERO_CARD_STREAMS[0]}
          className="f1"
          parallaxY={y1}
          parallaxRotate={r1}
          interval={8000}
          initialDelay={0}
          onPhotoClick={onPhotoClick}
        />
        <RisingHeroBox
          stream={HERO_CARD_STREAMS[1]}
          className="f2"
          parallaxY={y2}
          interval={8000}
          initialDelay={2000}
          onPhotoClick={onPhotoClick}
        />
        <RisingHeroBox
          stream={HERO_CARD_STREAMS[2]}
          className="f3"
          parallaxY={y3}
          interval={8000}
          initialDelay={4000}
          onPhotoClick={onPhotoClick}
        />
        <RisingHeroBox
          stream={HERO_CARD_STREAMS[3]}
          className="f4"
          parallaxY={y1}
          interval={8000}
          initialDelay={6000}
          onPhotoClick={onPhotoClick}
        />

        <motion.div style={{ y: ty, opacity: fade, position: "relative", zIndex: 3, padding: "0 4vw" }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(246,247,242,0.12)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.18)", padding: "6px 16px", borderRadius: "99px", marginBottom: "18px", fontSize: "0.88rem", fontWeight: 600, color: "var(--paper)" }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981", display: "inline-block" }} />
            <span>20 Authentic Class & Lab Moments • Bangladesh</span>
          </motion.div>
          <h1>
            {words.map((w, i) => (
              <span key={w}>
                <motion.span
                  style={{ display: "block" }}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  {i === 2 ? <em>{w}</em> : w}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            Onushilon Academy gives you expert mentors, live interactive classes and daily exercises, from SSC to job-ready tech skills.
          </motion.p>
          <motion.div className="cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
            <a className="btn" href="#courses">Browse courses</a>
            <a className="btn ghost" href="#moments">Explore class moments</a>
            <a className="btn-call" href={PHONE_HREF} style={{ padding: "14px 22px", fontSize: "0.95rem" }}>📞 Call now</a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Live classes", "Daily practice", "Mock exams", "Mentor feedback", "Recorded lessons", "Study groups"];
  const row = [...items, ...items];
  return (
    <div className="marq" aria-hidden>
      <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 28, ease: "linear", repeat: Infinity }} style={{ display: "inline-flex" }}>
        {[0, 1].map((n) => <div key={n}>{row.map((t, i) => <span key={i}>{t} ✺</span>)}</div>)}
      </motion.div>
    </div>
  );
}

function Story() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const a = useTransform(p, [0, 1], [60, -60]);
  const b = useTransform(p, [0, 1], [-80, 100]);
  return (
    <section id="story" ref={ref}>
      <div className="wrap story">
        <div className="imgs">
          <motion.div className="a ph" style={{ y: a }}><Pic k="story" alt="Our first classroom" style={{ height: "100%" }} /></motion.div>
          <motion.div className="b" style={{ y: b }}><Pic k="story2" cls="alt" style={{ height: "100%", borderRadius: "inherit" }} /></motion.div>
        </div>
        <div>
          <motion.h2 className="h2" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Onushilon means practice. We took it literally.
          </motion.h2>
          <p className="lead">We started because lectures alone never made anyone truly confident. Every course here is built around doing the work, getting detailed mentor feedback, and mastering the concept.</p>
          <div className="tl">
            {STORY.map(([y, t], i) => (
              <motion.div key={y} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * 0.05 }}>
                <b>{y}</b><p>{t}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Courses({ onOpenModal, onEnrol }) {
  const cats = ["All", "Robotics & Tech", "Arts & Sports", "Academic", "Language", "Skills"];
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  const list = COURSES.filter((c) => {
    const matchCat = cat === "All" || c.c === cat;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      c.t.toLowerCase().includes(q) ||
      c.c.toLowerCase().includes(q) ||
      c.mentor.toLowerCase().includes(q) ||
      c.topics.some((tp) => tp.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <section id="courses" className="courses">
      <div className="wrap">
        <h2 className="h2">Pick a course and start this week</h2>
        <p className="lead">New batches begin every month. Each course includes weekly practice sets and an expert mentor who reviews your progress.</p>
        
        <div className="courses-top">
          <div className="tabs" role="tablist">
            {cats.map((c) => (
              <button key={c} role="tab" aria-selected={cat === c} className={`tab ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>
                {cat === c && <motion.span layoutId="course-tab-pill" className="tab-pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="tab-label">{c}</span>
              </button>
            ))}
          </div>
          <div className="course-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search courses, topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search courses"
            />
          </div>
        </div>

        <motion.div className="grid" layout>
          <AnimatePresence mode="popLayout">
            {list.length > 0 ? (
              list.map((c) => (
                <Tilt key={c.t} className="card" onClick={() => onOpenModal(c)}>
                  <div style={{ position: "relative" }}>
                    <Pic k={c.i} alt={c.t} cls={c.c === "Language" ? "alt" : c.c === "Skills" ? "alt2" : ""} />
                    <div className="card-badges">
                      <span className="card-badge">{c.seats}</span>
                    </div>
                  </div>
                  <div className="body">
                    <div className="meta"><span>{c.c}</span><span>{c.d}</span></div>
                    <h3>{c.t}</h3>
                    <p className="schedule-info">🗓️ {c.schedule}</p>
                    <div className="row">
                      <span className="price">{c.p}</span>
                      <div style={{ display: "flex", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                        <button className="btn-outline" onClick={() => onOpenModal(c)}>Details</button>
                        <button className="btn-primary" onClick={() => onEnrol(c.t)}>Enrol</button>
                      </div>
                    </div>
                  </div>
                </Tilt>
              ))
            ) : (
              <div className="empty-courses">
                <h3>No courses found matching "{search}"</h3>
                <p style={{ opacity: 0.75, marginTop: 8 }}>Try clearing your search query or switching categories.</p>
                <button className="btn" onClick={() => { setSearch(""); setCat("All"); }} style={{ marginTop: 16 }}>
                  Reset Filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function CourseModal({ course, onClose, onEnrol }) {
  if (!course) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-card"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
          <div>
            <span className="modal-tag">{course.c} • {course.d}</span>
            <div className="modal-header">
              <h3>{course.t}</h3>
            </div>
          </div>
          <div className="modal-mentor">
            <span>🧑‍🏫 <b>Lead Mentor:</b> {course.mentor}</span>
          </div>
          <div className="modal-info-grid">
            <div className="modal-info-item">
              <span>Live Schedule</span>
              <b>{course.schedule}</b>
            </div>
            <div className="modal-info-item">
              <span>Format & Batch</span>
              <b>{course.l} • {course.seats}</b>
            </div>
          </div>
          <div className="modal-topics">
            <h4>Key Syllabus & Practice Topics:</h4>
            <ul>
              {course.topics.map((tp, idx) => (
                <li key={idx}><i>✓</i> {tp}</li>
              ))}
            </ul>
          </div>
          <div className="modal-actions">
            <div>
              <span className="modal-fee-label">Complete Course Fee</span>
              <span className="modal-price">{course.p}</span>
            </div>
            <button className="btn btn-modal-enrol" onClick={() => onEnrol(course.t)}>
              Proceed to Enrol →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Mentors({ onEnrol }) {
  const cats = ["All Mentors", "Robotics & Tech", "Creative Arts", "Academic & Science", "Arts & Sports", "Language & Skills"];
  const [cat, setCat] = useState("All Mentors");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);

  const list = cat === "All Mentors" ? MENTORS : MENTORS.filter((m) => m.dept === cat);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) setVisibleCount(1);
      else if (w < 680) setVisibleCount(2);
      else if (w < 960) setVisibleCount(3);
      else if (w < 1200) setVisibleCount(4);
      else setVisibleCount(5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const total = list.length;
  const maxIndex = Math.max(0, total - visibleCount);

  const handleCatChange = (newCat) => {
    setCat(newCat);
    setCurrentIndex(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const displayedEnd = Math.min(currentIndex + visibleCount, total);

  return (
    <section id="mentors" className="mentors-sec">
      <div className="wrap">
        <div className="mentors-header">
          <div className="mentors-header-text">
            <span className="mentors-kicker">Faculty & Mentorship</span>
            <h2 className="h2">Learn from practicing mentors</h2>
            <p className="lead" style={{ marginTop: "8px" }}>
              Our faculty consists of practicing engineers, artists, university educators, and martial arts masters who review your work personally every single week.
            </p>
          </div>

          <div className="mentors-ctrls-bar">
            <div className="mentor-counter-pill">
              <span className="mentor-counter-dot" />
              <span>
                {total > 0 ? `${currentIndex + 1}–${displayedEnd} of ${total} Mentors` : "0 Mentors"}
              </span>
            </div>
            <div className="mentor-nav-arrows">
              <button
                type="button"
                className="mentor-nav-btn"
                onClick={handlePrev}
                aria-label="Previous mentors"
                title="Previous mentors"
                disabled={total <= visibleCount}
                style={{ opacity: total <= visibleCount ? 0.4 : 1, cursor: total <= visibleCount ? "default" : "pointer" }}
              >
                ‹
              </button>
              <button
                type="button"
                className="mentor-nav-btn"
                onClick={handleNext}
                aria-label="Next mentors"
                title="Next mentors"
                disabled={total <= visibleCount}
                style={{ opacity: total <= visibleCount ? 0.4 : 1, cursor: total <= visibleCount ? "default" : "pointer" }}
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <div className="courses-top" style={{ marginBottom: "24px" }}>
          <div className="tabs" role="tablist">
            {cats.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                className={`tab ${cat === c ? "on" : ""}`}
                onClick={() => handleCatChange(c)}
              >
                {cat === c && (
                  <motion.span
                    layoutId="mentor-tab-pill"
                    className="tab-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="tab-label">{c}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mentors-slider-outer">
          <div className="mentors-slider-window">
            <div
              className="mentors-slider-track"
              style={{
                transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`,
              }}
            >
              {list.map((m) => (
                <div
                  key={m.id}
                  className="mentor-line-cell"
                  style={{
                    flex: `0 0 ${100 / visibleCount}%`,
                    maxWidth: `${100 / visibleCount}%`,
                  }}
                >
                  <div className="mentor-line-item">
                    <div className="mentor-circle-wrap">
                      <div className="mentor-circle-inner">
                        <img
                          src={m.img}
                          alt={m.name}
                          className="mentor-circle-img"
                          loading="lazy"
                        />
                      </div>
                      <span className="mentor-circle-badge" title={m.badgeFull}>
                        {m.badge}
                      </span>
                    </div>

                    <h3 className="mentor-line-name" title={m.name}>
                      {m.name}
                    </h3>
                    <p className="mentor-line-role" title={m.role}>
                      {m.role}
                    </p>
                    <p className="mentor-line-edu" title={m.edu}>
                      🎓 {m.edu}
                    </p>
                    <span className="mentor-line-stats">{m.stats}</span>

                    <button
                      type="button"
                      className="mentor-line-btn"
                      onClick={() => onEnrol && onEnrol(m.course)}
                    >
                      Enrol with Mentor →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {Math.ceil(total / visibleCount) > 1 && (
            <div className="mentor-dots-row">
              {Array.from({ length: Math.ceil(total / visibleCount) }).map((_, p) => {
                const isCurrentPage = Math.floor(currentIndex / visibleCount) === p;
                return (
                  <button
                    key={p}
                    type="button"
                    className={`mentor-dot-pill ${isCurrentPage ? "active" : ""}`}
                    onClick={() => setCurrentIndex(Math.min(p * visibleCount, maxIndex))}
                    aria-label={`Go to mentors page ${p + 1}`}
                    title={`Page ${p + 1}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PracticeArena() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState({});

  const task = PRACTICE_TASKS[activeTab];

  const handleSelect = (idx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === task.correct) {
      setStreak((s) => s + 1);
      setCompleted((c) => ({ ...c, [activeTab]: true }));
    }
  };

  const handleTabChange = (idx) => {
    setActiveTab(idx);
    setSelectedOpt(null);
  };

  const letters = ["A", "B", "C", "D"];

  return (
    <section id="practice" className="practice-sec">
      <div className="wrap">
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
          <span className="quiz-badge">Interactive Demo</span>
          <h2 className="h2" style={{ margin: "12px auto 0" }}>Experience Onushilon: Try a Practice Task</h2>
          <p className="lead" style={{ margin: "14px auto 0" }}>
            The best way to understand our methodology is to experience it. Solve a question below and see how instant mentor feedback works.
          </p>
        </div>

        <div className="practice-container">
          <div className="subject-tabs">
            {PRACTICE_TASKS.map((t, idx) => (
              <button
                key={t.subject}
                className={`sub-tab ${activeTab === idx ? "active" : ""}`}
                onClick={() => handleTabChange(idx)}
              >
                {t.subject} {completed[idx] ? "✓" : ""}
              </button>
            ))}
          </div>

          <div className="quiz-header">
            <span style={{ fontSize: "0.9rem", color: "var(--ink2)", fontWeight: 600 }}>
              Topic: <b>{task.topic}</b>
            </span>
            <span className="quiz-streak">
              🔥 Streak: <b>{streak} solved</b>
            </span>
          </div>

          <h3 className="quiz-question">{task.question}</h3>

          <div className="options-list">
            {task.options.map((opt, idx) => {
              let stateCls = "";
              if (selectedOpt !== null) {
                if (idx === task.correct) stateCls = "correct";
                else if (idx === selectedOpt) stateCls = "wrong";
              }
              return (
                <button
                  key={idx}
                  className={`opt-btn ${stateCls}`}
                  onClick={() => handleSelect(idx)}
                  disabled={selectedOpt !== null}
                >
                  <span className="opt-letter">{letters[idx]}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {selectedOpt !== null && (
              <motion.div
                className="mentor-feedback"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
              >
                <div className="mentor-head">
                  <span>🧑‍🏫 <b>{selectedOpt === task.correct ? "Excellent work! Mentor feedback:" : "Mentor guidance:"}</b></span>
                </div>
                <p>{task.explanation}</p>
                <p style={{ fontStyle: "italic", opacity: 0.85 }}>“{task.mentorNote}”</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="practice-actions">
            <span style={{ fontSize: "0.9rem", opacity: 0.75 }}>
              {selectedOpt === null ? "👉 Select an answer above to reveal mentor guidance" : "Ready for regular daily practice?"}
            </span>
            <a href="#courses" className="btn" style={{ padding: "10px 22px", fontSize: "0.95rem" }}>
              Explore Full Courses →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Moments({ onOpenLightbox }) {
  const cats = ["All Moments", "Robotics & STEM", "Creative Arts", "Tech & Coding", "Active & Sports", "Academic"];
  const [cat, setCat] = useState("All Moments");

  const list = cat === "All Moments" ? MOMENTS : MOMENTS.filter((m) => m.c === cat);

  return (
    <section id="moments" className="moments-sec">
      <div className="wrap">
        <div style={{ maxWidth: "700px" }}>
          <h2 className="h2">Class moments & life at Onushilon</h2>
          <p className="lead">
            Take an authentic look inside our robotics labs, art workshops, coding studios, karate dojo, and science classrooms.
          </p>
        </div>

        <div className="moments-top">
          <div className="tabs" role="tablist">
            {cats.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                className={`tab ${cat === c ? "on" : ""}`}
                onClick={() => setCat(c)}
              >
                {cat === c && (
                  <motion.span
                    layoutId="moments-pill"
                    className="tab-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="tab-label">{c}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div className="moments-grid" layout>
          <AnimatePresence mode="popLayout">
            {list.map((m, idx) => (
              <motion.div
                key={m.id}
                className="moment-card"
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                onClick={() => onOpenLightbox(idx, list)}
              >
                <div className="moment-img-wrap">
                  <Pic k={m.img} alt={m.t} />
                  <span className="moment-badge">{m.tag}</span>
                  <span className="moment-zoom-hint">🔍</span>
                </div>
                <div className="moment-body">
                  <span style={{ fontSize: "0.82rem", color: "var(--gold)", fontWeight: 700 }}>{m.c}</span>
                  <h3>{m.t}</h3>
                  <p>{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function LightboxModal({ activeIndex, items, onClose, onNavigate }) {
  if (activeIndex === null || !items || !items[activeIndex]) return null;
  const current = items[activeIndex];

  const prev = (e) => {
    e.stopPropagation();
    onNavigate((activeIndex - 1 + items.length) % items.length);
  };

  const next = (e) => {
    e.stopPropagation();
    onNavigate((activeIndex + 1) % items.length);
  };

  const imgSrc = current.src || (current.img && IMG[current.img]) || (current.k && IMG[current.k]);
  const title = current.t || current.title || "Academy Moment";
  const cat = current.c || current.tag || current.badge || "Onushilon Academy";
  const desc = current.desc || current.title || "";

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">✕</button>
        {items.length > 1 && (
          <>
            <button className="lightbox-nav-btn lightbox-prev" onClick={prev} aria-label="Previous moment">‹</button>
            <button className="lightbox-nav-btn lightbox-next" onClick={next} aria-label="Next moment">›</button>
          </>
        )}
        <motion.div
          className="lightbox-card"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="lightbox-img-wrap">
            {imgSrc ? (
              <img src={imgSrc} alt={title} style={{ width: "100%", maxHeight: "550px", objectFit: "contain", display: "block" }} />
            ) : (
              <Pic k={current.img} alt={title} style={{ height: "480px" }} />
            )}
          </div>
          <div className="lightbox-info">
            <div>
              <span style={{ fontSize: "0.85rem", color: "var(--gold)", fontWeight: 700 }}>{cat}</span>
              <h3 style={{ fontSize: "1.45rem", marginTop: 4 }}>{title}</h3>
              {desc && <p style={{ opacity: 0.85, fontSize: "0.95rem", marginTop: 4 }}>{desc}</p>}
            </div>
            <span style={{ opacity: 0.6, fontSize: "0.9rem" }}>{activeIndex + 1} of {items.length}</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Why() {
  const items = [
    ["Mentors who read your work", "Every submission gets personalized written and audio feedback within 24 hours."],
    ["Learn at your pace", "Every live class is recorded in HD and posted with notes, formula sheets, and practice sets."],
    ["Exams that feel real", "Monthly timed mock tests under board/exam conditions, with comprehensive score breakdowns."],
  ];
  return (
    <section id="why">
      <div className="wrap">
        <div className="stats">
          {[[12000, "+", "Active learners"], [85, "", "Expert mentors"], [40, "", "Districts reached"], [96, "%", "Finish their course"]].map(([n, s, l]) => (
            <div key={l}><b><Count to={n} suffix={s} /></b><p>{l}</p></div>
          ))}
        </div>
        <div style={{ marginTop: 110 }}>
          <h2 className="h2">What you get when you join</h2>
          <div className="why">
            {items.map(([h, t], i) => (
              <motion.div key={h} whileHover={{ y: -8 }} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <h3>{h}</h3><p>{t}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Voices() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % VOICES.length), 6000);
    return () => clearInterval(t);
  }, [paused]);

  const prev = () => setI((x) => (x - 1 + VOICES.length) % VOICES.length);
  const next = () => setI((x) => (x + 1) % VOICES.length);

  const [q, n, r, img] = VOICES[i];
  return (
    <section id="voices" className="tst">
      <div className="wrap" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <h2 className="h2">Students say it better</h2>
        <AnimatePresence mode="wait">
          <motion.div key={i} className="tcard" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }}>
            <Pic k={img} alt={n} cls="alt" />
            <div>
              <blockquote>“{q}”</blockquote>
              <p style={{ marginTop: 16 }}><b>{n}</b>, {r}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="tcard-ctrls">
          <div className="student-pills">
            {VOICES.map(([_, name], k) => (
              <button
                key={k}
                className={`student-pill ${k === i ? "active" : ""}`}
                onClick={() => setI(k)}
              >
                <span>{name}</span>
              </button>
            ))}
          </div>
          <div className="arrow-btns">
            <button className="arrow-btn" onClick={prev} aria-label="Previous review">‹</button>
            <button className="arrow-btn" onClick={next} aria-label="Next review">›</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="faq-sec">
      <div className="wrap">
        <div style={{ textAlign: "center", maxWidth: "650px", margin: "0 auto" }}>
          <h2 className="h2" style={{ margin: "0 auto" }}>Frequently asked questions</h2>
          <p className="lead" style={{ margin: "14px auto 0" }}>
            Got questions before enrolling? Here is everything you need to know about our batches, mentors, and policies.
          </p>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className={`faq-item ${isOpen ? "open" : ""}`}>
                <button
                  className="faq-question"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span className="faq-icon">▾</span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="faq-answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Join({ enrolledCourse }) {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(p, [0, 1], ["-12%", "12%"]);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: enrolledCourse || COURSES[0].t,
  });

  useEffect(() => {
    if (enrolledCourse) {
      setFormData((prev) => ({ ...prev, course: enrolledCourse }));
    }
  }, [enrolledCourse]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="join" className="cta-s" ref={ref} style={{ padding: 0 }}>
      <motion.div className="cta-bg" style={{ y }}><Pic k="cta" /></motion.div>
      <div className="wrap" style={{ padding: "100px 0" }}>
        <h2 className="h2" style={{ maxWidth: "16ch" }}>Your next batch starts this week</h2>
        <p className="lead">Reserve your seat now. A dedicated academic counsellor will connect with you to complete your batch onboarding.</p>
        
        {sent ? (
          <motion.div
            className="celebration-card"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <h3>🎉 Enrolment Request Received!</h3>
            <p style={{ fontSize: "1.1rem" }}>
              Thank you <b>{formData.name}</b>! We have reserved a provisional seat for <b>{formData.course}</b>.
            </p>
            <p style={{ opacity: 0.85, fontSize: "0.95rem" }}>
              Our academic counsellor will reach out via WhatsApp/Phone at <b>{formData.phone}</b> and send batch details to <b>{formData.email}</b> within 24 hours.
            </p>
            <button
              className="btn"
              onClick={() => { setSent(false); }}
              style={{ width: "fit-content", marginTop: "12px", padding: "10px 22px" }}
            >
              Enrol in another course
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="join-grid">
            <div>
              <input
                type="text"
                required
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                aria-label="Full name"
              />
            </div>
            <div>
              <input
                type="tel"
                required
                placeholder="Mobile / WhatsApp (+880)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                aria-label="Phone number"
              />
            </div>
            <div className="full">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                aria-label="Email"
              />
            </div>
            <div className="full">
              <select
                className="join-select"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                aria-label="Select course"
              >
                {COURSES.map((c) => (
                  <option key={c.t} value={c.t} style={{ color: "var(--ink)" }}>
                    {c.t} — {c.p} ({c.d})
                  </option>
                ))}
              </select>
            </div>
            <div className="full" style={{ marginTop: "6px" }}>
              <button className="btn" type="submit" style={{ padding: "16px 36px", fontSize: "1.05rem" }}>
                Confirm Seat Reservation →
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function FloatingCallButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="floating-call-wrap"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-call-btn"
        aria-label="Open WhatsApp inbox"
      >
        <span className="call-pulse-ring" />
        <span className="call-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.889-9.888 9.889m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </span>
        <span className="call-text">Call now</span>
        <AnimatePresence>
          {hovered && (
            <motion.span
              className="call-tooltip"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              Open WhatsApp Inbox
            </motion.span>
          )}
        </AnimatePresence>
      </a>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer>
      <div className="wrap fg">
        <div><b style={{ fontSize: "1.5rem" }}>Onushilon Academy</b><span style={{ opacity: 0.7 }}>Learn by practice.</span></div>
        <div><b>Explore</b>{NAV.slice(1, -1).map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}</div>
        <div>
          <b>Contact</b>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--gold)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            💬 WhatsApp: {PHONE} (9 AM – 10 PM)
          </a>
          <span>hello@onushilon.example</span>
          <span>Dhaka, Bangladesh</span>
        </div>
      </div>
      <p className="wrap" style={{ marginTop: 40, opacity: 0.55 }}>© {new Date().getFullYear()} Onushilon Academy</p>
    </footer>
  );
}

export default function Page() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledCourse, setEnrolledCourse] = useState("");
  const [lightbox, setLightbox] = useState({ index: null, items: [] });

  useEffect(() => {
    let lenisInstance;
    import("lenis").then((LenisModule) => {
      const Lenis = LenisModule.default || LenisModule;
      lenisInstance = new Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.05,
        touchMultiplier: 1.5,
      });

      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }).catch(() => {});

    return () => {
      if (lenisInstance) lenisInstance.destroy();
    };
  }, []);

  const handleEnrolFromModal = (courseTitle) => {
    setEnrolledCourse(courseTitle);
    setSelectedCourse(null);
    document.getElementById("join")?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePhotoClickFromHero = (photo) => {
    const idx = ALL_PHOTOS.findIndex((p) => p.src === photo.src);
    setLightbox({ index: idx >= 0 ? idx : 0, items: ALL_PHOTOS });
  };

  return (
    <main>
      <Nav />
      <Hero onPhotoClick={handlePhotoClickFromHero} />
      <Marquee />
      <Story />
      <Courses
        onOpenModal={(course) => setSelectedCourse(course)}
        onEnrol={handleEnrolFromModal}
      />
      <Mentors onEnrol={handleEnrolFromModal} />
      <PracticeArena />
      <Moments
        onOpenLightbox={(idx, items) => setLightbox({ index: idx, items })}
      />
      <Why />
      <Voices />
      <Faq />
      <Join enrolledCourse={enrolledCourse} />
      <Footer />
      <CourseModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnrol={handleEnrolFromModal}
      />
      <LightboxModal
        activeIndex={lightbox.index}
        items={lightbox.items}
        onClose={() => setLightbox({ index: null, items: [] })}
        onNavigate={(newIdx) => setLightbox((prev) => ({ ...prev, index: newIdx }))}
      />
      <FloatingCallButton />
    </main>
  );
}
