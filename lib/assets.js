// Drop your files into /public/images and set the paths here.
// All authentic photos from lib/onishiloni-photos are served from /images/photos/
export const LOGO = null; // e.g. "/images/logo.svg"
export const PHONE = "+880 1700-000000";
export const PHONE_HREF = "tel:+8801700000000";
export const WHATSAPP_URL = "https://wa.me/8801700000000?text=Hello%20Onushilon%20Academy%2C%20I%20would%20like%20to%20know%20more%20about%20your%20courses.";

export const IMG = {
  // Hero key images
  hero1: "/images/photos/robotic_class1.jpg",
  hero2: "/images/photos/art_class1.jpg",
  hero3: "/images/photos/classroom1.jpg",
  hero4: "/images/photos/karate_class1.jpg",

  // Story section
  story: "/images/photos/classroom1.jpg",
  story2: "/images/photos/project_building.jpg",

  // CTA background
  cta: "/images/photos/Fun_and_learning.jpg",

  // Course cards (c1 through c9)
  c1: "/images/photos/classroom2.jpg",           // HSC Physics & Chemistry
  c2: "/images/photos/learn_with_fun.jpg",        // Spoken English
  c3: "/images/photos/computer_learning.jpg",     // Web Dev & Coding
  c4: "/images/photos/robotic_class1.jpg",        // Robotics & STEM
  c5: "/images/photos/art_class1.jpg",            // Fine Arts & Painting
  c6: "/images/photos/harware_fix_learning.jpg",  // Hardware & Circuits
  c7: "/images/photos/karate_class1.jpg",         // Karate & Martial Arts
  c8: "/images/photos/grow_with_green.jpg",       // Young Green Innovators
  c9: "/images/photos/classroom3.jpg",           // SSC Higher Mathematics

  // Student testimonial portraits
  t1: "/images/photos/art_class3.jpg",
  t2: "/images/photos/robotic_class4.jpg",
  t3: "/images/photos/classroom2.jpg",
  t4: "/images/photos/learn_with_fun.jpg",

  // Class Moments gallery (m1 through m12)
  m1: "/images/photos/robotic_class3.jpg",
  m2: "/images/photos/art_class4.jpg",
  m3: "/images/photos/classroom1.jpg",
  m4: "/images/photos/karate_class1.jpg",
  m5: "/images/photos/computer_learning.jpg",
  m6: "/images/photos/harware_fix_learning.jpg",
  m7: "/images/photos/grow_with_green.jpg",
  m8: "/images/photos/robotic_class5.jpg",
  m9: "/images/photos/art_class5.jpg",
  m10: "/images/photos/project_building.jpg",
  m11: "/images/photos/Fun_and_learning.jpg",
  m12: "/images/photos/robotic_class2.jpg",
};

// 4 distinct sets of photos for the 4 Hero floating cards (5 unique photos per card = all 20 photos)
export const HERO_CARD_STREAMS = [
  // Card 1 (Top Left)
  [
    { src: "/images/photos/robotic_class1.jpg", title: "Robotics & Microcontroller STEM", badge: "🤖 Robotics Lab" },
    { src: "/images/photos/art_class1.jpg", title: "Creative Art & Canvas Drawing", badge: "🎨 Art Studio" },
    { src: "/images/photos/classroom1.jpg", title: "Interactive Concept Lecture", badge: "📚 Smart Classroom" },
    { src: "/images/photos/computer_learning.jpg", title: "Digital Literacy & Coding Lab", badge: "💻 Coding Studio" },
    { src: "/images/photos/project_building.jpg", title: "Hands-on Project Building", badge: "🛠️ Project Lab" },
  ],
  // Card 2 (Top Right)
  [
    { src: "/images/photos/art_class2.jpg", title: "Fine Arts & Color Theory", badge: "✨ Color Studio" },
    { src: "/images/photos/robotic_class2.jpg", title: "Young Innovators Robotics", badge: "🚀 STEM Robotics" },
    { src: "/images/photos/harware_fix_learning.jpg", title: "Circuit & Hardware Engineering", badge: "⚡ Hardware Lab" },
    { src: "/images/photos/Fun_and_learning.jpg", title: "Fun, Logic & Team Learning", badge: "🎉 Fun & Learning" },
    { src: "/images/photos/classroom2.jpg", title: "Physics & Science Laboratory", badge: "🔬 Science Lab" },
  ],
  // Card 3 (Bottom Right)
  [
    { src: "/images/photos/karate_class1.jpg", title: "Martial Arts & Self Defense Dojo", badge: "🥋 Karate Dojo" },
    { src: "/images/photos/robotic_class3.jpg", title: "Sensor Programming & Mechanics", badge: "⚙️ Sensor Logic" },
    { src: "/images/photos/art_class3.jpg", title: "Sketch & Acrylic Painting", badge: "🖌️ Canvas Masterclass" },
    { src: "/images/photos/grow_with_green.jpg", title: "Grow With Green Discovery", badge: "🌱 Nature & Science" },
    { src: "/images/photos/classroom3.jpg", title: "Mathematics & Problem Solving", badge: "📐 Math Session" },
  ],
  // Card 4 (Bottom Left)
  [
    { src: "/images/photos/learn_with_fun.jpg", title: "Interactive Spoken English", badge: "🗣️ Spoken Fluency" },
    { src: "/images/photos/art_class4.jpg", title: "Young Artists Studio Session", badge: "🎨 Sketch Studio" },
    { src: "/images/photos/robotic_class4.jpg", title: "Robotics Circuit & Coding", badge: "💡 Circuit Coding" },
    { src: "/images/photos/art_class5.jpg", title: "Junior Arts & Craft Workshop", badge: "🌈 Junior Arts" },
    { src: "/images/photos/robotic_class5.jpg", title: "Advanced Bot Assembly Workshop", badge: "🏆 Bot Workshop" },
  ],
];

// All 20 photos metadata collection for lightboxes and full gallery
export const ALL_PHOTOS = [
  { id: "art1", src: "/images/photos/art_class1.jpg", title: "Creative Art Studio", tag: "Creative Arts", badge: "🎨 Art Studio", desc: "Students learning sketching, proportion, and color harmonies with easel and canvas." },
  { id: "art2", src: "/images/photos/art_class2.jpg", title: "Color Theory & Drawing", tag: "Creative Arts", badge: "✨ Color Studio", desc: "Fine arts students exploring pigment blending and shading techniques." },
  { id: "art3", src: "/images/photos/art_class3.jpg", title: "Sketch & Acrylic Painting", tag: "Creative Arts", badge: "🖌️ Painting Masterclass", desc: "Personalized studio sessions developing advanced acrylic compositions." },
  { id: "art4", src: "/images/photos/art_class4.jpg", title: "Young Artists Studio Session", tag: "Creative Arts", badge: "🎨 Sketch Studio", desc: "Junior batch discovering artistic confidence through guided figure drawing." },
  { id: "art5", src: "/images/photos/art_class5.jpg", title: "Junior Arts & Craft Workshop", tag: "Creative Arts", badge: "🌈 Junior Arts", desc: "Engaging craft projects blending color, geometry, and creative imagination." },
  { id: "cls1", src: "/images/photos/classroom1.jpg", title: "Interactive Concept Lecture", tag: "Academic", badge: "📚 Smart Classroom", desc: "Active group discussions breaking down tough physics and science concepts." },
  { id: "cls2", src: "/images/photos/classroom2.jpg", title: "Physics & Science Laboratory", tag: "Academic", badge: "🔬 Science Lab", desc: "Mentors guiding students through board-exam problem sets with interactive feedback." },
  { id: "cls3", src: "/images/photos/classroom3.jpg", title: "Mathematics & Problem Solving", tag: "Academic", badge: "📐 Math Session", desc: "High-focus mathematics practice drills with dedicated mentor support." },
  { id: "cmp", src: "/images/photos/computer_learning.jpg", title: "Digital Literacy & Coding Lab", tag: "Tech & Coding", badge: "💻 Coding Lab", desc: "Workstation stations where students learn web design, coding, and software tools." },
  { id: "fun", src: "/images/photos/Fun_and_learning.jpg", title: "Fun, Logic & Collaborative Learning", tag: "Active Learning", badge: "🎉 Fun & Learning", desc: "Interactive learning games that make logic, science, and teamwork enjoyable." },
  { id: "grn", src: "/images/photos/grow_with_green.jpg", title: "Grow With Green Discovery", tag: "Outdoor & Science", badge: "🌱 Nature & Science", desc: "Experiential botany and environmental science connecting kids with real nature." },
  { id: "hrd", src: "/images/photos/harware_fix_learning.jpg", title: "Circuit & Hardware Engineering", tag: "Tech & Coding", badge: "⚡ Hardware Lab", desc: "Hands-on diagnostic testing, motherboard circuitry, and safe hardware repair." },
  { id: "kar", src: "/images/photos/karate_class1.jpg", title: "Martial Arts & Self Defense Dojo", tag: "Sports & Fitness", badge: "🥋 Karate Dojo", desc: "Discipline, balance, self-defense mastery, and physical fitness in our active dojo." },
  { id: "lrn", src: "/images/photos/learn_with_fun.jpg", title: "Interactive Spoken English", tag: "Language", badge: "🗣️ Spoken Fluency", desc: "Conversational English drills that break hesitation and build real fluency." },
  { id: "prj", src: "/images/photos/project_building.jpg", title: "Hands-on Project Building", tag: "Active Learning", badge: "🛠️ Project Lab", desc: "Collaborative teamwork turning ideas into real functioning prototypes." },
  { id: "rob1", src: "/images/photos/robotic_class1.jpg", title: "Robotics & Microcontroller STEM", tag: "Robotics & STEM", badge: "🤖 Robotics Lab", desc: "Assembling robots, wiring sensors, and programming microcontrollers." },
  { id: "rob2", src: "/images/photos/robotic_class2.jpg", title: "Young Innovators Robotics", tag: "Robotics & STEM", badge: "🚀 STEM Robotics", desc: "Early STEM robotics experiments exploring gears, motors, and automation." },
  { id: "rob3", src: "/images/photos/robotic_class3.jpg", title: "Sensor Programming & Mechanics", tag: "Robotics & STEM", badge: "⚙️ Sensor Logic", desc: "Fine-tuning ultrasonic, infrared, and optical sensors for obstacle tracking." },
  { id: "rob4", src: "/images/photos/robotic_class4.jpg", title: "Robotics Circuit & Coding Session", tag: "Robotics & STEM", badge: "💡 Circuit Coding", desc: "Coding autonomous logic and testing motor drivers on custom robot chassis." },
  { id: "rob5", src: "/images/photos/robotic_class5.jpg", title: "Advanced Bot Assembly Workshop", tag: "Robotics & STEM", badge: "🏆 Bot Workshop", desc: "Precision assembly for competition-ready robotic prototypes and exhibitions." },
];
