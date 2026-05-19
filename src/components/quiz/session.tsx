"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, ProgressBar } from "@/components/ui/misc";
import { Star, ArrowRight, Home, RefreshCw, Trophy, Volume2, VolumeX, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface QuizSessionClientProps {
  userId: string;
  materiId: string;
  materiJudul: string;
  quizzes: any[];
}

export function QuizSessionClient({
  userId,
  materiId,
  materiJudul,
  quizzes,
}: QuizSessionClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [saving, setSaving] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuiz = quizzes[currentIdx];

  // HTML5 audio refs for correct & incorrect answers
  const correctAudio = useRef<HTMLAudioElement | null>(null);
  const wrongAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Instantiate audio effects using royalty-free / system sounds
    correctAudio.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2000/2000-84.wav");
    wrongAudio.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav");
  }, []);

  // Timer Countdown Effect
  useEffect(() => {
    if (isFinished || isAnswered) return;

    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, isAnswered, isFinished]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedOpt("");
    if (soundEnabled && wrongAudio.current) {
      wrongAudio.current.play().catch(() => {});
    }
    toast.error("Waktu habis! ⏳");
  };

  const playSound = (isCorrect: boolean) => {
    if (!soundEnabled) return;
    if (isCorrect && correctAudio.current) {
      correctAudio.current.currentTime = 0;
      correctAudio.current.play().catch(() => {});
    } else if (!isCorrect && wrongAudio.current) {
      wrongAudio.current.currentTime = 0;
      wrongAudio.current.play().catch(() => {});
    }
  };

  const handleSelectOption = (optKey: string) => {
    if (isAnswered) return;

    setSelectedOpt(optKey);
    setIsAnswered(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = optKey === currentQuiz.jawaban;
    playSound(isCorrect);

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      toast.success("Jawabanmu Benar! Hebat! 🌟");
    } else {
      toast.error("Oops! Kurang tepat. Semangat mencoba lagi! 💪");
    }
  };

  const handleNext = async () => {
    if (currentIdx < quizzes.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      // Calculate final score
      const finalScore = Math.round((correctAnswers / quizzes.length) * 100);
      setScore(finalScore);
      setIsFinished(true);

      // Save to Supabase DB
      setSaving(true);
      try {
        const { error } = await supabase.from("hasil").insert({
          user_id: userId,
          materi_id: materiId,
          skor: finalScore,
          total_soal: quizzes.length,
        });

        if (error) throw error;
        toast.success("Skor belajarmu berhasil disimpan! 🎉");
      } catch (err) {
        toast.error("Gagal menyimpan hasil quiz.");
      } finally {
        setSaving(false);
      }
    }
  };

  if (isFinished) {
    const starCount = score >= 90 ? 3 : score >= 75 ? 2 : score >= 60 ? 1 : 0;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8 text-center"
      >
        <Card className="border-2 border-indigo-100 dark:border-slate-800 shadow-xl rounded-[40px] p-8 sm:p-12 relative overflow-hidden bg-white dark:bg-slate-900">
          <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-100/50 dark:bg-yellow-950/20 rounded-full blur-2xl -translate-x-12 -translate-y-12" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-100/50 dark:bg-indigo-950/20 rounded-full blur-3xl translate-x-12 translate-y-12" />

          <div className="relative z-10 space-y-6">
            <div className="text-6xl sm:text-7xl bounce-slow">🏆</div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest block">
                Kuis Selesai!
              </span>
              <h2 className="font-fredoka text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
                Hasil Ujian Kuis Kamu ✨
              </h2>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Materi: {materiJudul}
              </p>
            </div>

            {/* Stars count */}
            <div className="flex justify-center gap-2 pt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  size={32}
                  className={`${
                    i < starCount
                      ? "text-yellow-500 fill-yellow-500 animate-pulse"
                      : "text-gray-200 dark:text-slate-800"
                  }`}
                />
              ))}
            </div>

            {/* Score box */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-3xl p-6 max-w-xs mx-auto text-center space-y-1">
              <span className="text-4xl font-fredoka font-black text-indigo-500 block">
                {score}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                Total Skor Anda
              </span>
            </div>

            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
              {score >= 90
                ? "Luar biasa hebat! Kamu pantas dapat 3 Bintang Emas! 🥇✨"
                : score >= 75
                ? "Bagus sekali nilaimu! Terus pertahankan semangatmu! 🥈🌟"
                : score >= 60
                ? "Bagus! Terus belajar lagi biar dapat nilai 100 besok! 🥉👍"
                : "Semangat ya! Belajar kembali materi dan uji lagi besok! 💪📖"}
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="primary" size="lg" className="rounded-2xl w-full sm:w-auto font-bold" icon={<Home size={18} />}>
                  Kembali ke Beranda
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setCurrentIdx(0);
                  setSelectedOpt(null);
                  setIsAnswered(false);
                  setScore(0);
                  setCorrectAnswers(0);
                  setIsFinished(false);
                }}
                className="rounded-2xl w-full sm:w-auto font-bold border-2 border-indigo-500 text-indigo-500"
                icon={<RefreshCw size={18} />}
              >
                Ulangi Quiz
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Session metadata info bar */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border-2 border-indigo-50/50 dark:border-slate-950 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="rounded-lg text-xs font-bold font-fredoka px-3 py-1">
            Soal {currentIdx + 1} / {quizzes.length}
          </Badge>
          <span className="text-xs font-semibold text-gray-400 max-w-[120px] sm:max-w-none truncate">
            {materiJudul}
          </span>
        </div>

        {/* Audio sound settings toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-400 dark:text-gray-500 transition-colors"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Time Counter progress block */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-gray-500">⏳</span>
            <span className={`text-sm font-fredoka font-bold ${timeLeft <= 5 ? "text-red-500 animate-bounce" : "text-indigo-500"}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* Main gameplay progress bar indicator */}
      <ProgressBar value={currentIdx + 1} max={quizzes.length} color="indigo" size="sm" showLabel={false} />

      {/* Main Question Display Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-indigo-100 dark:border-slate-800 shadow-xl rounded-[36px]" padding="lg">
            <div className="space-y-6">
              {/* Question Text block */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
                  Pertanyaan Kuis
                </span>
                <p className="font-fredoka text-lg sm:text-xl font-bold text-gray-800 dark:text-white leading-relaxed">
                  {currentQuiz.pertanyaan}
                </p>
              </div>

              {/* Options selection stack */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  { key: "a", text: currentQuiz.opsi_a },
                  { key: "b", text: currentQuiz.opsi_b },
                  { key: "c", text: currentQuiz.opsi_c },
                  { key: "d", text: currentQuiz.opsi_d },
                ].map((opt) => {
                  const isSelected = selectedOpt === opt.key;
                  const isCorrectAnswer = opt.key === currentQuiz.jawaban;

                  let optColor = "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-200";
                  if (isAnswered) {
                    if (isCorrectAnswer) {
                      optColor = "border-green-400 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400";
                    } else if (isSelected) {
                      optColor = "border-red-400 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400";
                    } else {
                      optColor = "border-gray-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      disabled={isAnswered}
                      className={`p-4 border-2 rounded-2xl text-left text-sm font-semibold transition-all flex items-center justify-between gap-4 cursor-pointer disabled:cursor-default ${optColor}`}
                    >
                      <span>
                        <span className="font-fredoka mr-2 text-indigo-500 uppercase">{opt.key}.</span>
                        {opt.text}
                      </span>

                      {/* Icon status verification indicators */}
                      {isAnswered && isCorrectAnswer && (
                        <CheckCircle size={18} className="text-green-500 shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrectAnswer && (
                        <XCircle size={18} className="text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Action Nav trigger */}
              {isAnswered && (
                <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleNext}
                    className="rounded-xl flex items-center gap-1 font-bold text-xs"
                    icon={<ArrowRight size={16} />}
                  >
                    {currentIdx < quizzes.length - 1 ? "Soal Berikutnya" : "Lihat Hasil Akhir!"}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
