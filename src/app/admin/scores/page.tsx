import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllHasil } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/misc";
import { formatDate } from "@/lib/utils";
import { Trophy, Calendar, Sparkles } from "lucide-react";

export default async function AdminScoresPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const scores = await getAllHasil();

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="font-fredoka text-3xl font-bold text-gray-800 dark:text-white">
          Riwayat Nilai Siswa 🏆🧑‍🎓
        </h1>
        <p className="text-sm font-semibold text-gray-500">
          Lihat semua hasil pengerjaan kuis, skor pencapaian, dan tanggal pengerjaan dari seluruh siswa.
        </p>
      </div>

      <Card className="border-2 border-indigo-100 dark:border-slate-800 shadow-xl rounded-[36px]" padding="lg">
        {scores && scores.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 text-xs text-gray-400 uppercase font-semibold">
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Email Siswa</th>
                  <th className="py-3 px-4">Materi Kuis</th>
                  <th className="py-3 px-4">Tanggal Ujian</th>
                  <th className="py-3 px-4 text-right">Skor Pencapaian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {scores.map((score: any) => (
                  <tr key={score.id} className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-4">{score.users?.nama || "Siswa Pintar"}</td>
                    <td className="py-4 px-4 text-xs font-semibold text-gray-400">{score.users?.email}</td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className="block">{score.materi?.judul}</span>
                        <Badge variant="primary" className="text-[9px] uppercase px-2 py-0.5 rounded-md">
                          {score.materi?.kategori}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="flex items-center gap-1 text-xs text-gray-400 font-semibold">
                        <Calendar size={12} />
                        {formatDate(score.created_at)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`font-fredoka text-lg font-bold ${score.skor >= 75 ? "text-green-500" : "text-indigo-500"}`}>
                        {score.skor}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <span className="text-5xl block bounce-slow">📝</span>
            <h3 className="font-fredoka text-lg font-bold mt-3">Belum Ada Hasil Ujian</h3>
            <p className="text-sm">Riwayat pengerjaan kuis siswa akan otomatis terekam dan tampil di sini.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
