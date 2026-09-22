import type React from 'react';
import { useState, useMemo } from 'react';
import type { Invoice } from '@/types';
import { formatRupiah, formatDateID } from '@/utils/formatters';

interface HistoryPageProps {
  invoices: Invoice[];
  onEditInvoice: (id: string) => void;
  onDuplicateInvoice: (id: string) => void;
  onDeletePrompt: (id: string) => void;
  onStartNewInvoice: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  invoices,
  onEditInvoice,
  onDuplicateInvoice,
  onDeletePrompt,
  onStartNewInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredInvoices = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return invoices.filter((inv) => {
      const matchQuery =
        inv.number.toLowerCase().includes(q) ||
        inv.client.name.toLowerCase().includes(q) ||
        (inv.client.business && inv.client.business.toLowerCase().includes(q));
      const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Top Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor invoice, nama pelanggan..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'Semua Status' },
            { id: 'Belum Lunas', label: 'Belum Lunas' },
            { id: 'DP', label: 'DP' },
            { id: 'Lunas', label: 'Lunas' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                statusFilter === item.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 text-lg">
              <i className="fa-regular fa-folder-open"></i>
            </div>
            <h3 className="text-sm font-bold text-slate-700">Tidak ada invoice ditemukan</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {invoices.length === 0
                ? 'Mulai buat invoice pertama Anda sekarang.'
                : 'Coba ubah kata kunci pencarian atau filter status di atas.'}
            </p>
            {invoices.length === 0 && (
              <button
                type="button"
                onClick={onStartNewInvoice}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <i className="fa-solid fa-plus"></i> Buat Invoice Baru
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">No. Invoice</th>
                  <th className="py-3.5 px-4">Pelanggan</th>
                  <th className="py-3.5 px-4">Tanggal / Tempo</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Total Tagihan</th>
                  <th className="py-3.5 px-4 text-right">Sisa Tagihan</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-indigo-900">{inv.number}</div>
                      <div className="text-[10px] text-slate-400">{inv.paymentMethod}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{inv.client.name}</div>
                      <div className="text-[11px] text-slate-500">{inv.client.business || '-'}</div>
                      <div className="text-[10px] text-slate-400">{inv.client.phone || ''}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>Terbit: <span className="text-slate-900 font-semibold">{formatDateID(inv.date)}</span></div>
                      <div className="text-[10.5px] text-slate-400">Tempo: {formatDateID(inv.due)}</div>
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                      {formatRupiah(inv.totals.grandTotal)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {inv.status === 'Lunas' ? (
                        <span className="text-emerald-600 font-bold text-[11px]">Lunas</span>
                      ) : (
                        <span className="text-rose-600 font-bold">
                          {formatRupiah(inv.totals.balanceDue)}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditInvoice(inv.id)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Buka / Edit Invoice"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDuplicateInvoice(inv.id)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                          title="Duplikasi Invoice"
                        >
                          <i className="fa-solid fa-copy"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeletePrompt(inv.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus Invoice"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
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
