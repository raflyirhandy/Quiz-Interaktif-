import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getHasilByUser } from "@/lib/queries";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge, ProgressBar, EmptyState } from "@/components/ui/misc";
import { User, Trophy, Star, Calendar, StarHalf, Mail, Compass } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get complete history
  const quizHistory = await getHasilByUser(user.id);

  // Group achievements
  const totalStars = quizHistory
    ? quizHistory.reduce((sum: number, h: any) => sum + (h.skor >= 90 ? 3 : h.skor >= 75 ? 2 : h.skor >= 60 ? 1 : 0), 0)
    : 0;

  const highestScore = quizHistory && quizHistory.length > 0
    ? Math.max(...quizHistory.map((h: any) => h.skor))
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar userName={profile?.nama || user.email} role={profile?.role} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 flex-grow w-full space-y-8 animate-fade-in-up">
        {/* Profile Card Header */}
        <Card className="border-2 border-indigo-100 dark:border-slate-800 shadow-xl rounded-[36px]" padding="lg">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-400 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-fredoka text-4xl shadow-xl relative border-4 border-white dark:border-slate-800">
              {profile?.nama?.charAt(0).toUpperCase() || "S"}
              <div className="absolute -bottom-2 -right-2 text-2xl animate-bounce-slow">✨</div>
            </div>

            <div className="space-y-2 flex-grow">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <h1 className="font-fredoka text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                  {profile?.nama || "Siswa Pintar"}
                </h1>
                <Badge variant="primary" className="capitalize text-xs font-bold px-3 py-1 rounded-full">
                  🧑‍🎓 {profile?.role || "Siswa"}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Mail size={14} className="text-indigo-500" />
                  {profile?.email || user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-pink-500" />
                  Bergabung: {profile ? formatDate(profile.created_at) : "-"}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border border-indigo-100 dark:border-slate-800 text-center rounded-[24px]" padding="sm">
            <span className="text-3xl block">⭐</span>
            <span className="text-xl font-bold font-fredoka block mt-1">{totalStars}</span>
            <span className="text-[10px] text-gray-400 uppercase font-semibold">Bintang</span>
          </Card>
          <Card className="border border-indigo-100 dark:border-slate-800 text-center rounded-[24px]" padding="sm">
            <span className="text-3xl block">🏆</span>
            <span className="text-xl font-bold font-fredoka block mt-1">{highestScore}%</span>
            <span className="text-[10px] text-gray-400 uppercase font-semibold">Skor Tertinggi</span>
          </Card>
          <Card className="border border-indigo-100 dark:border-slate-800 text-center rounded-[24px]" padding="sm">
            <span className="text-3xl block">🎮</span>
            <span className="text-xl font-bold font-fredoka block mt-1">{quizHistory?.length || 0}</span>
            <span className="text-[10px] text-gray-400 uppercase font-semibold">Kuis Selesai</span>
          </Card>
          <Card className="border border-indigo-100 dark:border-slate-800 text-center rounded-[24px]" padding="sm">
            <span className="text-3xl block">🎖️</span>
            <span className="text-xl font-bold font-fredoka block mt-1">
              {totalStars >= 15 ? "Emas" : totalStars >= 8 ? "Perak" : "Perunggu"}
            </span>
            <span className="text-[10px] text-gray-400 uppercase font-semibold">Gelar Belajar</span>
          </Card>
        </div>

        {/* Badge & Achievement stars */}
        <Card className="border-2 border-indigo-100 dark:border-slate-800 shadow-sm rounded-[32px]" padding="lg">
          <h2 className="font-fredoka text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            Koleksi Badge Prestasi 🏅
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { title: "Bintang Pemula", icon: "🥉", desc: "Kumpulkan 1 bintang", active: totalStars >= 1 },
              { title: "Pemburu Kuis", icon: "🥈", desc: "Selesaikan 3 kuis", active: (quizHistory?.length || 0) >= 3 },
              { title: "Nilai Sempurna", icon: "🥇", desc: "Dapat skor 100", active: highestScore === 100 },
              { title: "Juara Bintang", icon: "👑", desc: "Kumpulkan 15 bintang", active: totalStars >= 15 },
            ].map((badge) => (
              <div
                key={badge.title}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  badge.active
                    ? "border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20 text-gray-800 dark:text-white"
                    : "border-gray-100 bg-gray-50/50 dark:bg-slate-900/50 text-gray-400 dark:text-slate-600 opacity-60"
                }`}
              >
                <span className="text-4xl block mb-2">{badge.icon}</span>
                <h4 className="font-bold text-xs sm:text-sm">{badge.title}</h4>
                <p className="text-[10px] text-gray-400 mt-1 font-semibold">{badge.desc}</p>
                {badge.active ? (
                  <span className="text-[9px] font-bold text-yellow-600 bg-yellow-100 dark:bg-yellow-950 px-2 py-0.5 rounded-full inline-block mt-2">
                    Aktif
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full inline-block mt-2">
                    Terkunci
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Detailed History Table */}
        <Card className="border-2 border-indigo-100 dark:border-slate-800 shadow-sm rounded-[32px]" padding="lg">
          <h2 className="font-fredoka text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Compass className="text-pink-500" />
            Riwayat Lengkap Ujian & Hasil Kuis 📝
          </h2>

          {quizHistory && quizHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800 text-xs text-gray-400 uppercase font-semibold">
                    <th className="py-3 px-4">Judul Materi</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Tanggal Pengerjaan</th>
                    <th className="py-3 px-4 text-right">Skor Hasil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                  {quizHistory.map((history: any) => (
                    <tr key={history.id} className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <td className="py-4 px-4">{history.materi?.judul || "Materi Pelajaran"}</td>
                      <td className="py-4 px-4">
                        <Badge variant="primary" className="capitalize text-[10px]">
                          {history.materi?.kategori || "Umum"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-gray-400">
                        {formatDate(history.created_at)}
                      </td>
                      <td className="py-4 px-4 text-right text-base font-fredoka font-bold text-indigo-500">
                        {history.skor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon="✏️"
              title="Belum Ada Hasil Ujian"
              description="Ayo pilih materi, pelajari topiknya dan selesaikan quiz pertama kamu sekarang juga!"
            />
          )}
        </Card>
      </main>

      <Footer />
    </div>
  );
}
