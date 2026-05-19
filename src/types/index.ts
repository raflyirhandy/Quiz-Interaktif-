export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "siswa" | "admin";

export interface User {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Materi {
  id: string;
  judul: string;
  deskripsi: string;
  thumbnail: string;
  kategori: string;
  created_at: string;
}

export interface Quiz {
  id: string;
  materi_id: string;
  pertanyaan: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  jawaban: "a" | "b" | "c" | "d";
  created_at: string;
  materi?: Materi;
}

export interface Hasil {
  id: string;
  user_id: string;
  materi_id: string;
  skor: number;
  total_soal: number;
  created_at: string;
  user?: User;
  materi?: Materi;
}

export interface LeaderboardEntry {
  user_id: string;
  nama: string;
  total_skor: number;
  jumlah_quiz: number;
  rank: number;
}

export type QuizAnswer = {
  soal_id: string;
  jawaban_user: string;
  benar: boolean;
};
