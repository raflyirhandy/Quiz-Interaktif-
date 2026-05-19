"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/misc";
import { Plus, Edit2, Trash2, Search, X, Sparkles, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface AdminQuizClientProps {
  initialQuizzes: any[];
  materials: any[];
}

export function AdminQuizClient({ initialQuizzes, materials }: AdminQuizClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [search, setSearch] = useState("");
  const [filterMateri, setFilterMateri] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any | null>(null);

  // Form states
  const [materiId, setMateriId] = useState(materials[0]?.id || "");
  const [pertanyaan, setPertanyaan] = useState("");
  const [opsiA, setOpsiA] = useState("");
  const [opsiB, setOpsiB] = useState("");
  const [opsiC, setOpsiC] = useState("");
  const [opsiD, setOpsiD] = useState("");
  const [jawaban, setJawaban] = useState<"a" | "b" | "c" | "d">("a");
  const [loading, setLoading] = useState(false);

  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch = q.pertanyaan.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterMateri === "all" || q.materi_id === filterMateri;
    return matchesSearch && matchesFilter;
  });

  const openAddModal = () => {
    setEditingQuiz(null);
    setMateriId(materials[0]?.id || "");
    setPertanyaan("");
    setOpsiA("");
    setOpsiB("");
    setOpsiC("");
    setOpsiD("");
    setJawaban("a");
    setModalOpen(true);
  };

  const openEditModal = (quiz: any) => {
    setEditingQuiz(quiz);
    setMateriId(quiz.materi_id);
    setPertanyaan(quiz.pertanyaan);
    setOpsiA(quiz.opsi_a);
    setOpsiB(quiz.opsi_b);
    setOpsiC(quiz.opsi_c);
    setOpsiD(quiz.opsi_d);
    setJawaban(quiz.jawaban);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materiId || !pertanyaan || !opsiA || !opsiB || !opsiC || !opsiD) {
      toast.error("Semua field kuis harus diisi!");
      return;
    }

    setLoading(true);
    try {
      if (editingQuiz) {
        // Edit Mode
        const { data, error } = await supabase
          .from("quiz")
          .update({
            materi_id: materiId,
            pertanyaan,
            opsi_a: opsiA,
            opsi_b: opsiB,
            opsi_c: opsiC,
            opsi_d: opsiD,
            jawaban,
          })
          .eq("id", editingQuiz.id)
          .select("*, materi(judul)")
          .single();

        if (error) throw error;
        setQuizzes((prev) =>
          prev.map((q) => (q.id === editingQuiz.id ? data : q))
        );
        toast.success("Soal kuis berhasil diupdate! 🎉");
      } else {
        // Add Mode
        const { data, error } = await supabase
          .from("quiz")
          .insert({
            materi_id: materiId,
            pertanyaan,
            opsi_a: opsiA,
            opsi_b: opsiB,
            opsi_c: opsiC,
            opsi_d: opsiD,
            jawaban,
          })
          .select("*, materi(judul)")
          .single();

        if (error) throw error;
        setQuizzes((prev) => [data, ...prev]);
        toast.success("Soal kuis baru berhasil ditambahkan! 🌟");
      }
      setModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan soal kuis.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus soal quiz ini?")) {
      return;
    }

    try {
      const { error } = await supabase.from("quiz").delete().eq("id", id);
      if (error) throw error;

      setQuizzes((prev) => prev.filter((q) => q.id !== id));
      toast.success("Soal kuis berhasil dihapus!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus soal kuis.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 rounded-3xl p-4 border-2 border-indigo-50/50 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="🔍 Cari pertanyaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <Select
            label=""
            value={filterMateri}
            onChange={(e) => setFilterMateri(e.target.value)}
            options={[
              { value: "all", label: "📂 Semua Materi" },
              ...materials.map((m) => ({ value: m.id, label: m.judul })),
            ]}
            className="py-2.5 text-xs rounded-xl font-bold max-w-xs"
          />

          <Button
            variant="primary"
            size="md"
            onClick={openAddModal}
            className="rounded-xl flex items-center gap-1.5 w-full sm:w-auto font-bold text-xs shrink-0"
            icon={<Plus size={16} />}
          >
            Buat Soal Kuis
          </Button>
        </div>
      </div>

      {/* Quizzes list */}
      <div className="space-y-4">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="border border-gray-100 dark:border-slate-800 rounded-3xl" padding="md">
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                      {quiz.materi?.judul || "Materi"}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-white leading-relaxed">
                      {quiz.pertanyaan}
                    </h3>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => openEditModal(quiz)}
                      className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Option blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                  {[
                    { key: "a", val: quiz.opsi_a },
                    { key: "b", val: quiz.opsi_b },
                    { key: "c", val: quiz.opsi_c },
                    { key: "d", val: quiz.opsi_d },
                  ].map((o) => {
                    const isAnswer = o.key === quiz.jawaban;
                    return (
                      <div
                        key={o.key}
                        className={`p-2 border rounded-xl flex items-center justify-between ${
                          isAnswer
                            ? "border-green-300 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                            : "border-gray-100 dark:border-slate-800 text-gray-500"
                        }`}
                      >
                        <span>
                          <span className="uppercase text-[10px] font-bold mr-1.5">{o.key}.</span>
                          {o.val}
                        </span>
                        {isAnswer && <span className="text-[10px] font-bold">Kunci Jawaban</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="rounded-[32px] border-2 border-dashed border-gray-200 dark:border-slate-800 py-12 text-center text-gray-500">
            <p className="font-bold text-sm">Tidak ada soal quiz ditemukan</p>
            <p className="text-xs">Coba buat baru dengan mengklik tombol &quot;Buat Soal Kuis&quot; di atas.</p>
          </Card>
        )}
      </div>

      {/* Interactive Modal Form */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[36px] overflow-hidden border-2 border-indigo-100 dark:border-slate-800 shadow-2xl relative"
            >
              <div className="p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                  <h3 className="font-fredoka text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Sparkles size={20} className="text-yellow-500" />
                    {editingQuiz ? "Edit Soal Kuis" : "Soal Kuis Baru"}
                  </h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-400"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <Select
                    label="Pilih Materi Pelajaran 📚"
                    value={materiId}
                    onChange={(e) => setMateriId(e.target.value)}
                    options={materials.map((m) => ({ value: m.id, label: m.judul }))}
                  />

                  <Textarea
                    label="Kalimat Pertanyaan Kuis 🤔"
                    placeholder="Tuliskan kalimat pertanyaan kuis secara jelas di sini..."
                    value={pertanyaan}
                    onChange={(e) => setPertanyaan(e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Opsi Pilihan A 🔴"
                      placeholder="Tulis Opsi A"
                      value={opsiA}
                      onChange={(e) => setOpsiA(e.target.value)}
                      required
                    />
                    <Input
                      label="Opsi Pilihan B 🟢"
                      placeholder="Tulis Opsi B"
                      value={opsiB}
                      onChange={(e) => setOpsiB(e.target.value)}
                      required
                    />
                    <Input
                      label="Opsi Pilihan C 🔵"
                      placeholder="Tulis Opsi C"
                      value={opsiC}
                      onChange={(e) => setOpsiC(e.target.value)}
                      required
                    />
                    <Input
                      label="Opsi Pilihan D 🟡"
                      placeholder="Tulis Opsi D"
                      value={opsiD}
                      onChange={(e) => setOpsiD(e.target.value)}
                      required
                    />
                  </div>

                  <Select
                    label="Kunci Jawaban yang Benar Kuis 🎯"
                    value={jawaban}
                    onChange={(e) => setJawaban(e.target.value as any)}
                    options={[
                      { value: "a", label: "Opsi Pilihan A" },
                      { value: "b", label: "Opsi Pilihan B" },
                      { value: "c", label: "Opsi Pilihan C" },
                      { value: "d", label: "Opsi Pilihan D" },
                    ]}
                  />

                  <div className="pt-4 flex gap-3 justify-end border-t border-gray-100 dark:border-slate-800">
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => setModalOpen(false)}
                      className="rounded-xl font-bold text-xs"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      loading={loading}
                      className="rounded-xl font-bold text-xs"
                    >
                      Simpan Kuis
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
