"use client";

import { useCart } from "@/hooks/use-cart";
import { createContext, useContext } from "react";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const cart = useCart();
    return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCartContext must be used inside <CartProvider>");
    return ctx;
}
