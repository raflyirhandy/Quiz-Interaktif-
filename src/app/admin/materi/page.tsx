import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMateriList } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { AdminMateriClient } from "@/components/admin/materi-client";

export default async function AdminMateriPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const materiList = await getMateriList();

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="font-fredoka text-3xl font-bold text-gray-800 dark:text-white">
          Kelola Materi Belajar 📚
        </h1>
        <p className="text-sm font-semibold text-gray-500">
          Buat baru, edit deskripsi, ubah kategori, atau hapus materi pembelajaran sekolah dasar.
        </p>
      </div>

      <AdminMateriClient initialMateri={materiList} />
    </div>
  );
}
