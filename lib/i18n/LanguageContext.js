"use client";
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { TRANSLATIONS } from "./translations";

const LanguageContext = createContext(null);

export function toBnNumber(val, isBangla = true) {
  if (val === null || val === undefined) return "";
  if (!isBangla) return String(val);
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(val).replace(/[0-9]/g, (d) => bnDigits[Number(d)]);
}

export function LanguageProvider({ children, initialLang = "bn" }) {
  const [lang, setLangState] = useState(initialLang);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("onushilon_lang");
      if (saved && (saved === "en" || saved === "bn")) {
        setLangState(saved);
        document.documentElement.lang = saved;
      } else {
        document.documentElement.lang = initialLang;
      }
    } catch {
      // Ignore localStorage errors in private mode
    }
  }, [initialLang]);

  const setLang = useCallback((newLang) => {
    if (newLang !== "en" && newLang !== "bn") return;
    setLangState(newLang);
    try {
      localStorage.setItem("onushilon_lang", newLang);
      document.documentElement.lang = newLang;
    } catch {}
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "bn" ? "en" : "bn");
  }, [lang, setLang]);

  // Translate helper: path can be "hero.sub", vars can be { name: "...", phone: "..." }
  const t = useCallback(
    (path, vars = {}) => {
      const keys = path.split(".");
      let current = TRANSLATIONS[lang];
      for (const k of keys) {
        if (current && current[k] !== undefined) {
          current = current[k];
        } else {
          // Fallback to English
          current = null;
          break;
        }
      }

      if (current === null) {
        let fallback = TRANSLATIONS.en;
        for (const k of keys) {
          if (fallback && fallback[k] !== undefined) {
            fallback = fallback[k];
          } else {
            return path;
          }
        }
        current = fallback;
      }

      if (typeof current === "string") {
        return current.replace(/\{(\w+)\}/g, (_, key) => {
          if (vars[key] !== undefined) {
            return lang === "bn" && typeof vars[key] === "number"
              ? toBnNumber(vars[key], true)
              : vars[key];
          }
          return `{${key}}`;
        });
      }

      return current;
    },
    [lang]
  );

  const formatNumber = useCallback(
    (num) => toBnNumber(num, lang === "bn"),
    [lang]
  );

  const value = useMemo(
    () => ({
      lang,
      isBn: lang === "bn",
      setLang,
      toggleLang,
      t,
      formatNumber,
      toBn: (v) => toBnNumber(v, lang === "bn"),
      dict: TRANSLATIONS[lang] || TRANSLATIONS.bn,
      mounted,
    }),
    [lang, setLang, toggleLang, t, formatNumber, mounted]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useI18n must be used within a LanguageProvider");
  }
  return ctx;
}
