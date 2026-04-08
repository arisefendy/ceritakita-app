# CeritaKita App

## Table of Contents

- [Description](#description)
- [Submission Status](#-submission-status)
- [Submission Checklist](#-submission-checklist)
- [Setup & Development](#️-setup--development)
- [Tech Stack](#️-tech-stack)
- [Author](#-author)

---

## Description

Aplikasi berbagi cerita berbasis web yang memungkinkan pengguna untuk melihat dan menambahkan cerita berdasarkan lokasi.

Project ini merupakan bagian dari submission kelas **[Belajar Pengembangan Web Intermediate](https://www.dicoding.com/academies/219)** di Dicoding yang terdiri dari dua tahap submission project.

Aplikasi ini dikembangkan menggunakan konsep Single Page Application (SPA), terintegrasi dengan **[Dicoding Story API](https://story-api.dicoding.dev/v1)**, menggunakan **Leaflet.js** untuk peta, serta dioptimalkan untuk memenuhi **Standar Aksesibilitas WCAG**.

---

## 🎯 Submission Status

- 📌 Submission 1: **In progress**
- 📌 Submission 2: Not started

---

## 📊 Submission Checklist

> Setiap kriteria memiliki rentang nilai **0 - 4 ⭐** Target minimal: **2 ⭐ per kriteria (LULUS)**

---

### Submission: Proyek Pertama

#### Kriteria 1: SPA & Transisi Halaman

Aplikasi harus mengadopsi arsitektur Single Page Application (SPA) dengan navigasi tanpa reload halaman.

⭐⭐ **Basic**

- [x] Menerapkan konsep SPA dengan hash routing
- [ ] Menerapkan default view transition

⭐⭐⭐ **Skilled**

- [ ] Menerapkan arsitektur MVP ATAU custom view transition

⭐⭐⭐⭐ **Advance**

- [ ] Menerapkan arsitektur MVP DAN custom view transition

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

⭐⭐⭐⭐ **Advance**

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

⭐⭐⭐⭐ **Advance**

- [x] Memiliki opsi memilih gambar yang ditangkap melalui kamera langsung (media stream)
- [x] Menutup media stream ketika sudah tidak digunakan

---

#### Kriteria 4: Aksesibilitas

Aplikasi harus memenuhi standar aksesibilitas untuk memberikan pengalaman pengguna yang baik.

⭐⭐ **Basic**

- [ ] Menerapkan teks alternatif pada setiap gambar
- [ ] Menggunakan HTML elemen yang semantik
- [ ] Memberikan label pada setiap input

⭐⭐⭐ **Skilled**

- [ ] Responsive Design
  - Mobile (375px)
  - Tablet (768px)
  - Desktop (1024px)

⭐⭐⭐⭐ **Advance**

- [ ] Menerapkan fitur Skip to content
- [ ] Seluruh elemen interaktif dapat dioperasikan dengan keyboard

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
