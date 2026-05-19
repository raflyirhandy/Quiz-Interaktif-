"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { KATEGORI_OPTIONS, KATEGORI_COLORS, KATEGORI_EMOJIS } from "@/lib/utils";

export function LandingSubjects() {
  return (
    <section className="py-20 px-6 bg-dots">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="font-fredoka text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
            📚 Pilihan <span className="gradient-text">Mata Pelajaran</span> Seru
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Mulai pelajari mata pelajaran sekolah dasar terpopuler dengan cara baru yang jauh lebih menyenangkan!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {KATEGORI_OPTIONS.map((kat, idx) => {
            const colorClass = KATEGORI_COLORS[kat] || "bg-indigo-100 text-indigo-700";
            const emoji = KATEGORI_EMOJIS[kat] || "⭐️";
            return (
              <motion.div
                key={kat}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, type: "spring", stiffness: 100 }}
              >
                <Card
                  className={`border-2 border-transparent hover:border-indigo-200 hover:shadow-lg transition-all rounded-[32px] cursor-pointer text-center ${colorClass} bg-opacity-30`}
                  padding="md"
                >
                  <div className="space-y-3">
                    <span className="text-4xl block float" style={{ animationDelay: `${idx * 0.2}s` }}>
                      {emoji}
                    </span>
                    <h3 className="font-fredoka text-lg font-bold">
                      {kat}
                    </h3>
                    <span className="text-xs font-semibold px-3 py-1 bg-white/70 dark:bg-slate-900/50 rounded-full inline-block">
                      Belajar ➔
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
