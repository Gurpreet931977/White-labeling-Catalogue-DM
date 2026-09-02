/**
 * =========================================================================
 * BRAND & CAFE CONFIGURATION (WHITE-LABEL CONFIG)
 * =========================================================================
 * To re-brand this website for any new cafe, restaurant, lounge, or cloud kitchen,
 * simply change the values in this single configuration file!
 * All components across the frontend and admin panel read dynamically from here.
 */

export const BRAND_CONFIG = {
  // Brand Identity
  brandName: "Truckers Halt Cafe",
  shortName: "THC Cafe",
  logoInitials: "THC",
  tagline: "Fuel Your Soul • 24/7 Highway Kitchen & Lounge",
  
  // Hero Section Customization
  hero: {
    locationTag: "NH-72A • HIGHWAY LOUNGE",
    headlineLine1: "Fuel Your",
    headlineLine2: "Highway Soul.",
    description: "Scan your table plaque, order sizzling mountain platters, chef specials, and fresh beverages directly to your seat. Fast kitchen with live status tracking.",
    deliveryTag: "10-15 Min Serve",
    paymentTag: "UPI / Cash / Card",
    kitchenTag: "24/7 Kitchen"
  },

  // Contact & Location Details
  contact: {
    city: "Dehradun",
    state: "Uttarakhand",
    shortAddress: "Rajpur Road Highway Pitstop",
    fullAddress: "Old Mussoorie Highway, Rajpur Road, Dehradun, Uttarakhand 248009",
    phone: "+91 98970 00842",
    whatsapp: "919897000842",
    email: "contact@thccafe.in",
    googleMapsUrl: "https://maps.google.com",
    openingHours: "Open 24/7 (Late Night Kitchen Active)",
    announcementText: "Use code: HIGHWAY10 for 10% OFF • Scan Table QR to Order Instantly"
  },

  // Ratings & Social Proof
  rating: {
    score: 4.9,
    reviewsCount: "2,480+ Reviews",
    tagline: "4.9 / 5 Verified Highway Rating"
  },

  // Dining Tables Setup
  tables: [
    { id: "T1", number: 1, name: "Table 01", capacity: 2 },
    { id: "T2", number: 2, name: "Table 02", capacity: 4 },
    { id: "T3", number: 3, name: "Table 03", capacity: 6 },
    { id: "T4", number: 4, name: "Table 04", capacity: 4 },
    { id: "T5", number: 5, name: "Table 05", capacity: 2 },
    { id: "T6", number: 6, name: "Table 06", capacity: 8 },
    { id: "T7", number: 7, name: "Table 07", capacity: 4 },
    { id: "T8", number: 8, name: "Table 08", capacity: 6 },
    { id: "T9", number: 9, name: "Table 09", capacity: 4 },
    { id: "T10", number: 10, name: "Table 10", capacity: 4 },
    { id: "T11", number: 11, name: "Table 11", capacity: 2 },
    { id: "T12", number: 12, name: "Table 12", capacity: 10 },
  ],

  // Billing & Taxes
  billing: {
    currencySymbol: "₹",
    currencyCode: "INR",
    gstRate: 0.05, // 5% Restaurant GST
    mockUpiId: "thccafe@okhdfcbank",
    allowCashOnCounter: true,
    allowOnlinePayment: true
  },

  // Staff & Admin Defaults
  admin: {
    defaultPin: "7788",
    masterPassword: "admin",
    panelTitle: "Staff & Kitchen Order Terminal"
  },

  // Discount Coupons
  promoCodes: {
    HIGHWAY10: { discountPercent: 10, minOrder: 299, desc: "10% off for highway travelers" },
    TASTE15: { discountPercent: 15, minOrder: 499, desc: "15% off regular guests" },
    NIGHTOWL: { discountAmount: 100, minOrder: 699, desc: "₹100 Flat off for late-night foodies" },
  },

  // Key Experience Highlights
  experiences: [
    {
      title: "Authentic Lounge Vibe",
      desc: "Inspired by cozy road trip culture fused with modern aesthetics, ambient music, and comfortable seating."
    },
    {
      title: "Fresh Mountain Flavors",
      desc: "Crisp mountain ingredients, handcrafted seasonings, sizzling platters, and authentic earthen kulhad beverages."
    },
    {
      title: "Zero-Wait Table Tech",
      desc: "Scan the QR code on your table, customize your spice level, pay online or cash, and track live cooking status on your phone."
    },
    {
      title: "24/7 Always Open Kitchen",
      desc: "Cruising late at night or craving a midnight snack, our chefs keep the kitchen sizzling round the clock."
    }
  ],

  // Customer Reviews
  customerReviews: [
    {
      name: "Aman Rawat",
      role: "Regular Traveler",
      rating: 5,
      location: "Dehradun",
      review: "The late-night food after a long road trip is phenomenal! Scanning table QR and paying via UPI directly without waiting for a waiter is so convenient.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      ordered: "Butter Maggi & Kulhad Chai"
    },
    {
      name: "Sneha Kapoor",
      role: "Food Enthusiast",
      rating: 5,
      location: "Highway Route",
      review: "Warm ambiance and delicious food! The monster burger and hot beverages are outstanding. Plus the live status on phone showed exactly when my food was ready.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      ordered: "18-Wheeler Monster Burger"
    },
    {
      name: "Dr. Karan Sharma",
      role: "Road Tripper",
      rating: 5,
      location: "Weekend Getaway",
      review: "The Grand Sizzler Platter was enormous and the smokey tandoori spices were 10/10. Definitely making this our permanent pitstop on this highway.",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
      ordered: "THC Grand Sizzler Platter"
    }
  ]
};

// Backwards compatibility alias
export const CAFE_CONFIG = {
  ...BRAND_CONFIG,
  name: BRAND_CONFIG.brandName,
  location: BRAND_CONFIG.contact.fullAddress,
  phone: BRAND_CONFIG.contact.phone,
  whatsapp: BRAND_CONFIG.contact.whatsapp,
  openingHours: BRAND_CONFIG.contact.openingHours,
  gstRate: BRAND_CONFIG.billing.gstRate,
  mockUpiId: BRAND_CONFIG.billing.mockUpiId
};
