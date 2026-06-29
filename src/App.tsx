import React, { useState, useEffect } from "react";
import { 
  Home, 
  FileText, 
  Search, 
  FolderOpen, 
  Gavel, 
  MessageSquare, 
  Newspaper, 
  Network, 
  Settings, 
  Send, 
  Menu, 
  X, 
  Activity, 
  Lock, 
  ShieldCheck, 
  ExternalLink,
  PhoneCall
} from "lucide-react";

import { CaseReport, LegalTemplate, NewsItem, Member } from "./types";
import HomeView from "./components/HomeView";
import ReportFormView from "./components/ReportFormView";
import InvestigationView from "./components/InvestigationView";
import EvidenceVaultView from "./components/EvidenceVaultView";
import LegalServicesView from "./components/LegalServicesView";
import ConsultationView from "./components/ConsultationView";
import MediaEdukasiView from "./components/MediaEdukasiView";
import JaringanAnggotaView from "./components/JaringanAnggotaView";
import SettingsSyncView from "./components/SettingsSyncView";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data State
  const [cases, setCases] = useState<CaseReport[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [syncLogs, setSyncLogs] = useState<{ id: string; timestamp: string; action: string; detail: string; status: string }[]>([]);

  // Fetch initial seed data from backend
  const fetchData = async () => {
    try {
      // Fetch cases
      const resCases = await fetch("/api/cases");
      if (resCases.ok) {
        const data = await resCases.ok ? await resCases.json() : [];
        setCases(data);
      }
      
      // Fetch news
      const resNews = await fetch("/api/news");
      if (resNews.ok) {
        const data = await resNews.json();
        setNewsList(data);
      }

      // Fetch members
      const resMembers = await fetch("/api/members");
      if (resMembers.ok) {
        const data = await resMembers.json();
        setMembers(data);
      }

      // Fetch sync logs
      const resLogs = await fetch("/api/sync-logs");
      if (resLogs.ok) {
        const data = await resLogs.json();
        setSyncLogs(data);
      }
    } catch (err) {
      console.error("Gagal memuat data awal dari server Express:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler: When a new report is submitted
  const handleCaseSubmitted = (newCase: CaseReport) => {
    setCases(prev => [newCase, ...prev]);
    // Refresh sync logs to show the new sync action
    fetch("/api/sync-logs")
      .then(res => res.json())
      .then(data => setSyncLogs(data))
      .catch(err => console.error(err));
  };

  // Handler: When AI Analysis is triggered
  const handleTriggerAIAnalysis = async (caseId: string) => {
    try {
      const res = await fetch(`/api/cases/${caseId}/analyze`, {
        method: "POST"
      });
      if (!res.ok) throw new Error("Gagal memproses analisis hukum AI.");
      const analysisResult = await res.json();
      
      // Update cases local state
      setCases(prev => prev.map(c => {
        if (c.id === caseId) {
          return { ...c, aiAnalysis: analysisResult };
        }
        return c;
      }));

      // Refresh sync logs
      fetch("/api/sync-logs")
        .then(res => res.json())
        .then(data => setSyncLogs(data));

      return analysisResult;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Handler: Create news publication
  const handleCreatePublication = async (newPub: Omit<NewsItem, 'id' | 'date' | 'author'>) => {
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPub)
      });
      if (!res.ok) throw new Error("Gagal menerbitkan rilis pers.");
      const savedPub = await res.json();
      setNewsList(prev => [savedPub, ...prev]);

      // Refresh sync logs
      fetch("/api/sync-logs")
        .then(res => res.json())
        .then(data => setSyncLogs(data));

      return savedPub;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Handler: Register a member
  const handleRegisterMember = async (newMember: Omit<Member, 'id' | 'isVerified'>) => {
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember)
      });
      if (!res.ok) throw new Error("Gagal mendaftarkan anggota.");
      const savedMember = await res.json();
      setMembers(prev => [...prev, savedMember]);

      // Refresh sync logs
      fetch("/api/sync-logs")
        .then(res => res.json())
        .then(data => setSyncLogs(data));

      return savedMember;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Handler: Run manual DB integrity audit
  const handleTriggerAudit = () => {
    fetch("/api/sync-logs")
      .then(res => res.json())
      .then(data => setSyncLogs(data))
      .catch(err => console.error(err));
  };

  // Main menu items navigation mapper
  const menuItems = [
    { id: "home", label: "Beranda", icon: Home },
    { id: "lapor", label: "Lapor Kasus", icon: FileText },
    { id: "investigasi", label: "Investigasi", icon: Search },
    { id: "bukti", label: "Bukti & Data", icon: FolderOpen },
    { id: "hukum", label: "Layanan Hukum", icon: Gavel },
    { id: "konsultasi", label: "Konsultasi AI", icon: MessageSquare },
    { id: "media", label: "Media & Edukasi", icon: Newspaper },
    { id: "jaringan", label: "Jaringan & Anggota", icon: Network },
    { id: "pengaturan", label: "Pengaturan & Log", icon: Settings },
  ];

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans" style={{ backgroundColor: "#050505" }}>
      
      {/* Top Main Status Bar Header */}
      <header className="bg-[#0a0a0a] border-b border-slate-800 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse shrink-0"></span>
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">STATUS: SERVER ONLINE (WWW.IHSID.ORG)</span>
          <div className="hidden md:block ml-4 border-l border-slate-800 pl-4">
            <p className="italic text-xs text-slate-500 tracking-wide font-medium">
              "Mengungkap Fakta, Mengawal Keadilan, Menegakkan Tanpa Kompromi"
            </p>
          </div>
        </div>

        {/* Global connection/security state */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-red-600 mr-1" />
            E2EE SSL 256-BIT
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right leading-none">
              <p className="text-xs font-bold text-white uppercase tracking-tight">Pusat Komando IHS</p>
              <p className="text-[9px] text-red-500 font-mono">Akses Tingkat Admin</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-200">
              AD
            </div>
          </div>
        </div>

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-1.5 bg-slate-900 text-slate-400 border border-slate-800 rounded-lg cursor-pointer hover:bg-slate-800 transition"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Panel Content (Two Columns layout on Large, single on mobile) */}
      <div className="flex-1 flex">
        
        {/* Left Column Sidebar (Desktop only) */}
        <aside className="hidden lg:flex flex-col justify-between w-64 bg-[#0a0a0a] border-r border-slate-800 shrink-0 p-4">
          <div className="space-y-6">
            {/* Logo Brand visual representation */}
            <div className="p-2 border-b border-slate-800/60 pb-4 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center border border-slate-700 font-black text-white text-md tracking-wider shadow-lg shadow-red-900/20 shrink-0">
                  IHS
                </div>
                <div className="leading-tight">
                  <h1 className="text-xs sm:text-sm font-black text-white tracking-widest uppercase">
                    IHS INDONESIA
                  </h1>
                  <p className="text-[9px] text-slate-500 font-mono tracking-widest leading-none mt-0.5">
                    INTELIJEN HUKUM SIPIL
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest block font-mono px-2">MENU UTAMA IHS:</span>
              <nav className="space-y-1 pt-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold font-sans tracking-wide transition cursor-pointer text-left ${
                        isActive 
                          ? "bg-slate-900 text-white border border-slate-800 shadow shadow-black" 
                          : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                      }`}
                      id={`sidebar-menu-${item.id}`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-red-600" : "text-slate-400"}`} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Quick WhatsApp Mobilization Callout */}
          <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-3 space-y-2 text-left font-mono">
            <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-green-500 animate-pulse" />
              HOTLINE DARURAT
            </div>
            <p className="text-[9px] text-slate-400 leading-normal">
              Butuh pendampingan pengacara lapangan darurat di lokasi perkara?
            </p>
            <a
              href="https://wa.me/6285222322254"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              WhatsApp: 0852-2232-2254
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </aside>

        {/* Mobile menu panel overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-[60px] bg-[#050505]/95 backdrop-blur-md z-20 lg:hidden flex flex-col p-4 space-y-4">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">Navigasi Menu Utama:</div>
            <nav className="grid grid-cols-1 gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition cursor-pointer text-left ${
                      isActive 
                        ? "bg-slate-800 text-white border border-slate-700" 
                        : "text-slate-400 bg-slate-900/60 border border-slate-850"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-red-500" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="bg-red-950/10 border border-red-900/30 p-4 rounded-xl space-y-2.5 text-center font-mono mt-auto">
              <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">HOTLINE ADUAN WHATSAPP</div>
              <div className="text-sm font-bold text-white">0852-2232-2254</div>
              <a
                href="https://wa.me/6285222322254"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-green-600 text-white rounded text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                HUBUNGI SEKARANG
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Right Column: Main viewport rendering */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          
          {/* Dynamic Component Router */}
          {activeTab === "home" && (
            <HomeView 
              onNavigate={(tab) => setActiveTab(tab)} 
              cases={cases}
              syncLogs={syncLogs}
              newsList={newsList}
            />
          )}

          {activeTab === "lapor" && (
            <ReportFormView 
              onCaseSubmitted={handleCaseSubmitted} 
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "investigasi" && (
            <InvestigationView 
              cases={cases} 
              onTriggerAIAnalysis={handleTriggerAIAnalysis}
            />
          )}

          {activeTab === "bukti" && (
            <EvidenceVaultView 
              cases={cases} 
            />
          )}

          {activeTab === "hukum" && (
            <LegalServicesView />
          )}

          {activeTab === "konsultasi" && (
            <ConsultationView />
          )}

          {activeTab === "media" && (
            <MediaEdukasiView 
              newsList={newsList} 
              onCreatePublication={handleCreatePublication}
            />
          )}

          {activeTab === "jaringan" && (
            <JaringanAnggotaView 
              members={members} 
              onRegisterMember={handleRegisterMember}
            />
          )}

          {activeTab === "pengaturan" && (
            <SettingsSyncView 
              syncLogs={syncLogs} 
              onTriggerAudit={handleTriggerAudit}
            />
          )}

        </main>
      </div>

      {/* Global Security Footer */}
      <footer className="bg-[#0a0a0a] border-t border-slate-800 py-3.5 px-8 text-center font-mono text-[10px] text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 uppercase tracking-[0.1em]">
        <span>© 2026 IHS INDONESIA • SECURE ENCRYPTED NETWORK</span>
        <span className="flex items-center justify-center gap-4 text-[10px]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
            SECURE: www.ihsid.org
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline">IP: 182.16.4.122</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline">TLS 1.3 ACTIVE</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline">AES-256</span>
        </span>
      </footer>

    </div>
  );
}
