import React from 'react';
import {
  Sun,
  Pill,
  Calculator,
  BookA,
  Bell,
  Sparkles,
  BookOpen,
  Stethoscope,
  Activity,
  GraduationCap,
  FileText,
  Heart,
  X,
  TestTube2,
  Bot,
  Brain
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const navSections = [
    {
      title: 'INICIO',
      items: [
        { id: 'today', label: 'Mi Día', icon: Sun }
      ]
    },
    {
      title: 'LOS 7 MÓDULOS · CAMPUS 2.0',
      items: [
        { id: 'uclm', label: '1. Mi UCLM (Plan Oficial)', icon: GraduationCap },
        { id: 'academy', label: '2. Academia & Exámenes', icon: Brain },
        { id: 'laboratory', label: '3. Laboratorio & ECG', icon: TestTube2 },
        { id: 'ecoe', label: '4. Simulación ECOE', icon: Stethoscope },
        { id: 'pharmacologyPro', label: '5. Farmacología PRO', icon: Pill },
        { id: 'practice360', label: '6. Prácticas 360 & Gibbs', icon: Activity },
        { id: 'tutorAI', label: '7. Tutor IA (7 Docentes)', icon: Bot }
      ]
    },
    {
      title: 'HERRAMIENTAS AUXILIARES',
      items: [
        { id: 'manuals', label: 'Manuales Clínicos (Offline)', icon: BookOpen },
        { id: 'scales', label: 'Escalas (Braden, Glasgow)', icon: FileText },
        { id: 'terminology', label: 'Terminología Médica', icon: BookA },
        { id: 'reminders', label: 'Recordatorios & Exámenes', icon: Bell },
        { id: 'life', label: 'Bienestar, Hábitos & Foco', icon: Heart }
      ]
    }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-2xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-stone-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#365e45] text-white flex items-center justify-center font-black shadow-xs shrink-0">
              <span className="text-xl leading-none">✚</span>
            </div>
            <div>
              <strong className="text-sm font-extrabold text-stone-900 tracking-tight block">
                Campus Enfermería
              </strong>
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-[#e8f0e8] px-1.5 py-0.5 rounded">
                TOLEDO · UCLM
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 lg:hidden rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Julia H. Carreras Profile Chip in Sidebar */}
        <div className="p-3 mx-3 mt-3 rounded-2xl bg-[#f6f9f6] border border-emerald-200/80 flex items-center gap-3 shadow-2xs">
          <img
            src={`${import.meta.env.BASE_URL}assets/aistudio/Ilustraci_n_alegre_de_estudiante_de_enfermer_a_aa60d2b2.png`}
            alt="Julia H. Carreras"
            className="w-11 h-11 rounded-xl object-cover border-2 border-emerald-500 shadow-xs shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
              ESTUDIANTE
            </span>
            <strong className="text-xs font-bold text-stone-900 truncate block leading-tight">
              Julia H. Carreras
            </strong>
            <span className="text-[11px] text-stone-500 block truncate">
              1.º Grado en Enfermería
            </span>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-stone-400 mb-1.5">
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full px-3 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-3 text-left ${
                      isActive
                        ? 'bg-[#365e45] text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-stone-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer with PWA Install Prompt & IviMOCA */}
        <div className="p-4 border-t border-stone-100 bg-[#fafbfa] space-y-3">
          <PWAInstallButton />
          <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-400">
            <span>UCLM Fábrica de Armas</span>
            <img
              src={`${import.meta.env.BASE_URL}assets/aistudio/logo-ivimoca_6074b254.png`}
              alt="IviMOCA"
              className="h-4 w-auto object-contain opacity-70 hover:opacity-100 transition"
            />
          </div>
        </div>
      </aside>
    </>
  );
};
