import { IvCompatibilityEntry } from '../../types';

const ysiteEntry = (
  drugA: string,
  drugB: string,
  compatibility: IvCompatibilityEntry['compatibility'],
  details: string,
  diluent: string,
  source: string,
  testedConcentrations?: string,
  sourceUrl?: string,
  evidenceLimitations?: string,
): IvCompatibilityEntry => ({
  drugA, drugB, compatibility, details, diluent, source,
  testedConcentrations, sourceUrl, evidenceLimitations,
});

export const IV_COMPATIBILITY_ENTRIES: IvCompatibilityEntry[] = [
  // Registros previamente mantenidos, con las afirmaciones sin pareja primaria retiradas o corregidas.
  ysiteEntry(
    'Furosemida', 'Morfina', 'Incompatible',
    'En el estudio de simulación Y-site se observó turbidez/efecto Tyndall inmediatamente después de mezclar. La diferencia de pH (furosemida alcalina y morfina ácida) es un mecanismo plausible.',
    'Furosemida en SF 0,9 %; morfina HCl sin diluir (según protocolo experimental)',
    'Kondo et al., Journal of Palliative Medicine (2025)',
    'Furosemida 10 mg/mL + morfina HCl 10 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'Ensayo físico in vitro y concentraciones concretas; no extrapolar a otras diluciones, formulaciones o marcas.'
  ),
  ysiteEntry(
    'Furosemida', 'Metoclopramida', 'Incompatible',
    'La referencia de compatibilidad consultada informa incompatibilidad física. Separar las líneas o administrar de forma secuencial con lavado según protocolo local.',
    'No especificado en el registro secundario consultado',
    'Micromedex IV Compatibility',
    undefined,
    undefined,
    'El registro de origen no conserva aquí las concentraciones, marcas ni proporciones exactas; verificar en la base institucional antes de una decisión clínica.'
  ),
  ysiteEntry(
    'Morfina', 'Midazolam', 'Compatible en Y',
    'La combinación figura como compatible en referencias de compatibilidad parenteral para las condiciones recogidas por esas fuentes.',
    'SF 0,9 % o SG 5 % (según referencia/formulación)',
    'Trissel / Stabilis (registro de compatibilidad parenteral)',
    undefined,
    'https://www.stabilis.org/',
    'La concentración, sal, excipientes y diluyente cambian el resultado. Consultar la monografía específica para la presentación realmente utilizada.'
  ),
  ysiteEntry(
    'Ceftriaxona', 'Soluciones con calcio (gluconato cálcico / Ringer lactato)', 'Incompatible',
    'No administrar simultáneamente por la misma línea ni reconstituir/diluir con soluciones que contienen calcio cuando la ficha técnica lo contraindica. Se pueden formar precipitados ceftriaxona-calcio; seguir las restricciones de edad, secuenciación y lavado de la ficha técnica vigente.',
    'Evitar Ringer lactato y soluciones con calcio; utilizar diluyente permitido por ficha técnica',
    'Ficha técnica AEMPS / advertencias regulatorias FDA',
    undefined,
    'https://cima.aemps.es/cima/publico/home.html',
    'No es una compatibilidad universal de todas las secuencias o edades; respetar estrictamente la ficha técnica del producto y las restricciones en neonatos.'
  ),

  // Nuevos datos primarios: Ayari et al. (2022), 75 mezclas, examen visual e instrumental.
  ysiteEntry(
    'Furosemida', 'Paracetamol IV', 'Compatible en Y',
    'La mezcla fue clasificada como físicamente compatible en el estudio de laboratorio; no se observaron los cambios que definían incompatibilidad en las condiciones ensayadas.',
    'Furosemida sin diluir; paracetamol solución para perfusión sin diluir',
    'Ayari et al., Pharmaceutical Technology in Hospital Pharmacy (2022)',
    'Furosemida 10 mg/mL + paracetamol 10 mg/mL; se evaluaron proporciones 1:1 y 9:1',
    'https://doi.org/10.1515/pthp-2022-0002',
    'Compatibilidad física, no estabilidad química prolongada; presentación y proporción ensayadas concretas.'
  ),
  ysiteEntry(
    'Furosemida', 'Sulfato de magnesio', 'Incompatible',
    'Se observó turbidez en mezcla 1:1 y resultado no conforme en el análisis físico; la pareja se clasificó como incompatible para las concentraciones estudiadas.',
    'Furosemida sin diluir; sulfato de magnesio en Isofundin',
    'Ayari et al. (2022)',
    'Furosemida 10 mg/mL + sulfato de magnesio 6 mg/mL',
    'https://doi.org/10.1515/pthp-2022-0002',
    'No extrapolar a otras concentraciones, diluyentes ni secuencias de administración.'
  ),
  ysiteEntry(
    'Furosemida', 'Nefopam', 'Incompatible',
    'Se observó mezcla blanquecina/opalescencia y cambios instrumentales de absorbancia; la pareja se clasificó como incompatible.',
    'Furosemida sin diluir; nefopam en SF 0,9 %',
    'Ayari et al. (2022)',
    'Furosemida 10 mg/mL + nefopam 1,7 mg/mL',
    'https://doi.org/10.1515/pthp-2022-0002',
    'Resultado físico in vitro a concentraciones y relaciones concretas.'
  ),
  ysiteEntry(
    'Furosemida', 'Espiramicina', 'Incompatible',
    'La mezcla presentó coloración blanquecina y turbidez/opalescencia; clasificada como incompatible en el estudio.',
    'Furosemida sin diluir; espiramicina adipato en SF 0,9 %',
    'Ayari et al. (2022)',
    'Furosemida 10 mg/mL + espiramicina adipato 60 mUI/mL',
    'https://doi.org/10.1515/pthp-2022-0002',
    'La presentación y el diluyente ensayados son específicos del estudio.'
  ),
  ysiteEntry(
    'Heparina sódica', 'Paracetamol IV', 'Compatible en Y',
    'Fue la única mezcla con heparina que resultó físicamente compatible entre las cuatro parejas evaluadas con este fármaco en el estudio.',
    'Heparina en SF 0,9 %; paracetamol solución para perfusión',
    'Ayari et al. (2022)',
    'Heparina sódica 208,3 UI/mL + paracetamol 10 mg/mL',
    'https://doi.org/10.1515/pthp-2022-0002',
    'Compatibilidad física a las concentraciones ensayadas; no implica compatibilidad de otras concentraciones de heparina.'
  ),
  ysiteEntry(
    'Heparina sódica', 'Levetiracetam', 'Incompatible',
    'El recuento de partículas subvisibles fue no conforme en los tiempos iniciales; el estudio no consideró segura la mezcla aunque después cambiara el resultado.',
    'Ambos preparados en SF 0,9 %',
    'Ayari et al. (2022)',
    'Heparina sódica 208,3 UI/mL + levetiracetam 15 mg/mL',
    'https://doi.org/10.1515/pthp-2022-0002',
    'La clasificación se basa en partículas subvisibles y no necesariamente en precipitado visible.'
  ),
  ysiteEntry(
    'Heparina sódica', 'Midazolam', 'Incompatible',
    'El recuento de partículas subvisibles fue no conforme al inicio; la mezcla se clasificó como incompatible para el uso inmediato tras preparación.',
    'Ambos preparados en SF 0,9 %',
    'Ayari et al. (2022)',
    'Heparina sódica 208,3 UI/mL + midazolam HCl 1 mg/mL',
    'https://doi.org/10.1515/pthp-2022-0002',
    'Incompatibilidad subvisible: la ausencia de turbidez a simple vista no demuestra compatibilidad.'
  ),
  ysiteEntry(
    'Heparina sódica', 'Nefopam', 'Incompatible',
    'El recuento de partículas subvisibles no cumplió los criterios en la relación 1:9 en el análisis inicial; se clasificó como incompatible.',
    'Ambos preparados en SF 0,9 %',
    'Ayari et al. (2022)',
    'Heparina sódica 208,3 UI/mL + nefopam 1,7 mg/mL',
    'https://doi.org/10.1515/pthp-2022-0002',
    'La incompatibilidad se detectó con evaluación instrumental de partículas.'
  ),
  ysiteEntry(
    'Insulina humana', 'Paracetamol IV', 'Compatible en Y',
    'La mezcla fue clasificada como físicamente compatible en las condiciones ensayadas.',
    'Insulina en SF 0,9 %; paracetamol solución para perfusión',
    'Ayari et al. (2022)',
    'Insulina humana 1 UI/mL + paracetamol 10 mg/mL',
    'https://doi.org/10.1515/pthp-2022-0002',
    'No extrapolar a insulinas de otras concentraciones o formulaciones; mantener protocolo de perfusión y monitorización glucémica.'
  ),
  ysiteEntry(
    'Insulina humana', 'Pantoprazol', 'Incompatible',
    'La mezcla mostró turbidez/haze en la relación 1:9 y se clasificó como físicamente incompatible para las concentraciones ensayadas.',
    'Insulina en SF 0,9 %; pantoprazol sin diluir',
    'Ayari et al. (2022)',
    'Insulina humana 1 UI/mL + pantoprazol sódico 1 mg/mL',
    'https://doi.org/10.1515/pthp-2022-0002',
    'La incompatibilidad varió con la concentración de insulina en otras mezclas del mismo estudio.'
  ),

  // Nuevos datos primarios: Kondo et al. (2025), simulación Y-site con opioides.
  ysiteEntry(
    'Oxicodona', 'Furosemida', 'Incompatible',
    'Se observó precipitación/turbidez inmediata en la mezcla con furosemida; también se comunicó incompatibilidad en los tiempos de observación posteriores.',
    'Preparados según recomendación de fabricante; furosemida en SF 0,9 %',
    'Kondo et al. (2025)',
    'Oxicodona HCl 10 mg/mL + furosemida 10 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'Ensayo físico in vitro; no sustituye consulta de la ficha de la marca y concentración empleadas.'
  ),
  ysiteEntry(
    'Morfina', 'Omeprazol', 'Incompatible',
    'Se observó incompatibilidad física; la mezcla continuó siendo incompatible tras reducir morfina a 1 mg/mL y omeprazol a 0,2 mg/mL.',
    'Preparados en SF 0,9 %; mezclados 1:1',
    'Kondo et al. (2025)',
    'Morfina HCl 10 mg/mL + omeprazol 1 mg/mL; retest: morfina 1 mg/mL + omeprazol 0,2 mg/mL',
    'https://doi.org/10.1089/jpm.2024.0484',
    'La incompatibilidad persistió tras dilución en el ensayo; revisar formulación comercial y protocolo local.'
  ),
  ysiteEntry(
    'Morfina', 'Lansoprazol', 'Incompatible',
    'La mezcla se clasificó como incompatible y permaneció incompatible en la repetición con concentraciones reducidas.',
    'Preparados en SF 0,9 %; mezclados 1:1',
    'Kondo et al. (2025)',
    'Morfina HCl 10 mg/mL + lansoprazol 1,5 mg/mL; retest: morfina 1 mg/mL + lansoprazol 0,3 mg/mL',
    'https://doi.org/10.1089/jpm.2024.0484',
    'Ensayo físico in vitro; los autores indican incompatibilidad también tras dilución en las concentraciones probadas.'
  ),
  ysiteEntry(
    'Morfina', 'Aciclovir', 'Incompatible',
    'Se detectó incompatibilidad en la mezcla simulada, principalmente por cambios de turbidez/precipitación durante el seguimiento.',
    'Aciclovir disuelto en agua para inyección y diluido con SF 0,9 %; morfina sin diluir',
    'Kondo et al. (2025)',
    'Morfina HCl 10 mg/mL + aciclovir 2,5 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'Resultado físico a concentraciones concretas; el estudio no evaluó estabilidad química prolongada.'
  ),
  ysiteEntry(
    'Morfina', 'Ganciclovir', 'Incompatible',
    'La mezcla presentó precipitación/turbidez durante el ensayo de compatibilidad Y-site.',
    'Ganciclovir reconstituido con agua para inyección y diluido en SF 0,9 %',
    'Kondo et al. (2025)',
    'Morfina HCl 10 mg/mL + ganciclovir 10 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'Ensayo físico in vitro; confirmar ficha local antes de extrapolar a otra preparación.'
  ),
  ysiteEntry(
    'Morfina', 'Aminofilina', 'Incompatible',
    'La combinación fue clasificada como incompatible por los cambios de turbidez/precipitación observados durante el periodo de ensayo.',
    'Aminofilina preparada en SF 0,9 %',
    'Kondo et al. (2025)',
    'Morfina HCl 10 mg/mL + aminofilina 25 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'Las formulaciones alcalinas pueden alterar el pH de la mezcla; ensayo físico limitado a las concentraciones estudiadas.'
  ),
  ysiteEntry(
    'Morfina', 'Ampicilina / sulbactam', 'Incompatible',
    'La combinación fue clasificada como incompatible en el estudio; se observó precipitación en el seguimiento tras la mezcla.',
    'Ampicilina/sulbactam reconstituida/diluida según protocolo experimental con SF 0,9 %',
    'Kondo et al. (2025)',
    'Morfina HCl 10 mg/mL + ampicilina/sulbactam 40 mg/20 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'El resultado depende de formulación, concentración y composición de excipientes.'
  ),
  ysiteEntry(
    'Morfina', 'Fosfenitoína', 'Incompatible',
    'La mezcla se clasificó como incompatible por precipitación/turbidez durante el periodo observado.',
    'Fosfenitoína preparada en SF 0,9 %',
    'Kondo et al. (2025)',
    'Morfina HCl 10 mg/mL + fosfenitoína 25 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'Ensayo in vitro; comprobar ficha técnica y concentración concreta.'
  ),
  ysiteEntry(
    'Morfina', 'Meropenem', 'Incompatible',
    'La combinación se clasificó como incompatible por cambio de color con el tiempo, aunque no se observara precipitado claro.',
    'Meropenem reconstituido y diluido en SF 0,9 %',
    'Kondo et al. (2025)',
    'Morfina HCl 10 mg/mL + meropenem 40 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'La señal fue cambio de color a lo largo del tiempo; el ensayo no permite inferir estabilidad química a largo plazo.'
  ),
  ysiteEntry(
    'Morfina', 'Micafungina', 'Incompatible',
    'La mezcla apareció turbia/blanquecina inmediatamente, aunque la turbidez disminuyó posteriormente; se clasificó como incompatible por el cambio inicial.',
    'Micafungina preparada en SF 0,9 %',
    'Kondo et al. (2025)',
    'Morfina HCl 10 mg/mL + micafungina 1,5 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'La incompatibilidad fue transitoria visualmente; la clasificación conservadora se basa en la mezcla inmediata.'
  ),
  ysiteEntry(
    'Morfina', 'Canrenoato potásico', 'Incompatible',
    'Se observó precipitación inmediata con los opioides ensayados; no utilizar una conexión Y común bajo las concentraciones estudiadas.',
    'Canrenoato potásico preparado en SF 0,9 %',
    'Kondo et al. (2025)',
    'Morfina HCl 10 mg/mL + canrenoato potásico 10 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'Nombre farmacológico del artículo: potassium canrenoate; verificar equivalencia con el producto disponible localmente.'
  ),
  ysiteEntry(
    'Oxicodona', 'Aminofilina', 'Incompatible',
    'La combinación fue clasificada como incompatible durante el ensayo por cambios de turbidez/precipitación.',
    'Aminofilina preparada en SF 0,9 %',
    'Kondo et al. (2025)',
    'Oxicodona HCl 10 mg/mL + aminofilina 25 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'Resultado físico in vitro a concentración elevada de aminofilina.'
  ),
  ysiteEntry(
    'Oxicodona', 'Ganciclovir', 'Incompatible',
    'La mezcla presentó precipitación/turbidez y fue clasificada como incompatible.',
    'Ganciclovir reconstituido y diluido en SF 0,9 %',
    'Kondo et al. (2025)',
    'Oxicodona HCl 10 mg/mL + ganciclovir 10 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'Ensayo físico in vitro; no extrapolar a otras concentraciones o marcas.'
  ),
  ysiteEntry(
    'Oxicodona', 'Letermovir', 'Incompatible',
    'La combinación fue clasificada como incompatible por turbidez/precipitación a lo largo del seguimiento.',
    'Letermovir preparado en SF 0,9 %',
    'Kondo et al. (2025)',
    'Oxicodona HCl 10 mg/mL + letermovir 2 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'Ensayo limitado a la formulación y concentración de estudio.'
  ),
  ysiteEntry(
    'Oxicodona', 'Metilprednisolona', 'Incompatible',
    'La mezcla fue clasificada como incompatible por aparición de precipitación/turbidez durante el seguimiento.',
    'Metilprednisolona preparada en SF 0,9 %',
    'Kondo et al. (2025)',
    'Oxicodona HCl 10 mg/mL + metilprednisolona 10 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'Ensayo físico in vitro; verificar sal y excipientes de cada producto.'
  ),
  ysiteEntry(
    'Oxicodona', 'Posaconazol', 'Incompatible',
    'Se observó mezcla blanquecina/turbidez inmediata y precipitación durante el ensayo.',
    'Posaconazol preparado en SF 0,9 %',
    'Kondo et al. (2025)',
    'Oxicodona HCl 10 mg/mL + posaconazol 2 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'Ensayo físico in vitro; confirmar forma farmacéutica y diluyente.'
  ),
  ysiteEntry(
    'Oxicodona', 'Canrenoato potásico', 'Incompatible',
    'Se observó precipitación inmediata con opioides; la mezcla fue clasificada como incompatible.',
    'Canrenoato potásico preparado en SF 0,9 %',
    'Kondo et al. (2025)',
    'Oxicodona HCl 10 mg/mL + canrenoato potásico 10 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'Verificar nomenclatura y presentación comercial; evidencia de compatibilidad física solamente.'
  ),
  ysiteEntry(
    'Oxicodona', 'Teicoplanina', 'Incompatible',
    'Se observó incremento de turbidez superior al umbral establecido y precipitación en el seguimiento.',
    'Teicoplanina preparada en SF 0,9 %',
    'Kondo et al. (2025)',
    'Oxicodona HCl 10 mg/mL + teicoplanina 8 mg/mL; mezcla 1:1',
    'https://doi.org/10.1089/jpm.2024.0484',
    'La compatibilidad con otras concentraciones no queda establecida por este estudio.'
  ),
  ysiteEntry(
    'Hidromorfona', 'Omeprazol', 'Incompatible',
    'La combinación se clasificó como incompatible en la evaluación física Y-site.',
    'Preparados en SF 0,9 %; mezcla 1:1',
    'Kondo et al. (2025)',
    'Hidromorfona HCl 1 mg/mL + omeprazol 1 mg/mL',
    'https://doi.org/10.1089/jpm.2024.0484',
    'La evidencia es para concentraciones de estudio, no para todas las diluciones clínicas.'
  ),
  ysiteEntry(
    'Hidromorfona', 'Lansoprazol', 'Incompatible',
    'La combinación fue clasificada como incompatible en la evaluación física Y-site.',
    'Preparados en SF 0,9 %; mezcla 1:1',
    'Kondo et al. (2025)',
    'Hidromorfona HCl 1 mg/mL + lansoprazol 1,5 mg/mL',
    'https://doi.org/10.1089/jpm.2024.0484',
    'La evidencia es para concentraciones de estudio, no para todas las diluciones clínicas.'
  ),
  ysiteEntry(
    'Hidromorfona', 'Posaconazol', 'Incompatible',
    'La combinación presentó incompatibilidad física en la evaluación Y-site.',
    'Posaconazol preparado en SF 0,9 %',
    'Kondo et al. (2025)',
    'Hidromorfona HCl 1 mg/mL + posaconazol 2 mg/mL',
    'https://doi.org/10.1089/jpm.2024.0484',
    'Ensayo físico in vitro; verificar producto y concentración realmente empleados.'
  ),
  ysiteEntry(
    'Hidromorfona', 'Canrenoato potásico', 'Incompatible',
    'Se observó precipitación inmediata al combinar canrenoato potásico con los opioides ensayados.',
    'Canrenoato potásico preparado en SF 0,9 %',
    'Kondo et al. (2025)',
    'Hidromorfona HCl 1 mg/mL + canrenoato potásico 10 mg/mL',
    'https://doi.org/10.1089/jpm.2024.0484',
    'Verificar equivalencia de la denominación del principio activo con el medicamento local.'
  ),

  // Antibióticos: tabla SHARP de Sanford Health Care, actualizada en enero de 2025.
  ysiteEntry('Cefepima', 'Metronidazol', 'Compatible en Y', 'La tabla SHARP indica compatibilidad en Y bajo las concentraciones estándar del centro.', 'Según concentraciones estándar SHC; consultar tabla local', 'Sanford Health Care SHARP (actualización 01/2025)', 'Concentraciones estándar SHC; no detalladas en esta ficha resumida', 'https://assets.ctfassets.net/pxcfulgsd9e2/3Nl57w2WnLGVbv0seaoixG/46d06b08ce0cbd5361021ae2e57957a7/SHC_Antibiotic_Compatibility_in_Initial_Management_of_Severe_Infections_and_Sepsis.pdf', 'No trasladar la conclusión a concentraciones o diluyentes distintos de los estándares de la tabla.'),
  ysiteEntry('Cefepima', 'Vancomicina', 'Compatible en Y', 'La tabla SHARP indica compatibilidad en Y bajo las concentraciones estándar del centro.', 'Según concentraciones estándar SHC; consultar tabla local', 'Sanford Health Care SHARP (01/2025)', 'Concentraciones estándar SHC; no detalladas en esta ficha resumida', 'https://assets.ctfassets.net/pxcfulgsd9e2/3Nl57w2WnLGVbv0seaoixG/46d06b08ce0cbd5361021ae2e57957a7/SHC_Antibiotic_Compatibility_in_Initial_Management_of_Severe_Infections_and_Sepsis.pdf', 'No trasladar la conclusión a concentraciones o diluyentes distintos de los estándares de la tabla.'),
  ysiteEntry('Ceftriaxona', 'Doxiciclina', 'Compatible en Y', 'La tabla SHARP indica compatibilidad en Y en sus condiciones estándar.', 'Según concentraciones estándar SHC', 'Sanford Health Care SHARP (01/2025)', 'Concentraciones estándar SHC; no detalladas en esta ficha resumida', 'https://assets.ctfassets.net/pxcfulgsd9e2/3Nl57w2WnLGVbv0seaoixG/46d06b08ce0cbd5361021ae2e57957a7/SHC_Antibiotic_Compatibility_in_Initial_Management_of_Severe_Infections_and_Sepsis.pdf', 'Ceftriaxona en SF compatible; no usar Ringer lactato. Revisar advertencia sobre calcio.'),
  ysiteEntry('Ceftriaxona', 'Gentamicina', 'Compatible en Y', 'La tabla SHARP indica compatibilidad en Y en sus condiciones estándar.', 'Según concentraciones estándar SHC', 'Sanford Health Care SHARP (01/2025)', 'Concentraciones estándar SHC; no detalladas en esta ficha resumida', 'https://assets.ctfassets.net/pxcfulgsd9e2/3Nl57w2WnLGVbv0seaoixG/46d06b08ce0cbd5361021ae2e57957a7/SHC_Antibiotic_Compatibility_in_Initial_Management_of_Severe_Infections_and_Sepsis.pdf', 'Revisar las condiciones de administración y la ficha técnica de ambas presentaciones.'),
  ysiteEntry('Ceftriaxona', 'Metronidazol', 'Compatible en Y', 'La tabla SHARP indica compatibilidad en Y en sus condiciones estándar.', 'Según concentraciones estándar SHC', 'Sanford Health Care SHARP (01/2025)', 'Concentraciones estándar SHC; no detalladas en esta ficha resumida', 'https://assets.ctfassets.net/pxcfulgsd9e2/3Nl57w2WnLGVbv0seaoixG/46d06b08ce0cbd5361021ae2e57957a7/SHC_Antibiotic_Compatibility_in_Initial_Management_of_Severe_Infections_and_Sepsis.pdf', 'Revisar las condiciones de administración y la ficha técnica de ambas presentaciones.'),
  ysiteEntry('Ceftriaxona', 'Tobramicina', 'Incompatible', 'La tabla SHARP identifica incompatibilidad en Y en sus condiciones estándar.', 'Según concentraciones estándar SHC', 'Sanford Health Care SHARP (01/2025)', 'Concentraciones estándar SHC; no detalladas en esta ficha resumida', 'https://assets.ctfassets.net/pxcfulgsd9e2/3Nl57w2WnLGVbv0seaoixG/46d06b08ce0cbd5361021ae2e57957a7/SHC_Antibiotic_Compatibility_in_Initial_Management_of_Severe_Infections_and_Sepsis.pdf', 'La ficha resumida no publica aquí las concentraciones; confirmar en referencia institucional.'),
  ysiteEntry('Ceftriaxona', 'Vancomicina', 'Incompatible', 'La tabla SHARP identifica incompatibilidad en Y en sus condiciones estándar.', 'Según concentraciones estándar SHC', 'Sanford Health Care SHARP (01/2025)', 'Concentraciones estándar SHC; no detalladas en esta ficha resumida', 'https://assets.ctfassets.net/pxcfulgsd9e2/3Nl57w2WnLGVbv0seaoixG/46d06b08ce0cbd5361021ae2e57957a7/SHC_Antibiotic_Compatibility_in_Initial_Management_of_Severe_Infections_and_Sepsis.pdf', 'La ficha resumida no publica aquí las concentraciones; confirmar en referencia institucional.'),
  ysiteEntry('Levofloxacino', 'Clindamicina', 'Compatible en Y', 'La tabla SHARP indica compatibilidad en Y bajo sus concentraciones estándar.', 'Según concentraciones estándar SHC', 'Sanford Health Care SHARP (01/2025)', 'Concentraciones estándar SHC; no detalladas en esta ficha resumida', 'https://assets.ctfassets.net/pxcfulgsd9e2/3Nl57w2WnLGVbv0seaoixG/46d06b08ce0cbd5361021ae2e57957a7/SHC_Antibiotic_Compatibility_in_Initial_Management_of_Severe_Infections_and_Sepsis.pdf', 'Verificar concentración, diluyente y velocidad del preparado en el centro.'),
  ysiteEntry('Levofloxacino', 'Metronidazol', 'Compatible en Y', 'La tabla SHARP indica compatibilidad en Y bajo sus concentraciones estándar.', 'Según concentraciones estándar SHC', 'Sanford Health Care SHARP (01/2025)', 'Concentraciones estándar SHC; no detalladas en esta ficha resumida', 'https://assets.ctfassets.net/pxcfulgsd9e2/3Nl57w2WnLGVbv0seaoixG/46d06b08ce0cbd5361021ae2e57957a7/SHC_Antibiotic_Compatibility_in_Initial_Management_of_Severe_Infections_and_Sepsis.pdf', 'Verificar concentración, diluyente y velocidad del preparado en el centro.'),
  ysiteEntry('Levofloxacino', 'Vancomicina', 'Compatible en Y', 'La tabla SHARP indica compatibilidad en Y bajo sus concentraciones estándar.', 'Según concentraciones estándar SHC', 'Sanford Health Care SHARP (01/2025)', 'Concentraciones estándar SHC; no detalladas en esta ficha resumida', 'https://assets.ctfassets.net/pxcfulgsd9e2/3Nl57w2WnLGVbv0seaoixG/46d06b08ce0cbd5361021ae2e57957a7/SHC_Antibiotic_Compatibility_in_Initial_Management_of_Severe_Infections_and_Sepsis.pdf', 'Verificar concentración, diluyente y velocidad del preparado en el centro.'),
  ysiteEntry('Meropenem', 'Vancomicina', 'Compatible en Y', 'La tabla SHARP indica compatibilidad en Y bajo sus concentraciones estándar.', 'Según concentraciones estándar SHC', 'Sanford Health Care SHARP (01/2025)', 'Concentraciones estándar SHC; no detalladas en esta ficha resumida', 'https://assets.ctfassets.net/pxcfulgsd9e2/3Nl57w2WnLGVbv0seaoixG/46d06b08ce0cbd5361021ae2e57957a7/SHC_Antibiotic_Compatibility_in_Initial_Management_of_Severe_Infections_and_Sepsis.pdf', 'Verificar concentración, diluyente y estabilidad temporal antes de usar conexión compartida.'),
  ysiteEntry('Piperacilina / tazobactam', 'Clindamicina', 'Compatible en Y', 'La tabla SHARP indica compatibilidad en Y en sus concentraciones estándar.', 'Según concentraciones estándar SHC; piperacilina/tazobactam compatible con SF y la mayoría de presentaciones no con Ringer lactato', 'Sanford Health Care SHARP (01/2025)', 'Concentraciones estándar SHC; no detalladas en esta ficha resumida', 'https://assets.ctfassets.net/pxcfulgsd9e2/3Nl57w2WnLGVbv0seaoixG/46d06b08ce0cbd5361021ae2e57957a7/SHC_Antibiotic_Compatibility_in_Initial_Management_of_Severe_Infections_and_Sepsis.pdf', 'No extrapolar a otros diluyentes o concentraciones.'),
  ysiteEntry('Piperacilina / tazobactam', 'Doxiciclina', 'Incompatible', 'La tabla SHARP indica que no debe administrarse en Y en sus condiciones estándar.', 'Según concentraciones estándar SHC', 'Sanford Health Care SHARP (01/2025)', 'Concentraciones estándar SHC; no detalladas en esta ficha resumida', 'https://assets.ctfassets.net/pxcfulgsd9e2/3Nl57w2WnLGVbv0seaoixG/46d06b08ce0cbd5361021ae2e57957a7/SHC_Antibiotic_Compatibility_in_Initial_Management_of_Severe_Infections_and_Sepsis.pdf', 'La clasificación no sustituye comprobación de la concentración específica.'),
  ysiteEntry('Piperacilina / tazobactam', 'Vancomicina', 'Compatibilidad Condicional', 'Corrección importante del registro anterior: SHARP considera compatible la administración en Y con las concentraciones estándar del centro, pero advierte expresamente que depende de la concentración.', 'Según concentraciones estándar SHC', 'Sanford Health Care SHARP (01/2025)', 'Concentraciones estándar SHC; compatibilidad concentración-dependiente', 'https://assets.ctfassets.net/pxcfulgsd9e2/3Nl57w2WnLGVbv0seaoixG/46d06b08ce0cbd5361021ae2e57957a7/SHC_Antibiotic_Compatibility_in_Initial_Management_of_Severe_Infections_and_Sepsis.pdf', 'No es un sí universal: confirmar que ambas concentraciones coinciden con el estándar local y revisar diluyente.'),
];

export const LASA_ALERTS = [
  {
    pair: 'CEFAZOLINA vs CEFOTAXIMA',
    risk: 'Ambas son cefalosporinas pero con espectros y posologías radicalmente distintas (Cefazolina es de 1ª generación para profilaxis quirúrgica; Cefotaxima es de 3ª generación para infecciones del SNC/sepsis).',
    recommendation: 'Usar técnica de "Tall Man Letters" (cefaZOLIna vs cefoTAXima) y confirmar indicación médica antes de cargar.'
  },
  {
    pair: 'DOBUTAMINA vs DOPAMINA',
    risk: 'Dobutamina es inótropo predominantemente beta-1; Dopamina tiene acciones dopaminérgicas, beta y alfa dependientes de dosis. Una confusión en shock cardiogénico o séptico puede provocar vasoconstricción letal o fallo de bomba.',
    recommendation: 'Almacenar en cajetines separados del carro de paradas y etiquetar con fondo de color contrastado.'
  },
  {
    pair: 'HIDROXICINA vs HIDRALAZINA',
    risk: 'Hidroxicina es un antihistamínico sedante (Atarax); Hidralazina es un potente vasodilatador arterial antihipertensivo. Confundirlos puede desencadenar crisis hipertensiva o hipotensión refractaria.',
    recommendation: 'Doble chequeo verbal en el pase de guardia y revisión de prescripción electrónica.'
  },
  {
    pair: 'TRAMADOL vs TORASEMIDA',
    risk: 'Tramadol es un analgésico opioide; Torasemida es un diurético de asa de alta potencia. Administrar torasemida por tramadol deja al paciente con dolor agudo e hipotensión por deshidratación masiva.',
    recommendation: 'Comprobar siempre principio activo y grupo terapéutico, no solo la primera letra del nombre comercial.'
  },
  {
    pair: 'INSULINA RÁPIDA vs INSULINA LENTA / BASAL',
    risk: 'Administrar insulina rápida a dosis de basal desencadena hipoglucemia severa potencialmente mortal o coma;',
    recommendation: 'Verificar tipo de pluma (colores universales: Lantus gris/violeta, Novorapid naranja, etc.) y lectura del nombre completo.'
  }
];

export const HIGH_RISK_MEDS_ISMP = [
  {
    group: 'Cloruro Potásico IV (KCl)',
    danger: 'La inyección rápida o en bolo directo produce paro cardíaco inmediato en asistolia.',
    mandatoryPrecautions: 'Prohibido almacenar ampollas concentradas de KCl en plantas sin diluir. Usar bolsas premezcladas preparadas por Farmacia, infusión siempre por bomba volumétrica a ritmo controlado.'
  },
  {
    group: 'Insulinas (todas las vías)',
    danger: 'Errores en la unidad de medida (confusión entre mililitros y Unidades Internacionales UI).',
    mandatoryPrecautions: 'Usar exclusivamente jeringas específicas graduadas en UI de insulina. Doble chequeo independiente por dos enfermeras antes de inyectar.'
  },
  {
    group: 'Opioides Parenterales (Morfina, Fentanilo)',
    danger: 'Depresión respiratoria grave, apnea y parada cardiorrespiratoria.',
    mandatoryPrecautions: 'Tener siempre disponible Naloxona en el control de enfermería. Monitorizar frecuencia respiratoria y escala de sedación de Ramsay.'
  },
  {
    group: 'Anticoagulantes (Heparina no fraccionada IV)',
    danger: 'Riesgo catastrófico de sangrado intracraneal o hemorragia retroperitoneal por sobredosis.',
    mandatoryPrecautions: 'Comprobar valor de TTPa antes de cambiar ritmo de bomba. Diluciones estandarizadas (ej. 25.000 UI en 250 mL SF = 100 UI/mL).'
  },
  {
    group: 'Bloqueantes Neuromusculares (Succinilcolina, Rocuronio)',
    danger: 'Parálisis muscular respiratoria completa en pacientes no intubados ni ventilados mecánicamente.',
    mandatoryPrecautions: 'Custodia bajo llave en quirófano o UCI. Etiquetas rojas fluorescentes con la advertencia: "Agente Paralizante - Causa Apnea".'
  }
];

export const ANTIDOTES_TABLE = [
  {
    toxicOrDrug: 'Opioides (Morfina, Fentanilo, Metadona, Heroína)',
    antidote: 'Naloxona (Naloxone)',
    posology: '0.4 mg IV (o IM/SC), titular cada 2-3 minutos hasta recuperar respiración espontánea (frecuencia respiratoria > 10 rpm). Recordar que la semivida de la naloxona (30-90 min) es menor que la de la mayoría de opioides (riesgo de renarcotización).',
    mechanism: 'Antagonista puro de receptores opioides mu, kappa y delta.'
  },
  {
    toxicOrDrug: 'Benzodiacepinas (Diazepam, Lorazepam, Midazolam)',
    antidote: 'Flumazenilo (Anexate)',
    posology: '0.2 mg IV en 15 segundos; si no hay respuesta en 60 s, administrar 0.1 mg repetibles hasta máximo 1-2 mg.',
    mechanism: 'Antagonista competitivo del receptor GABA-A. ¡Precaución en epilépticos conocidos o intoxicaciones mixtas con antidepresivos tricíclicos por riesgo de desencadenar convulsiones refractarias!'
  },
  {
    toxicOrDrug: 'Heparina Sódica (No Fraccionada)',
    antidote: 'Sulfato de Protamina',
    posology: '1 mg de protamina neutraliza aproximadamente 100 UI de heparina administrada en las últimas 2 horas. Administrar muy lento IV en 10 min (evitar hipotensión y bradicardia).',
    mechanism: 'Forma un complejo salino inactivo con la heparina mediante unión iónica.'
  },
  {
    toxicOrDrug: 'Anticoagulantes Orales antivitamina K (Acenocumarol / Sintrom, Warfarina)',
    antidote: 'Vitamina K1 (Fitomenadiona) + Complejo Protrombínico',
    posology: 'Fitomenadiona 5-10 mg IV lenta (o VO si INR elevado sin sangrado activo). En hemorragia con riesgo vital: asociar Concentrado de Complejo Protrombínico (Octaplex/Beriplex) a 25-50 UI/kg.',
    mechanism: 'Restablece la síntesis hepática de los factores de coagulación dependientes de vitamina K (II, VII, IX, X).'
  },
  {
    toxicOrDrug: 'Paracetamol (Sobredosis tóxica > 150 mg/kg)',
    antidote: 'N-Acetilcisteína (NAC)',
    posology: 'Protocolo IV de 3 infusiones: 150 mg/kg en 1h, luego 50 mg/kg en 4h, y finalmente 100 mg/kg en 16h.',
    mechanism: 'Restaura los depósitos hepáticos de glutatión neutralizando el metabolito tóxico NAPQI y evitando la necrosis hepática masiva fulminante.'
  },
  {
    toxicOrDrug: 'Dabigatrán (Pradaxa - Anticoagulante directo)',
    antidote: 'Idarucizumab (Praxbind)',
    posology: '5 g IV administrados en 2 viales consecutivos de 2.5 g cada uno.',
    mechanism: 'Fragmento de anticuerpo monoclonal humanizado que se une al dabigatrán con afinidad 350 veces superior a la de la trombina.'
  },
  {
    toxicOrDrug: 'Bloqueantes neuromusculares no despolarizantes (Rocuronio, Vecuronio)',
    antidote: 'Sugammadex (Bridion)',
    posology: '2 a 4 mg/kg IV según profundidad del bloqueo neuromuscular medido por monitor TOF.',
    mechanism: 'Ciclodextrina modificada que encapsula la molécula del relajante muscular en plasma revirtiendo la parálisis en 1-3 minutos.'
  }
];
