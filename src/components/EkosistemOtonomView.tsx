import React, { useState } from "react";
import { 
  Layers, 
  ShieldCheck, 
  Compass, 
  Briefcase, 
  Users, 
  Scale, 
  BookOpen, 
  Award, 
  ChevronRight, 
  Search, 
  AlertCircle, 
  Heart, 
  Cpu, 
  Radio, 
  Globe, 
  Terminal,
  Database,
  ArrowRight,
  ShieldAlert,
  Fingerprint
} from "lucide-react";
import { motion } from "framer-motion";

export default function EkosistemOtonomView() {
  const [activeLembaga, setActiveLembaga] = useState<string | null>(null);

  // Interactive Simulation and Form States
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [namaPendaftar, setNamaPendaftar] = useState("");
  const [wilayahPendaftar, setWilayahPendaftar] = useState("");
  const [motivasiPendaftar, setMotivasiPendaftar] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success">("idle");

  const simulasiDataMap: Record<string, {
    fullName: string;
    koordinator: string;
    metrics: string[];
    simTitle: string;
    logs: string[];
  }> = {
    auditor: {
      fullName: "Dewan Auditor Kepatuhan Intern LBH DHN",
      koordinator: "H. M. Arifin, S.E., S.H.",
      metrics: ["Total Kasus: 89 Audit", "Audit Kepatuhan: 98.7%", "Status: Bersih & Sumpah"],
      simTitle: "JALANKAN AUDIT KEPATUHAN KEUANGAN & ARSIP",
      logs: [
        "🔍 Menghubungkan ke repositori administrasi pusat...",
        "📂 Menarik salinan berkas perkara pro-bono 2026...",
        "⚖️ Memverifikasi pertanggungjawaban dana bantuan rakyat...",
        "✅ Audit selesai: Seluruh administrasi terverifikasi 100% patuh & bersih!"
      ]
    },
    agen_rahasia: {
      fullName: "Satuan Penyelidik & Analisis Strategis Klandestin",
      koordinator: "Sandi Yudha, S.H. (Klandestin)",
      metrics: ["Total Laporan: 124 Risiko", "Akurasi Info: 99.1%", "Status: Siaga Operasional"],
      simTitle: "SIMULASIKAN PEMETAAN RISIKO SEKTORAL",
      logs: [
        "👁️ Memantau radar aktivitas sengketa agraria daerah...",
        "📊 Mengumpulkan data sekunder & intelijen media...",
        "⚠️ Mendeteksi indikasi penyerobotan lahan sepihak di sektor Banten...",
        "🛡️ Laporan taktis dikunci, dienkripsi & diteruskan ke Komando Utama!"
      ]
    },
    epf: {
      fullName: "Elite Protection Force (Satgas Pengamanan Utama)",
      koordinator: "Letnan Budi (Purnawirawan)",
      metrics: ["Misi Pengawalan: 45 Saksi", "Kondisi Personel: Prima", "Status Keamanan: Siaga I"],
      simTitle: "AKTIFKAN SIMULASI PROTOKOL PENGAWALAN SAKSI",
      logs: [
        "🚨 Menerima permintaan pengamanan darurat saksi kunci korupsi...",
        "🛡️ Menyiapkan 3 personel bersertifikat pengamanan taktis utama...",
        "🚘 Menentukan rute evakuasi teraman bebas cegatan...",
        "🟢 Protokol Aktif: Saksi kunci berhasil diantarkan ke persidangan dengan aman!"
      ]
    },
    khi: {
      fullName: "Klinik Hukum Ibu & Perlindungan Perempuan Anak",
      koordinator: "Dr. Rina Fatmawati, S.H., M.H.",
      metrics: ["Edukasi Publik: 210 Ibu", "Tingkat Selesai: 95%", "Layanan Bantuan: Aktif"],
      simTitle: "MULAI KONSULTASI INTERAKTIF PEREMPUAN & ANAK",
      logs: [
        "🌸 Mengaktifkan portal pendampingan korban kekerasan dalam rumah tangga...",
        "📄 Merumuskan draf gugatan cerai & somasi perlindungan anak...",
        "⚖️ Mengoordinasikan pendampingan psikologis korban bersama psikolog...",
        "💖 Layanan tuntas: Korban aman dalam rumah perlindungan organisasi!"
      ]
    },
    naraka: {
      fullName: "Nalar Rakyat Demi Keadilan (Kajian Kritis Sipil)",
      koordinator: "Prof. Dr. Hendra Wijaya",
      metrics: ["Karya Riset: 18 Naskah", "Kajian Isu: Aktif", "Partisipasi Sipil: Tinggi"],
      simTitle: "JALANKAN KAJIAN AKADEMIS HAK SIPIL",
      logs: [
        "📚 Membedah draf undang-undang pertanahan nasional terbaru...",
        "⚖️ Menemukan pasal-pasal kontroversial yang merugikan petani gurem...",
        "📝 Merumuskan 5 butir rekomendasi amandemen pro-rakyat...",
        "📨 Selesai: Naskah Amandemen siap diserahkan ke DPR RI & Media Massa!"
      ]
    },
    surga: {
      fullName: "Suara Rakyat Garut (Media Aspirasi Hukum Lokal)",
      koordinator: "Kang Asep Garut",
      metrics: ["Total Aduan: 345 Masuk", "Diseminasi Berita: 100%", "Status Media: Siaran Aktif"],
      simTitle: "SIMULASIKAN PENYALURAN ASPIRASI KE MEDIA",
      logs: [
        "📻 Menghubungkan ke saluran pemancar berita Garut...",
        "🗣️ Menerima aduan warga terkait pungutan liar di pasar desa...",
        "📰 Mengemas laporan dalam artikel berita publik berimbang...",
        "📡 Sukses: Berita disebarluaskan ke jurnalis lokal & pihak berwenang!"
      ]
    },
    plw: {
      fullName: "Pioneer Legal Women (Persatuan Advokat Wanita)",
      koordinator: "Adv. Sarah Siregar, S.H.",
      metrics: ["Total Anggota: 78 Advokat", "Program Diklat: Berjalan", "Status Jejaring: Aktif"],
      simTitle: "MULAI SIMULASI DIKLAT ADVOKASI PEREMPUAN",
      logs: [
        "👩‍🎓 Membuka pendaftaran diklat hukum khusus perempuan...",
        "📖 Mengunduh materi hak perdata & ketenagakerjaan wanita...",
        "🗣️ Menyelenggarakan lokakarya pendampingan hukum mandiri...",
        "🎓 Sukses: 50 kader perempuan baru dilantik untuk melayani warga!"
      ]
    },
    lrni: {
      fullName: "Lembaga Riset Nasional Independen LBH DHN",
      koordinator: "Dr. Alamsyah, M.A.",
      metrics: ["Jurnal Terbit: 32 Rilis", "Independensi: 100%", "Status Riset: Aktif"],
      simTitle: "SIMULASIKAN METODE RISET INDEPENDEN KASUS",
      logs: [
        "📑 Mengumpulkan sampel berkas putusan pengadilan sengketa agraria...",
        "🧬 Melakukan analisis sosiologi hukum atas putusan...",
        "📊 Memetakan persentase kemenangan rakyat kecil versus korporasi...",
        "📈 Publikasi: Jurnal Riset Hukum Nasional berhasil dirilis ke publik!"
      ]
    },
    ihs_otonom: {
      fullName: "Intelligent Hukum Sipil (Divisi Analisis Digital)",
      koordinator: "Kapten Iwan (Pusat IHS)",
      metrics: ["Total Kader: 1,420 Anggota", "Enkripsi Saluran: Aktif", "Status Jaringan: Online"],
      simTitle: "JALANKAN AUDIT ALUR DATA DHN ONE SYSTEM",
      logs: [
        "🔐 Memverifikasi kunci enkripsi database pusat...",
        "🔍 Menyaring lalu lintas jaringan dari upaya penyusupan...",
        "🔄 Mensinkronisasikan draf berita media ke portal...",
        "🟢 Alur data aman: Seluruh sistem beroperasi dalam keadaan hijau!"
      ]
    }
  };

  const handleRunSimulation = (id: string) => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimLogs([]);
    const targetLogs = simulasiDataMap[id]?.logs || [];
    let currentIdx = 0;
    
    const interval = setInterval(() => {
      if (currentIdx < targetLogs.length) {
        setSimLogs(prev => [...prev, targetLogs[currentIdx]]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 800);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPendaftar.trim() || !wilayahPendaftar.trim()) return;
    setSubmitStatus("sending");
    setTimeout(() => {
      setSubmitStatus("success");
      setTimeout(() => {
        setSubmitStatus("idle");
        setNamaPendaftar("");
        setWilayahPendaftar("");
        setMotivasiPendaftar("");
      }, 3500);
    }, 1500);
  };

  const prinsipDasar = [
    { title: "Integritas", desc: "Menjaga kejujuran moral tertinggi dalam setiap tindakan." },
    { title: "Profesionalisme", desc: "Melaksanakan tugas secara kompeten, tangkas, dan terukur." },
    { title: "Loyalitas", desc: "Setia kepada garis perjuangan dan kebijakan satu komando organisasi." },
    { title: "Kepatuhan Hukum", desc: "Menjunjung tinggi supremasi hukum dan konstitusi negara." },
    { title: "Akuntabilitas", desc: "Tiap tindakan dapat dipertanggungjawabkan secara transparan." },
    { title: "Kolaborasi", desc: "Membangun sinergi lintas sektoral demi kemanfaatan kolektif." },
    { title: "Pengabdian", desc: "Tulus melayani kebutuhan hukum dan keadilan masyarakat sipil." }
  ];

  const strukturHubungan = [
    { level: "DPP LBH DHN", desc: "Dewan Pimpinan Pusat (Tingkat Nasional / Terpusat)" },
    { level: "DPW", desc: "Dewan Pimpinan Wilayah (Tingkat Provinsi / Daerah)" },
    { level: "DPD", desc: "Dewan Pimpinan Daerah (Tingkat Kabupaten / Kota)" },
    { level: "DPC", desc: "Dewan Pimpinan Cabang (Tingkat Kecamatan)" },
    { level: "PAC", desc: "Pimpinan Anak Cabang (Tingkat Kelurahan / Desa)" }
  ];

  const daftarLembaga = [
    {
      id: "auditor",
      nama: "AUDITOR",
      icon: ShieldCheck,
      moto: "Kepercayaan lahir dari pertanggungjawaban.",
      fungsi: "Menjaga integritas organisasi melalui audit administrasi, audit keuangan, audit kepatuhan, dan evaluasi tata kelola.",
      lingkup: [
        "Audit & Pengawasan Internal",
        "Evaluasi Tata Kelola",
        "Pencegahan Penyimpangan"
      ],
      color: "border-emerald-900 bg-emerald-950/10 text-emerald-400"
    },
    {
      id: "agen_rahasia",
      nama: "AGEN RAHASIA",
      icon: Fingerprint,
      moto: "Membaca sebelum bertindak.",
      fungsi: "Menghimpun informasi strategis, membaca dinamika organisasi dan lingkungan, serta mendukung pengambilan keputusan secara jujur dan etis.",
      lingkup: [
        "Intelijen Organisasi",
        "Analisis Situasi & Risiko",
        "Dukungan Keputusan Strategis"
      ],
      color: "border-slate-800 bg-slate-950/20 text-slate-300"
    },
    {
      id: "epf",
      nama: "ELITE PROTECTION FORCE (EPF)",
      icon: ShieldAlert,
      moto: "Siaga dalam menjaga amanah.",
      fungsi: "Mendukung pengamanan kegiatan organisasi, perlindungan terhadap aset organisasi, serta pengelolaan keamanan internal secara ketat.",
      lingkup: [
        "Pengamanan Personel & Aset",
        "Pengamanan Kegiatan",
        "Manajemen Risiko Keamanan"
      ],
      color: "border-red-900 bg-red-950/10 text-red-400"
    },
    {
      id: "khi",
      nama: "KLINIK HUKUM IBU (KHI)",
      icon: Heart,
      moto: "Melindungi keluarga, menguatkan bangsa.",
      fungsi: "Memberikan edukasi, konsultasi, pendampingan, dan advokasi hukum bagi perempuan, ibu, dan anak, serta lembaga ruang lingkup organisasi.",
      lingkup: [
        "Konsultasi & Edukasi Hukum",
        "Pendampingan & Advokasi",
        "Perlindungan Perempuan & Anak"
      ],
      color: "border-pink-900 bg-pink-950/10 text-pink-400"
    },
    {
      id: "naraka",
      nama: "NARAKA (Nalar Rakyat Demi Keadilan)",
      icon: Scale,
      moto: "Nalar yang jernih, keadilan yang nyata.",
      fungsi: "Menjadi ruang kajian, advokasi, dan perumusan gagasan serta kajian berorientasi pada penegakan hak dan keadilan rakyat.",
      lingkup: [
        "Kajian & Analisis Isu",
        "Advokasi & Perjuangan Keadilan",
        "Gagasan Kritis & Solusi Rakyat"
      ],
      color: "border-blue-900 bg-blue-950/10 text-blue-400"
    },
    {
      id: "surga",
      nama: "SURGA (Suara Rakyat Garut)",
      icon: Radio,
      moto: "Suara rakyat adalah amanah.",
      fungsi: "Menjadi media aspirasi, komunikasi publik, dan menjembatani masyarakat di wilayah Garut untuk hak hukum dan wacana model pengembangan bagi daerah.",
      lingkup: [
        "Aspirasi & Komunikasi Publik",
        "Sosialisasi & Informasi Hukum",
        "Penghubung Masyarakat & Organisasi"
      ],
      color: "border-amber-900 bg-amber-950/10 text-amber-400"
    },
    {
      id: "plw",
      nama: "PIONEER LEGAL WOMEN (PLW)",
      icon: Award,
      moto: "Perempuan berdaya, hukum bermartabat.",
      fungsi: "Mengembangkan kepemimpinan, kapasitas, dan kontribusi perempuan dalam bidang hukum, advokasi, pendidikan, dan pelayanan masyarakat.",
      lingkup: [
        "Pengembangan Kepemimpinan",
        "Pemberdayaan Perempuan",
        "Jejaring & Kolaborasi Perempuan"
      ],
      color: "border-purple-900 bg-purple-950/10 text-purple-400"
    },
    {
      id: "lrni",
      nama: "LEMBAGA RISET NASIONAL INDEPENDEN (LRNI)",
      icon: BookOpen,
      moto: "Riset yang independen, kebijakan yang berkeadilan.",
      fungsi: "Melaksanakan penelitian, kajian strategis, pengembangan wacana, serta memajukan ilmu pengetahuan hukum dan mendukung penguatan organisasi.",
      lingkup: [
        "Penelitian & Kajian Strategis",
        "Naskah Akademik & Analisis Kebijakan",
        "Pengembangan Ilmu Pengetahuan"
      ],
      color: "border-cyan-900 bg-cyan-950/10 text-cyan-400"
    },
    {
      id: "ihs_otonom",
      nama: "INTELLIGENT HUKUM SIPIL (IHS)",
      icon: Cpu,
      moto: "Informasi yang tepat, pengetahuan yang kuat.",
      fungsi: "Mengembangkan analisis hukum mutakhir, pemetaan isu strategis, dan dukungan kualitas advokasi serta pelayanan organisasi.",
      lingkup: [
        "Analisis Hukum Sipil",
        "Pemetaan Isu Strategis",
        "Dukungan Informasi & Advokasi"
      ],
      color: "border-red-900 bg-red-950/10 text-red-500"
    }
  ];

  const mekanismePembentukan = [
    { step: "01", title: "Usulan", desc: "Usulan inisiasi pembentukan dari tingkat pimpinan DPP, DPW, atau DPD." },
    { step: "02", title: "Kajian Kelayakan", desc: "Analisis komprehensif terkait kelayakan, mandat fungsi, serta kebutuhan sektoral." },
    { step: "03", title: "Persetujuan SK", desc: "Tinjauan mendalam dan penandatanganan Surat Keputusan oleh pimpinan tertinggi LBH DHN." },
    { step: "04", title: "Penetapan Resmi", desc: "Penerbitan SK pembentukan resmi serta pencatatan dalam database organisasi." },
    { step: "05", title: "Struktur & Rencana", desc: "Penyusunan jajaran pengurus operasional dan cetak biru rencana kerja strategis." },
    { step: "06", title: "Koordinasi Aktif", desc: "Peluncuran koordinasi berjenjang lintas pimpinan dan implementasi program taktis." },
    { step: "07", title: "Evaluasi Kontinu", desc: "Monitoring berkala demi menjamin kepatuhan organisasi dan perbaikan berkelanjutan." }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16" id="ekosistem-otonom-viewport">
      {/* Top Banner Emblem */}
      <div className="relative overflow-hidden bg-[#0a0a0a] border border-slate-800 rounded-2xl p-6 sm:p-8 text-left">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-950/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-500 tracking-wider uppercase">
              <Layers className="w-4 h-4 animate-pulse" />
              Satu Induk • Beragam Pengabdian
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
              Ekosistem Lembaga Otonom LBH DHN
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Lembaga Bantuan Hukum Delik Hukum Negara (LBH DHN) membangun ekosistem lembaga otonom sebagai perpanjangan tangan perjuangan pada bidang-bidang strategis yang memiliki fokus, kompetensi, dan tata kelola khusus.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end border-l border-slate-800 pl-6 shrink-0 font-mono text-right text-[11px] text-slate-500">
            <p>INTEGRITAS ORGANISASI</p>
            <p className="text-red-500 font-bold">LBH DHN OTONOM</p>
            <p>VERIFIKASI TATA KELOLA</p>
          </div>
        </div>

        {/* Philosophy Callout Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/60 text-slate-300">
          <div className="bg-[#050505] p-4 rounded-xl border border-slate-850 space-y-1.5">
            <div className="text-[10px] font-bold text-slate-500 font-mono">A. FILOSOFI DASAR</div>
            <p className="text-xs leading-relaxed text-slate-300">
              Unit strategis yang memiliki mandat khusus namun tetap berada dalam satu garis perjuangan komando yang selaras.
            </p>
          </div>
          <div className="bg-[#050505] p-4 rounded-xl border border-slate-850 space-y-1.5">
            <div className="text-[10px] font-bold text-slate-500 font-mono">B. ASAS PERSATUAN</div>
            <p className="text-xs leading-relaxed text-slate-300 font-semibold text-white">
              "Perbedaan fungsi tidak boleh melahirkan perpecahan. Keberagaman mandat justru harus memperkuat persatuan tujuan."
            </p>
          </div>
          <div className="bg-[#050505] p-4 rounded-xl border border-red-950/60 bg-red-950/5 space-y-1.5 flex flex-col justify-center">
            <div className="text-[10px] font-bold text-red-500 font-mono">MOTO PERJUANGAN</div>
            <p className="text-sm font-black text-white tracking-widest uppercase">
              SATU PAYUNG. SATU VISI. SATU PERJUANGAN.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 9 Autonomous Bodies */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-md font-bold text-white tracking-wider uppercase font-mono flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-red-600 rounded-full"></span>
              Struktur Sektoral Lembaga Otonom (9 Pilar)
            </h2>
            <p className="text-xs text-slate-400">
              Klik pada kartu lembaga otonom di bawah ini untuk menyoroti rincian ruang lingkup tugasnya.
            </p>
          </div>
          <div className="text-[10px] text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800 uppercase shrink-0">
            Total Ekosistem: 9 Sayap Otonom
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="daftar-lembaga-otonom-grid">
          {daftarLembaga.map((lem, index) => {
            const IconComponent = lem.icon;
            const isSelected = activeLembaga === lem.id;
            return (
              <motion.div
                key={lem.id}
                onClick={() => setActiveLembaga(isSelected ? null : lem.id)}
                className={`p-5 rounded-xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isSelected 
                    ? "border-red-600 bg-red-950/10 shadow-lg shadow-red-950/20 scale-[1.01]" 
                    : "border-slate-800 hover:border-slate-700 bg-[#0a0a0a] hover:bg-[#0c0c0c]"
                }`}
                whileHover={{ y: -2 }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg border ${lem.color} shrink-0`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-slate-500 tracking-widest">
                      PILAR 0{index + 1}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-black text-white tracking-wide uppercase">
                      {lem.nama}
                    </h3>
                    <p className="text-[10px] text-red-500 italic font-mono">
                      “{lem.moto}”
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                    {lem.fungsi}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/40 space-y-2">
                  <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                    RUANG LINGKUP KHUSUS:
                  </div>
                  <ul className="space-y-1">
                    {lem.lingkup.map((item, i) => (
                      <li key={i} className="text-[10px] text-slate-300 flex items-center gap-1.5">
                        <span className="h-1 w-1 bg-red-500 rounded-full shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Interactive Detail Panel for Selected Lembaga */}
      {activeLembaga && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a] border-2 border-red-900/60 rounded-2xl p-6 text-left space-y-6 shadow-xl relative overflow-hidden"
          id="panel-interaktif-lembaga"
        >
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-950/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-slate-850 pb-4 relative z-10">
            <div>
              <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest block">
                INFORMASI & SIMULATOR INTERAKTIF Sayap Otonom
              </span>
              <h3 className="text-md sm:text-lg font-black text-white tracking-wide uppercase font-mono mt-1">
                {simulasiDataMap[activeLembaga]?.fullName || activeLembaga.toUpperCase()}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Penanggung Jawab / Koordinator: <strong className="text-slate-200">{simulasiDataMap[activeLembaga]?.koordinator || "Dewan Pimpinan"}</strong>
              </p>
            </div>
            <button
              onClick={() => {
                setActiveLembaga(null);
                setSimLogs([]);
              }}
              className="text-xs bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white px-2.5 py-1 rounded border border-slate-800 transition cursor-pointer"
            >
              TUTUP PANEL
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
            {/* Column 1: Live Status metrics & Simulator console */}
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
                  METRIKS OPERASIONAL (SIMULASI DATA REAL-TIME)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(simulasiDataMap[activeLembaga]?.metrics || []).map((m, idx) => (
                    <div key={idx} className="bg-[#050505] border border-slate-850 rounded-lg p-2 text-center">
                      <span className="text-[10px] font-black text-white font-mono block">
                        {m.split(":")[0]}
                      </span>
                      <span className="text-[9px] text-red-400 font-mono block mt-0.5">
                        {m.split(":")[1] || "AKTIF"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Console simulator trigger & logs display */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                    KONSOL OPERASI AKTIVITAS
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRunSimulation(activeLembaga)}
                    disabled={isSimulating}
                    className="px-3 py-1 bg-red-950/45 hover:bg-red-900/40 text-red-500 hover:text-red-400 text-[10px] font-mono font-bold rounded border border-red-900/30 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Terminal className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
                    {isSimulating ? "MENJALANKAN..." : "RUN SIMULATOR"}
                  </button>
                </div>

                <div className="bg-[#050505] border border-slate-850 rounded-xl p-4 font-mono text-[10px] space-y-1.5 min-h-[120px] flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="text-slate-500 border-b border-slate-850/60 pb-1 flex justify-between">
                      <span>CONSOLE TERMINAL V1.0</span>
                      <span className="text-red-500 font-bold animate-pulse">● LIVE_FEED</span>
                    </div>
                    {simLogs.length === 0 ? (
                      <div className="text-slate-500 italic py-4 text-center">
                        Silakan klik "RUN SIMULATOR" di atas untuk menjalankan simulasi alur operasional sayap lembaga.
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {simLogs.map((log, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-slate-300 leading-relaxed text-left"
                          >
                            {log}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                  {isSimulating && (
                    <div className="text-red-500 text-[9px] text-right animate-pulse pt-2 border-t border-slate-850/40">
                      PROCESSING ENCRYPTED DATAFEED...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Column 2: Form to Join / Aspirasi */}
            <div className="bg-[#050505] border border-slate-850 rounded-xl p-5 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-red-500 block uppercase">
                  REGISTRASI SINERGI / PENGAJUAN
                </span>
                <span className="text-xs font-black text-white block uppercase">
                  Formulir Kemitraan Jaringan Otonom
                </span>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Daftarkan diri Anda atau ajukan kerja sama kemitraan strategis dengan pilar sayap otonom ini.
                </p>
              </div>

              {submitStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-950/20 border border-green-900/40 text-green-400 rounded-lg space-y-2 text-center"
                >
                  <ShieldCheck className="w-8 h-8 mx-auto text-green-500 animate-bounce" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold">PENGAJUAN BERHASIL DIKIRIM!</p>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      Sistem telah menyelaraskan data pengajuan Anda ke database Pusat LBH DHN. Nomor Registrasi Sementara Anda akan dikirim via pesan aman.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Nama Lengkap:</label>
                      <input
                        type="text"
                        placeholder="Contoh: Heri Darmawan"
                        value={namaPendaftar}
                        onChange={(e) => setNamaPendaftar(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-slate-800 text-[11px] rounded p-1.5 text-slate-200 outline-none focus:border-red-600"
                        required
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Wilayah / Daerah:</label>
                      <input
                        type="text"
                        placeholder="Contoh: Garut Barat"
                        value={wilayahPendaftar}
                        onChange={(e) => setWilayahPendaftar(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-slate-800 text-[11px] rounded p-1.5 text-slate-200 outline-none focus:border-red-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Motivasi & Deskripsi Pengajuan:</label>
                    <textarea
                      rows={2}
                      placeholder="Tuliskan alasan bergabung atau detail program kerja sama yang ditawarkan..."
                      value={motivasiPendaftar}
                      onChange={(e) => setMotivasiPendaftar(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-slate-800 text-[11px] rounded p-1.5 text-slate-200 outline-none focus:border-red-600 font-sans leading-relaxed"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitStatus === "sending"}
                    className="w-full py-2 bg-red-700 hover:bg-red-600 text-white font-mono font-bold text-[10px] rounded tracking-widest transition cursor-pointer flex items-center justify-center gap-1.5 uppercase animate-pulse"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {submitStatus === "sending" ? "MENGIRIM PENGAJUAN..." : "KIRIM PENGAJUAN RESMI"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Principles and Relationships */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Principles */}
        <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 text-left space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase font-mono flex items-center gap-2">
              <Award className="w-4 h-4 text-red-500" />
              Prinsip Dasar Tata Kelola
            </h3>
            <p className="text-[11px] text-slate-500">
              Pondasi etika dan nilai perjuangan seluruh pilar otonom.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {prinsipDasar.map((prinsip, i) => (
              <div key={i} className="p-3 bg-[#050505] border border-slate-850 rounded-lg space-y-1 hover:border-slate-800 transition">
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <span className="text-red-500 font-black font-mono">0{i+1}.</span>
                  {prinsip.title}
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {prinsip.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Position & Tier Flow */}
        <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 text-left flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase font-mono flex items-center gap-2">
              <Users className="w-4 h-4 text-red-500" />
              Kedudukan & Struktur Hubungan
            </h3>
            <p className="text-[11px] text-slate-500">
              Lembaga otonom di bawah naungan LBH DHN bergerak independen namun tetap tunduk pada kebijakan komando organisasi.
            </p>
          </div>

          {/* Interactive tree hierarchy */}
          <div className="space-y-2 py-2">
            {strukturHubungan.map((struk, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-24 text-[10px] font-mono font-black text-slate-400 shrink-0 uppercase tracking-wider text-right">
                  {struk.level}
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-red-600 shrink-0 border border-black shadow"></div>
                  {i < strukturHubungan.length - 1 && (
                    <div className="w-0.5 h-6 bg-slate-800"></div>
                  )}
                </div>
                <div className="flex-1 p-2 bg-[#050505] border border-slate-850 rounded text-[10px] text-slate-300 font-mono">
                  {struk.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#050505] border border-slate-850 rounded-lg p-3 text-[10px] text-slate-400 leading-normal font-mono">
            ⚠️ <strong className="text-slate-200">Catatan Koordinasi:</strong> Koordinasi dilakukan secara berjenjang dan terpusat guna menjamin kesatuan kebutuhan dan perkembangan organisasi nasional.
          </div>
        </div>
      </div>

      {/* Mechanism & Guidelines */}
      <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-6 text-left space-y-6">
        <div className="space-y-1">
          <h3 className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase font-mono flex items-center gap-2">
            <Compass className="w-4 h-4 text-red-500" />
            Alur Mekanisme Pembentukan Lembaga Otonom
          </h3>
          <p className="text-[11px] text-slate-500">
            Prosedur pembentukan sayap lembaga otonom baru secara tertib administrasi & konstitusi organisasi.
          </p>
        </div>

        {/* Step Flow */}
        <div className="relative border-l border-slate-850 ml-3.5 space-y-6">
          {mekanismePembentukan.map((mek, i) => (
            <div key={i} className="relative pl-6">
              <span className="absolute -left-3.5 top-0.5 flex items-center justify-center w-7 h-7 rounded-full bg-red-950 text-red-500 border border-red-900 font-mono text-xs font-black">
                {mek.step}
              </span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                  {mek.title}
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed max-w-2xl">
                  {mek.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Coordination / Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-850/60 text-[11px] text-slate-400">
          <div className="space-y-1 bg-[#050505] p-3 rounded-lg border border-slate-850">
            <span className="font-bold text-slate-200 block uppercase font-mono text-[9px] text-red-500">E. POLA KOORDINASI & SINERGI</span>
            <p className="leading-relaxed">
              Seluruh lembaga otonom bekerja secara sinergis dengan DPP, DPW, DPD, DPC, dan PAC sesuai tingkat kelembagaan masing-masing. Tidak ada lembaga yang mendominasi yang lain. Tidak ada organisasi yang mengabaikan fungsi lembaga.
            </p>
            <span className="block font-bold text-slate-200 mt-2 font-mono text-[9px]">SINERGI ADALAH KEKUATAN UTAMA</span>
          </div>

          <div className="space-y-1 bg-[#050505] p-3 rounded-lg border border-slate-850">
            <span className="font-bold text-slate-200 block uppercase font-mono text-[9px] text-red-500">G. HUBUNGAN KERJA & INTEGRASI</span>
            <p className="leading-relaxed">
              Lembaga otonom bersifat terpadu, tidak terpisah, melainkan saling melengkapi dan menguatkan untuk mencapai tujuan organisasi.
            </p>
            <span className="block font-bold text-slate-200 mt-2 font-mono text-[9px]">SATU PAYUNG, BERBAGAI CARA MENGABDI, SATU TUJUAN: KEADILAN</span>
          </div>
        </div>

        {/* Section H: Penegasan */}
        <div className="p-4 bg-red-950/10 border border-red-900/30 rounded-xl space-y-2">
          <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest font-mono">
            H. PENEGASAN ORGANISASI LBH DHN
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            LBH DHN memandang lembaga otonom sebagai unsur pendukung utama. Lembaga otonom tetap berinduk dan setia pada arah organisasi. Setiap lembaga bergerak dinamis menghadirkan keadilan, memerhatikan masyarakat, dan menjaga kehormatan serta martabat organisasi.
          </p>
        </div>
      </div>

      {/* Official Plaque: Deklarasi Ekosistem */}
      <div className="bg-[#050505] border-2 border-slate-800 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-950/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-red-500 font-bold tracking-widest uppercase">PIAGAM RESMI ORGANISASI</div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">
              DEKLARASI EKOSISTEM LBH DHN
            </h3>
            <div className="h-0.5 w-24 bg-red-700 mx-auto"></div>
          </div>

          <div className="space-y-4 text-xs italic text-slate-300 font-serif leading-relaxed px-4">
            <p>“Kami berbeda dalam tugas, tetapi satu dalam perjuangan.”</p>
            <p>“Kami memiliki mandat yang beragam, tetapi berpijak pada nilai yang sama.”</p>
            <p>“Kami tidak membiarkan keberagaman melahirkan perpecahan, melainkan menyatukan langkah untuk melayani masyarakat yang membutuhkan.”</p>
          </div>

          <div className="pt-4 border-t border-slate-850 max-w-md mx-auto">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-2">Sumpah & Komitmen Anggota</div>
            <div className="text-xs font-bold text-white tracking-widest font-mono flex flex-wrap justify-center gap-x-4 gap-y-1 text-center uppercase">
              <span className="text-red-500">ADIL</span>
              <span className="text-slate-500">•</span>
              <span>BERINTEGRITAS</span>
              <span className="text-slate-500">•</span>
              <span className="text-red-500">BERKARYA</span>
              <span className="text-slate-500">•</span>
              <span>BERMANFAAT UNTUK NEGERI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
