import type React from 'react';
import type { AppSettings, ActiveTab } from '@/types';

interface HeaderProps {
  settings: AppSettings;
  activeTab: ActiveTab;
  isSupabaseOnline: boolean;
  onOpenMobileSidebar: () => void;
  onStartNewInvoice: () => void;
  pageTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  isSupabaseOnline,
  onOpenMobileSidebar,
  onStartNewInvoice,
  pageTitle,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileSidebar}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-hidden transition"
              aria-label="Buka menu navigasi"
            >
              <i className="fa-solid fa-bars text-lg"></i>
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-indigo-200">
                <i className="fa-solid fa-file-invoice"></i>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-800 leading-tight flex items-center gap-2">
                  <span>{settings.bizName || 'Invoice Generator'}</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium hidden sm:block">
                  {pageTitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase status badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isSupabaseOnline
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
              title={
                isSupabaseOnline
                  ? 'Tersinkronisasi dengan database cloud Supabase'
                  : 'Mode offline aktif (Tersimpan aman di browser LocalStorage)'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              ></span>
              <span>{isSupabaseOnline ? 'Supabase Sync' : 'Offline Cache'}</span>
            </div>

            <button
              type="button"
              onClick={onStartNewInvoice}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-sm shadow-indigo-200 cursor-pointer"
            >
              <i className="fa-solid fa-plus"></i>
              <span className="hidden sm:inline">Buat Invoice Baru</span>
              <span className="sm:hidden">Baru</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
