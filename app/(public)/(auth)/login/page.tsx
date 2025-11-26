"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  Heart,
  Package,
  Zap
} from "lucide-react"
import { useAuthContext } from "@/contexts/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthContext()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(email, password)

      console.log(result)

      if (result) {
        toast({
          title: "Welcome back! 👋",
          description: `Logged in as ${result.user.name}`,
        })

        // Redirect based on role
        if (result.user.role === "ADMIN") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = (role: "USER" | "ADMIN") => {
    const testEmail = role === "ADMIN" ? "admin@gmail.com" : "user@gmail.com"
    const testPassword = role === "ADMIN" ? "admin@123" : "user@123"

    setLoading(true)
    const result = login(testEmail, testPassword)

    toast({
      title: "Quick login successful! ✨",
      description: `Logged in as ${role}`,
    })

    setTimeout(() => {
      if (role === "ADMIN") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
      <div className="w-full grid lg:grid-cols-2 gap-8">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                TS
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">TechStore</h1>
                <p className="text-slate-600">Premium Electronics</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-slate-900 leading-tight">
              Welcome Back to Your
              <span className="text-blue-600"> Tech Paradise</span>
            </h2>
            <p className="text-lg text-slate-600">
              Access your account to continue shopping for premium electronics and exclusive deals.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Easy Shopping</h3>
                <p className="text-sm text-slate-600">Browse and buy with a few clicks</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Order Tracking</h3>
                <p className="text-sm text-slate-600">Track your orders in real-time</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Wishlist & Favorites</h3>
                <p className="text-sm text-slate-600">Save items for later purchases</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Exclusive Deals</h3>
                <p className="text-sm text-slate-600">Member-only discounts and offers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="space-y-6">
          {/* Main Login Card */}
          <Card className="bg-white border-slate-200 shadow-xl">
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
                <p className="text-slate-600">Enter your credentials to access your account</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 bg-slate-50 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 h-12 bg-slate-50 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-slate-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500 font-medium">
                    Don't have an account?
                  </span>
                </div>
              </div>

              <Link href="/signup">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-12 border-2 border-slate-300 hover:bg-slate-50 text-base font-semibold"
                >
                  Create new account
                </Button>
              </Link>
            </div>
          </Card>

          {/* Demo Accounts Card */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">Demo Accounts</h3>
                  <p className="text-sm text-slate-600">Quick login for testing</p>
                </div>
                <Badge className="bg-amber-500 text-white">Development</Badge>
              </div>

              <div className="grid gap-3">
                <button
                  onClick={() => handleQuickLogin("USER")}
                  className="flex items-center justify-between p-4 bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-300 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-slate-900">User Account</div>
                      <div className="text-sm text-slate-600">user@gmail.com</div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={() => handleQuickLogin("ADMIN")}
                  className="flex items-center justify-between p-4 bg-white hover:bg-red-50 border-2 border-slate-200 hover:border-red-300 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-slate-900">Admin Account</div>
                      <div className="text-sm text-slate-600">admin@gmail.com</div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          </Card>

          {/* Features Info */}
          <div className="lg:hidden space-y-3 px-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Secure authentication</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Easy order management</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Exclusive member deals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}