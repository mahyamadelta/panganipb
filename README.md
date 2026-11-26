# IPB Food Equity

**IPB Food Equity** adalah aplikasi web responsif yang dirancang untuk membantu mahasiswa Institut Pertanian Bogor (IPB) di Kampus Dramaga menemukan makanan yang terjangkau, bernutrisi, dan sesuai anggaran harian.

Dokumentasi ini merujuk pada implementasi MVP berdasarkan [IPB Food Equity PRD](file:///c:/Users/tio_a/Downloads/IPB_Food_Equity_PRD_EN.md).

---

## 🌟 Tiga Fitur Utama (P0 MVP)

1. **Food Mapping (Peta Makanan Kampus)**
   - Peta interaktif berbasis OpenStreetMap dan Leaflet yang berpusat di wilayah Kampus IPB Dramaga (`[-6.5588, 106.7256]`).
   - Menampilkan 18+ vendor makanan hasil survei langsung (Warung, Kantin Fakultas, Kedai, Kafe).
   - Pencarian real-time berdasarkan nama vendor, alamat, atau nama menu.
   - Filter berdasarkan kategori vendor dan waktu makan (Sarapan, Makan Siang, Makan Malam).
   - Menampilkan detail menu survei, harga, jam operasional, dan tanggal verifikasi data.

2. **Smart Meal Recommendation (Rekomendasi Menu Harian)**
   - Input budget harian fleksibel (target awal: Rp 20.000 – Rp 30.000).
   - Algoritma rekomendasi deterministik berbasis aturan (*rule-based*), **bukan LLM**.
   - Formula penilaian komprehensif:
     $$\text{Final Score} = (0.40 \times \text{Budget Score}) + (0.40 \times \text{Nutrition Score}) + (0.20 \times \text{Variety Score})$$
   - Menghasilkan 3 kombinasi waktu makan (Sarapan, Makan Siang, Makan Malam) yang **dijamin tidak melebihi budget pengguna**.
   - Ringkasan nutrisi teragregasi (Kalori, Protein, Karbohidrat, Lemak, Serat) hanya untuk menu yang memiliki data gizi resmi.

3. **AI Food Scanner & Kurasi Gizi (Scan Makanan)**
   - Pengguna mengunggah foto makanan khas Indonesia (JPEG, PNG, WebP hingga 4 MB).
   - Endpoint *serverless* aman (`/api/analyze-food`) memanggil model Google Gemini Vision melalui SDK `@google/genai`.
   - **Prinsip Transparansi Gizi:** Model AI hanya bertugas mengenali **nama hidangan** (bukan mengarang nilai kalori/makronutrien).
   - Sistem mencocokkan nama hidangan ke dataset kurasi lokal (`nutrition.json` dan `aliases.json`). Jika cocok, data gizi resmi (TKPI) ditampilkan; jika belum ada, status unavailable ditampilkan secara jujur.

---

## 🏗️ Struktur Arsitektur & Direktori

```
ipb-food-equity/
├── api/
│   └── analyze-food.js             # Vercel Serverless Function (Gemini Vision)
├── public/
│   ├── images/
│   │   ├── foods/
│   │   └── restaurants/
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          # Header & navigasi responsif
│   │   │   ├── Footer.jsx          # Footer & atribusi
│   │   │   └── MainLayout.jsx      # Wrapper tata letak
│   │   ├── food/
│   │   │   ├── FoodCard.jsx        # Kartu ringkasan menu
│   │   │   ├── FoodDetail.jsx      # Modal detail menu & gizi
│   │   │   └── NutritionCard.jsx   # Kartu komposisi nutrisi resmi
│   │   ├── map/
│   │   │   ├── MapView.jsx         # Kontainer React Leaflet & OSM
│   │   │   ├── MapMarker.jsx       # Marker vendor
│   │   │   └── MapFilter.jsx       # Pencarian & filter kategori
│   │   ├── planner/
│   │   │   ├── BudgetInput.jsx     # Form input anggaran rupiah
│   │   │   ├── MealCard.jsx        # Kartu sarapan/siang/malam
│   │   │   └── BudgetSummary.jsx   # Ringkasan biaya & akumulasi gizi
│   │   └── scanner/
│   │       ├── ImageUpload.jsx     # Area drag-and-drop & validasi file
│   │       ├── ImagePreview.jsx    # Pratinjau foto sebelum analisis
│   │       └── AnalysisResult.jsx  # Tampilan hasil identifikasi AI & gizi
│   ├── data/
│   │   ├── restaurants.json        # 18 vendor IPB Dramaga terverifikasi
│   │   ├── foods.json              # 45 menu makanan & harga survei
│   │   ├── nutrition.json          # 35 profil nutrisi acuan (TKPI)
│   │   └── aliases.json            # 35 variasi nama & alias pencocokan AI
│   ├── pages/
│   │   ├── Home.jsx                # Beranda, statistik, & edukasi gizi
│   │   ├── FoodMap.jsx             # Halaman peta makanan kampus
│   │   ├── MealPlanner.jsx         # Halaman rekomendasi budget
│   │   └── FoodScanner.jsx         # Halaman scanner foto makanan
│   ├── services/
│   │   ├── foodService.js          # Layanan query data vendor & menu
│   │   ├── mapService.js           # Utilitas koordinat kampus IPB
│   │   ├── recommendationService.js# Mesin perhitungan kombinasi menu
│   │   └── aiService.js            # Klien frontend pemanggil /api
│   ├── utils/
│   │   ├── nutritionCalculator.js  # Utilitas format gizi & harga
│   │   ├── budgetCalculator.js     # Validasi & kalkulasi anggaran
│   │   └── foodMatcher.js          # Pencocokan nama hidangan fuzzy/alias
│   ├── App.jsx                     # Konfigurasi routing React Router
│   ├── main.jsx                    # Titik masuk aplikasi React
│   └── index.css                   # Konfigurasi Tailwind CSS v4 & Leaflet
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

### Prasyarat
- **Node.js** (v18 ke atas disarankan)
- **npm** atau **pnpm**
- **Google Gemini API Key** (dapatkan di [Google AI Studio](https://aistudio.google.com/))

### 1. Masuk ke Direktori Proyek
```bash
cd C:\Users\tio_a\.gemini\antigravity\scratch\ipb-food-equity
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Salin `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Buka `.env.local` dan masukkan kunci API Gemini Anda:
```env
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-3.8-flash
```

> **Catatan Keamanan:** Kunci `GEMINI_API_KEY` hanya digunakan di sisi server (`api/analyze-food.js`) dan **tidak pernah diekspos ke browser pengguna**.

### 4. Jalankan Aplikasi di Mode Pengembangan
```bash
npm run dev
```
Buka peramban di `http://localhost:5173`.

---

## 🧪 Validasi & Verifikasi Data

- Seluruh vendor menggunakan titik koordinat nyata di sekeliling wilayah **IPB University Dramaga, Bogor**.
- Nilai kalori dan makronutrien merujuk pada porsi referensi acuan **Tabel Komposisi Pangan Indonesia (TKPI)**.
- Data yang belum disurvei direpresentasikan secara eksplisit sebagai `null` atau `"belum tersedia"` daripada mengasumsikan angka nol.

---

## 🌐 Panduan Deployment ke Vercel

1. Buat repositori Git dan unggah kode sumber:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of IPB Food Equity MVP"
   ```
2. Hubungkan repositori ke akun [Vercel](https://vercel.com).
3. Di dashboard Vercel, buka tab **Settings** → **Environment Variables**, lalu tambahkan:
   - `GEMINI_API_KEY` : Kunci API Google AI Studio Anda
   - `GEMINI_MODEL` : `gemini-3.8-flash`
4. Lakukan deployment. Vercel akan secara otomatis membangun frontend Vite dan meluncurkan endpoint *serverless* di `/api/analyze-food`.
