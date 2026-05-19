"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User as UserIcon, Star, Sparkles, Award } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("siswa");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !email || !password) {
      toast.error("Semua input harus diisi!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter!");
      return;
    }

    setLoading(true);
    try {
      // 1. Register user in Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nama,
            role,
          },
        },
      });

      if (authError) {
        toast.error(authError.message || "Gagal melakukan registrasi.");
        return;
      }

      const user = authData.user;
      if (user) {
        // 2. Insert profile metadata into public.users table
        const { error: profileError } = await supabase.from("users").insert({
          id: user.id,
          nama,
          email,
          role,
        });

        if (profileError) {
          toast.error("Gagal menyimpan profil pengguna.");
          return;
        }
      }

      toast.success("Registrasi berhasil! Selamat datang! 🎉");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error("Terjadi kesalahan sistem saat mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-dots relative overflow-hidden">
      {/* Decorative ornaments */}
      <span className="absolute top-10 left-10 text-4xl float">🎈</span>
      <span className="absolute bottom-10 right-10 text-4xl float" style={{ animationDelay: "1s" }}>🥇</span>
      <span className="absolute top-20 right-[15%] text-4xl float" style={{ animationDelay: "2s" }}>🎨</span>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Star className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="font-fredoka text-2xl font-bold gradient-text">
            Quiz Anak SD
          </span>
        </Link>
        <h2 className="font-fredoka text-3xl font-extrabold text-gray-800 dark:text-white">
          Daftar Gratis! 🌟
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
          Dapatkan akses materi seru & quiz bintang emas!
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-indigo-100 dark:border-slate-800 shadow-xl rounded-[36px]" padding="lg">
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Nama Lengkap Siswa 🧑‍🎓"
                type="text"
                placeholder="Budi Santoso"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                icon={<UserIcon size={18} />}
                required
              />

              <Input
                label="Alamat Email 📧"
                type="email"
                placeholder="budi@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={18} />}
                required
              />

              <Input
                label="Kata Sandi (Password) 🔑"
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={18} />}
                required
              />

              <Select
                label="Peran / Role 👤"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={[
                  { value: "siswa", label: "Siswa (Belajar & Main Quiz)" },
                  { value: "admin", label: "Admin (Kelola Materi & Quiz)" },
                ]}
              />

              <Button
                type="submit"
                variant="success"
                size="lg"
                fullWidth
                loading={loading}
                className="rounded-2xl"
                icon={<Award size={18} />}
              >
                Buat Akun Sekarang
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Sudah punya akun?{" "}
                <Link href="/login" className="font-bold text-indigo-500 hover:text-indigo-600">
                  Masuk di sini ➔
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
