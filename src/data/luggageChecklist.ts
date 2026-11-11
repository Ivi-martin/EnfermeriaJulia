import { LuggageCheckItem } from '../types';

export const DEFAULT_LUGGAGE_CHECKLIST: LuggageCheckItem[] = [
  // Documentos & Imprescindibles
  { id: 'lug-dni', name: 'DNI / NIE físico vigente', category: 'Salud & Documentos', tripType: 'all', checked: false },
  { id: 'lug-tarjeta-sanitaria', name: 'Tarjeta Sanitaria (SESCAM / SAS)', category: 'Salud & Documentos', tripType: 'all', checked: false },
  { id: 'lug-llaves', name: 'Llaves del piso de Toledo y de casa en Granada', category: 'Salud & Documentos', tripType: 'all', checked: false },
  { id: 'lug-abono', name: 'Tarjeta transporte / billete de Alsa o BlaBlaCar en el móvil', category: 'Salud & Documentos', tripType: 'all', checked: false },

  // Tecnología & Estudio
  { id: 'lug-cargador-movil', name: 'Cargador del móvil (y powerbank)', category: 'Estudio & Tecnología', tripType: 'all', checked: false },
  { id: 'lug-portatil', name: 'Portátil + cargador (para trabajos o clases)', category: 'Estudio & Tecnología', tripType: 'all', checked: false },
  { id: 'lug-apuntes', name: 'Apuntes o libros del examen más próximo', category: 'Estudio & Tecnología', tripType: 'weekend', checked: false },
  { id: 'lug-auriculares', name: 'Auriculares para el viaje en bus/tren', category: 'Estudio & Tecnología', tripType: 'all', checked: false },

  // Ropa & Aseo
  { id: 'lug-ropa-limpia', name: 'Ropa limpia para los días del viaje', category: 'Ropa & Aseo', tripType: 'all', checked: false },
  { id: 'lug-ropa-sucia', name: 'Bolsa con ropa sucia para lavar en casa', category: 'Ropa & Aseo', tripType: 'weekend', checked: false },
  { id: 'lug-neceser', name: 'Neceser básico (cepillo, pasta, crema, peine)', category: 'Ropa & Aseo', tripType: 'all', checked: false },
  { id: 'lug-uniforme', name: 'Uniforme de prácticas limpio para la vuelta', category: 'Ropa & Aseo', tripType: 'all', checked: false },

  // Casa, Comida & Tuppers
  { id: 'lug-tuppers-vacios', name: 'Tuppers vacíos limpios para que mamá e Ivi los rellenen', category: 'Casa & Tuppers', tripType: 'weekend', checked: false },
  { id: 'lug-bolsa-termica', name: 'Bolsa térmica para transportar comida a Toledo', category: 'Casa & Tuppers', tripType: 'weekend', checked: false },
  { id: 'lug-cerrar-luces', name: 'Apagar calefacción, cerrar luces y grifo general del piso', category: 'Casa & Tuppers', tripType: 'vacation', checked: false },
  { id: 'lug-basura', name: 'Bajar la basura del piso antes de salir a la estación', category: 'Casa & Tuppers', tripType: 'all', checked: false },

  // Salud Personal
  { id: 'lug-meds', name: 'Medicación personal para los días fuera', category: 'Salud & Documentos', tripType: 'all', checked: false },
  { id: 'lug-fonendo', name: 'Fonendoscopio Littmann (¡no dejar en el bus!)', category: 'Estudio & Tecnología', tripType: 'vacation', checked: false }
];
