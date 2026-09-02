import React, { createContext, useContext, useState, useEffect } from 'react';
import { CAFE_CONFIG } from '../data/cafeConfig';
import { useAuth } from './AuthContext';
import { sounds } from '../utils/audio';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { customerUser } = useAuth();

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('thc_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [activeTable, setActiveTable] = useState(() => {
    // Check URL parameters first (e.g. ?table=4)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTable = params.get('table');
      if (urlTable) return parseInt(urlTable, 10);
    }
    const saved = localStorage.getItem('thc_active_table');
    return saved ? parseInt(saved, 10) : 4; // Default to Table 4 demo
  });

  const [diningMode, setDiningMode] = useState('table'); // 'table' | 'counter'
  const [customerName, setCustomerName] = useState(() => {
    return customerUser?.name || localStorage.getItem('thc_customer_name') || 'Highway Foodie';
  });
  const [customerPhone, setCustomerPhone] = useState(() => {
    return customerUser?.phone || localStorage.getItem('thc_customer_phone') || '9876543210';
  });
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [tipAmount, setTipAmount] = useState(20);

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
    }
  }, [activeTable]);

  useEffect(() => {
    localStorage.setItem('thc_customer_name', customerName);
  }, [customerName]);

  useEffect(() => {
    localStorage.setItem('thc_customer_phone', customerPhone);
  }, [customerPhone]);

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

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gstAmount = Math.round(taxableAmount * CAFE_CONFIG.gstRate);
  const grandTotal = taxableAmount + gstAmount + (tipAmount || 0);

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
