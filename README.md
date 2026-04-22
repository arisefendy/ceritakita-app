# CeritaKita App

## Table of Contents

- [Description](#description)
- [Fitur Utama](#-fitur-utama)
- [Submission Status](#-submission-status)
- [Submission Pertama](#submission-proyek-pertama)
- [Submission Kedua](#submission-proyek-kedua)
- [Struktur Project](#-struktur-project)
- [Setup & Development](#️-setup--development)
- [Tech Stack](#️-tech-stack)
- [Author](#-author)

---

## Description

Aplikasi berbagi cerita berbasis web yang memungkinkan pengguna untuk melihat dan menambahkan cerita berdasarkan lokasi.

Project ini merupakan bagian dari submission kelas **[Belajar Pengembangan Web Intermediate](https://www.dicoding.com/academies/219)** di Dicoding yang terdiri dari dua tahap submission project.

Aplikasi ini dikembangkan menggunakan konsep Single Page Application (SPA), terintegrasi dengan **[Dicoding Story API](https://story-api.dicoding.dev/v1)**, menggunakan **Leaflet.js** untuk peta, serta dioptimalkan untuk memenuhi **Standar Aksesibilitas WCAG**.

---

## ✨ Fitur Utama

- Menampilkan cerita berdasarkan lokasi pada peta interaktif
- Visualisasi marker menggunakan Leaflet.js
- Menambahkan cerita baru dengan foto dan koordinat
- Navigasi tanpa reload halaman (SPA)
- Mendukung aksesibilitas sesuai standar WCAG
- (Progress) Push Notification
- (Progress) Dukungan PWA & Offline Mode

---

## 🎯 Submission Status

- 📌 Submission 1: ✅
- 📌 Submission 2: **In progress**

---

## 📊 Submission Checklist

> Setiap kriteria memiliki rentang nilai **0 - 4 ⭐** Target minimal: **2 ⭐ per kriteria (LULUS)**

---

### Submission: Proyek Pertama

#### Kriteria 1: SPA & Transisi Halaman

Aplikasi harus mengadopsi arsitektur Single Page Application (SPA) dengan navigasi tanpa reload halaman.

⭐⭐ **Basic**

- [x] Menerapkan konsep SPA dengan hash routing
- [x] Menerapkan default view transition

⭐⭐⭐ **Skilled**

- [x] Menerapkan arsitektur MVP ATAU custom view transition

⭐⭐⭐⭐ **Advanced**

- [x] Menerapkan arsitektur MVP DAN custom view transition

---

#### Kriteria 2: Data & Marker pada Peta

Aplikasi harus menampilkan data dari API dan memvisualisasikannya dalam peta digital.

⭐⭐ **Basic**

- [x] Menampilkan data dari API (minimal gambar dan 3 teks)
- [x] Melakukan visualisasi pada peta dengan marker dan pop-up

⭐⭐⭐ **Skilled**

- [x] Membuat 1 fungsionalitas untuk interaksi dengan peta, seperti:
  - Filter lokasi
  - Highlight marker aktif
  - Sinkronisasi list dan peta

⭐⭐⭐⭐ **Advanced**

- [x] Menerapkan layer control (minimal 2 tile layer)

---

#### Kriteria 3: Tambah Data Baru

Aplikasi harus memiliki fitur untuk menambahkan data baru ke API.

⭐⭐ **Basic**

- [x] Membuat form tambah data + upload file
- [x] Pilih latitude & longitude melalui event klik di peta digital
- [x] Kirim data ke API (asynchronous)

⭐⭐⭐ **Skilled**

- [x] Menambah interaktivitas pada form, seperti:
  - Validasi input, atau
  - Pesan sukses atau error

⭐⭐⭐⭐ **Advanced**

- [x] Memiliki opsi memilih gambar yang ditangkap melalui kamera langsung (media stream)
- [x] Menutup media stream ketika sudah tidak digunakan

---

#### Kriteria 4: Aksesibilitas

Aplikasi harus memenuhi standar aksesibilitas untuk memberikan pengalaman pengguna yang baik.

⭐⭐ **Basic**

- [x] Menerapkan teks alternatif pada setiap gambar
- [x] Menggunakan HTML elemen yang semantik
- [x] Memberikan label pada setiap input

⭐⭐⭐ **Skilled**

- [x] Responsive Design
  - Mobile (375px)
  - Tablet (768px)
  - Desktop (1024px)

⭐⭐⭐⭐ **Advanced**

- [x] Menerapkan fitur Skip to content
- [x] Seluruh elemen interaktif dapat dioperasikan dengan keyboard

---

### Submission: Proyek Kedua

#### Kriteria 1: Mempertahankan Seluruh Kriteria Submission Sebelumnya

Aplikasi tetap mempertahankan seluruh fitur utama dari submission pertama.

⭐⭐⭐⭐ **Lolos**

- [x] Menerapkan SPA dan transisi halaman
- [x] Menampilkan data dan marker pada peta
- [x] Memiliki fitur tambah data baru
- [x] Menerapkan aksesibilitas sesuai standar

---

#### Kriteria 2: Push Notification

Aplikasi harus mampu menampilkan notifikasi dari server menggunakan service worker.

⭐⭐ **Basic**

- [x] Menampilkan push notification dari server
- [x] Notifikasi dipicu saat menambahkan data story baru

⭐⭐⭐ **Skilled**

- [x] Konten notifikasi dinamis (judul, pesan, icon)
- [x] Menggunakan payload dari event pada service worker

⭐⭐⭐⭐ **Advanced**

- [x] Tersedia toggle enable/disable push notification
- [ ] Notifikasi memiliki action (klik → navigasi ke detail data)

---

#### Kriteria 3: Progressive Web App (PWA)

Aplikasi harus mendukung instalasi ke home screen dan tetap dapat diakses secara offline.

⭐⭐ **Basic**

- [x] Aplikasi dapat di-install (Add to Home Screen)
- [x] Aplikasi dapat diakses offline, walau hanya Application Shell

⭐⭐⭐ **Skilled**

- [x] Menambahkan screenshot pada Web App Manifest
- [x] Menambahkan shortcuts pada Web App Manifest
- [x] Tidak ada warning pada manifest (Chrome DevTools "Application -> Manifest")

⭐⭐⭐⭐ **Advanced**

- [ ] Data dinamis (API) tetap tersedia saat offline (caching strategy)
- [ ] Menggunakan strategi caching yang sesuai (Workbox/runtime caching)

---

#### Kriteria 4: IndexedDB

Aplikasi memiliki fitur (create, read, delete) yang menggunakan IndexedDB.

⭐⭐ **Basic**

- [x] Menyimpan data ke IndexedDB
- [x] Menampilkan data dari IndexedDB
- [x] Menghapus data dari IndexedDB

⭐⭐⭐ **Skilled**

- [x] Menambahkan fitur interaktif (Searching, Filtering, Sorting, dsb.)

⭐⭐⭐⭐ **Advanced**

- [x] Mendukung offline-first (buat data saat offline)
- [x] Sinkronisasi data ke server saat kembali online

---

#### Kriteria 5: Deploy Aplikasi

Aplikasi harus dapat diakses secara publik.

⭐⭐⭐⭐ **Wajib**

- [ ] Deploy ke salah satu platform:
  - GitHub Pages
  - Firebase Hosting
  - Netlify
- [ ] Menyertakan URL deployment pada file `STUDENT.txt`

---

## 📁 Struktur Project

```bash
citycareapp
├── package.json            # Informasi dependensi proyek
├── package-lock.json       # File lock untuk dependensi
├── README.md               # Dokumentasi proyek
├── webpack.common.js       # Konfigurasi Webpack (umum)
├── webpack.dev.js          # Konfigurasi Webpack (development)
├── webpack.prod.js         # Konfigurasi Webpack (production)
└── src/                    # Direktori utama source code aplikasi
    ├── index.html          # Berkas HTML utama
    ├── public/             # Direktori aset publik
    │   ├── favicon.png     # Ikon aplikasi
    │   └── images/         # Gambar yang digunakan dalam proyek
    │       ├── logo.png
    │       ├── notes-background.jpg
    │       ├── placeholder-image.jpg
    │       └── errors/     # Gambar fallback saat terjadi error loading
    ├── scripts             # Direktori untuk kode JavaScript
    │   ├── data/           # Folder untuk API atau sumber data
    │   ├── pages/          # Halaman/view utama (render UI)
    │   ├── routes/         # Pengaturan routing
    │   ├── utils/          # Helper dan utilitas
    │   ├── templates.js    # Template HTML dinamis
    │   ├── config.js       # Konfigurasi proyek
    │   └── index.js        # Entry point aplikasi
    └── styles/             # File CSS
        ├── responsive.css  # Styling untuk responsivitas
        └── styles.css      # Styling utama/global aplikasi
```

---

## ⚙️ Setup & Development

### Prerequisites

- Node.js (v12+)
- npm

### Installation

```bash id="b5h9pm"
npm install
```

### Menjalankan Project

- Development Server

```bash id="ux0d06"
npm run start-dev
```

- Build Production

```bash id="nf9oqw"
npm run build
```

- Preview Production

```bash id="3j4sru"
npm run serve
```

---

## 🛠️ Tech Stack

- HTML, CSS, JavaScript (ES6+)
- Webpack & Babel
- SPA Router (Hash based)
- Model-View-Presenter (MVP) Architecture
- Leaflet.js
- View Transition API
- Web Content Accessibility Guidelines (WCAG)

---

## 👤 Author

Muhammad Aris Efendi

---

## ⭐ Progress

> Progress akan diperbarui setiap selesai implementasi fitur.
