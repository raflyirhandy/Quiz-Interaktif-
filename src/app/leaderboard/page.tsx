import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLeaderboard } from "@/lib/queries";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/misc";
import { Trophy, Star, Award, Medal, Sparkles } from "lucide-react";

export default async function LeaderboardPage() {
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

  // Query database scoreboard
  const rawLeaderboard = await getLeaderboard();

  // Aggregate user scores:
  // Since multiple 'hasil' records might exist, we group by user and sum or get the highest scores.
  // Group by user_id
  const userMap: Record<string, { nama: string; totalSkor: number; quizCount: number }> = {};
  rawLeaderboard?.forEach((row: any) => {
    const userId = row.user_id;
    const name = row.users?.nama || "Siswa Misterius";
    const score = row.skor || 0;

    if (!userMap[userId]) {
      userMap[userId] = {
        nama: name,
        totalSkor: 0,
        quizCount: 0,
      };
    }
    userMap[userId].totalSkor += score;
    userMap[userId].quizCount += 1;
  });

  const leaderboards = Object.entries(userMap)
    .map(([id, entry]) => ({
      userId: id,
      ...entry,
    }))
    .sort((a, b) => b.totalSkor - a.totalSkor);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar userName={profile?.nama || user.email} role={profile?.role} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 flex-grow w-full space-y-8 animate-fade-in-up">
        {/* Title Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400 font-semibold text-sm border-2 border-yellow-200 dark:border-yellow-900/30">
            <Trophy size={16} className="fill-yellow-500 text-yellow-500 animate-pulse" />
            Juara-Juara Quiz Anak SD!
          </div>
          <h1 className="font-fredoka text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
            🏆 Papan Peringkat <span className="gradient-text">Siswa Terpintar</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium max-w-xl mx-auto">
            Terus jawab kuis dengan benar, kumpulkan poin sebanyak-banyaknya, dan tempati peringkat teratas papan skor!
          </p>
        </div>

        {/* Top 3 Podium Highlights */}
        {leaderboards.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 sm:gap-6 items-end pt-8 max-w-2xl mx-auto">
            {/* 2nd Place */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-400 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg relative">
                <span className="text-white font-bold text-lg">2</span>
                <div className="absolute -top-3 -right-1 text-2xl">🥈</div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate max-w-24">
                  {leaderboards[1].nama}
                </h3>
                <span className="text-[10px] font-fredoka text-indigo-500 font-bold">
                  {leaderboards[1].totalSkor} Poin
                </span>
              </div>
              <div className="w-full h-20 bg-gradient-to-t from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-t-2xl border-x-2 border-t-2 border-slate-200 dark:border-slate-700" />
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl relative">
                <span className="text-white font-bold text-xl">1</span>
                <div className="absolute -top-4 -right-1 text-3xl animate-bounce-slow">🥇</div>
              </div>
              <div className="text-center">
                <h3 className="font-fredoka text-sm sm:text-base font-bold text-gray-800 dark:text-white truncate max-w-28">
                  {leaderboards[0].nama}
                </h3>
                <span className="text-xs font-fredoka text-yellow-500 font-extrabold">
                  {leaderboards[0].totalSkor} Poin ✨
                </span>
              </div>
              <div className="w-full h-28 bg-gradient-to-t from-yellow-100 to-yellow-200 dark:from-yellow-950/30 dark:to-yellow-900/20 rounded-t-2xl border-x-2 border-t-2 border-yellow-300 dark:border-yellow-900/50" />
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg relative">
                <span className="text-white font-bold text-lg">3</span>
                <div className="absolute -top-3 -right-1 text-2xl">🥉</div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate max-w-24">
                  {leaderboards[2].nama}
                </h3>
                <span className="text-[10px] font-fredoka text-amber-600 font-bold">
                  {leaderboards[2].totalSkor} Poin
                </span>
              </div>
              <div className="w-full h-16 bg-gradient-to-t from-amber-100 to-amber-200 dark:from-slate-800 dark:to-slate-900 rounded-t-2xl border-x-2 border-t-2 border-amber-200 dark:border-slate-700" />
            </div>
          </div>
        )}

        {/* Score Board List */}
        <Card className="border-2 border-indigo-100 dark:border-slate-800 shadow-xl rounded-[36px]" padding="lg">
          <div className="space-y-4">
            {leaderboards.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {leaderboards.map((entry, index) => {
                  const isUserSelf = entry.userId === user.id;
                  return (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between py-4 ${
                        isUserSelf
                          ? "bg-indigo-50/50 dark:bg-indigo-900/10 -mx-6 px-6 rounded-2xl border-y border-indigo-100 dark:border-indigo-900/20"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank Badge */}
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-fredoka font-bold text-sm text-gray-600 dark:text-gray-400">
                          #{index + 1}
                        </div>

                        {/* Profile initials */}
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold">
                          {entry.nama.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <h4 className="font-bold text-sm sm:text-base text-gray-800 dark:text-white flex items-center gap-1.5">
                            {entry.nama}
                            {isUserSelf && (
                              <Badge variant="default" className="text-[9px] px-2 py-0.5 rounded-full font-bold">
                                Kamu
                              </Badge>
                            )}
                          </h4>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase">
                            🎮 {entry.quizCount} Kuis Selesai
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-fredoka text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {entry.totalSkor} Poin
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <span className="text-5xl block bounce-slow">🏆</span>
                <h3 className="font-fredoka text-lg font-bold text-gray-700 mt-3">Belum ada papan peringkat</h3>
                <p className="text-sm text-gray-500">Ayo jadilah siswa pertama yang menyelesaikan kuis dan cetak rekormu!</p>
              </div>
            )}
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
