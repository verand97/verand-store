# Font: HYWenHei-85W (Hanyi WenHei / "SDK_SC_Web Heavy")

Font ini **proprietary** (milik HoYoverse / Hanyi) dan tidak disertakan dalam
repo. Anda harus menaruh file font sendiri di folder ini.

## Cara pasang
1. Siapkan file font HYWenHei-85W milik Anda. Format yang didukung (urut prioritas):
   - `HYWenHei-85W.woff2`  ← paling disarankan (paling kecil & cepat)
   - `HYWenHei-85W.woff`
   - `HYWenHei-85W.ttf`
   - `HYWenHei-85W.otf`
2. Salin ke folder ini: `frontend/public/fonts/`
3. Refresh browser. Tidak perlu rebuild — font langsung dipakai.

> Nama file harus persis seperti di atas. `@font-face` di `app/globals.css`
> sudah mengarah ke `/fonts/HYWenHei-85W.(woff2|woff|ttf|otf)`.

## Mengubah ke .ttf/.otf saja
Jika Anda hanya punya `.ttf`/`.otf`, tetap berfungsi karena `@font-face`
mencantumkan semua format. Tapi konversi ke `.woff2` direkomendasikan
(mis. via https://transfonter.org) untuk performa.

## Catatan lisensi
Pastikan Anda memiliki hak/lisensi untuk menggunakan font ini. Font HoYoverse
umumnya hanya untuk penggunaan terkait konten game sesuai ketentuan mereka.
Sampai file ditambahkan, situs otomatis memakai font fallback (Syne / Space Grotesk).
