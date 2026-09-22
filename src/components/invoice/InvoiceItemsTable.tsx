import type React from 'react';
import type { CatalogItem, InvoiceItem } from '@/types';
import { formatRupiah } from '@/utils/formatters';

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  catalog: CatalogItem[];
  revisionPercent: number;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: <K extends keyof InvoiceItem>(id: string, field: K, val: InvoiceItem[K]) => void;
  onSelectCatalog: (itemId: string, selectedName: string) => void;
}

export const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({
  items,
  catalog,
  revisionPercent,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onSelectCatalog,
}) => {
  return (
    <div className="border-t border-slate-200/80 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <i className="fa-solid fa-list-check text-indigo-600"></i> Rincian Item Layanan
        </h3>
        <button
          type="button"
          onClick={onAddItem}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
        >
          <i className="fa-solid fa-plus"></i> Tambah Item
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const sub = (Number(item.qty) || 0) * (Number(item.price) || 0);
          const rev = item.hasRevisionFee ? sub * (revisionPercent / 100) : 0;
          const rowTotal = sub + rev;

          return (
            <div
              key={item.id}
              className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 sm:p-3.5 space-y-3 relative transition hover:border-slate-300"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Item #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <i className="fa-solid fa-trash-can text-[11px]"></i> Hapus
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    Pilih Layanan Katalog
                  </label>
                  <select
                    value={catalog.some((c) => c.name === item.serviceName) ? item.serviceName : 'CUSTOM'}
                    onChange={(e) => onSelectCatalog(item.id, e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    {catalog.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name} ({formatRupiah(cat.price)}/{cat.unit})
                      </option>
                    ))}
                    <option value="CUSTOM">+ Input Kustom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    Nama / Judul Layanan
                  </label>
                  <input
                    type="text"
                    value={item.serviceName}
                    onChange={(e) => onUpdateItem(item.id, 'serviceName', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                  Deskripsi / Keterangan Layanan
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                  placeholder="Keterangan spesifik pesanan..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => onUpdateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-center font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => onUpdateItem(item.id, 'unit', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => onUpdateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100 flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-medium text-slate-700 flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={item.hasRevisionFee}
                    onChange={(e) => onUpdateItem(item.id, 'hasRevisionFee', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>Revisi Tambahan (+{revisionPercent}%)</span>
                </label>
                <span className="text-xs font-bold text-indigo-700">
                  Subtotal: {formatRupiah(rowTotal)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
