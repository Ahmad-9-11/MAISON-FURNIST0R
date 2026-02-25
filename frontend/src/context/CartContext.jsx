import { createContext, useContext, useReducer, useCallback, useState } from 'react';

const CART_KEY = 'furnistor_cart';

const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Could not persist cart', e);
  }
};

const cartReducer = (state, action) => {
  let next;
  switch (action.type) {
    case 'ADD':
      next = [...state];
      const existing = next.find((i) => i._id === action.payload._id || i.id === action.payload.id);
      if (existing) existing.quantity += action.payload.quantity ?? 1;
      else next.push({ ...action.payload, quantity: action.payload.quantity ?? 1 });
      saveCart(next);
      return next;
    case 'REMOVE':
      next = state.filter((i) => (i._id || i.id) !== action.payload);
      saveCart(next);
      return next;
    case 'UPDATE_QTY':
      next = state.map((i) => {
        if ((i._id || i.id) !== action.payload.id) return i;
        const q = action.payload.quantity;
        if (q < 1) return null;
        return { ...i, quantity: q };
      }).filter(Boolean);
      saveCart(next);
      return next;
    case 'SET':
      next = Array.isArray(action.payload) ? action.payload : [];
      saveCart(next);
      return next;
    default:
      return state;
  }
};

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, loadCart());
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = useCallback((item, quantity = 1) => {
    dispatch({ type: 'ADD', payload: { ...item, quantity } });
  }, []);

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE', payload: id });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'SET', payload: [] });
  }, []);

  const cartCount = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const cartTotal = cart.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0);

  const value = {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartOpen,
    setCartOpen,
    openCart: () => setCartOpen(true),
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
