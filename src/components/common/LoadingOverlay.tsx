import type React from 'react';

interface LoadingOverlayProps {
  message: string | null;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 flex flex-col items-center max-w-xs w-full text-center shadow-2xl border border-slate-100">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
        <h4 className="font-bold text-slate-800 text-sm">{message}</h4>
        <p className="text-xs text-slate-500 mt-1">Mengonversi canvas 1080×1350 HD pixel-perfect.</p>
      </div>
    </div>
  );
};
