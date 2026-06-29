import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  User, 
  ShieldAlert, 
  ExternalLink, 
  Trash2,
  Lock,
  Scale,
  Brain,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { ConsultationMessage } from "../types";

export default function ConsultationView() {
  const [messages, setMessages] = useState<ConsultationMessage[]>([
    {
      id: "init_1",
      sender: "ai",
      text: "Selamat datang di Bilik Konsultasi Sandi Negara & Hukum Sipil (IHS).\n\nSaya adalah Advokat AI Senior IHS. Saya dapat membantu menganalisis secara instan permasalahan sengketa tanah, tindak pidana aparat, sengketa buruh, atau kriminalisasi pers sesuai kitab hukum positif Indonesia.\n\nHarap dipahami bahwa seluruh percakapan di bilik ini terenkripsi aman SSL. Silakan utarakan poin masalah hukum Anda secara terbuka.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMsg: ConsultationMessage = {
      id: `msg_${Date.now()}`,
      sender: "user",
      text: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error("Gagal tersambung ke server kecerdasan buatan IHS.");
      }

      const data = await response.json();
      
      const aiReply: ConsultationMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: "ai",
        text: data.text,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      // Offline/Error reply fallback handled by backend, but if network actually drops:
      const errorReply: ConsultationMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: "ai",
        text: "Koneksi ke asisten AI sedang sibuk. Namun, jangan khawatir: Kumpulkan semua surat dokumen bukti Anda dan segera layangkan aduan langsung kepada Tim Advokat Pusat kami di nomor WhatsApp resmi IHS: *0852-2232-2254* guna memicu penegakan kasus darurat.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `msg_${Date.now()}`,
        sender: "ai",
        text: "Sesi obrolan baru dimulai. Silakan utarakan kronologi atau pertanyaan hukum Anda secara detail agar saya dapat memberikan landasan pasal dan aturan taktis terkait.",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const getWhatsAppURL = () => {
    const text = `*KONSULTASI HUKUM DARURAT - INTELIJEN HUKUM SIPIL (IHS)*
---------------------------------------------
Halo Tim Advokat Pusat IHS, saya memerlukan bantuan hukum mendesak terkait permasalahan sengketa sipil. Mohon panduan langkah taktis. Terima kasih. www.ihsid.org`;
    return `https://wa.me/6285222322254?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-sans tracking-tight">
            <MessageSquare className="w-6 h-6 text-red-600" />
            Konsultasi Hukum Sandi & AI Advokat
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Asisten konsultasi instan ditenagai kecerdasan buatan hukum sengketa sipil, terenkripsi aman
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearChat}
            className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-red-550 rounded-lg transition-all cursor-pointer"
            title="Bersihkan Sesi Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 bg-red-950/20 border border-red-900/30 text-red-400 px-3 py-1.5 rounded-lg text-xs font-mono font-bold">
            <Lock className="w-3.5 h-3.5" />
            TERENKRIPSI SSL
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: WhatsApp Hotline Reminder Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-red-500 uppercase tracking-widest block">HOTLINE ADUAN</span>
              <h4 className="text-xs font-bold text-white font-sans">Gelar Investigasi Lapangan</h4>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Konsultasi AI sangat akurat untuk referensi dasar hukum. Namun, untuk perlawanan riil hukum & litigasi pengadilan, Anda memerlukan pembelaan dari Tim Pengacara Lapangan IHS.
            </p>

            <div className="border-t border-slate-850 pt-3 space-y-2">
              <div className="text-[10px] text-green-500 font-mono font-bold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                WhatsApp Terintegrasi:
              </div>
              <div className="text-sm font-black text-white font-mono">0852-2232-2254</div>
            </div>

            <a
              href={getWhatsAppURL()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-green-700 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer text-center"
            >
              Hubungi Advokat Pusat
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-red-950/10 border border-red-900/20 rounded-xl p-4 flex gap-2.5">
            <ShieldAlert className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-400 font-mono leading-relaxed text-left">
              Seluruh riwayat obrolan konsultasi berada di memori lokal perorangan Anda dan akan terhapus total ketika Anda me-refresh browser demi perlindungan data saksi pelapor.
            </p>
          </div>
        </div>

        {/* Right Columns: Interactive Chat App */}
        <div className="lg:col-span-3 flex flex-col bg-[#0a0a0a] border border-slate-800 rounded-2xl h-[520px] overflow-hidden shadow-xl shadow-black/40 text-left">
          {/* Top chat status bar */}
          <div className="bg-[#050505] border-b border-slate-850 px-4 py-3 flex items-center justify-between text-left">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
              <div>
                <span className="text-xs font-extrabold text-white block leading-none font-sans">Advokat AI Senior (IHS)</span>
                <span className="text-[9px] text-slate-500 font-mono">Draf Regulasi UU RI Terpadu</span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-slate-400 bg-[#0a0a0a] px-2.5 py-0.5 rounded-lg border border-slate-800 flex items-center gap-1">
              <Brain className="w-3 h-3 text-red-500" />
              SISTEM INTERAKTIF
            </span>
          </div>

          {/* Chat bubbles list area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[380px] text-left">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex gap-3 max-w-[85%] ${m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto text-left"}`}
              >
                {/* Avatar icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  m.sender === "user" 
                    ? "bg-red-950/40 text-red-500 border-red-900/40" 
                    : "bg-[#050505] text-slate-400 border-slate-850"
                }`}>
                  {m.sender === "user" ? <User className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
                </div>

                {/* Message Bubble box */}
                <div className={`p-3 rounded-2xl text-xs space-y-1 leading-relaxed ${
                  m.sender === "user"
                    ? "bg-red-700 text-white rounded-tr-none font-bold"
                    : "bg-[#050505] text-slate-300 border border-slate-850 rounded-tl-none whitespace-pre-wrap font-sans"
                }`}>
                  <p>{m.text}</p>
                  <span className={`text-[8px] font-mono block text-right ${m.sender === "user" ? "text-red-200" : "text-slate-500"}`}>
                    {new Date(m.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[80%] mr-auto text-left">
                <div className="w-8 h-8 rounded-full bg-[#050505] text-slate-400 border border-slate-850 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-[#050505] text-slate-400 border border-slate-850 p-3.5 rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                  <span className="text-slate-500 font-mono italic animate-pulse">Advokat AI sedang merumuskan draf pasal undang-undang...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Form input field bar */}
          <form onSubmit={handleSendMessage} className="bg-[#050505] border-t border-slate-850 p-3 flex gap-2 text-left">
            <input 
              type="text"
              placeholder="Tulis kronologi sengketa / pertanyaan dasar hukum Anda di sini..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-[#0a0a0a] border border-slate-800 focus:border-red-600 rounded-xl px-4 py-2.5 text-xs text-slate-300 outline-none transition-all"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 bg-red-750 hover:bg-red-700 disabled:bg-slate-850 text-white rounded-xl transition cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
