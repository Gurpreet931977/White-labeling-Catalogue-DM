import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

const INITIAL_DB = {
  users: [
    {
      id: "usr_admin_01",
      role: "admin",
      name: "Velour Admin Desk",
      email: "admin@velourcafe.com",
      pin: "7788",
      password: "admin", // also accepts 'velour2026'
      createdAt: new Date().toISOString()
    },
    {
      id: "usr_demo_01",
      role: "customer",
      name: "Aman Rawat",
      phone: "9876543210",
      email: "aman@highwaysoul.in",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date().toISOString()
    }
  ],
  orders: [
    {
      id: "ORD-9081",
      orderNumber: "VEL-104",
      tableNumber: 4,
      diningMode: "table",
      customerName: "Rahul Sharma",
      customerPhone: "9876543210",
      items: [
        { name: "Mussoorie Road Butter Maggi", qty: 2, spice: "Spicy Tadka", price: 139, addons: ["Double Amul Cheese"] },
        { name: "Doon Valley Kulhad Elaichi Chai", qty: 2, spice: "Regular Sweet", price: 49, addons: ["Add Irani Bun Maska (+₹45)"] }
      ],
      subtotal: 376,
      discount: 37,
      gst: 17,
      tip: 20,
      total: 376,
      paymentMethod: "online",
      paymentStatus: "paid",
      paymentGateway: "Razorpay (UPI / Google Pay)",
      status: "cooking",
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      estimatedMins: 10
    },
    {
      id: "ORD-9080",
      orderNumber: "VEL-103",
      tableNumber: 7,
      diningMode: "table",
      customerName: "Pooja Negi",
      customerPhone: "9811223344",
      items: [
        { name: "The 18-Wheeler Monster Chicken Burger", qty: 1, spice: "Spicy", price: 279, addons: ["Extra Crispy Chicken Patty"] },
        { name: "Himalayan Blue Lagoon Mojito", qty: 1, spice: "Standard", price: 149, addons: [] }
      ],
      subtotal: 518,
      discount: 0,
      gst: 26,
      tip: 30,
      total: 574,
      paymentMethod: "counter",
      paymentStatus: "pending",
      paymentGateway: "Cash / Pay at Counter",
      status: "ready",
      createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
      estimatedMins: 14
    },
    {
      id: "ORD-9079",
      orderNumber: "VEL-102",
      tableNumber: null,
      diningMode: "counter",
      customerName: "Vikram Sethi",
      customerPhone: "9988776655",
      items: [
        { name: "Highway Aloo Pyaaz Paratha", qty: 2, spice: "Chatpata", price: 149, addons: ["Extra Fresh White Butter"] },
        { name: "Doon Valley Kulhad Elaichi Chai", qty: 2, spice: "Regular Sweet", price: 49, addons: [] }
      ],
      subtotal: 396,
      discount: 0,
      gst: 20,
      tip: 0,
      total: 416,
      paymentMethod: "online",
      paymentStatus: "paid",
      paymentGateway: "Cashfree (Paytm UPI)",
      status: "served",
      createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      estimatedMins: 12
    }
  ],
  menu_stock: {},
  settings: {
    cafeName: "Velour Cafe & Bistro",
    location: "Rajpur Road, NH-72A Dehradun",
    isOpen247: true,
    activeTablesCount: 12
  }
};

class Database {
  constructor() {
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
      }
    } catch (e) {
      console.error('Database initialization error:', e);
    }
  }

  read() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        this.init();
      }
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('Database read error, returning fallback:', e);
      return INITIAL_DB;
    }
  }

  write(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (e) {
      console.error('Database write error:', e);
      return false;
    }
  }

  // --- Users & Auth Operations ---
  findUserByCredentials(identifier) {
    const db = this.read();
    const clean = (identifier || '').trim().toLowerCase();
    return db.users.find(u => 
      (u.phone && u.phone === clean) || 
      (u.email && u.email.toLowerCase() === clean) ||
      (u.name && u.name.toLowerCase() === clean)
    );
  }

  createOrUpdateCustomer(userData) {
    const db = this.read();
    const phone = userData.phone ? userData.phone.trim() : null;
    const email = userData.email ? userData.email.trim().toLowerCase() : null;

    let user = db.users.find(u => 
      (phone && u.phone === phone) || 
      (email && u.email && u.email.toLowerCase() === email)
    );

    if (user) {
      user.name = userData.name || user.name;
      user.avatar = userData.avatar || user.avatar;
      user.lastLogin = new Date().toISOString();
    } else {
      user = {
        id: `usr_${Date.now()}`,
        role: "customer",
        name: userData.name || "Highway Guest",
        phone: phone || "9876543210",
        email: email || `${phone || 'guest'}@thccafe.in`,
        avatar: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.name || 'thc')}`,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      db.users.push(user);
    }

    this.write(db);
    return user;
  }

  verifyAdmin(pinOrPassword) {
    const input = (pinOrPassword || '').trim();
    if (!input) return false;
    
    // Accept PIN: 7788 or Passwords: thc2026, admin, admin123
    const validKeys = ["7788", "thc2026", "admin", "admin123"];
    if (validKeys.includes(input)) return true;

    const db = this.read();
    const admin = db.users.find(u => u.role === "admin");
    if (admin && (admin.pin === input || admin.password === input)) {
      return true;
    }
    return false;
  }

  // --- Orders Operations ---
  getOrders() {
    const db = this.read();
    return db.orders || [];
  }

  createOrder(orderData) {
    const db = this.read();
    const orderNum = `THC-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      id: `ORD-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      status: "placed",
      ...orderData
    };

    db.orders.unshift(newOrder);
    this.write(db);
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus) {
    const db = this.read();
    const order = db.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      order.updatedAt = new Date().toISOString();
      this.write(db);
      return order;
    }
    return null;
  }

  // --- Menu Stock Operations ---
  getMenuStock() {
    const db = this.read();
    return db.menu_stock || {};
  }

  toggleItemStock(itemId) {
    const db = this.read();
    if (!db.menu_stock) db.menu_stock = {};
    db.menu_stock[itemId] = !db.menu_stock[itemId];
    this.write(db);
    return db.menu_stock;
  }

  // --- Analytics & Stats ---
  getStats() {
    const db = this.read();
    const orders = db.orders || [];
    const totalRevenue = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + (o.total || 0) : sum, 0);
    const activeOrders = orders.filter(o => ['placed', 'cooking', 'ready'].includes(o.status)).length;
    const completedOrders = orders.filter(o => o.status === 'served').length;

    return {
      totalRevenue,
      activeOrders,
      completedOrders,
      totalOrdersCount: orders.length,
      usersCount: db.users ? db.users.length : 0,
      timestamp: new Date().toISOString()
    };
  }
}

export const db = new Database();
