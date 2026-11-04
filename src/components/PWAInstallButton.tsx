import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, render a discreet offline badge
  if (isInstalled) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e8f0e8] text-[#2d523e]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#437456]" />
        <span>Instalada en tu dispositivo</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#365e45] hover:bg-[#284734] rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
        title="Instalar en tu móvil u ordenador para usar sin conexión"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#365e45] bg-[#eaf1eb] hover:bg-[#dfeade] border border-[#cfdfd3] rounded-xl transition"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Instalar en iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-[#e8f0e8] text-[#365e45] rounded-xl font-bold">📲</span>
                  <h3 className="text-base font-bold text-stone-900">Instalar en tu iPhone o iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-xs text-stone-600 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#e8f0e8] text-[#2d523e] flex items-center justify-center font-bold shrink-0">1</span>
                  <span>Toca el botón <strong>Compartir</strong> <span className="inline-block px-1.5 py-0.5 bg-stone-100 rounded text-[10px] font-mono">⎋</span> en la barra inferior de Safari.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#e8f0e8] text-[#2d523e] flex items-center justify-center font-bold shrink-0">2</span>
                  <span>Baja y selecciona <strong>«Añadir a la pantalla de inicio»</strong> <span className="inline-block px-1.5 py-0.5 bg-stone-100 rounded text-[10px] font-mono">➕</span>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#e8f0e8] text-[#2d523e] flex items-center justify-center font-bold shrink-0">3</span>
                  <span>Pulsa <strong>«Añadir»</strong> arriba a la derecha. ¡Ya tendrás acceso directo con funcionamiento offline incluso sin cobertura!</span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-[#365e45] text-white font-bold text-xs hover:bg-[#2a4a36] transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback info button for desktop or other browsers
  return (
    <button
      onClick={() => alert("Puedes instalar esta aplicación agregándola como acceso directo en tu navegador (menú ⋮ > Instalar aplicación o Añadir a marcadores).")}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#486350] bg-[#eef3ee] hover:bg-[#e2ebe2] rounded-xl transition"
      title="Disponible para instalar"
    >
      <Download className="w-3.5 h-3.5" />
      <span>App offline</span>
    </button>
  );
};
