"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/utils"
import {
  ShoppingCart,
  CreditCard,
  Wallet,
  Shield,
  Truck,
  CheckCircle2,
  Lock,
  MapPin,
  Mail,
  Phone,
  User,
  ArrowLeft,
  Package,
  Loader2,
  AlertCircle
} from "lucide-react"
import { useCartContext } from "@/contexts/cart-context"
import { useAuthContext } from "@/contexts/auth-context"
import { useGetAddress } from "@/api/auth"
import { useCreateOrder } from "@/api/order"
import { Alert, AlertDescription } from "@/components/ui/alert"


export default function CheckoutPage() {
  const { items, total, clearCart, count } = useCartContext()
  const { user, mounted } = useAuthContext()
  const router = useRouter()
  const { toast } = useToast()

  console.log("cart item:", items)

  // Fetch address data
  const { data: addressData, isLoading: isLoadingAddress } = useGetAddress()

  console.log(addressData)

  // Create order mutation
  const createOrderMutation = useCreateOrder()

  const [paymentMethod, setPaymentMethod] = useState<"CASH_ON_DELIVERY" | "CARD">("CASH_ON_DELIVERY")
  const [notes, setNotes] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  // Sync user and address data with form
  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(" ") || []
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email || "",
        phone: user.phone || "",
      }))
    }
  }, [user])

  useEffect(() => {
    if (addressData) {
      console.log('Address data received:', addressData)
      setFormData(prev => {
        const newData = {
          ...prev,
          address: addressData.address || "",
          city: addressData.city || "",
          state: addressData.state || "",
          zipCode: addressData.zip || "",
          phone: addressData.phone || prev.phone,
        }
        console.log('Updated form data:', newData)
        return newData
      })
    }
  }, [addressData])

  const subtotal = total
  const shipping = total >= 50 ? 0 : 5.99
  const tax = total * 0.1
  const finalTotal = subtotal + shipping + tax

  // Show loading state while mounting
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-slate-400" />
            </div>
            <h1 className="text-3xl font-bold mb-3 text-slate-900">Your cart is empty</h1>
            <p className="text-slate-600 mb-8">
              Add items to your cart before proceeding to checkout
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async () => {
    try {
      // Validate address exists
      if (!addressData?.id) {
        toast({
          title: "Address Required",
          description: "Please add a delivery address in your profile first",
          variant: "destructive",
        })
        return
      }

      // Transform cart items to API format
      const orderItems = items.map(item => ({
        product_id: item.productId,  // Changed from item.id to item.productId
        quantity: item.quantity
      }))

      console.log("Transformed order items:", orderItems)

      // Create order payload
      const orderData = {
        items: orderItems,
        payment_method: paymentMethod,
        address_id: addressData.id,
        notes: notes.trim() || undefined
      }

      // Submit order
      const result = await createOrderMutation.mutateAsync(orderData)

      toast({
        title: "Order Confirmed! 🎉",
        description: `Your order has been placed successfully`,
      })

      // Clear cart
      clearCart()

      // Redirect to orders page
      if (result.data?.id) {
        router.push(`/orders/success/${result.data.id}`)
      } else {
        router.push('/orders')
      }
    } catch (error: any) {
      console.error('Checkout error:', error)

      toast({
        title: "Checkout Failed",
        description: error.message || "Please try again or contact support",
        variant: "destructive",
      })
    }
  }
  // Check if form is valid for submission
  const isFormValid = () => {
    console.log('Form validation:', {
      hasAddressId: !!addressData?.data?.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      zipCode: formData.zipCode,
      itemsCount: items.length
    })

    return (
      addressData?.data?.id &&
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.zipCode.trim() !== '' &&
      items.length > 0
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-slate-600 hover:text-blue-600 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Checkout</h1>
          <p className="text-slate-600">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="ml-2 text-sm font-medium text-slate-900">Cart</span>
            </div>
            <div className="w-16 h-1 bg-blue-600" />
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-slate-900">Checkout</span>
            </div>
            <div className="w-16 h-1 bg-slate-200" />
            <div className="flex items-center">
              <div className="w-8 h-8 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-slate-500">Complete</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - 8 columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Loading State */}
            {isLoadingAddress && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>Loading your information...</AlertDescription>
              </Alert>
            )}

            {/* Contact Information */}
            <Card className="bg-white border-slate-200">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="text-sm font-medium text-slate-700 block mb-2">
                      Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="firstName"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 bg-slate-50 border-slate-300 h-11"
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-slate-700 block mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 bg-slate-50 border-slate-300 h-11"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm font-medium text-slate-700 block mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 bg-slate-50 border-slate-300 h-11"
                        placeholder="+880 1XXX-XXXXXX"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="bg-white border-slate-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Shipping Address</h2>
                  </div>
                  {addressData?.data && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Saved Address
                    </Badge>
                  )}
                </div>

                {!addressData?.data && !isLoadingAddress && (
                  <Alert className="mb-4 border-amber-300 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      You need to save a delivery address before placing an order.
                      <Link href="/profile" className="text-blue-600 hover:underline ml-1 font-medium">
                        Add address in your profile
                      </Link>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="text-sm font-medium text-slate-700 block mb-2">
                      Street Address *
                    </label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="bg-slate-50 border-slate-300 h-11"
                      placeholder="123 Main Street, Apartment 4B"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2 md:col-span-2">
                      <label htmlFor="city" className="text-sm font-medium text-slate-700 block mb-2">
                        City *
                      </label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="bg-slate-50 border-slate-300 h-11"
                        placeholder="Dhaka"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="text-sm font-medium text-slate-700 block mb-2">
                        State/Division
                      </label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="bg-slate-50 border-slate-300 h-11"
                        placeholder="Dhaka (optional)"
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="text-sm font-medium text-slate-700 block mb-2">
                        ZIP Code *
                      </label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="bg-slate-50 border-slate-300 h-11"
                        placeholder="1000"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="bg-white border-slate-200">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "CASH_ON_DELIVERY"
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="CASH_ON_DELIVERY"
                      checked={paymentMethod === "CASH_ON_DELIVERY"}
                      onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                      className="w-5 h-5 mr-4 accent-blue-600"
                    />
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Wallet className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Cash on Delivery</p>
                        <p className="text-sm text-slate-600">Pay when your order arrives at your doorstep</p>
                      </div>
                    </div>
                    {paymentMethod === "CASH_ON_DELIVERY" && (
                      <Badge className="bg-blue-600 text-white">Selected</Badge>
                    )}
                  </label>

                  <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "CARD"
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="CARD"
                      checked={paymentMethod === "CARD"}
                      onChange={() => setPaymentMethod("CARD")}
                      className="w-5 h-5 mr-4 accent-blue-600"
                    />
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Credit/Debit Card</p>
                        <p className="text-sm text-slate-600">Secure payment via Stripe gateway</p>
                      </div>
                    </div>
                    {paymentMethod === "CARD" && (
                      <Badge className="bg-blue-600 text-white">Selected</Badge>
                    )}
                  </label>
                </div>

                <div className="mt-6">
                  <label htmlFor="notes" className="text-sm font-medium text-slate-700 block mb-2">
                    Order Notes (Optional)
                  </label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-slate-50 border-slate-300 min-h-[80px]"
                    placeholder="Add delivery instructions or special notes..."
                  />
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-1">Secure Payment</p>
                      <p className="text-xs text-slate-600">
                        Your payment information is encrypted and secure. We never store your card details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Place Order Button - Mobile */}
            <div className="lg:hidden">
              <Button
                onClick={handleSubmit}
                disabled={createOrderMutation.isPending || isLoadingAddress || !isFormValid()}
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-base font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createOrderMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Complete Purchase ({formatPrice(finalTotal)})
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Order Summary Sidebar - 4 columns */}
          <div className="lg:col-span-4">
            <div className="sticky top-4 space-y-6">
              {/* Order Items */}
              <Card className="bg-white border-slate-200">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">
                    Order Summary ({count} {count === 1 ? 'item' : 'items'})
                  </h2>

                  <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product?.images[0] || "/placeholder.svg"}
                            alt={item.product?.name || ""}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-1">
                            {item.product?.name}
                          </h3>
                          <p className="text-sm font-bold text-blue-600">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <div className="flex justify-between text-slate-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Shipping</span>
                      <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                        {shipping === 0 ? "Free" : formatPrice(shipping)}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <Package className="w-4 h-4 inline mr-1" />
                        Add {formatPrice(50 - total)} more for free shipping!
                      </div>
                    )}
                    <div className="flex justify-between text-slate-700">
                      <span>Tax (10%)</span>
                      <span className="font-semibold">{formatPrice(tax)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-slate-900 mt-4 pt-4 border-t-2 border-slate-200">
                    <span>Total</span>
                    <span className="text-2xl text-blue-600">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </Card>

              {/* Security Features */}
              <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-slate-900 mb-4">Why Shop With Us?</h3>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 text-sm">Secure Checkout</div>
                      <div className="text-xs text-slate-600">SSL encrypted payment</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 text-sm">Fast Delivery</div>
                      <div className="text-xs text-slate-600">2-5 business days</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 text-sm">Money Back</div>
                      <div className="text-xs text-slate-600">30-day guarantee</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Place Order Button - Desktop */}
              <div className="hidden lg:block">
                <Button
                  onClick={handleSubmit}
                  // disabled={createOrderMutation.isPending || isLoadingAddress || !isFormValid()}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-base font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Complete Purchase
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-slate-500 mt-3">
                  By placing your order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}