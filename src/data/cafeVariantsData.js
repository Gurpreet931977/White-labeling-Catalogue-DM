/**
 * =========================================================================
 * DRIPP MEDIA - CAFE & DINING WHITE-LABEL VARIANTS DATA
 * =========================================================================
 * Designed strictly using Dripp Media brand colors (#ebd73f, #080808, #ffffff)
 * and brand display fonts (Panchang, Clash Display).
 */

export const CAFE_VARIANTS = [
  {
    id: "thc-diner",
    type: "Casual Dine-In & QR POS",
    code: "ARCHETYPE // 01",
    title: "Casual Dine-In, Highway Hub & QR Table POS",
    modelName: "THC Cafe Model",
    badge: "FULL-STACK LIVE APP",
    isLiveTHC: true,
    tagline: "High-Traffic Fast-Casual Dining with Contactless Table QR Plaque & Staff Terminal",
    description: "The complete restaurant operating system deployed for Truckers Halt Cafe. Includes table QR scanning, custom item add-ons, UPI/Cash payments, live sound alerts, and PIN-protected kitchen POS.",
    metrics: {
      turnover: "2.8x Table Speed",
      accuracy: "99.4% Order Precision",
      speed: "0.28s Instant Load"
    },
    idealFor: "Highway pitstops, casual burger lounges, family diners, bustling urban cafes",
    features: [
      "Contactless Table Plaque QR scanner with instant table binding",
      "Interactive spice, add-on & combo customization modal",
      "Real-time live cooking tracker with audio bell chime alerts",
      "PIN-protected kitchen display & staff order terminal (PIN: 7788)",
      "Built-in UPI QR and Cash-at-counter payment routing",
      "Single-file branding & menu JSON architecture"
    ],
    techStack: "React 18 + Vite 5, Web Audio API, LocalStorage Sync, POS API Plugin",
    previewImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
  },

  {
    id: "artisanal-roastery",
    type: "Specialty Coffee & Roastery",
    code: "ARCHETYPE // 02",
    title: "Specialty Micro-Roastery & Pour-Over Espresso Bar",
    modelName: "Kōhī Roaster Model",
    badge: "INTERACTIVE SHOWCASE",
    isLiveTHC: false,
    tagline: "Third-Wave Coffeehouse with Bean Origin Notes & Recurring Coffee Subscriptions",
    description: "Designed for specialty coffee roasters and third-wave cafes. Features detailed bean elevation & wash profiles, brew method selection (V60, Aeropress, Cold Drip), and monthly whole-bean subscription checkout.",
    metrics: {
      turnover: "3.4x AOV Lift",
      accuracy: "42% Subscription Rate",
      speed: "0.25s Instant Load"
    },
    idealFor: "Third-wave coffee shops, artisanal bakeries, boutique espresso bars, bean roasters",
    features: [
      "Interactive coffee bean origin picker (Ethiopian Yirgacheffe, Gesha, Bourbon)",
      "Brew method customizer (V60 Pour-Over, Chemex, Aeropress, Espresso)",
      "Monthly & weekly whole-bean / grounds subscription engine",
      "Roast date freshness transparency indicator",
      "Barista brew guides & tasting wheel notes",
      "Merchandise & home brewing gear storefront"
    ],
    techStack: "React 18, Subscription State Engine, Flavor Wheel Matrix, Stripe/Razorpay",
    previewImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    demoData: {
      beans: [
        { name: "Ethiopia Yirgacheffe G1", notes: "Jasmine, Bergamot, Peach", roast: "Light Roast", elevation: "2,100m", price: "₹650 / 250g" },
        { name: "Colombia Pink Bourbon", notes: "Pink Grapefruit, Honey, Papaya", roast: "Medium-Light", elevation: "1,850m", price: "₹850 / 250g" },
        { name: "Monsooned Malabar AA", notes: "Dark Chocolate, Spices, Earthy", roast: "Dark Roast", elevation: "1,200m", price: "₹520 / 250g" }
      ],
      brewMethods: ["V60 Hand Drip", "Cold Drip (18h)", "Aeropress", "Classic Flat White"],
      subFrequencies: ["Bi-Weekly Delivery (Save 15%)", "Monthly Box (Save 10%)", "One-Time Bag"]
    }
  },

  {
    id: "rooftop-bistro",
    type: "Rooftop & Fine Dining",
    code: "ARCHETYPE // 03",
    title: "Rooftop Botanical Bistro & Experiential Dining",
    modelName: "Verdant Bistro Model",
    badge: "INTERACTIVE SHOWCASE",
    isLiveTHC: false,
    tagline: "Panoramic Table Seating Reservation, Prix-Fixe Menus & Wine Cellar Pairings",
    description: "Engineered for high-end aesthetic bistros, glasshouse eateries, and sunset lounges. Features visual floor table allocation, advance minimum-spend reservation deposits, and seasonal multi-course chef tastings.",
    metrics: {
      turnover: "96% Table Pre-Booking",
      accuracy: "Zero Walkout No-Shows",
      speed: "0.29s Instant Load"
    },
    idealFor: "Rooftop lounges, garden glasshouse cafes, romantic date bistros, fine dining",
    features: [
      "Visual seating zone selection (Sunset Terrace, Glass Greenhouse, Cozy Alcove)",
      "Advance table reservation with minimum spend deposit checkout",
      "Multi-course Chef's seasonal prix-fixe menu with wine pairings",
      "Live music & jazz sundowner event reservations",
      "Dietary concierge & anniversary/celebration custom requests",
      "Automated WhatsApp VIP table confirmation pass"
    ],
    techStack: "React 18, Seating Floorplan Engine, Advance Deposit Gateway, WhatsApp Hooks",
    previewImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    demoData: {
      zones: [
        { name: "Terrace Sunset Deck", minSpend: "₹3,500 / table", capacity: "2-4 Guests", vibe: "Panoramic Valley View" },
        { name: "Botanical Greenhouse", minSpend: "₹2,500 / table", capacity: "4-6 Guests", vibe: "Foliage & Candlelight" },
        { name: "Mezzanine Wine Corner", minSpend: "₹2,000 / table", capacity: "2 Guests", vibe: "Intimate & Quiet" }
      ],
      menus: [
        { title: "5-Course Mountain Truffle Tasting", price: "₹2,499 / person" },
        { title: "Artisanal Woodfire & Pairing Dinner", price: "₹1,899 / person" }
      ]
    }
  },

  {
    id: "cloud-kitchen",
    type: "Cloud Kitchen & Express Takeaway",
    code: "ARCHETYPE // 04",
    title: "Express Cloud Kitchen & High-Velocity Takeaway",
    modelName: "Volt Express Model",
    badge: "INTERACTIVE SHOWCASE",
    isLiveTHC: false,
    tagline: "60-Second Mobile Pre-Orders, Takeaway Queue Token & Smash Combo Builder",
    description: "Built for delivery-first cloud brands, smash burger kitchens, and express coffee kiosks. Designed for lightning-fast 3-click ordering, step-by-step combo meal builder, and real-time counter pickup queue tokens.",
    metrics: {
      turnover: "60s Avg Checkout",
      accuracy: "4.1x Pickup Volume",
      speed: "0.22s Blazing Speed"
    },
    idealFor: "Cloud kitchens, smash burger joints, takeaway kiosks, delivery-first food brands",
    features: [
      "3-Click express checkout engineered for maximum conversion",
      "Interactive combo meal step-builder (Main + Gourmet Side + Beverage)",
      "Live pickup queue counter display token with estimated prep timer",
      "Aggregator-independent direct ordering (0% commissions)",
      "One-tap repeat order from order history",
      "Apple Pay, Google Pay & UPI instant checkout flow"
    ],
    techStack: "React 18, Ultra-Fast State Machine, Express Token Engine, Webhook Dispatch",
    previewImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    demoData: {
      combos: [
        { name: "Double Wagyu Smash Combo", price: "₹449", includes: "Double Smash + Truffle Fries + Cold Brew Float" },
        { name: "Nashville Hot Chicken Box", price: "₹399", includes: "Spicy Tenders + Butter Brioche Bun + Spiced Slaw" },
        { name: "Truffle Smashed Portobello Box", price: "₹389", includes: "Crispy Mushroom + Parmesan Herb Fries + Mint Soda" }
      ],
      pickupTimes: ["Ready in 10-12 Mins", "Ready in 15-20 Mins", "Scheduled Pickup"]
    }
  }
];
