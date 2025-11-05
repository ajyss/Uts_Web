# 🏫 UTS Pemrograman Web 1 — Website Toko Buku Online

Nama: Muhammad Aziz Tri Ramadhan

NIM: 312410380

Kelas: TI.24.A3

Mata Kuliah: Pemrograman Web 1

Dosen Pengampu: Agung Nugroho, S.Kom., M.Kom.

Universitas: Universitas Pelita Bangsa

## 🧩 Deskripsi Proyek

Website ini merupakan implementasi dari **Soal UTS Pemrograman Web 1**, dengan tema utama **Toko Buku Online**. Proyek ini dibuat menggunakan **HTML, CSS, dan JavaScript murni**, tanpa framework tambahan. Tujuan utama dari pembuatan website ini adalah untuk mempraktikkan konsep dasar:

* Struktur halaman web dengan HTML
* Pemisahan tampilan dengan CSS
* Manipulasi data dan DOM menggunakan JavaScript
* Penggunaan `localStorage` sebagai penyimpanan sementara data pengguna dan pesanan

Tampilan website menggunakan warna **biru dan putih** agar terkesan modern, bersih, dan mudah dibaca.

---

## 🧱 Struktur Folder

```
project-root/
├── css/
│   └── styles.css           # File CSS utama untuk semua halaman
├── js/
│   └── app.js               # Script JS global untuk modal dan utilitas umum
├── img/                     # Berisi semua gambar cover buku (hasil extract dari img.zip)
├── data.js                  # Sumber data: pengguna, katalog buku, dan tracking
├── login.html               # Halaman login pengguna
├── dashboard.html           # Halaman utama setelah login
├── stok.html                # Halaman katalog & tambah stok buku
├── checkout.html            # Halaman pemesanan & checkout
├── tracking.html            # Halaman tracking pengiriman
└── README.md                # Dokumentasi proyek ini
```

---

## ⚙️ Fitur Utama Website

### 1️⃣ Login & Registrasi Simulasi

* Pengguna dapat login menggunakan akun yang sudah ada di `data.js`.
* Validasi dilakukan dengan mencocokkan email dan password.
* Setelah login, data pengguna disimpan di `localStorage` agar bisa diakses di halaman lain.
* Fitur **lupa password** dan **daftar akun baru** disimulasikan menggunakan modal popup.

### Capture
#### Login

<img src="img/login.png">

#### Registrasi

<img src="img/daftar.png">

#### Lupa Password

<img src="img/lupa pw.png">

### 2️⃣ Dashboard

* Setelah login, pengguna diarahkan ke **dashboard.html**.
* Menampilkan **greeting otomatis** berdasarkan waktu (pagi, siang, sore, malam).
* Memuat nama pengguna yang sedang login.
* Menyediakan navigasi cepat ke halaman stok, checkout, dan tracking.

### Capture

<img src="img/dashboard.png">


### 3️⃣ Katalog Buku (stok.html)

* Menampilkan tabel berisi daftar buku dari variabel `dataKatalogBuku`.
* Setiap buku menampilkan: kode, cover, nama, jenis, edisi, stok, dan harga.
* Dapat menambahkan buku baru melalui form tanpa reload halaman (menggunakan manipulasi DOM).

### Capture

<img src="img/katalog.png">

### 4️⃣ Pemesanan & Checkout (checkout.html)

* Pengguna dapat memilih buku dari dropdown yang diambil dari `dataKatalogBuku`.
* Jumlah item bisa diatur sebelum dimasukkan ke keranjang.
* Semua item yang ditambahkan ke keranjang ditampilkan dalam tabel dengan opsi hapus.
* Setelah mengisi data pemesan dan metode pembayaran, sistem akan membuat nomor **Delivery Order (DO)** secara otomatis.
* Pesanan disimpan ke `localStorage` untuk simulasi penyimpanan database.

### Capture

<img src="img/pemesanan.png">

### 5️⃣ Tracking & History Pesanan

#### Untuk User:
* Pengguna dapat mencari status pengiriman berdasarkan nomor DO
* Melihat detail lengkap pesanan dan status terkini
* Melihat riwayat update status pesanan
* Akses ke history pemesanan pribadi

#### Untuk Admin:
* Melihat semua pesanan yang masuk
* Mengkonfirmasi pesanan baru dengan tombol "Terima Pesanan"
* Mengupdate status pesanan melalui dropdown:
  - Sedang Diproses
  - Dalam Pengiriman
  - Selesai
* Setiap update status otomatis tercatat dengan timestamp

### Capture

<img src="img/tracking.png">

---

## 🎨 Desain & Tampilan

* Warna dominan **biru (#2b6cb0)** dan **putih**.
* Desain menggunakan konsep **clean minimalis**.
* Layout menggunakan **Flexbox** dan **CSS Grid**.
* Semua tombol, input, dan elemen UI diseragamkan agar konsisten di setiap halaman.

---

## 🧠 Teknologi dan Fitur

### Teknologi
| Teknologi            | Fungsi                                                            |
| -------------------- | ----------------------------------------------------------------- |
| **HTML5**            | Struktur halaman utama                                            |
| **CSS3**             | Desain dan tata letak halaman                                     |
| **JavaScript (ES6)** | Logika interaktif, manipulasi DOM, dan penyimpanan data sementara |
| **LocalStorage**     | Menyimpan sesi pengguna dan riwayat pemesanan                     |
| **SessionStorage**   | Menyimpan data keranjang dan status login                         |

### Sistem Pemesanan & Tracking
* Generasi nomor DO otomatis dengan format tahun + random number
* Status tracking realtime dengan timestamp
* History pesanan dengan detail lengkap
* Validasi stok otomatis saat checkout
* Role-based access (Admin/User)

### Keamanan
* Validasi form input
* Proteksi route berdasarkan login
* Role-based permissions
* Session management
* Data persistence dengan Web Storage API

---

## ▶️ Cara Menjalankan Program

### Untuk User Biasa:
1. Pastikan semua file telah diekstrak dalam satu folder.
2. Buka file **`login.html`** menggunakan browser.
3. Login menggunakan data contoh:
   ```
   Email: rina@gmail.com
   Password: rina123
   ```
4. Dari dashboard, Anda dapat:
   - Melihat katalog buku
   - Melakukan pemesanan
   - Mengecek status pesanan
   - Melihat history pembelian

### Untuk Admin:
1. Login menggunakan akun admin:
   ```
   Email: admin@example.com
   Password: admin123
   ```
2. Akses fitur admin:
   - Manajemen stok buku
   - Konfirmasi pesanan baru
   - Update status pesanan
   - Lihat semua history transaksi

### Alur Pemesanan:
1. User login dan pilih buku
2. Checkout dan isi data pengiriman
3. Sistem generate nomor DO
4. Admin terima pesanan
5. Admin update status pesanan
6. User bisa tracking dengan nomor DO
