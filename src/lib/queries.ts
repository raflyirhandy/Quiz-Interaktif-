import { createClient } from "@/lib/supabase/server";
import { Materi, Quiz, Hasil, User } from "@/types";

// ===== MATERI =====
export async function getMateriList(search?: string, kategori?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("materi")
    .select("*")
    .order("created_at", { ascending: false });

  if (search) query = query.ilike("judul", `%${search}%`);
  if (kategori) query = query.eq("kategori", kategori);

  const { data, error } = await query;
  if (error) throw error;
  return data as Materi[];
}

export async function getMateriById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("materi")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Materi;
}

// ===== QUIZ =====
export async function getQuizByMateriId(materiId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quiz")
    .select("*")
    .eq("materi_id", materiId)
    .order("created_at");
  if (error) throw error;
  return data as Quiz[];
}

// ===== HASIL =====
export async function getHasilByUser(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hasil")
    .select("*, materi(judul, thumbnail, kategori)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function submitHasil(
  userId: string,
  materiId: string,
  skor: number,
  totalSoal: number
) {
  const supabase = await createClient();
  const { error } = await supabase.from("hasil").insert({
    user_id: userId,
    materi_id: materiId,
    skor,
    total_soal: totalSoal,
  });
  if (error) throw error;
}

// ===== LEADERBOARD =====
export async function getLeaderboard() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hasil")
    .select("user_id, skor, users(nama)")
    .order("skor", { ascending: false });
  if (error) throw error;
  return data;
}

// ===== USERS (Admin) =====
export async function getAllUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as User[];
}

export async function getAllHasil() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hasil")
    .select("*, users(nama, email), materi(judul)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getStats() {
  const supabase = await createClient();

  const [usersRes, materiRes, quizRes, hasilRes] = await Promise.all([
    supabase.from("users").select("id", { count: "exact" }),
    supabase.from("materi").select("id", { count: "exact" }),
    supabase.from("quiz").select("id", { count: "exact" }),
    supabase.from("hasil").select("skor"),
  ]);

  const hasilData = hasilRes.data || [];
  const avgSkor =
    hasilData.length > 0
      ? Math.round(
          hasilData.reduce((a: number, h: { skor: number }) => a + h.skor, 0) /
            hasilData.length
        )
      : 0;

  return {
    totalUsers: usersRes.count || 0,
    totalMateri: materiRes.count || 0,
    totalQuiz: quizRes.count || 0,
    totalHasil: hasilData.length,
    avgSkor,
  };
}
