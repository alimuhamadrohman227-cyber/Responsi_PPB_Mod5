# Sambal Catalog

Aplikasi PWA untuk melihat katalog sambal dan mengelola stok produk. Data katalog disimpan di Supabase melalui REST API, sedangkan hasil fetch terakhir dan daftar favorit disimpan di localStorage.

## Identitas Praktikan

- **Nama:** Muhamad Ali Rohman
- **NIM:** 21120124130071
- **Kelompok:** 41
- **Shift:** 06
- **Program Studi:** Teknik Komputer
- **Instansi:** Universitas Diponegoro
- **Mata Kuliah:** Praktikum Pemrograman Perangkat Bergerak (PPB) 2026

## Teknologi

- React dan Vite
- Tailwind CSS
- Progressive Web App dengan `vite-plugin-pwa`
- Axios dan Supabase REST API
- localStorage untuk cache katalog dan favorit

## Fitur

- Melihat katalog, mencari nama sambal, memfilter level pedas, mengurutkan produk, dan melihat detail.
- Menandai serta memfilter sambal favorit.
- Menambah, mengedit, dan menghapus produk melalui Supabase.
- Mengunggah gambar dari perangkat; gambar diperkecil sebelum dikirim.
- Melihat katalog dari cache terakhir saat koneksi ke Supabase tidak tersedia.
- Memasang aplikasi sebagai PWA dan melihat status jaringan.

## Menjalankan Aplikasi

1. Pasang dependensi:

   ```sh
   npm install
   ```

2. Salin `.env.example` ke `.env` di direktori workspace, lalu isi konfigurasi Supabase:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
   ```

   Tabel `sambals` perlu memiliki kolom `id`, `name`, `spiciness`, `price`, `stock`, `description`, dan `image`. Pastikan kebijakan Supabase mengizinkan operasi REST API yang digunakan aplikasi.

3. Jalankan server pengembangan:

   ```sh
   npm run dev
   ```

4. Untuk membuat dan melihat build produksi:

   ```sh
   npm run build
   npm run preview
   ```

Perubahan katalog memerlukan koneksi ke Supabase. Saat koneksi gagal, aplikasi menggunakan cache katalog terakhir yang tersedia di localStorage.
