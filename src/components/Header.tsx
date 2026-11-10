import React from 'react';
import { Menu, Bell, Database } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface HeaderProps {
  currentPage: string;
  onOpenMobileMenu: () => void;
  onNavigate: (page: string) => void;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  today: { title: 'Mi Día', subtitle: 'Espacio personal de Julia H. Carreras' },
  uclm: { title: 'Mi UCLM', subtitle: 'Plan 4 cursos, 240 ECTS y campus Toledo' },
  academy: { title: 'Academia', subtitle: 'Estudio, simulador 4 modos y flashcards' },
  laboratory: { title: 'Laboratorio Clínico', subtitle: 'Analíticas, gasometrías, tubos y ECG' },
  ecoe: { title: 'Simulación ECOE', subtitle: 'Estaciones clínicas y fallos críticos' },
  pharmacologyPro: { title: 'Farmacología PRO', subtitle: 'Fichas, compatibilidad Y y calculadoras' },
  practice360: { title: 'Prácticas 360', subtitle: 'Turnos, pasaporte 4 niveles y diario Gibbs' },
  tutorAI: { title: 'Tutor IA', subtitle: '7 profesores especializados de enfermería' },
  pharmacology: { title: 'Farmacología Clínica', subtitle: 'Fichas y 10 correctos' },
  dosage: { title: 'Cálculo de Dosificación', subtitle: 'Goteros, perfusión y fórmulas' },
  terminology: { title: 'Terminología Médica', subtitle: 'Diccionario y flashcards' },
  reminders: { title: 'Recordatorios', subtitle: 'Exámenes y prácticas clínicas' },
  selfEvaluation: { title: 'Autoevaluación', subtitle: 'Tests interactivos y casos clínicos' },
  manuals: { title: 'Manuales Clínicos', subtitle: 'Procedimientos offline' },
  practicas: { title: 'Mis Prácticas', subtitle: 'Control de horas y portfolio' },
  scales: { title: 'Escalas de Valoración', subtitle: 'Braden, Glasgow y Barthel' },
  subjects: { title: 'Plan de Estudios', subtitle: '1.º curso Grado en Enfermería' },
  tools: { title: 'PAE & SBAR', subtitle: 'Metodología y constantes vitales' },
  life: { title: 'Bienestar & Hábitos', subtitle: 'Modo foco, hábitos y notas' },
  vault: { title: 'Bóveda Personal & Seguridad', subtitle: 'Documentos, medicación, citas y copia de seguridad' },
  shortcuts: { title: 'Atajos & Enlaces Rápidos', subtitle: 'UCLM, viajes, becas y herramientas' },
  clinicalCases: { title: 'Casos Clínicos Simulados', subtitle: 'Decisiones clínicas y constantes dinámicas' },
  cpr: { title: 'Protocolos RCP / SVA', subtitle: 'Algoritmos ERC 2021-2025 y metrónomo 105 bpm' },
  anatomy: { title: 'Anatomía Interactiva', subtitle: 'Pulsos, auscultación y punción Hochstetter' },
  travel: { title: 'Viajes Toledo ↔ Granada', subtitle: 'BlaBlaCar, Alsa y checklist de maleta' },
  emergency: { title: 'Emergencias 112 & Familia', subtitle: 'Botón de auxilio y ubicación GPS' },
  cima: { title: 'Buscador Oficial CIMA AEMPS', subtitle: 'Fichas técnicas y prospectos autorizados' }
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onOpenMobileMenu,
  onNavigate
}) => {
  const isOnline = useOnlineStatus();
  const currentInfo = PAGE_TITLES[currentPage] || { title: 'Campus Enfermería', subtitle: 'Toledo' };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 flex items-center justify-between gap-4 transition-all">
      {/* Left side: Hamburger + Title Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold text-stone-900 truncate tracking-tight">
              {currentInfo.title}
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8f0e8] text-[#2d523e]">
              1.º Enfermería · Toledo
            </span>
          </div>
          <p className="text-[11px] text-stone-400 hidden sm:block truncate">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right side: Personalized Profile Avatar for Julia + Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Julia's small avatar & name (visible on all pages) */}
        <button
          onClick={() => onNavigate('today')}
          className="flex items-center gap-2 p-1 pl-1 sm:pl-1.5 pr-2.5 rounded-full bg-stone-50 hover:bg-[#e8f0e8] transition border border-stone-200/80 group shadow-2xs"
          title="Ver perfil de Julia H. Carreras"
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/aistudio/Ilustraci_n_alegre_de_estudiante_de_enfermer_a_aa60d2b2.png`}
            alt="Julia H. Carreras"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-emerald-500/70 shrink-0 shadow-xs"
          />
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold text-stone-900 group-hover:text-[#203a2b] block leading-tight">
              Julia H. Carreras
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold block leading-none">
              Estudiante UCLM
            </span>
          </div>
        </button>

        {/* Offline indicator badge */}
        {!isOnline && (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">
            Sin conexión
          </span>
        )}

        <div className="hidden md:block">
          <PWAInstallButton />
        </div>

        {/* Quick button to Backup / Restore (Vault) */}
        <button
          onClick={() => onNavigate('vault')}
          className="p-2 text-stone-500 hover:text-emerald-800 rounded-xl hover:bg-stone-100 transition relative"
          title="Copia de Seguridad (Exportar / Importar tus datos en JSON)"
        >
          <Database className="w-4 h-4 text-emerald-700" />
        </button>

        {/* Quick button to Reminders */}
        <button
          onClick={() => onNavigate('reminders')}
          className="p-2 text-stone-500 hover:text-stone-800 rounded-xl hover:bg-stone-100 transition relative"
          title="Ver recordatorios de exámenes y prácticas"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5" />
        </button>
      </div>
    </header>
  );
};
