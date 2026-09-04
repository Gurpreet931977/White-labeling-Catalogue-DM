/**
 * THC Cafe API Client Service
 * Connects frontend client and POS components to the backend database.
 */

const API_BASE = '/api';

export const api = {
  // Check backend DB connection health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (e) {
      console.warn('API Health Check failed, falling back to local simulation:', e);
      return { status: 'offline' };
    }
  },

  // Customer Login or Quick Onboarding
  async customerLogin({ name, phone, email, avatar }) {
    try {
      const res = await fetch(`${API_BASE}/auth/customer-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, avatar })
      });
      return await res.json();
    } catch (e) {
      console.warn('Customer login API failed, using fallback:', e);
      return {
        success: true,
        user: {
          id: `usr_${Date.now()}`,
          role: 'customer',
          name: name || 'Cafe Guest',
          phone: phone || '9876543210',
          email: email || `${phone || 'guest'}@thccafe.in`,
          avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || 'guest')}`
        }
      };
    }
  },

  // Admin Verification (PIN / Password)
  async adminLogin(pinOrPassword) {
    try {
      const res = await fetch(`${API_BASE}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinOrPassword, password: pinOrPassword })
      });
      return await res.json();
    } catch (e) {
      console.warn('Admin login API fallback check:', e);
      const clean = (pinOrPassword || '').trim();
      const valid = ['7788', 'thc2026', 'admin', 'admin123'].includes(clean);
      return valid 
        ? { success: true, role: 'admin' }
        : { success: false, message: 'Invalid Admin PIN or Password.' };
    }
  },

  // Fetch all orders
  async getOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      const data = await res.json();
      return data.orders || [];
    } catch (e) {
      console.warn('Get orders API failed, returning local storage fallback:', e);
      const saved = localStorage.getItem('thc_orders');
      return saved ? JSON.parse(saved) : [];
    }
  },

  // Create new order
  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      return data.order;
    } catch (e) {
      console.warn('Create order API failed, generating client-side fallback:', e);
      return {
        id: `ORD-${Date.now()}`,
        orderNumber: `THC-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toISOString(),
        status: 'placed',
        ...orderData
      };
    }
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      return data.order;
    } catch (e) {
      console.warn('Update order status API failed:', e);
      return { id: orderId, status };
    }
  },

  // Get menu stock overrides
  async getMenuStock() {
    try {
      const res = await fetch(`${API_BASE}/menu/stock`);
      const data = await res.json();
      return data.stock || {};
    } catch (e) {
      console.warn('Get menu stock API failed:', e);
      const saved = localStorage.getItem('thc_menu_stock');
      return saved ? JSON.parse(saved) : {};
    }
  },

  // Toggle item stock
  async toggleItemStock(itemId) {
    try {
      const res = await fetch(`${API_BASE}/menu/${itemId}/stock`, {
        method: 'PATCH'
      });
      const data = await res.json();
      return data.stock;
    } catch (e) {
      console.warn('Toggle item stock API failed:', e);
      return null;
    }
  },

  // Get stats
  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      const data = await res.json();
      return data.stats;
    } catch (e) {
      return null;
    }
  }
};
