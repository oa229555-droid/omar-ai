"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X, Film, Sparkles, Heart, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navLinks = [
    { href: "/", label: "الرئيسية", icon: <Film size={18} /> },
    { href: "/categories", label: "التصنيفات", icon: <Compass size={18} /> },
    { href: "/favorites", label: "المفضلة", icon: <Heart size={18} /> },
    { href: "/support", label: "الدعم", icon: <Sparkles size={18} /> },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled ? "bg-black/95 backdrop-blur-xl shadow-2xl" : "bg-gradient-to-b from-black/80 to-transparent"
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="group relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-extrabold"
            >
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                قديم
              </span>
              <span className="text-white"> استور</span>
            </motion.div>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-gray-300 hover:text-amber-500 transition-all duration-300 hover:scale-105"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex items-center glass-morphism rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="ابحث عن أنمي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none px-2 w-56 text-white placeholder-gray-400"
            />
            <button type="submit">
              <Search size={18} className="text-amber-500 hover:text-amber-400 transition" />
            </button>
          </form>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden mt-6 space-y-4"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-gray-300 hover:text-amber-500 transition py-2 border-b border-gray-800"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              <form onSubmit={handleSearch} className="flex items-center glass-morphism rounded-full px-4 py-2 mt-4">
                <input
                  type="text"
                  placeholder="ابحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-white"
                />
                <button type="submit"><Search size={18} className="text-amber-500" /></button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
                  }
