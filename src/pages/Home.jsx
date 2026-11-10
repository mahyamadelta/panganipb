import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  UtensilsCrossed,
  ScanLine,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'Peta Makanan Kampus',
      description:
        'Jelajahi warung, kantin fakultas, dan kedai makan sekitar IPB Dramaga lengkap dengan menu, harga survei, dan titik lokasi akurat.',
      icon: MapPin,
      to: '/peta',
      badge: '18+ Vendor Disurvei',
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Rekomendasi Menu Harian',
      description:
        'Dapatkan kombinasi sarapan, makan siang, dan makan malam terbaik yang seimbang gizinya tanpa melebihi budget harian Anda.',
      icon: UtensilsCrossed,
      to: '/rekomendasi',
      badge: 'Mulai Rp 20rb/hari',
      color: 'amber',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      title: 'AI Scanner & Gizi Kurasi',
      description:
        'Unggah foto makanan untuk mengenali menu dengan AI dan melihat estimasi kalori serta makronutrien dari database nutrisi terpercaya.',
      icon: ScanLine,
      to: '/scan',
      badge: 'Data TKPI Resmi',
      color: 'indigo',
      gradient: 'from-indigo-500 to-purple-600',
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-8 sm:p-12 lg:p-16 shadow-lg">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Inisiatif Mahasiswa IPB Dramaga</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Makan Sehat & Terjangkau di Sekitar IPB Dramaga
          </h1>

          <p className="text-emerald-100 text-base sm:text-lg leading-relaxed">
            Platform transparansi kuliner kampus untuk membantu mahasiswa menemukan makanan bergizi, merencanakan budget makan harian, dan mengecek nilai gizi secara akurat.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/rekomendasi"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50 transition shadow-md hover:shadow-lg"
            >
              <span>Atur Menu Sesuai Budget</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/peta"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/80 text-white border border-emerald-500/40 font-semibold text-sm transition"
            >
              <span>Buka Peta Kampus</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">
            Tiga Fitur Utama untuk Mahasiswa
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Didesain khusus untuk kebutuhan ritme perkuliahan dan kantong mahasiswa IPB.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-linear-to-br ${feat.gradient} text-white flex items-center justify-center shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition">
                    {feat.title}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                <Link
                  to={feat.to}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
                >
                  <span>Buka Fitur</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-3xl sm:text-4xl font-black text-emerald-700 block mb-1">
              18+
            </span>
            <span className="text-xs text-slate-600 font-medium">
              Vendor Kampus Disurvei
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-emerald-700 block mb-1">
              45+
            </span>
            <span className="text-xs text-slate-600 font-medium">
              Pilihan Menu Terdaftar
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-emerald-700 block mb-1">
              35+
            </span>
            <span className="text-xs text-slate-600 font-medium">
              Profil Nutrisi Resmi (TKPI)
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-emerald-700 block mb-1">
              100%
            </span>
            <span className="text-xs text-slate-600 font-medium">
              Bebas Akun / Langsung Pakai
            </span>
          </div>
        </div>
      </section>

      {/* Principles & Nutrition Guidance */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-slate-900">
              Prinsip & Pedoman Gizi Seimbang
            </h3>
            <p className="text-xs text-slate-500">
              Berdasarkan pedoman <em>Isi Piringku</em> dan data komposisi pangan terkurasi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                <TrendingDown className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">Budget Ketat</h4>
              <p className="text-xs text-slate-600 leading-normal">
                Kombinasi menu tidak pernah melebihi budget yang Anda masukkan. Setiap rupiah dihitung transparan.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                <HeartPulse className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">Variasi Nutrisi</h4>
              <p className="text-xs text-slate-600 leading-normal">
                Mendorong asupan protein dan serat yang cukup melalui kombinasi menu yang beragam antar waktu makan.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">Tanpa Gizi Halusinasi</h4>
              <p className="text-xs text-slate-600 leading-normal">
                Nilai kalori dan makronutrien berasal dari basis data kurasi, tidak pernah ditebak atau dikarang oleh AI.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
