import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMateriById, getQuizByMateriId } from "@/lib/queries";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/misc";
import { ArrowLeft, BookOpen, Star, HelpCircle, GraduationCap } from "lucide-react";

interface MateriDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MateriDetailPage({ params }: MateriDetailPageProps) {
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

  const resolvedParams = await params;
  const materiId = resolvedParams.id;

  let materi;
  let quizzes = [];

  try {
    materi = await getMateriById(materiId);
    quizzes = await getQuizByMateriId(materiId);
  } catch (err) {
    // If not found or error, redirect back
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar userName={profile?.nama || user.email} role={profile?.role} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 flex-grow w-full space-y-6">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-500 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Beranda
        </Link>

        {/* Content Box */}
        <Card className="border-2 border-indigo-100 dark:border-slate-800 shadow-xl rounded-[36px] overflow-hidden" padding="none">
          {/* Decorative Header banner */}
          <div className="h-48 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 p-8 text-white relative overflow-hidden flex flex-col justify-end">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <span className="absolute top-6 right-8 text-6xl animate-bounce-slow">📖</span>

            <div className="space-y-2 relative z-10">
              <Badge variant="warning" className="uppercase text-[10px] font-extrabold px-3 py-1 rounded-full text-indigo-900">
                {materi.kategori}
              </Badge>
              <h1 className="font-fredoka text-2xl sm:text-3xl font-bold">
                {materi.judul}
              </h1>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              <h2 className="font-fredoka text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <BookOpen size={20} className="text-indigo-500" />
                Mari Membaca & Mempelajari! 🌟
              </h2>

              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium leading-relaxed space-y-4">
                {/* Format content with beautiful paragraph blocks */}
                {materi.deskripsi.split("\n\n").map((para: string, idx: number) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* Cute educational summary quote box */}
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 border-2 border-dashed border-indigo-100 dark:border-indigo-900/30 rounded-2xl flex items-start gap-3">
              <span className="text-2xl mt-0.5">💡</span>
              <div className="space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-indigo-700 dark:text-indigo-400">
                  Tips Pintar Belajar
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium leading-normal">
                  Bacalah materi di atas dengan teliti. Jika kamu sudah memahami konsepnya, tantang dirimu untuk menyelesaikan kuis di bawah ini demi mendapatkan Bintang Emas! ⭐️
                </p>
              </div>
            </div>

            {/* Bottom CTA to start interactive quiz */}
            <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 justify-center sm:justify-start">
                  <HelpCircle size={14} className="text-indigo-500" />
                  {quizzes.length} Pertanyaan Tersedia
                </span>
                <p className="text-[11px] text-gray-400 font-semibold">
                  Selesaikan kuis untuk meningkatkan skor belajarmu!
                </p>
              </div>

              {quizzes.length > 0 ? (
                <Link href={`/quiz/${materi.id}`} className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="rounded-2xl w-full sm:w-auto text-indigo-950 font-bold" icon={<Star className="fill-indigo-950" size={18} />}>
                    Mulai Uji Kemampuan!
                  </Button>
                </Link>
              ) : (
                <Button variant="primary" disabled className="rounded-2xl w-full sm:w-auto">
                  Quiz Segera Datang
                </Button>
              )}
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
