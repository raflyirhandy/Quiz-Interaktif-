"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  Trophy,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Star,
  LayoutDashboard,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Beranda", icon: Home },
  { href: "/materi", label: "Materi", icon: BookOpen },
  { href: "/leaderboard", label: "Ranking", icon: Trophy },
  { href: "/profile", label: "Profil", icon: User },
];

export function Navbar({ userName, role }: { userName?: string; role?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-indigo-100/50 dark:shadow-none"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-fredoka text-xl font-bold gradient-text hidden sm:block">
                Quiz Anak SD
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200",
                      isActive
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
                        : "text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600"
                    )}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
              {role === "admin" && (
                <Link
                  href="/admin"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200",
                    pathname.startsWith("/admin")
                      ? "bg-purple-500 text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-600"
                  )}
                >
                  <LayoutDashboard size={16} />
                  Admin
                </Link>
              )}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-2xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                <AnimatePresence mode="wait">
                  {theme === "dark" ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun size={18} className="text-yellow-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon size={18} className="text-indigo-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* User Info */}
              {userName && (
                <div className="hidden md:flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-slate-700 ml-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-indigo-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 max-w-24 truncate">
                    {userName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-2xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-xl md:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {/* User info mobile */}
              {userName && (
                <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-indigo-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{userName}</p>
                    <p className="text-xs text-gray-500 capitalize">{role}</p>
                  </div>
                </div>
              )}
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
                      isActive
                        ? "bg-indigo-500 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
              {role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                >
                  <LayoutDashboard size={18} />
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
              >
                <LogOut size={18} />
                Keluar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
