# Kokoro — Japanese-inspired account website

Website starter ringan dan responsif dengan halaman beranda, login, registrasi, serta panel akun.

## Isi
- `index.html` — struktur halaman dan dialog autentikasi.
- `styles.css` — desain responsif, tanpa framework CSS.
- `app.js` — alur login/register menggunakan Supabase Auth.

## Mengaktifkan akun sungguhan
1. Buat project Supabase dan aktifkan Email provider pada Authentication.
2. Atur URL dan anon/public key project di bagian atas `app.js`.
3. Atur URL situs pada Authentication → URL Configuration di dashboard Supabase.
4. Uji registrasi, verifikasi email, login, dan logout.

Jangan pernah menaruh Supabase service-role key atau secret key di frontend. Hanya gunakan anon/publishable key. Untuk data profil tambahan, buat tabel dengan Row Level Security (RLS) dan kebijakan agar pengguna hanya dapat membaca/mengubah datanya sendiri.

## Menjalankan
Bisa di-host sebagai situs statis, misalnya GitHub Pages. Untuk pengujian lokal, gunakan local static server; beberapa browser membatasi module JavaScript saat membuka file langsung dengan `file://`.

Autentikasi sungguhan belum aktif sampai URL dan public key Supabase milik project diisi. Tanpa konfigurasi itu, formulir menampilkan petunjuk setup dan tidak menyimpan password secara lokal.