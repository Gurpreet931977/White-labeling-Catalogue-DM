/**
 * =========================================================================
 * DRIPP MEDIA - WHITE-LABELING CATALOGUE MASTER DATA
 * =========================================================================
 * Designed strictly using Dripp Media brand colors (#ebd73f, #080808, #ffffff)
 * and brand display fonts (Panchang, Clash Display).
 * Balanced multi-niche architecture with zero single-niche bias.
 */

export const CATALOGUE_DATA = {
  agency: {
    name: "DRIPP MEDIA",
    tagline: "White-Labeling Studio & High-Converting Digital Systems",
    developerModeVersion: "v4.2.0-PROD",
    heroTitleLine1: "DRIPP MEDIA",
    heroTitleLine2: "WHITE-LABEL SUITE",
    heroSub: "Turnkey digital systems engineered for high conversion across modern service businesses.",
    trustMetrics: [
      { value: "50M+", label: "Organic Views Generated" },
      { value: "100+", label: "Brands Scaled Globally" },
      { value: "2-3 Wks", label: "Turnkey Delivery Window" },
      { value: "Top 1%", label: "Design & UX Standard" },
    ],
    contactWhatsApp: "917818995147",
    contactEmail: "hello@drippmedia.com",
    contactWebsite: "https://www.drippmedia.com",
  },

  // Balanced Category filters
  categories: [
    { id: "all", label: "All Niches", count: 6 },
    { id: "cafes", label: "Cafes & Eateries", count: 1 },
    { id: "clinics", label: "Clinics & Healthcare", count: 1 },
    { id: "gyms", label: "Gyms & Fitness", count: 1 },
    { id: "clubs", label: "Nightclubs & Lounges", count: 1 },
    { id: "turfs", label: "Sports Turfs & Arenas", count: 1 },
    { id: "salons", label: "Luxury Salons & Spas", count: 1 },
  ],

  // Niche Showcases (Strictly Dripp Media Yellow & Monochrome)
  niches: [
    {
      id: "cafes",
      code: "01 / F&B",
      category: "cafes",
      title: "Cafes, Quick-Bites & Lounges",
      clientBrand: "Velour - Cafe & Italian Bistro",
      badge: "INTERACTIVE SUITE",
      status: "PRODUCTION ACTIVE",
      headline: "7 Turnkey Operating Models: Table QR, Self-Serve, Delivery & Gamified Loyalty",
      description: "Complete cafe & restaurant operating suite with 7 selectable architectures: Table QR POS, Self-Serve Counter QSR, Brand Showcase Landing Page, Direct Online Delivery, Hybrid Dine-In & Delivery, 7-Visit Loyalty Rewards Club, and Gamified Coffee & Bakery Loyalty Pass & Kiosk.",
      accentColor: "#ebd73f",
      glowClass: "ambient-glow-yellow",
      cardType: "live-app",
      metrics: {
        highlightNum: "7 Models",
        highlightLabel: "Turnkey Architectures",
        retentionNum: "99.4%",
        retentionLabel: "Order Accuracy",
        loadSpeed: "0.28s",
      },
      tags: ["7 Operating Models", "Table QR & Self-Serve", "Direct Online Delivery", "Gamified Loyalty Pass", "Kitchen POS"],
      features: [
        "Instant contactless QR table scanner & session binding",
        "Interactive dietary filter (Pure Veg, Non-Veg, High Protein, Chef Picks)",
        "Item add-on customization modal (Spice levels, extra cheese, combos)",
        "Real-time order progress tracker with live sound alerts",
        "PIN-protected staff POS & Kitchen ticket terminal",
        "Single-file branding & menu JSON configuration"
      ],
      deliverables: "Vite + React SPA, Tailwind CSS, Sound FX Engine, POS API Plugin, Vercel/Netlify 1-click deploy",
      previewImages: [
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80"
      ]
    },

    {
      id: "clinics",
      code: "02 / HEALTH",
      category: "clinics",
      title: "Clinics & Healthcare Practices",
      clientBrand: "AuraCare Specialist Clinic",
      badge: "INTERACTIVE SUITE",
      status: "READY TO DEPLOY",
      headline: "Multi-Doctor Slot Scheduling, Patient Intake & WhatsApp Confirmations",
      description: "High-trust clinical web app for dental, cosmetic dermatology, and physiotherapy practices with instant calendar appointment booking.",
      accentColor: "#ebd73f",
      glowClass: "ambient-glow-yellow",
      cardType: "interactive-demo",
      metrics: {
        highlightNum: "64%",
        highlightLabel: "Reduction in No-Shows",
        retentionNum: "4.2x",
        retentionLabel: "Online Consult Inquiries",
        loadSpeed: "0.32s",
      },
      tags: ["Doctor Selection", "Real-Time Slots", "WhatsApp Confirm", "Patient Intake", "Treatment Catalog"],
      features: [
        "Specialist doctor profile showcase with verified credentials",
        "Interactive slot booking engine (Morning, Afternoon, Evening)",
        "Instant WhatsApp & SMS appointment confirmation dispatch",
        "Digital patient pre-intake checklist & symptom selector",
        "Transparent procedure pricing & EMI treatment financing calculator",
        "HIPAA-friendly contact & secure tele-consult request"
      ],
      deliverables: "React 18, Slot Scheduler Component, WhatsApp Cloud API hook, Treatment Pricing Matrix",
      demoData: {
        doctors: [
          { name: "Dr. Ananya Sharma", specialty: "Cosmetic Dentist & Implantologist", exp: "12+ Yrs", fee: "₹800", rating: 4.9, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80" },
          { name: "Dr. Vikram Sethi", specialty: "Consultant Dermatologist", exp: "9+ Yrs", fee: "₹1,000", rating: 4.95, image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80" },
          { name: "Dr. Rachel Thomas", specialty: "Physiotherapy & Sports Rehab", exp: "14+ Yrs", fee: "₹900", rating: 4.88, image: "https://images.unsplash.com/photo-1594824813689-d102008f5d02?auto=format&fit=crop&w=300&q=80" },
        ],
        availableSlots: ["Today • 04:30 PM", "Today • 06:00 PM", "Tomorrow • 11:30 AM", "Tomorrow • 03:00 PM", "Tomorrow • 05:45 PM"],
        treatments: ["Laser Smile Alignment", "HydraFacial Glow Therapy", "Spine & Posture Rehab", "Dental Veneers & Whitening"]
      }
    },

    {
      id: "gyms",
      code: "03 / FITNESS",
      category: "gyms",
      title: "Gyms, CrossFit & Athletic Studios",
      clientBrand: "IronPulse Elite Performance & Gym",
      badge: "INTERACTIVE SUITE",
      status: "READY TO DEPLOY",
      headline: "Membership Tier Checkout, Live Class Timetable & Trainer Pass",
      description: "High-adrenaline fitness portal designed to turn casual gym lookers into recurring monthly members with class booking and free trials.",
      accentColor: "#ebd73f",
      glowClass: "ambient-glow-yellow",
      cardType: "interactive-demo",
      metrics: {
        highlightNum: "3.4x",
        highlightLabel: "Free Trial Conversions",
        retentionNum: "88%",
        retentionLabel: "Member Re-Enrollment",
        loadSpeed: "0.29s",
      },
      tags: ["Tier Checkout", "Class Schedule", "Trainer Roster", "Free Day Pass", "BMI Estimator"],
      features: [
        "Tiered membership matrix (Standard, Pro Strength, Black Card All-Access)",
        "Live weekly class calendar (CrossFit WOD, Boxing HIIT, Hot Yoga)",
        "Free 1-Day Trial booking engine with instant pass SMS",
        "Trainer showcase with specialization, certifications & client transformations",
        "Virtual 3D gym floor tour & equipment equipment breakdown",
        "Integrated nutrition calculator & merchandise storefront"
      ],
      deliverables: "High-contrast dark UI, Class Schedule Engine, Razorpay/Stripe checkout simulator, Gym Tour Gallery",
      demoData: {
        plans: [
          { name: "Drop-In Pass", price: "₹499", cycle: "single day", perks: ["Full gym floor access", "Locker & steam", "1 Group Class"], tag: "Starter" },
          { name: "Pro Athlete", price: "₹2,499", cycle: "per month", perks: ["All-hours floor access", "Unlimited HIIT & Boxing", "Trainer guidance", "Nutrition blueprint"], tag: "Most Popular", popular: true },
          { name: "Black Card VIP", price: "₹4,999", cycle: "per month", perks: ["24/7 VIP keycard access", "Dedicated 1-on-1 coach", "Recovery lounge & sauna", "Free guest privileges"], tag: "Elite Tier" }
        ],
        classes: [
          { name: "CrossFit MetCon", time: "06:30 AM", trainer: "Coach Ranveer", spots: "3 left", intensity: "Extreme" },
          { name: "Heavy Bag Boxing", time: "07:00 PM", trainer: "Sarah Jenkins", spots: "5 left", intensity: "High" },
          { name: "Olympic Powerlifting", time: "08:15 PM", trainer: "Marcus Cole", spots: "2 left", intensity: "Very High" }
        ]
      }
    },

    {
      id: "clubs",
      code: "04 / NIGHTLIFE",
      category: "clubs",
      title: "Nightclubs, VIP Lounges & Bars",
      clientBrand: "Nocturne VIP Club & Sky Lounge",
      badge: "INTERACTIVE SUITE",
      status: "READY TO DEPLOY",
      headline: "VIP Bottle Service Booking, Guestlist RSVP & Event QR Passes",
      description: "Ultra-luxury nightlife web application featuring dynamic table floor plans, bottle service reservation, and QR guestlist admission.",
      accentColor: "#ebd73f",
      glowClass: "ambient-glow-yellow",
      cardType: "interactive-demo",
      metrics: {
        highlightNum: "4.8x",
        highlightLabel: "VIP Table Pre-Sales",
        retentionNum: "96%",
        retentionLabel: "Guestlist Check-In Rate",
        loadSpeed: "0.31s",
      },
      tags: ["VIP Bottle Service", "Interactive Floorplan", "Guestlist QR", "DJ Lineup", "Dress Code Guidelines"],
      features: [
        "Interactive VIP table selection (DJ Deck, Main Dancefloor, Rooftop Terrace)",
        "Automated VIP bottle minimums calculation & deposit gateway",
        "Instant digital Guestlist entry pass generation with QR verification",
        "Weekly celebrity DJ event calendar with early-bird ticket checkout",
        "Curated craft cocktail & culinary lounge showcase",
        "Real-time guest capacity meter & VIP dress code guidelines"
      ],
      deliverables: "Cyber-luxury visual theme, SVG table floorplan selector, QR Pass generator, Event calendar",
      demoData: {
        tables: [
          { id: "T-VIP-01", name: "DJ Deck VIP Booth", minSpend: "₹35,000", guests: "Up to 8 Guests", status: "Available", perks: "Private security + Dom Pérignon on arrival" },
          { id: "T-MAIN-04", name: "Main Dancefloor Table", minSpend: "₹20,000", guests: "Up to 6 Guests", status: "Available", perks: "Center floor view + dedicated mixologist" },
          { id: "T-ROOF-02", name: "Skyline Terrace Cabana", minSpend: "₹15,000", guests: "Up to 4 Guests", status: "Available", perks: "Panaromic mountain skyline view" }
        ],
        events: [
          { date: "This Friday", dj: "Nora En Pure (Deep House Set)", doorTime: "10:00 PM", entry: "Couples Free on Guestlist" },
          { date: "Saturday", dj: "Boris Brejcha Tribute (High-Tech Minimal)", doorTime: "10:30 PM", entry: "Cover: ₹2,000" }
        ]
      }
    },

    {
      id: "turfs",
      code: "05 / SPORTS",
      category: "turfs",
      title: "Sports Turfs & Box Arenas",
      clientBrand: "BoxArena 360 Multisport Facility",
      badge: "INTERACTIVE SUITE",
      status: "READY TO DEPLOY",
      headline: "Real-Time Hourly Turf Slot Booking, Floodlight Rates & Tournaments",
      description: "End-to-end sports facility booking portal for box cricket, 5v5/7v7 football, and padel tennis with zero double-booking conflicts.",
      accentColor: "#ebd73f",
      glowClass: "ambient-glow-yellow",
      cardType: "interactive-demo",
      metrics: {
        highlightNum: "100%",
        highlightLabel: "Zero Double Bookings",
        retentionNum: "3.1x",
        retentionLabel: "Night Slot Utilization",
        loadSpeed: "0.27s",
      },
      tags: ["Slot Booking", "Peak / Off-Peak", "Floodlight Rates", "Tournament Brackets", "WhatsApp Match Alert"],
      features: [
        "Real-time hourly court reservation calendar with slot status",
        "Dynamic rate engine (Morning discounted, Prime evening, Midnight floodlight)",
        "Instant booking token generation with Google Maps location pin",
        "Tournament registration engine with team roster submission",
        "Sport equipment rental add-ons (Kits, balls, umpire booking)",
        "Captain's WhatsApp group invite link auto-dispatch"
      ],
      deliverables: "Court availability grid, Dynamic Pricing Engine, WhatsApp Location Dispatch, Roster Form",
      demoData: {
        courts: [
          { name: "Pitch A: Box Cricket Pro (Astro-Turf)", rateDay: "₹999/hr", rateNight: "₹1,499/hr (Floodlights)", size: "120ft x 65ft" },
          { name: "Pitch B: FIFA-Grade 7v7 Football", rateDay: "₹1,499/hr", rateNight: "₹2,199/hr (Floodlights)", size: "180ft x 90ft" },
          { name: "Court C: Panoramic Padel Tennis", rateDay: "₹800/hr", rateNight: "₹1,200/hr", size: "Regulation Double" }
        ],
        availableSlots: [
          { time: "06:00 AM - 07:00 AM", rate: "₹999", tag: "Morning Saver" },
          { time: "07:00 PM - 08:00 PM", rate: "₹1,499", tag: "Peak Evening" },
          { time: "09:00 PM - 10:00 PM", rate: "₹1,499", tag: "Floodlight Active" },
          { time: "11:00 PM - 12:00 AM", rate: "₹1,299", tag: "Midnight Match" }
        ]
      }
    },

    {
      id: "salons",
      code: "06 / BEAUTY",
      category: "salons",
      title: "Luxury Salons & Aesthetic Spas",
      clientBrand: "Maison de Luxe Hair & Aesthetic Spa",
      badge: "INTERACTIVE SUITE",
      status: "READY TO DEPLOY",
      headline: "Stylist Selection, Bespoke Treatment Packages & Bridal Portfolios",
      description: "Editorial-grade aesthetic booking portal for premium salons, skin studios, and bridal beauty bars with stylist seat allocation.",
      accentColor: "#ebd73f",
      glowClass: "ambient-glow-yellow",
      cardType: "interactive-demo",
      metrics: {
        highlightNum: "3.7x",
        highlightLabel: "Average Basket Size",
        retentionNum: "92%",
        retentionLabel: "Repeat Appointment Rate",
        loadSpeed: "0.30s",
      },
      tags: ["Stylist Selection", "Treatment Packages", "Bridal Lookbook", "Deposit Checkout", "Instagram Sync"],
      features: [
        "Senior master stylist & colourist portfolio gallery",
        "Package customizer (Hair Spa, Korean Glass Facial, Balayage Color)",
        "Real-time chair booking calendar with service duration estimate",
        "Bridal consultation intake with photo reference upload",
        "Client review lookbook with Instagram feed integration",
        "Gift card vouchers & membership package management"
      ],
      deliverables: "Editorial Typography, Stylist Selection Matrix, Package Add-on Drawer, Lookbook Viewer",
      demoData: {
        services: [
          { name: "Signature Balayage & Olaplex Glaze", duration: "150 mins", price: "₹6,500", popular: true },
          { name: "Korean Glass Skin Hydra-Infusion", duration: "75 mins", price: "₹3,800", popular: false },
          { name: "Royal Keratin Smooth Therapy", duration: "120 mins", price: "₹5,200", popular: true },
          { name: "Bridal Couture Consultation & Trial", duration: "180 mins", price: "₹8,500", popular: false }
        ],
        stylists: ["Alexandre Dumas (Creative Director)", "Tara Varma (Senior Colorist)", "Meera Sen (Aesthetician)"]
      }
    }
  ],

  // White-Label Configuration Presets for the Interactive Customizer
  whiteLabelPresets: [
    { id: "amber", name: "Dripp Signature Yellow", hex: "#ebd73f", bgGlow: "rgba(235, 215, 63, 0.25)" },
    { id: "platinum", name: "Monochrome Platinum", hex: "#f5f5f5", bgGlow: "rgba(245, 245, 245, 0.2)" },
    { id: "gold", name: "Warm Gold", hex: "#facc15", bgGlow: "rgba(250, 204, 21, 0.25)" },
  ],

  // Developer Mode Tech Architecture
  developerSpecs: {
    stack: [
      { name: "Frontend Core", tech: "React 18 + Vite 5", status: "Zero Runtime Overhead" },
      { name: "Styling Engine", tech: "Tailwind CSS + Brand Tokens", status: "Pure Dripp Media Palette" },
      { name: "Animation & Motion", tech: "Framer Motion 11", status: "60 FPS GPU-accelerated" },
      { name: "Audio Feedback", tech: "Web Audio API Synths", status: "Sub-10ms Tactile Clicks" },
      { name: "Persistence", tech: "Local Storage + Mock Node API", status: "Production Server Ready" },
      { name: "Deployment", tech: "Vercel / Netlify / Cloudflare", status: "1-Click GitHub Deploy" }
    ],
    lighthouse: {
      performance: 99,
      accessibility: 100,
      bestPractices: 100,
      seo: 100
    }
  }
};
