"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. Your order has been successfully placed and will be processed soon.
        </p>

        <div className="space-y-3">
          <Link href="/orders" className="block">
            <Button className="w-full bg-primary hover:bg-primary/90">View Your Orders</Button>
          </Link>
          <Link href="/products" className="block">
            <Button variant="outline" className="w-full bg-transparent">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
