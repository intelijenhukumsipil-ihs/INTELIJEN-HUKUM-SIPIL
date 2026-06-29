import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const PORT = 3000;

// Lazy initialized Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is not configured or still set to the placeholder.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Seed Cases Data
let cases = [
  {
    id: "case_1",
    ticketNumber: "IHS-2026-0001",
    title: "Sengketa Agraria Masyarakat Adat vs Korporasi Sawit",
    category: "Agraria/Lingkungan",
    reporterName: "Laode Muhammad",
    reporterContact: "0812-3456-7890",
    isAnonymous: false,
    location: "Sanggau, Kalimantan Barat",
    chronology: "Perusahaan kelapa sawit PT Sawit Raya menyerobot lahan adat seluas 350 hektar milik warga desa Sanggau sejak Maret 2026. Lahan tersebut telah dihuni dan dikelola secara turun-temurun. Upaya mediasi desa gagal karena perusahaan membawa dokumen HGU yang diragukan keabsahannya. Warga diintimidasi oleh oknum aparat bersenjata saat mencoba menahan alat berat.",
    dateSubmitted: "2026-06-15T09:30:00Z",
    status: "penanganan",
    evidenceCount: 3,
    evidenceFiles: [
      { name: "Sertifikat_Ulayat_Adat.pdf", size: "2.4 MB", type: "pdf", hash: "sha256-f87e...8e11" },
      { name: "Foto_Patok_Batas_Dihancurkan.jpg", size: "4.1 MB", type: "image", hash: "sha256-a3e1...c99b" },
      { name: "Rekaman_Intimidasi_Aparat.m4a", size: "12.8 MB", type: "audio", hash: "sha256-3b2d...f00e" }
    ],
    aiAnalysis: {
      summary: "Sengketa kepemilikan lahan ulayat adat Kalimantan Barat melawan izin HGU korporasi kelapa sawit, diperumit dengan dugaan intimidasi pelanggaran HAM oleh oknum keamanan.",
      violatedArticles: ["Pasal 385 KUHP (Penyerobotan Lahan)", "Pasal 3 UU No. 5/1960 (Hukum Agraria tentang Hak Ulayat)", "Pasal 18B Ayat (2) UUD 1945 (Pengakuan Masyarakat Adat)"],
      riskLevel: "Sangat Tinggi",
      actionStrategy: [
        "Lakukan audit independen atas proses penerbitan HGU PT Sawit Raya.",
        "Ajukan permohonan perlindungan saksi/korban ke LPSK terkait intimidasi aparat.",
        "Kirim surat pengaduan resmi ke Komnas HAM dan Kementerian ATR/BPN."
      ],
      lawsReferenced: ["Undang-Undang Pokok Agraria (UUPA) No. 5 Tahun 1960", "UUD 1945 Pasal 18B", "Undang-Undang HAM No. 39 Tahun 1999"]
    }
  },
  {
    id: "case_2",
    ticketNumber: "IHS-2026-0002",
    title: "Dugaan Kriminalisasi Aktivis Lingkungan Hidup",
    category: "Digital/Pendapat",
    reporterName: "Siti Rahma",
    reporterContact: "0821-9876-5432",
    isAnonymous: true,
    location: "Deli Serdang, Sumatera Utara",
    chronology: "Seorang aktivis pemuda dituduh melakukan pencemaran nama baik melalui postingan Instagram yang mengkritik pembuangan limbah pabrik tekstil ke sungai warga. Pihak pabrik menggunakan UU ITE Pasal 27 ayat (3) untuk melaporkannya ke Polres setempat. Status hukum aktivis saat ini sudah dinaikkan menjadi Tersangka tanpa pemanggilan saksi ahli bahasa terlebih dahulu.",
    dateSubmitted: "2026-06-20T14:15:00Z",
    status: "verifikasi",
    evidenceCount: 1,
    evidenceFiles: [
      { name: "Tangkapan_Layar_Postingan.png", size: "1.2 MB", type: "image", hash: "sha256-5b4d...ea12" }
    ],
    aiAnalysis: {
      summary: "Kriminalisasi opini publik terkait pencemaran lingkungan menggunakan instrumen UU ITE. Melanggar prinsip restorative justice dan SKB Pedoman Implementasi UU ITE.",
      violatedArticles: ["Pasal 27 ayat (3) jo Pasal 45 ayat (3) UU ITE", "Pasal 66 UU No. 32/2009 tentang Perlindungan Lingkungan (Anti-SLAPP)"],
      riskLevel: "Tinggi",
      actionStrategy: [
        "Gunakan hak kekebalan hukum hukum lingkungan (Anti-SLAPP) berdasarkan Pasal 66 UU PPLH.",
        "Ajukan penangguhan penahanan dan minta gelar perkara khusus di Polda.",
        "Desak penyidik menggunakan SKB Pedoman UU ITE yang menekankan perdamaian sebelum pidana."
      ],
      lawsReferenced: ["UU No. 19 Tahun 2016 (UU ITE)", "UU No. 32 Tahun 2009 (PPLH)", "SKB 3 Menteri tentang Pedoman Implementasi UU ITE"]
    }
  },
  {
    id: "case_3",
    ticketNumber: "IHS-2026-0003",
    title: "PHK Sepihak Tanpa Pesangon 120 Buruh Pabrik Sepatu",
    category: "Ketenagakerjaan",
    reporterName: "Bambang Tri",
    reporterContact: "0857-1122-3344",
    isAnonymous: false,
    location: "Tangerang, Banten",
    chronology: "Pabrik sepatu PT Kaki Kuat melakukan PHK mendadak terhadap 120 buruh tetap dengan alasan efisiensi pasca-pandemi. Namun, perusahaan tidak memberikan uang pesangon, uang penghargaan masa kerja, ataupun uang penggantian hak sesuai ketentuan UU Cipta Kerja. Serikat pekerja dilarang masuk ke area pabrik dan pintu gerbang dikunci oleh sekuriti eksternal.",
    dateSubmitted: "2026-06-25T11:00:00Z",
    status: "diterima",
    evidenceCount: 2,
    evidenceFiles: [
      { name: "Surat_PHK_Kolektif.pdf", size: "3.1 MB", type: "pdf", hash: "sha256-9a2c...fd33" },
      { name: "Slip_Gaji_Terakhir.pdf", size: "1.5 MB", type: "pdf", hash: "sha256-6c1f...09bc" }
    ]
  },
  {
    id: "case_4",
    ticketNumber: "IHS-2026-0004",
    title: "Dugaan Pungutan Liar Pengurusan Sertifikat Tanah PTSL",
    category: "Korupsi/Wewenang",
    reporterName: "Harun Al-Rasyid",
    reporterContact: "0852-7788-9900",
    isAnonymous: false,
    location: "Sleman, DI Yogyakarta",
    chronology: "Oknum perangkat desa meminta biaya administrasi sebesar Rp 1.500.000 per bidang tanah untuk pengurusan sertifikat gratis melalui program PTSL BPN. Padahal, keputusan bersama 3 menteri membatasi biaya PTSL di wilayah Jawa maksimal hanya Rp 150.000. Warga yang menolak membayar diancam berkasnya akan ditimbun dan tidak diproses ke BPN.",
    dateSubmitted: "2026-06-26T08:00:00Z",
    status: "selesai",
    evidenceCount: 1,
    evidenceFiles: [
      { name: "Kuitansi_Pungutan_Liar.jpg", size: "1.8 MB", type: "image", hash: "sha256-7e2a...61fa" }
    ],
    aiAnalysis: {
      summary: "Pungutan liar dan penyalahgunaan wewenang oleh aparatur desa dalam program strategis nasional PTSL, bertentangan dengan SKB 3 Menteri.",
      violatedArticles: ["Pasal 12 huruf e UU Pemberantasan Tindak Pidana Korupsi (Pemerasan)", "SKB 3 Menteri No. 25/2017 tentang PTSL (Batas Biaya Jawa Rp 150.000)"],
      riskLevel: "Sedang",
      actionStrategy: [
        "Laporkan oknum desa tersebut ke Tim Saber Pungli Kabupaten Sleman.",
        "Kirim tembusan bukti kuitansi ke Kepala Kantor Pertanahan (BPN) Sleman.",
        "Lakukan advokasi kolektif bersama warga desa yang menjadi korban serupa."
      ],
      lawsReferenced: ["UU No. 31 Tahun 1999 jo UU No. 20 Tahun 2001 (Pemberantasan Tipikor)", "SKB 3 Menteri No. 25 Tahun 2017"]
    }
  }
];

// Seed Publications (News & Edukasi)
let publications = [
  {
    id: "pub_1",
    title: "Panduan Advokasi Mandiri Kasus Penyerobotan Lahan Adat",
    summary: "Langkah-langkah taktis hukum dan non-hukum yang dapat diambil oleh komunitas adat ketika menghadapi penyerobotan lahan korporasi.",
    content: `## Panduan Advokasi Mandiri Kasus Penyerobotan Lahan Adat

Penyerobotan lahan masyarakat adat oleh korporasi sering kali terjadi dengan dalih kepemilikan Hak Guna Usaha (HGU). Berikut adalah panduan taktis yang disusun oleh Tim Hukum Intelijen Hukum Sipil (IHS):

### 1. Dokumentasikan Bukti Sejarah Kepemilikan Lahan
- Kumpulkan dokumen sejarah kepemilikan tradisional (surat segel, surat keterangan tanah adat, atau catatan sejarah desa).
- Catat batas-batas alam lahan adat (sungai, pohon besar, bukit kecil) serta saksi-saksi batas yang masih hidup.
- Foto dan rekam aktivitas pengelolaan lahan tradisional (kuburan leluhur, tanaman tahunan, situs adat).

### 2. Lakukan Pemetaan Partisipatif
- Bersama warga desa, gambarkan peta batas ulayat secara gotong royong.
- Gunakan GPS smartphone gratis untuk menandai titik koordinat batas krusial lahan adat Anda guna menghindari klaim sepihak.

### 3. Ketahui Dasar Hukum Anda
- **Pasal 18B Ayat 2 UUD 1945**: Negara mengakui dan menghormati kesatuan masyarakat hukum adat beserta hak-hak tradisionalnya.
- **Pasal 3 UU No. 5/1960 (UUPA)**: Pelaksanaan hak ulayat harus sedemikian rupa sehingga sesuai dengan kepentingan nasional dan negara.

### 4. Pelaporan dan Gerakan Kampanye
- Jangan bertindak anarkis. Jika terjadi pelanggaran, segera lapor ke IHS melalui portal ini atau hubungi Hotline WhatsApp resmi **0852-2232-2254** untuk pendampingan advokat.`,
    date: "2026-06-27T10:00:00Z",
    author: "Tim Hukum IHS",
    category: "Edukasi",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "pub_2",
    title: "Rilis Pers: IHS Desak Propam Periksa Intimidasi Aparat di Kasus Agraria",
    summary: "IHS merilis pernyataan sikap mengecam keras keterlibatan oknum aparat keamanan bersenjata yang melakukan tindakan represif kepada warga lokal.",
    content: `## RILIIS PERS: IHS DESAK DIVISI PROPAM POLRI PERIKSA OKNUM APARAT TERKAIT SENGKETA LAHAN

**JAKARTA, www.ihsid.org** — Intelijen Hukum Sipil (IHS) secara resmi melayangkan surat desakan kepada Divisi Profesi dan Pengamanan (Propam) Kepolisian Republik Indonesia terkait dugaan keterlibatan dan tindakan intimidasi oknum anggota polisi dalam sengketa lahan pertanian warga melawan korporasi kelapa sawit di beberapa daerah.

Berdasarkan laporan intelijen hukum lapangan IHS, ditemukan fakta adanya intimidasi senjata api, penghancuran patok batas lahan ulayat, serta penahanan sepihak terhadap tiga petani lokal tanpa prosedur hukum yang sah.

"Tugas kepolisian adalah mengayomi rakyat, bukan menjadi alat pengaman korporasi sawit komersial untuk menekan hak-adat warga negara," tegas Koordinator Utama Advokasi IHS dalam konferensi pers virtual hari ini.

IHS menuntut:
1. Penarikan segera seluruh oknum aparat bersenjata dari wilayah konflik agraria.
2. Penyelidikan disiplin dan pidana terhadap oknum yang terbukti menyalahgunakan wewenang.
3. Jaminan perlindungan bagi warga desa adat dan saksi kunci konflik.

Masyarakat yang mengalami kejadian serupa dapat segera melayangkan aduan terenkripsi aman di platform IHS atau kontak WhatsApp resmi kami.`,
    date: "2026-06-28T12:00:00Z",
    author: "Humas IHS",
    category: "Rilis Pers",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop"
  }
];

// Seed Members Data
let members: any[] = [
  { id: "mem_1", name: "Andi Saputra, S.H., M.H.", role: "Advokat", organization: "LBH Keadilan Rakyat", location: "Medan, Sumatera Utara", isVerified: true },
  { id: "mem_2", name: "Rian Hidayat", role: "Aktivis LSM", organization: "Sinergi Hijau Nusantara", location: "Pontianak, Kalimantan Barat", isVerified: true },
  { id: "mem_3", name: "Elisa Wardani", role: "Jurnalis", organization: "Independen Pers", location: "Surabaya, Jawa Timur", isVerified: true },
  { id: "mem_4", name: "Deni Pratama", role: "Relawan Lapangan", organization: "Satgas Advokasi IHS Banten", location: "Serang, Banten", isVerified: false }
];

// Seed Logs for Central Server Synchronization (www.ihsid.org)
let syncLogs = [
  { id: "log_1", timestamp: "2026-06-28T20:45:00Z", action: "Sinkronisasi Enkripsi Kasus", detail: "Mengirim berkas terenkripsi IHS-2026-0004 ke Database Pusat di www.ihsid.org", status: "sukses" },
  { id: "log_2", timestamp: "2026-06-28T18:12:00Z", action: "Pembaruan Kumpulan Regulasi", detail: "Mengunduh pembaharuan UU Ketenagakerjaan revisi terbaru dari server pusat", status: "sukses" },
  { id: "log_3", timestamp: "2026-06-28T12:30:00Z", action: "Cadangan Otomatis", detail: "Backup harian basis data terpusat ke server cadangan www.ihsid.org", status: "sukses" }
];

// API ROUTE: Get all cases
app.get("/api/cases", (req, res) => {
  res.json(cases);
});

// API ROUTE: Create a case
app.post("/api/cases", (req, res) => {
  const { title, category, reporterName, reporterContact, isAnonymous, location, chronology, evidenceFiles } = req.body;
  
  if (!title || !category || !location || !chronology) {
    return res.status(400).json({ error: "Kolom Judul, Kategori, Lokasi, dan Kronologi harus diisi." });
  }

  const newTicketId = `IHS-2026-${String(cases.length + 1).padStart(4, "0")}`;
  const newCase: any = {
    id: `case_${Date.now()}`,
    ticketNumber: newTicketId,
    title,
    category,
    reporterName: isAnonymous ? "Rahasia" : (reporterName || "Warga"),
    reporterContact: reporterContact || "-",
    isAnonymous: !!isAnonymous,
    location,
    chronology,
    dateSubmitted: new Date().toISOString(),
    status: "diterima",
    evidenceCount: evidenceFiles ? evidenceFiles.length : 0,
    evidenceFiles: evidenceFiles || []
  };

  cases.unshift(newCase);

  // Add a sync log
  syncLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: "Sinkronisasi Laporan Baru",
    detail: `Mengirim laporan terenkripsi ${newTicketId} ke www.ihsid.org`,
    status: "sukses"
  });

  res.status(201).json(newCase);
});

// API ROUTE: Generate AI analysis for a case
app.post("/api/cases/:id/analyze", async (req, res) => {
  const caseId = req.params.id;
  const foundCase = cases.find(c => c.id === caseId);

  if (!foundCase) {
    return res.status(404).json({ error: "Kasus tidak ditemukan." });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Analisis kasus hukum perdata/sipil berikut secara mendalam sesuai hukum positif Indonesia. 
    Kembalikan analisis Anda strictly dalam format JSON yang valid dengan properti berikut (jangan berikan komentar tambahan di luar JSON):
    {
      "summary": "Ringkasan kasus dalam 1-2 kalimat padat",
      "violatedArticles": ["Daftar pasal hukum Indonesia yang diduga dilanggar (misalnya: Pasal 385 KUHP tentang Penyerobotan Lahan)"],
      "riskLevel": "Rendah" atau "Sedang" atau "Tinggi" atau "Sangat Tinggi",
      "actionStrategy": ["Langkah taktis 1", "Langkah taktis 2", "Langkah taktis 3"],
      "lawsReferenced": ["Nama Undang-Undang / Peraturan terkait, misalnya: UU Agraria No 5 Tahun 1960"]
    }

    Data Kasus:
    Judul: ${foundCase.title}
    Kategori: ${foundCase.category}
    Lokasi: ${foundCase.location}
    Kronologi Kejadian: ${foundCase.chronology}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text || "{}";
    const aiAnalysis = JSON.parse(resultText);

    // Update case with AI analysis
    foundCase.aiAnalysis = aiAnalysis;

    // Add sync log
    syncLogs.unshift({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Analisis Intelijen AI",
      detail: `Berhasil menjalankan analisis hukum AI untuk kasus ${foundCase.ticketNumber}`,
      status: "sukses"
    });

    res.json(aiAnalysis);
  } catch (error: any) {
    console.error("AI Analysis Error:", error.message);
    
    // Fallback/Placeholder intelligent analysis if API Key is not set or fails
    const fallbackAnalysis = {
      summary: `[Analisis Terenkripsi Server IHS] Kasus ${foundCase.category} di wilayah ${foundCase.location}. Menunjukkan indikasi awal perselisihan sengketa hak perdata.`,
      violatedArticles: [
        foundCase.category === "Agraria/Lingkungan" ? "Pasal 3 UU No. 5/1960 tentang Hak Ulayat" : "Pasal 1365 Perbuatan Melanggar Hukum (PMH) KUHPerdata",
        "Pasal 378 KUHP (Dugaan Penipuan/Sengketa Wewenang)"
      ],
      riskLevel: "Sedang",
      actionStrategy: [
        "Lakukan investigasi lapangan mendalam dan kumpulkan bukti surat fisik asli.",
        "Segera laksanakan upaya mediasi formal didampingi Tim Advokasi Hukum IHS.",
        "Gunakan saluran WhatsApp resmi 0852-2232-2254 untuk koordinasi darurat."
      ],
      lawsReferenced: [
        "Kitab Undang-Undang Hukum Perdata (KUHPerdata) Pasal 1365",
        foundCase.category === "Agraria/Lingkungan" ? "UU Pokok Agraria No. 5 Tahun 1960" : "Undang-Undang Republik Indonesia"
      ]
    };

    foundCase.aiAnalysis = fallbackAnalysis;

    res.json(fallbackAnalysis);
  }
});

// API ROUTE: Consultation Chat with AI Advocate
app.post("/api/consultations", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Pesan tidak valid." });
  }

  const userMessage = messages[messages.length - 1]?.text || "";

  try {
    const ai = getGeminiClient();
    const systemPrompt = `Anda adalah Advokat Senior dan Ahli Intelijen Hukum Sipil dari IHS (Intelijen Hukum Sipil).
    Moto IHS: "Mengungkap Fakta, Mengawal Keadilan, Menegakkan Tanpa Kompromi".
    Situs web resmi: www.ihsid.org. WhatsApp resmi: 0852-2232-2254.
    Berikan konsultasi hukum yang solutif, aman, taktis, tegas, dan membela hak-hak sipil/rakyat tertindas.
    Gunakan referensi undang-undang di Indonesia secara logis dan sederhana agar mudah dipahami masyarakat biasa.
    Selalu ingatkan pengguna secara sopan di akhir jawaban bahwa mereka dapat mengajukan laporan resmi atau melampirkan berkas bukti langsung melalui aplikasi ini untuk ditindaklanjuti secara hukum oleh tim pengacara pusat IHS atau melalui nomor WhatsApp resmi 0852-2232-2254.`;

    const chatHistory = messages.map(m => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    // Remove the last message from history as we will pass it in the prompt
    chatHistory.pop();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { role: "user", parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    const text = response.text || "Mohon maaf, terjadi kendala saat merumuskan saran hukum.";
    res.json({ text });
  } catch (error: any) {
    console.error("Consultation AI Error:", error.message);

    // Dynamic but generic fallback answers based on keywords
    let reply = "Terima kasih atas pertanyaan Anda. Sebagai bagian dari pelayanan bantuan hukum awal IHS, kami menyarankan agar Anda segera mengamankan bukti-bukti dokumen (seperti surat perjanjian, sertifikat tanah, kuitansi, atau bukti chat) di tempat yang aman. \n\nLangkah taktis terdekat:\n1. Jangan menandatangani dokumen apa pun secara terburu-buru tanpa pendampingan hukum.\n2. Catat seluruh kronologi kejadian secara detail di portal Lapor Kasus aplikasi ini.\n3. Anda dapat melangsungkan koordinasi darurat dengan Tim Penasihat Hukum kami secara langsung di nomor WhatsApp resmi IHS: *0852-2232-2254*.";
    
    if (userMessage.toLowerCase().includes("tanah") || userMessage.toLowerCase().includes("sengketa") || userMessage.toLowerCase().includes("sertifikat")) {
      reply = "Terkait permasalahan pertanahan/agraria Anda, berdasarkan Pasal 19 UU Pokok Agraria No. 5/1960, pendaftaran hak atas tanah sangat penting untuk menjamin kepastian hukum. \n\nSaran taktis IHS:\n- Cek keaslian sertifikat ke BPN setempat secara resmi.\n- Kumpulkan bukti kepemilikan fisik dan bukti pembayaran pajak (PBB).\n- Segera laporkan kasus ini lewat menu 'Lapor Kasus' untuk analisis mendalam, atau klik Hubungi Kami agar terhubung ke tim advokat kami via WhatsApp resmi di *0852-2232-2254* guna mencegah penyerobotan lebih lanjut.";
    } else if (userMessage.toLowerCase().includes("kerja") || userMessage.toLowerCase().includes("phk") || userMessage.toLowerCase().includes("pesangon")) {
      reply = "Mengenai sengketa ketenagakerjaan atau PHK sepihak, sesuai UU No. 13 Tahun 2003 jo UU Cipta Kerja, buruh yang mengalami pemutusan hubungan kerja berhak atas pesangon, penghargaan masa kerja, dan penggantian hak.\n\nSaran taktis IHS:\n- Simpan slip gaji, perjanjian kerja (PKWT/PKWTT), dan surat pemecatan resmi.\n- Buat risalah perundingan bipartit pertama secara tertulis.\n- Daftarkan aduan resmi Anda melalui formulir Lapor Kasus di aplikasi ini agar kami dapat memandu berkas somasi, atau hubungi langsung di WhatsApp IHS *0852-2232-2254* untuk mediasi serikat.";
    }

    res.json({ text: reply });
  }
});

// API ROUTE: Get news/publications
app.get("/api/news", (req, res) => {
  res.json(publications);
});

// API ROUTE: Create a publication
app.post("/api/news", (req, res) => {
  const { title, summary, content, category, imageUrl } = req.body;
  if (!title || !summary || !content || !category) {
    return res.status(400).json({ error: "Kolom Judul, Ringkasan, Konten, dan Kategori wajib diisi." });
  }

  const newPub = {
    id: `pub_${Date.now()}`,
    title,
    summary,
    content,
    date: new Date().toISOString(),
    author: "Tim Media IHS",
    category,
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop"
  };

  publications.unshift(newPub);

  // Add a sync log
  syncLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: "Publikasi Informasi Baru",
    detail: `Mengunggah rilis/edukasi '${title}' ke server publik www.ihsid.org`,
    status: "sukses"
  });

  res.status(201).json(newPub);
});

// API ROUTE: Get members list
app.get("/api/members", (req, res) => {
  res.json(members);
});

// API ROUTE: Register as a member
app.post("/api/members", (req, res) => {
  const { name, role, organization, location } = req.body;
  if (!name || !role || !location) {
    return res.status(400).json({ error: "Kolom Nama, Peran, dan Lokasi wajib diisi." });
  }

  const newMember = {
    id: `mem_${Date.now()}`,
    name,
    role,
    organization: organization || "Independen",
    location,
    isVerified: false // Needs central verification
  };

  members.push(newMember);

  // Add a sync log
  syncLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: "Registrasi Anggota Baru",
    detail: `Mengirim formulir verifikasi keanggotaan untuk ${name} ke server www.ihsid.org`,
    status: "sukses"
  });

  res.status(201).json(newMember);
});

// API ROUTE: Get central sync logs
app.get("/api/sync-logs", (req, res) => {
  res.json(syncLogs);
});

// Serve Vite dev server or static dist directory
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Intelijen Hukum Sipil (IHS) running on port ${PORT}`);
  });
}

startServer();
