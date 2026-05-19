import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ThemeProvider } from "next-themes";
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Users,
  Trophy,
  ArrowLeft,
  Star,
  LogOut,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Validate admin role
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar userName={profile?.nama || user.email} role={profile?.role} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 flex-grow w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-indigo-50/50 dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
            <h2 className="font-fredoka text-lg font-bold text-gray-800 dark:text-white mb-4">
              Menu Admin 🛠️
            </h2>
            <nav className="flex flex-col gap-2">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 transition-colors"
              >
                <LayoutDashboard size={18} />
                Dashboard Admin
              </Link>
              <Link
                href="/admin/materi"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 transition-colors"
              >
                <BookOpen size={18} />
                Kelola Materi
              </Link>
              <Link
                href="/admin/quiz"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 transition-colors"
              >
                <HelpCircle size={18} />
                Kelola Soal Quiz
              </Link>
              <Link
                href="/admin/scores"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 transition-colors"
              >
                <Trophy size={18} />
                Hasil Ujian Siswa
              </Link>
            </nav>

            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-gray-500 hover:text-indigo-500 transition-colors"
              >
                <ArrowLeft size={16} />
                Menu Belajar Siswa
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
