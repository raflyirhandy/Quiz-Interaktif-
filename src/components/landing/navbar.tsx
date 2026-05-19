"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/50 dark:border-slate-700/50">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Star className="w-5 h-5 text-white fill-white" />
        </div>
        <span className="font-fredoka text-xl font-bold gradient-text">
          Quiz Anak SD
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-2xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <AnimatePresence mode="wait">
            {theme === "dark" ? (
              <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <Sun size={18} className="text-yellow-500" />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <Moon size={18} className="text-indigo-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        <Link href="/login">
          <Button variant="outline" size="sm">Masuk</Button>
        </Link>
        <Link href="/register">
          <Button variant="primary" size="sm">Daftar Gratis</Button>
        </Link>
      </div>
    </nav>
  );
}
