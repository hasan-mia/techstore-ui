"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/api/category";
import { Tag } from "lucide-react";

export default function CategoriesBar() {
    const { data, isLoading, isFetching, error } = useCategories();

    if (isLoading || isFetching || data?.categories?.length === 0) {
        return null;
    }

    if (error) {
        return (
            <div className="bg-red-100 py-3 text-center text-red-600">
                Failed to load categories
            </div>
        );
    }

    const categories = data?.categories ?? [];

    return (
        <div className="bg-slate-50 border-t border-slate-200 hidden md:block">
            <div className="container mx-auto px-4">
                <nav className="flex items-center gap-1 py-1 overflow-x-auto">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/products?category=${category.id}`}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-white rounded-lg transition-all whitespace-nowrap group"
                        >
                            <Image
                                src={category.icon ?? "/placeholder.png"}
                                alt={category.name}
                                width={20}
                                height={20}
                                className="rounded group-hover:scale-110 transition-transform"
                            />
                            {category.name}
                        </Link>
                    ))}

                    {/* Hot deals */}
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
    );
}
