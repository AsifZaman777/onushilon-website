"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchPublicData, submitLead } from "./api";
import { PHONE as DEFAULT_PHONE, PHONE_HREF as DEFAULT_PHONE_HREF, WHATSAPP_URL as DEFAULT_WHATSAPP_URL } from "./assets";

const DynamicContentContext = createContext(null);

export function DynamicContentProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const result = await fetchPublicData();
        if (isMounted && result) {
          setData(result);
        }
      } catch (e) {
        console.warn("Dynamic content fetch skipped:", e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();

    // Auto refresh every 30 seconds to reflect admin changes in real time
    const interval = setInterval(loadData, 30000);

    const handleInvalidation = () => {
      loadData();
    };
    if (typeof window !== "undefined") {
      window.addEventListener("onushilon_content_invalidated", handleInvalidation);
    }

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener("onushilon_content_invalidated", handleInvalidation);
      }
    };
  }, []);

  const refreshContent = async () => {
    try {
      const result = await fetchPublicData();
      if (result) setData(result);
      return result;
    } catch (e) {
      return null;
    }
  };

  const settings = data?.settings || {};

  // Formatted Phone & WhatsApp links
  const phone = settings.phone || DEFAULT_PHONE;
  const phoneHref = settings.phone_href || DEFAULT_PHONE_HREF;

  let whatsappUrl = DEFAULT_WHATSAPP_URL;
  if (settings.whatsapp_number) {
    const cleanNum = settings.whatsapp_number.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(settings.whatsapp_message || "Hello Onushilon Academy");
    whatsappUrl = `https://wa.me/${cleanNum}?text=${msg}`;
  }

  // Normalize sections as a map of section_id -> section object
  let normalizedSections = {};
  if (Array.isArray(data?.sections)) {
    normalizedSections = data.sections.reduce((acc, curr) => {
      if (curr && curr.section_id) acc[curr.section_id] = curr;
      return acc;
    }, {});
  } else if (data?.sections && typeof data.sections === "object") {
    normalizedSections = data.sections;
  }

  const value = {
    settings: {
      phone,
      phoneHref,
      whatsappUrl,
      whatsappNumber: settings.whatsapp_number || "+8801700000000",
      email: settings.email || "hello@onushilon.example",
      location: settings.location || "Dhaka, Bangladesh",
      supportHours: settings.support_hours || "9 AM – 10 PM",
    },
    dynamicCourses: data?.courses || null,
    dynamicSections: normalizedSections,
    dynamicMentors: data?.mentors || null,
    dynamicMoments: data?.moments || null,
    refreshContent,
    submitEnrolment: submitLead,
    isDynamic: Boolean(data),
    loading,
  };

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
      settings: {
        phone: DEFAULT_PHONE,
        phoneHref: DEFAULT_PHONE_HREF,
        whatsappUrl: DEFAULT_WHATSAPP_URL,
        email: "hello@onushilon.example",
        location: "Dhaka, Bangladesh",
      },
      dynamicCourses: null,
      dynamicSections: {},
      dynamicMentors: null,
      dynamicMoments: null,
      submitEnrolment: submitLead,
      isDynamic: false,
      loading: false,
    };
  }
  return ctx;
}

