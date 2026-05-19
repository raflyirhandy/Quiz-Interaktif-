"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/misc";
import { Plus, Edit2, Trash2, Search, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { KATEGORI_OPTIONS, KATEGORI_COLORS } from "@/lib/utils";

interface AdminMateriClientProps {
  initialMateri: any[];
}

export function AdminMateriClient({ initialMateri }: AdminMateriClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [materiList, setMateriList] = useState(initialMateri);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMateri, setEditingMateri] = useState<any | null>(null);

  // Form states
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState(KATEGORI_OPTIONS[0]);
  const [loading, setLoading] = useState(false);

  const filteredMateri = materiList.filter((m) =>
    m.judul.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingMateri(null);
    setJudul("");
    setDeskripsi("");
    setKategori(KATEGORI_OPTIONS[0]);
    setModalOpen(true);
  };

  const openEditModal = (materi: any) => {
    setEditingMateri(materi);
    setJudul(materi.judul);
    setDeskripsi(materi.deskripsi);
    setKategori(materi.kategori);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !deskripsi) {
      toast.error("Semua field harus diisi!");
      return;
    }

    setLoading(true);
    try {
      if (editingMateri) {
        // Edit Mode
        const { data, error } = await supabase
          .from("materi")
          .update({
            judul,
            deskripsi,
            kategori,
          })
          .eq("id", editingMateri.id)
          .select()
          .single();

        if (error) throw error;
        setMateriList((prev) =>
          prev.map((m) => (m.id === editingMateri.id ? data : m))
        );
        toast.success("Materi berhasil diupdate! 🎉");
      } else {
        // Add Mode
        const { data, error } = await supabase
          .from("materi")
          .insert({
            judul,
            deskripsi,
            kategori,
            thumbnail: "",
          })
          .select()
          .single();

        if (error) throw error;
        setMateriList((prev) => [data, ...prev]);
        toast.success("Materi baru berhasil ditambahkan! 🌟");
      }
      setModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan materi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus materi ini? Semua soal kuis terkait materi ini juga akan terhapus.")) {
      return;
    }

    try {
      const { error } = await supabase.from("materi").delete().eq("id", id);
      if (error) throw error;

      setMateriList((prev) => prev.filter((m) => m.id !== id));
      toast.success("Materi berhasil dihapus!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus materi.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action controls row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 rounded-3xl p-4 border-2 border-indigo-50/50 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="🔍 Cari materi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openAddModal}
          className="rounded-xl flex items-center gap-1.5 w-full sm:w-auto font-bold text-xs"
          icon={<Plus size={16} />}
        >
          Materi Baru
        </Button>
      </div>

      {/* Materials List grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMateri.map((materi) => (
          <Card key={materi.id} className="border border-gray-100 dark:border-slate-800 rounded-3xl hover:shadow-lg transition-all" padding="md">
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-2">
                <Badge className={KATEGORI_COLORS[materi.kategori] || "bg-indigo-100 text-indigo-700"}>
                  {materi.kategori}
                </Badge>
                {/* Admin controls */}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => openEditModal(materi)}
                    className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(materi.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-fredoka text-base font-bold text-gray-800 dark:text-white line-clamp-1">
                  {materi.judul}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-2 leading-relaxed">
                  {materi.deskripsi}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Interactive Modal Form */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[36px] overflow-hidden border-2 border-indigo-100 dark:border-slate-800 shadow-2xl relative"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-fredoka text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Sparkles size={20} className="text-yellow-500" />
                    {editingMateri ? "Edit Materi Belajar" : "Materi Baru"}
                  </h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-400"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <Input
                    label="Judul Materi Pembelajaran 📚"
                    placeholder="Contoh: Operasi Penjumlahan Bilangan"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    required
                  />

                  <Select
                    label="Kategori Mata Pelajaran 📂"
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    options={KATEGORI_OPTIONS.map((kat) => ({ value: kat, label: kat }))}
                  />

                  <Textarea
                    label="Materi Pembelajaran (Deskripsi Lengkap) 📝"
                    placeholder="Tuliskan penjelasan materi secara lengkap dan ramah anak di sini..."
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    required
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
                      Simpan Materi
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
