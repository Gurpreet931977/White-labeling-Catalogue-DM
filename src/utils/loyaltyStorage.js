// Centralized LocalStorage Database & State Engine for Gamified Loyalty System

export const LOYALTY_GIFTS_POOL = [
  {
    id: 'discount50',
    title: '50% OFF Entire Order',
    subtitle: 'Max discount ₹500 / $25',
    type: 'discount',
    badge: '50% OFF',
    desc: 'Applies 50% discount automatically to your entire bill upon milestone completion.',
    iconName: 'Percent',
    color: 'from-amber-400 to-yellow-500'
  },
  {
    id: 'free_coffee',
    title: 'Free Signature Specialty Coffee',
    subtitle: 'Any Pour-Over, Flat White, or Cold Brew',
    type: 'beverage',
    badge: 'FREE BREW',
    desc: 'Redeem any handcrafted hot or iced specialty beverage on the house.',
    iconName: 'Coffee',
    color: 'from-amber-500 to-amber-700'
  },
  {
    id: 'free_pastry',
    title: 'Free Flaky Butter Croissant',
    subtitle: 'Fresh stone-baked morning artisan pastry',
    type: 'pastry',
    badge: 'FREE BAKE',
    desc: 'Redeem a warm butter croissant, pain au chocolat, or cinnamon roll.',
    iconName: 'Croissant',
    color: 'from-orange-400 to-amber-600'
  },
  {
    id: 'combo_gift',
    title: 'Free Specialty Beverage + Artisan Treat',
    subtitle: 'Handcrafted Latte + Warm Pastry Combo',
    type: 'combo',
    badge: 'FREE COMBO',
    desc: 'The ultimate VIP milestone treat: your favorite beverage paired with a fresh bake.',
    iconName: 'Gift',
    color: 'from-purple-500 to-purple-700'
  },
  {
    id: 'free_sourdough',
    title: 'Free Stone-Baked Sourdough Loaf',
    subtitle: 'Artisanal country loaf baked fresh daily',
    type: 'bakery',
    badge: 'FREE LOAF',
    desc: 'Take home a full whole-wheat sourdough loaf on your milestone visit.',
    iconName: 'Store',
    color: 'from-yellow-500 to-amber-700'
  }
];

const DEFAULT_ADMIN_CONFIG = {
  totalStamps: 6, // User requested: "make it 6 stamps as of now but the admin should be able to change it upto 12 stamps"
  minStamps: 4,
  maxStamps: 12,
  streakBonusThreshold: 5, // User requested: "5 days of streak mark them up a day faster on stamps (marking 2 stamps at a time)"
  defaultGiftMode: 'random' // User requested: "admin should be able to choose the free gift for a customer but by default it should be random"
};

const INITIAL_CUSTOMERS = [
  {
    id: 'cust-1',
    name: 'Maya Chen',
    phone: '9876543210',
    stamps: 4,
    streakDays: 5, // Active 5-day streak! Next bill will grant 2 stamps!
    xp: 420,
    assignedGiftId: 'discount50', // 50% discount gift
    billingHistory: [
      { id: 'BILL-1092', date: '2026-09-02', time: '09:15 AM', amount: 380, items: 'Flat White + Butter Croissant', stampsAwarded: 1, streakApplied: false },
      { id: 'BILL-1145', date: '2026-09-03', time: '08:40 AM', amount: 240, items: 'Iced Americano', stampsAwarded: 1, streakApplied: false },
      { id: 'BILL-1188', date: '2026-09-04', time: '10:20 AM', amount: 490, items: 'Cold Brew + Cinnamon Roll', stampsAwarded: 1, streakApplied: false },
      { id: 'BILL-1234', date: '2026-09-05', time: '09:05 AM', amount: 320, items: 'Cortado + Pain au Chocolat', stampsAwarded: 1, streakApplied: false }
    ],
    redeemedVouchers: []
  },
  {
    id: 'cust-2',
    name: 'Liam Kapoor',
    phone: '9812345678',
    stamps: 5,
    streakDays: 3,
    xp: 510,
    assignedGiftId: 'free_coffee',
    billingHistory: [
      { id: 'BILL-1050', date: '2026-09-01', time: '08:30 AM', amount: 220, items: 'Espresso Double', stampsAwarded: 1, streakApplied: false },
      { id: 'BILL-1120', date: '2026-09-02', time: '09:10 AM', amount: 310, items: 'Flat White + Oat Milk', stampsAwarded: 1, streakApplied: false },
      { id: 'BILL-1199', date: '2026-09-04', time: '04:15 PM', amount: 260, items: 'Cold Brew', stampsAwarded: 1, streakApplied: false }
    ],
    redeemedVouchers: []
  },
  {
    id: 'cust-3',
    name: 'Sophie Martinez',
    phone: '9898989898',
    stamps: 1,
    streakDays: 1,
    xp: 150,
    assignedGiftId: 'free_pastry',
    billingHistory: [
      { id: 'BILL-1240', date: '2026-09-06', time: '11:05 AM', amount: 350, items: 'Matcha Latte + Butter Croissant', stampsAwarded: 1, streakApplied: false }
    ],
    redeemedVouchers: []
  }
];

// Helper: Get random gift from pool
export function getRandomGift() {
  const randomIndex = Math.floor(Math.random() * LOYALTY_GIFTS_POOL.length);
  return LOYALTY_GIFTS_POOL[randomIndex];
}

// Helper: Get gift details by ID
export function getGiftById(giftId) {
  const found = LOYALTY_GIFTS_POOL.find((g) => g.id === giftId);
  return found || LOYALTY_GIFTS_POOL[0];
}

// Get Admin Config with localStorage fallback
export function getLoyaltyAdminConfig() {
  try {
    const saved = localStorage.getItem('thc_loyalty_admin_config');
    if (saved) {
      return { ...DEFAULT_ADMIN_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {}
  return { ...DEFAULT_ADMIN_CONFIG };
}

// Save Admin Config
export function saveLoyaltyAdminConfig(newConfig) {
  try {
    const updated = { ...getLoyaltyAdminConfig(), ...newConfig };
    localStorage.setItem('thc_loyalty_admin_config', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('thc_loyalty_config_change', { detail: updated }));
    return updated;
  } catch (e) {
    return newConfig;
  }
}

// Get All Customers with localStorage fallback
export function getLoyaltyCustomers() {
  try {
    const saved = localStorage.getItem('thc_loyalty_customers_db');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  // Initialize with initial customers
  localStorage.setItem('thc_loyalty_customers_db', JSON.stringify(INITIAL_CUSTOMERS));
  return [...INITIAL_CUSTOMERS];
}

// Save Customer list
export function saveLoyaltyCustomers(customers) {
  try {
    localStorage.setItem('thc_loyalty_customers_db', JSON.stringify(customers));
    window.dispatchEvent(new CustomEvent('thc_loyalty_customers_change', { detail: customers }));
  } catch (e) {}
}

// Save Single Customer
export function saveLoyaltyCustomer(updatedCustomer) {
  const customers = getLoyaltyCustomers();
  const index = customers.findIndex((c) => c.id === updatedCustomer.id || c.phone === updatedCustomer.phone);
  let updatedList;
  if (index > -1) {
    updatedList = [...customers];
    updatedList[index] = updatedCustomer;
  } else {
    updatedList = [...customers, updatedCustomer];
  }
  saveLoyaltyCustomers(updatedList);
  return updatedCustomer;
}

// Get Customer by Phone or ID
export function getLoyaltyCustomer(phoneOrId) {
  const clean = (phoneOrId || '').toString().replace(/\D/g, '');
  const customers = getLoyaltyCustomers();
  return (
    customers.find((c) => c.id === phoneOrId || c.phone.replace(/\D/g, '') === clean) ||
    customers[0]
  );
}

// ============================================================================
// CORE BILLING ENGINE: Process Bill Settlement & Automatic Stamp Markup
// ============================================================================
export function processBillingTransaction({ customerId, phone, billAmount = 350, billItems = 'Handcrafted Coffee & Bakery Treat' }) {
  const config = getLoyaltyAdminConfig();
  const customer = getLoyaltyCustomer(customerId || phone);
  if (!customer) return null;

  // Streak Mechanics:
  // "and the the streak of days should help only in skipping a day from stamps(marking 2 stamps at a time) like 5 days of streak mark them up a day faster on stamps."
  const hasStreakBonus = (customer.streakDays || 0) >= (config.streakBonusThreshold || 5);
  const stampsToAward = hasStreakBonus ? 2 : 1;
  const newStamps = Math.min(config.totalStamps, (customer.stamps || 0) + stampsToAward);
  const isRewardUnlocked = newStamps >= config.totalStamps;

  const newBillRecord = {
    id: `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    amount: Number(billAmount) || 350,
    items: billItems || 'Artisan Cafe Order',
    stampsAwarded: stampsToAward,
    streakApplied: hasStreakBonus
  };

  const updatedCustomer = {
    ...customer,
    stamps: newStamps,
    streakDays: (customer.streakDays || 0) + 1,
    xp: (customer.xp || 0) + (hasStreakBonus ? 100 : 50),
    billingHistory: [newBillRecord, ...(customer.billingHistory || [])]
  };

  // If milestone unlocked and not yet rewarded
  if (isRewardUnlocked) {
    const gift = getGiftById(updatedCustomer.assignedGiftId || 'discount50');
    if (!updatedCustomer.redeemedVouchers) updatedCustomer.redeemedVouchers = [];
    const alreadyUnlocked = updatedCustomer.redeemedVouchers.some((v) => v.voucherCode === `CLAIM-${newBillRecord.id}`);
    if (!alreadyUnlocked) {
      updatedCustomer.redeemedVouchers.push({
        id: `VOUCHER-${Date.now()}`,
        giftId: gift.id,
        title: gift.title,
        desc: gift.desc,
        unlockedAt: new Date().toISOString(),
        voucherCode: `CLAIM-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'ready'
      });
    }
  }

  saveLoyaltyCustomer(updatedCustomer);

  return {
    customer: updatedCustomer,
    stampsAwarded: stampsToAward,
    hasStreakBonus,
    isRewardUnlocked,
    billRecord: newBillRecord
  };
}

// Reset customer card to 1 stamp (for testing/demo)
export function resetCustomerCard(customerId) {
  const customer = getLoyaltyCustomer(customerId);
  if (!customer) return;

  const updated = {
    ...customer,
    stamps: 1,
    redeemedVouchers: (customer.redeemedVouchers || []).filter((v) => v.status === 'used')
  };
  saveLoyaltyCustomer(updated);
  return updated;
}
