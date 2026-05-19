"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Star, Award, Zap, Smile, BookOpen, Brain } from "lucide-react";

const features = [
  {
    icon: "📖",
    title: "Materi Interaktif",
    desc: "Materi pelajaran disajikan secara visual dengan bahasa yang mudah dipahami anak-anak SD.",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-900/30",
  },
  {
    icon: "🎮",
    title: "Belajar Sambil Bermain",
    desc: "Quiz interaktif pilihan ganda lengkap dengan timer seru dan efek suara ceria saat menjawab.",
    color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    borderColor: "border-green-200 dark:border-green-900/30",
  },
  {
    icon: "🏆",
    title: "Sistem Skor & Bintang",
    desc: "Dapatkan skor langsung setelah selesai quiz serta kumpulkan bintang emas untuk profilmu!",
    color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    borderColor: "border-yellow-200 dark:border-yellow-900/30",
  },
  {
    icon: "🥇",
    title: "Papan Ranking Siswa",
    desc: "Lihat posisi belajarmu di Leaderboard tingkat nasional. Bersaing secara sehat dengan teman-teman!",
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-200 dark:border-purple-900/30",
  },
  {
    icon: "🎨",
    title: "Tampilan Fun & Colorful",
    desc: "Tampilan modern, ramah anak, serta didukung dengan dark mode untuk kenyamanan mata.",
    color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
    borderColor: "border-pink-200 dark:border-pink-900/30",
  },
  {
    icon: "🚀",
    title: "Riwayat Belajar Lengkap",
    desc: "Pantau perkembangan belajarmu, perbaiki nilai, dan pelajari kembali materi yang belum dikuasai.",
    color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-200 dark:border-orange-900/30",
  },
];

export function LandingFeatures() {
  return (
    <section className="py-20 px-6 bg-white dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="font-fredoka text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
            Mengapa Belajar di <span className="gradient-text">Quiz Anak SD?</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Kami menggabungkan kurikulum sekolah dengan teknologi interaktif demi menciptakan pengalaman belajar yang tak terlupakan!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Card
                className={`border-2 ${feat.borderColor} hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-[32px]`}
                padding="md"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 ${feat.color} rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md`}>
                    {feat.icon}
                  </div>
                  <h3 className="font-fredoka text-xl font-bold text-gray-800 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
