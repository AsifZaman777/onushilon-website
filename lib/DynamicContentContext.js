"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { fetchPublicData, submitLead } from "./api";

const DynamicContentContext = createContext(null);

const REFRESH_INTERVAL_MS = 60000;

/**
 * Holds the CMS content. The server prerenders the page with `initialData`, so
 * there is no placeholder/fallback flash: the first paint already contains the
 * real content. Background refreshes only re-render when something changed.
 */
export function DynamicContentProvider({ children, initialData = null }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const lastSerialized = useRef(initialData ? JSON.stringify(initialData) : "");

  const applyData = useCallback((result) => {
    if (!result) return;
    const serialized = JSON.stringify(result);
    if (serialized === lastSerialized.current) return;
    lastSerialized.current = serialized;
    setData(result);
  }, []);

  const refreshContent = useCallback(async () => {
    try {
      const result = await fetchPublicData();
      applyData(result);
      return result;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, [applyData]);

  useEffect(() => {
    // Only fetch immediately when the server could not provide data.
    if (!initialData) refreshContent();

    const interval = setInterval(refreshContent, REFRESH_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refreshContent();
    };
    const onInvalidated = () => refreshContent();

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("onushilon_content_invalidated", onInvalidated);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("onushilon_content_invalidated", onInvalidated);
    };
  }, [initialData, refreshContent]);

  const value = useMemo(() => {
    const settings = data?.settings || {};

    let whatsappUrl = "";
    if (settings.whatsapp_number) {
      const cleanNum = String(settings.whatsapp_number).replace(/[^0-9]/g, "");
      const msg = encodeURIComponent(
        settings.whatsapp_message || "Hello Onushilon Academy"
      );
      whatsappUrl = `https://wa.me/${cleanNum}?text=${msg}`;
    }

    let normalizedSections = {};
    if (Array.isArray(data?.sections)) {
      normalizedSections = data.sections.reduce((acc, curr) => {
        if (curr && curr.section_id) acc[curr.section_id] = curr;
        return acc;
      }, {});
    } else if (data?.sections && typeof data.sections === "object") {
      normalizedSections = data.sections;
    }

    return {
      settings: {
        phone: settings.phone || "",
        phoneHref: settings.phone_href || "",
        whatsappUrl,
        whatsappNumber: settings.whatsapp_number || "",
        email: settings.email || "",
        location: settings.location || "",
        supportHours: settings.support_hours || "",
      },
      dynamicCourses: data?.courses || [],
      dynamicSections: normalizedSections,
      dynamicMentors: data?.mentors || [],
      dynamicMoments: data?.moments || [],
      refreshContent,
      submitEnrolment: submitLead,
      isDynamic: Boolean(data),
      loading,
    };
  }, [data, loading, refreshContent]);

  return (
    <DynamicContentContext.Provider value={value}>
      {children}
    </DynamicContentContext.Provider>
  );
}

export function useDynamicContent() {
  const ctx = useContext(DynamicContentContext);
  if (!ctx) {
    return {
      settings: { phone: "", phoneHref: "", whatsappUrl: "", email: "", location: "" },
      dynamicCourses: [],
      dynamicSections: {},
      dynamicMentors: [],
      dynamicMoments: [],
      submitEnrolment: submitLead,
      isDynamic: false,
      loading: true,
    };
  }
  return ctx;
}
