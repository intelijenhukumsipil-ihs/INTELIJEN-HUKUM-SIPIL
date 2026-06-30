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
