// ==========================================
// TYPES & INTERFACES (Invoice Generator)
// ==========================================

export interface AppSettings {
  bizName: string;
  bizContact: string;
  bizPhone: string;
  bizEmail: string;
  bizAddress: string;
  logoBase64: string;
  qrisBase64: string;
  bankName: string;
  bankAcc: string;
  bankHolder: string;
  freeRevisions: number;
  revisionPercent: number;
}

export interface CatalogItem {
  id: string;
  category: string;
  name: string;
  price: number;
  unit: string;
  desc: string;
}

export interface InvoiceItem {
  id: string;
  serviceName: string;
  description: string;
  qty: number;
  unit: string;
  price: number;
  hasRevisionFee: boolean;
}

export interface InvoiceClient {
  name: string;
  business: string;
  phone: string;
  email: string;
  address: string;
}

export interface InvoiceTotals {
  subtotal: number;
  revisionTotal: number;
  grandTotal: number;
  balanceDue: number;
}

export type InvoiceStatus = 'Belum Lunas' | 'DP' | 'Lunas';

export interface Invoice {
  id: string;
  number: string;
  date: string;
  due: string;
  paymentMethod: string;
  status: InvoiceStatus;
  dpAmount: number;
  client: InvoiceClient;
  items: InvoiceItem[];
  totals: InvoiceTotals;
  updatedAt: string;
  createdAt?: string;
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: (() => void) | null;
}

export type ActiveTab = 'dashboard' | 'create' | 'history' | 'catalog' | 'settings';

// ==========================================
// DEFAULT CONSTANTS
// ==========================================

export const BLANK_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export const DEFAULT_SETTINGS: AppSettings = {
  bizName: "Gagal Jadi Filsuf",
  bizContact: "Fahmi Ayatullah",
  bizPhone: "082213297661",
  bizEmail: "punelcommuniaction@gmail.com",
  bizAddress: "Sampangan, Kedungrejo, Muncar, Banyuwangi.",
  logoBase64: "",
  qrisBase64: "",
  bankName: "Bank BCA",
  bankAcc: "123-456-7890",
  bankHolder: "Fahmi Ayatullah",
  freeRevisions: 3,
  revisionPercent: 10
};

export const DEFAULT_CATALOG: CatalogItem[] = [
  { id: "cat-1", category: "DESAIN PEMASARAN & PERIKLANAN", name: "Poster", price: 60000, unit: "desain", desc: "Pembuatan materi visual poster untuk promosi" },
  { id: "cat-2", category: "DESAIN PEMASARAN & PERIKLANAN", name: "Brosur", price: 60000, unit: "desain", desc: "Desain brosur promosi lipat / flyer" },
  { id: "cat-3", category: "DESAIN PEMASARAN & PERIKLANAN", name: "Banner Iklan Digital", price: 60000, unit: "desain", desc: "Visual banner promosi web & media sosial" },
  { id: "cat-4", category: "DESAIN PEMASARAN & PERIKLANAN", name: "Baliho", price: 60000, unit: "desain", desc: "Materi visual baliho / spanduk outdoor" },
  { id: "cat-5", category: "MOTION GRAPHIC", name: "Video Intro", price: 70000, unit: "desain", desc: "Video intro animasi motion graphic" },
  { id: "cat-6", category: "DESAIN KONTEN MEDIA SOSIAL", name: "Konten Media Sosial (Paket)", price: 60000, unit: "3 desain", desc: "Layanan rutin per 1 paket (3 desain = Rp60.000)" },
  { id: "cat-7", category: "LAYOUT & EDITORIAL", name: "Layout Buku", price: 10000, unit: "halaman", desc: "Tata letak halaman isi buku (Rp10.000 / halaman)" },
  { id: "cat-8", category: "LAYOUT & EDITORIAL", name: "Desain Cover Buku", price: 100000, unit: "desain", desc: "Desain sampul buku depan, punggung & belakang" }
];
