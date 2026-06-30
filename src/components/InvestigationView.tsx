import React, { useState } from "react";
import { 
  Search as SearchIcon, 
  Eye, 
  MapPin, 
  FolderLock, 
  Brain, 
  Activity, 
  Calendar, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  Target, 
  Octagon,
  Lock,
  ChevronRight,
  Shield,
  Clock,
  Printer,
  ChevronDown
} from "lucide-react";
import { CaseReport } from "../types";

interface InvestigationViewProps {
  cases: CaseReport[];
  onTriggerAIAnalysis: (caseId: string) => Promise<any>;
  onUpdateCaseStatus?: (caseId: string, newStatus: CaseReport['status']) => Promise<any>;
}

export default function InvestigationView({ cases, onTriggerAIAnalysis, onUpdateCaseStatus }: InvestigationViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(cases[0]?.id || null);
  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0] || null;
  const [analyzingCaseId, setAnalyzingCaseId] = useState<string | null>(null);

  // Status mapping helper
  const renderStatusBadge = (status: CaseReport['status']) => {
    switch (status) {
      case "diterima":
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-green-400 bg-green-950/40 px-2 py-0.5 rounded border border-green-900/60 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
            DITERIMA
          </span>
        );
      case "verifikasi":
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-yellow-500 bg-yellow-950/40 px-2 py-0.5 rounded border border-yellow-900/60 font-mono">
            <Loader2 className="w-3.5 h-3.5 text-yellow-500 shrink-0 animate-spin" />
            VERIFIKASI
          </span>
        );
      case "penanganan":
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/60 font-mono">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
            DIADVOKASI
          </span>
        );
      case "selesai":
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/60 font-mono">
            <Target className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            SELESAI
          </span>
        );
      case "ditutup":
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 bg-zinc-800/40 px-2 py-0.5 rounded border border-zinc-700/60 font-mono">
            <Octagon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            DITUTUP
          </span>
        );
      default:
        return null;
    }
  };

  // Filter cases
  const filteredCases = cases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || c.category.includes(selectedCategory);
    const matchesStatus = selectedStatus === "Semua" || c.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate region density
  const getRegionStats = () => {
    const stats: Record<string, number> = { "Kalimantan": 0, "Sumatera": 0, "Jawa": 0, "Papua": 0, "Sulawesi": 0, "Bali/Nusa Tenggara": 0 };
    cases.forEach(c => {
      const loc = c.location.toLowerCase();
      if (loc.includes("kalimantan") || loc.includes("pontianak") || loc.includes("sanggau")) stats["Kalimantan"]++;
      else if (loc.includes("sumatera") || loc.includes("medan") || loc.includes("deli")) stats["Sumatera"]++;
      else if (loc.includes("jawa") || loc.includes("sleman") || loc.includes("tangerang") || loc.includes("banten") || loc.includes("jakarta")) stats["Jawa"]++;
      else if (loc.includes("papua")) stats["Papua"]++;
      else if (loc.includes("sulawesi")) stats["Sulawesi"]++;
      else stats["Bali/Nusa Tenggara"]++;
    });
    return stats;
  };

  const handleRunAIAnalysis = async (caseId: string) => {
    setAnalyzingCaseId(caseId);
    try {
      await onTriggerAIAnalysis(caseId);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingCaseId(null);
    }
  };

  const regionStats = getRegionStats();

  return (
    <div className="space-y-6">
      {/* Top Map / Density Dashboard Widget */}
      <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 shadow-lg text-left">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 font-sans">
          <Activity className="w-5 h-5 text-red-500" />
          PETA SEBARAN KONFLIK & INTELIJEN WILAYAH (NASIONAL)
        </h3>
        
        {/* Geographic Distribution Dashboard Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(regionStats).map(([region, count]) => (
            <div key={region} className="bg-[#050505] border border-slate-800 p-3 rounded-lg flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-bold font-sans truncate">{region}</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-black text-white">{count}</span>
                <span className="text-[10px] text-slate-500 font-mono">KASUS</span>
              </div>
              <div className="w-full bg-slate-900 h-1 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-red-600 h-1 rounded-full" 
                  style={{ width: `${Math.min((count / (cases.length || 1)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Column: Cases Search and List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-4 space-y-3 text-left">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Filter Laporan Kasus:</h4>
            
            {/* Search Input */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Cari Tiket, Judul, Lokasi..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#050505] border border-slate-800 focus:border-red-600 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-300 outline-none transition"
              />
              <SearchIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2" />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Kategori:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#050505] border border-slate-800 text-xs rounded-lg p-1.5 text-slate-300 outline-none cursor-pointer"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Agraria/Lingkungan">Agraria & Lingkungan</option>
                <option value="Tanah/Properti">Tanah & Properti</option>
                <option value="HAM/Kekerasan">HAM & Aparat</option>
                <option value="Ketenagakerjaan">Ketenagakerjaan</option>
                <option value="Korupsi/Wewenang">Korupsi & Wewenang</option>
                <option value="Digital/Pendapat">Digital & Opini</option>
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Status Progres:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-[#050505] border border-slate-800 text-xs rounded-lg p-1.5 text-slate-300 outline-none cursor-pointer"
              >
                <option value="Semua">Semua Status</option>
                <option value="diterima">Diterima</option>
                <option value="verifikasi">Sedang Diverifikasi</option>
                <option value="penanganan">Dalam Penanganan</option>
                <option value="selesai">Selesai</option>
                <option value="ditutup">Ditutup</option>
              </select>
            </div>
          </div>

          {/* Case List Display */}
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl max-h-[450px] overflow-y-auto divide-y divide-slate-850">
            {filteredCases.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">
                Tidak ada laporan kasus yang cocok dengan kriteria filter.
              </div>
            ) : (
              filteredCases.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-3.5 hover:bg-slate-900/40 cursor-pointer transition text-left space-y-2 ${
                    selectedCaseId === c.id ? "bg-slate-900/60 border-l-2 border-red-600" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-red-500 font-mono">{c.ticketNumber}</span>
                    {renderStatusBadge(c.status)}
                  </div>
                  
                  <h5 className="text-xs font-bold text-white leading-tight line-clamp-2 font-sans">{c.title}</h5>
                  
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0 text-red-600" />
                      {c.location.split(",")[0]}
                    </span>
                    <span>{new Date(c.dateSubmitted).toLocaleDateString("id-ID", { day: '2-digit', month: 'short' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 2 Columns: Confidential Dossier Detail Case & AI Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCase ? (
            <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 sm:p-7 space-y-6 text-left">
              {/* Dossier Title Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-850 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-red-500 font-extrabold tracking-widest font-mono uppercase bg-red-950/20 px-2 py-0.5 rounded border border-red-900/30">
                      BERKAS INTELIJEN SIPIL: {selectedCase.ticketNumber}
                    </span>
                    {renderStatusBadge(selectedCase.status)}
                    {onUpdateCaseStatus && (
                      <div className="flex items-center gap-1.5 ml-1">
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Ubah Progres:</span>
                        <select
                          value={selectedCase.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value as any;
                            await onUpdateCaseStatus(selectedCase.id, newStatus);
                          }}
                          className="bg-[#050505] border border-slate-800 text-[10px] rounded px-2 py-0.5 text-slate-300 font-mono focus:border-red-650 outline-none cursor-pointer transition hover:bg-slate-900"
                        >
                          <option value="diterima">DITERIMA</option>
                          <option value="verifikasi">VERIFIKASI</option>
                          <option value="penanganan">DIADVOKASI</option>
                          <option value="selesai">SELESAI</option>
                          <option value="ditutup">DITUTUP</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug font-sans tracking-tight">{selectedCase.title}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      {selectedCase.location}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      {new Date(selectedCase.dateSubmitted).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </p>
                </div>
              </div>

              {/* Chronology Display */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest font-mono">Kronologi Kejadian & Laporan Lapangan:</h4>
                <div className="bg-[#050505] border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 leading-relaxed max-h-[220px] overflow-y-auto whitespace-pre-wrap">
                  {selectedCase.chronology}
                </div>
              </div>

              {/* Evidence & Verification files */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Bukti Pengadilan Terdaftar ({selectedCase.evidenceFiles?.length || 0}):</h4>
                {selectedCase.evidenceFiles && selectedCase.evidenceFiles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCase.evidenceFiles.map((f, i) => (
                      <div key={i} className="bg-[#050505] border border-slate-800/60 p-2.5 rounded-lg flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <FolderLock className="w-4 h-4 text-red-500 shrink-0" />
                          <div className="truncate text-left">
                            <p className="text-slate-200 font-bold truncate">{f.name}</p>
                            <p className="text-[8px] text-slate-500 truncate">HASH: {f.hash}</p>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-500 font-bold bg-[#0d0d0d] px-1 py-0.5 rounded shrink-0">{f.size}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Belum ada lampiran bukti fisik terunggah.</p>
                )}
              </div>

              {/* AI ANALYST DOSSIER BOX (GEMINI POWERED) */}
              <div className="border border-red-900/30 bg-red-950/5 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-red-500 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-extrabold text-white tracking-widest font-mono uppercase">
                        AI LEGAL INTEL ANALIS (SISTEM IHS)
                      </h4>
                      <p className="text-[10px] text-slate-400">Penyaringan regulasi nasional Indonesia otomatis</p>
                    </div>
                  </div>
                  
                  {!selectedCase.aiAnalysis && (
                    <button
                      onClick={() => handleRunAIAnalysis(selectedCase.id)}
                      disabled={analyzingCaseId !== null}
                      className="px-4 py-1.5 bg-red-700 hover:bg-red-800 disabled:bg-slate-900 text-white rounded-lg text-xs font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      {analyzingCaseId === selectedCase.id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          MENGANALISIS...
                        </>
                      ) : (
                        <>
                          <Brain className="w-3.5 h-3.5" />
                          MINTA ANALISIS AI
                        </>
                      )}
                    </button>
                  )}
                </div>

                {selectedCase.aiAnalysis ? (
                  /* Confident Dossier Output Display */
                  <div className="space-y-4 pt-2 border-t border-red-950/40">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Risk Level */}
                      <div className="bg-[#050505] p-3 rounded border border-slate-800 text-xs">
                        <span className="text-[10px] text-slate-500 font-bold font-mono uppercase block mb-1">SKOR ANCAMAN/RESIKO:</span>
                        <span className={`text-sm font-black font-mono uppercase tracking-widest ${
                          selectedCase.aiAnalysis.riskLevel === 'Sangat Tinggi' ? 'text-red-500 animate-pulse' : 
                          selectedCase.aiAnalysis.riskLevel === 'Tinggi' ? 'text-orange-550 animate-pulse' : 'text-yellow-500'
                        }`}>
                          ⚠️ {selectedCase.aiAnalysis.riskLevel}
                        </span>
                      </div>

                      {/* Reference Laws */}
                      <div className="bg-[#050505] p-3 rounded border border-slate-800 text-xs">
                        <span className="text-[10px] text-slate-500 font-bold font-mono uppercase block mb-1">REGULASI TERKAIT:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedCase.aiAnalysis.lawsReferenced?.map((law, i) => (
                            <span key={i} className="text-[9px] bg-red-950/20 border border-red-900/30 text-red-400 font-mono px-1.5 py-0.5 rounded">
                              {law}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-[#050505] p-3.5 rounded border border-slate-800 text-xs font-mono">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">RINGKASAN HUKUM INTEL:</span>
                      <p className="text-slate-300 leading-relaxed font-sans">{selectedCase.aiAnalysis.summary}</p>
                    </div>

                    {/* Violated Articles */}
                    <div className="bg-[#050505] p-3.5 rounded border border-slate-800 text-xs font-mono space-y-1.5">
                      <span className="text-[10px] text-red-500 font-extrabold block uppercase tracking-wider">PASAL HUKUM YANG DIDUGA DILANGGAR:</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300 font-sans text-left">
                        {selectedCase.aiAnalysis.violatedArticles?.map((art, i) => (
                          <li key={i} className="text-xs">
                            <span className="font-mono text-red-400 font-bold">{art.split(" (")[0]}</span>
                            {art.includes(" (") && <span> - {art.substring(art.indexOf(" (") + 2, art.length - 1)}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Strategies */}
                    <div className="bg-[#050505] p-3.5 rounded border border-slate-800 text-xs font-mono space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">STRATEGI TAKTIS PEMBELAAN:</span>
                      <ul className="space-y-1.5 text-slate-300 font-sans text-left">
                        {selectedCase.aiAnalysis.actionStrategy?.map((strat, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs">
                            <ChevronRight className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>{strat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Lock className="w-3 h-3 text-red-650" />
                        DEKONSENTRASI AMAN (SSL)
                      </span>
                      <span>Dibuat: {new Date().toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-slate-500 font-mono">
                    Minta analisis cerdas hukum nasional untuk merumuskan pasal yang terlanggar dan strategi advokasi kasus.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-10 text-center text-xs text-slate-500 font-mono">
              Belum ada laporan terdaftar untuk ditinjau.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
