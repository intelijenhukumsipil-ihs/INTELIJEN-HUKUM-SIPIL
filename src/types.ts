export interface CaseReport {
  id: string;
  ticketNumber: string;
  title: string;
  category: 'Tanah/Properti' | 'HAM/Kekerasan' | 'Ketenagakerjaan' | 'Agraria/Lingkungan' | 'Korupsi/Wewenang' | 'Digital/Pendapat' | 'Perdata Lainnya';
  reporterName: string;
  reporterContact: string;
  isAnonymous: boolean;
  location: string;
  chronology: string;
  dateSubmitted: string;
  status: 'diterima' | 'verifikasi' | 'penanganan' | 'selesai' | 'ditutup';
  evidenceCount: number;
  evidenceFiles: { name: string; size: string; type: string; hash: string }[];
  aiAnalysis?: {
    summary: string;
    violatedArticles: string[];
    riskLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Sangat Tinggi';
    actionStrategy: string[];
    lawsReferenced: string[];
  };
}

export interface LegalTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  category: 'Rilis Pers' | 'Edukasi' | 'Kabar Kasus';
  imageUrl?: string;
}

export interface ConsultationMessage {
  id: string;
  sender: 'user' | 'ai' | 'advokat';
  text: string;
  timestamp: string;
}

export interface Member {
  id: string;
  name: string;
  role: 'Advokat' | 'Aktivis LSM' | 'Jurnalis' | 'Relawan Lapangan';
  organization: string;
  location: string;
  isVerified: boolean;
  userId?: string;
}
