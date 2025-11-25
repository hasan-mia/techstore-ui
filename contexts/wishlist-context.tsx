"use client";

import { useWishlist } from "@/hooks/use-wishlist";
import { createContext, useContext, type ReactNode } from "react";

type WishlistContextType = ReturnType<typeof useWishlist>;

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const wishlist = useWishlist();

    return <WishlistContext.Provider value={wishlist}>{children}</WishlistContext.Provider>;
}

export function useWishlistContext() {
    const ctx = useContext(WishlistContext);
    if (!ctx) {
        throw new Error("useWishlistContext must be used inside <WishlistProvider>");
    }
    return ctx;
}