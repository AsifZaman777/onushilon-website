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
import { API_BASE } from "../../lib/api";
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

// Default Cloud Storage Fallback Images
const DEFAULT_COURSE_IMG =
  "https://okhqtcykqdkivxsghyrv.supabase.co/storage/v1/object/public/onushilon/photos/robotic_class1.webp";
const DEFAULT_AVATAR_IMG =
  "https://okhqtcykqdkivxsghyrv.supabase.co/storage/v1/object/public/onushilon/photos/classroom1.webp";

// Vibrant Black & Lightgreen Color Palette for Dynamic Charts
const GREEN_PALETTE = [
  "#22c55e", // Lightgreen / Emerald
  "#4ade80", // Vibrant Mint
  "#86efac", // Soft Lightgreen
  "#10b981", // Deep Emerald
  "#34d399", // Seafoam
  "#a7f3d0", // Pale Lime
];

const STATUS_COLORS = {
  new: "#f59e0b", // Amber
  contacted: "#38bdf8", // Sky
  enrolled: "#22c55e", // Lightgreen
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

  // Save Loading State
  const [savingKey, setSavingKey] = useState(null);

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

  // Centralized API Helper
  const apiFetch = async (endpoint, options = {}, customToken = null) => {
    const authToken = customToken || token;
    const headers = { ...(options.headers || {}) };
    if (authToken && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
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

  // Fetch all live dashboard and CRM data from backend
  const fetchDashboardData = async (activeToken) => {
    setLoading(true);
    try {
      const [pubRes, leadsRes, healthRes, mediaRes] = await Promise.all([
        apiFetch("/public/all", {}, activeToken),
        apiFetch("/leads", {}, activeToken).catch(() => ({ data: [] })),
        apiFetch("/health", {}, activeToken).catch(() => ({})),
        apiFetch("/media", {}, activeToken).catch(() => ({ data: [] })),
      ]);

      if (pubRes?.data) {
        setSettings(pubRes.data.settings || {});
        setCourses(pubRes.data.courses || []);
        setSections(pubRes.data.sections || {});
        setMentors(pubRes.data.mentors || []);
      }
      if (leadsRes?.data) {
        setLeads(leadsRes.data);
      }
      if (mediaRes?.data) {
        setMedia(mediaRes.data);
      }
      setStorageStatus(healthRes);
    } catch (err) {
      console.warn("Could not load full dashboard data:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefreshAll = () => {
    if (!token) return;
    setRefreshing(true);
    fetchDashboardData(token);
    showToast("Syncing with live Supabase database...", "success");
  };

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
      return [{ name: "No Courses Yet", count: 0, active: 0, fill: "#22c55e" }];
    }

    return entries.map((entry, idx) => ({
      ...entry,
      fill: GREEN_PALETTE[idx % GREEN_PALETTE.length],
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
        fill: GREEN_PALETTE[i % GREEN_PALETTE.length],
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

  const handleCourseImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "courses");

    setSavingKey("course-img");
    try {
      const res = await apiFetch("/media/upload", {
        method: "POST",
        body: formData,
      });
      if (res.data?.publicUrl) {
        setCourseForm((prev) => ({ ...prev, image_url: res.data.publicUrl }));
        showToast("Image uploaded to Supabase bucket successfully!", "success");
        fetchDashboardData(token);
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSavingKey(null);
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

  // Add FAQ Item
  const handleAddFaq = () => {
    const currentList = sections.faq?.data_en?.items || [];
    const newItem = {
      q: "What are the class timings?",
      a: "Classes are held both online and offline during weekends and weekday evenings.",
    };
    setSections((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        data_en: {
          ...prev.faq?.data_en,
          items: [...currentList, newItem],
        },
      },
    }));
  };

  // Delete FAQ Item
  const handleDeleteFaq = (index) => {
    const currentList = sections.faq?.data_en?.items || [];
    const updated = currentList.filter((_, i) => i !== index);
    setSections((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        data_en: { ...prev.faq?.data_en, items: updated },
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

  // ===========================================================================
  // MENTORS CRUD
  // ===========================================================================
  const handleMentorAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "mentors");

    setSavingKey("mentor-img");
    try {
      const res = await apiFetch("/media/upload", {
        method: "POST",
        body: formData,
      });
      if (res.data?.publicUrl) {
        setMentorForm((prev) => ({ ...prev, avatar_url: res.data.publicUrl }));
        showToast("Mentor avatar uploaded to Supabase!", "success");
        fetchDashboardData(token);
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSavingKey(null);
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

    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "general");

    setSavingKey("general-img");
    try {
      const res = await apiFetch("/media/upload", {
        method: "POST",
        body: formData,
      });
      if (res.data?.publicUrl) {
        showToast("Uploaded to Supabase bucket 'onushilon'!", "success");
        fetchDashboardData(token);
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSavingKey(null);
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
      <div className="min-h-screen bg-[#050706] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 text-black font-black text-2xl flex items-center justify-center shadow-[0_0_35px_rgba(34,197,94,0.35)]">
            অ
          </div>
          <div className="text-xs uppercase font-mono tracking-widest text-emerald-400">
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
      <div className="min-h-screen bg-[#050706] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <Card className="w-full max-w-md border-emerald-950/80 bg-[#090d0b]/90 shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl relative z-10">
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-green-400 to-emerald-300 text-black font-black text-2xl flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(74,222,128,0.35)] mb-4">
              অ
            </div>
            <CardTitle className="text-2xl font-bold text-white tracking-tight">
              Onushilon CRM Portal
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400 mt-1">
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

              <div className="bg-[#060a08] border border-emerald-950/80 rounded-xl p-3 text-xs text-zinc-400 flex items-center justify-between">
                <div>
                  Default:{" "}
                  <span className="text-emerald-400 font-mono">
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
                  className="text-emerald-400 hover:text-emerald-300 underline font-medium text-[11px]"
                >
                  Auto-fill
                </button>
              </div>

              <Button
                type="submit"
                disabled={authLoading}
                className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-[0_0_20px_rgba(34,197,94,0.25)] transition-all"
              >
                {authLoading ? "Authenticating..." : "Sign In to Admin Portal"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {toast && (
          <div className="fixed bottom-6 right-6 px-4 py-3 bg-[#0a0f0d] border border-emerald-500/30 rounded-xl text-zinc-100 shadow-2xl flex items-center gap-3 z-50">
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
    <div className="min-h-screen bg-[#050706] text-zinc-100 flex font-sans antialiased selection:bg-emerald-500 selection:text-black">
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`w-72 bg-[#070a08]/95 border-r border-emerald-950/60 fixed top-0 bottom-0 left-0 z-40 flex flex-col backdrop-blur-2xl transition-transform duration-300 ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-emerald-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 text-black font-black text-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              অ
            </div>
            <div>
              <div className="font-bold text-base text-white tracking-tight">
                Onushilon
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Admin Portal
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-zinc-400 hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 flex-1 overflow-y-auto space-y-1">
          <div className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-500 px-3 py-2">
            Overview
          </div>
          <button
            onClick={() => {
              setCurrentTab("dashboard");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentTab === "dashboard"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold shadow-[0_0_15px_rgba(34,197,94,0.12)]"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
            }`}
          >
            <LayoutDashboard
              size={18}
              className={
                currentTab === "dashboard"
                  ? "text-emerald-400"
                  : "text-zinc-500"
              }
            />
            <span>Dashboard & Analytics</span>
          </button>

          <div className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-500 px-3 pt-4 pb-2">
            Dynamic Academy Content
          </div>
          <button
            onClick={() => {
              setCurrentTab("courses");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentTab === "courses"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold shadow-[0_0_15px_rgba(34,197,94,0.12)]"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
            }`}
          >
            <BookOpen
              size={18}
              className={
                currentTab === "courses" ? "text-emerald-400" : "text-zinc-500"
              }
            />
            <span>Courses & Pricing</span>
            <Badge
              variant="outline"
              className="ml-auto text-[10px] py-0 px-1.5 border-emerald-950"
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
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold shadow-[0_0_15px_rgba(34,197,94,0.12)]"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
            }`}
          >
            <Layers
              size={18}
              className={
                currentTab === "sections" ? "text-emerald-400" : "text-zinc-500"
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
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold shadow-[0_0_15px_rgba(34,197,94,0.12)]"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
            }`}
          >
            <MessageSquare
              size={18}
              className={
                currentTab === "contact" ? "text-emerald-400" : "text-zinc-500"
              }
            />
            <span>WhatsApp & Contact</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab("mentors");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentTab === "mentors"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold shadow-[0_0_15px_rgba(34,197,94,0.12)]"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
            }`}
          >
            <Users
              size={18}
              className={
                currentTab === "mentors" ? "text-emerald-400" : "text-zinc-500"
              }
            />
            <span>Mentors & Faculty</span>
            <Badge
              variant="outline"
              className="ml-auto text-[10px] py-0 px-1.5 border-emerald-950"
            >
              {mentors.length}
            </Badge>
          </button>

          <div className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-500 px-3 pt-4 pb-2">
            Growth & CRM
          </div>
          <button
            onClick={() => {
              setCurrentTab("leads");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentTab === "leads"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold shadow-[0_0_15px_rgba(34,197,94,0.12)]"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
            }`}
          >
            <TrendingUp
              size={18}
              className={
                currentTab === "leads" ? "text-emerald-400" : "text-zinc-500"
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
                className="ml-auto text-[10px] py-0 px-1.5 border-emerald-950"
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
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold shadow-[0_0_15px_rgba(34,197,94,0.12)]"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
            }`}
          >
            <HardDrive
              size={18}
              className={
                currentTab === "media" ? "text-emerald-400" : "text-zinc-500"
              }
            />
            <span>Supabase Storage</span>
            <Badge
              variant="outline"
              className="ml-auto text-[10px] py-0 px-1.5 border-emerald-950"
            >
              {media.length}
            </Badge>
          </button>
        </nav>

        {/* Live Supabase Bucket Status Bar */}
        <div className="p-4 border-t border-emerald-950/60 bg-[#050706]">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-950/40 border border-emerald-500/25 text-emerald-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
              <span>Supabase Storage Live</span>
            </div>
            <button
              onClick={handleRefreshAll}
              disabled={refreshing}
              title="Sync with database"
              className="text-zinc-400 hover:text-emerald-300 transition-colors"
            >
              <RefreshCw
                size={13}
                className={refreshing ? "animate-spin text-emerald-400" : ""}
              />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        {/* TOP BAR */}
        <header className="h-16 px-4 sm:px-8 border-b border-emerald-950/60 bg-[#070a08]/90 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-900"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {currentTab === "dashboard" &&
                  "Executive Dashboard & Live Analytics"}
                {currentTab === "courses" && "Course & Pricing Management"}
                {currentTab === "sections" && "Landing Page Sections & Texts"}
                {currentTab === "contact" && "WhatsApp & Contact Configuration"}
                {currentTab === "mentors" && "Faculty Mentors"}
                {currentTab === "leads" && "Student Leads & Inquiries CRM"}
                {currentTab === "media" && "Supabase Storage Bucket Explorer"}
              </h1>
              <div className="text-[11px] text-zinc-500 hidden sm:block">
                Onushilon Academy • Real-time Supabase Database Sync
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">View Website</span>
            </Link>

            <Button
              size="sm"
              onClick={openNewCourseModal}
              className="gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20"
            >
              <Plus size={15} />
              <span>Add Course</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleLogout}
              title="Sign Out"
              className="border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-900/60"
            >
              <LogOut size={15} />
            </Button>
          </div>
        </header>

        {/* BODY CONTENT */}
        <main className="admin-panel-shell p-4 sm:p-8 flex-1 space-y-6 max-w-7xl w-full mx-auto rounded-[28px] my-4 sm:my-6">
          {/* ===================================================================
              TAB 1: DASHBOARD & LIVE CHARTS (REMOVED DUMMY DATA)
             =================================================================== */}
          {currentTab === "dashboard" && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <Card className="hover:border-emerald-500/40 transition-colors">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        Total Courses
                      </div>
                      <div className="text-3xl font-extrabold text-white mt-1.5">
                        {courses.length}
                      </div>
                      <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                        <CheckCircle size={12} />
                        <span>All published catalog</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner">
                      <BookOpen size={22} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:border-emerald-500/40 transition-colors">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        Active Batches
                      </div>
                      <div className="text-3xl font-extrabold text-emerald-400 mt-1.5">
                        {courses.filter((c) => c.is_active).length}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-1">
                        {courses.length -
                          courses.filter((c) => c.is_active).length}{" "}
                        draft batches
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner">
                      <Activity size={22} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:border-emerald-500/40 transition-colors">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        Total Leads
                      </div>
                      <div className="text-3xl font-extrabold text-white mt-1.5">
                        {leads.length}
                      </div>
                      <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                        <Zap size={12} />
                        <span>Live Supabase sync</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner">
                      <TrendingUp size={22} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:border-emerald-500/40 transition-colors">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        Enrolled Ratio
                      </div>
                      <div className="text-3xl font-extrabold text-emerald-300 mt-1.5">
                        {leads.length > 0
                          ? `${Math.round(
                              (leads.filter((l) => l.status === "enrolled")
                                .length /
                                leads.length) *
                                100,
                            )}%`
                          : "0%"}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-1">
                        {leads.filter((l) => l.status === "enrolled").length}{" "}
                        enrolled students
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner">
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
                        <BarChart2 size={18} className="text-emerald-400" />
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
                            stroke="rgba(34, 197, 94, 0.08)"
                          />
                          <XAxis
                            dataKey="name"
                            stroke="#64748b"
                            fontSize={11}
                            tickLine={false}
                          />
                          <YAxis
                            stroke="#64748b"
                            fontSize={11}
                            allowDecimals={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#070c09",
                              borderColor: "rgba(74, 222, 128, 0.3)",
                              borderRadius: 12,
                              color: "#fff",
                              boxShadow: "0 0 20px rgba(0,0,0,0.8)",
                            }}
                            cursor={{ fill: "rgba(34, 197, 94, 0.05)" }}
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
                        <PieChartIcon size={18} className="text-emerald-400" />
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
                            stroke="rgba(34, 197, 94, 0.08)"
                          />
                          <XAxis
                            dataKey="name"
                            stroke="#64748b"
                            fontSize={11}
                            tickLine={false}
                          />
                          <YAxis
                            stroke="#64748b"
                            fontSize={11}
                            allowDecimals={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#070c09",
                              borderColor: "rgba(74, 222, 128, 0.3)",
                              borderRadius: 12,
                              color: "#fff",
                            }}
                            cursor={{ fill: "rgba(34, 197, 94, 0.05)" }}
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
                      <DollarSign size={18} className="text-emerald-400" />
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
                          stroke="rgba(34, 197, 94, 0.08)"
                        />
                        <XAxis
                          dataKey="title"
                          stroke="#64748b"
                          fontSize={11}
                          tickLine={false}
                        />
                        <YAxis stroke="#64748b" fontSize={11} />
                        <Tooltip
                          formatter={(value) => [
                            `৳${value.toLocaleString()}`,
                            "Tuition Fee",
                          ]}
                          contentStyle={{
                            backgroundColor: "#070c09",
                            borderColor: "rgba(74, 222, 128, 0.3)",
                            borderRadius: 12,
                            color: "#fff",
                          }}
                          cursor={{ fill: "rgba(34, 197, 94, 0.05)" }}
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
                      className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                    >
                      View CRM ({leads.length})
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#060a08] text-zinc-400 text-xs uppercase tracking-wider font-semibold border-b border-emerald-950/60">
                        <tr>
                          <th className="px-6 py-3.5">Student</th>
                          <th className="px-6 py-3.5">Course</th>
                          <th className="px-6 py-3.5">Status</th>
                          <th className="px-6 py-3.5 text-right">
                            Quick Contact
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-950/50">
                        {leads.slice(0, 5).map((l) => (
                          <tr
                            key={l.id}
                            className="hover:bg-emerald-950/20 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="font-bold text-white">
                                {l.full_name}
                              </div>
                              <div className="text-xs text-zinc-500">
                                {l.phone}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-zinc-300">
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
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 text-xs font-bold transition-all shadow-sm"
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
                              className="text-center py-10 text-zinc-500 text-sm"
                            >
                              <div className="flex flex-col items-center gap-2">
                                <Users size={28} className="text-zinc-600" />
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
                    className="absolute left-3.5 top-3 text-zinc-500"
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
                  <select
                    value={courseCategoryFilter}
                    onChange={(e) => setCourseCategoryFilter(e.target.value)}
                    className="bg-[#070b09] border border-emerald-950/80 text-xs text-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500"
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
                    className="gap-1.5 shrink-0 bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20"
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
                    className="overflow-hidden flex flex-col hover:border-emerald-500/50 transition-all group"
                  >
                    <div className="h-44 relative bg-black overflow-hidden">
                      <img
                        src={c.image_url || DEFAULT_COURSE_IMG}
                        alt={c.title_en}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_COURSE_IMG;
                        }}
                      />
                      <Badge
                        variant="outline"
                        className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border-zinc-700"
                      >
                        {c.category_en}
                      </Badge>
                      <button
                        onClick={(e) => toggleCourseStatus(c, e)}
                        className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all shadow-md ${
                          c.is_active
                            ? "bg-emerald-500 text-black shadow-emerald-500/25"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}
                        title="Click to toggle Active/Draft"
                      >
                        {c.is_active ? "● Active" : "○ Draft"}
                      </button>
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-white text-base leading-snug">
                        {c.title_en}
                      </h3>
                      <div className="text-xs text-zinc-400 mt-1 mb-3">
                        {c.title_bn}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="px-2 py-0.5 rounded-md text-xs bg-[#060a08] text-zinc-300 border border-emerald-950/60">
                          ⏱ {c.duration_en}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-xs bg-[#060a08] text-zinc-300 border border-emerald-950/60">
                          🎯 {c.level_en}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-xs bg-[#060a08] text-zinc-300 border border-emerald-950/60">
                          👥 {c.seats_en}
                        </span>
                      </div>

                      <div className="text-xs text-zinc-400 mb-4">
                        <strong className="text-zinc-300">Mentor:</strong>{" "}
                        {c.mentor_name}
                      </div>

                      <div className="flex items-baseline gap-2 mt-auto pt-3 border-t border-emerald-950/60">
                        <span className="text-2xl font-black text-emerald-400">
                          {c.price}
                        </span>
                        {c.discount_price && (
                          <span className="text-xs text-zinc-500 line-through">
                            {c.discount_price}
                          </span>
                        )}
                        <span className="ml-auto text-xs text-zinc-500">
                          {c.schedule_en}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-4 pt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openEditCourseModal(c)}
                          className="flex-1 gap-1.5 border border-emerald-500/20 text-emerald-300 hover:text-black hover:bg-emerald-400 hover:font-bold"
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
              <TabsList>
                {["hero", "story", "why", "voices", "faq", "cta"].map((sec) => (
                  <TabsTrigger
                    key={sec}
                    active={activeSectionKey === sec}
                    onClick={() => setActiveSectionKey(sec)}
                    className="capitalize"
                  >
                    {sec === "voices"
                      ? "Student Voices"
                      : sec === "cta"
                        ? "CTA Banner"
                        : sec}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* HERO SECTION EDITOR */}
              {activeSectionKey === "hero" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Hero Section Headline & Subtitle</CardTitle>
                      <CardDescription>
                        Edit rotating typography and introductory mission text
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => handleSaveSection("hero", sections.hero)}
                      disabled={savingKey === "hero"}
                      className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                    >
                      <Save size={16} />
                      <span>
                        {savingKey === "hero"
                          ? "Saving..."
                          : "Save Hero Section"}
                      </span>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label>Headline Words (EN, comma-separated)</Label>
                        <Input
                          type="text"
                          value={
                            sections.hero?.data_en?.headline_words?.join(
                              ", ",
                            ) || ""
                          }
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                data_en: {
                                  ...prev.hero?.data_en,
                                  headline_words: e.target.value
                                    .split(",")
                                    .map((s) => s.trim()),
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Headline Words (BN, comma-separated)</Label>
                        <Input
                          type="text"
                          value={
                            sections.hero?.data_bn?.headline_words?.join(
                              ", ",
                            ) || ""
                          }
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                data_bn: {
                                  ...prev.hero?.data_bn,
                                  headline_words: e.target.value
                                    .split(",")
                                    .map((s) => s.trim()),
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label>Hero Subtitle (EN)</Label>
                        <Textarea
                          rows={3}
                          value={sections.hero?.data_en?.subtitle || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                data_en: {
                                  ...prev.hero?.data_en,
                                  subtitle: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Hero Subtitle (BN)</Label>
                        <Textarea
                          rows={3}
                          value={sections.hero?.data_bn?.subtitle || ""}
                          onChange={(e) =>
                            setSections((prev) => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                data_bn: {
                                  ...prev.hero?.data_bn,
                                  subtitle: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button
                      onClick={() => handleSaveSection("hero", sections.hero)}
                      disabled={savingKey === "hero"}
                      className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                    >
                      <Save size={16} />
                      <span>
                        {savingKey === "hero"
                          ? "Saving..."
                          : "Save Hero Section"}
                      </span>
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* STORY SECTION EDITOR */}
              {activeSectionKey === "story" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Our Story & Philosophy</CardTitle>
                      <CardDescription>
                        Academy founding history and educational vision
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => handleSaveSection("story", sections.story)}
                      disabled={savingKey === "story"}
                      className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                    >
                      <Save size={16} />
                      <span>
                        {savingKey === "story"
                          ? "Saving..."
                          : "Save Story Section"}
                      </span>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-5">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label>Lead Text (EN)</Label>
                        <Textarea
                          rows={4}
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
                          rows={4}
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
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button
                      onClick={() => handleSaveSection("story", sections.story)}
                      disabled={savingKey === "story"}
                      className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
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
                      <CardTitle>Why Us Section</CardTitle>
                      <CardDescription>
                        Core value pillars and learning differentiators
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => handleSaveSection("why", sections.why)}
                      disabled={savingKey === "why"}
                      className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                    >
                      <Save size={16} />
                      <span>
                        {savingKey === "why" ? "Saving..." : "Save Why Us"}
                      </span>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-5">
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
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button
                      onClick={() => handleSaveSection("why", sections.why)}
                      disabled={savingKey === "why"}
                      className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                    >
                      <Save size={16} />
                      <span>
                        {savingKey === "why" ? "Saving..." : "Save Why Us"}
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
                        onClick={() =>
                          handleSaveSection("voices", sections.voices)
                        }
                        disabled={savingKey === "voices"}
                        className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
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
                    {(sections.voices?.data_en?.testimonials || []).map(
                      (t, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-[#060a08] border border-emerald-950/70 space-y-3 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-400">
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

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Student Name</Label>
                              <Input
                                type="text"
                                value={t.name || ""}
                                onChange={(e) => {
                                  const newTestimonials = [
                                    ...(sections.voices?.data_en
                                      ?.testimonials || []),
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
                              <Label>Role / Batch</Label>
                              <Input
                                type="text"
                                value={t.role || ""}
                                onChange={(e) => {
                                  const newTestimonials = [
                                    ...(sections.voices?.data_en
                                      ?.testimonials || []),
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
                          </div>
                          <div>
                            <Label>Quote</Label>
                            <Textarea
                              rows={2}
                              value={t.quote || ""}
                              onChange={(e) => {
                                const newTestimonials = [
                                  ...(sections.voices?.data_en?.testimonials ||
                                    []),
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
                        </div>
                      ),
                    )}
                    {(sections.voices?.data_en?.testimonials || []).length ===
                      0 && (
                      <div className="text-center py-8 text-zinc-500 text-sm">
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
                      className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
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

              {/* FAQ SECTION WITH ADD & DELETE CONTROLS */}
              {activeSectionKey === "faq" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Frequently Asked Questions</CardTitle>
                      <CardDescription>
                        Helpful answers for prospective student applicants
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
                        onClick={() => handleSaveSection("faq", sections.faq)}
                        disabled={savingKey === "faq"}
                        className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                      >
                        <Save size={16} />
                        <span>
                          {savingKey === "faq" ? "Saving..." : "Save FAQs"}
                        </span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(sections.faq?.data_en?.items || []).map((faq, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[#060a08] border border-emerald-950/70 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400">
                            FAQ Question #{idx + 1}
                          </span>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteFaq(idx)}
                            className="h-7 w-7 rounded-lg"
                            title="Delete FAQ"
                          >
                            <Trash2 size={13} />
                          </Button>
                        </div>
                        <div>
                          <Label>Question</Label>
                          <Input
                            type="text"
                            value={faq.q || ""}
                            onChange={(e) => {
                              const newFaqs = [
                                ...(sections.faq?.data_en?.items || []),
                              ];
                              newFaqs[idx] = {
                                ...newFaqs[idx],
                                q: e.target.value,
                              };
                              setSections((prev) => ({
                                ...prev,
                                faq: {
                                  ...prev.faq,
                                  data_en: {
                                    ...prev.faq?.data_en,
                                    items: newFaqs,
                                  },
                                },
                              }));
                            }}
                          />
                        </div>
                        <div>
                          <Label>Answer</Label>
                          <Textarea
                            rows={2}
                            value={faq.a || ""}
                            onChange={(e) => {
                              const newFaqs = [
                                ...(sections.faq?.data_en?.items || []),
                              ];
                              newFaqs[idx] = {
                                ...newFaqs[idx],
                                a: e.target.value,
                              };
                              setSections((prev) => ({
                                ...prev,
                                faq: {
                                  ...prev.faq,
                                  data_en: {
                                    ...prev.faq?.data_en,
                                    items: newFaqs,
                                  },
                                },
                              }));
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button
                      onClick={() => handleSaveSection("faq", sections.faq)}
                      disabled={savingKey === "faq"}
                      className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
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
                      <CardTitle>Call To Action Banner</CardTitle>
                      <CardDescription>
                        Bottom conversion trigger and reservation prompt
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => handleSaveSection("cta", sections.cta)}
                      disabled={savingKey === "cta"}
                      className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                    >
                      <Save size={16} />
                      <span>
                        {savingKey === "cta" ? "Saving..." : "Save CTA Banner"}
                      </span>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-5">
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
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button
                      onClick={() => handleSaveSection("cta", sections.cta)}
                      disabled={savingKey === "cta"}
                      className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
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
              TAB 4: CONTACT & WHATSAPP CONFIGURATION
             =================================================================== */}
          {currentTab === "contact" && settings && (
            <form onSubmit={handleSaveContact} className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>WhatsApp & Phone Channels</CardTitle>
                    <CardDescription>
                      Manage numbers, click-to-chat welcome text & customer
                      support timing
                    </CardDescription>
                  </div>
                  <Button
                    type="submit"
                    disabled={savingKey === "contact"}
                    className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                  >
                    <Save size={16} />
                    <span>
                      {savingKey === "contact"
                        ? "Saving..."
                        : "Save Contact Settings"}
                    </span>
                  </Button>
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
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <div className="font-bold text-emerald-400 text-sm">
                          Live WhatsApp Link Preview
                        </div>
                        <div className="text-xs text-zinc-400 font-mono mt-0.5">
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
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md shadow-emerald-500/25 transition-all"
                      >
                        <Send size={13} />
                        <span>Test WhatsApp Link</span>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Location & Social Links Card */}
              <Card>
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
                    className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
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
                  <h2 className="text-base font-bold text-white">
                    Academy Faculty Mentors
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Instructor profiles, specialties and designations
                  </p>
                </div>
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
                  className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20"
                >
                  <Plus size={16} />
                  <span>Add Faculty Mentor</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mentors.map((m) => (
                  <Card
                    key={m.id}
                    className="p-6 text-center flex flex-col items-center hover:border-emerald-500/40 transition-colors"
                  >
                    <img
                      src={m.avatar_url || DEFAULT_AVATAR_IMG}
                      alt={m.name_en}
                      className="w-20 h-20 rounded-full object-cover border-2 border-emerald-400 mb-4 shadow-[0_0_15px_rgba(74,222,128,0.25)]"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR_IMG;
                      }}
                    />
                    <h3 className="font-bold text-white text-base">
                      {m.name_en}
                    </h3>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      {m.name_bn}
                    </div>
                    <div className="text-xs font-semibold text-emerald-400 mt-2">
                      {m.designation_en}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 mb-4">
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
                        className="flex-1 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black font-semibold"
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
                  <h2 className="text-base font-bold text-white">
                    Student Leads & Inquiries CRM
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage enrollment applications, chat on WhatsApp & record
                    follow-up notes
                  </p>
                </div>
                <div className="flex items-center gap-2">
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
                    className="gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20"
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
                    className="absolute left-3.5 top-3 text-zinc-500"
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
                    className="bg-[#070b09] border border-emerald-950/80 text-xs text-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500"
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
                      <thead className="bg-[#060a08] text-zinc-400 text-xs uppercase tracking-wider font-semibold border-b border-emerald-950/60">
                        <tr>
                          <th className="px-6 py-3.5">Applicant</th>
                          <th className="px-6 py-3.5">Contact</th>
                          <th className="px-6 py-3.5">Course</th>
                          <th className="px-6 py-3.5">Status</th>
                          <th className="px-6 py-3.5">Counsellor Notes</th>
                          <th className="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-950/50">
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
                              className="hover:bg-emerald-950/20 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="font-bold text-white">
                                  {lead.full_name}
                                </div>
                                <div className="text-xs text-zinc-500">
                                  {new Date(lead.created_at).toLocaleString()}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-medium text-zinc-200">
                                  {lead.phone}
                                </div>
                                <div className="text-xs text-zinc-400">
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
                                  className="bg-black border border-emerald-950/80 text-xs text-zinc-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 font-semibold"
                                >
                                  <option value="new">New</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="enrolled">Enrolled</option>
                                  <option value="closed">Closed</option>
                                </select>
                              </td>
                              <td className="px-6 py-4">
                                <div
                                  className="text-xs text-zinc-400 max-w-[200px] truncate cursor-pointer hover:text-emerald-300"
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
                                    className="bg-emerald-500/15 hover:bg-emerald-500 hover:text-black text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border border-emerald-500/30"
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
                              className="text-center py-12 text-zinc-500 text-sm"
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
                  <h2 className="text-base font-bold text-white">
                    Supabase Storage Bucket: &quot;onushilon&quot;
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    {media.length} files currently stored and publicly served
                    from cloud CDN
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search
                      size={15}
                      className="absolute left-3 top-2.5 text-zinc-500"
                    />
                    <Input
                      type="text"
                      placeholder="Search files..."
                      value={mediaSearch}
                      onChange={(e) => setMediaSearch(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                  <label className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-emerald-500/20 shrink-0">
                    <Upload size={14} />
                    <span>Upload New</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGeneralMediaUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Folder Filter Tabs */}
              <TabsList>
                {["all", "courses", "moments", "photos", "general"].map(
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
                    className="overflow-hidden group hover:border-emerald-500/50 transition-all flex flex-col"
                  >
                    <div
                      className="h-32 bg-black overflow-hidden relative flex items-center justify-center cursor-pointer"
                      onClick={() => setPreviewMedia(m)}
                    >
                      <img
                        src={m.publicUrl}
                        alt={m.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye size={20} className="text-white drop-shadow-md" />
                      </div>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div
                          className="text-xs font-bold text-white truncate"
                          title={m.name}
                        >
                          {m.name}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">
                          {m.size
                            ? `${(m.size / 1024).toFixed(1)} KB`
                            : "Supabase Cloud Asset"}
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copyToClipboard(m.publicUrl)}
                        className="w-full mt-3 h-7 text-[11px] gap-1 font-semibold border-emerald-950 hover:bg-emerald-500 hover:text-black"
                      >
                        {copiedUrl === m.publicUrl ? (
                          <Check size={12} className="text-emerald-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                        <span>
                          {copiedUrl === m.publicUrl ? "Copied!" : "Copy URL"}
                        </span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredMedia.length === 0 && (
                <div className="text-center py-16 text-zinc-500">
                  <HardDrive size={36} className="mx-auto text-zinc-600 mb-2" />
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
        <DialogContent className="max-w-3xl">
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
                className="gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
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
          <div className="px-6 pt-3 pb-0 border-b border-emerald-950/60 bg-[#060907]/60">
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
                        className="w-full bg-[#060a08] border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
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
                      className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
                    />
                    <label
                      htmlFor="course-active-box"
                      className="text-sm font-medium text-zinc-300 cursor-pointer"
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
                        className="bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-black font-semibold"
                      >
                        Add Topic
                      </Button>
                    </div>
                  </div>

                  {topicsEn.length > 0 && (
                    <div className="space-y-2">
                      <Label>Current Topics ({topicsEn.length})</Label>
                      <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-[#060a08] border border-emerald-950/70">
                        {topicsEn.map((top, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
                          >
                            <span>{top}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setTopicsEn(
                                  topicsEn.filter((_, i) => i !== idx),
                                )
                              }
                              className="text-zinc-400 hover:text-rose-400"
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
                  <div className="p-5 rounded-2xl border border-dashed border-emerald-950/80 bg-[#060a08] text-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-950/60 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                      <Upload size={22} />
                    </div>
                    <div className="text-sm font-semibold text-white">
                      Upload Thumbnail to Supabase Bucket
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 mb-4">
                      Direct cloud upload into &quot;onushilon&quot; storage
                      bucket
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold cursor-pointer shadow-md shadow-emerald-500/20 transition-all">
                      <span>
                        {savingKey === "course-img"
                          ? "Uploading to Cloud..."
                          : "Browse Image File"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCourseImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

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
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-[#060a08] border border-emerald-950/70">
                      <img
                        src={courseForm.image_url}
                        alt="Preview"
                        className="w-20 h-14 object-cover rounded-lg border border-emerald-950"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_COURSE_IMG;
                        }}
                      />
                      <div className="flex-1 truncate">
                        <div className="text-xs font-semibold text-emerald-400">
                          Current Thumbnail
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono truncate">
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
                className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
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
        <DialogContent className="max-w-lg">
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
                  className="w-full bg-[#060a08] border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
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
              <div className="flex items-center gap-4 p-3 rounded-xl bg-[#060a08] border border-emerald-950/70">
                <img
                  src={mentorForm.avatar_url || DEFAULT_AVATAR_IMG}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_AVATAR_IMG;
                  }}
                />
                <div className="flex-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 text-xs font-bold cursor-pointer transition-all">
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
                      className="hidden"
                    />
                  </label>
                  <div className="text-[10px] text-zinc-400 mt-1 truncate max-w-[240px] font-mono">
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
                className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
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
        <DialogContent className="max-w-md">
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
                className="w-full bg-[#060a08] border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
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
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
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
        <DialogContent className="max-w-md">
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
              <div className="p-3.5 rounded-xl bg-[#060a08] border border-emerald-950/70 text-xs space-y-1">
                <div className="font-bold text-white text-sm">
                  {leadNotesModal.lead.full_name}
                </div>
                <div className="text-zinc-400">
                  Phone: {leadNotesModal.lead.phone}
                </div>
                <div className="text-emerald-400 font-semibold">
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
              className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
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
              <div className="max-h-[60vh] overflow-hidden rounded-xl border border-emerald-950/80 bg-black flex items-center justify-center">
                <img
                  src={previewMedia.publicUrl}
                  alt={previewMedia.name}
                  className="max-h-[60vh] max-w-full object-contain"
                />
              </div>
              <div className="w-full mt-4 flex items-center justify-between gap-3">
                <div className="text-xs text-zinc-400 font-mono truncate max-w-[350px]">
                  {previewMedia.publicUrl}
                </div>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(previewMedia.publicUrl)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold shrink-0"
                >
                  <Copy size={13} className="mr-1" />
                  <span>Copy CDN URL</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

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
        <div className="fixed bottom-6 right-6 px-4 py-3 bg-[#0a0f0d] border border-emerald-500/40 rounded-2xl text-white shadow-[0_0_30px_rgba(0,0,0,0.85)] flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {toast.type === "error" ? (
            <AlertCircle size={18} className="text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-zinc-500 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
