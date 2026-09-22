import type React from 'react';
import type { ActiveTab, AppSettings } from '@/types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  settings: AppSettings;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
  settings,
}) => {
  const navItems: { tab: ActiveTab; label: string; icon: string }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { tab: 'create', label: 'Buat Invoice', icon: 'fa-file-circle-plus' },
    { tab: 'history', label: 'Riwayat Invoice', icon: 'fa-clock-rotate-left' },
    { tab: 'catalog', label: 'Katalog Layanan', icon: 'fa-tags' },
    { tab: 'settings', label: 'Pengaturan Usaha', icon: 'fa-gear' },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-200 ease-in-out no-print ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 sm:p-5 flex flex-col h-full">
          {/* Mobile close button & title */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 md:hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                <i className="fa-solid fa-file-invoice"></i>
              </div>
              <span className="font-bold text-slate-800 text-sm">{settings.bizName}</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-3 px-3">
            Menu Utama
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => handleNavClick(item.tab)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <i
                    className={`fa-solid ${item.icon} text-base w-5 text-center ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  ></i>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer / Business summary */}
          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide">
                Akun Usaha
              </p>
              <p className="text-xs font-bold text-slate-800 truncate mt-0.5">
                {settings.bizContact || 'Pemilik Usaha'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{settings.bizPhone || '-'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
