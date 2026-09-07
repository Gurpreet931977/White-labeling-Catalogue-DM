import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { sounds } from '../utils/audio';
import { MENU_ITEMS } from '../data/menuData';

const OrderContext = createContext();

const FALLBACK_ORDERS = [
  {
    id: "ORD-9081",
    orderNumber: "THC-104",
    tableNumber: 4,
    diningMode: "table",
    customerName: "Rahul Sharma",
    customerPhone: "9876543210",
    items: [
      { name: "Mussoorie Road Butter Maggi", qty: 2, spice: "Spicy Tadka", price: 139, category: "parathas-maggie", addons: ["Double Amul Cheese"] },
      { name: "Doon Valley Kulhad Elaichi Chai", qty: 2, spice: "Regular Sweet", price: 49, category: "mountain-chai", addons: ["Add Irani Bun Maska (+₹45)"] }
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
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    estimatedMins: 10,
  },
  {
    id: "ORD-9082",
    orderNumber: "THC-105",
    tableNumber: 7,
    diningMode: "table",
    customerName: "Pooja Negi",
    customerPhone: "9811223344",
    items: [
      { name: "The 18-Wheeler Monster Chicken Burger", qty: 1, spice: "Spicy", price: 279, category: "burgers", addons: ["Extra Crispy Chicken Patty"] },
      { name: "Himalayan Blue Lagoon Mojito", qty: 1, spice: "Standard", price: 149, category: "cold-beverages", addons: [] }
    ],
    subtotal: 574,
    discount: 0,
    gst: 28,
    tip: 0,
    total: 574,
    paymentMethod: "cash",
    paymentStatus: "unpaid",
    status: "placed",
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    estimatedMins: 15,
  }
];

// Sanitizes any item image to guarantee ONLY high-definition closeup food photography is used
export function sanitizeMenuItem(item) {
  if (!item) return item;
  let image = item.image;
  const nameLower = (item.name || '').toLowerCase();
  
  // Detect fish photo (photo-1599488615731-7e5c2823ff28) or non-food image
  const isFishPhoto = image && (
    image.includes('photo-1599488615731-7e5c2823ff28') ||
    image.includes('aquarium') ||
    image.includes('fish')
  );

  // Replace with dedicated ultra-high-definition closeup food photography
  if (nameLower.includes('butter chicken') && (nameLower.includes('kathi') || nameLower.includes('roll') || isFishPhoto)) {
    image = '/images/butter_chicken_kathi_roll.jpg';
  } else if ((nameLower.includes('murgh tikka') || nameLower.includes('bhatti') || nameLower.includes('chicken tikka')) && (isFishPhoto || !image || image.includes('photo-1599488615731-7e5c2823ff28'))) {
    image = '/images/charcoal_murgh_tikka.jpg';
  } else if (nameLower.includes('paneer tikka') && (nameLower.includes('kathi') || nameLower.includes('roll') || (image && image.includes('photo-1626777552726-4a6b54c97e46')))) {
    image = '/images/paneer_tikka_kathi_roll.jpg';
  } else if (nameLower.includes('focaccia') || nameLower.includes('garlic pull-apart')) {
    image = '/images/cheesy_garlic_focaccia.jpg';
  } else if (isFishPhoto) {
    image = '/images/butter_chicken_kathi_roll.jpg';
  }

  return { ...item, image };
}

export function sanitizeMenuItemsList(items) {
  if (!Array.isArray(items) || items.length === 0) return MENU_ITEMS;
  return items.map(sanitizeMenuItem);
}

const MENU_DATA_VERSION = 'v2026_closeup_food_v2';

export function OrderProvider({ children }) {
  // Live Menu Items with localStorage & cross-tab persistence and automatic closeup food image sanitization
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const savedVersion = localStorage.getItem('thc_custom_menu_version');
      const saved = localStorage.getItem('thc_custom_menu_items');
      
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = sanitizeMenuItemsList(parsed);
          // If the saved version was older, update localStorage with the sanitized closeup food items
          if (savedVersion !== MENU_DATA_VERSION) {
            localStorage.setItem('thc_custom_menu_version', MENU_DATA_VERSION);
            localStorage.setItem('thc_custom_menu_items', JSON.stringify(sanitized));
          }
          return sanitized;
        }
      }
      localStorage.setItem('thc_custom_menu_version', MENU_DATA_VERSION);
      return MENU_ITEMS;
    } catch (e) {
      return MENU_ITEMS;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('thc_orders');
      return saved ? JSON.parse(saved) : FALLBACK_ORDERS;
    } catch (e) {
      return FALLBACK_ORDERS;
    }
  });

  const [activeCustomerOrderId, setActiveCustomerOrderId] = useState(() => {
    return localStorage.getItem('thc_active_order_id') || null;
  });

  const [menuStockOverrides, setMenuStockOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem('thc_menu_stock');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Table Service Requests: [{ id, tableNumber, type: 'water'|'waiter'|'bill'|'clean', timestamp, status: 'pending' }]
  const [serviceRequests, setServiceRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('thc_service_requests');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isDbSynced, setIsDbSynced] = useState(false);
  const [liveOrderToast, setLiveOrderToast] = useState(null);
  const prevCustomerStatusRef = useRef(null);

  // Active customer order object
  const activeCustomerOrder = orders.find(o => o.id === activeCustomerOrderId) || null;

  // Sync with Backend Database on Mount & periodic background poll
  const syncWithDatabase = useCallback(async () => {
    try {
      const [dbOrders, dbStock] = await Promise.all([
        api.getOrders(),
        api.getMenuStock()
      ]);

      if (Array.isArray(dbOrders) && dbOrders.length > 0) {
        setOrders(prev => {
          if (prev.length > 0 && dbOrders.length > prev.length) {
            const hasNew = dbOrders.some(dbo => !prev.some(p => p.id === dbo.id));
            if (hasNew) sounds.playKitchenAlert();
          }
          return dbOrders;
        });
      }

      if (dbStock && typeof dbStock === 'object') {
        setMenuStockOverrides(dbStock);
      }
      setIsDbSynced(true);
    } catch (e) {
      console.warn('DB Sync fallback error:', e);
    }
  }, []);

  useEffect(() => {
    syncWithDatabase();
    const interval = setInterval(syncWithDatabase, 3000);
    return () => clearInterval(interval);
  }, [syncWithDatabase]);

  // Cross-Tab Synchronization via BroadcastChannel
  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel('thc_cafe_channel');
      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'NEW_ORDER') {
          setOrders(prev => {
            const exists = prev.some(o => o.id === payload.id);
            if (!exists) {
              sounds.playKitchenAlert();
              return [payload, ...prev];
            }
            return prev;
          });
        } else if (type === 'STATUS_UPDATE') {
          setOrders(prev =>
            prev.map(o => (o.id === payload.id ? { ...o, status: payload.status } : o))
          );
        } else if (type === 'STOCK_UPDATE') {
          setMenuStockOverrides(payload);
        } else if (type === 'SERVICE_REQUEST') {
          sounds.playServiceCallChime();
          setServiceRequests(prev => [payload, ...prev.filter(r => r.id !== payload.id)]);
        } else if (type === 'DISMISS_SERVICE') {
          setServiceRequests(prev => prev.filter(r => r.id !== payload));
        } else if (type === 'MENU_ITEM_CREATED') {
          setMenuItems(prev => [payload, ...prev.filter(i => i.id !== payload.id)]);
        } else if (type === 'MENU_ITEM_UPDATED') {
          setMenuItems(prev => prev.map(i => i.id === payload.id ? { ...i, ...payload.data } : i));
        } else if (type === 'MENU_ITEM_DELETED') {
          setMenuItems(prev => prev.filter(i => i.id !== payload));
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported');
    }

    return () => {
      if (channel) channel.close();
    };
  }, []);

  // Save state to local storage
  useEffect(() => {
    localStorage.setItem('thc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('thc_custom_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('thc_service_requests', JSON.stringify(serviceRequests));
  }, [serviceRequests]);

  useEffect(() => {
    if (activeCustomerOrderId) {
      localStorage.setItem('thc_active_order_id', activeCustomerOrderId);
    } else {
      localStorage.removeItem('thc_active_order_id');
    }
  }, [activeCustomerOrderId]);

  useEffect(() => {
    localStorage.setItem('thc_menu_stock', JSON.stringify(menuStockOverrides));
  }, [menuStockOverrides]);

  // Lively Customer Notification Trigger when Order Status changes
  useEffect(() => {
    if (!activeCustomerOrder) {
      prevCustomerStatusRef.current = null;
      return;
    }

    const currentStatus = activeCustomerOrder.status;
    const prevStatus = prevCustomerStatusRef.current;

    if (prevStatus && prevStatus !== currentStatus) {
      if (currentStatus === 'cooking') {
        sounds.playKitchenAlert();
        setLiveOrderToast({
          id: Date.now(),
          type: 'cooking',
          title: 'Chef Started Cooking!',
          message: `Order #${activeCustomerOrder.orderNumber} is now sizzling fresh in the kitchen.`,
          order: activeCustomerOrder
        });
      } else if (currentStatus === 'ready') {
        sounds.playReadyBell();
        setLiveOrderToast({
          id: Date.now(),
          type: 'ready',
          title: 'Food is Hot & Ready!',
          message: activeCustomerOrder.diningMode === 'table'
            ? `Order #${activeCustomerOrder.orderNumber} is on its way to Table #${activeCustomerOrder.tableNumber || '04'}!`
            : `Order #${activeCustomerOrder.orderNumber} is ready for pickup at the counter!`,
          order: activeCustomerOrder
        });
      } else if (currentStatus === 'served') {
        sounds.playOrderPlaced();
        setLiveOrderToast({
          id: Date.now(),
          type: 'served',
          title: 'Order Completed & Served',
          message: `Thank you for dining with us! Enjoy your fresh hot meal.`,
          order: activeCustomerOrder
        });
      }
    }

    prevCustomerStatusRef.current = currentStatus;
  }, [activeCustomerOrder?.status, activeCustomerOrder?.orderNumber, activeCustomerOrder?.diningMode, activeCustomerOrder?.tableNumber]);

  const broadcastEvent = (type, payload) => {
    try {
      const channel = new BroadcastChannel('thc_cafe_channel');
      channel.postMessage({ type, payload });
      channel.close();
    } catch (e) {}
  };

  // Place Order
  const placeOrder = async (orderData) => {
    sounds.playOrderPlaced();
    const orderNum = `THC-${Math.floor(100 + Math.random() * 900)}`;
    const tempOrder = {
      id: `ORD-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      status: "placed",
      ...orderData,
    };

    setOrders(prev => [tempOrder, ...prev]);
    setActiveCustomerOrderId(tempOrder.id);
    broadcastEvent('NEW_ORDER', tempOrder);

    try {
      const savedOrder = await api.createOrder(tempOrder);
      if (savedOrder && savedOrder.id) {
        setOrders(prev => prev.map(o => o.id === tempOrder.id ? savedOrder : o));
        setActiveCustomerOrderId(savedOrder.id);
        return savedOrder;
      }
    } catch (e) {
      console.warn('Backend order creation error:', e);
    }

    return tempOrder;
  };

  // Update Order Status
  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    if (newStatus === 'ready') {
      sounds.playReadyBell();
    } else {
      sounds.playClick();
    }

    broadcastEvent('STATUS_UPDATE', { id: orderId, status: newStatus });

    try {
      await api.updateOrderStatus(orderId, newStatus);
    } catch (e) {
      console.warn('Backend order status update error:', e);
    }
  };

  // Revert / Undo Order Stage
  const revertOrderStatus = async (orderId) => {
    sounds.playClick();
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    let previousStatus = 'placed';
    if (targetOrder.status === 'served') {
      previousStatus = 'ready';
    } else if (targetOrder.status === 'ready') {
      previousStatus = 'cooking';
    } else if (targetOrder.status === 'cooking') {
      previousStatus = 'placed';
    } else if (targetOrder.status === 'cancelled') {
      previousStatus = 'placed';
    }

    await updateOrderStatus(orderId, previousStatus);
  };

  // Request Table Service (Water, Captain/Waiter, Bill, Cleaning)
  const requestTableService = (tableNumber, type = 'water') => {
    sounds.playClick();
    const newReq = {
      id: `SRV-${Date.now()}`,
      tableNumber: tableNumber || 4,
      type, // 'water' | 'waiter' | 'bill' | 'clean'
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    setServiceRequests(prev => [newReq, ...prev]);
    broadcastEvent('SERVICE_REQUEST', newReq);
    return newReq;
  };

  // Dismiss / Complete Table Service Request
  const dismissServiceRequest = (requestId) => {
    sounds.playClick();
    setServiceRequests(prev => prev.filter(r => r.id !== requestId));
    broadcastEvent('DISMISS_SERVICE', requestId);
  };

  // Toggle Stock
  const toggleItemStock = async (itemId) => {
    sounds.playClick();
    const updated = { ...menuStockOverrides, [itemId]: !menuStockOverrides[itemId] };
    setMenuStockOverrides(updated);
    broadcastEvent('STOCK_UPDATE', updated);

    try {
      const dbStock = await api.toggleItemStock(itemId);
      if (dbStock) setMenuStockOverrides(dbStock);
    } catch (e) {
      console.warn('Backend stock toggle error:', e);
    }
  };

  // Menu Items CRUD (Admin Operations)
  const addMenuItem = (itemData) => {
    sounds.playOrderPlaced();
    const newItem = {
      id: `item-${Date.now()}`,
      rating: 5.0,
      reviews: 1,
      customizable: Boolean((itemData.addons && itemData.addons.length > 0) || (itemData.spiceOptions && itemData.spiceOptions.length > 0)),
      isBestseller: Boolean(itemData.isBestseller),
      isSpicy: Boolean(itemData.isSpicy),
      isVeg: itemData.diet === 'veg',
      isEgg: itemData.diet === 'egg',
      searchKeywords: [itemData.name.toLowerCase(), ...(itemData.name.toLowerCase().split(' '))],
      ...itemData,
    };

    setMenuItems(prev => [newItem, ...prev]);
    broadcastEvent('MENU_ITEM_CREATED', newItem);
    return newItem;
  };

  const updateMenuItem = (itemId, updatedData) => {
    sounds.playClick();
    const updated = {
      ...updatedData,
      isVeg: updatedData.diet === 'veg',
      isEgg: updatedData.diet === 'egg',
      customizable: Boolean((updatedData.addons && updatedData.addons.length > 0) || (updatedData.spiceOptions && updatedData.spiceOptions.length > 0)),
    };

    setMenuItems(prev =>
      prev.map(item => item.id === itemId ? { ...item, ...updated } : item)
    );
    broadcastEvent('MENU_ITEM_UPDATED', { id: itemId, data: updated });
  };

  const deleteMenuItem = (itemId) => {
    sounds.playClick();
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
    broadcastEvent('MENU_ITEM_DELETED', itemId);
  };

  const resetMenuToDefaults = () => {
    sounds.playClick();
    setMenuItems(MENU_ITEMS);
    localStorage.setItem('thc_custom_menu_version', MENU_DATA_VERSION);
    localStorage.removeItem('thc_custom_menu_items');
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        menuItems,
        activeCustomerOrderId,
        activeCustomerOrder,
        menuStockOverrides,
        serviceRequests,
        isDbSynced,
        liveOrderToast,
        setLiveOrderToast,
        placeOrder,
        updateOrderStatus,
        revertOrderStatus,
        requestTableService,
        dismissServiceRequest,
        toggleItemStock,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        resetMenuToDefaults,
        setActiveCustomerOrderId,
        syncWithDatabase
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);
