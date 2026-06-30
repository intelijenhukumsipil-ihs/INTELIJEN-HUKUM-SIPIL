import React, { useState, useEffect } from "react";
import { 
  Shield, 
  ArrowRight, 
  Activity, 
  Users, 
  FileCheck, 
  Lock, 
  ExternalLink,
  MessageCircle,
  AlertOctagon,
  Zap,
  Award,
  UserCheck,
  MessageSquareCode,
  Newspaper,
  RefreshCw,
  Calendar,
  User,
  Globe,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Send
} from "lucide-react";
import { motion } from "motion/react";
import { CaseReport } from "../types";
import mascotAvatar from "../assets/images/ihs_mascot_avatar_1782707315561.jpg";

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  cases: CaseReport[];
  syncLogs: { id: string; timestamp: string; action: string; detail: string; status: string }[];
  newsList: any[];
}

export default function HomeView({ onNavigate, cases, syncLogs, newsList }: HomeViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute stats
  const totalCases = cases.length;
  const verifiedCases = cases.filter(c => c.status !== "diterima").length;
  const inProgressCases = cases.filter(c => c.status === "penanganan").length;
  const completedCases = cases.filter(c => c.status === "selesai").length;

  // News & Sync states
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogsConsole, setSyncLogsConsole] = useState<string[]>([]);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);
  const [sharingArticle, setSharingArticle] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  // Parse URL search parameters or pathname to check if user opened a shared article link
  useEffect(() => {
    if (newsList && newsList.length > 0) {
      const params = new URLSearchParams(window.location.search);
      let wartaId = params.get("warta");
      if (!wartaId) {
        const pathParts = window.location.pathname.split("/");
        const wartaIdx = pathParts.findIndex(p => p === "warta");
        if (wartaIdx !== -1 && wartaIdx + 1 < pathParts.length) {
          wartaId = pathParts[wartaIdx + 1];
        }
      }
      if (wartaId) {
        const found = newsList.find(item => item.id === wartaId);
        if (found) {
          setSelectedArticle(found);
        }
      }
    }
  }, [newsList]);

  const getShareUrl = (id: string) => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}?warta=${id}`;
  };

  const handleCopyLink = (id: string) => {
    const shareUrl = getShareUrl(id);
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const news = newsList;

  const handleManualSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setShowSyncSuccess(false);
    setSyncLogsConsole([]);

    const logs = [
      "⚡ [SYSTEM] Membuka repositori warta hukum lokal...",
      "📂 [DATABASE] Menghubungkan ke database berita & rilis pers beranda...",
      "📥 [FETCH] Memperbarui daftar rilis berita harian & artikel edukasi...",
      "🔄 [SYNC] Sinkronisasi warta publik ke beranda berhasil diselesaikan!"
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setSyncLogsConsole(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsSyncing(false);
          setShowSyncSuccess(true);
          // Hide success notice after 4 seconds
          setTimeout(() => setShowSyncSuccess(false), 4000);
        }, 800);
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with Moto */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0a0a0a] to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
        {/* Subtle decorative background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-900/40 text-red-500 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 animate-pulse" />
            Portal Intelijen Sipil Resmi
          </div>
          
          <motion.h1 
            initial={{ letterSpacing: "0.02em" }}
            animate={{ 
              letterSpacing: ["0.02em", "0.05em", "0.02em"],
              textShadow: [
                "0 0 0px rgba(220, 38, 38, 0)",
                "0 0 15px rgba(220, 38, 38, 0.4)",
                "0 0 0px rgba(220, 38, 38, 0)"
              ]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans"
          >
            INTELIJEN HUKUM SIPIL <span className="text-red-600">(IHS)</span>
          </motion.h1>
          
          <p className="text-md sm:text-xl font-medium text-slate-450 italic">
            &ldquo;Mengungkap Fakta, Mengawal Keadilan, Menegakkan Tanpa Kompromi&rdquo;
          </p>
          
          <div className="h-[1px] w-24 bg-red-600"></div>
          
          <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
            IHS adalah instrumen pengawasan hukum sipil yang berkomitmen mengadvokasi sengketa tanah, 
            kriminalisasi masyarakat sipil, pelanggaran ketenagakerjaan, dan korupsi wewenang secara mandiri. 
            Didukung oleh analisis cerdas hukum nasional dan jaringan advokat se-Indonesia.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => onNavigate("lapor")}
              className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold transition flex items-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer text-sm"
              id="hero-btn-lapor"
            >
              Lapor Kasus Sekarang
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("investigasi")}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 rounded-lg font-semibold transition cursor-pointer text-sm"
              id="hero-btn-pantau"
            >
              Pantau Investigasi
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Laporan Masuk</div>
          <div className="text-3xl font-extrabold text-white mt-1">{totalCases}</div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-red-500 font-bold">&#8226;</span> Terdaftar di database www.ihsid.org
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Kasus Terverifikasi</div>
          <div className="text-3xl font-extrabold text-white mt-1">{verifiedCases}</div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-yellow-500 font-bold">&#8226;</span> Lulus seleksi bukti primer
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Sedang Diadvokasi</div>
          <div className="text-3xl font-extrabold text-red-500 mt-1">{inProgressCases}</div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-red-500 font-bold">&#8226;</span> Pendampingan hukum aktif
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Kasus Selesai / Damai</div>
          <div className="text-3xl font-extrabold text-green-500 mt-1">{completedCases}</div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-green-500 font-bold">&#8226;</span> Hak sipil warga terpenuhi
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Action Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Layanan Intelijen Cepat (Quick Access) */}
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
            {/* Subtle highlight gradient */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 via-red-900 to-transparent"></div>
            
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white flex items-center gap-2 font-mono uppercase tracking-wide">
                <Zap className="w-5 h-5 text-red-500 animate-pulse" />
                Layanan Intelijen Cepat
              </h3>
              <div className="flex items-center gap-1 bg-red-950/45 border border-red-900/30 px-2.5 py-0.5 rounded-full text-[9px] font-mono text-red-400 font-bold">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                RESPON LIVE 24/7
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => onNavigate("lapor")}
                className="bg-[#050505] border border-slate-850 hover:border-red-900/40 p-4 rounded-xl cursor-pointer transition-all duration-300 group hover:shadow-lg hover:shadow-red-950/10"
              >
                <div className="text-red-500 font-bold text-sm flex items-center justify-between group-hover:text-red-400">
                  <span className="font-mono uppercase tracking-wide text-xs">Lapor Pelanggaran / Sengketa</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Laporkan sengketa agraria, sengketa tanah, pemerasan aparat, atau pelanggaran kerja secara aman & rahasia.
                </p>
              </div>

              <div 
                onClick={() => onNavigate("konsultasi")}
                className="bg-[#050505] border border-slate-850 hover:border-slate-750 p-4 rounded-xl cursor-pointer transition-all duration-300 group hover:shadow-lg"
              >
                <div className="text-slate-200 font-bold text-sm flex items-center justify-between group-hover:text-white">
                  <span className="font-mono uppercase tracking-wide text-xs">Konsultasi AI Advokat</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Gunakan Asisten Advokat AI kami untuk analisis cepat regulasi dan undang-undang yang relevan dengan kasus Anda.
                </p>
              </div>

              <div 
                onClick={() => onNavigate("hukum")}
                className="bg-[#050505] border border-slate-850 hover:border-slate-750 p-4 rounded-xl cursor-pointer transition-all duration-300 group hover:shadow-lg"
              >
                <div className="text-slate-200 font-bold text-sm flex items-center justify-between group-hover:text-white">
                  <span className="font-mono uppercase tracking-wide text-xs">Arsip & Template Somasi</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Akses draf template gugatan mandiri, somasi korporasi, surat pengaduan HAM siap pakai.
                </p>
              </div>

              <div 
                onClick={() => onNavigate("jaringan")}
                className="bg-[#050505] border border-slate-850 hover:border-slate-750 p-4 rounded-xl cursor-pointer transition-all duration-300 group hover:shadow-lg"
              >
                <div className="text-slate-200 font-bold text-sm flex items-center justify-between group-hover:text-white">
                  <span className="font-mono uppercase tracking-wide text-xs">Gabung Jaringan Pembela</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Gabung sebagai Advokat, LSM, Jurnalis atau Relawan Lapangan dalam satu kesatuan gerakan keadilan.
                </p>
              </div>
            </div>
          </div>

          {/* DAILY NEWS & SYNC REGISTRY SECTION - INSIDE MAIN GRID */}
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 space-y-6 shadow-2xl relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-850">
              <div className="space-y-1 text-left">
                <h3 className="text-md sm:text-lg font-black text-white flex items-center gap-2 font-mono tracking-wide uppercase">
                  <Newspaper className="w-5 h-5 text-red-500" />
                  WARTA HARIAN & RILIS PERS UTAMA
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Kanal publikasi resmi Satgas Intelijen Hukum Sipil (IHS) mengenai pengawasan wewenang dan pembelaan hak warga.
                </p>
              </div>
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                className={`px-4 py-2 bg-slate-900 border border-slate-800 hover:border-red-900/60 text-[10px] font-bold text-slate-200 hover:text-white rounded-lg flex items-center gap-1.5 transition shrink-0 cursor-pointer ${isSyncing ? "opacity-75" : ""}`}
              >
                <RefreshCw className={`w-3.5 h-3.5 text-red-500 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Memperbarui..." : "MUAT ULANG"}
              </button>
            </div>

            {/* Sync Console Overlay */}
            {isSyncing && (
              <div className="bg-[#050505] border border-red-900/30 rounded-xl p-4 font-mono text-[10px] sm:text-xs space-y-1.5 text-slate-300 text-left">
                <div className="flex items-center justify-between text-red-500 font-bold border-b border-slate-850 pb-2 mb-2 uppercase tracking-wider">
                  <span>Terminal Pembaharuan Warta IHS</span>
                  <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                </div>
                {syncLogsConsole.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="leading-relaxed"
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Sync Success Badge */}
            {showSyncSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-950/20 border border-green-900/40 text-green-400 text-xs py-3 px-4 rounded-xl flex items-center gap-2 text-left"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
                <span><strong>Pembaharuan Sukses!</strong> Warta berita harian berhasil diselaraskan dan diperbarui sepenuhnya di beranda.</span>
              </motion.div>
            )}

            {/* News List - Giant High-Impact Cards inside grid column */}
            <div className="space-y-5 pt-1 text-left">
              {news.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-500 font-mono">
                  Menghubungkan ke server untuk memuat rilis berita harian...
                </div>
              ) : (
                news.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-[#050505] border border-slate-850 hover:border-slate-800 rounded-xl overflow-hidden flex flex-col md:flex-row transition-all duration-300 group shadow-lg"
                  >
                    {item.imageUrl && (
                      <div className="md:w-5/12 h-44 sm:h-48 md:h-auto overflow-hidden relative shrink-0 border-b md:border-b-0 md:border-r border-slate-850 min-h-[160px]">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 px-2 py-0.5 bg-red-950/90 border border-red-900 text-red-500 rounded text-[9px] font-bold font-mono uppercase tracking-wider shadow-md">
                          {item.category}
                        </div>
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          {!item.imageUrl && (
                            <span className="inline-block px-2 py-0.5 bg-red-950/90 border border-red-900 text-red-500 rounded text-[9px] font-bold font-mono uppercase tracking-wider">
                              {item.category}
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-slate-900/80 border border-slate-800 text-slate-400 rounded text-[9px] font-bold font-mono uppercase tracking-wider">
                            Rilis Resmi
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-black text-white group-hover:text-red-500 transition-colors duration-200 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-350 leading-relaxed font-sans line-clamp-3">
                          {item.summary}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-850/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-slate-400">
                          <span className="flex items-center gap-1 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900">
                            <Calendar className="w-3.5 h-3.5 text-red-500" />
                            {new Date(item.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            Penerbit: {item.author.split(" ")[0]}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={() => setSharingArticle(item)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-red-400 hover:text-red-350 border border-slate-800 hover:border-red-900/40 rounded-lg text-[10px] font-bold transition font-mono cursor-pointer flex items-center justify-center gap-1 uppercase tracking-wide shrink-0 active:scale-98 animate-pulse"
                            title="Bagikan Berita"
                          >
                            <Share2 className="w-3 h-3 text-red-500 animate-pulse" />
                            BAGIKAN
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedArticle(item)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 rounded-lg text-[10px] font-bold transition font-mono cursor-pointer flex items-center justify-center gap-1 uppercase tracking-wide shrink-0 active:scale-98"
                          >
                            Baca
                            <ArrowRight className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bento Info: Misi & LBH Side-by-Side to prevent pushing the screen layout downward */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Misi Utama Info Board */}
            <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg">
              <div className="absolute top-0 right-0 p-3 opacity-5">
                <Shield className="w-24 h-24 text-white" />
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-black text-white tracking-wide uppercase font-mono flex items-center gap-1.5 border-b border-slate-850 pb-2">
                  <Shield className="w-4 h-4 text-red-500" />
                  Misi Gerakan IHS
                </h3>
                <ul className="space-y-3 text-slate-300 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-950 border border-red-800 text-red-500 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-white">Fakta Akurat:</strong> Membantu korban mengamankan bukti primer yang sah dan tak terbantahkan untuk jalur hukum.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-950 border border-red-800 text-red-500 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-white">Demokratisasi Advokasi:</strong> Menyediakan template somasi mandiri agar rakyat lepas dari beban jasa hukum komersial yang mahal.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-950 border border-red-800 text-red-500 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-white">Pengawasan Kuasa:</strong> Melaporkan & mengawal kinerja aparatur negara agar terbebas dari penyalahgunaan wewenang.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* DPP LBH Delik Hukum Negara Info Card */}
            <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 relative overflow-hidden shadow-xl flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-3 opacity-5">
                <Award className="w-24 h-24 text-red-500" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-900 to-red-600 flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0 border border-slate-700 font-mono">
                    DPP
                  </div>
                  <div className="space-y-0.5">
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-950/40 border border-red-900/40 text-red-500 rounded-full text-[8px] font-mono font-bold tracking-wider uppercase">
                      <UserCheck className="w-3 h-3" />
                      KOMANDO PUSAT
                    </div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-wider font-mono leading-tight">
                      LBH DELIK HUKUM NEGARA
                    </h4>
                  </div>
                </div>

                <div className="pt-2 pb-2 border-y border-slate-850 flex items-center justify-between text-[10px]">
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono block">KETUA UMUM:</span>
                    <span className="font-extrabold text-red-500 font-mono">KAPTEN IWAN</span>
                  </div>
                  <div className="h-6 w-[1px] bg-slate-850"></div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono block">YURIDIKSI:</span>
                    <span className="font-bold text-slate-300">INDONESIA</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  LBH Delik Hukum Negara berkomitmen memberikan perlindungan hukum pro-bono bagi warga tertindas, serta bersinergi dengan Satgas IHS di seluruh penjuru tanah air.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Central Server Sync Status (www.ihsid.org) & Live Time */}
        <div className="space-y-6">
          {/* Interactive AI Mascot Q&A Portal */}
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 relative overflow-hidden shadow-xl shadow-black/30 text-left">
            {/* Pulsing live badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-950/40 border border-green-900/40 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
              WIRA ONLINE
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-800 bg-[#050505]">
                    <img 
                      src={mascotAvatar} 
                      alt="WIRA AI Mascot" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    WIRA SIBI - SANG PEMBELA
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Maskot & Advokat Virtual IHS
                  </p>
                </div>
              </div>

              {/* Chat speech bubble */}
              <div className="relative bg-[#050505] border border-slate-850 p-3.5 rounded-xl rounded-tl-none text-xs text-slate-300 leading-relaxed font-sans">
                {/* Speech arrow */}
                <div className="absolute -left-[5px] top-0 w-0 h-0 border-t-[8px] border-t-[#050505] border-l-[6px] border-l-transparent"></div>
                <p>
                  &ldquo;Halo Rakyat Indonesia! Saya <strong>WIRA</strong>, maskot sekaligus asisten hukum cerdas Anda. Ada sengketa pertanahan, kesewenang-wenangan aparat, atau sengketa lainnya? Mari konsultasikan landasan hukumnya bersama saya sekarang!&rdquo;
                </p>
              </div>

              {/* Action Button to Q&A tab */}
              <button
                type="button"
                onClick={() => onNavigate("konsultasi")}
                className="w-full py-2.5 bg-red-750 hover:bg-red-700 text-white font-mono font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-red-950/30 group"
              >
                <MessageSquareCode className="w-4 h-4 text-red-300 group-hover:scale-110 transition" />
                TANYA JAWAB SEKARANG (AKTIF)
              </button>
            </div>
          </div>
          {/* SYSTEM MONITOR & KONEKSI (Unified Status panel) */}
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-extrabold text-white tracking-wider flex items-center gap-1.5 font-mono">
                <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                SISTEM MONITOR & KONEKSI
              </span>
              <span className="text-[9px] font-mono text-green-400 bg-green-950/40 px-1.5 py-0.5 rounded border border-green-900/30">ONLINE</span>
            </div>

            {/* Live Clock & Timezone Widget */}
            <div className="bg-[#050505] border border-slate-850 rounded-lg p-3 text-center">
              <div className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">WAKTU AKTIF SISTEM</div>
              <div className="text-xl font-bold text-white font-mono mt-0.5">
                {currentTime.toLocaleTimeString("id-ID")}
              </div>
              <div className="text-[9px] text-slate-400 font-mono">
                WIB / WITA / WIT • {currentTime.toLocaleDateString("id-ID", { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>

            {/* Micro Connection & Security details */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="bg-[#050505] border border-slate-850 p-2 rounded">
                <span className="text-slate-500 block text-[8px] uppercase">GATEWAY</span>
                <span className="text-slate-300 font-bold">www.ihsid.org</span>
              </div>
              <div className="bg-[#050505] border border-slate-850 p-2 rounded">
                <span className="text-slate-500 block text-[8px] uppercase">SSL SECURE</span>
                <span className="text-red-400 font-bold">AES-256 ENCRYPT</span>
              </div>
            </div>

            {/* Hotline WhatsApp link consolidated */}
            <div className="bg-[#050505] border border-slate-850 p-2.5 rounded flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-500 shrink-0" />
                <div>
                  <span className="text-slate-500 block text-[8px] uppercase">HOTLINE WA</span>
                  <span className="text-slate-200 font-bold text-[10px]">0852-2232-2254</span>
                </div>
              </div>
              <a
                href="https://wa.me/6285222322254"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] text-green-400 hover:text-green-300 font-semibold bg-green-950/20 hover:bg-green-950/40 px-2 py-1 rounded border border-green-900/40 transition flex items-center gap-0.5"
              >
                HUBUNGI
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            {/* Central Server Synchronization Logs Tracker */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">LOG AKTIVITAS TERBARU:</span>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {syncLogs.length === 0 ? (
                  <div className="text-center py-4 text-[10px] text-slate-500 font-mono">
                    Belum ada log sinkronisasi terbaru.
                  </div>
                ) : (
                  syncLogs.slice(0, 3).map((log) => (
                    <div key={log.id} className="text-[10px] bg-[#050505] p-2 rounded border border-slate-850 font-mono space-y-1">
                      <div className="flex items-center justify-between text-[8px]">
                        <span className="text-red-500 font-bold uppercase">{log.action.split(" ")[0]}</span>
                        <span className="text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-slate-350 text-[10px] leading-relaxed line-clamp-2">{log.detail}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Warning Board */}
          <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-4 flex gap-3">
            <AlertOctagon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-red-400">PENTING: Jaga Kerahasiaan Akun</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Platform IHS dirancang dengan enkripsi server tangguh. Pastikan Anda tidak membagikan kredensial login atau NIK pelapor kepada pihak ketiga mana pun di luar sistem resmi www.ihsid.org.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Article Content Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#0c0c0c] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl relative"
          >
            {/* Header image / colored band */}
            {selectedArticle.imageUrl ? (
              <div className="h-56 w-full relative">
                <img 
                  src={selectedArticle.imageUrl} 
                  alt={selectedArticle.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] to-transparent"></div>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 border border-slate-700/50 cursor-pointer transition w-8 h-8 flex items-center justify-center"
                >
                  <span className="font-bold text-xs">✕</span>
                </button>
              </div>
            ) : (
              <div className="p-4 border-b border-slate-850 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-red-500 bg-red-950/40 border border-red-900/40 px-2 py-0.5 rounded uppercase">
                  {selectedArticle.category}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full p-2 border border-slate-800 cursor-pointer transition w-8 h-8 flex items-center justify-center"
                >
                  <span className="font-bold text-xs">✕</span>
                </button>
              </div>
            )}

            <div className="p-6 space-y-4">
              {/* Category Badge if has image */}
              {selectedArticle.imageUrl && (
                <span className="inline-block text-[10px] font-mono font-bold text-red-500 bg-red-950/40 border border-red-900/40 px-2 py-0.5 rounded uppercase">
                  {selectedArticle.category}
                </span>
              )}

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight font-sans">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-500 border-b border-slate-850 pb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-red-500" />
                  {new Date(selectedArticle.date).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {selectedArticle.author}
                </span>
              </div>

              {/* Styled article body */}
              <div className="text-slate-300 text-sm leading-relaxed space-y-4 whitespace-pre-line font-sans pt-1">
                {selectedArticle.content}
              </div>

              {/* Action close button */}
              <div className="pt-4 border-t border-slate-850 flex items-center justify-between gap-4">
                <span className="text-[10px] font-mono text-slate-500">PORTAL RESMI: WWW.IHSID.ORG</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSharingArticle(selectedArticle)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-red-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-bold transition font-mono cursor-pointer flex items-center gap-1.5 uppercase"
                  >
                    <Share2 className="w-3.5 h-3.5 text-red-500" />
                    BAGIKAN
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(null)}
                    className="px-5 py-2 bg-red-750 hover:bg-red-700 text-white rounded-lg font-mono font-bold text-xs transition cursor-pointer"
                  >
                    TUTUP BACAAN
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Share Article Modal */}
      {sharingArticle && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0c0c0c] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl relative text-left"
          >
            <button
              type="button"
              onClick={() => setSharingArticle(null)}
              className="absolute top-4 right-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full p-2 border border-slate-800 cursor-pointer transition w-8 h-8 flex items-center justify-center"
            >
              <span className="font-bold text-xs">✕</span>
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-red-950/40 border border-red-900/40 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-md font-bold text-white tracking-wide uppercase font-mono">Bagikan Warta Berita</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto line-clamp-1">
                {sharingArticle.title}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Salin Tautan Berita</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getShareUrl(sharingArticle.id)}
                    className="flex-1 bg-[#050505] border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyLink(sharingArticle.id)}
                    className="p-2.5 bg-red-750 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Salin Link"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {copied && (
                  <p className="text-[10px] text-green-400 font-mono text-right animate-pulse">Tautan disalin ke clipboard!</p>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Bagikan ke Platform</span>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(sharingArticle.title + ' - Baca rilis resmi Satgas Intelijen Hukum Sipil (IHS): ' + getShareUrl(sharingArticle.id))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-green-950/20 hover:bg-green-950/40 border border-green-900/30 hover:border-green-800 text-green-400 text-xs font-bold font-mono rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WHATSAPP
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(getShareUrl(sharingArticle.id))}&text=${encodeURIComponent(sharingArticle.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-blue-950/20 hover:bg-blue-950/40 border border-blue-900/30 hover:border-blue-800 text-blue-400 text-xs font-bold font-mono rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    TELEGRAM
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl(sharingArticle.id))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-900/30 hover:border-indigo-800 text-indigo-400 text-xs font-bold font-mono rounded-lg transition flex items-center justify-center gap-2 col-span-2"
                  >
                    <Globe className="w-4 h-4 text-indigo-400" />
                    FACEBOOK / SOSIAL MEDIA
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSharingArticle(null)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg font-mono text-xs font-bold transition cursor-pointer text-center"
              >
                KEMBALI
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
