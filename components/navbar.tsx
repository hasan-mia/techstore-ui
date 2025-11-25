"use client"

import Link from "next/link"
import {
  ShoppingCart,
  Heart,
  Menu,
  X,
  ChevronDown,
  Tag,
  Laptop,
  Smartphone,
  Tablet,
  Headphones,
  User,
  LogIn,
  LogOut,
  Package,
  LayoutDashboard
} from "lucide-react"
import { useCartContext } from "@/contexts/cart-context"
import { useState, useEffect } from "react"
import { dummyCategories } from "@/lib/dummy-data"
import TopBar from "./topBar"
import SearchBar from "./searchBar"
import { useWishlistContext } from "@/contexts/wishlist-context"
import { useAuthContext } from "@/contexts/auth-context"


function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
        TS
      </div>
      <div className="hidden sm:block">
        <div className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
          TechStore
        </div>
        <div className="text-xs text-slate-500">Premium Electronics</div>
      </div>
    </Link>
  )
}

function CartWishlistButtons() {
  const { count: cartCount, mounted: cartMounted } = useCartContext()
  const { count: wishlistCount, mounted: wishlistMounted } = useWishlistContext()

  return (
    <>
      {/* Wishlist */}
      <Link
        href="/wishlist"
        className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-all group hidden sm:flex"
        aria-label="Wishlist"
      >
        <Heart className="w-6 h-6 text-slate-700 group-hover:text-red-500 transition-colors" />
        {wishlistMounted && wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
            {wishlistCount > 9 ? "9+" : wishlistCount}
          </span>
        )}
      </Link>

      {/* Cart */}
      <Link
        href="/cart"
        className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-all group"
        aria-label="Shopping Cart"
      >
        <ShoppingCart className="w-6 h-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
        {cartMounted && cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </Link>
    </>
  )
}

function AuthButton() {
  const { user, logout } = useAuthContext()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-24 h-10 bg-slate-100 rounded-lg animate-pulse hidden md:block" />
    )
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md"
      >
        <LogIn className="w-4 h-4" />
        <span>Login</span>
      </Link>
    )
  }

  return (
    <div className="relative group hidden md:block">
      <button className="flex items-center gap-3 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="font-medium text-slate-900">{user.name}</span>
        <ChevronDown className="w-4 h-4 text-slate-600 group-hover:rotate-180 transition-transform" />
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top scale-95 group-hover:scale-100">
        <div className="p-3 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-500">{user.email}</p>
        </div>

        <div className="py-2">
          {
            user.role === "USER" && (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-all"
                >
                  <User className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">My Profile</span>
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-all"
                >
                  <Package className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">My Orders</span>
                </Link>
              </>
            )
          }

          {user.role === "ADMIN" && (
            <>
              <div className="my-2 border-t border-slate-100" />
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Admin Dashboard</span>
              </Link>
            </>
          )}
        </div>

        <div className="border-t border-slate-100 p-2">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function CategoriesBar() {
  const categoryIcons: Record<string, any> = {
    "1": Laptop,
    "2": Smartphone,
    "3": Tablet,
    "4": Headphones,
  }

  return (
    <div className="bg-slate-50 border-t border-slate-200 hidden md:block">
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-1 py-1 overflow-x-auto">
          {dummyCategories.map((category) => {
            const Icon = categoryIcons[category.id] || Tag
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-white rounded-lg transition-all whitespace-nowrap group"
              >
                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {category.name}
              </Link>
            )
          })}
          <Link
            href="/deals"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-lg transition-all whitespace-nowrap ml-auto shadow-sm hover:shadow-md"
          >
            <Tag className="w-4 h-4" />
            Hot Deals 🔥
          </Link>
        </nav>
      </div>
    </div>
  )
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { count: cartCount, mounted: cartMounted } = useCartContext()
  const { count: wishlistCount, mounted: wishlistMounted } = useWishlistContext()
  const { user, logout } = useAuthContext()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const categoryIcons: Record<string, any> = {
    "1": Laptop,
    "2": Smartphone,
    "3": Tablet,
    "4": Headphones,
  }

  if (!isOpen) return null

  return (
    <div className="md:hidden border-t border-slate-200 bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        {/* User Section */}
        {mounted && user && (
          <div className="mb-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3 px-3 py-3 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-1 mb-4 pb-4 border-b border-slate-200">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-2">
            Categories
          </h3>
          {dummyCategories.map((category) => {
            const Icon = categoryIcons[category.id] || Tag
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-all"
                onClick={onClose}
              >
                <Icon className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-700">{category.name}</span>
                <ChevronDown className="w-4 h-4 ml-auto text-slate-400 -rotate-90" />
              </Link>
            )
          })}
          <Link
            href="/deals"
            className="flex items-center gap-3 px-3 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold"
            onClick={onClose}
          >
            <Tag className="w-5 h-5" />
            Hot Deals 🔥
          </Link>
        </div>

        {/* Quick Links */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-2">
            Quick Links
          </h3>
          <Link
            href="/wishlist"
            className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-all"
            onClick={onClose}
          >
            <Heart className="w-5 h-5 text-slate-600" />
            <span className="font-medium text-slate-700">Wishlist</span>
            {wishlistMounted && wishlistCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-all"
            onClick={onClose}
          >
            <ShoppingCart className="w-5 h-5 text-slate-600" />
            <span className="font-medium text-slate-700">Shopping Cart</span>
            {cartMounted && cartCount > 0 && (
              <span className="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {mounted && user && (
            <>
              {
                user.role === "USER" && (<>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-all"
                    onClick={onClose}
                  >
                    <User className="w-5 h-5 text-slate-600" />
                    <span className="font-medium text-slate-700">My Profile</span>
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-all"
                    onClick={onClose}
                  >
                    <Package className="w-5 h-5 text-slate-600" />
                    <span className="font-medium text-slate-700">My Orders</span>
                  </Link>
                </>)
              }

              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-lg transition-all"
                  onClick={onClose}
                >
                  <LayoutDashboard className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-600">Admin Dashboard</span>
                </Link>
              )}

              <button
                onClick={() => {
                  logout()
                  onClose()
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 text-red-600 rounded-lg transition-all mt-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </>
          )}

          {mounted && !user && (
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold mt-2"
              onClick={onClose}
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Navbar Component
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-lg" : "border-b border-slate-200"
        }`}
    >
      <TopBar />

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <SearchBar />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <CartWishlistButtons />
            <AuthButton />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 hover:bg-slate-100 rounded-xl transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-700" />
              ) : (
                <Menu className="w-6 h-6 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search - Rendered by SearchBar component */}
      </div>

      <CategoriesBar />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  )
}