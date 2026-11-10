import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineBanner } from './components/OfflineBanner';

import { TodayView } from './views/TodayView';
import { UCLMView } from './views/UCLMView';
import { AcademyView } from './views/AcademyView';
import { LaboratoryView } from './views/LaboratoryView';
import { ECOEView } from './views/ECOEView';
import { PharmacologyProView } from './views/PharmacologyProView';
import { Practice360View } from './views/Practice360View';
import { TutorAIView } from './views/TutorAIView';
import { PharmacologyView } from './views/PharmacologyView';
import { DosageView } from './views/DosageView';
import { TerminologyView } from './views/TerminologyView';
import { RemindersView } from './views/RemindersView';
import { SelfEvaluationView } from './views/SelfEvaluationView';
import { ManualsView } from './views/ManualsView';
import { PracticasView } from './views/PracticasView';
import { ScalesView } from './views/ScalesView';
import { SubjectsView } from './views/SubjectsView';
import { ToolsView } from './views/ToolsView';
import { LifeView } from './views/LifeView';
import { ShortcutsView } from './views/ShortcutsView';
import { ClinicalCasesView } from './views/ClinicalCasesView';
import { CPRView } from './views/CPRView';
import { AnatomyView } from './views/AnatomyView';
import { TravelView } from './views/TravelView';
import { EmergencyView } from './views/EmergencyView';
import { VaultView } from './views/VaultView';
import { CimaDrugSearchView } from './views/CimaDrugSearchView';
import { Footer } from './components/Footer';
import { useDemoMode, setDemoMode, DEMO_BLOCKED_EVENT } from './hooks/useCampusStore';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('today');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const isDemo = useDemoMode();
  const [showDemoToast, setShowDemoToast] = useState<boolean>(false);

  // En modo Demo no se puede cambiar nada: se avisa con un mensaje breve
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onBlocked = () => {
      setShowDemoToast(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setShowDemoToast(false), 3500);
    };
    window.addEventListener(DEMO_BLOCKED_EVENT, onBlocked);
    return () => {
      window.removeEventListener(DEMO_BLOCKED_EVENT, onBlocked);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const exitDemo = () => {
    setDemoMode(false);
    setCurrentPage('today');
  };

  const renderActiveView = () => {
    switch (currentPage) {
      case 'today':
        return <TodayView onNavigate={setCurrentPage} />;
      case 'shortcuts':
        return <ShortcutsView />;
      case 'uclm':
        return <UCLMView />;
      case 'academy':
        return <AcademyView />;
      case 'laboratory':
        return <LaboratoryView />;
      case 'ecoe':
        return <ECOEView />;
      case 'pharmacologyPro':
        return <PharmacologyProView />;
      case 'cima':
        return <CimaDrugSearchView />;
      case 'practice360':
        return <Practice360View />;
      case 'tutorAI':
        return <TutorAIView />;
      case 'clinicalCases':
        return <ClinicalCasesView />;
      case 'cpr':
        return <CPRView />;
      case 'anatomy':
        return <AnatomyView />;
      case 'travel':
        return <TravelView />;
      case 'emergency':
        return <EmergencyView />;
      case 'vault':
        return <VaultView />;
      case 'pharmacology':
        return <PharmacologyProView />;
      case 'dosage':
        return <DosageView />;
      case 'terminology':
        return <TerminologyView />;
      case 'reminders':
        return <RemindersView />;
      case 'selfEvaluation':
        return <AcademyView />;
      case 'manuals':
        return <ManualsView />;
      case 'practicas':
        return <Practice360View />;
      case 'scales':
        return <ScalesView />;
      case 'subjects':
        return <UCLMView />;
      case 'tools':
        return <ToolsView />;
      case 'life':
        return <LifeView />;
      default:
        return <TodayView onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7f2] flex text-[#1c2e24]">
      {/* Desktop Sidebar & Mobile Drawer */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {isDemo && (
          <div
            className="sticky top-0 z-40 bg-amber-100 border-b border-amber-300 text-amber-950 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm"
            role="status"
          >
            <span>
              <strong>👀 Modo Demo:</strong> estás viendo datos de ejemplo. Solo puedes mirar; nada de lo que hagas aquí
              se guarda y tus datos reales están a salvo.
            </span>
            <button
              type="button"
              onClick={exitDemo}
              className="px-3 py-1.5 rounded-lg bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs shrink-0"
            >
              Salir de la demo
            </button>
          </div>
        )}
        <OfflineBanner />
        <Header
          currentPage={currentPage}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigate={setCurrentPage}
        />

        <main key={isDemo ? 'demo' : 'real'} className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto pb-8">
          {renderActiveView()}
        </main>

        {/* Persistent Global Footer with logo-ivimoca.png */}
        <Footer />

        {showDemoToast && (
          <div
            className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-[70] max-w-[90vw] px-4 py-3 rounded-2xl bg-stone-900 text-white text-xs sm:text-sm font-semibold shadow-2xl text-center"
            role="alert"
          >
            Estás en la demo: es solo para mirar y no se guarda nada.
          </div>
        )}

        {/* Mobile bottom nav for rapid one-handed switching */}
        <MobileBottomNav
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />
      </div>
    </div>
  );
}
