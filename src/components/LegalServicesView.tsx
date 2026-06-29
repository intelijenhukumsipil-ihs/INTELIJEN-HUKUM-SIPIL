import React, { useState } from "react";
import { 
  Gavel, 
  BookOpen, 
  FileSignature, 
  HelpCircle, 
  Copy, 
  Check, 
  Scale, 
  Clock, 
  FileText,
  ChevronRight,
  Info
} from "lucide-react";
import { LegalTemplate } from "../types";

export default function LegalServicesView() {
  const [activeTab, setActiveTab] = useState<"panduan" | "templates" | "sidang">("panduan");
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  // Seeded templates ready to copy
  const legalTemplates: LegalTemplate[] = [
    {
      id: "tmpl_1",
      title: "Surat Somasi (Teguran Hukum) Kasus Penyerobotan Lahan",
      description: "Gunakan template somasi tertulis ini untuk memberikan peringatan keras pertama kepada pihak korporasi atau perorangan yang menduduki tanah tanpa hak.",
      category: "Agraria & Tanah",
      content: `SURAT TEGURAN HUKUM (SOMASI)

Kepada Yth.
Pimpinan PT / Saudara [Nama Pihak Pelanggar]
Di tempat.

Dengan hormat,
Saya yang bertandatangan di bawah ini:
Nama: [Nama Anda / Kuasa Hukum]
Pekerjaan: [Pekerjaan Anda]
Alamat: [Alamat Lengkap Anda]

Bertindak untuk dan atas nama diri sendiri / klien kami, dengan ini melayangkan TUGURAN HUKUM (SOMASI) kepada Saudara atas dasar hal-hal sebagai berikut:

1. Bahwa saya adalah pemilik sah atas sebidang tanah hak milik seluas [Luas Tanah] m2 yang terletak di [Alamat Lokasi Lahan], berdasarkan bukti kepemilikan Sertifikat Hak Milik (SHM) No. [Nomor Sertifikat] / Surat Keterangan Tanah Adat No. [Nomor Surat].
2. Bahwa sejak tanggal [Tanggal Kejadian], Saudara telah secara melawan hukum menguasai, menduduki, dan/atau melakukan aktivitas di atas bidang tanah milik saya tersebut tanpa izin tertulis dari saya.
3. Bahwa tindakan Saudara tersebut merupakan Perbuatan Melanggar Hukum (PMH) sebagaimana diatur dalam Pasal 1365 KUHPerdata serta melanggar Pasal 385 KUHP tentang Penyerobotan Lahan.

Berdasarkan hal-hal tersebut di atas, dengan ini saya MEMPERINGATKAN Saudara untuk:
- Menghentikan segala bentuk aktivitas di atas tanah milik saya tersebut seketika setelah menerima surat ini.
- Mengosongkan tanah milik saya tersebut dan mengembalikannya ke kondisi semula dalam waktu paling lambat 7 (tujuh) hari kalender sejak tanggal surat ini diterima.

Apabila Saudara mengabaikan somasi ini, maka saya akan menempuh jalur hukum baik pidana maupun perdata secara tegas, serta melaporkan hal ini ke instansi kepolisian dan portal Intelijen Hukum Sipil (IHS).

[Kota], [Tanggal]
Hormat saya,

[Tanda Tangan & Nama Terang]`
    },
    {
      id: "tmpl_2",
      title: "Surat Pengaduan Dugaan Pelanggaran HAM ke Komnas HAM",
      description: "Surat pengaduan resmi jika terjadi intimidasi, kekerasan fisik, atau kriminalisasi paksa yang melibatkan aparat negara/senjata.",
      category: "Hak Asasi Manusia",
      content: `Perihal: Laporan Pengaduan Dugaan Pelanggaran Hak Asasi Manusia
Lampiran: [Sebutkan berkas bukti yang ada, misalnya: Rekaman video, foto luka, kronologi tertulis]

Kepada Yth.
Ketua Komisi Nasional Hak Asasi Manusia (Komnas HAM)
Jalan Latuharhary No. 4B, Menteng, Jakarta Pusat

Dengan hormat,
Saya yang bertandatangan di bawah ini menyampaikan laporan pengaduan terkait dugaan terjadinya pelanggaran Hak Asasi Manusia (HAM) dengan rincian sebagai berikut:

I. IDENTITAS KORBAN
Nama: [Nama Korban]
Pekerjaan: [Pekerjaan Korban]
Alamat: [Alamat Lengkap Korban]
No. Kontak: [Nomor HP Korban]

II. IDENTITAS TERLAPOR (DUGAAN PELAKU)
Nama/Pangkat/Instansi: [Nama Oknum Aparat / Jabatan / Korporasi yang Melakukan Tindakan]

III. KRONOLOGI KEJADIAN
[Tuliskan kronologi kejadian secara detail di sini, termasuk tanggal, waktu, lokasi, bentuk intimidasi atau kekerasan fisik yang dialami, dan akibat yang diderita korban].

IV. HAK ASASI YANG DIDUGA DILANGGAR
1. Hak Atas Rasa Aman (Pasal 29 UU No. 39/1999 tentang HAM)
2. Hak Atas Kepemilikan Lahan/Properti Hidup (Pasal 36 UU No. 39/1999 tentang HAM)
3. Hak Bebas dari Intimidasi dan Penyiksaan.

Kami memohon agar Komnas HAM dapat segera melakukan investigasi independen lapangan, memberikan perlindungan bagi korban, serta merekomendasikan penegakan hukum disiplin maupun pidana bagi Terlapor.

[Kota], [Tanggal]
Pelapor,

[Tanda Tangan & Nama Terang]`
    },
    {
      id: "tmpl_3",
      title: "Surat Sanggahan Keberatan Pungli Sertifikat Tanah PTSL BPN",
      description: "Gunakan draf surat keberatan resmi ini untuk menolak secara tertulis biaya pungutan liar PTSL di desa Anda yang melebihi aturan SKB 3 Menteri.",
      category: "Korupsi & Aparat",
      content: `SURAT KEBERATAN ATAS BIAYA PENGURUSAN PTSL DI LUAR ATURAN RESMI

Kepada Yth.
Kepala Desa / Lurah [Nama Desa/Kelurahan]
Tembusan Yth: Kepala Kantor Pertanahan (BPN) Kabupaten/Kota [Nama Kabupaten]

Dengan hormat,
Sehubungan dengan pelaksanaan program Pendaftaran Tanah Sistematis Lengkap (PTSL) di lingkungan Desa/Kelurahan [Nama Desa], saya warga desa yang bertandatangan di bawah ini mengajukan KEBERATAN tertulis resmi terkait pembebanan biaya pengurusan sertifikat tanah sebesar [Jumlah Biaya yang Diminta, misalnya: Rp 1.500.000].

Adapun alasan keberatan saya adalah sebagai berikut:
1. Bahwa berdasarkan Keputusan Bersama Menteri ATR/BPN, Menteri Dalam Negeri, dan Menteri Desa PDTT No. 25/2017 (SKB 3 Menteri), biaya maksimal PTSL untuk Kategori V (Wilayah Jawa) dibatasi maksimal sebesar Rp 150.000 (seratus lima puluh ribu rupiah) untuk biaya patok dan materai.
2. Bahwa biaya pengurusan yang dibebankan kepada saya sebesar [Jumlah Biaya yang Diminta] melampaui ketentuan hukum yang berlaku dan dikategorikan sebagai pungutan liar (pungli) / pemerasan penyalahgunaan wewenang aparat sesuai UU Pemberantasan Tindak Pidana Korupsi.

Berdasarkan hal tersebut, saya menyatakan menolak pembebanan biaya tambahan di luar ketentuan SKB 3 Menteri tersebut dan mendesak agar berkas tanah saya tetap diproses ke Kantor BPN sesuai dengan hak administratif saya selaku warga negara.

[Kota], [Tanggal]
Hormat saya,

[Tanda Tangan & Nama Terang]`
    }
  ];

  // Indonesian laws guide database
  const lawsGuide = [
    {
      title: "UU Pokok Agraria (UUPA) No. 5 Tahun 1960",
      description: "Pilar utama hukum pertanahan di Indonesia. Mengatur bahwa seluruh hak atas bumi, air, dan ruang angkasa memiliki fungsi sosial. UU ini secara resmi mengakui keberadaan 'Hak Ulayat' atau hak tanah adat milik masyarakat hukum adat setempat selama kenyataannya masih ada dan sesuai kepentingan nasional.",
      keyPoint: "Melindungi tanah ulayat desa adat dari klaim sepihak HGU korporasi kelapa sawit atau pertambangan."
    },
    {
      title: "UU HAM No. 39 Tahun 1999 tentang Hak Asasi Manusia",
      description: "Peraturan yang menjamin perlindungan hak-hak dasar manusia yang wajib dihormati oleh negara, pemerintah, maupun sesama warga negara. Menjamin hak atas rasa aman, bebas dari penyiksaan, intimidasi aparat bersenjata, penggusuran paksa tanpa ganti rugi layak, dan hak membela diri secara hukum.",
      keyPoint: "Dasar hukum perlindungan masyarakat sipil dari intimidasi oknum aparat keamanan bersenjata saat konflik lahan."
    },
    {
      title: "UU Ketenagakerjaan No. 13 Tahun 2003 jo UU Cipta Kerja",
      description: "Mengatur tata kelola perlindungan buruh dan hubungan industrial. Menegaskan hak pekerja tetap atas uang pesangon, penghargaan masa kerja, dan penggantian hak jika terjadi PHK sepihak oleh pemberi kerja, serta kebebasan berserikat mendirikan serikat buruh.",
      keyPoint: "Melindungi pekerja dari PHK sepihak paksa tanpa pesangon kelayakan."
    },
    {
      title: "UU Informasi dan Transaksi Elektronik (UU ITE) No. 19 Tahun 2016",
      description: "Mengatur transaksi digital dan konten internet. Di dalamnya terdapat 'pasal karet' pencemaran nama baik (Pasal 27 Ayat 3) yang sering disalahgunakan untuk mengkriminalisasi aktivis lingkungan atau pers bebas yang mengkritik ketidakadilan di media sosial.",
      keyPoint: "IHS mendesak implementasi SKB 3 Menteri agar penyidik mengedepankan mediasi (restorative justice) sebelum pidana penjara."
    }
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplateId(id);
    setTimeout(() => setCopiedTemplateId(null), 2000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Tab Select Bar */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("panduan")}
          className={`px-5 py-3 text-xs sm:text-sm font-bold font-mono tracking-wider transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "panduan" 
              ? "border-red-600 text-white" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          PANDUAN REGULASI & HUKUM
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-5 py-3 text-xs sm:text-sm font-bold font-mono tracking-wider transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "templates" 
              ? "border-red-600 text-white" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileSignature className="w-4 h-4" />
          TEMPLATE DRAF DOKUMEN
        </button>
        <button
          onClick={() => setActiveTab("sidang")}
          className={`px-5 py-3 text-xs sm:text-sm font-bold font-mono tracking-wider transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "sidang" 
              ? "border-red-600 text-white" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Scale className="w-4 h-4" />
          TAHAPAN PROSES HUKUM
        </button>
      </div>

      {/* Render Active Tab View */}
      {activeTab === "panduan" && (
        <div className="space-y-6">
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 flex gap-3.5 items-start">
            <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white font-sans">Literasi Hukum untuk Keadilan Rakyat</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kumpulan intisari undang-undang nasional Republik Indonesia dalam bahasa sederhana yang disusun agar masyarakat 
                biasa dapat memahami hak konstitusional mereka saat menghadapi sengketa, intimidasi, maupun penyelewengan kuasa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lawsGuide.map((law, idx) => (
              <div key={idx} className="bg-[#0a0a0a] border border-slate-800 p-5 rounded-xl space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-sm font-extrabold text-white font-sans flex items-center gap-2">
                    <Scale className="w-4 h-4 text-red-500 shrink-0" />
                    {law.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">{law.description}</p>
                </div>
                <div className="bg-[#050505] p-2.5 rounded-lg border border-slate-800 border-l-2 border-l-red-600 text-[11px] text-slate-300">
                  <span className="font-extrabold text-red-500 font-mono block mb-0.5">POIN UTAMA (ADVOKASI SIPIL):</span>
                  {law.keyPoint}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "templates" && (
        <div className="space-y-6">
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5">
            <h4 className="text-sm font-bold text-white mb-1.5 font-sans">Template Pengaduan Mandiri Siap Pakai</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Anda tidak perlu membayar pengacara mahal untuk melayangkan somasi pertama atau membuat berkas pengaduan ke Komnas HAM. 
              Salin draf di bawah ini, isi kurung siku sesuai fakta kasus Anda, cetak dan kirim secara resmi.
            </p>
          </div>

          <div className="space-y-6">
            {legalTemplates.map((tmpl) => (
              <div key={tmpl.id} className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-red-500 bg-red-950/20 border border-red-900/30 px-2 py-0.5 rounded">
                      Kategori: {tmpl.category}
                    </span>
                    <h3 className="text-sm font-extrabold text-white mt-1.5 font-sans">{tmpl.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{tmpl.description}</p>
                  </div>
                  
                  <button
                    onClick={() => handleCopy(tmpl.id, tmpl.content)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-850 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedTemplateId === tmpl.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        SALINAN DISALIN!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        SALIN DRAF SURAT
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-[#050505] border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-400 leading-relaxed max-h-[220px] overflow-y-auto whitespace-pre-wrap">
                  {tmpl.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "sidang" && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 text-center">
            <h4 className="text-sm font-bold text-white mb-1 font-sans">Tahapan Alur Litigasi Gugatan Sipil / Perdata</h4>
            <p className="text-xs text-slate-400">Pahami alur standar sengketa perdata mandiri mulai dari teguran somasi hingga putusan inkrah di pengadilan negeri</p>
          </div>

          {/* Court Timeline Steps Flow */}
          <div className="relative border-l border-slate-800 ml-4 space-y-6 py-2">
            {[
              { title: "1. Somasi Tertulis & Teguran (Luar Pengadilan)", desc: "Pengiriman somasi tertulis (1-3 kali) mendesak pihak pelanggar mengembalikan hak perdata. Dilengkapi mediasi bipartit independen." },
              { title: "2. Pendaftaran Gugatan Ke Pengadilan Negeri", desc: "Draf surat gugatan didaftarkan secara e-court/fisik ke Kepaniteraan Pengadilan Negeri wilayah tergugat berada." },
              { title: "3. Mediasi Wajib (Tingkat Pengadilan)", desc: "Sidang pertama selalu diwajibkan melakukan mediasi damai yang dipandu oleh Hakim Mediator independen pengadilan." },
              { title: "4. Jawab-Menjawab Sidang (Jawaban, Replik, Duplik)", desc: "Proses jawab-menjawab tertulis dari tergugat (Jawaban), bantahan dari penggugat (Replik), dan tanggapan balik tergugat (Duplik)." },
              { title: "5. Sidang Pembuktian (Krusial)", desc: "Pihak mengajukan bukti-bukti surat terenkripsi (seperti yang diamankan di Evidence Vault) serta saksi ahli hukum atau saksi lapangan fakta." },
              { title: "6. Pembacaan Putusan Hakim", desc: "Majelis Hakim membacakan putusan akhir perkara perdata yang menyatakan bersalah atau menolak gugatan sengketa." }
            ].map((step, idx) => (
              <div key={idx} className="relative pl-6">
                {/* Timeline Dot */}
                <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#050505] border-2 border-red-600 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                </span>
                
                <div className="bg-[#0a0a0a] border border-slate-800 p-4 rounded-xl space-y-1 text-left">
                  <h4 className="text-xs font-bold text-white font-sans">{step.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
