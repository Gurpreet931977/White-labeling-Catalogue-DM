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
  brandName: "Velour Cafe & Bistro",
  shortName: "Velour",
  logoInitials: "Velour",
  logoTransparent: "/logos/velour-logo-trans.png",
  logoWhiteBg: "/logos/velour-logo-white.png",
  tagline: "Artisan Kitchen • Handcrafted Italian & Specialty Brews",
  
  // Hero Section Customization
  hero: {
    locationTag: "ARTISAN BISTRO • ITALIAN KITCHEN",
    headlineLine1: "Savor Every",
    headlineLine2: "Artisan Flavor.",
    description: "Indulge in hand-stretched wood-fired pizzas, silky Italian pastas, single-origin espresso, and gourmet cafe classics delivered fresh to your seat.",
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
    email: "contact@velourcafe.in",
    googleMapsUrl: "https://maps.google.com",
    openingHours: "Open Daily • 9:00 AM – 11:30 PM",
    announcementText: "Use code: CAFE10 for 10% OFF • Select Dining Table to Order Instantly"
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
    mockUpiId: "velourcafe@okhdfcbank",
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
    clubName: "Velour Artisan Club",
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
    LOYALTY50: { discountPercent: 50, minOrder: 99, desc: "7th Visit Milestone: 50% OFF entire bill!" }
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

/**
 * =========================================================================
 * 6 DISTINCT OPERATING MODEL SYSTEM CONFIGURATIONS
 * =========================================================================
 * Defines the operational copy, badges, primary/secondary CTAs, and fulfillment
 * behavior for each of the 6 white-label architectures.
 */
export const MODEL_SYSTEM_CONFIG = {
  'table-qr': {
    id: 'table-qr',
    badge: 'DINE-IN TABLE QR & POS • ARTISAN KITCHEN',
    headlineLine1: 'Savor Every',
    headlineLine2: 'Artisan Flavor.',
    description: 'Scan your table QR, indulge in hand-stretched wood-fired pizzas, silky Italian pastas, single-origin espresso, and gourmet cafe classics delivered fresh to your seat.',
    primaryCta: 'EXPLORE MENU',
    secondaryCta: 'SCAN TABLE QR',
    secondaryAction: 'scanner',
    highlights: [
      { title: '10-15 Min Serve', subtitle: 'Fast Table Serve', type: 'speed' },
      { title: 'UPI / Cash / Card', subtitle: 'Instant Table Pay', type: 'payment' },
      { title: 'Fresh All-Day', subtitle: 'Wood-Fired Kitchen', type: 'kitchen' },
    ],
    cartTitle: 'Table Order Bag',
    fulfillmentLabel: 'Dine-In Table Service',
    allowOrdering: true,
  },
  'self-serve': {
    id: 'self-serve',
    badge: 'EXPRESS COUNTER QSR • SELF-SERVE',
    headlineLine1: 'Order Fast.',
    headlineLine2: 'Grab & Go Fresh.',
    description: 'Skip the wait lines. Order handcrafted wood-fired slices, artisanal paninis & specialty brews directly on your phone, receive an automated live counter token, and collect fresh at the pickup window.',
    primaryCta: 'ORDER FOR PICKUP',
    secondaryCta: 'HOW IT WORKS',
    secondaryAction: 'info',
    highlights: [
      { title: 'Live Token #', subtitle: 'Counter Queue System', type: 'speed' },
      { title: 'Zero Line Wait', subtitle: 'Self-Serve Kiosk', type: 'payment' },
      { title: 'Chime Alert', subtitle: 'Acoustic Bell Chime', type: 'kitchen' },
    ],
    cartTitle: 'Counter Pickup Bag',
    fulfillmentLabel: 'Express Counter Pickup',
    allowOrdering: true,
  },
  'showcase': {
    id: 'showcase',
    badge: 'BOUTIQUE BISTRO • DIGITAL SHOWCASE',
    headlineLine1: 'Artisan Craft.',
    headlineLine2: 'Unforgettable Ambiance.',
    description: 'Step into an intimate sanctuary of handcrafted pasta, wood-fired sourdough crusts, and single-origin roasts. Browse our seasonal culinary creations and reserve your VIP table for an exceptional evening.',
    primaryCta: 'EXPLORE CURATED MENU',
    secondaryCta: 'BOOK A TABLE RESERVATION',
    secondaryAction: 'reservation',
    highlights: [
      { title: 'VIP Reservations', subtitle: 'Instant Table Pass', type: 'speed' },
      { title: 'Curated Tasting', subtitle: "Chef's Seasonal Menu", type: 'payment' },
      { title: 'Luxury Ambiance', subtitle: 'Romantic Dining', type: 'kitchen' },
    ],
    cartTitle: 'Curated Showcase',
    fulfillmentLabel: 'In-Cafe Dining (Reservation)',
    allowOrdering: false,
  },
  'delivery': {
    id: 'delivery',
    badge: 'DIRECT ONLINE DELIVERY • HOT & FRESH',
    headlineLine1: 'Gourmet Dining,',
    headlineLine2: 'Delivered To Your Door.',
    description: 'Skip the 30% aggregator markups. Order direct from our artisan kitchen straight to your home or office. Insulated thermal packaging and rapid courier dispatch in 30-40 minutes.',
    primaryCta: 'ORDER ONLINE DELIVERY',
    secondaryCta: 'ENTER DELIVERY ADDRESS',
    secondaryAction: 'delivery-address',
    highlights: [
      { title: '30-40 Min Dispatch', subtitle: 'Hot Thermal Courier', type: 'speed' },
      { title: 'FREE Over ₹499', subtitle: 'Zero Commission Markups', type: 'payment' },
      { title: 'Live GPS Courier', subtitle: 'Real-Time Dispatch', type: 'kitchen' },
    ],
    cartTitle: 'Doorstep Delivery Bag',
    fulfillmentLabel: 'Doorstep Courier Delivery',
    allowOrdering: true,
  },
  'hybrid': {
    id: 'hybrid',
    badge: 'OMNICHANNEL DINE-IN & DELIVERY • ALL-IN-ONE',
    headlineLine1: 'Dine At Table,',
    headlineLine2: 'Or Delivered Home.',
    description: 'The complete omnichannel culinary experience. Sit down and order directly to your table with our QR system, or request hot doorstep delivery directly to your home with zero aggregator markups.',
    primaryCta: 'EXPLORE FULL MENU',
    secondaryCta: 'CHOOSE DINING CHANNEL',
    secondaryAction: 'channel-toggle',
    highlights: [
      { title: 'Table or Delivery', subtitle: 'Omnichannel Dining', type: 'speed' },
      { title: 'Dynamic Fulfillment', subtitle: 'Seamless Routing', type: 'payment' },
      { title: 'Zero Aggregator Cut', subtitle: 'Direct Kitchen Fresh', type: 'kitchen' },
    ],
    cartTitle: 'Omnichannel Bag',
    fulfillmentLabel: 'Omnichannel (Table / Delivery / Takeaway)',
    allowOrdering: true,
  },
  'loyalty': {
    id: 'loyalty',
    badge: 'LOYALTY VIP CLUB • 7-VISIT REWARDS',
    headlineLine1: 'Every Visit Rewarded.',
    headlineLine2: '7th Visit 50% OFF.',
    description: 'Join 3,200+ members in our digital punch card club! Settle your bill or check in on each visit to earn stamps automatically. On your 7th visit, unlock 50% OFF your entire bill instantly at checkout.',
    primaryCta: 'EXPLORE MENU & EARN',
    secondaryCta: 'OPEN PUNCH CARD',
    secondaryAction: 'loyalty-card',
    highlights: [
      { title: '7-Stamp Card', subtitle: 'Digital Gold Punch Card', type: 'speed' },
      { title: '50% OFF Milestone', subtitle: 'Automatic Checkout Unlock', type: 'payment' },
      { title: 'Billing Auto-Sync', subtitle: '+1 Stamp Every Bill', type: 'kitchen' },
    ],
    cartTitle: 'Loyalty Rewards Bag',
    fulfillmentLabel: 'Table Service & Loyalty Billing',
    allowOrdering: true,
  },
  'gamified-loyalty': {
    id: 'gamified-loyalty',
    badge: 'COFFEE & BAKERY LOYALTY • 100% GAMIFIED',
    headlineLine1: 'Sip, Savor, Stamp.',
    headlineLine2: 'Jiggly Rewards Club.',
    description: 'Pure gamified customer loyalty club designed for neighborhood coffee shops and artisan bakeries. No food menu or POS clutter—just interactive 8-stamp punch cards, daily caffeine streaks, and secret pastry drops.',
    primaryCta: 'OPEN LOYALTY PASS',
    secondaryCta: 'BARISTA KIOSK',
    secondaryAction: 'gamified-pass',
    highlights: [
      { title: '8-Stamp Pass', subtitle: 'Jiggly Tactile Stamps', type: 'speed' },
      { title: 'Daily Streaks', subtitle: 'Multiplier Rewards', type: 'payment' },
      { title: 'Mystery Treats', subtitle: 'Scratch & Win Box', type: 'kitchen' },
    ],
    cartTitle: 'Perk Vault',
    fulfillmentLabel: 'Coffee & Bakery Loyalty Pass',
    allowOrdering: false,
  }
};
