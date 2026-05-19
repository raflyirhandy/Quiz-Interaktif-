import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMateriById, getQuizByMateriId } from "@/lib/queries";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { QuizSessionClient } from "@/components/quiz/session";

interface QuizSessionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuizSessionPage({ params }: QuizSessionPageProps) {
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
    redirect("/dashboard");
  }

  if (quizzes.length === 0) {
    redirect(`/materi/${materiId}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar userName={profile?.nama || user.email} role={profile?.role} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-24 flex-grow w-full">
        <QuizSessionClient
          userId={user.id}
          materiId={materi.id}
          materiJudul={materi.judul}
          quizzes={quizzes}
        />
      </main>

      <Footer />
    </div>
  );
}
