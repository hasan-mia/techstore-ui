import { dummyCategories } from "@/lib/dummy-data"
import { Headphones, Laptop, Link, Smartphone, Tablet, Tag } from "lucide-react"

export default function CategoriesBar() {
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
