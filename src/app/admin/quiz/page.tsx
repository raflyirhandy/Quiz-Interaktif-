import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMateriList } from "@/lib/queries";
import { AdminQuizClient } from "@/components/admin/quiz-client";

export default async function AdminQuizCRUDPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Load all materials so the admin can filter and assign questions
  const materials = await getMateriList();

  // Load all quizzes from database to pass down
  const { data: rawQuizzes, error } = await supabase
    .from("quiz")
    .select("*, materi(judul)")
    .order("created_at", { ascending: false });

  const quizList = rawQuizzes || [];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="font-fredoka text-3xl font-bold text-gray-800 dark:text-white">
          Kelola Soal Quiz 📝🌟
        </h1>
        <p className="text-sm font-semibold text-gray-500">
          Buat baru, edit opsi pilihan ganda, tentukan kunci jawaban, atau hapus soal quiz pembelajaran.
        </p>
      </div>

      <AdminQuizClient initialQuizzes={quizList} materials={materials} />
    </div>
  );
}
