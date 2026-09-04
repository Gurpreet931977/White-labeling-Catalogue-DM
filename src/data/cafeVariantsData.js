/**
 * =========================================================================
 * DRIPP MEDIA - CAFE & DINING WHITE-LABEL VARIANTS DATA
 * =========================================================================
 * Designed strictly using Dripp Media brand colors (#ebd73f, #080808, #ffffff)
 * and brand display fonts (Panchang, Clash Display).
 */

export const CAFE_VARIANTS = [
  // -------------------------------------------------------------------------
  // ARCHETYPE 01: Table QR & Dine-In POS
  // -------------------------------------------------------------------------
  {
    id: "table-qr",
    type: "Dine-In Table QR & POS",
    code: "ARCHETYPE // 01",
    title: "Artisan Cafe, Dine-In & QR Table POS",
    modelName: "Dine-In Table QR Model",
    badge: "FULL-STACK LIVE APP",
    isLiveTHC: true,
    tagline: "Contactless In-Cafe Dining with Table QR Plaques, Food Customization & Live POS",
    description: "Built for dine-in cafes and restaurants where waitstaff serve directly to tables. Diners scan their table QR plaque, customize dish spices and add-ons, pay via UPI or cash, and track live cooking status on their phone.",
    metrics: {
      turnover: "2.8x Table Turnover",
      accuracy: "99.4% Order Precision",
      speed: "0.28s Instant Load"
    },
    idealFor: "Artisan cafes, Italian trattorias, bistro lounges, family restaurants, multi-table eateries",
    features: [
      "Contactless Table Plaque QR scanner with instant table binding (Tables 1–12)",
      "Interactive spice, cheese, add-on & combo customization modal",
      "Real-time live cooking tracker with kitchen bell chime alerts",
      "PIN-protected kitchen order terminal & staff POS (PIN: 7788)",
      "Integrated UPI QR & Cash-at-counter payment routing",
      "Direct table-service call button for server assistance"
    ],
    techStack: "React 18, Table Binding Engine, Web Audio API, POS Plugin",
    previewImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    demoData: {
      activeTableDemo: 4,
      tablesCount: 12,
      serviceType: "Table Service to Seat"
    }
  },

  // -------------------------------------------------------------------------
  // ARCHETYPE 02: Self-Serve & Counter Pickup (QSR)
  // -------------------------------------------------------------------------
  {
    id: "self-serve",
    type: "Self-Serve & Counter Pickup",
    code: "ARCHETYPE // 02",
    title: "Express Self-Serve & Counter Pickup QSR",
    modelName: "Self-Serve Counter Model",
    badge: "QSR READY",
    isLiveTHC: true,
    tagline: "Zero Table Service • Mobile & Kiosk Ordering with Live Counter Queue Tokens",
    description: "Engineered for high-volume coffee shops, burger joints, and fast-casual eateries that do not serve to tables. Customers order on their phones or counter kiosks, receive an automated Order Token (e.g. TOKEN #C-14), and pick up from the counter when their chime rings.",
    metrics: {
      turnover: "45s Average Order",
      accuracy: "0% Table Mixups",
      speed: "3.2x Counter Velocity"
    },
    idealFor: "Coffee kiosks, grab-and-go bakeries, smash burger shops, food court counters, college cafes",
    features: [
      "Zero table dependencies — customers order and self-serve",
      "Automated Counter Token generator (e.g. TOKEN #C-01 to #C-99)",
      "Loud acoustic bell chime alert when kitchen marks order Ready",
      "Large-screen Counter Display queue board compatibility",
      "Instant 1-tap UPI QR and contactless card checkout",
      "Reduces front-of-house staff overhead by up to 60%"
    ],
    techStack: "React 18, Token Queue Engine, Web Audio Chime, Digital Counter Board",
    previewImage: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80",
    demoData: {
      tokenFormat: "TOKEN #C-14",
      pickupStation: "Express Service Counter",
      readyChimeSound: "Double Bell Alert"
    }
  },

  // -------------------------------------------------------------------------
  // ARCHETYPE 03: Brand Showcase & Curated Menu Landing Page
  // -------------------------------------------------------------------------
  {
    id: "showcase",
    type: "Brand Showcase Landing Page",
    code: "ARCHETYPE // 03",
    title: "Aesthetic Brand Showcase & Menu Landing Page",
    modelName: "Brand Showcase Model",
    badge: "PURE ELEGANCE",
    isLiveTHC: true,
    tagline: "High-Converting Digital Flagship with Curated Menu Showcase & VIP Table Reservations",
    description: "Designed for boutique cafes, romantic bistros, and luxury roasteries that want an ultra-premium website to tell their brand story and showcase their menu, without in-store POS ordering. Includes VIP table booking, opening hours, Google Maps directions, and chef highlights.",
    metrics: {
      turnover: "94% Reservation Rate",
      accuracy: "Zero No-Shows",
      speed: "0.22s Blazing Speed"
    },
    idealFor: "Boutique espresso bars, sunset rooftop bistros, heritage tea rooms, fine dining cafes",
    features: [
      "Hero brand storytelling with 3D signature dish showcase carousel",
      "Interactive digital menu browser with dietary tags and ingredients",
      "VIP Table Reservation engine with date, time, and party size selector",
      "Automated WhatsApp reservation confirmation ticket pass",
      "Google Maps interactive location pin & opening hours tracker",
      "Social media Instagram feed gallery integration"
    ],
    techStack: "React 18, Reservation State Engine, WhatsApp Dispatch, Framer Motion 3D",
    previewImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    demoData: {
      seatingZones: ["Indoor Warm Dining", "Terrace Sunset Deck", "Private Alcove"],
      reservationPass: "VIP-RES-9042",
      operatingHours: "Open Daily • 9:00 AM – 11:30 PM"
    }
  },

  // -------------------------------------------------------------------------
  // ARCHETYPE 04: Direct Online Doorstep Delivery (Cloud Kitchen)
  // -------------------------------------------------------------------------
  {
    id: "delivery",
    type: "Direct Online Doorstep Delivery",
    code: "ARCHETYPE // 04",
    title: "Independent Online Delivery & Cloud Kitchen Platform",
    modelName: "Direct Delivery Model",
    badge: "0% COMMISSIONS",
    isLiveTHC: true,
    tagline: "Direct-to-Consumer Doorstep Delivery with Address Capture & Live Rider Tracker",
    description: "Built for cloud kitchens, delivery-first food brands, and cafes wanting to bypass 30% Swiggy/Zomato commissions. Features full customer delivery address capture, live delivery fee calculation, estimated doorstep ETA, and direct UPI/COD checkout.",
    metrics: {
      turnover: "30% Margin Saved",
      accuracy: "99.8% Address Capture",
      speed: "35m Avg Doorstep Delivery"
    },
    idealFor: "Cloud kitchens, artisan pizza delivery, late-night food brands, dessert delivery hubs",
    features: [
      "Doorstep delivery address capture with landmark & delivery notes",
      "Dynamic delivery fee calculation (Free delivery above ₹499)",
      "Real-time cooking & courier dispatch tracker with live countdown",
      "Instant UPI QR, Credit Card, and Cash on Delivery (COD) payment",
      "Direct customer phone and WhatsApp order receipt routing",
      "100% own-brand customer database ownership (No aggregator lock-in)"
    ],
    techStack: "React 18, Geo Address Engine, Dispatch Machine, WhatsApp Receipt Webhook",
    previewImage: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80",
    demoData: {
      deliveryRadius: "Up to 8 km",
      defaultFee: "₹40 (Free above ₹499)",
      avgDoorstepETA: "30-40 Mins"
    }
  },

  // -------------------------------------------------------------------------
  // ARCHETYPE 05: Hybrid Dine-In & Doorstep Delivery Dual Mode
  // -------------------------------------------------------------------------
  {
    id: "hybrid",
    type: "Hybrid Dine-In & Delivery",
    code: "ARCHETYPE // 05",
    title: "Omnichannel Hybrid Dine-In & Doorstep Delivery Suite",
    modelName: "Hybrid Omnichannel Model",
    badge: "ALL-IN-ONE HYBRID",
    isLiveTHC: true,
    tagline: "Seamless 3-in-1 Switcher: Table QR Dine-In, Doorstep Delivery & Express Takeaway",
    description: "The ultimate restaurant architecture combining the best of all worlds. Seamlessly allows customers to order to their table while dining in, order food delivered directly to their doorstep from home, or schedule a quick takeaway pickup on their commute.",
    metrics: {
      turnover: "3.5x Revenue Channels",
      accuracy: "Unified Order POS",
      speed: "1-Click Mode Toggle"
    },
    idealFor: "Modern multi-revenue cafes, artisan pizzerias, bustling city bistros, dessert cafes",
    features: [
      "Interactive 3-way mode switcher (Dine-In Table vs Doorstep Delivery vs Takeaway)",
      "Smart context-aware cart: requests table # when in cafe, address when at home",
      "Unified kitchen POS routing separating dine-in tickets from delivery parcels",
      "Universal promo coupon engine working across all ordering modes",
      "Customer account order history with reorder from home functionality",
      "Live order status tracker tailored to dine-in prep or delivery transit"
    ],
    techStack: "React 18, Omnichannel State Router, Dual-POS Filter, Web Audio API",
    previewImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    demoData: {
      supportedModes: ["Table QR Dine-In", "Doorstep Delivery", "Express Takeaway"],
      tableOption: "Active (Tables 1-12)",
      deliveryOption: "Active (Doorstep Delivery)"
    }
  },

  // -------------------------------------------------------------------------
  // ARCHETYPE 06: Loyalty Rewards & 7-Visit Punch-Card Club
  // -------------------------------------------------------------------------
  {
    id: "loyalty",
    type: "Loyalty Club & Visit Tracker",
    code: "ARCHETYPE // 06",
    title: "Loyalty Club & 7-Visit Digital Punch-Card POS",
    modelName: "Loyalty Rewards Model",
    badge: "HIGH RETENTION",
    isLiveTHC: true,
    tagline: "Integrated Billing Visit Tracking • 7-Stamp Punch Card Unlocks 50% OFF or Free Item",
    description: "Designed to build obsessive customer loyalty and drive repeat visits. Features an interactive 7-stamp digital punch card. Every time billing is completed or customer checks in, their visit count marks up automatically. On their 7th visit, a massive 50% OFF reward unlocks directly at checkout!",
    metrics: {
      turnover: "4.8x Repeat Visits",
      accuracy: "87% Loyalty Adoption",
      speed: "+62% Customer LTV"
    },
    idealFor: "Coffee shops, neighborhood cafes, bubble tea lounges, artisan bakeries, dessert clubs",
    features: [
      "Interactive 7-stamp digital punch card with animated gold stamp badges",
      "Automatic visit tracking integrated directly with billing & payment completion",
      "In-store 'Mark Presence / Daily Check-in' customer kiosk button",
      "Milestone rewards: Free Signature Beverage or 50% OFF entire bill on 7th visit",
      "Instant checkout redemption: 1-tap applies milestone reward during billing",
      "Member VIP Pass with tier progression (Bronze, Silver, Gold Member)"
    ],
    techStack: "React 18, Punch-Card State Machine, Billing Milestone Hook, Confetti Engine",
    previewImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    demoData: {
      totalStamps: 7,
      currentDemoStamp: 3,
      milestoneReward: "50% OFF Entire Order (or Free Item) on 7th Visit",
      billingSync: "Automatic +1 Stamp on Every Paid Bill"
    }
  }
];

// Compatibility lookup map
export const CAFE_VARIANTS_MAP = CAFE_VARIANTS.reduce((acc, v) => {
  acc[v.id] = v;
  return acc;
}, {});
