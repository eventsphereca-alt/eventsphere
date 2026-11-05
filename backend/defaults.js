const REVIEWER_AVATAR_1 = "https://i.pravatar.cc/120?img=32";
const REVIEWER_AVATAR_2 = "https://i.pravatar.cc/120?img=15";

const defaultAdminRequests = [
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
    status: "pending",
    createdAt: "2026-06-14T16:12:00.000Z",
    updatedAt: "2026-06-14T16:12:00.000Z"
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
    status: "pending",
    createdAt: "2026-06-14T15:48:00.000Z",
    updatedAt: "2026-06-14T15:48:00.000Z"
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
    status: "pending",
    createdAt: "2026-06-14T14:30:00.000Z",
    updatedAt: "2026-06-14T14:30:00.000Z"
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
    status: "flagged",
    createdAt: "2026-06-14T12:30:00.000Z",
    updatedAt: "2026-06-14T12:30:00.000Z"
  }
];

const defaultReviewRequests = [
  {
    id: "review-request-goldenbeats-1",
    vendorSlug: "golden-beats-dj-services",
    vendorName: "Golden Beats DJ Services",
    clientName: "Amina O.",
    clientEmail: "amina.owusu@example.com",
    eventType: "Wedding reception",
    sentAt: "June 10, 2026",
    status: "submitted",
    source: "Email link",
    createdAt: "2026-06-10T10:00:00.000Z",
    updatedAt: "2026-06-13T09:00:00.000Z"
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
    source: "Email link",
    createdAt: "2026-05-14T12:00:00.000Z",
    updatedAt: "2026-05-18T14:30:00.000Z"
  }
];

const defaultReviews = [
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
    image: REVIEWER_AVATAR_1,
    createdAt: "2026-06-13T09:00:00.000Z",
    updatedAt: "2026-06-13T09:00:00.000Z"
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
    image: REVIEWER_AVATAR_2,
    createdAt: "2026-05-18T14:30:00.000Z",
    updatedAt: "2026-05-18T14:30:00.000Z"
  }
];

const defaultLeads = [
  {
    id: "lead-goldenbeats-1",
    vendorSlug: "golden-beats-dj-services",
    name: "Amina O.",
    phone: "(416) 555-0184",
    email: "amina.owusu@example.com",
    eventType: "Wedding reception",
    city: "Toronto",
    guests: 420,
    budget: "$4,000 to $6,000",
    quoteAmount: "$5,200",
    due: "Today",
    eventDate: "Aug 17, 2026",
    serviceDetails: "Needs a DJ and MC for a multicultural wedding reception with Afrobeats, Soca, R&B, and Punjabi sets. Ceremony starts at 4:00 PM, cocktail hour at 5:30 PM, reception at 7:00 PM. Requires wireless mic, clean edits, grand entrance cues, and coordination with planner.",
    notes: "High priority lead. Client asked for bilingual MC availability and wants a quote before end of day.",
    status: "New inquiry",
    createdAt: "2026-06-11T10:00:00.000Z",
    updatedAt: "2026-06-11T10:00:00.000Z"
  },
  {
    id: "lead-goldenbeats-2",
    vendorSlug: "golden-beats-dj-services",
    name: "Daniel K.",
    phone: "(905) 555-0149",
    email: "daniel.kim@example.com",
    eventType: "Corporate gala",
    city: "Mississauga",
    guests: 260,
    budget: "$3,000+",
    quoteAmount: "$3,450",
    due: "Tomorrow",
    eventDate: "Sep 12, 2026",
    serviceDetails: "Corporate awards gala requiring background music during arrivals, walk-up stings for award winners, branded playlist review, two wireless mics, and a compact setup that fits hotel ballroom restrictions.",
    notes: "Procurement team needs insurance certificate and itemized quote.",
    status: "Quote sent",
    createdAt: "2026-06-12T10:00:00.000Z",
    updatedAt: "2026-06-12T10:00:00.000Z"
  },
  {
    id: "lead-goldenbeats-3",
    vendorSlug: "golden-beats-dj-services",
    name: "Nadia S.",
    phone: "(647) 555-0197",
    email: "nadia.singh@example.com",
    eventType: "Birthday celebration",
    city: "Brampton",
    guests: 180,
    budget: "$1,500 to $2,500",
    quoteAmount: "$2,100",
    due: "2 days",
    eventDate: "Jul 25, 2026",
    serviceDetails: "Milestone birthday with family-friendly music early evening and dance floor after dinner. Needs uplighting add-on pricing, Punjabi and Top 40 playlist, and setup before 5:00 PM.",
    notes: "Client is comparing two packages and asked about deposit terms.",
    status: "Follow up",
    createdAt: "2026-06-13T10:00:00.000Z",
    updatedAt: "2026-06-13T10:00:00.000Z"
  }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultCollections() {
  return {
    vendorWorkspaceSettings: [],
    adminRequests: clone(defaultAdminRequests),
    reviewRequests: clone(defaultReviewRequests),
    reviews: clone(defaultReviews),
    leads: clone(defaultLeads)
  };
}

module.exports = {
  defaultCollections
};
