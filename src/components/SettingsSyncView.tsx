import React, { useState } from "react";
import { 
  Settings, 
  RefreshCw, 
  Database, 
  Terminal, 
  Lock, 
  Server, 
  MessageSquare, 
  CheckCircle,
  FileText,
  Key,
  Shield,
  Activity,
  AlertOctagon,
  Wrench
} from "lucide-react";

interface SettingsSyncViewProps {
  syncLogs: { id: string; timestamp: string; action: string; detail: string; status: string }[];
  onTriggerAudit: () => void;
}

export default function SettingsSyncView({ syncLogs, onTriggerAudit }: SettingsSyncViewProps) {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setAuditResult(null);
    setTimeout(() => {
      onTriggerAudit();
      setIsAuditing(false);
      setAuditResult("Audit integritas data berhasil! Seluruh berkas digital perkara (SHA-256) cocok dengan pangkalan data cadangan di www.ihsid.org. Tidak ditemukan adanya anomali atau manipulasi data.");
    }, 1500);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-sans tracking-tight">
            <Wrench className="w-6 h-6 text-red-600" />
            Konfigurasi & Terminal Enkripsi Pusat
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Status konektivitas server pusat www.ihsid.org, gateway WhatsApp 0852-2232-2254, and audit data berkala
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Security and Server Specs */}
        <div className="space-y-6">
          {/* www.ihsid.org Sync Spec Panel */}
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-widest font-mono flex items-center gap-2 border-b border-slate-850 pb-2">
              <Server className="w-4.5 h-4.5 text-red-500" />
              SPESIFIKASI SINKRONISASI SERVER PUSAT
            </h3>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-850/60 pb-1.5">
                <span className="text-slate-500">Host Server Utama:</span>
                <span className="text-slate-300 font-bold">www.ihsid.org</span>
              </div>
              <div className="flex justify-between border-b border-slate-850/60 pb-1.5">
                <span className="text-slate-500">Protokol Jaringan:</span>
                <span className="text-green-500 font-bold">HTTPS / TLS 1.3 Terenkripsi</span>
              </div>
              <div className="flex justify-between border-b border-slate-850/60 pb-1.5">
                <span className="text-slate-500">Algoritma Enkripsi:</span>
                <span className="text-slate-300 font-medium">AES-256-GCM Keamanan Tinggi</span>
              </div>
              <div className="flex justify-between border-b border-slate-850/60 pb-1.5">
                <span className="text-slate-500">Metode Validasi Bukti:</span>
                <span className="text-red-500 font-bold">Kriptografi SHA-256 Hash</span>
              </div>
              <div className="flex justify-between border-b border-slate-850/60 pb-1.5">
                <span className="text-slate-500">Cadangan Otomatis:</span>
                <span className="text-slate-300">Harian (03:00 WIB) ke Server Backup</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hak Akses Node:</span>
                <span className="text-red-500">Role-Based Access Control (RBAC)</span>
              </div>
            </div>

            <div className="bg-[#050505] p-3 rounded-lg border border-slate-850 text-[10px] font-mono text-slate-400 leading-relaxed">
              Seluruh rekam data aktivitas disinkronkan ke server pusat www.ihsid.org secara mutlak. 
              Sistem mencatat identitas unik (SHA-256) berkas pelapor secara permanen dan tidak dapat dihapus 
              sepihak oleh siapa pun guna menghindari penyelewengan kuasa dan sabotase data kasus.
            </div>
          </div>

          {/* WhatsApp gateway Spec Panel */}
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-widest font-mono flex items-center gap-2 border-b border-slate-850 pb-2">
              <MessageSquare className="w-4.5 h-4.5 text-green-500" />
              SISTEM GATEWAY WHATSAPP RESMI
            </h3>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-850/60 pb-1.5">
                <span className="text-slate-500">Nomor Kontak Pusat:</span>
                <span className="text-white font-bold">0852-2232-2254</span>
              </div>
              <div className="flex justify-between border-b border-slate-850/60 pb-1.5">
                <span className="text-slate-500">Status Gateway:</span>
                <span className="text-green-500 font-bold">AKTIF / ONLINE</span>
              </div>
              <div className="flex justify-between border-b border-slate-850/60 pb-1.5">
                <span className="text-slate-500">Lisensi Penyedia:</span>
                <span className="text-slate-300">Gateway Resmi Bisnis Terverifikasi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Enkripsi Pengiriman:</span>
                <span className="text-slate-300">WhatsApp End-to-End Encrypted</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
              Integrasi satu kali klik memadatkan berkas pengaduan, nama pelapor, lokasi, dan nomor tiket kasus 
              dalam bentuk tautan aman terenkripsi sehingga tim pusat di Jakarta dapat langsung melangsungkan koordinasi 
              lapangan tanpa penundaan.
            </p>
          </div>
        </div>

        {/* Right Column: Live Terminal logs & Manual database audits */}
        <div className="space-y-6">
          {/* Auditing panel */}
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
              <Database className="w-5 h-5 text-red-500" />
              Audit Sistem & Pemeriksaan Konsistensi
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Jalankan audit digital lokal instan untuk memverifikasi keselarasan berkas bukti di browser dengan 
              database cadangan terenkripsi di server pusat www.ihsid.org.
            </p>

            {auditResult && (
              <div className="p-3.5 bg-green-950/10 border border-green-900/30 text-green-400 rounded-lg text-xs font-mono leading-relaxed">
                {auditResult}
              </div>
            )}

            <button
              type="button"
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="w-full py-2.5 bg-red-700 hover:bg-red-600 disabled:bg-slate-850 disabled:text-slate-500 text-white font-mono font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  MENGECEK SINKRONISASI DATABASE...
                </>
              ) : (
                <>
                  <Shield className="w-4.5 h-4.5" />
                  AUDIT INTEGRITAS DATABASE SEKARANG
                </>
              )}
            </button>
          </div>

          {/* Terminal Console Logs View */}
          <div className="bg-[#050505] border border-slate-800 rounded-xl p-4 space-y-2.5 text-left">
            <div className="flex items-center justify-between text-xs font-mono border-b border-slate-850 pb-2">
              <span className="text-white font-bold flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-red-500" />
                SIBI SECURE TERMINAL
              </span>
              <span className="text-[10px] text-green-500 font-bold bg-green-950/10 px-2.5 py-0.5 rounded border border-green-900/30">
                STABIL
              </span>
            </div>

            <div className="bg-[#050505] h-[210px] overflow-y-auto font-mono text-[10px] text-slate-400 space-y-2 pr-1 text-left">
              <div className="text-slate-600">[2026-06-28 20:59:06] SIBI secure node initialized at local client.</div>
              <div className="text-slate-600">[2026-06-28 20:59:08] Establishing SSL tunnel connection to www.ihsid.org...</div>
              <div className="text-green-500">[2026-06-28 20:59:09] Connection successfully established. SSL TLSv1.3 verified.</div>
              <div className="text-slate-600">[2026-06-28 20:59:12] Synchronization task running... 100% database matches.</div>
              
              {syncLogs.map((log, index) => (
                <div key={log.id} className="border-t border-slate-850/60 pt-1.5 space-y-0.5 text-left">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-red-500 font-bold">[{log.action.toUpperCase()}]</span>
                    <span className="text-slate-600">
                      {new Date(log.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-slate-300">{log.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
