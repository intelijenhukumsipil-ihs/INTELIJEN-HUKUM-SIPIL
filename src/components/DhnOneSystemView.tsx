import React, { useState } from "react";
import { 
  Cpu, 
  Database, 
  ShieldCheck, 
  Fingerprint, 
  Layout, 
  RefreshCw, 
  Activity, 
  Terminal, 
  Lock, 
  Globe, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  FileText, 
  Layers, 
  Server,
  Key,
  Eye,
  UserCheck
} from "lucide-react";
import { motion } from "framer-motion";

export default function DhnOneSystemView() {
  const [activePillar, setActivePillar] = useState<number | null>(null);
  const [activeTabPDN, setActiveTabPDN] = useState<"pdn" | "pelayanan">("pdn");
  const [selectedFlowStep, setSelectedFlowStep] = useState<number>(0);

  // Pillar Interactive Simulation States
  const [isSimulatingPillar, setIsSimulatingPillar] = useState(false);
  const [pillarLogs, setPillarLogs] = useState<string[]>([]);
  
  // Custom interactive state for KTA digital card generation
  const [ktaNama, setKtaNama] = useState("");
  const [ktaNik, setKtaNik] = useState("");
  const [ktaRole, setKtaRole] = useState("Anggota / Pembela Hukum");
  const [ktaGenerated, setKtaGenerated] = useState(false);
  const [isGeneratingKta, setIsGeneratingKta] = useState(false);

  const pillarSimulations: Record<number, {
    fullName: string;
    status: string;
    metrics: string[];
    actionName: string;
    logs: string[];
  }> = {
    1: {
      fullName: "Integrasi Satu Data Nasional LBH DHN",
      status: "TERVERIFIKASI",
      metrics: ["25 DPW Terkoneksi", "98.9% Format Konsisten", "Sync Otomatis: Aktif"],
      actionName: "LAKUKAN REKONSILIASI DATA REGIONAL",
      logs: [
        "🔄 Memulai rekonsiliasi data pengurus wilayah Sumatra Barat...",
        "📡 Mendownload 45 data anggota terdaftar baru...",
        "🛡️ Enkripsi baris data menggunakan kunci SHA-256...",
        "🟢 Sinkronisasi sukses: 45 data baru masuk ke Pusat Data Nasional!"
      ]
    },
    2: {
      fullName: "Sistem Manajemen Identitas Digital Anggota (SMID)",
      status: "TERENKRIPSI",
      metrics: ["1,420 KTA Terbit", "Keunikan ID: 100%", "Dual-Factor Auth"],
      actionName: "TERBITKAN KARTU ANGGOTA DIGITAL",
      logs: [
        "🆔 Menyiapkan template Kartu Tanda Anggota (KTA) Digital...",
        "👤 Menghubungkan ke biodata pendaftar terverifikasi...",
        "🔐 Menyematkan Kode QR Kriptografis Unik...",
        "🎴 Sukses: KTA Digital dengan QR Code terbit untuk Kader LBH!"
      ]
    },
    3: {
      fullName: "Portal Layanan Administrasi Terpadu",
      status: "ONLINE",
      metrics: ["9 Layanan Aktif", "Rata-rata Proses: 5 Menit", "Port: 3000 Ingress"],
      actionName: "PING & CHECK PORTAL INGRESS ROUTING",
      logs: [
        "🌐 Memulai pengujian Ingress Gateway Portal...",
        "⚡ Mengirim paket handshake HTTP ke api.ihsid.org...",
        "🔒 Memverifikasi kelaikan enkripsi SSL/TLS 1.3...",
        "🟢 Sukses: Portal Ingress merespon dalam 12ms. Status: AMAN!"
      ]
    },
    4: {
      fullName: "Pusat Perlindungan Data & Kriptografi Organisasi",
      status: "SANGAT AMAN",
      metrics: ["AES-256 Enkripsi", "0 Kebocoran Data", "Deteksi Intrusi: On"],
      actionName: "MULAI DETEKSI PENYUSUPAN FIREWALL",
      logs: [
        "🛡️ Mengaktifkan firewall deteksi ancaman real-time...",
        "🔍 Memindai 100 port akses database pusat...",
        "✅ Hasil pemindaian: 0 celah ditemukan, seluruh enkripsi utuh...",
        "🔒 Sukses: Status jaringan dikunci dalam mode Aman Maksimal!"
      ]
    },
    5: {
      fullName: "Transparansi Anggaran & Laporan Kinerja Publik",
      status: "TERBUKA",
      metrics: ["100% Laporan Diunggah", "Audit Eksternal: WTP", "Aksesibilitas: Publik"],
      actionName: "GENERATE LAPORAN AKUNTABILITAS OTOMATIS",
      logs: [
        "📄 Mengompilasi ringkasan kegiatan pro-bono se-Indonesia...",
        "📊 Menghitung efisiensi anggaran bantuan hukum rakyat miskin...",
        "📈 Menyusun infografis statistik penanganan sengketa...",
        "📜 Sukses: Laporan Akuntabilitas triwulan diterbitkan ke beranda!"
      ]
    },
    6: {
      fullName: "Akselerasi Bantuan Hukum & Respon Darurat",
      status: "RESPONSIF",
      metrics: ["Respons: < 10 Menit", "94.5% Tingkat Kepuasan", "Hotline: Terintegrasi"],
      actionName: "SIMULASIKAN NOTIFIKASI ADUAN DARURAT",
      logs: [
        "🚨 Mendeteksi aduan penyerobotan lahan dari petani Garut...",
        "📡 Mengirimkan alarm ke Satgas LBH terdekat di lapangan...",
        "📱 Mengirim pesan aman ke Advokat Pendamping wilayah...",
        "🟢 Sukses: Tim hukum diberangkatkan ke lokasi dalam 7 menit!"
      ]
    },
    7: {
      fullName: "Sistem Informasi Berkelanjutan & Pembaruan Kode",
      status: "MUTAKHIR",
      metrics: ["Pembaruan: Bulanan", "Kompatibilitas: 100%", "Arsitektur: Modular"],
      actionName: "MULAI INTEGRASI TERHADAP CORE DHN SYSTEM",
      logs: [
        "🧬 Membuka repositori git core-system-lbh...",
        "⚙️ Menjalankan pengujian kompatibilitas modul rilis...",
        "📦 Membaca pustaka integrasi pihak ketiga...",
        "🚀 Sukses: Kode baru terintegrasi tanpa crash. Build: BERHASIL!"
      ]
    }
  };

  const handleRunPillarSimulation = (id: number) => {
    if (isSimulatingPillar) return;
    setIsSimulatingPillar(true);
    setPillarLogs([]);
    const targetLogs = pillarSimulations[id]?.logs || [];
    let currentIdx = 0;
    
    const interval = setInterval(() => {
      if (currentIdx < targetLogs.length) {
        setPillarLogs(prev => [...prev, targetLogs[currentIdx]]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsSimulatingPillar(false);
      }
    }, 800);
  };

  const handleGenerateKta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ktaNama.trim() || !ktaNik.trim()) return;
    setIsGeneratingKta(true);
    setTimeout(() => {
      setIsGeneratingKta(false);
      setKtaGenerated(true);
    }, 1500);
  };

  const pillars = [
    {
      id: 1,
      title: "SATU DATA NASIONAL",
      desc: "Seluruh data organisasi dikelola secara standar dan konsisten serta mudah diverifikasi.",
      icon: Database,
      color: "text-red-500 border-red-950 bg-red-950/10"
    },
    {
      id: 2,
      title: "SATU IDENTITAS DIGITAL",
      desc: "Setiap anggota memiliki identitas organisasi yang terintegrasi sesuai tingkatannya tanpa ada perbedaan data.",
      icon: Fingerprint,
      color: "text-cyan-400 border-cyan-950 bg-cyan-950/10"
    },
    {
      id: 3,
      title: "SATU PORTAL ORGANISASI",
      desc: "Seluruh layanan organisasi melalui sistem terpadu agar proses lebih cepat dan efisien.",
      icon: Layout,
      color: "text-purple-400 border-purple-950 bg-purple-950/10"
    },
    {
      id: 4,
      title: "KEAMANAN INFORMASI",
      desc: "Data organisasi dikelola dengan metode teraman dan terbaik, pencegahan hak akses ilegal, dan pengawalan data penting.",
      icon: Lock,
      color: "text-emerald-400 border-emerald-950 bg-emerald-950/10"
    },
    {
      id: 5,
      title: "TRANSPARANSI & AKUNTABILITAS",
      desc: "Program, laporan, dan aktivitas organisasi dibuka dalam mekanisme yang memenuhi persyaratan aturan ketentuan.",
      icon: Eye,
      color: "text-amber-400 border-amber-950 bg-amber-950/10"
    },
    {
      id: 6,
      title: "PELAYANAN CEPAT",
      desc: "Pemanfaatan teknologi mutakhir untuk mempercepat pelayanan internal pengurus dan pelayanan advokasi kepada masyarakat.",
      icon: Cpu,
      color: "text-blue-400 border-blue-950 bg-blue-950/10"
    },
    {
      id: 7,
      title: "PENGEMBANGAN BERKELANJUTAN",
      desc: "Sistem informasi terus diperbarui dan disempurnakan mengikuti perkembangan teknologi serta kebutuhan organisasi di daerah.",
      icon: RefreshCw,
      color: "text-pink-400 border-pink-950 bg-pink-950/10"
    }
  ];

  const pdnScopes = [
    { title: "Data Anggota", desc: "Arsip lengkap seluruh advokat, paralegal, & pembela hukum LBH DHN.", icon: UserCheck },
    { title: "Data Kepengurusan", desc: "Struktur kepengurusan berjenjang dari DPP, DPW, DPD, DPC, hingga PAC.", icon: Layers },
    { title: "Data Program Kerja", desc: "Dashboard monitoring program kerja, advokasi rakyat, & sosialisasi hukum.", icon: FileText },
    { title: "Data Pendidikan & Sertifikasi", desc: "Sistem pelacakan diklat, ujian profesi, & sertifikasi kompetensi hukum.", icon: ShieldCheck },
    { title: "Data Administrasi Organisasi", desc: "Sistem persuratan, inventarisasi aset, & ketertiban tata persuratan.", icon: Database },
    { title: "Arsip Digital & Dokumentasi", desc: "Penyimpanan digital berkas perkara, bukti otentik, & video dokumentasi kegiatan.", icon: Server }
  ];

  const digitalisasiLayanan = [
    { title: "Administrasi Elektronik", text: "Mengotomatiskan alur surat-menyurat masuk & keluar secara digital." },
    { title: "Pendaftaran Anggota Baru", text: "Pendaftaran calon anggota, verifikasi berkas online, & pencetakan KTA digital." },
    { title: "Pelaporan Kegiatan Lapangan", text: "Pemberian laporan real-time oleh kader LBH dari berbagai daerah langsung ke Pusat." },
    { title: "Komunikasi Antarjenjang", text: "Mengamankan alur komunikasi terenkripsi antar pengurus daerah dengan pusat." },
    { title: "Pengelolaan Agenda Nasional", text: "Kalender terintegrasi untuk aksi advokasi massal, diklat nasional, & musyawarah." },
    { title: "Penyimpanan Dokumen Tertib", text: "Ruang penyimpanan terpusat terproteksi sandi ganda untuk dokumen sensitif hukum." }
  ];

  const structuralBenefits = [
    { id: "benefit-1", label: "Aksesibilitas Informasi", value: "Informasi lebih mudah & cepat didapatkan pengurus daerah." },
    { id: "benefit-2", label: "Kecepatan Mobilisasi", value: "Koordinasi aksi darurat & komando dapat diturunkan dalam hitungan detik." },
    { id: "benefit-3", label: "Keseragaman Administrasi", value: "Pelaporan kegiatan seragam tanpa duplikasi format." },
    { id: "benefit-4", label: "Akurasi Evaluasi", value: "Monitoring kinerja pengurus daerah terpantau presisi dari pusat." },
    { id: "benefit-5", label: "Kebijakan Berbasis Data", value: "Pembuatan kebijakan taktis melalui penghitungan data kebutuhan riil tiap wilayah." }
  ];

  const flowSteps = [
    {
      step: "01",
      name: "INPUT DATA",
      detail: "Pengumpulan dan input data awal langsung di tingkat lapangan oleh pengurus PAC/DPC.",
      action: "Unggah dokumen pendukung dan isian form standardisasi nasional."
    },
    {
      step: "02",
      name: "VERIFIKASI",
      detail: "Pemeriksaan validitas dan kelayakan data sesuai standardisasi baku organisasi.",
      action: "Pengecekan keabsahan dokumen oleh verifikator tingkat DPD/DPW."
    },
    {
      step: "03",
      name: "PENGELOLAAN",
      detail: "Data yang lolos verifikasi dienkripsi dan diintegrasikan ke server terpusat Pusat Data Nasional.",
      action: "Penyimpanan terproteksi ganda menggunakan enkripsi database modern."
    },
    {
      step: "04",
      name: "DISTRIBUSI",
      detail: "Informasi dibagikan secara aman kepada pengguna/pengurus yang memeliki hak akses.",
      action: "Akses dinamis berdasarkan tingkat kewenangan (DPP/DPW/DPD)."
    },
    {
      step: "05",
      name: "MONITORING",
      detail: "Pemantauan berkala pergerakan data, statistik program kerja, dan aktivitas real-time.",
      action: "Tampilan dashboard interaktif dengan audit trails yang tidak bisa direkayasa."
    },
    {
      step: "06",
      name: "EVALUASI",
      detail: "Evaluasi data berkala demi perbaikan performa internal & optimalisasi pelayanan hukum.",
      action: "Penyusunan laporan bulanan otomatis untuk pimpinan pusat."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16" id="dhn-one-system-viewport">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden bg-[#0a0a0a] border border-slate-800 rounded-2xl p-6 sm:p-8 text-left">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-950/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-500 tracking-wider uppercase">
              <Cpu className="w-4 h-4 text-red-500 animate-spin-slow" />
              SISTEM INFORMASI NASIONAL LBH DHN
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
              📑 BAB XVII • DHN ONE SYSTEM
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Membangun Sistem Informasi Nasional agar seluruh jajaran pengurus, dari Dewan Pimpinan Pusat (DPP) hingga kecamatan, bergerak dalam satu irama, satu data, dan satu standar modern yang akuntabel.
            </p>
          </div>
          <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-3 shrink-0 font-mono text-left w-64 space-y-1">
            <div className="text-[9px] font-bold text-slate-500">SYSTEM TELEMETRY</div>
            <div className="text-[11px] text-white flex justify-between font-bold">
              <span>DB CLOUD:</span>
              <span className="text-green-500 font-black">CONNECTED</span>
            </div>
            <div className="text-[11px] text-white flex justify-between font-bold">
              <span>ENCRYPTION:</span>
              <span className="text-slate-300">AES-256</span>
            </div>
            <div className="text-[11px] text-white flex justify-between font-bold">
              <span>PORTAL ACCESS:</span>
              <span className="text-red-500">LEVEL 1 SECURE</span>
            </div>
          </div>
        </div>

        {/* Quote Callout */}
        <div className="mt-6 p-4 bg-[#050505] border border-slate-850 rounded-xl flex items-center gap-3.5 text-left">
          <div className="p-2.5 bg-red-950/20 border border-red-900/40 rounded-lg shrink-0">
            <Terminal className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-xs italic text-slate-300 leading-normal font-sans">
            “Organisasi modern tidak diukur dari banyaknya kantor, tetapi dari kemampuan menghubungkan seluruh pengurus dalam satu sistem yang cepat, akurat, dan dapat dipertanggungjawabkan.”
          </p>
        </div>
      </div>

      {/* Philosophy Callout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        <div className="bg-[#0a0a0a] border border-slate-800 p-5 rounded-xl space-y-2">
          <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest block">B. FILOSOFI DIGITALISASI</span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Digitalisasi bukan untuk menggantikan peran perjuangan manusia, melainkan untuk memperkuat kinerja pengurus, mempercepat jalur koordinasi komando, menjaga transparansi administrasi, serta mengurangi resiko kesalahan arsip hukum.
          </p>
        </div>
        <div className="bg-[#0a0a0a] border border-slate-800 p-5 rounded-xl flex flex-col justify-center bg-red-950/5">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">PRINSIP TEKNOLOGI MASLAHAT</span>
          <p className="text-sm font-black text-white leading-snug tracking-wide uppercase mt-1">
            "Teknologi yang baik bukan yang paling canggih, melainkan yang memberikan kemaslahatan dan manfaat nyata bagi keadilan masyarakat."
          </p>
        </div>
      </div>

      {/* 7 Pillars of National Information System */}
      <div className="space-y-4 text-left">
        <div className="space-y-1">
          <h2 className="text-xs sm:text-sm font-black text-white tracking-widest uppercase font-mono flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-red-600 rounded-full animate-pulse"></span>
            C. Tujuh Pilar Utama DHN ONE SYSTEM
          </h2>
          <p className="text-[11px] text-slate-400">
            Klik pada masing-masing pilar di bawah ini untuk menyoroti makna strategis sistem informasi nasional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4" id="tujuh-pilar-dhn-system">
          {pillars.map((pil, idx) => {
            const Icon = pil.icon;
            const isSelected = activePillar === pil.id;
            return (
              <div
                key={pil.id}
                onClick={() => setActivePillar(isSelected ? null : pil.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between min-h-[140px] ${
                  isSelected 
                    ? "border-red-500 bg-red-950/10 shadow shadow-red-950/30 scale-[1.01]" 
                    : "border-slate-850 hover:border-slate-800 bg-[#0a0a0a] hover:bg-[#0c0c0c]"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500">PILAR 0{idx+1}</span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="text-xs font-black text-white tracking-wider uppercase font-mono">
                    {pil.title}
                  </h3>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal mt-2">
                  {pil.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Detail Panel for Selected Pilar */}
      {activePillar && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a] border-2 border-red-900/60 rounded-2xl p-6 text-left space-y-6 shadow-xl relative overflow-hidden"
          id="panel-interaktif-pilar"
        >
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-950/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-slate-850 pb-4 relative z-10">
            <div>
              <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest block">
                INTEGRASI PILAR TEKNOLOGI NASIONAL
              </span>
              <h3 className="text-md sm:text-lg font-black text-white tracking-wide uppercase font-mono mt-1">
                {pillarSimulations[activePillar]?.fullName || "Pilar Utama DHN One System"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Status Sistem: <span className="text-green-500 font-bold font-mono">● {pillarSimulations[activePillar]?.status || "AKTIF"}</span>
              </p>
            </div>
            <button
              onClick={() => {
                setActivePillar(null);
                setPillarLogs([]);
                setKtaGenerated(false);
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
                  METRIKS SISTEM (SIMULASI ALUR DATA)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(pillarSimulations[activePillar]?.metrics || []).map((m, idx) => (
                    <div key={idx} className="bg-[#050505] border border-slate-850 rounded-lg p-2.5 text-center">
                      <span className="text-[10px] font-black text-white font-mono block">
                        {m.split(":")[0]}
                      </span>
                      <span className="text-[9px] text-red-400 font-mono block mt-0.5">
                        {m.split(":")[1] || "ONLINE"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Console simulator trigger & logs display */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                    CONSOLE INTEGRASI NASIONAL
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRunPillarSimulation(activePillar)}
                    disabled={isSimulatingPillar}
                    className="px-3 py-1 bg-red-950/45 hover:bg-red-900/40 text-red-500 hover:text-red-400 text-[10px] font-mono font-bold rounded border border-red-900/30 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Terminal className={`w-3.5 h-3.5 ${isSimulatingPillar ? "animate-spin" : ""}`} />
                    {isSimulatingPillar ? "SINKRONISASI..." : pillarSimulations[activePillar]?.actionName}
                  </button>
                </div>

                <div className="bg-[#050505] border border-slate-850 rounded-xl p-4 font-mono text-[10px] space-y-1.5 min-h-[120px] flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="text-slate-500 border-b border-slate-850/60 pb-1 flex justify-between">
                      <span>DHN_ONE_SYSTEM TERMINAL v2.0</span>
                      <span className="text-red-500 font-bold animate-pulse">● BROADCAST_ACTIVE</span>
                    </div>
                    {pillarLogs.length === 0 ? (
                      <div className="text-slate-500 italic py-4 text-center">
                        Silakan klik tombol aksi di atas untuk mensimulasikan integrasi database pilar.
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {pillarLogs.map((log, i) => (
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
                  {isSimulatingPillar && (
                    <div className="text-red-500 text-[9px] text-right animate-pulse pt-2 border-t border-slate-850/40">
                      SYNCING WITH PUSAT DATA NASIONAL...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Column 2: Specific Interactive Tool or KTA Generator */}
            <div className="bg-[#050505] border border-slate-850 rounded-xl p-5 flex flex-col justify-between min-h-[250px]">
              {activePillar === 2 ? (
                /* SATU IDENTITAS DIGITAL - KTA GENERATOR */
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-red-500 block uppercase">
                      FITUR UTAMA PILAR 2
                    </span>
                    <span className="text-xs font-black text-white block uppercase">
                      Pembuat KTA Digital LBH DHN Mandiri
                    </span>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Simulasikan pilar Identitas Digital dengan mencetak kartu digital resmi Anda sekarang.
                    </p>
                  </div>

                  {ktaGenerated ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r from-slate-950 to-slate-900 border-2 border-red-900 p-4 rounded-xl relative overflow-hidden shadow-2xl"
                    >
                      {/* Watermark Logo */}
                      <div className="absolute -right-6 -bottom-6 text-[100px] font-black text-white/5 font-mono pointer-events-none select-none">
                        DHN
                      </div>
                      
                      <div className="flex justify-between items-start border-b border-red-900/40 pb-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-red-700 rounded flex items-center justify-center text-[10px] font-black text-white">
                            IHS
                          </div>
                          <div>
                            <p className="text-[8px] font-black text-white leading-none uppercase">KTA DIGITAL RESMI</p>
                            <p className="text-[6px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">LBH DELIK HUKUM NEGARA</p>
                          </div>
                        </div>
                        <span className="text-[6px] font-mono text-green-500 bg-green-950 px-1 border border-green-900 rounded">
                          ACTIVE SECURE
                        </span>
                      </div>

                      <div className="flex gap-3">
                        {/* Profile placeholder */}
                        <div className="w-16 h-20 bg-slate-900 border border-slate-800 rounded flex flex-col items-center justify-center text-slate-600 shrink-0 relative overflow-hidden">
                          <span className="text-[8px] font-bold text-slate-500 font-mono">FOTO KADER</span>
                          <span className="text-[18px] mt-1">👤</span>
                        </div>

                        {/* Card metadata */}
                        <div className="flex-1 space-y-1.5 text-left text-xs">
                          <div>
                            <p className="text-[7px] text-slate-500 font-mono uppercase">Nama Lengkap:</p>
                            <p className="text-[10px] font-black text-white uppercase">{ktaNama}</p>
                          </div>
                          <div>
                            <p className="text-[7px] text-slate-500 font-mono uppercase">Nomor Induk Anggota / NIK:</p>
                            <p className="text-[9px] font-mono font-bold text-red-500">{ktaNik}</p>
                          </div>
                          <div>
                            <p className="text-[7px] text-slate-500 font-mono uppercase">Kewenangan / Peran:</p>
                            <p className="text-[9px] font-bold text-slate-300">{ktaRole}</p>
                          </div>
                        </div>

                        {/* Scanner QR Code */}
                        <div className="w-16 h-16 bg-white p-1 rounded border border-slate-800 shrink-0 self-center flex items-center justify-center">
                          {/* Simulated high-fidelity visual QR code */}
                          <div className="grid grid-cols-4 gap-[2px] w-full h-full p-0.5">
                            {[...Array(16)].map((_, i) => (
                              <div
                                key={i}
                                className={`rounded-sm ${
                                  (i * 7 + 13) % 5 === 0 || i === 0 || i === 3 || i === 12 || i === 15
                                    ? "bg-black"
                                    : "bg-transparent"
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-red-900/20 flex justify-between items-center">
                        <span className="text-[6px] text-slate-500 font-mono">TERBITAN: TAHUN 2026 • INTEGRITAS RESMI</span>
                        <button
                          onClick={() => {
                            setKtaGenerated(false);
                            setKtaNama("");
                            setKtaNik("");
                          }}
                          className="text-[8px] bg-red-950 text-red-500 hover:text-white px-1.5 py-0.5 rounded border border-red-900/30 transition cursor-pointer"
                        >
                          BUAT ULANG KTA
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleGenerateKta} className="space-y-2.5">
                      <div className="space-y-1 text-left">
                        <label className="text-[9px] text-slate-400 font-bold uppercase">Nama Pemegang KTA:</label>
                        <input
                          type="text"
                          placeholder="Masukkan nama lengkap Anda..."
                          value={ktaNama}
                          onChange={(e) => setKtaNama(e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-slate-800 text-[11px] rounded p-1.5 text-slate-200 outline-none focus:border-red-600"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1 text-left">
                          <label className="text-[9px] text-slate-400 font-bold uppercase">NIK / No. Identitas:</label>
                          <input
                            type="text"
                            placeholder="320501..."
                            value={ktaNik}
                            onChange={(e) => setKtaNik(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-slate-800 text-[11px] rounded p-1.5 text-slate-200 outline-none focus:border-red-600 font-mono"
                            required
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <label className="text-[9px] text-slate-400 font-bold uppercase">Peran / Bidang:</label>
                          <select
                            value={ktaRole}
                            onChange={(e) => setKtaRole(e.target.value)}
                            className="w-full h-8 bg-[#0a0a0a] border border-slate-800 text-[11px] rounded px-1.5 text-slate-200 outline-none focus:border-red-600"
                          >
                            <option value="Anggota / Pembela Hukum">Advokat Anggota</option>
                            <option value="Paralegal Lapangan">Paralegal Lapangan</option>
                            <option value="Satgas Pengamanan EPF">Satgas Pengamanan</option>
                            <option value="Kader Srikandi Hukum">Srikandi KHI</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isGeneratingKta}
                        className="w-full py-2 bg-red-700 hover:bg-red-600 text-white font-mono font-bold text-[10px] rounded tracking-widest transition cursor-pointer flex items-center justify-center gap-1.5 uppercase"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {isGeneratingKta ? "SEDANG MEMPROSES..." : "TERBITKAN KTA DIGITAL"}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                /* GENERAL OTHER PILLARS INTERACTIVE BENEFITS VIEW */
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-red-500 block uppercase">
                      MANFAAT STRATEGIS PILAR
                    </span>
                    <span className="text-xs font-black text-white block uppercase">
                      Sinergi Nasional & Otomatisasi
                    </span>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Pilar ini mempercepat laju pertumbuhan organisasi secara berkelanjutan dan memutus rantai birokrasi yang lambat.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="p-3 bg-[#0a0a0a] border border-slate-850 rounded-lg flex items-start gap-2.5">
                      <span className="text-red-500 text-xs font-bold font-mono">✓</span>
                      <p className="text-[10px] text-slate-300 leading-relaxed text-left">
                        <strong className="text-slate-100">Efisiensi Administrasi:</strong> Pengurangan berkas fisik s/d 90%, menghemat waktu proses, dan menghapus resiko dokumen hilang.
                      </p>
                    </div>
                    <div className="p-3 bg-[#0a0a0a] border border-slate-850 rounded-lg flex items-start gap-2.5">
                      <span className="text-red-500 text-xs font-bold font-mono">✓</span>
                      <p className="text-[10px] text-slate-300 leading-relaxed text-left">
                        <strong className="text-slate-100">Kedaulatan Data:</strong> Seluruh data dihosting secara mandiri oleh LBH DHN tanpa tergantung server pihak ketiga yang tidak aman.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* PDN and Digital Services Tabbed Area */}
      <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl overflow-hidden text-left">
        {/* Toggle tabs */}
        <div className="flex border-b border-slate-800 bg-[#050505]">
          <button
            onClick={() => setActiveTabPDN("pdn")}
            className={`flex-1 py-3 text-xs font-mono font-bold tracking-widest text-center cursor-pointer transition flex items-center justify-center gap-2 ${
              activeTabPDN === "pdn" 
                ? "bg-slate-900 text-white border-b-2 border-red-600" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Server className="w-4 h-4" />
            D. PUSAT DATA NASIONAL (PDN)
          </button>
          <button
            onClick={() => setActiveTabPDN("pelayanan")}
            className={`flex-1 py-3 text-xs font-mono font-bold tracking-widest text-center cursor-pointer transition flex items-center justify-center gap-2 ${
              activeTabPDN === "pelayanan" 
                ? "bg-slate-900 text-white border-b-2 border-red-600" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            E. DIGITALISASI PELAYANAN
          </button>
        </div>

        <div className="p-6">
          {activeTabPDN === "pdn" ? (
            <div className="space-y-4">
              <div className="space-y-1.5 border-b border-slate-850 pb-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Pengelolaan Pusat Data Terintegrasi
                </h4>
                <p className="text-[11px] text-slate-500">
                  Pusat Data Nasional adalah pusat informasi organisasi LBH DHN yang dikelola secara aman, terstruktur, terenkripsi, dan terintegrasi di bawah satu kendali server.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {pdnScopes.map((scope, idx) => {
                  const ScopeIcon = scope.icon;
                  return (
                    <div key={idx} className="p-3 bg-[#050505] border border-slate-850 rounded-lg flex items-start gap-3 hover:border-slate-800 transition">
                      <div className="p-2 bg-slate-900 border border-slate-800 rounded text-red-500 mt-0.5 shrink-0">
                        <ScopeIcon className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-[11px] font-bold text-slate-200 block uppercase font-mono">{scope.title}</span>
                        <p className="text-[10px] text-slate-400 leading-normal">{scope.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-red-950/10 border border-red-900/30 rounded-lg text-[10px] text-slate-400 font-mono mt-4">
                🔒 <strong className="text-slate-200">Prinsip Akurasi:</strong> "Data yang baik akan meminimalkan kesalahan administrasi di lapangan serta mempercepat penentuan keputusan hukum secara tepat."
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5 border-b border-slate-850 pb-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Otomatisasi Sistem Pelayanan Hukum
                </h4>
                <p className="text-[11px] text-slate-500">
                  Teknologi informasi dimanfaatkan untuk mendukung seluruh operasional dan pelayanan eksternal LBH DHN secara efisien, aman, dan patuh hukum.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {digitalisasiLayanan.map((serv, idx) => (
                  <div key={idx} className="p-3 bg-[#050505] border border-slate-850 rounded-lg space-y-1 text-left hover:border-slate-800 transition">
                    <span className="text-[10px] text-red-500 font-mono font-bold block">FITUR ADMINISTRASI 0{idx+1}</span>
                    <span className="text-[11px] font-black text-slate-200 block uppercase">{serv.title}</span>
                    <p className="text-[10px] text-slate-400 leading-normal">{serv.text}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg text-[10px] text-slate-400 font-mono mt-4">
                ⚖️ <strong className="text-slate-200">Kepatuhan Hukum:</strong> Seluruh pemanfaatan teknologi informasi di lingkungan LBH DHN senantiasa memperhatikan ketentuan hukum siber, perlindungan hak konsumen, serta kerahasiaan data sipil.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Structural Unity Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
        {/* Hierarchy Section */}
        <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest block">F. SATU ORGANISASI, SATU SISTEM</span>
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase font-mono">
              Integrasi Jalur Komunikasi Struktural
            </h3>
            <p className="text-[11px] text-slate-500">
              Menghubungkan rantai kepemimpinan dari pusat hingga ke anak cabang di daerah tanpa batasan jarak fisik.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 py-4 font-mono text-[10px] font-bold text-center">
            <span className="px-2 py-1 bg-red-950/20 border border-red-900/30 text-red-500 rounded">DPP</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded">DPW</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded">DPD</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded">DPC</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded">PAC</span>
          </div>

          <div className="space-y-2 border-t border-slate-850 pt-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-widest">
              MANFAAT SISTEM TERINTEGRASI:
            </div>
            <div className="space-y-1.5">
              {structuralBenefits.map((b) => (
                <div key={b.id} className="text-[10px] text-slate-300 flex items-start gap-1.5 font-mono">
                  <span className="text-red-500 font-bold">✓</span>
                  <span>
                    <strong className="text-slate-200">{b.label}:</strong> {b.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Digital Ethics */}
        <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest block">G. ETIKA DIGITAL NASIONAL</span>
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase font-mono">
              Pedoman Kode Etik Penggunaan Teknologi
            </h3>
            <p className="text-[11px] text-slate-500">
              Setiap kader pembela hukum LBH DHN wajib menggunakan dan mengelola infrastruktur digital secara berwibawa.
            </p>
          </div>

          <div className="space-y-3 pt-2 text-slate-300 text-xs leading-relaxed">
            <p className="bg-[#050505] p-3 rounded border border-slate-850">
              1. Setiap personel wajib memperlakukan dan mengamankan data rahasia dengan hak diketahui yang jujur, penuh kehati-hatian, dan sesuai batas kewenangan instruksi.
            </p>
            <p className="bg-[#050505] p-3 rounded border border-slate-850">
              2. <span className="text-red-500 font-bold">Pelanggaran Berat:</span> Segala tindakan penyebaran warta hoaks, pemalsuan data otentik, atau perusakan sistem internal organisasi akan ditindak tegas melalui jalur disiplin organisasi & pidana siber.
            </p>
          </div>

          <div className="p-3 bg-red-950/20 border border-red-950 rounded-lg text-[10px] text-red-400 font-mono">
            🛡️ Hormati privasi sipil, amankan integritas pilar data, dan patuhi peraturan perundang-undangan digital yang berlaku.
          </div>
        </div>
      </div>

      {/* H. Integrated Information Chain flowchart */}
      <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-6 text-left space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest block">H. RANTAI INFORMASI TERINTEGRASI</span>
          <h3 className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase font-mono">
            Sirkulasi Alur Kerja Sistem Informasi Nasional
          </h3>
          <p className="text-[11px] text-slate-500">
            Klik tahapan alur di bawah untuk melihat rincian aktivitas dan sasaran taktis operasional.
          </p>
        </div>

        {/* Horizontal flowchart row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
          {flowSteps.map((f, i) => (
            <div
              key={i}
              onClick={() => setSelectedFlowStep(i)}
              className={`p-3 rounded-lg border cursor-pointer text-center transition-all ${
                selectedFlowStep === i 
                  ? "border-red-500 bg-red-950/10 scale-[1.03]" 
                  : "border-slate-850 bg-[#050505] hover:border-slate-800"
              }`}
            >
              <span className={`text-[9px] font-mono font-bold block mb-1 ${selectedFlowStep === i ? "text-red-500" : "text-slate-500"}`}>
                TAHAP {f.step}
              </span>
              <span className="text-[10px] font-black text-white block uppercase tracking-wide">
                {f.name}
              </span>
            </div>
          ))}
        </div>

        {/* Selected step details */}
        <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-500 uppercase">
            <Terminal className="w-4 h-4" />
            Rincian Alur Operasional: Tahapan {flowSteps[selectedFlowStep].step} — {flowSteps[selectedFlowStep].name}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-mono block">Deskripsi Kegiatan:</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {flowSteps[selectedFlowStep].detail}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-mono block">Rencana Aksi Sistem:</span>
              <p className="text-xs text-slate-200 font-bold">
                ✓ {flowSteps[selectedFlowStep].action}
              </p>
            </div>
          </div>
        </div>

        {/* Section I: Penegasan */}
        <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            I. PENEGASAN INFRASTRUKTUR TEKNOLOGI
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            LBH DHN memanfaatkan inovasi teknologi untuk meningkatkan mutu pelayanan hukum nasional, mempermudah komunikasi komando berjenjang, serta merawat akuntabilitas organisasi. Teknologi hanyalah instrumen penunjang, namun integritas akhlak tetap menjadi fondasi perjuangan paling utama.
          </p>
          <div className="text-[10px] font-bold text-red-500 tracking-wider font-mono text-right uppercase">
            DHN ONE SYSTEM: SATU AKUN • SATU IDENTITAS • SATU SISTEM • SATU TUJUAN
          </div>
        </div>
      </div>

      {/* Digital Declaration Plaque */}
      <div className="bg-[#050505] border-2 border-slate-800 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-950/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-red-500 font-bold tracking-widest uppercase">PROKLAMASI KEMAJUAN ADIL MODERN</div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">
              DEKLARASI DIGITAL NASIONAL LBH DHN
            </h3>
            <div className="h-0.5 w-24 bg-red-700 mx-auto"></div>
          </div>

          <div className="space-y-3.5 text-xs italic text-slate-300 font-serif leading-relaxed px-4 text-left md:text-center">
            <p>“Kami membangun sistem informasi, bukan ketergantungan teknologi.”</p>
            <p>“Kami mengelola data kemanusiaan, bukan sekadar menumpuk dan menyimpannya.”</p>
            <p>“Kami memanfaatkan instrumen teknologi untuk melayani, bukan untuk menguasai.”</p>
            <p>“Kami menjaga keamanan informasi sebagai bentuk tanggung jawab suci kepada organisasi dan masyarakat.”</p>
            <p>“Kami percaya bahwa organisasi pembela hukum yang mampu mengelola informasi secara bertanggung jawab akan lebih tangguh dan siap menghadapi masa depan keadilan sipil.”</p>
          </div>

          <div className="pt-4 border-t border-slate-850 max-w-md mx-auto space-y-2">
            <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
              LBH BANTUAN HUKUM DELIK HUKUM NEGARA
            </p>
            <div className="text-xs font-bold text-white tracking-widest font-mono flex flex-wrap justify-center gap-x-4 gap-y-1 text-center uppercase">
              <span className="text-red-500">ADIL</span>
              <span className="text-slate-500">•</span>
              <span>BERINTEGRITAS</span>
              <span className="text-slate-500">•</span>
              <span className="text-red-500">BERKARYA</span>
            </div>
            <p className="text-[10px] font-black text-red-500 font-mono tracking-widest pt-2 uppercase">
              KITA BERJUANG DENGAN HUKUM, KITA MENANG DENGAN KEHORMATAN!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
