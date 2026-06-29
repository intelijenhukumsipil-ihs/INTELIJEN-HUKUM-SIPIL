import React, { useState } from "react";
import { 
  Newspaper, 
  User, 
  Calendar, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink,
  PlusCircle,
  FileText,
  BookOpen,
  Rss,
  PenTool,
  CheckCircle,
  X,
  UploadCloud,
  Image,
  Trash2
} from "lucide-react";
import { NewsItem } from "../types";

interface MediaEdukasiViewProps {
  newsList: NewsItem[];
  onCreatePublication: (newPub: Omit<NewsItem, 'id' | 'date' | 'author'>) => Promise<any>;
}

export default function MediaEdukasiView({ newsList, onCreatePublication }: MediaEdukasiViewProps) {
  const [copiedPubId, setCopiedPubId] = useState<string | null>(null);
  const [selectedPub, setSelectedPub] = useState<NewsItem | null>(newsList[0] || null);
  const [isDrafting, setIsDrafting] = useState(false);

  // Form State for new press release / edu
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<NewsItem['category']>("Rilis Pers");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftError, setDraftError] = useState("");

  // Upload state & drag handlers
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setDraftError("Format berkas harus berupa JPG atau PNG.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setDraftError("Ukuran berkas gambar tidak boleh melebihi 10MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setImageUrl(uploadEvent.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleCopyLink = (pubId: string, title: string) => {
    const shareText = `*${title}*\n\nBaca rilis pers resmi selengkapnya di platform Intelijen Hukum Sipil (IHS): www.ihsid.org`;
    navigator.clipboard.writeText(shareText);
    setCopiedPubId(pubId);
    setTimeout(() => setCopiedPubId(null), 2000);
  };

  const handleCreateRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    setDraftError("");

    if (!title.trim() || !summary.trim() || !content.trim()) {
      setDraftError("Mohon lengkapi seluruh kolom wajib untuk meluncurkan rilis pers.");
      return;
    }

    setIsSubmitting(true);
    try {
      const savedPub = await onCreatePublication({
        title,
        summary,
        content,
        category,
        imageUrl: imageUrl || undefined
      });
      setSelectedPub(savedPub);
      setIsDrafting(false);
      
      // Reset form
      setTitle("");
      setSummary("");
      setContent("");
      setImageUrl("");
      setImageMode("upload");
    } catch (err: any) {
      setDraftError("Koneksi gagal atau validasi server www.ihsid.org ditolak.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-sans tracking-tight">
            <Newspaper className="w-6 h-6 text-red-600" />
            Media Massa & Edukasi Hukum Publik
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Saluran berita resmi, rilis pers kasus, dan panduan edukasi perjuangan hak perdata warga sipil
          </p>
        </div>
        <button
          onClick={() => setIsDrafting(true)}
          className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-lg shadow-red-950/40"
        >
          <PenTool className="w-4 h-4" />
          RILIS INFORMASI BARU
        </button>
      </div>

      {/* Admin drafting modal */}
      {isDrafting && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-slate-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl my-8">
            <div className="bg-[#050505] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono flex items-center gap-2">
                <PenTool className="w-4 h-4 text-red-500" />
                DRAF RILIS PERS / EDUKASI (PENGELOLA IHS)
              </h3>
              <button 
                onClick={() => setIsDrafting(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRelease} className="p-6 space-y-4 max-h-[550px] overflow-y-auto">
              {draftError && (
                <div className="p-3 bg-red-950/40 border border-red-900 text-red-400 rounded text-xs">
                  {draftError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="sm:col-span-1 space-y-1">
                  <label className="text-xs text-slate-400 font-semibold block">Kategori Rilis:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-9 bg-[#050505] border border-slate-800 text-xs rounded p-2 text-slate-200 outline-none focus:border-red-600"
                  >
                    <option value="Rilis Pers">Rilis Pers Resmi</option>
                    <option value="Edukasi">Edukasi Hukum Mandiri</option>
                    <option value="Kabar Kasus">Perkembangan Kasus Aktif</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs text-slate-400 font-semibold block flex items-center justify-between">
                    <span>Metode Media Sampul:</span>
                    <span className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setImageMode("upload")}
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded transition cursor-pointer ${imageMode === "upload" ? "bg-red-950 text-red-500 border border-red-900" : "bg-slate-900 text-slate-400 border border-slate-800"}`}
                      >
                        UNGGAH GAMBAR (JPG/PNG)
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode("url")}
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded transition cursor-pointer ${imageMode === "url" ? "bg-red-950 text-red-500 border border-red-900" : "bg-slate-900 text-slate-400 border border-slate-800"}`}
                      >
                        ALAMAT URL GAMBAR
                      </button>
                    </span>
                  </label>

                  {imageMode === "upload" ? (
                    <div className="space-y-2">
                      {/* Drag & Drop Zone */}
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer relative min-h-[96px] ${
                          isDragging 
                            ? "border-red-500 bg-red-950/10" 
                            : imageUrl 
                              ? "border-slate-850 bg-slate-950/10" 
                              : "border-slate-800 hover:border-slate-700 bg-[#050505]"
                        }`}
                        onClick={() => document.getElementById("file-upload-input")?.click()}
                      >
                        <input
                          id="file-upload-input"
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileChange(e.target.files[0]);
                            }
                          }}
                        />
                        
                        {imageUrl ? (
                          <div className="flex items-center gap-4 w-full px-2">
                            <div className="w-16 h-12 rounded border border-slate-800 overflow-hidden shrink-0 relative bg-black">
                              <img src={imageUrl} alt="Pratinjau" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-[11px] font-bold text-white line-clamp-1">Media Terpilih (Siap Unggah)</p>
                              <p className="text-[10px] text-slate-500 font-mono">Format JPG/PNG • Terkompresi</p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageUrl("");
                              }}
                              className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-500 rounded border border-red-900/40 cursor-pointer transition flex items-center justify-center shrink-0"
                              title="Hapus gambar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="w-6 h-6 text-slate-500" />
                            <p className="text-[11px] text-slate-300">
                              <span className="text-red-500 font-bold">Klik untuk memilih</span> atau seret file gambar ke sini
                            </p>
                            <p className="text-[9px] text-slate-500 font-mono">
                              MENDUKUNG FORMAT JPG, JPEG, ATAU PNG (MAKS 10MB)
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Masukkan alamat URL gambar (Contoh: https://images.unsplash.com/...)"
                        value={imageUrl.startsWith("data:") ? "" : imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full h-9 bg-[#050505] border border-slate-800 text-xs rounded p-2 text-slate-200 outline-none focus:border-red-600 pr-10"
                      />
                      <span className="absolute right-3 top-2.5">
                        <Image className="w-4 h-4 text-slate-500" />
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs text-slate-400 font-semibold block">Judul Rilis / Artikel:</label>
                <input 
                  type="text" 
                  placeholder="Ketik judul artikel yang menarik..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#050505] border border-slate-800 text-xs rounded p-2 text-slate-200 outline-none font-bold focus:border-red-600"
                  required
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs text-slate-400 font-semibold block">Ringkasan Satu Kalimat:</label>
                <input 
                  type="text" 
                  placeholder="Ringkasan singkat yang muncul di feed berita..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-[#050505] border border-slate-800 text-xs rounded p-2 text-slate-200 outline-none focus:border-red-600"
                  required
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs text-slate-400 font-semibold block">Konten Artikel Lengkap (Mendukung Markdown):</label>
                <textarea 
                  rows={8}
                  placeholder="## Kepala Berita... Tulis teks draf di sini. Gunakan pemisah paragraf yang jelas."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#050505] border border-slate-800 text-xs rounded p-2 text-slate-200 outline-none font-mono leading-relaxed focus:border-red-600"
                  required
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-850 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsDrafting(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-400 rounded-lg text-xs font-mono font-bold border border-slate-800"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? "MELUNCURKAN..." : "SINKRONKAN RILIS PUBLIK"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of publications */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Arsip Informasi Publik:</h3>
          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            {newsList.map((news) => (
              <div 
                key={news.id}
                onClick={() => setSelectedPub(news)}
                className={`bg-[#050505] border rounded-xl overflow-hidden cursor-pointer transition flex flex-col justify-between hover:border-red-900/40 ${
                  selectedPub?.id === news.id ? "border-red-600 bg-[#0c0c0c]" : "border-slate-800"
                }`}
              >
                {news.imageUrl && (
                  <div className="h-28 overflow-hidden relative">
                    <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <span className="absolute top-2 left-2 text-[9px] font-bold font-mono text-white bg-red-700 px-2 py-0.5 rounded shadow">
                      {news.category}
                    </span>
                  </div>
                )}
                
                <div className="p-4 space-y-1.5 text-left">
                  {!news.imageUrl && (
                    <span className="text-[9px] font-bold font-mono text-red-500 bg-red-950/20 px-2 py-0.5 rounded border border-red-900/30">
                      {news.category}
                    </span>
                  )}
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">{news.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{news.summary}</p>
                </div>

                <div className="px-4 py-2 border-t border-slate-850/60 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                  <span>{news.author}</span>
                  <span>{new Date(news.date).toLocaleDateString("id-ID", { day: '2-digit', month: 'short' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Columns: Read Article Panel */}
        <div className="lg:col-span-2 text-left">
          {selectedPub ? (
            <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl p-5 sm:p-8 space-y-6 text-left">
              {/* Cover Image */}
              {selectedPub.imageUrl && (
                <div className="h-56 sm:h-72 w-full rounded-xl overflow-hidden border border-slate-850">
                  <img src={selectedPub.imageUrl} alt={selectedPub.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}

              {/* Meta information info */}
              <div className="space-y-2 border-b border-slate-850 pb-4">
                <div className="flex items-center justify-between flex-wrap gap-2 text-left">
                  <span className="text-[10px] font-mono font-bold text-red-500 bg-red-950/20 border border-red-900/30 px-2.5 py-0.5 rounded">
                    {selectedPub.category}
                  </span>
                  
                  <button
                    onClick={() => handleCopyLink(selectedPub.id, selectedPub.title)}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-lg font-mono text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedPubId === selectedPub.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        LINK SOSMED DISALIN!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        BAGIKAN ARTIKEL
                      </>
                    )}
                  </button>
                </div>

                <h3 className="text-lg sm:text-2xl font-black text-white leading-tight font-sans">{selectedPub.title}</h3>
                
                <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono pt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    Penulis: {selectedPub.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(selectedPub.date).toLocaleString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Article Content Area */}
              <div className="text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4 font-sans whitespace-pre-line text-left">
                {selectedPub.content}
              </div>

              {/* Tembusan Portal Footer */}
              <div className="bg-[#050505] border border-slate-850 p-4 rounded-xl flex items-center justify-between flex-wrap gap-3 mt-6">
                <div className="flex items-center gap-2">
                  <Rss className="w-4 h-4 text-red-600" />
                  <span className="text-[10px] text-slate-400 font-mono">SIARAN RESMI MEDIA INTEGRITAS WWW.IHSID.ORG</span>
                </div>
                <a
                  href="https://wa.me/6285222322254"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono font-bold text-green-400 bg-green-950/10 border border-green-900/30 px-3 py-1 rounded-lg transition-all flex items-center gap-1 hover:bg-green-950/20"
                >
                  KONTAK HUMAS VIA WA
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-10 text-center text-xs text-slate-500 font-mono">
              Belum ada berita terbit untuk dibaca.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
