import type React from 'react';
import type { CatalogItem } from '@/types';
import { formatRupiah } from '@/utils/formatters';

interface CatalogPageProps {
  catalog: CatalogItem[];
  onOpenModal: (catId?: string) => void;
  onDeletePrompt: (catId: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  catalog,
  onOpenModal,
  onDeletePrompt,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-tags text-indigo-600"></i> Katalog & Harga Layanan
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar harga standar untuk mempermudah pemilihan layanan saat membuat invoice
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <i className="fa-solid fa-plus"></i> Tambah Layanan
        </button>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Nama Layanan / Produk</th>
                <th className="py-3.5 px-4">Deskripsi</th>
                <th className="py-3.5 px-4 text-right">Harga Dasar</th>
                <th className="py-3.5 px-4 text-center">Satuan</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {catalog.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[9.5px] font-extrabold bg-slate-100 text-slate-700 uppercase tracking-wide border border-slate-200">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.name}</td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{item.desc || '-'}</td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-indigo-700">
                    {formatRupiah(item.price)}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-500">{item.unit}</td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenModal(item.id)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Edit Layanan"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeletePrompt(item.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus Layanan"
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
      </div>
    </div>
  );
};
