import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import Footer from "@/components/footer"
import { CartProvider } from "@/contexts/cart-context"
import Navbar from "@/components/navbar"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { AuthProvider } from "@/contexts/auth-context"
export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <main>
            <CartProvider>
                <WishlistProvider>
                    <AuthProvider>
                        <Navbar />
                        <div className="min-h-screen">
                            {children}
                        </div>
                    </AuthProvider>
                    <Footer />
                </WishlistProvider>
            </CartProvider>
            <Toaster />
            <Analytics />
        </main>
    )
}
