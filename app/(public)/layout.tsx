import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import Footer from "@/components/footer"
import { CartProvider } from "@/contexts/cart-context"
import Navbar from "@/components/navbar"
export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <main>
            <CartProvider>
                <Navbar />
                <main className="min-h-screen">
                    {children}
                </main>
                <Footer />
            </CartProvider>
            <Toaster />
            <Analytics />
        </main>
    )
}
