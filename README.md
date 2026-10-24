# Dunia Otomotif — paket final statis

Paket ini membangun ulang situs sebagai website statis: tidak membutuhkan Node server, database, sistem admin, atau feed RSS untuk menampilkan halaman. Artikel utama tersedia sebagai HTML individual agar konten tidak bergantung pada rendering JavaScript.

## Menjalankan secara lokal

- Cara sederhana: buka `index.html` di peramban.
- Untuk server lokal dengan Node.js: jalankan `npx --yes serve .` dari folder ini, atau gunakan ekstensi Live Server di editor.
- Pemeriksaan otomatis: `npm test`.
- Membuat sitemap setelah domain publik tersedia (PowerShell): `$env:SITE_URL='https://domain-anda.com'; npm run build:sitemap`. Ganti contoh dengan domain HTTPS Anda yang sebenarnya. Jangan publikasikan sitemap dengan domain contoh.

## Sebelum deploy

1. **Wajib sebelum publikasi:** isi email resmi yang benar-benar dipantau pada `kontak.html`. Email belum diisi karena pemilik belum memberikannya; jangan gunakan alamat rekaan.
2. Periksa setiap artikel dan pastikan kontennya sesuai standar editorial Anda. Artikel dalam paket adalah panduan edukasi orisinal yang dibuat untuk versi awal, bukan laporan berita terkini.
3. Domain yang saat ini disetel di `sitemap.xml` dan `robots.txt` adalah `https://rivodaexhaust.id/`. Pastikan ini benar-benar domain publik yang akan dipakai. Jika berubah, jalankan `$env:SITE_URL='https://domain-anda.com'; npm run build:sitemap` dengan domain HTTPS yang benar.
4. Pastikan hosting melayani file statis, mengaktifkan HTTPS, dan domain mengarah ke folder ini.
5. Jika nanti menambahkan analitik, iklan, formulir, atau layanan pihak ketiga, perbarui kebijakan privasi dan pengaturan terkait berdasarkan implementasi nyata.
6. Pastikan nama penerbit, email kontak, hak penggunaan aset, dan semua klaim telah diverifikasi oleh pengelola.

## Isi

- `index.html`: beranda.
- `berita.html`: arsip dengan filter kategori dan pencarian.
- `artikel/*.html`: artikel statis individual.
- `tentang.html`, `kontak.html`, `privasi.html`, `kebijakan-redaksi.html`, `sumber.html`: halaman pendukung.
- `images/*.svg`: ilustrasi editorial lokal yang dibuat untuk paket ini.
- `scripts/test-site.js`: pemeriksaan otomatis tautan, metadata, bahasa, dan encoding.
- `scripts/generate-sitemap.js`: pembuat sitemap setelah domain dikonfigurasi.

Paket ini tidak menyertakan sistem admin atau backend. Itu disengaja agar situs publik tidak mengekspos API admin tanpa autentikasi. Jangan menganggap lulusnya tes lokal sebagai jaminan persetujuan iklan; ini hanya laporan teknis proyek.


## Audit dan peluncuran

Lihat `LAPORAN-AUDIT-FINAL.txt` untuk status pemeriksaan, batasan, dan hal yang wajib diverifikasi sebelum publikasi. Jalankan tes dengan `npm test`. Untuk mengganti domain sebelum membuat sitemap, gunakan `SITE_URL=https://domain-anda.example` pada lingkungan Node.js dan jalankan `npm run build:sitemap`. Pastikan domain, publisher ID AdSense, dan kanal kontak benar-benar milik pengelola.

Contoh PowerShell untuk membangun sitemap pada domain yang sudah dikonfirmasi:

```powershell
$env:SITE_URL = "https://rivodaexhaust.id"
npm run build:sitemap
npm test
```

Jangan jalankan perintah ini dengan domain tersebut sebelum memastikan domain memang domain produksi yang benar.
