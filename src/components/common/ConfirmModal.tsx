import type React from 'react';
import type { ConfirmModalState } from '@/types';

interface ConfirmModalProps {
  modalState: ConfirmModalState;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ modalState, onClose }) => {
  if (!modalState.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
            {modalState.title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition p-1"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        <div
          className="text-sm text-slate-600 mb-6 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: modalState.message }}
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              if (modalState.onConfirm) modalState.onConfirm();
              onClose();
            }}
            className="px-5 py-2 text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition shadow-sm cursor-pointer"
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};
