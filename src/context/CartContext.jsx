import React, { createContext, useContext, useState, useEffect } from 'react';
import { CAFE_CONFIG } from '../data/cafeConfig';
import { sounds } from '../utils/audio';
import { useAuth } from './AuthContext';
import { sanitizeMenuItem } from './OrderContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { customerUser } = useAuth();

  // Cart items state with localStorage persistence and food image sanitization
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('thc_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(ci => ({
            ...ci,
            item: sanitizeMenuItem(ci.item)
          }));
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Operational Model: 'table-qr' | 'self-serve' | 'showcase' | 'delivery' | 'hybrid' | 'loyalty'
  const [operationalModel, setOperationalModel] = useState(() => {
    return localStorage.getItem('thc_operational_model') || 'table-qr';
  });

  const parseTableFromLocation = () => {
    if (typeof window === 'undefined') return null;
    try {
      // 1. Check window.location.search (?table=4)
      const searchParams = new URLSearchParams(window.location.search);
      const sTable = searchParams.get('table');
      if (sTable) {
        const num = parseInt(sTable, 10);
        if (!isNaN(num) && num > 0 && num <= 99) return num;
      }

      // 2. Check window.location.hash (#cafe-demo?table=4 or #cafe-demo&table=4)
      const hash = window.location.hash || '';
      const qIdx = hash.indexOf('?');
      if (qIdx !== -1) {
        const hashParams = new URLSearchParams(hash.substring(qIdx));
        const hTable = hashParams.get('table');
        if (hTable) {
          const num = parseInt(hTable, 10);
          if (!isNaN(num) && num > 0 && num <= 99) return num;
        }
      }
      const ampIdx = hash.indexOf('&table=');
      if (ampIdx !== -1) {
        const val = hash.substring(ampIdx + 7).split('&')[0];
        const num = parseInt(val, 10);
        if (!isNaN(num) && num > 0 && num <= 99) return num;
      }
    } catch {
      // fallback
    }
    return null;
  };

  const [activeTable, setActiveTable] = useState(() => {
    const fromUrl = parseTableFromLocation();
    if (fromUrl) return fromUrl;
    const saved = localStorage.getItem('thc_active_table');
    return saved ? parseInt(saved, 10) : 4; // Default to Table 4 demo
  });

  // Keep table binding synced if customer scans different table QR code
  useEffect(() => {
    const handleUrlChange = () => {
      const tableFromUrl = parseTableFromLocation();
      if (tableFromUrl) {
        setActiveTable(tableFromUrl);
        setDiningMode('table');
      }
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // diningMode: 'table' | 'counter' | 'delivery'
  const [diningMode, setDiningMode] = useState(() => {
    if (operationalModel === 'self-serve') return 'counter';
    if (operationalModel === 'delivery') return 'delivery';
    return 'table';
  });

  const [customerName, setCustomerName] = useState(() => {
    return customerUser?.name || localStorage.getItem('thc_customer_name') || 'Cafe Foodie';
  });
  const [customerPhone, setCustomerPhone] = useState(() => {
    return customerUser?.phone || localStorage.getItem('thc_customer_phone') || '9876543210';
  });

  // Delivery details state
  const [deliveryAddress, setDeliveryAddress] = useState(() => {
    return localStorage.getItem('thc_delivery_address') || 'Flat 402, Pinecrest Residences, Rajpur Road';
  });
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Loyalty Program State (7-Visit Digital Punch-Card)
  // Default starts at 3 visits so clients can immediately see the progress and stamp to 7!
  const [loyaltyVisits, setLoyaltyVisits] = useState(() => {
    const saved = localStorage.getItem('thc_loyalty_visits');
    return saved ? parseInt(saved, 10) : 3;
  });

  const [lastCheckinTime, setLastCheckinTime] = useState(() => {
    return localStorage.getItem('thc_last_checkin') || null;
  });

  const [appliedPromo, setAppliedPromo] = useState(null);
  const [tipAmount, setTipAmount] = useState(20);

  // Sync diningMode when operationalModel switches
  useEffect(() => {
    if (operationalModel === 'self-serve') {
      setDiningMode('counter');
    } else if (operationalModel === 'delivery') {
      setDiningMode('delivery');
    } else if (operationalModel === 'table-qr' || operationalModel === 'loyalty') {
      setDiningMode('table');
    }
    localStorage.setItem('thc_operational_model', operationalModel);
  }, [operationalModel]);

  // Listen to external model change events from Variants page or Studio
  useEffect(() => {
    const handleModelChange = (e) => {
      const newModel = e?.detail?.model || localStorage.getItem('thc_operational_model');
      if (newModel && newModel !== operationalModel) {
        setOperationalModel(newModel);
      }
    };
    window.addEventListener('thc_model_change', handleModelChange);
    return () => window.removeEventListener('thc_model_change', handleModelChange);
  }, [operationalModel]);

  // Auto-sync whenever logged in customerUser updates
  useEffect(() => {
    if (customerUser) {
      if (customerUser.name) setCustomerName(customerUser.name);
      if (customerUser.phone) setCustomerPhone(customerUser.phone);
    }
  }, [customerUser]);

  useEffect(() => {
    localStorage.setItem('thc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (activeTable) {
      localStorage.setItem('thc_active_table', activeTable.toString());
    } else {
      localStorage.removeItem('thc_active_table');
    }
  }, [activeTable]);

  // Listen for table vacated events (auto after 30-min turnover or admin manual release)
  useEffect(() => {
    const handleTableVacated = (e) => {
      const vacatedNum = Number(e?.detail?.tableNumber);
      if (vacatedNum && Number(activeTable) === vacatedNum) {
        setActiveTable(null);
        localStorage.removeItem('thc_active_table');
        window.dispatchEvent(new CustomEvent('thc_table_session_ended', {
          detail: {
            tableNumber: vacatedNum,
            message: `Dining session at Table #${vacatedNum} has concluded. Table is now vacant.`
          }
        }));
      }
    };

    window.addEventListener('thc_table_vacated', handleTableVacated);
    return () => window.removeEventListener('thc_table_vacated', handleTableVacated);
  }, [activeTable]);

  useEffect(() => {
    localStorage.setItem('thc_customer_name', customerName);
  }, [customerName]);

  useEffect(() => {
    localStorage.setItem('thc_customer_phone', customerPhone);
  }, [customerPhone]);

  useEffect(() => {
    localStorage.setItem('thc_delivery_address', deliveryAddress);
  }, [deliveryAddress]);

  useEffect(() => {
    localStorage.setItem('thc_loyalty_visits', loyaltyVisits.toString());
  }, [loyaltyVisits]);

  // Loyalty Actions
  const incrementLoyaltyVisit = (source = 'billing') => {
    sounds.playSuccess();
    setLoyaltyVisits(prev => {
      const next = prev >= 7 ? 1 : prev + 1;
      localStorage.setItem('thc_loyalty_visits', next.toString());
      return next;
    });
    setLastCheckinTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    localStorage.setItem('thc_last_checkin', new Date().toISOString());
  };

  const resetLoyalty = () => {
    sounds.playClick();
    setLoyaltyVisits(1);
    localStorage.setItem('thc_loyalty_visits', '1');
  };

  const is7thVisitUnlocked = loyaltyVisits >= 7;

  // Claim 7th visit reward: applies LOYALTY50 promo code directly!
  const claim7thVisitReward = () => {
    sounds.playSuccess();
    applyPromoCode('LOYALTY50');
  };

  const addToCart = (item, quantity = 1, spice = null, addons = [], notes = '') => {
    sounds.playAddToCart();
    const addonsKey = addons.map(a => a.id).sort().join(',');
    const cartItemId = `${item.id}-${spice || 'def'}-${addonsKey}-${notes ? notes.slice(0, 8) : ''}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(i => i.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
        const unitPrice = item.price + addonsTotal;
        return [
          ...prev,
          {
            cartItemId,
            item,
            quantity,
            spice,
            addons,
            notes,
            unitPrice,
            totalPrice: unitPrice * quantity
          }
        ];
      }
    });
  };

  const updateQuantity = (cartItemId, delta) => {
    sounds.playClick();
    setCart(prev => {
      return prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty
            };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (cartItemId) => {
    sounds.playClick();
    setCart(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyPromoCode = (codeStr) => {
    sounds.playClick();
    const cleanCode = codeStr.trim().toUpperCase();
    const promo = CAFE_CONFIG.promoCodes[cleanCode];
    if (!promo) {
      return { success: false, message: 'Invalid promo code!' };
    }

    const currentSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    if (currentSubtotal < promo.minOrder) {
      return {
        success: false,
        message: `Min order for ${cleanCode} is ₹${promo.minOrder} (Current: ₹${currentSubtotal})`
      };
    }

    setAppliedPromo({ code: cleanCode, ...promo });
    return { success: true, message: `Promo applied: ${promo.desc}` };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Calculations
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discountAmount = Math.round((subtotal * appliedPromo.discountPercent) / 100);
    } else if (appliedPromo.discountAmount) {
      discountAmount = appliedPromo.discountAmount;
    }
  }

  const isDeliveryActive = diningMode === 'delivery' || operationalModel === 'delivery';
  const deliveryFee = isDeliveryActive
    ? (subtotal >= (CAFE_CONFIG.delivery?.freeDeliveryThreshold || 499) ? 0 : (CAFE_CONFIG.delivery?.standardFee || 40))
    : 0;

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gstAmount = Math.round(taxableAmount * CAFE_CONFIG.gstRate);
  const grandTotal = taxableAmount + gstAmount + deliveryFee + (tipAmount || 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        discountAmount,
        gstAmount,
        grandTotal,
        appliedPromo,
        tipAmount,
        setTipAmount,
        activeTable,
        setActiveTable,
        diningMode,
        setDiningMode,
        customerName,
        setCustomerName,
        customerPhone,
        setCustomerPhone,
        operationalModel,
        setOperationalModel,
        deliveryAddress,
        setDeliveryAddress,
        deliveryNotes,
        setDeliveryNotes,
        deliveryFee,
        isDeliveryActive,
        loyaltyVisits,
        incrementLoyaltyVisit,
        resetLoyalty,
        is7thVisitUnlocked,
        claim7thVisitReward,
        lastCheckinTime,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
