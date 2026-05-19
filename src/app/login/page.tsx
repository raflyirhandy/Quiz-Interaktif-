"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Star, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email dan password harus diisi!");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Gagal masuk. Periksa kembali email dan password!");
        return;
      }

      toast.success("Berhasil masuk! Selamat belajar! 🎉");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-dots relative overflow-hidden">
      {/* Decorative ornaments */}
      <span className="absolute top-10 left-10 text-4xl float">✏️</span>
      <span className="absolute bottom-10 right-10 text-4xl float" style={{ animationDelay: "1s" }}>🎒</span>
      <span className="absolute top-20 right-[15%] text-4xl float" style={{ animationDelay: "2s" }}>⭐️</span>

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
          Ayo Mulai Belajar! 🚀
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
          Masuk dengan akun belajarmu
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-indigo-100 dark:border-slate-800 shadow-xl rounded-[36px]" padding="lg">
            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label="Alamat Email 📧"
                type="email"
                placeholder="anak_pintar@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={18} />}
                required
              />

              <Input
                label="Kata Sandi (Password) 🔑"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={18} />}
                required
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-xl"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Ingat saya
                  </label>
                </div>

                <div className="text-xs">
                  <a href="#" className="font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400">
                    Lupa Password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                className="rounded-2xl"
                icon={<Sparkles size={18} className="fill-white" />}
              >
                Masuk Sekarang
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Belum punya akun?{" "}
                <Link href="/register" className="font-bold text-pink-500 hover:text-pink-600">
                  Daftar di sini secara Gratis! ⭐️
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
