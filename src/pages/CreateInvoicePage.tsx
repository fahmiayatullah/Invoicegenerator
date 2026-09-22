import type React from 'react';
import { useState, useRef } from 'react';
import type { AppSettings, CatalogItem, InvoiceClient, InvoiceItem, InvoiceStatus } from '@/types';
import type { CalculationsResult } from '@/hooks/useInvoiceCalculations';
import { InvoiceForm } from '@/components/invoice/InvoiceForm';
import { InvoicePreviewA4 } from '@/components/invoice/InvoicePreviewA4';
import { InvoiceExport1080 } from '@/components/invoice/InvoiceExport1080';
import { downloadJPEG1080, downloadPDF1080, downloadPDF, printInvoice } from '@/utils/exportUtils';

interface CreateInvoicePageProps {
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
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  setExportLoading: (msg: string | null) => void;
}

export const CreateInvoicePage: React.FC<CreateInvoicePageProps> = ({
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
  showToast,
  setExportLoading,
}) => {
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState<boolean>(false);

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const export1080ContainerRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-4">
      {/* Top Bar for View Toggle on Mobile & Action Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs no-print">
        {/* Mobile Tab Toggle */}
        <div className="flex lg:hidden bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMobileView('form')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              mobileView === 'form' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            <i className="fa-solid fa-pen-to-square mr-1"></i> Form
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              mobileView === 'preview' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            <i className="fa-solid fa-eye mr-1"></i> Preview
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Print Button */}
          <button
            type="button"
            onClick={printInvoice}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Cetak Invoice Langsung"
          >
            <i className="fa-solid fa-print"></i>
            <span className="hidden sm:inline">Cetak</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative" ref={exportDropdownRef}>
            <button
              type="button"
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-indigo-200 cursor-pointer"
            >
              <i className="fa-solid fa-download"></i>
              <span>Unduh / Ekspor</span>
              <i className="fa-solid fa-chevron-down text-[10px] ml-1"></i>
            </button>

            {isExportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => {
                    setIsExportDropdownOpen(false);
                    downloadPDF(previewContainerRef.current, formInvNumber, showToast);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2.5 transition font-semibold cursor-pointer"
                >
                  <i className="fa-solid fa-file-pdf text-rose-500 text-sm"></i>
                  <div>
                    <div>Unduh PDF (Format A4)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Siap cetak dokumen fisik</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsExportDropdownOpen(false);
                    downloadPDF1080(
                      export1080ContainerRef.current,
                      formInvNumber,
                      setExportLoading,
                      showToast
                    );
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2.5 transition font-semibold cursor-pointer"
                >
                  <i className="fa-solid fa-file-arrow-down text-indigo-600 text-sm"></i>
                  <div>
                    <div>Unduh PDF HD (1080×1350)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Rasio poster portrait tajam</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsExportDropdownOpen(false);
                    downloadJPEG1080(
                      export1080ContainerRef.current,
                      formInvNumber,
                      setExportLoading,
                      showToast
                    );
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2.5 transition font-semibold cursor-pointer"
                >
                  <i className="fa-solid fa-file-image text-emerald-600 text-sm"></i>
                  <div>
                    <div>Unduh Gambar JPEG HD (1080×1350)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Cocok dikirim via WhatsApp</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Form */}
        <div className={`lg:col-span-6 xl:col-span-5 ${mobileView === 'preview' ? 'hidden lg:block' : ''}`}>
          <InvoiceForm
            settings={settings}
            catalog={catalog}
            formInvNumber={formInvNumber}
            setFormInvNumber={setFormInvNumber}
            formInvDate={formInvDate}
            setFormInvDate={setFormInvDate}
            formInvDue={formInvDue}
            setFormInvDue={setFormInvDue}
            formPaymentMethod={formPaymentMethod}
            setFormPaymentMethod={setFormPaymentMethod}
            formInvStatus={formInvStatus}
            setFormInvStatus={setFormInvStatus}
            formInvDp={formInvDp}
            setFormInvDp={setFormInvDp}
            formClient={formClient}
            setFormClient={setFormClient}
            currentItems={currentItems}
            calculations={calculations}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
            onUpdateItem={onUpdateItem}
            onSelectCatalog={onSelectCatalog}
            onSaveInvoice={onSaveInvoice}
            onStartNewInvoice={onStartNewInvoice}
            isEditing={isEditing}
          />
        </div>

        {/* Right Column: Live A4 Preview */}
        <div
          className={`lg:col-span-6 xl:col-span-7 sticky top-20 ${
            mobileView === 'form' ? 'hidden lg:block' : ''
          }`}
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <i className="fa-solid fa-eye text-indigo-600"></i> Preview Invoice (A4)
            </span>
            <span className="text-[11px] text-slate-400">Presisi Render Cetak / PDF</span>
          </div>

          <div className="preview-wrapper w-full bg-slate-300/70 p-2 sm:p-4 rounded-2xl border border-slate-300/80 overflow-x-auto shadow-inner flex justify-center">
            <InvoicePreviewA4
              ref={previewContainerRef}
              settings={settings}
              formInvNumber={formInvNumber}
              formInvDate={formInvDate}
              formInvDue={formInvDue}
              formPaymentMethod={formPaymentMethod}
              formInvStatus={formInvStatus}
              formClient={formClient}
              currentItems={currentItems}
              calculations={calculations}
            />
          </div>
        </div>
      </div>

      {/* Hidden 1080x1350 HD Export Target Element */}
      <InvoiceExport1080
        ref={export1080ContainerRef}
        settings={settings}
        formInvNumber={formInvNumber}
        formInvDate={formInvDate}
        formInvDue={formInvDue}
        formPaymentMethod={formPaymentMethod}
        formInvStatus={formInvStatus}
        formClient={formClient}
        currentItems={currentItems}
        calculations={calculations}
      />
    </div>
  );
};
