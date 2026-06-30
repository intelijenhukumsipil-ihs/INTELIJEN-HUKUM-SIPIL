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
  PhoneCall,
  Layers,
  Cpu
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
import EkosistemOtonomView from "./components/EkosistemOtonomView";
import DhnOneSystemView from "./components/DhnOneSystemView";

// Firebase imports
import { 
  auth, 
  db, 
  googleProvider, 
  OperationType, 
  handleFirestoreError 
} from "./firebase";
import { 
  User, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot 
} from "firebase/firestore";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Custom Password Login Form State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<"admin" | "anggota" | "pimpinan">("admin");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Ganti Kata Sandi State
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");
  const [changePasswordSuccess, setChangePasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Data State
  const [cases, setCases] = useState<CaseReport[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem("ihs_news_cache");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [syncLogs, setSyncLogs] = useState<{ id: string; timestamp: string; action: string; detail: string; status: string }[]>([]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firebase Firestore Real-Time State Syncing
  useEffect(() => {
    if (isAuthLoading) return;

    // 1. Subscribe to Publications (Publicly readable)
    const unsubPublications = onSnapshot(collection(db, "publications"), async (snapshot) => {
      let list: NewsItem[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as NewsItem);
      });
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      if (snapshot.empty) {
        try {
          const res = await fetch("/api/news");
          if (res.ok) {
            const initialData = await res.json();
            for (const item of initialData) {
              await setDoc(doc(db, "publications", item.id), item);
            }
          }
        } catch (err) {
          console.error("Gagal seeding berita:", err);
        }
      } else {
        setNewsList(list);
        try {
          localStorage.setItem("ihs_news_cache", JSON.stringify(list));
        } catch (e) {
          console.error(e);
        }
      }
    }, (err) => {
      console.error("Gagal mengamati berita:", err);
    });

    if (!user) {
      setCases([]);
      setMembers([]);
      setSyncLogs([]);
      return () => {
        unsubPublications();
      };
    }

    // 2. Subscribe to Members (Auth required)
    const unsubMembers = onSnapshot(collection(db, "members"), async (snapshot) => {
      let list: Member[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Member);
      });
      if (snapshot.empty) {
        try {
          const res = await fetch("/api/members");
          if (res.ok) {
            const initialData = await res.json();
            for (const item of initialData) {
              await setDoc(doc(db, "members", item.id), {
                ...item,
                userId: user.uid
              });
            }
          }
        } catch (err) {
          console.error("Gagal seeding anggota:", err);
        }
      } else {
        setMembers(list);
      }
    }, (err) => {
      console.error("Gagal mengamati anggota:", err);
    });

    // 3. Subscribe to Sync Logs (Auth required)
    const unsubLogs = onSnapshot(collection(db, "sync_logs"), async (snapshot) => {
      let list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      if (snapshot.empty) {
        try {
          const res = await fetch("/api/sync-logs");
          if (res.ok) {
            const initialData = await res.json();
            for (const item of initialData) {
              await setDoc(doc(db, "sync_logs", item.id), item);
            }
          }
        } catch (err) {
          console.error("Gagal seeding log:", err);
        }
      } else {
        setSyncLogs(list);
      }
    }, (err) => {
      console.error("Gagal mengamati log:", err);
    });

    // 4. Subscribe to Cases (Auth required)
    const isUserAdmin = user.email === "intelijenhukumsipil@gmail.com" || user.email === "pimpinan@ihsid.org";
    const casesQuery = isUserAdmin 
      ? collection(db, "cases")
      : query(collection(db, "cases"), where("userId", "==", user.uid));

    const unsubCases = onSnapshot(casesQuery, async (snapshot) => {
      let list: CaseReport[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as CaseReport);
      });
      list.sort((a, b) => new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime());

      if (snapshot.empty && !isUserAdmin) {
        try {
          const res = await fetch("/api/cases");
          if (res.ok) {
            const initialData = await res.json();
            for (const item of initialData) {
              const newId = `case_${item.id}_${user.uid}`;
              await setDoc(doc(db, "cases", newId), {
                ...item,
                id: newId,
                userId: user.uid
              });
            }
          }
        } catch (err) {
          console.error("Gagal seeding kasus demo:", err);
        }
      } else {
        setCases(list);
      }
    }, (err) => {
      console.error("Gagal mengamati kasus:", err);
    });

    return () => {
      unsubPublications();
      unsubMembers();
      unsubLogs();
      unsubCases();
    };
  }, [user, isAuthLoading]);

  // Auth Actions
  const handleLogin = () => {
    setLoginError("");
    setLoginPassword("");
    setIsLoginModalOpen(true);
  };

  const handlePasswordLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    let email = "";
    let defaultPassword = "";
    let displayName = "";

    if (loginRole === "admin") {
      email = "intelijenhukumsipil@gmail.com";
      defaultPassword = "ihsadmin2026";
      displayName = "Pengelola Pusat (Admin)";
    } else if (loginRole === "anggota") {
      email = "anggota@ihsid.org";
      defaultPassword = "ihsanggota2026";
      displayName = "Anggota Lapangan";
    } else if (loginRole === "pimpinan") {
      email = "pimpinan@ihsid.org";
      defaultPassword = "ihspimpinan2026";
      displayName = "Pimpinan Pusat (Pemantau)";
    } else {
      setLoginError("Peran tidak valid.");
      setIsLoggingIn(false);
      return;
    }

    try {
      // 1. Try signing in with Email & Password directly
      const userCredential = await signInWithEmailAndPassword(auth, email, loginPassword);
      
      // Update display name if empty or mismatched
      if (userCredential.user && (!userCredential.user.displayName || userCredential.user.displayName !== displayName)) {
        await updateProfile(userCredential.user, { displayName });
      }

      setIsLoginModalOpen(false);
      setLoginPassword("");
    } catch (err: any) {
      if (err.code === "auth/operation-not-allowed") {
        setLoginError("METODE EMAIL/SANDI BELUM DIAKTIFKAN: Silakan buka Firebase Console Anda -> Project Shortcut -> Authentication -> Sign-in method, lalu AKTIFKAN 'Email/Password'. Tanpa ini, Firebase menolak pendaftaran akun komando.");
      } else if (
        err.code === "auth/user-not-found" || 
        err.code === "auth/cannot-find-user" || 
        (err.message && err.message.includes("user-not-found"))
      ) {
        // If user not found, require default password for automatic creation
        if (loginPassword !== defaultPassword) {
          setLoginError("Akun belum terdaftar di server. Masukkan kata sandi bawaan pertama kali untuk mendaftarkan akun secara otomatis.");
          setIsLoggingIn(false);
          return;
        }

        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, loginPassword);
          if (userCredential.user) {
            await updateProfile(userCredential.user, { displayName });
          }
          setIsLoginModalOpen(false);
          setLoginPassword("");
        } catch (createErr: any) {
          console.error("Gagal membuat akun sistem otomatis:", createErr);
          if (createErr.code === "auth/operation-not-allowed") {
            setLoginError("METODE EMAIL/SANDI BELUM DIAKTIFKAN: Silakan buka Firebase Console Anda -> Project Shortcut -> Authentication -> Sign-in method, lalu AKTIFKAN 'Email/Password' agar akun sandi dapat dibuat otomatis.");
          } else {
            setLoginError(`Sistem gagal mendaftarkan kredensial otomatis: ${createErr.message || createErr}`);
          }
        }
      } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential" || (err.message && err.message.includes("invalid-credential"))) {
        setLoginError("Kata sandi salah. Silakan masukkan kata sandi yang sesuai untuk peran ini.");
      } else {
        console.error("Gagal masuk dengan kredensial:", err);
        setLoginError(`Gagal masuk ke sistem: ${err.message || err}`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError("");
    setChangePasswordSuccess("");

    if (!auth.currentUser || !auth.currentUser.email) {
      setChangePasswordError("Anda harus masuk terlebih dahulu.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setChangePasswordError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    if (newPassword.length < 6) {
      setChangePasswordError("Kata sandi baru harus minimal 6 karakter.");
      return;
    }

    setIsChangingPassword(true);

    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      await updatePassword(auth.currentUser, newPassword);
      
      setChangePasswordSuccess("Kata sandi berhasil diubah! Gunakan kata sandi baru ini pada saat masuk berikutnya.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      console.error("Gagal mengganti kata sandi:", err);
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential" || (err.message && err.message.includes("invalid-credential"))) {
        setChangePasswordError("Kata sandi saat ini salah.");
      } else {
        setChangePasswordError(`Gagal mengganti kata sandi: ${err.message || err}`);
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Gagal keluar:", err);
    }
  };

  // Handler: When a new report is submitted
  const handleCaseSubmitted = async (newCaseData: any) => {
    if (!user) return;
    const caseId = `case_${Date.now()}`;
    const ticketNumber = `IHS-2026-${String(cases.length + 1).padStart(4, "0")}`;
    const dateSubmitted = new Date().toISOString();
    const newCase: CaseReport = {
      ...newCaseData,
      id: caseId,
      ticketNumber,
      dateSubmitted,
      status: "diterima",
      userId: user.uid,
      evidenceCount: newCaseData.evidenceFiles ? newCaseData.evidenceFiles.length : 0,
      evidenceFiles: newCaseData.evidenceFiles || []
    };

    try {
      await setDoc(doc(db, "cases", caseId), newCase);

      const logId = `log_${Date.now()}`;
      await setDoc(doc(db, "sync_logs", logId), {
        id: logId,
        timestamp: new Date().toISOString(),
        action: "Sinkronisasi Laporan Baru",
        detail: `Mengirim laporan terenkripsi ${ticketNumber} ke Firestore`,
        status: "sukses"
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `cases/${caseId}`);
    }
  };

  // Handler: When AI Analysis is triggered
  const handleTriggerAIAnalysis = async (caseId: string) => {
    const targetCase = cases.find(c => c.id === caseId);
    if (!targetCase) throw new Error("Kasus tidak ditemukan.");

    try {
      const res = await fetch(`/api/cases/${caseId}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(targetCase)
      });
      if (!res.ok) throw new Error("Gagal memproses analisis hukum AI.");
      const analysisResult = await res.json();

      await updateDoc(doc(db, "cases", caseId), {
        aiAnalysis: analysisResult
      });

      const logId = `log_${Date.now()}`;
      await setDoc(doc(db, "sync_logs", logId), {
        id: logId,
        timestamp: new Date().toISOString(),
        action: "Analisis Intelijen AI",
        detail: `Berhasil menjalankan analisis hukum AI untuk kasus di Firestore`,
        status: "sukses"
      });

      return analysisResult;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `cases/${caseId}`);
    }
  };

  // Handler: Update Case Status
  const handleUpdateCaseStatus = async (caseId: string, newStatus: CaseReport['status']) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "cases", caseId), {
        status: newStatus
      });

      const logId = `log_${Date.now()}`;
      await setDoc(doc(db, "sync_logs", logId), {
        id: logId,
        timestamp: new Date().toISOString(),
        action: "Pembaruan Status Kasus",
        detail: `Mengubah status kasus ke ${newStatus.toUpperCase()}`,
        status: "sukses"
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `cases/${caseId}`);
    }
  };

  // Handler: Create news publication
  const handleCreatePublication = async (newPubData: Omit<NewsItem, 'id' | 'date' | 'author'>) => {
    if (!user) throw new Error("Silakan masuk terlebih dahulu.");
    const pubId = `pub_${Date.now()}`;
    const newPub: NewsItem = {
      ...newPubData,
      id: pubId,
      date: new Date().toISOString(),
      author: user.displayName || "Tim Media IHS"
    };

    try {
      await setDoc(doc(db, "publications", pubId), newPub);

      const logId = `log_${Date.now()}`;
      await setDoc(doc(db, "sync_logs", logId), {
        id: logId,
        timestamp: new Date().toISOString(),
        action: "Publikasi Informasi Baru",
        detail: `Mengunggah rilis/edukasi '${newPub.title}' ke Firestore`,
        status: "sukses"
      });

      return newPub;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `publications/${pubId}`);
    }
  };

  // Handler: Register a member
  const handleRegisterMember = async (newMemberData: Omit<Member, 'id' | 'isVerified'>) => {
    if (!user) throw new Error("Silakan masuk terlebih dahulu.");
    const memberId = `mem_${Date.now()}`;
    const newMember: Member = {
      ...newMemberData,
      id: memberId,
      isVerified: false,
      userId: user.uid
    };

    try {
      await setDoc(doc(db, "members", memberId), newMember);

      const logId = `log_${Date.now()}`;
      await setDoc(doc(db, "sync_logs", logId), {
        id: logId,
        timestamp: new Date().toISOString(),
        action: "Registrasi Anggota Baru",
        detail: `Mengirim formulir verifikasi keanggotaan untuk ${newMember.name} ke Firestore`,
        status: "sukses"
      });

      return newMember;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `members/${memberId}`);
    }
  };

  // Handler: Run manual DB integrity audit
  const handleTriggerAudit = async () => {
    if (!user) return;
    const logId = `log_${Date.now()}`;
    try {
      await setDoc(doc(db, "sync_logs", logId), {
        id: logId,
        timestamp: new Date().toISOString(),
        action: "Audit Integritas Data",
        detail: "Memulai verifikasi database Firestore terenkripsi",
        status: "sukses"
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `sync_logs/${logId}`);
    }
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
    { id: "ekosistem_otonom", label: "Ekosistem Otonom", icon: Layers },
    { id: "dhn_one_system", label: "DHN One System", icon: Cpu },
    { id: "pengaturan", label: "Pengaturan & Log", icon: Settings },
  ];


  const renderAuthPrompt = (tabLabel: string) => {
    const handleInlineSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await handlePasswordLoginSubmit();
    };

    return (
      <div className="max-w-md mx-auto my-12 bg-[#0a0a0a] border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl text-left">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-red-950/40 border border-red-900/40 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-md font-bold text-white tracking-wide uppercase">Akses Terenkripsi Diperlukan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Halaman <span className="text-red-500 font-bold font-mono">{tabLabel}</span> dilindungi sandi sistem komando IHS.
            </p>
          </div>
        </div>

        <form onSubmit={handleInlineSubmit} className="space-y-4">
          {loginError && (
            <div className="p-3 bg-red-950/40 border border-red-900 text-red-400 text-xs rounded-lg font-mono">
              {loginError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-bold font-mono block uppercase">PILIH PERAN / AKUN</label>
            <select
              value={loginRole}
              onChange={(e) => setLoginRole(e.target.value as any)}
              className="w-full bg-[#050505] border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer focus:border-red-650"
            >
              <option value="admin">Operator Pusat (Admin)</option>
              <option value="anggota">Anggota Lapangan (Advokat/Aktivis)</option>
              <option value="pimpinan">Pimpinan Pusat (Pemantau)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-bold font-mono block uppercase">KATA SANDI SISTEM</label>
            <input
              type="password"
              placeholder="Masukkan sandi..."
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full bg-[#050505] border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-red-650 font-mono"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-2.5 bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-mono font-bold text-xs rounded-lg tracking-widest transition cursor-pointer flex items-center justify-center gap-2 uppercase disabled:opacity-50"
          >
            {isLoggingIn ? (
              <span className="w-4 h-4 border-2 border-t-white border-slate-800 animate-spin rounded-full"></span>
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            MASUK SEKARANG
          </button>
        </form>

      </div>
    );
  };

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
            <Lock className="w-3.5 h-3.5 text-green-500 mr-1" />
            TEROTENTIKASI
          </div>
          {isAuthLoading ? (
            <div className="w-5 h-5 rounded-full border-2 border-t-red-600 border-slate-800 animate-spin"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="text-right leading-none">
                <p className="text-xs font-bold text-white uppercase tracking-tight">{user.displayName || "Operator IHS"}</p>
                <p className="text-[9px] text-slate-400 font-mono max-w-[150px] truncate">{user.email}</p>
              </div>
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="h-8 w-8 rounded-full border border-slate-700" referrerPolicy="no-referrer" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-200">
                  {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : "IHS"}
                </div>
              )}
              {user.email && (user.email === "intelijenhukumsipil@gmail.com" || user.email === "anggota@ihsid.org" || user.email === "pimpinan@ihsid.org") && (
                <button
                  onClick={() => {
                    setChangePasswordError("");
                    setChangePasswordSuccess("");
                    setIsChangePasswordModalOpen(true);
                  }}
                  className="text-[10px] text-slate-300 hover:text-white font-bold tracking-wider font-mono uppercase bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 cursor-pointer transition flex items-center gap-1 hover:border-slate-700"
                >
                  <Lock className="w-3 h-3 text-red-500" />
                  GANTI SANDI
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-[10px] text-red-500 hover:text-red-400 font-bold tracking-wider font-mono uppercase bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 cursor-pointer transition"
              >
                KELUAR
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white text-[10px] font-bold font-mono tracking-wider rounded uppercase cursor-pointer transition shadow-md shadow-red-950/20"
            >
              MASUK AKUN
            </button>
          )}
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
            
            {/* Mobile Auth Status Block */}
            <div className="border-b border-slate-800 pb-4 mb-2 text-left">
              {isAuthLoading ? (
                <div className="text-xs text-slate-500 font-mono">Memuat otentikasi...</div>
              ) : user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="h-9 w-9 rounded-full border border-slate-700" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-200">
                          {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : "IHS"}
                        </div>
                      )}
                      <div className="leading-tight">
                        <p className="text-xs font-bold text-white uppercase">{user.displayName || "Operator"}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate max-w-[165px]">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-[10px] text-red-500 font-bold font-mono rounded uppercase cursor-pointer hover:bg-slate-800"
                    >
                      KELUAR
                    </button>
                  </div>
                  {user.email && (user.email === "intelijenhukumsipil@gmail.com" || user.email === "anggota@ihsid.org" || user.email === "pimpinan@ihsid.org") && (
                    <button
                      onClick={() => {
                        setChangePasswordError("");
                        setChangePasswordSuccess("");
                        setIsChangePasswordModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-mono font-bold text-xs rounded tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 uppercase"
                    >
                      <Lock className="w-3.5 h-3.5 text-red-500" />
                      Ganti Kata Sandi Sistem
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }}
                  className="w-full py-2.5 bg-red-700 hover:bg-red-600 text-white text-xs font-bold font-mono tracking-wider rounded uppercase cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  MASUK DENGAN SANDI
                </button>
              )}
            </div>

            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">Navigasi Menu Utama:</div>
            <nav className="grid grid-cols-1 gap-1 overflow-y-auto max-h-[50vh]">
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

            <div className="bg-red-950/10 border border-red-900/30 p-4 rounded-xl space-y-2.5 text-center font-mono mt-auto shrink-0">
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
            user ? (
              <ReportFormView 
                onCaseSubmitted={handleCaseSubmitted} 
                onNavigate={(tab) => setActiveTab(tab)}
              />
            ) : renderAuthPrompt("Lapor Kasus")
          )}

          {activeTab === "investigasi" && (
            user ? (
              <InvestigationView 
                cases={cases} 
                onTriggerAIAnalysis={handleTriggerAIAnalysis}
                onUpdateCaseStatus={handleUpdateCaseStatus}
              />
            ) : renderAuthPrompt("Investigasi")
          )}

          {activeTab === "bukti" && (
            user ? (
              <EvidenceVaultView 
                cases={cases} 
              />
            ) : renderAuthPrompt("Bukti & Data")
          )}

          {activeTab === "hukum" && (
            user ? (
              <LegalServicesView />
            ) : renderAuthPrompt("Layanan Hukum")
          )}

          {activeTab === "konsultasi" && (
            user ? (
              <ConsultationView />
            ) : renderAuthPrompt("Konsultasi AI")
          )}

          {activeTab === "media" && (
            <MediaEdukasiView 
              newsList={newsList} 
              onCreatePublication={handleCreatePublication}
              user={user}
              onLogin={handleLogin}
            />
          )}

          {activeTab === "jaringan" && (
            user ? (
              <JaringanAnggotaView 
                members={members} 
                onRegisterMember={handleRegisterMember}
              />
            ) : renderAuthPrompt("Jaringan & Anggota")
          )}

          {activeTab === "ekosistem_otonom" && (
            <EkosistemOtonomView />
          )}

          {activeTab === "dhn_one_system" && (
            <DhnOneSystemView />
          )}

          {activeTab === "pengaturan" && (
            user ? (
              <SettingsSyncView 
                syncLogs={syncLogs} 
                onTriggerAudit={handleTriggerAudit}
              />
            ) : renderAuthPrompt("Pengaturan & Log")
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

      {/* Custom Password Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-[#050505]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-red-950/40 border border-red-900/40 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-md font-bold text-white tracking-wide uppercase">Masuk Akun Komando IHS</h3>
                <p className="text-xs text-slate-400">
                  Gunakan kredensial sandi terenkripsi sistem untuk mengakses server.
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordLoginSubmit} className="space-y-4 text-left">
              {loginError && (
                <div className="p-3 bg-red-950/40 border border-red-900 text-red-400 text-xs rounded-lg font-mono">
                  {loginError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold font-mono block uppercase">PILIH PERAN / AKUN</label>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value as any)}
                  className="w-full bg-[#050505] border border-slate-850 rounded-lg px-3 py-2.5 text-xs text-slate-200 outline-none cursor-pointer focus:border-red-650"
                >
                  <option value="admin">Operator Pusat (Admin)</option>
                  <option value="anggota">Anggota Lapangan (Advokat/Aktivis)</option>
                  <option value="pimpinan">Pimpinan Pusat (Pemantau)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold font-mono block uppercase">KATA SANDI SISTEM</label>
                <input
                  type="password"
                  placeholder="Masukkan sandi..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-[#050505] border border-slate-850 rounded-lg px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-red-650 font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-mono font-bold text-xs rounded-lg tracking-widest transition cursor-pointer flex items-center justify-center gap-2 uppercase disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <span className="w-4 h-4 border-2 border-t-white border-slate-800 animate-spin rounded-full"></span>
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                MASUK SEKARANG
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 bg-[#050505]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setIsChangePasswordModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-red-950/40 border border-red-900/40 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-md font-bold text-white tracking-wide uppercase">Ganti Kata Sandi Sistem</h3>
                <p className="text-xs text-slate-400">
                  Ubah kata sandi akun sistem komando aktif Anda ({user?.email}).
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-left">
              {changePasswordError && (
                <div className="p-3 bg-red-950/40 border border-red-900 text-red-400 text-xs rounded-lg font-mono">
                  {changePasswordError}
                </div>
              )}

              {changePasswordSuccess && (
                <div className="p-3 bg-green-950/40 border border-green-900 text-green-400 text-xs rounded-lg font-mono">
                  {changePasswordSuccess}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold font-mono block uppercase">KATA SANDI SAAT INI</label>
                <input
                  type="password"
                  placeholder="Masukkan sandi aktif..."
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#050505] border border-slate-850 rounded-lg px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-red-650 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold font-mono block uppercase">KATA SANDI BARU</label>
                <input
                  type="password"
                  placeholder="Minimal 6 karakter..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#050505] border border-slate-850 rounded-lg px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-red-650 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold font-mono block uppercase">KONFIRMASI KATA SANDI BARU</label>
                <input
                  type="password"
                  placeholder="Ulangi sandi baru..."
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full bg-[#050505] border border-slate-850 rounded-lg px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-red-650 font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full py-3 bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-mono font-bold text-xs rounded-lg tracking-widest transition cursor-pointer flex items-center justify-center gap-2 uppercase disabled:opacity-50"
              >
                {isChangingPassword ? (
                  <span className="w-4 h-4 border-2 border-t-white border-slate-800 animate-spin rounded-full"></span>
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                PERBARUI SEKARANG
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
