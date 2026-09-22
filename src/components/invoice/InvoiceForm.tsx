import type React from 'react';
import type { AppSettings, CatalogItem, InvoiceClient, InvoiceItem, InvoiceStatus } from '@/types';
import type { CalculationsResult } from '@/hooks/useInvoiceCalculations';
import { InvoiceItemsTable } from './InvoiceItemsTable';
import { formatRupiah } from '@/utils/formatters';

interface InvoiceFormProps {
  settings: AppSettings;
  catalog: CatalogItem[];
  formInvNumber: string;
  setFormInvNumber: (val: string) => void;
  formInvDate: string;
  setFormInvDate: (val: string) => void;
  formInvDue: string;
  setFormInvDue: (val: string) => void;
  formPaymentMethod: string;
  setFormPaymentMethod: (val: string) => void;
  formInvStatus: InvoiceStatus;
  setFormInvStatus: (val: InvoiceStatus) => void;
  formInvDp: number;
  setFormInvDp: (val: number) => void;
  formClient: InvoiceClient;
  setFormClient: React.Dispatch<React.SetStateAction<InvoiceClient>>;
  currentItems: InvoiceItem[];
  calculations: CalculationsResult;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: <K extends keyof InvoiceItem>(id: string, field: K, val: InvoiceItem[K]) => void;
  onSelectCatalog: (itemId: string, selectedName: string) => void;
  onSaveInvoice: () => void;
  onStartNewInvoice: () => void;
  isEditing: boolean;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  settings,
  catalog,
  formInvNumber,
  setFormInvNumber,
  formInvDate,
  setFormInvDate,
  formInvDue,
  setFormInvDue,
  formPaymentMethod,
  setFormPaymentMethod,
  formInvStatus,
  setFormInvStatus,
  formInvDp,
  setFormInvDp,
  formClient,
  setFormClient,
  currentItems,
  calculations,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onSelectCatalog,
  onSaveInvoice,
  onStartNewInvoice,
  isEditing,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200/80 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-file-pen text-indigo-600"></i>
          {isEditing ? 'Perbarui Data Invoice' : 'Form Pembuatan Invoice'}
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={onStartNewInvoice}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <i className="fa-solid fa-plus"></i> Beralih ke Baru
          </button>
        )}
      </div>

      {/* Basic Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            Nomor Invoice
          </label>
          <input
            type="text"
            value={formInvNumber}
            onChange={(e) => setFormInvNumber(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            Metode Pembayaran
          </label>
          <input
            type="text"
            value={formPaymentMethod}
            onChange={(e) => setFormPaymentMethod(e.target.value)}
            placeholder="Transfer Bank BCA / QRIS"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            Tanggal Terbit
          </label>
          <input
            type="date"
            value={formInvDate}
            onChange={(e) => setFormInvDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            Jatuh Tempo
          </label>
          <input
            type="date"
            value={formInvDue}
            onChange={(e) => setFormInvDue(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Payment Status Selector */}
      <div>
        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
          Status Pembayaran
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['Belum Lunas', 'DP', 'Lunas'] as InvoiceStatus[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFormInvStatus(st)}
              className={`py-2 text-xs font-bold rounded-xl transition border cursor-pointer ${
                formInvStatus === st
                  ? st === 'Lunas'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : st === 'DP'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {formInvStatus === 'DP' && (
          <div className="mt-3 bg-blue-50 p-3 rounded-xl border border-blue-100 animate-fadeIn">
            <label className="block text-[11px] font-bold text-blue-900 uppercase mb-1">
              Nominal DP (Uang Muka)
            </label>
            <input
              type="number"
              value={formInvDp}
              onChange={(e) => setFormInvDp(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs sm:text-sm font-bold text-blue-950 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Client Information */}
      <div className="border-t border-slate-200/80 pt-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <i className="fa-solid fa-user text-indigo-600"></i> Informasi Pelanggan / Klien
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
              Nama Pelanggan / PIC *
            </label>
            <input
              type="text"
              value={formClient.name}
              onChange={(e) => setFormClient((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Nama Lengkap Klien"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
              Nama Usaha / Lembaga
            </label>
            <input
              type="text"
              value={formClient.business}
              onChange={(e) => setFormClient((prev) => ({ ...prev, business: e.target.value }))}
              placeholder="Contoh: PT Kreatif Nusantara"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
              No. WhatsApp
            </label>
            <input
              type="text"
              value={formClient.phone}
              onChange={(e) => setFormClient((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="08123456789"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              value={formClient.email}
              onChange={(e) => setFormClient((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="client@email.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
            Alamat Klien
          </label>
          <textarea
            value={formClient.address}
            onChange={(e) => setFormClient((prev) => ({ ...prev, address: e.target.value }))}
            placeholder="Alamat lengkap instansi / kantor..."
            rows={2}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>
      </div>

      {/* Items Table */}
      <InvoiceItemsTable
        items={currentItems}
        catalog={catalog}
        revisionPercent={settings.revisionPercent || 10}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
        onUpdateItem={onUpdateItem}
        onSelectCatalog={onSelectCatalog}
      />

      {/* Calculations Box */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
        <div className="flex justify-between text-xs text-slate-600">
          <span>Subtotal Layanan:</span>
          <span className="font-bold text-slate-800">{formatRupiah(calculations.subtotal)}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Biaya Revisi Tambahan (+{settings.revisionPercent || 10}%):</span>
          <span className="font-bold text-amber-700">
            {formatRupiah(calculations.revisionTotal)}
          </span>
        </div>
        <div className="flex justify-between text-sm font-extrabold text-indigo-900 border-t border-slate-200 pt-2">
          <span>Total Tagihan:</span>
          <span className="text-indigo-600 font-black">
            {formatRupiah(calculations.grandTotal)}
          </span>
        </div>
        {formInvStatus === 'DP' && calculations.dpAmount > 0 && (
          <div className="flex justify-between text-xs font-bold text-emerald-700">
            <span>Telah Dibayar (DP):</span>
            <span>- {formatRupiah(calculations.dpAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs sm:text-sm font-black bg-slate-900 text-white p-2.5 rounded-lg">
          <span>Sisa Tagihan:</span>
          <span className="text-sky-300">{formatRupiah(calculations.balanceDue)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSaveInvoice}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <i className="fa-solid fa-floppy-disk"></i>
          <span>{isEditing ? 'Simpan Perubahan Invoice' : 'Simpan Invoice & Lihat Riwayat'}</span>
        </button>
      </div>
    </div>
  );
};
