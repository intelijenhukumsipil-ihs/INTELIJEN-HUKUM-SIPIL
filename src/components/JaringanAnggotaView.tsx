import React, { useState } from "react";
import { Member } from "../types";

// Let's import Lucide icons directly
import { 
  Network as NetworkIcon,
  Users as UsersIcon,
  UserPlus as UserPlusIcon,
  MessageSquare as MessageSquareIcon,
  ShieldCheck as ShieldCheckIcon,
  MapPin as MapPinIcon,
  FileCheck as FileCheckIcon,
  Send as SendIcon,
  Lock as LockIcon,
  ExternalLink as ExternalLinkIcon,
  ThumbsUp as ThumbsUpIcon,
  AlertOctagon as AlertOctagonIcon,
  Sparkles,
  ChevronRight
} from "lucide-react";

interface JaringanAnggotaViewProps {
  members: Member[];
  onRegisterMember: (newMember: Omit<Member, 'id' | 'isVerified'>) => Promise<any>;
}

export interface ForumPost {
  id: string;
  author: string;
  role: string;
  avatarText: string;
  text: string;
  timestamp: string;
  likes: number;
}

export default function JaringanAnggotaView({ members, onRegisterMember }: JaringanAnggotaViewProps) {
  const [activeTab, setActiveTab] = useState<"mitra" | "daftar" | "diskusi">("mitra");
  
  // Registration Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState<Member['role']>("Relawan Lapangan");
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [regError, setRegError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Forum Discussion state
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    {
      id: "post_1",
      author: "Rian Hidayat",
      role: "Aktivis LSM (Sinergi Hijau Nusantara)",
      avatarText: "RH",
      text: "Rekan-rekan advokat di Kalimantan Barat, mohon perhatiannya atas kasus sengketa sawit di Sanggau (Tiket IHS-2026-0001). Perusahaan mulai meratakan tanaman ulayat milik warga adat pagi ini. Kita butuh somasi tandingan darurat tertulis agar polisi setempat bersikap netral.",
      timestamp: "2026-06-28T19:40:00Z",
      likes: 8
    },
    {
      id: "post_2",
      author: "Andi Saputra, S.H.",
      role: "Advokat Senior LBH Keadilan Rakyat",
      avatarText: "AS",
      text: "Siap, Bung Rian. Saya sedang mempelajari analisis pasal dari AI Intel IHS barusan. Unsur penyerobotan Pasal 385 KUHP terpenuhi. Kami akan menerbitkan draf somasi resmi siang ini ke Kapolres dan Direksi Perusahaan. Mohon tim lapangan amankan rekaman video penggusuran sebagai alat bukti primer digital.",
      timestamp: "2026-06-28T20:15:00Z",
      likes: 12
    }
  ]);
  const [newCommentText, setNewCommentText] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!name.trim() || !location.trim()) {
      setRegError("Mohon lengkapi Nama Lengkap dan Lokasi wilayah tugas Anda.");
      return;
    }

    setIsRegistering(true);
    try {
      await onRegisterMember({
        name,
        role,
        organization: organization || "Independen",
        location
      });
      setIsRegistered(true);
    } catch (err) {
      setRegError("Gagal tersambung ke server sinkronisasi keanggotaan.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newPost: ForumPost = {
      id: `post_${Date.now()}`,
      author: "Tamu Penyelidik",
      role: "Partisipan Gerakan Keadilan Sipil",
      avatarText: "TP",
      text: newCommentText,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    setForumPosts(prev => [...prev, newPost]);
    setNewCommentText("");
  };

  const handleLikePost = (postId: string) => {
    setForumPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6 text-left">
      {/* Tab select bar */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("mitra")}
          className={`px-5 py-3 text-xs sm:text-sm font-bold font-mono tracking-wider transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "mitra" 
              ? "border-red-600 text-white" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <UsersIcon className="w-4 h-4" />
          DAFTAR MITRA & ADVOKAT
        </button>
        <button
          onClick={() => setActiveTab("daftar")}
          className={`px-5 py-3 text-xs sm:text-sm font-bold font-mono tracking-wider transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "daftar" 
              ? "border-red-600 text-white" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <UserPlusIcon className="w-4 h-4" />
          GABUNG JARINGAN IHS
        </button>
        <button
          onClick={() => setActiveTab("diskusi")}
          className={`px-5 py-3 text-xs sm:text-sm font-bold font-mono tracking-wider transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "diskusi" 
              ? "border-red-600 text-white" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <MessageSquareIcon className="w-4 h-4" />
          FORUM DISKUSI SOLIDARITAS
        </button>
      </div>

      {/* Render Active View Tab */}
      {activeTab === "mitra" && (
        <div className="space-y-6">
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 flex gap-3.5 items-start">
            <ShieldCheckIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white font-sans">Aliansi Pembela Sipil Tersumpah</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Daftar terverifikasi advokat pro-bono, aktivis LSM agraria, wartawan independen, dan relawan satgas lapangan 
                yang terhubung langsung dalam sistem respons cepat IHS di seluruh daerah Indonesia.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member) => (
              <div key={member.id} className="bg-[#0a0a0a] border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#050505] border border-slate-800 flex items-center justify-center font-bold text-red-500 font-mono text-sm shrink-0">
                    {member.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {member.name}
                      {member.isVerified && (
                        <ShieldCheckIcon className="w-3.5 h-3.5 text-red-500 shrink-0" title="Verifikasi Pusat Sukses" />
                      )}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {member.role} • {member.organization}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                      <MapPinIcon className="w-3 h-3 text-red-600" />
                      {member.location}
                    </p>
                  </div>
                </div>

                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                  member.isVerified 
                    ? "bg-red-950/20 border-red-900/30 text-red-400" 
                    : "bg-[#050505] border-slate-800 text-slate-500"
                }`}>
                  {member.isVerified ? "VERIFIED MITRA" : "PROSES VERIFIKASI"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "daftar" && (
        <div className="max-w-2xl mx-auto">
          {isRegistered ? (
            /* Registration Success Screen */
            <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-red-950/40 text-red-500 border border-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheckIcon className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white font-sans">FORMULIR PENDAFTARAN DISINKRONKAN</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto font-mono">
                  Data pengajuan Anda telah diterima secara aman oleh database pusat www.ihsid.org. 
                  Tim Verifikasi Hukum kami akan menghubungi Anda dalam waktu 24 jam untuk verifikasi NIK dan keabsahan LBH/LSM Anda.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistered(false);
                    setName("");
                    setOrganization("");
                    setLocation("");
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-mono font-bold rounded-lg cursor-pointer"
                >
                  Daftarkan Akun Lainnya
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister} className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-5">
              <div className="border-b border-slate-850 pb-2">
                <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest font-mono">Registrasi Anggota Pembela Sipil</h3>
                <p className="text-xs text-slate-400 mt-1">Gabungkan kekuatan hukum Anda bersama IHS untuk mengawal sengketa di daerah Anda secara terstruktur</p>
              </div>

              {regError && (
                <div className="p-3 bg-red-950/40 border border-red-900 text-red-400 rounded text-xs">
                  {regError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold block">Nama Lengkap & Gelar <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Rian Hidayat, S.H."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#050505] border border-slate-800 focus:border-red-650 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold block">Peran / Afiliasi Gerakan <span className="text-red-500">*</span></label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-[#050505] border border-slate-800 focus:border-red-650 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="Relawan Lapangan">Relawan Lapangan / Mahasiswa</option>
                    <option value="Advokat">Advokat / Penasihat Hukum</option>
                    <option value="Aktivis LSM">Aktivis LSM / NGO</option>
                    <option value="Jurnalis">Jurnalis / Wartawan Independen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold block">Nama Organisasi / LBH:</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: LBH Keadilan Rakyat"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-[#050505] border border-slate-800 focus:border-red-650 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold block">Wilayah Domisili Tugas <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Sanggau, Kalimantan Barat"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#050505] border border-slate-800 focus:border-red-650 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="bg-[#050505] border border-slate-850 p-3.5 rounded-lg flex gap-2.5">
                <LockIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                  Pernyataan Keamanan: Kami mengamankan pendaftaran ini dengan enkripsi tangguh. 
                  NIK dan dokumen verifikasi anggota tidak akan dipublikasikan ke publik tanpa perintah tertulis resmi LBH bersangkutan.
                </p>
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full py-3 bg-red-700 hover:bg-red-600 disabled:bg-slate-850 disabled:text-slate-500 text-white rounded-lg font-mono font-bold tracking-wider text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-950/40"
              >
                {isRegistering ? "SINKRONISASI DATA..." : "KIRIM FORMULIR VERIFIKASI KE www.ihsid.org"}
              </button>
            </form>
          )}
        </div>
      )}

      {activeTab === "diskusi" && (
        <div className="space-y-6 text-left">
          <div className="bg-[#050505] border border-slate-850 rounded-xl p-4 flex gap-3 items-center">
            <AlertOctagonIcon className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-xs text-slate-400 font-mono">
              Forum ini hanya terbuka untuk koordinasi taktis gerakan pembela hak sipil. Seluruh isi forum dimoderasi ketat oleh Admin Pusat IHS.
            </p>
          </div>

          {/* Interactive Comments list */}
          <div className="space-y-4">
            {forumPosts.map((post) => (
              <div key={post.id} className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-4 sm:p-5 text-left space-y-3">
                <div className="flex items-start justify-between gap-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#050505] border border-slate-850 flex items-center justify-center text-red-500 font-mono text-xs font-bold">
                      {post.avatarText}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{post.author}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{post.role}</p>
                    </div>
                  </div>
                  
                  <span className="text-[9px] text-slate-500 font-mono">
                    {new Date(post.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">{post.text}</p>
                
                <div className="flex items-center justify-between border-t border-slate-850/60 pt-2 text-[10px] text-zinc-500 font-mono">
                  <span className="text-slate-500">DISALURKAN: SIBI SECURE NODE</span>
                  <button 
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center gap-1.5 hover:text-red-500 text-slate-400 transition cursor-pointer"
                  >
                    <ThumbsUpIcon className="w-3.5 h-3.5" />
                    DUKUNG GAGASAN ({post.likes})
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Input form to append tactical comment */}
          <form onSubmit={handlePostComment} className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-4 space-y-3 text-left">
            <label className="text-xs font-bold text-slate-400 font-mono uppercase block">Sumbang Gagasan Solidaritas:</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Bagikan perkembangan taktis, seruan aksi, atau bantuan pengacara daerah..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 bg-[#050505] border border-slate-850 focus:border-red-600 rounded-xl px-4 py-2.5 text-xs text-slate-300 outline-none transition font-sans"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="p-2.5 bg-red-750 hover:bg-red-700 disabled:bg-slate-850 text-white rounded-xl transition cursor-pointer shrink-0"
              >
                <SendIcon className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
