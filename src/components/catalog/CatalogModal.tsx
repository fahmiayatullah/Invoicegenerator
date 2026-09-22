import type React from 'react';

export interface CatalogModalData {
  id: string;
  category: string;
  name: string;
  price: number | '';
  unit: string;
  desc: string;
}

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CatalogModalData;
  onChange: (updated: CatalogModalData) => void;
  onSave: () => void;
}

export const CatalogModal: React.FC<CatalogModalProps> = ({
  isOpen,
  onClose,
  data,
  onChange,
  onSave,
}) => {
  if (!isOpen) return null;

  const categories = [
    'DESAIN PEMASARAN & PERIKLANAN',
    'MOTION GRAPHIC',
    'DESAIN KONTEN MEDIA SOSIAL',
    'LAYOUT & EDITORIAL',
    'BRANDING & IDENTITAS',
    'LAINNYA',
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-tag text-indigo-600"></i>
            {data.id ? 'Edit Layanan Katalog' : 'Tambah Layanan Baru'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Kategori Layanan</label>
            <select
              value={data.category}
              onChange={(e) => onChange({ ...data, category: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Layanan / Produk</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              placeholder="Contoh: Poster Promosi, Video Intro, dll."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Harga Dasar (Rp)</label>
              <input
                type="number"
                value={data.price}
                onChange={(e) =>
                  onChange({
                    ...data,
                    price: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                placeholder="60000"
                min="0"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Satuan</label>
              <input
                type="text"
                value={data.unit}
                onChange={(e) => onChange({ ...data, unit: e.target.value })}
                placeholder="desain, halaman, video, paket"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
            <textarea
              value={data.desc}
              onChange={(e) => onChange({ ...data, desc: e.target.value })}
              rows={3}
              placeholder="Keterangan cakupan layanan..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-5 py-2 text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-sm cursor-pointer"
          >
            Simpan Layanan
          </button>
        </div>
      </div>
    </div>
  );
};
