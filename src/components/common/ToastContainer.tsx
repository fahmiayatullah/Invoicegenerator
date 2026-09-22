import type React from 'react';
import type { ToastItem } from '@/types';

interface ToastContainerProps {
  toasts: ToastItem[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 sm:top-5 sm:right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-xs sm:max-w-sm w-full">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 text-white';
        let icon = 'fa-circle-info';
        if (toast.type === 'success') {
          bg = 'bg-emerald-600 text-white';
          icon = 'fa-circle-check';
        }
        if (toast.type === 'error') {
          bg = 'bg-rose-600 text-white';
          icon = 'fa-triangle-exclamation';
        }
        if (toast.type === 'warning') {
          bg = 'bg-amber-600 text-white';
          icon = 'fa-circle-exclamation';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold transform transition duration-300 ${bg}`}
          >
            <i className={`fa-solid ${icon} text-base`}></i>
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
