-- ==============================================================================
-- SKEMA DATABASE SUPABASE UNTUK INVOICE GENERATOR (GAGAL JADI FILSUF / PUNEL ART)
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Tabel Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL UNIQUE,
    date TEXT NOT NULL,
    due TEXT NOT NULL,
    payment_method TEXT DEFAULT 'Transfer Bank BCA / QRIS',
    status TEXT NOT NULL CHECK (status IN ('Belum Lunas', 'DP', 'Lunas')),
    dp_amount NUMERIC DEFAULT 0,
    client JSONB NOT NULL DEFAULT '{}'::jsonb,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    totals JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk pencarian cepat invoice
CREATE INDEX IF NOT EXISTS idx_invoices_number ON public.invoices (number);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices (status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices (created_at DESC);

-- 2. Tabel Katalog Layanan
CREATE TABLE IF NOT EXISTS public.catalog (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT 'desain',
    "desc" TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Default Katalog Awal
INSERT INTO public.catalog (id, category, name, price, unit, "desc")
VALUES
    ('cat-1', 'DESAIN PEMASARAN & PERIKLANAN', 'Poster', 60000, 'desain', 'Pembuatan materi visual poster untuk promosi'),
    ('cat-2', 'DESAIN PEMASARAN & PERIKLANAN', 'Brosur', 60000, 'desain', 'Desain brosur promosi lipat / flyer'),
    ('cat-3', 'DESAIN PEMASARAN & PERIKLANAN', 'Banner Iklan Digital', 60000, 'desain', 'Visual banner promosi web & media sosial'),
    ('cat-4', 'DESAIN PEMASARAN & PERIKLANAN', 'Baliho', 60000, 'desain', 'Materi visual baliho / spanduk outdoor'),
    ('cat-5', 'MOTION GRAPHIC', 'Video Intro', 70000, 'desain', 'Video intro animasi motion graphic'),
    ('cat-6', 'DESAIN KONTEN MEDIA SOSIAL', 'Konten Media Sosial (Paket)', 60000, '3 desain', 'Layanan rutin per 1 paket (3 desain = Rp60.000)'),
    ('cat-7', 'LAYOUT & EDITORIAL', 'Layout Buku', 10000, 'halaman', 'Tata letak halaman isi buku (Rp10.000 / halaman)'),
    ('cat-8', 'LAYOUT & EDITORIAL', 'Desain Cover Buku', 100000, 'desain', 'Desain sampul buku depan, punggung & belakang')
ON CONFLICT (id) DO NOTHING;

-- 3. Tabel Pengaturan Usaha
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    biz_name TEXT DEFAULT 'Gagal Jadi Filsuf',
    biz_contact TEXT DEFAULT 'Fahmi Ayatullah',
    biz_phone TEXT DEFAULT '082213297661',
    biz_email TEXT DEFAULT 'punelcommuniaction@gmail.com',
    biz_address TEXT DEFAULT 'Sampangan, Kedungrejo, Muncar, Banyuwangi.',
    logo_base64 TEXT DEFAULT '',
    qris_base64 TEXT DEFAULT '',
    bank_name TEXT DEFAULT 'Bank BCA',
    bank_acc TEXT DEFAULT '123-456-7890',
    bank_holder TEXT DEFAULT 'Fahmi Ayatullah',
    free_revisions INTEGER DEFAULT 3,
    revision_percent INTEGER DEFAULT 10,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pengaturan Default Awal
INSERT INTO public.settings (id, biz_name, biz_contact, biz_phone, biz_email, biz_address, bank_name, bank_acc, bank_holder, free_revisions, revision_percent)
VALUES ('default', 'Gagal Jadi Filsuf', 'Fahmi Ayatullah', '082213297661', 'punelcommuniaction@gmail.com', 'Sampangan, Kedungrejo, Muncar, Banyuwangi.', 'Bank BCA', '123-456-7890', 'Fahmi Ayatullah', 3, 10)
ON CONFLICT (id) DO NOTHING;

-- 4. Enable Row Level Security (RLS) & Public Policies (untuk akses anon client)
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for catalog" ON public.catalog FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);
