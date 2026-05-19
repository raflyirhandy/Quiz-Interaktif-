import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getScoreEmoji(score: number): string {
  if (score >= 90) return "🏆";
  if (score >= 75) return "⭐";
  if (score >= 60) return "😊";
  if (score >= 40) return "📚";
  return "💪";
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Luar Biasa!";
  if (score >= 75) return "Bagus Sekali!";
  if (score >= 60) return "Cukup Baik!";
  if (score >= 40) return "Terus Belajar!";
  return "Jangan Menyerah!";
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-yellow-500";
  if (score >= 75) return "text-green-500";
  if (score >= 60) return "text-blue-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

export function getBadge(score: number): { icon: string; label: string; color: string } {
  if (score >= 90) return { icon: "🥇", label: "Bintang Emas", color: "bg-yellow-100 text-yellow-700" };
  if (score >= 75) return { icon: "🥈", label: "Bintang Perak", color: "bg-gray-100 text-gray-700" };
  if (score >= 60) return { icon: "🥉", label: "Bintang Perunggu", color: "bg-orange-100 text-orange-700" };
  return { icon: "📖", label: "Pelajar Rajin", color: "bg-blue-100 text-blue-700" };
}

export const KATEGORI_OPTIONS = [
  "Matematika",
  "Bahasa Indonesia",
  "IPA",
  "IPS",
  "Bahasa Inggris",
  "PKn",
  "Agama",
  "Seni Budaya",
];

export const KATEGORI_COLORS: Record<string, string> = {
  Matematika: "bg-blue-100 text-blue-700",
  "Bahasa Indonesia": "bg-green-100 text-green-700",
  IPA: "bg-emerald-100 text-emerald-700",
  IPS: "bg-orange-100 text-orange-700",
  "Bahasa Inggris": "bg-purple-100 text-purple-700",
  PKn: "bg-red-100 text-red-700",
  Agama: "bg-yellow-100 text-yellow-700",
  "Seni Budaya": "bg-pink-100 text-pink-700",
};

export const KATEGORI_EMOJIS: Record<string, string> = {
  Matematika: "🔢",
  "Bahasa Indonesia": "📖",
  IPA: "🔬",
  IPS: "🌍",
  "Bahasa Inggris": "🌐",
  PKn: "🏛️",
  Agama: "🌙",
  "Seni Budaya": "🎨",
};
