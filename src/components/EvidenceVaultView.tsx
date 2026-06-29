import React, { useState } from "react";
import { 
  ShieldCheck, 
  FolderLock, 
  Search, 
  FileCheck, 
  Image as ImageIcon, 
  Mic, 
  FileText, 
  Lock, 
  Award,
  Calendar,
  Layers,
  CheckCircle,
  ExternalLink,
  Printer
} from "lucide-react";
import { CaseReport } from "../types";

interface EvidenceVaultViewProps {
  cases: CaseReport[];
}

export default function EvidenceVaultView({ cases }: EvidenceVaultViewProps) {
  const [filterType, setFilterType] = useState<string>("Semua");
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);

  // Gather all evidence files across all cases
  const allEvidence = cases.reduce((acc: any[], currentCase) => {
    if (currentCase.evidenceFiles) {
      currentCase.evidenceFiles.forEach((file) => {
        acc.push({
          ...file,
          caseId: currentCase.id,
          ticketNumber: currentCase.ticketNumber,
          caseTitle: currentCase.title,
          reporterName: currentCase.isAnonymous ? "Rahasia (Anonim)" : currentCase.reporterName,
          dateSubmitted: currentCase.dateSubmitted
        });
      });
    }
    return acc;
  }, []);

  const filteredEvidence = allEvidence.filter((e) => {
    if (filterType === "Semua") return true;
    return e.type === filterType;
  });

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-5 h-5 text-red-500" />;
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "audio":
        return <Mic className="w-5 h-5 text-red-500" />;
      default:
        return <FileCheck className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-sans tracking-tight">
            <ShieldCheck className="w-6 h-6 text-red-600" />
            Bilik Bukti Terenkripsi (Evidence Vault)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gudang pengamanan berkas perkara sipil digital berkekuatan hukum dengan kode verifikasi integritas asimetris
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400">
          <Layers className="w-3.5 h-3.5" />
          TOTAL BUKTI: {allEvidence.length} BERKAS
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Evidence Grid List */}
        <div className="lg:col-span-2 space-y-4">
          {/* File type filter bar */}
          <div className="flex flex-wrap gap-2 bg-[#0a0a0a] p-2 border border-slate-800 rounded-xl">
            {["Semua", "image", "pdf", "audio"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition font-mono uppercase cursor-pointer ${
                  filterType === t 
                    ? "bg-red-700 text-white shadow-md" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t === "Semua" ? "Semua Berkas" : t === "image" ? "Gambar" : t === "pdf" ? "PDF" : "Audio / Suara"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredEvidence.length === 0 ? (
              <div className="col-span-2 bg-[#0a0a0a] border border-slate-800 p-12 text-center rounded-xl text-slate-500 text-xs font-mono">
                Tidak ada berkas bukti dengan tipe terpilih di database.
              </div>
            ) : (
              filteredEvidence.map((ev, i) => (
                <div 
                  key={i}
                  onClick={() => setSelectedEvidence(ev)}
                  className={`bg-[#050505] border p-4 rounded-xl cursor-pointer transition flex flex-col justify-between space-y-3 hover:border-red-900/40 ${
                    selectedEvidence?.hash === ev.hash ? "border-red-600 bg-[#0c0c0c]" : "border-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#0a0a0a] rounded-lg border border-slate-850/60">
                        {getEvidenceIcon(ev.type)}
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-white truncate max-w-[150px]">{ev.name}</h4>
                        <p className="text-[10px] text-slate-500 font-mono">{ev.size} • {ev.type.toUpperCase()}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-red-500 font-bold bg-red-950/20 px-2 py-0.5 rounded border border-red-900/30 shrink-0">
                      {ev.ticketNumber}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[8px] text-slate-500 font-mono truncate">HASH: {ev.hash}</div>
                    <p className="text-[11px] text-slate-400 truncate">Kasus: {ev.caseTitle}</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-850/60 pt-2">
                    <span className="truncate">Saksi: {ev.reporterName}</span>
                    <span>{new Date(ev.dateSubmitted).toLocaleDateString("id-ID", { day: '2-digit', month: 'short' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Column: Certificate of Evidence Integrity */}
        <div className="lg:col-span-1">
          {selectedEvidence ? (
            <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 relative overflow-hidden space-y-4">
              {/* Certificate Watermark Design */}
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Award className="w-48 h-48 text-white" />
              </div>

              <div className="text-center border-b border-slate-850 pb-3 space-y-1">
                <div className="inline-flex p-1 bg-red-950/40 border border-red-900/30 text-red-500 rounded-full mb-1">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">SERTIFIKAT INTEGRITAS BUKTI</h3>
                <p className="text-[9px] text-slate-500 font-mono">SISTEM INTEGRITAS BARANG BUKTI IHS (SIBI)</p>
              </div>

              {/* Certificate metadata dossier list */}
              <div className="space-y-3 font-mono text-xs">
                <div className="bg-[#050505] p-2.5 rounded-lg border border-slate-850 space-y-0.5">
                  <span className="text-[9px] text-slate-500 block">NAMA BERKAS:</span>
                  <span className="text-red-500 font-bold break-all">{selectedEvidence.name}</span>
                </div>

                <div className="bg-[#050505] p-2.5 rounded-lg border border-slate-850 space-y-0.5">
                  <span className="text-[9px] text-slate-500 block">KODE INTEGRITAS BUKTI (SHA-256 HASH):</span>
                  <span className="text-slate-200 font-bold break-all text-[11px]">{selectedEvidence.hash}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#050505] p-2.5 rounded-lg border border-slate-850 space-y-0.5">
                    <span className="text-[9px] text-slate-500 block">UKURAN BERKAS:</span>
                    <span className="text-slate-300 font-bold">{selectedEvidence.size}</span>
                  </div>
                  <div className="bg-[#050505] p-2.5 rounded-lg border border-slate-850 space-y-0.5">
                    <span className="text-[9px] text-slate-500 block">TIPE DATA:</span>
                    <span className="text-zinc-300 font-bold uppercase">{selectedEvidence.type}</span>
                  </div>
                </div>

                <div className="bg-[#050505] p-2.5 rounded-lg border border-slate-850 space-y-0.5">
                  <span className="text-[9px] text-slate-500 block">DIKIRIM OLEH SAKSI:</span>
                  <span className="text-slate-300 font-bold">{selectedEvidence.reporterName}</span>
                </div>

                <div className="bg-[#050505] p-2.5 rounded-lg border border-slate-850 space-y-0.5">
                  <span className="text-[9px] text-slate-500 block">WAKTU DIUNGGAH KEDUA:</span>
                  <span className="text-zinc-300 font-bold">{new Date(selectedEvidence.dateSubmitted).toLocaleString("id-ID")}</span>
                </div>

                <div className="bg-[#050505] p-2.5 rounded-lg border border-slate-850 space-y-0.5">
                  <span className="text-[9px] text-slate-500 block">KORELASI NOMOR TIKET PERKARA:</span>
                  <span className="text-zinc-300 font-bold text-red-500">{selectedEvidence.ticketNumber}</span>
                </div>
              </div>

              {/* Proof of admissibility seal */}
              <div className="bg-[#050505] border border-slate-850 p-3 rounded-lg flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-green-500 shrink-0" />
                <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
                  Berkas ini telah ditandatangani secara digital menggunakan hash algoritmik. Keabsahan metadata 
                  diakui sebagai bukti permulaan digital sesuai UU ITE Pasal 5 Ayat (1) Republik Indonesia.
                </p>
              </div>

              <div className="flex items-center gap-2 justify-center pt-2">
                <button 
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-lg text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 w-full cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  CETAK SERTIFIKAT
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500 font-mono space-y-2">
              <FolderLock className="w-8 h-8 text-slate-600 mx-auto" />
              <p>PILIH SALAH SATU BARANG BUKTI DIGITAL UNTUK MEMERIKSA SERTIFIKAT INTEGRITAS DAN KODE KEAMANAN.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
