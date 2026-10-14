import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ product, qty }]

  const add = (product, qty = 1) =>
    setItems((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found)
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: Math.min(i.qty + qty, product.quantity) } : i
        );
      return [...prev, { product, qty: Math.min(qty, product.quantity) }];
    });
  const setQty = (id, qty) =>
    setItems((prev) => prev.map((i) => (i.product.id === id ? { ...i, qty: Math.max(0.1, qty) } : i)));
  const remove = (id) => setItems((prev) => prev.filter((i) => i.product.id !== id));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, total }}>{children}</CartContext.Provider>
  );
}
