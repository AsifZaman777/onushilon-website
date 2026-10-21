// ==============================================================================
// ONUSHILON ACADEMY ASSETS & CLOUD STORAGE MAPPING
// All authentic photos and media are fetched directly from Supabase Storage bucket
// ==============================================================================

export const SUPABASE_STORAGE_URL = "https://okhqtcykqdkivxsghyrv.supabase.co/storage/v1/object/public/onushilon";

export const LOGO = null;
export const PHONE = "+880 1700-000000";
export const PHONE_HREF = "tel:+8801700000000";
export const WHATSAPP_URL = "https://wa.me/8801700000000?text=Hello%20Onushilon%20Academy%2C%20I%20would%20like%20to%20know%20more%20about%20your%20courses.";

/**
 * Helper to resolve any image path to the Supabase storage bucket
 */
export function getStorageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.replace(/^\/images\//, "").replace(/^images\//, "");
  return `${SUPABASE_STORAGE_URL}/${cleanPath}`;
}

export const IMG = {
  // Hero key images (from Supabase Bucket)
  hero1: `${SUPABASE_STORAGE_URL}/photos/robotic_class1.webp`,
  hero2: `${SUPABASE_STORAGE_URL}/photos/art_class1.webp`,
  hero3: `${SUPABASE_STORAGE_URL}/photos/classroom1.webp`,
  hero4: `${SUPABASE_STORAGE_URL}/photos/karate_class1.webp`,

  // Story section
  story: `${SUPABASE_STORAGE_URL}/photos/classroom1.webp`,
  story2: `${SUPABASE_STORAGE_URL}/photos/project_building.webp`,

  // CTA background
  cta: `${SUPABASE_STORAGE_URL}/photos/Fun_and_learning.webp`,

  // Course cards (c1 through c9)
  c1: `${SUPABASE_STORAGE_URL}/photos/classroom2.webp`,           // HSC Physics & Chemistry
  c2: `${SUPABASE_STORAGE_URL}/photos/learn_with_fun.webp`,        // Spoken English
  c3: `${SUPABASE_STORAGE_URL}/photos/computer_learning.webp`,     // Web Dev & Coding
  c4: `${SUPABASE_STORAGE_URL}/photos/robotic_class1.webp`,        // Robotics & STEM
  c5: `${SUPABASE_STORAGE_URL}/photos/art_class1.webp`,            // Fine Arts & Painting
  c6: `${SUPABASE_STORAGE_URL}/photos/harware_fix_learning.webp`,  // Hardware & Circuits
  c7: `${SUPABASE_STORAGE_URL}/photos/karate_class1.webp`,         // Karate & Martial Arts
  c8: `${SUPABASE_STORAGE_URL}/photos/grow_with_green.webp`,       // Young Green Innovators
  c9: `${SUPABASE_STORAGE_URL}/photos/classroom3.webp`,           // SSC Higher Mathematics

  // Student testimonial portraits
  t1: `${SUPABASE_STORAGE_URL}/photos/art_class3.webp`,
  t2: `${SUPABASE_STORAGE_URL}/photos/robotic_class4.webp`,
  t3: `${SUPABASE_STORAGE_URL}/photos/classroom2.webp`,
  t4: `${SUPABASE_STORAGE_URL}/photos/learn_with_fun.webp`,

  // Class Moments gallery (m1 through m12)
  m1: `${SUPABASE_STORAGE_URL}/photos/robotic_class3.webp`,
  m2: `${SUPABASE_STORAGE_URL}/photos/art_class4.webp`,
  m3: `${SUPABASE_STORAGE_URL}/photos/classroom1.webp`,
  m4: `${SUPABASE_STORAGE_URL}/photos/karate_class1.webp`,
  m5: `${SUPABASE_STORAGE_URL}/photos/computer_learning.webp`,
  m6: `${SUPABASE_STORAGE_URL}/photos/harware_fix_learning.webp`,
  m7: `${SUPABASE_STORAGE_URL}/photos/grow_with_green.webp`,
  m8: `${SUPABASE_STORAGE_URL}/photos/robotic_class5.webp`,
  m9: `${SUPABASE_STORAGE_URL}/photos/art_class5.webp`,
  m10: `${SUPABASE_STORAGE_URL}/photos/project_building.webp`,
  m11: `${SUPABASE_STORAGE_URL}/photos/Fun_and_learning.webp`,
  m12: `${SUPABASE_STORAGE_URL}/photos/robotic_class2.webp`,
};

// 4 distinct sets of photos for the 4 Hero floating cards (fetched from Supabase bucket)
export const HERO_CARD_STREAMS = [
  // Card 1 (Top Left)
  [
    { src: `${SUPABASE_STORAGE_URL}/photos/robotic_class1.webp`, title: "Robotics & Microcontroller STEM", badge: "🤖 Robotics Lab" },
    { src: `${SUPABASE_STORAGE_URL}/photos/art_class1.webp`, title: "Creative Art & Canvas Drawing", badge: "🎨 Art Studio" },
    { src: `${SUPABASE_STORAGE_URL}/photos/classroom1.webp`, title: "Interactive Concept Lecture", badge: "📚 Smart Classroom" },
    { src: `${SUPABASE_STORAGE_URL}/photos/computer_learning.webp`, title: "Digital Literacy & Coding Lab", badge: "💻 Coding Studio" },
    { src: `${SUPABASE_STORAGE_URL}/photos/project_building.webp`, title: "Hands-on Project Building", badge: "🛠️ Project Lab" },
  ],
  // Card 2 (Top Right)
  [
    { src: `${SUPABASE_STORAGE_URL}/photos/art_class2.webp`, title: "Fine Arts & Color Theory", badge: "✨ Color Studio" },
    { src: `${SUPABASE_STORAGE_URL}/photos/robotic_class2.webp`, title: "Young Innovators Robotics", badge: "🚀 STEM Robotics" },
    { src: `${SUPABASE_STORAGE_URL}/photos/harware_fix_learning.webp`, title: "Circuit & Hardware Engineering", badge: "⚡ Hardware Lab" },
    { src: `${SUPABASE_STORAGE_URL}/photos/Fun_and_learning.webp`, title: "Fun, Logic & Team Learning", badge: "🎉 Fun & Learning" },
    { src: `${SUPABASE_STORAGE_URL}/photos/classroom2.webp`, title: "Physics & Science Laboratory", badge: "🔬 Science Lab" },
  ],
  // Card 3 (Bottom Right)
  [
    { src: `${SUPABASE_STORAGE_URL}/photos/karate_class1.webp`, title: "Martial Arts & Self Defense Dojo", badge: "🥋 Karate Dojo" },
    { src: `${SUPABASE_STORAGE_URL}/photos/robotic_class3.webp`, title: "Sensor Programming & Mechanics", badge: "⚙️ Sensor Logic" },
    { src: `${SUPABASE_STORAGE_URL}/photos/art_class3.webp`, title: "Sketch & Acrylic Painting", badge: "🖌️ Canvas Masterclass" },
    { src: `${SUPABASE_STORAGE_URL}/photos/grow_with_green.webp`, title: "Grow With Green Discovery", badge: "🌱 Nature & Science" },
    { src: `${SUPABASE_STORAGE_URL}/photos/classroom3.webp`, title: "Mathematics & Problem Solving", badge: "📐 Math Session" },
  ],
  // Card 4 (Bottom Left)
  [
    { src: `${SUPABASE_STORAGE_URL}/photos/learn_with_fun.webp`, title: "Interactive Spoken English", badge: "🗣️ Spoken Fluency" },
    { src: `${SUPABASE_STORAGE_URL}/photos/art_class4.webp`, title: "Young Artists Studio Session", badge: "🎨 Sketch Studio" },
    { src: `${SUPABASE_STORAGE_URL}/photos/robotic_class4.webp`, title: "Robotics Circuit & Coding", badge: "💡 Circuit Coding" },
    { src: `${SUPABASE_STORAGE_URL}/photos/art_class5.webp`, title: "Junior Arts & Craft Workshop", badge: "🌈 Junior Arts" },
    { src: `${SUPABASE_STORAGE_URL}/photos/robotic_class5.webp`, title: "Advanced Bot Assembly Workshop", badge: "🏆 Bot Workshop" },
  ],
];

// All 20 photos metadata collection for lightboxes and full gallery (fetched from Supabase bucket)
export const ALL_PHOTOS = [
  { id: "art1", src: `${SUPABASE_STORAGE_URL}/photos/art_class1.webp`, title: "Creative Art Studio", tag: "Creative Arts", badge: "🎨 Art Studio", desc: "Students learning sketching, proportion, and color harmonies with easel and canvas." },
  { id: "art2", src: `${SUPABASE_STORAGE_URL}/photos/art_class2.webp`, title: "Color Theory & Drawing", tag: "Creative Arts", badge: "✨ Color Studio", desc: "Fine arts students exploring pigment blending and shading techniques." },
  { id: "art3", src: `${SUPABASE_STORAGE_URL}/photos/art_class3.webp`, title: "Sketch & Acrylic Painting", tag: "Creative Arts", badge: "🖌️ Painting Masterclass", desc: "Personalized studio sessions developing advanced acrylic compositions." },
  { id: "art4", src: `${SUPABASE_STORAGE_URL}/photos/art_class4.webp`, title: "Young Artists Studio Session", tag: "Creative Arts", badge: "🎨 Sketch Studio", desc: "Junior batch discovering artistic confidence through guided figure drawing." },
  { id: "art5", src: `${SUPABASE_STORAGE_URL}/photos/art_class5.webp`, title: "Junior Arts & Craft Workshop", tag: "Creative Arts", badge: "🌈 Junior Arts", desc: "Engaging craft projects blending color, geometry, and creative imagination." },
  { id: "cls1", src: `${SUPABASE_STORAGE_URL}/photos/classroom1.webp`, title: "Interactive Concept Lecture", tag: "Academic", badge: "📚 Smart Classroom", desc: "Active group discussions breaking down tough physics and science concepts." },
  { id: "cls2", src: `${SUPABASE_STORAGE_URL}/photos/classroom2.webp`, title: "Physics & Science Laboratory", tag: "Academic", badge: "🔬 Science Lab", desc: "Mentors guiding students through board-exam problem sets with interactive feedback." },
  { id: "cls3", src: `${SUPABASE_STORAGE_URL}/photos/classroom3.webp`, title: "Mathematics & Problem Solving", tag: "Academic", badge: "📐 Math Session", desc: "High-focus mathematics practice drills with dedicated mentor support." },
  { id: "cmp", src: `${SUPABASE_STORAGE_URL}/photos/computer_learning.webp`, title: "Digital Literacy & Coding Lab", tag: "Tech & Coding", badge: "💻 Coding Lab", desc: "Workstation stations where students learn web design, coding, and software tools." },
  { id: "fun", src: `${SUPABASE_STORAGE_URL}/photos/Fun_and_learning.webp`, title: "Fun, Logic & Collaborative Learning", tag: "Active Learning", badge: "🎉 Fun & Learning", desc: "Interactive learning games that make logic, science, and teamwork enjoyable." },
  { id: "grn", src: `${SUPABASE_STORAGE_URL}/photos/grow_with_green.webp`, title: "Grow With Green Discovery", tag: "Outdoor & Science", badge: "🌱 Nature & Science", desc: "Experiential botany and environmental science connecting kids with real nature." },
  { id: "hrd", src: `${SUPABASE_STORAGE_URL}/photos/harware_fix_learning.webp`, title: "Circuit & Hardware Engineering", tag: "Tech & Coding", badge: "⚡ Hardware Lab", desc: "Hands-on diagnostic testing, motherboard circuitry, and safe hardware repair." },
  { id: "kar", src: `${SUPABASE_STORAGE_URL}/photos/karate_class1.webp`, title: "Martial Arts & Self Defense Dojo", tag: "Sports & Fitness", badge: "🥋 Karate Dojo", desc: "Discipline, balance, self-defense mastery, and physical fitness in our active dojo." },
  { id: "lrn", src: `${SUPABASE_STORAGE_URL}/photos/learn_with_fun.webp`, title: "Interactive Spoken English", tag: "Language", badge: "🗣️ Spoken Fluency", desc: "Conversational English drills that break hesitation and build real fluency." },
  { id: "prj", src: `${SUPABASE_STORAGE_URL}/photos/project_building.webp`, title: "Hands-on Project Building", tag: "Active Learning", badge: "🛠️ Project Lab", desc: "Collaborative teamwork turning ideas into real functioning prototypes." },
  { id: "rob1", src: `${SUPABASE_STORAGE_URL}/photos/robotic_class1.webp`, title: "Robotics & Microcontroller STEM", tag: "Robotics & STEM", badge: "🤖 Robotics Lab", desc: "Assembling robots, wiring sensors, and programming microcontrollers." },
  { id: "rob2", src: `${SUPABASE_STORAGE_URL}/photos/robotic_class2.webp`, title: "Young Innovators Robotics", tag: "Robotics & STEM", badge: "🚀 STEM Robotics", desc: "Early STEM robotics experiments exploring gears, motors, and automation." },
  { id: "rob3", src: `${SUPABASE_STORAGE_URL}/photos/robotic_class3.webp`, title: "Sensor Programming & Mechanics", tag: "Robotics & STEM", badge: "⚙️ Sensor Logic", desc: "Fine-tuning ultrasonic, infrared, and optical sensors for obstacle tracking." },
  { id: "rob4", src: `${SUPABASE_STORAGE_URL}/photos/robotic_class4.webp`, title: "Robotics Circuit & Coding Session", tag: "Robotics & STEM", badge: "💡 Circuit Coding", desc: "Coding autonomous logic and testing motor drivers on custom robot chassis." },
  { id: "rob5", src: `${SUPABASE_STORAGE_URL}/photos/robotic_class5.webp`, title: "Advanced Bot Assembly Workshop", tag: "Robotics & STEM", badge: "🏆 Bot Workshop", desc: "Precision assembly for competition-ready robotic prototypes and exhibitions." },
];
