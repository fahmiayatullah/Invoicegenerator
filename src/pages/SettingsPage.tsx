import type React from 'react';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { AppSettings } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';

interface SettingsPageProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onSaveSettings,
  showToast,
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);

  const handleMediaUpload = (e: ChangeEvent<HTMLInputElement>, type: 'logo' | 'qris') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran file maksimal 2MB!', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      if (type === 'logo') {
        setFormData((prev) => ({ ...prev, logoBase64: base64 }));
      } else {
        setFormData((prev) => ({ ...prev, qrisBase64: base64 }));
      }
      showToast(`Gambar ${type.toUpperCase()} berhasil diunggah!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleClearMedia = (type: 'logo' | 'qris') => {
    if (type === 'logo') {
      setFormData((prev) => ({ ...prev, logoBase64: '' }));
    } else {
      setFormData((prev) => ({ ...prev, qrisBase64: '' }));
    }
    showToast(`Gambar ${type.toUpperCase()} dihapus`, 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    showToast('Pengaturan usaha berhasil disimpan!', 'success');
  };

  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan pengaturan ke setelan awal pabrik?')) {
      setFormData(DEFAULT_SETTINGS);
      onSaveSettings(DEFAULT_SETTINGS);
      showToast('Pengaturan dikembalikan ke default', 'info');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-gear text-indigo-600"></i> Pengaturan Profil Usaha
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Informasi ini akan tercetak secara otomatis pada header & footer dokumen invoice
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition border border-slate-200 cursor-pointer"
          >
            Reset Default
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer"
          >
            Simpan Pengaturan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Section 1: Business Profile */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2 border-b border-slate-100 pb-2">
            <i className="fa-solid fa-building"></i> Identitas Bisnis
          </h3>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Nama Usaha / Brand
            </label>
            <input
              type="text"
              value={formData.bizName}
              onChange={(e) => setFormData({ ...formData, bizName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Nama Kontak / Penanggung Jawab
            </label>
            <input
              type="text"
              value={formData.bizContact}
              onChange={(e) => setFormData({ ...formData, bizContact: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                No. WhatsApp
              </label>
              <input
                type="text"
                value={formData.bizPhone}
                onChange={(e) => setFormData({ ...formData, bizPhone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                value={formData.bizEmail}
                onChange={(e) => setFormData({ ...formData, bizEmail: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Alamat Lengkap Usaha
            </label>
            <textarea
              rows={2}
              value={formData.bizAddress}
              onChange={(e) => setFormData({ ...formData, bizAddress: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
        </div>

        {/* Section 2: Bank & Payment Info */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2 border-b border-slate-100 pb-2">
            <i className="fa-solid fa-credit-card"></i> Rekening Pembayaran
          </h3>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Nama Bank / Dompet Digital
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              placeholder="Bank BCA / Mandiri / BNI"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Nomor Rekening
            </label>
            <input
              type="text"
              value={formData.bankAcc}
              onChange={(e) => setFormData({ ...formData, bankAcc: e.target.value })}
              placeholder="123-456-7890"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Atas Nama Rekening
            </label>
            <input
              type="text"
              value={formData.bankHolder}
              onChange={(e) => setFormData({ ...formData, bankHolder: e.target.value })}
              placeholder="Nama Pemilik Rekening"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Section 3: Revision Rules */}
          <div className="border-t border-slate-100 pt-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
              Ketentuan Revisi
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                  Revisi Gratis (x)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.freeRevisions}
                  onChange={(e) =>
                    setFormData({ ...formData, freeRevisions: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-center font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                  Biaya Revisi ke-4+ (%)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.revisionPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      revisionPercent: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-center font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Media Uploads (Logo & QRIS) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2 border-b border-slate-100 pb-2">
            <i className="fa-solid fa-image"></i> Gambar Logo & Kode QRIS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-slate-600 uppercase">
                Logo Usaha (Maks. 2MB)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {formData.logoBase64 ? (
                    <img
                      src={formData.logoBase64}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <i className="fa-solid fa-compass-drafting text-2xl text-slate-300"></i>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMediaUpload(e, 'logo')}
                    className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                  {formData.logoBase64 && (
                    <button
                      type="button"
                      onClick={() => handleClearMedia('logo')}
                      className="block text-xs text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                    >
                      <i className="fa-solid fa-trash-can mr-1"></i> Hapus Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* QRIS Upload */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-slate-600 uppercase">
                QRIS Pembayaran (Maks. 2MB)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {formData.qrisBase64 ? (
                    <img
                      src={formData.qrisBase64}
                      alt="QRIS"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <i className="fa-solid fa-qrcode text-2xl text-slate-300"></i>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMediaUpload(e, 'qris')}
                    className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                  {formData.qrisBase64 && (
                    <button
                      type="button"
                      onClick={() => handleClearMedia('qris')}
                      className="block text-xs text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                    >
                      <i className="fa-solid fa-trash-can mr-1"></i> Hapus QRIS
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
