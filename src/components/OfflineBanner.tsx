import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, ShieldCheck } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-amber-600/90 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-sm sticky top-0 z-50 animate-fadeIn">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 animate-pulse" />
        <span>Modo sin conexión activo — Tus manuales clínicos, fichas farmacológicas y calculadora están totalmente operativos offline.</span>
      </div>
      <div className="hidden sm:flex items-center gap-1 bg-amber-700/80 px-2 py-0.5 rounded text-[11px]">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Datos locales guardados</span>
      </div>
    </div>
  );
};
