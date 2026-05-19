import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMateriList, getHasilByUser, getStats } from "@/lib/queries";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, ProgressBar, EmptyState } from "@/components/ui/misc";
import { BookOpen, Trophy, ArrowRight, Star, Sparkles, Award } from "lucide-react";
import Link from "next/link";

interface DashboardPageProps {
  searchParams: Promise<{
    search?: string;
    kategori?: string;
  }>;
}

export default async function StudentDashboard({ searchParams }: DashboardPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile detail
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const kategori = resolvedParams.kategori || "";

  // Fetch materials & quiz history
  const materiList = await getMateriList(search, kategori);
  const quizHistory = await getHasilByUser(user.id);

  // Compute stars & statistics
  const totalStars = quizHistory
    ? quizHistory.reduce((sum: number, h: any) => sum + (h.skor >= 90 ? 3 : h.skor >= 75 ? 2 : h.skor >= 60 ? 1 : 0), 0)
    : 0;

  const avgScore = quizHistory && quizHistory.length > 0
    ? Math.round(quizHistory.reduce((sum: number, h: any) => sum + h.skor, 0) / quizHistory.length)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar userName={profile?.nama || user.email} role={profile?.role} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-24 flex-grow w-full space-y-8">
        {/* Welcome Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[36px] p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs">
                <Sparkles size={12} className="animate-spin" />
                Kembali Belajar Hari Ini!
              </span>
              <h1 className="font-fredoka text-3xl sm:text-4xl font-bold">
                Halo, {profile?.nama || "Siswa Pintar"}! 👋🌟
              </h1>
              <p className="text-indigo-100 font-medium text-sm sm:text-base max-w-xl">
                Siap mengumpulkan lebih banyak Bintang Emas hari ini? Pilih materi kesukaanmu dan mulailah belajar!
              </p>
            </div>

            {/* Quick Stats Widget */}
            <div className="flex gap-4">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 min-w-24">
                <span className="text-2xl block">⭐️</span>
                <span className="text-xl font-bold font-fredoka block mt-1">{totalStars}</span>
                <span className="text-[10px] text-indigo-100 uppercase font-semibold">Bintang</span>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 min-w-24">
                <span className="text-2xl block">🏆</span>
                <span className="text-xl font-bold font-fredoka block mt-1">{avgScore}%</span>
                <span className="text-[10px] text-indigo-100 uppercase font-semibold">Rata-rata</span>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 min-w-24">
                <span className="text-2xl block">🎮</span>
                <span className="text-xl font-bold font-fredoka block mt-1">{quizHistory?.length || 0}</span>
                <span className="text-[10px] text-indigo-100 uppercase font-semibold">Selesai</span>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-slate-800">
          <form method="GET" action="/dashboard" className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="🔍 Cari materi kesukaanmu (misal: Matematika)..."
                className="w-full pl-6 pr-12 py-3 rounded-2xl border-2 border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30"
              />
              {search && (
                <Link href="/dashboard" className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500 hover:underline">
                  Reset
                </Link>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/dashboard">
                <Badge variant={!kategori ? "primary" : "default"} className="px-4 py-2 cursor-pointer font-bold text-xs">
                  🌟 Semua Kategori
                </Badge>
              </Link>
              {["Matematika", "Bahasa Indonesia", "IPA", "IPS", "Bahasa Inggris"].map((kat) => (
                <Link key={kat} href={`/dashboard?kategori=${kat}${search ? `&search=${search}` : ""}`}>
                  <Badge variant={kategori === kat ? "primary" : "default"} className="px-4 py-2 cursor-pointer font-bold text-xs">
                    {kat}
                  </Badge>
                </Link>
              ))}
            </div>
          </form>
        </section>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Materials Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-fredoka text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <BookOpen className="text-indigo-500" />
                Daftar Materi Belajar 📚
              </h2>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                {materiList?.length || 0} Materi
              </span>
            </div>

            {materiList && materiList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {materiList.map((materi) => (
                  <Card key={materi.id} hover className="border-2 border-indigo-50/50 dark:border-slate-800 rounded-[32px] overflow-hidden flex flex-col justify-between" padding="none">
                    <div className="p-6 space-y-4">
                      {/* Subject thumbnail or icon placeholder */}
                      <div className="h-40 bg-gradient-to-tr from-indigo-100 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl flex items-center justify-center border border-indigo-50 dark:border-slate-800 relative overflow-hidden">
                        <span className="text-6xl animate-bounce-slow">
                          {materi.kategori === "Matematika" ? "🔢" : materi.kategori === "Bahasa Indonesia" ? "📖" : materi.kategori === "IPA" ? "🔬" : materi.kategori === "IPS" ? "🌍" : "💡"}
                        </span>
                        <span className="absolute bottom-3 left-3 text-[10px] font-bold bg-white/80 dark:bg-slate-950/80 text-gray-800 dark:text-white px-2 py-0.5 rounded-full capitalize">
                          {materi.kategori}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-fredoka text-lg font-bold text-gray-800 dark:text-white line-clamp-1">
                          {materi.judul}
                        </h3>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {materi.deskripsi}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 border-t border-gray-50 dark:border-slate-800/50 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">
                        Kuis Pilihan Ganda 📝
                      </span>
                      <Link href={`/materi/${materi.id}`}>
                        <Button variant="primary" size="sm" className="rounded-xl flex items-center gap-1 font-bold text-xs" icon={<ArrowRight size={14} />}>
                          Mulai Belajar
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="rounded-[32px] border-2 border-dashed border-gray-200 dark:border-slate-800">
                <EmptyState
                  icon="🔍"
                  title="Materi Tidak Ditemukan"
                  description="Coba cari dengan kata kunci lain atau pilih semua kategori di menu filter atas."
                  action={
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm" className="rounded-xl font-bold">
                        Lihat Semua Materi
                      </Button>
                    </Link>
                  }
                />
              </Card>
            )}
          </div>

          {/* Right Sidebar - Stats & Achievements */}
          <div className="space-y-6">
            <h2 className="font-fredoka text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              Riwayat Kuis Kamu 🏆
            </h2>

            {quizHistory && quizHistory.length > 0 ? (
              <div className="space-y-4">
                {quizHistory.slice(0, 5).map((history: any) => {
                  const starCount = history.skor >= 90 ? 3 : history.skor >= 75 ? 2 : history.skor >= 60 ? 1 : 0;
                  return (
                    <Card key={history.id} className="border-2 border-indigo-50/50 dark:border-slate-800 rounded-3xl" padding="sm">
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-1 max-w-[65%]">
                          <h4 className="font-bold text-sm text-gray-800 dark:text-white truncate">
                            {history.materi?.judul || "Materi Pelajaran"}
                          </h4>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < starCount ? "text-yellow-500 fill-yellow-500" : "text-gray-200 dark:text-slate-700"}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-base font-bold font-fredoka ${history.skor >= 75 ? "text-green-500" : "text-indigo-500"}`}>
                            {history.skor} Poin
                          </span>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase block">
                            {history.skor >= 90 ? "Hebat!" : history.skor >= 75 ? "Bagus!" : "Cukup!"}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}

                {quizHistory.length > 5 && (
                  <Link href="/profile" className="block text-center text-xs font-bold text-indigo-500 hover:text-indigo-600">
                    Lihat Semua Riwayat di Profil ➔
                  </Link>
                )}
              </div>
            ) : (
              <Card className="rounded-[32px] border-2 border-dashed border-gray-200 dark:border-slate-800">
                <EmptyState
                  icon="📝"
                  title="Belum Mengikuti Kuis"
                  description="Kamu belum mencoba kuis apa pun. Pilih materi di sebelah kiri dan asah kemampuanmu!"
                />
              </Card>
            )}

            {/* Achievement Badge Box */}
            <Card className="bg-gradient-to-br from-amber-400 to-yellow-500 text-white rounded-[32px]" padding="md">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                    🎖️
                  </div>
                  <div>
                    <h3 className="font-fredoka text-base font-bold">Pencapaian Bintang</h3>
                    <p className="text-xs text-amber-100 font-medium">Bintang emas terkumpul</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Target Level 2</span>
                    <span>{totalStars} / 15 ⭐️</span>
                  </div>
                  <ProgressBar value={totalStars} max={15} color="yellow" size="sm" showLabel={false} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
