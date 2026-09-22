import { forwardRef } from 'react';
import type { AppSettings, InvoiceClient, InvoiceItem, InvoiceStatus } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';
import type { CalculationsResult } from '@/hooks/useInvoiceCalculations';
import { formatRupiah, formatDateID } from '@/utils/formatters';

interface InvoicePreviewA4Props {
  settings: AppSettings;
  formInvNumber: string;
  formInvDate: string;
  formInvDue: string;
  formPaymentMethod: string;
  formInvStatus: InvoiceStatus;
  formClient: InvoiceClient;
  currentItems: InvoiceItem[];
  calculations: CalculationsResult;
}

export const InvoicePreviewA4 = forwardRef<HTMLDivElement, InvoicePreviewA4Props>(
  (
    {
      settings,
      formInvNumber,
      formInvDate,
      formInvDue,
      formPaymentMethod,
      formInvStatus,
      formClient,
      currentItems,
      calculations,
    },
    ref
  ) => {
    return (
      <div
        id="invoice-preview-container"
        ref={ref}
        className="a4-paper text-slate-900 font-sans flex flex-col justify-between text-xs leading-relaxed shadow-lg"
      >
        <div>
          {/* Header Branding */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5 mb-5 gap-4">
            <div className="flex gap-3.5 items-start">
              <div className="w-14 h-14 rounded-xl border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0 overflow-hidden">
                {settings.logoBase64 ? (
                  <img src={settings.logoBase64} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <i className="fa-solid fa-compass-drafting text-2xl text-indigo-600"></i>
                )}
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 leading-tight">
                  {settings.bizName || DEFAULT_SETTINGS.bizName}
                </h1>
                <p className="text-[10.5px] text-slate-500 font-medium mt-0.5">
                  {settings.bizAddress || DEFAULT_SETTINGS.bizAddress}
                </p>
                <p className="text-[10.5px] text-slate-500">
                  Kontak:{' '}
                  <span className="font-semibold text-slate-700">
                    {settings.bizContact} ({settings.bizPhone})
                  </span>
                </p>
                <p className="text-[10.5px] text-slate-500">
                  Email: <span className="font-semibold text-slate-700">{settings.bizEmail}</span>
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <h2 className="text-xl sm:text-2xl font-black text-indigo-900 tracking-wider">INVOICE</h2>
              <p className="text-xs sm:text-sm font-extrabold text-slate-700 mt-0.5">{formInvNumber}</p>
              <div className="mt-2 space-y-0.5 text-[10.5px]">
                <p className="text-slate-500">
                  Tanggal: <span className="font-semibold text-slate-800">{formatDateID(formInvDate)}</span>
                </p>
                <p className="text-slate-500">
                  Jatuh Tempo: <span className="font-semibold text-slate-800">{formatDateID(formInvDue)}</span>
                </p>
              </div>
              <div className="mt-2.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase border ${
                    formInvStatus === 'Lunas'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : formInvStatus === 'DP'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  {formInvStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Client Info Section */}
          <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/80 mb-5 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-wider text-indigo-600 mb-1">
                DITAGIHKAN KEPADA:
              </p>
              <h3 className="font-bold text-xs sm:text-sm text-slate-800">
                {formClient.name || 'Nama Pelanggan'}
              </h3>
              <p className="font-medium text-slate-600 text-[10.5px]">
                {formClient.business || 'Nama Usaha / Instansi'}
              </p>
              <p className="text-slate-500 text-[10.5px] mt-1 line-clamp-2">
                {formClient.address || 'Alamat Pelanggan'}
              </p>
            </div>
            <div className="text-right flex flex-col justify-end text-[10.5px] space-y-0.5">
              <p className="text-slate-500">
                WhatsApp: <span className="font-semibold text-slate-700">{formClient.phone || '-'}</span>
              </p>
              <p className="text-slate-500">
                Email: <span className="font-semibold text-slate-700">{formClient.email || '-'}</span>
              </p>
              <p className="text-slate-500">
                Metode:{' '}
                <span className="font-semibold text-slate-700">{formPaymentMethod}</span>
              </p>
            </div>
          </div>

          {/* Services & Items Table */}
          <div className="mb-5 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-2.5">Layanan / Deskripsi</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-center">Satuan</th>
                  <th className="p-2.5 text-right">Harga</th>
                  <th className="p-2.5 text-right">Revisi (+10%)</th>
                  <th className="p-2.5 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {currentItems.map((item) => {
                  const sub = (item.qty || 0) * (item.price || 0);
                  const rev = item.hasRevisionFee
                    ? sub * ((settings.revisionPercent || 10) / 100)
                    : 0;
                  const rowTot = sub + rev;

                  return (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="p-2.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900">{item.serviceName}</span>
                          {item.hasRevisionFee && (
                            <span className="bg-amber-100 text-amber-800 text-[8.5px] font-bold px-1.5 py-0.2 rounded border border-amber-200">
                              +10% REVISI
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.description || '-'}</p>
                      </td>
                      <td className="p-2.5 text-center font-bold text-slate-800">{item.qty}</td>
                      <td className="p-2.5 text-center text-slate-500">{item.unit}</td>
                      <td className="p-2.5 text-right font-medium text-slate-700">
                        {formatRupiah(item.price)}
                      </td>
                      <td className="p-2.5 text-right font-medium text-amber-700">
                        {rev > 0 ? formatRupiah(rev) : '-'}
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-900">
                        {formatRupiah(rowTot)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Payment Info & Calculations */}
          <div className="grid grid-cols-2 gap-4 items-start">
            {/* Payment / QRIS Details */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex gap-3 items-center">
              <div className="w-16 h-16 bg-white rounded-lg border border-slate-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                {settings.qrisBase64 ? (
                  <img src={settings.qrisBase64} alt="QRIS" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center text-[8px] text-slate-400 font-semibold">
                    <i className="fa-solid fa-qrcode text-lg block mb-0.5"></i> QRIS
                  </div>
                )}
              </div>
              <div className="text-[10.5px]">
                <p className="font-bold text-indigo-900 uppercase text-[9.5px]">
                  REKENING PEMBAYARAN:
                </p>
                <p className="font-bold text-slate-800">{settings.bankName}</p>
                <p className="font-extrabold text-slate-900 tracking-wider text-xs">
                  {settings.bankAcc}
                </p>
                <p className="text-slate-500">a.n {settings.bankHolder}</p>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-[11px] bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Layanan:</span>
                <span className="font-semibold text-slate-800">
                  {formatRupiah(calculations.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Biaya Revisi (+10%):</span>
                <span className="font-semibold text-amber-700">
                  {formatRupiah(calculations.revisionTotal)}
                </span>
              </div>
              <div className="flex justify-between text-xs font-black text-indigo-950 border-t border-slate-200 pt-1.5 mt-1">
                <span>TOTAL TAGIHAN:</span>
                <span className="text-indigo-600">{formatRupiah(calculations.grandTotal)}</span>
              </div>
              {formInvStatus === 'DP' && calculations.dpAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Telah Dibayar (DP):</span>
                  <span>- {formatRupiah(calculations.dpAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-black bg-slate-900 text-white p-2 rounded-lg mt-1.5">
                <span>SISA TAGIHAN:</span>
                <span className="text-sky-300">{formatRupiah(calculations.balanceDue)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer & Service Terms */}
        <div className="border-t border-slate-200 pt-3 mt-4 text-[9.5px] text-slate-500 leading-normal">
          <p className="font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
            <i className="fa-solid fa-circle-info text-indigo-600"></i> Syarat & Ketentuan Layanan:
          </p>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5 list-disc list-inside">
            <li>Harga sudah termasuk maksimal 3 kali revisi minor gratis.</li>
            <li>Revisi ke-4 dan seterusnya dikenakan biaya tambahan 10%.</li>
            <li>Layout buku dihitung proporsional per jumlah total halaman.</li>
            <li>File final master resolusi tinggi diserahkan setelah pelunasan.</li>
          </ul>
          <div className="mt-3 flex justify-between items-center text-[9px] text-slate-400">
            <span>
              Terima kasih atas kerja sama Anda dengan{' '}
              <strong className="text-slate-600">{settings.bizName}</strong>.
            </span>
            <span className="italic">Dokumen sah digital • {settings.bizContact}</span>
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreviewA4.displayName = 'InvoicePreviewA4';
