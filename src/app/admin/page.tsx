import { getStats, getAllHasil } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/misc";
import { Users, BookOpen, HelpCircle, Trophy, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardHome() {
  const stats = await getStats();
  const recentHasil = await getAllHasil();

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="font-fredoka text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard Utama Admin 🛠️⭐
        </h1>
        <p className="text-sm font-semibold text-gray-500">
          Kelola seluruh materi pembelajaran, database quiz, serta pantau nilai perkembangan siswa.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon="🧑‍🎓"
          label="Total Siswa"
          value={stats.totalUsers}
          color="bg-indigo-500"
        />
        <StatCard
          icon="📚"
          label="Total Materi"
          value={stats.totalMateri}
          color="bg-emerald-500"
        />
        <StatCard
          icon="📝"
          label="Total Soal"
          value={stats.totalQuiz}
          color="bg-amber-500"
        />
        <StatCard
          icon="🏆"
          label="Rata-rata Skor"
          value={`${stats.avgSkor}%`}
          color="bg-pink-500"
        />
      </div>

      {/* Recent Student Activity */}
      <Card className="border-2 border-indigo-100 dark:border-slate-800 rounded-[32px]" padding="lg">
        <div className="space-y-4">
          <h2 className="font-fredoka text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-500 animate-spin" />
            Aktifitas Ujian Siswa Terkini 📈
          </h2>

          {recentHasil && recentHasil.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800 text-xs text-gray-400 uppercase font-semibold">
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Materi Pelajaran</th>
                    <th className="py-3 px-4">Tanggal Ujian</th>
                    <th className="py-3 px-4 text-right">Hasil Skor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                  {recentHasil.slice(0, 8).map((hasil: any) => (
                    <tr key={hasil.id} className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <td className="py-4 px-4">{hasil.users?.nama || "Siswa Pintar"}</td>
                      <td className="py-4 px-4 text-xs font-medium text-gray-400">{hasil.users?.email}</td>
                      <td className="py-4 px-4">{hasil.materi?.judul}</td>
                      <td className="py-4 px-4 text-xs font-semibold text-gray-400">
                        {formatDate(hasil.created_at)}
                      </td>
                      <td className="py-4 px-4 text-right text-base font-fredoka font-bold text-indigo-500">
                        {hasil.skor}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl block bounce-slow">📈</span>
              <p className="text-sm font-semibold mt-2">Belum ada siswa yang mengerjakan kuis.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
