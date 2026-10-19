import { HERO_CARD_STREAMS as BASE_STREAMS } from "../assets";

const BADGE_MAP_BN = {
  "🤖 Robotics Lab": "🤖 রোবোটিক্স ল্যাব",
  "🎨 Art Studio": "🎨 আর্ট স্টুডিও",
  "📚 Smart Classroom": "📚 স্মার্ট ক্লাসরুম",
  "💻 Coding Studio": "💻 কোডিং স্টুডিও",
  "🛠️ Project Lab": "🛠️ প্রজেক্ট ল্যাব",
  "✨ Color Studio": "✨ কালার স্টুডিও",
  "🚀 STEM Robotics": "🚀 স্টেম রোবোটিক্স",
  "⚡ Hardware Lab": "⚡ হার্ডওয়্যার ল্যাব",
  "🎉 Fun & Learning": "🎉 আনন্দ ও শিখন",
  "🔬 Science Lab": "🔬 সায়েন্স ল্যাব",
  "🥋 Karate Dojo": "🥋 কারাতে দোজো",
  "⚙️ Sensor Logic": "⚙️ সেন্সর লজিক",
  "🖌️ Canvas Masterclass": "🖌️ ক্যানভাস মাস্টারক্লাস",
  "🌱 Nature & Science": "🌱 প্রকৃতি ও বিজ্ঞান",
  "📐 Math Session": "📐 গণিত সেশন",
  "🗣️ Spoken Fluency": "🗣️ স্পোকেন ফ্লুয়েন্সি",
  "🎨 Sketch Studio": "🎨 স্কেচ স্টুডিও",
  "💡 Circuit Coding": "💡 সার্কিট কোডিং",
  "🌈 Junior Arts": "🌈 জুনিয়র আর্টস",
  "🏆 Bot Workshop": "🏆 বট ওয়ার্কশপ",
};

const TITLE_MAP_BN = {
  "Robotics & Microcontroller STEM": "রোবোটিক্স ও মাইক্রোকন্ট্রোলার স্টেম",
  "Creative Art & Canvas Drawing": "ক্রিয়েটিভ আর্ট ও ক্যানভাস ড্রয়িং",
  "Interactive Concept Lecture": "ইন্টারঅ্যাক্টিভ কনসেপ্ট লেকচার",
  "Digital Literacy & Coding Lab": "ডিজিটাল লিটারেসি ও কোডিং ল্যাব",
  "Hands-on Project Building": "হাতে-কলমে প্রজেক্ট নির্মাণ",
  "Fine Arts & Color Theory": "ফাইন আর্টস ও কালার থিওরি",
  "Young Innovators Robotics": "তরুণ উদ্ভাবকদের রোবোটিক্স",
  "Circuit & Hardware Engineering": "সার্কিট ও হার্ডওয়্যার ইঞ্জিনিয়ারিং",
  "Fun, Logic & Team Learning": "আনন্দ, লজিক ও টিম লার্নিং",
  "Physics & Science Laboratory": "পদার্থবিজ্ঞান ও সায়েন্স ল্যাবরেটরি",
  "Martial Arts & Self Defense Dojo": "মার্শাল আর্টস ও আত্মরক্ষা দোজো",
  "Sensor Programming & Mechanics": "সেন্সর প্রোগ্রামিং ও মেকানিক্স",
  "Sketch & Acrylic Painting": "স্কেচ ও এক্রিলিক পেইন্টিং",
  "Grow With Green Discovery": "গ্রো উইথ গ্রিন আবিষ্কার",
  "Mathematics & Problem Solving": "উচ্চতর গণিত ও সমস্যা সমাধান",
  "Interactive Spoken English": "ইন্টারঅ্যাক্টিভ স্পোকেন ইংলিশ",
  "Young Artists Studio Session": "তরুণ চিত্রশিল্পীদের স্টুডিও সেশন",
  "Robotics Circuit & Coding": "রোবোটিক্স সার্কিট ও কোডিং",
  "Junior Arts & Craft Workshop": "জুনিয়র আর্টস ও ক্রাফট ওয়ার্কশপ",
  "Advanced Bot Assembly Workshop": "উন্নত রোবট অ্যাসেম্বলি ওয়ার্কশপ",
};

export function getHeroStreams(lang) {
  if (lang === "en") return BASE_STREAMS;

  return BASE_STREAMS.map((cardStream) =>
    cardStream.map((item) => ({
      ...item,
      title: TITLE_MAP_BN[item.title] || item.title,
      badge: BADGE_MAP_BN[item.badge] || item.badge,
    }))
  );
}
