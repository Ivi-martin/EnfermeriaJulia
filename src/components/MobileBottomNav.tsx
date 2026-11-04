import React from 'react';
import { Sun, GraduationCap, Brain, TestTube2, Stethoscope, Pill, Bot } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate
}) => {
  const quickItems = [
    { id: 'today', label: 'Mi Día', icon: Sun },
    { id: 'uclm', label: 'Mi UCLM', icon: GraduationCap },
    { id: 'academy', label: 'Academia', icon: Brain },
    { id: 'laboratory', label: 'Laboratorio', icon: TestTube2 },
    { id: 'ecoe', label: 'ECOE', icon: Stethoscope },
    { id: 'pharmacologyPro', label: 'Fármacos', icon: Pill },
    { id: 'tutorAI', label: 'Tutor IA', icon: Bot }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 lg:hidden px-2 py-1.5 flex items-center justify-around shadow-lg">
      {quickItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
              isActive ? 'text-[#365e45] font-extrabold' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
