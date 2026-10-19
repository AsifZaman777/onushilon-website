"use client";
import { motion } from "framer-motion";
import { useI18n } from "./LanguageContext";

export default function LanguageSwitcher({ className = "", isSheet = false }) {
  const { lang, setLang } = useI18n();

  return (
    <div
      className={`lang-switcher ${isSheet ? "sheet-lang" : ""} ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        className={`lang-btn ${lang === "bn" ? "active" : ""}`}
        onClick={() => setLang("bn")}
        aria-pressed={lang === "bn"}
        aria-label="বাংলা ভাষায় পরিবর্তন করুন"
      >
        {lang === "bn" && (
          <motion.span
            layoutId="lang-active-pill"
            className="lang-active-bg"
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
          />
        )}
        <span className="lang-text">বাংলা</span>
      </button>

      <button
        type="button"
        className={`lang-btn ${lang === "en" ? "active" : ""}`}
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        aria-label="Switch to English"
      >
        {lang === "en" && (
          <motion.span
            layoutId="lang-active-pill"
            className="lang-active-bg"
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
          />
        )}
        <span className="lang-text">EN</span>
      </button>
    </div>
  );
}
