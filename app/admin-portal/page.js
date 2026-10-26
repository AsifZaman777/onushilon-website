"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  MessageSquare,
  Users,
  TrendingUp,
  HardDrive,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  Search,
  Clock,
  Activity,
  Send,
  Save,
  Check,
  Tag,
  FileText,
  DollarSign,
  Image as ImageIcon,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  UserCheck,
  ChevronRight,
  Eye,
  Copy,
  RefreshCw,
  Download,
  Filter,
  CheckCircle,
  BarChart2,
  PieChart as PieChartIcon,
  Menu,
  Award,
  Globe,
  Sliders,
  HelpCircle,
  MessageCircle,
  Zap,
  Monitor,
  Smartphone,
  RotateCcw,
  Type,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
} from "recharts";
import { API_BASE, BACKEND_ORIGIN } from "../../lib/api";
import { cacheBustUrl, resolveMediaUrl } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "../../components/ui/dialog";
import { AlertDialog } from "../../components/ui/alert-dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input, Textarea, Label } from "../../components/ui/input";
import { TabsList, TabsTrigger } from "../../components/ui/tabs";
import { UploadStatus } from "../../components/ui/upload-status";
import { compressImage, uploadWithProgress } from "../../lib/adminUpload";

// Default Cloud Storage Fallback Images
const DEFAULT_COURSE_IMG =
  "https://okhqtcykqdkivxsghyrv.supabase.co/storage/v1/object/public/onushilon/photos/robotic_class1.webp";
const DEFAULT_AVATAR_IMG =
  "https://okhqtcykqdkivxsghyrv.supabase.co/storage/v1/object/public/onushilon/photos/classroom1.webp";

// Formal Executive Color Palette for CRM Charts & Funnels
const CHART_PALETTE = [
  "#2563eb", // Primary Blue
  "#0ea5e9", // Sky Blue
  "#6366f1", // Indigo
  "#0d9488", // Teal
  "#8b5cf6", // Purple
  "#3b82f6", // Blue
];

const STATUS_COLORS = {
  new: "#f59e0b", // Amber
  contacted: "#0284c7", // Sky
  enrolled: "#16a34a", // Emerald Green
  closed: "#64748b", // Slate
};

export default function AdminPortalPage() {
  // Hydration safety flag
  const [mounted, setMounted] = useState(false);

  // Auth State
  const [token, setToken] = useState("");
  const [authEmail, setAuthEmail] = useState("admin@onushilon.com");
  const [authPassword, setAuthPassword] = useState("admin1234");
  const [authLoading, setAuthLoading] = useState(false);

  // Responsive Mobile Navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active Navigation Tab
  const [currentTab, setCurrentTab] = useState("dashboard");

  // Core Data loaded from Supabase / Backend API
  const [settings, setSettings] = useState(null);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState({});
  const [mentors, setMentors] = useState([]);
  const [leads, setLeads] = useState([]);
  const [media, setMedia] = useState([]);
  const [storageStatus, setStorageStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState(null);

  // Save Loading State
  const [savingKey, setSavingKey] = useState(null);

  // Image upload progress (0-100) + local blob preview shown instantly
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);

  // Course Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseModalTab, setCourseModalTab] = useState("basic");
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    id: "",
    title_en: "",
    title_bn: "",
    category_en: "Robotics & Tech",
    category_bn: "রোবোটিক্স ও প্রযুক্তি",
    price: "৳5,500",
    discount_price: "৳4,800",
    duration_en: "4 months",
    duration_bn: "৪ মাস",
    level_en: "Hands-on Lab",
    level_bn: "হ্যান্ডস-অন ল্যাব",
    mentor_name: "Engr. Nayeem Siddique",
    schedule_en: "Fri & Sat • 4:00 PM",
    schedule_bn: "শুক্র ও শনি • বিকাল ৪:০০",
    seats_en: "6 seats left",
    seats_bn: "৬টি আসন বাকি",
    image_url: DEFAULT_COURSE_IMG,
    is_active: true,
    description_en: "",
    description_bn: "",
  });
  const [topicsEn, setTopicsEn] = useState([]);
  const [newTopicInput, setNewTopicInput] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [courseCategoryFilter, setCourseCategoryFilter] = useState("all");

  // Section Sub-Tab
  const [activeSectionKey, setActiveSectionKey] = useState("hero");

  // Backup & Restore / Text Export State
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [backupModalTab, setBackupModalTab] = useState("export"); // "export" | "import"
  const [backupIncludeSettings, setBackupIncludeSettings] = useState(true);
  const [backupImportText, setBackupImportText] = useState("");
  const [backupCopied, setBackupCopied] = useState(false);
  const [backupRestoring, setBackupRestoring] = useState(false);
  const [sectionRawModal, setSectionRawModal] = useState(null); // { open, sectionId, name, text, copied, saving }

  // Hero Section Customizer State (Language editor sub-tab, preview device, preview lang)
  const [heroEditLang, setHeroEditLang] = useState("en"); // "en" | "bn"
  const [heroPreviewLang, setHeroPreviewLang] = useState("en"); // "en" | "bn"
  const [heroPreviewDevice, setHeroPreviewDevice] = useState("desktop"); // "desktop" | "mobile"

  // Mentor Modal State
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [mentorForm, setMentorForm] = useState({
    id: "",
    name_en: "",
    name_bn: "",
    designation_en: "",
    designation_bn: "",
    specialty_en: "",
    specialty_bn: "",
    category: "Robotics & Tech",
    avatar_url: DEFAULT_AVATAR_IMG,
  });

  // Leads CRM State
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("");
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    course_name: "Robotics & Tech",
    notes: "",
  });
  const [leadNotesModal, setLeadNotesModal] = useState({
    open: false,
    lead: null,
    notes: "",
    loading: false,
  });

  // Supabase Storage Explorer State
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaFolderFilter, setMediaFolderFilter] = useState("all");
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);

  // Generic Alert Dialog
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    title: "",
    description: "",
    confirmText: "Delete",
    isDestructive: true,
    loading: false,
    onConfirm: () => {},
  });

  // Floating Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Client-Side Mount & Token Check (Prevents SSR hydration mismatch)
  useEffect(() => {
    setMounted(true);
    const savedToken = localStorage.getItem("onushilon_admin_token");
    if (savedToken) {
      setToken(savedToken);
      fetchDashboardData(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Centralized API Helper (Cache-Busting for instant reflection)
  const apiFetch = async (endpoint, options = {}, customToken = null) => {
    const authToken = customToken || token;
    const headers = { ...(options.headers || {}) };
    if (authToken && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    // Force no-store and anti-cache headers on every admin request
    headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    headers["Pragma"] = "no-cache";
    headers["Expires"] = "0";

    const isGet = !options.method || options.method.toUpperCase() === "GET";
    const separator = endpoint.includes("?") ? "&" : "?";
    const finalUrl = isGet
      ? `${API_BASE}${endpoint}${separator}_t=${Date.now()}`
      : `${API_BASE}${endpoint}`;

    const res = await fetch(finalUrl, {
      cache: "no-store",
      ...options,
      headers,
    });
    if (res.status === 401) {
      setToken("");
      localStorage.removeItem("onushilon_admin_token");
      showToast("Session expired. Please sign in again.", "error");
      throw new Error("Unauthorized");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `API error ${res.status}`);
    }
    return data;
  };

  // Fetch all live dashboard and CRM data directly from backend (instant live sync)
  const fetchDashboardData = async (activeToken, targetTab = null) => {
    const authToken = activeToken || token;
    if (!authToken) return;
    try {
      const [
        coursesRes,
        sectionsRes,
        settingsRes,
        mentorsRes,
        leadsRes,
        healthRes,
        mediaRes,
      ] = await Promise.all([
        apiFetch("/courses", {}, authToken).catch(() => null),
        apiFetch("/sections", {}, authToken).catch(() => null),
        apiFetch("/settings", {}, authToken).catch(() => null),
        apiFetch("/mentors", {}, authToken).catch(() => null),
        apiFetch("/leads", {}, authToken).catch(() => ({ data: [] })),
        apiFetch("/health", {}, authToken).catch(() => ({})),
        apiFetch("/media", {}, authToken).catch(() => ({ data: [] })),
      ]);

      if (coursesRes?.data) {
        setCourses(coursesRes.data);
      }
      if (sectionsRes?.data) {
        const sectionsMap = Array.isArray(sectionsRes.data)
          ? sectionsRes.data.reduce((acc, curr) => {
              acc[curr.section_id] = curr;
              return acc;
            }, {})
          : sectionsRes.data;
        setSections(sectionsMap);
      }
      if (settingsRes?.data) {
        setSettings(settingsRes.data);
      }
      if (mentorsRes?.data) {
        setMentors(mentorsRes.data);
      }
      if (leadsRes?.data) {
        setLeads(leadsRes.data);
      }
      if (mediaRes?.data) {
        setMedia(mediaRes.data);
      }
      if (healthRes) {
        setStorageStatus(healthRes);
      }

      // Robust fallback: if /courses or /sections failed, query /public/all
      if (!coursesRes?.data || !sectionsRes?.data) {
        const pubRes = await apiFetch("/public/all", {}, authToken).catch(
          () => null,
        );
        if (pubRes?.data) {
          if (!settingsRes?.data && pubRes.data.settings)
            setSettings(pubRes.data.settings);
          if (!coursesRes?.data && pubRes.data.courses)
            setCourses(pubRes.data.courses);
          if (!sectionsRes?.data && pubRes.data.sections)
            setSections(pubRes.data.sections);
          if (!mentorsRes?.data && pubRes.data.mentors)
            setMentors(pubRes.data.mentors);
        }
      }

      setLastSyncedTime(new Date());
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("onushilon_content_invalidated"));
      }
    } catch (err) {
      console.warn("Could not load full dashboard data:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async (tabName = null) => {
    if (!token || refreshing) return;
    setRefreshing(true);
    await fetchDashboardData(token, tabName);

    const labels = {
      dashboard: "Dashboard analytics & KPIs synced with live database!",
      courses: "Course catalog & pricing synced with live database!",
      sections: "Landing page sections & copy synced with live database!",
      contact: "WhatsApp & phone settings synced with live database!",
      mentors: "Faculty mentors synced with live database!",
      leads: "Student CRM leads & inquiries refreshed!",
      media: "Supabase storage bucket explorer refreshed!",
    };

    const msg =
      (tabName && labels[tabName]) ||
      "All data refreshed instantly from Supabase database!";
    showToast(msg, "success");
  };

  const handleRefreshAll = () => handleRefresh(currentTab);

  // Authentication Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      const jwtToken = data.token;
      setToken(jwtToken);
      localStorage.setItem("onushilon_admin_token", jwtToken);
      showToast("Signed in successfully to Supabase CRM!", "success");
      fetchDashboardData(jwtToken);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("onushilon_admin_token");
    showToast("Signed out successfully", "success");
  };

  // ===========================================================================
  // REAL DYNAMIC CHART DATA CALCULATIONS (NO DUMMY DATA)
  // ===========================================================================

  // 1. Live Course Distribution by Category (Calculated from courses array)
  const categoryStats = useMemo(() => {
    const map = {};
    courses.forEach((c) => {
      const cat = c.category_en || "General";
      if (!map[cat]) {
        map[cat] = { name: cat, count: 0, active: 0 };
      }
      map[cat].count += 1;
      if (c.is_active) map[cat].active += 1;
    });

    const entries = Object.values(map);
    if (entries.length === 0) {
      return [{ name: "No Courses Yet", count: 0, active: 0, fill: "#2563eb" }];
    }

    return entries.map((entry, idx) => ({
      ...entry,
      fill: CHART_PALETTE[idx % CHART_PALETTE.length],
    }));
  }, [courses]);

  // 2. Live Student CRM Pipeline (Calculated from leads array)
  const leadsPipelineStats = useMemo(() => {
    const counts = {
      new: 0,
      contacted: 0,
      enrolled: 0,
      closed: 0,
    };

    leads.forEach((l) => {
      const st = (l.status || "new").toLowerCase();
      if (counts[st] !== undefined) {
        counts[st] += 1;
      } else {
        counts.new += 1;
      }
    });

    return [
      {
        name: "New Leads",
        count: counts.new,
        status: "new",
        fill: STATUS_COLORS.new,
      },
      {
        name: "Contacted",
        count: counts.contacted,
        status: "contacted",
        fill: STATUS_COLORS.contacted,
      },
      {
        name: "Enrolled",
        count: counts.enrolled,
        status: "enrolled",
        fill: STATUS_COLORS.enrolled,
      },
      {
        name: "Closed",
        count: counts.closed,
        status: "closed",
        fill: STATUS_COLORS.closed,
      },
    ];
  }, [leads]);

  // 3. Live Pricing & Fee Comparison Chart
  const pricingComparisonStats = useMemo(() => {
    return courses.slice(0, 7).map((c, i) => {
      // Parse fee strings like "৳5,500" into numeric value
      const rawPrice = c.price
        ? parseInt(c.price.replace(/[^0-9]/g, ""), 10)
        : 0;
      const rawDiscount = c.discount_price
        ? parseInt(c.discount_price.replace(/[^0-9]/g, ""), 10)
        : 0;
      return {
        title: c.title_en
          ? c.title_en.length > 14
            ? c.title_en.slice(0, 14) + "..."
            : c.title_en
          : `Course ${i + 1}`,
        price: rawPrice || 4500,
        discount: rawDiscount || 0,
        fill: CHART_PALETTE[i % CHART_PALETTE.length],
      };
    });
  }, [courses]);

  // 4. Live Lead Inquiries Over Time (Grouped by Date/Month from real leads)
  const inquiriesTimelineStats = useMemo(() => {
    if (!leads || leads.length === 0) return [];

    const monthMap = {};
    leads.forEach((l) => {
      const date = l.created_at ? new Date(l.created_at) : new Date();
      const monthKey = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { label: monthKey, total: 0, enrolled: 0 };
      }
      monthMap[monthKey].total += 1;
      if (l.status === "enrolled") {
        monthMap[monthKey].enrolled += 1;
      }
    });

    return Object.values(monthMap);
  }, [leads]);

  // ===========================================================================
  // COURSE CRUD OPERATIONS
  // ===========================================================================
  const openNewCourseModal = () => {
    setEditingCourse(null);
    setCourseModalTab("basic");
    setCourseForm({
      id: "course-" + Date.now().toString(36),
      title_en: "",
      title_bn: "",
      category_en: "Robotics & Tech",
      category_bn: "রোবোটিক্স ও প্রযুক্তি",
      price: "৳5,000",
      discount_price: "৳4,500",
      duration_en: "3 months",
      duration_bn: "৩ মাস",
      level_en: "Hands-on Lab",
      level_bn: "হ্যান্ডস-অন ল্যাব",
      mentor_name: mentors[0]?.name_en || "Engr. Nayeem Siddique",
      schedule_en: "Fri & Sat • 4:00 PM",
      schedule_bn: "শুক্র ও শনি • বিকাল ৪:০০",
      seats_en: "8 seats left",
      seats_bn: "৮টি আসন বাকি",
      image_url: DEFAULT_COURSE_IMG,
      is_active: true,
      description_en: "",
      description_bn: "",
    });
    setTopicsEn([]);
    setIsCourseModalOpen(true);
  };

  const openEditCourseModal = (course) => {
    setEditingCourse(course);
    setCourseModalTab("basic");
    setCourseForm({
      id: course.id,
      title_en: course.title_en || "",
      title_bn: course.title_bn || "",
      category_en: course.category_en || "Robotics & Tech",
      category_bn: course.category_bn || "রোবোটিক্স ও প্রযুক্তি",
      price: course.price || "৳5,000",
      discount_price: course.discount_price || "",
      duration_en: course.duration_en || "3 months",
      duration_bn: course.duration_bn || "৩ মাস",
      level_en: course.level_en || "Hands-on Lab",
      level_bn: course.level_bn || "হ্যান্ডস-অন ল্যাব",
      mentor_name: course.mentor_name || "",
      schedule_en: course.schedule_en || "Fri & Sat",
      schedule_bn: course.schedule_bn || "শুক্র ও শনি",
      seats_en: course.seats_en || "8 seats left",
      seats_bn: course.seats_bn || "৮টি আসন বাকি",
      image_url: course.image_url || DEFAULT_COURSE_IMG,
      is_active: course.is_active !== undefined ? course.is_active : true,
      description_en: course.description_en || "",
      description_bn: course.description_bn || "",
    });
    setTopicsEn(Array.isArray(course.topics_en) ? [...course.topics_en] : []);
    setIsCourseModalOpen(true);
  };

  // Quick toggle active status from card
  const toggleCourseStatus = async (course, e) => {
    e.stopPropagation();
    const updatedStatus = !course.is_active;
    const updatedCourse = { ...course, is_active: updatedStatus };
    try {
      await apiFetch(`/courses/${course.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedCourse),
      });
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? updatedCourse : c)),
      );
      showToast(
        `Course "${course.title_en}" is now ${updatedStatus ? "Active" : "Draft"}`,
        "success",
      );
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Shared upload pipeline: instant local preview -> compress -> upload with progress
  const uploadImage = async (file, folder, key) => {
    const previewUrl = URL.createObjectURL(file);
    setSavingKey(key);
    setUploadPreview(previewUrl);
    setUploadProgress(0);
    try {
      const prepared = await compressImage(file);
      const res = await uploadWithProgress({
        url: `${API_BASE}/media/upload`,
        token,
        file: prepared,
        folder,
        onProgress: setUploadProgress,
      });
      return res.data;
    } catch (err) {
      if (err.message === "Unauthorized") {
        setToken("");
        localStorage.removeItem("onushilon_admin_token");
        showToast("Session expired. Please sign in again.", "error");
      }
      throw err;
    } finally {
      setSavingKey(null);
      setUploadProgress(null);
      setUploadPreview(null);
      URL.revokeObjectURL(previewUrl);
    }
  };

  // Light-weight refresh of just the media library after an upload/delete
  const refreshMedia = async () => {
    const res = await apiFetch("/media").catch(() => null);
    if (res?.data) setMedia(res.data);
  };

  const handleCourseImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await uploadImage(file, "courses", "course-img");
      if (data?.publicUrl) {
        setCourseForm((prev) => ({ ...prev, image_url: data.publicUrl }));
        showToast("Image uploaded. Click \"Save Course\" to publish it.", "success");
        refreshMedia();
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  const handleSaveCourse = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSavingKey("course");
    const payload = {
      ...courseForm,
      topics_en: topicsEn,
      topics_bn: topicsEn,
    };

    try {
      if (editingCourse) {
        const res = await apiFetch(`/courses/${editingCourse.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setCourses((prev) =>
          prev.map((c) => (c.id === editingCourse.id ? res.data : c)),
        );
        showToast(
          `Course "${payload.title_en}" updated in Supabase!`,
          "success",
        );
      } else {
        const res = await apiFetch("/courses", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setCourses((prev) => [...prev, res.data]);
        showToast(`Course "${payload.title_en}" created & saved!`, "success");
      }
      setIsCourseModalOpen(false);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSavingKey(null);
    }
  };

  const promptDeleteCourse = (course) => {
    setAlertDialog({
      open: true,
      title: `Delete Course "${course.title_en}"?`,
      description:
        "This will remove the course and its fees from the catalog and website. This action cannot be undone.",
      confirmText: "Delete Course",
      isDestructive: true,
      loading: false,
      onConfirm: async () => {
        setAlertDialog((prev) => ({ ...prev, loading: true }));
        try {
          await apiFetch(`/courses/${course.id}`, { method: "DELETE" });
          setCourses((prev) => prev.filter((c) => c.id !== course.id));
          showToast("Course removed successfully", "success");
          setAlertDialog((prev) => ({ ...prev, open: false }));
        } catch (err) {
          showToast(err.message, "error");
          setAlertDialog((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  // ===========================================================================
  // SITE SECTIONS & TEXTS CRUD (WITH ADD & DELETE FOR TESTIMONIALS & FAQS)
  // ===========================================================================
  const handleSaveSection = async (sectionId, updatedData) => {
    setSavingKey(sectionId);
    try {
      const res = await apiFetch(`/sections/${sectionId}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });
      setSections((prev) => ({ ...prev, [sectionId]: res.data }));
      showToast(
        `Saved changes for ${res.data.name || sectionId} to Supabase!`,
        "success",
      );
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSavingKey(null);
    }
  };

  // -------------------------------------------------------------
  // CONTENT BACKUP & RESTORE / TEXT EXPORT & IMPORT
  // -------------------------------------------------------------
  const generateBackupData = (includeSettings = true) => {
    const backup = {
      exported_at: new Date().toISOString(),
      site_name: settings?.site_title || "Onushilon Academy",
      sections: { ...sections },
    };
    if (includeSettings && settings) {
      backup.settings = { ...settings };
    }
    return JSON.stringify(backup, null, 2);
  };

  const copyBackupToClipboard = async () => {
    try {
      const text = generateBackupData(backupIncludeSettings);
      await navigator.clipboard.writeText(text);
      setBackupCopied(true);
      setTimeout(() => setBackupCopied(false), 2500);
      showToast("All section texts copied to clipboard!", "success");
    } catch (err) {
      showToast("Could not copy to clipboard: " + err.message, "error");
    }
  };

  const downloadBackupFile = (extension = "json") => {
    try {
      const text = generateBackupData(backupIncludeSettings);
      const blob = new Blob([text], {
        type: extension === "json" ? "application/json" : "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const dateStr = new Date().toISOString().split("T")[0];
      const a = document.createElement("a");
      a.href = url;
      a.download = `onushilon_content_backup_${dateStr}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Backup exported as .${extension} successfully!`, "success");
    } catch (err) {
      showToast("Failed to download backup: " + err.message, "error");
    }
  };

  const handleBackupFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setBackupImportText(text);
        showToast(
          `Loaded backup file "${file.name}"! Click "Restore All Sections" to apply.`,
          "info"
        );
      }
    };
    reader.readAsText(file);
  };

  const handleRestoreBackup = async () => {
    if (!backupImportText.trim()) {
      showToast("Please paste your backup text before restoring.", "warning");
      return;
    }

    setBackupRestoring(true);
    try {
      let parsed;
      try {
        parsed = JSON.parse(backupImportText);
      } catch (e) {
        throw new Error(
          "Invalid JSON format. Please paste valid backup JSON text."
        );
      }

      // Identify sections to restore
      let sectionsToRestore = {};
      if (parsed.sections && typeof parsed.sections === "object") {
        sectionsToRestore = parsed.sections;
      } else if (
        parsed.hero ||
        parsed.story ||
        parsed.why ||
        parsed.practice ||
        parsed.marquee ||
        parsed.voices ||
        parsed.faq ||
        parsed.cta
      ) {
        sectionsToRestore = parsed;
      } else if (Array.isArray(parsed)) {
        parsed.forEach((sec) => {
          if (sec.section_id) {
            sectionsToRestore[sec.section_id] = sec;
          }
        });
      } else {
        throw new Error("No recognized section data found in the pasted text.");
      }

      const sectionKeys = Object.keys(sectionsToRestore);
      if (sectionKeys.length === 0) {
        throw new Error("No sections found to restore.");
      }

      let restoredCount = 0;
      const updatedSections = { ...sections };

      for (const key of sectionKeys) {
        const sectionPayload = sectionsToRestore[key];
        try {
          const res = await apiFetch(`/sections/${key}`, {
            method: "PUT",
            body: JSON.stringify(sectionPayload),
          });
          if (res?.data) {
            updatedSections[key] = res.data;
            restoredCount++;
          }
        } catch (err) {
          console.warn(`Could not save section ${key}:`, err);
        }
      }

      if (parsed.settings && typeof parsed.settings === "object") {
        try {
          const res = await apiFetch("/settings", {
            method: "PUT",
            body: JSON.stringify(parsed.settings),
          });
          if (res?.data) {
            setSettings(res.data);
          }
        } catch (err) {
          console.warn("Could not save settings:", err);
        }
      }

      setSections(updatedSections);
      showToast(
        `Successfully restored and saved ${restoredCount} sections to live database!`,
        "success"
      );
      setBackupModalOpen(false);
      setBackupImportText("");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBackupRestoring(false);
    }
  };

  // Section-Level Raw Text / JSON Export & Import
  const handleOpenSectionRawText = (sectionId, sectionName) => {
    const currentSection = sections[sectionId] || {};
    setSectionRawModal({
      open: true,
      sectionId,
      name: sectionName || currentSection.name || sectionId,
      text: JSON.stringify(currentSection, null, 2),
      copied: false,
      saving: false,
    });
  };

  const handleCopySectionRawText = async () => {
    if (!sectionRawModal?.text) return;
    try {
      await navigator.clipboard.writeText(sectionRawModal.text);
      setSectionRawModal((prev) => (prev ? { ...prev, copied: true } : null));
      setTimeout(() => {
        setSectionRawModal((prev) =>
          prev ? { ...prev, copied: false } : null
        );
      }, 2000);
      showToast("Section text copied to clipboard!", "success");
    } catch (err) {
      showToast("Failed to copy: " + err.message, "error");
    }
  };

  const handleApplySectionRawText = async () => {
    if (!sectionRawModal?.text?.trim()) return;
    setSectionRawModal((prev) => ({ ...prev, saving: true }));
    try {
      let parsed;
      try {
        parsed = JSON.parse(sectionRawModal.text);
      } catch (e) {
        throw new Error("Invalid JSON format. Please ensure valid JSON syntax.");
      }

      const sectionId = sectionRawModal.sectionId;
      let payload = {};
      if (parsed.data_en || parsed.data_bn || parsed.media) {
        payload = {
          ...(sections[sectionId] || {}),
          ...parsed,
          section_id: sectionId,
        };
      } else {
        payload = {
          ...(sections[sectionId] || {}),
          data_en: { ...(sections[sectionId]?.data_en || {}), ...parsed },
        };
      }

      const res = await apiFetch(`/sections/${sectionId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res?.data) {
        setSections((prev) => ({ ...prev, [sectionId]: res.data }));
        showToast(
          `Section "${sectionRawModal.name}" restored and saved to Supabase!`,
          "success"
        );
        setSectionRawModal(null);
      }
    } catch (err) {
      showToast(err.message, "error");
      setSectionRawModal((prev) => (prev ? { ...prev, saving: false } : null));
    }
  };

  // Add Testimonial Item
  const handleAddTestimonial = () => {
    const currentList = sections.voices?.data_en?.testimonials || [];
    const newItem = {
      name: "New Student",
      role: "Batch 2026",
      quote: "Onushilon Academy helped me build real-world robotics skills.",
    };
    setSections((prev) => ({
      ...prev,
      voices: {
        ...prev.voices,
        data_en: {
          ...prev.voices?.data_en,
          testimonials: [...currentList, newItem],
        },
      },
    }));
  };

  // Delete Testimonial Item
  const handleDeleteTestimonial = (index) => {
    const currentList = sections.voices?.data_en?.testimonials || [];
    const updated = currentList.filter((_, i) => i !== index);
    setSections((prev) => ({
      ...prev,
      voices: {
        ...prev.voices,
        data_en: { ...prev.voices?.data_en, testimonials: updated },
      },
    }));
  };

  // Add FAQ Item (Bilingual)
  const handleAddFaq = () => {
    const currentListEn = sections.faq?.data_en?.items || [];
    const currentListBn = sections.faq?.data_bn?.items || [];
    const newItemEn = {
      q: "What are the class timings?",
      a: "Classes are held both online and offline during weekends and weekday evenings.",
    };
    const newItemBn = {
      q: "ক্লাসের সময়সূচি কী?",
      a: "সপ্তাহান্তে ও সপ্তাহের দিনগুলোর সন্ধ্যায় অনলাইন ও অফলাইনে ক্লাস অনুষ্ঠিত হয়।",
    };
    setSections((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        data_en: {
          ...prev.faq?.data_en,
          items: [...currentListEn, newItemEn],
        },
        data_bn: {
          ...prev.faq?.data_bn,
          items: [...currentListBn, newItemBn],
        },
      },
    }));
  };

  // Delete FAQ Item
  const handleDeleteFaq = (index) => {
    const currentListEn = sections.faq?.data_en?.items || [];
    const currentListBn = sections.faq?.data_bn?.items || [];
    const updatedEn = currentListEn.filter((_, i) => i !== index);
    const updatedBn = currentListBn.filter((_, i) => i !== index);
    setSections((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        data_en: { ...prev.faq?.data_en, items: updatedEn },
        data_bn: { ...prev.faq?.data_bn, items: updatedBn },
      },
    }));
  };

  // Move FAQ Item Up or Down
  const handleMoveFaq = (index, direction) => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const enItems = [...(sections.faq?.data_en?.items || [])];
    const bnItems = [...(sections.faq?.data_bn?.items || [])];
    if (targetIdx < 0 || targetIdx >= enItems.length) return;

    const tempEn = enItems[index];
    enItems[index] = enItems[targetIdx];
    enItems[targetIdx] = tempEn;

    if (bnItems.length > 0) {
      while (bnItems.length < enItems.length) {
        bnItems.push({ q: "", a: "" });
      }
      const tempBn = bnItems[index];
      bnItems[index] = bnItems[targetIdx];
      bnItems[targetIdx] = tempBn;
    }

    setSections((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        data_en: { ...prev.faq?.data_en, items: enItems },
        data_bn: { ...prev.faq?.data_bn, items: bnItems },
      },
    }));
  };

  // Update FAQ Item Field (EN / BN)
  const handleFaqItemChange = (index, lang, field, value) => {
    const listKey = lang === "en" ? "data_en" : "data_bn";
    const currentList = [...(sections.faq?.[listKey]?.items || [])];
    while (currentList.length <= index) {
      currentList.push({ q: "", a: "" });
    }
    currentList[index] = {
      ...currentList[index],
      [field]: value,
    };
    setSections((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        [listKey]: {
          ...prev.faq?.[listKey],
          items: currentList,
        },
      },
    }));
  };

  // Upload CTA Background Image
  const handleCtaBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await uploadImage(file, "sections", "cta-bg");
      if (data?.url) {
        setSections((prev) => ({
          ...prev,
          cta: {
            ...prev.cta,
            media: {
              ...prev.cta?.media,
              background_image: data.url,
            },
          },
        }));
        showToast("CTA background image uploaded! Click Save to apply.", "success");
      }
    } catch (err) {
      showToast(err.message || "Failed to upload image", "error");
    }
  };

  // -------------------------------------------------------------
  // STORY TIMELINE HANDLERS (Monthly vs Yearly Milestones)
  // -------------------------------------------------------------
  const handleAddStoryMilestone = (basis = "yearly") => {
    const isMonthly = basis === "monthly";
    const currentListEn = sections.story?.data_en?.timeline || [];
    const currentListBn = sections.story?.data_bn?.timeline || [];
    const newItemEn = {
      basis,
      year: isMonthly ? "Nov 2024" : "2024",
      year_en: isMonthly ? "Nov 2024" : "2024",
      year_bn: isMonthly ? "নভেম্বর ২০২৪" : "২০২৪",
      text: "Milestone achievement description in English",
      text_en: "Milestone achievement description in English",
      text_bn: "মাইলফলকের বিস্তারিত অর্জন ও বিবরণ বাংলায়",
    };
    const newItemBn = {
      ...newItemEn,
      year: newItemEn.year_bn,
      text: newItemEn.text_bn,
    };
    setSections((prev) => ({
      ...prev,
      story: {
        ...prev.story,
        data_en: { ...prev.story?.data_en, timeline: [...currentListEn, newItemEn] },
        data_bn: { ...prev.story?.data_bn, timeline: [...currentListBn, newItemBn] },
      },
    }));
  };

  const handleDeleteStoryMilestone = (index) => {
    const listEn = (sections.story?.data_en?.timeline || []).filter((_, i) => i !== index);
    const listBn = (sections.story?.data_bn?.timeline || []).filter((_, i) => i !== index);
    setSections((prev) => ({
      ...prev,
      story: {
        ...prev.story,
        data_en: { ...prev.story?.data_en, timeline: listEn },
        data_bn: { ...prev.story?.data_bn, timeline: listBn },
      },
    }));
  };

  const handleMoveStoryMilestone = (index, dir) => {
    const listEn = [...(sections.story?.data_en?.timeline || [])];
    const targetIdx = index + dir;
    if (targetIdx < 0 || targetIdx >= listEn.length) return;
    const itemEn = listEn[index];
    listEn.splice(index, 1);
    listEn.splice(targetIdx, 0, itemEn);

    const listBn = [...(sections.story?.data_bn?.timeline || [])];
    if (listBn.length > index) {
      const itemBn = listBn[index];
      listBn.splice(index, 1);
      listBn.splice(targetIdx, 0, itemBn);
    }
    setSections((prev) => ({
      ...prev,
      story: {
        ...prev.story,
        data_en: { ...prev.story?.data_en, timeline: listEn },
        data_bn: { ...prev.story?.data_bn, timeline: listBn },
      },
    }));
  };

  const handleStoryMilestoneChange = (index, field, value) => {
    const listEn = [...(sections.story?.data_en?.timeline || [])];
    const listBn = [...(sections.story?.data_bn?.timeline || [])];
    if (!listEn[index]) listEn[index] = {};
    if (!listBn[index]) listBn[index] = {};

    listEn[index] = { ...listEn[index], [field]: value };
    listBn[index] = { ...listBn[index], [field]: value };

    if (field === "year_en") {
      listEn[index].year = value;
    } else if (field === "year_bn") {
      listBn[index].year = value;
    } else if (field === "text_en") {
      listEn[index].text = value;
    } else if (field === "text_bn") {
      listBn[index].text = value;
    }

    setSections((prev) => ({
      ...prev,
      story: {
        ...prev.story,
        data_en: { ...prev.story?.data_en, timeline: listEn },
        data_bn: { ...prev.story?.data_bn, timeline: listBn },
      },
    }));
  };

  // -------------------------------------------------------------
  // WHY US SECTION HANDLERS (Stats & Features)
  // -------------------------------------------------------------
  const handleWhyStatChange = (index, field, value) => {
    const statsEn = [...(sections.why?.data_en?.stats || [])];
    const statsBn = [...(sections.why?.data_bn?.stats || [])];
    if (!statsEn[index]) statsEn[index] = {};
    if (!statsBn[index]) statsBn[index] = {};

    statsEn[index] = { ...statsEn[index], [field]: value };
    statsBn[index] = { ...statsBn[index], [field]: value };

    setSections((prev) => ({
      ...prev,
      why: {
        ...prev.why,
        data_en: { ...prev.why?.data_en, stats: statsEn },
        data_bn: { ...prev.why?.data_bn, stats: statsBn },
      },
    }));
  };

  const handleAddWhyFeature = () => {
    const featuresEn = sections.why?.data_en?.features || [];
    const featuresBn = sections.why?.data_bn?.features || [];
    const newFeature = {
      title_en: "Core Value Pillar",
      title_bn: "মূল বৈশিষ্ট্যের শিরোনাম",
      desc_en: "Explain the feature and learning benefit in English.",
      desc_bn: "বৈশিষ্ট্য ও শিক্ষার্থীদের উপকারের বিবরণ বাংলায় লিখুন।",
    };
    setSections((prev) => ({
      ...prev,
      why: {
        ...prev.why,
        data_en: { ...prev.why?.data_en, features: [...featuresEn, newFeature] },
        data_bn: { ...prev.why?.data_bn, features: [...featuresBn, newFeature] },
      },
    }));
  };

  const handleDeleteWhyFeature = (index) => {
    const featuresEn = (sections.why?.data_en?.features || []).filter((_, i) => i !== index);
    const featuresBn = (sections.why?.data_bn?.features || []).filter((_, i) => i !== index);
    setSections((prev) => ({
      ...prev,
      why: {
        ...prev.why,
        data_en: { ...prev.why?.data_en, features: featuresEn },
        data_bn: { ...prev.why?.data_bn, features: featuresBn },
      },
    }));
  };

  const handleWhyFeatureChange = (index, field, value) => {
    const featuresEn = [...(sections.why?.data_en?.features || [])];
    const featuresBn = [...(sections.why?.data_bn?.features || [])];
    if (!featuresEn[index]) featuresEn[index] = {};
    if (!featuresBn[index]) featuresBn[index] = {};

    featuresEn[index] = { ...featuresEn[index], [field]: value };
    featuresBn[index] = { ...featuresBn[index], [field]: value };

    setSections((prev) => ({
      ...prev,
      why: {
        ...prev.why,
        data_en: { ...prev.why?.data_en, features: featuresEn },
        data_bn: { ...prev.why?.data_bn, features: featuresBn },
      },
    }));
  };

  // -------------------------------------------------------------
  // PRACTICE ARENA HANDLERS (Quiz Questions & Options)
  // -------------------------------------------------------------
  const handleAddPracticeTask = () => {
    const currentTasksEn = sections.practice?.data_en?.tasks || [];
    const currentTasksBn = sections.practice?.data_bn?.tasks || [];
    const newTask = {
      subject_en: "General Science",
      subject_bn: "সাধারণ বিজ্ঞান",
      subject: "General Science",
      question_en: "Sample concept challenge question in English?",
      question_bn: "বাংলায় একটি নমুনা চ্যালেঞ্জ প্রশ্ন?",
      options_en: ["Option A", "Option B", "Option C", "Option D"],
      options_bn: ["অপশন ১", "অপশন ২", "অপশন ৩", "অপশন ৪"],
      correct: 0,
      explanation_en: "Detailed step-by-step reasoning in English.",
      explanation_bn: "বাংলায় প্রতিটি ধাপের বিস্তারিত ব্যাখ্যা।",
    };
    setSections((prev) => ({
      ...prev,
      practice: {
        ...prev.practice,
        data_en: { ...prev.practice?.data_en, tasks: [...currentTasksEn, newTask] },
        data_bn: { ...prev.practice?.data_bn, tasks: [...currentTasksBn, newTask] },
      },
    }));
  };

  const handleDeletePracticeTask = (index) => {
    const tasksEn = (sections.practice?.data_en?.tasks || []).filter((_, i) => i !== index);
    const tasksBn = (sections.practice?.data_bn?.tasks || []).filter((_, i) => i !== index);
    setSections((prev) => ({
      ...prev,
      practice: {
        ...prev.practice,
        data_en: { ...prev.practice?.data_en, tasks: tasksEn },
        data_bn: { ...prev.practice?.data_bn, tasks: tasksBn },
      },
    }));
  };

  const handlePracticeTaskChange = (index, field, value) => {
    const tasksEn = [...(sections.practice?.data_en?.tasks || [])];
    const tasksBn = [...(sections.practice?.data_bn?.tasks || [])];
    if (!tasksEn[index]) tasksEn[index] = {};
    if (!tasksBn[index]) tasksBn[index] = {};

    tasksEn[index] = { ...tasksEn[index], [field]: value };
    tasksBn[index] = { ...tasksBn[index], [field]: value };

    setSections((prev) => ({
      ...prev,
      practice: {
        ...prev.practice,
        data_en: { ...prev.practice?.data_en, tasks: tasksEn },
        data_bn: { ...prev.practice?.data_bn, tasks: tasksBn },
      },
    }));
  };

  const handlePracticeOptionChange = (taskIdx, optIdx, langKey, value) => {
    const targetKey = langKey === "bn" ? "options_bn" : "options_en";
    const tasks = [...(sections.practice?.[`data_${langKey}`]?.tasks || [])];
    if (!tasks[taskIdx]) return;
    const options = [...(tasks[taskIdx][targetKey] || tasks[taskIdx].options || ["", "", "", ""])];
    options[optIdx] = value;
    tasks[taskIdx] = {
      ...tasks[taskIdx],
      [targetKey]: options,
      ...(langKey === "en" ? { options } : {}),
    };

    setSections((prev) => ({
      ...prev,
      practice: {
        ...prev.practice,
        [`data_${langKey}`]: {
          ...prev.practice?.[`data_${langKey}`],
          tasks,
        },
      },
    }));
  };

  // -------------------------------------------------------------
  // MARQUEE HANDLERS
  // -------------------------------------------------------------
  const handleAddMarqueeItem = () => {
    const itemsEn = sections.marquee?.data_en?.items || [];
    const itemsBn = sections.marquee?.data_bn?.items || [];
    setSections((prev) => ({
      ...prev,
      marquee: {
        ...prev.marquee,
        data_en: { ...prev.marquee?.data_en, items: [...itemsEn, "New Highlight"] },
        data_bn: { ...prev.marquee?.data_bn, items: [...itemsBn, "নতুন হাইলাইট"] },
      },
    }));
  };

  const handleDeleteMarqueeItem = (index) => {
    const itemsEn = (sections.marquee?.data_en?.items || []).filter((_, i) => i !== index);
    const itemsBn = (sections.marquee?.data_bn?.items || []).filter((_, i) => i !== index);
    setSections((prev) => ({
      ...prev,
      marquee: {
        ...prev.marquee,
        data_en: { ...prev.marquee?.data_en, items: itemsEn },
        data_bn: { ...prev.marquee?.data_bn, items: itemsBn },
      },
    }));
  };

  const handleMarqueeItemChange = (index, langKey, value) => {
    const items = [...(sections.marquee?.[`data_${langKey}`]?.items || [])];
    items[index] = value;
    setSections((prev) => ({
      ...prev,
      marquee: {
        ...prev.marquee,
        [`data_${langKey}`]: {
          ...prev.marquee?.[`data_${langKey}`],
          items,
        },
      },
    }));
  };

  // ===========================================================================
  // CONTACT & WHATSAPP SETTINGS
  // ===========================================================================
  const handleSaveContact = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSavingKey("contact");
    try {
      const res = await apiFetch("/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      setSettings(res.data);
      showToast("WhatsApp and Phone settings saved to Supabase!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSavingKey(null);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target?.files?.[0] || e;
    if (!file) return;
    try {
      const data = await uploadImage(file, "branding", "logo-upload");
      if (data?.publicUrl) {
        const updated = { ...(settings || {}), logo_url: data.publicUrl };
        setSettings(updated);
        const res = await apiFetch("/settings", {
          method: "PUT",
          body: JSON.stringify(updated),
        });
        if (res?.data) {
          setSettings(res.data);
        }
        showToast("Official logo uploaded and published across website!", "success");
        refreshMedia();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("onushilon_content_invalidated"));
        }
      }
    } catch (err) {
      showToast(err.message || "Failed to upload logo", "error");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  const handleRemoveLogo = async () => {
    setSavingKey("logo-remove");
    try {
      const updated = { ...(settings || {}), logo_url: null };
      setSettings(updated);
      const res = await apiFetch("/settings", {
        method: "PUT",
        body: JSON.stringify(updated),
      });
      if (res?.data) {
        setSettings(res.data);
      }
      showToast("Logo removed. Default 'অ' monogram restored.", "success");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("onushilon_content_invalidated"));
      }
    } catch (err) {
      showToast(err.message || "Failed to remove logo", "error");
    } finally {
      setSavingKey(null);
    }
  };

  const handleSetAsLogo = async (publicUrl) => {
    try {
      const updated = { ...(settings || {}), logo_url: publicUrl };
      setSettings(updated);
      const res = await apiFetch("/settings", {
        method: "PUT",
        body: JSON.stringify(updated),
      });
      if (res?.data) {
        setSettings(res.data);
      }
      showToast("Selected media set as official Academy logo!", "success");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("onushilon_content_invalidated"));
      }
    } catch (err) {
      showToast(err.message || "Could not set logo", "error");
    }
  };

  // ===========================================================================
  // MENTORS CRUD
  // ===========================================================================
  const handleMentorAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await uploadImage(file, "mentors", "mentor-img");
      if (data?.publicUrl) {
        setMentorForm((prev) => ({ ...prev, avatar_url: data.publicUrl }));
        showToast("Avatar uploaded. Click \"Save Mentor\" to publish it.", "success");
        refreshMedia();
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  const handleSaveMentor = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSavingKey("mentor");
    try {
      if (mentorForm.id) {
        await apiFetch(`/mentors/${mentorForm.id}`, {
          method: "PUT",
          body: JSON.stringify(mentorForm),
        });
        setMentors((prev) =>
          prev.map((m) =>
            m.id === mentorForm.id ? { ...m, ...mentorForm } : m,
          ),
        );
        showToast("Mentor profile updated in Supabase!", "success");
      } else {
        const res = await apiFetch("/mentors", {
          method: "POST",
          body: JSON.stringify(mentorForm),
        });
        setMentors((prev) => [...prev, res.data]);
        showToast("Mentor added to faculty in Supabase!", "success");
      }
      setIsMentorModalOpen(false);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSavingKey(null);
    }
  };

  const promptDeleteMentor = (mentor) => {
    setAlertDialog({
      open: true,
      title: `Remove Mentor "${mentor.name_en}"?`,
      description:
        "This will remove the instructor from the academy faculty list.",
      confirmText: "Remove Mentor",
      isDestructive: true,
      loading: false,
      onConfirm: async () => {
        setAlertDialog((prev) => ({ ...prev, loading: true }));
        try {
          await apiFetch(`/mentors/${mentor.id}`, { method: "DELETE" });
          setMentors((prev) => prev.filter((item) => item.id !== mentor.id));
          showToast("Mentor removed successfully", "success");
          setAlertDialog((prev) => ({ ...prev, open: false }));
        } catch (err) {
          showToast(err.message, "error");
          setAlertDialog((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  // ===========================================================================
  // STUDENT CRM & LEADS MANAGEMENT
  // ===========================================================================
  const handleUpdateLeadStatus = async (leadId, newStatus) => {
    try {
      await apiFetch(`/leads/${leadId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)),
      );
      showToast(`Lead marked as ${newStatus}`, "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleCreateManualLead = async (e) => {
    e.preventDefault();
    if (!newLeadForm.full_name || !newLeadForm.phone) {
      showToast("Student name and phone number are required", "error");
      return;
    }
    try {
      const res = await apiFetch("/public/leads", {
        method: "POST",
        body: JSON.stringify(newLeadForm),
      });
      showToast("Student inquiry logged into CRM!", "success");
      setIsAddLeadModalOpen(false);
      setNewLeadForm({
        full_name: "",
        phone: "",
        email: "",
        course_name: "Robotics & Tech",
        notes: "",
      });
      fetchDashboardData(token);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const openLeadNotesDialog = (lead) => {
    setLeadNotesModal({
      open: true,
      lead,
      notes: lead.notes || "",
      loading: false,
    });
  };

  const handleSaveLeadNotes = async () => {
    if (!leadNotesModal.lead) return;
    setLeadNotesModal((prev) => ({ ...prev, loading: true }));
    try {
      await apiFetch(`/leads/${leadNotesModal.lead.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ notes: leadNotesModal.notes }),
      });
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadNotesModal.lead.id
            ? { ...l, notes: leadNotesModal.notes }
            : l,
        ),
      );
      showToast("Counsellor notes saved to Supabase!", "success");
      setLeadNotesModal({ open: false, lead: null, notes: "", loading: false });
    } catch (err) {
      showToast(err.message, "error");
      setLeadNotesModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const promptDeleteLead = (lead) => {
    setAlertDialog({
      open: true,
      title: `Delete Inquiry for ${lead.full_name}?`,
      description:
        "This will permanently remove the inquiry from your student CRM.",
      confirmText: "Delete Inquiry",
      isDestructive: true,
      loading: false,
      onConfirm: async () => {
        setAlertDialog((prev) => ({ ...prev, loading: true }));
        try {
          await apiFetch(`/leads/${lead.id}`, { method: "DELETE" });
          setLeads((prev) => prev.filter((l) => l.id !== lead.id));
          showToast("Inquiry record deleted", "success");
          setAlertDialog((prev) => ({ ...prev, open: false }));
        } catch (err) {
          showToast(err.message, "error");
          setAlertDialog((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  // Export Leads to CSV
  const exportLeadsToCsv = () => {
    if (leads.length === 0) {
      showToast("No inquiries available to export", "error");
      return;
    }
    const headers = [
      "Full Name",
      "Phone",
      "Email",
      "Course",
      "Status",
      "Notes",
      "Date",
    ];
    const rows = leads.map((l) => [
      `"${l.full_name || ""}"`,
      `"${l.phone || ""}"`,
      `"${l.email || ""}"`,
      `"${l.course_name || ""}"`,
      `"${l.status || ""}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
      `"${new Date(l.created_at).toLocaleString()}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `onushilon_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Leads exported to CSV successfully!", "success");
  };

  // ===========================================================================
  // SUPABASE STORAGE CLOUD MEDIA
  // ===========================================================================
  const handleGeneralMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await uploadImage(
        file,
        mediaFolderFilter !== "all" ? mediaFolderFilter : "general",
        "general-img",
      );
      if (data?.publicUrl) {
        showToast("Image uploaded to the media library.", "success");
        await refreshMedia();
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  // Delete media asset from Supabase storage and invalidate all caches
  const handleDeleteMedia = (mediaItem) => {
    setAlertDialog({
      open: true,
      title: `Delete Image: "${mediaItem.name}"?`,
      description:
        "This will permanently remove the image from Supabase cloud storage bucket and invalidate its cache across the website and admin panel.",
      confirmText: "Delete from Storage",
      isDestructive: true,
      loading: false,
      onConfirm: async () => {
        setAlertDialog((prev) => ({ ...prev, loading: true }));
        try {
          const identifier = mediaItem.id || encodeURIComponent(mediaItem.name);
          await apiFetch(`/media/${identifier}`, {
            method: "DELETE",
            body: JSON.stringify({
              storagePath: mediaItem.storagePath || mediaItem.name,
              publicUrl: mediaItem.publicUrl,
            }),
          });
          setMedia((prev) =>
            prev.filter((m) =>
              m.id ? m.id !== mediaItem.id : m.name !== mediaItem.name,
            ),
          );
          if (
            previewMedia &&
            (previewMedia.id === mediaItem.id ||
              previewMedia.name === mediaItem.name)
          ) {
            setPreviewMedia(null);
          }
          showToast(
            `Image "${mediaItem.name}" deleted and cache invalidated!`,
            "success",
          );
          setAlertDialog((prev) => ({ ...prev, open: false }));
          fetchDashboardData(token, "media");
        } catch (err) {
          showToast(err.message, "error");
          setAlertDialog((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  // Replace / edit an existing image in storage and invalidate caches
  const handleReplaceMedia = async (mediaItem, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const folder =
      mediaFolderFilter !== "all"
        ? mediaFolderFilter
        : (mediaItem.publicUrl || "").includes("/photos/")
          ? "photos"
          : (mediaItem.publicUrl || "").includes("/courses/")
            ? "courses"
            : (mediaItem.publicUrl || "").includes("/mentors/")
              ? "mentors"
              : "general";

    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    setSavingKey(`replace-img-${mediaItem.name}`);
    try {
      // 1. Upload new image
      const res = await apiFetch("/media/upload", {
        method: "POST",
        body: formData,
      });

      // 2. Delete old image from storage
      if (res.data?.publicUrl) {
        const identifier = mediaItem.id || encodeURIComponent(mediaItem.name);
        await apiFetch(`/media/${identifier}`, {
          method: "DELETE",
          body: JSON.stringify({
            storagePath: mediaItem.storagePath || mediaItem.name,
            publicUrl: mediaItem.publicUrl,
          }),
        }).catch(() => {});

        const cacheBusted = cacheBustUrl(res.data.publicUrl);
        if (previewMedia) {
          setPreviewMedia({
            ...previewMedia,
            name: file.name,
            publicUrl: cacheBusted,
          });
        }
        showToast(
          "Image replaced and cache invalidated successfully!",
          "success",
        );
        fetchDashboardData(token, "media");
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSavingKey(null);
      if (e.target) e.target.value = "";
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
    showToast("URL copied to clipboard!", "success");
  };

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchCat =
        courseCategoryFilter === "all" ||
        c.category_en?.toLowerCase() === courseCategoryFilter.toLowerCase();
      const q = courseSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        c.title_en?.toLowerCase().includes(q) ||
        c.title_bn?.toLowerCase().includes(q) ||
        c.mentor_name?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [courses, courseCategoryFilter, courseSearch]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchStatus = leadStatusFilter
        ? l.status === leadStatusFilter
        : true;
      const q = leadSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        l.full_name?.toLowerCase().includes(q) ||
        l.phone?.toLowerCase().includes(q) ||
        l.course_name?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [leads, leadStatusFilter, leadSearch]);

  // Filtered Media
  const filteredMedia = useMemo(() => {
    return media.filter((m) => {
      const matchSearch = mediaSearch
        ? m.name?.toLowerCase().includes(mediaSearch.toLowerCase())
        : true;
      const matchFolder =
        mediaFolderFilter === "all"
          ? true
          : (m.publicUrl || "")
              .toLowerCase()
              .includes(`/${mediaFolderFilter}/`);
      return matchSearch && matchFolder;
    });
  }, [media, mediaSearch, mediaFolderFilter]);

  // Prevent SSR Hydration Mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-sm">
            অ
          </div>
          <div className="text-xs uppercase font-mono tracking-widest text-blue-700">
            Initializing Onushilon CRM...
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // REDESIGNED BLACK & LIGHTGREEN AUTHENTICATION SCREEN
  // ===========================================================================
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <Card className="w-full max-w-md border-slate-200 bg-white shadow-sm backdrop-blur-2xl relative z-10">
          <CardHeader className="text-center pb-2">
            {settings?.logo_url ? (
              <img
                src={cacheBustUrl(resolveMediaUrl(settings.logo_url, BACKEND_ORIGIN))}
                alt="Onushilon Logo"
                className="w-16 h-16 rounded-2xl object-contain bg-white p-2 border border-slate-200 shadow-sm mx-auto mb-4"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-sm mb-4">
                অ
              </div>
            )}
            <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">
              Onushilon CRM Portal
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Black & Lightgreen Executive Control & Student CRM Panel
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label required>Admin Email</Label>
                <Input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="admin@onushilon.com"
                  required
                />
              </div>

              <div>
                <Label required>Password</Label>
                <Input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500 flex items-center justify-between">
                <div>
                  Default:{" "}
                  <span className="text-blue-700 font-mono">
                    admin@onushilon.com
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAuthEmail("admin@onushilon.com");
                    setAuthPassword("admin1234");
                    showToast("Filled demo admin credentials", "success");
                  }}
                  className="text-blue-700 hover:text-blue-800 underline font-medium text-[11px]"
                >
                  Auto-fill
                </button>
              </div>

              <Button
                type="submit"
                disabled={authLoading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition-all"
              >
                {authLoading ? "Authenticating..." : "Sign In to Admin Portal"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {toast && (
          <div className="fixed bottom-6 right-6 px-4 py-3 bg-white border border-blue-200 rounded-xl text-slate-900 shadow-2xl flex items-center gap-3 z-50">
            <span className="text-xs font-medium">{toast.message}</span>
          </div>
        )}
      </div>
    );
  }

  // ===========================================================================
  // MAIN ADMIN PORTAL (BLACK & LIGHTGREEN REDESIGN)
  // ===========================================================================
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex font-sans antialiased selection:bg-blue-200 selection:text-slate-900">
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`w-72 bg-white border-r border-slate-200 fixed top-0 bottom-0 left-0 z-40 flex flex-col backdrop-blur-2xl transition-transform duration-300 ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings?.logo_url ? (
              <img
                src={cacheBustUrl(resolveMediaUrl(settings.logo_url, BACKEND_ORIGIN))}
                alt="Onushilon Logo"
                className="w-10 h-10 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-sm">
                অ
              </div>
            )}
            <div>
              <div className="font-bold text-base text-slate-900 tracking-tight">
                Onushilon
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                  Admin Portal
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-slate-500 hover:text-slate-900 p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 flex-1 overflow-y-auto space-y-1">
          <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 px-3 py-2">
            Overview
          </div>
          <button
            onClick={() => {
              setCurrentTab("dashboard");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentTab === "dashboard"
                ? "bg-blue-50 border border-blue-200 text-blue-700 font-semibold shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <LayoutDashboard
              size={18}
              className={
                currentTab === "dashboard"
                  ? "text-blue-700"
                  : "text-slate-500"
              }
            />
            <span>Dashboard & Analytics</span>
          </button>

          <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 px-3 pt-4 pb-2">
            Dynamic Academy Content
          </div>
          <button
            onClick={() => {
              setCurrentTab("courses");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentTab === "courses"
                ? "bg-blue-50 border border-blue-200 text-blue-700 font-semibold shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <BookOpen
              size={18}
              className={
                currentTab === "courses" ? "text-blue-700" : "text-slate-500"
              }
            />
            <span>Courses & Pricing</span>
            <Badge
              variant="outline"
              className="ml-auto text-[10px] py-0 px-1.5 border-slate-200"
            >
              {courses.length}
            </Badge>
          </button>

          <button
            onClick={() => {
              setCurrentTab("sections");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentTab === "sections"
                ? "bg-blue-50 border border-blue-200 text-blue-700 font-semibold shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers
              size={18}
              className={
                currentTab === "sections" ? "text-blue-700" : "text-slate-500"
              }
            />
            <span>Site Sections & Texts</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab("contact");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentTab === "contact"
                ? "bg-blue-50 border border-blue-200 text-blue-700 font-semibold shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Sliders
              size={18}
              className={
                currentTab === "contact" ? "text-blue-700" : "text-slate-500"
              }
            />
            <span>Brand Logo & Settings</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab("mentors");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentTab === "mentors"
                ? "bg-blue-50 border border-blue-200 text-blue-700 font-semibold shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Users
              size={18}
              className={
                currentTab === "mentors" ? "text-blue-700" : "text-slate-500"
              }
            />
            <span>Mentors & Faculty</span>
            <Badge
              variant="outline"
              className="ml-auto text-[10px] py-0 px-1.5 border-slate-200"
            >
              {mentors.length}
            </Badge>
          </button>

          <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 px-3 pt-4 pb-2">
            Growth & CRM
          </div>
          <button
            onClick={() => {
              setCurrentTab("leads");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentTab === "leads"
                ? "bg-blue-50 border border-blue-200 text-blue-700 font-semibold shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <TrendingUp
              size={18}
              className={
                currentTab === "leads" ? "text-blue-700" : "text-slate-500"
              }
            />
            <span>Student Inquiries</span>
            {leads.filter((l) => l.status === "new").length > 0 ? (
              <Badge
                variant="warning"
                className="ml-auto px-2 py-0.5 text-[10px] font-bold"
              >
                {leads.filter((l) => l.status === "new").length} New
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="ml-auto text-[10px] py-0 px-1.5 border-slate-200"
              >
                {leads.length}
              </Badge>
            )}
          </button>

          <button
            onClick={() => {
              setCurrentTab("media");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentTab === "media"
                ? "bg-blue-50 border border-blue-200 text-blue-700 font-semibold shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <HardDrive
              size={18}
              className={
                currentTab === "media" ? "text-blue-700" : "text-slate-500"
              }
            />
            <span>Supabase Storage</span>
            <Badge
              variant="outline"
              className="ml-auto text-[10px] py-0 px-1.5 border-slate-200"
            >
              {media.length}
            </Badge>
          </button>
        </nav>

        {/* Live Supabase Bucket Status Bar */}
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        {/* TOP BAR */}
        <header className="h-16 px-4 sm:px-8 border-b border-slate-200 bg-white  flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {currentTab === "dashboard" &&
                  "Executive Dashboard & Live Analytics"}
                {currentTab === "courses" && "Course & Pricing Management"}
                {currentTab === "sections" && "Landing Page Sections & Texts"}
                {currentTab === "contact" &&
                  "Academy Branding, Logo & Settings"}
                {currentTab === "mentors" && "Faculty Mentors"}
                {currentTab === "leads" && "Student Leads & Inquiries CRM"}
                {currentTab === "media" && "Supabase Storage Bucket Explorer"}
              </h1>
              <div className="text-[11px] text-slate-500 hidden sm:block">
                Onushilon Academy • Real-time Supabase Database Sync
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRefresh(currentTab)}
              disabled={refreshing}
              title="Instantly refresh all data from live Supabase database (bypasses cache)"
              className="px-3 py-1.5 rounded-xl border-blue-200 bg-blue-50 hover:bg-blue-50 text-blue-700 hover:text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <RefreshCw
                size={13}
                className={
                  refreshing
                    ? "animate-spin text-blue-700"
                    : "text-blue-700"
                }
              />
              <span className="hidden sm:inline">
                {refreshing ? "Syncing..." : "Sync Live Data"}
              </span>
              <span className="sm:hidden">{refreshing ? "..." : "Sync"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setBackupModalOpen(true)}
              title="Backup or restore all texts & settings as text/JSON so you never lose data"
              className="px-3 py-1.5 rounded-xl border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FileText size={13} className="text-amber-700" />
              <span className="hidden md:inline">Backup &amp; Restore</span>
              <span className="md:hidden">Backup</span>
            </Button>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">View Website</span>
            </Link>

            <Button
              size="sm"
              onClick={openNewCourseModal}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md "
            >
              <Plus size={15} />
              <span>Add Course</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleLogout}
              title="Sign Out"
              className="border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200"
            >
              <LogOut size={15} />
            </Button>
          </div>
        </header>

        {/* BODY CONTENT */}
        <main className="admin-panel-shell p-4 sm:p-8 flex-1 space-y-6 max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] w-full mx-auto rounded-[28px] my-4 sm:my-6">
          {/* ===================================================================
              TAB 1: DASHBOARD & LIVE CHARTS (REMOVED DUMMY DATA)
             =================================================================== */}
          {currentTab === "dashboard" && (
            <div className="space-y-6">
              {/* Dashboard Live Status & Action Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-sm" />
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Live Academy Overview & Performance Metrics
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Direct sync with live Supabase database
                      {lastSyncedTime &&
                        ` • Synced at ${lastSyncedTime.toLocaleTimeString()}`}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRefresh("dashboard")}
                  disabled={refreshing}
                  title="Reload all dashboard analytics and live CRM statistics"
                  className="gap-2 border-slate-200 hover:bg-blue-50 text-blue-700 text-xs font-semibold shrink-0"
                >
                  <RefreshCw
                    size={14}
                    className={
                      refreshing ? "animate-spin text-blue-700" : ""
                    }
                  />
                  <span>
                    {refreshing
                      ? "Refreshing Analytics..."
                      : "Refresh Analytics"}
                  </span>
                </Button>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <Card className="hover:border-blue-300 transition-colors">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Total Courses
                      </div>
                      <div className="text-3xl font-extrabold text-slate-900 mt-1.5">
                        {courses.length}
                      </div>
                      <div className="text-[11px] text-blue-700 mt-1 flex items-center gap-1">
                        <CheckCircle size={12} />
                        <span>All published catalog</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shadow-inner">
                      <BookOpen size={22} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:border-blue-300 transition-colors">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Active Batches
                      </div>
                      <div className="text-3xl font-extrabold text-blue-700 mt-1.5">
                        {courses.filter((c) => c.is_active).length}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {courses.length -
                          courses.filter((c) => c.is_active).length}{" "}
                        draft batches
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shadow-inner">
                      <Activity size={22} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:border-blue-300 transition-colors">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Total Leads
                      </div>
                      <div className="text-3xl font-extrabold text-slate-900 mt-1.5">
                        {leads.length}
                      </div>
                      <div className="text-[11px] text-blue-700 mt-1 flex items-center gap-1">
                        <Zap size={12} />
                        <span>Live Supabase sync</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shadow-inner">
                      <TrendingUp size={22} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:border-blue-300 transition-colors">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Enrolled Ratio
                      </div>
                      <div className="text-3xl font-extrabold text-blue-700 mt-1.5">
                        {leads.length > 0
                          ? `${Math.round(
                              (leads.filter((l) => l.status === "enrolled")
                                .length /
                                leads.length) *
                                100,
                            )}%`
                          : "0%"}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {leads.filter((l) => l.status === "enrolled").length}{" "}
                        enrolled students
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shadow-inner">
                      <Award size={22} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* DYNAMIC REAL-DATA CHARTS (REPLACED DUMMY STATIC DATA) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CHART 1: Real Course Category Distribution */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart2 size={18} className="text-blue-700" />
                        <span>Live Course Department Distribution</span>
                      </CardTitle>
                      <CardDescription>
                        Real-time course count calculated directly from active
                        database
                      </CardDescription>
                    </div>
                    <Badge variant="default" className="text-[10px]">
                      Live Data
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={categoryStats}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                            fontSize={11}
                            tickLine={false}
                          />
                          <YAxis
                            stroke="#94a3b8"
                            fontSize={11}
                            allowDecimals={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#ffffff",
                              borderColor: "#e2e8f0",
                              borderRadius: 10,
                              color: "#0f172a",
                              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                            cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
                          />
                          <Bar
                            dataKey="count"
                            radius={[6, 6, 0, 0]}
                            name="Courses"
                          >
                            {categoryStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* CHART 2: Real CRM Inquiries Pipeline */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <PieChartIcon size={18} className="text-blue-700" />
                        <span>Student Inquiries Pipeline</span>
                      </CardTitle>
                      <CardDescription>
                        Status breakdown of {leads.length} student leads in CRM
                      </CardDescription>
                    </div>
                    <Badge variant="default" className="text-[10px]">
                      CRM Funnel
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={leadsPipelineStats}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                            fontSize={11}
                            tickLine={false}
                          />
                          <YAxis
                            stroke="#94a3b8"
                            fontSize={11}
                            allowDecimals={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#ffffff",
                              borderColor: "#e2e8f0",
                              borderRadius: 10,
                              color: "#0f172a",
                              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                            cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
                          />
                          <Bar
                            dataKey="count"
                            radius={[6, 6, 0, 0]}
                            name="Leads"
                          >
                            {leadsPipelineStats.map((entry, index) => (
                              <Cell key={`pipe-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Course Pricing Ladder & Fee Analytics */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign size={18} className="text-blue-700" />
                      <span>Course Pricing & Fee Structure</span>
                    </CardTitle>
                    <CardDescription>
                      Standard tuition fees (BDT) across active academy courses
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentTab("courses")}
                    className="text-xs"
                  >
                    Manage Course Fees
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={pricingComparisonStats}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                        />
                        <XAxis
                          dataKey="title"
                          stroke="#94a3b8"
                          fontSize={11}
                          tickLine={false}
                        />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip
                          formatter={(value) => [
                            `৳${value.toLocaleString()}`,
                            "Tuition Fee",
                          ]}
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            borderColor: "#e2e8f0",
                            borderRadius: 10,
                            color: "#0f172a",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                          cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
                        />
                        <Bar
                          dataKey="price"
                          radius={[6, 6, 0, 0]}
                          name="Tuition Fee"
                        >
                          {pricingComparisonStats.map((entry, index) => (
                            <Cell key={`price-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Student Inquiries Quick Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Student Inquiries</CardTitle>
                    <CardDescription>
                      Connect directly via WhatsApp with prospective learners
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddLeadModalOpen(true)}
                      className="gap-1.5"
                    >
                      <Plus size={14} />
                      <span>Add Inquiry</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setCurrentTab("leads")}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      View CRM ({leads.length})
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3.5">Student</th>
                          <th className="px-6 py-3.5">Course</th>
                          <th className="px-6 py-3.5">Status</th>
                          <th className="px-6 py-3.5 text-right">
                            Quick Contact
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {leads.slice(0, 5).map((l) => (
                          <tr
                            key={l.id}
                            className="hover:bg-blue-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900">
                                {l.full_name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {l.phone}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-700">
                              {l.course_name || "General Inquiry"}
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                variant={
                                  l.status === "enrolled"
                                    ? "success"
                                    : l.status === "contacted"
                                      ? "cyan"
                                      : l.status === "closed"
                                        ? "secondary"
                                        : "warning"
                                }
                              >
                                {l.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <a
                                href={`https://wa.me/${(l.phone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                  `Hello ${l.full_name}, thank you for contacting Onushilon Academy. How can we assist you with ${l.course_name || "our courses"}?`,
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-slate-900 border border-blue-200 text-xs font-bold transition-all shadow-sm"
                              >
                                <Send size={12} />
                                <span>WhatsApp</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                        {leads.length === 0 && (
                          <tr>
                            <td
                              colSpan={4}
                              className="text-center py-10 text-slate-500 text-sm"
                            >
                              <div className="flex flex-col items-center gap-2">
                                <Users size={28} className="text-slate-400" />
                                <div>No student inquiries logged yet.</div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setIsAddLeadModalOpen(true)}
                                  className="mt-2 text-xs"
                                >
                                  Log Test Inquiry
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===================================================================
              TAB 2: COURSES & PRICING MANAGEMENT
             =================================================================== */}
          {currentTab === "courses" && (
            <div className="space-y-6">
              {/* Filter / Search Bar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-3 text-slate-500"
                  />
                  <Input
                    type="text"
                    placeholder="Search courses or mentors..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRefresh("courses")}
                    disabled={refreshing}
                    title="Refresh courses directly from live database (bypasses cache)"
                    className="gap-1.5 border-slate-200 hover:bg-blue-50 text-blue-700 text-xs font-semibold shrink-0"
                  >
                    <RefreshCw
                      size={14}
                      className={
                        refreshing ? "animate-spin text-blue-700" : ""
                      }
                    />
                    <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                  </Button>

                  <select
                    value={courseCategoryFilter}
                    onChange={(e) => setCourseCategoryFilter(e.target.value)}
                    className="bg-white border border-slate-200 text-xs text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">
                      All Categories ({courses.length})
                    </option>
                    <option value="Robotics & Tech">Robotics & Tech</option>
                    <option value="Arts & Sports">Arts & Sports</option>
                    <option value="Academic">Academic</option>
                    <option value="Language">Language</option>
                    <option value="Skills">Skills</option>
                  </select>

                  <Button
                    size="sm"
                    onClick={openNewCourseModal}
                    className="gap-1.5 shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md "
                  >
                    <Plus size={16} />
                    <span>Create Course</span>
                  </Button>
                </div>
              </div>

              {/* Course Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((c) => (
                  <Card
                    key={c.id}
                    className="overflow-hidden flex flex-col hover:border-blue-300 transition-all group"
                  >
                    <div className="h-44 relative bg-slate-100 overflow-hidden">
                      <img
                        src={cacheBustUrl(c.image_url || DEFAULT_COURSE_IMG)}
                        alt={c.title_en}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_COURSE_IMG;
                        }}
                      />
                      <Badge
                        variant="outline"
                        className="absolute top-3 left-3 bg-slate-900/50 backdrop-blur-md border-slate-300"
                      >
                        {c.category_en}
                      </Badge>
                      <button
                        onClick={(e) => toggleCourseStatus(c, e)}
                        className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all shadow-md ${
                          c.is_active
                            ? "bg-blue-600 text-white "
                            : "bg-slate-200 text-slate-500 border border-slate-300"
                        }`}
                        title="Click to toggle Active/Draft"
                      >
                        {c.is_active ? "● Active" : "○ Draft"}
                      </button>
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {c.title_en}
                      </h3>
                      <div className="text-xs text-slate-500 mt-1 mb-3">
                        {c.title_bn}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="px-2 py-0.5 rounded-md text-xs bg-slate-50 text-slate-700 border border-slate-200">
                          ⏱ {c.duration_en}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-xs bg-slate-50 text-slate-700 border border-slate-200">
                          🎯 {c.level_en}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-xs bg-slate-50 text-slate-700 border border-slate-200">
                          👥 {c.seats_en}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 mb-4">
                        <strong className="text-slate-700">Mentor:</strong>{" "}
                        {c.mentor_name}
                      </div>

                      <div className="flex items-baseline gap-2 mt-auto pt-3 border-t border-slate-200">
                        <span className="text-2xl font-black text-blue-700">
                          {c.price}
                        </span>
                        {c.discount_price && (
                          <span className="text-xs text-slate-500 line-through">
                            {c.discount_price}
                          </span>
                        )}
                        <span className="ml-auto text-xs text-slate-500">
                          {c.schedule_en}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-4 pt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openEditCourseModal(c)}
                          className="flex-1 gap-1.5 border border-blue-200 text-blue-700 hover:text-slate-900 hover:bg-blue-700 hover:font-bold"
                        >
                          <Edit size={14} />
                          <span>Edit & Save Fee</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => promptDeleteCourse(c)}
                          title="Delete course"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB 3: SITE SECTIONS & TEXTS (WITH ADD/DELETE FOR TESTIMONIALS & FAQS)
             =================================================================== */}
          {currentTab === "sections" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <TabsList className="flex-wrap">
                  {[
                    { id: "hero", label: "Hero Banner" },
                    { id: "story", label: "Our Story & Timeline" },
                    { id: "why", label: "Why Us & Stats" },
                    { id: "practice", label: "Practice Arena" },
                    { id: "marquee", label: "Running Marquee" },
                    { id: "voices", label: "Student Voices" },
                    { id: "faq", label: "FAQs" },
                    { id: "cta", label: "CTA Banner" },
                  ].map((sec) => (
                    <TabsTrigger
                      key={sec.id}
                      active={activeSectionKey === sec.id}
                      onClick={() => setActiveSectionKey(sec.id)}
                    >
                      {sec.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setBackupModalOpen(true)}
                    title="Export all texts or paste backup to restore lost data"
                    className="gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300 text-blue-700 text-xs font-bold shadow-sm"
                  >
                    <FileText size={14} className="text-blue-600" />
                    <span>Export / Restore Texts</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRefresh("sections")}
                    disabled={refreshing}
                    title="Refresh sections and texts directly from live database"
                    className="gap-1.5 border-slate-200 hover:bg-blue-50 text-blue-700 text-xs font-semibold shrink-0"
                  >
                    <RefreshCw
                      size={14}
                      className={
                        refreshing ? "animate-spin text-blue-700" : ""
                      }
                    />
                    <span>
                      {refreshing ? "Refreshing..." : "Refresh Sections"}
                    </span>
                  </Button>
                </div>
              </div>

              {/* HERO SECTION EDITOR & LIVE PREVIEW */}
              {activeSectionKey === "hero" && (() => {
                const heroData = sections.hero || {};
                const dataEn = heroData.data_en || {};
                const dataBn = heroData.data_bn || {};

                const activeEditData = heroEditLang === "en" ? dataEn : dataBn;
                const activeHeadlineScale = Number(activeEditData.headline_scale) || 100;
                const activeSubtitleScale = Number(activeEditData.subtitle_scale) || 100;

                const previewData = heroPreviewLang === "en" ? dataEn : dataBn;
                const previewHeadlineScale = Number(previewData.headline_scale) || 100;
                const previewSubtitleScale = Number(previewData.subtitle_scale) || 100;

                const getWordsList = (val, defaultList) => {
                  if (Array.isArray(val) && val.length > 0) return val;
                  if (typeof val === "string" && val.trim()) {
                    return val.split(/[,\n]/).map((w) => w.trim()).filter(Boolean);
                  }
                  return defaultList;
                };

                const previewWords = getWordsList(
                  previewData.headline_words,
                  heroPreviewLang === "en"
                    ? ["Learn", "by", "practice."]
                    : ["চর্চায়", "শিখি,", "অনুশীলনে।"]
                );

                const updateHeroScale = (lang, field, value) => {
                  const targetLang = lang === "en" ? "data_en" : "data_bn";
                  setSections((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      [targetLang]: {
                        ...prev.hero?.[targetLang],
                        [field]: Number(value),
                      },
                    },
                  }));
                };

                const updateHeroField = (lang, field, value) => {
                  const targetLang = lang === "en" ? "data_en" : "data_bn";
                  setSections((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      [targetLang]: {
                        ...prev.hero?.[targetLang],
                        [field]: value,
                      },
                    },
                  }));
                };

                const handleSaveHero = () => {
                  const payload = {
                    ...heroData,
                    section_id: "hero",
                    name: "Hero Section",
                    data_en: {
                      ...dataEn,
                      headline_words: getWordsList(dataEn.headline_words, ["Learn", "by", "practice."]),
                      headline_scale: Number(dataEn.headline_scale) || 100,
                      subtitle_scale: Number(dataEn.subtitle_scale) || 100,
                      subtitle: dataEn.subtitle || "",
                      primary_cta_text: dataEn.primary_cta_text || "Browse courses",
                      secondary_cta_text: dataEn.secondary_cta_text || "Explore class moments",
                      call_now_text: dataEn.call_now_text || "📞 Call now",
                    },
                    data_bn: {
                      ...dataBn,
                      headline_words: getWordsList(dataBn.headline_words, ["চর্চায়", "শিখি,", "অনুশীলনে।"]),
                      headline_scale: Number(dataBn.headline_scale) || 100,
                      subtitle_scale: Number(dataBn.subtitle_scale) || 100,
                      subtitle: dataBn.subtitle || "",
                      primary_cta_text: dataBn.primary_cta_text || "কোর্সসমূহ দেখুন",
                      secondary_cta_text: dataBn.secondary_cta_text || "ক্লাসের মুহূর্ত দেখুন",
                      call_now_text: dataBn.call_now_text || "📞 কল করুন",
                    },
                  };
                  handleSaveSection("hero", payload);
                };

                const headlinePresets = [
                  { label: "Compact", scale: 80 },
                  { label: "Normal", scale: 100 },
                  { label: "Large", scale: 115 },
                  { label: "Huge", scale: 130 },
                ];

                const subtitlePresets = [
                  { label: "Compact", scale: 85 },
                  { label: "Normal", scale: 100 },
                  { label: "Large", scale: 120 },
                ];

                // Responsive preview rem calculation
                const isMobilePreview = heroPreviewDevice === "mobile";
                const previewHeadlineRem = (isMobilePreview ? 1.55 : 2.45) * (previewHeadlineScale / 100);
                const previewSubtitleRem = (isMobilePreview ? 0.76 : 0.92) * (previewSubtitleScale / 100);

                return (
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    {/* LEFT: HERO CONFIGURATION CONTROLS */}
                    <div className="xl:col-span-7 space-y-6">
                      <Card className="shadow-sm border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Type size={19} className="text-blue-600" />
                              <span>Hero Section Typography & Content</span>
                            </CardTitle>
                            <CardDescription>
                              Configure rotating headline words, subtitles, text sizes, and action buttons.
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenSectionRawText("hero", "Hero Banner")}
                              className="gap-1.5 text-xs font-semibold"
                            >
                              <Copy size={13} />
                              <span className="hidden sm:inline">Export / Paste Text</span>
                              <span className="sm:hidden">Text</span>
                            </Button>
                            <Button
                              onClick={handleSaveHero}
                              disabled={savingKey === "hero"}
                              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold shrink-0 shadow-sm"
                            >
                              <Save size={16} />
                              <span>{savingKey === "hero" ? "Saving..." : "Save Hero"}</span>
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-5">
                          {/* Language Sub-Tabs */}
                          <div>
                            <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2 block">
                              Select Language to Configure:
                            </Label>
                            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                              <button
                                type="button"
                                onClick={() => {
                                  setHeroEditLang("en");
                                  setHeroPreviewLang("en");
                                }}
                                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                  heroEditLang === "en"
                                    ? "bg-white text-blue-700 shadow-sm border border-slate-200/80"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                              >
                                <span>🇬🇧 English (EN)</span>
                                <Badge variant="outline" className="text-[10px] py-0 px-1.5 ml-1 border-blue-200 bg-blue-50/50">
                                  {Number(dataEn.headline_scale) || 100}%
                                </Badge>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setHeroEditLang("bn");
                                  setHeroPreviewLang("bn");
                                }}
                                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                  heroEditLang === "bn"
                                    ? "bg-white text-blue-700 shadow-sm border border-slate-200/80"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                              >
                                <span>🇧🇩 বাংলা (BN)</span>
                                <Badge variant="outline" className="text-[10px] py-0 px-1.5 ml-1 border-blue-200 bg-blue-50/50">
                                  {Number(dataBn.headline_scale) || 100}%
                                </Badge>
                              </button>
                            </div>
                          </div>

                          {/* 1. HEADLINE WORDS */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="font-semibold text-slate-900">
                                Headline Words ({heroEditLang.toUpperCase()}, comma-separated)
                              </Label>
                              <span className="text-[11px] text-slate-500 font-medium">
                                Last word gets gradient highlight
                              </span>
                            </div>
                            <Input
                              type="text"
                              placeholder={heroEditLang === "en" ? "Learn, by, practice." : "চর্চায়, শিখি,, অনুশীলনে।"}
                              value={
                                Array.isArray(activeEditData.headline_words)
                                  ? activeEditData.headline_words.join(", ")
                                  : (activeEditData.headline_words || "")
                              }
                              onChange={(e) =>
                                updateHeroField(heroEditLang, "headline_words", e.target.value)
                              }
                              className="font-medium"
                            />
                            <p className="text-[11px] text-slate-500 leading-normal">
                              Each word appears with a smooth reveal animation. The final word is rendered in our terracotta brand gradient.
                            </p>
                          </div>

                          {/* 2. HEADLINE FONT SIZE CONTROLS */}
                          <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/90 space-y-3.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Type size={16} className="text-blue-600" />
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                  Headline Text Size ({heroEditLang.toUpperCase()})
                                </span>
                                <Badge className="bg-blue-600 text-white font-black text-xs px-2 py-0.5">
                                  {activeHeadlineScale}%
                                </Badge>
                              </div>
                              <button
                                type="button"
                                onClick={() => updateHeroScale(heroEditLang, "headline_scale", 100)}
                                className="text-xs text-slate-500 hover:text-blue-700 flex items-center gap-1 font-semibold transition-colors"
                                title="Reset headline size to standard default"
                              >
                                <RotateCcw size={12} />
                                <span>Reset (100%)</span>
                              </button>
                            </div>

                            {/* Presets */}
                            <div>
                              <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                                Quick Size Presets:
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                {headlinePresets.map((preset) => {
                                  const isActive = activeHeadlineScale === preset.scale;
                                  return (
                                    <button
                                      key={preset.scale}
                                      type="button"
                                      onClick={() => updateHeroScale(heroEditLang, "headline_scale", preset.scale)}
                                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                                        isActive
                                          ? "bg-blue-600 text-white shadow-xs"
                                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                                      }`}
                                    >
                                      {preset.label} ({preset.scale}%)
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Fine-Tuning Slider */}
                            <div className="space-y-1.5 pt-1">
                              <div className="flex justify-between text-[11px] font-medium text-slate-500">
                                <span>Compact (70%)</span>
                                <span className="font-semibold text-blue-700">Slide to fine-tune</span>
                                <span>Massive (150%)</span>
                              </div>
                              <input
                                type="range"
                                min="70"
                                max="150"
                                step="1"
                                value={activeHeadlineScale}
                                onChange={(e) => updateHeroScale(heroEditLang, "headline_scale", e.target.value)}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                              />
                            </div>
                          </div>

                          {/* 3. HERO SUBTITLE */}
                          <div className="space-y-2">
                            <Label className="font-semibold text-slate-900">
                              Hero Subtitle ({heroEditLang.toUpperCase()})
                            </Label>
                            <Textarea
                              rows={3}
                              placeholder="Introductory mission statement under headline..."
                              value={activeEditData.subtitle || ""}
                              onChange={(e) =>
                                updateHeroField(heroEditLang, "subtitle", e.target.value)
                              }
                            />
                          </div>

                          {/* 4. SUBTITLE FONT SIZE CONTROLS */}
                          <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/90 space-y-3.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Sliders size={16} className="text-blue-600" />
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                  Subtitle Text Size ({heroEditLang.toUpperCase()})
                                </span>
                                <Badge className="bg-blue-600 text-white font-black text-xs px-2 py-0.5">
                                  {activeSubtitleScale}%
                                </Badge>
                              </div>
                              <button
                                type="button"
                                onClick={() => updateHeroScale(heroEditLang, "subtitle_scale", 100)}
                                className="text-xs text-slate-500 hover:text-blue-700 flex items-center gap-1 font-semibold transition-colors"
                                title="Reset subtitle size to standard default"
                              >
                                <RotateCcw size={12} />
                                <span>Reset (100%)</span>
                              </button>
                            </div>

                            {/* Presets */}
                            <div>
                              <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                                Quick Size Presets:
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                {subtitlePresets.map((preset) => {
                                  const isActive = activeSubtitleScale === preset.scale;
                                  return (
                                    <button
                                      key={preset.scale}
                                      type="button"
                                      onClick={() => updateHeroScale(heroEditLang, "subtitle_scale", preset.scale)}
                                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                                        isActive
                                          ? "bg-blue-600 text-white shadow-xs"
                                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                                      }`}
                                    >
                                      {preset.label} ({preset.scale}%)
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Fine-Tuning Slider */}
                            <div className="space-y-1.5 pt-1">
                              <div className="flex justify-between text-[11px] font-medium text-slate-500">
                                <span>Compact (70%)</span>
                                <span className="font-semibold text-blue-700">Slide to fine-tune</span>
                                <span>Prominent (150%)</span>
                              </div>
                              <input
                                type="range"
                                min="70"
                                max="150"
                                step="1"
                                value={activeSubtitleScale}
                                onChange={(e) => updateHeroScale(heroEditLang, "subtitle_scale", e.target.value)}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                              />
                            </div>
                          </div>

                          {/* 5. CALL TO ACTION BUTTONS */}
                          <div className="pt-2 border-t border-slate-200 space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                              Hero Call-To-Action (CTA) Buttons ({heroEditLang.toUpperCase()})
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <span className="text-[11px] font-medium text-slate-500 block mb-1">
                                  Primary Button Text
                                </span>
                                <Input
                                  type="text"
                                  value={activeEditData.primary_cta_text || (heroEditLang === "en" ? "Browse courses" : "কোর্সসমূহ দেখুন")}
                                  onChange={(e) => updateHeroField(heroEditLang, "primary_cta_text", e.target.value)}
                                />
                              </div>
                              <div>
                                <span className="text-[11px] font-medium text-slate-500 block mb-1">
                                  Secondary Button Text
                                </span>
                                <Input
                                  type="text"
                                  value={activeEditData.secondary_cta_text || (heroEditLang === "en" ? "Explore class moments" : "ক্লাসের মুহূর্ত দেখুন")}
                                  onChange={(e) => updateHeroField(heroEditLang, "secondary_cta_text", e.target.value)}
                                />
                              </div>
                              <div>
                                <span className="text-[11px] font-medium text-slate-500 block mb-1">
                                  Call Now Button Text
                                </span>
                                <Input
                                  type="text"
                                  value={activeEditData.call_now_text || (heroEditLang === "en" ? "📞 Call now" : "📞 কল করুন")}
                                  onChange={(e) => updateHeroField(heroEditLang, "call_now_text", e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="justify-end pt-4 border-t border-slate-100">
                          <Button
                            onClick={handleSaveHero}
                            disabled={savingKey === "hero"}
                            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                          >
                            <Save size={16} />
                            <span>{savingKey === "hero" ? "Saving Changes..." : "Save Hero Section"}</span>
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>

                    {/* RIGHT: INTERACTIVE LIVE PREVIEW PANEL */}
                    <div className="xl:col-span-5 sticky top-6 space-y-4">
                      <Card className="shadow-md border-slate-200 overflow-hidden">
                        <CardHeader className="pb-3 border-b border-slate-100 bg-white">
                          <div className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Eye size={17} className="text-blue-600" />
                                <span className="font-bold text-slate-900 text-sm">Live Hero Preview</span>
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Live Sync
                                </span>
                              </div>

                              {/* Viewport device switcher */}
                              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                                <button
                                  type="button"
                                  onClick={() => setHeroPreviewDevice("desktop")}
                                  className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold transition-all ${
                                    heroPreviewDevice === "desktop"
                                      ? "bg-white text-blue-700 shadow-xs"
                                      : "text-slate-600 hover:text-slate-900"
                                  }`}
                                  title="Desktop Viewport"
                                >
                                  <Monitor size={13} />
                                  <span>Desktop</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setHeroPreviewDevice("mobile")}
                                  className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold transition-all ${
                                    heroPreviewDevice === "mobile"
                                      ? "bg-white text-blue-700 shadow-xs"
                                      : "text-slate-600 hover:text-slate-900"
                                  }`}
                                  title="Mobile Viewport"
                                >
                                  <Smartphone size={13} />
                                  <span>Mobile</span>
                                </button>
                              </div>
                            </div>

                            {/* Preview Language Switcher */}
                            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                              <span className="text-slate-500 font-medium">Previewing:</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setHeroPreviewLang("en")}
                                  className={`px-2 py-0.5 rounded font-bold transition-all text-xs ${
                                    heroPreviewLang === "en"
                                      ? "bg-blue-600 text-white shadow-xs"
                                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                  }`}
                                >
                                  🇬🇧 English
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setHeroPreviewLang("bn")}
                                  className={`px-2 py-0.5 rounded font-bold transition-all text-xs ${
                                    heroPreviewLang === "bn"
                                      ? "bg-blue-600 text-white shadow-xs"
                                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                  }`}
                                >
                                  🇧🇩 বাংলা
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="p-4 bg-slate-100/70">
                          {/* FRAME WRAPPER */}
                          <div
                            className={`mx-auto transition-all duration-300 ${
                              isMobilePreview
                                ? "max-w-[310px] rounded-[30px] border-4 border-slate-800 shadow-2xl overflow-hidden bg-[#faf8f5]"
                                : "w-full rounded-2xl border border-slate-200 shadow-md overflow-hidden bg-[#faf8f5]"
                            }`}
                          >
                            {/* Device Chrome */}
                            {isMobilePreview ? (
                              <div className="h-4 bg-slate-800 flex items-center justify-center gap-1.5">
                                <span className="w-10 h-1 rounded-full bg-slate-600" />
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                              </div>
                            ) : (
                              <div className="px-3 py-1.5 bg-slate-100/90 border-b border-slate-200/80 flex items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                </div>
                                <div className="flex-1 text-center">
                                  <span className="px-3 py-0.5 bg-white rounded-full text-[10px] text-slate-500 border border-slate-200 font-mono">
                                    onushilon.com
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* CANVAS */}
                            <div
                              className="p-5 text-center flex flex-col items-center justify-center min-h-[360px]"
                              style={{
                                background: "radial-gradient(ellipse 95% 70% at 50% 12%, #faf8f5 0%, #f4f3ee 60%, #ede8de 100%)",
                              }}
                            >
                              {/* Status Pill */}
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 shadow-xs text-[10px] font-bold text-slate-800 mb-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>
                                  {heroPreviewLang === "en"
                                    ? "Admitting for Next Cohort • Limited Seats"
                                    : "পরবর্তী ব্যাচে ভর্তি চলছে • সীমিত আসন"}
                                </span>
                              </div>

                              {/* HEADLINE */}
                              <h1
                                style={{
                                  fontSize: `${previewHeadlineRem.toFixed(2)}rem`,
                                  fontWeight: 800,
                                  lineHeight: 1.14,
                                  letterSpacing: "-0.035em",
                                  color: "#0f2a43",
                                  margin: "6px 0 10px",
                                }}
                              >
                                {previewWords.map((word, idx) => {
                                  const isLast = idx === previewWords.length - 1;
                                  return (
                                    <span key={`${word}-${idx}`} className="block">
                                      {isLast ? (
                                        <em
                                          style={{
                                            fontStyle: "normal",
                                            color: "#c96442",
                                            background: "linear-gradient(135deg, #d97757 0%, #b85430 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                          }}
                                        >
                                          {word}
                                        </em>
                                      ) : (
                                        word
                                      )}
                                    </span>
                                  );
                                })}
                              </h1>

                              {/* SUBTITLE */}
                              <p
                                style={{
                                  fontSize: `${previewSubtitleRem.toFixed(2)}rem`,
                                  lineHeight: 1.55,
                                  color: "#334454",
                                  opacity: 0.92,
                                  maxWidth: "42ch",
                                  margin: "10px auto 18px",
                                }}
                              >
                                {previewData.subtitle ||
                                  (heroPreviewLang === "en"
                                    ? "Onushilon Academy gives you expert mentors, live interactive classes and daily exercises, from SSC to job-ready tech skills."
                                    : "অনলাইন ও অফলাইনে অভিজ্ঞ মেন্টরদের নিবিড় দিকনির্দেশনা, সরাসরি ইন্টারঅ্যাক্টিভ ক্লাস এবং প্রতিদিনের অনুশীলনের মাধ্যমে নিজেকে গড়ে তুলুন।")}
                              </p>

                              {/* CTA BUTTONS */}
                              <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
                                <span className="bg-[#0f2a43] text-white font-semibold text-[11px] px-3.5 py-1.5 rounded-full shadow-xs">
                                  {previewData.primary_cta_text || (heroPreviewLang === "en" ? "Browse courses" : "কোর্সসমূহ দেখুন")}
                                </span>
                                <span className="bg-white/80 border border-slate-300 text-slate-800 font-medium text-[11px] px-3 py-1.5 rounded-full">
                                  {previewData.secondary_cta_text || (heroPreviewLang === "en" ? "Explore class moments" : "ক্লাসের মুহূর্ত দেখুন")}
                                </span>
                                <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold text-[11px] px-3 py-1.5 rounded-full">
                                  {previewData.call_now_text || (heroPreviewLang === "en" ? "📞 Call now" : "📞 কল করুন")}
                                </span>
                              </div>

                              {/* Mini floating card stream indicators */}
                              <div className="mt-5 pt-3 border-t border-slate-300/40 w-full flex items-center justify-center gap-1.5 text-[9px] text-slate-500 font-semibold">
                                <span className="px-2 py-0.5 rounded-md bg-white/70 border border-slate-200">🤖 Robotics Lab</span>
                                <span className="px-2 py-0.5 rounded-md bg-white/70 border border-slate-200">🎨 Art Studio</span>
                                <span className="px-2 py-0.5 rounded-md bg-white/70 border border-slate-200">📚 Smart Class</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="py-2.5 px-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Sparkles size={13} className="text-amber-500" />
                            <span>Preview updates synchronously</span>
                          </span>
                          <span className="font-bold text-blue-700">
                            {heroPreviewLang.toUpperCase()} • H: {previewHeadlineScale}% • Sub: {previewSubtitleScale}%
                          </span>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                );
              })()}

              {/* STORY SECTION EDITOR */}
              {activeSectionKey === "story" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Our Story & Timeline</CardTitle>
                      <CardDescription>
                        Academy founding history, philosophy, and monthly/yearly growth milestones
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleOpenSectionRawText(
                            "story",
                            "Our Story & Timeline"
                          )
                        }
                        className="gap-1.5 text-xs font-semibold"
                      >
                        <Copy size={13} />
                        <span className="hidden sm:inline">Export / Paste Text</span>
                        <span className="sm:hidden">Text</span>
                      </Button>
                      <Button
                        onClick={() => handleSaveSection("story", sections.story)}
                        disabled={savingKey === "story"}
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                      >
                        <Save size={16} />
                        <span>
                          {savingKey === "story"
                            ? "Saving..."
                            : "Save Story Section"}
                        </span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Headings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label>Heading (EN)</Label>
                        <Input
                          type="text"
                          value={sections.story?.data_en?.heading || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              story: {
                                ...prev.story,
                                data_en: {
                                  ...prev.story?.data_en,
                                  heading: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Heading (BN)</Label>
                        <Input
                          type="text"
                          value={sections.story?.data_bn?.heading || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              story: {
                                ...prev.story,
                                data_bn: {
                                  ...prev.story?.data_bn,
                                  heading: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Leads */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label>Lead Text (EN)</Label>
                        <Textarea
                          rows={3}
                          value={sections.story?.data_en?.lead || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              story: {
                                ...prev.story,
                                data_en: {
                                  ...prev.story?.data_en,
                                  lead: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Lead Text (BN)</Label>
                        <Textarea
                          rows={3}
                          value={sections.story?.data_bn?.lead || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              story: {
                                ...prev.story,
                                data_bn: {
                                  ...prev.story?.data_bn,
                                  lead: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Story Photos */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                      <div className="flex items-center gap-2">
                        <ImageIcon size={18} className="text-blue-600" />
                        <h4 className="text-sm font-bold text-slate-900">Story Section Photos</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label>Primary Classroom Photo URL</Label>
                          <Input
                            type="text"
                            value={sections.story?.media?.image_story || ""}
                            onChange={(e) =>
                              setSections((prev) => ({
                                ...prev,
                                story: {
                                  ...prev.story,
                                  media: {
                                    ...prev.story?.media,
                                    image_story: e.target.value,
                                  },
                                },
                              }))
                            }
                            placeholder="https://... or /uploads/..."
                          />
                          {sections.story?.media?.image_story && (
                            <img
                              src={resolveMediaUrl(sections.story.media.image_story, BACKEND_ORIGIN)}
                              alt="Story Preview 1"
                              className="h-24 w-auto rounded-lg object-cover border border-slate-200 shadow-sm"
                            />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Secondary Campus Photo URL</Label>
                          <Input
                            type="text"
                            value={sections.story?.media?.image_story2 || ""}
                            onChange={(e) =>
                              setSections((prev) => ({
                                ...prev,
                                story: {
                                  ...prev.story,
                                  media: {
                                    ...prev.story?.media,
                                    image_story2: e.target.value,
                                  },
                                },
                              }))
                            }
                            placeholder="https://... or /uploads/..."
                          />
                          {sections.story?.media?.image_story2 && (
                            <img
                              src={resolveMediaUrl(sections.story.media.image_story2, BACKEND_ORIGIN)}
                              alt="Story Preview 2"
                              className="h-24 w-auto rounded-lg object-cover border border-slate-200 shadow-sm"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Timeline Milestones Section */}
                    <div className="space-y-4 pt-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                        <div>
                          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Clock size={18} className="text-blue-600" />
                            <span>Timeline Milestones ({((sections.story?.data_en?.timeline) || []).length})</span>
                          </h4>
                          <p className="text-xs text-slate-500">
                            Create milestones on a monthly or yearly basis with English and Bengali translations.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddStoryMilestone("yearly")}
                            className="gap-1.5 border-amber-300 bg-amber-50/60 hover:bg-amber-100/70 text-amber-900 text-xs font-semibold"
                          >
                            <Plus size={13} />
                            <span>+ Add Yearly Milestone</span>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddStoryMilestone("monthly")}
                            className="gap-1.5 border-blue-300 bg-blue-50/60 hover:bg-blue-100/70 text-blue-900 text-xs font-semibold"
                          >
                            <Plus size={13} />
                            <span>+ Add Monthly Milestone</span>
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {(sections.story?.data_en?.timeline || []).map((item, idx) => {
                          const isMonthly = item.basis === "monthly";
                          const total = (sections.story?.data_en?.timeline || []).length;
                          const bnItem = sections.story?.data_bn?.timeline?.[idx] || {};

                          return (
                            <div
                              key={idx}
                              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative transition-shadow hover:shadow-sm"
                            >
                              {/* Top Bar with Badge, Basis Toggle, and Controls */}
                              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                                <div className="flex items-center gap-2.5">
                                  <span className="text-xs font-extrabold text-slate-700">
                                    Milestone #{idx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleStoryMilestoneChange(
                                        idx,
                                        "basis",
                                        isMonthly ? "yearly" : "monthly"
                                      )
                                    }
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
                                      isMonthly
                                        ? "bg-blue-100 text-blue-800 border-blue-300 shadow-xs"
                                        : "bg-amber-100 text-amber-900 border-amber-300 shadow-xs"
                                    }`}
                                    title="Click to toggle between Monthly and Yearly basis"
                                  >
                                    <span className={`w-2 h-2 rounded-full ${isMonthly ? "bg-blue-600" : "bg-amber-600"}`} />
                                    <span>{isMonthly ? "Monthly Milestone" : "Yearly Milestone"}</span>
                                    <span className="text-[10px] opacity-70 underline ml-0.5">(click to switch)</span>
                                  </button>
                                </div>

                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveStoryMilestone(idx, -1)}
                                    disabled={idx === 0}
                                    className="h-7 w-7 rounded-lg"
                                    title="Move Up"
                                  >
                                    <ArrowUp size={13} />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveStoryMilestone(idx, 1)}
                                    disabled={idx === total - 1}
                                    className="h-7 w-7 rounded-lg"
                                    title="Move Down"
                                  >
                                    <ArrowDown size={13} />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDeleteStoryMilestone(idx)}
                                    className="h-7 w-7 rounded-lg ml-1"
                                    title="Delete Milestone"
                                  >
                                    <Trash2 size={13} />
                                  </Button>
                                </div>
                              </div>

                              {/* Inputs: Period / Year */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs">
                                    {isMonthly ? "Period / Month (EN) e.g. Nov 2023" : "Year (EN) e.g. 2014"}
                                  </Label>
                                  <Input
                                    type="text"
                                    value={item.year_en || item.year || ""}
                                    onChange={(e) =>
                                      handleStoryMilestoneChange(idx, "year_en", e.target.value)
                                    }
                                    placeholder={isMonthly ? "Nov 2023" : "2014"}
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">
                                    {isMonthly ? "Period / Month (BN) যেমন: নভেম্বর ২০২৩" : "Year (BN) যেমন: ২০১৪"}
                                  </Label>
                                  <Input
                                    type="text"
                                    value={bnItem.year_bn || item.year_bn || ""}
                                    onChange={(e) =>
                                      handleStoryMilestoneChange(idx, "year_bn", e.target.value)
                                    }
                                    placeholder={isMonthly ? "নভেম্বর ২০২৩" : "২০১৪"}
                                  />
                                </div>
                              </div>

                              {/* Inputs: Description */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs">Milestone Description (EN)</Label>
                                  <Textarea
                                    rows={2}
                                    value={item.text_en || item.text || ""}
                                    onChange={(e) =>
                                      handleStoryMilestoneChange(idx, "text_en", e.target.value)
                                    }
                                    placeholder="Milestone description in English..."
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Milestone Description (BN)</Label>
                                  <Textarea
                                    rows={2}
                                    value={bnItem.text_bn || item.text_bn || ""}
                                    onChange={(e) =>
                                      handleStoryMilestoneChange(idx, "text_bn", e.target.value)
                                    }
                                    placeholder="মাইলফলকের বিস্তারিত বিবরণ বাংলায়..."
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {(sections.story?.data_en?.timeline || []).length === 0 && (
                          <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-2xl">
                            No timeline milestones yet. Click &quot;+ Add Yearly Milestone&quot; or &quot;+ Add Monthly Milestone&quot; above to create one.
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button
                      onClick={() => handleSaveSection("story", sections.story)}
                      disabled={savingKey === "story"}
                      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      <Save size={16} />
                      <span>
                        {savingKey === "story"
                          ? "Saving..."
                          : "Save Story Section"}
                      </span>
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* WHY US SECTION */}
              {activeSectionKey === "why" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Why Us & Stats Section</CardTitle>
                      <CardDescription>
                        Core value pillars, learning differentiators, and 4 animated statistics
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleOpenSectionRawText(
                            "why",
                            "Why Us & Key Metrics"
                          )
                        }
                        className="gap-1.5 text-xs font-semibold"
                      >
                        <Copy size={13} />
                        <span className="hidden sm:inline">Export / Paste Text</span>
                        <span className="sm:hidden">Text</span>
                      </Button>
                      <Button
                        onClick={() => handleSaveSection("why", sections.why)}
                        disabled={savingKey === "why"}
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                      >
                        <Save size={16} />
                        <span>
                          {savingKey === "why" ? "Saving..." : "Save Why Us"}
                        </span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Kicker */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label>Kicker Tag (EN)</Label>
                        <Input
                          type="text"
                          value={sections.why?.data_en?.kicker || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              why: {
                                ...prev.why,
                                data_en: {
                                  ...prev.why?.data_en,
                                  kicker: e.target.value,
                                },
                              },
                            }))
                          }
                          placeholder="The Onushilon Difference"
                        />
                      </div>
                      <div>
                        <Label>Kicker Tag (BN)</Label>
                        <Input
                          type="text"
                          value={sections.why?.data_bn?.kicker || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              why: {
                                ...prev.why,
                                data_bn: {
                                  ...prev.why?.data_bn,
                                  kicker: e.target.value,
                                },
                              },
                            }))
                          }
                          placeholder="অনুশীলনের অনন্য বৈশিষ্ট্য"
                        />
                      </div>
                    </div>

                    {/* Heading */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label>Heading (EN)</Label>
                        <Input
                          type="text"
                          value={sections.why?.data_en?.heading || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              why: {
                                ...prev.why,
                                data_en: {
                                  ...prev.why?.data_en,
                                  heading: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Heading (BN)</Label>
                        <Input
                          type="text"
                          value={sections.why?.data_bn?.heading || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              why: {
                                ...prev.why,
                                data_bn: {
                                  ...prev.why?.data_bn,
                                  heading: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Lead */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label>Lead Text (EN)</Label>
                        <Textarea
                          rows={2}
                          value={sections.why?.data_en?.lead || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              why: {
                                ...prev.why,
                                data_en: {
                                  ...prev.why?.data_en,
                                  lead: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Lead Text (BN)</Label>
                        <Textarea
                          rows={2}
                          value={sections.why?.data_bn?.lead || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              why: {
                                ...prev.why,
                                data_bn: {
                                  ...prev.why?.data_bn,
                                  lead: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* 4 Statistics Cards */}
                    <div className="space-y-3 pt-2">
                      <div className="border-b border-slate-200 pb-2">
                        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <BarChart2 size={18} className="text-blue-600" />
                          <span>Key Statistics & Metrics (4 Cards)</span>
                        </h4>
                        <p className="text-xs text-slate-500">
                          These 4 animated counters highlight the academy&apos;s achievement metrics.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[0, 1, 2, 3].map((idx) => {
                          const statEn = sections.why?.data_en?.stats?.[idx] || {};
                          const statBn = sections.why?.data_bn?.stats?.[idx] || {};
                          return (
                            <div
                              key={idx}
                              className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3"
                            >
                              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                <span className="text-xs font-bold text-blue-700">Metric #{idx + 1}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-[11px]">Number</Label>
                                  <Input
                                    type="number"
                                    value={statEn.count ?? ""}
                                    onChange={(e) =>
                                      handleWhyStatChange(idx, "count", Number(e.target.value))
                                    }
                                    placeholder="12000"
                                  />
                                </div>
                                <div>
                                  <Label className="text-[11px]">Suffix</Label>
                                  <Input
                                    type="text"
                                    value={statEn.suffix ?? ""}
                                    onChange={(e) =>
                                      handleWhyStatChange(idx, "suffix", e.target.value)
                                    }
                                    placeholder="+"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-[11px]">Label (EN)</Label>
                                <Input
                                  type="text"
                                  value={statEn.label_en ?? ""}
                                  onChange={(e) =>
                                    handleWhyStatChange(idx, "label_en", e.target.value)
                                  }
                                  placeholder="Active learners"
                                />
                              </div>
                              <div>
                                <Label className="text-[11px]">Label (BN)</Label>
                                <Input
                                  type="text"
                                  value={statBn.label_bn ?? statEn.label_bn ?? ""}
                                  onChange={(e) =>
                                    handleWhyStatChange(idx, "label_bn", e.target.value)
                                  }
                                  placeholder="নিয়মিত শিক্ষার্থী"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Features / Value Pillars */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div>
                          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Sparkles size={18} className="text-blue-600" />
                            <span>Features & Value Pillars ({((sections.why?.data_en?.features) || []).length})</span>
                          </h4>
                          <p className="text-xs text-slate-500">
                            Cards highlighting the academy&apos;s unique advantages and pedagogy.
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddWhyFeature}
                          className="gap-1.5"
                        >
                          <Plus size={14} />
                          <span>Add Feature</span>
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(sections.why?.data_en?.features || []).map((feat, idx) => {
                          const featBn = sections.why?.data_bn?.features?.[idx] || {};
                          return (
                            <div
                              key={idx}
                              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-blue-700">
                                  Feature #{idx + 1}
                                </span>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleDeleteWhyFeature(idx)}
                                  className="h-7 w-7 rounded-lg"
                                  title="Delete Feature"
                                >
                                  <Trash2 size={13} />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs">Title (EN)</Label>
                                  <Input
                                    type="text"
                                    value={feat.title_en || feat.title || ""}
                                    onChange={(e) =>
                                      handleWhyFeatureChange(idx, "title_en", e.target.value)
                                    }
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Title (BN)</Label>
                                  <Input
                                    type="text"
                                    value={featBn.title_bn || feat.title_bn || ""}
                                    onChange={(e) =>
                                      handleWhyFeatureChange(idx, "title_bn", e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs">Description (EN)</Label>
                                  <Textarea
                                    rows={2}
                                    value={feat.desc_en || feat.desc || ""}
                                    onChange={(e) =>
                                      handleWhyFeatureChange(idx, "desc_en", e.target.value)
                                    }
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Description (BN)</Label>
                                  <Textarea
                                    rows={2}
                                    value={featBn.desc_bn || feat.desc_bn || ""}
                                    onChange={(e) =>
                                      handleWhyFeatureChange(idx, "desc_bn", e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button
                      onClick={() => handleSaveSection("why", sections.why)}
                      disabled={savingKey === "why"}
                      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      <Save size={16} />
                      <span>
                        {savingKey === "why" ? "Saving..." : "Save Why Us"}
                      </span>
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* PRACTICE ARENA SECTION */}
              {activeSectionKey === "practice" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Interactive Practice Arena</CardTitle>
                      <CardDescription>
                        Quiz questions, subject challenges, options, and instant feedback explanations
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleOpenSectionRawText(
                            "practice",
                            "Interactive Practice Arena"
                          )
                        }
                        className="gap-1.5 text-xs font-semibold"
                      >
                        <Copy size={13} />
                        <span className="hidden sm:inline">Export / Paste Text</span>
                        <span className="sm:hidden">Text</span>
                      </Button>
                      <Button
                        onClick={() => handleSaveSection("practice", sections.practice)}
                        disabled={savingKey === "practice"}
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                      >
                        <Save size={16} />
                        <span>
                          {savingKey === "practice" ? "Saving..." : "Save Practice Arena"}
                        </span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Badge */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label>Badge Tag (EN)</Label>
                        <Input
                          type="text"
                          value={sections.practice?.data_en?.badge || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              practice: {
                                ...prev.practice,
                                data_en: {
                                  ...prev.practice?.data_en,
                                  badge: e.target.value,
                                },
                              },
                            }))
                          }
                          placeholder="Interactive Practice Quiz"
                        />
                      </div>
                      <div>
                        <Label>Badge Tag (BN)</Label>
                        <Input
                          type="text"
                          value={sections.practice?.data_bn?.badge || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              practice: {
                                ...prev.practice,
                                data_bn: {
                                  ...prev.practice?.data_bn,
                                  badge: e.target.value,
                                },
                              },
                            }))
                          }
                          placeholder="ইন্টারেক্টিভ কুইজ প্র্যাকটিস"
                        />
                      </div>
                    </div>

                    {/* Heading */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label>Heading (EN)</Label>
                        <Input
                          type="text"
                          value={sections.practice?.data_en?.heading || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              practice: {
                                ...prev.practice,
                                data_en: {
                                  ...prev.practice?.data_en,
                                  heading: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Heading (BN)</Label>
                        <Input
                          type="text"
                          value={sections.practice?.data_bn?.heading || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              practice: {
                                ...prev.practice,
                                data_bn: {
                                  ...prev.practice?.data_bn,
                                  heading: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Lead */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label>Lead Text (EN)</Label>
                        <Textarea
                          rows={2}
                          value={sections.practice?.data_en?.lead || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              practice: {
                                ...prev.practice,
                                data_en: {
                                  ...prev.practice?.data_en,
                                  lead: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Lead Text (BN)</Label>
                        <Textarea
                          rows={2}
                          value={sections.practice?.data_bn?.lead || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              practice: {
                                ...prev.practice,
                                data_bn: {
                                  ...prev.practice?.data_bn,
                                  lead: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Quiz Tasks Manager */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div>
                          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <BookOpen size={18} className="text-blue-600" />
                            <span>Practice Quiz Tasks ({((sections.practice?.data_en?.tasks) || []).length})</span>
                          </h4>
                          <p className="text-xs text-slate-500">
                            Interactive questions that learners can solve live on the homepage.
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddPracticeTask}
                          className="gap-1.5"
                        >
                          <Plus size={14} />
                          <span>Add Quiz Question</span>
                        </Button>
                      </div>

                      <div className="space-y-5">
                        {(sections.practice?.data_en?.tasks || []).map((task, idx) => {
                          const taskBn = sections.practice?.data_bn?.tasks?.[idx] || {};
                          const optionsEn = task.options_en || task.options || ["", "", "", ""];
                          const optionsBn = taskBn.options_bn || task.options_bn || ["", "", "", ""];
                          const correctIdx = Number(task.correct) || 0;

                          return (
                            <div
                              key={idx}
                              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative"
                            >
                              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                                <span className="text-xs font-bold text-blue-700">
                                  Quiz Challenge #{idx + 1}
                                </span>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleDeletePracticeTask(idx)}
                                  className="h-7 w-7 rounded-lg"
                                  title="Delete Quiz"
                                >
                                  <Trash2 size={13} />
                                </Button>
                              </div>

                              {/* Subject */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs">Subject / Category (EN)</Label>
                                  <Input
                                    type="text"
                                    value={task.subject_en || task.subject || ""}
                                    onChange={(e) =>
                                      handlePracticeTaskChange(idx, "subject_en", e.target.value)
                                    }
                                    placeholder="Physics"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Subject / Category (BN)</Label>
                                  <Input
                                    type="text"
                                    value={taskBn.subject_bn || task.subject_bn || ""}
                                    onChange={(e) =>
                                      handlePracticeTaskChange(idx, "subject_bn", e.target.value)
                                    }
                                    placeholder="পদার্থবিজ্ঞান"
                                  />
                                </div>
                              </div>

                              {/* Question */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs">Question (EN)</Label>
                                  <Textarea
                                    rows={2}
                                    value={task.question_en || task.question || ""}
                                    onChange={(e) =>
                                      handlePracticeTaskChange(idx, "question_en", e.target.value)
                                    }
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Question (BN)</Label>
                                  <Textarea
                                    rows={2}
                                    value={taskBn.question_bn || task.question_bn || ""}
                                    onChange={(e) =>
                                      handlePracticeTaskChange(idx, "question_bn", e.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              {/* 4 Options and Correct Answer Selector */}
                              <div className="space-y-3 p-4 rounded-xl bg-white border border-slate-200/70">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs font-bold text-slate-800">4 Multiple Choice Options</Label>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-600">Correct Answer:</span>
                                    <select
                                      value={correctIdx}
                                      onChange={(e) =>
                                        handlePracticeTaskChange(idx, "correct", Number(e.target.value))
                                      }
                                      className="text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-300 bg-emerald-50 text-emerald-800"
                                    >
                                      <option value={0}>Option A (1st)</option>
                                      <option value={1}>Option B (2nd)</option>
                                      <option value={2}>Option C (3rd)</option>
                                      <option value={3}>Option D (4th)</option>
                                    </select>
                                  </div>
                                </div>

                                {[0, 1, 2, 3].map((optIdx) => (
                                  <div key={optIdx} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                                    <div className="flex items-center gap-2">
                                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                                        correctIdx === optIdx
                                          ? "bg-emerald-600 text-white"
                                          : "bg-slate-200 text-slate-700"
                                      }`}>
                                        {String.fromCharCode(65 + optIdx)}
                                      </span>
                                      <Input
                                        type="text"
                                        value={optionsEn[optIdx] || ""}
                                        onChange={(e) =>
                                          handlePracticeOptionChange(idx, optIdx, "en", e.target.value)
                                        }
                                        placeholder={`Option ${String.fromCharCode(65 + optIdx)} (EN)`}
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-slate-400 font-mono">BN</span>
                                      <Input
                                        type="text"
                                        value={optionsBn[optIdx] || ""}
                                        onChange={(e) =>
                                          handlePracticeOptionChange(idx, optIdx, "bn", e.target.value)
                                        }
                                        placeholder={`অপশন ${optIdx + 1} (BN)`}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Explanation */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs">Explanation (EN)</Label>
                                  <Textarea
                                    rows={2}
                                    value={task.explanation_en || task.explanation || ""}
                                    onChange={(e) =>
                                      handlePracticeTaskChange(idx, "explanation_en", e.target.value)
                                    }
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Explanation (BN)</Label>
                                  <Textarea
                                    rows={2}
                                    value={taskBn.explanation_bn || task.explanation_bn || ""}
                                    onChange={(e) =>
                                      handlePracticeTaskChange(idx, "explanation_bn", e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button
                      onClick={() => handleSaveSection("practice", sections.practice)}
                      disabled={savingKey === "practice"}
                      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      <Save size={16} />
                      <span>
                        {savingKey === "practice" ? "Saving..." : "Save Practice Arena"}
                      </span>
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* RUNNING MARQUEE SECTION */}
              {activeSectionKey === "marquee" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Running Marquee Banner</CardTitle>
                      <CardDescription>
                        Animated ticker ribbon items displayed beneath the hero section
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddMarqueeItem}
                        className="gap-1.5"
                      >
                        <Plus size={14} />
                        <span>Add Highlight</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleOpenSectionRawText(
                            "marquee",
                            "Running Marquee Banner"
                          )
                        }
                        className="gap-1.5 text-xs font-semibold"
                      >
                        <Copy size={13} />
                        <span className="hidden sm:inline">Export / Paste Text</span>
                        <span className="sm:hidden">Text</span>
                      </Button>
                      <Button
                        onClick={() => handleSaveSection("marquee", sections.marquee)}
                        disabled={savingKey === "marquee"}
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                      >
                        <Save size={16} />
                        <span>
                          {savingKey === "marquee" ? "Saving..." : "Save Marquee"}
                        </span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(sections.marquee?.data_en?.items || []).map((item, idx) => {
                      const itemBn = sections.marquee?.data_bn?.items?.[idx] || "";
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-3"
                        >
                          <span className="text-xs font-bold text-slate-500 w-16 shrink-0">
                            #{idx + 1}
                          </span>
                          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              type="text"
                              value={item || ""}
                              onChange={(e) =>
                                handleMarqueeItemChange(idx, "en", e.target.value)
                              }
                              placeholder="Highlight in English..."
                            />
                            <Input
                              type="text"
                              value={itemBn || ""}
                              onChange={(e) =>
                                handleMarqueeItemChange(idx, "bn", e.target.value)
                              }
                              placeholder="বাংলায় হাইলাইট..."
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteMarqueeItem(idx)}
                            className="h-8 w-8 rounded-lg shrink-0"
                            title="Delete Item"
                          >
                            <Trash2 size={13} />
                          </Button>
                        </div>
                      );
                    })}
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button
                      onClick={() => handleSaveSection("marquee", sections.marquee)}
                      disabled={savingKey === "marquee"}
                      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      <Save size={16} />
                      <span>
                        {savingKey === "marquee" ? "Saving..." : "Save Marquee"}
                      </span>
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* STUDENT VOICES WITH ADD & DELETE CONTROLS */}
              {activeSectionKey === "voices" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Student Voices & Testimonials</CardTitle>
                      <CardDescription>
                        Graduate success quotes and student portraits
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddTestimonial}
                        className="gap-1.5"
                      >
                        <Plus size={14} />
                        <span>Add Testimonial</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleOpenSectionRawText(
                            "voices",
                            "Student Testimonials"
                          )
                        }
                        className="gap-1.5 text-xs font-semibold"
                      >
                        <Copy size={13} />
                        <span className="hidden sm:inline">Export / Paste Text</span>
                        <span className="sm:hidden">Text</span>
                      </Button>
                      <Button
                        onClick={() =>
                          handleSaveSection("voices", sections.voices)
                        }
                        disabled={savingKey === "voices"}
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                      >
                        <Save size={16} />
                        <span>
                          {savingKey === "voices"
                            ? "Saving..."
                            : "Save Testimonials"}
                        </span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Headings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-2">
                      <div>
                        <Label>Heading (EN)</Label>
                        <Input
                          type="text"
                          value={sections.voices?.data_en?.heading || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              voices: {
                                ...prev.voices,
                                data_en: {
                                  ...prev.voices?.data_en,
                                  heading: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Heading (BN)</Label>
                        <Input
                          type="text"
                          value={sections.voices?.data_bn?.heading || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              voices: {
                                ...prev.voices,
                                data_bn: {
                                  ...prev.voices?.data_bn,
                                  heading: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {(sections.voices?.data_en?.testimonials || []).map(
                      (t, idx) => {
                        const tBn = sections.voices?.data_bn?.testimonials?.[idx] || {};
                        return (
                          <div
                            key={idx}
                            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-blue-700">
                                Testimonial #{idx + 1}
                              </span>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteTestimonial(idx)}
                                className="h-7 w-7 rounded-lg"
                                title="Delete testimonial"
                              >
                                <Trash2 size={13} />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label className="text-xs">Student Name (EN)</Label>
                                <Input
                                  type="text"
                                  value={t.name || ""}
                                  onChange={(e) => {
                                    const newTestimonials = [
                                      ...(sections.voices?.data_en?.testimonials || []),
                                    ];
                                    newTestimonials[idx] = {
                                      ...newTestimonials[idx],
                                      name: e.target.value,
                                    };
                                    setSections((prev) => ({
                                      ...prev,
                                      voices: {
                                        ...prev.voices,
                                        data_en: {
                                          ...prev.voices?.data_en,
                                          testimonials: newTestimonials,
                                        },
                                      },
                                    }));
                                  }}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Student Name (BN)</Label>
                                <Input
                                  type="text"
                                  value={tBn.name || t.name_bn || ""}
                                  onChange={(e) => {
                                    const newTestimonialsBn = [
                                      ...(sections.voices?.data_bn?.testimonials || []),
                                    ];
                                    newTestimonialsBn[idx] = {
                                      ...newTestimonialsBn[idx],
                                      name: e.target.value,
                                    };
                                    setSections((prev) => ({
                                      ...prev,
                                      voices: {
                                        ...prev.voices,
                                        data_bn: {
                                          ...prev.voices?.data_bn,
                                          testimonials: newTestimonialsBn,
                                        },
                                      },
                                    }));
                                  }}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Student Photo URL</Label>
                                <Input
                                  type="text"
                                  value={t.image_url || t.img || ""}
                                  onChange={(e) => {
                                    const newTestimonials = [
                                      ...(sections.voices?.data_en?.testimonials || []),
                                    ];
                                    newTestimonials[idx] = {
                                      ...newTestimonials[idx],
                                      image_url: e.target.value,
                                    };
                                    setSections((prev) => ({
                                      ...prev,
                                      voices: {
                                        ...prev.voices,
                                        data_en: {
                                          ...prev.voices?.data_en,
                                          testimonials: newTestimonials,
                                        },
                                      },
                                    }));
                                  }}
                                  placeholder="https://... or /uploads/..."
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs">Batch / Course Role (EN)</Label>
                                <Input
                                  type="text"
                                  value={t.role || ""}
                                  onChange={(e) => {
                                    const newTestimonials = [
                                      ...(sections.voices?.data_en?.testimonials || []),
                                    ];
                                    newTestimonials[idx] = {
                                      ...newTestimonials[idx],
                                      role: e.target.value,
                                    };
                                    setSections((prev) => ({
                                      ...prev,
                                      voices: {
                                        ...prev.voices,
                                        data_en: {
                                          ...prev.voices?.data_en,
                                          testimonials: newTestimonials,
                                        },
                                      },
                                    }));
                                  }}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Batch / Course Role (BN)</Label>
                                <Input
                                  type="text"
                                  value={tBn.role || t.role_bn || ""}
                                  onChange={(e) => {
                                    const newTestimonialsBn = [
                                      ...(sections.voices?.data_bn?.testimonials || []),
                                    ];
                                    newTestimonialsBn[idx] = {
                                      ...newTestimonialsBn[idx],
                                      role: e.target.value,
                                    };
                                    setSections((prev) => ({
                                      ...prev,
                                      voices: {
                                        ...prev.voices,
                                        data_bn: {
                                          ...prev.voices?.data_bn,
                                          testimonials: newTestimonialsBn,
                                        },
                                      },
                                    }));
                                  }}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs">Quote (EN)</Label>
                                <Textarea
                                  rows={2}
                                  value={t.quote || ""}
                                  onChange={(e) => {
                                    const newTestimonials = [
                                      ...(sections.voices?.data_en?.testimonials || []),
                                    ];
                                    newTestimonials[idx] = {
                                      ...newTestimonials[idx],
                                      quote: e.target.value,
                                    };
                                    setSections((prev) => ({
                                      ...prev,
                                      voices: {
                                        ...prev.voices,
                                        data_en: {
                                          ...prev.voices?.data_en,
                                          testimonials: newTestimonials,
                                        },
                                      },
                                    }));
                                  }}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Quote (BN)</Label>
                                <Textarea
                                  rows={2}
                                  value={tBn.quote || t.quote_bn || ""}
                                  onChange={(e) => {
                                    const newTestimonialsBn = [
                                      ...(sections.voices?.data_bn?.testimonials || []),
                                    ];
                                    newTestimonialsBn[idx] = {
                                      ...newTestimonialsBn[idx],
                                      quote: e.target.value,
                                    };
                                    setSections((prev) => ({
                                      ...prev,
                                      voices: {
                                        ...prev.voices,
                                        data_bn: {
                                          ...prev.voices?.data_bn,
                                          testimonials: newTestimonialsBn,
                                        },
                                      },
                                    }));
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                    {(sections.voices?.data_en?.testimonials || []).length ===
                      0 && (
                      <div className="text-center py-8 text-slate-500 text-sm">
                        No testimonials added yet. Click &quot;Add
                        Testimonial&quot; above to create one.
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button
                      onClick={() =>
                        handleSaveSection("voices", sections.voices)
                      }
                      disabled={savingKey === "voices"}
                      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      <Save size={16} />
                      <span>
                        {savingKey === "voices"
                          ? "Saving..."
                          : "Save Testimonials"}
                      </span>
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* FAQ SECTION WITH BILINGUAL & REORDER CONTROLS */}
              {activeSectionKey === "faq" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Frequently Asked Questions (FAQ)</CardTitle>
                      <CardDescription>
                        Bilingual FAQs and answers for prospective students and parents
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddFaq}
                        className="gap-1.5"
                      >
                        <Plus size={14} />
                        <span>Add FAQ Item</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleOpenSectionRawText(
                            "faq",
                            "Frequently Asked Questions"
                          )
                        }
                        className="gap-1.5 text-xs font-semibold"
                      >
                        <Copy size={13} />
                        <span className="hidden sm:inline">Export / Paste Text</span>
                        <span className="sm:hidden">Text</span>
                      </Button>
                      <Button
                        onClick={() => handleSaveSection("faq", sections.faq)}
                        disabled={savingKey === "faq"}
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                      >
                        <Save size={16} />
                        <span>
                          {savingKey === "faq" ? "Saving..." : "Save FAQs"}
                        </span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Header Titles */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Section Heading & Subtitle
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Section Heading (EN)</Label>
                          <Input
                            type="text"
                            value={sections.faq?.data_en?.heading || ""}
                            onChange={(e) =>
                              setSections((prev) => ({
                                ...prev,
                                faq: {
                                  ...prev.faq,
                                  data_en: {
                                    ...prev.faq?.data_en,
                                    heading: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Section Heading (BN)</Label>
                          <Input
                            type="text"
                            value={sections.faq?.data_bn?.heading || ""}
                            onChange={(e) =>
                              setSections((prev) => ({
                                ...prev,
                                faq: {
                                  ...prev.faq,
                                  data_bn: {
                                    ...prev.faq?.data_bn,
                                    heading: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Lead Subtitle (EN)</Label>
                          <Textarea
                            rows={2}
                            value={sections.faq?.data_en?.lead || ""}
                            onChange={(e) =>
                              setSections((prev) => ({
                                ...prev,
                                faq: {
                                  ...prev.faq,
                                  data_en: {
                                    ...prev.faq?.data_en,
                                    lead: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Lead Subtitle (BN)</Label>
                          <Textarea
                            rows={2}
                            value={sections.faq?.data_bn?.lead || ""}
                            onChange={(e) =>
                              setSections((prev) => ({
                                ...prev,
                                faq: {
                                  ...prev.faq,
                                  data_bn: {
                                    ...prev.faq?.data_bn,
                                    lead: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Questions & Answers ({sections.faq?.data_en?.items?.length || 0})
                      </h4>
                      {(sections.faq?.data_en?.items || []).map((faqEn, idx) => {
                        const faqBn = sections.faq?.data_bn?.items?.[idx] || {};
                        return (
                          <div
                            key={idx}
                            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 relative"
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                                FAQ Question #{idx + 1}
                              </span>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-slate-500 hover:text-slate-900"
                                  onClick={() => handleMoveFaq(idx, "up")}
                                  disabled={idx === 0}
                                  title="Move Up"
                                >
                                  <ArrowUp size={14} />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-slate-500 hover:text-slate-900"
                                  onClick={() => handleMoveFaq(idx, "down")}
                                  disabled={
                                    idx ===
                                    (sections.faq?.data_en?.items?.length || 1) - 1
                                  }
                                  title="Move Down"
                                >
                                  <ArrowDown size={14} />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleDeleteFaq(idx)}
                                  className="h-7 w-7 rounded-lg ml-2"
                                  title="Delete FAQ"
                                >
                                  <Trash2 size={13} />
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Question (EN)</Label>
                                <Input
                                  type="text"
                                  value={faqEn.q || ""}
                                  onChange={(e) =>
                                    handleFaqItemChange(idx, "en", "q", e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <Label>Question (BN)</Label>
                                <Input
                                  type="text"
                                  value={faqBn.q || ""}
                                  onChange={(e) =>
                                    handleFaqItemChange(idx, "bn", "q", e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Answer (EN)</Label>
                                <Textarea
                                  rows={3}
                                  value={faqEn.a || ""}
                                  onChange={(e) =>
                                    handleFaqItemChange(idx, "en", "a", e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <Label>Answer (BN)</Label>
                                <Textarea
                                  rows={3}
                                  value={faqBn.a || ""}
                                  onChange={(e) =>
                                    handleFaqItemChange(idx, "bn", "a", e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {(!sections.faq?.data_en?.items ||
                        sections.faq.data_en.items.length === 0) && (
                        <div className="text-center py-6 text-sm text-slate-400">
                          No FAQ items added yet. Click &quot;Add FAQ Item&quot; above.
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddFaq}
                      className="gap-1.5"
                    >
                      <Plus size={14} />
                      <span>Add FAQ Item</span>
                    </Button>
                    <Button
                      onClick={() => handleSaveSection("faq", sections.faq)}
                      disabled={savingKey === "faq"}
                      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      <Save size={16} />
                      <span>
                        {savingKey === "faq" ? "Saving..." : "Save FAQs"}
                      </span>
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* CTA BANNER */}
              {activeSectionKey === "cta" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Call To Action Banner (Join Section)</CardTitle>
                      <CardDescription>
                        Bottom conversion trigger, seat reservation prompt, and background visual
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleOpenSectionRawText(
                            "cta",
                            "Call To Action Banner"
                          )
                        }
                        className="gap-1.5 text-xs font-semibold"
                      >
                        <Copy size={13} />
                        <span className="hidden sm:inline">Export / Paste Text</span>
                        <span className="sm:hidden">Text</span>
                      </Button>
                      <Button
                        onClick={() => handleSaveSection("cta", sections.cta)}
                        disabled={savingKey === "cta"}
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                      >
                        <Save size={16} />
                        <span>
                          {savingKey === "cta" ? "Saving..." : "Save CTA Banner"}
                        </span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Headings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label>Heading (EN)</Label>
                        <Input
                          type="text"
                          value={sections.cta?.data_en?.heading || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              cta: {
                                ...prev.cta,
                                data_en: {
                                  ...prev.cta?.data_en,
                                  heading: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Heading (BN)</Label>
                        <Input
                          type="text"
                          value={sections.cta?.data_bn?.heading || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              cta: {
                                ...prev.cta,
                                data_bn: {
                                  ...prev.cta?.data_bn,
                                  heading: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Leads */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label>Lead Subtitle (EN)</Label>
                        <Textarea
                          rows={3}
                          value={sections.cta?.data_en?.lead || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              cta: {
                                ...prev.cta,
                                data_en: {
                                  ...prev.cta?.data_en,
                                  lead: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Lead Subtitle (BN)</Label>
                        <Textarea
                          rows={3}
                          value={sections.cta?.data_bn?.lead || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              cta: {
                                ...prev.cta,
                                data_bn: {
                                  ...prev.cta?.data_bn,
                                  lead: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Button Labels */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label>Button Label (EN)</Label>
                        <Input
                          type="text"
                          placeholder="e.g. Confirm Seat Reservation →"
                          value={sections.cta?.data_en?.submit_btn || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              cta: {
                                ...prev.cta,
                                data_en: {
                                  ...prev.cta?.data_en,
                                  submit_btn: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Button Label (BN)</Label>
                        <Input
                          type="text"
                          placeholder="e.g. আসন সংরক্ষণ নিশ্চিত করুন →"
                          value={sections.cta?.data_bn?.submit_btn || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              cta: {
                                ...prev.cta,
                                data_bn: {
                                  ...prev.cta?.data_bn,
                                  submit_btn: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Background Visual */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-bold">Banner Background Photo</Label>
                          <p className="text-xs text-slate-500">
                            High-resolution photo displayed behind the parallax reservation form
                          </p>
                        </div>
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                          <Upload size={13} />
                          <span>Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCtaBgUpload}
                            disabled={savingKey === "cta-bg"}
                          />
                        </label>
                      </div>

                      <Input
                        type="text"
                        placeholder="https://... or /uploads/..."
                        value={sections.cta?.media?.background_image || ""}
                        onChange={(e) =>
                          setSections((prev) => ({
                            ...prev,
                            cta: {
                              ...prev.cta,
                              media: {
                                ...prev.cta?.media,
                                background_image: e.target.value,
                              },
                            },
                          }))
                        }
                      />

                      {sections.cta?.media?.background_image && (
                        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 h-36">
                          <img
                            src={resolveMediaUrl(
                              sections.cta.media.background_image,
                              BACKEND_ORIGIN
                            )}
                            alt="CTA Background Preview"
                            className="w-full h-full object-cover opacity-60"
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm bg-black/30 backdrop-blur-[1px]">
                            CTA Background Preview
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button
                      onClick={() => handleSaveSection("cta", sections.cta)}
                      disabled={savingKey === "cta"}
                      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      <Save size={16} />
                      <span>
                        {savingKey === "cta" ? "Saving..." : "Save CTA Banner"}
                      </span>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          )}

          {/* ===================================================================
              TAB 4: BRAND LOGO & CONTACT CONFIGURATION
             =================================================================== */}
          {currentTab === "contact" && settings && (
            <form onSubmit={handleSaveContact} className="space-y-6 w-full">
              {/* =======================================================
                  CARD 1: ACADEMY LOGO & BRAND IDENTITY
                 ======================================================= */}
              <Card className="w-full border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                      <ImageIcon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold text-slate-900">
                          Academy Logo & Brand Identity
                        </CardTitle>
                        {settings.logo_url ? (
                          <Badge variant="success" className="text-[10px] font-bold py-0.5">
                            Custom Logo Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] py-0.5 border-slate-200 text-slate-600">
                            Default &quot;অ&quot; Monogram Active
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        Upload your official institution logo. Automatically synced across the website header, hero banner, mobile menu, footer, and admin portal.
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {settings.logo_url && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveLogo}
                        disabled={savingKey === "logo-remove"}
                        className="text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 gap-1.5"
                      >
                        <Trash2 size={13} />
                        <span>{savingKey === "logo-remove" ? "Removing..." : "Reset to Default"}</span>
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Two-Column: Left = Dual Live Previews, Right = Upload & URL Controls */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left: Dual Contrast Live Previews (Light Mode & Dark Mode) */}
                    <div className="lg:col-span-6 space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Live Visual Preview
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Light Background Preview (Simulates Navbar & Hero) */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col items-center justify-between min-h-[160px] relative overflow-hidden group shadow-sm">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 self-start">
                            Navbar / Light Canvas
                          </span>
                          <div className="flex-1 flex items-center justify-center p-3 w-full">
                            {uploadPreview ? (
                              <img
                                src={uploadPreview}
                                alt="Uploading Preview"
                                className="max-h-14 max-w-full object-contain animate-pulse"
                              />
                            ) : settings.logo_url ? (
                              <img
                                src={cacheBustUrl(resolveMediaUrl(settings.logo_url, BACKEND_ORIGIN))}
                                alt="Academy Logo"
                                className="max-h-14 max-w-full object-contain transition-transform group-hover:scale-105 duration-200"
                              />
                            ) : (
                              <div className="flex items-center gap-2 font-display font-extrabold text-xl text-slate-800">
                                <span className="w-8 h-8 rounded-full bg-red-600 text-white grid place-items-center text-sm font-bold">
                                  অ
                                </span>
                                <span>Onushilon</span>
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {settings.logo_url ? "Crisp on light surfaces" : "Default fallback badge"}
                          </span>
                        </div>

                        {/* Dark Background Preview (Simulates Footer & Mobile Sheet) */}
                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 flex flex-col items-center justify-between min-h-[160px] relative overflow-hidden group shadow-sm">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 self-start">
                            Footer / Dark Canvas
                          </span>
                          <div className="flex-1 flex items-center justify-center p-3 w-full">
                            {uploadPreview ? (
                              <img
                                src={uploadPreview}
                                alt="Uploading Preview"
                                className="max-h-14 max-w-full object-contain animate-pulse"
                              />
                            ) : settings.logo_url ? (
                              <img
                                src={cacheBustUrl(resolveMediaUrl(settings.logo_url, BACKEND_ORIGIN))}
                                alt="Academy Logo"
                                className="max-h-14 max-w-full object-contain transition-transform group-hover:scale-105 duration-200"
                              />
                            ) : (
                              <div className="flex items-center gap-2 font-display font-extrabold text-xl text-white">
                                <span className="w-8 h-8 rounded-full bg-red-600 text-white grid place-items-center text-sm font-bold">
                                  অ
                                </span>
                                <span>Onushilon</span>
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {settings.logo_url ? "Crisp on dark surfaces" : "Default fallback badge"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Upload Dropzone & Direct URL Input */}
                    <div className="lg:col-span-6 space-y-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Upload or Change Logo
                      </div>

                      {/* Dropzone File Input */}
                      <label
                        className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                          savingKey === "logo-upload"
                            ? "border-blue-500 bg-blue-50/50 pointer-events-none"
                            : "border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 bg-slate-50/50"
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/png,image/svg+xml,image/webp,image/jpeg,image/jpg"
                          onChange={handleLogoUpload}
                          className="sr-only"
                          disabled={savingKey === "logo-upload"}
                        />
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 mb-3">
                          <Upload size={22} className={savingKey === "logo-upload" ? "animate-bounce" : ""} />
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {savingKey === "logo-upload"
                            ? "Uploading and optimizing logo..."
                            : "Click or drag & drop to upload new logo"}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs">
                          Supports SVG, PNG, WebP or JPG (Transparent background recommended)
                        </p>
                      </label>

                      {/* Progress bar during upload */}
                      {savingKey === "logo-upload" && uploadProgress !== null && (
                        <UploadStatus progress={uploadProgress} label="Uploading logo to cloud storage..." />
                      )}

                      {/* Manual Direct URL Input */}
                      <div className="pt-1">
                        <Label className="text-xs font-bold text-slate-700">Or Image URL</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="text"
                            value={settings.logo_url || ""}
                            onChange={(e) =>
                              setSettings({ ...settings, logo_url: e.target.value })
                            }
                            placeholder="https://... or /uploads/branding/..."
                            className="text-xs font-mono"
                          />
                          {settings.logo_url && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(settings.logo_url)}
                              className="text-xs shrink-0 gap-1 border-slate-200"
                              title="Copy URL"
                            >
                              {copiedUrl === settings.logo_url ? <Check size={12} className="text-blue-700" /> : <Copy size={12} />}
                              <span>{copiedUrl === settings.logo_url ? "Copied" : "Copy"}</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>WhatsApp & Phone Channels</CardTitle>
                    <CardDescription>
                      Manage numbers, click-to-chat welcome text & customer
                      support timing
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRefresh("contact")}
                      disabled={refreshing}
                      title="Reload settings from database"
                      className="gap-1.5 border-slate-200 hover:bg-blue-50 text-blue-700 text-xs font-semibold"
                    >
                      <RefreshCw
                        size={14}
                        className={
                          refreshing ? "animate-spin text-blue-700" : ""
                        }
                      />
                      <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                    </Button>
                    <Button
                      type="submit"
                      disabled={savingKey === "contact"}
                      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      <Save size={16} />
                      <span>
                        {savingKey === "contact"
                          ? "Saving..."
                          : "Save Contact Settings"}
                      </span>
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Label required>Display Phone Number</Label>
                      <Input
                        type="text"
                        value={settings.phone || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, phone: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Phone Click-to-Call Link (tel:)</Label>
                      <Input
                        type="text"
                        value={settings.phone_href || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            phone_href: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Label required>
                        WhatsApp Number (International format)
                      </Label>
                      <Input
                        type="text"
                        value={settings.whatsapp_number || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            whatsapp_number: e.target.value,
                          })
                        }
                        placeholder="+8801700000000"
                        required
                      />
                    </div>
                    <div>
                      <Label>Support Hours</Label>
                      <Input
                        type="text"
                        value={settings.support_hours || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            support_hours: e.target.value,
                          })
                        }
                        placeholder="9 AM – 10 PM"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>WhatsApp Welcome Pre-filled Message</Label>
                    <Textarea
                      rows={2}
                      value={settings.whatsapp_message || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          whatsapp_message: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Live WhatsApp Test Button */}
                  {settings.whatsapp_number && (
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <div className="font-bold text-blue-700 text-sm">
                          Live WhatsApp Link Preview
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          https://wa.me/
                          {settings.whatsapp_number.replace(/[^0-9]/g, "")}
                          ?text=
                          {encodeURIComponent(settings.whatsapp_message || "")}
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(settings.whatsapp_message || "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md  transition-all"
                      >
                        <Send size={13} />
                        <span>Test WhatsApp Link</span>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Location & Social Links Card */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Campus Location & Official Social Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Label>Official Email</Label>
                      <Input
                        type="email"
                        value={settings.email || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Campus Location</Label>
                      <Input
                        type="text"
                        value={settings.location || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, location: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <Label>Facebook URL</Label>
                      <Input
                        type="url"
                        value={settings.facebook_url || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            facebook_url: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>YouTube URL</Label>
                      <Input
                        type="url"
                        value={settings.youtube_url || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            youtube_url: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>LinkedIn URL</Label>
                      <Input
                        type="url"
                        value={settings.linkedin_url || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            linkedin_url: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button
                    type="submit"
                    disabled={savingKey === "contact"}
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    <Save size={16} />
                    <span>
                      {savingKey === "contact" ? "Saving..." : "Save Settings"}
                    </span>
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}

          {/* ===================================================================
              TAB 5: MENTORS & FACULTY
             =================================================================== */}
          {currentTab === "mentors" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Academy Faculty Mentors
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Instructor profiles, specialties and designations
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRefresh("mentors")}
                    disabled={refreshing}
                    title="Refresh mentors from database"
                    className="gap-1.5 border-slate-200 hover:bg-blue-50 text-blue-700 text-xs font-semibold shrink-0"
                  >
                    <RefreshCw
                      size={14}
                      className={
                        refreshing ? "animate-spin text-blue-700" : ""
                      }
                    />
                    <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setMentorForm({
                        id: "",
                        name_en: "",
                        name_bn: "",
                        designation_en: "",
                        designation_bn: "",
                        specialty_en: "",
                        specialty_bn: "",
                        category: "Robotics & Tech",
                        avatar_url: DEFAULT_AVATAR_IMG,
                      });
                      setIsMentorModalOpen(true);
                    }}
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md "
                  >
                    <Plus size={16} />
                    <span>Add Faculty Mentor</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mentors.map((m) => (
                  <Card
                    key={m.id}
                    className="p-6 text-center flex flex-col items-center hover:border-blue-300 transition-colors"
                  >
                    <img
                      src={cacheBustUrl(m.avatar_url || DEFAULT_AVATAR_IMG)}
                      alt={m.name_en}
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 mb-4 shadow-sm"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR_IMG;
                      }}
                    />
                    <h3 className="font-bold text-slate-900 text-base">
                      {m.name_en}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {m.name_bn}
                    </div>
                    <div className="text-xs font-semibold text-blue-700 mt-2">
                      {m.designation_en}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 mb-4">
                      {m.specialty_en}
                    </div>
                    <Badge variant="outline" className="mb-4 text-[10px]">
                      {m.category}
                    </Badge>

                    <div className="flex gap-2 w-full mt-auto">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setMentorForm({ ...m });
                          setIsMentorModalOpen(true);
                        }}
                        className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-slate-900 font-semibold"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => promptDeleteMentor(m)}
                        title="Delete Mentor"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB 6: STUDENT LEADS CRM
             =================================================================== */}
          {currentTab === "leads" && (
            <div className="space-y-6">
              {/* Header and Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Student Leads & Inquiries CRM
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage enrollment applications, chat on WhatsApp & record
                    follow-up notes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRefresh("leads")}
                    disabled={refreshing}
                    title="Check for new student inquiry submissions"
                    className="gap-1.5 border-slate-200 hover:bg-blue-50 text-blue-700 text-xs font-semibold"
                  >
                    <RefreshCw
                      size={14}
                      className={
                        refreshing ? "animate-spin text-blue-700" : ""
                      }
                    />
                    <span>{refreshing ? "Syncing..." : "Refresh Leads"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportLeadsToCsv}
                    className="gap-1.5"
                  >
                    <Download size={14} />
                    <span>Export CSV</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsAddLeadModalOpen(true)}
                    className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md "
                  >
                    <Plus size={15} />
                    <span>Log Inquiry</span>
                  </Button>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search
                    size={15}
                    className="absolute left-3.5 top-3 text-slate-500"
                  />
                  <Input
                    type="text"
                    placeholder="Search applicant, phone, course..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="bg-white border border-slate-200 text-xs text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Statuses ({leads.length})</option>
                    <option value="new">
                      New ({leads.filter((l) => l.status === "new").length})
                    </option>
                    <option value="contacted">
                      Contacted (
                      {leads.filter((l) => l.status === "contacted").length})
                    </option>
                    <option value="enrolled">
                      Enrolled (
                      {leads.filter((l) => l.status === "enrolled").length})
                    </option>
                    <option value="closed">
                      Closed (
                      {leads.filter((l) => l.status === "closed").length})
                    </option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3.5">Applicant</th>
                          <th className="px-6 py-3.5">Contact</th>
                          <th className="px-6 py-3.5">Course</th>
                          <th className="px-6 py-3.5">Status</th>
                          <th className="px-6 py-3.5">Counsellor Notes</th>
                          <th className="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredLeads.map((lead) => {
                          const cleanNum = (lead.phone || "").replace(
                            /[^0-9]/g,
                            "",
                          );
                          const waUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(
                            `Hello ${lead.full_name}, thank you for contacting Onushilon Academy. How can we help you with ${lead.course_name || "courses"}?`,
                          )}`;

                          return (
                            <tr
                              key={lead.id}
                              className="hover:bg-blue-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="font-bold text-slate-900">
                                  {lead.full_name}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {new Date(lead.created_at).toLocaleString()}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-medium text-slate-800">
                                  {lead.phone}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {lead.email || "—"}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant="outline">
                                  {lead.course_name || "General"}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <select
                                  value={lead.status}
                                  onChange={(e) =>
                                    handleUpdateLeadStatus(
                                      lead.id,
                                      e.target.value,
                                    )
                                  }
                                  className="bg-slate-100 border border-slate-200 text-xs text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 font-semibold"
                                >
                                  <option value="new">New</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="enrolled">Enrolled</option>
                                  <option value="closed">Closed</option>
                                </select>
                              </td>
                              <td className="px-6 py-4">
                                <div
                                  className="text-xs text-slate-500 max-w-[200px] truncate cursor-pointer hover:text-blue-800"
                                  onClick={() => openLeadNotesDialog(lead)}
                                  title="Click to view/edit notes"
                                >
                                  {lead.notes || "— Click to add notes —"}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-50 hover:bg-blue-600 hover:text-slate-900 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border border-blue-200"
                                  >
                                    <Send size={12} />
                                    <span>WhatsApp</span>
                                  </a>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openLeadNotesDialog(lead)}
                                    className="h-7 px-2.5 text-xs gap-1"
                                  >
                                    <FileText size={12} />
                                    <span>Notes</span>
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => promptDeleteLead(lead)}
                                    className="h-7 w-7 rounded-lg"
                                    title="Delete Inquiry"
                                  >
                                    <Trash2 size={13} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredLeads.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="text-center py-12 text-slate-500 text-sm"
                            >
                              No inquiries found matching your filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===================================================================
              TAB 7: SUPABASE STORAGE BUCKET EXPLORER
             =================================================================== */}
          {currentTab === "media" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Supabase Storage Bucket: &quot;onushilon&quot;
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {media.length} files currently stored and publicly served
                    from cloud CDN
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRefresh("media")}
                    disabled={refreshing}
                    title="Refresh media files directly from Supabase storage bucket"
                    className="gap-1.5 border-slate-200 hover:bg-blue-50 text-blue-700 text-xs font-semibold shrink-0"
                  >
                    <RefreshCw
                      size={14}
                      className={
                        refreshing ? "animate-spin text-blue-700" : ""
                      }
                    />
                    <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                  </Button>
                  <div className="relative w-full sm:w-64">
                    <Search
                      size={15}
                      className="absolute left-3 top-2.5 text-slate-500"
                    />
                    <Input
                      type="text"
                      placeholder="Search files..."
                      value={mediaSearch}
                      onChange={(e) => setMediaSearch(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                  <label className={`bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md  shrink-0 ${savingKey === "general-img" ? "opacity-60 pointer-events-none" : "cursor-pointer"}`}>
                    <Upload size={14} />
                    <span>{savingKey === "general-img" ? "Uploading..." : "Upload New"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGeneralMediaUpload}
                      disabled={savingKey === "general-img"}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {savingKey === "general-img" && (
                <UploadStatus preview={uploadPreview} progress={uploadProgress} />
              )}

              {/* Folder Filter Tabs */}
              <TabsList>
                {["all", "branding", "courses", "mentors", "moments", "photos", "general"].map(
                  (folder) => (
                    <TabsTrigger
                      key={folder}
                      active={mediaFolderFilter === folder}
                      onClick={() => setMediaFolderFilter(folder)}
                      className="capitalize"
                    >
                      {folder === "all" ? "All Files" : folder}
                    </TabsTrigger>
                  ),
                )}
              </TabsList>

              {/* Files Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredMedia.map((m, idx) => (
                  <Card
                    key={idx}
                    className="overflow-hidden group hover:border-blue-300 transition-all flex flex-col"
                  >
                    <div
                      className="h-32 bg-slate-100 overflow-hidden relative flex items-center justify-center cursor-pointer"
                      onClick={() => setPreviewMedia(m)}
                    >
                      <img
                        src={cacheBustUrl(m.publicUrl)}
                        alt={m.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye size={20} className="text-slate-900 drop-shadow-md" />
                      </div>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div
                          className="text-xs font-bold text-slate-900 truncate"
                          title={m.name}
                        >
                          {m.name}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {m.size
                            ? `${(m.size / 1024).toFixed(1)} KB`
                            : "Supabase Cloud Asset"}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => copyToClipboard(m.publicUrl)}
                          className="flex-1 h-7 text-[11px] gap-1 font-semibold border-slate-200 hover:bg-blue-600 hover:text-slate-900"
                        >
                          {copiedUrl === m.publicUrl ? (
                            <Check size={12} className="text-blue-700" />
                          ) : (
                            <Copy size={12} />
                          )}
                          <span>
                            {copiedUrl === m.publicUrl ? "Copied!" : "Copy"}
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetAsLogo(m.publicUrl);
                          }}
                          title={settings?.logo_url === m.publicUrl ? "Current Active Logo" : "Set as Official Academy Logo"}
                          className={`h-7 w-7 border shrink-0 ${
                            settings?.logo_url === m.publicUrl
                              ? "text-blue-700 bg-blue-50 border-blue-300 font-bold"
                              : "text-slate-500 hover:text-blue-700 hover:bg-blue-50 border-slate-200"
                          }`}
                        >
                          <Sparkles size={12} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMedia(m);
                          }}
                          title="Delete image & invalidate cache"
                          className="h-7 w-7 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 shrink-0"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredMedia.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                  <HardDrive size={36} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm">
                    No cloud files found in this category.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ===================================================================
          MODAL 1: COURSE & PRICING
         =================================================================== */}
      <Dialog open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <div>
              <DialogTitle>
                {editingCourse
                  ? `Edit Course: ${courseForm.title_en || "Untitled"}`
                  : "Create New Course"}
              </DialogTitle>
              <DialogDescription>
                Configure course fees, syllabus topics, and upload images to
                Supabase bucket
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleSaveCourse}
                disabled={savingKey === "course"}
                className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                <Save size={14} />
                <span>
                  {savingKey === "course" ? "Saving..." : "Save Course & Fee"}
                </span>
              </Button>
              <DialogClose onClick={() => setIsCourseModalOpen(false)} />
            </div>
          </DialogHeader>

          {/* Sub-Tabs */}
          <div className="px-6 pt-3 pb-0 border-b border-slate-200 bg-slate-50">
            <TabsList className="bg-transparent border-0 p-0 gap-2">
              <TabsTrigger
                active={courseModalTab === "basic"}
                onClick={() => setCourseModalTab("basic")}
              >
                1. General Info
              </TabsTrigger>
              <TabsTrigger
                active={courseModalTab === "pricing"}
                onClick={() => setCourseModalTab("pricing")}
              >
                2. Fees & Schedule
              </TabsTrigger>
              <TabsTrigger
                active={courseModalTab === "curriculum"}
                onClick={() => setCourseModalTab("curriculum")}
              >
                3. Syllabus & Topics
              </TabsTrigger>
              <TabsTrigger
                active={courseModalTab === "media"}
                onClick={() => setCourseModalTab("media")}
              >
                4. Cloud Thumbnail
              </TabsTrigger>
            </TabsList>
          </div>

          <form
            onSubmit={handleSaveCourse}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <DialogBody>
              {/* TAB 1: BASIC INFO */}
              {courseModalTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label required>Title (English)</Label>
                      <Input
                        type="text"
                        value={courseForm.title_en}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            title_en: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Title (Bengali)</Label>
                      <Input
                        type="text"
                        value={courseForm.title_bn}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            title_bn: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Category (English)</Label>
                      <select
                        value={courseForm.category_en}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            category_en: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Robotics & Tech">Robotics & Tech</option>
                        <option value="Arts & Sports">Arts & Sports</option>
                        <option value="Academic">Academic</option>
                        <option value="Language">Language</option>
                        <option value="Skills">Skills</option>
                      </select>
                    </div>
                    <div>
                      <Label>Category (Bengali)</Label>
                      <Input
                        type="text"
                        value={courseForm.category_bn}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            category_bn: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Assigned Mentor</Label>
                      <Input
                        type="text"
                        value={courseForm.mentor_name}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            mentor_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Duration (e.g. 4 months)</Label>
                      <Input
                        type="text"
                        value={courseForm.duration_en}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            duration_en: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Level (e.g. Hands-on Lab)</Label>
                      <Input
                        type="text"
                        value={courseForm.level_en}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            level_en: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="course-active-box"
                      checked={courseForm.is_active}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          is_active: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-blue-600 accent-emerald-500 cursor-pointer"
                    />
                    <label
                      htmlFor="course-active-box"
                      className="text-sm font-medium text-slate-700 cursor-pointer"
                    >
                      Publish on website (Active Batch Status)
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & SCHEDULE */}
              {courseModalTab === "pricing" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label required>Course Fee (Price)</Label>
                      <Input
                        type="text"
                        value={courseForm.price}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            price: e.target.value,
                          })
                        }
                        placeholder="৳5,500"
                        required
                      />
                    </div>
                    <div>
                      <Label>Discount Strikethrough Price</Label>
                      <Input
                        type="text"
                        value={courseForm.discount_price}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            discount_price: e.target.value,
                          })
                        }
                        placeholder="৳4,800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Schedule (English)</Label>
                      <Input
                        type="text"
                        value={courseForm.schedule_en}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            schedule_en: e.target.value,
                          })
                        }
                        placeholder="Fri & Sat • 4:00 PM"
                      />
                    </div>
                    <div>
                      <Label>Schedule (Bengali)</Label>
                      <Input
                        type="text"
                        value={courseForm.schedule_bn}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            schedule_bn: e.target.value,
                          })
                        }
                        placeholder="শুক্র ও শনি • বিকাল ৪:০০"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Seats Alert (English)</Label>
                      <Input
                        type="text"
                        value={courseForm.seats_en}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            seats_en: e.target.value,
                          })
                        }
                        placeholder="6 seats left"
                      />
                    </div>
                    <div>
                      <Label>Seats Alert (Bengali)</Label>
                      <Input
                        type="text"
                        value={courseForm.seats_bn}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            seats_bn: e.target.value,
                          })
                        }
                        placeholder="৬টি আসন বাকি"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CURRICULUM TOPICS */}
              {courseModalTab === "curriculum" && (
                <div className="space-y-4">
                  <div>
                    <Label>Add Course Curriculum Topic</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="e.g. Autonomous Line-Following Robots"
                        value={newTopicInput}
                        onChange={(e) => setNewTopicInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newTopicInput.trim()) {
                              setTopicsEn([...topicsEn, newTopicInput.trim()]);
                              setNewTopicInput("");
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          if (newTopicInput.trim()) {
                            setTopicsEn([...topicsEn, newTopicInput.trim()]);
                            setNewTopicInput("");
                          }
                        }}
                        className="bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-slate-900 font-semibold"
                      >
                        Add Topic
                      </Button>
                    </div>
                  </div>

                  {topicsEn.length > 0 && (
                    <div className="space-y-2">
                      <Label>Current Topics ({topicsEn.length})</Label>
                      <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                        {topicsEn.map((top, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-blue-50 border border-blue-200 text-blue-700"
                          >
                            <span>{top}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setTopicsEn(
                                  topicsEn.filter((_, i) => i !== idx),
                                )
                              }
                              className="text-slate-500 hover:text-rose-600"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Description (English)</Label>
                      <Textarea
                        rows={3}
                        value={courseForm.description_en}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            description_en: e.target.value,
                          })
                        }
                        placeholder="Course overview and student outcomes..."
                      />
                    </div>
                    <div>
                      <Label>Description (Bengali)</Label>
                      <Textarea
                        rows={3}
                        value={courseForm.description_bn}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            description_bn: e.target.value,
                          })
                        }
                        placeholder="কোর্স পরিচিতি..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: IMAGE & CLOUD MEDIA */}
              {courseModalTab === "media" && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                      <Upload size={22} />
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      Upload Thumbnail to Supabase Bucket
                    </div>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      Direct cloud upload into &quot;onushilon&quot; storage
                      bucket
                    </p>
                    <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md  transition-all ${savingKey === "course-img" ? "opacity-60 pointer-events-none" : "cursor-pointer"}`}>
                      <span>
                        {savingKey === "course-img"
                          ? "Uploading..."
                          : "Browse Image File"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCourseImageUpload}
                        disabled={savingKey === "course-img"}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {savingKey === "course-img" && (
                    <UploadStatus preview={uploadPreview} progress={uploadProgress} />
                  )}

                  <div>
                    <Label>Direct Image Public URL</Label>
                    <Input
                      type="text"
                      value={courseForm.image_url}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          image_url: e.target.value,
                        })
                      }
                    />
                  </div>

                  {courseForm.image_url && (
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <img
                        src={cacheBustUrl(courseForm.image_url)}
                        alt="Preview"
                        className="w-20 h-14 object-cover rounded-lg border border-slate-200"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_COURSE_IMG;
                        }}
                      />
                      <div className="flex-1 truncate">
                        <div className="text-xs font-semibold text-blue-700">
                          Current Thumbnail
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate">
                          {courseForm.image_url}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogBody>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCourseModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={savingKey === "course"}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                <Save size={16} />
                <span>
                  {savingKey === "course" ? "Saving..." : "Save Course & Fee"}
                </span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ===================================================================
          MODAL 2: MENTOR & FACULTY
         =================================================================== */}
      <Dialog open={isMentorModalOpen} onOpenChange={setIsMentorModalOpen}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>
              {mentorForm.id ? "Edit Faculty Mentor" : "Add Faculty Mentor"}
            </DialogTitle>
            <DialogClose onClick={() => setIsMentorModalOpen(false)} />
          </DialogHeader>

          <form
            onSubmit={handleSaveMentor}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <DialogBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label required>Name (English)</Label>
                  <Input
                    type="text"
                    value={mentorForm.name_en}
                    onChange={(e) =>
                      setMentorForm({ ...mentorForm, name_en: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Name (Bengali)</Label>
                  <Input
                    type="text"
                    value={mentorForm.name_bn}
                    onChange={(e) =>
                      setMentorForm({ ...mentorForm, name_bn: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Department / Category</Label>
                <select
                  value={mentorForm.category}
                  onChange={(e) =>
                    setMentorForm({ ...mentorForm, category: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="Robotics & Tech">Robotics & Tech</option>
                  <option value="Arts & Sports">Arts & Sports</option>
                  <option value="Academic">Academic</option>
                  <option value="Language">Language</option>
                  <option value="Skills">Skills</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Designation</Label>
                  <Input
                    type="text"
                    value={mentorForm.designation_en}
                    onChange={(e) =>
                      setMentorForm({
                        ...mentorForm,
                        designation_en: e.target.value,
                      })
                    }
                    placeholder="e.g. Lead Robotics Specialist"
                  />
                </div>
                <div>
                  <Label>Specialty</Label>
                  <Input
                    type="text"
                    value={mentorForm.specialty_en}
                    onChange={(e) =>
                      setMentorForm({
                        ...mentorForm,
                        specialty_en: e.target.value,
                      })
                    }
                    placeholder="e.g. Microcontrollers & IoT"
                  />
                </div>
              </div>

              {/* Avatar Upload */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <img
                  src={cacheBustUrl(
                    mentorForm.avatar_url || DEFAULT_AVATAR_IMG,
                  )}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_AVATAR_IMG;
                  }}
                />
                <div className="flex-1">
                  <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-slate-900 border border-blue-200 text-xs font-bold transition-all ${savingKey === "mentor-img" ? "opacity-60 pointer-events-none" : "cursor-pointer"}`}>
                    <Upload size={13} />
                    <span>
                      {savingKey === "mentor-img"
                        ? "Uploading..."
                        : "Upload Avatar"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMentorAvatarUpload}
                      disabled={savingKey === "mentor-img"}
                      className="hidden"
                    />
                  </label>
                  {savingKey === "mentor-img" && (
                    <div className="mt-2">
                      <UploadStatus preview={uploadPreview} progress={uploadProgress} label="Uploading avatar" />
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 mt-1 truncate max-w-[240px] font-mono">
                    {mentorForm.avatar_url}
                  </div>
                </div>
              </div>
            </DialogBody>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsMentorModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={savingKey === "mentor"}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                <Save size={16} />
                <span>
                  {savingKey === "mentor" ? "Saving..." : "Save Mentor"}
                </span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ===================================================================
          MODAL 3: ADD NEW LEAD MANUALLY
         =================================================================== */}
      <Dialog open={isAddLeadModalOpen} onOpenChange={setIsAddLeadModalOpen}>
        <DialogContent className="max-w-xl w-full">
          <DialogHeader>
            <DialogTitle>Log Student Inquiry (CRM)</DialogTitle>
            <DialogDescription>
              Record an in-person, phone or manual inquiry into the CRM database
            </DialogDescription>
            <DialogClose onClick={() => setIsAddLeadModalOpen(false)} />
          </DialogHeader>

          <form onSubmit={handleCreateManualLead} className="p-6 space-y-4">
            <div>
              <Label required>Applicant Full Name</Label>
              <Input
                type="text"
                placeholder="e.g. Tanvir Hasan"
                value={newLeadForm.full_name}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, full_name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label required>Phone Number / WhatsApp</Label>
              <Input
                type="tel"
                placeholder="01700000000"
                value={newLeadForm.phone}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, phone: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Email (Optional)</Label>
              <Input
                type="email"
                placeholder="student@example.com"
                value={newLeadForm.email}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, email: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Interested Course</Label>
              <select
                value={newLeadForm.course_name}
                onChange={(e) =>
                  setNewLeadForm({
                    ...newLeadForm,
                    course_name: e.target.value,
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.title_en}>
                    {c.title_en}
                  </option>
                ))}
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>

            <div>
              <Label>Initial Notes</Label>
              <Textarea
                rows={3}
                placeholder="e.g. Inquired about robotics weekend batch for 8th grader..."
                value={newLeadForm.notes}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, notes: e.target.value })
                }
              />
            </div>

            <DialogFooter className="px-0 pb-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddLeadModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Save Inquiry
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ===================================================================
          MODAL 4: COUNSELLOR NOTES
         =================================================================== */}
      <Dialog
        open={leadNotesModal.open}
        onOpenChange={(val) =>
          setLeadNotesModal((prev) => ({ ...prev, open: val }))
        }
      >
        <DialogContent className="max-w-xl w-full">
          <DialogHeader>
            <DialogTitle>Counsellor Notes</DialogTitle>
            <DialogClose
              onClick={() =>
                setLeadNotesModal((prev) => ({ ...prev, open: false }))
              }
            />
          </DialogHeader>

          {leadNotesModal.lead && (
            <div className="p-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900 text-sm">
                  {leadNotesModal.lead.full_name}
                </div>
                <div className="text-slate-500">
                  Phone: {leadNotesModal.lead.phone}
                </div>
                <div className="text-blue-700 font-semibold">
                  Course: {leadNotesModal.lead.course_name || "General"}
                </div>
              </div>

              <div>
                <Label>Notes & Communication Log</Label>
                <Textarea
                  rows={5}
                  value={leadNotesModal.notes}
                  onChange={(e) =>
                    setLeadNotesModal((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="e.g. Spoke on phone, confirmed admission next week..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setLeadNotesModal((prev) => ({ ...prev, open: false }))
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveLeadNotes}
              disabled={leadNotesModal.loading}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              <Save size={16} />
              <span>{leadNotesModal.loading ? "Saving..." : "Save Notes"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===================================================================
          MODAL 5: MEDIA PREVIEW LIGHTBOX
         =================================================================== */}
      {previewMedia && (
        <Dialog
          open={Boolean(previewMedia)}
          onOpenChange={() => setPreviewMedia(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div>
                <DialogTitle>{previewMedia.name}</DialogTitle>
                <DialogDescription>
                  Supabase Cloud Storage CDN Asset
                </DialogDescription>
              </div>
              <DialogClose onClick={() => setPreviewMedia(null)} />
            </DialogHeader>
            <div className="p-6 flex flex-col items-center">
              <div className="max-h-[60vh] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center">
                <img
                  src={cacheBustUrl(previewMedia.publicUrl)}
                  alt={previewMedia.name}
                  className="max-h-[60vh] max-w-full object-contain"
                />
              </div>
              <div className="w-full mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500 font-mono truncate max-w-full sm:max-w-[280px]">
                  {previewMedia.publicUrl}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <label className="bg-slate-100 border border-slate-200 hover:border-blue-300 hover:text-blue-800 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-sm">
                    <Upload size={13} />
                    <span>Replace Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleReplaceMedia(previewMedia, e)}
                      className="hidden"
                    />
                  </label>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(previewMedia.publicUrl)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold shrink-0 text-xs gap-1"
                  >
                    <Copy size={13} />
                    <span>Copy URL</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteMedia(previewMedia)}
                    className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs shrink-0 gap-1"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ===================================================================
          MODAL: CONTENT BACKUP & TEXT RESTORE (GLOBAL)
         =================================================================== */}
      <Dialog open={backupModalOpen} onOpenChange={setBackupModalOpen}>
        <DialogContent className="max-w-3xl w-full">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="text-blue-600" size={20} />
                  <span>Content Backup &amp; Text Restore</span>
                </DialogTitle>
                <DialogDescription>
                  Export all dynamic texts as text/JSON so you can copy and paste them back anytime without retyping.
                </DialogDescription>
              </div>
              <DialogClose onClick={() => setBackupModalOpen(false)} />
            </div>
          </DialogHeader>

          <DialogBody className="space-y-4">
            {/* Modal Tabs: Export vs Import */}
            <div className="flex border-b border-slate-200 gap-2 pb-2">
              <button
                type="button"
                onClick={() => setBackupModalTab("export")}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 ${
                  backupModalTab === "export"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Download size={15} />
                <span>Export / Copy Texts</span>
              </button>
              <button
                type="button"
                onClick={() => setBackupModalTab("import")}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 ${
                  backupModalTab === "import"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Upload size={15} />
                <span>Import / Restore Texts</span>
              </button>
            </div>

            {backupModalTab === "export" && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={backupIncludeSettings}
                      onChange={(e) => setBackupIncludeSettings(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Include Contact &amp; Brand Settings</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={copyBackupToClipboard}
                      className="gap-1.5 text-xs font-bold"
                    >
                      {backupCopied ? (
                        <>
                          <Check size={14} className="text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy All Text</span>
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => downloadBackupFile("json")}
                      className="gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Download size={14} />
                      <span>Download .json</span>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => downloadBackupFile("txt")}
                      className="gap-1.5 text-xs font-medium text-slate-600"
                    >
                      <span>.txt</span>
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    readOnly
                    rows={12}
                    value={generateBackupData(backupIncludeSettings)}
                    className="w-full font-mono text-xs p-3 rounded-xl bg-slate-900 text-emerald-400 border border-slate-800 focus:outline-none select-all"
                  />
                  <span className="absolute top-2 right-2 text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                    Read-only (Click &quot;Copy All Text&quot; above)
                  </span>
                </div>
              </div>
            )}

            {backupModalTab === "import" && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                  <div className="text-xs text-amber-900">
                    <span className="font-bold">Paste exported text below</span> or upload a saved backup file to restore all your texts and milestones immediately.
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 transition-colors shrink-0">
                    <Upload size={13} />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept=".json,.txt"
                      className="hidden"
                      onChange={handleBackupFileUpload}
                    />
                  </label>
                </div>

                <textarea
                  rows={12}
                  placeholder='Paste your backup JSON text here, e.g. { "sections": { ... } }'
                  value={backupImportText}
                  onChange={(e) => setBackupImportText(e.target.value)}
                  className="w-full font-mono text-xs p-3 rounded-xl bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setBackupImportText("")}
                    disabled={!backupImportText}
                    className="text-xs text-slate-500"
                  >
                    Clear Text
                  </Button>
                  <Button
                    type="button"
                    onClick={handleRestoreBackup}
                    disabled={backupRestoring || !backupImportText.trim()}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    <CheckCircle2 size={16} />
                    <span>{backupRestoring ? "Restoring to Live Site..." : "Restore All Sections"}</span>
                  </Button>
                </div>
              </div>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>

      {/* ===================================================================
          MODAL: SECTION-LEVEL RAW TEXT / JSON
         =================================================================== */}
      <Dialog
        open={Boolean(sectionRawModal?.open)}
        onOpenChange={(open) => !open && setSectionRawModal(null)}
      >
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="text-blue-600" size={18} />
                  <span>
                    Quick Text &amp; Backup: {sectionRawModal?.name}
                  </span>
                </DialogTitle>
                <DialogDescription>
                  Copy this section&apos;s data or paste your saved text to restore without retyping.
                </DialogDescription>
              </div>
              <DialogClose onClick={() => setSectionRawModal(null)} />
            </div>
          </DialogHeader>

          <DialogBody className="space-y-3">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">
                Section ID: <code className="font-mono text-blue-700 font-bold">{sectionRawModal?.sectionId}</code>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCopySectionRawText}
                  className="gap-1.5 text-xs font-semibold"
                >
                  {sectionRawModal?.copied ? (
                    <>
                      <Check size={14} className="text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Text</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            <textarea
              rows={14}
              value={sectionRawModal?.text || ""}
              onChange={(e) =>
                setSectionRawModal((prev) =>
                  prev ? { ...prev, text: e.target.value } : null
                )
              }
              className="w-full font-mono text-xs p-3 rounded-xl bg-slate-900 text-emerald-400 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste JSON text for this section here..."
            />
          </DialogBody>

          <DialogFooter className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSectionRawModal(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleApplySectionRawText}
              disabled={sectionRawModal?.saving || !sectionRawModal?.text?.trim()}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              <Save size={15} />
              <span>
                {sectionRawModal?.saving ? "Applying & Saving..." : "Apply & Save to Section"}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===================================================================
          MODAL 6: ALERT DIALOG
         =================================================================== */}
      <AlertDialog
        open={alertDialog.open}
        onOpenChange={(open) => setAlertDialog((prev) => ({ ...prev, open }))}
        title={alertDialog.title}
        description={alertDialog.description}
        confirmText={alertDialog.confirmText}
        isDestructive={alertDialog.isDestructive}
        loading={alertDialog.loading}
        onConfirm={alertDialog.onConfirm}
      />

      {/* ===================================================================
          FLOATING TOAST NOTIFICATION
         =================================================================== */}
      {toast && (
        <div className="fixed bottom-6 right-6 px-4 py-3 bg-white border border-blue-200 rounded-2xl text-slate-900 shadow-sm flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {toast.type === "error" ? (
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="text-blue-700 shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-slate-500 hover:text-slate-900"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
