import type React from 'react';
import type { ActiveTab, Invoice } from '@/types';
import { formatRupiah, formatDateID } from '@/utils/formatters';

interface DashboardPageProps {
  invoices: Invoice[];
  setActiveTab: (tab: ActiveTab) => void;
  onEditInvoice: (id: string) => void;
  onStartNewInvoice: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  invoices,
  setActiveTab,
  onEditInvoice,
  onStartNewInvoice,
}) => {
  // Hitung metrik ringkasan
  let lunasCount = 0;
  let pendingCount = 0;
  let totalIncome = 0;
  let totalOutstanding = 0;

  invoices.forEach((inv) => {
    if (inv.status === 'Lunas') {
      lunasCount++;
      totalIncome += inv.totals.grandTotal;
    } else if (inv.status === 'DP') {
      pendingCount++;
      totalIncome += inv.dpAmount || 0;
      totalOutstanding += inv.totals.balanceDue;
    } else {
      pendingCount++;
      totalOutstanding += inv.totals.grandTotal;
    }
  });

  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-indigo-100 mb-3 border border-white/20">
            Official Invoice System
          </span>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            Kelola Penagihan & Invoice Bisnis Lebih Efisien
          </h2>
          <p className="text-indigo-200 text-xs sm:text-sm mt-2 leading-relaxed">
            Pantau status tagihan pelanggan, rincian biaya revisi 10%, serta buat dokumen invoice resmi format A4 dan 1080×1350 HD.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onStartNewInvoice}
              className="bg-white text-indigo-900 hover:bg-indigo-50 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-plus text-indigo-600"></i> Buat Invoice Sekarang
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className="bg-indigo-600/40 hover:bg-indigo-600/60 border border-white/20 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-clock-rotate-left"></i> Lihat Riwayat ({invoices.length})
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 text-white pointer-events-none hidden md:block">
          <i className="fa-solid fa-file-invoice-dollar text-[240px]"></i>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Invoices */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Total Invoice
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
              <i className="fa-solid fa-folder-open"></i>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{invoices.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Dokumen tersimpan</p>
        </div>

        {/* Lunas */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
              Status Lunas
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
              <i className="fa-solid fa-circle-check"></i>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{lunasCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Tagihan terlunasi</p>
        </div>

        {/* Total Income */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
              Total Diterima
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
              <i className="fa-solid fa-wallet"></i>
            </div>
          </div>
          <p className="text-base sm:text-xl font-black text-emerald-700 mt-2 truncate">
            {formatRupiah(totalIncome)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Pemasukan kas masuk</p>
        </div>

        {/* Outstanding / Pending */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
              Sisa Tagihan
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
              <i className="fa-solid fa-hourglass-half"></i>
            </div>
          </div>
          <p className="text-base sm:text-xl font-black text-amber-700 mt-2 truncate">
            {formatRupiah(totalOutstanding)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{pendingCount} tagihan berjalan</p>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-indigo-600"></i> Invoice Terbaru
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Daftar transaksi yang baru dibuat</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            Lihat Semua <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 text-lg">
              <i className="fa-regular fa-folder-open"></i>
            </div>
            <p className="text-sm font-semibold text-slate-600">Belum ada invoice dibuat</p>
            <p className="text-xs text-slate-400 mt-1">
              Klik tombol &quot;Buat Invoice Sekarang&quot; di atas untuk membuat dokumen pertama.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. Invoice</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Total Tagihan</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-bold text-indigo-900">{inv.number}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{inv.client.name}</div>
                      <div className="text-[11px] text-slate-400">{inv.client.business || '-'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{formatDateID(inv.date)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          inv.status === 'Lunas'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : inv.status === 'DP'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatRupiah(inv.totals.grandTotal)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onEditInvoice(inv.id)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Buka
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
