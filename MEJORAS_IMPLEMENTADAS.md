# Mejoras implementadas — Enfermería Julia

Fecha de actualización: 16 de noviembre de 2026.

## 1. Academia · Exámenes y herramientas de estudio

- El Simulador Test permite seleccionar primero el curso (1.º a 4.º o todos) y después una asignatura.
- El selector de asignaturas se alimenta del plan de estudios completo, no solo de las asignaturas que ya tienen preguntas en el banco. La búsqueda de preguntas respeta curso y asignatura, normalizando algunas variantes habituales de escritura (por ejemplo, Anatomía/Anatomía Humana y Fundamentos I/1).
- Se ha añadido un panel para ampliar con IA el material del Simulador Test, Banco Editable y Flashcards Leitner.
- El panel permite reutilizar apuntes ya guardados en «Mis Apuntes» o subir un archivo desde el equipo mediante el importador existente. Se puede indicar curso, asignatura, tema y número de elementos a generar.
- El material generado se puede revisar antes de guardarlo en el banco o en Leitner. En el flujo de preguntas también se puede iniciar una práctica con las preguntas recién generadas.
- Las preguntas guardadas conservan el curso asociado para que después puedan filtrarse correctamente.

La generación requiere que el servicio de IA de la aplicación esté configurado y disponible. El contenido generado debe revisarse antes de utilizarse como material de estudio.

## 2. Farmacología PRO · Compatibilidad en Y

- Se ha reconstruido el catálogo con 50 pares documentados y se han eliminado las reglas comodín que asignaban un resultado sin identificar un segundo fármaco concreto.
- Al seleccionar el primer fármaco, el segundo selector muestra únicamente los medicamentos que tienen una ficha individual en el catálogo. Si no existe ningún par documentado, el selector queda deshabilitado.
- Las fichas muestran el resultado, el diluyente cuando se ha especificado, las concentraciones ensayadas cuando están disponibles, límites de la evidencia y un enlace a la fuente original.
- Se ha revisado el par vancomicina–piperacilina/tazobactam: queda como condicional/dependiente de concentración conforme a la guía SHARP de Sanford, no como una incompatibilidad universal.
- Se han excluido pares de evidencia insuficiente o formulaciones demasiado generales. La presencia de una ficha no significa que sea aplicable a cualquier concentración, diluyente, presentación o proporción de mezcla.

### Fuentes empleadas para ampliar/revisar los pares

1. Ayari et al. (2022), estudio experimental de mezclas en Y, con evaluación visual, espectrofotométrica y de partículas: https://doi.org/10.1515/pthp-2022-0002
2. Kondo et al. (2025), evaluación de compatibilidad en Y de opioides con fármacos intravenosos: https://doi.org/10.1089/jpm.2024.0484
3. Sanford Health Care SHARP, guía de compatibilidad antibiótica en Y, actualización indicada en el documento: enero de 2025. La guía especifica condiciones de concentración para algunos pares: https://www.sanfordhealth.org/-/media/org/files/resources/antibiotic-stewardship/sharp-antibiotic-iv-compatibility.pdf
4. Revisión de compatibilidad en Y en UCI, publicada en octubre de 2026: https://doi.org/10.1136/ejhpharm-2025-004732

**Precaución clínica:** los resultados de compatibilidad en Y dependen de la concentración exacta, formulación, diluyente, proporción, tiempo de contacto y condiciones de administración. La revisión de UCI de 2026 encontró que una proporción importante de los pares evaluados no tenía evidencia elegible; la ausencia de datos no equivale a compatibilidad. Este catálogo es una ayuda educativa y no sustituye la validación por Farmacia, la ficha técnica ni una base institucional actualizada antes de administrar una combinación.

## 3. Simulador Clínico Avanzado de Enfermería

- Se ha ampliado el catálogo de 3 a 40 escenarios.
- Distribución: 10 escenarios en 1.º, 10 en 2.º, 10 en 3.º y 10 en 4.º curso.
- La vista permite elegir el curso y consultar los diez escenarios asignados a ese nivel.
- Cada escenario incorpora contexto clínico, datos del paciente, constantes, acciones recomendadas, errores críticos a evitar y puntos para el debriefing.
- Los casos mantienen un propósito docente y deben adaptarse a los protocolos y procedimientos vigentes del centro.

## 4. Verificaciones realizadas

- Análisis sintáctico de los 67 archivos TypeScript/TSX: 0 errores.
- Comprobación de tipos TypeScript sobre los tipos compartidos, los 40 casos clínicos y el catálogo de compatibilidades: correcta.
- Validación de datos: 40 casos, 10 por curso, 40 identificadores únicos; 50 pares de compatibilidad, sin pares duplicados ni reglas comodín.
- No se pudo ejecutar la compilación integral de Vite ni el `lint` completo porque el entorno no pudo resolver `registry.npmjs.org` al instalar dependencias (`EAI_AGAIN`, fallo DNS/red). No se modificó el lockfile para intentar sortear ese problema.

Cuando haya conexión al registro de paquetes, ejecutar en la raíz del proyecto:

```bash
npm ci
npm run lint
npm run build
```
