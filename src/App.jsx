import React, { useEffect, useMemo, useRef, useState } from "react";
import { buttonClasses } from "./design-system";
import { api } from "./api";
import {
  Search,
  MapPin,
  Users,
  ChevronRight,
  Image as ImageIcon,
  MessageSquare,
  LayoutDashboard,
  Star,
  CheckCircle,
  TrendingUp,
  Plus,
  Settings,
  BarChart3,
  ShieldCheck,
  Globe,
  ArrowUpRight,
  Clock,
  Bell,
  Eye,
  UploadCloud,
  GripHorizontal,
  LogOut,
  Sliders,
  ArrowRight,
  ArrowLeft,
  UtensilsCrossed,
  Camera,
  Clapperboard,
  Music4,
  Flower2,
  ClipboardList,
  Building2,
  Sparkles,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  X,
  CarFront,
  Shield,
  CalendarDays,
  Menu,
  ChevronLeft,
  FileText,
  CreditCard,
  MoreVertical,
  Flag,
  Pencil,
  Trash2
} from "lucide-react";

const sessionKey = "eventsphere_session";
const EMAIL_TEST_RECIPIENT = "incmanila@gmail.com";

const DEFAULT_QUOTE_SETTINGS = {
  legalName: "Golden Beats DJ Services",
  businessAddress: "Mississauga, ON",
  quotePrefix: "GB-QUOTE-",
  taxNumber: "",
  expiryDays: "14",
  footerNote: "Thank you for considering us for your event. This quote is subject to date availability until confirmed by both parties.",
  replyToEmail: ""
};

const DEFAULT_ADMIN_SETTINGS = {
  workspaceName: "Event Sphere Admin",
  legalBusinessName: "Event Sphere Marketplace Inc.",
  tagline: "Canada's premier multicultural event marketplace",
  supportEmail: "ops@eventsphere.co",
  supportPhone: "+1 (647) 555-0198",
  billingEmail: "finance@eventsphere.co",
  operationsCity: "Toronto, ON",
  defaultProvince: "Ontario",
  reviewSla: "48 hours",
  requestEscalationWindow: "24 hours",
  requestInboxOwner: "Operations team",
  requestAutoCloseDays: "14",
  applicationReviewOwner: "Marketplace quality team",
  requireApprovalBeforePublish: true,
  requireFeaturedApproval: true,
  requireBusinessVerification: true,
  requirePortfolioBeforeReview: true,
  featuredSlotLimit: "12",
  homepageFeatureWindow: "14 days",
  openRegistration: true,
  autoFeatureTopVendors: false,
  maintenanceMode: false,
  maxImagesPerVendor: "30 images",
  maxVideoLinksPerVendor: "4 videos",
  adminAlertNewVendorSubmission: true,
  adminAlertVendorProfileEdits: false,
  weeklyDigestEmail: true,
  digestDay: "Monday",
  adminAlertEmail: "admin@eventsphere.co",
  vendorApprovalConfirmation: true,
  vendorRejectionNotice: true,
  vendorRequestStatusEmails: true,
  requireEmailVerification: true,
  allowSocialLogin: true,
  requireTwoFactorForAdmins: false,
  sessionTimeout: "1 day",
  maxLoginAttempts: "5 attempts",
  enableIpAllowList: false,
  platformApiKey: "es_admin_x9k2••••••••",
  homeHeroStyle: "Search-First",
  listingsPerPage: "24 per page",
  showFeaturedBadge: true,
  showStartingPrices: true,
  showYearsInBusiness: true,
  enableMapView: false,
  brandColor: "black",
  profanityFilter: true,
  requirePhoneNumber: false,
  requireWebsite: false,
  allowVendorVideoLinks: true,
  autoRejectIncompleteSubmissions: false,
  minDescriptionLength: "100 chars",
  maxDescriptionLength: "2000 chars"
};

const DEFAULT_ADMIN_ROLE_PERMISSIONS = {
  Owner: {
    vendors: true,
    applications: true,
    requests: true,
    reviews: true,
    analytics: true,
    featured: true,
    audit: true,
    permissions: true,
    settings: true
  },
  Operations: {
    vendors: true,
    applications: true,
    requests: true,
    reviews: true,
    analytics: true,
    featured: true,
    audit: true,
    permissions: false,
    settings: false
  },
  Support: {
    vendors: true,
    applications: false,
    requests: true,
    reviews: false,
    analytics: false,
    featured: false,
    audit: true,
    permissions: false,
    settings: false
  }
};

const ADMIN_PERMISSION_LABELS = [
  ["vendors", "Vendor directory"],
  ["applications", "Vendor applications"],
  ["requests", "Requests and messaging"],
  ["reviews", "Review moderation"],
  ["analytics", "Marketplace analytics"],
  ["featured", "Featured placements"],
  ["audit", "Audit log"],
  ["permissions", "Permission management"],
  ["settings", "Admin settings"]
];

const DEFAULT_VENDOR_POLICY_DRAFT = {
  parkingMode: "Street parking nearby",
  parkingSummary: "Street parking is available nearby. Loading access and vendor arrival timing can be coordinated in advance for larger setups.",
  parkingOptions: ["Street parking", "Loading zone access"],
  vendorRules:
    "No smoking inside. Outside vendors must respect setup windows, cleanup timing, and any site-specific decor restrictions confirmed before the event date.",
  bookingPolicyTitle: "Booking retainer required",
  bookingPolicyBody:
    "Dates are secured after a signed quote and booking retainer. Final scope, guest count, service timing, and any on-site requirements are confirmed before the event week.",
  cancellationPolicyTitle: "Flexible",
  cancellationPolicyBody:
    "Cancellations made with strong advance notice may be rescheduled based on availability. Late cancellations may still be charged for prep time, staffing, or non-recoverable event costs.",
  refundPolicyBody:
    "Retainers are typically non-refundable once planning or prep work begins. Any partial refund depends on notice period, committed costs, and the final service agreement.",
  healthSafetyMeasures: [
    "Cleaned between bookings",
    "Vendor arrival windows coordinated",
    "Clear setup and teardown timing",
    "Accessible communication before event day"
  ],
  includedFeatures: [
    "Setup included",
    "Direct coordination",
    "On-site support",
    "Flexible packages"
  ]
};

const PARKING_MODE_OPTIONS = [
  "Street parking nearby",
  "On-site parking lot",
  "Valet available",
  "Client to confirm",
  "Not provided"
];

const PARKING_OPTION_CHOICES = [
  "Street parking",
  "On-site parking",
  "Valet available",
  "Loading zone access",
  "Vendor unloading access",
  "Wheelchair access",
  "Paid parking nearby"
];

const INCLUDED_FEATURE_CHOICES = [
  "Setup included",
  "Teardown included",
  "On-site support",
  "Direct coordination",
  "Large event experience",
  "Travel within city included",
  "Custom packages available",
  "Consultation included",
  "Equipment included",
  "Delivery included"
];

const HEALTH_SAFETY_CHOICES = [
  "Cleaned between bookings",
  "Vendor arrival windows coordinated",
  "Clear setup and teardown timing",
  "Accessible communication before event day",
  "Insured team on request",
  "Food-safe handling procedures",
  "Electrical setup reviewed in advance",
  "Emergency contact available"
];

const BOOKING_POLICY_OPTIONS = [
  "Booking retainer required",
  "Signed quote required",
  "Consultation first",
  "Custom contract required"
];

const CANCELLATION_POLICY_OPTIONS = [
  "Flexible",
  "Moderate",
  "Firm",
  "Custom terms"
];

const IMG_HERO =
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1920";
const IMG_DECOR =
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800";
const IMG_FOOD =
  "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800";
const IMG_VENUE =
  "https://images.unsplash.com/photo-1505932794465-147d1f1b2c97?auto=format&fit=crop&q=80&w=800";
const IMG_DJ =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800";
const IMG_EDITORIAL =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200";
const IMG_AVATAR1 =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150";
const IMG_AVATAR2 =
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150";
const IMG_GALLERY1 =
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800";
const IMG_GALLERY2 =
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800";
const IMG_PHOTOGRAPHY =
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200";
const IMG_VIDEOGRAPHY =
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200";
const IMG_EVENT_PLANNING =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200";
const IMG_RENTALS =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200";
const IMG_MAKEUP =
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=1200";

const categoryImages = {
  venue: IMG_VENUE,
  venues: IMG_VENUE,
  catering: IMG_FOOD,
  food: IMG_FOOD,
  decor: IMG_DECOR,
  floral: IMG_DECOR,
  entertainment: IMG_DJ,
  dj: IMG_DJ,
  photography: IMG_PHOTOGRAPHY,
  videography: IMG_VIDEOGRAPHY,
  video: IMG_VIDEOGRAPHY,
  planner: IMG_EVENT_PLANNING,
  planning: IMG_EVENT_PLANNING,
  rental: IMG_RENTALS,
  rentals: IMG_RENTALS,
  makeup: IMG_MAKEUP,
  beauty: IMG_MAKEUP,
  styling: IMG_MAKEUP
};

const HERO_SLIDES = [
  {
    image: IMG_HERO,
    label: "Wedding reception",
    title: "Curating culture."
  },
  {
    image: IMG_EDITORIAL,
    label: "Ceremony design",
    title: "Find your people."
  },
  {
    image: IMG_DECOR,
    label: "Event styling",
    title: "Bring the room to life."
  },
  {
    image: IMG_VENUE,
    label: "Venue sourcing",
    title: "Start with the right space."
  }
];

const CANADIAN_CITY_OPTIONS = [
  "Toronto, ON",
  "Mississauga, ON",
  "Brampton, ON",
  "Vaughan, ON",
  "Markham, ON",
  "Richmond Hill, ON",
  "Oakville, ON",
  "Burlington, ON",
  "Hamilton, ON",
  "Kitchener, ON",
  "Waterloo, ON",
  "London, ON",
  "Ottawa, ON",
  "Windsor, ON",
  "Montreal, QC",
  "Laval, QC",
  "Quebec City, QC",
  "Gatineau, QC",
  "Vancouver, BC",
  "Surrey, BC",
  "Burnaby, BC",
  "Richmond, BC",
  "Victoria, BC",
  "Calgary, AB",
  "Edmonton, AB",
  "Red Deer, AB",
  "Winnipeg, MB",
  "Regina, SK",
  "Saskatoon, SK",
  "Halifax, NS",
  "Moncton, NB",
  "Fredericton, NB",
  "Saint John, NB",
  "St. John's, NL",
  "Charlottetown, PE",
  "Whitehorse, YT",
  "Yellowknife, NT",
  "Iqaluit, NU"
];

const DEFAULT_ADMIN_REQUEST_STATUSES = [
  { key: "pending", label: "Pending", tone: "amber", system: true },
  { key: "in-progress", label: "In progress", tone: "blue", system: true },
  { key: "flagged", label: "Flagged", tone: "red", system: true },
  { key: "completed", label: "Completed", tone: "green", system: true }
];

const DEFAULT_ADMIN_APPLICATION_STATUSES = [
  { key: "pending", label: "Pending", tone: "amber", system: true },
  { key: "under-review", label: "Under review", tone: "blue", system: true },
  { key: "approved", label: "Approved", tone: "green", system: true },
  { key: "restricted", label: "Restricted", tone: "red", system: true },
  { key: "rejected", label: "Rejected", tone: "red", system: true }
];

function createStatusKey(label = "") {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findStatusMeta(statuses, key, fallbackLabel) {
  return statuses.find((item) => item.key === key) || (fallbackLabel ? { key: key || createStatusKey(fallbackLabel), label: fallbackLabel, tone: "neutral" } : null);
}

function statusToneChipClass(tone = "neutral") {
  if (tone === "green") return "border-green-200 bg-green-50 text-green-700";
  if (tone === "red") return "border-red-200 bg-red-50 text-red-700";
  if (tone === "blue") return "border-blue-200 bg-blue-50 text-blue-700";
  if (tone === "amber") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-neutral-200 bg-neutral-50 text-neutral-700";
}

function flagButtonClass(active = false) {
  return `inline-flex h-10 w-10 items-center justify-center rounded-md border transition-colors ${
    active
      ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
      : "border-neutral-200 bg-white text-neutral-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
  }`;
}

function money(value) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0
  }).format(value || 0);
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
}

function parseMonthKey(key) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "long",
    year: "numeric"
  }).format(date);
}

function formatDateLabel(value) {
  if (!value) return "Any time";
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function formatActivityDate(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function buildCalendarMonth(monthDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingSlots = firstDay.getDay();
  const slots = Array.from({ length: leadingSlots }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    slots.push({
      day,
      iso: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      disabled: date < today
    });
  }

  return slots;
}

const initialAdminRequestRecords = [
  {
    id: "support-payment-issue",
    requester: "Golden Beats DJ Services",
    requesterSlug: "golden-beats-dj-services",
    subject: "Payment setup support",
    type: "Support ticket",
    priority: "High",
    age: "18m ago",
    dateRank: 1,
    email: "accounts@goldenbeats.ca",
    message: "Vendor cannot finish payout setup because the bank verification status is stuck in review. They need support before sending new quotes.",
    status: "pending"
  },
  {
    id: "help-calendar-sync",
    requester: "Luxe Decor Studio",
    requesterSlug: "luxe-decor-studio",
    subject: "Calendar sync assistance",
    type: "Help request",
    priority: "Medium",
    age: "42m ago",
    dateRank: 2,
    email: "studio@luxedecor.ca",
    message: "Vendor wants help connecting Google Calendar availability so unavailable dates stop showing on the public profile.",
    status: "pending"
  },
  {
    id: "feature-team-permissions",
    requester: "Atlas Event Rentals",
    requesterSlug: "atlas-event-rentals",
    subject: "Team permissions request",
    type: "Feature request",
    priority: "Normal",
    age: "2h ago",
    dateRank: 3,
    email: "ops@atlasevents.ca",
    message: "Vendor asked for multi-user permissions so staff can manage leads without accessing account security settings.",
    status: "pending"
  },
  {
    id: "assistance-media-upload",
    requester: "Soles N Shades",
    requesterSlug: "soles-n-shades",
    subject: "Media upload assistance",
    type: "Assistance request",
    priority: "Normal",
    age: "4h ago",
    dateRank: 4,
    email: "hello@solesnshades.ca",
    message: "Vendor reports that gallery images upload but do not appear in the order they selected. They need help before publishing updates.",
    status: "flagged"
  }
];

const initialReviewRequestRecords = [
  {
    id: "review-request-goldenbeats-1",
    vendorSlug: "golden-beats-dj-services",
    vendorName: "Golden Beats DJ Services",
    clientName: "Amina O.",
    clientEmail: "amina.owusu@example.com",
    eventType: "Wedding reception",
    sentAt: "June 10, 2026",
    status: "submitted",
    source: "Email link"
  },
  {
    id: "review-request-goldenbeats-2",
    vendorSlug: "golden-beats-dj-services",
    vendorName: "Golden Beats DJ Services",
    clientName: "Daniel K.",
    clientEmail: "daniel.kim@example.com",
    eventType: "Corporate gala",
    sentAt: "May 14, 2026",
    status: "approved",
    source: "Email link"
  }
];

const initialReviewRecords = [
  {
    id: "review-goldenbeats-1",
    requestId: "review-request-goldenbeats-1",
    vendorSlug: "golden-beats-dj-services",
    vendorName: "Golden Beats DJ Services",
    reviewerName: "Amina O.",
    reviewerRole: "Bride",
    eventType: "Wedding reception",
    rating: 5,
    body: "The team kept the whole reception moving smoothly, handled our mixed playlist perfectly, and felt organized from the first call to the last song.",
    wouldBookAgain: true,
    status: "pending",
    submittedAt: "June 13, 2026",
    image: IMG_AVATAR1
  },
  {
    id: "review-goldenbeats-2",
    requestId: "review-request-goldenbeats-2",
    vendorSlug: "golden-beats-dj-services",
    vendorName: "Golden Beats DJ Services",
    reviewerName: "Daniel K.",
    reviewerRole: "Event manager",
    eventType: "Corporate gala",
    rating: 5,
    body: "Professional, responsive, and easy to coordinate with. The transitions and announcement timing were excellent throughout the gala.",
    wouldBookAgain: true,
    status: "approved",
    submittedAt: "May 18, 2026",
    image: IMG_AVATAR2
  }
];

function reviewStatusMeta(status = "pending") {
  if (status === "approved") return { label: "Approved", tone: "green" };
  if (status === "hidden") return { label: "Hidden", tone: "neutral" };
  if (status === "rejected") return { label: "Rejected", tone: "red" };
  if (status === "flagged") return { label: "Flagged", tone: "red" };
  return { label: "Pending", tone: "amber" };
}

function reviewRequestStatusMeta(status = "sent") {
  if (status === "approved") return { label: "Approved", tone: "green" };
  if (status === "rejected") return { label: "Rejected", tone: "red" };
  if (status === "hidden") return { label: "Hidden", tone: "neutral" };
  if (status === "submitted") return { label: "Submitted", tone: "blue" };
  return { label: "Sent", tone: "amber" };
}

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(sessionKey) || "null");
  } catch {
    return null;
  }
}

function writeSession(session) {
  localStorage.setItem(sessionKey, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(sessionKey);
}

function readSupabaseHashSession() {
  if (typeof window === "undefined" || !window.location.hash) return null;
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const accessToken = params.get("access_token") || "";
  if (!accessToken) return null;

  return {
    accessToken,
    refreshToken: params.get("refresh_token") || "",
    type: params.get("type") || ""
  };
}

function enrichSessionPayload(payload = {}) {
  return {
    name: payload.name || "",
    email: payload.email || "",
    role: payload.role || "vendor",
    vendorSlug: payload.vendorSlug || null,
    accessToken: payload.accessToken || "",
    refreshToken: payload.refreshToken || "",
    authProvider: payload.authProvider || payload.provider || "",
    authUserId: payload.authUserId || payload.userId || null
  };
}

function portalRoleLabel(portal) {
  return portal === "admin" ? "admin" : "vendor";
}

function sessionCanAccessPortal(session, portal) {
  if (!session) return false;
  if (portal === "admin") return session.role === "admin";
  if (portal === "vendor") return session.role === "vendor";
  return true;
}

function imageForCategory(name = "") {
  const key = name.toLowerCase();
  return Object.entries(categoryImages).find(([term]) => key.includes(term))?.[1] || IMG_EDITORIAL;
}

function iconForCategory(name = "") {
  const key = name.toLowerCase();

  if (key.includes("cater") || key.includes("food")) return UtensilsCrossed;
  if (key.includes("photo")) return Camera;
  if (key.includes("video")) return Clapperboard;
  if (key.includes("dj") || key.includes("music") || key.includes("entertain") || key.includes("mc")) return Music4;
  if (key.includes("decor") || key.includes("floral")) return Flower2;
  if (key.includes("plan")) return ClipboardList;
  if (key.includes("venue") || key.includes("space") || key.includes("rental") || key.includes("hall")) return Building2;
  if (key.includes("makeup") || key.includes("beauty") || key.includes("style")) return Sparkles;

  return ImageIcon;
}

function HeroBackgroundSlideshow() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === activeSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <SafeImage src={slide.image} alt={slide.label} className="w-full h-full object-cover" fallback={IMG_EDITORIAL} />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/45 to-transparent" />
      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.label}
            type="button"
            onClick={() => setActiveSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeSlide ? "w-10 bg-white" : "w-4 bg-white/45 hover:bg-white/70"
            }`}
            aria-label={`Show ${slide.label}`}
          />
        ))}
      </div>
    </div>
  );
}

function normalizeService(service = {}, index = 0, vendor = {}) {
  return {
    id: service.id || `service-${index + 1}`,
    name: service.name || service.title || vendor.category || `Service ${index + 1}`,
    area: service.area || service.serviceArea || vendor.city || "",
    priceFrom: service.priceFrom ?? vendor.priceFrom ?? "",
    turnaround: service.turnaround || "Custom quote",
    description: service.description || vendor.description || ""
  };
}

function buildDefaultServices(vendor = {}) {
  if (Array.isArray(vendor.servicePackages) && vendor.servicePackages.length) {
    return vendor.servicePackages.map((service, index) => normalizeService(service, index, vendor));
  }

  return [];
}

function uniqueStringArray(items = []) {
  return [...new Set((Array.isArray(items) ? items : []).map((item) => String(item || "").trim()).filter(Boolean))];
}

function createVendorPolicyDraft(source = {}) {
  return {
    parkingMode: source.parkingMode || DEFAULT_VENDOR_POLICY_DRAFT.parkingMode,
    parkingSummary: source.parkingSummary || DEFAULT_VENDOR_POLICY_DRAFT.parkingSummary,
    parkingOptions: uniqueStringArray(source.parkingOptions?.length ? source.parkingOptions : DEFAULT_VENDOR_POLICY_DRAFT.parkingOptions),
    vendorRules: source.vendorRules || DEFAULT_VENDOR_POLICY_DRAFT.vendorRules,
    bookingPolicyTitle: source.bookingPolicyTitle || DEFAULT_VENDOR_POLICY_DRAFT.bookingPolicyTitle,
    bookingPolicyBody: source.bookingPolicyBody || DEFAULT_VENDOR_POLICY_DRAFT.bookingPolicyBody,
    cancellationPolicyTitle: source.cancellationPolicyTitle || DEFAULT_VENDOR_POLICY_DRAFT.cancellationPolicyTitle,
    cancellationPolicyBody: source.cancellationPolicyBody || DEFAULT_VENDOR_POLICY_DRAFT.cancellationPolicyBody,
    refundPolicyBody: source.refundPolicyBody || DEFAULT_VENDOR_POLICY_DRAFT.refundPolicyBody,
    healthSafetyMeasures: uniqueStringArray(source.healthSafetyMeasures?.length ? source.healthSafetyMeasures : DEFAULT_VENDOR_POLICY_DRAFT.healthSafetyMeasures),
    includedFeatures: uniqueStringArray(source.includedFeatures?.length ? source.includedFeatures : DEFAULT_VENDOR_POLICY_DRAFT.includedFeatures)
  };
}

function createVendorPolicyLibrary(source = []) {
  const fallback = [
    {
      id: "policy-booking",
      category: "Booking policy",
      title: DEFAULT_VENDOR_POLICY_DRAFT.bookingPolicyTitle,
      body: DEFAULT_VENDOR_POLICY_DRAFT.bookingPolicyBody
    },
    {
      id: "policy-cancellation",
      category: "Cancellation policy",
      title: DEFAULT_VENDOR_POLICY_DRAFT.cancellationPolicyTitle,
      body: DEFAULT_VENDOR_POLICY_DRAFT.cancellationPolicyBody
    },
    {
      id: "policy-refund",
      category: "Refund policy",
      title: "Refund terms",
      body: DEFAULT_VENDOR_POLICY_DRAFT.refundPolicyBody
    },
    {
      id: "policy-house-rules",
      category: "House rules",
      title: "Vendor rules",
      body: DEFAULT_VENDOR_POLICY_DRAFT.vendorRules
    }
  ];

  const items = Array.isArray(source) && source.length ? source : fallback;
  return items
    .map((item, index) => ({
      id: item.id || `policy-${index + 1}`,
      category: item.category || "Custom policy",
      title: item.title || `Policy ${index + 1}`,
      body: item.body || "",
      scope: item.scope || "All listings"
    }))
    .filter((item) => item.title || item.body);
}

function ratingStars(value = 4.8) {
  const rounded = Math.round(value);
  return Array.from({ length: 5 }, (_, index) => (
    <Star key={index} size={10} fill={index < rounded ? "currentColor" : "none"} />
  ));
}

function listingCapacityMax(capacity) {
  const matches = String(capacity || "").match(/\d+/g);
  if (!matches?.length) return null;
  return Math.max(...matches.map(Number));
}

function SafeImage({ src, alt, fallback = IMG_EDITORIAL, className = "" }) {
  const [currentSrc, setCurrentSrc] = useState(src || fallback);

  useEffect(() => {
    setCurrentSrc(src || fallback);
  }, [src, fallback]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (currentSrc !== fallback) {
          setCurrentSrc(fallback);
        }
      }}
    />
  );
}

function TikTokThumbnailButton({ clip, fallback, onLoad }) {
  const [thumbnail, setThumbnail] = useState("");

  useEffect(() => {
    let active = true;

    async function loadThumbnail() {
      try {
        const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(clip.url)}`);
        if (!response.ok) return;
        const payload = await response.json();
        if (active && payload.thumbnail_url) {
          setThumbnail(payload.thumbnail_url);
        }
      } catch (error) {
        if (active) {
          setThumbnail("");
        }
      }
    }

    loadThumbnail();

    return () => {
      active = false;
    };
  }, [clip.url]);

  return (
    <button
      type="button"
      onClick={onLoad}
      className="absolute inset-0 overflow-hidden bg-neutral-100 text-black"
      aria-label={`Load ${clip.title}`}
    >
      <SafeImage
        src={thumbnail || fallback}
        alt={clip.title}
        fallback={fallback}
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0 bg-black/10" />
      <span className="absolute left-4 top-4 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-black">
        TikTok
      </span>
      <span className="absolute left-1/2 top-1/2 inline-flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg md:h-14 md:w-14">
        <Clapperboard size={18} className="md:h-6 md:w-6" />
      </span>
    </button>
  );
}

function ActivityIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function InstagramIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function XSocialIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function FacebookIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 8.2V6.8c0-.9.6-1.4 1.5-1.4H18V2.2C17.4 2.1 16.4 2 15.2 2 12.6 2 11 3.6 11 6.5v1.7H8v3.6h3V22h3.8V11.8h3l.5-3.6H14Z"
        fill="currentColor"
      />
    </svg>
  );
}

function portalFromHost() {
  if (typeof window === "undefined") return null;
  const hostname = window.location.hostname.toLowerCase();
  if (hostname === "admin.event-sphere.ca") return "admin";
  if (hostname === "vendor.event-sphere.ca") return "vendor";
  return null;
}

function isPortalSubdomain(portal) {
  return portalFromHost() === portal;
}

function publicMarketplaceUrl(pathname = "/") {
  if (typeof window === "undefined" || !portalFromHost()) return pathname;
  return new URL(pathname, "https://www.event-sphere.ca").toString();
}

function portalPath(portal, section = "") {
  if (isPortalSubdomain(portal)) {
    return section ? `/${section}` : "/";
  }
  if (portal === "admin") return section ? `/admin/${section}` : "/admin";
  if (portal === "vendor") return section ? `/vendor/${section}` : "/vendor";
  return "/";
}

function initialPortalFromPath() {
  if (typeof window === "undefined") return "client";
  const hostPortal = portalFromHost();
  if (hostPortal) return hostPortal;
  const pathname = window.location.pathname;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "admin";
  if (pathname === "/vendor" || pathname.startsWith("/vendor/")) return "vendor";
  return "client";
}

function archiveTypeFromPath(pathname) {
  if (pathname === "/vendors") return "vendor";
  if (pathname === "/venues") return "venue";
  if (pathname === "/listings") return "all";
  return null;
}

function archivePathForType(type) {
  if (type === "vendor") return "/vendors";
  if (type === "venue") return "/venues";
  return "/listings";
}

function buildSearchSuggestions(query, listings, categoryOptions) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) return [];

  const suggestions = [];
  const seen = new Set();

  for (const item of listings) {
    const haystack = [
      item.businessName,
      item.category,
      item.city,
      item.description,
      ...(item.tags || []),
      ...(item.languages || [])
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(normalizedQuery)) continue;

    const key = `listing-${item.slug || item.businessName}`;
    if (seen.has(key)) continue;
    seen.add(key);
    suggestions.push({
      id: key,
      label: item.businessName,
      kind: item.type === "venue" ? "Venue" : "Vendor",
      meta: [item.category, item.city].filter(Boolean).join(" • "),
      slug: item.slug,
      category: item.category,
      listingType: item.type
    });
    if (suggestions.length >= 5) break;
  }

  for (const category of categoryOptions) {
    if (!String(category || "").toLowerCase().includes(normalizedQuery)) continue;
    const key = `category-${category}`;
    if (seen.has(key)) continue;
    seen.add(key);
    suggestions.push({
      id: key,
      label: category,
      kind: "Category",
      meta: "Browse category results",
      category
    });
    if (suggestions.length >= 8) break;
  }

  return suggestions.slice(0, 8);
}

function listingSlugFromPath() {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/^\/listing\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function vendorApplyFromPath() {
  if (typeof window === "undefined") return false;
  return window.location.pathname === "/list-your-business";
}

function legalPageFromPath() {
  if (typeof window === "undefined") return null;
  if (window.location.pathname === "/privacy-policy") return "privacy";
  if (window.location.pathname === "/terms-of-service") return "terms";
  return null;
}

function vendorSectionFromPath() {
  if (typeof window === "undefined") return "dashboard";
  const hostPortal = portalFromHost();
  const pathname = window.location.pathname;
  const section = hostPortal === "vendor"
    ? pathname.match(/^\/([^/]+)$/)?.[1]
    : pathname.match(/^\/vendor\/([^/]+)$/)?.[1];
  if (section === "security") return "settings";
  const allowed = new Set([
    "dashboard",
    "listings",
    "leads",
    "clients",
    "analytics",
    "profile",
    "media",
    "availability",
    "service-areas",
    "packages",
    "listing-settings",
    "notifications",
    "reviews",
    "support",
    "quotes",
    "security",
    "settings"
  ]);
  return section && allowed.has(section) ? section : "dashboard";
}

function vendorSettingsSectionFromPath() {
  if (typeof window === "undefined") return "general";
  const hostPortal = portalFromHost();
  const pathname = window.location.pathname;
  const section = hostPortal === "vendor"
    ? pathname.match(/^\/([^/]+)$/)?.[1]
    : pathname.match(/^\/vendor\/([^/]+)$/)?.[1];
  if (section === "security") return "security";
  if (section === "listing-settings") return "listing";
  if (section === "settings") return "menu";
  return "general";
}

function adminSectionFromPath() {
  if (typeof window === "undefined") return "overview";
  const hostPortal = portalFromHost();
  const pathname = window.location.pathname;
  const section = hostPortal === "admin"
    ? pathname.match(/^\/([^/]+)(?:\/.*)?$/)?.[1]
    : pathname.match(/^\/admin\/([^/]+)(?:\/.*)?$/)?.[1];
  const allowed = new Set(["overview", "vendors", "vendor-queue", "requests", "reviews", "analytics", "featured", "audit", "permissions", "settings"]);
  return section && allowed.has(section) ? section : "overview";
}

function adminSettingsSectionFromPath() {
  if (typeof window === "undefined") return "general";
  const hostPortal = portalFromHost();
  const pathname = window.location.pathname;
  if (hostPortal === "admin") {
    if (!pathname.startsWith("/settings")) return "general";
  } else if (!pathname.startsWith("/admin/settings")) {
    return "general";
  }
  const section = hostPortal === "admin"
    ? pathname.match(/^\/settings\/([^/]+)\/?$/)?.[1]
    : pathname.match(/^\/admin\/settings\/([^/]+)\/?$/)?.[1];
  const legacySectionMap = {
    overview: "general",
    "business-information": "general",
    "request-management": "moderation",
    "application-management": "moderation",
    "marketplace-controls": "appearance"
  };
  const nextSection = legacySectionMap[section] || section;
  const allowed = new Set(["general", "notifications", "security", "appearance", "moderation"]);
  return nextSection && allowed.has(nextSection) ? nextSection : "general";
}

function adminSettingsPath(section = "general") {
  if (isPortalSubdomain("admin")) return section === "general" ? "/settings" : `/settings/${section}`;
  return section === "general" ? "/admin/settings" : `/admin/settings/${section}`;
}

function initialArchiveStateFromPath() {
  if (typeof window === "undefined") {
    return {
      show: false,
      filters: {
        q: "",
        city: "",
        type: "all",
        category: "all",
        price: "all",
        attendees: "all",
        sort: "featured"
      }
    };
  }

  const type = archiveTypeFromPath(window.location.pathname);
  const params = new URLSearchParams(window.location.search);

  return {
    show: Boolean(type),
    filters: {
      q: params.get("q") || "",
      city: params.get("city") || "",
      type: type || "all",
      category: params.get("category") || "all",
      price: params.get("price") || "all",
      attendees: params.get("attendees") || "all",
      sort: params.get("sort") || "featured"
    }
  };
}

export default function App() {
  const initialArchiveState = useMemo(() => initialArchiveStateFromPath(), []);
  const [portal, setPortal] = useState(initialPortalFromPath);
  const [bootstrap, setBootstrap] = useState(null);
  const [listings, setListings] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [vendorForm, setVendorForm] = useState(null);
  const [vendorServices, setVendorServices] = useState([]);
  const [vendorMediaItems, setVendorMediaItems] = useState([]);
  const [selectedVendorPackage, setSelectedVendorPackage] = useState(null);
  const [showVendorPackageForm, setShowVendorPackageForm] = useState(false);
  const [vendorPackageDraft, setVendorPackageDraft] = useState(null);
  const [vendorPackageMode, setVendorPackageMode] = useState("edit");
  const [openVendorPackageMenuId, setOpenVendorPackageMenuId] = useState(null);
  const [openVendorPackageMenuPosition, setOpenVendorPackageMenuPosition] = useState(null);
  const [vendorLeadRows, setVendorLeadRows] = useState([]);
  const [selectedVendorLead, setSelectedVendorLead] = useState(null);
  const [selectedVendorSupportRequest, setSelectedVendorSupportRequest] = useState(null);
  const [selectedVendorReviewDetail, setSelectedVendorReviewDetail] = useState(null);
  const [showVendorLeadForm, setShowVendorLeadForm] = useState(false);
  const [vendorLeadDraft, setVendorLeadDraft] = useState(null);
  const [vendorLeadStatuses, setVendorLeadStatuses] = useState(["New inquiry", "Quote sent", "Follow up", "Booked", "Closed"]);
  const [vendorLeadCustomStatus, setVendorLeadCustomStatus] = useState("");
  const [showVendorQuotePanel, setShowVendorQuotePanel] = useState(false);
  const [vendorQuoteDraft, setVendorQuoteDraft] = useState(null);
  const [quoteSettings, setQuoteSettings] = useState(DEFAULT_QUOTE_SETTINGS);
  const [selectedVendorListing, setSelectedVendorListing] = useState(null);
  const [showVendorListingForm, setShowVendorListingForm] = useState(false);
  const [vendorListingDraft, setVendorListingDraft] = useState(null);
  const [vendorListingMode, setVendorListingMode] = useState("edit");
  const [vendorListingImageError, setVendorListingImageError] = useState("");
  const [vendorPolicyDraft, setVendorPolicyDraft] = useState(() => createVendorPolicyDraft());
  const [vendorPolicyLibrary, setVendorPolicyLibrary] = useState(() => createVendorPolicyLibrary());
  const [showVendorPolicyForm, setShowVendorPolicyForm] = useState(false);
  const [vendorPolicyFormMode, setVendorPolicyFormMode] = useState("create");
  const [vendorPolicyItemDraft, setVendorPolicyItemDraft] = useState(null);
  const [saveState, setSaveState] = useState("");
  const [demoEmailRecipient, setDemoEmailRecipient] = useState(EMAIL_TEST_RECIPIENT);
  const [session, setSession] = useState(readSession);
  const [authMode, setAuthMode] = useState("login");
  const [authPending, setAuthPending] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authForm, setAuthForm] = useState({
    name: "",
    businessName: "",
    email: "",
    password: "",
    phone: "",
    category: "",
    city: ""
  });
  const [selectedListingSlug, setSelectedListingSlug] = useState(() => listingSlugFromPath());
  const [selectedListingDetail, setSelectedListingDetail] = useState(null);
  const [listingDetailState, setListingDetailState] = useState("idle");
  const [loadedTikToks, setLoadedTikToks] = useState({});
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showClientQuerySuggestions, setShowClientQuerySuggestions] = useState(false);
  const [showArchiveQuerySuggestions, setShowArchiveQuerySuggestions] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showClientArchive, setShowClientArchive] = useState(initialArchiveState.show);
  const [showVendorApplyPage, setShowVendorApplyPage] = useState(vendorApplyFromPath);
  const [legalPage, setLegalPage] = useState(legalPageFromPath);
  const [showArchiveFilterPanel, setShowArchiveFilterPanel] = useState(false);
  const [showArchiveSearchModal, setShowArchiveSearchModal] = useState(false);
  const [showArchiveWhenPanel, setShowArchiveWhenPanel] = useState(false);
  const [showArchivePricePanel, setShowArchivePricePanel] = useState(false);
  const [showArchiveAttendeesPanel, setShowArchiveAttendeesPanel] = useState(false);
  const [archiveCustomPrice, setArchiveCustomPrice] = useState({ min: "", max: "" });
  const [archiveExactAttendees, setArchiveExactAttendees] = useState("");
  const [showGalleryLightbox, setShowGalleryLightbox] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [archiveWhen, setArchiveWhen] = useState(() => {
    const today = new Date();
    return {
      selectedDate: "",
      monthCursor: monthKey(new Date(today.getFullYear(), today.getMonth(), 1)),
      startTime: "",
      endTime: "",
      appliedLabel: "Any time"
    };
  });
  const [showAvailability, setShowAvailability] = useState(false);
  const [vendorSettingsData, setVendorSettingsData] = useState(null);
  const [adminSection, setAdminSection] = useState(adminSectionFromPath);
  const [adminSettingsSection, setAdminSettingsSection] = useState(adminSettingsSectionFromPath);
  const [adminStatusFilter, setAdminStatusFilter] = useState("requests");
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [showAdminSearchSuggestions, setShowAdminSearchSuggestions] = useState(false);
  const [adminRequestStatuses, setAdminRequestStatuses] = useState(DEFAULT_ADMIN_REQUEST_STATUSES);
  const [adminApplicationStatuses, setAdminApplicationStatuses] = useState(DEFAULT_ADMIN_APPLICATION_STATUSES);
  const [adminRequestStatusDraft, setAdminRequestStatusDraft] = useState({ label: "", tone: "amber" });
  const [adminApplicationStatusDraft, setAdminApplicationStatusDraft] = useState({ label: "", tone: "blue" });
  const [adminSettingsDraft, setAdminSettingsDraft] = useState(DEFAULT_ADMIN_SETTINGS);
  const [selectedAdminVendorId, setSelectedAdminVendorId] = useState(null);
  const [adminRejectionDraft, setAdminRejectionDraft] = useState(null);
  const [adminRequestRows, setAdminRequestRows] = useState(initialAdminRequestRecords);
  const [reviewRequestRows, setReviewRequestRows] = useState(initialReviewRequestRecords);
  const [reviewRows, setReviewRows] = useState(initialReviewRecords);
  const [adminRequestFilter, setAdminRequestFilter] = useState("pending");
  const [adminRequestSort, setAdminRequestSort] = useState("date");
  const [adminReviewFilter, setAdminReviewFilter] = useState("pending");
  const [selectedAdminReviewId, setSelectedAdminReviewId] = useState(null);
  const [adminApplicationSort, setAdminApplicationSort] = useState("date");
  const [adminAnalyticsRange, setAdminAnalyticsRange] = useState("30d");
  const [adminFollowUpVendorIds, setAdminFollowUpVendorIds] = useState([]);
  const [adminFollowUpRequestIds, setAdminFollowUpRequestIds] = useState([]);
  const [showAdminFeatureModal, setShowAdminFeatureModal] = useState(false);
  const [adminFeatureSearch, setAdminFeatureSearch] = useState("");
  const [showAdminVendorStatusMenu, setShowAdminVendorStatusMenu] = useState(false);
  const [selectedAdminPermissionRole, setSelectedAdminPermissionRole] = useState(null);
  const [adminRolePermissions, setAdminRolePermissions] = useState(DEFAULT_ADMIN_ROLE_PERMISSIONS);
  const [adminRequestReview, setAdminRequestReview] = useState(null);
  const [vendorReviewRequestDraft, setVendorReviewRequestDraft] = useState({
    clientId: "",
    clientName: "",
    clientEmail: "",
    eventType: ""
  });
  const [vendorReviewFormDraft, setVendorReviewFormDraft] = useState(null);
  const [showVendorReviewRequestModal, setShowVendorReviewRequestModal] = useState(false);
  const [vendorReviewTab, setVendorReviewTab] = useState("approved");
  const clientListingDetailRenderRef = useRef(null);
  const vendorConceptARenderRef = useRef(null);
  const statusManagerCardRenderRef = useRef(null);
  const adminSettingsPanelRenderRef = useRef(null);
  const adminSettingsRowRenderRef = useRef(null);
  const adminSettingsSwitchRenderRef = useRef(null);
  const adminSettingsStatusPanelRenderRef = useRef(null);
  const navRenderRef = useRef(null);
  const portalAuthGateRenderRef = useRef(null);
  const mobileMenuRenderRef = useRef(null);
  const mobileSearchModalRenderRef = useRef(null);
  const vendorApplyPageRenderRef = useRef(null);
  const adminReviewModerationPanelRenderRef = useRef(null);
  const adminRejectionReasonModalRenderRef = useRef(null);
  const adminRequestReviewModalRenderRef = useRef(null);
  const StableClientListingDetail = useMemo(() => function StableClientListingDetail() {
    return clientListingDetailRenderRef.current ? clientListingDetailRenderRef.current() : null;
  }, []);
  const StableVendorConceptA = useMemo(() => function StableVendorConceptA() {
    return vendorConceptARenderRef.current ? vendorConceptARenderRef.current() : null;
  }, []);
  const StatusManagerCard = useMemo(() => function StatusManagerCard(props) {
    return statusManagerCardRenderRef.current ? statusManagerCardRenderRef.current(props) : null;
  }, []);
  const AdminSettingsPanel = useMemo(() => function AdminSettingsPanel(props) {
    return adminSettingsPanelRenderRef.current ? adminSettingsPanelRenderRef.current(props) : null;
  }, []);
  const AdminSettingsRow = useMemo(() => function AdminSettingsRow(props) {
    return adminSettingsRowRenderRef.current ? adminSettingsRowRenderRef.current(props) : null;
  }, []);
  const AdminSettingsSwitch = useMemo(() => function AdminSettingsSwitch(props) {
    return adminSettingsSwitchRenderRef.current ? adminSettingsSwitchRenderRef.current(props) : null;
  }, []);
  const AdminSettingsStatusPanel = useMemo(() => function AdminSettingsStatusPanel(props) {
    return adminSettingsStatusPanelRenderRef.current ? adminSettingsStatusPanelRenderRef.current(props) : null;
  }, []);
  const StableNav = useMemo(() => function StableNav() {
    return navRenderRef.current ? navRenderRef.current() : null;
  }, []);
  const StablePortalAuthGate = useMemo(() => function StablePortalAuthGate() {
    return portalAuthGateRenderRef.current ? portalAuthGateRenderRef.current() : null;
  }, []);
  const StableMobileMenu = useMemo(() => function StableMobileMenu() {
    return mobileMenuRenderRef.current ? mobileMenuRenderRef.current() : null;
  }, []);
  const StableMobileSearchModal = useMemo(() => function StableMobileSearchModal() {
    return mobileSearchModalRenderRef.current ? mobileSearchModalRenderRef.current() : null;
  }, []);
  const StableVendorApplyPage = useMemo(() => function StableVendorApplyPage() {
    return vendorApplyPageRenderRef.current ? vendorApplyPageRenderRef.current() : null;
  }, []);
  const StableAdminReviewModerationPanel = useMemo(() => function StableAdminReviewModerationPanel() {
    return adminReviewModerationPanelRenderRef.current ? adminReviewModerationPanelRenderRef.current() : null;
  }, []);
  const StableAdminRejectionReasonModal = useMemo(() => function StableAdminRejectionReasonModal() {
    return adminRejectionReasonModalRenderRef.current ? adminRejectionReasonModalRenderRef.current() : null;
  }, []);
  const StableAdminRequestReviewModal = useMemo(() => function StableAdminRequestReviewModal() {
    return adminRequestReviewModalRenderRef.current ? adminRequestReviewModalRenderRef.current() : null;
  }, []);
  const [applicationSubmitState, setApplicationSubmitState] = useState("");
  const [detailAccordions, setDetailAccordions] = useState({
    specialties: true,
    contact: true,
    social: true,
    policies: true,
    parking: false,
    hostRules: false
  });
  const [clientSearch, setClientSearch] = useState({
    q: "",
    city: "Toronto, ON"
  });
  const [archiveFilters, setArchiveFilters] = useState(initialArchiveState.filters);
  const [vendorApplicationForm, setVendorApplicationForm] = useState({
    businessName: "",
    ownerName: "",
    category: "",
    city: "",
    description: "",
    priceFrom: "",
    yearsInBusiness: "",
    email: "",
    phone: "",
    whatsapp: "",
    website: "",
    instagram: "",
    facebook: "",
    specialties: []
  });

  useEffect(() => {
    let active = true;

    async function load() {
      const [bootstrapPayload, listingsPayload, adminPayload, adminSettingsPayload] = await Promise.all([
        api("/api/bootstrap"),
        api("/api/vendors?type=all"),
        session?.role === "admin" ? api("/api/dashboard/admin") : Promise.resolve(null),
        session?.role === "admin" ? api("/api/settings/admin") : Promise.resolve(null)
      ]);

      if (!active) return;

      setBootstrap(bootstrapPayload);
      setListings(listingsPayload.results);
      setAdmin(adminPayload);
      setAdminRequestRows(adminPayload?.requests || []);
      setReviewRequestRows(adminPayload?.reviewRequests || []);
      setReviewRows(adminPayload?.reviews || []);
      if (adminSettingsPayload?.settings) {
        setAdminSettingsDraft((current) => ({ ...current, ...DEFAULT_ADMIN_SETTINGS, ...adminSettingsPayload.settings }));
      }

      const seededSlug =
        session?.role === "vendor"
          ? session.vendorSlug
          : null;

      if (seededSlug) {
        const [vendorPayload, vendorSettingsPayload] = await Promise.all([
          api(`/api/dashboard/vendor/${seededSlug}`),
          api(`/api/settings/vendor/${seededSlug}`)
        ]);
        if (!active) return;
        setVendorData(vendorPayload);
        setVendorSettingsData(vendorSettingsPayload?.settings || {});
        setVendorLeadRows(
          (vendorPayload.openLeads || []).map((lead, index) => ({
            ...lead,
            id: lead.id || `seed-lead-${index}`,
            status: lead.status || (index === 0 ? "New inquiry" : index === 1 ? "Quote sent" : "Follow up")
          }))
        );
        setVendorForm({
          businessName: vendorPayload.vendor.businessName || "",
          ownerName: vendorPayload.vendor.ownerName || "",
          category: vendorPayload.vendor.category || "",
          city: vendorPayload.vendor.city || "",
          province: vendorPayload.vendor.province || "Ontario",
          priceFrom: vendorPayload.vendor.priceFrom || "",
          description: vendorPayload.vendor.description || "",
          longDescription: vendorPayload.vendor.longDescription || "",
          email: vendorPayload.vendor.contact.email || "",
          phone: vendorPayload.vendor.contact.phone || "",
          whatsapp: vendorPayload.vendor.contact.whatsapp || "",
          website: vendorPayload.vendor.contact.website || "",
          instagram: vendorPayload.vendor.instagram || "",
          tiktok: vendorPayload.vendor.tiktok || "",
          facebook: vendorPayload.vendor.facebook || "",
          yearsInBusiness: vendorPayload.vendor.yearsInBusiness || "",
          avatarImage: vendorPayload.vendor.image || "",
          teamSize: vendorPayload.vendor.teamSize || "",
          languages: vendorPayload.vendor.languages || "",
          serviceStyle: vendorPayload.vendor.serviceStyle || "",
          culturalSpecialties: (vendorPayload.vendor.culturalSpecialties || vendorPayload.vendor.tags || []).join(", "),
          tags: (vendorPayload.vendor.tags || []).join(", "),
          serviceAreas: (vendorPayload.vendor.serviceAreas || [vendorPayload.vendor.city].filter(Boolean)).join("|"),
          travelRadius: vendorPayload.vendor.travelRadius || "75 km",
          remotePlanning: vendorPayload.vendor.remotePlanning || "Available",
          availabilityWindow: vendorPayload.vendor.availabilityWindow || "Accepting bookings 12 months ahead",
          minimumNotice: vendorPayload.vendor.minimumNotice || "14 days",
          consultationHours: vendorPayload.vendor.consultationHours || "Mon-Fri, 10:00 AM-6:00 PM",
          blackoutDates: vendorPayload.vendor.blackoutDates || "",
          availableWeekdays: vendorPayload.vendor.availableWeekdays || "Friday, Saturday, Sunday",
          bookingCutoff: vendorPayload.vendor.bookingCutoff || "48 hours before event"
        });
        setVendorServices(buildDefaultServices(vendorPayload.vendor));
        const mediaSources = [
          vendorPayload.vendor.image,
          ...(vendorPayload.vendor.gallery || [])
        ].filter(Boolean);
        const uniqueMediaSources = [...new Set(mediaSources)].slice(0, 10);
        setVendorMediaItems(
          uniqueMediaSources.map((src, index) => ({
            id: `media-${index}-${src.slice(-12)}`,
            src,
            featured: index === 0
          }))
        );
      } else {
        setVendorSettingsData(null);
      }
    }

    load().catch((error) => {
      console.error(error);
      if (/Authentication required|Admin access required|Invalid credentials|access to this vendor workspace/i.test(String(error?.message || ""))) {
        setSession(null);
        setAuthError("Your session expired. Please sign in again.");
      }
    });

    return () => {
      active = false;
    };
  }, [session?.role, session?.vendorSlug]);

  useEffect(() => {
    if (session) {
      writeSession(session);
      return;
    }
    clearSession();
  }, [session]);

  useEffect(() => {
    setAuthMode(portal === "admin" ? "login" : "login");
    setAuthError("");
  }, [portal]);

  useEffect(() => {
    const updateHeader = () => setIsHeaderScrolled(window.scrollY > 24);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      const archiveType = archiveTypeFromPath(window.location.pathname);
      const listingSlug = listingSlugFromPath();
      const nextLegalPage = legalPageFromPath();
      const nextPortal = initialPortalFromPath();

      setPortal(nextPortal);
      setLegalPage(nextPortal === "client" ? nextLegalPage : null);

      if (nextPortal === "admin") {
        setAdminSection(adminSectionFromPath());
        setAdminSettingsSection(adminSettingsSectionFromPath());
        setShowClientArchive(false);
        setSelectedListingSlug(null);
        return;
      }

      if (nextPortal !== "client") {
        setShowClientArchive(false);
        setSelectedListingSlug(null);
        return;
      }

      if (nextLegalPage) {
        setShowClientArchive(false);
        setSelectedListingSlug(null);
        setShowVendorApplyPage(false);
        return;
      }

      if (listingSlug) {
        setSelectedListingSlug(listingSlug);
        setShowClientArchive(false);
        setShowVendorApplyPage(false);
        return;
      }

      if (vendorApplyFromPath()) {
        setSelectedListingSlug(null);
        setShowClientArchive(false);
        setShowVendorApplyPage(true);
        return;
      }

      setShowClientArchive(Boolean(archiveType));

      if (archiveType) {
        const nextArchiveState = initialArchiveStateFromPath();
        setArchiveFilters(nextArchiveState.filters);
        setSelectedListingSlug(null);
        setShowVendorApplyPage(false);
      } else {
        setSelectedListingSlug(null);
        setShowVendorApplyPage(false);
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  useEffect(() => {
    const hashSession = readSupabaseHashSession();
    if (!hashSession?.accessToken) return;

    let active = true;
    async function hydrateInviteSession() {
      setAuthPending(true);
      setAuthError("");
      try {
        const response = await api("/api/auth/session", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${hashSession.accessToken}`
          },
          body: JSON.stringify({})
        });
        if (!active) return;

        const nextSession = enrichSessionPayload({
          ...response.session,
          accessToken: hashSession.accessToken,
          refreshToken: hashSession.refreshToken,
          authProvider: response.auth?.provider,
          authUserId: response.auth?.userId
        });
        writeSession(nextSession);
        setSession(nextSession);

        const nextPortal = nextSession.role === "admin" ? "admin" : "vendor";
        setPortal(nextPortal);
        window.history.replaceState({}, "", portalPath(nextPortal));
      } catch (error) {
        if (!active) return;
        setAuthError(error.message || "Unable to complete account access. Request a fresh invite link.");
        window.history.replaceState({}, "", portalPath(portal));
      } finally {
        if (active) setAuthPending(false);
      }
    }

    hydrateInviteSession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadListingDetail() {
      if (!selectedListingSlug) {
        setSelectedListingDetail(null);
        setListingDetailState("idle");
        return;
      }

      setListingDetailState("loading");

      try {
        const payload = await api(`/api/vendors/${selectedListingSlug}`);
        if (!active) return;
        setSelectedListingDetail(payload);
        setListingDetailState("ready");
      } catch (error) {
        if (!active) return;
        console.error(error);
        setListingDetailState("error");
      }
    }

    loadListingDetail();

    return () => {
      active = false;
    };
  }, [selectedListingSlug]);

  const topCategories = useMemo(() => {
    return (bootstrap?.categories || []).slice(0, 4).map((category) => ({
      ...category,
      img: imageForCategory(category.name)
    }));
  }, [bootstrap]);

  const categoryBrowseCards = useMemo(() => {
    const fallbackCategories = [
      { name: "Catering", count: 0 },
      { name: "Photography", count: 0 },
      { name: "Videography", count: 0 },
      { name: "DJ & MC", count: 0 },
      { name: "Decor & Florals", count: 0 },
      { name: "Event Planning", count: 0 },
      { name: "Venue Rental", count: 0 },
      { name: "Makeup & Beauty", count: 0 }
    ];

    const merged = new Map();

    (bootstrap?.categories || []).forEach((category) => {
      merged.set(category.name, {
        name: category.name,
        count: category.count || 0,
        img: imageForCategory(category.name)
      });
    });

    fallbackCategories.forEach((category) => {
      if (!merged.has(category.name)) {
        merged.set(category.name, {
          ...category,
          img: imageForCategory(category.name)
        });
      }
    });

    return Array.from(merged.values())
      .slice(0, 8)
      .map((category) => ({
        ...category,
        icon: iconForCategory(category.name)
      }));
  }, [bootstrap]);

  const marketplaceStats = useMemo(() => {
    return [
      { value: "Opening", label: "vendor directory" },
      { value: "Canada", label: "market focus" },
      { value: "Curated", label: "approval process" }
    ];
  }, []);

  const spotlightListings = useMemo(() => {
    return listings.slice(0, 4);
  }, [listings]);

  const featuredListings = useMemo(() => {
    return listings.filter((item) => item.featured).slice(0, 4);
  }, [listings]);

  const cityCounts = useMemo(() => {
    const counts = {};
    for (const item of listings) {
      counts[item.city] = (counts[item.city] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [listings]);

  const archiveCategoryChips = useMemo(() => {
    const source =
      archiveFilters.type === "all"
        ? listings
        : listings.filter((item) => item.type === archiveFilters.type);

    return ["all", ...Array.from(new Set(source.map((item) => item.category).filter(Boolean))).sort()].slice(0, 10);
  }, [archiveFilters.type, listings]);

  const archiveCityOptions = useMemo(() => {
    return Array.from(new Set(listings.map((item) => item.city).filter(Boolean))).sort();
  }, [listings]);

  const clientCityOptions = useMemo(() => {
    return Array.from(new Set([...CANADIAN_CITY_OPTIONS, ...archiveCityOptions])).sort((a, b) => a.localeCompare(b));
  }, [archiveCityOptions]);

  const clientCitySuggestions = useMemo(() => {
    const query = clientSearch.city.trim().toLowerCase();
    const options = query
      ? clientCityOptions.filter((city) => city.toLowerCase().includes(query))
      : clientCityOptions;

    return options.slice(0, 8);
  }, [clientCityOptions, clientSearch.city]);

  const searchCategoryOptions = useMemo(() => {
    return Array.from(
      new Set([
        ...((bootstrap?.categories || []).map((item) => item.name)),
        ...listings.map((item) => item.category).filter(Boolean)
      ])
    ).sort((a, b) => a.localeCompare(b));
  }, [bootstrap, listings]);

  const clientSearchSuggestions = useMemo(() => {
    return buildSearchSuggestions(clientSearch.q, listings, searchCategoryOptions);
  }, [clientSearch.q, listings, searchCategoryOptions]);

  const archiveSearchSuggestions = useMemo(() => {
    return buildSearchSuggestions(archiveFilters.q, listings, searchCategoryOptions);
  }, [archiveFilters.q, listings, searchCategoryOptions]);

  const archiveResults = useMemo(() => {
    const normalizedQuery = archiveFilters.q.trim().toLowerCase();
    const normalizedCity = archiveFilters.city.trim().toLowerCase().split(",")[0];

    let items = listings.filter((item) => {
      if (archiveFilters.type !== "all" && item.type !== archiveFilters.type) return false;
      if (archiveFilters.category !== "all" && item.category !== archiveFilters.category) return false;

      if (archiveFilters.price === "under-1000" && Number(item.priceFrom || 0) >= 1000) return false;
      if (archiveFilters.price === "1000-3000" && (Number(item.priceFrom || 0) < 1000 || Number(item.priceFrom || 0) > 3000)) return false;
      if (archiveFilters.price === "over-3000" && Number(item.priceFrom || 0) <= 3000) return false;
      if (archiveFilters.price.startsWith("custom-")) {
        const [, minRaw, maxRaw] = archiveFilters.price.split("-");
        const min = Number(minRaw || 0);
        const max = Number(maxRaw || 0);
        const price = Number(item.priceFrom || 0);
        if (min && price < min) return false;
        if (max && price > max) return false;
      }

      const maxGuests = listingCapacityMax(item.capacity);
      if (archiveFilters.attendees === "under-50" && !(maxGuests && maxGuests < 50)) return false;
      if (archiveFilters.attendees === "1-10" && !(maxGuests && maxGuests >= 1 && maxGuests <= 10)) return false;
      if (archiveFilters.attendees === "11-25" && !(maxGuests && maxGuests >= 11 && maxGuests <= 25)) return false;
      if (archiveFilters.attendees === "26-50" && !(maxGuests && maxGuests >= 26 && maxGuests <= 50)) return false;
      if (archiveFilters.attendees === "51-100" && !(maxGuests && maxGuests >= 51 && maxGuests <= 100)) return false;
      if (archiveFilters.attendees === "100-plus" && !(maxGuests && maxGuests > 100)) return false;
      if (archiveFilters.attendees === "50-150" && !(maxGuests && maxGuests >= 50 && maxGuests <= 150)) return false;
      if (archiveFilters.attendees === "150-300" && !(maxGuests && maxGuests > 150 && maxGuests <= 300)) return false;
      if (archiveFilters.attendees === "300-plus" && !(maxGuests && maxGuests > 300)) return false;
      if (archiveFilters.attendees.startsWith("exact-")) {
        const exactCount = Number(archiveFilters.attendees.replace("exact-", ""));
        if (!maxGuests || !exactCount || maxGuests < exactCount) return false;
      }

      if (normalizedCity && !String(item.city || "").toLowerCase().includes(normalizedCity)) return false;

      if (!normalizedQuery) return true;

      const haystack = [
        item.businessName,
        item.category,
        item.city,
        item.description,
        ...(item.tags || [])
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });

    items = items.slice();

    switch (archiveFilters.sort) {
      case "rating":
        items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "price-low":
        items.sort((a, b) => (a.priceFrom || 0) - (b.priceFrom || 0));
        break;
      case "price-high":
        items.sort((a, b) => (b.priceFrom || 0) - (a.priceFrom || 0));
        break;
      case "az":
        items.sort((a, b) => String(a.businessName || "").localeCompare(String(b.businessName || "")));
        break;
      case "featured":
      default:
        items.sort((a, b) => {
          if (Number(b.featured) !== Number(a.featured)) return Number(b.featured) - Number(a.featured);
          return (b.rating || 0) - (a.rating || 0);
        });
        break;
    }

    return items;
  }, [archiveFilters, listings]);

  const pendingQueue = useMemo(() => {
    return (admin?.vendors || []).filter((item) => item.status === "pending").slice(0, 6);
  }, [admin]);

  const adminVendorSource = listings.slice(0, 24);
  const adminVendors = ((admin?.vendors || []).length
    ? admin.vendors
    : adminVendorSource.map((item, index) => ({
        ...item,
        id: item.id || item.slug || `vendor-${index}`,
        status: index % 11 === 0 ? "pending" : "approved",
        verified: index % 5 !== 0,
        featured: Boolean(item.featured || index % 6 === 0),
        priceFrom: item.priceFrom || 1200 + index * 180
      }))).map((item) => ({
        ...item,
        reviewStatus: item.reviewStatus || item.status || "pending"
      }));

  function vendorCompleteness(item) {
    const checks = [
      Boolean(item?.businessName),
      Boolean(item?.category),
      Boolean(item?.city),
      Boolean(item?.image),
      Boolean(item?.description),
      Number(item?.priceFrom || 0) > 0,
      Boolean(item?.verified)
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }

  function vendorRisk(item) {
    if (item?.status === "pending") return "Medium";
    if (item?.status === "rejected") return "High";
    if (item?.status === "restricted") return "High";
    if (!item?.verified) return "High";
    if (vendorCompleteness(item) < 75) return "Medium";
    return "Low";
  }

  function profileHealthBarClass(value) {
    if (value >= 100) return "bg-green-500";
    if (value >= 50) return "bg-amber-400";
    return "bg-red-500";
  }

  const adminFilteredVendors = useMemo(() => {
    const requestVendors = adminVendors.filter((item) => item.status === "pending");
    const flaggedVendors = adminVendors.filter((item) => item.status !== "pending" && (vendorRisk(item) !== "Low" || adminFollowUpVendorIds.includes(item.id)));
    if (adminStatusFilter === "requests") return requestVendors;
    if (adminStatusFilter === "flagged") return flaggedVendors;
    if (adminStatusFilter === "all") return [...requestVendors, ...flaggedVendors];
    return requestVendors;
  }, [adminFollowUpVendorIds, adminStatusFilter, adminVendors]);

  const selectedAdminVendor = useMemo(() => {
    return adminVendors.find((item) => item.id === selectedAdminVendorId) || null;
  }, [adminVendors, selectedAdminVendorId]);

  useEffect(() => {
    setShowAdminVendorStatusMenu(false);
  }, [selectedAdminVendorId]);

  const adminCategoryCoverage = useMemo(() => {
    const counts = new Map();
    adminVendors
      .filter((item) => item.status === "approved")
      .forEach((item) => counts.set(item.category, (counts.get(item.category) || 0) + 1));

    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [adminVendors]);

  const adminCityCoverage = useMemo(() => {
    const counts = new Map();
    adminVendors
      .filter((item) => item.status === "approved")
      .forEach((item) => counts.set(item.city, (counts.get(item.city) || 0) + 1));

    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [adminVendors]);

  const adminQualityFlags = useMemo(() => {
    return adminVendors
      .filter((item) => item.status !== "approved" || vendorCompleteness(item) < 85 || vendorRisk(item) !== "Low")
      .map((item) => ({
        id: item.id,
        businessName: item.businessName,
        issue:
          item.status === "pending"
            ? "Waiting for approval"
            : item.status === "rejected"
              ? "Rejected listing needs follow-up"
              : item.status === "restricted"
                ? "Restricted vendor needs admin review"
                : vendorCompleteness(item) < 85
                  ? "Profile is incomplete"
                  : "Verification needs review",
        severity: vendorRisk(item)
      }))
      .slice(0, 6);
  }, [adminVendors]);

  const adminRequests = useMemo(() => adminRequestRows, [adminRequestRows]);
  const approvedReviewRows = useMemo(() => reviewRows.filter((review) => review.status === "approved"), [reviewRows]);
  const selectedAdminReview = useMemo(() => reviewRows.find((review) => review.id === selectedAdminReviewId) || null, [reviewRows, selectedAdminReviewId]);
  function listingReviewSummary(item) {
    const localApproved = approvedReviewRows.filter((review) => review.vendorSlug === item?.slug);
    const baseCount = Number(item?.reviews || 0);
    const baseRating = Number(item?.rating || 0);
    const baseTotalScore = baseCount * baseRating;
    const localTotalScore = localApproved.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    const totalCount = baseCount + localApproved.length;
    const nextRating = totalCount ? Number(((baseTotalScore + localTotalScore) / totalCount).toFixed(1)) : 0;
    return {
      rating: nextRating,
      count: totalCount,
      recentApproved: localApproved.slice().sort((a, b) => String(b.submittedAt || "").localeCompare(String(a.submittedAt || "")))
    };
  }
  const defaultAdminRequestStatusKey = useMemo(() => {
    return adminRequestStatuses.find((status) => status.key === "pending")?.key || adminRequestStatuses[0]?.key || "pending";
  }, [adminRequestStatuses]);
  const completedRequestStatusKey = useMemo(() => {
    return (
      adminRequestStatuses.find((status) => status.key === "completed")?.key ||
      adminRequestStatuses.find((status) => status.label.toLowerCase().includes("complete"))?.key ||
      "completed"
    );
  }, [adminRequestStatuses]);

  const adminSearchSuggestions = useMemo(() => {
    const query = adminSearchQuery.trim().toLowerCase();
    if (!query) return [];

    const suggestions = [];
    const seen = new Set();

    adminVendors.forEach((vendor) => {
      const haystack = [
        vendor.businessName,
        vendor.category,
        vendor.city,
        vendor.province,
        vendor.ownerName,
        vendor.email
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(query)) return;

      const key = `vendor-${vendor.id}`;
      if (seen.has(key)) return;
      seen.add(key);

      suggestions.push({
        id: key,
        label: vendor.businessName,
        kind: vendor.status === "pending" ? "Application" : "Vendor",
        meta: [vendor.category, vendor.city].filter(Boolean).join(" • "),
        vendorId: vendor.id,
        vendorStatus: vendor.status
      });
    });

    adminRequests.forEach((request) => {
      const haystack = [
        request.subject,
        request.requester,
        request.type,
        request.priority,
        request.email,
        request.message
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(query)) return;

      const key = `request-${request.id}`;
      if (seen.has(key)) return;
      seen.add(key);

      suggestions.push({
        id: key,
        label: request.subject,
        kind: "Request",
        meta: [request.requester, request.type].filter(Boolean).join(" • "),
        requestId: request.id
      });
    });

    return suggestions.slice(0, 8);
  }, [adminRequests, adminSearchQuery, adminVendors]);

  const adminActivity = useMemo(() => {
    return [
      { label: "Approved vendor", detail: pendingQueue[0]?.businessName || "Luxe Decor Studio", time: "2m ago" },
      { label: "Requested more documents", detail: pendingQueue[1]?.businessName || "Atlas Event Rentals", time: "18m ago" },
      { label: "Updated featured vendor slot", detail: featuredListings[0]?.businessName || "Golden Beats DJ Services", time: "41m ago" },
      { label: "Reviewed category coverage", detail: adminCategoryCoverage[0]?.name || "Catering", time: "1h ago" }
    ];
  }, [adminCategoryCoverage, featuredListings, pendingQueue]);

  const adminSummaryCards = useMemo(() => {
    const approved = admin?.counts.approved || 0;
    const pending = admin?.counts.pending || 0;
    const featured = admin?.counts.featured || 0;
    const flagged = adminVendors.filter((item) => vendorRisk(item) !== "Low").length;

    return [
      { label: "Approved Vendors", value: approved, meta: `${adminCityCoverage.length} active cities` },
      { label: "Pending Review", value: pending, meta: "Needs moderation" },
      { label: "Featured Listings", value: featured, meta: "Homepage and archive slots" },
      { label: "Quality Flags", value: flagged, meta: "Profiles needing action" }
    ];
  }, [admin, adminCityCoverage.length, adminVendors]);

  function yearsInBusiness(listing) {
    return Math.max(4, Math.min(12, Math.round((listing?.reviews || 48) / 10)));
  }

  function detailPolicyItems(listing) {
    const itemType = listing?.type === "venue" ? "venue" : "vendor";
    const availability = listing?.availability && typeof listing.availability === "object" ? listing.availability : {};
    const bookingPolicyBody = availability.bookingPolicyBody;
    const cancellationPolicyBody = availability.cancellationPolicyBody;
    const refundPolicyBody = availability.refundPolicyBody;

    return [
      {
        title: availability.bookingPolicyTitle || "Booking policy",
        body:
          bookingPolicyBody ||
          (itemType === "venue"
            ? "Dates are secured after a signed agreement and a booking retainer. Final guest count and floorplan details are confirmed closer to the event date."
            : "Dates are secured after a signed quote and booking retainer. Final scope, guest count, and service timing are confirmed before the event week.")
      },
      {
        title: availability.cancellationPolicyTitle || "Cancellation terms",
        body:
          cancellationPolicyBody ||
          (itemType === "venue"
            ? "Retainers are typically non-refundable once the date is blocked. Date changes depend on availability and the timing of the request."
            : "Retainers are typically non-refundable once prep work starts. Date moves may be possible depending on notice period and availability.")
      },
      {
        title: "Refund policy",
        body:
          refundPolicyBody ||
          "Refund decisions depend on notice period, committed costs, and the final service agreement confirmed before the event date."
      },
      {
        title: "Service terms",
        body:
          itemType === "venue"
            ? "Venue access windows, vendor load-in, cleanup timing, and decor restrictions are confirmed in the final event agreement."
            : "Delivery windows, setup access, menu or scope revisions, and on-site service requirements are confirmed in the final service agreement."
      }
    ];
  }

  function hostProfile(listing) {
    const hostNames = {
      "golden-beats-dj-services": { name: "Marcus A.", label: "Vendor & operator", image: IMG_AVATAR2 },
      "lagos-moments-photography": { name: "Priya S.", label: "Lead creative", image: IMG_AVATAR1 },
      "spice-garden-catering": { name: "Priya Sharma", label: "Vendor & founder", image: IMG_AVATAR1 },
      "regent-ballroom-toronto": { name: "Miguel G.", label: "Venue vendor", image: IMG_AVATAR2 }
    };

    return hostNames[listing?.slug] || { name: "EventSphere Vendor", label: "Verified vendor", image: IMG_AVATAR1 };
  }

  function includedFeatures(listing) {
    const customFeatures = uniqueStringArray(listing?.availability?.includedFeatures || []);
    if (customFeatures.length) {
      return customFeatures;
    }

    if (listing?.type === "venue") {
      return ["Natural light", "Restrooms", "Street level access", "Stage access", "Tables & chairs", "Prep area"];
    }

    switch (listing?.category) {
      case "Catering":
        return ["Buffet setup", "Servers available", "Custom menu planning", "Tasting session", "Late-night service", "Halal options"];
      case "DJ & MC":
        return ["Wireless microphones", "DJ controller", "Reception timeline support", "Bilingual MC", "Dance-floor lighting", "Playlist curation"];
      case "Photography":
        return ["Edited gallery", "Highlight selects", "Second shooter option", "Portrait direction", "Online delivery", "Travel within GTA"];
      default:
        return ["Setup included", "Direct coordination", "On-site support", "Flexible packages", "Large event experience", "Fast response"];
    }
  }

  function reviewItems(listing) {
    const templates = [
      {
        name: "Doris P.",
        role: "Producer",
        booked: "Booked for a production",
        body: "Responsive, easy to work with, and exactly as described. The setup felt polished and the communication was straightforward from first contact to event day.",
        date: "March 27, 2026",
        image: IMG_AVATAR1
      },
      {
        name: "Nia B.",
        role: "Boutique owner",
        booked: "Booked for a brand event",
        body: "Great experience overall. Smooth coordination, clean presentation, and enough flexibility to fit what we needed without extra friction.",
        date: "March 7, 2026",
        image: IMG_AVATAR2
      },
      {
        name: "Donny K.",
        role: "Music artist",
        booked: "Booked for a community event",
        body: "Strong vendor communication and a reliable setup. Would use this listing again.",
        date: "January 11, 2026",
        image: IMG_AVATAR1
      }
    ];

    return templates.map((review) => ({
      ...review,
      booked: `${review.booked} for ${listing?.type === "venue" ? "up to 20 people" : listing?.category.toLowerCase()}`
    }));
  }

  function operatingHours() {
    return [
      ["Monday", "6:00 AM - 12:00 AM"],
      ["Tuesday", "6:00 AM - 12:00 AM"],
      ["Wednesday", "6:00 AM - 12:00 AM"],
      ["Thursday", "6:00 AM - 12:00 AM"],
      ["Friday", "6:00 AM - 12:00 AM"],
      ["Saturday", "6:00 AM - 12:00 AM"],
      ["Sunday", "6:00 AM - 12:00 AM"]
    ];
  }

  function portfolioShowcaseItems(listing) {
    const names = ["Priya S.", "Jeffery P.", "Chuhao D."];
    const dates = ["July 2023", "November 2022", "December 2022"];
    return (listing?.gallery || [])
      .slice(0, 3)
      .map((image, index) => ({
        image,
        title: listing?.type === "venue" ? "event setup" : `${String(listing?.category || "vendor").toLowerCase()} project`,
        byline: `Submitted by ${names[index % names.length]}`,
        date: dates[index % dates.length]
      }));
  }

  function toggleDetailAccordion(key) {
    setDetailAccordions((current) => ({ ...current, [key]: !current[key] }));
  }

  function archiveCategoryValue(name) {
    const map = {
      "Venue Rental": "Venue",
      "Event Planning": "Event Planner",
      "Makeup & Beauty": "Makeup & Styling"
    };

    return map[name] || name;
  }

  function openClientArchive(overrides = {}) {
    const hasCategoryOverride = Object.prototype.hasOwnProperty.call(overrides, "category");
    const nextType = overrides.type ?? archiveFilters.type;
    const nextPath = archivePathForType(nextType);

    setShowClientArchive(true);
    setShowVendorApplyPage(false);
    setSelectedListingSlug(null);
    setShowGalleryLightbox(false);
    setArchiveFilters((current) => ({
      ...current,
      q: overrides.q ?? current.q,
      city: overrides.city ?? current.city,
      type: overrides.type ?? current.type,
      category: hasCategoryOverride ? overrides.category : "all",
      price: overrides.price ?? current.price,
      attendees: overrides.attendees ?? current.attendees,
      sort: overrides.sort ?? current.sort
    }));
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openVendorArchive(overrides = {}) {
    openClientArchive({
      ...overrides,
      type: "vendor"
    });
  }

  function openLegalPage(page) {
    const nextPath = page === "terms" ? "/terms-of-service" : "/privacy-policy";
    setPortal("client");
    setLegalPage(page);
    setShowClientArchive(false);
    setSelectedListingSlug(null);
    setSelectedListingDetail(null);
    setListingDetailState("idle");
    setShowVendorApplyPage(false);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function applySearchSuggestion(suggestion, context = "client") {
    setShowClientQuerySuggestions(false);
    setShowArchiveQuerySuggestions(false);

    if (suggestion.kind === "Vendor" || suggestion.kind === "Venue") {
      if (suggestion.slug) openListingDetail(suggestion.slug);
      return;
    }

    if (suggestion.kind === "Category") {
      if (archiveCategoryValue(suggestion.category) === "Venue") {
        openClientArchive({ type: "venue", category: "Venue" });
      } else {
        openVendorArchive({ category: suggestion.category });
      }
      return;
    }

    if (context === "archive") {
      setArchiveFilters((current) => ({ ...current, q: suggestion.label }));
      return;
    }

    setClientSearch((current) => ({ ...current, q: suggestion.label }));
  }

  function openVendorApplyPage() {
    setPortal("client");
    setLegalPage(null);
    setShowClientArchive(false);
    setSelectedListingSlug(null);
    setSelectedListingDetail(null);
    setListingDetailState("idle");
    setShowVendorApplyPage(true);
    if (window.location.pathname !== "/list-your-business") {
      window.history.pushState({}, "", "/list-your-business");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeClientArchive() {
    setLegalPage(null);
    setShowClientArchive(false);
    setShowArchiveFilterPanel(false);
    if (window.location.pathname !== "/") {
      window.history.pushState({}, "", "/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeVendorApplyPage() {
    setLegalPage(null);
    setShowVendorApplyPage(false);
    if (window.location.pathname !== "/") {
      window.history.pushState({}, "", "/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openListingDetail(slug) {
    setLegalPage(null);
    setSelectedListingSlug(slug);
    setShowClientArchive(false);
    setShowVendorApplyPage(false);
    setShowGalleryLightbox(false);
    setShowAvailability(false);
    setDetailAccordions({
      specialties: true,
      contact: true,
      policies: true,
      parking: false,
      hostRules: false
    });
    const nextPath = `/listing/${encodeURIComponent(slug)}`;
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeListingDetail() {
    const fallbackType = selectedListingDetail?.listing?.type || "vendor";
    setSelectedListingSlug(null);
    setSelectedListingDetail(null);
    setListingDetailState("idle");
    setShowAvailability(false);
    setShowGalleryLightbox(false);
    openClientArchive({ type: fallbackType, category: "all" });
  }

  function updateVendorApplicationField(field, value) {
    setVendorApplicationForm((current) => ({ ...current, [field]: value }));
  }

  function toggleVendorApplicationSpecialty(specialty) {
    setVendorApplicationForm((current) => {
      if (specialty === "All") {
        return {
          ...current,
          specialties: current.specialties.includes("All") ? [] : ["All"]
        };
      }

      const next = current.specialties.includes(specialty)
        ? current.specialties.filter((item) => item !== specialty)
        : [...current.specialties.filter((item) => item !== "All"), specialty];
      return { ...current, specialties: next };
    });
  }

  async function submitVendorApplication() {
    const payload = {
      name: String(vendorApplicationForm.ownerName || "").trim(),
      businessName: String(vendorApplicationForm.businessName || "").trim(),
      category: String(vendorApplicationForm.category || "").trim(),
      city: String(vendorApplicationForm.city || "").trim(),
      description: String(vendorApplicationForm.description || "").trim(),
      priceFrom: String(vendorApplicationForm.priceFrom || "").trim(),
      yearsInBusiness: String(vendorApplicationForm.yearsInBusiness || "").trim(),
      email: String(vendorApplicationForm.email || "").trim(),
      phone: String(vendorApplicationForm.phone || "").trim(),
      whatsapp: String(vendorApplicationForm.whatsapp || "").trim(),
      website: String(vendorApplicationForm.website || "").trim(),
      instagram: String(vendorApplicationForm.instagram || "").trim(),
      facebook: String(vendorApplicationForm.facebook || "").trim(),
      specialties: vendorApplicationForm.specialties || []
    };

    if (!payload.businessName || !payload.name || !payload.category || !payload.city || !payload.email) {
      setApplicationSubmitState("Please complete the required business, owner, category, city, and email fields.");
      return;
    }

    setApplicationSubmitState("Submitting application...");

    try {
      const response = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setVendorApplicationForm({
        businessName: "",
        ownerName: "",
        category: "",
        city: "",
        description: "",
        priceFrom: "",
        yearsInBusiness: "",
        email: "",
        phone: "",
        whatsapp: "",
        website: "",
        instagram: "",
        facebook: "",
        specialties: []
      });
      setApplicationSubmitState(`Application submitted. Your listing is pending review and vendor portal access will be emailed after approval${response?.application?.slug ? ` for ${response.application.slug}` : ""}.`);
    } catch (error) {
      setApplicationSubmitState(error.message || "Application submission failed.");
    }
  }

  function updateAuthField(field, value) {
    setAuthForm((current) => ({ ...current, [field]: value }));
  }

  async function submitAuthForm(event) {
    event.preventDefault();
    setAuthPending(true);
    setAuthError("");

    const isRegister = portal === "vendor" && authMode === "register";
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = isRegister
      ? {
          name: authForm.name.trim(),
          email: authForm.email.trim(),
          password: authForm.password,
          businessName: authForm.businessName.trim(),
          phone: authForm.phone.trim(),
          category: authForm.category.trim(),
          city: authForm.city.trim()
        }
      : {
          email: authForm.email.trim(),
          password: authForm.password
        };

    try {
      const response = await api(endpoint, {
        method: "POST",
        body: JSON.stringify(body)
      });

      const nextSession = enrichSessionPayload({
        ...response.session,
        accessToken: response.auth?.accessToken,
        refreshToken: response.auth?.refreshToken,
        authProvider: response.auth?.provider,
        authUserId: response.auth?.userId
      });

      writeSession(nextSession);
      setSession(nextSession);
      setAuthForm((current) => ({
        ...current,
        password: ""
      }));

      const destination = portalPath(nextSession.role === "admin" ? "admin" : "vendor");
      const currentPortal = nextSession.role === "admin" ? "admin" : "vendor";
      setPortal(currentPortal);

      if (window.location.pathname !== destination) {
        window.history.pushState({}, "", destination);
      }
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthPending(false);
    }
  }

  const vendorDashboardMenu = useMemo(
    () => [
      { icon: LayoutDashboard, label: "Dashboard", section: "dashboard", badge: null },
      { icon: ImageIcon, label: "Listings", section: "listings", badge: null },
      { icon: MessageSquare, label: "Leads", section: "leads", badge: null },
      { icon: Users, label: "Clients", section: "clients", badge: null },
      { icon: BarChart3, label: "Analytics", section: "analytics", badge: null }
    ],
    []
  );

  const vendorPublicProfileMenu = [
    { label: "Basic Info", section: "profile" },
    { label: "Media Gallery", section: "media" },
    { label: "Calendar & Availability", section: "availability" },
    { label: "Service Areas", section: "service-areas" },
    { label: "Packages & Pricing", section: "packages" },
    { label: "Listing Settings", section: "listing-settings" }
  ];
  const vendorAccountMenu = [
    { label: "Policies", section: "policies" },
    { label: "Reviews", section: "reviews" },
    { label: "Support & Requests", section: "support" },
    { label: "Documents & Quotes", section: "quotes" },
    { label: "Notification Settings", section: "notifications" }
  ];
  const currentVendorSlug = vendorData?.vendor?.slug || session?.vendorSlug || "";
  const vendorListingsRows = useMemo(() => {
    if (!currentVendorSlug) return [];

    const seed = listings.filter((item) => {
      if (!item || item.type !== "vendor") return false;
      if (item.ownerVendorSlug) return item.ownerVendorSlug === currentVendorSlug;
      return item.slug === currentVendorSlug;
    });
    const seen = new Set();
    const rows = [];

    for (const item of seed) {
      const key = item?.slug || item?.id || item?.businessName;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      rows.push(item);
    }

    return rows.slice(0, 24);
  }, [currentVendorSlug, listings]);

  function viewVendorListing(item) {
    if (item?.slug) {
      window.location.href = publicMarketplaceUrl(`/listing/${encodeURIComponent(item.slug)}`);
    }
  }

    function openVendorListingEditor(item = null) {
    const policyDefaults = createVendorPolicyDraft(vendorPolicyDraft);
    const existingAvailability = item?.availability && typeof item.availability === "object" ? item.availability : {};
    const policyUsesDefault = (flag, field, defaultValue) =>
      existingAvailability[flag] ?? (!existingAvailability[field] || existingAvailability[field] === defaultValue);
    const nextDraft = item
      ? {
          id: item.id || "",
          slug: item.slug || "",
          businessName: item.businessName || "",
          category: item.category || "",
          city: item.city || "",
          priceFrom: item.priceFrom || "",
          description: item.description || "",
          longDescription: item.longDescription || item.description || "",
          status: item.status || "approved",
          featured: Boolean(item.featured),
          images: (item.gallery?.length ? item.gallery : item.image ? [item.image] : []).slice(0, 6),
          culturalSpecialties: uniqueStringArray(item.culturalSpecialties?.length ? item.culturalSpecialties : item.tags || []),
          includedFeatures: uniqueStringArray(existingAvailability.includedFeatures?.length ? existingAvailability.includedFeatures : policyDefaults.includedFeatures),
          parkingMode: existingAvailability.parkingMode || policyDefaults.parkingMode,
          parkingSummary: existingAvailability.parkingSummary || policyDefaults.parkingSummary,
          parkingOptions: uniqueStringArray(existingAvailability.parkingOptions?.length ? existingAvailability.parkingOptions : policyDefaults.parkingOptions),
          vendorRules: existingAvailability.vendorRules || policyDefaults.vendorRules,
          useDefaultVendorRules: policyUsesDefault("useDefaultVendorRules", "vendorRules", policyDefaults.vendorRules),
          bookingPolicyTitle: existingAvailability.bookingPolicyTitle || policyDefaults.bookingPolicyTitle,
          bookingPolicyBody: existingAvailability.bookingPolicyBody || policyDefaults.bookingPolicyBody,
          useDefaultBookingPolicy: policyUsesDefault("useDefaultBookingPolicy", "bookingPolicyBody", policyDefaults.bookingPolicyBody),
          cancellationPolicyTitle: existingAvailability.cancellationPolicyTitle || policyDefaults.cancellationPolicyTitle,
          cancellationPolicyBody: existingAvailability.cancellationPolicyBody || policyDefaults.cancellationPolicyBody,
          useDefaultCancellationPolicy: policyUsesDefault("useDefaultCancellationPolicy", "cancellationPolicyBody", policyDefaults.cancellationPolicyBody),
          refundPolicyBody: existingAvailability.refundPolicyBody || policyDefaults.refundPolicyBody,
          useDefaultRefundPolicy: policyUsesDefault("useDefaultRefundPolicy", "refundPolicyBody", policyDefaults.refundPolicyBody),
          healthSafetyMeasures: uniqueStringArray(existingAvailability.healthSafetyMeasures?.length ? existingAvailability.healthSafetyMeasures : policyDefaults.healthSafetyMeasures)
        }
      : {
          id: `vendor-listing-${Date.now()}`,
          slug: "",
          businessName: "",
          category: "",
          city: "",
          priceFrom: "",
          description: "",
          longDescription: "",
          status: "approved",
          featured: false,
          images: [],
          culturalSpecialties: [],
          includedFeatures: [],
          parkingMode: "",
          parkingSummary: "",
          parkingOptions: [],
          vendorRules: policyDefaults.vendorRules,
          useDefaultVendorRules: true,
          bookingPolicyTitle: policyDefaults.bookingPolicyTitle,
          bookingPolicyBody: policyDefaults.bookingPolicyBody,
          useDefaultBookingPolicy: true,
          cancellationPolicyTitle: policyDefaults.cancellationPolicyTitle,
          cancellationPolicyBody: policyDefaults.cancellationPolicyBody,
          useDefaultCancellationPolicy: true,
          refundPolicyBody: policyDefaults.refundPolicyBody,
          useDefaultRefundPolicy: true,
          healthSafetyMeasures: []
        };
    setVendorListingMode(item ? "edit" : "create");
    setSelectedVendorListing(item);
    setVendorListingDraft(nextDraft);
    setShowVendorListingForm(true);
    setVendorListingImageError("");
  }

  function addVendorListingImages(files) {
    const nextFiles = Array.from(files || []);
    if (!nextFiles.length) return;
    setVendorListingDraft((current) => {
      if (!current) return current;
      const existing = current.images || [];
      const remainingSlots = Math.max(0, 6 - existing.length);
      if (!remainingSlots) {
        setVendorListingImageError("Maximum 6 images per listing.");
        return current;
      }
      const accepted = nextFiles.slice(0, remainingSlots).map((file) => URL.createObjectURL(file));
      if (nextFiles.length > remainingSlots) {
        setVendorListingImageError("Only the first 6 images were added.");
      } else {
        setVendorListingImageError("");
      }
      return { ...current, images: [...existing, ...accepted].slice(0, 6) };
    });
  }

  function removeVendorListingImage(index) {
    setVendorListingDraft((current) => {
      if (!current) return current;
      return { ...current, images: (current.images || []).filter((_, imageIndex) => imageIndex !== index) };
    });
    setVendorListingImageError("");
  }

  function updateVendorAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setVendorForm((current) => ({ ...current, avatarImage: URL.createObjectURL(file), avatarImageName: file.name }));
  }

  const compactSecondaryButtonClass =
    "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-neutral-300 bg-white px-3.5 text-[14px] leading-none font-medium tracking-normal text-black transition-colors hover:bg-neutral-50";
  const compactPrimaryButtonClass =
    "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-black px-3.5 text-[14px] leading-none font-medium tracking-normal text-white transition-colors hover:bg-neutral-800";
  const compactTextActionClass =
    "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 text-[14px] leading-none font-medium tracking-normal text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-black";

  async function saveVendorListingDraft() {
    if (!vendorListingDraft?.businessName) return;
    const policyDefaults = createVendorPolicyDraft(vendorPolicyDraft);
    const slug =
      vendorListingDraft.slug ||
      vendorListingDraft.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    const nextListing = {
      ...(selectedVendorListing || {}),
      ...vendorListingDraft,
      id: vendorListingDraft.id || `vendor-listing-${Date.now()}`,
      slug,
      type: "vendor",
      ownerVendorSlug: currentVendorSlug || slug,
      province: selectedVendorListing?.province || vendorData?.vendor?.province || "Ontario",
      priceFrom: Number(vendorListingDraft.priceFrom) || 0,
      rating: selectedVendorListing?.rating || vendorData?.vendor?.rating || 0,
      reviews: selectedVendorListing?.reviews || vendorData?.vendor?.reviews || 0,
      verified: selectedVendorListing?.verified ?? vendorData?.vendor?.verified ?? false,
      image: vendorListingDraft.images?.[0] || selectedVendorListing?.image || vendorData?.vendor?.image || IMG_EVENT_PLANNING,
      gallery: vendorListingDraft.images?.length ? vendorListingDraft.images : selectedVendorListing?.gallery || [],
      tags: uniqueStringArray(vendorListingDraft.culturalSpecialties || []),
      culturalSpecialties: uniqueStringArray(vendorListingDraft.culturalSpecialties || []),
      availability: {
        ...(selectedVendorListing?.availability || {}),
        parkingMode: vendorListingDraft.parkingMode || "",
        parkingSummary: vendorListingDraft.parkingSummary || "",
        parkingOptions: uniqueStringArray(vendorListingDraft.parkingOptions || []),
        vendorRules: vendorListingDraft.useDefaultVendorRules ? policyDefaults.vendorRules : vendorListingDraft.vendorRules || "",
        useDefaultVendorRules: Boolean(vendorListingDraft.useDefaultVendorRules),
        bookingPolicyTitle: vendorListingDraft.useDefaultBookingPolicy ? policyDefaults.bookingPolicyTitle : vendorListingDraft.bookingPolicyTitle || "",
        bookingPolicyBody: vendorListingDraft.useDefaultBookingPolicy ? policyDefaults.bookingPolicyBody : vendorListingDraft.bookingPolicyBody || "",
        useDefaultBookingPolicy: Boolean(vendorListingDraft.useDefaultBookingPolicy),
        cancellationPolicyTitle: vendorListingDraft.useDefaultCancellationPolicy ? policyDefaults.cancellationPolicyTitle : vendorListingDraft.cancellationPolicyTitle || "",
        cancellationPolicyBody: vendorListingDraft.useDefaultCancellationPolicy ? policyDefaults.cancellationPolicyBody : vendorListingDraft.cancellationPolicyBody || "",
        useDefaultCancellationPolicy: Boolean(vendorListingDraft.useDefaultCancellationPolicy),
        refundPolicyBody: vendorListingDraft.useDefaultRefundPolicy ? policyDefaults.refundPolicyBody : vendorListingDraft.refundPolicyBody || "",
        useDefaultRefundPolicy: Boolean(vendorListingDraft.useDefaultRefundPolicy),
        healthSafetyMeasures: uniqueStringArray(vendorListingDraft.healthSafetyMeasures || []),
        includedFeatures: uniqueStringArray(vendorListingDraft.includedFeatures || [])
      }
    };

    const isPrimaryVendorListing =
      currentVendorSlug &&
      ((selectedVendorListing?.slug && selectedVendorListing.slug === currentVendorSlug) ||
        (!selectedVendorListing && slug === currentVendorSlug));

    if (isPrimaryVendorListing) {
      setSaveState("Saving...");
      try {
        const payload = await api(`/api/dashboard/vendor/${currentVendorSlug}`, {
          method: "PUT",
          body: JSON.stringify({
            businessName: nextListing.businessName,
            category: nextListing.category,
            city: nextListing.city,
            priceFrom: nextListing.priceFrom,
            description: nextListing.description,
            longDescription: nextListing.longDescription,
            avatarImage: nextListing.image,
            gallery: nextListing.gallery,
            tags: nextListing.tags,
            culturalSpecialties: nextListing.culturalSpecialties,
            parkingMode: nextListing.availability.parkingMode,
            parkingSummary: nextListing.availability.parkingSummary,
            parkingOptions: nextListing.availability.parkingOptions,
            vendorRules: nextListing.availability.vendorRules,
            bookingPolicyTitle: nextListing.availability.bookingPolicyTitle,
            bookingPolicyBody: nextListing.availability.bookingPolicyBody,
            cancellationPolicyTitle: nextListing.availability.cancellationPolicyTitle,
            cancellationPolicyBody: nextListing.availability.cancellationPolicyBody,
            refundPolicyBody: nextListing.availability.refundPolicyBody,
            healthSafetyMeasures: nextListing.availability.healthSafetyMeasures,
            includedFeatures: nextListing.availability.includedFeatures
          })
        });
        nextListing.image = payload.vendor.image || nextListing.image;
        nextListing.gallery = payload.vendor.gallery || nextListing.gallery;
        nextListing.availability = payload.vendor.availability || nextListing.availability;
        nextListing.tags = payload.vendor.tags || nextListing.tags;
        nextListing.culturalSpecialties = payload.vendor.culturalSpecialties || nextListing.culturalSpecialties;
        nextListing.longDescription = payload.vendor.longDescription || nextListing.longDescription;
        setVendorData((current) => (current ? { ...current, vendor: payload.vendor } : current));
      } catch (error) {
        setSaveState(error.message);
        return;
      }
    } else if (currentVendorSlug) {
      setSaveState("Saving...");
      try {
        const listingPayload = {
          ...nextListing,
          availability: nextListing.availability,
          contact: nextListing.contact || vendorData?.vendor?.contact || vendor?.contact || {}
        };
        const response = selectedVendorListing
          ? await api(`/api/dashboard/vendor/${currentVendorSlug}/listings/${encodeURIComponent(selectedVendorListing.id || selectedVendorListing.slug)}`, {
              method: "PATCH",
              body: JSON.stringify(listingPayload)
            })
          : await api(`/api/dashboard/vendor/${currentVendorSlug}/listings`, {
              method: "POST",
              body: JSON.stringify(listingPayload)
            });
        if (response?.listing) {
          Object.assign(nextListing, response.listing);
        }
      } catch (error) {
        setSaveState(error.message);
        return;
      }
    }

    setListings((current) => {
      const exists = current.some((item) => (item.slug || item.id) === (selectedVendorListing?.slug || selectedVendorListing?.id));
      if (exists) {
        return current.map((item) => ((item.slug || item.id) === (selectedVendorListing?.slug || selectedVendorListing?.id) ? nextListing : item));
      }
      return [nextListing, ...current];
    });
    setShowVendorListingForm(false);
    setSelectedVendorListing(null);
    setVendorListingDraft(null);
    setSaveState(vendorListingMode === "create" ? "Listing created" : "Listing updated");
  }

  function listingIdentity(item = {}) {
    return item.slug || item.id || item.businessName || "";
  }

  function listingIsDeactivated(item = {}) {
    const status = String(item.status || "").toLowerCase();
    return status.includes("inactive") || status.includes("deactiv");
  }

  async function deactivateVendorListingDraft() {
    if (!vendorListingDraft) return;
    const nextListing = {
      ...(selectedVendorListing || {}),
      ...vendorListingDraft,
      status: "deactivated",
      featured: false
    };
    const targetKey = listingIdentity(selectedVendorListing) || listingIdentity(vendorListingDraft);
    const isPrimaryListing = selectedVendorListing?.slug && selectedVendorListing.slug === currentVendorSlug;
    if (currentVendorSlug && !isPrimaryListing) {
      setSaveState("Saving...");
      try {
        await api(`/api/dashboard/vendor/${currentVendorSlug}/listings/${encodeURIComponent(targetKey)}`, {
          method: "PATCH",
          body: JSON.stringify(nextListing)
        });
      } catch (error) {
        setSaveState(error.message);
        return;
      }
    }
    setListings((current) => {
      const source = current.length ? current : vendorListingsRows;
      const exists = source.some((item) => listingIdentity(item) === targetKey);
      if (!exists) return [nextListing, ...source];
      return source.map((item) => (listingIdentity(item) === targetKey ? { ...item, ...nextListing } : item));
    });
    setShowVendorListingForm(false);
    setSelectedVendorListing(null);
    setVendorListingDraft(null);
    setSaveState("Listing deactivated");
  }

  async function reactivateVendorListingDraft() {
    if (!vendorListingDraft) return;
    const nextListing = {
      ...(selectedVendorListing || {}),
      ...vendorListingDraft,
      status: "approved"
    };
    const targetKey = listingIdentity(selectedVendorListing) || listingIdentity(vendorListingDraft);
    const isPrimaryListing = selectedVendorListing?.slug && selectedVendorListing.slug === currentVendorSlug;
    if (currentVendorSlug && !isPrimaryListing) {
      setSaveState("Saving...");
      try {
        await api(`/api/dashboard/vendor/${currentVendorSlug}/listings/${encodeURIComponent(targetKey)}`, {
          method: "PATCH",
          body: JSON.stringify(nextListing)
        });
      } catch (error) {
        setSaveState(error.message);
        return;
      }
    }
    setListings((current) => {
      const source = current.length ? current : vendorListingsRows;
      const exists = source.some((item) => listingIdentity(item) === targetKey);
      if (!exists) return [nextListing, ...source];
      return source.map((item) => (listingIdentity(item) === targetKey ? { ...item, ...nextListing } : item));
    });
    setShowVendorListingForm(false);
    setSelectedVendorListing(null);
    setVendorListingDraft(null);
    setSaveState("Listing reactivated");
  }

  async function deleteVendorListingDraft() {
    if (!vendorListingDraft) return;
    const targetKey = listingIdentity(selectedVendorListing) || listingIdentity(vendorListingDraft);
    const isPrimaryListing = selectedVendorListing?.slug && selectedVendorListing.slug === currentVendorSlug;
    if (currentVendorSlug && !isPrimaryListing) {
      setSaveState("Saving...");
      try {
        await api(`/api/dashboard/vendor/${currentVendorSlug}/listings/${encodeURIComponent(targetKey)}`, {
          method: "DELETE"
        });
      } catch (error) {
        setSaveState(error.message);
        return;
      }
    }
    setListings((current) => {
      const source = current.length ? current : vendorListingsRows;
      return source.filter((item) => listingIdentity(item) !== targetKey);
    });
    setShowVendorListingForm(false);
    setSelectedVendorListing(null);
    setVendorListingDraft(null);
    setSaveState("Listing deleted");
  }

  function openVendorLeadDetail(lead) {
    setSelectedVendorLead(lead);
  }

  function openVendorLeadForm() {
    setVendorLeadDraft({
      name: "",
      phone: "",
      email: "",
      eventType: "",
      city: vendorForm?.city || vendorData?.vendor?.city || "",
      guests: "",
      budget: "",
      quoteAmount: "",
      due: "Today",
      eventDate: "",
      serviceDetails: "",
      notes: "",
      status: "New inquiry"
    });
    setShowVendorLeadForm(true);
  }

  async function saveVendorLeadDraft() {
    if (!vendorLeadDraft?.name) return;
    const vendorSlug = vendorData?.vendor?.slug || vendor?.slug;
    if (!vendorSlug) return;
    setSaveState("Saving...");
    try {
      const payload = await api(`/api/dashboard/vendor/${vendorSlug}/leads`, {
        method: "POST",
        body: JSON.stringify(vendorLeadDraft)
      });
      setVendorLeadRows((current) => [payload.lead, ...current]);
      setShowVendorLeadForm(false);
      setVendorLeadDraft(null);
      setSaveState("Lead added");
    } catch (error) {
      setSaveState(error.message);
    }
  }

  function addVendorLeadStatus() {
    const nextStatus = vendorLeadCustomStatus.trim();
    if (!nextStatus) return;
    setVendorLeadStatuses((current) => (current.includes(nextStatus) ? current : [...current, nextStatus]));
    setVendorLeadDraft((current) => (current ? { ...current, status: nextStatus } : current));
    setSelectedVendorLead((current) => (current ? { ...current, status: nextStatus } : current));
    setVendorLeadCustomStatus("");
  }

  async function updateSelectedVendorLeadStatus(status) {
    setSelectedVendorLead((current) => (current ? { ...current, status } : current));
    setVendorLeadRows((current) => current.map((lead) => (lead.id && lead.id === selectedVendorLead?.id ? { ...lead, status } : lead)));
    const vendorSlug = vendorData?.vendor?.slug || vendor?.slug;
    if (!vendorSlug || !selectedVendorLead?.id) return;
    try {
      await api(`/api/dashboard/vendor/${vendorSlug}/leads/${selectedVendorLead.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
    } catch (error) {
      setSaveState(error.message);
    }
  }

  function updateSelectedVendorLeadField(field, value) {
    setSelectedVendorLead((current) => (current ? { ...current, [field]: value } : current));
    setVendorLeadRows((current) =>
      current.map((lead) => {
        const sameLead =
          (selectedVendorLead?.id && lead.id === selectedVendorLead.id) ||
          (!selectedVendorLead?.id && lead.name === selectedVendorLead?.name && lead.email === selectedVendorLead?.email);
        return sameLead ? { ...lead, [field]: value } : lead;
      })
    );
  }

  const VendorListingsTable = ({ compact = false }) => (
    <div className="rounded-lg bg-white border border-neutral-200">
      {!compact && (
        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">My Listings</h3>
            <p className="text-xs text-neutral-500 mt-1">Only listings created for this vendor workspace appear here.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-neutral-500">{vendorListingsRows.length} listings</div>
            <button
              type="button"
              onClick={() => openVendorListingEditor()}
              className={compactPrimaryButtonClass}
            >
              New listing
            </button>
          </div>
        </div>
      )}
      {vendorListingsRows.length ? (
        <>
        <div className="divide-y divide-neutral-100 md:hidden">
          {vendorListingsRows.map((item) => (
            <button
              key={item.slug || item.id || item.businessName}
              type="button"
              onClick={() => openVendorListingEditor(item)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-neutral-50"
            >
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-semibold text-neutral-950">{item.businessName}</span>
                <span className="mt-1 block text-[12px] font-medium text-neutral-500">{item.category || "General"}</span>
              </span>
              <span className="shrink-0 text-[14px] font-semibold text-neutral-950">{money(item.priceFrom)}</span>
            </button>
          ))}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead className="bg-neutral-50">
              <tr className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                <th className="px-6 py-4 font-bold">Listing</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">City</th>
                <th className="px-6 py-4 font-bold">Price</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {vendorListingsRows.map((item) => (
                <tr key={item.slug || item.id || item.businessName} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => openVendorListingEditor(item)}
                      className="block max-w-full text-left text-sm font-semibold text-neutral-950 hover:underline"
                    >
                      {item.businessName}
                    </button>
                    <div className="text-xs text-neutral-500 mt-1 line-clamp-1">{item.description || "Description coming soon."}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-700">{item.category || "General"}</td>
                  <td className="px-6 py-4 text-sm text-neutral-700">{item.city || "Not set"}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{money(item.priceFrom)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex h-7 w-24 items-center justify-center rounded-full border px-3 text-[11px] font-medium ${
                        listingIsDeactivated(item)
                          ? "border-neutral-200 bg-neutral-100 text-neutral-600"
                          : item.featured
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {listingIsDeactivated(item) ? "Deactivated" : item.featured ? "Featured" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <a
                        href={item.slug ? publicMarketplaceUrl(`/listing/${encodeURIComponent(item.slug)}`) : "#"}
                        className={compactSecondaryButtonClass}
                      >
                        View
                      </a>
                      <button
                        type="button"
                        onClick={() => openVendorListingEditor(item)}
                        className={compactPrimaryButtonClass}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      ) : (
        <div className="px-6 py-10 text-center">
          <h4 className="text-[16px] font-semibold text-neutral-950">No listings yet</h4>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
            This workspace is blank until you create a real listing. Nothing should appear here by default.
          </p>
        </div>
      )}
    </div>
  );

  function addVendorService() {
    setVendorServices((current) => [
      ...current,
      {
        id: `service-${Date.now()}`,
        name: "",
        area: vendorForm?.city || vendorData?.vendor?.city || "",
        priceFrom: vendorForm?.priceFrom || vendorData?.vendor?.priceFrom || "",
        turnaround: "Custom quote",
        description: ""
      }
    ]);
  }

  function openVendorPackageEditor(service = null) {
    setOpenVendorPackageMenuId(null);
    setOpenVendorPackageMenuPosition(null);
    const draft =
      service || {
        id: `service-${Date.now()}`,
        name: "",
        area: vendorForm?.city || vendorData?.vendor?.city || "",
        priceFrom: vendorForm?.priceFrom || vendorData?.vendor?.priceFrom || "",
        turnaround: "Custom quote",
        description: "",
        status: "Active"
      };
    setVendorPackageMode(service ? "edit" : "create");
    setSelectedVendorPackage(service);
    setVendorPackageDraft({ ...draft });
    setShowVendorPackageForm(true);
  }

  function saveVendorPackageDraft() {
    if (!vendorPackageDraft?.name) return;
    setVendorServices((current) => {
      const exists = current.some((service) => service.id === selectedVendorPackage?.id);
      if (exists) {
        return current.map((service) => (service.id === selectedVendorPackage.id ? { ...service, ...vendorPackageDraft } : service));
      }
      return [{ ...vendorPackageDraft, id: vendorPackageDraft.id || `service-${Date.now()}` }, ...current];
    });
    setShowVendorPackageForm(false);
    setSelectedVendorPackage(null);
    setVendorPackageDraft(null);
    setOpenVendorPackageMenuId(null);
    setOpenVendorPackageMenuPosition(null);
    setSaveState(vendorPackageMode === "create" ? "Package created" : "Package updated");
  }

  function updateVendorService(id, field, value) {
    setVendorServices((current) => current.map((service) => (service.id === id ? { ...service, [field]: value } : service)));
  }

  function removeVendorService(id) {
    setVendorServices((current) => (current.length > 1 ? current.filter((service) => service.id !== id) : current));
  }

  function addVendorMedia(files) {
    const nextFiles = Array.from(files || []);
    if (!nextFiles.length) return;
    setVendorMediaItems((current) => {
      const nextItems = nextFiles.map((file) => ({
        id: `media-${Date.now()}-${file.name}`,
        src: URL.createObjectURL(file),
        featured: false
      }));
      return [...current, ...nextItems].slice(0, 15);
    });
    setSaveState("Media added");
  }

  function setFeaturedVendorMedia(id) {
    setVendorMediaItems((current) => current.map((item) => ({ ...item, featured: item.id === id })));
    setSaveState("Featured image updated");
  }

  function removeVendorMedia(id) {
    setVendorMediaItems((current) => {
      const nextItems = current.filter((item) => item.id !== id);
      if (!nextItems.some((item) => item.featured) && nextItems[0]) {
        return nextItems.map((item, index) => ({ ...item, featured: index === 0 }));
      }
      return nextItems;
    });
    setSaveState("Media removed");
  }

  function moveVendorMedia(id, direction) {
    setVendorMediaItems((current) => {
      const index = current.findIndex((item) => item.id === id);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= current.length) return current;
      const nextItems = [...current];
      [nextItems[index], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[index]];
      return nextItems;
    });
  }

  async function saveVendorMediaDraft() {
    const featured = vendorMediaItems.find((item) => item.featured) || vendorMediaItems[0];
    const gallery = vendorMediaItems.map((item) => item.src);
    if (!vendorData?.vendor?.slug) return;
    setSaveState("Saving...");
    try {
      const payload = await api(`/api/dashboard/vendor/${vendorData.vendor.slug}`, {
        method: "PUT",
        body: JSON.stringify({
          avatarImage: featured?.src || vendorData.vendor.image,
          gallery
        })
      });
      setVendorData((current) => (current ? { ...current, vendor: payload.vendor } : current));
      setSaveState("Media saved");
    } catch (error) {
      setSaveState(error.message);
    }
  }

  function packageStatusClass(status = "Active") {
    const normalized = status.toLowerCase();
    if (normalized.includes("draft")) return "border-neutral-200 bg-neutral-100 text-neutral-600";
    if (normalized.includes("pause")) return "border-amber-200 bg-amber-50 text-amber-700";
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  async function saveVendorProfile() {
    if (!vendorData || !vendorForm) return;
    setSaveState("Saving...");
    try {
      const payload = await api(`/api/dashboard/vendor/${vendorData.vendor.slug}`, {
        method: "PUT",
        body: JSON.stringify({
          ...vendorForm,
          servicePackages: vendorServices
        })
      });
      setVendorData((current) => ({
        ...current,
        vendor: payload.vendor
      }));
      setVendorServices(buildDefaultServices(payload.vendor));
      setSaveState("Saved");
    } catch (error) {
      setSaveState(error.message);
    }
  }

  function syncAdminVendorRecord(updatedVendor, counts) {
    setAdmin((current) => {
      if (!current) return current;
      return {
        ...current,
        vendors: (current.vendors || []).map((vendor) => (vendor.id === updatedVendor.id ? { ...vendor, ...updatedVendor } : vendor)),
        counts: counts || current.counts
      };
    });
  }

  async function updateVendorStatus(id, status) {
    setSaveState("Saving...");
    try {
      const payload = await api(`/api/admin/vendors/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      syncAdminVendorRecord(payload.vendor, payload.counts);
      setSaveState(
        status === "approved"
          ? "Vendor approved"
          : status === "rejected"
            ? "Application rejected"
            : status === "restricted"
              ? "Vendor restricted"
              : "Vendor status updated"
      );
    } catch (error) {
      setSaveState(error.message);
    }
  }

  async function updateAdminVendorReviewStatus(id, reviewStatus) {
    setSaveState("Saving...");
    try {
      const payload = await api(`/api/admin/vendors/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ reviewStatus })
      });
      syncAdminVendorRecord(payload.vendor, payload.counts);
      setSaveState("Application review status updated");
    } catch (error) {
      setSaveState(error.message);
    }
  }

  async function rejectVendorApplication(id, reason) {
    setSaveState("Saving...");
    try {
      const payload = await api(`/api/admin/vendors/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "rejected",
          reviewStatus: "rejected",
          rejectionReason: reason,
          rejectedAt: "Just now"
        })
      });
      syncAdminVendorRecord(payload.vendor, payload.counts);
      setAdminRejectionDraft(null);
      setSaveState("Application rejected with reason");
    } catch (error) {
      setSaveState(error.message);
    }
  }

  async function handleAdminRequest(requestId) {
    await updateAdminRequestStatus(requestId, completedRequestStatusKey, "Request marked completed");
    setAdminRequestReview(null);
  }

  async function updateAdminRequestStatus(requestId, status, successMessage = `Request marked ${status}`, extras = {}) {
    setSaveState("Saving...");
    try {
      const payload = await api(`/api/admin/requests/${requestId}`, {
        method: "PATCH",
        body: JSON.stringify({ status, ...extras })
      });
      setAdminRequestRows((current) => current.map((request) => (request.id === requestId ? payload.request : request)));
      setAdminRequestReview((current) => (current?.id === requestId ? payload.request : current));
      setSaveState(successMessage);
    } catch (error) {
      setSaveState(error.message);
    }
  }

  async function sendAdminRequestReply(requestId) {
    const reply = String(adminRequestReview?.replyDraft || "").trim();
    if (!reply) {
      setSaveState("Add a reply before sending");
      return;
    }
    await updateAdminRequestStatus(
      requestId,
      adminRequestReview?.status === "completed" ? "completed" : "in-progress",
      "Reply sent to vendor",
      {
        reply,
        note: adminRequestReview?.note || "",
        activityType: "admin_reply"
      }
    );
  }

  async function sendVendorReviewRequest(payload) {
    setSaveState("Saving...");
    try {
      const response = await api("/api/review-requests", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setReviewRequestRows((current) => [response.reviewRequest, ...current]);
      setSaveState(`Review request prepared for ${payload.clientName}`);
      return response.reviewRequest;
    } catch (error) {
      setSaveState(error.message);
      return null;
    }
  }

  async function submitLocalClientReview(reviewDraft) {
    setSaveState("Saving...");
    try {
      const response = await api("/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          ...reviewDraft,
          image: IMG_AVATAR1
        })
      });
      setReviewRows((current) => [response.review, ...current]);
      if (response.reviewRequest) {
        setReviewRequestRows((current) =>
          current.map((request) => (request.id === response.reviewRequest.id ? response.reviewRequest : request))
        );
      }
      setVendorReviewFormDraft(null);
      setSaveState("Sample client review submitted for admin approval");
    } catch (error) {
      setSaveState(error.message);
    }
  }

  async function updateAdminReviewStatus(reviewId, status) {
    setSaveState("Saving...");
    try {
      const response = await api(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      setReviewRows((current) => current.map((item) => (item.id === reviewId ? response.review : item)));
      if (response.reviewRequest) {
        setReviewRequestRows((current) =>
          current.map((request) => (request.id === response.reviewRequest.id ? response.reviewRequest : request))
        );
      }
      setSelectedAdminReviewId(null);
      setSaveState(`Review marked ${status}`);
    } catch (error) {
      setSaveState(error.message);
    }
  }

  function updateStatusDefinition(setter, key, field, value) {
    setter((current) =>
      current.map((status) =>
        status.key === key
          ? {
              ...status,
              [field]: value
            }
          : status
      )
    );
  }

  function addAdminRequestStatus() {
    const label = adminRequestStatusDraft.label.trim();
    const key = createStatusKey(label);
    if (!label || !key) return;
    if (adminRequestStatuses.some((status) => status.key === key)) {
      setSaveState("Request status already exists");
      return;
    }
    setAdminRequestStatuses((current) => [...current, { key, label, tone: adminRequestStatusDraft.tone, system: false }]);
    setAdminRequestStatusDraft({ label: "", tone: "amber" });
    setSaveState("Request status created");
  }

  function addAdminApplicationStatus() {
    const label = adminApplicationStatusDraft.label.trim();
    const key = createStatusKey(label);
    if (!label || !key) return;
    if (adminApplicationStatuses.some((status) => status.key === key)) {
      setSaveState("Application status already exists");
      return;
    }
    setAdminApplicationStatuses((current) => [...current, { key, label, tone: adminApplicationStatusDraft.tone, system: false }]);
    setAdminApplicationStatusDraft({ label: "", tone: "blue" });
    setSaveState("Application status created");
  }

  function removeAdminRequestStatus(key) {
    if (adminRequestStatuses.find((status) => status.key === key)?.system) {
      setSaveState("System request statuses cannot be removed");
      return;
    }
    if (adminRequests.some((request) => request.status === key)) {
      setSaveState("Move requests out of this status before removing it");
      return;
    }
    setAdminRequestStatuses((current) => current.filter((status) => status.key !== key));
    setSaveState("Request status removed");
  }

  function removeAdminApplicationStatus(key) {
    if (adminApplicationStatuses.find((status) => status.key === key)?.system) {
      setSaveState("System application statuses cannot be removed");
      return;
    }
    if (adminVendors.some((vendor) => vendor.reviewStatus === key)) {
      setSaveState("Move applications out of this status before removing it");
      return;
    }
    setAdminApplicationStatuses((current) => current.filter((status) => status.key !== key));
    setSaveState("Application status removed");
  }

  async function saveAdminSettings(message = "Admin settings saved") {
    setSaveState("Saving...");
    try {
      const payload = await api("/api/settings/admin", {
        method: "PUT",
        body: JSON.stringify(adminSettingsDraft)
      });
      setAdminSettingsDraft((current) => ({ ...current, ...DEFAULT_ADMIN_SETTINGS, ...(payload.settings || {}) }));
      setSaveState(message);
    } catch (error) {
      setSaveState(error.message);
    }
  }

  async function sendAdminDemoEmail(demoType) {
    const targetEmail = demoEmailRecipient.trim();
    if (!targetEmail) {
      setSaveState("Add an email address before sending a demo");
      return;
    }

    setSaveState("Sending demo email...");
    try {
      await api("/api/email-demos", {
        method: "POST",
        body: JSON.stringify({
          demoType,
          targetEmail,
          vendorName: "Golden Beats DJ Services",
          vendorSlug: "golden-beats-dj-services"
        })
      });
      setSaveState(`Demo email sent to ${targetEmail}`);
    } catch (error) {
      setSaveState(error.message);
    }
  }

  function toggleAdminVendorFollowUp(id) {
    setAdminFollowUpVendorIds((current) => (current.includes(id) ? current.filter((vendorId) => vendorId !== id) : [...current, id]));
    setSaveState(adminFollowUpVendorIds.includes(id) ? "Follow-up flag removed" : "Vendor flagged for follow-up");
  }

  function toggleAdminRequestFollowUp(id) {
    setAdminFollowUpRequestIds((current) => (current.includes(id) ? current.filter((requestId) => requestId !== id) : [...current, id]));
    setSaveState(adminFollowUpRequestIds.includes(id) ? "Request flag removed" : "Request flagged for follow-up");
  }

  async function toggleVendorFeatured(id, featured) {
    setSaveState("Saving...");
    try {
      const payload = await api(`/api/admin/vendors/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ featured })
      });
      syncAdminVendorRecord(payload.vendor, payload.counts);
      setSaveState(featured ? "Vendor added to featured" : "Vendor removed from featured");
    } catch (error) {
      setSaveState(error.message);
    }
  }

  function navigateAdminSection(section, options = {}) {
    const nextSettingsSection = section === "settings" ? options.settingsSection || "general" : adminSettingsSection;
    setAdminSection(section);
    if (section === "settings") {
      setAdminSettingsSection(nextSettingsSection);
    }
    setSelectedAdminVendorId(null);
    setSelectedAdminReviewId(null);
    setAdminRequestReview(null);
    const nextPath = section === "overview" ? portalPath("admin") : section === "settings" ? adminSettingsPath(nextSettingsSection) : portalPath("admin", section);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigateAdminSettingsSection(section) {
    navigateAdminSection("settings", { settingsSection: section });
  }

  function handleAdminWorkspaceSearch() {
    const query = adminSearchQuery.trim().toLowerCase();
    setShowAdminSearchSuggestions(false);
    if (!query) {
      setSaveState("Enter a vendor, request, city, or category to search");
      return;
    }

    const vendorMatch = adminVendors.find((vendor) =>
      [
        vendor.businessName,
        vendor.category,
        vendor.city,
        vendor.province,
        vendor.ownerName,
        vendor.email
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );

    if (vendorMatch) {
      setSelectedAdminVendorId(vendorMatch.id);
      navigateAdminSection(vendorMatch.status === "pending" ? "vendor-queue" : "vendors");
      setSaveState(`Showing ${vendorMatch.businessName}`);
      return;
    }

    const requestMatch = adminRequests.find((request) =>
      [
        request.subject,
        request.requester,
        request.type,
        request.priority,
        request.email,
        request.message
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );

    if (requestMatch) {
      navigateAdminSection("requests");
      setAdminRequestReview({ ...requestMatch, note: requestMatch.adminNote || requestMatch.note || "", replyDraft: "" });
      setSaveState(`Showing ${requestMatch.subject}`);
      return;
    }

    navigateAdminSection("vendors");
    setSaveState(`No admin records found for "${adminSearchQuery.trim()}"`);
  }

  function applyAdminSearchSuggestion(suggestion) {
    setShowAdminSearchSuggestions(false);

    if (suggestion.kind === "Request") {
      const requestMatch = adminRequests.find((request) => request.id === suggestion.requestId);
      navigateAdminSection("requests");
      if (requestMatch) {
        setAdminRequestReview({ ...requestMatch, note: requestMatch.adminNote || requestMatch.note || "", replyDraft: "" });
        setSaveState(`Showing ${requestMatch.subject}`);
      }
      return;
    }

    setSelectedAdminVendorId(suggestion.vendorId);
    navigateAdminSection(suggestion.vendorStatus === "pending" ? "vendor-queue" : "vendors");
    setSaveState(`Showing ${suggestion.label}`);
  }

  const AdminVendorApplicationPanel = () => {
    if (!selectedAdminVendor) return null;
    const selectedReviewStatusMeta = findStatusMeta(
      adminApplicationStatuses,
      selectedAdminVendor.reviewStatus || selectedAdminVendor.status,
      selectedAdminVendor.reviewStatus || selectedAdminVendor.status
    );
    const matchingVendorUser = (admin?.users || []).find((user) => user.vendorSlug === selectedAdminVendor.slug) || null;
    const vendorSupportRequests = adminRequests
      .filter((request) => {
        const requesterSlug = String(request.requesterSlug || "").toLowerCase();
        const requesterName = String(request.requester || "").toLowerCase();
        const requesterEmail = String(request.email || "").toLowerCase();
        const vendorEmail = String(selectedAdminVendor.contact?.email || "").toLowerCase();
        return (
          requesterSlug === String(selectedAdminVendor.slug || "").toLowerCase() ||
          requesterName === String(selectedAdminVendor.businessName || "").toLowerCase() ||
          (vendorEmail && requesterEmail === vendorEmail)
        );
      })
      .sort((a, b) => Number(a.dateRank || 999) - Number(b.dateRank || 999));
    const vendorReviewRequests = reviewRequestRows.filter((request) => request.vendorSlug === selectedAdminVendor.slug);
    const vendorModerationReviews = reviewRows.filter((review) => review.vendorSlug === selectedAdminVendor.slug);
    const vendorReviewSummary = listingReviewSummary(selectedAdminVendor);
    const approvedReviews = vendorModerationReviews.filter((review) => review.status === "approved");
    const pendingReviews = vendorModerationReviews.filter((review) => review.status === "pending");
    const hiddenReviews = vendorModerationReviews.filter((review) => review.status === "hidden");
    const rejectedReviews = vendorModerationReviews.filter((review) => review.status === "rejected");
    const supportOpenCount = vendorSupportRequests.filter((request) => request.status !== completedRequestStatusKey).length;
    const servicePackageCount = Array.isArray(selectedAdminVendor.servicePackages) ? selectedAdminVendor.servicePackages.length : 0;
    const galleryCount = Array.isArray(selectedAdminVendor.gallery) ? selectedAdminVendor.gallery.length : 0;
    const profileCompletion = vendorCompleteness(selectedAdminVendor);
    const profileRisk = vendorRisk(selectedAdminVendor);
    const responseTime = selectedAdminVendor.metrics?.responseTime || "New";
    const localWouldBookAgainRate = approvedReviews.length
      ? Math.round((approvedReviews.filter((review) => review.wouldBookAgain).length / approvedReviews.length) * 100)
      : vendorReviewSummary.count
        ? 96
        : 0;
    const accountQualityScore = Math.max(
      42,
      Math.min(
        99,
        Math.round(
          profileCompletion * 0.52 +
            (selectedAdminVendor.verified ? 16 : 0) +
            Math.min(galleryCount, 6) * 3 +
            Math.min(servicePackageCount || 1, 4) * 4 -
            supportOpenCount * 5 -
            pendingReviews.length * 3
        )
      )
    );
    const accountQualityTone =
      accountQualityScore >= 86 ? "text-green-700 border-green-200 bg-green-50" : accountQualityScore >= 70 ? "text-amber-700 border-amber-200 bg-amber-50" : "text-red-700 border-red-200 bg-red-50";
    const fallbackText = (value, fallback = "Not provided") => {
      if (value === null || value === undefined) return fallback;
      if (typeof value === "string" && !value.trim()) return fallback;
      return value;
    };
    const yearsInBusinessValue =
      typeof selectedAdminVendor.yearsInBusiness === "number"
        ? `${selectedAdminVendor.yearsInBusiness} yrs`
        : typeof selectedAdminVendor.yearsInBusiness === "string"
          ? selectedAdminVendor.yearsInBusiness
          : "";
    const snapshotFallbackValues = new Set(["Not provided", "Not listed", "Owner record pending", "Prototype record"]);
    const specialtyTags = Array.isArray(selectedAdminVendor.tags) ? selectedAdminVendor.tags.filter(Boolean) : [];
    const languageTags = Array.isArray(selectedAdminVendor.languages) ? selectedAdminVendor.languages.filter(Boolean) : [];
    const eventTypeTags = Array.isArray(selectedAdminVendor.eventTypes) ? selectedAdminVendor.eventTypes.filter(Boolean) : [];
    const businessSnapshotRows = [
      { label: "Owner", value: fallbackText(matchingVendorUser?.name, "Not provided"), icon: Users },
      { label: "Email", value: fallbackText(matchingVendorUser?.email || selectedAdminVendor.contact?.email, "Not provided"), icon: Mail },
      { label: "Phone", value: fallbackText(selectedAdminVendor.contact?.phone, "Not provided"), icon: Phone },
      { label: "Website", value: fallbackText(selectedAdminVendor.website, "Not listed"), icon: Globe },
      { label: "Starting price", value: money(selectedAdminVendor.priceFrom || 0), icon: CreditCard },
      { label: "Years in business", value: fallbackText(yearsInBusinessValue, "Not provided"), icon: Building2 },
      { label: "Portfolio images", value: String(galleryCount), icon: ImageIcon },
      { label: "Video links", value: String(selectedAdminVendor.videoLinks?.length || 0), icon: Clapperboard },
      { label: "Primary market", value: fallbackText([selectedAdminVendor.city, selectedAdminVendor.province].filter(Boolean).join(", "), "Not listed"), icon: MapPin },
      { label: "Listing ID", value: fallbackText(selectedAdminVendor.id || selectedAdminVendor.slug, "Not listed"), icon: FileText },
      { label: "Listed on", value: fallbackText(selectedAdminVendor.listedOn, "Not listed"), icon: CalendarDays },
      { label: "Response time", value: responseTime, icon: Clock }
    ];
    const qualityChecklist = [
      {
        label: "Business profile fields complete",
        passed: profileCompletion >= 85,
        detail: `${profileCompletion}% complete`
      },
      {
        label: "Verification status",
        passed: Boolean(selectedAdminVendor.verified),
        detail: selectedAdminVendor.verified ? "Verified by admin" : "Still needs verification"
      },
      {
        label: "Media coverage",
        passed: galleryCount >= 3,
        detail: `${galleryCount} gallery asset${galleryCount === 1 ? "" : "s"}`
      },
      {
        label: "Service packaging",
        passed: servicePackageCount >= 1,
        detail: `${Math.max(servicePackageCount, 1)} live offer${Math.max(servicePackageCount, 1) === 1 ? "" : "s"}`
      },
      {
        label: "Support load",
        passed: supportOpenCount <= 1,
        detail: `${supportOpenCount} open support request${supportOpenCount === 1 ? "" : "s"}`
      }
    ];
    const adminOnlyFlags = [
      {
        label: "Risk tier",
        value: `${profileRisk} risk`,
        tone: profileRisk === "High" ? "border-red-200 bg-red-50 text-red-700" : profileRisk === "Medium" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-green-200 bg-green-50 text-green-700"
      },
      {
        label: "Review moderation",
        value: pendingReviews.length ? `${pendingReviews.length} pending` : "No review backlog",
        tone: pendingReviews.length ? "border-amber-200 bg-amber-50 text-amber-700" : "border-neutral-200 bg-neutral-50 text-neutral-700"
      },
      {
        label: "Support pressure",
        value: supportOpenCount >= 2 ? "Needs attention" : supportOpenCount === 1 ? "Monitor" : "Clear",
        tone: supportOpenCount >= 2 ? "border-red-200 bg-red-50 text-red-700" : supportOpenCount === 1 ? "border-amber-200 bg-amber-50 text-amber-700" : "border-green-200 bg-green-50 text-green-700"
      },
      {
        label: "Featured status",
        value: selectedAdminVendor.featured ? "Featured live" : "Standard listing",
        tone: selectedAdminVendor.featured ? "border-blue-200 bg-blue-50 text-blue-700" : "border-neutral-200 bg-neutral-50 text-neutral-700"
      }
    ];
    const topCards = [
      {
        label: "Account quality",
        value: `${accountQualityScore}%`,
        detail: "Composite admin-only health score",
        tone: accountQualityTone,
        icon: ShieldCheck
      },
      {
        label: "Open support",
        value: supportOpenCount,
        detail: "Vendor support and escalation requests",
        tone: supportOpenCount > 1 ? "border-red-200 bg-red-50 text-red-700" : "border-neutral-200 bg-white text-neutral-950",
        icon: MessageSquare
      },
      {
        label: "Listing footprint",
        value: Math.max(servicePackageCount, 1),
        detail: "Live listing offers/packages",
        tone: "border-neutral-200 bg-white text-neutral-950",
        icon: Building2
      },
      {
        label: "Review quality",
        value: vendorReviewSummary.rating ? `${vendorReviewSummary.rating}/5` : "No rating",
        detail: `${vendorReviewSummary.count} total rating${vendorReviewSummary.count === 1 ? "" : "s"}`,
        tone: "border-neutral-200 bg-white text-neutral-950",
        icon: Star
      },
      {
        label: "Pending moderation",
        value: pendingReviews.length,
        detail: "Reviews awaiting admin action",
        tone: pendingReviews.length ? "border-amber-200 bg-amber-50 text-amber-700" : "border-neutral-200 bg-white text-neutral-950",
        icon: ClipboardList
      },
      {
        label: "Monthly profile views",
        value: selectedAdminVendor.metrics?.profileViewsMonth ?? 0,
        detail: `Response time ${responseTime}`,
        tone: "border-neutral-200 bg-white text-neutral-950",
        icon: Eye
      }
    ];

    return (
      <div className="fixed inset-x-0 bottom-0 top-16 z-[107] border-t border-neutral-200 md:left-72">
        <div className="relative h-full bg-black/15 backdrop-blur-[1px]">
        <button
          type="button"
          aria-label="Close vendor detail"
          className="absolute inset-0 cursor-default"
          onClick={() => setSelectedAdminVendorId(null)}
        />
        <section className="relative flex h-full w-full flex-col overflow-hidden bg-[#f7f7f5]">
          <div className="shrink-0 border-b border-neutral-200 bg-white px-6 py-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 shrink-0">
                  <SafeImage
                    src={selectedAdminVendor.image}
                    alt={selectedAdminVendor.businessName}
                    className="h-full w-full object-cover"
                    fallback={imageForCategory(selectedAdminVendor.category)}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Admin vendor intelligence</div>
                  <h2 className="mt-2 text-[30px] font-medium tracking-tight text-neutral-950">{selectedAdminVendor.businessName}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-neutral-500">
                    <span>{selectedAdminVendor.category}</span>
                    <span className="text-neutral-300">•</span>
                    <span>{selectedAdminVendor.city}, {selectedAdminVendor.province}</span>
                    <span className="text-neutral-300">•</span>
                    <span>From {money(selectedAdminVendor.priceFrom || 0)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusToneChipClass(selectedReviewStatusMeta?.tone)}`}>
                      {selectedReviewStatusMeta?.label || selectedAdminVendor.status}
                    </span>
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${profileRisk === "High" ? "border-red-200 bg-red-50 text-red-600" : profileRisk === "Medium" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-green-200 bg-green-50 text-green-600"}`}>
                      {profileRisk} risk
                    </span>
                    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600">
                      {profileCompletion}% profile complete
                    </span>
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${selectedAdminVendor.verified ? "border-green-200 bg-green-50 text-green-700" : "border-neutral-200 bg-neutral-50 text-neutral-700"}`}>
                      {selectedAdminVendor.verified ? "Verified account" : "Verification pending"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-end">
                <button
                  type="button"
                  onClick={() => setSelectedAdminVendorId(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600"
                >
                  <X size={16} />
                </button>
                <div className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-right">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Account owner</div>
                  <div className="mt-2 text-sm font-medium text-neutral-950">{matchingVendorUser?.name || "Owner record pending"}</div>
                  <div className="mt-1 text-xs text-neutral-500">{matchingVendorUser?.email || selectedAdminVendor.contact?.email || "No owner email on file"}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-6">
              {topCards.map((card) => {
                const Icon = card.icon;
                return (
                  <section key={card.label} className={`flex min-h-[168px] h-full flex-col rounded-lg border px-5 py-5 ${card.tone}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[10px] font-medium uppercase tracking-[0.14em] opacity-65">{card.label}</div>
                        <div className="mt-4 text-[30px] font-medium tracking-tight">{card.value}</div>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-md border border-black/5 bg-white/70">
                        <Icon size={18} />
                      </div>
                    </div>
                    <div className="mt-auto pt-6">
                      <p className="text-[12px] font-normal leading-5 opacity-75">{card.detail}</p>
                    </div>
                  </section>
                );
              })}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.95fr)]">
              <div className="space-y-6">
                <section className="rounded-lg border border-neutral-200 bg-white">
                  <div className="border-b border-neutral-100 px-6 py-5">
                    <div className="text-[16px] font-semibold tracking-tight text-neutral-950">Business snapshot</div>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">A deeper admin-only view of listing quality, positioning, and profile readiness.</p>
                  </div>
                  <div className="px-6 py-6">
                    <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2">
                      {businessSnapshotRows.map((item) => {
                        const Icon = item.icon;
                        const isFallbackValue = snapshotFallbackValues.has(String(item.value));
                        return (
                          <div key={item.label} className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-neutral-400">
                              <Icon size={18} />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">{item.label}</div>
                              <div className={`mt-1 break-words text-[14px] font-medium leading-7 ${isFallbackValue ? "text-amber-600" : "text-neutral-950"}`}>{item.value}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {selectedAdminVendor.status === "rejected" && selectedAdminVendor.rejectionReason && (
                      <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-5">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-red-500">Stored rejection reason</div>
                        <p className="mt-3 text-sm leading-6 text-red-700">{selectedAdminVendor.rejectionReason}</p>
                      </div>
                    )}
                    <div className="mt-8 grid gap-6 lg:grid-cols-3">
                      <div className="min-h-[148px] rounded-md border border-neutral-200 bg-neutral-50 px-5 py-5">
                        <div className="text-sm font-medium text-neutral-950">Specialties</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {specialtyTags.length ? specialtyTags.map((tag) => (
                            <span key={tag} className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
                              {tag}
                            </span>
                          )) : <span className="text-sm font-medium text-amber-600">Not listed</span>}
                        </div>
                      </div>
                      <div className="min-h-[148px] rounded-md border border-neutral-200 bg-neutral-50 px-5 py-5">
                        <div className="text-sm font-medium text-neutral-950">Languages</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {languageTags.length ? languageTags.map((language) => (
                            <span key={language} className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600">
                              {language}
                            </span>
                          )) : <span className="text-sm font-medium text-amber-600">Not listed</span>}
                        </div>
                      </div>
                      <div className="min-h-[148px] rounded-md border border-neutral-200 bg-neutral-50 px-5 py-5">
                        <div className="text-sm font-medium text-neutral-950">Event types</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {eventTypeTags.length ? eventTypeTags.map((eventType) => (
                            <span key={eventType} className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600">
                              {eventType}
                            </span>
                          )) : <span className="text-sm font-medium text-amber-600">Not listed</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="min-h-[520px] rounded-lg border border-neutral-200 bg-white">
                  <div className="border-b border-neutral-100 px-6 py-5">
                    <div className="text-[16px] font-semibold tracking-tight text-neutral-950">Account quality</div>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">Profile readiness signals that help admin quickly assess whether this account is stable, complete, and supportable.</p>
                  </div>
                  <div className="px-6 py-6">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full ${accountQualityScore >= 86 ? "bg-green-500" : accountQualityScore >= 70 ? "bg-amber-400" : "bg-red-500"}`}
                          style={{ width: `${accountQualityScore}%` }}
                        />
                      </div>
                      <div className="text-lg font-semibold text-neutral-950">{accountQualityScore}%</div>
                    </div>
                    <div className="grid gap-3">
                      {qualityChecklist.map((item) => (
                        <div key={item.label} className="flex items-start justify-between gap-4 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-4">
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-md ${item.passed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                              <CheckCircle size={14} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-neutral-950">{item.label}</div>
                              <div className="mt-1 text-sm text-neutral-500">{item.detail}</div>
                            </div>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${item.passed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {item.passed ? "Healthy" : "Needs work"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

              </div>

              <div className="space-y-6">
                <section className="rounded-lg border border-neutral-200 bg-white">
                  <div className="border-b border-neutral-100 px-6 py-5">
                    <div className="text-[16px] font-semibold tracking-tight text-neutral-950">Review workflow</div>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">Admin moderation state for the application itself, independent from live listing performance.</p>
                  </div>
                  <div className="px-6 py-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`inline-flex h-8 min-w-28 items-center justify-center rounded-full border px-3 text-[11px] font-medium ${statusToneChipClass(selectedReviewStatusMeta?.tone)}`}>
                          {selectedReviewStatusMeta?.label || selectedAdminVendor.status}
                        </span>
                        <span className="text-sm text-neutral-500">Current review state</span>
                      </div>
                      <div className="relative">
                        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Change status</span>
                        <button
                          type="button"
                          onClick={() => setShowAdminVendorStatusMenu((current) => !current)}
                          className={`flex h-12 w-full items-center justify-between rounded-md border bg-white px-4 text-left text-sm font-medium shadow-sm transition-colors ${statusToneChipClass(selectedReviewStatusMeta?.tone)}`}
                        >
                          <span>{selectedReviewStatusMeta?.label || selectedAdminVendor.status}</span>
                          <ChevronDown size={16} className={`text-current transition-transform ${showAdminVendorStatusMenu ? "rotate-180" : ""}`} />
                        </button>
                        {showAdminVendorStatusMenu && (
                          <div className="absolute left-0 right-0 top-[74px] z-[130] overflow-hidden rounded-xl border border-neutral-200 bg-white p-2">
                            {adminApplicationStatuses.map((status) => {
                              const active = (selectedAdminVendor.reviewStatus || selectedAdminVendor.status) === status.key;
                              return (
                                <button
                                  key={status.key}
                                  type="button"
                                  onClick={() => {
                                    updateAdminVendorReviewStatus(selectedAdminVendor.id, status.key);
                                    setShowAdminVendorStatusMenu(false);
                                  }}
                                  className={`flex h-11 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-medium transition-colors ${
                                    active ? statusToneChipClass(status.tone) : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                                  }`}
                                >
                                  <span>{status.label}</span>
                                  {active && <CheckCircle size={15} />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-lg border border-neutral-200 bg-white">
                  <div className="border-b border-neutral-100 px-6 py-5">
                    <div className="text-[16px] font-semibold tracking-tight text-neutral-950">Contact and ownership</div>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">The admin-only operating record for who owns the account and how the team can reach them.</p>
                  </div>
                  <div className="grid gap-3 px-6 py-6">
                    <div className="flex items-center gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm text-neutral-700">
                      <Users size={16} className="text-neutral-400" />
                      <div>
                        <div className="font-medium text-neutral-950">{matchingVendorUser?.name || "Owner profile pending"}</div>
                        <div className="text-neutral-500">{matchingVendorUser ? "Primary account holder" : "No linked user record found"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm text-neutral-700">
                      <Mail size={16} className="text-neutral-400" />
                      <div>
                        <div className="font-medium text-neutral-950">{matchingVendorUser?.email || selectedAdminVendor.contact?.email || "No email provided"}</div>
                        <div className="text-neutral-500">Primary admin contact email</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm text-neutral-700">
                      <Phone size={16} className="text-neutral-400" />
                      <div>
                        <div className="font-medium text-neutral-950">{selectedAdminVendor.contact?.phone || "No phone provided"}</div>
                        <div className="text-neutral-500">Direct business phone</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm text-neutral-700">
                      <MessageSquare size={16} className="text-neutral-400" />
                      <div>
                        <div className="font-medium text-neutral-950">{selectedAdminVendor.contact?.whatsapp || "No WhatsApp provided"}</div>
                        <div className="text-neutral-500">WhatsApp escalation contact</div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="min-h-[520px] rounded-lg border border-neutral-200 bg-white">
                  <div className="border-b border-neutral-100 px-6 py-5">
                    <div className="text-[16px] font-semibold tracking-tight text-neutral-950">Performance and rating quality</div>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">Signals that help admin judge consistency, quality, and platform trust.</p>
                  </div>
                  <div className="grid gap-3 px-6 py-6">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Rating quality</div>
                        <div className="mt-3 text-2xl font-medium text-neutral-950">{vendorReviewSummary.rating ? `${vendorReviewSummary.rating}/5` : "New"}</div>
                        <div className="mt-1 text-sm text-neutral-500">{vendorReviewSummary.count} published rating{vendorReviewSummary.count === 1 ? "" : "s"}</div>
                      </div>
                      <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Would book again</div>
                        <div className="mt-3 text-2xl font-medium text-neutral-950">{localWouldBookAgainRate ? `${localWouldBookAgainRate}%` : "N/A"}</div>
                        <div className="mt-1 text-sm text-neutral-500">Based on approved reviews</div>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-md border border-neutral-200 bg-white px-4 py-4 text-sm">
                        <div className="text-neutral-500">Pending moderation</div>
                        <div className="mt-2 font-medium text-neutral-950">{pendingReviews.length}</div>
                      </div>
                      <div className="rounded-md border border-neutral-200 bg-white px-4 py-4 text-sm">
                        <div className="text-neutral-500">Hidden or rejected</div>
                        <div className="mt-2 font-medium text-neutral-950">{hiddenReviews.length + rejectedReviews.length}</div>
                      </div>
                    </div>
                    <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium text-neutral-950">Latest review activity</div>
                        <span className={`rounded-full border px-3 py-1 text-[11px] font-medium ${pendingReviews.length ? "border-amber-200 bg-amber-50 text-amber-700" : "border-green-200 bg-green-50 text-green-700"}`}>
                          {pendingReviews.length ? "Moderation needed" : "Healthy"}
                        </span>
                      </div>
                      <div className="mt-4 space-y-3">
                        {(vendorModerationReviews.length ? vendorModerationReviews : vendorReviewRequests).slice(0, 3).map((item) => {
                          const isReview = "reviewerName" in item;
                          const tone = isReview ? reviewStatusMeta(item.status).tone : reviewRequestStatusMeta(item.status).tone;
                          const metaLabel = isReview ? reviewStatusMeta(item.status).label : reviewRequestStatusMeta(item.status).label;
                          return (
                            <div key={item.id} className="rounded-md border border-neutral-200 bg-white px-4 py-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-sm font-medium text-neutral-950">
                                    {isReview ? item.reviewerName : item.clientName}
                                  </div>
                                  <div className="mt-1 text-sm text-neutral-500">
                                    {isReview ? item.eventType : `${item.eventType} review request`}
                                  </div>
                                </div>
                                <span className={`rounded-full border px-3 py-1 text-[11px] font-medium ${statusToneChipClass(tone)}`}>
                                  {metaLabel}
                                </span>
                              </div>
                              <div className="mt-3 text-xs text-neutral-500">
                                {isReview ? item.submittedAt : item.sentAt}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>

              </div>
            </div>

            <section className="mt-6 rounded-lg border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 px-6 py-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[16px] font-semibold tracking-tight text-neutral-950">Support requests</div>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">Admin-only support workload and escalation context tied to this vendor account.</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${supportOpenCount ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>
                    {supportOpenCount ? `${supportOpenCount} open` : "No open support"}
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-neutral-50 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Subject</th>
                      <th className="px-6 py-4 font-semibold">Type</th>
                      <th className="px-6 py-4 font-semibold">Priority</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Age</th>
                      <th className="px-6 py-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {vendorSupportRequests.length ? (
                      vendorSupportRequests.map((request) => {
                        const requestStatusMeta = findStatusMeta(adminRequestStatuses, request.status, request.status);
                        return (
                          <tr key={request.id}>
                            <td className="px-6 py-4">
                              <div className="font-medium text-neutral-950">{request.subject}</div>
                              <div className="mt-1 max-w-[520px] text-xs leading-5 text-neutral-500">{request.message}</div>
                            </td>
                            <td className="px-6 py-4 text-neutral-600">{request.type}</td>
                            <td className="px-6 py-4">
                              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${request.priority === "High" ? "bg-red-100 text-red-700" : request.priority === "Medium" ? "bg-amber-100 text-amber-700" : "bg-neutral-100 text-neutral-700"}`}>
                                {request.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex h-7 min-w-24 items-center justify-center rounded-full border px-3 text-[11px] font-medium ${statusToneChipClass(requestStatusMeta?.tone)}`}>
                                {requestStatusMeta?.label || request.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-neutral-600">{request.age}</td>
                            <td className="px-6 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAdminVendorId(null);
                                  setAdminRequestReview({ ...request, note: request.adminNote || request.note || "", replyDraft: "" });
                                  navigateAdminSection("requests");
                                }}
                                className="inline-flex h-9 items-center justify-center rounded-md border border-neutral-200 bg-white px-3.5 text-sm font-medium text-neutral-900"
                              >
                                Open request
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-sm text-neutral-500">
                          No support tickets or escalation requests are currently linked to this vendor.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          <div className="grid shrink-0 gap-3 border-t border-neutral-200 bg-white px-6 py-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="flex flex-wrap items-center gap-2">
              {selectedAdminVendor.status === "approved" ? (
                <>
                  <button
                    type="button"
                    onClick={() => toggleVendorFeatured(selectedAdminVendor.id, !selectedAdminVendor.featured)}
                    className="inline-flex h-11 items-center justify-center rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-neutral-50"
                  >
                    {selectedAdminVendor.featured ? "Remove featured" : "Feature vendor"}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateVendorStatus(selectedAdminVendor.id, "restricted")}
                    className="inline-flex h-11 items-center justify-center rounded-md border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                  >
                    Restrict vendor
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setAdminRejectionDraft({
                        vendorId: selectedAdminVendor.id,
                        businessName: selectedAdminVendor.businessName,
                        reason: ""
                      })
                    }
                    className="inline-flex h-11 items-center justify-center rounded-md border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                  >
                    Reject application
                  </button>
                  <button
                    type="button"
                    onClick={() => updateVendorStatus(selectedAdminVendor.id, "approved")}
                    className="inline-flex h-11 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                  >
                    Approve vendor
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => toggleAdminVendorFollowUp(selectedAdminVendor.id)}
                className={`inline-flex h-11 items-center justify-center rounded-md border px-4 text-sm font-medium ${
                  adminFollowUpVendorIds.includes(selectedAdminVendor.id)
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-neutral-200 bg-white text-neutral-800"
                }`}
              >
                {adminFollowUpVendorIds.includes(selectedAdminVendor.id) ? "Follow-up flagged" : "Flag for follow-up"}
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedAdminVendorId(null)}
                className="inline-flex h-11 items-center justify-center rounded-md border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-900"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!vendorSupportRequests[0]) return;
                  setSelectedAdminVendorId(null);
                  setAdminRequestReview({ ...vendorSupportRequests[0], note: vendorSupportRequests[0].adminNote || vendorSupportRequests[0].note || "", replyDraft: "" });
                  navigateAdminSection("requests");
                }}
                disabled={!vendorSupportRequests[0]}
                className={`inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors ${
                  vendorSupportRequests[0]
                    ? "bg-black text-white hover:bg-neutral-800"
                    : "bg-neutral-200 text-neutral-400"
                }`}
              >
                Open latest request
              </button>
            </div>
          </div>
        </section>
        </div>
      </div>
    );
  };

  const AdminRejectionReasonModal = () => {
    if (!adminRejectionDraft) return null;
    const reason = adminRejectionDraft.reason || "";

    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/35 px-4">
        <button
          type="button"
          aria-label="Close rejection reason"
          className="absolute inset-0 cursor-default"
          onClick={() => setAdminRejectionDraft(null)}
        />
        <div className="relative w-full max-w-[560px] rounded-lg border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-6 py-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Reject application</div>
            <h2 className="mt-2 text-xl font-medium text-neutral-950">{adminRejectionDraft.businessName}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Add the reason this vendor application is being rejected. This should be clear enough for internal review or vendor follow-up.</p>
          </div>
          <div className="px-6 py-5">
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Reason for rejection</label>
            <textarea
              value={reason}
              onChange={(event) => setAdminRejectionDraft((current) => ({ ...current, reason: event.target.value }))}
              placeholder="e.g. Missing business verification, incomplete portfolio, or service category not supported yet."
              className="min-h-36 w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-neutral-400"
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-neutral-200 px-6 py-4">
            <button
              type="button"
              onClick={() => setAdminRejectionDraft(null)}
              className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!reason.trim()}
              onClick={() => rejectVendorApplication(adminRejectionDraft.vendorId, reason.trim())}
              className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              Reject application
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AdminRequestReviewModal = () => {
    if (!adminRequestReview) return null;

    const statusOptions = adminRequestStatuses;
    const currentStatus = adminRequestReview.status || adminRequestStatuses[0]?.key || "pending";
    const isFlaggedRequest = adminFollowUpRequestIds.includes(adminRequestReview.id);
    const currentStatusMeta = isFlaggedRequest
      ? { label: "Flagged", tone: "red" }
      : findStatusMeta(adminRequestStatuses, currentStatus, currentStatus);
    const statusTone = statusToneChipClass(currentStatusMeta?.tone);
    const requestActivity = [
      ...(Array.isArray(adminRequestReview.activity) ? adminRequestReview.activity : []),
      {
        id: "created",
        label: "Request submitted",
        body: adminRequestReview.message,
        at: adminRequestReview.createdAt || adminRequestReview.age,
        actor: adminRequestReview.requester
      }
    ]
      .filter(Boolean)
      .sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0));

    return (
      <div className="fixed inset-x-0 bottom-0 top-16 z-[108] border-t border-neutral-200 md:left-72">
        <div className="relative h-full bg-black/15 backdrop-blur-[1px]">
          <button
            type="button"
            aria-label="Close request review"
            className="absolute inset-0 cursor-default"
            onClick={() => setAdminRequestReview(null)}
          />
          <aside className="relative flex h-full w-full flex-col overflow-hidden bg-neutral-100">
          <div className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Request review</div>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">{adminRequestReview.subject}</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex h-8 w-28 items-center justify-center rounded-full border px-3 text-[11px] font-medium capitalize ${statusTone}`}>
                {currentStatusMeta?.label || currentStatus}
              </span>
              <button
                type="button"
                onClick={() => toggleAdminRequestFollowUp(adminRequestReview.id)}
                className={flagButtonClass(isFlaggedRequest)}
                aria-label={isFlaggedRequest ? "Remove request flag" : "Flag request"}
                title={isFlaggedRequest ? "Flagged" : "Flag"}
              >
                <Flag size={16} className={isFlaggedRequest ? "fill-current" : ""} />
              </button>
              <button
                type="button"
                onClick={() => setAdminRequestReview(null)}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700"
              >
                <X size={15} />
                Close
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
              <section className="rounded-lg border border-neutral-200 bg-white">
                <div className="border-b border-neutral-200 px-6 py-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{adminRequestReview.type}</div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">{adminRequestReview.subject}</h3>
                  <p className="mt-2 text-sm text-neutral-500">{adminRequestReview.requester} submitted this {adminRequestReview.age}.</p>
                </div>
                <div className="space-y-5 p-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Vendor</div>
                      <div className="mt-2 text-sm font-medium text-neutral-950">{adminRequestReview.requester}</div>
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Priority</div>
                      <div className="mt-2 text-sm font-medium text-neutral-950">{adminRequestReview.priority}</div>
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Received</div>
                      <div className="mt-2 text-sm font-medium text-neutral-950">{adminRequestReview.age}</div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-neutral-200 bg-white p-5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Request details</div>
                    <p className="mt-3 text-sm leading-7 text-neutral-700">{adminRequestReview.message}</p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 bg-white p-5">
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Internal note</label>
                    <textarea
                      value={adminRequestReview.note || ""}
                      onChange={(event) => setAdminRequestReview((current) => ({ ...current, note: event.target.value }))}
                      placeholder="Add context, next steps, owner, or outcome before changing the request status."
                      className="min-h-44 w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-neutral-400"
                    />
                  </div>
                  <div className="rounded-lg border border-neutral-200 bg-white p-5">
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Reply to vendor</label>
                    <textarea
                      value={adminRequestReview.replyDraft || ""}
                      onChange={(event) => setAdminRequestReview((current) => ({ ...current, replyDraft: event.target.value }))}
                      placeholder="Write the response the vendor will receive by email and see in their portal activity."
                      className="min-h-36 w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-neutral-400"
                    />
                    <div className="mt-4 flex flex-wrap justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => updateAdminRequestStatus(adminRequestReview.id, "in-progress", "Request marked in progress", { note: adminRequestReview.note || "" })}
                        className="inline-flex h-10 items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                      >
                        Mark in progress
                      </button>
                      <button
                        type="button"
                        onClick={() => sendAdminRequestReply(adminRequestReview.id)}
                        className="inline-flex h-10 items-center gap-2 rounded-md bg-black px-4 text-sm font-medium text-white"
                      >
                        <Mail size={15} />
                        Send reply
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              <aside className="space-y-5">
                <section className="rounded-lg border border-neutral-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-neutral-950">Status</h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-500">Move the request through the support queue as work progresses.</p>
                  <div className="mt-5 grid gap-2">
                    {statusOptions.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => updateAdminRequestStatus(adminRequestReview.id, option.key)}
                        className={`inline-flex h-10 items-center justify-between rounded-md border px-3 text-sm font-medium transition-colors ${
                          currentStatus === option.key
                            ? statusToneChipClass(option.tone)
                            : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                        }`}
                      >
                        {option.label}
                        {currentStatus === option.key && <CheckCircle size={15} />}
                      </button>
                    ))}
                  </div>
                </section>
                <section className="rounded-lg border border-neutral-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-950">Activity</h3>
                      <p className="mt-1 text-sm leading-6 text-neutral-500">Vendor-visible replies and request handling history.</p>
                    </div>
                    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 px-2 text-[11px] font-semibold text-neutral-500">
                      {requestActivity.length}
                    </span>
                  </div>
                  <div className="mt-5 space-y-3">
                    {requestActivity.map((item, index) => (
                      <div key={item.id || `${item.label}-${index}`} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-[12px] font-semibold text-neutral-950">{item.label || "Request activity"}</div>
                          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">{formatActivityDate(item.at)}</div>
                        </div>
                        {item.actor && <div className="mt-1 text-[12px] font-medium text-neutral-500">{item.actor}</div>}
                        {item.body && <p className="mt-2 text-[13px] leading-6 text-neutral-600">{item.body}</p>}
                      </div>
                    ))}
                  </div>
                </section>
                <section className="rounded-lg border border-neutral-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-neutral-950">Contact</h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Email</div>
                      <div className="mt-1 font-medium text-neutral-950">{adminRequestReview.email}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Request type</div>
                      <div className="mt-1 font-medium text-neutral-950">{adminRequestReview.type}</div>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-neutral-200 bg-white px-6 py-4">
            <button
              type="button"
              onClick={() => setAdminRequestReview(null)}
              className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => updateAdminRequestStatus(adminRequestReview.id, completedRequestStatusKey, "Request marked completed", { note: adminRequestReview.note || "" })}
              className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white"
            >
              Mark {findStatusMeta(adminRequestStatuses, completedRequestStatusKey, "Completed")?.label?.toLowerCase() || "completed"}
            </button>
          </div>
          </aside>
        </div>
      </div>
    );
  };

  const Nav = () => {
    const isClientLanding = portal === "client" && !selectedListingSlug && !showVendorApplyPage && !showClientArchive;
    const isNakedHeader = isClientLanding && !isHeaderScrolled;
    const navProfileImage = portal === "vendor"
      ? vendorData?.vendor?.image || vendorForm?.avatarImage || IMG_AVATAR1
      : portal === "admin"
        ? IMG_AVATAR2
        : IMG_AVATAR1;

    return (
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 transition-colors duration-300 md:px-8 md:py-4 ${
          isNakedHeader
            ? "bg-transparent text-white border-b border-white/0"
            : "bg-white/90 backdrop-blur-md text-black border-b border-neutral-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <a className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold md:h-8 md:w-8 md:text-lg ${isNakedHeader ? "bg-white text-black" : "bg-black text-white"}`} href="/">
            E
          </a>
          <a href="/" className="text-base font-bold uppercase tracking-tight md:text-xl">Event Sphere</a>
        </div>

        <div className="flex items-center gap-6">
          {portal !== "client" ? (
            <div className="flex items-center gap-4">
              <a href="/" className="hidden text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-black md:block">
                Marketplace
              </a>
              <Bell size={18} className="opacity-70 cursor-pointer hover:opacity-100" />
              <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-300">
                <SafeImage src={navProfileImage} className="w-full h-full object-cover" alt="Profile" fallback={IMG_AVATAR1} />
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={openVendorApplyPage}
                className={`hidden md:inline-flex ${isNakedHeader ? buttonClasses.secondary : buttonClasses.primary}`}
              >
                List business
              </button>
              <button
                type="button"
                onClick={() => setShowMobileSearch(true)}
                className={`inline-flex h-10 w-10 items-center justify-center md:hidden ${
                  isNakedHeader ? "text-white" : "text-black"
                }`}
                aria-label="Open search"
              >
                <Search size={22} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => setShowMobileMenu(true)}
                className={`inline-flex h-10 w-10 items-center justify-center md:hidden ${
                  isNakedHeader ? "text-white" : "text-black"
                }`}
                aria-label="Open menu"
              >
                <Menu size={26} strokeWidth={3} />
              </button>
            </>
          )}
        </div>
      </nav>
    );
  };

  const PortalAuthGate = () => {
    if (portal !== "vendor" && portal !== "admin") return null;

    const targetRole = portalRoleLabel(portal);
    const canRegister = false;
    const title = portal === "admin" ? "Admin sign in" : "Vendor sign in";
    const description =
      portal === "admin"
        ? "Sign in with an admin account to access operations, reviews, and vendor management."
        : "Sign in to access your approved vendor workspace, leads, reviews, and settings.";

    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-[460px]">
          <div className="mb-8 flex flex-col items-center text-center">
            <a href="/" className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl font-semibold text-white">
              E
            </a>
            <div className="mt-4 text-[22px] font-bold uppercase tracking-tight text-neutral-950">Event Sphere</div>
          </div>

          <div className="rounded-[28px] border border-neutral-200 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="mb-6 text-center">
              <h1 className="text-[30px] font-semibold tracking-tight text-neutral-950">{title}</h1>
              <p className="mt-3 text-[15px] leading-7 text-neutral-500">{description}</p>
            </div>

            <form className="space-y-4" onSubmit={submitAuthForm}>
              {canRegister && authMode === "register" && (
                <>
                  <label className="block">
                    <span className="mb-2 block text-[13px] font-semibold text-neutral-700">Full name</span>
                    <input value={authForm.name} onChange={(event) => updateAuthField("name", event.target.value)} className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none" required />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[13px] font-semibold text-neutral-700">Business name</span>
                    <input value={authForm.businessName} onChange={(event) => updateAuthField("businessName", event.target.value)} className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none" required />
                  </label>
                </>
              )}

              <label className="block">
                <span className="mb-2 block text-[13px] font-semibold text-neutral-700">Email</span>
                <input type="email" value={authForm.email} onChange={(event) => updateAuthField("email", event.target.value)} className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none" required />
              </label>

              <label className="block">
                <span className="mb-2 block text-[13px] font-semibold text-neutral-700">Password</span>
                <input type="password" value={authForm.password} onChange={(event) => updateAuthField("password", event.target.value)} className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none" required />
              </label>

              {canRegister && authMode === "register" && (
                <>
                  <label className="block">
                    <span className="mb-2 block text-[13px] font-semibold text-neutral-700">Phone</span>
                    <input value={authForm.phone} onChange={(event) => updateAuthField("phone", event.target.value)} className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none" />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[13px] font-semibold text-neutral-700">Category</span>
                      <input value={authForm.category} onChange={(event) => updateAuthField("category", event.target.value)} className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[13px] font-semibold text-neutral-700">City</span>
                      <input value={authForm.city} onChange={(event) => updateAuthField("city", event.target.value)} className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none" />
                    </label>
                  </div>
                </>
              )}

              {authError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authPending}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                {authPending ? "Working..." : `Sign in as ${targetRole}`}
              </button>
            </form>
              {portal === "vendor" && (
                <div className="mt-5 text-center text-sm text-neutral-500">
                  Need marketplace access first? Submit your business application from <button type="button" onClick={openVendorApplyPage} className="font-medium text-neutral-950 underline underline-offset-4">List your business</button>.
                </div>
              )}
            {portal === "vendor" && (
              <div className="mt-4 text-center text-[13px] leading-6 text-neutral-400">
                New vendors do not create portal passwords during application. Access is sent only after admin approval.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const GlobalSaveToast = () => {
    if (!saveState) return null;

    return (
      <div className="fixed right-5 top-20 z-[140] flex min-w-[240px] items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-[14px] text-neutral-900 shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${saveState === "Saving..." ? "bg-neutral-100 text-neutral-500" : "bg-emerald-50 text-emerald-700"}`}>
          {saveState === "Saving..." ? <Clock size={15} /> : <CheckCircle size={15} />}
        </span>
        <div>
          <div className="font-semibold">{saveState === "Saving..." ? "Saving changes" : saveState}</div>
          {saveState !== "Saving..." && <div className="mt-0.5 text-[12px] font-normal text-neutral-500">Changes were saved successfully.</div>}
        </div>
      </div>
    );
  };

  const MobileMenu = () => {
    if (!showMobileMenu || portal !== "client") return null;

    const menuActions = [
      {
        label: "Browse vendors",
        description: "Explore verified event professionals.",
        action: () => openVendorArchive()
      },
      {
        label: "Browse venues",
        description: "Find spaces by city, capacity, and style.",
        action: () => openClientArchive({ type: "venue", category: "Venue" })
      },
      {
        label: "Explore categories",
        description: "Search by catering, decor, photography, music, and more.",
        action: () => openVendorArchive()
      },
      {
        label: "View all cities",
        description: "See vendors and venues across Canada.",
        action: () => openClientArchive({ city: "" })
      }
    ];

    return (
      <div className="fixed inset-0 z-[120] bg-neutral-950 text-white md:hidden">
        <div className="flex h-full flex-col px-6 py-5">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">E</span>
              <span className="text-base font-semibold tracking-tight">Event Sphere</span>
            </a>
            <button
              type="button"
              onClick={() => setShowMobileMenu(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-12 flex-1">
            <div className="text-sm text-white/50">Plan, shortlist, and connect with trusted Canadian event vendors.</div>
            <div className="mt-10 divide-y divide-white/12 border-y border-white/12">
              {menuActions.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setShowMobileMenu(false);
                    item.action();
                  }}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span>
                    <span className="block text-2xl font-semibold tracking-tight">{item.label}</span>
                    <span className="mt-1 block text-sm leading-6 text-white/45">{item.description}</span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-white/45" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 border-t border-white/12 pt-5">
            <button
              type="button"
              onClick={() => {
                setShowMobileMenu(false);
                openVendorApplyPage();
              }}
              className="h-12 bg-white px-5 text-sm font-semibold text-black"
            >
              List your business
            </button>
          </div>
        </div>
      </div>
    );
  };

  const MobileSearchModal = () => {
    if (!showMobileSearch || portal !== "client") return null;

    function submitMobileSearch() {
      setShowMobileSearch(false);
      setShowCitySuggestions(false);
      openVendorArchive({ q: clientSearch.q, city: clientSearch.city });
    }

    return (
      <div className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm md:hidden">
        <div className="sticky top-0 w-full">
          <div className="w-full bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="text-sm font-semibold text-neutral-500">Search EventSphere</div>
                <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-black">What are you planning?</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowMobileSearch(false);
                  setShowCitySuggestions(false);
                }}
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-neutral-200 text-black"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-8 space-y-3">
              <div className="border border-neutral-200 bg-neutral-50 px-4 py-4">
                <label className="mb-2 block text-xs font-semibold text-neutral-500">Planning</label>
                <input
                  value={clientSearch.q}
                  onChange={(event) => setClientSearch((current) => ({ ...current, q: event.target.value }))}
                  type="text"
                  placeholder="Wedding decor, catering, DJ..."
                  className="w-full bg-transparent text-base font-medium text-black outline-none placeholder:text-neutral-300"
                />
              </div>

              <div className="relative border border-neutral-200 bg-neutral-50 px-4 py-4">
                <label className="mb-2 block text-xs font-semibold text-neutral-500">City or location</label>
                <div className="flex items-center gap-2">
                  <input
                    value={clientSearch.city}
                    onChange={(event) => {
                      setClientSearch((current) => ({ ...current, city: event.target.value }));
                      setShowCitySuggestions(true);
                    }}
                    onFocus={() => setShowCitySuggestions(true)}
                    type="text"
                    placeholder="Toronto, ON"
                    className="w-full bg-transparent text-base font-medium text-black outline-none placeholder:text-neutral-300"
                    autoComplete="off"
                  />
                  <MapPin size={16} className="text-neutral-400" />
                </div>

                {showCitySuggestions && (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-56 overflow-y-auto border border-neutral-200 bg-white shadow-xl">
                    {clientCitySuggestions.length ? (
                      clientCitySuggestions.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            setClientSearch((current) => ({ ...current, city }));
                            setShowCitySuggestions(false);
                          }}
                          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-black hover:bg-neutral-50"
                        >
                          <span>{city}</span>
                          <MapPin size={14} className="text-neutral-300" />
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-neutral-500">No matching Canadian city found.</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={submitMobileSearch}
              className="mt-6 flex h-13 w-full items-center justify-center gap-2 bg-black px-5 text-sm font-semibold text-white"
            >
              Search <Search size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Footer = ({ dark = false }) => (
    <footer className={`${dark ? "bg-[#0a0a0a] text-white border-t border-white/10" : "bg-black text-white"} relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen pt-20 pb-10 px-8`}>
      <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-4 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-lg rounded-full">E</div>
            <span className="font-bold tracking-tight text-xl uppercase">Event Sphere</span>
          </div>
          <p className="text-neutral-400 text-sm max-w-sm mb-8">
            Canada's premier marketplace connecting diverse communities with trusted event professionals and luxury venue spaces.
          </p>
          <div className="mb-8">
            <button
              type="button"
              onClick={openVendorApplyPage}
              className="inline-flex h-11 items-center justify-center rounded-sm bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
            >
              Get started
            </button>
          </div>
          <div className="flex gap-4">
            {[
              { label: "Instagram", icon: InstagramIcon },
              { label: "X", icon: XSocialIcon },
              { label: "Facebook", icon: FacebookIcon }
            ].map(({ label, icon: Icon }) => (
              <span
                key={label}
                aria-label={label}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-700 text-neutral-400 transition-colors hover:border-white hover:text-white"
              >
                <Icon size={14} />
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-neutral-500">Discover</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li className="hover:text-neutral-300 cursor-pointer">Venues</li>
            <li className="hover:text-neutral-300 cursor-pointer">Catering & Food</li>
            <li className="hover:text-neutral-300 cursor-pointer">Decor & Design</li>
            <li className="hover:text-neutral-300 cursor-pointer">Photography</li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-neutral-500">For Vendors</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li>
              <button type="button" onClick={openVendorApplyPage} className="hover:text-neutral-300 cursor-pointer text-left">
                List Your Business
              </button>
            </li>
            <li className="hover:text-neutral-300 cursor-pointer">Success Stories</li>
            <li className="hover:text-neutral-300 cursor-pointer">Pricing & Plans</li>
            <li className="hover:text-neutral-300 cursor-pointer">Vendor Guidelines</li>
          </ul>
        </div>
      </div>
      <div className="flex w-full flex-col items-start justify-between border-t border-white/10 pt-8 text-xs text-neutral-500 md:flex-row md:items-center">
        <p>&copy; 2026 Event Sphere. All rights reserved.</p>
        <div className="mt-4 flex flex-col items-start gap-3 md:mt-0 md:flex-row md:items-center md:gap-6">
          <a href="mailto:hello@events-sphere.ca" className="hover:text-white">
            hello@events-sphere.ca
          </a>
          <button type="button" onClick={() => openLegalPage("privacy")} className="hover:text-white">
            Privacy Policy
          </button>
          <button type="button" onClick={() => openLegalPage("terms")} className="hover:text-white">
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );

  const LegalPage = ({ type }) => {
    const isPrivacy = type === "privacy";
    const title = isPrivacy ? "Privacy Policy" : "Terms of Service";
    const intro = isPrivacy
      ? "This Privacy Policy explains how Event Sphere collects, uses, stores, and protects information submitted through the marketplace, vendor portal, admin portal, and related email workflows."
      : "These Terms of Service explain the rules for using Event Sphere as a client, vendor applicant, approved vendor, or administrator of the marketplace.";
    const sections = isPrivacy
      ? [
          {
            heading: "Information we collect",
            body: "We collect information submitted through forms, account access flows, vendor applications, lead requests, review requests, support requests, and email interactions. This can include names, business details, contact information, event requirements, listing content, profile media, service areas, policies, and account activity."
          },
          {
            heading: "How we use information",
            body: "We use information to review vendor applications, publish approved listings, match clients with relevant vendors, route inquiries, send account and workflow emails, manage support requests, moderate reviews, improve marketplace quality, and protect the platform from misuse."
          },
          {
            heading: "Vendor and client communications",
            body: "Event Sphere may send transactional emails related to applications, approvals, rejections, support requests, review requests, account access, and marketplace operations. Vendors may also receive client inquiry details needed to respond to a request."
          },
          {
            heading: "Data storage and service providers",
            body: "Event Sphere uses trusted infrastructure providers to host the application, store marketplace data, manage authentication, and send emails. These providers process information only as needed to operate the platform."
          },
          {
            heading: "Reviews and public content",
            body: "Approved vendor listings, selected business details, media, service descriptions, policies, and approved reviews may appear publicly on the marketplace. Private admin notes, internal moderation signals, and support activity are not intended for public display."
          },
          {
            heading: "Security",
            body: "We use access controls, role-based permissions, database policies, and operational safeguards to limit access to account and marketplace data. No online platform can guarantee absolute security, but we work to keep access restricted to appropriate users and workflows."
          },
          {
            heading: "Data retention",
            body: "We retain information for as long as needed to operate the marketplace, support vendor/client workflows, comply with legal or operational requirements, resolve disputes, and maintain accurate business records."
          },
          {
            heading: "Your choices",
            body: "You may request updates, corrections, or removal of certain account or business information by contacting Event Sphere. Some information may be retained where required for security, legal, dispute-resolution, or operational reasons."
          },
          {
            heading: "Contact",
            body: "For privacy questions or data requests, contact Event Sphere at hello@events-sphere.ca."
          }
        ]
      : [
          {
            heading: "Use of the marketplace",
            body: "Event Sphere provides a marketplace for discovering event vendors and venue-related services. You agree to use the platform lawfully, provide accurate information, and avoid activity that disrupts the marketplace or misrepresents a person, business, service, review, or inquiry."
          },
          {
            heading: "Vendor applications and approvals",
            body: "Submitting a vendor application does not guarantee approval or publication. Event Sphere may review, approve, reject, restrict, hide, or remove listings based on quality, completeness, category fit, trust signals, policy compliance, or marketplace standards."
          },
          {
            heading: "Vendor responsibilities",
            body: "Vendors are responsible for keeping business details, pricing, availability, policies, media, service descriptions, and client communications accurate and current. Vendors are also responsible for honouring their own booking, cancellation, refund, health and safety, and client expectation policies."
          },
          {
            heading: "Client inquiries",
            body: "Client inquiries are requests for information and do not create a booking, contract, or guaranteed availability unless the client and vendor separately agree to those terms. Event Sphere is not responsible for vendor availability, pricing changes, or off-platform agreements."
          },
          {
            heading: "Reviews",
            body: "Reviews must reflect genuine client experiences. Event Sphere may moderate, reject, hide, or remove reviews that appear abusive, misleading, fraudulent, irrelevant, or inconsistent with marketplace trust standards."
          },
          {
            heading: "Payments and contracts",
            body: "Unless explicitly stated otherwise, Event Sphere does not process client payments or manage vendor contracts in this version of the platform. Any payment, deposit, refund, cancellation, or contract terms are handled directly between the client and the vendor."
          },
          {
            heading: "Content rights",
            body: "By submitting business information, listing copy, images, policies, and related content, vendors confirm they have the right to share that content and allow Event Sphere to display it for marketplace, review, promotional, and operational purposes."
          },
          {
            heading: "Platform changes",
            body: "Event Sphere may update features, workflows, eligibility rules, listing requirements, moderation processes, and these terms as the platform evolves. Continued use of the platform means you accept the updated terms."
          },
          {
            heading: "Contact",
            body: "For questions about these terms, contact Event Sphere at hello@events-sphere.ca."
          }
        ];

    return (
      <div className="min-h-screen bg-[#fafafa] pt-28">
        <main className="w-full px-4 pb-24 md:px-8">
          <button
            type="button"
            onClick={closeVendorApplyPage}
            className="inline-flex items-center gap-2 text-base font-semibold text-neutral-500 hover:text-black"
          >
            <ArrowLeft size={18} /> Back to marketplace
          </button>
          <section className="mt-8 border border-neutral-200 bg-white px-6 py-10 md:px-12 md:py-14">
            <div className="max-w-4xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400">Event Sphere legal</span>
              <h1 className="mt-4 text-[42px] font-semibold leading-none tracking-tight text-neutral-950 md:text-[64px]">
                {title}
              </h1>
              <p className="mt-5 text-sm font-medium text-neutral-500">Last updated: August 31, 2026</p>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-600">{intro}</p>
            </div>
            <div className="mt-12 divide-y divide-neutral-200">
              {sections.map((section) => (
                <article key={section.heading} className="grid gap-4 py-8 md:grid-cols-[280px_minmax(0,1fr)] md:gap-10">
                  <h2 className="text-xl font-semibold tracking-tight text-neutral-950">{section.heading}</h2>
                  <p className="max-w-4xl text-base leading-8 text-neutral-600">{section.body}</p>
                </article>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  };

  const VendorApplyPage = () => {
    const categoryOptions = bootstrap?.categories?.map((item) => item.name) || [];
    const cityOptions = bootstrap?.cities || [];
    const specialtyOptions = [
      "All",
      "South Asian",
      "Nigerian",
      "Caribbean",
      "Chinese",
      "Filipino",
      "East African",
      "Latin American",
      "Middle Eastern",
      "Korean",
      "West African",
      "Jamaican",
      "Persian"
    ];

    const sectionClass = "rounded-[28px] border border-neutral-200 bg-white px-12 py-10 shadow-[0_10px_30px_rgba(0,0,0,0.03)]";
    const labelClass = "mb-3 block text-[16px] font-medium tracking-tight text-black";
    const inputClass = "h-16 w-full rounded-none border border-neutral-200 bg-white px-6 text-[16px] text-black outline-none placeholder:text-neutral-400";
    const selectClass = "h-16 w-full appearance-none rounded-none border border-neutral-200 bg-white px-6 text-[16px] text-black outline-none";
    const textareaClass = "min-h-[180px] w-full rounded-none border border-neutral-200 bg-white px-6 py-5 text-[16px] text-black outline-none placeholder:text-neutral-400";
    const primaryButtonClass =
      "inline-flex h-12 items-center justify-center rounded-sm bg-black px-6 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-800";
    const secondaryButtonClass =
      "inline-flex h-12 items-center justify-center rounded-sm border border-neutral-300 bg-white px-6 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-neutral-50";

    return (
      <>
      <div className="min-h-screen bg-[#fafaf8] px-8 pb-24 pt-28">
        <div className="mx-auto max-w-[1380px]">
          <button
            onClick={closeVendorApplyPage}
            className="inline-flex items-center gap-2 text-base font-semibold text-neutral-500 hover:text-black"
          >
            <ArrowLeft size={18} /> Back to marketplace
          </button>

          <div className="mt-8 max-w-5xl">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Vendor onboarding</div>
            <h1 className="mt-4 text-[48px] font-medium tracking-tight text-black md:text-[64px]">List your business</h1>
            <p className="mt-5 max-w-4xl text-[20px] leading-9 text-neutral-500">
              Fill in your business details. Our team reviews each submission for quality, category fit, and contact accuracy before publishing.
            </p>
          </div>

          <div className="mt-12 space-y-8">
            <section className={sectionClass}>
              <h2 className="text-[24px] font-medium tracking-tight text-black">Business Information</h2>
              <div className="mt-8 border-t border-neutral-200 pt-8">
                <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Business Name *</label>
                    <input
                      value={vendorApplicationForm.businessName}
                      onChange={(event) => updateVendorApplicationField("businessName", event.target.value)}
                      placeholder="Your Business Name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Owner Name *</label>
                    <input
                      value={vendorApplicationForm.ownerName}
                      onChange={(event) => updateVendorApplicationField("ownerName", event.target.value)}
                      placeholder="Your Full Name"
                      className={inputClass}
                    />
                  </div>
                  <div className="relative">
                    <label className={labelClass}>Category *</label>
                    <select
                      value={vendorApplicationForm.category}
                      onChange={(event) => updateVendorApplicationField("category", event.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select category</option>
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-6 top-[63px] text-neutral-400" />
                  </div>
                  <div className="relative">
                    <label className={labelClass}>City *</label>
                    <select
                      value={vendorApplicationForm.city}
                      onChange={(event) => updateVendorApplicationField("city", event.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select city</option>
                      {cityOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-6 top-[63px] text-neutral-400" />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Business Description</label>
                    <textarea
                      value={vendorApplicationForm.description}
                      onChange={(event) => updateVendorApplicationField("description", event.target.value)}
                      placeholder="Describe your services, experience, and what makes you unique..."
                      className={textareaClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Starting Price (CAD)</label>
                    <input
                      value={vendorApplicationForm.priceFrom}
                      onChange={(event) => updateVendorApplicationField("priceFrom", event.target.value)}
                      placeholder="e.g. 500"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Years in Business</label>
                    <input
                      value={vendorApplicationForm.yearsInBusiness}
                      onChange={(event) => updateVendorApplicationField("yearsInBusiness", event.target.value)}
                      placeholder="e.g. 5"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className={sectionClass}>
              <h2 className="text-[24px] font-medium tracking-tight text-black">Contact Information</h2>
              <div className="mt-8 border-t border-neutral-200 pt-8">
                <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      type="email"
                      value={vendorApplicationForm.email}
                      onChange={(event) => updateVendorApplicationField("email", event.target.value)}
                      placeholder="your@email.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Portal Access</label>
                    <div className="flex min-h-16 items-center border border-neutral-200 bg-neutral-50 px-6 text-[15px] leading-7 text-neutral-500">
                      No password is created at this stage. Approved vendors receive portal access by email after review.
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      value={vendorApplicationForm.phone}
                      onChange={(event) => updateVendorApplicationField("phone", event.target.value)}
                      placeholder="+1 (416) 000-0000"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>WhatsApp Number</label>
                    <input
                      value={vendorApplicationForm.whatsapp}
                      onChange={(event) => updateVendorApplicationField("whatsapp", event.target.value)}
                      placeholder="+1 (416) 000-0000"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Website</label>
                    <input
                      value={vendorApplicationForm.website}
                      onChange={(event) => updateVendorApplicationField("website", event.target.value)}
                      placeholder="https://yourwebsite.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Instagram Handle</label>
                    <input
                      value={vendorApplicationForm.instagram}
                      onChange={(event) => updateVendorApplicationField("instagram", event.target.value)}
                      placeholder="@yourbusiness"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Facebook URL</label>
                    <input
                      value={vendorApplicationForm.facebook}
                      onChange={(event) => updateVendorApplicationField("facebook", event.target.value)}
                      placeholder="https://facebook.com/..."
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className={sectionClass}>
              <h2 className="text-[24px] font-medium tracking-tight text-black">Cultural Specialties</h2>
              <div className="mt-8 border-t border-neutral-200 pt-8">
                <p className="text-[20px] leading-9 text-neutral-500">Select the cultural communities you specialize in serving.</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  {specialtyOptions.map((specialty) => {
                    const active = vendorApplicationForm.specialties.includes(specialty);
                    return (
                      <button
                        key={specialty}
                        type="button"
                        onClick={() => toggleVendorApplicationSpecialty(specialty)}
                        className={`${active ? primaryButtonClass : secondaryButtonClass} ${
                          active ? "" : "text-neutral-600 hover:text-black"
                        }`}
                      >
                        {specialty}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <div>
              <button
                type="button"
                onClick={submitVendorApplication}
                className={`${buttonClasses.primary} h-16 w-full rounded-sm px-8 text-[14px] font-medium`}
              >
                Submit application
              </button>
              <div className="mt-4 text-sm text-neutral-500">
                {applicationSubmitState || "Listings are reviewed before they go live. Approved profiles are published once verification is complete."}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      </>
    );
  };

  const AdminReviewModerationPanel = () => {
    if (!selectedAdminReview) return null;
    const selectedReviewMeta = reviewStatusMeta(selectedAdminReview.status);

    return (
      <div className="fixed inset-0 z-[100] flex justify-end bg-black/20 backdrop-blur-[1px]">
        <button
          type="button"
          aria-label="Close review moderation"
          className="flex-1 cursor-default"
          onClick={() => setSelectedAdminReviewId(null)}
        />
        <aside className="flex h-full w-full max-w-[520px] flex-col overflow-hidden border-l border-neutral-200 bg-white">
          <div className="shrink-0 border-b border-neutral-200 bg-white px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Review moderation</div>
                <h2 className="mt-2 text-2xl font-medium tracking-tight text-neutral-950">{selectedAdminReview.reviewerName}</h2>
                <div className="mt-2 text-sm text-neutral-500">
                  {selectedAdminReview.vendorName} • {selectedAdminReview.eventType} • {selectedAdminReview.submittedAt}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAdminReviewId(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className={`inline-flex h-7 min-w-24 items-center justify-center rounded-full border px-3 text-[11px] font-medium ${statusToneChipClass(selectedReviewMeta.tone)}`}>
                {selectedReviewMeta.label}
              </span>
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600">
                {selectedAdminReview.reviewerRole}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
            <section className="rounded-lg border border-neutral-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
                  <SafeImage
                    src={selectedAdminReview.image}
                    alt={selectedAdminReview.reviewerName}
                    className="h-full w-full object-cover"
                    fallback={IMG_AVATAR1}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-950">{selectedAdminReview.reviewerName}</div>
                  <div className="mt-1 text-sm text-neutral-500">{selectedAdminReview.vendorName}</div>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-1">{ratingStars(selectedAdminReview.rating)}</div>
              <p className="mt-5 text-sm leading-7 text-neutral-700">{selectedAdminReview.body}</p>
            </section>

            <section className="rounded-lg border border-neutral-200 bg-white p-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Review details</div>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Event type</div>
                  <div className="mt-2 text-sm font-medium text-neutral-950">{selectedAdminReview.eventType}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Would book again</div>
                  <div className="mt-2 text-sm font-medium text-neutral-950">{selectedAdminReview.wouldBookAgain ? "Yes" : "No"}</div>
                </div>
              </div>
            </section>
          </div>

          <div className="grid shrink-0 gap-3 border-t border-neutral-200 bg-white px-6 py-4 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => updateAdminReviewStatus(selectedAdminReview.id, "rejected")}
              className="inline-flex h-10 items-center justify-center rounded-md border border-red-200 bg-red-50 px-3.5 text-[14px] font-medium text-red-700 transition-colors hover:bg-red-100"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => updateAdminReviewStatus(selectedAdminReview.id, "hidden")}
              className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-300 bg-white px-3.5 text-[14px] font-medium text-black transition-colors hover:bg-neutral-50"
            >
              Hide
            </button>
            <button
              type="button"
              onClick={() => updateAdminReviewStatus(selectedAdminReview.id, "approved")}
              className="inline-flex h-10 items-center justify-center rounded-md bg-black px-3.5 text-[14px] font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Approve
            </button>
          </div>
        </aside>
      </div>
    );
  };

  const ClientListingDetail = () => {
    if (listingDetailState === "loading" || !selectedListingDetail?.listing) {
      return (
        <div className="min-h-screen bg-white pt-28 px-8">
          <div className="max-w-7xl mx-auto">
            <button onClick={closeListingDetail} className={buttonClasses.text}>
              <ArrowLeft size={16} /> Back to Listings
            </button>
            <div className="mt-12 text-sm text-neutral-500">Loading listing details...</div>
          </div>
        </div>
      );
    }

    const listing = selectedListingDetail.listing;
    const reviewSummary = listingReviewSummary(listing);
    const similar = selectedListingDetail.similar || [];
    const listingGallery = (listing.gallery && listing.gallery.length ? listing.gallery : [listing.image, IMG_GALLERY1, IMG_GALLERY2, IMG_DECOR, IMG_EDITORIAL]).filter(Boolean);
    const visibleGalleryThumbs = [...listingGallery.slice(1), IMG_GALLERY1, IMG_GALLERY2].slice(0, 3);
    const specialities = listing.languages?.length ? listing.languages : listing.tags?.length ? listing.tags : [listing.category];
    const yearsActive = yearsInBusiness(listing);
    const portfolioItems = portfolioShowcaseItems(listing);
    const policyItems = detailPolicyItems(listing);
    const host = hostProfile(listing);
    const features = includedFeatures(listing);
    const listingAvailabilityMeta = listing.availability && typeof listing.availability === "object" ? listing.availability : {};
    const parkingSummary = listingAvailabilityMeta.parkingSummary || "Street parking is available nearby. Loading access and vendor arrival timing can be coordinated in advance for larger setups.";
    const parkingOptions = uniqueStringArray(listingAvailabilityMeta.parkingOptions || []);
    const culturalItems = listing.culturalSpecialties?.length ? listing.culturalSpecialties : specialities;
    const vendorRules = String(
      listingAvailabilityMeta.vendorRules ||
      "No smoking inside. Outside vendors must respect setup windows, cleanup timing, and any site-specific requirements confirmed before the event date."
    ).trim();
    const healthSafetyMeasures = uniqueStringArray(listingAvailabilityMeta.healthSafetyMeasures || []);
    const cancellationPolicyTitle = listingAvailabilityMeta.cancellationPolicyTitle || "Flexible";
    const cancellationPolicyBody =
      listingAvailabilityMeta.cancellationPolicyBody ||
      "Guests may cancel their booking up to 7 days before the event start time and receive a full refund. Cancellations made between 7 days and 24 hours before the event may receive a 50% refund, depending on the booking terms and services already committed.";
    const refundPolicyBody =
      listingAvailabilityMeta.refundPolicyBody ||
      "All bookings remain subject to platform confirmation, event timing, and any vendor-specific grace period terms shared before payment is completed.";
    const reviews = reviewSummary.recentApproved.length
      ? reviewSummary.recentApproved.map((review) => ({
          name: review.reviewerName,
          role: review.reviewerRole,
          booked: `Booked for ${review.eventType.toLowerCase()}`,
          body: review.body,
          date: review.submittedAt,
          image: review.image || IMG_AVATAR1,
          rating: review.rating,
          wouldBookAgain: review.wouldBookAgain
        }))
      : reviewItems(listing);
    const hours = operatingHours();
    const availability = selectedListingDetail.availability || [];
    const [listingAvailabilityMonth, setListingAvailabilityMonth] = useState(() => {
      const firstDate = selectedListingDetail.availability?.[0]?.date;
      return firstDate ? monthKey(new Date(`${firstDate}T00:00:00`)) : monthKey(new Date());
    });
    const [selectedListingAvailabilityDate, setSelectedListingAvailabilityDate] = useState(() => selectedListingDetail.availability?.[0]?.date || "");
    const whatsappPhone = String(listing.contact?.whatsapp || "").replace(/[^\d]/g, "");
    const whatsappText = encodeURIComponent("Hi, I found your business on EventSphere!");
    const whatsappHref = `https://api.whatsapp.com/send/?phone=${whatsappPhone}&text=${whatsappText}&type=phone_number&app_absent=0`;
    const socialHandle = (listing.slug || "eventsphere-vendor").replace(/[^a-z0-9-]/gi, "").toLowerCase();
    const instagramHref = `https://www.instagram.com/${socialHandle}/`;
    const tiktokHref = `https://www.tiktok.com/@${socialHandle}`;
    const sidebarActionTextClass = "text-sm font-medium";
    const sidebarSecondaryButtonClass = `grid h-12 w-full grid-cols-[24px_1fr_24px] items-center rounded-md border border-neutral-300 bg-white px-5 text-[14px] leading-none text-black transition-colors hover:bg-neutral-50 ${sidebarActionTextClass}`;
    const tiktokUrls = [
      "https://www.tiktok.com/@almamusaaaa/video/7537789794504527126",
      "https://www.tiktok.com/@grandbotanical/video/7591228814793952534",
      "https://www.tiktok.com/@dkevents_/video/7207002038444543233"
    ];
    const tiktokEmbeds = tiktokUrls
      .map((url, index) => {
        const match = url.match(/\/video\/(\d+)/);
        if (!match) return null;
        return {
          id: match[1],
          url,
          title: `${listing.category} TikTok ${index + 1}`
        };
      })
      .filter(Boolean);
    const listingAvailabilityMonthDate = parseMonthKey(listingAvailabilityMonth);
    const listingAvailabilityDays = buildCalendarMonth(listingAvailabilityMonthDate);
    const availabilityByDate = new Map(availability.map((entry) => [entry.date, entry]));
    const selectedAvailabilityEntry = selectedListingAvailabilityDate ? availabilityByDate.get(selectedListingAvailabilityDate) : null;

    useEffect(() => {
      const firstDate = selectedListingDetail.availability?.[0]?.date;
      setListingAvailabilityMonth(firstDate ? monthKey(new Date(`${firstDate}T00:00:00`)) : monthKey(new Date()));
      setSelectedListingAvailabilityDate(firstDate || "");
    }, [listing.slug, selectedListingDetail.availability]);

    const AccordionSection = ({ title, sectionKey, children }) => {
      const isOpen = detailAccordions[sectionKey];

      return (
        <div className="border-t border-neutral-200 py-6">
          <button onClick={() => toggleDetailAccordion(sectionKey)} className="w-full flex items-center justify-between text-left">
            <span className="text-[17px] font-medium tracking-tight">{title}</span>
            {isOpen ? <ChevronUp size={18} className="text-neutral-500" /> : <ChevronDown size={18} className="text-neutral-500" />}
          </button>
          {isOpen && <div className="pt-5">{children}</div>}
        </div>
      );
    };

    const AvailabilityModal = () => {
      if (!showAvailability) return null;

      return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Close availability"
            className="absolute inset-0 cursor-default"
            onClick={() => setShowAvailability(false)}
          />
          <div className="relative max-h-[85vh] w-full max-w-[720px] overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Availability</div>
                <h3 className="mt-2 text-2xl font-medium tracking-tight text-black">{listing.businessName}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                  Preview published booking dates before sending an inquiry. Available dates are highlighted, and booked dates are shown in red.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAvailability(false)}
                className="inline-flex h-10 w-10 shrink-0 aspect-square items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                aria-label="Close availability modal"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[calc(85vh-146px)] overflow-y-auto px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div className="text-[14px] font-semibold text-neutral-950">{formatMonthLabel(listingAvailabilityMonthDate)}</div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const current = parseMonthKey(listingAvailabilityMonth);
                      setListingAvailabilityMonth(monthKey(new Date(current.getFullYear(), current.getMonth() - 1, 1)));
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const current = parseMonthKey(listingAvailabilityMonth);
                      setListingAvailabilityMonth(monthKey(new Date(current.getFullYear(), current.getMonth() + 1, 1)));
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-7 gap-2 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-[11px] font-semibold text-neutral-400">{day}</div>
                ))}
                {listingAvailabilityDays.map((day, index) => {
                  if (!day) return <div key={`empty-${index}`} className="h-11" />;
                  const entry = availabilityByDate.get(day.iso);
                  const status = entry?.status || "";
                  const isSelected = selectedListingAvailabilityDate === day.iso;
                  const isBooked = status === "Booked";
                  const isLimited = status === "Limited";
                  const isAvailable = status === "Available";

                  return (
                    <button
                      key={day.iso}
                      type="button"
                      disabled={day.disabled}
                      onClick={() => setSelectedListingAvailabilityDate(day.iso)}
                      className={`h-11 rounded-full border text-[13px] font-semibold transition-colors ${
                        day.disabled
                          ? "cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-300"
                          : isBooked
                            ? isSelected
                              ? "border-red-300 bg-red-100 text-red-800"
                              : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                            : isLimited
                              ? isSelected
                                ? "border-amber-300 bg-amber-100 text-amber-900"
                                : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                              : isAvailable
                                ? isSelected
                                  ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : isSelected
                                  ? "border-neutral-300 bg-neutral-100 text-neutral-900"
                                  : "border-neutral-200 bg-white text-neutral-400 hover:border-neutral-300 hover:bg-neutral-50"
                      }`}
                    >
                      {day.day}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <div className="text-[13px] font-semibold text-neutral-950">
                  {selectedListingAvailabilityDate ? formatDateLabel(selectedListingAvailabilityDate) : "Select a date"}
                </div>
                <p className="mt-1 text-[13px] text-neutral-500">
                  {selectedAvailabilityEntry
                    ? selectedAvailabilityEntry.status === "Booked"
                      ? "This date is unavailable."
                      : selectedAvailabilityEntry.status === "Limited"
                        ? "This date has limited availability."
                        : "This date is available."
                    : selectedListingAvailabilityDate
                      ? "No published availability details for this date yet. Confirm directly with the vendor."
                      : "Select a date to review its availability."}
                </p>
                {selectedAvailabilityEntry?.slots?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedAvailabilityEntry.slots.map((slot) => (
                      <span key={slot} className="inline-flex items-center border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-700">
                        {slot}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-5 flex flex-wrap gap-4 text-[13px]">
                <span className="inline-flex items-center gap-2 text-neutral-600"><span className="h-2.5 w-2.5 rounded-full bg-emerald-100 ring-1 ring-emerald-200" /> Available</span>
                <span className="inline-flex items-center gap-2 text-neutral-600"><span className="h-2.5 w-2.5 rounded-full bg-amber-100 ring-1 ring-amber-200" /> Limited</span>
                <span className="inline-flex items-center gap-2 text-neutral-600"><span className="h-2.5 w-2.5 rounded-full bg-red-100 ring-1 ring-red-200" /> Unavailable</span>
              </div>

              <div className="mt-5 text-[13px] text-neutral-500">
                Final scheduling and confirmation still happen directly with the vendor after inquiry.
              </div>
            </div>
            <div className="flex justify-end border-t border-neutral-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowAvailability(false)}
                className="inline-flex h-11 items-center justify-center bg-black px-5 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    };

    const BookingCard = () => (
      <div className="border border-neutral-200 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:p-6">
        <div className="border border-neutral-200 bg-white">
          <div className="px-5 py-6 text-center">
            <div className="text-sm font-medium text-neutral-500">Pricing starts at</div>
            <div className="mt-1 text-[40px] font-bold leading-none tracking-tight">
              {money(listing.priceFrom)}
            </div>
            <div className="mt-2 text-sm text-neutral-500">Final quote confirmed after inquiry</div>
          </div>
        </div>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className={`mt-4 w-full ${buttonClasses.primary} h-12`}
        >
          Contact vendor
        </a>

        <div className="mt-6 space-y-3 border-t border-neutral-200 pt-6">
          <div className="text-base font-semibold">
            Availability
          </div>
          <button
            type="button"
            onClick={() => setShowAvailability(true)}
            className={sidebarSecondaryButtonClass}
          >
            <CalendarDays size={16} />
            <span className="text-center text-sm font-semibold leading-5">Check availability</span>
            <span />
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <a
            href={`mailto:${listing.contact?.email}`}
            className={sidebarSecondaryButtonClass}
          >
            <Mail size={16} />
            <span className="text-center text-sm font-semibold leading-5">Send email</span>
            <span />
          </a>
          <a
            href={`tel:${listing.contact?.phone}`}
            className={sidebarSecondaryButtonClass}
          >
            <Phone size={16} />
            <span className="text-center text-sm font-semibold leading-5">{listing.contact?.phone}</span>
            <span />
          </a>
          <div className="text-sm text-neutral-500">Availability is shown here. Final coordination and vendor communication happen directly after inquiry.</div>
        </div>

        <div className="mt-6 space-y-3 border-t border-neutral-200 pt-6">
          <a
            href={instagramHref}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex h-12 w-full items-center justify-center rounded-md border border-[#d6b3ff] bg-gradient-to-r from-[#fdf2ff] via-[#fce7f3] to-[#eef2ff] text-[#8a0f83] hover:from-[#fbe8ff] hover:to-[#e9edff] ${sidebarActionTextClass}`}
          >
            <Camera size={16} className="mr-2" /> Instagram
          </a>
          <a
            href={tiktokHref}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex h-12 w-full items-center justify-center rounded-md border border-[#1f2937] bg-[#111111] text-[#5eead4] hover:bg-[#171717] ${sidebarActionTextClass}`}
          >
            <Clapperboard size={16} className="mr-2" /> TikTok
          </a>
        </div>

        <div className="mt-8 space-y-4 border-t border-neutral-200 pt-6 text-sm text-neutral-700">
          <div className="inline-flex items-start gap-3">
            <CalendarDays size={15} className="mt-0.5 text-black" />
            <div>
              <div className="font-semibold text-black">Direct inquiry</div>
              <div className="mt-1 text-neutral-500">
                Availability, scope, and final pricing are confirmed directly with the vendor before any payment is taken.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle size={15} className="text-neutral-400" />
            <span>{listing.category}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={15} className="text-neutral-400" />
            <span>{listing.city}, {listing.province}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={15} className="text-neutral-400" />
            <span>{yearsActive} years in business</span>
          </div>
          {listing.capacity && (
            <div className="flex items-center gap-3">
              <Users size={15} className="text-neutral-400" />
              <span>{listing.capacity} guests</span>
            </div>
          )}
        </div>
      </div>
    );

    const openGalleryLightbox = (index = 0) => {
      setActiveGalleryIndex(index);
      setShowGalleryLightbox(true);
    };

    const moveGalleryLightbox = (direction) => {
      setActiveGalleryIndex((current) => {
        const total = listingGallery.length;
        return (current + direction + total) % total;
      });
    };

    return (
      <div className="min-h-screen bg-white px-3 pt-28 pb-24 md:px-8">
        <div className="mx-auto max-w-[1480px]">
          <button onClick={closeListingDetail} className={buttonClasses.text}>
            <ArrowLeft size={16} /> Back to Listings
          </button>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-4xl">
              <h1 className="text-[32px] leading-tight font-medium tracking-tight md:text-[40px]">{listing.businessName}</h1>
              <div className="mt-2 text-[15px] font-medium text-neutral-700 md:text-[17px]">
                {listing.longDescription?.split(".")[0] || listing.description}
              </div>
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-500 underline underline-offset-2">
                <MapPin size={14} />
                <span>{listing.city}, {listing.province}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div>
              <div className="space-y-3">
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 md:aspect-[16/8]">
                  <SafeImage src={listingGallery[0]} alt={listing.businessName} className="h-full w-full object-cover" fallback={imageForCategory(listing.category)} />
                  <button
                    type="button"
                    onClick={() => openGalleryLightbox(0)}
                    className="absolute bottom-5 left-5 inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-black shadow-sm hover:bg-neutral-100"
                  >
                    <ImageIcon size={16} /> View all
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {visibleGalleryThumbs.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => openGalleryLightbox(index + 1)}
                      className="aspect-[4/3] overflow-hidden bg-neutral-100"
                    >
                      <SafeImage src={image} alt={`${listing.businessName} gallery ${index + 2}`} className="h-full w-full object-cover" fallback={imageForCategory(listing.category)} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 border-b border-neutral-200 py-5 text-sm text-neutral-700">
                <span className="inline-flex items-center gap-1.5">
                  <Star size={14} fill="currentColor" className="text-black" />
                  <span className="underline underline-offset-2">{reviewSummary.rating.toFixed(1)} ({reviewSummary.count})</span>
                </span>
                <span className="text-neutral-300">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Users size={14} />
                  <span>{listing.capacity ? listing.capacity.replace("-", " to ") : "20 people"}</span>
                </span>
                <span className="text-neutral-300">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{listing.type === "venue" ? "4 hrs min" : "1 hr response"}</span>
                </span>
                <span className="text-neutral-300">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  <span>{listing.type === "venue" ? "900 sqft" : `${yearsActive} yrs in business`}</span>
                </span>
              </div>

              <div className="border-b border-neutral-200 py-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-black text-white">
                    <SafeImage src={host.image} alt={host.name} className="h-full w-full object-cover" fallback={IMG_AVATAR1} />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Listed by</div>
                    <div className="text-lg font-medium tracking-tight underline underline-offset-2">{host.name}</div>
                    <div className="text-sm text-neutral-500">{host.label}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 lg:hidden">
                <BookingCard />
              </div>

              <div className="pt-8">
                <h2 className="text-[24px] font-medium tracking-tight">About {listing.businessName}</h2>
                <p className="mt-5 max-w-4xl text-base leading-8 text-neutral-700">
                  {listing.longDescription || listing.description}
                </p>
                <button className="mt-3 text-sm underline underline-offset-2 text-neutral-700 hover:text-black">Read more</button>
              </div>

              <div className="mt-8">
                <AccordionSection title="Parking" sectionKey="parking">
                  <div className="space-y-4 text-sm leading-7 text-neutral-600">
                    <p>{parkingSummary}</p>
                    {parkingOptions.length ? (
                      <div className="flex flex-wrap gap-3">
                        {parkingOptions.map((item) => (
                          <span key={item} className="inline-flex items-center bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </AccordionSection>

                <AccordionSection title="Vendor Rules" sectionKey="hostRules">
                  <div className="space-y-3 text-sm leading-7 text-neutral-600">
                    {vendorRules
                      .split(/\n+/)
                      .map((rule) => rule.trim())
                      .filter(Boolean)
                      .map((rule) => (
                        <p key={rule}>{rule}</p>
                      ))}
                  </div>
                </AccordionSection>

                <AccordionSection title="Cultural Specialties" sectionKey="specialties">
                  <div className="flex flex-wrap gap-3">
                    {culturalItems.map((item) => (
                      <span key={item} className="inline-flex items-center bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </AccordionSection>

                <AccordionSection title="Contact Information" sectionKey="contact">
                  <div className="space-y-4 text-sm text-neutral-700">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-neutral-400" />
                      <span>{listing.contact?.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-neutral-400" />
                      <span>{listing.contact?.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageSquare size={16} className="text-neutral-400" />
                      <span>+{listing.contact?.whatsapp}</span>
                    </div>
                  </div>
                </AccordionSection>

                <AccordionSection title="Policies & Terms" sectionKey="policies">
                  <div className="space-y-5">
                    {policyItems.map((item) => (
                      <div key={item.title}>
                        <div className="text-sm font-semibold text-black">{item.title}</div>
                        <p className="mt-2 text-sm leading-7 text-neutral-600">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </AccordionSection>
              </div>

              <div className="mt-10 border-t border-neutral-200 pt-10">
                <h3 className="text-[24px] font-medium tracking-tight">Included with this listing</h3>
                <div className="mt-3 text-sm text-neutral-500">Features</div>
                <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
                  {features.map((feature) => (
                    <div key={feature} className="inline-flex items-center gap-3 text-base text-neutral-700">
                      <CheckCircle size={16} className="text-neutral-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 border-t border-neutral-200 pt-10">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <h3 className="text-[24px] font-medium tracking-tight">Work Gallery</h3>
                    <p className="mt-2 text-sm text-neutral-500">Work from this {listing.type === "venue" ? "space" : "vendor"}.</p>
                  </div>
                </div>
                <div className="scrollbar-hide mt-8 flex gap-3 overflow-x-auto md:grid md:grid-cols-[repeat(3,minmax(0,220px))] md:overflow-visible lg:grid-cols-[repeat(3,minmax(0,300px))]">
                  {tiktokEmbeds.map((clip, index) => (
                    <div key={clip.id} className="w-[46vw] max-w-[190px] shrink-0 overflow-hidden bg-neutral-100 md:w-auto md:max-w-none">
                      <div className="relative aspect-[9/16] overflow-hidden">
                        {loadedTikToks[clip.id] ? (
                          <iframe
                            title={clip.title}
                            className="absolute inset-x-0 top-0 h-[760px] w-full border-0"
                            loading="lazy"
                            scrolling="no"
                            allowFullScreen
                            src={`https://www.tiktok.com/embed/v2/${clip.id}?autoplay=0`}
                          />
                        ) : (
                          <TikTokThumbnailButton
                            clip={clip}
                            fallback={listing.gallery?.[index] || listing.image || imageForCategory(listing.category)}
                            onLoad={() => setLoadedTikToks((current) => ({ ...current, [clip.id]: true }))}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 border-t border-neutral-200 pt-12">
                <h3 className="text-[24px] font-medium tracking-tight">Cancellation Policy</h3>
                <div className="mt-5 text-[18px] font-medium tracking-tight">{cancellationPolicyTitle}</div>
                <p className="mt-5 max-w-5xl text-[16px] leading-8 text-neutral-800">
                  {cancellationPolicyBody}
                </p>
                <button className="mt-3 text-base underline underline-offset-4 text-neutral-800 hover:text-black">Read more</button>
                <p className="mt-8 max-w-5xl text-base leading-8 text-neutral-500">
                  {refundPolicyBody}
                </p>
              </div>

              <div className="mt-12 border-t border-neutral-200 pt-12">
                <h3 className="text-[24px] font-medium tracking-tight">Location</h3>
                <div className="mt-6 overflow-hidden border border-neutral-200 bg-[#f5f3ef]">
                  <div className="relative h-[380px] bg-[linear-gradient(0deg,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:48px_48px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),transparent_180px)]" />
                    <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/10" />
                    <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/15" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <MapPin size={28} className="text-black" />
                    </div>
                    <div className="absolute left-10 top-10 text-sm font-semibold tracking-tight text-neutral-700">{listing.city.toUpperCase()}</div>
                    <div className="absolute right-10 top-12 text-sm font-semibold tracking-tight text-neutral-700">{listing.province.toUpperCase()}</div>
                    <div className="absolute bottom-10 left-10 text-sm text-neutral-500">Location shown after inquiry confirmation</div>
                  </div>
                </div>

                <div className="mt-10">
                  <h4 className="text-[20px] font-medium tracking-tight">Operating Hours</h4>
                  <div className="mt-5 grid grid-cols-1 gap-x-20 gap-y-2 text-base md:grid-cols-2">
                    {hours.map(([day, hoursRange]) => (
                      <React.Fragment key={day}>
                        <div className="text-neutral-800">{day}</div>
                        <div className="text-neutral-800">{hoursRange}</div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 border-t border-neutral-200 pt-12">
                <h3 className="text-[24px] font-medium tracking-tight">Health and Safety Measures</h3>
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {(healthSafetyMeasures.length ? healthSafetyMeasures : DEFAULT_VENDOR_POLICY_DRAFT.healthSafetyMeasures).map((item) => (
                    <div key={item} className="inline-flex items-center gap-3 text-base text-neutral-700">
                      <Shield size={16} className="text-neutral-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 border-t border-neutral-200 pt-12">
                <h3 className="text-[24px] font-medium tracking-tight">Reviews ({reviewSummary.count})</h3>
                <div className="mt-8 divide-y divide-neutral-200">
                  {reviews.map((review) => (
                    <div key={`${review.name}-${review.date}`} className="py-8">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-neutral-200">
                          <SafeImage src={review.image} alt={review.name} className="h-full w-full object-cover" fallback={IMG_AVATAR1} />
                        </div>
                        <div>
                          <div className="text-[17px] font-medium tracking-tight">
                            {review.name} <span className="font-normal text-neutral-600">({review.role})</span>
                          </div>
                          <div className="mt-1 text-[13px] text-neutral-500">{review.booked}</div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px]">
                        <div className="flex items-center gap-1">{ratingStars(review.rating || 5)}</div>
                        <div className="inline-flex items-center gap-2 text-neutral-700">
                          <CheckCircle size={15} className="text-green-600" />
                          <span className="font-medium">{review.wouldBookAgain === false ? "Not yet booking again." : "Yes, I would book again."}</span>
                        </div>
                      </div>
                      <p className="mt-4 max-w-4xl text-[15px] leading-7 text-neutral-700">{review.body}</p>
                      <div className="mt-4 text-[13px] text-neutral-500">{review.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              {similar.length > 0 && (
                <div className="mt-12 -mx-3 bg-[#eeeeee] px-3 py-10 md:mx-0 md:border-t md:border-neutral-200 md:bg-transparent md:px-0 md:pt-12 md:pb-0">
                  <h3 className="text-[24px] font-medium tracking-tight">Similar listings</h3>
                  <div className="mt-8 grid grid-cols-2 gap-4 md:gap-6">
                    {similar.slice(0, 4).map((item) => (
                      <button
                        key={item.slug}
                        onClick={() => openListingDetail(item.slug)}
                        className="overflow-hidden border border-neutral-200 bg-white text-left transition-colors hover:border-neutral-400"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                          <SafeImage src={item.image} alt={item.businessName} className="h-full w-full object-cover" fallback={imageForCategory(item.category)} />
                        </div>
                        <div className="p-3 md:p-5">
                          <div className="text-sm font-medium leading-5 tracking-tight md:text-lg">{item.businessName}</div>
                          <div className="mt-2 text-xs text-neutral-500 md:text-sm">{item.category} • {item.city}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="hidden lg:sticky lg:top-28 lg:block">
              <BookingCard />
            </aside>
          </div>
        </div>

        {showGalleryLightbox && (
          <div className="fixed inset-0 z-[140] bg-black/90 text-white">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-4 py-4 md:px-8">
                <div className="text-sm font-semibold">
                  {activeGalleryIndex + 1} / {listingGallery.length}
                </div>
                <button
                  type="button"
                  onClick={() => setShowGalleryLightbox(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  aria-label="Close gallery"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-16">
                <button
                  type="button"
                  onClick={() => moveGalleryLightbox(-1)}
                  className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:inline-flex"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>

                <SafeImage
                  src={listingGallery[activeGalleryIndex]}
                  alt={`${listing.businessName} gallery ${activeGalleryIndex + 1}`}
                  fallback={imageForCategory(listing.category)}
                  className="max-h-full max-w-full object-contain"
                />

                <button
                  type="button"
                  onClick={() => moveGalleryLightbox(1)}
                  className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:inline-flex"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="scrollbar-hide flex gap-3 overflow-x-auto px-4 py-4 md:justify-center md:px-8">
                {listingGallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveGalleryIndex(index)}
                    className={`h-16 w-20 shrink-0 overflow-hidden border ${
                      activeGalleryIndex === index ? "border-white" : "border-white/20 opacity-60"
                    }`}
                    aria-label={`Open gallery image ${index + 1}`}
                  >
                    <SafeImage src={image} alt={`${listing.businessName} thumbnail ${index + 1}`} className="h-full w-full object-cover" fallback={imageForCategory(listing.category)} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <AvailabilityModal />
      </div>
    );
  };

  const ClientArchivePage = () => {
    const activeCategory = archiveFilters.category !== "all" ? archiveFilters.category : "";
    const resultTypeLabel = archiveFilters.type === "venue" ? "venues" : archiveFilters.type === "vendor" ? "vendors" : "listings";
    const archiveTitle = activeCategory || (archiveFilters.type === "venue" ? "All venues" : archiveFilters.type === "vendor" ? "All vendors" : "All listings");
    const archiveLocation = archiveFilters.city ? ` near ${archiveFilters.city}` : " across Canada";
    const hasArchiveResults = archiveResults.length > 0;
    const isVendorArchiveEmpty = !hasArchiveResults && archiveFilters.type === "vendor";
    const firstCalendarMonth = parseMonthKey(archiveWhen.monthCursor);
    const secondCalendarMonth = new Date(firstCalendarMonth.getFullYear(), firstCalendarMonth.getMonth() + 1, 1);
    const timeOptions = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"];
    const priceFilterLabel =
      archiveFilters.price.startsWith("custom-")
        ? (() => {
            const [, minRaw, maxRaw] = archiveFilters.price.split("-");
            const min = Number(minRaw || 0);
            const max = Number(maxRaw || 0);
            if (min && max) return `${money(min)} to ${money(max)}`;
            if (min) return `${money(min)}+`;
            if (max) return `Up to ${money(max)}`;
            return "Enter range";
          })()
        : {
            all: "Any price",
            "under-1000": "Up to $1,000",
            "1000-3000": "$1,000 to $3,000",
            "over-3000": "$3,000+",
            custom: "Enter range"
          }[archiveFilters.price] || "Any price";
    const attendeeFilterLabel = archiveFilters.attendees.startsWith("exact-")
      ? `${archiveFilters.attendees.replace("exact-", "")} guests`
      : {
          all: "Any size",
          "1-10": "1 to 10",
          "11-25": "11 to 25",
          "26-50": "26 to 50",
          "51-100": "51 to 100",
          "100-plus": "Over 100",
          "under-50": "Under 50",
          "50-150": "50 to 150",
          "150-300": "150 to 300",
          "300-plus": "300+"
        }[archiveFilters.attendees] || "Any size";

    function moveCalendarMonth(direction) {
      setArchiveWhen((current) => {
        const month = parseMonthKey(current.monthCursor);
        month.setMonth(month.getMonth() + direction);
        return { ...current, monthCursor: monthKey(month) };
      });
    }

    function clearArchiveWhen() {
      const today = new Date();
      setArchiveWhen({
        selectedDate: "",
        monthCursor: monthKey(new Date(today.getFullYear(), today.getMonth(), 1)),
        startTime: "",
        endTime: "",
        appliedLabel: "Any time"
      });
      setShowArchiveWhenPanel(false);
    }

    function applyArchiveWhen() {
      const datePart = formatDateLabel(archiveWhen.selectedDate);
      const timePart = archiveWhen.startTime ? `, ${archiveWhen.startTime}${archiveWhen.endTime ? ` - ${archiveWhen.endTime}` : ""}` : "";
      setArchiveWhen((current) => ({
        ...current,
        appliedLabel: archiveWhen.selectedDate ? `${datePart}${timePart}` : "Any time"
      }));
      setShowArchiveWhenPanel(false);
    }

    return (
    <div className="min-h-screen bg-[#fafafa] pt-28 pb-0">
      <div className="w-full px-4 md:px-8">
        <div className="pb-3 text-left md:pb-6">
          <div>
            <button
              type="button"
              onClick={closeClientArchive}
              className="mb-6 inline-flex items-center gap-2 text-base font-semibold text-neutral-500 hover:text-black"
            >
              <ArrowLeft size={18} /> Back to marketplace
            </button>
            <h1 className="text-[42px] font-semibold leading-none tracking-tight md:text-[64px]">
              {archiveTitle}
            </h1>
            <p className="mt-4 text-base font-medium text-neutral-500">
              {isVendorArchiveEmpty
                ? "We are currently onboarding vendors. Approved businesses will be listed here soon."
                : `${archiveResults.length} ${activeCategory ? activeCategory.toLowerCase() : resultTypeLabel} ${archiveLocation}`}
            </p>
          </div>
        </div>

        <section className="sticky top-[72px] z-40 mt-2 -mx-4 border-y border-neutral-200 bg-white/95 backdrop-blur-md md:-mx-8 md:mt-4 relative">
          <div className="px-3 pb-3 pt-1.5 md:px-8 md:pt-5">
            <div className="hidden grid-cols-1 gap-2 md:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(240px,0.55fr)_150px]">
              <div className="relative flex w-full items-center gap-3 border border-neutral-200 bg-neutral-50 px-4 py-2.5">
              <Search size={16} className="text-neutral-400" />
              <input
                value={archiveFilters.q}
                onChange={(event) => {
                  setArchiveFilters((current) => ({ ...current, q: event.target.value }));
                  setShowArchiveQuerySuggestions(true);
                }}
                onFocus={() => {
                  if (archiveSearchSuggestions.length) setShowArchiveQuerySuggestions(true);
                }}
                onBlur={() => window.setTimeout(() => setShowArchiveQuerySuggestions(false), 140)}
                type="text"
                placeholder={archiveFilters.type === "vendor" ? "Search DJ, catering, decor, photography..." : "Search DJ, catering, decor, venues..."}
                className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-neutral-400"
                autoComplete="off"
              />
              {showArchiveQuerySuggestions && archiveFilters.q.trim() && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-72 overflow-y-auto border border-neutral-200 bg-white shadow-2xl">
                  {archiveSearchSuggestions.length ? (
                    archiveSearchSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => applySearchSuggestion(suggestion, "archive")}
                        className="flex w-full items-start justify-between gap-4 px-4 py-3 text-left hover:bg-neutral-50"
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-black">{suggestion.label}</span>
                          {suggestion.meta ? <span className="mt-1 block text-xs text-neutral-500">{suggestion.meta}</span> : null}
                        </span>
                        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                          {suggestion.kind}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-neutral-500">No matches found yet.</div>
                  )}
                </div>
              )}
              </div>
              <div className="flex w-full items-center gap-3 border border-neutral-200 bg-neutral-50 px-4 py-2.5">
                <MapPin size={16} className="text-neutral-400" />
                <input
                  value={archiveFilters.city}
                  onChange={(event) => setArchiveFilters((current) => ({ ...current, city: event.target.value }))}
                  type="text"
                  placeholder="City or location"
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-neutral-400"
                />
              </div>
              <button
                type="button"
                onClick={() => openClientArchive({ q: archiveFilters.q, city: archiveFilters.city })}
                className="inline-flex min-h-11 items-center justify-center bg-black px-5 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Search
              </button>
            </div>

            <div className="scrollbar-hide mt-1.5 flex items-center gap-2 overflow-x-auto pt-1.5 md:mt-3 md:border-t md:border-neutral-100 md:pt-3">
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowArchiveSearchModal(true)}
                  className="archive-filter-chip inline-flex h-9 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-xs font-medium text-black hover:border-neutral-400 md:hidden"
                >
                  <Search size={15} />
                  <span>Search</span>
                </button>
                {[
                  { label: "When", value: archiveWhen.appliedLabel, action: "when" },
                  { label: "Price", value: priceFilterLabel, action: "price" },
                  {
                    label: "Attendees",
                    value: attendeeFilterLabel,
                    action: "attendees"
                  },
                  { label: "Filters", value: "More" }
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      if (item.action === "when") {
                        setShowArchiveWhenPanel((current) => !current);
                        setShowArchivePricePanel(false);
                        setShowArchiveAttendeesPanel(false);
                        setShowArchiveFilterPanel(false);
                        return;
                      }
                      if (item.action === "price") {
                        setShowArchivePricePanel((current) => !current);
                        setShowArchiveWhenPanel(false);
                        setShowArchiveAttendeesPanel(false);
                        setShowArchiveFilterPanel(false);
                        return;
                      }
                      if (item.action === "attendees") {
                        setShowArchiveAttendeesPanel((current) => !current);
                        setShowArchiveWhenPanel(false);
                        setShowArchivePricePanel(false);
                        setShowArchiveFilterPanel(false);
                        return;
                      }
                      setShowArchiveWhenPanel(false);
                      setShowArchivePricePanel(false);
                      setShowArchiveAttendeesPanel(false);
                      setShowArchiveFilterPanel(true);
                    }}
                    className="archive-filter-chip inline-flex h-9 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-xs font-medium text-black hover:border-neutral-400"
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={15} />
                  </button>
                ))}
              </div>

              <div className="mx-2 h-7 w-px shrink-0 bg-neutral-200" />

              <div className="flex items-center gap-2">
                {archiveCategoryChips.map((entry) => {
                  const active = archiveFilters.category === entry;
                  const label = entry === "all" ? "All" : entry;

                  return (
                    <button
                      key={entry}
                      type="button"
                      onClick={() => {
                        setShowArchiveWhenPanel(false);
                        setShowArchivePricePanel(false);
                        setShowArchiveAttendeesPanel(false);
                        setArchiveFilters((current) => ({ ...current, category: entry }));
                      }}
                      className={`archive-filter-chip inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-xs font-medium transition-colors ${
                        active ? "border-black bg-black text-white" : "border-neutral-200 bg-white text-neutral-700 hover:border-black hover:text-black"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {showArchiveWhenPanel && (
            <div className="absolute left-3 right-3 top-[calc(100%+8px)] max-h-[calc(100vh-140px)] overflow-y-auto border border-neutral-200 bg-white p-3 shadow-2xl md:left-8 md:right-auto md:w-[560px] md:p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-black">Date and time</h2>
                  <button type="button" className="mt-1 text-left text-sm font-medium text-black underline underline-offset-4">
                    Search for multiple dates at once
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowArchiveWhenPanel(false)}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-black"
                  aria-label="Close date and time"
                >
                  <X size={22} strokeWidth={1.8} />
                </button>
              </div>

              <div className="mt-4 bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                <div className="grid gap-7 md:grid-cols-2 md:gap-8">
                  {[firstCalendarMonth, secondCalendarMonth].map((month, monthIndex) => (
                    <div key={month.toISOString()} className={monthIndex === 1 ? "md:border-l md:border-neutral-100 md:pl-8" : ""}>
                      <div className="mb-3 grid grid-cols-[30px_1fr_30px] items-center">
                        <button
                          type="button"
                          onClick={() => moveCalendarMonth(-1)}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-neutral-100 ${
                            monthIndex === 0 ? "visible" : "invisible"
                          }`}
                          aria-label="Previous month"
                        >
                          <ChevronRight size={18} className="rotate-180" />
                        </button>
                        <div className="text-center text-xs font-semibold text-black">{formatMonthLabel(month)}</div>
                        <button
                          type="button"
                          onClick={() => moveCalendarMonth(1)}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-neutral-100 ${
                            monthIndex === 1 ? "visible" : "invisible"
                          }`}
                          aria-label="Next month"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-x-2.5 text-center text-[9px] font-semibold text-neutral-500">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                          <div key={day} className="py-1">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-x-2 gap-y-2 text-center">
                        {buildCalendarMonth(month).map((day, index) =>
                          day ? (
                            <button
                              key={day.iso}
                              type="button"
                              disabled={day.disabled}
                              onClick={() => setArchiveWhen((current) => ({ ...current, selectedDate: day.iso }))}
                              className={`calendar-day-button mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-normal ${
                                archiveWhen.selectedDate === day.iso
                                  ? "bg-black text-white"
                                  : day.disabled
                                    ? "text-neutral-300 line-through"
                                    : "text-black hover:bg-neutral-100"
                              }`}
                            >
                              {day.day}
                            </button>
                          ) : (
                            <div key={`empty-${index}`} className="h-7" />
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-3 bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)] md:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold text-black">Start time</span>
                  <div className="relative mt-2">
                    <select
                      value={archiveWhen.startTime}
                      onChange={(event) => setArchiveWhen((current) => ({ ...current, startTime: event.target.value }))}
                      className="h-10 w-full appearance-none border border-neutral-300 bg-white px-3 pr-10 text-xs font-medium text-neutral-700 outline-none"
                    >
                      <option value="">Start time</option>
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-neutral-400">End time</span>
                  <div className="relative mt-2">
                    <select
                      value={archiveWhen.endTime}
                      onChange={(event) => setArchiveWhen((current) => ({ ...current, endTime: event.target.value }))}
                      className="h-10 w-full appearance-none border border-neutral-300 bg-white px-3 pr-10 text-xs font-medium text-neutral-500 outline-none"
                    >
                      <option value="">End time</option>
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  </div>
                </label>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={clearArchiveWhen} className="h-10 px-3 text-sm font-semibold text-black">
                  Clear
                </button>
                <button type="button" onClick={applyArchiveWhen} className="h-10 bg-black px-5 text-sm font-semibold text-white hover:bg-neutral-800">
                  Apply
                </button>
              </div>
            </div>
          )}

          {showArchivePricePanel && (
            <div className="absolute left-3 right-3 top-[calc(100%+8px)] max-w-[calc(100vw-24px)] border border-neutral-300 bg-white p-6 shadow-2xl md:left-[156px] md:right-auto md:w-[360px]">
              <div className="space-y-5">
                {[
                  { value: "all", label: "Any price" },
                  { value: "under-1000", label: "Up to $1,000" },
                  { value: "1000-3000", label: "$1,000 to $3,000" },
                  { value: "over-3000", label: "$3,000+" },
                  { value: "custom", label: "Enter range" }
                ].map((option) => {
                  const active = option.value === "custom" ? archiveFilters.price === "custom" || archiveFilters.price.startsWith("custom-") : archiveFilters.price === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        if (option.value === "custom") {
                          const min = archiveCustomPrice.min.trim();
                          const max = archiveCustomPrice.max.trim();
                          setArchiveFilters((current) => ({
                            ...current,
                            price: min || max ? `custom-${min || 0}-${max || 0}` : "custom"
                          }));
                          return;
                        }
                        setArchiveFilters((current) => ({ ...current, price: option.value }));
                      }}
                      className="flex w-full items-center gap-4 text-left text-[18px] font-normal text-black"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          active ? "border-black" : "border-neutral-300"
                        }`}
                      >
                        {active && <span className="h-2.5 w-2.5 rounded-full bg-black" />}
                      </span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>

              {(archiveFilters.price === "custom" || archiveFilters.price.startsWith("custom-")) && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-neutral-500">Min</span>
                    <input
                      value={archiveCustomPrice.min}
                      onChange={(event) => {
                        const min = event.target.value.replace(/\D/g, "");
                        setArchiveCustomPrice((current) => ({ ...current, min }));
                        setArchiveFilters((current) => ({
                          ...current,
                          price: min || archiveCustomPrice.max ? `custom-${min || 0}-${archiveCustomPrice.max || 0}` : "custom"
                        }));
                      }}
                      type="text"
                      inputMode="numeric"
                      placeholder="$0"
                      className="h-12 w-full border border-neutral-300 px-4 text-sm font-normal text-black outline-none placeholder:text-neutral-400"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-neutral-500">Max</span>
                    <input
                      value={archiveCustomPrice.max}
                      onChange={(event) => {
                        const max = event.target.value.replace(/\D/g, "");
                        setArchiveCustomPrice((current) => ({ ...current, max }));
                        setArchiveFilters((current) => ({
                          ...current,
                          price: archiveCustomPrice.min || max ? `custom-${archiveCustomPrice.min || 0}-${max || 0}` : "custom"
                        }));
                      }}
                      type="text"
                      inputMode="numeric"
                      placeholder="$5,000"
                      className="h-12 w-full border border-neutral-300 px-4 text-sm font-normal text-black outline-none placeholder:text-neutral-400"
                    />
                  </label>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowArchivePricePanel(false)}
                  className="h-12 bg-black px-7 text-sm font-bold text-white hover:bg-neutral-800"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {showArchiveAttendeesPanel && (
            <div className="absolute left-3 right-3 top-[calc(100%+8px)] max-w-[calc(100vw-24px)] border border-neutral-300 bg-white p-6 shadow-2xl md:left-[270px] md:right-auto md:w-[310px]">
              <div className="space-y-5">
                {[
                  { value: "1-10", label: "1 to 10" },
                  { value: "11-25", label: "11 to 25" },
                  { value: "26-50", label: "26 to 50" },
                  { value: "51-100", label: "51 to 100" },
                  { value: "100-plus", label: "Over 100" },
                  { value: "exact", label: "Exact count" }
                ].map((option) => {
                  const active = option.value === "exact" ? archiveFilters.attendees.startsWith("exact-") : archiveFilters.attendees === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        if (option.value === "exact") {
                          const exactCount = archiveExactAttendees.trim();
                          setArchiveFilters((current) => ({
                            ...current,
                            attendees: exactCount ? `exact-${exactCount}` : "exact-"
                          }));
                          return;
                        }
                        setArchiveFilters((current) => ({ ...current, attendees: option.value }));
                      }}
                      className="flex w-full items-center gap-4 text-left text-[18px] font-normal text-black"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          active ? "border-black" : "border-neutral-300"
                        }`}
                      >
                        {active && <span className="h-2.5 w-2.5 rounded-full bg-black" />}
                      </span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>

              <input
                value={archiveExactAttendees}
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, "");
                  setArchiveExactAttendees(value);
                  if (archiveFilters.attendees.startsWith("exact-")) {
                    setArchiveFilters((current) => ({
                      ...current,
                      attendees: value ? `exact-${value}` : "exact-"
                    }));
                  }
                }}
                type="text"
                inputMode="numeric"
                placeholder="e.g. 50"
                className="mt-6 h-14 w-full border border-neutral-300 px-5 text-[18px] font-normal text-black outline-none placeholder:text-neutral-400"
              />

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowArchiveAttendeesPanel(false)}
                  className="h-12 bg-black px-7 text-sm font-bold text-white hover:bg-neutral-800"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </section>

        {showArchiveSearchModal && (
          <div className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-sm md:hidden">
            <div className="sticky top-0 w-full bg-white p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="text-sm font-semibold text-neutral-500">Search listings</div>
                  <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-black">Find the right vendor</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowArchiveSearchModal(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center border border-neutral-200 text-black"
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-8 space-y-3">
                <div className="border border-neutral-200 bg-neutral-50 px-4 py-4">
                  <label className="mb-2 block text-xs font-semibold text-neutral-500">What are you planning?</label>
                  <div className="flex items-center gap-2">
                    <Search size={16} className="text-neutral-400" />
                    <input
                      value={archiveFilters.q}
                      onChange={(event) => setArchiveFilters((current) => ({ ...current, q: event.target.value }))}
                      type="text"
                      placeholder="DJ, catering, decor, photography..."
                      className="w-full bg-transparent text-base font-medium text-black outline-none placeholder:text-neutral-300"
                    />
                  </div>
                </div>

                <div className="border border-neutral-200 bg-neutral-50 px-4 py-4">
                  <label className="mb-2 block text-xs font-semibold text-neutral-500">City or location</label>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-neutral-400" />
                    <input
                      value={archiveFilters.city}
                      onChange={(event) => setArchiveFilters((current) => ({ ...current, city: event.target.value }))}
                      type="text"
                      placeholder="Toronto, ON"
                      className="w-full bg-transparent text-base font-medium text-black outline-none placeholder:text-neutral-300"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowArchiveSearchModal(false)}
                className="mt-6 flex h-13 w-full items-center justify-center gap-2 bg-black px-5 text-sm font-semibold text-white"
              >
                Search <Search size={16} />
              </button>
            </div>
          </div>
        )}

        {hasArchiveResults ? (
        <div className="mt-6 grid grid-cols-1 gap-5 pb-16 md:grid-cols-2 xl:grid-cols-4">
          {archiveResults.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => openListingDetail(item.slug)}
              className="overflow-hidden border border-neutral-200 bg-white text-left transition-colors hover:border-neutral-400"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <SafeImage src={item.image || imageForCategory(item.category)} alt={item.businessName} className="h-full w-full object-cover" fallback={imageForCategory(item.category)} />
                <div className="absolute left-4 top-4 flex gap-2">
                  {item.featured && (
                    <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-black">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <div className="min-w-0">
                    <h3
                      className="text-[16px] font-medium tracking-tight leading-5"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {item.businessName}
                    </h3>
                    <div className="mt-2 text-sm text-neutral-500">
                      {item.category} • {item.city}
                    </div>
                  </div>
                  <div className="shrink-0 text-right leading-none">
                    <div className="text-[9px] font-semibold text-neutral-400">From</div>
                    <div className="mt-1 text-sm font-bold text-black">{money(item.priceFrom)}</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] text-neutral-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Star size={13} fill="currentColor" className="text-black" />
                    {item.rating?.toFixed(1)} ({item.reviews || 0})
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={13} />
                    {item.capacity || "Custom guest count"}
                  </span>
                </div>

                <p
                  className="mt-4 text-sm font-normal leading-6 text-neutral-600 min-h-12"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {item.description || "Trusted listing for celebrations, events, and culturally specific gatherings across Canada."}
                </p>
              </div>
            </button>
          ))}
        </div>
        ) : (
          <section className="mb-20 mt-6 border border-neutral-200 bg-white px-6 py-12 text-center md:mb-28 md:px-10 md:py-16">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200">
              <Users size={20} />
            </div>
            <h2 className="mx-auto mt-6 max-w-2xl text-2xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
              {isVendorArchiveEmpty ? "Vendor onboarding is in progress" : "No listings match this search"}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-500 md:text-base md:leading-7">
              {isVendorArchiveEmpty
                ? "Event Sphere is reviewing vendor applications before public profiles go live. Once approved, businesses will appear here with their services, cities, policies, and reviews."
                : "Try clearing your filters or searching a different category, city, or date."}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button type="button" onClick={openVendorApplyPage} className={buttonClasses.primary}>
                List your business
              </button>
            </div>
          </section>
        )}
      </div>

      {showArchiveFilterPanel && (
        <div className="fixed inset-0 z-[120]">
          <button type="button" aria-label="Close filters" onClick={() => setShowArchiveFilterPanel(false)} className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-y-0 right-0 w-full max-w-[420px] overflow-y-auto border-l border-neutral-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Refine Results</div>
                <h2 className="mt-2 text-[24px] font-medium tracking-tight">Filters</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowArchiveFilterPanel(false)}
                className="inline-flex h-10 w-10 items-center justify-center border border-neutral-200 bg-white text-neutral-600 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-8 px-6 py-6">
              <section>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Sort</div>
                <select
                  value={archiveFilters.sort}
                  onChange={(event) => setArchiveFilters((current) => ({ ...current, sort: event.target.value }))}
                  className="mt-3 h-11 w-full border border-neutral-200 bg-white px-4 text-sm font-medium outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="rating">Top rated</option>
                  <option value="price-low">Price low to high</option>
                  <option value="price-high">Price high to low</option>
                  <option value="az">A to Z</option>
                </select>
              </section>

              <section>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Listing Type</div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { value: "all", label: "All" },
                    { value: "vendor", label: "Vendors" },
                    { value: "venue", label: "Venues" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setArchiveFilters((current) => ({ ...current, type: option.value }))}
                      className={`inline-flex h-11 items-center justify-center border text-[11px] font-semibold uppercase tracking-[0.12em] ${
                        archiveFilters.type === option.value ? "border-black bg-black text-white" : "border-neutral-200 bg-white text-black"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Price</div>
                <div className="mt-3 space-y-2">
                  {[
                    { value: "all", label: "Any price" },
                    { value: "under-1000", label: "Under $1,000" },
                    { value: "1000-3000", label: "$1,000 to $3,000" },
                    { value: "over-3000", label: "Over $3,000" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setArchiveFilters((current) => ({ ...current, price: option.value }))}
                      className={`flex h-11 w-full items-center justify-between border px-4 text-sm ${
                        archiveFilters.price === option.value ? "border-black bg-black text-white" : "border-neutral-200 bg-white text-black"
                      }`}
                    >
                      <span>{option.label}</span>
                      {archiveFilters.price === option.value && <CheckCircle size={16} />}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Attendees</div>
                <div className="mt-3 space-y-2">
                  {[
                    { value: "all", label: "Any size" },
                    { value: "under-50", label: "Under 50 guests" },
                    { value: "50-150", label: "50 to 150 guests" },
                    { value: "150-300", label: "150 to 300 guests" },
                    { value: "300-plus", label: "300+ guests" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setArchiveFilters((current) => ({ ...current, attendees: option.value }))}
                      className={`flex h-11 w-full items-center justify-between border px-4 text-sm ${
                        archiveFilters.attendees === option.value ? "border-black bg-black text-white" : "border-neutral-200 bg-white text-black"
                      }`}
                    >
                      <span>{option.label}</span>
                      {archiveFilters.attendees === option.value && <CheckCircle size={16} />}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">City</div>
                <select
                  value={archiveFilters.city}
                  onChange={(event) => setArchiveFilters((current) => ({ ...current, city: event.target.value }))}
                  className="mt-3 h-11 w-full border border-neutral-200 bg-white px-4 text-sm font-medium outline-none"
                >
                  <option value="">All cities</option>
                  {archiveCityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </section>

              <section>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Category</div>
                <select
                  value={archiveFilters.category}
                  onChange={(event) => setArchiveFilters((current) => ({ ...current, category: event.target.value }))}
                  className="mt-3 h-11 w-full border border-neutral-200 bg-white px-4 text-sm font-medium outline-none"
                >
                  <option value="all">All categories</option>
                  {archiveCategoryChips.filter((entry) => entry !== "all").map((entry) => (
                    <option key={entry} value={entry}>
                      {entry}
                    </option>
                  ))}
                </select>
              </section>

              <section>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">When</div>
                <div className="mt-3 border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm leading-6 text-neutral-600">
                  Availability is confirmed per listing after inquiry. Use the listing detail page to check live availability by vendor or venue.
                </div>
              </section>
            </div>

            <div className="sticky bottom-0 grid grid-cols-2 gap-3 border-t border-neutral-200 bg-white px-6 py-5">
              <button
                type="button"
                onClick={() =>
                  setArchiveFilters({
                    q: archiveFilters.q,
                    city: "",
                    type: "all",
                    category: "all",
                    price: "all",
                    attendees: "all",
                    sort: "featured"
                  })
                }
                className="inline-flex h-12 items-center justify-center border border-neutral-200 bg-white text-[11px] font-semibold uppercase tracking-[0.12em] text-black"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setShowArchiveFilterPanel(false)}
                className="inline-flex h-12 items-center justify-center bg-black text-[11px] font-semibold uppercase tracking-[0.12em] text-white hover:bg-neutral-800"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
    );
  };

  const ClientConceptA = () => (
    <div className="min-h-screen bg-white">
      <div className="relative pt-32 pb-40 px-8 min-h-[86vh] flex items-center overflow-hidden">
        <HeroBackgroundSlideshow />
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="hero-enter">
            <div className="mb-5 inline-flex items-center gap-3 border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Event marketplace
            </div>
          <h1 className="text-6xl md:text-8xl font-light tracking-tighter leading-[0.9] mb-6 text-white drop-shadow-lg">
            CURATING <br />
            <span className="font-bold italic">CULTURE.</span>
          </h1>
          <p className="text-xl text-white/90 max-w-lg mb-12 drop-shadow-md">
            The exclusive network for Canada's premier multicultural event professionals. Find vetted vendors for your next celebration.
          </p>
          </div>

          <div className="hero-search-enter bg-white p-2 flex flex-col gap-2 max-w-4xl shadow-2xl rounded-sm md:flex-row md:items-stretch">
            <div className="relative flex min-h-[84px] flex-1 flex-col justify-center border border-neutral-100 bg-neutral-50 px-6 py-4">
              <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-1">What?</label>
              <input
                value={clientSearch.q}
                onChange={(event) => {
                  setClientSearch((current) => ({ ...current, q: event.target.value }));
                  setShowClientQuerySuggestions(true);
                }}
                onFocus={() => {
                  if (clientSearchSuggestions.length) setShowClientQuerySuggestions(true);
                }}
                onBlur={() => window.setTimeout(() => setShowClientQuerySuggestions(false), 140)}
                type="text"
                placeholder="e.g. South Asian Wedding Decorators"
                className="text-base font-medium outline-none bg-transparent placeholder:text-neutral-300 w-full"
                autoComplete="off"
              />
              {showClientQuerySuggestions && clientSearch.q.trim() && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-72 overflow-y-auto border border-neutral-200 bg-white shadow-2xl">
                  {clientSearchSuggestions.length ? (
                    clientSearchSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => applySearchSuggestion(suggestion, "client")}
                        className="flex w-full items-start justify-between gap-4 px-5 py-3 text-left hover:bg-neutral-50"
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-black">{suggestion.label}</span>
                          {suggestion.meta ? <span className="mt-1 block text-xs text-neutral-500">{suggestion.meta}</span> : null}
                        </span>
                        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                          {suggestion.kind}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-5 py-4 text-sm text-neutral-500">No matches found yet.</div>
                  )}
                </div>
              )}
            </div>
            <div className="relative flex min-h-[84px] flex-1 flex-col justify-center border border-neutral-100 bg-neutral-50 px-6 py-4">
              <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-1">Where?</label>
              <div className="flex items-center justify-between">
                <input
                  value={clientSearch.city}
                  onChange={(event) => setClientSearch((current) => ({ ...current, city: event.target.value }))}
                  onFocus={() => setShowCitySuggestions(true)}
                  onBlur={() => window.setTimeout(() => setShowCitySuggestions(false), 140)}
                  type="text"
                  placeholder="Start typing a city"
                  className="text-base font-medium outline-none bg-transparent placeholder:text-neutral-300 w-full"
                  autoComplete="off"
                />
                <MapPin size={16} className="text-neutral-400" />
              </div>
              {showCitySuggestions && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-72 overflow-y-auto border border-neutral-200 bg-white shadow-2xl">
                  {clientCitySuggestions.length ? (
                    clientCitySuggestions.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setClientSearch((current) => ({ ...current, city }));
                          setShowCitySuggestions(false);
                        }}
                        className="flex w-full items-center justify-between px-5 py-3 text-left text-sm font-medium text-black hover:bg-neutral-50"
                      >
                        <span>{city}</span>
                        <MapPin size={14} className="text-neutral-300" />
                      </button>
                    ))
                  ) : (
                    <div className="px-5 py-4 text-sm text-neutral-500">No matching Canadian city found.</div>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => openVendorArchive({ q: clientSearch.q, city: clientSearch.city })}
              className="inline-flex min-h-[84px] items-center justify-center gap-2 rounded-sm bg-[linear-gradient(135deg,#f97316_0%,#dc2626_58%,#581c1c_100%)] px-10 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(220,38,38,0.24)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(220,38,38,0.3)] md:h-auto md:self-stretch"
            >
              Search <Search size={16} />
            </button>
          </div>

        </div>
      </div>

      <section className="border-y border-neutral-200 bg-white">
        <div className="w-full px-8 py-12">
          <div className="grid grid-cols-1 divide-y divide-neutral-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {marketplaceStats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center px-8 py-6 text-center">
                <span className="text-4xl font-bold tracking-tight sm:text-[40px] xl:text-5xl">{stat.value}</span>
                <span className="mt-4 max-w-[180px] text-center text-[10px] font-bold uppercase leading-5 tracking-[0.18em] text-neutral-500 sm:text-[11px] xl:max-w-none xl:text-xs xl:tracking-[0.28em]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,#fed7aa_0%,#fb923c_24%,#dc2626_58%,#581c1c_100%)] text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
        <div className="relative w-full px-8 py-24">
          <div className="relative">
            <h2 className="pointer-events-none absolute -top-8 left-0 text-[76px] font-black leading-none tracking-tight text-white/5 md:text-[138px]">
              Why
            </h2>
            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-white/45">Why EventSphere</span>
                <h3 className="mt-8 max-w-3xl text-[42px] font-semibold leading-[0.98] tracking-tight md:text-[68px]">
                  Built for events where every detail carries meaning.
                </h3>
              </div>
              <p className="max-w-xl justify-self-start text-left text-lg leading-8 text-white/70 lg:justify-self-end">
                EventSphere helps clients find vendors who understand culture, guest experience, timing, and trust before a shortlist ever becomes an inquiry.
              </p>
            </div>
          </div>

          <div className="mt-16 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
            {[
              {
                title: "Verified fit",
                body: "Compare vendors by specialty, city, rating, and event type instead of scrolling through generic supplier lists.",
                image: IMG_DECOR
              },
              {
                title: "Cultural context",
                body: "Filter for teams that understand ceremonies, food expectations, family scale, and community-specific details.",
                image: IMG_FOOD
              },
              {
                title: "Direct planning",
                body: "Move from inspiration to inquiry with clear profiles, transparent starting prices, and direct vendor contact paths.",
                image: IMG_VENUE
              }
            ].map((item, index) => (
              <article key={item.title} className="group w-[82vw] shrink-0 snap-start border border-white/20 bg-white/10 backdrop-blur-sm sm:w-[46vw] lg:w-auto lg:shrink">
                <div className="aspect-[4/3] overflow-hidden bg-white/10">
                  <SafeImage src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" fallback={IMG_EDITORIAL} />
                </div>
                <div className="p-7">
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">0{index + 1}</div>
                  <h4 className="mt-5 text-2xl font-semibold tracking-tight">{item.title}</h4>
                  <p className="mt-4 text-sm leading-7 text-white/60">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="w-full px-8 py-24 lg:pr-28 xl:pr-44">
          <div className="flex justify-between items-end mb-12 border-b border-neutral-200 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-400">Browse By Category</span>
              <h3 className="mt-3 text-2xl font-bold tracking-tight">Explore Categories</h3>
            </div>
            <button
              type="button"
              onClick={() => openVendorArchive()}
              className={buttonClasses.text}
            >
              View all directory <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid max-w-[1500px] grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4">
            {categoryBrowseCards.map((cat, index) => {
              const Icon = cat.icon;

              return (
              <button
                key={index}
                type="button"
                onClick={() =>
                  archiveCategoryValue(cat.name) === "Venue"
                    ? openClientArchive({ type: "venue", category: "Venue" })
                    : openVendorArchive({ category: archiveCategoryValue(cat.name) })
                }
                className="group cursor-pointer text-left"
              >
                <div className="aspect-[4/5] mb-4 overflow-hidden relative bg-neutral-100 border border-neutral-200">
                  <SafeImage src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" fallback={imageForCategory(cat.name)} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute top-4 left-4 w-11 h-11 border border-white/30 bg-white/12 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                    <Icon size={18} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white text-xs font-bold uppercase tracking-widest border border-white/30 px-4 py-2 backdrop-blur-sm">Browse</span>
                  </div>
                </div>
                <h4 className="font-bold text-base">{cat.name}</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  {cat.count > 0 ? `${cat.count} verified ${cat.count === 1 ? "pro" : "pros"}` : "Vendor intake open"}
                </p>
              </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#111111] text-white">
        <div className="w-full px-8 py-24 lg:pl-24 xl:pl-36 2xl:pl-52">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
            <div>
              <div className="max-w-xl">
                <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-white/35">Cities</span>
                <h3 className="mt-6 text-[42px] font-semibold leading-[1.02] tracking-tight md:text-[60px]">
                  Your celebration starts somewhere.
                </h3>
              </div>
              <div className="mt-14 max-w-3xl">
                {[
                  "Toronto, ON",
                  "Vancouver, BC",
                  "Calgary, AB",
                  "Montreal, QC",
                  "Ottawa, ON",
                  "Edmonton, AB",
                  "Halifax, NS"
                ].map((city) => {
                  const [name, province] = city.split(", ");

                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => openVendorArchive({ city })}
                      className="group flex w-full items-baseline justify-between border-b border-white/18 py-4 text-left transition-colors hover:border-white/60"
                    >
                      <span className="text-[28px] font-semibold tracking-tight text-white/55 transition-colors group-hover:text-white md:text-[36px]">
                        {name}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35 transition-colors group-hover:text-white/70">
                        {province}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => openClientArchive({ city: "" })}
                className="mt-10 bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-neutral-200"
              >
                View all cities
              </button>
            </div>

            <div className="relative min-h-[420px] overflow-hidden bg-neutral-900 lg:min-h-[560px]">
              <SafeImage src={IMG_VENUE} alt="Event space in Canada" className="h-full w-full object-cover" fallback={IMG_EDITORIAL} />
              <div className="absolute inset-0 bg-gradient-to-l from-black/35 via-transparent to-black/10" />
              <div className="absolute right-4 top-0 h-full [writing-mode:vertical-rl] text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">
                Event-ready spaces across Canada
              </div>
              <div className="absolute bottom-6 right-4 [writing-mode:vertical-rl] text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                Toronto, ON
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 border-t border-neutral-200">
        <div className="w-full px-4 py-16 md:px-8 md:py-24">
          <div className="grid gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:items-start">
            <div className="max-w-3xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-400">Directory launch</span>
              <h3 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                Real vendor profiles are being reviewed before they go live.
              </h3>
              <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600">
                Event Sphere is onboarding multicultural event professionals through an approval process so clients see credible, complete, and current business profiles.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ["Application review", "Every vendor profile is checked before marketplace visibility."],
                ["Real business details", "Listings only go live with approved business, contact, and service information."],
                ["Client-ready profiles", "Policies, pricing signals, service areas, and reviews are prepared for comparison."],
                ["Admin moderation", "The Event Sphere team controls approvals, review quality, and featured placement."]
              ].map(([title, body]) => (
                <div key={title} className="border border-neutral-200 bg-white p-6">
                  <h4 className="text-base font-semibold tracking-tight text-neutral-950">{title}</h4>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );

  const ClientConceptB = () => (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="pt-32 pb-16 px-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col items-center text-center mb-16 mt-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-6 border-b border-black pb-2 px-6">
            The Curated Marketplace
          </span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight max-w-5xl leading-tight">
            Elevate your traditions. <br />
            <span className="font-light italic text-neutral-500">Discover master artisans.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
          <div className="md:col-span-8 h-[650px] relative group overflow-hidden bg-neutral-200">
            <SafeImage src={IMG_EDITORIAL} alt="Wedding" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" fallback={IMG_HERO} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-12 flex flex-col justify-end">
              <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Featured Celebration</span>
              <h3 className="text-white text-4xl md:text-5xl font-light mb-6 max-w-2xl">A Modern Nigerian Traditional Marriage in Downtown Toronto</h3>
              <button
                type="button"
                onClick={() => openVendorArchive()}
                className="inline-flex h-10 w-fit items-center justify-center rounded-md border border-white/50 bg-black/20 px-5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
              >
                Read Story & View Vendors
              </button>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col gap-8">
            <div className="flex-1 relative overflow-hidden group">
              <SafeImage src={IMG_DECOR} alt="Decor" className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-1000" fallback={IMG_EDITORIAL} />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Curated List</span>
                <h4 className="text-white font-bold text-2xl mb-2">Top 10 South Asian Decorators for 2026</h4>
                <button
                  type="button"
                  onClick={() => openVendorArchive({ category: "Decor & Florals" })}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white hover:underline"
                >
                  Explore <ArrowRight size={14} />
                </button>
              </div>
            </div>
            <div className="bg-black text-white h-64 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neutral-500 to-white" />
              <h4 className="font-light text-2xl mb-3 tracking-tight">Know what you need?</h4>
              <p className="text-sm text-neutral-400 mb-8 max-w-xs">Search our directory of trusted event professionals and venue spaces.</p>
              <button
                type="button"
                onClick={() => openVendorArchive()}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
              >
                <Search size={16} /> Access Directory
              </button>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 mb-24">
          {marketplaceStats.map((stat, index) => (
            <div key={stat.label} className={`bg-white px-10 py-12 ${index === 1 ? "md:bg-black md:text-white" : ""}`}>
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-400 md:text-inherit md:opacity-60">{stat.label}</div>
              <div className="mt-5 text-4xl md:text-5xl font-bold tracking-tight">{stat.value}</div>
            </div>
          ))}
        </section>

        <section className="border-t border-neutral-200 pt-20 mb-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-400">Browse By Category</span>
              <h3 className="mt-3 text-3xl font-light tracking-tight">
                Marketplace <span className="font-bold">Categories</span>
              </h3>
            </div>
            <button type="button" onClick={() => openVendorArchive()} className={buttonClasses.text}>View All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-neutral-200 border border-neutral-200">
            {categoryBrowseCards.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() =>
                    archiveCategoryValue(category.name) === "Venue"
                      ? openClientArchive({ type: "venue", category: "Venue" })
                      : openVendorArchive({ category: archiveCategoryValue(category.name) })
                  }
                  className="group bg-white px-8 py-10 min-h-52 flex flex-col justify-between hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 group-hover:text-black group-hover:border-black transition-colors">
                    <Icon size={18} />
                  </div>
                  <div className="mt-10">
                    <h4 className="text-xl font-bold tracking-tight">{category.name}</h4>
                    <p className="mt-3 text-sm text-neutral-500">{category.count} verified listings across key Canadian markets.</p>
                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors group-hover:text-black">
                      Browse <ArrowRight size={14} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <div className="border-t border-neutral-200 pt-20 mb-12">
          <div className="flex justify-between items-end mb-16">
            <h3 className="text-3xl font-light tracking-tight">
              Trending <span className="font-bold">Artisans</span>
            </h3>
            <button type="button" onClick={() => openVendorArchive()} className={buttonClasses.text}>View All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {(spotlightListings.length ? spotlightListings : []).map((vendor, index) => (
              <button key={index} onClick={() => openListingDetail(vendor.slug)} className="flex flex-col items-center text-center group cursor-pointer">
                <div className="w-40 h-40 rounded-full mb-6 overflow-hidden border border-neutral-200 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <SafeImage
                      src={vendor.image || (index % 2 === 0 ? IMG_AVATAR1 : IMG_AVATAR2)}
                      alt={vendor.businessName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      fallback={imageForCategory(vendor.category)}
                    />
                  </div>
                </div>
                <h4 className="text-lg font-bold">{vendor.businessName}</h4>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-2">
                  {vendor.category} • {vendor.city}
                </p>
                <div className="flex items-center justify-center gap-1 mt-3 text-black">
                  {ratingStars(vendor.rating)}
                  <span className="text-[10px] font-bold ml-1">({vendor.reviews || 0})</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  const VendorConceptA = () => {
    const vendor = vendorData?.vendor;
    const leads = vendorLeadRows.length ? vendorLeadRows : vendorData?.openLeads || [];
    const [vendorASection, setVendorASection] = useState(vendorSectionFromPath);
    const [leadFilter, setLeadFilter] = useState("all");
    const [analyticsPeriod, setAnalyticsPeriod] = useState("month");
    const [profileDraft, setProfileDraft] = useState(() => vendorForm || {});
    const [tagDrafts, setTagDrafts] = useState({});
    const [availabilityMonth, setAvailabilityMonth] = useState(() => monthKey(new Date()));
    const [selectedAvailabilityDate, setSelectedAvailabilityDate] = useState("");
    const [showVendorQuotePanel, setShowVendorQuotePanel] = useState(false);
    const [vendorQuoteDraft, setVendorQuoteDraft] = useState(null);
    const [quoteSettingsDraft, setQuoteSettingsDraft] = useState(() => quoteSettings);
    const [showQuoteDocumentPreview, setShowQuoteDocumentPreview] = useState(false);
    const [securityAction, setSecurityAction] = useState("password");
    const [vendorSettingsSection, setVendorSettingsSection] = useState(vendorSettingsSectionFromPath);
    const [securityDraft, setSecurityDraft] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      recoveryEmail: vendorForm?.email || "",
      twoFactorCode: "",
      loginAlerts: true
    });
    const [vendorWorkspaceDraft, setVendorWorkspaceDraft] = useState(() => ({
      ownerName: vendorForm?.ownerName || "Marcus A.",
      workspaceEmail: vendorForm?.email || "",
      timezone: "Eastern Time",
      reviewInviteDelayDays: "3 days",
      reviewFollowUpDelayDays: "5 days",
      reviewInviteTemplate: "Warm and professional",
      reviewFollowUpTemplate: "Gentle reminder",
      autoPauseAfterReview: true,
      ccTeamOnReviewSubmit: false
    }));
    const [vendorToggles, setVendorToggles] = useState({
      acceptingLeads: true,
      smsNotifications: false,
      emailDigest: true,
      reviewRequestAutomation: true,
      reviewFollowUpAutomation: true,
      vendorTwoFactorEnabled: false
    });
    const [vendorSupportDraft, setVendorSupportDraft] = useState({
      type: "Support ticket",
      priority: "Normal",
      subject: "",
      message: ""
    });
    const [showVendorSupportModal, setShowVendorSupportModal] = useState(false);
    const [openVendorSelectId, setOpenVendorSelectId] = useState(null);
    const [vendorSelectSearches, setVendorSelectSearches] = useState({});
    useEffect(() => {
      setProfileDraft(vendorForm || {});
    }, [vendor?.slug]);
    useEffect(() => {
      setVendorWorkspaceDraft((current) => ({
        ...current,
        ownerName: vendorForm?.ownerName || "Marcus A.",
        workspaceEmail: vendorForm?.email || ""
      }));
      setSecurityDraft((current) => ({
        ...current,
        recoveryEmail: vendorForm?.email || ""
      }));
    }, [vendor?.slug, vendorForm?.email, vendorForm?.ownerName]);
    useEffect(() => {
      if (!vendorSettingsData || !vendor?.slug) return;

      if (vendorSettingsData.workspace && typeof vendorSettingsData.workspace === "object") {
        setVendorWorkspaceDraft((current) => ({ ...current, ...vendorSettingsData.workspace }));
      }

      if (vendorSettingsData.toggles && typeof vendorSettingsData.toggles === "object") {
        setVendorToggles((current) => ({ ...current, ...vendorSettingsData.toggles }));
      }

      if (vendorSettingsData.security && typeof vendorSettingsData.security === "object") {
        setSecurityDraft((current) => ({
          ...current,
          recoveryEmail: current.recoveryEmail || vendorForm?.email || "",
          ...vendorSettingsData.security,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          twoFactorCode: ""
        }));
      }

      if (vendorSettingsData.quote && typeof vendorSettingsData.quote === "object") {
        setQuoteSettingsDraft((current) => ({ ...current, ...vendorSettingsData.quote }));
        setQuoteSettings((current) => ({ ...current, ...vendorSettingsData.quote }));
      }

      if ((vendorSettingsData.listingDefaults && typeof vendorSettingsData.listingDefaults === "object") || (vendorSettingsData.policies && typeof vendorSettingsData.policies === "object")) {
        setVendorPolicyDraft(createVendorPolicyDraft(vendorSettingsData.listingDefaults || vendorSettingsData.policies));
      }

      if (Array.isArray(vendorSettingsData.policyLibrary) || Array.isArray(vendorSettingsData.policiesLibrary)) {
        setVendorPolicyLibrary(createVendorPolicyLibrary(vendorSettingsData.policyLibrary || vendorSettingsData.policiesLibrary));
      }
    }, [vendor?.slug, vendorForm?.email, vendorSettingsData, setQuoteSettings]);
    const vendorMetrics = vendor?.metrics && typeof vendor.metrics === "object" ? vendor.metrics : {};
    const vendorServiceAreaCount = String(vendorForm?.serviceAreas || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean).length;
    const profileHealthChecks = [
      Boolean(vendor?.verified),
      Boolean(vendor?.description || vendorForm?.description),
      vendorServices.length > 0,
      vendorServiceAreaCount > 0,
      Boolean(vendor?.contact?.email || vendorForm?.email),
      Boolean(vendor?.image || vendorForm?.avatarImage)
    ];
    const profileHealthScore = Math.round((profileHealthChecks.filter(Boolean).length / profileHealthChecks.length) * 100);
    const hasVendorActivity =
      Number(vendorMetrics.profileViewsToday || 0) > 0 ||
      Number(vendorMetrics.profileViewsWeek || 0) > 0 ||
      Number(vendorMetrics.profileViewsMonth || 0) > 0 ||
      Number(vendorMetrics.leadsOpen || 0) > 0 ||
      Number(vendorMetrics.bookingsMonth || 0) > 0 ||
      leads.length > 0;
    const analyticsCards = [
      { label: "New Leads", val: vendorMetrics.leadsOpen ?? leads.length ?? 0, trend: hasVendorActivity ? "Live" : "No data", spark: [] },
      { label: "Profile Views", val: vendorMetrics.profileViewsMonth ?? 0, trend: hasVendorActivity ? "Live" : "No data", spark: [] },
      { label: "Booked Events", val: vendorMetrics.bookingsMonth ?? 0, trend: hasVendorActivity ? "Live" : "No data", spark: [] },
      { label: "Search Rank", val: hasVendorActivity ? vendorMetrics.searchRank || "Tracking" : "Not ranked", trend: hasVendorActivity ? "Live" : "No data", spark: [] }
    ];
    const analyticsPeriodOptions = [
      ["7d", "7 days"],
      ["month", "This month"],
      ["3m", "3 months"],
      ["year", "This year"]
    ];
    const analyticsByPeriod = {
      "7d": {
        label: "Last 7 days",
        totalViews: 342,
        views: 89,
        leads: 7,
        conversion: "7.9%",
        response: "98%",
        revenue: "$18.4k",
        trend: "+18%",
        chartTitle: "Daily profile views",
        chartSubtitle: "Last 7 days",
        chart: [
          ["Mon", 36],
          ["Tue", 42],
          ["Wed", 38],
          ["Thu", 51],
          ["Fri", 48],
          ["Sat", 62],
          ["Sun", 65]
        ],
        sources: [
          ["Direct search", 46],
          ["Browse / filters", 28],
          ["Featured placement", 16],
          ["Listing share", 10]
        ],
        actions: [
          ["Phone clicks", 21, Phone],
          ["WhatsApp opens", 18, MessageSquare],
          ["Email clicks", 12, Mail],
          ["Website visits", 9, Globe]
        ],
        cities: [
          ["Toronto", 42],
          ["Mississauga", 24],
          ["Brampton", 19],
          ["Vaughan", 15]
        ]
      },
      month: {
        label: "This month",
        totalViews: 1284,
        views: 342,
        leads: 24,
        conversion: "7.0%",
        response: "98%",
        revenue: "$52.8k",
        trend: "+23%",
        chartTitle: "Monthly views",
        chartSubtitle: "2026",
        chart: [
          ["Jan", 180],
          ["Feb", 220],
          ["Mar", 195],
          ["Apr", 280],
          ["May", 342]
        ],
        sources: [
          ["Direct search", 48],
          ["Browse / filters", 31],
          ["Featured placement", 21],
          ["Profile referral", 14]
        ],
        actions: [
          ["Phone clicks", 83, Phone],
          ["WhatsApp opens", 61, MessageSquare],
          ["Email clicks", 44, Mail],
          ["Website visits", 29, Globe]
        ],
        cities: [
          ["Toronto", 39],
          ["Mississauga", 27],
          ["Brampton", 18],
          ["Etobicoke", 16]
        ]
      },
      "3m": {
        label: "Last 3 months",
        totalViews: 3287,
        views: 817,
        leads: 58,
        conversion: "7.1%",
        response: "96%",
        revenue: "$132.6k",
        trend: "+31%",
        chartTitle: "Weekly profile views",
        chartSubtitle: "Last 12 weeks",
        chart: [
          ["W1", 184],
          ["W2", 206],
          ["W3", 224],
          ["W4", 238],
          ["W5", 251],
          ["W6", 246],
          ["W7", 272],
          ["W8", 291],
          ["W9", 308],
          ["W10", 316],
          ["W11", 334],
          ["W12", 345]
        ],
        sources: [
          ["Direct search", 43],
          ["Browse / filters", 34],
          ["Featured placement", 19],
          ["External links", 12]
        ],
        actions: [
          ["Phone clicks", 214, Phone],
          ["WhatsApp opens", 176, MessageSquare],
          ["Email clicks", 119, Mail],
          ["Website visits", 88, Globe]
        ],
        cities: [
          ["Toronto", 36],
          ["Mississauga", 29],
          ["Brampton", 21],
          ["Oakville", 14]
        ]
      },
      year: {
        label: "This year",
        totalViews: 11842,
        views: 4821,
        leads: 214,
        conversion: "4.4%",
        response: "94%",
        revenue: "$486k",
        trend: "+42%",
        chartTitle: "Yearly profile views",
        chartSubtitle: "2026",
        chart: [
          ["Jan", 180],
          ["Feb", 220],
          ["Mar", 195],
          ["Apr", 280],
          ["May", 342],
          ["Jun", 410],
          ["Jul", 438],
          ["Aug", 520],
          ["Sep", 476],
          ["Oct", 590],
          ["Nov", 648],
          ["Dec", 522]
        ],
        sources: [
          ["Direct search", 41],
          ["Browse / filters", 35],
          ["Featured placement", 18],
          ["Partner referrals", 16]
        ],
        actions: [
          ["Phone clicks", 924, Phone],
          ["WhatsApp opens", 711, MessageSquare],
          ["Email clicks", 506, Mail],
          ["Website visits", 382, Globe]
        ],
        cities: [
          ["Toronto", 34],
          ["Mississauga", 26],
          ["Brampton", 20],
          ["Hamilton", 12]
        ]
      }
    };
    const emptyAnalytics = {
      label: analyticsPeriodOptions.find(([value]) => value === analyticsPeriod)?.[1] || "This month",
      totalViews: 0,
      views: 0,
      leads: 0,
      conversion: "0%",
      response: "No data",
      revenue: "$0",
      trend: "No data",
      chartTitle: "Analytics activity",
      chartSubtitle: "Data appears after your listing is approved and starts receiving activity.",
      chart: [["W1", 0], ["W2", 0], ["W3", 0], ["W4", 0]],
      sources: [["Direct search", 0], ["Browse / filters", 0], ["Featured placement", 0], ["External links", 0]],
      actions: [["Phone clicks", 0, Phone], ["WhatsApp opens", 0, MessageSquare], ["Email clicks", 0, Mail], ["Website visits", 0, Globe]],
      cities: [["Primary city", 0], ["Secondary city", 0], ["Regional search", 0], ["Other", 0]]
    };
    const activeAnalytics = hasVendorActivity ? (analyticsByPeriod[analyticsPeriod] || analyticsByPeriod.month) : emptyAnalytics;
    const maxAnalyticsBar = Math.max(...activeAnalytics.chart.map(([, value]) => value), 1);
    const analyticsKpis = [
      { label: "All-time views", value: activeAnalytics.totalViews.toLocaleString(), change: activeAnalytics.trend, icon: Users },
      { label: activeAnalytics.label, value: activeAnalytics.views.toLocaleString(), change: hasVendorActivity ? "Live" : "No data", icon: TrendingUp },
      { label: "Qualified leads", value: activeAnalytics.leads, change: hasVendorActivity ? "Live" : "No data", icon: MessageSquare },
      { label: "Quote value", value: activeAnalytics.revenue, change: hasVendorActivity ? "Live" : "No data", icon: ArrowUpRight },
      { label: "Conversion rate", value: activeAnalytics.conversion, change: hasVendorActivity ? "Live" : "No data", icon: BarChart3 }
    ];
    const leadStageAnalytics = [
      ["New inquiry", leads.filter((lead) => (lead.status || "New inquiry").toLowerCase().includes("new")).length],
      ["Quote sent", leads.filter((lead) => (lead.status || "").toLowerCase().includes("quote")).length],
      ["Follow up", leads.filter((lead) => (lead.status || "").toLowerCase().includes("follow")).length],
      ["Booked", leads.filter((lead) => (lead.status || "").toLowerCase().includes("book")).length]
    ];
    const listingPerformanceRows = hasVendorActivity
      ? [
          ["Primary listing", String(vendorMetrics.profileViewsMonth || 0), String(vendorMetrics.leadsOpen || leads.length || 0), "$0", activeAnalytics.conversion],
          ["Secondary listing", "0", "0", "$0", "0%"]
        ]
      : [];
    const compactSecondaryButtonClass =
      "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-neutral-300 bg-white px-3.5 text-[14px] leading-none font-medium tracking-normal text-black transition-colors hover:bg-neutral-50";
    const compactPrimaryButtonClass =
      "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-black px-3.5 text-[14px] leading-none font-medium tracking-normal text-white transition-colors hover:bg-neutral-800";
    const compactTextActionClass =
      "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-neutral-200 bg-white px-3 text-[14px] leading-none font-medium tracking-normal text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-black";
    const fieldClass = "w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none bg-white";
    const surfaceClass = "rounded-lg bg-white border border-neutral-200";
    const mutedCardClass = "rounded-lg bg-white border border-neutral-200";
    const vendorSupportRequests = [...adminRequests]
      .filter((request) => {
        const businessName = String(vendorForm?.businessName || vendor?.businessName || "").toLowerCase();
        const vendorSlug = String(vendor?.slug || "").toLowerCase();
        return (
          String(request.requester || "").toLowerCase() === businessName ||
          String(request.requesterSlug || "").toLowerCase() === vendorSlug
        );
      })
      .sort((a, b) => a.dateRank - b.dateRank);
    const openVendorSupportCount = vendorSupportRequests.filter((request) => request.status !== completedRequestStatusKey).length;
    const currentVendorSlug = vendor?.slug || vendorData?.vendor?.slug || "";
    const vendorReviewRequests = reviewRequestRows.filter((request) => request.vendorSlug === currentVendorSlug);
    const vendorReviews = reviewRows.filter((review) => review.vendorSlug === currentVendorSlug);
    const vendorPendingReviewCount = vendorReviews.filter((review) => review.status === "pending").length;
    const vendorApprovedReviews = vendorReviews.filter((review) => review.status === "approved");
    const vendorReviewSummary = listingReviewSummary(vendor || vendorData?.vendor || vendorForm || {});
    const sendDemoEmail = async (demoType) => {
      const targetEmail = demoEmailRecipient.trim();
      if (!targetEmail) {
        setSaveState("Add an email address before sending a demo");
        return;
      }

      setSaveState("Sending demo email...");
      try {
        await api("/api/email-demos", {
          method: "POST",
          body: JSON.stringify({
            demoType,
            targetEmail,
            vendorName: vendor?.businessName || vendorForm?.businessName || "Golden Beats DJ Services",
            vendorSlug: currentVendorSlug || "golden-beats-dj-services"
          })
        });
        setSaveState(`Demo email sent to ${targetEmail}`);
      } catch (error) {
        setSaveState(error.message);
      }
    };
    const statusBadgeClass = (status = "") => {
      const normalized = status.toLowerCase();
      if (normalized.includes("new")) return "border-blue-200 bg-blue-50 text-blue-700";
      if (normalized.includes("quote")) return "border-amber-200 bg-amber-50 text-amber-700";
      if (normalized.includes("follow")) return "border-violet-200 bg-violet-50 text-violet-700";
      if (normalized.includes("book")) return "border-green-200 bg-green-50 text-green-700";
      if (normalized.includes("closed")) return "border-neutral-300 bg-neutral-100 text-neutral-600";
      return "border-sky-200 bg-sky-50 text-sky-700";
    };
    const vendorSettingsInputClass = "h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-300 focus:bg-white";
    const vendorSettingsSelectClass = "h-12 w-full appearance-none rounded-2xl border border-neutral-200 bg-neutral-50 pl-4 pr-11 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-300 focus:bg-white";
    const vendorSettingsCardClass = "overflow-hidden rounded-2xl border border-neutral-200 bg-white";
    const vendorSettingsMenu = [
      { key: "general", label: "General", icon: Globe, description: "Workspace owner and account defaults." },
      { key: "automation", label: "Automation", icon: Sparkles, description: "Review request timing and follow-ups." },
      { key: "security", label: "Security", icon: Shield, description: "Password, 2FA, and login safeguards." }
    ];
    const vendorMobileBottomMenu = [
      { icon: LayoutDashboard, label: "Home", section: "dashboard" },
      { icon: MessageSquare, label: "Leads", section: "leads" },
      { icon: ImageIcon, label: "Listings", section: "listings" },
      { icon: Users, label: "Clients", section: "clients" },
      { icon: BarChart3, label: "Analytics", section: "analytics" },
      { icon: Settings, label: "Settings", section: "settings" }
    ];
    const vendorMobileMoreMenu = [
      { label: "Profile details", section: "profile" },
      ...vendorPublicProfileMenu.filter((item) => item.section !== "profile"),
      ...vendorAccountMenu,
      { label: "Account Settings", section: "settings" }
    ];
    const vendorMobilePrimarySections = ["dashboard", "leads", "listings", "clients", "analytics"];
    const showVendorMobileBackToSettings = !vendorMobilePrimarySections.includes(vendorASection) && !(vendorASection === "settings" && vendorSettingsSection === "menu");
    const renderVendorSettingsPanel = ({ title, description, children, tone = "default" }) => (
      <section className={`${vendorSettingsCardClass} ${tone === "danger" ? "border-red-200 bg-red-50/30" : ""}`}>
        <div className={`border-b px-7 py-6 ${tone === "danger" ? "border-red-100" : "border-neutral-100"}`}>
          <h3 className={`text-[15px] font-bold tracking-tight ${tone === "danger" ? "text-red-700" : "text-neutral-950"}`}>{title}</h3>
          {description ? <p className={`mt-1 text-sm leading-6 ${tone === "danger" ? "text-red-500" : "text-neutral-400"}`}>{description}</p> : null}
        </div>
        <div className={tone === "danger" ? "divide-y divide-red-100" : "divide-y divide-neutral-100"}>
          {children}
        </div>
      </section>
    );
    const renderVendorSettingsRow = ({ label, description, control }) => (
      <div className="grid gap-4 px-7 py-6 md:grid-cols-[minmax(0,1fr)_320px] md:items-center">
        <div className="min-w-0">
          <div className="text-[15px] font-medium text-neutral-900">{label}</div>
          {description ? <p className="mt-1 text-sm leading-6 text-neutral-400">{description}</p> : null}
        </div>
        <div className="md:justify-self-end md:w-full md:max-w-[320px]">{control}</div>
      </div>
    );
    const renderVendorSettingsSwitch = ({ checked, onChange, disabled = false }) => (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => {
          if (!disabled) onChange(!checked);
        }}
        className={`inline-flex h-8 w-14 items-center rounded-full border p-0.5 transition-all ${
          checked ? "justify-end border-black bg-black" : "justify-start border-neutral-200 bg-neutral-200"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <span className="h-6 w-6 rounded-full bg-white shadow-sm" />
      </button>
    );
    const sectionMeta = {
      dashboard: ["Performance Overview", "Analytics and recent lead activity for the last 30 days."],
      listings: ["Listings Overview", "Manage all vendor and service listings in one table view."],
      leads: ["Lead Inbox", "Review new requests, quotes, budgets, and follow-up status."],
      clients: ["Clients", "Save customers from leads and keep their event context in one place."],
      analytics: ["Analytics Overview", "Track trends, visibility, and lead performance across your listings."],
      profile: ["Basic Info", "Edit public profile details, contact information, and social links."],
      media: ["Media Gallery", "Manage cover imagery and portfolio assets."],
      availability: ["Calendar & Availability", "Set booking windows, open days, blackout dates, and response expectations."],
      "service-areas": ["Service Areas", "Control your cities, travel radius, and event coverage."],
      packages: ["Packages & Pricing", "Build sellable services and pricing tiers."],
      "listing-settings": ["Listing Settings", "Default parking, checklist, and listing setup values."],
      notifications: ["Notification Settings", "Choose how new leads and reminders reach your team."],
      policies: ["Policies", "Create and edit reusable policy records for bookings, cancellations, refunds, and house rules."],
      reviews: ["Reviews", "Request client reviews, track moderation status, and preview what appears on your listing."],
      support: ["Support & Requests", "Contact admin for help and track request progress in one queue."],
      quotes: ["Documents & Quotes", "Set defaults for quote documents sent to clients."],
      security: ["Security & Login", "Manage login access, password status, and account safety."],
      settings: ["Settings", "Manage workspace details, automation, and security preferences from one place."]
    };
    const [sectionTitle, sectionDescription] = sectionMeta[vendorASection] || sectionMeta.dashboard;
    const vendorSettingsTitle =
      vendorSettingsSection === "menu"
        ? sectionTitle
        : vendorSettingsSection === "general"
          ? "Account Settings"
          : vendorSettingsMenu.find((item) => item.key === vendorSettingsSection)?.label || sectionTitle;
    const vendorSettingsDescription =
      vendorSettingsSection === "menu"
        ? sectionDescription
        : vendorSettingsSection === "general"
          ? "Manage workspace details, account status, and admin-only account actions."
          : vendorSettingsMenu.find((item) => item.key === vendorSettingsSection)?.description || sectionDescription;
    const vendorGreetingName = vendor?.businessName || vendorForm?.businessName || "there";
    const renderVendorSettingsContent = () => {
      if (vendorSettingsSection === "listing") {
        return (
          <div className="space-y-6">
            <section className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Listing setup defaults</div>
                  <h2 className="vendor-listing-editor-title mt-2 text-[22px] font-semibold tracking-tight text-neutral-950">Reusable defaults for new listings</h2>
                  <p className="mt-2 max-w-2xl text-[14px] leading-6 text-neutral-500">
                    These values prefill the create listing form so every new listing starts with consistent access details, included items, and safety expectations.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-center">
                  <div>
                    <div className="text-[20px] font-semibold text-neutral-950">{vendorPolicyDraft.parkingOptions.length}</div>
                    <div className="mt-1 text-[11px] font-medium text-neutral-500">Access items</div>
                  </div>
                  <div>
                    <div className="text-[20px] font-semibold text-neutral-950">{vendorPolicyDraft.includedFeatures.length}</div>
                    <div className="mt-1 text-[11px] font-medium text-neutral-500">Included</div>
                  </div>
                  <div>
                    <div className="text-[20px] font-semibold text-neutral-950">{vendorPolicyDraft.healthSafetyMeasures.length}</div>
                    <div className="mt-1 text-[11px] font-medium text-neutral-500">Safety</div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <section className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[16px] font-semibold text-neutral-950">Parking and access</h3>
                    <p className="mt-1 text-[13px] leading-5 text-neutral-500">Default arrival, parking, and setup guidance copied into each new listing.</p>
                  </div>
                  <MapPin size={18} className="mt-1 text-neutral-400" />
                </div>
                <div className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Parking setup</label>
                    <VendorSelect
                      id="listing-default-parking-mode"
                      value={vendorPolicyDraft.parkingMode}
                      options={PARKING_MODE_OPTIONS}
                      onChange={(value) => setVendorPolicyDraft((current) => ({ ...current, parkingMode: value }))}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Parking summary</label>
                    <textarea
                      value={vendorPolicyDraft.parkingSummary}
                      onChange={(event) => setVendorPolicyDraft((current) => ({ ...current, parkingSummary: event.target.value }))}
                      className={`${vendorSettingsInputClass} min-h-32 py-3`}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[16px] font-semibold text-neutral-950">Access checklist</h3>
                    <p className="mt-1 text-[13px] leading-5 text-neutral-500">Select the access details that should be enabled by default.</p>
                  </div>
                  <ClipboardList size={18} className="mt-1 text-neutral-400" />
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {uniqueStringArray([...PARKING_OPTION_CHOICES, ...(vendorPolicyDraft.parkingOptions || [])]).map((option) => {
                    const checked = vendorPolicyDraft.parkingOptions.includes(option);
                    return (
                      <label key={option} className={`flex min-h-12 items-center gap-3 rounded-xl border px-3 py-3 text-sm transition-colors ${checked ? "border-sky-200 bg-sky-50 text-neutral-950" : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300 hover:bg-white"}`}>
                        <input type="checkbox" checked={checked} onChange={() => togglePolicyChoice("parkingOptions", option)} className="h-4 w-4 accent-sky-500" />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    value={tagDrafts.parkingOptionsDefault || ""}
                    onChange={(event) => setTagDrafts((current) => ({ ...current, parkingOptionsDefault: event.target.value }))}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      event.preventDefault();
                      addPolicyChoiceFromDraft("parkingOptions", "parkingOptionsDefault");
                    }}
                    placeholder="Add custom access item"
                    className="h-11 min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-300"
                  />
                  <button type="button" onClick={() => addPolicyChoiceFromDraft("parkingOptions", "parkingOptionsDefault")} className={compactSecondaryButtonClass}>Add</button>
                </div>
              </section>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <section className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[16px] font-semibold text-neutral-950">Included with listings</h3>
                    <p className="mt-1 text-[13px] leading-5 text-neutral-500">Choose the standard service inclusions vendors want clients to see first.</p>
                  </div>
                  <CheckCircle size={18} className="mt-1 text-neutral-400" />
                </div>
                <div className="mt-6 grid gap-3">
                  {uniqueStringArray([...INCLUDED_FEATURE_CHOICES, ...(vendorPolicyDraft.includedFeatures || [])]).map((option) => {
                    const checked = vendorPolicyDraft.includedFeatures.includes(option);
                    return (
                      <label key={option} className={`flex min-h-12 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${checked ? "border-sky-200 bg-sky-50 text-neutral-950" : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300 hover:bg-white"}`}>
                        <span>{option}</span>
                        <input type="checkbox" checked={checked} onChange={() => togglePolicyChoice("includedFeatures", option)} className="h-4 w-4 accent-sky-500" />
                      </label>
                    );
                  })}
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    value={tagDrafts.includedFeaturesDefault || ""}
                    onChange={(event) => setTagDrafts((current) => ({ ...current, includedFeaturesDefault: event.target.value }))}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      event.preventDefault();
                      addPolicyChoiceFromDraft("includedFeatures", "includedFeaturesDefault");
                    }}
                    placeholder="Add included service"
                    className="h-11 min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-300"
                  />
                  <button type="button" onClick={() => addPolicyChoiceFromDraft("includedFeatures", "includedFeaturesDefault")} className={compactSecondaryButtonClass}>Add</button>
                </div>
              </section>

              <section className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[16px] font-semibold text-neutral-950">Health and safety defaults</h3>
                    <p className="mt-1 text-[13px] leading-5 text-neutral-500">Set the trust and safety measures preselected for new listings.</p>
                  </div>
                  <Shield size={18} className="mt-1 text-neutral-400" />
                </div>
                <div className="mt-6 grid gap-3">
                  {uniqueStringArray([...HEALTH_SAFETY_CHOICES, ...(vendorPolicyDraft.healthSafetyMeasures || [])]).map((option) => {
                    const checked = vendorPolicyDraft.healthSafetyMeasures.includes(option);
                    return (
                      <label key={option} className={`flex min-h-12 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${checked ? "border-sky-200 bg-sky-50 text-neutral-950" : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300 hover:bg-white"}`}>
                        <span>{option}</span>
                        <input type="checkbox" checked={checked} onChange={() => togglePolicyChoice("healthSafetyMeasures", option)} className="h-4 w-4 accent-sky-500" />
                      </label>
                    );
                  })}
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    value={tagDrafts.healthSafetyMeasuresDefault || ""}
                    onChange={(event) => setTagDrafts((current) => ({ ...current, healthSafetyMeasuresDefault: event.target.value }))}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      event.preventDefault();
                      addPolicyChoiceFromDraft("healthSafetyMeasures", "healthSafetyMeasuresDefault");
                    }}
                    placeholder="Add safety measure"
                    className="h-11 min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-300"
                  />
                  <button type="button" onClick={() => addPolicyChoiceFromDraft("healthSafetyMeasures", "healthSafetyMeasuresDefault")} className={compactSecondaryButtonClass}>Add</button>
                </div>
              </section>
            </div>
          </div>
        );
      }

      if (vendorSettingsSection === "automation") {
        return (
          <div className="space-y-8">
            {renderVendorSettingsPanel({
              title: "Review Automation",
              description: "Control when review emails go out after a lead is marked completed.",
              children: (
                <>
                  {renderVendorSettingsRow({
                    label: "Enable review request automation",
                    description: "Automatically trigger a review request after the lead reaches completed status.",
                    control: <div className="flex justify-end">{renderVendorSettingsSwitch({ checked: vendorToggles.reviewRequestAutomation, onChange: (checked) => setVendorToggles((current) => ({ ...current, reviewRequestAutomation: checked })) })}</div>
                  })}
                  {renderVendorSettingsRow({
                    label: "First review email",
                    description: "How long after completion the initial review request should be sent.",
                    control: (
                      <VendorSelect
                        id="review-invite-delay"
                        value={vendorWorkspaceDraft.reviewInviteDelayDays}
                        options={["1 day", "3 days", "5 days", "7 days"]}
                        onChange={(value) => setVendorWorkspaceDraft((current) => ({ ...current, reviewInviteDelayDays: value }))}
                      />
                    )
                  })}
                  {renderVendorSettingsRow({
                    label: "Enable follow-up reminder",
                    description: "Send one follow-up email if the client has not left a review yet.",
                    control: <div className="flex justify-end">{renderVendorSettingsSwitch({ checked: vendorToggles.reviewFollowUpAutomation, onChange: (checked) => setVendorToggles((current) => ({ ...current, reviewFollowUpAutomation: checked })) })}</div>
                  })}
                  {renderVendorSettingsRow({
                    label: "Follow-up timing",
                    description: "How long after the first review email the reminder should be sent.",
                    control: (
                      <VendorSelect
                        id="review-follow-up-delay"
                        value={vendorWorkspaceDraft.reviewFollowUpDelayDays}
                        options={["2 days", "3 days", "5 days", "7 days"]}
                        onChange={(value) => setVendorWorkspaceDraft((current) => ({ ...current, reviewFollowUpDelayDays: value }))}
                      />
                    )
                  })}
                  {renderVendorSettingsRow({
                    label: "Review request tone",
                    description: "Choose the default tone for automated review email copy.",
                    control: (
                      <VendorSelect
                        id="review-invite-template"
                        value={vendorWorkspaceDraft.reviewInviteTemplate}
                        options={["Warm and professional", "Friendly and concise", "Celebratory follow-up"]}
                        onChange={(value) => setVendorWorkspaceDraft((current) => ({ ...current, reviewInviteTemplate: value }))}
                      />
                    )
                  })}
                  {renderVendorSettingsRow({
                    label: "CC workspace email on new reviews",
                    description: "Send an internal copy whenever a client submits a review through the request flow.",
                    control: <div className="flex justify-end">{renderVendorSettingsSwitch({ checked: vendorWorkspaceDraft.ccTeamOnReviewSubmit, onChange: (checked) => setVendorWorkspaceDraft((current) => ({ ...current, ccTeamOnReviewSubmit: checked })) })}</div>
                  })}
                </>
              )
            })}
            {renderVendorSettingsPanel({
              title: "Automation Preview",
              description: "How the current local placeholder flow behaves.",
              children: (
                <div className="grid gap-4 px-7 py-6 md:grid-cols-3">
                  {[
                    ["1", `Lead marked completed`, "A completed lead starts the automation clock."],
                    ["2", `After ${vendorWorkspaceDraft.reviewInviteDelayDays}`, "The first review request email is queued to send."],
                    ["3", vendorToggles.reviewFollowUpAutomation ? `Follow up ${vendorWorkspaceDraft.reviewFollowUpDelayDays} later` : "No follow-up reminder", vendorToggles.reviewFollowUpAutomation ? "A reminder sends only if the client has not reviewed yet." : "Automation stops after the first send."]
                  ].map(([step, title, body]) => (
                    <div key={step} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Step {step}</div>
                      <div className="mt-3 text-[15px] font-semibold text-neutral-950">{title}</div>
                      <p className="mt-2 text-sm leading-6 text-neutral-500">{body}</p>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        );
      }

      if (vendorSettingsSection === "security") {
        return (
          <div className="space-y-8">
            {renderVendorSettingsPanel({
              title: "Authentication",
              description: "Protect who can access the vendor workspace.",
              children: (
                <>
                  {renderVendorSettingsRow({
                    label: "Recovery email",
                    description: "Used for account recovery and security notifications.",
                    control: <input type="email" value={securityDraft.recoveryEmail} onChange={(event) => setSecurityDraft((current) => ({ ...current, recoveryEmail: event.target.value }))} className={vendorSettingsInputClass} />
                  })}
                  {renderVendorSettingsRow({
                    label: "Login alerts",
                    description: "Email the owner when a new device signs into the workspace.",
                    control: <div className="flex justify-end">{renderVendorSettingsSwitch({ checked: securityDraft.loginAlerts, onChange: (checked) => setSecurityDraft((current) => ({ ...current, loginAlerts: checked })) })}</div>
                  })}
                  {renderVendorSettingsRow({
                    label: "Two-factor authentication",
                    description: "Require a one-time code for owner access.",
                    control: <div className="flex justify-end">{renderVendorSettingsSwitch({ checked: vendorToggles.vendorTwoFactorEnabled, onChange: (checked) => setVendorToggles((current) => ({ ...current, vendorTwoFactorEnabled: checked })) })}</div>
                  })}
                </>
              )
            })}
            {renderVendorSettingsPanel({
              title: "Password",
              description: "Update the workspace password used for manual sign-in.",
              children: (
                <>
                  {renderVendorSettingsRow({
                    label: "Current password",
                    description: "Enter the existing password before setting a new one.",
                    control: <input type="password" value={securityDraft.currentPassword} onChange={(event) => setSecurityDraft((current) => ({ ...current, currentPassword: event.target.value }))} className={vendorSettingsInputClass} />
                  })}
                  {renderVendorSettingsRow({
                    label: "New password",
                    description: "Use a strong password unique to this workspace.",
                    control: <input type="password" value={securityDraft.newPassword} onChange={(event) => setSecurityDraft((current) => ({ ...current, newPassword: event.target.value }))} className={vendorSettingsInputClass} />
                  })}
                  {renderVendorSettingsRow({
                    label: "Confirm password",
                    description: "Repeat the new password to confirm the change.",
                    control: <input type="password" value={securityDraft.confirmPassword} onChange={(event) => setSecurityDraft((current) => ({ ...current, confirmPassword: event.target.value }))} className={vendorSettingsInputClass} />
                  })}
                </>
              )
            })}
            {renderVendorSettingsPanel({
              title: "Active Sessions",
              description: "Sessions currently signed into this vendor workspace.",
              children: (
                <>
                  {[["Current device", "Toronto, Chrome", "Active now", false], ["Mobile session", "iPhone, Safari", "2 hours ago", true]].map(([title, meta, time, removable]) => (
                    <div key={title} className="flex items-center justify-between gap-4 px-7 py-6">
                      <div>
                        <div className="text-[15px] font-medium text-neutral-900">{title}</div>
                        <p className="mt-1 text-sm leading-6 text-neutral-400">{meta} • {time}</p>
                      </div>
                      {removable ? <button type="button" onClick={() => setSaveState("Session revoked")} className={compactSecondaryButtonClass}>Revoke</button> : <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Current</span>}
                    </div>
                  ))}
                </>
              )
            })}
          </div>
        );
      }

      return (
        <div className="space-y-8">
          {renderVendorSettingsPanel({
            title: "Workspace Profile",
            description: "Manage ownership, admin email, timezone, and export actions.",
            children: (
              <>
                {renderVendorSettingsRow({
                  label: "Account owner",
                  description: "Primary person responsible for this vendor workspace.",
                  control: <input value={vendorWorkspaceDraft.ownerName} onChange={(event) => setVendorWorkspaceDraft((current) => ({ ...current, ownerName: event.target.value }))} className={vendorSettingsInputClass} />
                })}
                {renderVendorSettingsRow({
                  label: "Workspace email",
                  description: "Used for account notices, owner access, and review workflow communication.",
                  control: <input type="email" value={vendorWorkspaceDraft.workspaceEmail} onChange={(event) => setVendorWorkspaceDraft((current) => ({ ...current, workspaceEmail: event.target.value }))} className={vendorSettingsInputClass} />
                })}
                {renderVendorSettingsRow({
                  label: "Timezone",
                  description: "Used for reminders, quote expiries, and automation timing.",
                  control: (
                    <VendorSelect
                      id="workspace-timezone"
                      value={vendorWorkspaceDraft.timezone}
                      options={["Eastern Time", "Central Time", "Mountain Time", "Pacific Time"]}
                      onChange={(value) => setVendorWorkspaceDraft((current) => ({ ...current, timezone: value }))}
                    />
                  )
                })}
                {renderVendorSettingsRow({
                  label: "Export account data",
                  description: "Prepare a local export of your workspace content, leads, and quote settings.",
                  control: <button type="button" onClick={() => setSaveState("Account export requested")} className={`${compactSecondaryButtonClass} w-full`}>Export account data</button>
                })}
              </>
            )
          })}
          {renderVendorSettingsPanel({
            title: "Workspace Status",
            description: "High-level account state for the current vendor profile.",
            children: (
              <div className="grid gap-4 px-7 py-6 md:grid-cols-3">
                {[
                  ["Workspace role", "Owner"],
                  ["Visibility", "Marketplace active"],
                  ["Last update", "Today"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
                    <div className="text-[12px] text-neutral-500">{label}</div>
                    <div className="mt-2 text-[15px] font-semibold text-neutral-950">{value}</div>
                  </div>
                ))}
              </div>
            )
          })}
          {renderVendorSettingsPanel({
            title: "Email Demo Flows",
            description: "Send staging previews of the production email templates to any test inbox.",
            children: (
              <div className="space-y-4 px-7 py-6">
                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold text-neutral-600">Send demos to</span>
                  <input
                    type="email"
                    value={demoEmailRecipient}
                    onChange={(event) => setDemoEmailRecipient(event.target.value)}
                    placeholder="name@example.com"
                    className={vendorSettingsInputClass}
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["approval", "Vendor approval"],
                    ["rejection", "Vendor rejection"],
                    ["review", "Review request"],
                    ["support", "Support response"]
                  ].map(([demoType, label]) => (
                    <button
                      key={demoType}
                      type="button"
                      onClick={() => sendDemoEmail(demoType)}
                      className={compactSecondaryButtonClass}
                    >
                      Send {label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
          {renderVendorSettingsPanel({
            title: "Danger Zone",
            description: "Use these actions carefully. Pausing hides your profile; deletion starts a removal request.",
            tone: "danger",
            children: (
              <>
                {renderVendorSettingsRow({
                  label: "Pause marketplace profile",
                  description: "Temporarily hide your listings and stop new client inquiries.",
                  control: <button type="button" onClick={() => setSaveState("Account pause requested")} className={`${compactSecondaryButtonClass} w-full`}>Pause account</button>
                })}
                {renderVendorSettingsRow({
                  label: "Delete vendor account",
                  description: "Request permanent removal after active leads and open requests are reviewed.",
                  control: <button type="button" onClick={() => setSaveState("Deletion request started")} className="inline-flex h-10 w-full items-center justify-center rounded-md border border-red-200 bg-white px-3.5 text-[14px] font-medium text-red-700 transition-colors hover:bg-red-50">Request deletion</button>
                })}
              </>
            )
          })}
        </div>
      );
    };
    const profileValue = (field) => profileDraft?.[field] || "";
    const updateProfileDraft = (field, value) => setProfileDraft((current) => ({ ...(current || {}), [field]: value }));
    const parseProfileTags = (field) =>
      String(profileDraft?.[field] || "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);
    const setProfileTags = (field, tags) => updateProfileDraft(field, tags.join(", "));
    const parseServiceAreas = () => {
      const raw = String(profileDraft?.serviceAreas || "");
      const fromKnownCities = CANADIAN_CITY_OPTIONS.filter((city) => raw.toLowerCase().includes(city.toLowerCase()));
      if (fromKnownCities.length) return [...new Set(fromKnownCities)];
      return raw
        .split("|")
        .map((entry) => entry.trim())
        .filter(Boolean);
    };
    const setServiceAreas = (areas) => updateProfileDraft("serviceAreas", areas.join("|"));
    const displayCityName = (city) => String(city || "").split(",")[0].trim();
    const togglePolicyChoice = (field, value) => {
      setVendorPolicyDraft((current) => {
        const items = uniqueStringArray(current[field] || []);
        const exists = items.some((item) => item.toLowerCase() === value.toLowerCase());
        return {
          ...current,
          [field]: exists ? items.filter((item) => item.toLowerCase() !== value.toLowerCase()) : [...items, value]
        };
      });
    };
    const addPolicyChoiceFromDraft = (field, draftKey) => {
      const nextValue = String(tagDrafts[draftKey] || "").trim();
      if (!nextValue) return;
      setVendorPolicyDraft((current) => {
        const items = uniqueStringArray(current[field] || []);
        const exists = items.some((item) => item.toLowerCase() === nextValue.toLowerCase());
        return {
          ...current,
          [field]: exists ? items : [...items, nextValue]
        };
      });
      setTagDrafts((current) => ({ ...current, [draftKey]: "" }));
    };
    const openVendorPolicyEditor = (policy = null) => {
      setVendorPolicyFormMode(policy ? "edit" : "create");
      setVendorPolicyItemDraft(
        policy
          ? { ...policy }
          : {
              id: `policy-${Date.now()}`,
              category: "Custom policy",
              title: "",
              body: "",
              scope: "All listings"
            }
      );
      setShowVendorPolicyForm(true);
    };
    const saveVendorPolicyItem = async () => {
      const title = String(vendorPolicyItemDraft?.title || "").trim();
      const body = String(vendorPolicyItemDraft?.body || "").trim();
      if (!title || !body || !vendorPolicyItemDraft) return;

      const nextPolicy = {
        ...vendorPolicyItemDraft,
        title,
        body,
        category: String(vendorPolicyItemDraft.category || "Custom policy").trim(),
        scope: String(vendorPolicyItemDraft.scope || "All listings").trim()
      };
      const nextLibrary = vendorPolicyFormMode === "edit"
        ? vendorPolicyLibrary.map((item) => (item.id === nextPolicy.id ? nextPolicy : item))
        : [nextPolicy, ...vendorPolicyLibrary];

      setVendorPolicyLibrary(nextLibrary);
      setShowVendorPolicyForm(false);
      setVendorPolicyItemDraft(null);
      await saveVendorWorkspaceSettings(vendorPolicyFormMode === "edit" ? "Policy updated" : "Policy created", {
        policyLibrary: nextLibrary
      });
    };
    const deleteVendorPolicyItem = async (policyId) => {
      const nextLibrary = vendorPolicyLibrary.filter((item) => item.id !== policyId);
      setVendorPolicyLibrary(nextLibrary);
      if (vendorPolicyItemDraft?.id === policyId) {
        setShowVendorPolicyForm(false);
        setVendorPolicyItemDraft(null);
      }
      await saveVendorWorkspaceSettings("Policy removed", {
        policyLibrary: nextLibrary
      });
    };
    const toggleListingDraftChoice = (field, value) => {
      setVendorListingDraft((current) => {
        if (!current) return current;
        const items = uniqueStringArray(current[field] || []);
        const exists = items.some((item) => item.toLowerCase() === value.toLowerCase());
        return {
          ...current,
          [field]: exists ? items.filter((item) => item.toLowerCase() !== value.toLowerCase()) : [...items, value]
        };
      });
    };
    const addProfileTag = (field) => {
      const nextTag = String(tagDrafts[field] || "").trim();
      if (!nextTag) return;
      const currentTags = parseProfileTags(field);
      if (!currentTags.some((tag) => tag.toLowerCase() === nextTag.toLowerCase())) {
        setProfileTags(field, [...currentTags, nextTag]);
      }
      setTagDrafts((current) => ({ ...current, [field]: "" }));
    };
    const removeProfileTag = (field, tagToRemove) => {
      if (field === "serviceAreas") {
        setServiceAreas(parseServiceAreas().filter((tag) => tag !== tagToRemove));
        return;
      }
      setProfileTags(field, parseProfileTags(field).filter((tag) => tag !== tagToRemove));
    };
    const toggleProfileTag = (field, tag) => {
      if (field === "serviceAreas") {
        const currentTags = parseServiceAreas();
        const exists = currentTags.some((item) => item.toLowerCase() === tag.toLowerCase());
        setServiceAreas(exists ? currentTags.filter((item) => item.toLowerCase() !== tag.toLowerCase()) : [...currentTags, tag]);
        return;
      }
      const currentTags = parseProfileTags(field);
      const exists = currentTags.some((item) => item.toLowerCase() === tag.toLowerCase());
      setProfileTags(field, exists ? currentTags.filter((item) => item.toLowerCase() !== tag.toLowerCase()) : [...currentTags, tag]);
    };
    const handleProfileTagKeyDown = (event, field) => {
      if (event.key !== "Enter" && event.key !== ",") return;
      event.preventDefault();
      addProfileTag(field);
    };
    const submitVendorSupportRequest = async () => {
      const subject = String(vendorSupportDraft.subject || "").trim();
      const message = String(vendorSupportDraft.message || "").trim();
      if (!subject || !message) return;

      const requester = vendorForm?.businessName || vendorData?.vendor?.businessName || vendor?.businessName || "Vendor";
      const requesterSlug = vendorData?.vendor?.slug || vendor?.slug || "";
      const email = vendorForm?.email || vendorData?.vendor?.contact?.email || vendor?.contact?.email || "";
      if (!requesterSlug) return;

      setSaveState("Saving...");
      try {
        const payload = await api(`/api/dashboard/vendor/${requesterSlug}/support-requests`, {
          method: "POST",
          body: JSON.stringify({
            requester,
            requesterSlug,
            subject,
            type: vendorSupportDraft.type,
            priority: vendorSupportDraft.priority,
            email,
            message,
            status: defaultAdminRequestStatusKey
          })
        });
        setAdminRequestRows((current) => [payload.request, ...current]);
        setVendorSupportDraft({
          type: "Support ticket",
          priority: "Normal",
          subject: "",
          message: ""
        });
        setShowVendorSupportModal(false);
        setSaveState("Support request sent");
      } catch (error) {
        setSaveState(error.message);
      }
    };
    const blockedAvailabilityDates = useMemo(
      () =>
        String(profileDraft?.blackoutDates || "")
          .split(/\n|,/)
          .map((entry) => entry.trim())
          .filter(Boolean),
      [profileDraft?.blackoutDates]
    );
    const availabilityMonthDate = parseMonthKey(availabilityMonth);
    const availabilityDays = buildCalendarMonth(availabilityMonthDate);
    const selectedAvailabilityLabel = selectedAvailabilityDate ? formatDateLabel(selectedAvailabilityDate) : "No date selected";
    const parseMoneyValue = (value) => Number(String(value || "").replace(/[^0-9.]/g, "")) || 0;
    const quoteSettingValue = (field) => quoteSettingsDraft?.[field] || "";
    const quoteSubtotal = vendorQuoteDraft?.lineItems?.reduce((sum, item) => sum + parseMoneyValue(item.amount), 0) || 0;
    const updateQuoteSettingDraft = (field, value) => setQuoteSettingsDraft((current) => ({ ...(current || {}), [field]: value }));
    const saveVendorWorkspaceSettings = async (successMessage = "Vendor settings saved", overrides = {}) => {
      const vendorSlug = vendorData?.vendor?.slug || vendor?.slug;
      if (!vendorSlug) {
        setSaveState("Vendor workspace not found");
        return false;
      }

      const payload = {
        workspace: { ...vendorWorkspaceDraft, ...(overrides.workspace || {}) },
        toggles: { ...vendorToggles, ...(overrides.toggles || {}) },
        security: {
          recoveryEmail: overrides.security?.recoveryEmail ?? securityDraft.recoveryEmail,
          loginAlerts: overrides.security?.loginAlerts ?? securityDraft.loginAlerts
        },
        quote: { ...quoteSettingsDraft, ...(overrides.quote || {}) },
        listingDefaults: createVendorPolicyDraft({ ...vendorPolicyDraft, ...(overrides.listingDefaults || overrides.policies || {}) }),
        policies: createVendorPolicyDraft({ ...vendorPolicyDraft, ...(overrides.listingDefaults || overrides.policies || {}) }),
        policyLibrary: createVendorPolicyLibrary(overrides.policyLibrary || vendorPolicyLibrary)
      };

      setSaveState("Saving...");
      try {
        const response = await api(`/api/settings/vendor/${vendorSlug}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        setVendorSettingsData(response.settings || payload);
        setSaveState(successMessage);
        return true;
      } catch (error) {
        setSaveState(error.message);
        return false;
      }
    };
    const saveQuoteSettings = async () => {
      setQuoteSettings(quoteSettingsDraft);
      await saveVendorWorkspaceSettings("Quote settings saved", {
        quote: quoteSettingsDraft
      });
    };
    const updateQuoteDraft = (field, value) => setVendorQuoteDraft((current) => ({ ...(current || {}), [field]: value }));
    const updateQuoteLineItem = (index, field, value) => {
      setVendorQuoteDraft((current) => {
        const lineItems = [...(current?.lineItems || [])];
        lineItems[index] = { ...lineItems[index], [field]: value };
        return { ...(current || {}), lineItems };
      });
    };
    const addQuoteLineItem = () => {
      setVendorQuoteDraft((current) => ({
        ...(current || {}),
        lineItems: [...(current?.lineItems || []), { description: "Additional service", amount: "0" }]
      }));
    };
    const removeQuoteLineItem = (index) => {
      setVendorQuoteDraft((current) => ({
        ...(current || {}),
        lineItems: (current?.lineItems || []).filter((_, itemIndex) => itemIndex !== index)
      }));
    };
    const openQuoteForLead = (lead = selectedVendorLead) => {
      if (!lead) return;
      const primaryPackage = vendorServices[0] || {};
      const amount = parseMoneyValue(lead.quoteAmount || lead.budget || primaryPackage.priceFrom || profileValue("priceFrom"));
      const quoteId = `${quoteSettingValue("quotePrefix") || "QUOTE-"}${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
      setVendorQuoteDraft({
        quoteId,
        leadId: lead.id || "",
        clientName: lead.name || "",
        clientEmail: lead.email || "",
        eventType: lead.eventType || "",
        eventDate: lead.eventDate || "",
        city: lead.city || "",
        guests: lead.guests || "",
        packageName: primaryPackage.name || "Custom event service",
        lineItems: [
          {
            description: primaryPackage.name || lead.eventType || "Custom event service",
            amount: amount ? String(amount) : String(profileValue("priceFrom") || "")
          }
        ],
        notes: lead.serviceDetails || "",
        message: `Hi ${lead.name || "there"}, please find your quote attached for review.`
      });
      setShowQuoteDocumentPreview(false);
      setShowVendorQuotePanel(true);
    };
    const sendVendorQuote = async () => {
      if (!vendorQuoteDraft) return;
      const quoteAmount = money(quoteSubtotal);
      setVendorLeadRows((current) =>
        current.map((lead) => {
          const sameLead =
            (vendorQuoteDraft.leadId && lead.id === vendorQuoteDraft.leadId) ||
            (!vendorQuoteDraft.leadId && lead.name === vendorQuoteDraft.clientName && lead.email === vendorQuoteDraft.clientEmail);
          return sameLead
            ? {
                ...lead,
                quoteAmount,
                status: "Quote sent",
                quoteId: vendorQuoteDraft.quoteId,
                quoteSentAt: new Date().toISOString()
              }
            : lead;
        })
      );
      setSelectedVendorLead((current) =>
        current
          ? {
              ...current,
              quoteAmount,
              status: "Quote sent",
              quoteId: vendorQuoteDraft.quoteId,
              quoteSentAt: new Date().toISOString()
            }
          : current
      );
      setShowVendorQuotePanel(false);
      const vendorSlug = vendorData?.vendor?.slug || vendor?.slug;
      if (vendorSlug && vendorQuoteDraft.leadId) {
        try {
          await api(`/api/dashboard/vendor/${vendorSlug}/leads/${vendorQuoteDraft.leadId}`, {
            method: "PATCH",
            body: JSON.stringify({
              quoteAmount,
              status: "Quote sent",
              quoteId: vendorQuoteDraft.quoteId,
              quoteSentAt: new Date().toISOString()
            })
          });
        } catch (error) {
          setSaveState(error.message);
          return;
        }
      }
      setSaveState(`Quote sent to ${vendorQuoteDraft.clientEmail || vendorQuoteDraft.clientName}`);
    };
    const toggleAvailabilityDate = (isoDate) => {
      if (!isoDate) return;
      setSelectedAvailabilityDate(isoDate);
      const nextDates = blockedAvailabilityDates.includes(isoDate)
        ? blockedAvailabilityDates.filter((date) => date !== isoDate)
        : [...blockedAvailabilityDates, isoDate].sort();
      updateProfileDraft("blackoutDates", nextDates.join("\n"));
    };
    const moveAvailabilityMonth = (direction) => {
      const current = parseMonthKey(availabilityMonth);
      setAvailabilityMonth(monthKey(new Date(current.getFullYear(), current.getMonth() + direction, 1)));
    };
    const renderProfileTagEditor = (label, field, placeholder) => {
      const tags = parseProfileTags(field);
      return (
        <div>
          <label className="text-[13px] font-semibold text-neutral-600 block mb-2">{label}</label>
          <div className="rounded-md border border-neutral-300 bg-white p-2">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex h-8 items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 text-[13px] font-medium text-neutral-700">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeProfileTag(field, tag)}
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-200 hover:text-neutral-950"
                    aria-label={`Remove ${tag}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                value={tagDrafts[field] || ""}
                onChange={(event) => setTagDrafts((current) => ({ ...current, [field]: event.target.value }))}
                onKeyDown={(event) => handleProfileTagKeyDown(event, field)}
                onBlur={() => addProfileTag(field)}
                placeholder={tags.length ? "Add another..." : placeholder}
                className="min-h-8 min-w-[180px] flex-1 border-0 bg-transparent px-2 text-[14px] outline-none"
              />
            </div>
          </div>
        </div>
      );
    };
    const VendorSelect = ({ id, value, options, onChange, className = "", optionLabels = {} }) => {
      const selectId = `vendor-select-${id}`;
      const isOpen = openVendorSelectId === selectId;
      const selectedValue = options.find((option) => String(option) === String(value)) ?? value ?? options[0] ?? "";
      const selectedLabel = optionLabels[selectedValue] ?? selectedValue;
      const searchable = options.length > 5;
      const searchValue = vendorSelectSearches[selectId] || "";
      const visibleOptions = searchable
        ? options.filter((option) => String(optionLabels[option] ?? option).toLowerCase().includes(searchValue.trim().toLowerCase()))
        : options;

      return (
        <div className={`relative ${className}`}>
          <button
            type="button"
            onClick={() => setOpenVendorSelectId((current) => {
              const next = current === selectId ? null : selectId;
              if (!next) setVendorSelectSearches((searches) => ({ ...searches, [selectId]: "" }));
              return next;
            })}
            className="flex h-11 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-4 text-left text-[14px] font-medium text-neutral-950 transition-colors hover:border-neutral-300 focus:border-neutral-400 focus:outline-none"
          >
            <span className="truncate">{selectedLabel}</span>
            <ChevronDown size={16} className={`shrink-0 text-neutral-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
          {isOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[120] overflow-hidden rounded-lg border border-neutral-200 bg-white p-1">
              {searchable && (
                <div className="border-b border-neutral-100 p-2">
                  <div className="flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3">
                    <Search size={14} className="text-neutral-400" />
                    <input
                      value={searchValue}
                      onChange={(event) => setVendorSelectSearches((searches) => ({ ...searches, [selectId]: event.target.value }))}
                      placeholder="Search..."
                      className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-neutral-800 outline-none placeholder:text-neutral-400"
                    />
                  </div>
                </div>
              )}
              <div className={searchable ? "max-h-56 overflow-y-auto p-1" : ""}>
              {visibleOptions.map((option) => {
                const active = String(option) === String(value);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setOpenVendorSelectId(null);
                      setVendorSelectSearches((searches) => ({ ...searches, [selectId]: "" }));
                    }}
                    className={`flex h-10 w-full items-center justify-between rounded-md px-3 text-left text-[14px] font-medium transition-colors ${
                      active ? "bg-neutral-100 text-neutral-950" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                    }`}
                  >
                    <span>{optionLabels[option] ?? option}</span>
                    {active && <CheckCircle size={14} />}
                  </button>
                );
              })}
              {visibleOptions.length === 0 && (
                <div className="px-3 py-4 text-center text-[13px] font-medium text-neutral-400">No results found</div>
              )}
              </div>
            </div>
          )}
        </div>
      );
    };
    async function saveProfileDraft() {
      const nextForm = { ...(profileDraft || {}) };
      setVendorForm(nextForm);
      setSaveState("Saving...");
      if (!vendorData?.vendor?.slug) {
        setSaveState("Vendor workspace not found");
        return;
      }
      try {
        const payload = await api(`/api/dashboard/vendor/${vendorData.vendor.slug}`, {
          method: "PUT",
          body: JSON.stringify({
            ...nextForm,
            servicePackages: vendorServices
          })
        });
        setVendorData((current) => ({ ...current, vendor: payload.vendor }));
        setVendorServices(buildDefaultServices(payload.vendor));
        setSaveState("Saved");
      } catch (error) {
        setSaveState(error.message);
      }
    }
    const filteredLeads = leads.filter((lead, index) => {
      if (leadFilter === "all") return true;
      if (leadFilter === "new") return index === 0;
      if (leadFilter === "quoted") return index === 1;
      return index > 1;
    });
    const vendorClientRows = useMemo(() => {
      const rows = [];
      const seen = new Set();
      leads.forEach((client, index) => {
        if (!client?.name) return;
        const key = `${client?.email || ""}-${client?.phone || ""}-${client?.name || ""}`.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        rows.push({
          ...client,
          id: client.id || `client-from-lead-${index}`,
          quoteAmount: client.quoteAmount || client.budget || "",
          savedAt: client.savedAt || "From lead inbox"
        });
      });
      return rows;
    }, [leads]);

    useEffect(() => {
      const syncSection = () => {
        setVendorASection(vendorSectionFromPath());
        setVendorSettingsSection(vendorSettingsSectionFromPath());
      };
      window.addEventListener("popstate", syncSection);
      return () => window.removeEventListener("popstate", syncSection);
    }, []);

    useEffect(() => {
      if (!saveState || saveState === "Saving...") return undefined;
      const timer = window.setTimeout(() => setSaveState(""), 2800);
      return () => window.clearTimeout(timer);
    }, [saveState]);

    function navigateVendorSection(section) {
      setSelectedVendorLead(null);
      setSelectedVendorSupportRequest(null);
      setSelectedVendorReviewDetail(null);
      setShowVendorLeadForm(false);
      setShowVendorListingForm(false);
      setShowVendorPackageForm(false);
      setShowVendorQuotePanel(false);
      setOpenVendorPackageMenuId(null);
      setOpenVendorPackageMenuPosition(null);
      if (section === "listing-settings") {
        setVendorSettingsSection("listing");
      }
      if (section === "settings") {
        setVendorSettingsSection("menu");
      }
      setVendorASection(section);
      const nextPath = section === "dashboard" ? portalPath("vendor") : portalPath("vendor", section);
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, "", nextPath);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function navigateVendorSettingsSection(section) {
      setVendorSettingsSection(section);
      setVendorASection("settings");
      const nextPath = portalPath("vendor", "settings");
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, "", nextPath);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function toggleVendorSetting(key) {
      setVendorToggles((current) => ({ ...current, [key]: !current[key] }));
    }

    function updateSecurityDraft(field, value) {
      setSecurityDraft((current) => ({ ...current, [field]: value }));
    }

    function previewVendorProfile() {
      if (vendor?.slug) {
        window.location.href = `/listing/${vendor.slug}`;
      }
    }

    const leadMomentumBars = hasVendorActivity
      ? [
          Math.max(0, leads.filter((lead) => (lead.status || "").toLowerCase().includes("new")).length),
          Math.max(0, leads.filter((lead) => (lead.status || "").toLowerCase().includes("quote")).length),
          Math.max(0, leads.filter((lead) => (lead.status || "").toLowerCase().includes("follow")).length),
          Math.max(0, leads.length),
          Math.max(0, Number(vendorMetrics.profileViewsToday || 0)),
          Math.max(0, Number(vendorMetrics.profileViewsWeek || 0)),
          Math.max(0, Number(vendorMetrics.profileViewsMonth || 0))
        ]
      : [0, 0, 0, 0, 0, 0, 0];
    const leadMomentumMax = Math.max(...leadMomentumBars, 1);

    return (
      <div className="vendor-dashboard-shell pt-16 min-h-screen bg-white text-[14px] lg:flex">
        <div className="z-10 hidden w-full flex-col border-b border-neutral-200 bg-white lg:fixed lg:bottom-0 lg:top-16 lg:flex lg:w-64 lg:border-b-0 lg:border-r">
          <nav className="max-h-[52vh] overflow-y-auto px-3 pb-3 pt-5 flex flex-col gap-1 lg:max-h-none lg:flex-1">
            {vendorDashboardMenu.map((item, index) => (
              <button
                key={index}
                onClick={() => navigateVendorSection(item.section)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  vendorASection === item.section ? "bg-neutral-100 text-neutral-950" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={16} /> {item.label}
                </div>
                {item.badge && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-950 px-1 text-[10px] font-semibold leading-none text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
            <div className="pt-5">
              <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Public Profile</div>
              {vendorPublicProfileMenu.map((item) => {
                const isActivePublicProfileItem = vendorASection === item.section;
                return (
                  <button
                    type="button"
                    key={item.section}
                    onClick={() => navigateVendorSection(item.section)}
                    className={`w-full px-3 py-2.5 rounded-md text-left text-sm font-medium transition-colors ${
                      isActivePublicProfileItem ? "bg-neutral-100 text-neutral-950" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="pt-5">
              <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Account</div>
              {vendorAccountMenu.map((item) => (
                <button
                  type="button"
                  key={item.section}
                  onClick={() => navigateVendorSection(item.section)}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 rounded-md text-left text-sm font-medium transition-colors ${
                    vendorASection === item.section ? "bg-neutral-100 text-neutral-950" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.section === "reviews" && vendorPendingReviewCount > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                      {vendorPendingReviewCount}
                    </span>
                  )}
                  {item.section === "support" && openVendorSupportCount > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                      {openVendorSupportCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-auto border-t border-neutral-200 pt-4">
              <button
                type="button"
                onClick={() => navigateVendorSettingsSection("general")}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium ${
                  vendorASection === "settings" && vendorSettingsSection !== "listing" ? "bg-neutral-100 text-neutral-950" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                }`}
              >
                <Settings size={16} /> Account Settings
              </button>
              <button
                onClick={() => {
                  clearSession();
                  setSession(null);
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </nav>
        </div>

        <div className="flex-1 px-4 pb-28 pt-3 sm:px-6 lg:ml-64 lg:px-10 lg:py-4">
          <div className="mx-auto max-w-[1500px]">
          <header className="mb-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                {showVendorMobileBackToSettings && (
                  <button
                    type="button"
                    onClick={() => navigateVendorSection("settings")}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950 lg:hidden"
                    aria-label="Back to settings menu"
                  >
                    <ArrowLeft size={17} />
                  </button>
                )}
                <h1 className="text-[18px] font-semibold tracking-tight text-neutral-950 sm:text-[22px]">{vendorASection === "dashboard" ? `Hello, ${vendorGreetingName}` : vendorASection === "settings" ? vendorSettingsTitle : sectionTitle}</h1>
              </div>
              <p className="mt-1.5 hidden max-w-2xl text-[14px] font-normal leading-6 text-neutral-500 sm:block">{vendorASection === "settings" ? vendorSettingsDescription : sectionDescription}</p>
            </div>
            {vendorASection === "listings" && (
              <button
                type="button"
                onClick={() => openVendorListingEditor()}
                className={compactPrimaryButtonClass}
              >
                New listing
              </button>
            )}
            {vendorASection === "availability" && (
              <button type="button" onClick={saveProfileDraft} className={compactPrimaryButtonClass}>
                Save availability
              </button>
            )}
            {vendorASection === "profile" && (
              <button type="button" onClick={saveProfileDraft} className={compactPrimaryButtonClass}>
                Save profile
              </button>
            )}
            {vendorASection === "leads" && (
              <button type="button" onClick={openVendorLeadForm} className={compactPrimaryButtonClass}>
                New lead
              </button>
            )}
            {vendorASection === "policies" && (
              <button type="button" onClick={() => openVendorPolicyEditor()} className={compactPrimaryButtonClass}>
                <Plus size={16} />
                New policy
              </button>
            )}
            {vendorASection === "listing-settings" && (
              <button
                type="button"
                onClick={() => saveVendorWorkspaceSettings("Listing settings saved")}
                className={`inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3.5 text-[14px] leading-none font-medium tracking-normal text-white transition-colors ${saveState === "Saving..." ? "cursor-wait bg-neutral-500" : "bg-black hover:bg-neutral-800"}`}
                disabled={saveState === "Saving..."}
              >
                <CheckCircle size={16} />
                {saveState === "Saving..." ? "Saving..." : "Save listing settings"}
              </button>
            )}
            {vendorASection === "settings" && vendorSettingsSection !== "menu" && (
              <button
                type="button"
                onClick={() => saveVendorWorkspaceSettings(`${vendorSettingsMenu.find((item) => item.key === vendorSettingsSection)?.label || "Vendor"} settings saved`)}
                className={`inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3.5 text-[14px] leading-none font-medium tracking-normal text-white transition-colors ${saveState === "Saving..." ? "cursor-wait bg-neutral-500" : "bg-black hover:bg-neutral-800"}`}
                disabled={saveState === "Saving..."}
              >
                <CheckCircle size={16} />
                {saveState === "Saving..." ? "Saving..." : "Save settings"}
              </button>
            )}
          </header>

          {vendorASection === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                {analyticsCards.map((stat) => (
                  <div key={stat.label} className={`${surfaceClass} p-4 sm:p-5`}>
                    <div className="text-[12px] font-semibold text-neutral-500 sm:text-[13px]">{stat.label}</div>
                    <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:items-end sm:justify-between">
                      <div className="text-[24px] font-semibold tracking-tight text-neutral-950 sm:text-[26px]">{stat.val}</div>
                      <div className="text-[12px] font-normal text-green-600 sm:text-[13px]">{stat.trend}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_360px]">
                <section className={`${surfaceClass} p-6`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[14px] font-semibold text-neutral-950">Lead momentum</h3>
                      <p className="mt-1 text-[14px] font-normal text-neutral-500">
                        {hasVendorActivity ? "Recent lead and visibility activity tied to this workspace." : "No live activity yet. This area will populate after approval and incoming traffic."}
                      </p>
                    </div>
                    <button type="button" onClick={() => navigateVendorSection("analytics")} className={compactTextActionClass}>
                      View analytics
                    </button>
                  </div>
                  <div className="mt-8 flex h-48 items-end gap-2 overflow-hidden">
                    {leadMomentumBars.map((value, index) => (
                      <div key={index} className="flex flex-1 flex-col items-center gap-2">
                        <div
                          className="w-full rounded-t-md bg-neutral-950"
                          style={{ height: `${Math.max(24, (value / leadMomentumMax) * 156)}px` }}
                        />
                        <span className="text-[11px] font-normal text-neutral-400">W{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className={`${surfaceClass} p-6`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[14px] font-semibold text-neutral-950">Profile health</h3>
                      <p className="mt-1 text-[14px] font-normal text-neutral-500">Completeness based on profile, services, contact details, and coverage.</p>
                    </div>
                    <span className="text-[14px] font-normal text-green-600">{profileHealthScore}%</span>
                  </div>
                  <div className="mt-6 h-2 rounded-full bg-neutral-100">
                    <div className="h-full rounded-full bg-black" style={{ width: `${profileHealthScore}%` }} />
                  </div>
                  <div className="mt-6 space-y-4 text-[14px]">
                    {[
                      ["Verified profile", true],
                      ["Portfolio uploaded", true],
                      ["Packages complete", vendorServices.length > 0],
                      ["Service areas set", vendorServiceAreaCount > 0]
                    ].map(([label, complete]) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-neutral-600">{label}</span>
                        <span className={complete ? "text-green-600" : "text-neutral-300"}>{complete ? "Done" : "Open"}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <section className={surfaceClass}>
                  <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
                    <div>
                      <h3 className="text-[14px] font-semibold text-neutral-950">Recent leads</h3>
                      <p className="mt-1 text-[14px] font-normal text-neutral-500">Newest requests that need attention.</p>
                    </div>
                    <button type="button" onClick={() => navigateVendorSection("leads")} className={compactTextActionClass}>
                      View all
                    </button>
                  </div>
                  <div className="divide-y divide-neutral-100">
                    {leads.length ? leads.slice(0, 3).map((lead, index) => (
                      <button
                        key={`${lead.name}-${index}`}
                        type="button"
                        onClick={() => navigateVendorSection("leads")}
                        className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 sm:grid-cols-[1fr_120px_100px] sm:px-6 sm:py-4"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-medium text-neutral-950">{lead.name}</span>
                          <span className="mt-1 block truncate text-[12px] font-normal text-neutral-500 sm:text-[14px]">{lead.eventType} • {lead.city}</span>
                        </span>
                        <span className="text-right text-[12px] font-medium text-neutral-950 sm:text-left sm:text-[14px] sm:font-normal sm:text-neutral-500">{lead.due}</span>
                        <span className="col-span-2 text-[13px] font-medium text-neutral-950 sm:col-span-1 sm:text-right sm:text-[14px]">{lead.budget}</span>
                      </button>
                    )) : (
                      <div className="px-6 py-8 text-[14px] text-neutral-500">No leads yet. New inquiries will appear here once your listing starts receiving requests.</div>
                    )}
                  </div>
                </section>

                <section className={`${surfaceClass} p-6`}>
                  <h3 className="text-[14px] font-semibold text-neutral-950">Next actions</h3>
                  <div className="mt-5 space-y-3">
                    {[
                      ["Review new leads", "leads"],
                      ["Update packages", "packages"],
                      ["Refresh gallery", "media"],
                      ["Update service areas", "service-areas"]
                    ].map(([label, section]) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => navigateVendorSection(section)}
                        className="flex h-10 w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3.5 text-left text-[14px] font-medium text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950"
                      >
                        {label}
                        <ChevronRight size={14} className="text-neutral-400" />
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {vendorASection === "leads" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                  <div className="flex min-w-max gap-2">
                    {[
                      ["all", "All leads"],
                      ["new", "New"],
                      ["quoted", "Quoted"],
                      ["follow-up", "Follow up"]
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setLeadFilter(value)}
                        className={
                          leadFilter === value
                            ? "inline-flex h-9 items-center justify-center rounded-full border border-neutral-950 bg-neutral-950 px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-neutral-800"
                            : "inline-flex h-9 items-center justify-center rounded-full border border-[#e6e8ef] bg-[#f7f9fc] px-3.5 text-[13px] font-medium text-neutral-600 transition-colors hover:border-[#d7dce7] hover:bg-white hover:text-neutral-950"
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-white border border-neutral-200">
                <div className="divide-y divide-neutral-100 md:hidden">
                  {filteredLeads.map((lead, index) => {
                    const status = lead.status || (index === 0 ? "New inquiry" : index === 1 ? "Quote sent" : "Follow up");
                    return (
                      <button
                        key={`${lead.name}-${index}`}
                        type="button"
                        onClick={() => openVendorLeadDetail(lead)}
                        className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-neutral-50"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-semibold text-neutral-950">{lead.name}</span>
                          <span className={`mt-2 inline-flex h-6 max-w-full items-center justify-center rounded-full border px-2.5 text-[11px] font-medium ${statusBadgeClass(status)}`}>
                            {status}
                          </span>
                        </span>
                        <span className="shrink-0 text-right text-[12px] font-semibold text-neutral-500">{lead.eventDate || lead.due || "Not set"}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="hidden overflow-x-auto overflow-y-visible md:block">
                <table className="min-w-[1100px] w-full text-left text-sm">
                  <thead className="bg-neutral-50">
                    <tr className="text-neutral-400 text-[10px] uppercase tracking-widest">
                      <th className="px-6 py-4 font-bold">Client</th>
                      <th className="px-6 py-4 font-bold">Guests</th>
                      <th className="px-6 py-4 font-bold">Quote / Amount</th>
                      <th className="px-6 py-4 font-bold">City</th>
                      <th className="px-6 py-4 font-bold">Date</th>
                      <th className="px-6 py-4 font-bold">Request</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead, index) => (
                      <tr key={`${lead.name}-${index}`} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="px-6 py-5">
                          <button
                            type="button"
                            onClick={() => openVendorLeadDetail(lead)}
                            className="block max-w-full text-left font-bold text-neutral-950 hover:underline"
                          >
                            {lead.name}
                          </button>
                          <div className="text-xs text-neutral-500 mt-1">{lead.eventType}</div>
                        </td>
                        <td className="px-6 py-5 font-bold">{lead.guests || "Not set"}</td>
                        <td className="px-6 py-5">
                          <div className="font-bold">{lead.quoteAmount || lead.budget || "Not set"}</div>
                          <div className="text-xs text-neutral-500 mt-1">Budget: {lead.budget || "Not set"}</div>
                        </td>
                        <td className="px-6 py-5 font-medium">{lead.city || "Not set"}</td>
                        <td className="px-6 py-5 font-medium">{lead.eventDate || lead.due || "Not set"}</td>
                        <td className="px-6 py-5">
                          <div className="max-w-[360px] truncate text-sm leading-5 text-neutral-700">{lead.serviceDetails || "No service details yet."}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex h-7 w-28 items-center justify-center rounded-full border px-3 text-xs font-medium ${statusBadgeClass(lead.status || (index === 0 ? "New inquiry" : index === 1 ? "Quote sent" : "Follow up"))}`}>
                            {lead.status || (index === 0 ? "New inquiry" : index === 1 ? "Quote sent" : "Follow up")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          )}

          {vendorASection === "analytics" && (
            <div className="space-y-6">
              <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <div className="flex min-w-max gap-2">
                  {analyticsPeriodOptions.map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAnalyticsPeriod(value)}
                      className={
                        analyticsPeriod === value
                          ? "inline-flex h-9 items-center justify-center rounded-full border border-neutral-950 bg-neutral-950 px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-neutral-800"
                          : "inline-flex h-9 items-center justify-center rounded-full border border-[#e6e8ef] bg-[#f7f9fc] px-3.5 text-[13px] font-medium text-neutral-600 transition-colors hover:border-[#d7dce7] hover:bg-white hover:text-neutral-950"
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
                {analyticsKpis.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <section
                      key={stat.label}
                      className={`rounded-lg border border-[#e6e8ef] bg-white p-4 sm:p-5 ${index === analyticsKpis.length - 1 ? "col-span-2 xl:col-span-1" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="inline-flex h-8 w-8 items-center justify-center text-neutral-950">
                          <Icon size={16} strokeWidth={1.65} />
                        </span>
                        <span className="text-xs font-medium text-emerald-700">{stat.change}</span>
                      </div>
                      <div className="mt-6 text-[26px] font-semibold tracking-tight text-neutral-950">{stat.value}</div>
                      <div className="mt-1 text-[12px] font-semibold text-neutral-500">{stat.label}</div>
                    </section>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                <section className="rounded-lg border border-[#e6e8ef] bg-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[14px] font-semibold text-neutral-950">Lead funnel</h3>
                      <p className="mt-1 text-[13px] text-neutral-500">How inquiries move through your vendor pipeline.</p>
                    </div>
                    <span className="text-[13px] font-medium text-neutral-500">{activeAnalytics.leads} leads</span>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                    {leadStageAnalytics.map(([label, value]) => (
                      <div key={label} className="rounded-lg border border-[#e8ecf3] bg-[#fbfcfe] p-4">
                        <span className={`inline-flex h-7 w-28 items-center justify-center rounded-full border px-3 text-[12px] font-medium ${statusBadgeClass(label)}`}>{label}</span>
                        <div className="mt-4 text-[26px] font-semibold tracking-tight text-neutral-950">{value}</div>
                        <div className="mt-1 text-[12px] font-normal text-neutral-500">Current records</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-lg border border-[#e6e8ef] bg-white p-6">
                  <h3 className="text-[14px] font-semibold text-neutral-950">Top cities</h3>
                  <div className="mt-6 space-y-4">
                    {activeAnalytics.cities.map(([city, value]) => (
                      <div key={city}>
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="font-medium text-neutral-700">{city}</span>
                          <span className="font-medium text-neutral-950">{value}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-[#f1f3f7]">
                          <div className="h-full rounded-full bg-neutral-950" style={{ width: `${value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <section className="rounded-lg border border-[#e6e8ef] bg-white p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="text-[14px] font-semibold text-neutral-950">{activeAnalytics.chartTitle}</h3>
                    <p className="mt-1 text-[13px] text-neutral-500">{activeAnalytics.chartSubtitle}</p>
                  </div>
                  <span className="inline-flex h-8 items-center gap-2 self-start text-[13px] font-medium text-emerald-700">
                    <ArrowUpRight size={15} strokeWidth={1.8} /> Growing
                  </span>
                </div>
                <div className="mt-8 flex h-64 w-full items-end justify-center gap-4 overflow-x-auto pb-2">
                  {activeAnalytics.chart.map(([label, value]) => (
                    <div key={label} className="flex min-w-[64px] flex-1 flex-col items-center gap-3">
                      <div className="text-[12px] font-medium text-neutral-500">{value}</div>
                      <div
                        className="w-full rounded-t-md bg-neutral-950 transition-colors hover:bg-neutral-700"
                        style={{ height: `${Math.max(28, (value / maxAnalyticsBar) * 154)}px` }}
                        aria-label={`${label}: ${value} views`}
                      />
                      <div className="text-[12px] font-medium text-neutral-400">{label}</div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <section className="rounded-lg border border-[#e6e8ef] bg-white p-6">
                  <h3 className="text-[14px] font-semibold text-neutral-950">Top engagement sources</h3>
                  <div className="mt-6 space-y-5">
                    {activeAnalytics.sources.map(([label, value]) => (
                      <div key={label}>
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="font-medium text-neutral-700">{label}</span>
                          <span className="font-medium text-neutral-950">{value}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-[#f1f3f7]">
                          <div className="h-full rounded-full bg-neutral-950" style={{ width: `${value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-lg border border-[#e6e8ef] bg-white p-6">
                  <h3 className="text-[14px] font-semibold text-neutral-950">Profile actions</h3>
                  <div className="mt-5 divide-y divide-neutral-100">
                    {activeAnalytics.actions.map(([label, value, Icon]) => (
                      <div key={label} className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                          <span className="inline-flex h-8 w-8 items-center justify-center text-neutral-950">
                            <Icon size={16} strokeWidth={1.65} />
                          </span>
                          <span className="text-[13px] font-medium text-neutral-700">{label}</span>
                        </div>
                        <span className="text-[14px] font-medium text-neutral-950">{value}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <section className="overflow-hidden rounded-lg border border-[#e6e8ef] bg-white">
                <div className="border-b border-neutral-200 px-6 py-5">
                  <h3 className="text-[14px] font-semibold text-neutral-950">Listing performance</h3>
                  <p className="mt-1 text-[13px] text-neutral-500">Views, lead volume, average quote value, and conversion by offer.</p>
                </div>
                <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full text-left text-[13px]">
                  <thead className="bg-neutral-50">
                    <tr className="text-[10px] uppercase tracking-widest text-neutral-400">
                      <th className="px-6 py-4 font-bold">Listing / package</th>
                      <th className="px-6 py-4 font-bold">Views</th>
                      <th className="px-6 py-4 font-bold">Leads</th>
                      <th className="px-6 py-4 font-bold">Avg quote</th>
                      <th className="px-6 py-4 font-bold">Conversion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listingPerformanceRows.map((row) => (
                      <tr key={row[0]} className="border-b border-neutral-100 hover:bg-neutral-50">
                        {row.map((cell, index) => (
                          <td key={cell} className={`px-6 py-5 ${index === 0 ? "font-semibold text-neutral-950" : "font-medium text-neutral-700"}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </section>
            </div>
          )}

          {vendorASection === "listings" && <VendorListingsTable compact />}

          {vendorASection === "clients" && (
            <div className="space-y-6">
              {vendorClientRows.length ? (
                <div className="overflow-hidden rounded-lg bg-white border border-neutral-200">
                  <div className="divide-y divide-neutral-100 md:hidden">
                    {vendorClientRows.map((client) => (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => openVendorLeadDetail(client)}
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-neutral-50"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-semibold text-neutral-950">{client.name}</span>
                          <span className="mt-1 block truncate text-[12px] font-medium text-neutral-500">{client.eventType || "Event not set"}</span>
                        </span>
                        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusBadgeClass(client.status || "New inquiry")}`}>
                          {client.status || "New inquiry"}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-[1180px] w-full text-left text-sm">
                    <thead className="bg-neutral-50">
                      <tr className="text-neutral-400 text-[10px] uppercase tracking-widest">
                        <th className="px-6 py-4 font-bold">Client</th>
                        <th className="px-6 py-4 font-bold">Phone</th>
                        <th className="px-6 py-4 font-bold">Email</th>
                        <th className="px-6 py-4 font-bold">Event</th>
                        <th className="px-6 py-4 font-bold">Guests</th>
                        <th className="px-6 py-4 font-bold">Quote / Amount</th>
                        <th className="px-6 py-4 font-bold">City</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorClientRows.map((client) => (
                        <tr key={client.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                          <td className="px-6 py-5">
                            <button
                              type="button"
                              onClick={() => openVendorLeadDetail(client)}
                              className="block max-w-full text-left font-bold text-neutral-950 hover:underline"
                            >
                              {client.name}
                            </button>
                          </td>
                          <td className="px-6 py-5 font-medium">{client.phone || "Not provided"}</td>
                          <td className="px-6 py-5">
                            <a href={client.email ? `mailto:${client.email}` : undefined} className="font-medium text-neutral-800 hover:text-black">
                              {client.email || "Not provided"}
                            </a>
                          </td>
                          <td className="px-6 py-5">{client.eventType || "Not set"}</td>
                          <td className="px-6 py-5 font-bold">{client.guests || "Not set"}</td>
                          <td className="px-6 py-5 font-bold">{client.quoteAmount || "Not set"}</td>
                          <td className="px-6 py-5">{client.city || "Not set"}</td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex h-7 w-28 items-center justify-center rounded-full border px-3 text-xs font-medium ${statusBadgeClass(client.status || "New inquiry")}`}>
                              {client.status || "New inquiry"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-white border border-neutral-200 p-10 text-center">
                  <h3 className="text-lg font-semibold text-neutral-950">No clients yet</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">New clients will appear here automatically as leads are added.</p>
                  <button type="button" onClick={() => navigateVendorSection("leads")} className={`${compactPrimaryButtonClass} mt-5`}>
                    Go to leads
                  </button>
                </div>
              )}
            </div>
          )}

          {vendorASection === "profile" && (
            <div className="space-y-6">
              <section className="rounded-lg bg-white border border-neutral-200 p-6">
                <div className="flex flex-col gap-5 border-b border-neutral-100 pb-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 text-xl font-semibold text-neutral-500 sm:h-20 sm:w-20 sm:text-2xl">
                      {profileValue("avatarImage") || vendor?.image ? (
                        <SafeImage src={profileValue("avatarImage") || vendor?.image} className="h-full w-full object-cover" alt="Profile avatar" fallback={profileValue("avatarImage") || vendor?.image} />
                      ) : (
                        (vendor?.businessName || vendorForm?.businessName || "V").slice(0, 1).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Profile avatar</h3>
                    <p className="mt-1 hidden text-[13px] text-neutral-500 sm:block">Shown on your marketplace profile, lead replies, and vendor cards.</p>
                      {profileValue("avatarImageName") && <p className="mt-1 text-[12px] text-neutral-400">{profileValue("avatarImageName")}</p>}
                    </div>
                  </div>
                  <label className={compactSecondaryButtonClass}>
                    Upload avatar
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        setProfileDraft((current) => ({ ...(current || {}), avatarImage: URL.createObjectURL(file), avatarImageName: file.name }));
                      }}
                    />
                  </label>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {[
                    ["Business name", "businessName", "Golden Beats DJ Services"],
                    ["Owner / primary contact", "ownerName", "Avery Johnson"],
                    ["Category", "category", "DJ / Entertainment"],
                    ["Years in business", "yearsInBusiness", "8"],
                    ["City", "city", "Toronto"],
                    ["Province", "province", "Ontario"],
                    ["Starting price", "priceFrom", "800"],
                    ["Team size", "teamSize", "4"]
                  ].map(([label, field, placeholder]) => (
                    <div key={field}>
                      <label className="text-[13px] font-semibold text-neutral-600 block mb-2">{label}</label>
                      <input
                        value={profileValue(field)}
                        onChange={(event) => updateProfileDraft(field, event.target.value)}
                        placeholder={placeholder}
                        className={fieldClass}
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg bg-white border border-neutral-200 p-6">
                <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Contact details</h3>
                <p className="mt-1 text-[13px] text-neutral-500">Used for profile contact buttons, lead notifications, and inquiry confirmations.</p>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {[
                    ["Email", "email", "hello@vendor.com"],
                    ["Phone", "phone", "+1 416 555 0199"],
                    ["WhatsApp number", "whatsapp", "+1 416 555 0199"],
                    ["Website URL", "website", "https://yourbusiness.com"]
                  ].map(([label, field, placeholder]) => (
                    <div key={field}>
                      <label className="text-[13px] font-semibold text-neutral-600 block mb-2">{label}</label>
                      <input
                        value={profileValue(field)}
                        onChange={(event) => updateProfileDraft(field, event.target.value)}
                        placeholder={placeholder}
                        className={fieldClass}
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg bg-white border border-neutral-200 p-6">
                <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Social profiles</h3>
                <p className="mt-1 text-[13px] text-neutral-500">These power the social links and trust signals on the public listing.</p>
                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  {[
                    ["Instagram", "instagram", "@goldenbeats"],
                    ["TikTok", "tiktok", "@goldenbeats"],
                    ["Facebook", "facebook", "facebook.com/goldenbeats"]
                  ].map(([label, field, placeholder]) => (
                    <div key={field}>
                      <label className="text-[13px] font-semibold text-neutral-600 block mb-2">{label}</label>
                      <input
                        value={profileValue(field)}
                        onChange={(event) => updateProfileDraft(field, event.target.value)}
                        placeholder={placeholder}
                        className={fieldClass}
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg bg-white border border-neutral-200 p-6">
                <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Profile content</h3>
                <p className="mt-1 text-[13px] text-neutral-500">Add the details shoppers use to compare vendors before they send an inquiry.</p>
                <div className="mt-5 grid gap-5">
                  <div>
                    <label className="text-[13px] font-semibold text-neutral-600 block mb-2">Short description</label>
                    <textarea value={profileValue("description")} onChange={(event) => updateProfileDraft("description", event.target.value)} className={`${fieldClass} min-h-24`} />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-neutral-600 block mb-2">Full profile bio</label>
                    <textarea value={profileValue("longDescription")} onChange={(event) => updateProfileDraft("longDescription", event.target.value)} className={`${fieldClass} min-h-32`} />
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    {renderProfileTagEditor("Cultural specialties", "culturalSpecialties", "Type a specialty and press Enter")}
                    {renderProfileTagEditor("Languages", "languages", "Type a language and press Enter")}
                    <div>
                      <label className="text-[13px] font-semibold text-neutral-600 block mb-2">Service style</label>
                      <input value={profileValue("serviceStyle")} onChange={(event) => updateProfileDraft("serviceStyle", event.target.value)} placeholder="Premium, high-energy, multicultural" className={fieldClass} />
                    </div>
                    {renderProfileTagEditor("Search tags", "tags", "Type a tag and press Enter")}
                  </div>
                </div>
              </section>

              <div className="flex justify-end">
                <button type="button" onClick={saveProfileDraft} className={compactPrimaryButtonClass}>
                  Save profile
                </button>
              </div>
            </div>
          )}

          {vendorASection === "availability" && (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <section className="rounded-lg bg-white border border-neutral-200 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Availability settings</h3>
                    <p className="mt-1 text-[13px] text-neutral-500">Control what clients see before they send an inquiry.</p>
                  </div>
                  <span className="inline-flex h-7 w-28 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-[12px] font-medium text-emerald-700">
                    Available
                  </span>
                </div>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-[13px] font-semibold text-neutral-600 block mb-2">Booking window</label>
                    <VendorSelect
                      id="availability-window"
                      value={profileValue("availabilityWindow") || "Accepting bookings 6 months ahead"}
                      options={["Accepting bookings 3 months ahead", "Accepting bookings 6 months ahead", "Accepting bookings 12 months ahead", "Accepting bookings 18 months ahead"]}
                      onChange={(value) => updateProfileDraft("availabilityWindow", value)}
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-neutral-600 block mb-2">Minimum notice</label>
                    <VendorSelect
                      id="minimum-notice"
                      value={profileValue("minimumNotice") || "7 days"}
                      options={["24 hours", "3 days", "7 days", "14 days", "30 days"]}
                      onChange={(value) => updateProfileDraft("minimumNotice", value)}
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-neutral-600 block mb-2">Consultation hours</label>
                    <VendorSelect
                      id="consultation-hours"
                      value={profileValue("consultationHours") || "Flexible by appointment"}
                      options={["Weekdays, 9:00 AM-5:00 PM", "Weekdays, 10:00 AM-6:00 PM", "Evenings only", "Weekends only", "Flexible by appointment"]}
                      onChange={(value) => updateProfileDraft("consultationHours", value)}
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-neutral-600 block mb-2">Booking cutoff</label>
                    <VendorSelect
                      id="booking-cutoff"
                      value={profileValue("bookingCutoff") || "7 days before event"}
                      options={["24 hours before event", "48 hours before event", "7 days before event", "14 days before event", "30 days before event"]}
                      onChange={(value) => updateProfileDraft("bookingCutoff", value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[13px] font-semibold text-neutral-600 block mb-2">Available weekdays</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                        const selected = parseProfileTags("availableWeekdays").some((item) => item.toLowerCase() === day.toLowerCase());
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleProfileTag("availableWeekdays", day)}
                            className={`h-10 rounded-full border px-3 text-[13px] font-semibold transition-colors ${
                              selected
                                ? "border-transparent bg-emerald-50 text-emerald-700"
                                : "border-transparent bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                            }`}
                          >
                            {day.slice(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-[13px] text-neutral-500">Selected days are shown as available on the public profile unless a specific date is blocked.</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[13px] font-semibold text-neutral-600 block mb-2">Unavailable / blackout dates</label>
                    <textarea
                      value={profileValue("blackoutDates")}
                      onChange={(event) => updateProfileDraft("blackoutDates", event.target.value)}
                      placeholder="May 30, 2026 - booked wedding&#10;June 12, 2026 - unavailable"
                      className={`${fieldClass} min-h-32`}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-lg bg-white border border-neutral-200 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Availability calendar</h3>
                    <p className="mt-1 text-[13px] text-neutral-500">Click a date to block or unblock it on your public profile.</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveAvailabilityMonth(-1)} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50">
                      <ChevronLeft size={15} />
                    </button>
                    <button type="button" onClick={() => moveAvailabilityMonth(1)} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50">
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div className="text-[14px] font-semibold text-neutral-950">{formatMonthLabel(availabilityMonthDate)}</div>
                  <div className="text-[13px] font-medium text-neutral-500">{blockedAvailabilityDates.length} blocked</div>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-2 text-center">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-[11px] font-semibold text-neutral-400">{day}</div>
                  ))}
                  {availabilityDays.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`} className="h-10" />;
                    const isBlocked = blockedAvailabilityDates.includes(day.iso);
                    const isSelected = selectedAvailabilityDate === day.iso;
                    return (
                      <button
                        key={day.iso}
                        type="button"
                        disabled={day.disabled}
                        onClick={() => toggleAvailabilityDate(day.iso)}
                        className={`h-10 rounded-full border text-[13px] font-semibold transition-colors ${
                          day.disabled
                            ? "cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-300"
                            : isBlocked
                              ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                              : isSelected
                                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                : "border-neutral-200 bg-white text-neutral-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                      >
                        {day.day}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-[13px] font-semibold text-neutral-950">{selectedAvailabilityLabel}</div>
                  <p className="mt-1 text-[13px] text-neutral-500">
                    {selectedAvailabilityDate
                      ? blockedAvailabilityDates.includes(selectedAvailabilityDate)
                        ? "This date is blocked. Click it again to make it available."
                        : "This date is available. Click it to block bookings."
                      : "Select a date to edit its availability."}
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-3 text-[13px]">
                  <span className="inline-flex items-center gap-2 text-neutral-600"><span className="h-2.5 w-2.5 rounded-full bg-white ring-1 ring-neutral-300" /> Available</span>
                  <span className="inline-flex items-center gap-2 text-neutral-600"><span className="h-2.5 w-2.5 rounded-full bg-red-100 ring-1 ring-red-200" /> Blocked</span>
                </div>
              </section>

            </div>
          )}

          {vendorASection === "media" && (
            <div className="rounded-lg bg-white border border-neutral-200 p-6">
              <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Media gallery</h3>
                  <p className="mt-1 text-[13px] text-neutral-500">Manage the images used across your public profile and listing cards.</p>
                </div>
                <label className={compactPrimaryButtonClass}>
                  Upload media
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                      addVendorMedia(event.target.files);
                      event.target.value = "";
                    }}
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
                {vendorMediaItems.map((item, index) => (
                  <div key={item.id} className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
                    <div className="relative aspect-square bg-neutral-100">
                      <SafeImage src={item.src} className="w-full h-full object-cover" alt={`Gallery image ${index + 1}`} fallback={IMG_EDITORIAL} />
                      {item.featured && (
                        <span className="absolute left-3 top-3 inline-flex h-7 items-center rounded-full border border-blue-200 bg-blue-50 px-3 text-[11px] font-medium text-blue-700">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="px-3 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-medium text-neutral-700">{item.featured ? "Featured image" : `Gallery image ${index + 1}`}</span>
                        <div className="hidden items-center gap-1 md:flex">
                          <button type="button" onClick={() => moveVendorMedia(item.id, -1)} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100" aria-label="Move image left">
                            <ChevronLeft size={14} />
                          </button>
                          <button type="button" onClick={() => moveVendorMedia(item.id, 1)} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100" aria-label="Move image right">
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFeaturedVendorMedia(item.id)}
                          className={
                            item.featured
                              ? "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-black px-3.5 text-[12px] leading-none font-medium tracking-normal text-white transition-colors hover:bg-neutral-800 sm:text-[14px]"
                              : "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-neutral-200 bg-white px-3 text-[12px] leading-none font-medium tracking-normal text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-black sm:text-[14px]"
                          }
                        >
                          {item.featured ? "Featured" : "Set"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeVendorMedia(item.id)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 transition-colors hover:bg-red-50"
                          aria-label="Delete image"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 hover:border-neutral-400 hover:bg-white">
                  <Plus size={22} className="mb-2 text-neutral-400" />
                  <span className="text-[13px] font-semibold text-neutral-500">Add image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                      addVendorMedia(event.target.files);
                      event.target.value = "";
                    }}
                  />
                </label>
              </div>
              <div className="mt-6 flex justify-end">
                <button type="button" onClick={saveVendorMediaDraft} className={compactPrimaryButtonClass}>
                  Save media
                </button>
              </div>
            </div>
          )}

          {vendorASection === "service-areas" && (
            <div className="space-y-6">
              <section className="rounded-lg bg-white border border-neutral-200 p-6">
                <div className="flex flex-col justify-between gap-4 border-b border-neutral-100 pb-5 md:flex-row md:items-start">
                  <div>
                    <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Service coverage</h3>
                    <p className="mt-1 text-[13px] text-neutral-500">Choose where your business appears and how far you travel.</p>
                  </div>
                  <button type="button" onClick={saveProfileDraft} className={compactPrimaryButtonClass}>Save service areas</button>
                </div>
                <div className="mt-6 grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="text-[13px] font-semibold text-neutral-600 block mb-2">Primary city</label>
                    <VendorSelect
                      id="service-primary-city"
                      value={profileValue("city")}
                      options={CANADIAN_CITY_OPTIONS}
                      onChange={(value) => updateProfileDraft("city", value)}
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-neutral-600 block mb-2">Travel radius</label>
                    <VendorSelect
                      id="service-travel-radius"
                      value={profileValue("travelRadius")}
                      options={["25 km", "50 km", "75 km", "100 km", "150 km", "Province-wide"]}
                      onChange={(value) => updateProfileDraft("travelRadius", value)}
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-neutral-600 block mb-2">Remote planning</label>
                    <VendorSelect
                      id="service-remote-planning"
                      value={profileValue("remotePlanning")}
                      options={["Available", "Unavailable"]}
                      onChange={(value) => updateProfileDraft("remotePlanning", value)}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-lg bg-white border border-neutral-200 p-6">
                <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">My locations</h3>
                <p className="mt-1 text-[13px] text-neutral-500">Click cities below to add or remove them from your public service area.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {parseServiceAreas().map((city) => (
                    <span key={city} className="inline-flex h-9 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-[13px] font-semibold text-emerald-700">
                      {displayCityName(city)}
                      <button type="button" onClick={() => removeProfileTag("serviceAreas", city)} className="inline-flex h-4 w-4 items-center justify-center rounded-full text-emerald-600 hover:bg-emerald-100" aria-label={`Remove ${city}`}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-6">
                  <label className="text-[13px] font-semibold text-neutral-600 block mb-3">Add coverage cities</label>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {CANADIAN_CITY_OPTIONS.slice(0, 20).map((city) => {
                      const selected = parseServiceAreas().some((item) => item.toLowerCase() === city.toLowerCase());
                      return (
                        <button
                          key={city}
                          type="button"
                          onClick={() => toggleProfileTag("serviceAreas", city)}
                          className={`h-10 rounded-full border px-3 text-[13px] font-semibold transition-colors ${
                            selected ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                          }`}
                        >
                          {city}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
              <div className="flex justify-end">
                <button type="button" onClick={saveProfileDraft} className={compactPrimaryButtonClass}>Save service areas</button>
              </div>
            </div>
          )}

          {vendorASection === "packages" && (
            <div className="space-y-6">
              <section className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {[
                  ["Base price", money(profileValue("priceFrom") || vendor?.priceFrom)],
                  ["Packages", vendorServices.length],
                  ["Quote mode", "Package + custom quote"]
                ].map(([label, value], index) => (
                  <div key={label} className={`rounded-lg border border-neutral-200 bg-white p-5 ${index === 2 ? "col-span-2 md:col-span-1" : ""}`}>
                    <div className="text-[13px] font-medium text-neutral-500">{label}</div>
                    <div className="mt-2 text-[16px] font-semibold text-neutral-950">{value}</div>
                  </div>
                ))}
              </section>
              <section className="rounded-lg bg-white border border-neutral-200">
                <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 px-6 py-5 md:flex-row md:items-start">
                  <div>
                    <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Packages & pricing</h3>
                    <p className="mt-1 text-[13px] text-neutral-500">A listing is the public storefront. Packages are the specific bookable services inside it, such as Wedding DJ, Corporate gala, or Birthday package.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => openVendorPackageEditor()} className={compactSecondaryButtonClass}>Add package</button>
                  </div>
                </div>
                <div className="divide-y divide-neutral-100 md:hidden">
                  {vendorServices.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => openVendorPackageEditor(service)}
                      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-neutral-50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-semibold text-neutral-950">{service.name || "Untitled package"}</span>
                        <span className={`mt-2 inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-medium ${packageStatusClass(service.status || "Active")}`}>
                          {service.status || "Active"}
                        </span>
                      </span>
                      <span className="shrink-0 text-[14px] font-semibold text-neutral-950">{money(service.priceFrom || 0)}</span>
                    </button>
                  ))}
                </div>
                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-[1000px] w-full text-left text-[13px]">
                    <thead className="bg-neutral-50">
                      <tr className="text-[11px] uppercase tracking-widest text-neutral-400">
                        <th className="px-6 py-4 font-medium">Package</th>
                        <th className="px-6 py-4 font-medium">Service area</th>
                        <th className="px-6 py-4 font-medium">Price from</th>
                        <th className="px-6 py-4 font-medium">Turnaround</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {vendorServices.map((service) => (
                        <tr key={service.id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() => openVendorPackageEditor(service)}
                              className="block max-w-full text-left text-sm font-semibold text-neutral-950 hover:underline"
                            >
                              {service.name || "Untitled package"}
                            </button>
                            <div className="mt-1 line-clamp-1 text-xs text-neutral-500">{service.description || "Package summary coming soon."}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-700">{displayCityName(service.area || profileValue("city") || "All areas")}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-neutral-950">{money(service.priceFrom || 0)}</td>
                          <td className="px-6 py-4 text-sm text-neutral-700">{service.turnaround || "Custom quote"}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex h-7 w-24 items-center justify-center rounded-full border px-3 text-[11px] font-medium ${packageStatusClass(service.status || "Active")}`}>
                              {service.status || "Active"}
                            </span>
                          </td>
                          <td className="relative px-6 py-4 text-right">
                            <div className="inline-flex justify-end">
                              <button
                                type="button"
                                onClick={(event) => {
                                  const rect = event.currentTarget.getBoundingClientRect();
                                  setOpenVendorPackageMenuId((current) => {
                                    const isClosing = current === service.id;
                                    setOpenVendorPackageMenuPosition(
                                      isClosing
                                        ? null
                                        : {
                                            left: Math.max(16, rect.right - 144),
                                            top: Math.max(16, rect.top - 104)
                                          }
                                    );
                                    return isClosing ? null : service.id;
                                  });
                                }}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-950"
                                aria-label={`Open actions for ${service.name || "package"}`}
                              >
                                <MoreVertical size={17} />
                              </button>
                              {openVendorPackageMenuId === service.id && openVendorPackageMenuPosition && (
                                <div
                                  className="fixed z-[999] w-36 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 text-left shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
                                  style={{ left: openVendorPackageMenuPosition.left, top: openVendorPackageMenuPosition.top }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => openVendorPackageEditor(service)}
                                    className="block w-full px-4 py-2.5 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      removeVendorService(service.id);
                                      setOpenVendorPackageMenuId(null);
                                      setOpenVendorPackageMenuPosition(null);
                                      setSaveState("Package removed");
                                    }}
                                    className="block w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
              <div className="flex justify-end">
                <button type="button" onClick={saveProfileDraft} className={compactPrimaryButtonClass}>Save packages</button>
              </div>
            </div>
          )}

          {vendorASection === "notifications" && (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <section className="rounded-lg border border-neutral-200 bg-white p-6">
                <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Notification channels</h3>
                <p className="mt-1 text-[13px] text-neutral-500">Choose how new leads, quote reminders, and account updates reach your team.</p>
                <div className="mt-6 space-y-4">
                  {[
                    ["acceptingLeads", "New lead alerts", "Notify me immediately when a new client inquiry arrives."],
                    ["smsNotifications", "SMS alerts", "Send urgent lead updates to the business phone number."],
                    ["emailDigest", "Daily email digest", "Bundle non-urgent activity into one daily summary."],
                    ["whatsappAlerts", "WhatsApp alerts", "Send quick lead notifications to the WhatsApp number."]
                  ].map(([key, title, body]) => (
                    <div key={key} className="flex items-center justify-between rounded-lg border border-neutral-200 p-4">
                      <div>
                        <div className="text-[14px] font-semibold text-neutral-950">{title}</div>
                        <div className="mt-1 text-[13px] text-neutral-500">{body}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleVendorSetting(key)}
                        aria-label={`Toggle ${title}`}
                        aria-pressed={Boolean(vendorToggles[key])}
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
                          vendorToggles[key] ? "border-neutral-900 bg-neutral-900" : "border-neutral-300 bg-neutral-100"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 rounded-full bg-white ring-1 transition-transform ${
                            vendorToggles[key] ? "translate-x-5 ring-neutral-900" : "translate-x-0.5 ring-neutral-300"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
              <section className="rounded-lg border border-neutral-200 bg-white p-6">
                <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Reminder timing</h3>
                <div className="mt-5 space-y-5">
                  <div>
                    <label className="text-[13px] font-semibold text-neutral-600 block mb-2">Digest frequency</label>
                    <VendorSelect
                      id="notification-digest-frequency"
                      value={vendorWorkspaceDraft.digestFrequency || "Daily at 8:00 AM"}
                      options={["Instant only", "Daily at 8:00 AM", "Daily at 5:00 PM", "Weekly summary"]}
                      onChange={(value) => setVendorWorkspaceDraft((current) => ({ ...current, digestFrequency: value }))}
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-neutral-600 block mb-2">Unanswered lead reminder</label>
                    <VendorSelect
                      id="notification-lead-reminder"
                      value={vendorWorkspaceDraft.unansweredLeadReminder || "After 24 hours"}
                      options={["After 4 hours", "After 12 hours", "After 24 hours", "After 48 hours"]}
                      onChange={(value) => setVendorWorkspaceDraft((current) => ({ ...current, unansweredLeadReminder: value }))}
                    />
                  </div>
                  <button type="button" onClick={() => setSaveState("Notification settings saved")} className={compactPrimaryButtonClass}>Save notifications</button>
                </div>
              </section>
            </div>
          )}

          {vendorASection === "policies" && (
            <div className="space-y-6">
              <section className="rounded-lg border border-neutral-200 bg-white">
                <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-6 py-5">
                  <div>
                    <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Policy library</h3>
                  </div>
                </div>
                <div className="divide-y divide-neutral-100">
                  {vendorPolicyLibrary.map((policy) => (
                    <div key={policy.id} className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-600">{policy.category}</span>
                          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">{policy.scope}</span>
                        </div>
                        <div className="mt-3 text-[15px] font-semibold text-neutral-950">{policy.title}</div>
                        <p className="mt-2 max-w-3xl text-[14px] leading-6 text-neutral-500">{policy.body}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openVendorPolicyEditor(policy)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-50"
                          aria-label="Edit policy"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteVendorPolicyItem(policy.id)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 transition-colors hover:bg-red-50"
                          aria-label="Delete policy"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {vendorASection === "support" && (
            <div className="space-y-6">
              <section className="rounded-lg border border-neutral-200 bg-white">
                <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-6 py-5">
                  <div>
                    <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">My support requests</h3>
                  </div>
                  <button type="button" onClick={() => setShowVendorSupportModal(true)} className={compactPrimaryButtonClass}>
                    New request
                  </button>
                </div>
                <div className="divide-y divide-neutral-100 md:hidden">
                  {vendorSupportRequests.map((request) => {
                    const requestStatusMeta = findStatusMeta(adminRequestStatuses, request.status, request.status);
                    return (
                      <button
                        key={request.id}
                        type="button"
                        onClick={() => setSelectedVendorSupportRequest(request)}
                        className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-neutral-50"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-semibold text-neutral-950">{request.subject}</span>
                          <span className={`mt-2 inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-medium ${statusToneChipClass(requestStatusMeta?.tone)}`}>
                            {requestStatusMeta?.label || request.status}
                          </span>
                        </span>
                        <span className="shrink-0 text-right text-[12px] font-semibold text-neutral-500">{request.age || "Updated"}</span>
                      </button>
                    );
                  })}
                  {vendorSupportRequests.length === 0 && (
                    <div className="px-4 py-10 text-center">
                      <div className="text-sm font-medium text-neutral-950">No support requests yet</div>
                      <div className="mt-2 text-sm leading-6 text-neutral-500">Send your first request and it will appear here.</div>
                    </div>
                  )}
                </div>
                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-[760px] w-full text-left text-[13px]">
                    <thead className="bg-neutral-50 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      <tr>
                        <th className="px-6 py-4">Subject</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Priority</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {vendorSupportRequests.map((request) => {
                        const requestStatusMeta = findStatusMeta(adminRequestStatuses, request.status, request.status);
                        const latestAdminReply = request.adminReply || [...(Array.isArray(request.activity) ? request.activity : [])].reverse().find((item) => item.label === "Admin replied")?.body || "";
                        return (
                        <tr key={request.id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-neutral-950">{request.subject}</div>
                            <div className="mt-1 text-[12px] text-neutral-500 line-clamp-1">{request.message}</div>
                            {latestAdminReply && (
                              <div className="mt-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-[12px] leading-5 text-blue-800">
                                <span className="font-semibold">Admin response:</span> {latestAdminReply}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-neutral-700">{request.type}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex h-7 w-24 items-center justify-center rounded-full border px-3 text-[11px] font-medium ${
                              request.priority === "High"
                                ? "border-red-200 bg-red-50 text-red-700"
                                : request.priority === "Medium"
                                  ? "border-amber-200 bg-amber-50 text-amber-700"
                                  : "border-blue-200 bg-blue-50 text-blue-700"
                            }`}>
                      {request.priority}
                    </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex h-7 w-24 items-center justify-center rounded-full border px-3 text-[11px] font-medium ${statusToneChipClass(requestStatusMeta?.tone)}`}>
                              {requestStatusMeta?.label || request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-neutral-500">{request.age}</td>
                        </tr>
                      )})}
                      {vendorSupportRequests.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-14 text-center">
                            <div className="text-sm font-medium text-neutral-950">No support requests yet</div>
                            <div className="mt-2 text-sm leading-6 text-neutral-500">Send your first request above and it will appear here with admin progress updates.</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {showVendorSupportModal && (
                <div className="fixed bottom-0 left-0 right-0 top-16 z-[90] border-t border-neutral-200 bg-white md:inset-0 md:flex md:items-center md:justify-center md:border-t-0 md:bg-black/35 md:p-4 md:backdrop-blur-sm" onClick={() => setShowVendorSupportModal(false)}>
                  <div className="flex h-full w-full flex-col overflow-hidden bg-white md:max-h-[88vh] md:max-w-2xl md:rounded-2xl md:border md:border-neutral-200 md:shadow-[0_24px_80px_rgba(0,0,0,0.18)]" onClick={(event) => event.stopPropagation()}>
                    <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5">
                      <div>
                        <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">New support request</h3>
                        <p className="mt-1 text-[13px] text-neutral-500">Send support, help, assistance, or feature requests directly into the admin workspace queue.</p>
                      </div>
                      <button type="button" onClick={() => setShowVendorSupportModal(false)} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-700 transition hover:bg-neutral-200" aria-label="Close support request">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="grid flex-1 gap-5 overflow-y-auto px-6 py-6 pb-32 md:pb-6">
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Request type</label>
                          <VendorSelect
                            id="support-type"
                            value={vendorSupportDraft.type}
                            options={["Support ticket", "Help request", "Assistance request", "Feature request"]}
                            onChange={(value) => setVendorSupportDraft((current) => ({ ...current, type: value }))}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Priority</label>
                          <VendorSelect
                            id="support-priority"
                            value={vendorSupportDraft.priority}
                            options={["Normal", "Medium", "High"]}
                            onChange={(value) => setVendorSupportDraft((current) => ({ ...current, priority: value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Subject</label>
                        <input
                          value={vendorSupportDraft.subject}
                          onChange={(event) => setVendorSupportDraft((current) => ({ ...current, subject: event.target.value }))}
                          placeholder="e.g. Need help with calendar sync"
                          className={fieldClass}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Request details</label>
                        <textarea
                          value={vendorSupportDraft.message}
                          onChange={(event) => setVendorSupportDraft((current) => ({ ...current, message: event.target.value }))}
                          placeholder="Describe the issue, what you expected to happen, and any deadline the admin team should know."
                          className={`${fieldClass} min-h-32`}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-neutral-200 px-6 py-4">
                      <button type="button" onClick={() => setShowVendorSupportModal(false)} className={compactSecondaryButtonClass}>Cancel</button>
                      <button
                        type="button"
                        onClick={submitVendorSupportRequest}
                        disabled={!vendorSupportDraft.subject.trim() || !vendorSupportDraft.message.trim()}
                        className={`${compactPrimaryButtonClass} disabled:cursor-not-allowed disabled:bg-neutral-300`}
                      >
                        Send request
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {vendorASection === "reviews" && (
            <div className="space-y-6">
              <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  ["Listing rating", vendorReviewSummary.rating ? vendorReviewSummary.rating.toFixed(1) : "0.0"],
                  ["Total reviews", vendorReviewSummary.count || 0],
                  ["Pending admin review", vendorPendingReviewCount],
                  ["Requests sent", vendorReviewRequests.length]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-neutral-200 bg-white p-5">
                    <div className="text-[13px] font-medium text-neutral-500">{label}</div>
                    <div className="mt-2 text-[18px] font-semibold text-neutral-950">{value}</div>
                  </div>
                ))}
              </section>

              <section className="rounded-lg border border-neutral-200 bg-white">
                <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 px-6 py-5 md:flex-row md:items-center">
                  <div>
                    <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Reviews</h3>
                    <p className="mt-1 text-[13px] text-neutral-500">Track approved reviews and review requests in one place.</p>
                  </div>
                  <button type="button" onClick={() => setShowVendorReviewRequestModal(true)} className={compactPrimaryButtonClass}>
                    New review request
                  </button>
                </div>

                <div className="border-b border-neutral-200 px-6 pt-4">
                  <div className="flex gap-2">
                    {[
                      ["approved", `Approved reviews (${vendorApprovedReviews.length})`],
                      ["requests", `Requests (${vendorReviewRequests.length})`]
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setVendorReviewTab(key)}
                        className={`rounded-t-lg border border-b-0 px-4 py-2.5 text-sm font-medium transition-colors ${
                          vendorReviewTab === key ? "border-neutral-200 bg-white text-neutral-950" : "border-transparent bg-neutral-50 text-neutral-500 hover:text-neutral-950"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {vendorReviewTab === "approved" && (
                  <>
                  <div className="divide-y divide-neutral-100 md:hidden">
                    {vendorApprovedReviews.length ? vendorApprovedReviews.map((review) => (
                      <button
                        key={review.id}
                        type="button"
                        onClick={() => setSelectedVendorReviewDetail({ type: "review", item: review })}
                        className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-neutral-50"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-semibold text-neutral-950">{review.reviewerName}</span>
                          <span className="mt-1 block truncate text-[12px] font-medium text-neutral-500">{review.eventType}</span>
                        </span>
                        <span className="shrink-0 text-right text-[12px] font-semibold text-neutral-950">{review.rating}/5</span>
                      </button>
                    )) : (
                      <div className="px-4 py-10 text-center">
                        <div className="text-sm font-medium text-neutral-950">No approved reviews yet</div>
                        <div className="mt-2 text-sm leading-6 text-neutral-500">Approved reviews will appear here.</div>
                      </div>
                    )}
                  </div>
                  <div className="hidden overflow-x-auto md:block">
                    <table className="min-w-[920px] w-full text-left text-[13px]">
                      <thead className="bg-neutral-50 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                        <tr>
                          <th className="px-6 py-4">Reviewer</th>
                          <th className="px-6 py-4">Event</th>
                          <th className="px-6 py-4">Rating</th>
                          <th className="px-6 py-4">Submitted</th>
                          <th className="px-6 py-4">Review</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {vendorApprovedReviews.length ? vendorApprovedReviews.map((review) => (
                          <tr key={review.id} className="align-top hover:bg-neutral-50">
                            <td className="px-6 py-4">
                              <div className="font-medium text-neutral-950">{review.reviewerName}</div>
                              <div className="mt-1 text-[12px] text-neutral-500">{review.reviewerRole}</div>
                            </td>
                            <td className="px-6 py-4 text-neutral-700">{review.eventType}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1">{ratingStars(review.rating)}</div>
                            </td>
                            <td className="px-6 py-4 text-neutral-500">{review.submittedAt}</td>
                            <td className="px-6 py-4">
                              <p className="max-w-xl text-sm leading-6 text-neutral-700">{review.body}</p>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-14 text-center">
                              <div className="text-sm font-medium text-neutral-950">No approved reviews yet</div>
                              <div className="mt-2 text-sm leading-6 text-neutral-500">Once admin approves a submitted review, it will appear here and on the public listing page.</div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  </>
                )}

                {vendorReviewTab === "requests" && (
                  <>
                  <div className="divide-y divide-neutral-100 md:hidden">
                    {vendorReviewRequests.map((request) => {
                      const requestStatus = reviewRequestStatusMeta(request.status);
                      return (
                        <button
                          key={request.id}
                          type="button"
                          onClick={() => setSelectedVendorReviewDetail({ type: "request", item: request })}
                          className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-neutral-50"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-[14px] font-semibold text-neutral-950">{request.clientName}</span>
                            <span className={`mt-2 inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-medium ${statusToneChipClass(requestStatus.tone)}`}>
                              {requestStatus.label}
                            </span>
                          </span>
                          <span className="shrink-0 text-right text-[12px] font-semibold text-neutral-500">{request.sentAt || "Sent"}</span>
                        </button>
                      );
                    })}
                    {vendorReviewRequests.length === 0 && (
                      <div className="px-4 py-10 text-center">
                        <div className="text-sm font-medium text-neutral-950">No review requests yet</div>
                        <div className="mt-2 text-sm leading-6 text-neutral-500">Send a request to start testing review flow.</div>
                      </div>
                    )}
                  </div>
                  <div className="hidden overflow-x-auto md:block">
                    <table className="min-w-[920px] w-full text-left text-[13px]">
                      <thead className="bg-neutral-50 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                        <tr>
                          <th className="px-6 py-4">Client</th>
                          <th className="px-6 py-4">Event</th>
                          <th className="px-6 py-4">Sent</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {vendorReviewRequests.map((request) => {
                          const requestStatus = reviewRequestStatusMeta(request.status);
                          return (
                            <tr key={request.id} className="hover:bg-neutral-50">
                              <td className="px-6 py-4">
                                <div className="font-medium text-neutral-950">{request.clientName}</div>
                                <div className="mt-1 text-[12px] text-neutral-500">{request.clientEmail}</div>
                              </td>
                              <td className="px-6 py-4 text-neutral-700">{request.eventType}</td>
                              <td className="px-6 py-4 text-neutral-500">{request.sentAt}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex h-7 min-w-24 items-center justify-center rounded-full border px-3 text-[11px] font-medium ${statusToneChipClass(requestStatus.tone)}`}>
                                  {requestStatus.label}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {request.status === "sent" ? (
                                  <button
                                    type="button"
                                    onClick={() => setVendorReviewFormDraft({
                                      requestId: request.id,
                                      vendorSlug: request.vendorSlug,
                                      vendorName: request.vendorName,
                                      reviewerName: request.clientName,
                                      reviewerRole: "Client",
                                      eventType: request.eventType,
                                      rating: 5,
                                      body: "",
                                      wouldBookAgain: true
                                    })}
                                    className={compactSecondaryButtonClass}
                                  >
                                    Simulate client review
                                  </button>
                                ) : (
                                  <span className="text-[12px] font-medium text-neutral-500">Waiting on admin</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {vendorReviewRequests.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-14 text-center">
                              <div className="text-sm font-medium text-neutral-950">No review requests yet</div>
                              <div className="mt-2 text-sm leading-6 text-neutral-500">Send a request to a recent client to start testing the review experience.</div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  </>
                )}
              </section>

              {showVendorReviewRequestModal && (
                <div className="fixed bottom-0 left-0 right-0 top-16 z-[90] border-t border-neutral-200 bg-white md:inset-0 md:flex md:items-center md:justify-center md:border-t-0 md:bg-black/35 md:p-4 md:backdrop-blur-sm" onClick={() => setShowVendorReviewRequestModal(false)}>
                  <div className="flex h-full w-full flex-col overflow-hidden bg-white md:max-h-[88vh] md:max-w-2xl md:rounded-2xl md:border md:border-neutral-200 md:shadow-[0_24px_80px_rgba(0,0,0,0.18)]" onClick={(event) => event.stopPropagation()}>
                    <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5">
                      <div>
                        <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Send review request</h3>
                        <p className="mt-1 text-[13px] text-neutral-500">Send a review request to a completed client and track it through moderation.</p>
                      </div>
                      <button type="button" onClick={() => setShowVendorReviewRequestModal(false)} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-700 transition hover:bg-neutral-200" aria-label="Close review request">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="grid flex-1 gap-5 overflow-y-auto px-6 py-6 pb-32 md:pb-6">
                      <div>
                        <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Choose client</label>
                        <VendorSelect
                          id="review-request-client"
                          value={vendorReviewRequestDraft.clientId}
                          options={["", ...vendorClientRows.map((client) => client.id)]}
                          optionLabels={{
                            "": "Select a booked or quoted client",
                            ...Object.fromEntries(vendorClientRows.map((client) => [client.id, `${client.name} • ${client.eventType || "Event"}`]))
                          }}
                          onChange={(value) => {
                            const nextClient = vendorClientRows.find((client) => client.id === value);
                            setVendorReviewRequestDraft({
                              clientId: value,
                              clientName: nextClient?.name || "",
                              clientEmail: nextClient?.email || "",
                              eventType: nextClient?.eventType || ""
                            });
                          }}
                        />
                      </div>
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Client name</label>
                          <input
                            value={vendorReviewRequestDraft.clientName}
                            onChange={(event) => setVendorReviewRequestDraft((current) => ({ ...current, clientName: event.target.value }))}
                            className={fieldClass}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Client email</label>
                          <input
                            value={vendorReviewRequestDraft.clientEmail}
                            onChange={(event) => setVendorReviewRequestDraft((current) => ({ ...current, clientEmail: event.target.value }))}
                            className={fieldClass}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Event type</label>
                        <input
                          value={vendorReviewRequestDraft.eventType}
                          onChange={(event) => setVendorReviewRequestDraft((current) => ({ ...current, eventType: event.target.value }))}
                          className={fieldClass}
                          placeholder="Wedding reception"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-neutral-200 px-6 py-4">
                      <button type="button" onClick={() => setShowVendorReviewRequestModal(false)} className={compactSecondaryButtonClass}>Cancel</button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!vendorReviewRequestDraft.clientName.trim() || !vendorReviewRequestDraft.clientEmail.trim()) return;
                          sendVendorReviewRequest({
                            vendorSlug: currentVendorSlug,
                            vendorName: vendor?.businessName || vendorData?.vendor?.businessName || "Vendor",
                            clientName: vendorReviewRequestDraft.clientName.trim(),
                            clientEmail: vendorReviewRequestDraft.clientEmail.trim(),
                            eventType: vendorReviewRequestDraft.eventType.trim()
                          });
                          setVendorReviewRequestDraft({ clientId: "", clientName: "", clientEmail: "", eventType: "" });
                          setVendorReviewTab("requests");
                          setShowVendorReviewRequestModal(false);
                        }}
                        disabled={!vendorReviewRequestDraft.clientName.trim() || !vendorReviewRequestDraft.clientEmail.trim()}
                        className={`${compactPrimaryButtonClass} disabled:cursor-not-allowed disabled:bg-neutral-300`}
                      >
                        Send review request
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {vendorReviewFormDraft && (
                <div className="fixed bottom-0 left-0 right-0 top-16 z-[90] border-t border-neutral-200 bg-white md:inset-0 md:flex md:items-center md:justify-center md:border-t-0 md:bg-black/35 md:p-4 md:backdrop-blur-sm" onClick={() => setVendorReviewFormDraft(null)}>
                  <div className="flex h-full w-full flex-col overflow-hidden bg-white md:max-h-[88vh] md:max-w-3xl md:rounded-2xl md:border md:border-neutral-200 md:shadow-[0_24px_80px_rgba(0,0,0,0.18)]" onClick={(event) => event.stopPropagation()}>
                    <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5">
                    <div>
                      <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Simulated client review form</h3>
                      <p className="mt-1 text-[13px] text-neutral-500">Use this to test the client submission experience without email delivery or a public review page.</p>
                    </div>
                    <button type="button" onClick={() => setVendorReviewFormDraft(null)} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-700 transition hover:bg-neutral-200" aria-label="Close review form">
                      <X size={18} />
                    </button>
                    </div>
                    <div className="grid flex-1 gap-5 overflow-y-auto px-6 py-6 pb-32 md:max-h-[70vh] md:grid-cols-2 md:pb-6">
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Reviewer name</label>
                      <input value={vendorReviewFormDraft.reviewerName} onChange={(event) => setVendorReviewFormDraft((current) => ({ ...current, reviewerName: event.target.value }))} className={fieldClass} />
                    </div>
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Reviewer role</label>
                      <input value={vendorReviewFormDraft.reviewerRole} onChange={(event) => setVendorReviewFormDraft((current) => ({ ...current, reviewerRole: event.target.value }))} className={fieldClass} placeholder="Bride, Client, Event manager" />
                    </div>
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Rating</label>
                      <VendorSelect
                        id="review-form-rating"
                        value={String(vendorReviewFormDraft.rating)}
                        options={["5", "4", "3", "2", "1"]}
                        optionLabels={{ 5: "5 stars", 4: "4 stars", 3: "3 stars", 2: "2 stars", 1: "1 star" }}
                        onChange={(value) => setVendorReviewFormDraft((current) => ({ ...current, rating: Number(value) }))}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Would book again?</label>
                      <VendorSelect
                        id="review-form-would-book"
                        value={vendorReviewFormDraft.wouldBookAgain ? "Yes" : "No"}
                        options={["Yes", "No"]}
                        onChange={(value) => setVendorReviewFormDraft((current) => ({ ...current, wouldBookAgain: value === "Yes" }))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Review</label>
                      <textarea
                        value={vendorReviewFormDraft.body}
                        onChange={(event) => setVendorReviewFormDraft((current) => ({ ...current, body: event.target.value }))}
                        className={`${fieldClass} min-h-32`}
                        placeholder="Share what the experience was like working with this vendor."
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!vendorReviewFormDraft.reviewerName.trim() || !vendorReviewFormDraft.body.trim()) return;
                          submitLocalClientReview(vendorReviewFormDraft);
                        }}
                        disabled={!vendorReviewFormDraft.reviewerName.trim() || !vendorReviewFormDraft.body.trim()}
                        className={`${compactPrimaryButtonClass} disabled:cursor-not-allowed disabled:bg-neutral-300`}
                      >
                        Submit sample review
                      </button>
                    </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {vendorASection === "security" && (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <section className="rounded-lg border border-neutral-200 bg-white p-6">
                <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Login security</h3>
                <div className="mt-6 space-y-4">
                  {[
                    ["password", "Password", "Last changed 42 days ago", "Change password"],
                    ["2fa", "Two-factor authentication", securityDraft.loginAlerts ? "Authenticator app not connected" : "Recommended for owner accounts", "Set up 2FA"],
                    ["email", "Recovery email", securityDraft.recoveryEmail || "Not set", "Update"]
                  ].map(([key, title, body, action]) => (
                    <div key={title} className="flex items-center justify-between rounded-lg border border-neutral-200 p-4">
                      <div><div className="text-[14px] font-semibold text-neutral-950">{title}</div><div className="mt-1 text-[13px] text-neutral-500">{body}</div></div>
                      <button type="button" onClick={() => setSecurityAction(key)} className={securityAction === key ? compactPrimaryButtonClass : compactSecondaryButtonClass}>{action}</button>
                    </div>
                  ))}
                </div>
              </section>
              <section className="rounded-lg border border-neutral-200 bg-white p-6">
                <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">
                  {securityAction === "password" ? "Change password" : securityAction === "2fa" ? "Two-factor setup" : "Recovery email"}
                </h3>
                {securityAction === "password" && (
                  <div className="mt-5 space-y-4">
                    <div><label className="text-[13px] font-semibold text-neutral-600 block mb-2">Current password</label><input type="password" value={securityDraft.currentPassword} onChange={(event) => updateSecurityDraft("currentPassword", event.target.value)} className={fieldClass} /></div>
                    <div><label className="text-[13px] font-semibold text-neutral-600 block mb-2">New password</label><input type="password" value={securityDraft.newPassword} onChange={(event) => updateSecurityDraft("newPassword", event.target.value)} className={fieldClass} /></div>
                    <div><label className="text-[13px] font-semibold text-neutral-600 block mb-2">Confirm password</label><input type="password" value={securityDraft.confirmPassword} onChange={(event) => updateSecurityDraft("confirmPassword", event.target.value)} className={fieldClass} /></div>
                    <button type="button" onClick={() => setSaveState("Password updated")} className={compactPrimaryButtonClass}>Save password</button>
                  </div>
                )}
                {securityAction === "2fa" && (
                  <div className="mt-5 space-y-4 text-[13px]">
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                      <div className="font-semibold text-neutral-950">Authenticator setup code</div>
                      <div className="mt-2 font-mono text-[13px] tracking-widest text-neutral-600">ESPH-4928-7710</div>
                    </div>
                    <div><label className="text-[13px] font-semibold text-neutral-600 block mb-2">Verification code</label><input value={securityDraft.twoFactorCode} onChange={(event) => updateSecurityDraft("twoFactorCode", event.target.value)} placeholder="Enter 6-digit code" className={fieldClass} /></div>
                    <button type="button" onClick={() => setSaveState("Two-factor authentication enabled")} className={compactPrimaryButtonClass}>Enable 2FA</button>
                  </div>
                )}
                {securityAction === "email" && (
                  <div className="mt-5 space-y-4">
                    <div><label className="text-[13px] font-semibold text-neutral-600 block mb-2">Recovery email</label><input type="email" value={securityDraft.recoveryEmail} onChange={(event) => updateSecurityDraft("recoveryEmail", event.target.value)} className={fieldClass} /></div>
                    <button type="button" onClick={() => setSaveState("Recovery email updated")} className={compactPrimaryButtonClass}>Save recovery email</button>
                  </div>
                )}
                <div className="mt-8 border-t border-neutral-100 pt-5">
                  <h4 className="text-[13px] font-semibold text-neutral-950">Active sessions</h4>
                  <div className="mt-4 space-y-4 text-[13px]">
                    {[["Current device", "Toronto, Chrome", "Active now", false], ["Mobile session", "iPhone, Safari", "2 hours ago", true]].map(([title, meta, time, removable]) => (
                      <div key={title} className="flex items-center justify-between border-b border-neutral-100 pb-4 last:border-0">
                        <div><div className="font-semibold text-neutral-950">{title}</div><div className="mt-1 text-neutral-500">{meta}</div><div className="mt-1 text-neutral-400">{time}</div></div>
                        {removable && <button type="button" onClick={() => setSaveState("Session revoked")} className={compactSecondaryButtonClass}>Revoke</button>}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          {vendorASection === "quotes" && (
            <div className="space-y-6">
              <section className="rounded-lg border border-neutral-200 bg-white p-6">
                <div className="flex flex-col justify-between gap-4 border-b border-neutral-100 pb-5 md:flex-row md:items-start">
                  <div>
                    <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Quote document settings</h3>
                    <p className="mt-1 text-[13px] text-neutral-500">Reusable business and quote terms used when sending estimates from leads or clients.</p>
                  </div>
                  <button type="button" onClick={saveQuoteSettings} className={compactPrimaryButtonClass}>Save quote settings</button>
                </div>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {[
                    ["Legal business name", "legalName", "Golden Beats DJ Services"],
                    ["Business address", "businessAddress", "Mississauga, ON"],
                    ["Quote prefix", "quotePrefix", "GB-QUOTE-"],
                    ["Tax / HST number", "taxNumber", "123456789 RT0001"],
                    ["Default expiry days", "expiryDays", "14"],
                    ["Reply-to email", "replyToEmail", vendorForm?.email || "hello@vendor.com"]
                  ].map(([label, field, placeholder]) => (
                    <div key={field}>
                      <label className="text-[13px] font-semibold text-neutral-600 block mb-2">{label}</label>
                      <input value={quoteSettingValue(field)} onChange={(event) => updateQuoteSettingDraft(field, event.target.value)} placeholder={placeholder} className={fieldClass} />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="text-[13px] font-semibold text-neutral-600 block mb-2">Quote footer note</label>
                    <textarea value={quoteSettingValue("footerNote")} onChange={(event) => updateQuoteSettingDraft("footerNote", event.target.value)} className={`${fieldClass} min-h-24`} />
                  </div>
                </div>
              </section>
            </div>
          )}

          {vendorASection === "listing-settings" && (
            <div className="space-y-8">
              <div className="min-w-0 space-y-8">
                {renderVendorSettingsContent()}
              </div>
            </div>
          )}

          {vendorASection === "settings" && (
            <div className="space-y-8">
              {vendorSettingsSection === "menu" && (
              <section className="rounded-2xl border border-neutral-200 bg-white p-4 lg:hidden">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Vendor menu</div>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  {vendorMobileMoreMenu.map((item) => {
                    const isActive = item.section === "settings"
                      ? vendorASection === "settings" && !["listing", "menu"].includes(vendorSettingsSection)
                      : vendorASection === item.section;
                    return (
                      <button
                        key={`${item.section}-${item.label}`}
                        type="button"
                        onClick={() => (item.section === "settings" ? navigateVendorSettingsSection("general") : navigateVendorSection(item.section))}
                        className={`flex min-h-12 w-full items-center justify-between rounded-xl border px-3.5 text-left text-[13px] font-semibold transition-colors ${
                          isActive ? "border-neutral-200 bg-neutral-100 text-neutral-950" : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronRight size={13} className="text-neutral-400" />
                      </button>
                    );
                  })}
                </div>
              </section>
              )}
              <div className={`${vendorSettingsSection === "menu" ? "hidden lg:grid" : "grid"} gap-8 xl:grid-cols-[240px_minmax(0,1fr)]`}>
                <aside className="hidden space-y-2 pt-2 lg:block">
                  {vendorSettingsMenu.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => navigateVendorSettingsSection(item.key)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-[15px] transition-colors ${
                        vendorSettingsSection === item.key ? "bg-black text-white shadow-sm" : "text-neutral-500 hover:bg-white hover:text-neutral-900"
                      }`}
                    >
                      <item.icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </aside>
                <div className="min-w-0 space-y-8">
                  {renderVendorSettingsContent()}
                </div>
              </div>
            </div>
          )}
          {showVendorPolicyForm && vendorPolicyItemDraft && (
            <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
              <button type="button" aria-label="Close policy editor" className="absolute inset-0 cursor-default" onClick={() => setShowVendorPolicyForm(false)} />
              <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
                <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5">
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-950">{vendorPolicyFormMode === "create" ? "Create policy" : "Edit policy"}</h2>
                    <p className="mt-1 text-sm text-neutral-500">Policy records live here only. Listing defaults are managed in Settings.</p>
                  </div>
                  <button type="button" onClick={() => setShowVendorPolicyForm(false)} className={compactTextActionClass}>Close</button>
                </div>
                <div className="grid gap-5 px-6 py-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Policy category</label>
                      <VendorSelect
                        id="policy-category"
                        value={vendorPolicyItemDraft.category || "Custom policy"}
                        options={["Booking policy", "Cancellation policy", "Refund policy", "House rules", "Health & safety", "Custom policy"]}
                        onChange={(value) => setVendorPolicyItemDraft((current) => ({ ...current, category: value }))}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Applies to</label>
                      <VendorSelect
                        id="policy-scope"
                        value={vendorPolicyItemDraft.scope || "All listings"}
                        options={["All listings", "Selected listings", "Custom packages"]}
                        onChange={(value) => setVendorPolicyItemDraft((current) => ({ ...current, scope: value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Policy title</label>
                    <input
                      value={vendorPolicyItemDraft.title || ""}
                      onChange={(event) => setVendorPolicyItemDraft((current) => ({ ...current, title: event.target.value }))}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Policy details</label>
                    <textarea
                      value={vendorPolicyItemDraft.body || ""}
                      onChange={(event) => setVendorPolicyItemDraft((current) => ({ ...current, body: event.target.value }))}
                      className={`${fieldClass} min-h-32`}
                    />
                  </div>
                </div>
                <div className="flex justify-between gap-3 border-t border-neutral-200 bg-white px-6 py-4">
                  <div>
                    {vendorPolicyFormMode === "edit" && (
                      <button
                        type="button"
                        onClick={() => deleteVendorPolicyItem(vendorPolicyItemDraft.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 transition-colors hover:bg-red-50"
                        aria-label="Delete policy"
                        title="Delete policy"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowVendorPolicyForm(false)} className={compactSecondaryButtonClass}>Cancel</button>
                    <button type="button" onClick={saveVendorPolicyItem} className={compactPrimaryButtonClass}>
                      {vendorPolicyFormMode === "create" ? "Create policy" : "Save policy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showVendorListingForm && vendorListingDraft && (
            <div className="fixed bottom-0 left-0 right-0 top-16 z-[90] border-t border-neutral-200 bg-white lg:left-64">
              <div className="flex h-full w-full flex-col overflow-hidden bg-white">
                <div className="shrink-0 border-b border-neutral-200 bg-white px-6 py-3">
                  <div className="flex w-full max-w-[1400px] items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setShowVendorListingForm(false)}
                      aria-label="Back to listings"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <button type="button" onClick={saveVendorListingDraft} className={compactPrimaryButtonClass}>
                      {vendorListingMode === "create" ? "Create listing" : "Save listing"}
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-32 pt-6 lg:pb-6">
                  <div className="mb-8 w-full max-w-[1400px]">
                    <h2 className="vendor-listing-editor-title text-[22px] font-semibold leading-tight text-neutral-950">{vendorListingMode === "create" ? "Create listing" : "Edit listing"}</h2>
                    <p className="mt-1.5 text-sm text-neutral-500">Build the public-facing listing content clients will see across search, the detail page, and inquiry views.</p>
                  </div>
                  <div className="grid w-full max-w-[1400px] gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                    <div className="space-y-6">
                      <section className="rounded-lg border border-transparent bg-neutral-50 p-5">
                        <h3 className="text-[15px] font-semibold text-neutral-950">Listing basics</h3>
                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                          {[
                            ["businessName", "Listing name"],
                            ["category", "Category"],
                            ["city", "City"],
                            ["priceFrom", "Starting price"]
                          ].map(([field, label]) => (
                            <div key={field}>
                              <label className="mb-2 block text-[13px] font-semibold text-neutral-600">{label}</label>
                              <input
                                value={vendorListingDraft[field] || ""}
                                onChange={(event) => setVendorListingDraft((current) => ({ ...current, [field]: event.target.value }))}
                                className={fieldClass}
                              />
                            </div>
                          ))}
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Search summary</label>
                            <textarea
                              value={vendorListingDraft.description || ""}
                              onChange={(event) => setVendorListingDraft((current) => ({ ...current, description: event.target.value }))}
                              className={`${fieldClass} min-h-24`}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Full listing description</label>
                            <textarea
                              value={vendorListingDraft.longDescription || ""}
                              onChange={(event) => setVendorListingDraft((current) => ({ ...current, longDescription: event.target.value }))}
                              className={`${fieldClass} min-h-32`}
                            />
                          </div>
                        </div>
                      </section>

                      <section className="rounded-lg border border-transparent bg-neutral-50 p-5">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-[15px] font-semibold text-neutral-950">Parking & access</h3>
                          <span className="text-[12px] font-medium text-neutral-400">Shown on the public listing</span>
                        </div>
                        <div className="mt-5 grid gap-5">
                          <div>
                            <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Parking setup</label>
                            <VendorSelect
                              id="listing-parking-mode"
                              value={vendorListingDraft.parkingMode || ""}
                              options={PARKING_MODE_OPTIONS}
                              onChange={(value) => setVendorListingDraft((current) => ({ ...current, parkingMode: value }))}
                            />
                          </div>
                          <div>
                            <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Parking summary</label>
                            <textarea
                              value={vendorListingDraft.parkingSummary || ""}
                              onChange={(event) => setVendorListingDraft((current) => ({ ...current, parkingSummary: event.target.value }))}
                              className={`${fieldClass} min-h-24`}
                            />
                          </div>
                          <div>
                            <label className="mb-3 block text-[13px] font-semibold text-neutral-600">Access checklist</label>
                            <div className="grid gap-3 md:grid-cols-2">
                              {PARKING_OPTION_CHOICES.map((option) => {
                                const checked = (vendorListingDraft.parkingOptions || []).includes(option);
                                return (
                                  <label key={option} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${checked ? "border-sky-200 bg-sky-50 text-neutral-950" : "border-neutral-200 text-neutral-600"}`}>
                                    <input type="checkbox" checked={checked} onChange={() => toggleListingDraftChoice("parkingOptions", option)} className="h-4 w-4 accent-sky-500" />
                                    <span>{option}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className="rounded-lg border border-transparent bg-neutral-50 p-5">
                        <h3 className="text-[15px] font-semibold text-neutral-950">Policies & client expectations</h3>
                        <div className="mt-5 grid gap-5">
                          <div className="rounded-lg border border-neutral-200 bg-white p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="text-[14px] font-semibold text-neutral-950">Vendor rules / notes</div>
                                <p className="mt-1 text-[13px] leading-5 text-neutral-500">
                                  {vendorListingDraft.useDefaultVendorRules ? "Using default vendor rules from settings." : "Custom rules will apply only to this listing."}
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center gap-3">
                                <span className="text-[12px] font-semibold text-neutral-500">Use default</span>
                                <button
                                  type="button"
                                  role="switch"
                                  aria-checked={Boolean(vendorListingDraft.useDefaultVendorRules)}
                                  onClick={() => setVendorListingDraft((current) => ({ ...current, useDefaultVendorRules: !current.useDefaultVendorRules }))}
                                  className={`inline-flex h-7 w-12 items-center rounded-full border p-0.5 transition-all ${
                                    vendorListingDraft.useDefaultVendorRules ? "justify-end border-black bg-black" : "justify-start border-neutral-200 bg-neutral-200"
                                  }`}
                                >
                                  <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
                                </button>
                              </div>
                            </div>
                            {!vendorListingDraft.useDefaultVendorRules && (
                              <div className="mt-4">
                                <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Custom vendor rules</label>
                                <textarea
                                  value={vendorListingDraft.vendorRules || ""}
                                  onChange={(event) => setVendorListingDraft((current) => ({ ...current, vendorRules: event.target.value }))}
                                  className={`${fieldClass} min-h-28`}
                                />
                              </div>
                            )}
                          </div>

                          <div className="rounded-lg border border-neutral-200 bg-white p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="text-[14px] font-semibold text-neutral-950">Booking policy</div>
                                <p className="mt-1 text-[13px] leading-5 text-neutral-500">
                                  {vendorListingDraft.useDefaultBookingPolicy ? "Using the default booking policy." : "Override the booking policy for this listing."}
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center gap-3">
                                <span className="text-[12px] font-semibold text-neutral-500">Use default</span>
                                <button
                                  type="button"
                                  role="switch"
                                  aria-checked={Boolean(vendorListingDraft.useDefaultBookingPolicy)}
                                  onClick={() => setVendorListingDraft((current) => ({ ...current, useDefaultBookingPolicy: !current.useDefaultBookingPolicy }))}
                                  className={`inline-flex h-7 w-12 items-center rounded-full border p-0.5 transition-all ${
                                    vendorListingDraft.useDefaultBookingPolicy ? "justify-end border-black bg-black" : "justify-start border-neutral-200 bg-neutral-200"
                                  }`}
                                >
                                  <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
                                </button>
                              </div>
                            </div>
                            {!vendorListingDraft.useDefaultBookingPolicy && (
                              <div className="mt-4 grid gap-4">
                                <div>
                                  <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Booking policy style</label>
                                  <VendorSelect
                                    id="listing-booking-policy"
                                    value={vendorListingDraft.bookingPolicyTitle || ""}
                                    options={BOOKING_POLICY_OPTIONS}
                                    onChange={(value) => setVendorListingDraft((current) => ({ ...current, bookingPolicyTitle: value }))}
                                  />
                                </div>
                                <div>
                                  <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Custom booking policy</label>
                                  <textarea
                                    value={vendorListingDraft.bookingPolicyBody || ""}
                                    onChange={(event) => setVendorListingDraft((current) => ({ ...current, bookingPolicyBody: event.target.value }))}
                                    className={`${fieldClass} min-h-24`}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="rounded-lg border border-neutral-200 bg-white p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="text-[14px] font-semibold text-neutral-950">Cancellation policy</div>
                                <p className="mt-1 text-[13px] leading-5 text-neutral-500">
                                  {vendorListingDraft.useDefaultCancellationPolicy ? "Using the default cancellation policy." : "Override the cancellation policy for this listing."}
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center gap-3">
                                <span className="text-[12px] font-semibold text-neutral-500">Use default</span>
                                <button
                                  type="button"
                                  role="switch"
                                  aria-checked={Boolean(vendorListingDraft.useDefaultCancellationPolicy)}
                                  onClick={() => setVendorListingDraft((current) => ({ ...current, useDefaultCancellationPolicy: !current.useDefaultCancellationPolicy }))}
                                  className={`inline-flex h-7 w-12 items-center rounded-full border p-0.5 transition-all ${
                                    vendorListingDraft.useDefaultCancellationPolicy ? "justify-end border-black bg-black" : "justify-start border-neutral-200 bg-neutral-200"
                                  }`}
                                >
                                  <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
                                </button>
                              </div>
                            </div>
                            {!vendorListingDraft.useDefaultCancellationPolicy && (
                              <div className="mt-4 grid gap-4">
                                <div>
                                  <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Cancellation style</label>
                                  <VendorSelect
                                    id="listing-cancellation-policy"
                                    value={vendorListingDraft.cancellationPolicyTitle || ""}
                                    options={CANCELLATION_POLICY_OPTIONS}
                                    onChange={(value) => setVendorListingDraft((current) => ({ ...current, cancellationPolicyTitle: value }))}
                                  />
                                </div>
                                <div>
                                  <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Custom cancellation policy</label>
                                  <textarea
                                    value={vendorListingDraft.cancellationPolicyBody || ""}
                                    onChange={(event) => setVendorListingDraft((current) => ({ ...current, cancellationPolicyBody: event.target.value }))}
                                    className={`${fieldClass} min-h-24`}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="rounded-lg border border-neutral-200 bg-white p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="text-[14px] font-semibold text-neutral-950">Refund policy</div>
                                <p className="mt-1 text-[13px] leading-5 text-neutral-500">
                                  {vendorListingDraft.useDefaultRefundPolicy ? "Using the default refund policy." : "Override the refund policy for this listing."}
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center gap-3">
                                <span className="text-[12px] font-semibold text-neutral-500">Use default</span>
                                <button
                                  type="button"
                                  role="switch"
                                  aria-checked={Boolean(vendorListingDraft.useDefaultRefundPolicy)}
                                  onClick={() => setVendorListingDraft((current) => ({ ...current, useDefaultRefundPolicy: !current.useDefaultRefundPolicy }))}
                                  className={`inline-flex h-7 w-12 items-center rounded-full border p-0.5 transition-all ${
                                    vendorListingDraft.useDefaultRefundPolicy ? "justify-end border-black bg-black" : "justify-start border-neutral-200 bg-neutral-200"
                                  }`}
                                >
                                  <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
                                </button>
                              </div>
                            </div>
                            {!vendorListingDraft.useDefaultRefundPolicy && (
                              <div className="mt-4">
                                <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Custom refund policy</label>
                                <textarea
                                  value={vendorListingDraft.refundPolicyBody || ""}
                                  onChange={(event) => setVendorListingDraft((current) => ({ ...current, refundPolicyBody: event.target.value }))}
                                  className={`${fieldClass} min-h-24`}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </section>
                    </div>

                    <div className="space-y-6">
                      <section className="rounded-lg border border-transparent bg-neutral-50 p-5">
                        <h3 className="text-[15px] font-semibold text-neutral-950">Listing visibility</h3>
                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                          <label className="flex h-[54px] items-center justify-between rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700">
                            Featured listing
                            <input
                              type="checkbox"
                              checked={Boolean(vendorListingDraft.featured)}
                              onChange={(event) => setVendorListingDraft((current) => ({ ...current, featured: event.target.checked }))}
                              className="h-4 w-4"
                            />
                          </label>
                          <VendorSelect
                            id="listing-visibility"
                            value={listingIsDeactivated(vendorListingDraft) ? "deactivated" : "approved"}
                            options={["approved", "deactivated"]}
                            optionLabels={{ approved: "Active in marketplace", deactivated: "Deactivated / hidden" }}
                            onChange={(value) => setVendorListingDraft((current) => ({ ...current, status: value, featured: value === "deactivated" ? false : current.featured }))}
                            className="h-[54px]"
                          />
                        </div>
                      </section>

                      <section className="rounded-lg border border-transparent bg-neutral-50 p-5">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-[15px] font-semibold text-neutral-950">Media</h3>
                          <span className="text-xs text-neutral-500">{vendorListingDraft.images?.length || 0}/6 images</span>
                        </div>
                        <div className="mt-5">
                          <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Listing images</label>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(event) => {
                              addVendorListingImages(event.target.files);
                              event.target.value = "";
                            }}
                            className="block w-full rounded-xl border border-neutral-300 bg-white p-3 text-sm text-neutral-700"
                          />
                          {vendorListingImageError && <p className="mt-2 text-sm text-red-600">{vendorListingImageError}</p>}
                          <div className="mt-4 grid grid-cols-3 gap-3">
                            {(vendorListingDraft.images || []).map((image, index) => (
                              <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                                <SafeImage src={image} alt={`Listing image ${index + 1}`} className="h-full w-full object-cover" fallback={IMG_EVENT_PLANNING} />
                                <button
                                  type="button"
                                  onClick={() => removeVendorListingImage(index)}
                                  className="absolute right-2 top-2 rounded-full border border-neutral-200 bg-white px-2 py-1 text-xs font-semibold text-black"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>

                      <section className="rounded-lg border border-transparent bg-neutral-50 p-5">
                        <h3 className="text-[15px] font-semibold text-neutral-950">Listing content checklist</h3>
                        <div className="mt-5 space-y-5">
                          <div>
                            <label className="mb-3 block text-[13px] font-semibold text-neutral-600">Cultural specialties</label>
                            <div className="flex flex-wrap gap-2">
                              {(vendorListingDraft.culturalSpecialties || []).map((tag) => (
                                <span key={tag} className="inline-flex h-8 items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 text-[13px] font-medium text-neutral-700">
                                  {tag}
                                  <button type="button" onClick={() => setVendorListingDraft((current) => ({ ...current, culturalSpecialties: (current.culturalSpecialties || []).filter((item) => item !== tag) }))} className="text-neutral-400 hover:text-neutral-950">
                                    <X size={12} />
                                  </button>
                                </span>
                              ))}
                              <input
                                value={tagDrafts.listingCulturalSpecialties || ""}
                                onChange={(event) => setTagDrafts((current) => ({ ...current, listingCulturalSpecialties: event.target.value }))}
                                onKeyDown={(event) => {
                                  if (event.key !== "Enter" && event.key !== ",") return;
                                  event.preventDefault();
                                  const nextTag = String(tagDrafts.listingCulturalSpecialties || "").trim();
                                  if (!nextTag) return;
                                  setVendorListingDraft((current) => ({ ...current, culturalSpecialties: uniqueStringArray([...(current.culturalSpecialties || []), nextTag]) }));
                                  setTagDrafts((current) => ({ ...current, listingCulturalSpecialties: "" }));
                                }}
                                placeholder="Type and press Enter"
                                className="min-h-10 min-w-[180px] flex-1 rounded-xl border border-neutral-200 bg-white px-3 text-[14px] outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-3 block text-[13px] font-semibold text-neutral-600">Included with this listing</label>
                            <div className="grid gap-3">
                              {INCLUDED_FEATURE_CHOICES.map((option) => {
                                const checked = (vendorListingDraft.includedFeatures || []).includes(option);
                                return (
                                  <label key={option} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${checked ? "border-sky-200 bg-sky-50 text-neutral-950" : "border-neutral-200 text-neutral-600"}`}>
                                    <input type="checkbox" checked={checked} onChange={() => toggleListingDraftChoice("includedFeatures", option)} className="h-4 w-4 accent-sky-500" />
                                    <span>{option}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <label className="mb-3 block text-[13px] font-semibold text-neutral-600">Health and safety measures</label>
                            <div className="grid gap-3">
                              {HEALTH_SAFETY_CHOICES.map((option) => {
                                const checked = (vendorListingDraft.healthSafetyMeasures || []).includes(option);
                                return (
                                  <label key={option} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${checked ? "border-sky-200 bg-sky-50 text-neutral-950" : "border-neutral-200 text-neutral-600"}`}>
                                    <input type="checkbox" checked={checked} onChange={() => toggleListingDraftChoice("healthSafetyMeasures", option)} className="h-4 w-4 accent-sky-500" />
                                    <span>{option}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </section>

                      {vendorListingMode === "edit" && (
                        <section className="rounded-lg border border-red-100 bg-red-50/40 p-5">
                          <div className="text-[14px] font-semibold text-red-700">Listing danger zone</div>
                          <p className="mt-1 text-[13px] leading-5 text-neutral-600">
                            {listingIsDeactivated(vendorListingDraft)
                              ? "This listing is already hidden from marketplace search. You can reactivate it or delete it from this vendor dashboard."
                              : "Deactivate to hide the listing, or delete it from this vendor dashboard."}
                          </p>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {listingIsDeactivated(vendorListingDraft) ? (
                              <button type="button" onClick={reactivateVendorListingDraft} className={compactSecondaryButtonClass}>Reactivate listing</button>
                            ) : (
                              <button type="button" onClick={deactivateVendorListingDraft} className={compactSecondaryButtonClass}>Deactivate listing</button>
                            )}
                            <button type="button" onClick={deleteVendorListingDraft} className="inline-flex h-10 items-center justify-center rounded-md border border-red-200 bg-white px-3.5 text-[14px] font-medium text-red-700 transition-colors hover:bg-red-50">Delete listing</button>
                          </div>
                        </section>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showVendorPackageForm && vendorPackageDraft && (
            <div className="fixed bottom-0 left-0 right-0 top-16 z-[90] border-t border-neutral-200 bg-white md:inset-0 md:flex md:items-center md:justify-center md:border-t-0 md:bg-black/30 md:p-6 md:backdrop-blur-sm" onClick={() => setShowVendorPackageForm(false)}>
              <div className="flex h-full w-full flex-col overflow-hidden bg-white md:max-h-[88vh] md:max-w-2xl md:rounded-2xl md:border md:border-neutral-200 md:shadow-[0_24px_80px_rgba(0,0,0,0.18)]" onClick={(event) => event.stopPropagation()}>
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-200 p-6">
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-950">{vendorPackageMode === "create" ? "Create package" : "Edit package"}</h2>
                    <p className="mt-1 text-sm text-neutral-500">Manage the service offer clients can choose from inside your listing.</p>
                  </div>
                  <button type="button" onClick={() => setShowVendorPackageForm(false)} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-700 transition hover:bg-neutral-200" aria-label="Close package editor">
                    <X size={18} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 md:pb-6">
                <div className="grid gap-5">
                  <div>
                    <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Package name</label>
                    <input
                      value={vendorPackageDraft.name || ""}
                      onChange={(event) => setVendorPackageDraft((current) => ({ ...current, name: event.target.value }))}
                      placeholder="Wedding DJ + MC"
                      className={fieldClass}
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Service area</label>
                      <VendorSelect
                        id="package-service-area"
                        value={vendorPackageDraft.area || profileValue("city")}
                        options={parseServiceAreas().length ? parseServiceAreas() : CANADIAN_CITY_OPTIONS.slice(0, 8)}
                        optionLabels={Object.fromEntries((parseServiceAreas().length ? parseServiceAreas() : CANADIAN_CITY_OPTIONS.slice(0, 8)).map((city) => [city, displayCityName(city)]))}
                        onChange={(value) => setVendorPackageDraft((current) => ({ ...current, area: value }))}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Price from</label>
                      <input
                        value={vendorPackageDraft.priceFrom || ""}
                        onChange={(event) => setVendorPackageDraft((current) => ({ ...current, priceFrom: event.target.value }))}
                        placeholder="800"
                        className={fieldClass}
                      />
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Turnaround</label>
                      <VendorSelect
                        id="package-turnaround"
                        value={vendorPackageDraft.turnaround || "Custom quote"}
                        options={["Instant inquiry", "Custom quote", "24 hour response", "48 hour response", "Consultation required"]}
                        onChange={(value) => setVendorPackageDraft((current) => ({ ...current, turnaround: value }))}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Status</label>
                      <VendorSelect
                        id="package-status"
                        value={vendorPackageDraft.status || "Active"}
                        options={["Active", "Paused", "Draft"]}
                        onChange={(value) => setVendorPackageDraft((current) => ({ ...current, status: value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Summary</label>
                    <textarea
                      value={vendorPackageDraft.description || ""}
                      onChange={(event) => setVendorPackageDraft((current) => ({ ...current, description: event.target.value }))}
                      placeholder="What is included in this package?"
                      className={`${fieldClass} min-h-32`}
                    />
                  </div>
                </div>
                </div>
                <div className="flex shrink-0 justify-between gap-3 border-t border-neutral-200 bg-white px-6 py-4">
                  {vendorServices.length > 1 && vendorPackageMode === "edit" ? (
                    <button
                      type="button"
                      onClick={() => {
                        removeVendorService(vendorPackageDraft.id);
                        setShowVendorPackageForm(false);
                        setSaveState("Package removed");
                      }}
                      className={compactTextActionClass}
                    >
                      Remove
                    </button>
                  ) : <span />}
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowVendorPackageForm(false)} className={compactSecondaryButtonClass}>Cancel</button>
                    <button type="button" onClick={saveVendorPackageDraft} className={compactPrimaryButtonClass}>
                      {vendorPackageMode === "create" ? "Create package" : "Save package"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showVendorQuotePanel && vendorQuoteDraft && (
            <div className="fixed inset-0 z-[95] bg-white">
              <div className="flex h-full w-full flex-col">
                <div className="flex items-start justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-4">
                  <div>
                    <h2 className="text-[22px] font-semibold text-neutral-950">Quote workspace</h2>
                    <p className="mt-1 text-[14px] font-normal text-neutral-500">Build, preview, and send a client-ready quote document.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setShowVendorQuotePanel(false)} className={compactSecondaryButtonClass}>Cancel</button>
                    <button type="button" onClick={sendVendorQuote} className={compactPrimaryButtonClass}>Send to client</button>
                  </div>
                </div>
                <div className="grid min-h-0 flex-1 xl:grid-cols-[540px_minmax(0,1fr)]">
                  <section className="min-h-0 overflow-y-auto border-r border-neutral-200 bg-white p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[13px] font-medium text-neutral-500">Quote</div>
                        <input value={vendorQuoteDraft.quoteId || ""} onChange={(event) => updateQuoteDraft("quoteId", event.target.value)} className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-[14px] font-semibold outline-none" />
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] font-medium text-neutral-500">Expires</div>
                        <div className="mt-2 text-[14px] font-semibold text-neutral-950">{quoteSettingValue("expiryDays")} days</div>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {[
                        ["clientName", "Client name"],
                        ["clientEmail", "Client email"],
                        ["eventType", "Event type"],
                        ["eventDate", "Event date"],
                        ["city", "City"],
                        ["guests", "Guests"]
                      ].map(([field, label]) => (
                        <div key={field}>
                          <label className="mb-2 block text-[13px] font-semibold text-neutral-600">{label}</label>
                          <input value={vendorQuoteDraft[field] || ""} onChange={(event) => updateQuoteDraft(field, event.target.value)} className={fieldClass} />
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Line items</h3>
                        <button type="button" onClick={addQuoteLineItem} className={compactSecondaryButtonClass}>Add item</button>
                      </div>
                      <div className="space-y-3">
                        {(vendorQuoteDraft.lineItems || []).map((item, index) => (
                          <div key={`${item.description}-${index}`} className="grid gap-3 rounded-lg border border-neutral-200 p-3 sm:grid-cols-[minmax(0,1fr)_140px_80px]">
                            <input value={item.description || ""} onChange={(event) => updateQuoteLineItem(index, "description", event.target.value)} className={fieldClass} placeholder="Service description" />
                            <input value={item.amount || ""} onChange={(event) => updateQuoteLineItem(index, "amount", event.target.value)} className={fieldClass} placeholder="Amount" />
                            <button type="button" onClick={() => removeQuoteLineItem(index)} className={compactTextActionClass}>Remove</button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="mb-2 block text-[13px] font-semibold text-neutral-600">Email message</label>
                      <textarea value={vendorQuoteDraft.message || ""} onChange={(event) => updateQuoteDraft("message", event.target.value)} className={`${fieldClass} min-h-24`} />
                    </div>
                    <div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                      <h3 className="profile-section-heading text-[14px] font-semibold text-neutral-950">Document summary</h3>
                      <div className="mt-4 space-y-3 text-[13px]">
                        <div className="flex justify-between gap-4"><span className="text-neutral-500">Vendor</span><strong className="text-right">{quoteSettingValue("legalName")}</strong></div>
                        <div className="flex justify-between gap-4"><span className="text-neutral-500">Subtotal</span><strong>{money(quoteSubtotal)}</strong></div>
                        <div className="flex justify-between gap-4 border-t border-neutral-200 pt-3"><span className="text-neutral-500">Estimated total</span><strong>{money(quoteSubtotal)}</strong></div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowQuoteDocumentPreview(true);
                      }}
                      className={`${compactSecondaryButtonClass} mt-4 w-full`}
                    >
                      Generate document
                    </button>
                  </section>
                  <section className="min-h-0 overflow-y-auto bg-white p-6">
                    {showQuoteDocumentPreview ? (
                      <div className="mx-auto w-full max-w-[760px] bg-white p-10 text-neutral-950 ring-1 ring-neutral-200" style={{ aspectRatio: "210 / 297" }}>
                        <div className="flex items-start justify-between gap-10 border-b border-neutral-200 pb-8">
                          <div>
                            <div className="text-[22px] font-semibold">Quote</div>
                            <div className="mt-2 text-[13px] font-normal text-neutral-500">{vendorQuoteDraft.quoteId}</div>
                          </div>
                          <div className="text-right text-[13px] leading-6 text-neutral-600">
                            <div className="font-semibold text-neutral-950">{quoteSettingValue("legalName")}</div>
                            <div>{quoteSettingValue("businessAddress")}</div>
                            {quoteSettingValue("taxNumber") ? <div>Tax/HST: {quoteSettingValue("taxNumber")}</div> : null}
                          </div>
                        </div>

                        <div className="mt-8 grid gap-8 text-[13px] sm:grid-cols-2">
                          <div>
                            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Bill to</div>
                            <div className="mt-3 font-semibold text-neutral-950">{vendorQuoteDraft.clientName}</div>
                            <div className="mt-1 text-neutral-600">{vendorQuoteDraft.clientEmail}</div>
                            <div className="mt-1 text-neutral-600">{vendorQuoteDraft.city}</div>
                          </div>
                          <div>
                            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Event details</div>
                            <div className="mt-3 text-neutral-600">{vendorQuoteDraft.eventType || "Custom event service"}</div>
                            <div className="mt-1 text-neutral-600">{vendorQuoteDraft.eventDate || "Date to be confirmed"}</div>
                            <div className="mt-1 text-neutral-600">{vendorQuoteDraft.guests ? `${vendorQuoteDraft.guests} guests` : "Guest count to be confirmed"}</div>
                          </div>
                        </div>

                        <table className="mt-10 w-full text-left text-[13px]">
                          <thead className="border-b border-neutral-200 text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                            <tr>
                              <th className="py-3 font-semibold">Description</th>
                              <th className="py-3 text-right font-semibold">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100">
                            {(vendorQuoteDraft.lineItems || []).map((item, index) => (
                              <tr key={`${item.description}-${index}`}>
                                <td className="py-4 text-neutral-700">{item.description || "Service"}</td>
                                <td className="py-4 text-right font-semibold text-neutral-950">{money(parseMoneyValue(item.amount))}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="mt-8 ml-auto w-full max-w-[280px] space-y-3 text-[13px]">
                          <div className="flex justify-between gap-4"><span className="text-neutral-500">Subtotal</span><strong>{money(quoteSubtotal)}</strong></div>
                          <div className="flex justify-between gap-4 border-t border-neutral-200 pt-3 text-[15px]"><span className="text-neutral-600">Estimated total</span><strong>{money(quoteSubtotal)}</strong></div>
                        </div>
                        <p className="mt-10 border-t border-neutral-200 pt-5 text-[12px] leading-5 text-neutral-500">{quoteSettingValue("footerNote")}</p>
                      </div>
                    ) : (
                      <div className="flex min-h-full items-center justify-center">
                        <div className="max-w-md rounded-lg border border-neutral-200 bg-white p-8 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                            <FileText size={20} />
                          </div>
                          <h3 className="mt-5 text-[16px] font-semibold text-neutral-950">No document preview yet</h3>
                          <p className="mt-2 text-[14px] font-normal leading-6 text-neutral-500">Generate the document to preview a clean A4 quote before sending it to the client.</p>
                          <button
                            type="button"
                            onClick={() => {
                              setShowQuoteDocumentPreview(true);
                            }}
                            className={`${compactPrimaryButtonClass} mt-5`}
                          >
                            Generate document
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          )}

          {selectedVendorSupportRequest && (
            <div className="fixed bottom-0 left-0 right-0 top-16 z-[90] border-t border-neutral-200 bg-white lg:left-64">
              <div className="flex h-full w-full flex-col overflow-hidden bg-white">
                <div className="shrink-0 border-b border-neutral-200 bg-white px-6 py-3">
                  <button
                    type="button"
                    onClick={() => setSelectedVendorSupportRequest(null)}
                    aria-label="Back to support requests"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                  >
                    <ArrowLeft size={18} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-32 pt-6 lg:pb-6">
                  <div className="mb-8 w-full max-w-[1400px]">
                    <h2 className="vendor-listing-editor-title text-[22px] font-semibold leading-tight text-neutral-950">Request details</h2>
                  </div>
                  <div className="grid w-full max-w-[1400px] gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <section className="rounded-lg border border-transparent bg-neutral-50 p-5">
                      <h3 className="text-[15px] font-semibold text-neutral-950">{selectedVendorSupportRequest.subject}</h3>
                      <p className="mt-4 text-[14px] leading-7 text-neutral-600">{selectedVendorSupportRequest.message || "No request details provided."}</p>
                      {selectedVendorSupportRequest.adminReply && (
                        <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4 text-[14px] leading-6 text-blue-800">
                          <div className="font-semibold">Admin response</div>
                          <p className="mt-1">{selectedVendorSupportRequest.adminReply}</p>
                        </div>
                      )}
                    </section>
                    <section className="rounded-lg border border-transparent bg-neutral-50 p-5">
                      <h3 className="text-[15px] font-semibold text-neutral-950">Request status</h3>
                      <div className="mt-5 space-y-4 text-[14px]">
                        {[
                          ["Type", selectedVendorSupportRequest.type],
                          ["Priority", selectedVendorSupportRequest.priority],
                          ["Status", findStatusMeta(adminRequestStatuses, selectedVendorSupportRequest.status, selectedVendorSupportRequest.status)?.label || selectedVendorSupportRequest.status],
                          ["Updated", selectedVendorSupportRequest.age]
                        ].map(([label, value]) => (
                          <div key={label} className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-3">
                            <span className="text-neutral-500">{label}</span>
                            <span className="text-right font-semibold text-neutral-950">{value || "Not provided"}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedVendorReviewDetail && (
            <div className="fixed bottom-0 left-0 right-0 top-16 z-[90] border-t border-neutral-200 bg-white lg:left-64">
              <div className="flex h-full w-full flex-col overflow-hidden bg-white">
                <div className="shrink-0 border-b border-neutral-200 bg-white px-6 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedVendorReviewDetail(null)}
                      aria-label="Back to reviews"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    {selectedVendorReviewDetail.type === "request" && selectedVendorReviewDetail.item.status === "sent" && (
                      <button
                        type="button"
                        onClick={() => {
                          const request = selectedVendorReviewDetail.item;
                          setVendorReviewFormDraft({
                            requestId: request.id,
                            vendorSlug: request.vendorSlug,
                            vendorName: request.vendorName,
                            reviewerName: request.clientName,
                            reviewerRole: "Client",
                            eventType: request.eventType,
                            rating: 5,
                            body: "",
                            wouldBookAgain: true
                          });
                          setSelectedVendorReviewDetail(null);
                        }}
                        className={compactPrimaryButtonClass}
                      >
                        Simulate review
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-32 pt-6 lg:pb-6">
                  <div className="mb-8 w-full max-w-[1400px]">
                    <h2 className="vendor-listing-editor-title text-[22px] font-semibold leading-tight text-neutral-950">
                      {selectedVendorReviewDetail.type === "review" ? "Review details" : "Review request details"}
                    </h2>
                  </div>
                  {selectedVendorReviewDetail.type === "review" ? (
                    <div className="grid w-full max-w-[1400px] gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                      <section className="rounded-lg border border-transparent bg-neutral-50 p-5">
                        <h3 className="text-[15px] font-semibold text-neutral-950">{selectedVendorReviewDetail.item.reviewerName}</h3>
                        <div className="mt-3 flex items-center gap-1">{ratingStars(selectedVendorReviewDetail.item.rating)}</div>
                        <p className="mt-5 text-[14px] leading-7 text-neutral-600">{selectedVendorReviewDetail.item.body || "No review body provided."}</p>
                      </section>
                      <section className="rounded-lg border border-transparent bg-neutral-50 p-5">
                        <h3 className="text-[15px] font-semibold text-neutral-950">Review meta</h3>
                        <div className="mt-5 space-y-4 text-[14px]">
                          {[
                            ["Role", selectedVendorReviewDetail.item.reviewerRole],
                            ["Event", selectedVendorReviewDetail.item.eventType],
                            ["Submitted", selectedVendorReviewDetail.item.submittedAt],
                            ["Would book again", selectedVendorReviewDetail.item.wouldBookAgain === false ? "No" : "Yes"]
                          ].map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-3">
                              <span className="text-neutral-500">{label}</span>
                              <span className="text-right font-semibold text-neutral-950">{value || "Not provided"}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  ) : (
                    <section className="w-full max-w-[1400px] rounded-lg border border-transparent bg-neutral-50 p-5">
                      <h3 className="text-[15px] font-semibold text-neutral-950">{selectedVendorReviewDetail.item.clientName}</h3>
                      <div className="mt-1 text-[13px] text-neutral-500">{selectedVendorReviewDetail.item.clientEmail}</div>
                      <div className="mt-5 grid gap-4 text-[14px] sm:grid-cols-2">
                        {[
                          ["Event", selectedVendorReviewDetail.item.eventType],
                          ["Sent", selectedVendorReviewDetail.item.sentAt],
                          ["Status", reviewRequestStatusMeta(selectedVendorReviewDetail.item.status).label],
                          ["Vendor", selectedVendorReviewDetail.item.vendorName]
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-lg border border-neutral-200 bg-white px-4 py-3">
                            <div className="text-[12px] font-medium text-neutral-500">{label}</div>
                            <div className="mt-1 font-semibold text-neutral-950">{value || "Not provided"}</div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedVendorLead && (
            <div className="fixed bottom-0 left-0 right-0 top-16 z-[90] border-t border-neutral-200 bg-white lg:left-64">
              <div className="flex h-full w-full flex-col overflow-hidden bg-white">
                <div className="shrink-0 border-b border-neutral-200 bg-white px-6 py-3">
                  <div className="flex w-full max-w-[1400px] items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedVendorLead(null)}
                      aria-label="Back to leads"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => updateSelectedVendorLeadStatus("Follow up")} className={compactSecondaryButtonClass}>Mark follow-up</button>
                      <button type="button" onClick={() => openQuoteForLead(selectedVendorLead)} className={compactPrimaryButtonClass}>Send quote</button>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-32 pt-6 lg:pb-6">
                  <div className="mb-8 w-full max-w-[1400px]">
                    <h2 className="vendor-listing-editor-title text-[22px] font-semibold leading-tight text-neutral-950">Client details</h2>
                    <p className="mt-1.5 text-sm text-neutral-500">Edit lead and client information directly in this workspace.</p>
                  </div>
                  <div className="grid w-full max-w-[1400px] gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                    <section className="rounded-lg border border-transparent bg-neutral-50 p-5">
                      <h3 className="text-[15px] font-semibold text-neutral-950">Lead information</h3>
                      <div className="mt-5 grid gap-4 text-[14px] sm:grid-cols-2">
                        {[
                          ["name", "Client name"],
                          ["phone", "Phone"],
                          ["email", "Email"],
                          ["eventType", "Event type"],
                          ["city", "City"],
                          ["guests", "Guests"],
                          ["quoteAmount", "Quote / amount"],
                          ["budget", "Budget range"],
                          ["eventDate", "Event date"],
                          ["due", "Due"],
                          ["savedAt", "Date added"]
                        ].map(([field, label]) => (
                          <div key={field}>
                            <label className="mb-2 block text-[12px] font-normal text-neutral-500">{label}</label>
                            <input
                              value={selectedVendorLead[field] || ""}
                              onChange={(event) => updateSelectedVendorLeadField(field, event.target.value)}
                              className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[14px] font-normal outline-none"
                            />
                          </div>
                        ))}
                        <div className="sm:col-span-2">
                          <label className="mb-2 block text-[12px] font-normal text-neutral-500">Service needed</label>
                          <textarea
                            value={selectedVendorLead.serviceDetails || ""}
                            onChange={(event) => updateSelectedVendorLeadField("serviceDetails", event.target.value)}
                            className="min-h-28 w-full rounded-lg border border-neutral-200 bg-white px-3 py-3 text-[14px] font-normal leading-6 outline-none"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="mb-2 block text-[12px] font-normal text-neutral-500">Vendor notes</label>
                          <textarea
                            value={selectedVendorLead.notes || ""}
                            onChange={(event) => updateSelectedVendorLeadField("notes", event.target.value)}
                            className="min-h-24 w-full rounded-lg border border-neutral-200 bg-white px-3 py-3 text-[14px] font-normal leading-6 outline-none"
                          />
                        </div>
                      </div>
                    </section>
                    <section className="rounded-lg border border-transparent bg-neutral-50 p-5">
                      <h3 className="text-[15px] font-semibold text-neutral-950">Status</h3>
                      <div className="mt-5 space-y-5">
                        <div>
                          <label className="mb-2 block text-[12px] font-normal text-neutral-500">Lead status</label>
                          <VendorSelect
                            id="selected-lead-status"
                            value={selectedVendorLead.status || "New inquiry"}
                            options={vendorLeadStatuses}
                            onChange={updateSelectedVendorLeadStatus}
                          />
                          <span className={`mt-3 inline-flex h-7 w-28 items-center justify-center rounded-full border px-3 text-xs font-medium ${statusBadgeClass(selectedVendorLead.status || "New inquiry")}`}>
                            {selectedVendorLead.status || "New inquiry"}
                          </span>
                        </div>
                        <div>
                          <label className="mb-2 block text-[12px] font-normal text-neutral-500">Create new status</label>
                          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_88px]">
                            <input
                              value={vendorLeadCustomStatus}
                              onChange={(event) => setVendorLeadCustomStatus(event.target.value)}
                              placeholder="Add custom status"
                              className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[14px] font-normal outline-none"
                            />
                            <button type="button" onClick={addVendorLeadStatus} className={`${compactSecondaryButtonClass} h-11`}>Add</button>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showVendorLeadForm && vendorLeadDraft && (
            <div className="fixed bottom-0 left-0 right-0 top-16 z-[90] border-t border-neutral-200 bg-white lg:left-64">
              <div className="flex h-full w-full flex-col overflow-hidden bg-white">
                <div className="shrink-0 border-b border-neutral-200 bg-white px-6 py-3">
                  <div className="flex w-full max-w-[1400px] items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setShowVendorLeadForm(false)}
                      aria-label="Back to leads"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <button type="button" onClick={saveVendorLeadDraft} className={compactPrimaryButtonClass}>Create lead</button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-32 pt-6 lg:pb-6">
                  <div className="mb-8 w-full max-w-[1400px]">
                    <h2 className="vendor-listing-editor-title text-[22px] font-semibold leading-tight text-neutral-950">Create lead</h2>
                    <p className="mt-1.5 text-sm text-neutral-500">Add a manual inquiry to your vendor pipeline.</p>
                  </div>
                  <div className="grid w-full max-w-[1400px] gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                    <section className="rounded-lg border border-transparent bg-neutral-50 p-5">
                      <h3 className="text-[15px] font-semibold text-neutral-950">Lead information</h3>
                      <div className="mt-5 grid gap-5 md:grid-cols-2">
                        {[
                          ["name", "Client name"],
                          ["phone", "Phone number"],
                          ["email", "Email"],
                          ["eventType", "Event type"],
                          ["city", "City"],
                          ["guests", "Guests"],
                          ["budget", "Budget range"],
                          ["quoteAmount", "Quote / amount"],
                          ["eventDate", "Event date"],
                          ["due", "Due"]
                        ].map(([field, label]) => (
                          <div key={field}>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">{label}</label>
                            <input
                              value={vendorLeadDraft[field] || ""}
                              onChange={(event) => setVendorLeadDraft((current) => ({ ...current, [field]: event.target.value }))}
                              className={fieldClass}
                            />
                          </div>
                        ))}
                        <div className="md:col-span-2">
                          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Service details</label>
                          <textarea
                            value={vendorLeadDraft.serviceDetails || ""}
                            onChange={(event) => setVendorLeadDraft((current) => ({ ...current, serviceDetails: event.target.value }))}
                            placeholder="Describe the exact service needed, event schedule, setup requirements, culture/music/menu notes, decision timeline, and any client expectations."
                            className={`${fieldClass} min-h-32`}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Vendor notes</label>
                          <textarea
                            value={vendorLeadDraft.notes || ""}
                            onChange={(event) => setVendorLeadDraft((current) => ({ ...current, notes: event.target.value }))}
                            placeholder="Internal notes for follow-up, quote terms, objections, documents needed, or next action."
                            className={`${fieldClass} min-h-24`}
                          />
                        </div>
                      </div>
                    </section>
                    <section className="rounded-lg border border-transparent bg-neutral-50 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-semibold text-neutral-950">Status</h3>
                          <p className="mt-1 text-xs text-neutral-500">Choose a lead stage or add a new one.</p>
                        </div>
                        <span className={`inline-flex h-7 w-28 items-center justify-center rounded-full border px-3 text-xs font-medium ${statusBadgeClass(vendorLeadDraft.status || "New inquiry")}`}>
                          {vendorLeadDraft.status || "New inquiry"}
                        </span>
                      </div>
                      <div className="mt-5 grid gap-3">
                        <VendorSelect
                          id="new-lead-status"
                          value={vendorLeadDraft.status || "New inquiry"}
                          options={vendorLeadStatuses}
                          onChange={(value) => setVendorLeadDraft((current) => ({ ...current, status: value }))}
                        />
                        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_88px]">
                          <input
                            value={vendorLeadCustomStatus}
                            onChange={(event) => setVendorLeadCustomStatus(event.target.value)}
                            placeholder="Add custom status"
                            className="h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none"
                          />
                          <button type="button" onClick={addVendorLeadStatus} className={`${compactSecondaryButtonClass} h-11`}>Add</button>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <nav className="fixed inset-x-0 bottom-0 z-[95] border-t border-neutral-200 bg-white/95 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden">
          <div className="grid grid-cols-6 gap-1">
            {vendorMobileBottomMenu.map((item) => {
              const isPrimaryActive = vendorASection === item.section;
              const isSettingsActive = item.section === "settings" && !["dashboard", "listings", "leads", "clients", "analytics"].includes(vendorASection);
              const isActive = isPrimaryActive || isSettingsActive;
              return (
                <button
                  key={item.section}
                  type="button"
                  onClick={() => (item.section === "settings" ? navigateVendorSection("settings") : navigateVendorSection(item.section))}
                  className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition-colors ${
                    isActive ? "bg-neutral-100 text-neutral-950" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950"
                  }`}
                >
                  <item.icon size={18} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
      </div>
    );
  };

  const VendorConceptB = () => {
    const vendor = vendorData?.vendor;
    const leads = vendorData?.openLeads || [];
    const [vendorBSection, setVendorBSection] = useState("dashboard");
    const analyticsCards = [
      { label: "Views Today", val: vendor?.metrics.profileViewsToday ?? 0 },
      { label: "Views This Week", val: vendor?.metrics.profileViewsWeek ?? 0 },
      { label: "Open Leads", val: vendor?.metrics.leadsOpen ?? 0 },
      { label: "Response Time", val: vendor?.metrics.responseTime ?? "New" }
    ];
    const vendorDashboardSectionMap = {
      Dashboard: "dashboard",
      Listings: "listings",
      Analytics: "analytics"
    };
    const sectionTitle =
      vendorBSection === "dashboard"
        ? "Vendor Dashboard"
        : vendorBSection === "analytics"
          ? "Analytics"
          : "Listings";
    const sectionDescription =
      vendorBSection === "dashboard"
        ? "Track leads, visibility, and performance in one place."
        : vendorBSection === "analytics"
          ? "View trends and performance signals for your listing."
          : "Manage all vendor and service listings in one place.";

    return (
    <div className="pt-20 min-h-screen bg-[#f5f5f5] flex">
      <div className="w-80 bg-white border-r border-neutral-200 fixed bottom-0 top-20 flex flex-col z-10 shadow-lg shadow-black/5">
        <div className="p-8 pb-4">
          <h2 className="text-xl font-bold tracking-tight mb-6">Profile Settings</h2>
          <div className="bg-neutral-50 p-4 rounded-md border border-neutral-100 flex justify-between items-center mb-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Profile Health</div>
              <div className="text-lg font-bold text-black mt-1">92% Complete</div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-neutral-200 flex items-center justify-center">
              <CheckCircle size={14} className="text-green-500" />
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {vendorDashboardMenu.map((item, index) => (
            <button
              key={index}
              onClick={() => setVendorBSection(vendorDashboardSectionMap[item.label] || "dashboard")}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                vendorBSection === (vendorDashboardSectionMap[item.label] || "dashboard")
                  ? "bg-black text-white shadow-md"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} /> {item.label}
              </div>
              {item.badge && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold leading-none text-black">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 px-4 py-2">Public Profile</div>
            {vendorPublicProfileMenu.map((item, index) => (
              <div
                key={item.section}
                onClick={() => setVendorBSection("profile")}
                className={`px-4 py-3 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                  vendorBSection === "profile" && index === 3 ? "bg-black text-white shadow-md" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>

          <div className="pt-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 px-4 py-2">Account & Preferences</div>
            {vendorAccountMenu.map((item) => (
              <div key={item.section} className="px-4 py-3 rounded-md text-sm font-medium cursor-pointer text-neutral-600 hover:bg-neutral-100">
                {item.label}
              </div>
            ))}
          </div>

          <div className="mt-auto border-t border-neutral-100 pt-4">
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm font-medium text-neutral-600 hover:bg-neutral-100">
              <Settings size={18} /> Account Settings
            </button>
            <button
              onClick={() => {
                clearSession();
                setSession(null);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </nav>
      </div>

      <div className="ml-80 flex-1 flex flex-col min-h-[calc(100vh-80px)]">
        <div className="bg-white border-b border-neutral-200 px-10 py-5 flex justify-between items-center sticky top-20 z-40">
          <div>
            <h3 className="text-lg font-bold">{sectionTitle}</h3>
            <p className="text-xs text-neutral-500 mt-1">{sectionDescription}</p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors">
              <Eye size={14} /> Preview Live
            </button>
            <button onClick={saveVendorProfile} className="bg-black text-white px-8 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 shadow-md">
              Save Changes
            </button>
          </div>
        </div>

        {vendorBSection === "dashboard" && (
          <div className="p-10 max-w-7xl">
            <div className="grid grid-cols-4 gap-4 mb-8">
              {analyticsCards.map((stat) => (
                <div key={stat.label} className="bg-white border border-neutral-200 rounded-sm p-5 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">{stat.label}</div>
                  <div className="text-2xl font-bold">{stat.val}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-white border border-neutral-200 shadow-sm rounded-sm">
                <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
                  <h3 className="font-bold text-lg">Active Leads Funnel</h3>
                  <button className="text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-500 hover:text-black">View All</button>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50">
                    <tr className="text-neutral-400 text-[10px] uppercase tracking-widest">
                      <th className="px-6 py-4 font-bold">Client Name</th>
                      <th className="px-6 py-4 font-bold">Event Type & Date</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, index) => (
                      <tr key={index} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="px-6 py-4 font-bold flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200 flex items-center justify-center text-xs">
                            {lead.name.charAt(0)}
                          </div>
                          {lead.name}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-black">{lead.eventType}</div>
                          <div className="text-xs text-neutral-500 mt-1">{lead.due}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-black text-white">
                            {index === 0 ? "New Inquiry" : index === 1 ? "Quote Sent" : "Follow Up"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="col-span-1 bg-white border border-neutral-200 shadow-sm rounded-sm p-6">
                <h3 className="text-lg font-bold mb-4">Performance Snapshot</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Profile Views</span>
                    <span className="font-bold">{vendor?.metrics.profileViewsMonth ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Bookings This Month</span>
                    <span className="font-bold">{vendor?.metrics.bookingsMonth ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Current Price</span>
                    <span className="font-bold">{money(vendorForm?.priceFrom || vendor?.priceFrom)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Active Services</span>
                    <span className="font-bold">{vendorServices.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {vendorBSection === "analytics" && (
          <div className="p-10 max-w-7xl">
            <div className="grid grid-cols-4 gap-4 mb-8">
              {analyticsCards.map((stat) => (
                <div key={stat.label} className="bg-white border border-neutral-200 rounded-sm p-5 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">{stat.label}</div>
                  <div className="text-2xl font-bold">{stat.val}</div>
                </div>
              ))}
            </div>
            <div className="bg-white border border-neutral-200 shadow-sm rounded-sm p-6">
              <h3 className="font-bold text-lg mb-4">Lead Volume Trend</h3>
              <div className="h-52 flex items-end gap-2">
                {[18, 24, 22, 29, 34, 31, 37, 42, 38, 45, 41, 48].map((value, index) => (
                  <div key={index} className="flex-1 bg-neutral-200 hover:bg-black transition-colors" style={{ height: `${value * 3}px` }} />
                ))}
              </div>
              <p className="text-xs text-neutral-500 mt-4">Weekly lead signals across your listing profile and service packages.</p>
            </div>
          </div>
        )}

        {vendorBSection === "listings" && (
          <div className="p-10 max-w-7xl">
            <VendorListingsTable compact />
          </div>
        )}

        <div className={`p-10 max-w-7xl ${vendorBSection === "profile" ? "block" : "hidden"}`}>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {analyticsCards.map((stat) => (
              <div key={stat.label} className="bg-white border border-neutral-200 rounded-sm p-5 shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.val}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-neutral-200 shadow-sm p-8 rounded-sm">
            <div className="mb-6 flex justify-between items-end">
              <label className="text-sm font-bold">Cover Photo</label>
              <button className="text-[10px] font-bold uppercase tracking-widest border border-neutral-300 px-4 py-1.5 hover:bg-neutral-50 flex items-center gap-2">
                <UploadCloud size={14} /> Replace Cover
              </button>
            </div>
            <div className="w-full aspect-[21/9] bg-neutral-100 relative mb-12 overflow-hidden border border-neutral-200 group">
              <SafeImage src={vendorData?.vendor.image || IMG_GALLERY1} className="w-full h-full object-cover" alt="Cover" fallback={IMG_GALLERY1} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-widest">Edit Image</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-2">Business Name</label>
                <input
                  value={vendorForm?.businessName || ""}
                  onChange={(event) => setVendorForm((current) => ({ ...current, businessName: event.target.value }))}
                  className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-2">Category</label>
                <input
                  value={vendorForm?.category || ""}
                  onChange={(event) => setVendorForm((current) => ({ ...current, category: event.target.value }))}
                  className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-2">City</label>
                <input
                  value={vendorForm?.city || ""}
                  onChange={(event) => setVendorForm((current) => ({ ...current, city: event.target.value }))}
                  className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-2">Starting Price</label>
                <input
                  value={vendorForm?.priceFrom || ""}
                  onChange={(event) => setVendorForm((current) => ({ ...current, priceFrom: event.target.value }))}
                  className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-2">Email</label>
                <input
                  value={vendorForm?.email || ""}
                  onChange={(event) => setVendorForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-2">Phone</label>
                <input
                  value={vendorForm?.phone || ""}
                  onChange={(event) => setVendorForm((current) => ({ ...current, phone: event.target.value }))}
                  className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-2">WhatsApp</label>
                <input
                  value={vendorForm?.whatsapp || ""}
                  onChange={(event) => setVendorForm((current) => ({ ...current, whatsapp: event.target.value }))}
                  className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div className="mb-10">
              <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-2">Short Description</label>
              <textarea
                value={vendorForm?.description || ""}
                onChange={(event) => setVendorForm((current) => ({ ...current, description: event.target.value }))}
                className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none min-h-28"
              />
            </div>

            <div className="mb-10 border-t border-neutral-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <label className="text-sm font-bold block mb-1">Services & Packages</label>
                  <span className="text-xs text-neutral-500">Build multiple sellable services inside the same vendor profile.</span>
                </div>
                <button onClick={addVendorService} className="text-[10px] font-bold uppercase tracking-widest border border-neutral-300 px-4 py-2 hover:bg-neutral-50">
                  Add Service
                </button>
              </div>

              <div className="space-y-4">
                {vendorServices.map((service, index) => (
                  <div key={service.id} className="border border-neutral-200 bg-neutral-50 p-5">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400">Service {index + 1}</div>
                      {vendorServices.length > 1 && (
                        <button onClick={() => removeVendorService(service.id)} className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-black">
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-2">Service Name</label>
                        <input
                          value={service.name}
                          onChange={(event) => updateVendorService(service.id, "name", event.target.value)}
                          className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-2">Service Area</label>
                        <input
                          value={service.area}
                          onChange={(event) => updateVendorService(service.id, "area", event.target.value)}
                          className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-2">Starting Price</label>
                        <input
                          value={service.priceFrom}
                          onChange={(event) => updateVendorService(service.id, "priceFrom", event.target.value)}
                          className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-2">Turnaround</label>
                        <input
                          value={service.turnaround}
                          onChange={(event) => updateVendorService(service.id, "turnaround", event.target.value)}
                          className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-2">Service Summary</label>
                        <textarea
                          value={service.description}
                          onChange={(event) => updateVendorService(service.id, "description", event.target.value)}
                          className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none min-h-24"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6 flex justify-between items-end">
              <div>
                <label className="text-sm font-bold block mb-1">Portfolio Grid</label>
                <span className="text-xs text-neutral-500">Drag to reorder. Maximum 12 images.</span>
              </div>
              <span className="text-xs font-medium text-neutral-500">{saveState}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[IMG_GALLERY2, IMG_DECOR, IMG_VENUE, IMG_FOOD].map((img, index) => (
                <div key={index} className="aspect-square bg-neutral-100 relative group overflow-hidden border border-neutral-200">
                  <SafeImage src={img} className="w-full h-full object-cover" alt="Portfolio" fallback={IMG_EDITORIAL} />
                  <div className="absolute top-2 right-2 bg-white p-1.5 shadow-md text-neutral-400 opacity-0 group-hover:opacity-100 cursor-move transition-opacity">
                    <GripHorizontal size={14} />
                  </div>
                </div>
              ))}
              <div className="aspect-square bg-neutral-50 border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-neutral-100 transition-colors group">
                <Plus size={24} className="text-neutral-400 group-hover:text-black mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 group-hover:text-black">Upload</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="col-span-2 bg-white border border-neutral-200 shadow-sm rounded-sm">
              <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Lead Inbox Snapshot</h3>
                  <p className="text-xs text-neutral-500 mt-1">Settings-first view with analytics and active inquiries still in reach.</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Analytics dashboard focus</span>
              </div>
              <div className="divide-y divide-neutral-100">
                {leads.map((lead, index) => (
                  <div key={index} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-sm">{lead.name}</div>
                      <div className="text-xs text-neutral-500 mt-1">
                        {lead.eventType} • {lead.city} • {lead.guests} guests
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{lead.due}</div>
                      <div className="text-sm font-medium text-black mt-1">{lead.budget}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-1 bg-white border border-neutral-200 shadow-sm rounded-sm p-6">
              <h3 className="text-lg font-bold mb-4">Performance Snapshot</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Profile Views</span>
                  <span className="font-bold">{vendor?.metrics.profileViewsMonth ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Bookings This Month</span>
                  <span className="font-bold">{vendor?.metrics.bookingsMonth ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Current Price</span>
                  <span className="font-bold">{money(vendorForm?.priceFrom || vendor?.priceFrom)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Active Services</span>
                  <span className="font-bold">{vendorServices.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  };

  const adminCoreNav = [
    { label: "Overview", section: "overview", icon: Globe },
    { label: "Vendors", section: "vendors", icon: Building2 },
    { label: "Applications", section: "vendor-queue", icon: ShieldCheck },
    { label: "Requests", section: "requests", icon: MessageSquare },
    { label: "Reviews", section: "reviews", icon: Star },
    { label: "Analytics", section: "analytics", icon: BarChart3 }
  ];
  const adminManagementNav = [
    { label: "Featured Placements", section: "featured" },
    { label: "Audit Log", section: "audit" },
    { label: "Permissions", section: "permissions" }
  ];
  const adminSectionMeta = {
    overview: ["Operations Overview", "Admin Control Workspace", "Moderation, requests, featured placements, and analytics in one workspace."],
    vendors: ["Vendor Directory", "Approved Vendors", "Browse approved and verified marketplace vendors, public profile health, pricing, cities, and placement state."],
    "vendor-queue": ["Applications", "Vendor Applications", "Review new vendor applications, flagged profiles, trust signals, and profile completeness."],
    requests: ["Requests", "Requests and Vendor Messaging", "Track support tickets, help requests, assistance requests, and vendor feature requests."],
    reviews: ["Reviews", "Review Moderation", "Approve, reject, or hide client reviews before they appear on vendor listing pages."],
    analytics: ["Analytics", "Marketplace Analytics", "Monitor marketplace health, coverage, vendor quality, and operating activity."],
    featured: ["Featured", "Featured Placements", "Manage homepage and archive placement slots for approved vendors."],
    audit: ["Audit", "Audit Log", "Track recent admin actions and review history."],
    permissions: ["Permissions", "Admin Permissions", "Manage operating roles and access boundaries for the admin workspace."],
    settings: ["Settings", "Admin Settings", "Configure workflow statuses, review controls, and core admin workspace rules."]
  };
  const adminSettingsSectionMeta = {
    general: ["Settings", "Platform Settings", "Manage platform configuration and preferences."],
    notifications: ["Settings", "Notifications", "Control what the admin team and vendors are notified about."],
    security: ["Settings", "Security", "Configure authentication, access controls, and platform credentials."],
    appearance: ["Settings", "Appearance", "Adjust marketplace presentation, browse defaults, and visual preferences."],
    moderation: ["Settings", "Moderation", "Manage submission rules, request workflows, and vendor application controls."]
  };
  const [adminEyebrow, adminTitle, adminDescription] = adminSection === "settings"
    ? adminSettingsSectionMeta[adminSettingsSection] || adminSectionMeta.settings
    : adminSectionMeta[adminSection] || adminSectionMeta.overview;

  const AdminConceptB = () => {
    const adminFilterTabs = [
      { key: "requests", label: "Requests" },
      { key: "flagged", label: "Flagged" },
      { key: "all", label: "All" }
    ];
    const requestFilterTabs = [...adminRequestStatuses.map((status) => ({ key: status.key, label: status.label })), { key: "all", label: "All" }];
    const statusToneOptions = [
      { key: "neutral", label: "Neutral" },
      { key: "blue", label: "Blue" },
      { key: "amber", label: "Amber" },
      { key: "green", label: "Green" },
      { key: "red", label: "Red" }
    ];
    const adminFilterTabClass = (active) =>
      `inline-flex h-9 items-center rounded-full border px-4 text-[14px] font-medium leading-none transition-colors ${
        active ? "border-black bg-black text-white" : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-black"
      }`;
    const adminSortSelectClass =
      "h-9 appearance-none rounded-md border border-neutral-200 bg-white pl-3 pr-10 text-sm font-medium normal-case tracking-normal text-neutral-800 outline-none";
    const priorityWeight = { High: 3, Medium: 2, Normal: 1 };
    const sortedApplicationRows = [...adminFilteredVendors].sort((a, b) => {
      if (adminApplicationSort === "priority") {
        const aPriority = a.status === "pending" || adminFollowUpVendorIds.includes(a.id) ? 3 : vendorRisk(a) === "High" ? 2 : 1;
        const bPriority = b.status === "pending" || adminFollowUpVendorIds.includes(b.id) ? 3 : vendorRisk(b) === "High" ? 2 : 1;
        return bPriority - aPriority;
      }
      return adminVendors.indexOf(a) - adminVendors.indexOf(b);
    });
    const vendorRows = adminSection === "overview" ? sortedApplicationRows.slice(0, 5) : sortedApplicationRows;
    const filteredAdminRequests = adminRequests
      .filter((request) => adminRequestFilter === "all" || request.status === adminRequestFilter)
      .sort((a, b) => {
        if (adminRequestSort === "priority") return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
        return a.dateRank - b.dateRank;
      });
    const requestRows = adminSection === "overview" ? filteredAdminRequests.slice(0, 5) : filteredAdminRequests;
    const approvedCount = adminVendors.filter((vendor) => vendor.status === "approved").length;
    const pendingCount = adminVendors.filter((vendor) => vendor.status === "pending").length;
    const flaggedCount = adminVendors.filter((vendor) => vendorRisk(vendor) !== "Low").length;
    const featuredCount = adminVendors.filter((vendor) => vendor.featured).length;
    const featuredVendorRows = adminVendors.filter((vendor) => vendor.featured);
    const approvedVerifiedVendors = adminVendors.filter((vendor) => vendor.status === "approved" && vendor.verified);
    const featureSearchQuery = adminFeatureSearch.trim().toLowerCase();
    const featuredCandidateRows = adminVendors
      .filter((vendor) => vendor.status === "approved" && !vendor.featured)
      .filter((vendor) => {
        if (!featureSearchQuery) return true;
        return [vendor.businessName, vendor.category, vendor.city, vendor.province]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(featureSearchQuery);
      })
      .slice(0, 12);
    const verifiedCities = new Set(approvedVerifiedVendors.map((vendor) => vendor.city).filter(Boolean)).size;
    const verifiedCategories = new Set(approvedVerifiedVendors.map((vendor) => vendor.category).filter(Boolean)).size;
    const totalVendorValue = adminVendors.reduce((sum, vendor) => sum + Number(vendor.priceFrom || 0), 0);
    const averageCompleteness = Math.round(
      adminVendors.reduce((sum, vendor) => sum + vendorCompleteness(vendor), 0) / Math.max(1, adminVendors.length)
    );
    const adminKpis = [
      { label: "Gross listing value", value: money(totalVendorValue), meta: "Published vendor starting prices", icon: TrendingUp, delta: "+12%" },
      { label: "Active vendors", value: approvedCount, meta: `${adminVendors.length} total records`, icon: Users, delta: "+8%" },
      { label: "Profile health", value: `${averageCompleteness}%`, meta: "Average application completion", icon: CheckCircle, delta: "+5%" },
      { label: "Moderation load", value: flaggedCount + pendingCount, meta: "Pending or flagged records", icon: ClipboardList, delta: "-4%" }
    ];
    const pipelineStats = [
      { label: "Pending review", value: pendingCount, icon: Clock, tone: "amber" },
      { label: "Approved live", value: approvedCount, icon: CheckCircle, tone: "green" },
      { label: "Featured slots", value: featuredCount, icon: Star, tone: "blue" },
      { label: "Quality flags", value: flaggedCount, icon: Shield, tone: "red" }
    ];
    const weeklyRevenue = [34, 72, 46, 58, 84, 28, 43];
    const weeklyTraffic = [128, 184, 162, 236, 214, 146, 198];
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const trafficMax = Math.max(...weeklyTraffic);
    const trafficPoints = weeklyTraffic
      .map((value, index) => {
        const x = 28 + index * 56;
        const y = 174 - (value / trafficMax) * 132;
        return `${x},${y}`;
      })
      .join(" ");
    const analyticsRangeOptions = [
      { key: "7d", label: "7 days", multiplier: 0.32 },
      { key: "30d", label: "30 days", multiplier: 1 },
      { key: "90d", label: "3 months", multiplier: 2.8 },
      { key: "12m", label: "12 months", multiplier: 8.4 }
    ];
    const activeAnalyticsRange = analyticsRangeOptions.find((item) => item.key === adminAnalyticsRange) || analyticsRangeOptions[1];
    const rangeScale = activeAnalyticsRange.multiplier;
    const totalApplications = adminVendors.length;
    const approvedRate = Math.round((approvedCount / Math.max(1, totalApplications)) * 100);
    const featuredShare = Math.round((featuredCount / Math.max(1, approvedCount)) * 100);
    const requestBacklog = adminRequests.filter((request) => request.status !== completedRequestStatusKey).length;
    const riskCounts = ["High", "Medium", "Low"].map((risk) => ({
      risk,
      count: adminVendors.filter((vendor) => vendorRisk(vendor) === risk).length
    }));
    const requestStatusRows = adminRequestStatuses.map((status) => ({
      status,
      count: adminRequests.filter((request) => request.status === status.key).length
    }));
    const analyticsKpis = [
      { label: "Marketplace value", value: money(Math.round(totalVendorValue * rangeScale)), meta: `${activeAnalyticsRange.label} tracked value`, icon: TrendingUp, delta: "+12%" },
      { label: "Approval rate", value: `${approvedRate}%`, meta: `${approvedCount} approved of ${Math.max(1, totalApplications)}`, icon: ShieldCheck, delta: "+4%" },
      { label: "Request backlog", value: requestBacklog, meta: "Open vendor support work", icon: MessageSquare, delta: requestBacklog > 2 ? "+3" : "-1" },
      { label: "Featured share", value: `${featuredShare}%`, meta: `${featuredCount} promoted placements`, icon: Star, delta: "+6%" }
    ];
    const monthlyValueTrend = [42, 51, 48, 64, 72, 68, 84, 91, 88, 104, 112, 126].map((value) => Math.round(value * rangeScale));
    const monthlyLeadTrend = [18, 24, 21, 29, 34, 31, 38, 42, 39, 45, 49, 54].map((value) => Math.round(value * Math.max(0.65, rangeScale * 0.72)));
    const trendLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trendMax = Math.max(...monthlyValueTrend, 1);
    const leadMax = Math.max(...monthlyLeadTrend, 1);
    const funnelRows = [
      { label: "Applications received", value: totalApplications, width: 100 },
      { label: "Profile complete", value: adminVendors.filter((vendor) => vendorCompleteness(vendor) >= 85).length, width: Math.round((adminVendors.filter((vendor) => vendorCompleteness(vendor) >= 85).length / Math.max(1, totalApplications)) * 100) },
      { label: "Approved live", value: approvedCount, width: Math.round((approvedCount / Math.max(1, totalApplications)) * 100) },
      { label: "Featured", value: featuredCount, width: Math.round((featuredCount / Math.max(1, totalApplications)) * 100) }
    ];
    const topVendorRows = [...approvedVerifiedVendors]
      .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
      .slice(0, 6);
    const qualityWatchRows = [...adminVendors]
      .sort((a, b) => vendorCompleteness(a) - vendorCompleteness(b))
      .slice(0, 6);

    const AdminVendorTable = () => (
      <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {adminSection === "overview" && (
          <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-6 py-5">
            <h2 className="text-lg font-medium">Applications</h2>
            <button type="button" onClick={() => navigateAdminSection("vendor-queue")} className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium">
              View all applications
              <ChevronRight size={15} />
            </button>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-6 py-4">
          <div className="flex flex-wrap justify-start gap-2">
            {adminFilterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setAdminStatusFilter(tab.key)}
                className={adminFilterTabClass(adminStatusFilter === tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {adminSection !== "overview" && (
            <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
              Sort
              <span className="relative inline-flex">
                <select value={adminApplicationSort} onChange={(event) => setAdminApplicationSort(event.target.value)} className={adminSortSelectClass}>
                  <option value="date">Newest</option>
                  <option value="priority">Priority</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              </span>
            </label>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="bg-neutral-50 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Vendor</th>
                <th className="px-6 py-4 font-semibold">Market</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Profile Health</th>
                <th className="px-6 py-4 font-semibold">Starting Price</th>
                <th className="px-6 py-4 font-semibold">Risk</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {vendorRows.map((item) => {
                const risk = vendorRisk(item);
                const complete = vendorCompleteness(item);
                const reviewStatusMeta = findStatusMeta(adminApplicationStatuses, item.reviewStatus || item.status, item.reviewStatus || item.status);
                return (
                  <tr key={item.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div>
                        <button type="button" onClick={() => setSelectedAdminVendorId(item.id)} className="block text-left font-medium text-neutral-950 hover:underline">{item.businessName}</button>
                        <div className="mt-1 text-xs text-neutral-500">{item.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-700">{item.city}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex h-7 min-w-24 items-center justify-center rounded-full border px-3 text-[11px] font-medium ${statusToneChipClass(reviewStatusMeta?.tone)}`}>{reviewStatusMeta?.label || item.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 rounded-full bg-neutral-100">
                          <div className={`h-2 rounded-full ${profileHealthBarClass(complete)}`} style={{ width: `${complete}%` }} />
                        </div>
                        <span className="font-medium">{complete}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{money(item.priceFrom || 0)}</td>
                    <td className={`px-6 py-4 font-medium ${risk === "High" ? "text-red-600" : risk === "Medium" ? "text-amber-600" : "text-green-600"}`}>{risk}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === "approved" ? (
                          <button type="button" onClick={() => toggleVendorFeatured(item.id, !item.featured)} className="inline-flex h-10 w-28 items-center justify-center rounded-md border border-neutral-200 bg-white px-3.5 text-sm font-medium">{item.featured ? "Unfeature" : "Feature"}</button>
                        ) : (
                          <>
                            {adminSection !== "overview" && (
                              <button type="button" onClick={() => setSelectedAdminVendorId(item.id)} className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-200 bg-white px-3.5 text-sm font-medium">
                                Review
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => toggleAdminVendorFollowUp(item.id)}
                              className={flagButtonClass(adminFollowUpVendorIds.includes(item.id))}
                              aria-label={adminFollowUpVendorIds.includes(item.id) ? "Remove vendor flag" : "Flag vendor"}
                              title={adminFollowUpVendorIds.includes(item.id) ? "Flagged" : "Flag"}
                            >
                              <Flag size={16} className={adminFollowUpVendorIds.includes(item.id) ? "fill-current" : ""} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {vendorRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-neutral-100 text-neutral-500">
                      <ClipboardList size={20} />
                    </div>
                    <div className="mt-4 text-sm font-medium text-neutral-950">
                      {adminStatusFilter === "requests" ? "No pending vendor requests" : "No vendors match this view"}
                    </div>
                    <div className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
                      {adminStatusFilter === "requests"
                        ? "New vendor applications will appear here when businesses submit registration requests."
                        : "Try another queue filter to review vendor records."}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );

    const VendorsDirectoryView = () => (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Total verified vendors", value: approvedVerifiedVendors.length, meta: "Approved and visible in marketplace", icon: CheckCircle },
            { label: "Verified cities", value: verifiedCities, meta: "Markets with active vendor supply", icon: MapPin },
            { label: "Service categories", value: verifiedCategories, meta: "Approved category coverage", icon: Building2 }
          ].map((card) => (
            <section key={card.label} className="rounded-lg border border-neutral-200 bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-100 text-black">
                <card.icon size={18} />
              </div>
              <div className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">{card.label}</div>
              <div className="mt-2 text-2xl font-medium text-neutral-950">{card.value}</div>
              <div className="mt-1 text-xs text-neutral-500">{card.meta}</div>
            </section>
          ))}
        </div>

        <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 px-6 py-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-medium">Approved and Verified Vendors</h2>
              <p className="mt-1 text-sm text-neutral-500">Live vendor directory for marketplace-ready businesses.</p>
            </div>
            <button type="button" onClick={() => setSaveState("Verified vendor export prepared")} className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-200 bg-white px-3.5 text-sm font-medium">Export vendors</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full text-left text-sm">
              <thead className="bg-neutral-50 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Vendor</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">City</th>
                  <th className="px-6 py-4 font-semibold">Rating</th>
                  <th className="px-6 py-4 font-semibold">Starting Price</th>
                  <th className="px-6 py-4 font-semibold">Profile Health</th>
                  <th className="px-6 py-4 font-semibold">Placement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {approvedVerifiedVendors.map((vendor, index) => {
                  const complete = vendorCompleteness(vendor);
                  return (
                    <tr key={vendor.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-neutral-200">
                            <SafeImage src={vendor.image || [IMG_FOOD, IMG_DJ, IMG_DECOR, IMG_VENUE][index % 4]} alt={vendor.businessName} className="h-full w-full object-cover" fallback={imageForCategory(vendor.category)} />
                          </div>
                          <div>
                            <button type="button" onClick={() => setSelectedAdminVendorId(vendor.id)} className="block text-left font-medium text-neutral-950 hover:underline">{vendor.businessName}</button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-700">{vendor.category}</td>
                      <td className="px-6 py-4 text-neutral-700">{vendor.city}</td>
                      <td className="px-6 py-4 font-medium">{vendor.rating || "N/A"}</td>
                      <td className="px-6 py-4 font-medium">{money(vendor.priceFrom || 0)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 rounded-full bg-neutral-100">
                            <div className={`h-2 rounded-full ${profileHealthBarClass(complete)}`} style={{ width: `${complete}%` }} />
                          </div>
                          <span className="font-medium">{complete}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex h-7 w-24 items-center justify-center rounded-full border px-3 text-[11px] font-medium ${vendor.featured ? "border-blue-200 bg-blue-50 text-blue-700" : "border-neutral-200 bg-neutral-50 text-neutral-600"}`}>
                          {vendor.featured ? "Featured" : "Standard"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );

    const RequestsView = () => (
      <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {adminSection === "overview" ? (
          <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-6 py-5">
            <h2 className="text-lg font-medium">Vendor Requests</h2>
            <button type="button" onClick={() => navigateAdminSection("requests")} className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium">
              View all requests
              <ChevronRight size={15} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col justify-between gap-3 border-b border-neutral-200 px-6 py-4 lg:flex-row lg:items-center">
            <div className="flex flex-wrap gap-2">
              {requestFilterTabs.map((status) => (
                <button
                  key={status.key}
                  type="button"
                  onClick={() => setAdminRequestFilter(status.key)}
                  className={adminFilterTabClass(adminRequestFilter === status.key)}
                >
                  {status.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                Sort
                <span className="relative inline-flex">
                  <select value={adminRequestSort} onChange={(event) => setAdminRequestSort(event.target.value)} className={adminSortSelectClass}>
                    <option value="date">Date</option>
                    <option value="priority">Priority</option>
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                </span>
              </label>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="bg-neutral-50 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Request</th>
                <th className="px-6 py-4 font-semibold">Request Type</th>
                <th className="px-6 py-4 font-semibold">Vendor Name</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Age</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {requestRows.map((request) => {
                const isFlaggedRequest = adminFollowUpRequestIds.includes(request.id);
                const requestStatusMeta = isFlaggedRequest
                  ? { label: "Flagged", tone: "red" }
                  : findStatusMeta(adminRequestStatuses, request.status, request.status);
                return (
                <tr key={request.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <button type="button" onClick={() => setAdminRequestReview({ ...request, note: request.adminNote || request.note || "", replyDraft: "" })} className="text-left font-medium text-neutral-950 hover:underline">
                      {request.subject}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-neutral-700">{request.type}</td>
                  <td className="px-6 py-4 text-neutral-700">{request.requester}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex h-7 w-24 items-center justify-center rounded-full border px-3 text-[11px] font-medium ${request.priority === "High" ? "border-red-200 bg-red-50 text-red-700" : request.priority === "Medium" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-blue-200 bg-blue-50 text-blue-700"}`}>{request.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex h-7 w-24 items-center justify-center rounded-full border px-3 text-[11px] font-medium ${statusToneChipClass(requestStatusMeta?.tone)}`}>
                      {requestStatusMeta?.label || request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">{request.age}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toggleAdminRequestFollowUp(request.id)}
                        className={flagButtonClass(isFlaggedRequest)}
                        aria-label={isFlaggedRequest ? "Remove request flag" : "Flag request"}
                        title={isFlaggedRequest ? "Flagged" : "Flag"}
                      >
                        <Flag size={16} className={isFlaggedRequest ? "fill-current" : ""} />
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
              {requestRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-neutral-100 text-neutral-500">
                      <MessageSquare size={20} />
                    </div>
                    <div className="mt-4 text-sm font-medium text-neutral-950">No active admin requests</div>
                    <div className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
                      Support tickets, help requests, assistance requests, and feature requests will appear here when they need action.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );

    const AdminReviewsView = () => {
      const reviewFilterTabs = [
        { key: "pending", label: "Pending" },
        { key: "approved", label: "Approved" },
        { key: "rejected", label: "Rejected" },
        { key: "hidden", label: "Hidden" },
        { key: "all", label: "All" }
      ];
      const filteredAdminReviews = reviewRows.filter((review) => adminReviewFilter === "all" || review.status === adminReviewFilter);
      const reviewStats = [
        { label: "Pending", value: reviewRows.filter((review) => review.status === "pending").length, tone: "amber" },
        { label: "Approved", value: reviewRows.filter((review) => review.status === "approved").length, tone: "green" },
        { label: "Rejected", value: reviewRows.filter((review) => review.status === "rejected").length, tone: "red" },
        { label: "Hidden", value: reviewRows.filter((review) => review.status === "hidden").length, tone: "neutral" }
      ];

      return (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {reviewStats.map((item) => (
              <section key={item.label} className="rounded-lg border border-neutral-200 bg-white p-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">{item.label}</div>
                <div className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">{item.value}</div>
              </section>
            ))}
          </div>

          <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <div className="flex flex-col justify-between gap-3 border-b border-neutral-200 px-6 py-4 lg:flex-row lg:items-center">
              <div className="flex flex-wrap gap-2">
                {reviewFilterTabs.map((tab) => (
                  <button key={tab.key} type="button" onClick={() => setAdminReviewFilter(tab.key)} className={adminFilterTabClass(adminReviewFilter === tab.key)}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="text-sm text-neutral-500">{filteredAdminReviews.length} reviews</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-left text-sm">
                <thead className="bg-neutral-50 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Reviewer</th>
                    <th className="px-6 py-4 font-semibold">Vendor</th>
                    <th className="px-6 py-4 font-semibold">Rating</th>
                    <th className="px-6 py-4 font-semibold">Event</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Submitted</th>
                    <th className="px-6 py-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredAdminReviews.map((review) => {
                    const meta = reviewStatusMeta(review.status);
                    const isSelected = selectedAdminReviewId === review.id;

                    return (
                      <tr
                        key={review.id}
                        className={`cursor-pointer transition-colors ${isSelected ? "bg-neutral-50" : "hover:bg-neutral-50"}`}
                        onClick={() => setSelectedAdminReviewId(review.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-neutral-950">{review.reviewerName}</div>
                          <div className="mt-1 text-[12px] text-neutral-500">{review.reviewerRole}</div>
                        </td>
                        <td className="px-6 py-4 text-neutral-700">{review.vendorName}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">{ratingStars(review.rating)}</div>
                        </td>
                        <td className="px-6 py-4 text-neutral-700">{review.eventType}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex h-7 min-w-24 items-center justify-center rounded-full border px-3 text-[11px] font-medium ${statusToneChipClass(meta.tone)}`}>
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-neutral-500">{review.submittedAt}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedAdminReviewId(review.id);
                              }}
                              className="inline-flex h-9 w-28 items-center justify-center rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium"
                            >
                              Open review
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredAdminReviews.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-14 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-neutral-100 text-neutral-500">
                          <Star size={20} />
                        </div>
                        <div className="mt-4 text-sm font-medium text-neutral-950">No reviews in this state</div>
                        <div className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
                          Submitted client reviews will appear here for approval before they go live on vendor listing pages.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      );
    };

    const CoveragePanel = ({ title, rows }) => (
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-medium">{title}</h2>
        <div className="mt-5 space-y-4">
          {rows.map((entry) => (
            <div key={entry.name}>
              <div className="flex items-center justify-between text-sm">
                <span>{entry.name}</span>
                <span className="font-medium">{entry.count}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-neutral-100">
                <div className="h-2 rounded-full bg-black" style={{ width: `${Math.min(100, entry.count * 14)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );

    const AdminAnalyticsView = () => (
      <div className="space-y-6">
        <section className="rounded-lg border border-neutral-200 bg-white">
          <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 px-6 py-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Marketplace Command Center</h2>
              <p className="mt-1 text-sm leading-6 text-neutral-500">Advanced view of marketplace value, vendor quality, coverage, requests, and conversion health.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {analyticsRangeOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setAdminAnalyticsRange(option.key)}
                  className={`inline-flex h-9 items-center rounded-full border px-3.5 text-[13px] font-medium transition-colors ${
                    adminAnalyticsRange === option.key ? "border-black bg-black text-white" : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-black"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid divide-y divide-neutral-100 md:grid-cols-4 md:divide-x md:divide-y-0">
            {analyticsKpis.map((card) => (
              <div key={card.label} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <card.icon size={18} className="text-neutral-800" />
                  <span className={`text-xs font-medium ${String(card.delta).startsWith("-") ? "text-red-500" : "text-green-600"}`}>{card.delta}</span>
                </div>
                <div className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">{card.label}</div>
                <div className="mt-2 text-2xl font-medium text-neutral-950">{card.value}</div>
                <div className="mt-1 text-xs leading-5 text-neutral-500">{card.meta}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.55fr)]">
          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Marketplace Value and Lead Momentum</h2>
                <p className="mt-1 text-sm text-neutral-500">Listing value compared with lead activity across the year.</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-neutral-500">
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-black" /> Value</span>
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-neutral-400" /> Leads</span>
              </div>
            </div>
            <div className="mt-8 grid min-h-[310px] grid-cols-12 items-end gap-3 border-b border-dashed border-neutral-200 pb-7">
              {monthlyValueTrend.map((value, index) => (
                <div key={trendLabels[index]} className="flex min-w-0 flex-col items-center gap-3">
                  <div className="flex h-56 w-full items-end justify-center gap-1.5">
                    <div className="w-full max-w-[26px] rounded-t-md bg-black" style={{ height: `${Math.max(18, (value / trendMax) * 210)}px` }} />
                    <div className="w-full max-w-[18px] rounded-t-md bg-neutral-300" style={{ height: `${Math.max(12, (monthlyLeadTrend[index] / leadMax) * 156)}px` }} />
                  </div>
                  <span className="text-[11px] text-neutral-500">{trendLabels[index]}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold tracking-tight">Conversion Funnel</h2>
            <p className="mt-1 text-sm leading-6 text-neutral-500">Application quality from submission to promoted placement.</p>
            <div className="mt-6 space-y-5">
              {funnelRows.map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-neutral-800">{row.label}</span>
                    <span className="text-neutral-500">{row.value}</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-neutral-100">
                    <div className="h-3 rounded-full bg-black" style={{ width: `${Math.max(6, row.width)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold tracking-tight">Category Coverage</h2>
            <p className="mt-1 text-sm text-neutral-500">Supply depth by service category.</p>
            <div className="mt-6 space-y-4">
              {adminCategoryCoverage.map((entry) => (
                <div key={entry.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-700">{entry.name}</span>
                    <span className="font-medium">{entry.count}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-neutral-100">
                    <div className="h-2 rounded-full bg-black" style={{ width: `${Math.min(100, Math.max(8, entry.count * 14))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold tracking-tight">City Coverage</h2>
            <p className="mt-1 text-sm text-neutral-500">Approved vendor availability by city.</p>
            <div className="mt-6 space-y-4">
              {adminCityCoverage.map((entry) => (
                <div key={entry.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-700">{entry.name}</span>
                    <span className="font-medium">{entry.count}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-neutral-100">
                    <div className="h-2 rounded-full bg-black" style={{ width: `${Math.min(100, Math.max(8, entry.count * 18))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold tracking-tight">Risk and Request Load</h2>
            <p className="mt-1 text-sm text-neutral-500">Operational pressure by quality risk and support status.</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {riskCounts.map((row) => (
                  <div key={row.risk} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                    <div className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${row.risk === "High" ? "text-red-600" : row.risk === "Medium" ? "text-amber-600" : "text-green-600"}`}>{row.risk} risk</div>
                    <div className="mt-2 text-2xl font-medium">{row.count}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {requestStatusRows.map((row) => (
                  <div key={row.status.key} className="rounded-lg border border-neutral-200 bg-white p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">{row.status.label}</div>
                    <div className="mt-2 text-2xl font-medium">{row.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-6 py-5">
              <h2 className="text-lg font-semibold tracking-tight">Top Performing Vendors</h2>
              <p className="mt-1 text-sm text-neutral-500">Approved vendors ranked by rating, placement, and profile health.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full text-left text-sm">
                <thead className="bg-neutral-50 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Vendor</th>
                    <th className="px-6 py-4 font-semibold">City</th>
                    <th className="px-6 py-4 font-semibold">Rating</th>
                    <th className="px-6 py-4 font-semibold">Value</th>
                    <th className="px-6 py-4 font-semibold">Health</th>
                    <th className="px-6 py-4 font-semibold">Placement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {topVendorRows.map((vendor) => {
                    const complete = vendorCompleteness(vendor);
                    return (
                      <tr key={vendor.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 font-medium text-neutral-950">{vendor.businessName}</td>
                        <td className="px-6 py-4 text-neutral-600">{vendor.city}</td>
                        <td className="px-6 py-4 font-medium">{vendor.rating || "N/A"}</td>
                        <td className="px-6 py-4 font-medium">{money(vendor.priceFrom || 0)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-24 rounded-full bg-neutral-100">
                              <div className={`h-2 rounded-full ${profileHealthBarClass(complete)}`} style={{ width: `${complete}%` }} />
                            </div>
                            <span className="text-xs font-medium">{complete}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex h-7 w-24 items-center justify-center rounded-full border px-3 text-[11px] font-medium ${vendor.featured ? "border-blue-200 bg-blue-50 text-blue-700" : "border-neutral-200 bg-neutral-50 text-neutral-600"}`}>
                            {vendor.featured ? "Featured" : "Standard"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-6 py-5">
              <h2 className="text-lg font-semibold tracking-tight">Quality Watchlist</h2>
              <p className="mt-1 text-sm text-neutral-500">Profiles with the most room to improve.</p>
            </div>
            <div className="divide-y divide-neutral-100">
              {qualityWatchRows.map((vendor) => {
                const complete = vendorCompleteness(vendor);
                return (
                  <button key={vendor.id} type="button" onClick={() => setSelectedAdminVendorId(vendor.id)} className="block w-full px-6 py-4 text-left hover:bg-neutral-50">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-medium text-neutral-950">{vendor.businessName}</div>
                        <div className="mt-1 text-xs text-neutral-500">{vendor.category} • {vendor.city}</div>
                      </div>
                      <span className={`text-sm font-medium ${complete < 50 ? "text-red-600" : complete < 85 ? "text-amber-600" : "text-green-600"}`}>{complete}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    );

    const renderStatusManagerCard = ({ title, description, statuses, draft, setDraft, onAdd, onRemove, onUpdate }) => (
      <section className="rounded-lg border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-6 py-5">
          <h2 className="text-lg font-medium">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-neutral-500">{description}</p>
        </div>
        <div className="space-y-3 px-6 py-5">
          {statuses.map((status) => (
            <div key={status.key} className="grid gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 md:grid-cols-[minmax(0,1fr)_160px_120px] md:items-center">
              <input
                type="text"
                value={status.label}
                onChange={(event) => onUpdate(status.key, "label", event.target.value)}
                className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm outline-none"
              />
              <label className="relative">
                <select
                  value={status.tone}
                  onChange={(event) => onUpdate(status.key, "tone", event.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-neutral-200 bg-white pl-3 pr-10 text-sm outline-none"
                >
                  {statusToneOptions.map((option) => (
                    <option key={option.key} value={option.key}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              </label>
              <div className="flex items-center justify-between gap-3">
                <span className={`inline-flex h-7 min-w-24 items-center justify-center rounded-full border px-3 text-[11px] font-medium ${statusToneChipClass(status.tone)}`}>
                  {status.label}
                </span>
                {!status.system ? (
                  <button type="button" onClick={() => onRemove(status.key)} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300">
                    <X size={15} />
                  </button>
                ) : (
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Core</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-neutral-200 px-6 py-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_130px] md:items-center">
            <input
              type="text"
              value={draft.label}
              onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))}
              placeholder="Create a new status"
              className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm outline-none"
            />
            <label className="relative">
              <select
                value={draft.tone}
                onChange={(event) => setDraft((current) => ({ ...current, tone: event.target.value }))}
                className="h-10 w-full appearance-none rounded-md border border-neutral-200 bg-white pl-3 pr-10 text-sm outline-none"
              >
                {statusToneOptions.map((option) => (
                  <option key={option.key} value={option.key}>{option.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            </label>
            <button type="button" onClick={onAdd} className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white">
              Add status
            </button>
          </div>
        </div>
      </section>
    );

    const adminSettingsInputClass = "h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-300 focus:bg-white";
    const adminSettingsSelectClass = "h-12 w-full appearance-none rounded-2xl border border-neutral-200 bg-neutral-50 pl-4 pr-11 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-300 focus:bg-white";
    const adminSettingsMenu = [
      { key: "general", label: "General", icon: Globe, description: "Platform identity and defaults." },
      { key: "notifications", label: "Notifications", icon: Bell, description: "Admin and vendor email flows." },
      { key: "security", label: "Security", icon: Shield, description: "Authentication and access control." },
      { key: "appearance", label: "Appearance", icon: Sparkles, description: "Marketplace presentation settings." },
      { key: "moderation", label: "Moderation", icon: ClipboardList, description: "Submission rules and review workflows." }
    ];
    const adminSettingsSaveMessages = {
      general: "General settings saved",
      notifications: "Notification settings saved",
      security: "Security settings saved",
      appearance: "Appearance settings saved",
      moderation: "Moderation settings saved"
    };
    const adminSettingsCardClass = "overflow-hidden rounded-[28px] border border-neutral-200 bg-white";

    const renderAdminSettingsPanel = ({ title, description, children, tone = "default" }) => (
      <section className={`${adminSettingsCardClass} ${tone === "danger" ? "border-red-200 bg-red-50/40" : ""}`}>
        <div className={`border-b px-7 py-6 ${tone === "danger" ? "border-red-100" : "border-neutral-100"}`}>
          <h2 className={`text-[17px] font-semibold tracking-tight ${tone === "danger" ? "text-red-700" : "text-neutral-950"}`}>{title}</h2>
          {description && (
            <p className={`mt-1 text-sm leading-6 ${tone === "danger" ? "text-red-500" : "text-neutral-400"}`}>{description}</p>
          )}
        </div>
        <div className={tone === "danger" ? "divide-y divide-red-100" : "divide-y divide-neutral-100"}>
          {children}
        </div>
      </section>
    );

    const renderAdminSettingsRow = ({ label, description, control }) => (
      <div className="grid gap-4 px-7 py-6 md:grid-cols-[minmax(0,1fr)_300px] md:items-center">
        <div className="min-w-0">
          <div className="text-[15px] font-medium text-neutral-900">{label}</div>
          {description && <p className="mt-1 text-sm leading-6 text-neutral-400">{description}</p>}
        </div>
        <div className="md:justify-self-end md:w-full md:max-w-[300px]">
          {control}
        </div>
      </div>
    );

    const renderAdminSettingsSwitch = ({ checked, onChange, disabled = false }) => (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => {
          if (!disabled) onChange(!checked);
        }}
        className={`inline-flex h-8 w-14 items-center rounded-full border p-0.5 transition-all ${
          checked ? "justify-end border-black bg-black" : "justify-start border-neutral-200 bg-neutral-200"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <span className="h-6 w-6 rounded-full bg-white shadow-sm" />
      </button>
    );

    const renderAdminSettingsStatusPanel = ({ title, description, statuses, draft, setDraft, onAdd, onRemove, onUpdate }) => (
      <AdminSettingsPanel title={title} description={description}>
        {statuses.map((status) => (
          <div key={status.key} className="grid gap-3 px-7 py-5 md:grid-cols-[minmax(0,1fr)_160px_auto_auto] md:items-center">
            <input
              type="text"
              value={status.label}
              onChange={(event) => onUpdate(status.key, "label", event.target.value)}
              className={adminSettingsInputClass}
            />
            <label className="relative">
              <select
                value={status.tone}
                onChange={(event) => onUpdate(status.key, "tone", event.target.value)}
                className={adminSettingsSelectClass}
              >
                {statusToneOptions.map((option) => (
                  <option key={option.key} value={option.key}>{option.label}</option>
                ))}
              </select>
              <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            </label>
            <span className={`inline-flex h-8 min-w-24 items-center justify-center rounded-full border px-3 text-[11px] font-medium ${statusToneChipClass(status.tone)}`}>
              {status.label}
            </span>
            {status.system ? (
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Core</span>
            ) : (
              <button
                type="button"
                onClick={() => onRemove(status.key)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-300"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
        <div className="grid gap-3 px-7 py-5 md:grid-cols-[minmax(0,1fr)_160px_150px] md:items-center">
          <input
            type="text"
            value={draft.label}
            onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))}
            placeholder="Create a new status"
            className={adminSettingsInputClass}
          />
          <label className="relative">
            <select
              value={draft.tone}
              onChange={(event) => setDraft((current) => ({ ...current, tone: event.target.value }))}
              className={adminSettingsSelectClass}
            >
              {statusToneOptions.map((option) => (
                <option key={option.key} value={option.key}>{option.label}</option>
              ))}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          </label>
          <button type="button" onClick={onAdd} className="inline-flex h-12 items-center justify-center rounded-2xl bg-black px-5 text-sm font-medium text-white">
            Add status
          </button>
        </div>
      </AdminSettingsPanel>
    );

    statusManagerCardRenderRef.current = renderStatusManagerCard;
    adminSettingsPanelRenderRef.current = renderAdminSettingsPanel;
    adminSettingsRowRenderRef.current = renderAdminSettingsRow;
    adminSettingsSwitchRenderRef.current = renderAdminSettingsSwitch;
    adminSettingsStatusPanelRenderRef.current = renderAdminSettingsStatusPanel;

    const GeneralSettingsView = () => (
      <div className="space-y-8">
        <AdminSettingsPanel title="Platform Identity" description="Core brand and contact information.">
          <AdminSettingsRow
            label="Platform Name"
            description="Displayed across the site and in emails."
            control={
              <input
                type="text"
                value={adminSettingsDraft.workspaceName}
                onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, workspaceName: event.target.value }))}
                className={adminSettingsInputClass}
              />
            }
          />
          <AdminSettingsRow
            label="Tagline"
            description="Short description shown on the homepage."
            control={
              <input
                type="text"
                value={adminSettingsDraft.tagline}
                onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, tagline: event.target.value }))}
                className={adminSettingsInputClass}
              />
            }
          />
          <AdminSettingsRow
            label="Support Email"
            description="Contact address shown to users."
            control={
              <input
                type="email"
                value={adminSettingsDraft.supportEmail}
                onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, supportEmail: event.target.value }))}
                className={adminSettingsInputClass}
              />
            }
          />
          <AdminSettingsRow
            label="Contact Phone"
            description="Primary support line for vendor and client help."
            control={
              <input
                type="text"
                value={adminSettingsDraft.supportPhone}
                onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, supportPhone: event.target.value }))}
                className={adminSettingsInputClass}
              />
            }
          />
          <AdminSettingsRow
            label="Default Province"
            description="Pre-filled in vendor registration forms."
            control={
              <label className="relative block">
                <select
                  value={adminSettingsDraft.defaultProvince}
                  onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, defaultProvince: event.target.value }))}
                  className={adminSettingsSelectClass}
                >
                  {["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              </label>
            }
          />
        </AdminSettingsPanel>

        <AdminSettingsPanel title="Platform Controls" description="Listing review defaults and public marketplace controls.">
          <AdminSettingsRow
            label="Vendor Approval Required"
            description="New listings go into review queue before going live."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.requireApprovalBeforePublish} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, requireApprovalBeforePublish: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Open Registration"
            description="Allow new vendors to submit listings."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.openRegistration} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, openRegistration: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Auto-Feature Top Vendors"
            description="Automatically feature the top vendors by views each week."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.autoFeatureTopVendors} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, autoFeatureTopVendors: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Maintenance Mode"
            description="Take the platform offline for visitors. Admins can still log in."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.maintenanceMode} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, maintenanceMode: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Max Images Per Vendor"
            description="Limit how many gallery images a vendor profile can publish."
            control={
              <label className="relative block">
                <select
                  value={adminSettingsDraft.maxImagesPerVendor}
                  onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, maxImagesPerVendor: event.target.value }))}
                  className={adminSettingsSelectClass}
                >
                  {["12 images", "20 images", "30 images", "40 images"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              </label>
            }
          />
          <AdminSettingsRow
            label="Max Video Links Per Vendor"
            description="Limit how many external video links a vendor can attach."
            control={
              <label className="relative block">
                <select
                  value={adminSettingsDraft.maxVideoLinksPerVendor}
                  onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, maxVideoLinksPerVendor: event.target.value }))}
                  className={adminSettingsSelectClass}
                >
                  {["2 videos", "4 videos", "6 videos"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              </label>
            }
          />
        </AdminSettingsPanel>
      </div>
    );

    const NotificationSettingsView = () => (
      <div className="space-y-8">
        <AdminSettingsPanel title="Admin Alerts" description="Events that trigger notifications to the admin team.">
          <AdminSettingsRow
            label="New Vendor Submission"
            description="Alert when a vendor submits a new listing for review."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.adminAlertNewVendorSubmission} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, adminAlertNewVendorSubmission: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Vendor Profile Edits"
            description="Alert when an approved vendor updates their listing."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.adminAlertVendorProfileEdits} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, adminAlertVendorProfileEdits: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Weekly Digest Email"
            description="Summary of approvals, traffic, and platform activity."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.weeklyDigestEmail} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, weeklyDigestEmail: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Digest Day"
            description="Choose when the summary email should be sent."
            control={
              <label className="relative block">
                <select
                  value={adminSettingsDraft.digestDay}
                  onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, digestDay: event.target.value }))}
                  className={adminSettingsSelectClass}
                >
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              </label>
            }
          />
          <AdminSettingsRow
            label="Admin Alert Email"
            description="Where admin notifications are sent."
            control={
              <input
                type="email"
                value={adminSettingsDraft.adminAlertEmail}
                onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, adminAlertEmail: event.target.value }))}
                className={adminSettingsInputClass}
              />
            }
          />
        </AdminSettingsPanel>

        <AdminSettingsPanel title="Email Demo Flows" description="Send admin staging previews of the production email templates to any test inbox.">
          <div className="space-y-4 px-7 py-6">
            <label className="block">
              <span className="mb-2 block text-[13px] font-semibold text-neutral-600">Send demos to</span>
              <input
                type="email"
                value={demoEmailRecipient}
                onChange={(event) => setDemoEmailRecipient(event.target.value)}
                placeholder="name@example.com"
                className={adminSettingsInputClass}
              />
            </label>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ["application", "New vendor application request"],
                ["supportAlert", "New support alert"],
                ["supportResponse", "New support response"]
              ].map(([demoType, label]) => (
                <button
                  key={demoType}
                  type="button"
                  onClick={() => sendAdminDemoEmail(demoType)}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </AdminSettingsPanel>

        <AdminSettingsPanel title="Vendor Notifications" description="Automated emails sent to vendors.">
          <AdminSettingsRow
            label="Approval Confirmation"
            description="Email vendor when their listing is approved."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.vendorApprovalConfirmation} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, vendorApprovalConfirmation: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Rejection Notice"
            description="Email vendor when their listing is rejected, including reason."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.vendorRejectionNotice} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, vendorRejectionNotice: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Request Status Updates"
            description="Send progress updates when admin changes a support request status."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.vendorRequestStatusEmails} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, vendorRequestStatusEmails: checked }))} /></div>}
          />
        </AdminSettingsPanel>
      </div>
    );

    const SecuritySettingsView = () => (
      <div className="space-y-8">
        <AdminSettingsPanel title="Authentication" description="How users and admins access the platform.">
          <AdminSettingsRow
            label="Require Email Verification"
            description="Users must verify email before accessing the platform."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.requireEmailVerification} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, requireEmailVerification: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Allow Social Login"
            description="Enable Google and Facebook sign-in options."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.allowSocialLogin} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, allowSocialLogin: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Require 2FA for Admins"
            description="Admins must use two-factor authentication."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.requireTwoFactorForAdmins} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, requireTwoFactorForAdmins: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Session Timeout"
            description="Auto-logout after inactivity."
            control={
              <label className="relative block">
                <select
                  value={adminSettingsDraft.sessionTimeout}
                  onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, sessionTimeout: event.target.value }))}
                  className={adminSettingsSelectClass}
                >
                  {["12 hours", "1 day", "3 days", "7 days"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              </label>
            }
          />
          <AdminSettingsRow
            label="Max Login Attempts"
            description="Lock account after this many failed attempts."
            control={
              <label className="relative block">
                <select
                  value={adminSettingsDraft.maxLoginAttempts}
                  onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, maxLoginAttempts: event.target.value }))}
                  className={adminSettingsSelectClass}
                >
                  {["3 attempts", "5 attempts", "8 attempts"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              </label>
            }
          />
        </AdminSettingsPanel>

        <AdminSettingsPanel title="IP Allow List" description="Restrict admin access to specific IP addresses.">
          <AdminSettingsRow
            label="Enable IP Allow List"
            description="Only listed IPs can access the admin portal."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.enableIpAllowList} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, enableIpAllowList: checked }))} /></div>}
          />
        </AdminSettingsPanel>

        <AdminSettingsPanel title="API & Keys" description="Platform credentials used by trusted integrations.">
          <AdminSettingsRow
            label="Platform API Key"
            description="For third-party integrations. Keep secret."
            control={
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  readOnly
                  value={adminSettingsDraft.platformApiKey}
                  className={`${adminSettingsInputClass} font-mono`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const nextKey = `es_admin_${Math.random().toString(36).slice(2, 6)}2••••••••`;
                    setAdminSettingsDraft((current) => ({ ...current, platformApiKey: nextKey }));
                    setSaveState("Platform API key regenerated");
                  }}
                  className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300"
                >
                  Regenerate
                </button>
              </div>
            }
          />
        </AdminSettingsPanel>
      </div>
    );

    const AppearanceSettingsView = () => (
      <div className="space-y-8">
        <AdminSettingsPanel title="Visual Settings" description="Core browse and presentation defaults for the marketplace.">
          <AdminSettingsRow
            label="Home Hero Style"
            description="Layout of the homepage hero section."
            control={
              <label className="relative block">
                <select
                  value={adminSettingsDraft.homeHeroStyle}
                  onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, homeHeroStyle: event.target.value }))}
                  className={adminSettingsSelectClass}
                >
                  {["Search-First", "Editorial", "Split Layout"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              </label>
            }
          />
          <AdminSettingsRow
            label="Listings Per Page"
            description="How many results appear before pagination."
            control={
              <label className="relative block">
                <select
                  value={adminSettingsDraft.listingsPerPage}
                  onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, listingsPerPage: event.target.value }))}
                  className={adminSettingsSelectClass}
                >
                  {["12 per page", "24 per page", "36 per page"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              </label>
            }
          />
          <AdminSettingsRow
            label="Show Featured Badge"
            description="Display featured badge on highlighted vendor cards."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.showFeaturedBadge} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, showFeaturedBadge: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Show Starting Prices"
            description="Display vendor pricing on browse cards."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.showStartingPrices} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, showStartingPrices: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Show Years in Business"
            description="Display experience level on vendor cards."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.showYearsInBusiness} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, showYearsInBusiness: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Enable Map View"
            description="Allow users to browse vendors on a map."
            control={
              <div className="flex items-center justify-end gap-3">
                <span className="text-sm font-medium text-neutral-400">Coming soon</span>
                <AdminSettingsSwitch checked={adminSettingsDraft.enableMapView} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, enableMapView: checked }))} disabled />
              </div>
            }
          />
        </AdminSettingsPanel>

        <AdminSettingsPanel title="Brand Color" description="Primary accent used in CTAs and highlights.">
          <div className="flex flex-wrap gap-4 px-7 py-6">
            {[
              { key: "black", color: "#000000" },
              { key: "blue", color: "#3759d7" },
              { key: "violet", color: "#6d3de8" },
              { key: "red", color: "#de4336" },
              { key: "green", color: "#4ca76d" },
              { key: "orange", color: "#f76a2f" }
            ].map((swatch) => (
              <button
                key={swatch.key}
                type="button"
                onClick={() => setAdminSettingsDraft((current) => ({ ...current, brandColor: swatch.key }))}
                className={`h-12 w-12 rounded-full border-2 transition-transform hover:scale-105 ${
                  adminSettingsDraft.brandColor === swatch.key ? "border-neutral-900" : "border-neutral-200"
                }`}
                style={{ backgroundColor: swatch.color }}
                aria-label={`Set brand color to ${swatch.key}`}
              />
            ))}
          </div>
        </AdminSettingsPanel>
      </div>
    );

    const ModerationSettingsView = () => (
      <div className="space-y-8">
        <AdminSettingsPanel title="Content Rules" description="Requirements for vendor listing submissions.">
          <AdminSettingsRow
            label="Profanity Filter"
            description="Auto-flag listings containing inappropriate language."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.profanityFilter} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, profanityFilter: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Require Phone Number"
            description="Vendors must provide a phone number to submit."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.requirePhoneNumber} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, requirePhoneNumber: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Require Website"
            description="Vendors must provide a website URL to submit."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.requireWebsite} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, requireWebsite: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Allow Video Links"
            description="Vendors can embed TikTok or Reels links on their profile."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.allowVendorVideoLinks} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, allowVendorVideoLinks: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Auto-Reject Incomplete Submissions"
            description="Automatically reject listings missing required fields."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.autoRejectIncompleteSubmissions} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, autoRejectIncompleteSubmissions: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Min Description Length"
            description="Minimum characters required in vendor description."
            control={
              <label className="relative block">
                <select
                  value={adminSettingsDraft.minDescriptionLength}
                  onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, minDescriptionLength: event.target.value }))}
                  className={adminSettingsSelectClass}
                >
                  {["80 chars", "100 chars", "150 chars"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              </label>
            }
          />
          <AdminSettingsRow
            label="Max Description Length"
            description="Upper cap for public vendor descriptions."
            control={
              <label className="relative block">
                <select
                  value={adminSettingsDraft.maxDescriptionLength}
                  onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, maxDescriptionLength: event.target.value }))}
                  className={adminSettingsSelectClass}
                >
                  {["1500 chars", "2000 chars", "2500 chars"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              </label>
            }
          />
        </AdminSettingsPanel>

        <AdminSettingsPanel title="Request Management" description="Support queue ownership, escalation targets, and closure rules.">
          <AdminSettingsRow
            label="Support Inbox Owner"
            description="Primary team responsible for new support requests."
            control={
              <input
                type="text"
                value={adminSettingsDraft.requestInboxOwner}
                onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, requestInboxOwner: event.target.value }))}
                className={adminSettingsInputClass}
              />
            }
          />
          <AdminSettingsRow
            label="First Response SLA"
            description="Target response time for incoming requests."
            control={
              <input
                type="text"
                value={adminSettingsDraft.reviewSla}
                onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, reviewSla: event.target.value }))}
                className={adminSettingsInputClass}
              />
            }
          />
          <AdminSettingsRow
            label="Escalation Window"
            description="Escalate requests that sit without action for this long."
            control={
              <input
                type="text"
                value={adminSettingsDraft.requestEscalationWindow}
                onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, requestEscalationWindow: event.target.value }))}
                className={adminSettingsInputClass}
              />
            }
          />
          <AdminSettingsRow
            label="Auto-Close Resolved Requests"
            description="Automatically close resolved requests after this period."
            control={
              <input
                type="text"
                value={adminSettingsDraft.requestAutoCloseDays}
                onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, requestAutoCloseDays: event.target.value }))}
                className={adminSettingsInputClass}
              />
            }
          />
        </AdminSettingsPanel>

        <AdminSettingsStatusPanel
          title="Request Statuses"
          description="Workflow states used by support tickets, assistance requests, and vendor follow-ups."
          statuses={adminRequestStatuses}
          draft={adminRequestStatusDraft}
          setDraft={setAdminRequestStatusDraft}
          onAdd={addAdminRequestStatus}
          onRemove={removeAdminRequestStatus}
          onUpdate={(key, field, value) => updateStatusDefinition(setAdminRequestStatuses, key, field, value)}
        />

        <AdminSettingsPanel title="Application Management" description="Vendor review ownership, gating rules, and publishing approvals.">
          <AdminSettingsRow
            label="Application Review Owner"
            description="Team responsible for reviewing new vendor applications."
            control={
              <input
                type="text"
                value={adminSettingsDraft.applicationReviewOwner}
                onChange={(event) => setAdminSettingsDraft((current) => ({ ...current, applicationReviewOwner: event.target.value }))}
                className={adminSettingsInputClass}
              />
            }
          />
          <AdminSettingsRow
            label="Require Approval Before Publish"
            description="Keep new applications out of the marketplace until reviewed."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.requireApprovalBeforePublish} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, requireApprovalBeforePublish: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Require Business Verification"
            description="Block approval until business identity and contact details are verified."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.requireBusinessVerification} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, requireBusinessVerification: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Require Portfolio Before Review"
            description="Ensure applications include service proof or sample work."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.requirePortfolioBeforeReview} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, requirePortfolioBeforeReview: checked }))} /></div>}
          />
          <AdminSettingsRow
            label="Only Approved Vendors Can Be Featured"
            description="Protect featured placements from being assigned before moderation is complete."
            control={<div className="flex justify-end"><AdminSettingsSwitch checked={adminSettingsDraft.requireFeaturedApproval} onChange={(checked) => setAdminSettingsDraft((current) => ({ ...current, requireFeaturedApproval: checked }))} /></div>}
          />
        </AdminSettingsPanel>

        <AdminSettingsStatusPanel
          title="Application Statuses"
          description="Review labels used during vendor moderation, separate from final approve, restrict, or reject actions."
          statuses={adminApplicationStatuses}
          draft={adminApplicationStatusDraft}
          setDraft={setAdminApplicationStatusDraft}
          onAdd={addAdminApplicationStatus}
          onRemove={removeAdminApplicationStatus}
          onUpdate={(key, field, value) => updateStatusDefinition(setAdminApplicationStatuses, key, field, value)}
        />

        <AdminSettingsPanel title="Bulk Actions" description="Irreversible platform-wide operations." tone="danger">
          <div className="grid gap-4 px-7 py-6 md:grid-cols-[minmax(0,1fr)_180px] md:items-center">
            <div>
              <div className="text-[15px] font-medium text-neutral-900">Reject All Pending Listings</div>
              <p className="mt-1 text-sm leading-6 text-neutral-500">Send rejection emails to all vendors currently in queue.</p>
            </div>
            <button
              type="button"
              onClick={() => setSaveState("Bulk rejection action queued")}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-red-200 bg-white px-5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Run action
            </button>
          </div>
          <div className="grid gap-4 px-7 py-6 md:grid-cols-[minmax(0,1fr)_180px] md:items-center">
            <div>
              <div className="text-[15px] font-medium text-neutral-900">Clear All Visit Data</div>
              <p className="mt-1 text-sm leading-6 text-neutral-500">Reset all profile view analytics. Cannot be undone.</p>
            </div>
            <button
              type="button"
              onClick={() => setSaveState("Visit analytics clear requested")}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-red-600 px-5 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Clear data
            </button>
          </div>
        </AdminSettingsPanel>
      </div>
    );

    const renderAdminSettingsSection = () => {
      if (adminSettingsSection === "notifications") return NotificationSettingsView();
      if (adminSettingsSection === "security") return SecuritySettingsView();
      if (adminSettingsSection === "appearance") return AppearanceSettingsView();
      if (adminSettingsSection === "moderation") return ModerationSettingsView();
      return GeneralSettingsView();
    };

    const AdminSettingsView = () => (
      <div className="space-y-8">
        <div className="grid gap-8 xl:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="space-y-2 pt-2">
            {adminSettingsMenu.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => navigateAdminSettingsSection(item.key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-[15px] transition-colors ${
                  adminSettingsSection === item.key ? "bg-black text-white shadow-sm" : "text-neutral-500 hover:bg-white hover:text-neutral-900"
                }`}
              >
                <item.icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </aside>
          <div className="min-w-0 space-y-8">
            {renderAdminSettingsSection()}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => saveAdminSettings(adminSettingsSaveMessages[adminSettingsSection] || "Admin settings saved")}
                className={`inline-flex h-14 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-medium text-white transition-colors ${saveState === "Saving..." ? "cursor-wait bg-neutral-500" : "bg-black hover:bg-neutral-800"}`}
                disabled={saveState === "Saving..."}
              >
                <CheckCircle size={18} />
                {saveState === "Saving..." ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    const renderAdminSection = () => {
      if (adminSection === "vendors") return VendorsDirectoryView();
      if (adminSection === "vendor-queue") return AdminVendorTable();
      if (adminSection === "requests") return RequestsView();
      if (adminSection === "reviews") return AdminReviewsView();
      if (adminSection === "analytics") return AdminAnalyticsView();
      if (adminSection === "settings") return AdminSettingsView();
      if (adminSection === "featured") {
        return (
          <>
            <section className="rounded-lg border border-neutral-200 bg-white">
              <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 px-6 py-5 md:flex-row md:items-center">
                <div>
                  <h2 className="text-lg font-medium">Featured Placement Slots</h2>
                  <p className="mt-1 text-sm text-neutral-500">Approved vendors currently promoted across marketplace surfaces.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAdminFeatureSearch("");
                    setShowAdminFeatureModal(true);
                  }}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                >
                  <Plus size={16} />
                  Add new feature
                </button>
              </div>
              <div className="divide-y divide-neutral-100">
                {featuredVendorRows.map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between gap-4 px-6 py-5">
                    <div>
                      <button type="button" onClick={() => setSelectedAdminVendorId(vendor.id)} className="text-left text-sm font-medium text-neutral-950 hover:underline">{vendor.businessName}</button>
                      <div className="mt-1 text-sm text-neutral-500">{vendor.category} • {vendor.city}</div>
                    </div>
                    <button type="button" onClick={() => toggleVendorFeatured(vendor.id, false)} className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-200 bg-white px-3.5 text-sm font-medium">Remove featured</button>
                  </div>
                ))}
                {featuredVendorRows.length === 0 && (
                  <div className="px-6 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-neutral-100 text-neutral-500">
                      <Star size={20} />
                    </div>
                    <div className="mt-4 text-sm font-medium text-neutral-950">No featured vendors yet</div>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">Use Add new feature to promote approved vendors into marketplace placement slots.</p>
                  </div>
                )}
              </div>
            </section>

            {showAdminFeatureModal && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm" onClick={() => setShowAdminFeatureModal(false)}>
                <section className="w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
                  <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5">
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-neutral-950">Add featured vendor</h2>
                      <p className="mt-1 text-sm text-neutral-500">Search approved vendors and add them to featured placement slots.</p>
                    </div>
                    <button type="button" onClick={() => setShowAdminFeatureModal(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="border-b border-neutral-100 px-6 py-4">
                    <label className="relative block">
                      <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        value={adminFeatureSearch}
                        onChange={(event) => setAdminFeatureSearch(event.target.value)}
                        placeholder="Search by vendor, category, or city..."
                        className="h-12 w-full rounded-md border border-neutral-200 bg-neutral-50 pl-11 pr-4 text-sm outline-none transition-colors focus:border-neutral-300 focus:bg-white"
                        autoFocus
                      />
                    </label>
                  </div>
                  <div className="max-h-[420px] overflow-y-auto p-3">
                    {featuredCandidateRows.map((vendor) => (
                      <div key={vendor.id} className="flex items-center justify-between gap-4 rounded-lg px-3 py-3 hover:bg-neutral-50">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-neutral-950">{vendor.businessName}</div>
                          <div className="mt-1 text-sm text-neutral-500">{[vendor.category, vendor.city].filter(Boolean).join(" • ")}</div>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            await toggleVendorFeatured(vendor.id, true);
                            setShowAdminFeatureModal(false);
                          }}
                          className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium transition-colors hover:border-neutral-300"
                        >
                          Add feature
                        </button>
                      </div>
                    ))}
                    {featuredCandidateRows.length === 0 && (
                      <div className="px-6 py-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-neutral-100 text-neutral-500">
                          <Search size={20} />
                        </div>
                        <div className="mt-4 text-sm font-medium text-neutral-950">No approved vendors found</div>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-500">Only approved vendors that are not already featured can be added here.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </>
        );
      }
      if (adminSection === "audit") {
        return (
          <section className="rounded-lg border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-6 py-5">
              <h2 className="text-lg font-medium">Recent Activity</h2>
              <p className="mt-1 text-sm text-neutral-500">Operational history and moderation actions.</p>
            </div>
            <div className="divide-y divide-neutral-100">
              {adminActivity.map((entry, index) => (
                <div key={`${entry.label}-${index}`} className="grid gap-3 px-6 py-5 md:grid-cols-[180px_minmax(0,1fr)_100px]">
                  <div className="text-sm font-medium text-neutral-950">{entry.label}</div>
                  <div className="text-sm text-neutral-500">{entry.detail}</div>
                  <div className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">{entry.time}</div>
                </div>
              ))}
            </div>
          </section>
        );
      }
      if (adminSection === "permissions") {
        const permissionRoles = [
          ["Owner", "Full access to vendors, featured placements, analytics, and permissions"],
          ["Operations", "Can approve vendors, manage requests, and update featured placements"],
          ["Support", "Can view vendors, requests, and audit records"]
        ];
        const selectedRolePermissions = selectedAdminPermissionRole ? adminRolePermissions[selectedAdminPermissionRole] || {} : {};
        const selectedRoleEnabledCount = ADMIN_PERMISSION_LABELS.filter(([key]) => selectedRolePermissions[key]).length;

        return (
          <>
            <div className="grid gap-6 lg:grid-cols-3">
              {permissionRoles.map(([role, description]) => {
                const rolePermissions = adminRolePermissions[role] || {};
                const enabledCount = ADMIN_PERMISSION_LABELS.filter(([key]) => rolePermissions[key]).length;

                return (
                  <section key={role} className="rounded-lg border border-neutral-200 bg-white p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-medium">{role}</h2>
                        <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>
                      </div>
                      <span className="inline-flex h-8 min-w-16 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 px-3 text-[11px] font-medium text-neutral-600">
                        {enabledCount}/{ADMIN_PERMISSION_LABELS.length}
                      </span>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {ADMIN_PERMISSION_LABELS.filter(([key]) => rolePermissions[key]).slice(0, 4).map(([key, label]) => (
                        <span key={key} className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-medium text-green-700">
                          {label}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedAdminPermissionRole(role)}
                      className="mt-5 inline-flex h-10 items-center justify-center rounded-md border border-neutral-200 bg-white px-3.5 text-sm font-medium transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                    >
                      Review access
                    </button>
                  </section>
                );
              })}
            </div>

            {selectedAdminPermissionRole && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm" onClick={() => setSelectedAdminPermissionRole(null)}>
                <section className="w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
                  <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5">
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-neutral-950">{selectedAdminPermissionRole} access</h2>
                      <p className="mt-1 text-sm text-neutral-500">
                        {selectedRoleEnabledCount} of {ADMIN_PERMISSION_LABELS.length} permissions enabled.
                        {selectedAdminPermissionRole === "Owner" ? " Owner access is locked to full permissions." : ""}
                      </p>
                    </div>
                    <button type="button" onClick={() => setSelectedAdminPermissionRole(null)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid gap-3 p-6">
                    {ADMIN_PERMISSION_LABELS.map(([key, label]) => {
                      const enabled = Boolean(selectedRolePermissions[key]);
                      const locked = selectedAdminPermissionRole === "Owner";

                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={locked}
                          onClick={() => {
                            if (locked) return;
                            setAdminRolePermissions((current) => ({
                              ...current,
                              [selectedAdminPermissionRole]: {
                                ...(current[selectedAdminPermissionRole] || {}),
                                [key]: !enabled
                              }
                            }));
                          }}
                          className={`flex items-center justify-between gap-4 rounded-lg border px-4 py-4 text-left transition-colors ${
                            enabled
                              ? "border-green-200 bg-green-50 text-green-800"
                              : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                          } ${locked ? "cursor-not-allowed opacity-80" : ""}`}
                        >
                          <span className="text-sm font-medium">{label}</span>
                          <span className={`inline-flex h-7 min-w-16 items-center justify-center rounded-full border px-3 text-[11px] font-semibold ${
                            enabled ? "border-green-200 bg-white text-green-700" : "border-neutral-200 bg-neutral-50 text-neutral-500"
                          }`}>
                            {enabled ? "Enabled" : "Off"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-end gap-3 border-t border-neutral-200 bg-white px-6 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedAdminPermissionRole(null)}
                      className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-200 bg-white px-4 text-sm font-medium"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSaveState(`${selectedAdminPermissionRole} permissions saved`);
                        setSelectedAdminPermissionRole(null);
                      }}
                      className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                    >
                      Save permissions
                    </button>
                  </div>
                </section>
              </div>
            )}
          </>
        );
      }
      return (
        <div className="space-y-6">
          <section className="rounded-lg border border-neutral-200 bg-white">
            <div className="flex items-center justify-between gap-5 border-b border-neutral-200 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-neutral-100 text-black">
                  <ShieldCheck size={19} />
                </div>
                <div>
                  <h2 className="text-lg font-medium">Vendor Operations Pipeline</h2>
                  <p className="mt-1 text-sm text-neutral-500">Live moderation state across applications, public profiles, and marketplace placement.</p>
                </div>
              </div>
              <button type="button" onClick={() => navigateAdminSection("vendor-queue")} className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium">
                View all
                <ChevronRight size={15} />
              </button>
            </div>
            <div className="grid divide-y divide-neutral-100 md:grid-cols-4 md:divide-x md:divide-y-0">
              {pipelineStats.map((item) => (
                <div key={item.label} className="flex items-center gap-4 px-6 py-5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-md ${
                    item.tone === "green" ? "bg-green-50 text-green-600" : item.tone === "amber" ? "bg-amber-50 text-amber-600" : item.tone === "blue" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
                  }`}>
                    <item.icon size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">{item.label}</div>
                    <div className="mt-1 text-[20px] font-medium text-neutral-950">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-4">
            {adminKpis.map((card) => (
              <section key={card.label} className="rounded-lg border border-neutral-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-100 text-black">
                    <card.icon size={18} />
                  </div>
                  <span className={`text-xs font-medium ${card.delta.startsWith("-") ? "text-red-500" : "text-green-600"}`}>{card.delta}</span>
                </div>
                <div className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">{card.label}</div>
                <div className="mt-2 text-2xl font-medium text-neutral-950">{card.value}</div>
                <div className="mt-1 text-xs text-neutral-500">{card.meta}</div>
              </section>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
            <section className="rounded-lg border border-neutral-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-100">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium">Marketplace Value Trend</h2>
                    <p className="mt-1 text-sm text-neutral-500">Last 7 days • vendor approvals and listing value movement.</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-green-600">+16%</span>
              </div>
              <div className="mt-8 flex h-64 items-end gap-4 border-b border-dashed border-neutral-200 pb-6">
                {weeklyRevenue.map((value, index) => (
                  <div key={weekDays[index]} className="flex flex-1 flex-col items-center justify-end gap-3">
                    <div className="relative flex w-full items-end justify-center">
                      <div className="w-full max-w-[78px] rounded-t-md bg-black" style={{ height: `${value * 2.2}px` }} />
                      <span className="absolute -top-6 text-[11px] font-medium text-neutral-500">${value}k</span>
                    </div>
                    <span className="text-xs text-neutral-500">{weekDays[index]}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-neutral-200 bg-white p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-100">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-medium">Traffic by Week</h2>
                  <p className="mt-1 text-sm text-neutral-500">Vendor profile visits across the last 7 days.</p>
                </div>
              </div>
              <div className="mt-8 h-64 border-b border-dashed border-neutral-200 pb-6">
                <svg viewBox="0 0 392 194" className="h-full w-full overflow-visible" role="img" aria-label="Weekly traffic line chart">
                  {[42, 86, 130, 174].map((y) => (
                    <line key={y} x1="28" x2="364" y1={y} y2={y} stroke="#e5e5e5" strokeDasharray="4 6" strokeWidth="1" />
                  ))}
                  <polyline points={trafficPoints} fill="none" stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                  {weeklyTraffic.map((value, index) => {
                    const x = 28 + index * 56;
                    const y = 174 - (value / trafficMax) * 132;
                    return (
                      <g key={weekDays[index]}>
                        <circle cx={x} cy={y} r="4" fill="#111111" />
                        <text x={x} y={y - 13} textAnchor="middle" className="fill-neutral-500 text-[10px] font-medium">{value}</text>
                        <text x={x} y="194" textAnchor="middle" className="fill-neutral-500 text-[10px]">{weekDays[index]}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </section>
          </div>

          {AdminVendorTable()}

          {RequestsView()}
        </div>
      );
    };

    return (
      <div className="flex min-h-screen bg-neutral-100 pt-16">
        <div className="fixed bottom-0 top-16 z-10 flex w-72 flex-col border-r border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-black text-white">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h2 className="text-sm font-medium">Admin Workspace</h2>
                <span className="text-[9px] uppercase tracking-[0.14em] text-neutral-500">Vendor operations</span>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-6 overflow-y-auto p-4">
            <div>
              <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Core Views</div>
              {adminCoreNav.map((item) => (
                <button key={item.section} type="button" onClick={() => navigateAdminSection(item.section)} className={`mt-1 flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm ${adminSection === item.section ? "bg-black text-white" : "text-neutral-600 hover:bg-neutral-100"}`}>
                  <span className="flex items-center gap-3">
                    <item.icon size={16} />
                    {item.label}
                  </span>
                  {item.section === "vendor-queue" && pendingCount > 0 && (
                    <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none ${adminSection === item.section ? "bg-white text-black" : "bg-red-500 text-white"}`}>
                      {pendingCount}
                    </span>
                  )}
                  {item.section === "requests" && requestBacklog > 0 && (
                    <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none ${adminSection === item.section ? "bg-white text-black" : "bg-red-500 text-white"}`}>
                      {requestBacklog}
                    </span>
                  )}
                  {item.section === "reviews" && reviewRows.filter((review) => review.status === "pending").length > 0 && (
                    <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none ${adminSection === item.section ? "bg-white text-black" : "bg-red-500 text-white"}`}>
                      {reviewRows.filter((review) => review.status === "pending").length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div>
              <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Management</div>
              {adminManagementNav.map((item) => (
                <button key={item.section} type="button" onClick={() => navigateAdminSection(item.section)} className={`mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm ${adminSection === item.section ? "bg-black text-white" : "text-neutral-600 hover:bg-neutral-100"}`}>
                  <ChevronRight size={15} />
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
          <div className="shrink-0 border-t border-neutral-200 p-4">
            <button
              type="button"
              onClick={() => navigateAdminSection("settings", { settingsSection: "general" })}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm ${adminSection === "settings" ? "bg-black text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
            >
              <Settings size={16} />
              Settings
            </button>
            <div className="my-4 border-t border-neutral-200" />
            <button
              type="button"
              onClick={() => {
                clearSession();
                setSession(null);
              }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
        <div className="ml-72 flex-1 px-8 pb-8 pt-5">
          <div className="mx-auto max-w-[1460px]">
            <header className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">{adminEyebrow}</div>
                <h1 className="mt-3 text-3xl font-medium tracking-tight">{adminTitle}</h1>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-neutral-500">{adminDescription}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    type="text"
                    value={adminSearchQuery}
                    onChange={(event) => {
                      setAdminSearchQuery(event.target.value);
                      setShowAdminSearchSuggestions(true);
                    }}
                    onFocus={() => {
                      if (adminSearchQuery.trim()) setShowAdminSearchSuggestions(true);
                    }}
                    onBlur={() => window.setTimeout(() => setShowAdminSearchSuggestions(false), 140)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleAdminWorkspaceSearch();
                    }}
                    placeholder="Search admin records..."
                    className="h-10 w-72 rounded-md border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none"
                    autoComplete="off"
                  />
                  {showAdminSearchSuggestions && adminSearchQuery.trim() && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-72 overflow-y-auto rounded-md border border-neutral-200 bg-white shadow-2xl">
                      {adminSearchSuggestions.length ? (
                        adminSearchSuggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            type="button"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => applyAdminSearchSuggestion(suggestion)}
                            className="flex w-full items-start justify-between gap-4 px-4 py-3 text-left hover:bg-neutral-50"
                          >
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-black">{suggestion.label}</span>
                              {suggestion.meta ? <span className="mt-1 block text-xs text-neutral-500">{suggestion.meta}</span> : null}
                            </span>
                            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                              {suggestion.kind}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-neutral-500">No matching admin records found.</div>
                      )}
                    </div>
                  )}
                </div>
                <button type="button" onClick={handleAdminWorkspaceSearch} className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-200 bg-white px-3.5 text-sm font-medium">Search</button>
              </div>
            </header>
            <div className="relative min-h-[calc(100vh-220px)] space-y-6">
              {renderAdminSection()}
              {selectedAdminVendor && <AdminVendorApplicationPanel />}
            </div>
          </div>
        </div>
      </div>
    );
  };

  clientListingDetailRenderRef.current = ClientListingDetail;
  vendorConceptARenderRef.current = VendorConceptA;
  navRenderRef.current = Nav;
  portalAuthGateRenderRef.current = PortalAuthGate;
  mobileMenuRenderRef.current = MobileMenu;
  mobileSearchModalRenderRef.current = MobileSearchModal;
  vendorApplyPageRenderRef.current = VendorApplyPage;
  adminReviewModerationPanelRenderRef.current = AdminReviewModerationPanel;
  adminRejectionReasonModalRenderRef.current = AdminRejectionReasonModal;
  adminRequestReviewModalRenderRef.current = AdminRequestReviewModal;
  const showVendorPortal = portal === "vendor" && sessionCanAccessPortal(session, "vendor");
  const showAdminPortal = portal === "admin" && sessionCanAccessPortal(session, "admin");
  const showPortalAuthGate = (portal === "vendor" || portal === "admin") && !sessionCanAccessPortal(session, portal);

  return (
    <div className="font-sans antialiased text-black relative">
      <GlobalSaveToast />
      {!showPortalAuthGate && <StableNav />}
      <StableMobileSearchModal />
      <StableMobileMenu />
      {showPortalAuthGate && <StablePortalAuthGate />}
      {portal === "client" && legalPage && <LegalPage type={legalPage} />}
      {portal === "client" && !legalPage && selectedListingSlug && <StableClientListingDetail />}
      {portal === "client" && !legalPage && !selectedListingSlug && showVendorApplyPage && <StableVendorApplyPage />}
      {portal === "client" && !legalPage && !selectedListingSlug && !showVendorApplyPage && showClientArchive && ClientArchivePage()}
      {portal === "client" && !legalPage && !selectedListingSlug && !showVendorApplyPage && !showClientArchive && ClientConceptA()}
      {showVendorPortal && <StableVendorConceptA />}
      {showAdminPortal && AdminConceptB()}
      {showAdminPortal && selectedAdminReview && <StableAdminReviewModerationPanel />}
      {showAdminPortal && <StableAdminRejectionReasonModal />}
      {showAdminPortal && <StableAdminRequestReviewModal />}
    </div>
  );
}
