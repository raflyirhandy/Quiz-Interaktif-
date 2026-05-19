"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Sparkles, BookOpen, Award } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-dots">
      {/* Decorative Floating Elements */}
      <div className="absolute top-24 left-[10%] text-4xl float">🎈</div>
      <div className="absolute top-40 right-[15%] text-4xl float" style={{ animationDelay: "1s" }}>🚀</div>
      <div className="absolute bottom-20 left-[15%] text-4xl float" style={{ animationDelay: "2s" }}>🎨</div>
      <div className="absolute bottom-16 right-[10%] text-4xl float" style={{ animationDelay: "1.5s" }}>📐</div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Title & Description */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold text-sm border-2 border-indigo-100 dark:border-indigo-900/30">
            <Sparkles size={16} className="animate-spin" />
            Belajar Jadi Lebih Seru & Asyik!
          </div>

          <h1 className="font-fredoka text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-800 dark:text-white">
            Belajar Asyik, Kumpulkan <span className="gradient-text">Bintang Emas!</span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-xl mx-auto lg:mx-0">
            Ayo asah kemampuanmu dengan berbagai quiz seru dan materi interaktif yang dirancang khusus untuk anak sekolah dasar. Kumpulkan poin, dapatkan badge bintang, dan jadilah juara kelas! 🏆✨
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/register">
              <Button variant="primary" size="xl" className="w-full sm:w-auto rounded-3xl" icon={<Star className="fill-white" size={20} />}>
                Mulai Belajar Sekarang!
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="xl" className="w-full sm:w-auto rounded-3xl text-indigo-900">
                Masuk ke Akun
              </Button>
            </Link>
          </div>

          {/* Micro Stats */}
          <div className="flex justify-center lg:justify-start gap-8 pt-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-xl text-yellow-600">
                <Star size={20} className="fill-yellow-500 text-yellow-500" />
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-white">100+</p>
                <p className="text-xs text-gray-500">Quiz Seru</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-xl text-green-600">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-white">50+</p>
                <p className="text-xs text-gray-500">Materi Menarik</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-pink-100 rounded-xl text-pink-600">
                <Award size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-white">Badge</p>
                <p className="text-xs text-gray-500">Bintang Keren</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Cute Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex justify-center items-center relative"
        >
          {/* Main Visual Box */}
          <div className="relative w-80 h-80 sm:w-[450px] sm:h-[450px] bg-gradient-to-tr from-yellow-300 to-amber-100 dark:from-indigo-950 dark:to-indigo-900 rounded-[50px] p-6 shadow-2xl flex items-center justify-center border-4 border-white dark:border-slate-800 overflow-hidden">
            {/* Interactive quiz interface mock */}
            <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-xl border-2 border-indigo-100 dark:border-indigo-950 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-full">Matematika 🔢</span>
                <span className="text-xs font-bold text-yellow-500">⭐️ 100 Poin</span>
              </div>
              <p className="font-fredoka text-lg font-bold text-gray-800 dark:text-white">
                Berapa hasil dari 5 + 3 x 2? 🤔
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-2 border-red-200 dark:border-red-900/30 rounded-2xl font-bold text-sm text-left">A. 16</button>
                <button className="p-3 bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-800 rounded-2xl font-bold text-sm text-left relative overflow-hidden">
                  B. 11 ✨
                  <span className="absolute top-0 right-0 text-[10px] bg-green-500 text-white font-bold px-1 rounded-bl-md">Benar!</span>
                </button>
                <button className="p-3 bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 rounded-2xl font-bold text-sm text-left">C. 13</button>
                <button className="p-3 bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 rounded-2xl font-bold text-sm text-left">D. 10</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
