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

    // Auto refresh every 45 seconds to reflect admin changes in real time
    const interval = setInterval(loadData, 45000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

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
    dynamicSections: data?.sections || {},
    dynamicMentors: data?.mentors || null,
    submitEnrolment: submitLead,
    isDynamic: Boolean(data),
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
      submitEnrolment: submitLead,
      isDynamic: false,
    };
  }
  return ctx;
}
