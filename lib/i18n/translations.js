export const TRANSLATIONS = {
  en: {
    nav: [
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
    ],
    enrolNow: "Enrol now",
    hero: {
      words: ["Learn", "by", "practice."],
      sub: "Onushilon Academy gives you expert mentors, live interactive classes and daily exercises, from SSC to job-ready tech skills.",
      browseCourses: "Browse courses",
      exploreMoments: "Explore class moments",
      callNow: "📞 Call now",
      photoTooltip: "Click to view full photo • Hover to pause",
      paused: "⏸ Paused",
    },
    marquee: [
      "Live classes",
      "Daily practice",
      "Mock exams",
      "Mentor feedback",
      "Recorded lessons",
      "Study groups",
    ],
    story: {
      h2: "Onushilon means practice. We took it literally.",
      lead: "We started because lectures alone never made anyone truly confident. Every course here is built around doing the work, getting detailed mentor feedback, and mastering the concept.",
      timeline: [
        [
          "2014",
          "Five students, one rented room, and a rule: every lesson ends with practice.",
        ],
        [
          "2018",
          "We opened a second branch and began recording every class for revision.",
        ],
        ["2022", "Onushilon went online. Students from 40 districts joined live."],
        ["Today", "Over 12,000 learners practise with us every week."],
      ],
    },
    courses: {
      h2: "Pick a course and start this week",
      lead: "New batches begin every month. Each course includes weekly practice sets and an expert mentor who reviews your progress.",
      searchPlaceholder: "Search courses, topics...",
      searchAria: "Search courses",
      detailsBtn: "Details",
      enrolBtn: "Enrol",
      emptyTitle: "No courses found matching",
      emptySub: "Try clearing your search query or switching categories.",
      resetFilters: "Reset Filters",
    },
    modal: {
      leadMentor: "Lead Mentor:",
      liveSchedule: "Live Schedule",
      formatAndBatch: "Format & Batch",
      keyTopics: "Key Syllabus & Practice Topics:",
      feeLabel: "Complete Course Fee",
      proceedBtn: "Proceed to Enrol →",
      closeAria: "Close modal",
    },
    mentors: {
      kicker: "Faculty & Mentorship",
      h2: "Learn from practicing mentors",
      lead: "Our faculty consists of practicing engineers, artists, university educators, and martial arts masters who review your work personally every single week.",
      counterTemplate: "{start}–{end} of {total} Mentors",
      counterZero: "0 Mentors",
      prevAria: "Previous mentors",
      nextAria: "Next mentors",
      pageAria: "Go to mentors page {p}",
      pageTitle: "Page {p}",
    },
    practice: {
      badge: "Interactive Demo",
      h2: "Experience Onushilon: Try a Practice Task",
      lead: "The best way to understand our methodology is to experience it. Solve a question below and see how instant mentor feedback works.",
      topicLabel: "Topic:",
      streakLabel: "🔥 Streak:",
      solvedSuffix: "solved",
      feedbackCorrect: "Excellent work! Mentor feedback:",
      feedbackWrong: "Mentor guidance:",
      selectHint: "👉 Select an answer above to reveal mentor guidance",
      readyText: "Ready for regular daily practice?",
      exploreBtn: "Explore Full Courses →",
      tasks: [
        {
          subject: "HSC Physics",
          topic: "Work, Power & Energy",
          question:
            "A body of mass 2 kg is dropped from a height of 10m. What is its kinetic energy just before hitting the ground? (Take g = 9.8 m/s²)",
          options: ["98 Joules", "196 Joules", "392 Joules", "49 Joules"],
          correct: 1,
          explanation:
            "By conservation of mechanical energy, Potential Energy at top = Kinetic Energy at bottom. KE = m × g × h = 2 kg × 9.8 m/s² × 10m = 196 Joules.",
          mentorNote:
            "Classic conservation of energy! Remember: you don't even need to calculate velocity first.",
        },
        {
          subject: "Spoken English",
          topic: "Natural Fluency",
          question:
            "Which response sounds most natural when a colleague thanks you for helping them with an important project?",
          options: [
            "No problem, don't mention it at all!",
            "I was strictly obligated by my duty to assist.",
            "Glad I could help! Let me know if you need anything else.",
            "It is my extreme formal pleasure and honor.",
          ],
          correct: 2,
          explanation:
            "'Glad I could help!' is warm, polite, and universally used in both conversational and professional workplace environments.",
          mentorNote:
            "Tone is as vital as grammar! Natural friendly phrasing leaves the strongest positive impression.",
        },
        {
          subject: "Web Development",
          topic: "Modern CSS",
          question:
            "What is the cleanest modern CSS rule to center a child item both horizontally and vertically inside its container?",
          options: [
            "display: flex; justify-content: center; align-items: center;",
            "margin: auto; float: center; align: center;",
            "text-align: center; vertical-align: middle;",
            "position: absolute; left: 50%; right: 50%;",
          ],
          correct: 0,
          explanation:
            "Flexbox with 'justify-content: center' (main axis) and 'align-items: center' (cross axis) centers children predictably across any viewport.",
          mentorNote:
            "Spot on! Flexbox or CSS Grid ('display: grid; place-items: center;') are current industry best practices.",
        },
      ],
    },
    moments: {
      h2: "Class moments & life at Onushilon",
      lead: "Take an authentic look inside our robotics labs, art workshops, coding studios, karate dojo, and science classrooms.",
    },
    lightbox: {
      closeAria: "Close lightbox",
      prevAria: "Previous moment",
      nextAria: "Next moment",
      counterTemplate: "{current} of {total}",
      defaultTitle: "Academy Moment",
      defaultCat: "Onushilon Academy",
    },
    why: {
      stats: [
        [12000, "+", "Active learners"],
        [85, "", "Expert mentors"],
        [40, "", "Districts reached"],
        [96, "%", "Finish their course"],
      ],
      h2: "What you get when you join",
      items: [
        [
          "Mentors who read your work",
          "Every submission gets personalized written and audio feedback within 24 hours.",
        ],
        [
          "Learn at your pace",
          "Every live class is recorded in HD and posted with notes, formula sheets, and practice sets.",
        ],
        [
          "Exams that feel real",
          "Monthly timed mock tests under board/exam conditions, with comprehensive score breakdowns.",
        ],
      ],
    },
    voices: {
      h2: "Students say it better",
      prevAria: "Previous review",
      nextAria: "Next review",
      testimonials: [
        [
          "The art mentors here don't just teach techniques; they helped me discover my own painting style. Seeing my artwork on exhibition was a dream come true!",
          "Tasnim Akter",
          "Creative Arts & Design graduate",
          "t1",
        ],
        [
          "Building and programming an autonomous robot with my own hands was unforgettable. The robotics lab mentors guided us through every sensor and circuit.",
          "Sadman Sakib",
          "Robotics & STEM batch 2024",
          "t2",
        ],
        [
          "Practice every single day finally made physics equations click for me. My mentor reviewed every step of my solution, not just the final number.",
          "Nusrat Jahan",
          "HSC Science achiever, Dhaka",
          "t3",
        ],
        [
          "I was terrified of speaking English in public. The interactive fun sessions and 1-on-1 speaking drills completely transformed my fluency and confidence.",
          "Rafiul Islam",
          "Spoken English graduate",
          "t4",
        ],
      ],
    },
    faq: {
      h2: "Frequently asked questions",
      lead: "Got questions before enrolling? Here is everything you need to know about our batches, mentors, and policies.",
      items: [
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
      ],
    },
    join: {
      h2: "Your next batch starts this week",
      lead: "Reserve your seat now. A dedicated academic counsellor will connect with you to complete your batch onboarding.",
      namePlaceholder: "Full name",
      nameAria: "Full name",
      phonePlaceholder: "Mobile / WhatsApp (+880)",
      phoneAria: "Phone number",
      emailPlaceholder: "Your email address",
      emailAria: "Email",
      selectCourseAria: "Select course",
      submitBtn: "Confirm Seat Reservation →",
      successTitle: "🎉 Enrolment Request Received!",
      successReserved: "Thank you {name}! We have reserved a provisional seat for {course}.",
      successContact: "Our academic counsellor will reach out via WhatsApp/Phone at {phone} and send batch details to {email} within 24 hours.",
      enrolAnother: "Enrol in another course",
    },
    floatingCall: {
      callNow: "Call now",
      ariaLabel: "Open WhatsApp inbox",
    },
    footer: {
      brand: "Onushilon Academy",
      tagline: "Learn by practice.",
      explore: "Explore",
      contact: "Contact",
      whatsapp: "💬 WhatsApp: {phone} (9 AM – 10 PM)",
      email: "hello@onushilon.example",
      location: "Dhaka, Bangladesh",
      copyright: "© {year} Onushilon Academy. All rights reserved.",
      developedBy: "Developed by",
    },
    langSwitcher: {
      en: "English",
      bn: "বাংলা",
      shortEn: "EN",
      shortBn: "বাং",
      ariaLabel: "Switch language between English and Bangla",
    },
  },

  bn: {
    nav: [
      ["home", "হোম"],
      ["story", "গল্প"],
      ["courses", "কোর্সসমূহ"],
      ["mentors", "মেন্টরবৃন্দ"],
      ["practice", "অনুশীলন"],
      ["moments", "মুহূর্ত"],
      ["why", "কেন আমরা"],
      ["voices", "শিক্ষার্থীরা"],
      ["faq", "জিজ্ঞাসা"],
      ["join", "ভর্তি হন"],
    ],
    enrolNow: "ভর্তি হন",
    hero: {
      words: ["চর্চায়", "শিখি,", "অনুশীলনে।"],
      sub: "অনলাইন ও অফলাইনে অভিজ্ঞ মেন্টরদের নিবিড় দিকনির্দেশনা, সরাসরি ইন্টারঅ্যাক্টিভ ক্লাস এবং প্রতিদিনের অনুশীলনের মাধ্যমে নিজেকে গড়ে তুলুন।",
      browseCourses: "কোর্সসমূহ দেখুন",
      exploreMoments: "ক্লাসের মুহূর্ত দেখুন",
      callNow: "📞 কল করুন",
      photoTooltip: "ছবি দেখতে ক্লিক করুন • থামাতে মাউস রাখুন",
      paused: "⏸ বিরতি",
    },
    marquee: [
      "লাইভ ক্লাস",
      "প্রতিদিনের অনুশীলন",
      "মক টেস্ট",
      "মেন্টর ফিডব্যাক",
      "রেকর্ডেড লেকচার",
      "স্টাডি গ্রুপ",
    ],
    story: {
      h2: "অনুশীলন মানেই চর্চা। আমরা একে বাস্তবে রূপ দিয়েছি।",
      lead: "শুধু লেকচার শুনে কেউ কোনো বিষয়ে দক্ষ হতে পারে না। আমাদের প্রতিটি কোর্স সাজানো হয়েছে কাজ করার মাধ্যমে শেখা, মেন্টরের নিবিড় মূল্যায়ন এবং মূল বিষয়বস্তু গভীরভাবে আয়ত্ত করার ওপর ভিত্তি করে।",
      timeline: [
        [
          "২০১৪",
          "পাঁচজন শিক্ষার্থী, একটি ভাড়া করা কক্ষ এবং একটিই মূলমন্ত্র: প্রতিটি ক্লাসের শেষেই নিয়মিত অনুশীলন।",
        ],
        [
          "২০১৮",
          "দ্বিতীয় শাখার যাত্রা এবং ক্লাসের পর রিভিশন নিশ্চিত করতে প্রতিটি সেশনের রেকর্ডিং শুরু।",
        ],
        [
          "২০২২",
          "অনুশীলন ছড়িয়ে পড়ল অনলাইনে। সারা দেশের ৪০টির বেশি জেলা থেকে শিক্ষার্থীরা ক্লাসে যুক্ত হলো।",
        ],
        [
          "আজকের দিন",
          "বর্তমানে প্রতি সপ্তাহে ১২,০০০-এর বেশি শিক্ষার্থী আমাদের সাথে নিয়মিত চর্চায় যুক্ত রয়েছে।",
        ],
      ],
    },
    courses: {
      h2: "পছন্দের কোর্স বেছে নিয়ে শুরু করুন এই সপ্তাহেই",
      lead: "প্রতি মাসেই শুরু হয় নতুন ব্যাচ। প্রতিটি কোর্সে রয়েছে সাপ্তাহিক অনুশীলন সেট এবং এক্সপার্ট মেন্টরের সরাসরি অগ্রগতি মূল্যায়ন।",
      searchPlaceholder: "কোর্স বা টপিক খুঁজুন...",
      searchAria: "কোর্স অনুসন্ধান করুন",
      detailsBtn: "বিস্তারিত",
      enrolBtn: "ভর্তি হন",
      emptyTitle: "কোনো কোর্স পাওয়া যায়নি",
      emptySub: "অন্য কী-ওয়ার্ড দিয়ে অনুসন্ধান করুন অথবা ক্যাটাগরি পরিবর্তন করে দেখুন।",
      resetFilters: "ফিল্টার রিসেট করুন",
    },
    modal: {
      leadMentor: "প্রধান মেন্টর:",
      liveSchedule: "লাইভ শিডিউল",
      formatAndBatch: "ফরম্যাট ও আসন সংখ্যা",
      keyTopics: "মূল সিলেবাস ও প্র্যাকটিস টপিকসমূহ:",
      feeLabel: "সম্পূর্ণ কোর্স ফি",
      proceedBtn: "ভর্তির দিকে এগিয়ে যান →",
      closeAria: "মোডাল বন্ধ করুন",
    },
    mentors: {
      kicker: "অনুষদ ও মেন্টরশিপ",
      h2: "পেশাদার অভিজ্ঞ মেন্টরদের কাছে শিখুন",
      lead: "আমাদের মেন্টর প্যানেলে রয়েছেন দক্ষ প্রকৌশলী, প্রথিতযশা শিল্পী, বিশ্ববিদ্যালয়ের শিক্ষক এবং মার্শাল আর্ট ওস্তাদ—যারা প্রতি সপ্তাহে আপনার কাজ ব্যক্তিগতভাবে মূল্যায়ন করেন।",
      counterTemplate: "{start}–{end} / {total} জন মেন্টর",
      counterZero: "০ জন মেন্টর",
      prevAria: "পূর্ববর্তী মেন্টর",
      nextAria: "পরবর্তী মেন্টর",
      pageAria: "মেন্টরদের পৃষ্ঠা {p}-এ যান",
      pageTitle: "পৃষ্ঠা {p}",
    },
    practice: {
      badge: "ইন্টারেক্টিভ ডেমো",
      h2: "অনুশীলনের অভিজ্ঞতা নিন: একটি প্রশ্নের সমাধান করুন",
      lead: "আমাদের শিখন পদ্ধতি বোঝার সবচেয়ে ভালো উপায় হলো নিজে চেষ্টা করা। নিচের প্রশ্নটির উত্তর দিন এবং দেখুন কীভাবে তাৎক্ষণিক মেন্টর ফিডব্যাক পাওয়া যায়।",
      topicLabel: "বিষয়:",
      streakLabel: "🔥 স্ট্রিক:",
      solvedSuffix: "সমাধান হয়েছে",
      feedbackCorrect: "চমৎকার উত্তর! মেন্টরের মূল্যায়ন:",
      feedbackWrong: "মেন্টর গাইডেন্স:",
      selectHint: "👉 মেন্টর গাইডেন্স দেখতে ওপরের যেকোনো একটি উত্তর নির্বাচন করুন",
      readyText: "প্রতিদিন নিয়মিত অনুশীলন করতে চান?",
      exploreBtn: "পূর্ণাঙ্গ কোর্সসমূহ দেখুন →",
      tasks: [
        {
          subject: "এইচএসসি পদার্থবিজ্ঞান",
          topic: "কাজ, ক্ষমতা ও শক্তি",
          question:
            "২ কেজি ভরের একটি বস্তুকে ১০ মিটার উচ্চতা থেকে নিচে ফেলা হলো। ভূমি স্পর্শ করার ঠিক পূর্ব মুহূর্তে বস্তুটির গতিশক্তি কত হবে? (g = ৯.৮ মি/সে² ধরুন)",
          options: ["৯৮ জুল", "১৯৬ জুল", "৩৯২ জুল", "৪৯ জুল"],
          correct: 1,
          explanation:
            "যান্ত্রিক শক্তি সংরক্ষণশীলতার সূত্রানুযায়ী, সর্বোচ্চ বিন্দুর বিভব শক্তি = ভূমি স্পর্শের ঠিক আগের মুহূর্তের গতিশক্তি। অর্থাৎ, গতিশক্তি = m × g × h = ২ কেজি × ৯.৮ মি/সে² × ১০ মি = ১৯৬ জুল।",
          mentorNote:
            "শক্তি সংরক্ষণশীলতার চিরাচরিত প্রয়োগ! মনে রাখবেন: এখানে আগে বেগ (v) বের করার কোনো প্রয়োজনই নেই।",
        },
        {
          subject: "স্পোকেন ইংলিশ",
          topic: "সাবলীল কথোপকথন",
          question:
            "কোনো গুরুত্বপূর্ণ কাজে সহকর্মীকে সাহায্য করার পর তিনি ধন্যবাদ জানালে নিচের কোন উত্তরটি সবচেয়ে স্বাভাবিক ও মার্জিত শোনায়?",
          options: [
            "No problem, don't mention it at all!",
            "I was strictly obligated by my duty to assist.",
            "Glad I could help! Let me know if you need anything else.",
            "It is my extreme formal pleasure and honor.",
          ],
          correct: 2,
          explanation:
            "'Glad I could help!' কথাটি অত্যন্ত আন্তরিক, বিনম্র এবং সাধারণ আড্ডা বা পেশাদার কর্মক্ষেত্র—উভয় পরিবেশেই বহুল ব্যবহৃত ও সমাদৃত।",
          mentorNote:
            "গ্রামারের মতোই সঠিক টোন ও আন্তরিকতা বজায় রাখা অত্যন্ত গুরুত্বপূর্ণ! সাবলীল প্রকাশভঙ্গি ইতিবাচক মনোভাব প্রকাশ করে।",
        },
        {
          subject: "ওয়েব ডেভেলপমেন্ট",
          topic: "আধুনিক সিএসএস",
          question:
            "একটি কনটেইনারের ভেতরে কোনো চাইল্ড এলিমেন্টকে অনুভূমিক ও উল্লম্ব—উভয় দিকেই পুরোপুরি মাঝে (Center) বসানোর সবচেয়ে আধুনিক ও পরিচ্ছন্ন CSS কোড কোনটি?",
          options: [
            "display: flex; justify-content: center; align-items: center;",
            "margin: auto; float: center; align: center;",
            "text-align: center; vertical-align: middle;",
            "position: absolute; left: 50%; right: 50%;",
          ],
          correct: 0,
          explanation:
            "Flexbox-এ 'justify-content: center' (মেইন অ্যাক্সিস) এবং 'align-items: center' (ক্রস অ্যাক্সিস) যেকোনো স্ক্রিন সাইজেই চাইল্ড আইটেমকে নিখুঁতভাবে সেন্টারে রাখে।",
          mentorNote:
            "একদম সঠিক! Flexbox কিংবা CSS Grid ('display: grid; place-items: center;') বর্তমান আধুনিক ওয়েব ডেভেলপমেন্টের সেরা প্র্যাকটিস।",
        },
      ],
    },
    moments: {
      h2: "ক্লাসের মুহূর্ত ও অনুশীলনের জীবন",
      lead: "আমাদের রোবোটিক্স ল্যাব, আর্ট ওয়ার্কশপ, কোডিং স্টুডিও, কারাতে দোজো এবং সায়েন্স ক্লাসরুমের এক ঝলক জীবন্ত দৃশ্য।",
    },
    lightbox: {
      closeAria: "ছবি বন্ধ করুন",
      prevAria: "পূর্ববর্তী মুহূর্ত",
      nextAria: "পরবর্তী মুহূর্ত",
      counterTemplate: "{current} / {total}",
      defaultTitle: "একাডেমি মুহূর্ত",
      defaultCat: "অনুশীলন একাডেমি",
    },
    why: {
      stats: [
        [12000, "+", "সক্রিয় শিক্ষার্থী"],
        [85, "", "দক্ষ মেন্টর"],
        [40, "", "জেলায় বিস্তার"],
        [96, "%", "কোর্স সম্পন্ন করেছেন"],
      ],
      h2: "অনুশীলনে যুক্ত হলে যা পাবেন",
      items: [
        [
          "মেন্টর যারা আপনার প্রতিটি কাজ নিবিড়ভাবে পড়েন",
          "প্রতিটি হোমওয়ার্ক ও প্র্যাকটিস সাবমিশনে ২৪ ঘণ্টার মধ্যে মেলে লিখিত ও অডিও ফিডব্যাক।",
        ],
        [
          "নিজের গতিতে শিখুন স্বাচ্ছন্দ্যে",
          "প্রতিটি লাইভ ক্লাসের এইচডি রেকর্ডিং, লেকচার নোট, সূত্রের শিট ও প্র্যাকটিস সেট আজীবনের জন্য সংরক্ষিত থাকে।",
        ],
        [
          "বাস্তব পরীক্ষার আমেজ",
          "বোর্ড বা জাতীয় পরীক্ষার আদলে মাসিক টাইমিং মক টেস্ট এবং দুর্বলতা দূর করতে বিস্তারিত স্কোর বিশ্লেষণ।",
        ],
      ],
    },
    voices: {
      h2: "শিক্ষার্থীদের নিজস্ব অভিজ্ঞতা",
      prevAria: "পূর্ববর্তী রিভিউ",
      nextAria: "পরবর্তী রিভিউ",
      testimonials: [
        [
          "এখানকার মেন্টররা শুধু অঙ্কন কৌশল শেখান না; তারা আমার নিজস্ব চিত্রশৈলী খুঁজে পেতে সাহায্য করেছেন। বার্ষিক প্রদর্শনীতে নিজের আঁকা ছবি দেখতে পারা স্বপ্নের মতো ছিল!",
          "তাসনিম আক্তার",
          "ক্রিয়েটিভ আর্টস ও ডিজাইন শিক্ষার্থী",
          "t1",
        ],
        [
          "নিজের হাতে একটি স্বয়ংক্রিয় রোবট তৈরি ও প্রোগ্রাম করার অনুভূতি অসাধারণ। ল্যাব মেন্টররা প্রতিটি সেন্সর ও সার্কিট বুঝতে আমাদের নিখুঁতভাবে গাইড করেছেন।",
          "সাদমান সাকিব",
          "রোবোটিক্স ও স্টেম ব্যাচ ২০২৪",
          "t2",
        ],
        [
          "প্রতিদিনের অনুশীলনের ফলে পদার্থবিজ্ঞানের কঠিন সূত্রগুলো চোখের সামনে পানির মতো সহজ হয়ে গেছে। মেন্টর শুধু উত্তর নয়, আমার হিসাবের প্রতিটি লাইন পর্যালোচনা করেছেন।",
          "নুসরাত জাহান",
          "এইচএসসি সায়েন্স শিক্ষার্থী, ঢাকা",
          "t3",
        ],
        [
          "সবার সামনে ইংরেজিতে কথা বলতে আমি ভীষণ ভয় পেতাম। অনুশীলনের আনন্দদায়ক ইন্টারঅ্যাক্টিভ সেশন এবং ১-অন-১ স্পিকিং ড্রিল আমার জড়তা পুরোপুরি দূর করেছে।",
          "রাফিউল ইসলাম",
          "স্পোকেন ইংলিশ ব্যাচ শিক্ষার্থী",
          "t4",
        ],
      ],
    },
    faq: {
      h2: "সাধারণ কিছু জিজ্ঞাসা (FAQ)",
      lead: "ভর্তি হওয়ার আগে কোনো প্রশ্ন আছে? আমাদের ব্যাচ, মেন্টর এবং নীতিমালা সম্পর্কে প্রয়োজনীয় সব তথ্য নিচে দেওয়া হলো।",
      items: [
        {
          q: "লাইভ ক্লাস মিস করলে কী হবে?",
          a: "প্রতিটি লাইভ ক্লাসের এইচডি রেকর্ডিং ক্লাস শেষ হওয়ার ২ ঘণ্টার মধ্যেই আপনার স্টুডেন্ট পোর্টালে যুক্ত হয়ে যায়। আপনি সকল রেকর্ডিং, মেন্টরের স্লাইড নোট এবং অনুশীলনী আজীবন দেখতে পারবেন।",
        },
        {
          q: "২৪ ঘণ্টার মেন্টর ফিডব্যাক কীভাবে কাজ করে?",
          a: "প্রতিটি ক্লাসের পর আপনি পোর্টালে অনুশীলনী সমাধান করে জমা দেবেন। আপনার বিষয়ের নির্ধারিত মেন্টর আপনার সমাধান, ক্যালকুলেশন বা কোড লাইন ধরে পর্যবেক্ষণ করবেন এবং ২৪ ঘণ্টার মধ্যে ব্যক্তিগত অডিও ও লিখিত মন্তব্য জানাবেন।",
        },
        {
          q: "পেমেন্ট কীভাবে করা যায়?",
          a: "আমরা বিকাশ, নগদ, রকেট, যেকোনো স্থানীয় ক্রেডিট/ডেবিট কার্ড এবং ব্যাংক ট্রান্সফার গ্রহণ করি। ৪ মাস বা তার বেশি মেয়াদের কোর্সের ক্ষেত্রে ০% অতিরিক্ত ফি-তে দুটি সহজ মাসিক কিস্তিতে ফি পরিশোধের সুযোগ রয়েছে।",
        },
        {
          q: "কোর্স শেষে কি ভেরিফায়েড সার্টিফিকেট দেওয়া হয়?",
          a: "হ্যাঁ! যেসব শিক্ষার্থী ক্লাসের অন্তত ৮০% অনুশীলন জমা দেন এবং চূড়ান্ত মক টেস্টে উত্তীর্ণ হন, তারা ভেরিফায়েড ডিজিটাল সার্টিফিকেট পান যা লিঙ্কডইন এবং সিভিতে যুক্ত করা যায়।",
        },
        {
          q: "কলেজের পরীক্ষার সাথে সময় না মিললে কি ব্যাচ পরিবর্তন বা পজ করা যাবে?",
          a: "হ্যাঁ! প্রতিটি শিক্ষার্থীর জন্য একবার সম্পূর্ণ বিনামূল্যে ব্যাচ পজ বা শিডিউল পরিবর্তনের সুযোগ রয়েছে, যাতে আপনার প্রাতিষ্ঠানিক পরীক্ষার প্রস্তুতি বিঘ্নিত না হয়।",
        },
      ],
    },
    join: {
      h2: "আপনার পরবর্তী ব্যাচ শুরু হচ্ছে এই সপ্তাহেই",
      lead: "এখনই আপনার আসন নিশ্চিত করুন। আমাদের একজন অভিজ্ঞ একাডেমিক কাউন্সেলর আপনার সাথে যোগাযোগ করে ব্যাচ অনবোর্ডিং সম্পন্ন করবেন।",
      namePlaceholder: "আপনার পুরো নাম",
      nameAria: "পুরো নাম",
      phonePlaceholder: "মোবাইল / হোয়াটসঅ্যাপ (+৮৮০)",
      phoneAria: "ফোন নম্বর",
      emailPlaceholder: "আপনার ইমেইল ঠিকানা",
      emailAria: "ইমেইল",
      selectCourseAria: "কোর্স নির্বাচন করুন",
      submitBtn: "আসন সংরক্ষণ নিশ্চিত করুন →",
      successTitle: "🎉 ভর্তির আবেদন সফলভাবে গৃহীত হয়েছে!",
      successReserved: "ধন্যবাদ {name}! আমরা {course} কোর্সে আপনার জন্য সাময়িক আসন সংরক্ষণ করেছি।",
      successContact: "আমাদের একাডেমিক কাউন্সেলর আগামী ২৪ ঘণ্টার মধ্যে WhatsApp/ফোনে ({phone}) যোগাযোগ করবেন এবং {email} ঠিকানায় বিস্তারিত ব্যাচ শিডিউল পাঠাবেন।",
      enrolAnother: "অন্য কোর্সে আবেদন করুন",
    },
    floatingCall: {
      callNow: "কল করুন",
      ariaLabel: "WhatsApp-এ বার্তা পাঠান",
    },
    footer: {
      brand: "অনুশীলন একাডেমি",
      tagline: "অনুশীলনেই দক্ষতা।",
      explore: "এক্সপ্লোর",
      contact: "যোগাযোগ",
      whatsapp: "💬 হোয়াটসঅ্যাপ: {phone} (সকাল ৯টা – রাত ১০টা)",
      email: "hello@onushilon.example",
      location: "ঢাকা, বাংলাদেশ",
      copyright: "© {year} অনুশীলন একাডেমি। সর্বস্বত্ব সংরক্ষিত।",
      developedBy: "ডেভেলপমেন্টে",
    },
    langSwitcher: {
      en: "English",
      bn: "বাংলা",
      shortEn: "EN",
      shortBn: "বাং",
      ariaLabel: "ভাষা পরিবর্তন করুন (বাংলা / English)",
    },
  },
};
