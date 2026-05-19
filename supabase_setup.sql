-- SQL Setup Script for "Quiz Anak SD"
-- Run this in your Supabase SQL Editor to set up tables, RLS policies, and seed some sample data!

-- 1. Create table `users`
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('siswa', 'admin')) DEFAULT 'siswa',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read users" ON public.users 
    FOR SELECT USING (true);

CREATE POLICY "Allow users update own profile" ON public.users 
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow service role insert" ON public.users 
    FOR INSERT WITH CHECK (true);


-- 2. Create table `materi`
CREATE TABLE IF NOT EXISTS public.materi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    thumbnail TEXT DEFAULT '',
    kategori TEXT NOT NULL DEFAULT 'Matematika',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for materi
ALTER TABLE public.materi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read materi" ON public.materi 
    FOR SELECT USING (true);

CREATE POLICY "Allow admin manage materi" ON public.materi 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE public.users.id = auth.uid() AND public.users.role = 'admin'
        )
    );


-- 3. Create table `quiz`
CREATE TABLE IF NOT EXISTS public.quiz (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    materi_id UUID REFERENCES public.materi(id) ON DELETE CASCADE,
    pertanyaan TEXT NOT NULL,
    opsi_a TEXT NOT NULL,
    opsi_b TEXT NOT NULL,
    opsi_c TEXT NOT NULL,
    opsi_d TEXT NOT NULL,
    jawaban TEXT NOT NULL CHECK (jawaban IN ('a', 'b', 'c', 'd')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for quiz
ALTER TABLE public.quiz ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read quiz" ON public.quiz 
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin manage quiz" ON public.quiz 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE public.users.id = auth.uid() AND public.users.role = 'admin'
        )
    );


-- 4. Create table `hasil`
CREATE TABLE IF NOT EXISTS public.hasil (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    materi_id UUID REFERENCES public.materi(id) ON DELETE CASCADE,
    skor INTEGER NOT NULL,
    total_soal INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for hasil
ALTER TABLE public.hasil ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users read own hasil" ON public.hasil 
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.users 
        WHERE public.users.id = auth.uid() AND public.users.role = 'admin'
    ));

CREATE POLICY "Allow users insert own hasil" ON public.hasil 
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ================================================
-- SEED DATA: Rich Educational Materials & Quizzes
-- ================================================

-- Insert Matematika
INSERT INTO public.materi (id, judul, deskripsi, kategori) VALUES (
    'aa47e250-7173-455b-bb66-17072e2cf7d1',
    'Penjumlahan & Pengurangan Seru! 🔢',
    'Selamat datang di petualangan matematika! Hari ini kita akan belajar menjumlahkan dan mengurangkan angka dengan cara yang asyik.\n\nPenjumlahan adalah proses menggabungkan dua kelompok benda menjadi satu kelompok besar. Misalnya, jika kamu memiliki 3 apel merah dan ibumu memberikan 2 apel hijau lagi, maka kamu sekarang memiliki 3 + 2 = 5 apel!\n\nPengurangan adalah kebalikannya, yaitu memisahkan sebagian benda dari kelompoknya. Jika kamu memiliki 5 buah balon, lalu 2 balon meletus, balonmu tersisa 5 - 2 = 3 balon!\n\nIngat ya, berlatih adalah kunci agar semakin mahir!',
    'Matematika'
) ON CONFLICT (id) DO NOTHING;

-- Insert Matematika Quizzes
INSERT INTO public.quiz (materi_id, pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (
    'aa47e250-7173-455b-bb66-17072e2cf7d1',
    'Jika Andi memiliki 7 pensil dan meminjamkan 3 pensil kepada Budi, berapa sisa pensil Andi?',
    '3 pensil',
    '4 pensil',
    '5 pensil',
    '10 pensil',
    'b'
), (
    'aa47e250-7173-455b-bb66-17072e2cf7d1',
    'Berapakah hasil dari penjumlahan 12 + 15?',
    '25',
    '27',
    '29',
    '30',
    'b'
), (
    'aa47e250-7173-455b-bb66-17072e2cf7d1',
    'Ibu membeli 10 butir telur, ternyata pecah 2 butir di jalan. Berapa butir telur Ibu yang masih utuh?',
    '6 butir',
    '7 butir',
    '8 butir',
    '9 butir',
    'c'
) ON CONFLICT (id) DO NOTHING;


-- Insert IPA
INSERT INTO public.materi (id, judul, deskripsi, kategori) VALUES (
    'bb47e250-7173-455b-bb66-17072e2cf7d2',
    'Mengenal Anggota Tubuh & Panca Indra 🔬🧠',
    'Tahukah kamu bahwa tubuh kita adalah ciptaan yang luar biasa? Tubuh kita memiliki berbagai bagian dengan fungsi pentingnya masing-masing.\n\nKita juga memiliki 5 alat bantu hebat bernama Panca Indra:\n1. Mata untuk melihat keindahan dunia (Indra Penglihat).\n2. Telinga untuk mendengar lagu dan nasehat guru (Indra Pendengar).\n3. Hidung untuk mencium wangi bunga atau makanan lezat (Indra Pencium).\n4. Lidah untuk merasakan manisnya es krim dan asinnya keju (Indra Pengecap).\n5. Kulit untuk merasakan sentuhan hangat atau dinginnya es (Indra Peraba).\n\nAyo jaga kesehatan tubuh kita dengan rajin makan buah dan sayur!',
    'IPA'
) ON CONFLICT (id) DO NOTHING;

-- Insert IPA Quizzes
INSERT INTO public.quiz (materi_id, pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (
    'bb47e250-7173-455b-bb66-17072e2cf7d2',
    'Manakah panca indra yang digunakan untuk mendengarkan suara burung bernyanyi?',
    'Mata',
    'Hidung',
    'Lidah',
    'Telinga',
    'd'
), (
    'bb47e250-7173-455b-bb66-17072e2cf7d2',
    'Panca indra lidah berfungsi untuk...',
    'Mendengar musik',
    'Melihat bintang',
    'Merasakan cita rasa rasa makanan',
    'Menghirup aroma parfum',
    'c'
), (
    'bb47e250-7173-455b-bb66-17072e2cf7d2',
    'Berapa jumlah panca indra utama yang dimiliki oleh tubuh manusia?',
    '3 indra',
    '4 indra',
    '5 indra',
    '6 indra',
    'c'
) ON CONFLICT (id) DO NOTHING;
