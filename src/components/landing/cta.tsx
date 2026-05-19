"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Trophy } from "lucide-react";

export function LandingCTA() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 rounded-[48px] p-8 sm:p-12 md:p-16 text-center text-white overflow-hidden shadow-2xl"
        >
          {/* Background decorative shapes */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-12 -translate-y-12" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl translate-x-12 translate-y-12" />

          {/* Floating emoji */}
          <span className="absolute top-8 left-12 text-3xl hidden md:block bounce-slow">⭐</span>
          <span className="absolute bottom-8 right-16 text-3xl hidden md:block bounce-slow" style={{ animationDelay: "1s" }}>🏆</span>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white font-bold text-xs border border-white/20">
              <Sparkles size={14} className="animate-spin" />
              100% Gratis & Tanpa Iklan Mengganggu!
            </div>

            <h2 className="font-fredoka text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Siap Menjadi Bintang Kelas? 🌟
            </h2>

            <p className="text-sm sm:text-base text-indigo-100 font-medium leading-relaxed max-w-xl mx-auto">
              Daftar sekarang secara gratis, ikuti berbagai materi menarik, selesaikan quiz seru, dan buktikan kemampuanmu di papan peringkat nasional!
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  variant="secondary"
                  size="xl"
                  className="rounded-3xl shadow-xl w-full sm:w-auto text-indigo-900"
                  icon={<Trophy size={18} />}
                >
                  Daftar Sekarang!
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="xl"
                  className="rounded-3xl border-2 border-white text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Hubungi Guru / Orang Tua
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
