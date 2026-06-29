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
  Zap
} from "lucide-react";
import { CaseReport } from "../types";

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  cases: CaseReport[];
  syncLogs: { id: string; timestamp: string; action: string; detail: string; status: string }[];
}

export default function HomeView({ onNavigate, cases, syncLogs }: HomeViewProps) {
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
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
            INTELIJEN HUKUM SIPIL <span className="text-red-600">(IHS)</span>
          </h1>
          
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

      {/* Connection & Gateway Health Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-950/40 text-green-500 rounded-lg border border-green-900/30">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">SERVER UTAMA</div>
              <div className="text-sm font-bold text-slate-200">www.ihsid.org</div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-green-400 font-semibold bg-green-950/20 px-2 py-0.5 rounded-lg border border-green-900/40">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            TERKONEKSI
          </span>
        </div>

        <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-950/40 text-red-500 rounded-lg border border-red-900/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">PROTOKOL KEAMANAN</div>
              <div className="text-sm font-bold text-slate-200">Enkripsi End-to-End SSL</div>
            </div>
          </div>
          <span className="text-xs text-red-400 font-semibold bg-red-950/20 px-2 py-0.5 rounded-lg border border-red-900/40 font-mono">
            AES-256
          </span>
        </div>

        <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-slate-300 rounded-lg border border-slate-850">
              <MessageCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">HOTLINE WHATSAPP</div>
              <div className="text-sm font-bold text-slate-200">0852-2232-2254</div>
            </div>
          </div>
          <a
            href="https://wa.me/6285222322254"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-green-400 hover:text-green-300 font-semibold bg-green-950/20 hover:bg-green-950/40 px-2 py-1 rounded border border-green-900/40 transition flex items-center gap-1"
          >
            HUBUNGI
            <ExternalLink className="w-3 h-3" />
          </a>
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
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-red-500" />
              Layanan Intelijen Cepat (Quick Access)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => onNavigate("lapor")}
                className="bg-[#050505] border border-slate-800 hover:border-red-900/60 p-4 rounded-xl cursor-pointer transition group"
              >
                <div className="text-red-500 font-bold text-sm flex items-center justify-between group-hover:text-red-400">
                  <span>Lapor Pelanggaran / Sengketa</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Laporkan sengketa agraria, sengketa tanah, pemerasan aparat, atau pelanggaran kerja secara aman & rahasia.
                </p>
              </div>

              <div 
                onClick={() => onNavigate("konsultasi")}
                className="bg-[#050505] border border-slate-800 hover:border-slate-700 p-4 rounded-xl cursor-pointer transition group"
              >
                <div className="text-slate-200 font-bold text-sm flex items-center justify-between group-hover:text-white">
                  <span>Konsultasi AI Advokat</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Gunakan Asisten Advokat AI kami untuk analisis cepat regulasi dan undang-undang yang relevan dengan kasus Anda.
                </p>
              </div>

              <div 
                onClick={() => onNavigate("hukum")}
                className="bg-[#050505] border border-slate-800 hover:border-slate-700 p-4 rounded-xl cursor-pointer transition group"
              >
                <div className="text-slate-200 font-bold text-sm flex items-center justify-between group-hover:text-white">
                  <span>Arsip & Template Somasi</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Akses draf template gugatan mandiri, somasi korporasi, surat pengaduan HAM siap pakai.
                </p>
              </div>

              <div 
                onClick={() => onNavigate("jaringan")}
                className="bg-[#050505] border border-slate-800 hover:border-slate-700 p-4 rounded-xl cursor-pointer transition group"
              >
                <div className="text-slate-200 font-bold text-sm flex items-center justify-between group-hover:text-white">
                  <span>Gabung Jaringan Pembela</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Gabung sebagai Advokat, LSM, Jurnalis atau Relawan Lapangan dalam satu kesatuan gerakan keadilan.
                </p>
              </div>
            </div>
          </div>

          {/* Misi Utama Info Board */}
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Shield className="w-32 h-32 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Misi Gerakan Intelijen Hukum Sipil</h3>
            <ul className="space-y-3.5 text-slate-300 text-sm">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-red-950 border border-red-800 text-red-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-white">Pengumpulan Fakta Akurat (Klandestin Sipil):</strong> Membantu korban mengamankan bukti digital dan fisik yang sah dan tak terbantahkan untuk dibawa ke pengadilan.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-red-950 border border-red-800 text-red-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-white">Demokratisasi Advokasi:</strong> Menyediakan template dokumen hukum siap pakai agar rakyat tidak tergantung pada jasa hukum komersial mahal.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-red-950 border border-red-800 text-red-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-white">Pengawasan Kuasa Hukum:</strong> Melaporkan dan mengawal kinerja kepolisian, instansi kehutanan, pertanahan, serta aparatur negara agar terbebas dari mafia tanah dan sengketa sepihak.
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Central Server Sync Status (www.ihsid.org) & Live Time */}
        <div className="space-y-6">
          {/* Live UTC Clock & Timezone Widget */}
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-xs text-slate-500 font-mono tracking-widest uppercase">WAKTU AKTIF SISTEM</div>
            <div className="text-2xl font-bold text-white font-mono mt-1">
              {currentTime.toLocaleTimeString("id-ID")}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              WIB / WITA / WIT • {currentTime.toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Central Server Synchronization Logs Tracker */}
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <span className="text-xs font-extrabold text-white tracking-wider flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                AKTIVITAS SERVER PUSAT
              </span>
              <span className="text-[10px] font-mono text-slate-500">ihsid.org</span>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {syncLogs.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 font-mono">
                  Belum ada log sinkronisasi terbaru.
                </div>
              ) : (
                syncLogs.map((log) => (
                  <div key={log.id} className="text-xs bg-[#050505] p-2.5 rounded border border-slate-800 font-mono space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-red-500 font-bold text-[11px]">{log.action}</span>
                      <span className="text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{log.detail}</p>
                    <div className="flex items-center justify-between pt-1 text-[9px]">
                      <span className="text-green-500 bg-green-950/20 px-1 rounded">SSL TERENKRIPSI</span>
                      <span className="text-slate-500">PROSES: SUKSES</span>
                    </div>
                  </div>
                ))
              )}
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
    </div>
  );
}
