/**
 * =========================================================================
 * BRAND & CAFE CONFIGURATION (WHITE-LABEL CONFIG)
 * =========================================================================
 * To re-brand this website for any new cafe, restaurant, lounge, or bistro,
 * simply change the values in this single configuration file!
 * All components across the frontend and admin panel read dynamically from here.
 */

export const BRAND_CONFIG = {
  // Brand Identity
  brandName: "THC Cafe & Bistro",
  shortName: "THC Cafe",
  logoInitials: "THC",
  tagline: "Artisan Kitchen • Handcrafted Italian & Specialty Brews",
  
  // Hero Section Customization
  hero: {
    locationTag: "ARTISAN BISTRO • ITALIAN KITCHEN",
    headlineLine1: "Savor Every",
    headlineLine2: "Artisan Flavor.",
    description: "Scan your table QR, indulge in hand-stretched wood-fired pizzas, silky Italian pastas, single-origin espresso, and gourmet cafe classics delivered fresh to your seat.",
    deliveryTag: "10-15 Min Table Serve",
    paymentTag: "UPI / Cash / Card",
    kitchenTag: "Fresh All-Day Kitchen"
  },

  // Contact & Location Details
  contact: {
    city: "Dehradun",
    state: "Uttarakhand",
    shortAddress: "Rajpur Road Bistro Hub",
    fullAddress: "Rajpur Road, Near Clock Tower, Dehradun, Uttarakhand 248001",
    phone: "+91 98970 00842",
    whatsapp: "919897000842",
    email: "contact@thccafe.in",
    googleMapsUrl: "https://maps.google.com",
    openingHours: "Open Daily • 9:00 AM – 11:30 PM",
    announcementText: "Use code: CAFE10 for 10% OFF • Scan Table QR to Order Instantly"
  },

  // Ratings & Social Proof
  rating: {
    score: 4.9,
    reviewsCount: "3,150+ Reviews",
    tagline: "4.9 / 5 Verified Bistro Rating"
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

  // Delivery Program Configuration
  delivery: {
    enabled: true,
    standardFee: 40,
    freeDeliveryThreshold: 499,
    estimatedMinutes: "30-40 mins",
    serviceRadiusKm: 8,
    deliveryNotice: "Freshly packaged in thermal insulated bags"
  },

  // Loyalty Program Configuration
  loyalty: {
    enabled: true,
    totalStampsRequired: 7,
    milestoneRewardTitle: "50% OFF Entire Order (or Free Signature Item)",
    milestonePromoCode: "LOYALTY50",
    milestoneDiscountPercent: 50,
    clubName: "THC Artisan Club",
    stampIcon: "Coffee"
  },

  // Self-Serve / Counter Pickup Configuration
  selfServe: {
    counterName: "Express Pickup Counter",
    tokenPrefix: "C-",
    pickupNotice: "Collect from counter window when your token chime rings"
  },

  // Discount Coupons
  promoCodes: {
    CAFE10: { discountPercent: 10, minOrder: 299, desc: "10% off for all cafe guests" },
    ITALIA15: { discountPercent: 15, minOrder: 499, desc: "15% off on artisan pizzas & pastas" },
    BISTRO100: { discountAmount: 100, minOrder: 699, desc: "₹100 Flat off for gourmet meals" },
    LOYALTY50: { discountPercent: 50, minOrder: 99, desc: "🎉 7th Visit Milestone: 50% OFF entire bill!" }
  },

  // Key Experience Highlights
  experiences: [
    {
      title: "Handcrafted Italian Kitchen",
      desc: "Slow-fermented wood-fired crusts, silky artisanal pasta sauces, San Marzano tomatoes, and fresh buffalo mozzarella."
    },
    {
      title: "Specialty Roasted Brews",
      desc: "Single-origin Arabica beans roasted to perfection, velvet microfoam flat whites, cold brews, and signature iced coffees."
    },
    {
      title: "Zero-Wait Table Tech",
      desc: "Scan the QR code on your table, customize your dishes, pay online or cash, and track live cooking status on your phone."
    },
    {
      title: "Cozy Bistro Ambience",
      desc: "Warm ambient acoustics, aesthetic indoor and terrace seating, perfect for work dates, friendly catch-ups, or relaxed evenings."
    }
  ],

  // Customer Reviews
  customerReviews: [
    {
      name: "Aman Rawat",
      role: "Regular Foodie",
      rating: 5,
      location: "Dehradun",
      review: "The Wood-Fired Margherita and Truffle Alfredo are simply the best in the city. Scanning table QR and paying via UPI directly from our table is so seamless!",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      ordered: "Margherita Basilico & Cold Brew"
    },
    {
      name: "Sneha Kapoor",
      role: "Coffee & Food Critic",
      rating: 5,
      location: "Rajpur Road",
      review: "Warm cozy ambiance with delightful lo-fi tunes. The sourdough panini and Iced Caramel Macchiato were perfection. Love seeing live kitchen updates on phone!",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      ordered: "Smoked Chicken Panini & Macchiato"
    },
    {
      name: "Dr. Karan Sharma",
      role: "Bistro Enthusiast",
      rating: 5,
      location: "Civil Lines",
      review: "The Tiramisu Classico and Truffle Parmesan Fries were incredible. Beautiful aesthetic interior, fast table service, and friendly staff. Our new favorite cafe hangout.",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
      ordered: "Tiramisu Classico & Truffle Fries"
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
