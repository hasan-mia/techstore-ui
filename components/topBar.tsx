import { Facebook, Instagram, Mail, Phone, Twitter } from "lucide-react";
import { useState, useEffect } from "react";

export default function TopBar() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;

                    // Hide topbar when scrolling down, show when scrolling up
                    if (currentScrollY > lastScrollY && currentScrollY > 100) {
                        setIsVisible(false);
                    } else if (currentScrollY < lastScrollY) {
                        setIsVisible(true);
                    }

                    setLastScrollY(currentScrollY);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-sm">
            <div className="container mx-auto px-4 py-2.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 lg:gap-6">
                        <a
                            href="tel:+8801234567890"
                            className="flex items-center gap-2 hover:text-blue-400 transition-colors group"
                        >
                            <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="hidden sm:inline">+880 1234-567890</span>
                        </a>
                        <a
                            href="mailto:support@techstore.com"
                            className="flex items-center gap-2 hover:text-blue-400 transition-colors group"
                        >
                            <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="hidden lg:inline">support@techstore.com</span>
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="hidden md:inline text-slate-300 font-medium">
                            🎉 Free shipping on orders over $50
                        </span>
                        <div className="flex items-center gap-2.5">
                            <a
                                href="#"
                                className="hover:text-blue-400 transition-colors hover:scale-110 transform"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="hover:text-blue-400 transition-colors hover:scale-110 transform"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="hover:text-blue-400 transition-colors hover:scale-110 transform"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}