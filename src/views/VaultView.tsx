import React, { useState } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { DocumentVaultItem, PersonalMedication, PersonalAppointment } from '../types';
import {
  ShieldCheck,
  CreditCard,
  Pill,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Lock,
  Copy,
  Check,
  FileText
} from 'lucide-react';

export const VaultView: React.FC = () => {
  const {
    state,
    addDocumentVaultItem,
    deleteDocumentVaultItem,
    addPersonalMed,
    togglePersonalMedTaken,
    deletePersonalMed,
    addPersonalAppointment,
    togglePersonalAppointmentCompleted,
    deletePersonalAppointment
  } = useCampusStore();

  const [activeTab, setActiveTab] = useState<'documents' | 'medication' | 'appointments'>('documents');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Document modal form
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docFormData, setDocFormData] = useState({
    type: 'dni' as DocumentVaultItem['type'],
    title: '',
    identifierNumber: '',
    holderName: 'Julia H. Carreras',
    expiryDate: '',
    issuingAuthority: '',
    notes: '',
  });

  // Medication modal form
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [medFormData, setMedFormData] = useState({
    name: '',
    dose: '',
    schedule: 'Desayuno',
    notes: '',
  });

  // Appointment modal form
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [appFormData, setAppFormData] = useState({
    title: '',
    doctorOrCenter: '',
    date: new Date().toISOString().slice(0, 10),
    time: '10:00',
    location: '',
    specialty: 'Medicina General',
    notes: '',
  });

  const todayStr = new Date().toISOString().slice(0, 10);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFormData.title.trim() || !docFormData.identifierNumber.trim()) return;
    addDocumentVaultItem(docFormData);
    setIsDocModalOpen(false);
    setDocFormData({
      type: 'dni',
      title: '',
      identifierNumber: '',
      holderName: 'Julia H. Carreras',
      expiryDate: '',
      issuingAuthority: '',
      notes: '',
    });
  };

  const handleSaveMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medFormData.name.trim()) return;
    addPersonalMed({
      ...medFormData,
      active: true,
    });
    setIsMedModalOpen(false);
    setMedFormData({
      name: '',
      dose: '',
      schedule: 'Desayuno',
      notes: '',
    });
  };

  const handleSaveApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appFormData.title.trim()) return;
    addPersonalAppointment(appFormData);
    setIsAppModalOpen(false);
    setAppFormData({
      title: '',
      doctorOrCenter: '',
      date: new Date().toISOString().slice(0, 10),
      time: '10:00',
      location: '',
      specialty: 'Medicina General',
      notes: '',
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#1b3427] via-[#28503b] to-[#12241b] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
              <Lock className="w-4 h-4 text-emerald-300" />
              <span>BÓVEDA PRIVADA & SALUD PERSONAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bóveda de Documentos, Medicación y Citas Propias
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Guarda tus números de DNI, Tarjeta Sanitaria (SESCAM/SAS), carnet de estudiante UCLM y contrato del piso. Gestiona tus medicamentos de uso personal y citas médicas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeTab === 'documents') setIsDocModalOpen(true);
                else if (activeTab === 'medication') setIsMedModalOpen(true);
                else setIsAppModalOpen(true);
              }}
              className="px-4 py-3 rounded-2xl bg-white text-[#1b3427] hover:bg-emerald-50 text-xs font-extrabold transition flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>
                {activeTab === 'documents' ? 'Añadir Documento' : activeTab === 'medication' ? 'Añadir Medicación' : 'Añadir Cita'}
              </span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'documents' ? 'bg-white text-[#1b3427] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Documentos ({state.documentVault?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('medication')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'medication' ? 'bg-white text-[#1b3427] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Medicación Personal ({state.personalMeds?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'appointments' ? 'bg-white text-[#1b3427] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Citas Médicas ({state.personalAppointments?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. DOCUMENT VAULT TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.documentVault && state.documentVault.map((doc) => {
            const isExpired = doc.expiryDate && doc.expiryDate < todayStr;
            return (
              <div
                key={doc.id}
                className="bg-gradient-to-br from-[#1a3324] via-[#224430] to-[#14261b] p-6 rounded-3xl text-white shadow-md border border-emerald-500/20 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none" />

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-200">
                      {doc.type === 'dni' ? 'Documento Identidad' : doc.type === 'tarjeta_sanitaria' ? 'Tarjeta Sanitaria' : 'Carnet / Trámite'}
                    </span>
                    <button
                      onClick={() => deleteDocumentVaultItem(doc.id)}
                      className="p-1 text-white/40 hover:text-rose-300 transition"
                      title="Eliminar documento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-white leading-tight">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-emerald-200 mt-0.5 font-semibold">
                      Titular: {doc.holderName}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/20 border border-white/10 flex items-center justify-between">
                    <span className="font-mono text-base font-black tracking-wider text-emerald-100">
                      {doc.identifierNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(doc.id, doc.identifierNumber)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-xs flex items-center gap-1"
                      title="Copiar número"
                    >
                      {copiedId === doc.id ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70">
                  <span>
                    {doc.expiryDate ? (
                      <span className={isExpired ? 'text-rose-300 font-bold' : ''}>
                        {isExpired ? '⚠️ Caducado: ' : 'Caduca: '} {doc.expiryDate}
                      </span>
                    ) : (
                      'Sin caducidad'
                    )}
                  </span>
                  {doc.notes && <span className="truncate max-w-[120px]">{doc.notes}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. PERSONAL MEDICATION TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'medication' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-stone-900">Tomas Diarias de Julia</h3>
                <p className="text-xs text-stone-500">Marca los medicamentos personales tomados hoy.</p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl">
                Hoy: {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {state.personalMeds && state.personalMeds.map((med) => {
                const takenToday = med.lastTakenDate === todayStr;
                return (
                  <div
                    key={med.id}
                    className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      takenToday
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-white border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePersonalMedTaken(med.id)}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition ${
                          takenToday
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'border-2 border-stone-300 hover:border-emerald-600'
                        }`}
                      >
                        {takenToday && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div>
                        <strong className={`text-sm font-extrabold block ${takenToday ? 'text-emerald-950 line-through' : 'text-stone-900'}`}>
                          {med.name}
                        </strong>
                        <span className="text-xs text-stone-500 block">
                          {med.dose} · {med.schedule}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deletePersonalMed(med.id)}
                      className="text-stone-300 hover:text-rose-600 p-1"
                      title="Eliminar medicación"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. PERSONAL APPOINTMENTS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-base font-extrabold text-stone-900 border-b border-stone-100 pb-3">
              Próximas Citas Médicas y Revisiones
            </h3>

            <div className="space-y-3">
              {state.personalAppointments && state.personalAppointments.map((app) => (
                <div
                  key={app.id}
                  className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                    app.completed ? 'bg-stone-50 border-stone-200 opacity-60' : 'bg-white border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => togglePersonalAppointmentCompleted(app.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                        app.completed ? 'bg-emerald-600 text-white border-emerald-600' : 'border-stone-300 hover:border-emerald-500'
                      }`}
                    >
                      {app.completed && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <strong className={`text-sm font-bold block ${app.completed ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                        {app.title}
                      </strong>
                      <div className="text-xs text-stone-500 flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 font-semibold text-emerald-800">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{app.date} a las {app.time}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>{app.location || app.doctorOrCenter}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deletePersonalAppointment(app.id)}
                    className="text-stone-300 hover:text-rose-600 p-1"
                    title="Eliminar cita"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Añadir Documento */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Añadir Documento a la Bóveda</h3>
              <button onClick={() => setIsDocModalOpen(false)} className="text-stone-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleSaveDoc} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Tipo de Documento</label>
                <select
                  value={docFormData.type}
                  onChange={(e) => setDocFormData({ ...docFormData, type: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-stone-200"
                >
                  <option value="dni">DNI / NIE</option>
                  <option value="tarjeta_sanitaria">Tarjeta Sanitaria (SESCAM / SAS)</option>
                  <option value="carnet_uclm">Carnet de Estudiante UCLM</option>
                  <option value="contrato_piso">Contrato de Alquiler del Piso</option>
                  <option value="otro">Otro Documento</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Título</label>
                <input
                  type="text"
                  required
                  placeholder="ej. DNI Español, Tarjeta Sanitaria SESCAM..."
                  value={docFormData.title}
                  onChange={(e) => setDocFormData({ ...docFormData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Número / Código Identificador</label>
                <input
                  type="text"
                  required
                  placeholder="Número de DNI, CIP, CIPA..."
                  value={docFormData.identifierNumber}
                  onChange={(e) => setDocFormData({ ...docFormData, identifierNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Fecha de Caducidad (Opcional)</label>
                <input
                  type="date"
                  value={docFormData.expiryDate}
                  onChange={(e) => setDocFormData({ ...docFormData, expiryDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button type="button" onClick={() => setIsDocModalOpen(false)} className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold">Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#365e45] text-white font-extrabold shadow-xs">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Añadir Medicación */}
      {isMedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Añadir Medicación Personal</h3>
              <button onClick={() => setIsMedModalOpen(false)} className="text-stone-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleSaveMed} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Nombre del Medicamento</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Complejo B, Antihistamínico..."
                  value={medFormData.name}
                  onChange={(e) => setMedFormData({ ...medFormData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Dosis</label>
                <input
                  type="text"
                  placeholder="ej. 1 comprimido, 5 mg..."
                  value={medFormData.dose}
                  onChange={(e) => setMedFormData({ ...medFormData, dose: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Horario / Momento</label>
                <select
                  value={medFormData.schedule}
                  onChange={(e) => setMedFormData({ ...medFormData, schedule: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200"
                >
                  <option value="Desayuno">En el Desayuno</option>
                  <option value="Comida">En la Comida</option>
                  <option value="Cena">En la Cena</option>
                  <option value="Antes de Dormir">Antes de Dormir</option>
                  <option value="Cada 8 horas">Cada 8 horas</option>
                  <option value="Si precisa">Si precisa (dolor/síntomas)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button type="button" onClick={() => setIsMedModalOpen(false)} className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold">Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#365e45] text-white font-extrabold shadow-xs">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Añadir Cita */}
      {isAppModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Añadir Cita Médica</h3>
              <button onClick={() => setIsAppModalOpen(false)} className="text-stone-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleSaveApp} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Motivo / Especialidad</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Revisión Dentista, Médico de cabecera..."
                  value={appFormData.title}
                  onChange={(e) => setAppFormData({ ...appFormData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={appFormData.date}
                    onChange={(e) => setAppFormData({ ...appFormData, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Hora</label>
                  <input
                    type="time"
                    required
                    value={appFormData.time}
                    onChange={(e) => setAppFormData({ ...appFormData, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Centro / Dirección</label>
                <input
                  type="text"
                  placeholder="ej. Centro de Salud Palomarejos Toledo..."
                  value={appFormData.location}
                  onChange={(e) => setAppFormData({ ...appFormData, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button type="button" onClick={() => setIsAppModalOpen(false)} className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold">Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#365e45] text-white font-extrabold shadow-xs">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
