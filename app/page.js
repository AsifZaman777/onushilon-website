"use client";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  animate,
  useReducedMotion,
} from "framer-motion";
import {
  IMG,
  LOGO,
  PHONE,
  PHONE_HREF,
  WHATSAPP_URL,
  ALL_PHOTOS,
} from "../lib/assets";
import {
  LanguageProvider,
  useI18n,
} from "../lib/i18n/LanguageContext";
import LanguageSwitcher from "../lib/i18n/LanguageSwitcher";
import { COURSE_CATEGORIES, COURSES } from "../lib/i18n/coursesData";
import { MENTOR_CATEGORIES, MENTORS } from "../lib/i18n/mentorsData";
import { MOMENTS_CATEGORIES, MOMENTS } from "../lib/i18n/momentsData";
import { getHeroStreams } from "../lib/i18n/heroStreams";
import {
  DynamicContentProvider,
  useDynamicContent,
} from "../lib/DynamicContentContext";

/* Image with a coloured placeholder until a file path is set in lib/assets.js */
const Pic = ({ k, src, alt = "", cls = "", style, children }) => {
  const imgSrc = src || (k && (k.startsWith("http") || k.startsWith("/") ? k : IMG[k]));
  return (
    <div className={`ph ${cls}`} style={style}>
      {imgSrc && <img src={imgSrc} alt={alt} loading="lazy" decoding="async" />}
      {children}
    </div>
  );
};

function Count({ to, suffix = "" }) {
  const { formatNumber, isBn } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const v = useMotionValue(0);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(v, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (x) => setN(Math.round(x)),
    });
    return c.stop;
  }, [inView, to, v]);

  const formatted = isBn
    ? formatNumber(n.toLocaleString("en-US"))
    : n.toLocaleString();

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

function Tilt({ children, className, onClick }) {
  const rx = useMotionValue(0),
    ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 200, damping: 18 }),
    sy = useSpring(ry, { stiffness: 200, damping: 18 });
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
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
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
  const { dict, isBn } = useI18n();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress, scrollY } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  const navItems = dict.nav;

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
    navItems.forEach(
      ([id]) =>
        document.getElementById(id) && io.observe(document.getElementById(id))
    );
    return () => io.disconnect();
  }, [navItems]);

  return (
    <>
      <motion.div className="bar" style={{ scaleX: bar }} />
      <AnimatePresence>
        {scrolled && (
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
              {LOGO ? (
                <img src={LOGO} alt={isBn ? "অনুশীলন" : "Onushilon"} />
              ) : (
                <>
                  <i>অ</i>
                  {isBn ? "অনুশীলন" : "Onushilon"}
                </>
              )}
            </a>
            <div className="links">
              {navItems.slice(1, -1).map(([id, l]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={active === id ? "on" : ""}
                >
                  {l}
                </a>
              ))}
              <LanguageSwitcher />
              <a href="#join" className="btn" style={{ padding: "10px 22px" }}>
                {dict.enrolNow}
              </a>
            </div>
            <button
              className="burger"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? "✕" : "☰"}
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
      {!scrolled && (
        <div className="hero-top-controls">
          <div className="hero-lang-wrap">
            <LanguageSwitcher />
          </div>
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
            style={{ position: "static" }}
          >
            <span className="burger-icon">
              <span className="line l1" />
              <span className="line l2" />
              <span className="line l3" />
            </span>
          </motion.button>
        </div>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            className="sheet"
            initial={{ clipPath: "circle(0% at 95% 4%)" }}
            animate={{ clipPath: "circle(150% at 95% 4%)" }}
            exit={{ clipPath: "circle(0% at 95% 4%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <button
              className="sheet-close"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
            {navItems.map(([id, l], i) => (
              <motion.a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.04 }}
              >
                {l}
              </motion.a>
            ))}
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
  tooltipText,
  pausedText,
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
              y: {
                times: [0, 0.16, 1],
                duration: 7.0,
                ease: ["easeOut", "linear"],
              },
              opacity: {
                times: [0, 0.14, 1],
                duration: 7.0,
                ease: "easeInOut",
              },
              scale: { times: [0, 0.16, 1], duration: 7.0, ease: "easeOut" },
            },
          }}
          exit={{
            y: -220,
            opacity: 0,
            scale: 0.94,
            transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
          }}
          onClick={() => onPhotoClick && onPhotoClick(current)}
          title={tooltipText}
        >
          <img
            src={current.src}
            alt={current.title}
            className="hero-card-img"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="hero-card-overlay">
            <span className="hero-badge">{current.badge}</span>
          </div>
          <span className="hero-card-pause-hint">{pausedText}</span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function Hero({ onPhotoClick }) {
  const { dict, lang } = useI18n();
  const { settings, dynamicSections } = useDynamicContent();
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const k = reduce ? 0 : 1;
  const y1 = useTransform(p, [0, 1], [0, -260 * k]);
  const y2 = useTransform(p, [0, 1], [0, 180 * k]);
  const y3 = useTransform(p, [0, 1], [0, -120 * k]);
  const r1 = useTransform(p, [0, 1], [-6, 14 * k]);
  const ty = useTransform(p, [0, 1], [0, 120 * k]);
  const fade = useTransform(p, [0.5, 1], [1, 0]);

  const baseStreams = getHeroStreams(lang);
  const heroSection = dynamicSections?.hero;
  const heroData =
    (lang === "en" ? heroSection?.data_en : heroSection?.data_bn) ||
    heroSection?.data_en ||
    heroSection?.data_bn;

  // Custom floating cards if provided in backend media
  const customCards = heroSection?.media?.floating_cards;
  const streams =
    customCards && Array.isArray(customCards) && customCards.length >= 4
      ? baseStreams.map((stream, idx) => {
          if (!customCards[idx]) return stream;
          const custom = customCards[idx];
          const newStream = [...stream];
          newStream[0] = {
            ...newStream[0],
            src: custom.src || newStream[0].src,
            title:
              (lang === "bn" ? custom.title_bn : custom.title_en) ||
              custom.title ||
              newStream[0].title,
            badge:
              (lang === "bn" ? custom.badge_bn : custom.badge_en) ||
              custom.badge ||
              newStream[0].badge,
          };
          return newStream;
        })
      : baseStreams;

  // Dynamic headline words
  let words = dict.hero?.words || ["Learn", "by", "practice."];
  if (heroData?.headline_words) {
    if (Array.isArray(heroData.headline_words) && heroData.headline_words.length > 0) {
      words = heroData.headline_words;
    } else if (typeof heroData.headline_words === "string") {
      words = heroData.headline_words
        .split("\n")
        .map((w) => w.trim())
        .filter(Boolean);
      if (words.length === 0) words = [heroData.headline_words];
    }
  }

  const sub = heroData?.subtitle || dict.hero?.sub;
  const browseCoursesText =
    heroData?.primary_cta_text || dict.hero?.browseCourses || "Browse courses";
  const exploreMomentsText =
    heroData?.secondary_cta_text || dict.hero?.exploreMoments || "Explore class moments";
  const callNowText = heroData?.call_now_text || dict.hero?.callNow || "📞 Call now";

  return (
    <section id="home" className="hero" ref={ref}>
      <div className="hero-in">
        <motion.div className="glow" style={{ y: y2 }} />

        <RisingHeroBox
          stream={streams[0]}
          className="f1"
          parallaxY={y1}
          parallaxRotate={r1}
          interval={8000}
          initialDelay={0}
          onPhotoClick={onPhotoClick}
          tooltipText={dict.hero.photoTooltip}
          pausedText={dict.hero.paused}
        />
        <RisingHeroBox
          stream={streams[1]}
          className="f2"
          parallaxY={y2}
          interval={8000}
          initialDelay={2000}
          onPhotoClick={onPhotoClick}
          tooltipText={dict.hero.photoTooltip}
          pausedText={dict.hero.paused}
        />
        <RisingHeroBox
          stream={streams[2]}
          className="f3"
          parallaxY={y3}
          interval={8000}
          initialDelay={4000}
          onPhotoClick={onPhotoClick}
          tooltipText={dict.hero.photoTooltip}
          pausedText={dict.hero.paused}
        />
        <RisingHeroBox
          stream={streams[3]}
          className="f4"
          parallaxY={y1}
          interval={8000}
          initialDelay={6000}
          onPhotoClick={onPhotoClick}
          tooltipText={dict.hero.photoTooltip}
          pausedText={dict.hero.paused}
        />

        <motion.div
          style={{
            y: ty,
            opacity: fade,
            position: "relative",
            zIndex: 3,
            padding: "0 4vw",
          }}
        >
          <h1>
            {words.map((w, i) => (
              <span key={`${w}-${i}`}>
                <motion.span
                  style={{ display: "block" }}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1,
                    delay: 0.15 + i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {i === words.length - 1 ? <em>{w}</em> : w}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {sub}
          </motion.p>
          <motion.div
            className="cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <a className="btn" href="#courses">
              {browseCoursesText}
            </a>
            <a className="btn ghost" href="#moments">
              {exploreMomentsText}
            </a>
            <a
              className="btn-call"
              href={settings.phoneHref || PHONE_HREF}
              style={{ padding: "14px 22px", fontSize: "0.95rem" }}
            >
              {callNowText}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Marquee() {
  const { dict } = useI18n();
  const items = dict.marquee;
  const row = [...items, ...items];
  return (
    <div className="marq" aria-hidden>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        style={{ display: "inline-flex" }}
      >
        {[0, 1].map((n) => (
          <div key={n}>
            {row.map((t, i) => (
              <span key={i}>{t} ✺</span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function Story() {
  const { dict, lang } = useI18n();
  const { dynamicSections } = useDynamicContent();
  const storySection = dynamicSections?.story;
  const storyData =
    (lang === "en" ? storySection?.data_en : storySection?.data_bn) ||
    storySection?.data_en ||
    storySection?.data_bn;

  const heading = storyData?.heading || dict.story.h2;
  const lead = storyData?.lead || dict.story.lead;

  let timeline = dict.story.timeline;
  if (storyData?.timeline && Array.isArray(storyData.timeline) && storyData.timeline.length > 0) {
    timeline = storyData.timeline.map((item) => {
      if (Array.isArray(item)) return item;
      return [item.year || "", item.text || ""];
    });
  }

  const imgStory = storySection?.media?.image_story;
  const imgStory2 = storySection?.media?.image_story2;

  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const a = useTransform(p, [0, 1], [60, -60]);
  const b = useTransform(p, [0, 1], [-80, 100]);
  return (
    <section id="story" ref={ref}>
      <div className="wrap story">
        <div className="imgs">
          <motion.div className="a ph" style={{ y: a }}>
            <Pic
              k="story"
              src={imgStory}
              alt="Classroom"
              style={{ height: "100%" }}
            />
          </motion.div>
          <motion.div className="b" style={{ y: b }}>
            <Pic
              k="story2"
              src={imgStory2}
              cls="alt"
              style={{ height: "100%", borderRadius: "inherit" }}
            />
          </motion.div>
        </div>
        <div>
          <motion.h2
            className="h2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {heading}
          </motion.h2>
          <p className="lead">{lead}</p>
          <div className="tl">
            {timeline.map(([y, t], i) => (
              <motion.div
                key={`${y}-${i}`}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.05 }}
              >
                <b>{y}</b>
                <p>{t}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function Courses({ onOpenModal, onEnrol }) {
  const { dict, lang, isBn } = useI18n();
  const { dynamicCourses } = useDynamicContent();
  const cats = COURSE_CATEGORIES[lang] || COURSE_CATEGORIES.bn;
  const staticCourseList = COURSES[lang] || COURSES.bn;

  const courseList =
    dynamicCourses && dynamicCourses.length > 0
      ? dynamicCourses.map((c) => ({
          id: c.id,
          t: isBn && c.title_bn ? c.title_bn : c.title_en,
          c: c.category_en,
          categoryName: isBn && c.category_bn ? c.category_bn : c.category_en,
          d: isBn && c.duration_bn ? c.duration_bn : c.duration_en,
          l: isBn && c.level_bn ? c.level_bn : c.level_en,
          p: c.price,
          discountPrice: c.discount_price,
          i: c.image_url
            ? c.image_url.includes("?")
              ? c.image_url
              : c.updated_at
                ? `${c.image_url}?v=${new Date(c.updated_at).getTime()}`
                : `${c.image_url}?v=1`
            : null,
          mentor: c.mentor_name,
          schedule: isBn && c.schedule_bn ? c.schedule_bn : c.schedule_en,
          seats: isBn && c.seats_bn ? c.seats_bn : c.seats_en,
          topics:
            isBn && c.topics_bn && c.topics_bn.length > 0
              ? c.topics_bn
              : c.topics_en || [],
        }))
      : staticCourseList;

  const [activeCatId, setActiveCatId] = useState("all");
  const [search, setSearch] = useState("");

  const list = courseList.filter((c) => {
    const matchCat =
      activeCatId === "all" ||
      c.c === activeCatId ||
      c.categoryName === activeCatId;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      c.t.toLowerCase().includes(q) ||
      c.c.toLowerCase().includes(q) ||
      (c.categoryName && c.categoryName.toLowerCase().includes(q)) ||
      c.mentor.toLowerCase().includes(q) ||
      c.topics.some((tp) => tp.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <section id="courses" className="courses">
      <div className="wrap">
        <h2 className="h2">{dict.courses.h2}</h2>
        <p className="lead">{dict.courses.lead}</p>

        <div className="courses-top">
          <div className="tabs" role="tablist">
            {cats.map((item) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={activeCatId === item.id}
                className={`tab ${activeCatId === item.id ? "on" : ""}`}
                onClick={() => setActiveCatId(item.id)}
              >
                {activeCatId === item.id && (
                  <motion.span
                    layoutId="course-tab-pill"
                    className="tab-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="tab-label">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="course-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder={dict.courses.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={dict.courses.searchAria}
            />
          </div>
        </div>

        <motion.div className="grid" layout>
          <AnimatePresence mode="popLayout">
            {list.length > 0 ? (
              list.map((c) => (
                <Tilt key={c.id} className="card" onClick={() => onOpenModal(c)}>
                  <div style={{ position: "relative" }}>
                    <Pic
                      k={c.i}
                      alt={c.t}
                      cls={
                        c.c === "Language"
                          ? "alt"
                          : c.c === "Skills"
                          ? "alt2"
                          : ""
                      }
                    />
                    <div className="card-badges">
                      <span className="card-badge">{c.seats}</span>
                    </div>
                  </div>
                  <div className="body">
                    <div className="meta">
                      <span>{c.categoryName || c.c}</span>
                      <span>{c.d}</span>
                    </div>
                    <h3>{c.t}</h3>
                    <p className="schedule-info">🗓️ {c.schedule}</p>
                    <div className="row">
                      <span className="price">{c.p}</span>
                      <div
                        style={{ display: "flex", gap: "8px" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="btn-outline"
                          onClick={() => onOpenModal(c)}
                        >
                          {dict.courses.detailsBtn}
                        </button>
                        <button
                          className="btn-primary"
                          onClick={() => onEnrol(c.t)}
                        >
                          {dict.courses.enrolBtn}
                        </button>
                      </div>
                    </div>
                  </div>
                </Tilt>
              ))
            ) : (
              <div className="empty-courses">
                <h3>
                  {dict.courses.emptyTitle} "{search}"
                </h3>
                <p style={{ opacity: 0.75, marginTop: 8 }}>
                  {dict.courses.emptySub}
                </p>
                <button
                  className="btn"
                  onClick={() => {
                    setSearch("");
                    setActiveCatId("all");
                  }}
                  style={{ marginTop: 16 }}
                >
                  {dict.courses.resetFilters}
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
  const { dict } = useI18n();
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
          <button
            className="modal-close"
            onClick={onClose}
            aria-label={dict.modal.closeAria}
          >
            ✕
          </button>
          <div>
            <span className="modal-tag">
              {course.categoryName || course.c} • {course.d}
            </span>
            <div className="modal-header">
              <h3>{course.t}</h3>
            </div>
          </div>
          <div className="modal-mentor">
            <span>
              🧑‍🏫 <b>{dict.modal.leadMentor}</b> {course.mentor}
            </span>
          </div>
          <div className="modal-info-grid">
            <div className="modal-info-item">
              <span>{dict.modal.liveSchedule}</span>
              <b>{course.schedule}</b>
            </div>
            <div className="modal-info-item">
              <span>{dict.modal.formatAndBatch}</span>
              <b>
                {course.l} • {course.seats}
              </b>
            </div>
          </div>
          <div className="modal-topics">
            <h4>{dict.modal.keyTopics}</h4>
            <ul>
              {course.topics.map((tp, idx) => (
                <li key={idx}>
                  <i>✓</i> {tp}
                </li>
              ))}
            </ul>
          </div>
          <div className="modal-actions">
            <div>
              <span className="modal-fee-label">{dict.modal.feeLabel}</span>
              <span className="modal-price">{course.p}</span>
            </div>
            <button
              className="btn btn-modal-enrol"
              onClick={() => onEnrol(course.t)}
            >
              {dict.modal.proceedBtn}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Mentors({ onEnrol }) {
  const { dict, lang, toBn } = useI18n();
  const { dynamicMentors } = useDynamicContent();
  const cats = MENTOR_CATEGORIES[lang] || MENTOR_CATEGORIES.bn;
  const staticMentorsList = MENTORS[lang] || MENTORS.bn;

  const mentorsList =
    dynamicMentors && Array.isArray(dynamicMentors) && dynamicMentors.length > 0
      ? dynamicMentors
          .filter((m) => m.is_active !== false)
          .map((m) => ({
            id: m.id,
            name: lang === "en" ? m.name_en : m.name_bn || m.name_en,
            role:
              lang === "en"
                ? m.designation_en
                : m.designation_bn || m.designation_en,
            edu:
              lang === "en"
                ? m.specialty_en
                : m.specialty_bn || m.specialty_en,
            university:
              m.university ||
              (lang === "en" ? m.specialty_en : m.specialty_bn),
            dept: m.category || "Robotics & Tech",
            categoryName: m.category || "Robotics & Tech",
            badge: m.badge || "👨‍🏫",
            badgeFull: m.badge_full || m.category,
            img: m.avatar_url || m.image_url,
            course:
              lang === "en"
                ? m.course_name_en || m.course || ""
                : m.course_name_bn || m.course || "",
            stats: m.stats || "6+ Yrs • Mentor",
            bio:
              lang === "en"
                ? m.bio_en || m.bio || ""
                : m.bio_bn || m.bio || m.bio_en || "",
          }))
      : staticMentorsList;


  const [activeCatId, setActiveCatId] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  const list =
    activeCatId === "all"
      ? mentorsList
      : mentorsList.filter(
          (m) => m.dept === activeCatId || m.categoryName === activeCatId
        );

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 520) setVisibleCount(1);
      else if (w < 820) setVisibleCount(2);
      else if (w < 1120) setVisibleCount(3);
      else setVisibleCount(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const total = list.length;
  const maxIndex = Math.max(0, total - visibleCount);

  const handleCatChange = (newCatId) => {
    setActiveCatId(newCatId);
    setCurrentIndex(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const displayedEnd = Math.min(currentIndex + visibleCount, total);

  const counterText =
    total > 0
      ? dict.mentors.counterTemplate
          .replace("{start}", toBn(currentIndex + 1))
          .replace("{end}", toBn(displayedEnd))
          .replace("{total}", toBn(total))
      : dict.mentors.counterZero;

  return (
    <section id="mentors" className="mentors-sec">
      <div className="wrap">
        <div className="mentors-header">
          <div className="mentors-header-text">
            <span className="mentors-kicker">{dict.mentors.kicker}</span>
            <h2 className="h2">{dict.mentors.h2}</h2>
            <p className="lead" style={{ marginTop: "8px" }}>
              {dict.mentors.lead}
            </p>
          </div>

          <div className="mentors-ctrls-bar">
            <div className="mentor-counter-pill">
              <span className="mentor-counter-dot" />
              <span>{counterText}</span>
            </div>
            <div className="mentor-nav-arrows">
              <button
                type="button"
                className="mentor-nav-btn"
                onClick={handlePrev}
                aria-label={dict.mentors.prevAria}
                title={dict.mentors.prevAria}
                disabled={total <= visibleCount}
                style={{
                  opacity: total <= visibleCount ? 0.4 : 1,
                  cursor: total <= visibleCount ? "default" : "pointer",
                }}
              >
                ‹
              </button>
              <button
                type="button"
                className="mentor-nav-btn"
                onClick={handleNext}
                aria-label={dict.mentors.nextAria}
                title={dict.mentors.nextAria}
                disabled={total <= visibleCount}
                style={{
                  opacity: total <= visibleCount ? 0.4 : 1,
                  cursor: total <= visibleCount ? "default" : "pointer",
                }}
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <div className="courses-top" style={{ marginBottom: "24px" }}>
          <div className="tabs" role="tablist">
            {cats.map((item) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={activeCatId === item.id}
                className={`tab ${activeCatId === item.id ? "on" : ""}`}
                onClick={() => handleCatChange(item.id)}
              >
                {activeCatId === item.id && (
                  <motion.span
                    layoutId="mentor-tab-pill"
                    className="tab-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="tab-label">{item.label}</span>
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
                  className="mentor-roster-cell"
                  style={{
                    flex: `0 0 ${100 / visibleCount}%`,
                    maxWidth: `${100 / visibleCount}%`,
                  }}
                >
                  <div className="mentor-roster-item">
                    <div className="mentor-avatar-wrap">
                      <img
                        src={m.img}
                        alt={m.name}
                        className="mentor-avatar-img"
                        loading="lazy"
                        decoding="async"
                        width="180"
                        height="180"
                      />
                    </div>

                    <h3 className="mentor-name" title={m.name}>
                      {m.name}
                    </h3>
                    <p className="mentor-course" title={m.course}>
                      {m.course}
                    </p>
                    <p className="mentor-uni" title={m.university || m.edu}>
                      🏛️ {m.university || m.edu}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {Math.ceil(total / visibleCount) > 1 && (
            <div className="mentor-dots-row">
              {Array.from({ length: Math.ceil(total / visibleCount) }).map(
                (_, p) => {
                  const isCurrentPage =
                    Math.floor(currentIndex / visibleCount) === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      className={`mentor-dot-pill ${isCurrentPage ? "active" : ""}`}
                      onClick={() =>
                        setCurrentIndex(Math.min(p * visibleCount, maxIndex))
                      }
                      aria-label={dict.mentors.pageAria.replace("{p}", toBn(p + 1))}
                      title={dict.mentors.pageTitle.replace("{p}", toBn(p + 1))}
                    />
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PracticeArena() {
  const { dict, toBn } = useI18n();
  const tasks = dict.practice.tasks;

  const [activeTab, setActiveTab] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState({});

  const task = tasks[activeTab] || tasks[0];

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
        <div
          style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}
        >
          <span className="quiz-badge">{dict.practice.badge}</span>
          <h2 className="h2" style={{ margin: "12px auto 0" }}>
            {dict.practice.h2}
          </h2>
          <p className="lead" style={{ margin: "14px auto 0" }}>
            {dict.practice.lead}
          </p>
        </div>

        <div className="practice-container">
          <div className="subject-tabs">
            {tasks.map((t, idx) => (
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
            <span
              style={{
                fontSize: "0.9rem",
                color: "var(--ink2)",
                fontWeight: 600,
              }}
            >
              {dict.practice.topicLabel} <b>{task.topic}</b>
            </span>
            <span className="quiz-streak">
              {dict.practice.streakLabel}{" "}
              <b>
                {toBn(streak)} {dict.practice.solvedSuffix}
              </b>
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
                  <span>
                    🧑‍🏫{" "}
                    <b>
                      {selectedOpt === task.correct
                        ? dict.practice.feedbackCorrect
                        : dict.practice.feedbackWrong}
                    </b>
                  </span>
                </div>
                <p>{task.explanation}</p>
                <p style={{ fontStyle: "italic", opacity: 0.85 }}>
                  “{task.mentorNote}”
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="practice-actions">
            <span style={{ fontSize: "0.9rem", opacity: 0.75 }}>
              {selectedOpt === null
                ? dict.practice.selectHint
                : dict.practice.readyText}
            </span>
            <a
              href="#courses"
              className="btn"
              style={{ padding: "10px 22px", fontSize: "0.95rem" }}
            >
              {dict.practice.exploreBtn}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Moments({ onOpenLightbox }) {
  const { dict, lang } = useI18n();
  const { dynamicMoments } = useDynamicContent();
  const cats = MOMENTS_CATEGORIES[lang] || MOMENTS_CATEGORIES.bn;
  const staticMomentsList = MOMENTS[lang] || MOMENTS.bn;

  const momentsList =
    dynamicMoments && Array.isArray(dynamicMoments) && dynamicMoments.length > 0
      ? dynamicMoments.map((m) => ({
          id: m.id,
          t: lang === "en" ? m.title_en : m.title_bn || m.title_en,
          tag: lang === "en" ? m.badge_en : m.badge_bn || m.badge_en,
          c: m.category || "Robotics",
          desc: lang === "en" ? m.desc_en || "" : m.desc_bn || m.desc_en || "",
          img: m.image_url,
          src: m.image_url,
        }))
      : staticMomentsList;


  const [activeCatId, setActiveCatId] = useState("all");

  const list =
    activeCatId === "all"
      ? momentsList
      : momentsList.filter((m) => m.c === activeCatId);

  return (
    <section id="moments" className="moments-sec">
      <div className="wrap">
        <div style={{ maxWidth: "700px" }}>
          <h2 className="h2">{dict.moments.h2}</h2>
          <p className="lead">{dict.moments.lead}</p>
        </div>

        <div className="moments-top">
          <div className="tabs" role="tablist">
            {cats.map((item) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={activeCatId === item.id}
                className={`tab ${activeCatId === item.id ? "on" : ""}`}
                onClick={() => setActiveCatId(item.id)}
              >
                {activeCatId === item.id && (
                  <motion.span
                    layoutId="moments-pill"
                    className="tab-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="tab-label">{item.label}</span>
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
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--gold)",
                      fontWeight: 700,
                    }}
                  >
                    {m.c}
                  </span>
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
  const { dict, toBn } = useI18n();
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

  const imgSrc =
    current.src ||
    (current.img && IMG[current.img]) ||
    (current.k && IMG[current.k]);
  const title = current.t || current.title || dict.lightbox.defaultTitle;
  const cat = current.c || current.tag || current.badge || dict.lightbox.defaultCat;
  const desc = current.desc || current.title || "";

  const counterText = dict.lightbox.counterTemplate
    .replace("{current}", toBn(activeIndex + 1))
    .replace("{total}", toBn(items.length));

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <button
          className="lightbox-close"
          onClick={onClose}
          aria-label={dict.lightbox.closeAria}
        >
          ✕
        </button>
        {items.length > 1 && (
          <>
            <button
              className="lightbox-nav-btn lightbox-prev"
              onClick={prev}
              aria-label={dict.lightbox.prevAria}
            >
              ‹
            </button>
            <button
              className="lightbox-nav-btn lightbox-next"
              onClick={next}
              aria-label={dict.lightbox.nextAria}
            >
              ›
            </button>
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
              <img
                src={imgSrc}
                alt={title}
                decoding="async"
                style={{
                  width: "100%",
                  maxHeight: "550px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : (
              <Pic k={current.img} alt={title} style={{ height: "480px" }} />
            )}
          </div>
          <div className="lightbox-info">
            <div>
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--gold)",
                  fontWeight: 700,
                }}
              >
                {cat}
              </span>
              <h3 style={{ fontSize: "1.45rem", marginTop: 4 }}>{title}</h3>
              {desc && (
                <p style={{ opacity: 0.85, fontSize: "0.95rem", marginTop: 4 }}>
                  {desc}
                </p>
              )}
            </div>
            <span style={{ opacity: 0.6, fontSize: "0.9rem" }}>
              {counterText}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Why() {
  const { dict, lang } = useI18n();
  const { dynamicSections } = useDynamicContent();
  const whySection = dynamicSections?.why;
  const whyData =
    (lang === "en" ? whySection?.data_en : whySection?.data_bn) ||
    whySection?.data_en ||
    whySection?.data_bn;

  const stats = dict.why.stats;
  const heading = whyData?.heading || dict.why.h2;

  let items = dict.why.items;
  if (whyData?.features && Array.isArray(whyData.features) && whyData.features.length > 0) {
    items = whyData.features.map((f) => {
      if (Array.isArray(f)) return f;
      return [f.title || "", f.desc || ""];
    });
  }

  return (
    <section id="why">
      <div className="wrap">
        <div className="stats">
          {stats.map(([n, s, l]) => (
            <div key={l}>
              <b>
                <Count to={n} suffix={s} />
              </b>
              <p>{l}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 110 }}>
          <h2 className="h2">{heading}</h2>
          <div className="why">
            {items.map(([h, t], i) => (
              <motion.div
                key={`${h}-${i}`}
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h3>{h}</h3>
                <p>{t}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Voices() {
  const { dict, lang } = useI18n();
  const { dynamicSections } = useDynamicContent();
  const voicesSection = dynamicSections?.voices;
  const voicesData =
    (lang === "en" ? voicesSection?.data_en : voicesSection?.data_bn) ||
    voicesSection?.data_en ||
    voicesSection?.data_bn;

  const heading = voicesData?.heading || dict.voices.h2;

  let voices = dict.voices.testimonials;
  if (
    voicesData?.testimonials &&
    Array.isArray(voicesData.testimonials) &&
    voicesData.testimonials.length > 0
  ) {
    voices = voicesData.testimonials.map((t) => {
      if (Array.isArray(t)) return t;
      return [
        t.quote || "",
        t.name || "",
        t.role || "",
        t.image_url || t.img || "art1",
      ];
    });
  }

  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % voices.length), 6000);
    return () => clearInterval(t);
  }, [paused, voices.length]);

  const prev = () => setI((x) => (x - 1 + voices.length) % voices.length);
  const next = () => setI((x) => (x + 1) % voices.length);

  const [q, n, r, img] = voices[i] || voices[0] || ["", "", "", "art1"];
  const isUrl = img && typeof img === "string" && (img.startsWith("http") || img.startsWith("/"));

  return (
    <section id="voices" className="tst">
      <div
        className="wrap"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <h2 className="h2">{heading}</h2>
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            className="tcard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Pic k={isUrl ? null : img} src={isUrl ? img : null} alt={n} cls="alt" />
            <div>
              <blockquote>“{q}”</blockquote>
              <p style={{ marginTop: 16 }}>
                <b>{n}</b>, {r}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="tcard-ctrls">
          <div className="student-pills">
            {voices.map(([_, name], k) => (
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
            <button
              className="arrow-btn"
              onClick={prev}
              aria-label={dict.voices.prevAria}
            >
              ‹
            </button>
            <button
              className="arrow-btn"
              onClick={next}
              aria-label={dict.voices.nextAria}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const { dict, lang } = useI18n();
  const { dynamicSections } = useDynamicContent();
  const faqSection = dynamicSections?.faq;
  const faqData =
    (lang === "en" ? faqSection?.data_en : faqSection?.data_bn) ||
    faqSection?.data_en ||
    faqSection?.data_bn;

  const heading = faqData?.heading || dict.faq.h2;
  const lead = faqData?.lead || dict.faq.lead;

  const items =
    faqData?.items && Array.isArray(faqData.items) && faqData.items.length > 0
      ? faqData.items
      : dict.faq.items;

  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="faq-sec">
      <div className="wrap">
        <div
          style={{ textAlign: "center", maxWidth: "650px", margin: "0 auto" }}
        >
          <h2 className="h2" style={{ margin: "0 auto" }}>
            {heading}
          </h2>
          <p className="lead" style={{ margin: "14px auto 0" }}>
            {lead}
          </p>
        </div>

        <div className="faq-list">
          {items.map((faq, idx) => {
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
  const { dict, lang } = useI18n();
  const { submitEnrolment, dynamicCourses, dynamicSections } = useDynamicContent();
  const ctaSection = dynamicSections?.cta;
  const ctaData =
    (lang === "en" ? ctaSection?.data_en : ctaSection?.data_bn) ||
    ctaSection?.data_en ||
    ctaSection?.data_bn;

  const heading = ctaData?.heading || dict.join.h2;
  const lead = ctaData?.lead || dict.join.lead;
  const submitBtnText = ctaData?.submit_btn || dict.join.submitBtn;
  const bgImage = ctaSection?.media?.background_image;

  const staticCourseList = COURSES[lang] || COURSES.bn;
  const courseList =
    dynamicCourses && dynamicCourses.length > 0
      ? dynamicCourses.map((c) => ({
          id: c.id,
          t: lang === "en" ? c.title_en : c.title_bn || c.title_en,
          p: c.price,
          d: lang === "en" ? c.duration_en : c.duration_bn || c.duration_en,
        }))
      : staticCourseList;

  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(p, [0, 1], ["-12%", "12%"]);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: enrolledCourse || courseList[0]?.t || "",
  });

  useEffect(() => {
    if (enrolledCourse) {
      setFormData((prev) => ({ ...prev, course: enrolledCourse }));
    } else if (!formData.course && courseList[0]) {
      setFormData((prev) => ({ ...prev, course: courseList[0].t }));
    }
  }, [enrolledCourse, courseList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    submitEnrolment({
      full_name: formData.name,
      phone: formData.phone,
      email: formData.email,
      course_name: formData.course,
      message: "Direct enrolment reservation from website",
    });
  };

  return (
    <section id="join" className="cta-s" ref={ref} style={{ padding: 0 }}>
      <motion.div className="cta-bg" style={{ y }}>
        <Pic k="cta" src={bgImage} />
      </motion.div>
      <div className="wrap" style={{ padding: "100px 0" }}>
        <h2 className="h2" style={{ maxWidth: "16ch" }}>
          {heading}
        </h2>
        <p className="lead">{lead}</p>

        {sent ? (
          <motion.div
            className="celebration-card"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <h3>{dict.join.successTitle}</h3>
            <p style={{ fontSize: "1.1rem" }}>
              {dict.join.successReserved
                .replace("{name}", formData.name)
                .replace("{course}", formData.course)}
            </p>
            <p style={{ opacity: 0.85, fontSize: "0.95rem" }}>
              {dict.join.successContact
                .replace("{phone}", formData.phone)
                .replace("{email}", formData.email)}
            </p>
            <button
              className="btn"
              onClick={() => {
                setSent(false);
              }}
              style={{
                width: "fit-content",
                marginTop: "12px",
                padding: "10px 22px",
              }}
            >
              {dict.join.enrolAnother}
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="join-grid">
            <div>
              <input
                type="text"
                required
                placeholder={dict.join.namePlaceholder}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                aria-label={dict.join.nameAria}
              />
            </div>
            <div>
              <input
                type="tel"
                required
                placeholder={dict.join.phonePlaceholder}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                aria-label={dict.join.phoneAria}
              />
            </div>
            <div className="full">
              <input
                type="email"
                required
                placeholder={dict.join.emailPlaceholder}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                aria-label={dict.join.emailAria}
              />
            </div>
            <div className="full">
              <select
                className="join-select"
                value={formData.course}
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
                aria-label={dict.join.selectCourseAria}
              >
                {courseList.map((c) => (
                  <option key={c.id} value={c.t} style={{ color: "var(--ink)" }}>
                    {c.t} — {c.p} ({c.d})
                  </option>
                ))}
              </select>
            </div>
            <div className="full" style={{ marginTop: "6px" }}>
              <button
                className="btn"
                type="submit"
                style={{ padding: "16px 36px", fontSize: "1.05rem" }}
              >
                {submitBtnText}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function FloatingCallButton() {
  const { dict } = useI18n();
  const { settings } = useDynamicContent();

  return (
    <motion.div
      className="floating-call-wrap"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.4 }}
    >
      <a
        href={settings.whatsappUrl || WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-call-btn"
        aria-label={dict.floatingCall.ariaLabel}
      >
        <span className="call-pulse-ring" />
        <span className="call-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.889-9.888 9.889m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </span>
        <span className="call-text">{dict.floatingCall.callNow}</span>
      </a>
    </motion.div>
  );
}

function Footer() {
  const { dict, toBn } = useI18n();
  const { settings } = useDynamicContent();

  return (
    <footer>
      <div className="wrap fg">
        <div>
          <b style={{ fontSize: "1.5rem" }}>{dict.footer.brand}</b>
          <span style={{ opacity: 0.7 }}>{dict.footer.tagline}</span>
        </div>
        <div>
          <b>{dict.footer.explore}</b>
          {dict.nav.slice(1, -1).map(([id, l]) => (
            <a key={id} href={`#${id}`}>
              {l}
            </a>
          ))}
        </div>
        <div>
          <b>{dict.footer.contact}</b>
          <a
            href={settings.whatsappUrl || WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--gold)",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {dict.footer.whatsapp.replace("{phone}", settings.phone || PHONE)}
          </a>
          <span>{settings.email || dict.footer.email}</span>
          <span>{settings.location || dict.footer.location}</span>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <p>
          {dict.footer.copyright.replace(
            "{year}",
            toBn(new Date().getFullYear())
          )}
        </p>
        <p className="footer-credit">
          {dict.footer.developedBy}{" "}
          <a
            href="https://corpusian.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-dev-link"
          >
            corpusian
          </a>
        </p>
      </div>
    </footer>
  );
}

function PageContent() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledCourse, setEnrolledCourse] = useState("");
  const [lightbox, setLightbox] = useState({ index: null, items: [] });

  useEffect(() => {
    let lenisInstance;
    import("lenis")
      .then((LenisModule) => {
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
      })
      .catch(() => {});

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
        onNavigate={(newIdx) =>
          setLightbox((prev) => ({ ...prev, index: newIdx }))
        }
      />
      <FloatingCallButton />
    </main>
  );
}

export default function Page() {
  return (
    <LanguageProvider initialLang="bn">
      <DynamicContentProvider>
        <PageContent />
      </DynamicContentProvider>
    </LanguageProvider>
  );
}
