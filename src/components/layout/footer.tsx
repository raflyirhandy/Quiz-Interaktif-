import Link from "next/link";
import { Star, BookOpen, Mail, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-fredoka text-xl font-bold gradient-text">
                Quiz Anak SD
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Platform belajar interaktif yang menyenangkan untuk anak-anak SD.
              Belajar sambil bermain! 🎮
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-500" />
              Menu Utama
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/dashboard", label: "🏠 Beranda" },
                { href: "/materi", label: "📚 Materi Pelajaran" },
                { href: "/leaderboard", label: "🏆 Papan Ranking" },
                { href: "/profile", label: "👤 Profil Saya" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <Mail size={16} className="text-pink-500" />
              Mata Pelajaran
            </h4>
            <div className="flex flex-wrap gap-2">
              {["🔢 Matematika", "📖 Bahasa Indonesia", "🔬 IPA", "🌍 IPS", "🌐 Bahasa Inggris"].map(
                (subj) => (
                  <span
                    key={subj}
                    className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs rounded-full font-medium"
                  >
                    {subj}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © 2024 Quiz Anak SD. Dibuat dengan{" "}
            <Heart size={12} className="inline text-pink-500 fill-pink-500" /> untuk
            anak-anak Indonesia.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Powered by Next.js & Supabase 🚀
          </p>
        </div>
      </div>
    </footer>
  );
}
