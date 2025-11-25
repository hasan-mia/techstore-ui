"use client";

import { Search } from 'lucide-react'
import React, { useState } from 'react'

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
        }
    }

    return (
        <>
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for products, brands, and more..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-5 py-3 pr-12 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-slate-300"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </form>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-4 md:hidden">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Search className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
            </form>
        </>
    )
}