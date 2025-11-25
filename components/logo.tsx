import { Link } from 'lucide-react'

export default function Logo() {
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
