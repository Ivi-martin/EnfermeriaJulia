# Informe de implementación — Campus Enfermería Toledo

Fecha de preparación: 11 de noviembre de 2026.

## Cambios incluidos

### Navegación y experiencia
- Reorganización del menú en cinco áreas: Mi Día, Aprender, Entrenar, Mis Prácticas y Mi Vida en Toledo.
- Navegación inferior para móvil con accesos a las pantallas principales.
- Se conservan los identificadores internos de las vistas existentes para reducir el riesgo de romper enlaces y navegación.

### Siete módulos incorporados
1. **Mi Semana Inteligente**: vistas de hoy, semana y mes; lectura conjunta de eventos, tareas, exámenes, turnos y plazos existentes; bloques de estudio, descanso y tiempo personal persistidos en el store central.
2. **Buscador de Evidencia Científica**: formulario PICO, constructor de búsqueda, enlaces a bases bibliográficas, biblioteca UCLM, registro de referencias, ficha de lectura crítica y exportación RIS para Zotero.
3. **Mi Pasaporte de Prácticas**: rotaciones, objetivos, competencias, registro de aprendizaje y reflexión; reutiliza las reflexiones existentes y permite exportar una vista imprimible.
4. **Entrenador ECOE**: selección de estaciones existentes, sesión de autoevaluación, puntuación orientativa e historial personal. No es una evaluación oficial.
5. **Centro de Recursos Clínicos Verificados**: registro de fuente, organismo, enlace, versión, licencia, fechas de revisión, estado y responsable. Las fuentes precargadas quedan **pendientes de revisión humana**.
6. **Toledo en mi Bolsillo**: enlaces a transporte y servicios, destinos configurables y listas de comprobación sin geolocalización persistente.
7. **Gestor del TFG**: proyectos, pregunta y objetivos, palabras clave, criterios, hitos, tutorías y asociación de bibliografía guardada.

### Mejoras sobre módulos existentes
- La agenda inteligente reutiliza los registros actuales, en lugar de duplicar los calendarios.
- Las prácticas nuevas se conectan con competencias y reflexiones existentes.
- El plan de Enfermería de Toledo se ha sustituido por la estructura publicada por la UCLM: 240 ECTS (60 básicos, 84 obligatorios, 6 optativos, 10 TFG y 80 de prácticas).
- Los códigos antiguos de ejemplo `ENF-...` se migran a códigos UCLM solo cuando hay una correspondencia individual clara y coincide la carga ECTS. Las asignaturas antiguas sin equivalencia 1:1 quedan en un archivo histórico visible, con notas y progreso conservados, sin computar en el plan actual.
- Los prerrequisitos de Estancias Clínicas 1 y 2 se muestran como aviso informativo: la UCLM indica haber cursado previamente Fundamentos de Enfermería, pero el apartado consultado no precisa el código exacto de la asignatura llave. No se realiza una comprobación automática de matrícula.
- Se han retirado los nombres completos de perfil hardcodeados y se usa solo el nombre de pila en los textos de interfaz.
- La bóveda personal advierte que el almacenamiento actual en `localStorage` no está cifrado y deshabilita la creación de nuevos registros sensibles. Los registros previos no se borran automáticamente; las copias JSON siguen siendo texto sin cifrar.

## Migración y persistencia

- La versión del esquema local pasa a `DATA_VERSION = 4`.
- Se incorporan arrays tipados para los nuevos módulos y un diccionario de listas de Toledo.
- La limpieza de datos demostrativos compara el registro completo, no solo su identificador. Así, un elemento de ejemplo modificado por la persona usuaria se conserva.
- Los registros de ejemplo intactos de bóveda, medicación, citas y plazos se eliminan durante la migración; los datos personales modificados no se eliminan automáticamente.
- El ZIP contiene el código y la migración, no el `localStorage` del navegador ni los datos locales que existan en el dispositivo. Antes de desplegar, exporta una copia de seguridad desde la instalación actual y consérvala de forma protegida. La copia JSON no está cifrada.

## Fuentes y límites

- Plan del Grado en Enfermería (Toledo), UCLM: https://www.uclm.es/es/toledo/fafeto/estudios/gradoenfermeria
- Plan y guías docentes de Enfermería, UCLM: https://investigacion.uclm.es/es/home/toledo/facsalud/enfermeria/plan
- GuíaSalud: https://portal.guiasalud.es/gpc/
- PubMed: https://pubmed.ncbi.nlm.nih.gov/
- Guías ERC 2025: https://www.erc.edu/science-research/guidelines/guidelines-2025
- Biblioteca UCLM: https://biblioteca.uclm.es/es/encuentra-informacion/Recursos/Basesdedatos
- Mi Salud Digital (SESCAM): https://sescam.jccm.es/misaluddigital/#/app/inicio

La tabla detallada del plan y la distribución total de créditos consultadas muestran 10 ECTS de TFG. En el mismo portal aparece un texto introductorio que aún menciona 6 ECTS, por lo que esa discrepancia editorial debe confirmarse con la Facultad antes de tomar decisiones académicas. Las búsquedas académicas externas se abren en los portales correspondientes; no se ha implementado acceso automatizado a contenidos de pago, cuentas UCLM ni API privadas. El acceso a CINAHL y otros recursos puede depender de la licencia universitaria.

Mi Salud Digital se ofrece como enlace informativo: la cita de Atención Primaria requiere tarjeta sanitaria individual del SESCAM en vigor y CIP; una persona desplazada temporalmente desde otra comunidad puede no disponer de ese módulo. No hay sincronización en tiempo real con horarios, transporte urbano, Google Calendar ni sistemas universitarios. Los enlaces externos sirven para consultar la información vigente en el servicio de origen.

Las fuentes clínicas precargadas están pendientes de revisión: el registro no certifica por sí mismo vigencia, adecuación local ni licencia de reutilización. Cada guía o documento concreto debe revisarse por una persona competente antes de usarlo como material docente.

No se ha añadido contenido nuevo de dosis, tratamiento, preparación/administración de medicamentos ni instrucciones de procedimientos clínicos. Los módulos clínicos preexistentes se han dejado sin ampliar y requieren supervisión docente y contraste con protocolos del centro.

## Privacidad y protección de datos

- No introducir datos identificativos de pacientes en el pasaporte, diarios, formularios PICO, tutoría IA ni simulaciones.
- No guardar DNI, tarjeta sanitaria, historias clínicas, citas sanitarias identificables ni datos de medicación en esta versión.
- `localStorage` no equivale a almacenamiento seguro o cifrado. La bóveda no debe utilizarse para documentos o datos de salud reales.
- No introducir claves API en el frontend. Las credenciales de servicios externos deben mantenerse en el servidor y en variables de entorno.
- Antes de un uso multiusuario o de almacenar información sensible, hace falta diseñar autenticación, autorización, cifrado en tránsito y reposo, gestión de sesiones, copias protegidas, eliminación y controles RGPD/LOPDGDD.

## Verificación técnica

- `npm run lint` (TypeScript `tsc --noEmit`): **correcto** tras los cambios.
- `npm run build`: **no verificable en este entorno**. El ZIP original incluye dependencias nativas instaladas para Windows; el contenedor Linux no dispone del binding Linux de Rolldown/esbuild y el ejecutable Vite no tiene permiso de ejecución. No se considera un fallo del código fuente, pero tampoco se afirma que la compilación haya pasado.
- No se ha realizado una prueba visual automatizada en navegador ni una prueba real en dispositivo móvil.

## Preparar el proyecto localmente

En un entorno compatible (Node.js 22 recomendado para esta versión de Vite):

```bash
npm ci
npm run lint
npm run build
npm run dev
```

Configura las variables de entorno a partir de `.env.example`; no copies secretos al código cliente. Después de validar localmente, despliega en Vercel conforme a `vercel.json`.

## Revisión complementaria y endurecimiento (11 de noviembre de 2026)

Tras revisar las nuevas pantallas se completaron estos puntos:

- **PICO**: permite separar sinónimos con OR, combinar conceptos con AND, añadir términos MeSH, frase exacta y exclusiones NOT; la estrategia final es editable y se puede regenerar desde los campos PICO.
- **Lectura crítica**: las fichas guardadas se pueden consultar desde cada referencia.
- **Pasaporte de prácticas**: ahora permite crear, editar y eliminar entradas del diario y reflexiones de Gibbs; exige confirmar que los textos no contienen datos identificables. Las rotaciones admiten horas registradas manualmente y las competencias incluyen autoevaluación, próximo objetivo y comentarios del tutor. La validación académica oficial no puede asignarla la estudiante.
- **Entrenador ECOE**: utiliza los objetivos de aprendizaje disponibles en las estaciones existentes para una autoevaluación educativa; conserva el historial y la puntuación orientativa. No se presenta como rúbrica oficial ni certificación, ni ofrece instrucciones clínicas operativas.
- **Centro de fuentes**: las fuentes semilla quedan sin fecha ficticia de comprobación; para marcar un registro como verificado se exigen documento, versión, licencia/acceso y persona responsable. Se puede eliminar un registro.
- **Toledo en mi bolsillo**: incluye un calculador manual de hora de salida. El resultado se guarda como bloque personal en Mi Semana; no consulta tráfico, horarios en tiempo real ni envía notificaciones push. Los destinos y listas son personales y configurables.
- **Mi Semana Inteligente**: muestra también hitos y reuniones del TFG registrados en la aplicación; el cálculo de planificación no crea horarios universitarios oficiales ni consulta disponibilidad externa.
- **Impresión**: se añadió una hoja de estilos para imprimir el portafolio sin la navegación global.
- **Tutor IA**: los siete perfiles se identifican como personajes virtuales ficticios, sin atribuirles puestos de docencia o representación de la UCLM. Se limitaron las respuestas a apoyo conceptual y se añadieron avisos y confirmaciones antes de enviar textos a servicios externos.
- **Privacidad de IA**: `server/privacy.ts` bloquea patrones evidentes de DNI/NIE, teléfono, correo, CIP/NHC y fechas de nacimiento antes de enviar textos a Gemini. Es una comprobación heurística, no un mecanismo de anonimización: no detecta todos los nombres o contextos identificables. La estudiante debe eliminar siempre cualquier dato de pacientes.
- **API para Vercel**: se añadieron funciones serverless para `generate-study`, `citations`, `summarize` y `transcribe`, además de la función Tutor IA que ya existía. Los servicios que procesan apuntes limitan su alcance a contenido académico y evitan generar dosis o instrucciones operativas de procedimientos.

### Detalles adicionales de la implementación

- Las competencias de prácticas permiten registrar autoevaluación, objetivo siguiente y comentarios. La categoría «Evaluada» no se asigna como validación oficial desde el perfil de estudiante. Las horas de rotación son datos introducidos manualmente, no horas certificadas.
- En el buscador PICO, los sinónimos se agrupan con OR, los conceptos se combinan con AND, y se admiten frase exacta, términos MeSH y exclusiones NOT. Las consultas se abren en los portales de destino; no se simula acceso a bases con licencia.
- Las pantallas se han comprobado mediante TypeScript (`tsc --noEmit`), pero no mediante navegador automatizado ni dispositivo móvil.

### Límites pendientes antes de un uso público

- Las rutas de IA no tienen todavía autenticación de usuario ni limitación de frecuencia/coste. Antes de dejar la aplicación abierta públicamente, configura protección en Vercel o un mecanismo servidor de autenticación y rate limiting para evitar uso por terceros y consumo inesperado de la clave de Gemini.
- La ruta de simulación de casos clínicos se mantiene solo en el servidor Express local preexistente; no se ha añadido como función serverless pública de Vercel en esta entrega.
- Los avisos de privacidad y el filtro de patrones no garantizan la detección de toda información identificable. No se debe introducir nunca información real de pacientes, aunque el filtro no la bloquee.
- No se han validado visualmente las pantallas en navegador ni en un móvil real. La prueba de compilación Vite está pendiente de instalar dependencias nativas para Linux (el ZIP de origen aportaba `node_modules` de Windows).


## Actualización de nombres de los tutores IA

Se actualizaron los siete perfiles visibles, sus mensajes de bienvenida y las instrucciones del servidor para utilizar los nombres y especialidades indicados por el propietario del proyecto. Se conservaron los identificadores internos (`anatomia`, `fisiologia`, `farmacologia`, `laboratorio`, `ecoe`, `fundamentos`, `academico`) para no romper conversaciones ni llamadas a la API. Las tres copias de la guía HTML también muestran los mismos nombres y aclaran que son personajes virtuales ficticios, no docentes reales de la UCLM.

## Actualización: Tu Amore y Consejo de Tutores (12 de noviembre de 2026)

- **Nuevo perfil Tu Amore**: acompañamiento virtual de bienestar emocional, regulación básica del estrés y organización académica amable. No se presenta como psicóloga ni sustituye a profesionales o personas adultas de confianza.
- **Check-in diario integrado**: ánimo y energía de 1 a 5, etiquetas seleccionables y nota opcional. Reutiliza el registro de bienestar existente y se adjunta al contexto de tutoría.
- **Contexto compartido**: las consultas a los tutores reciben próximos exámenes con días restantes, turnos, bloques de estudio, tareas, notas registradas, check-in y recuerdos/resúmenes del Consejo. Los tutores reciben también las notas de coordinación entre perfiles.
- **Modo Esencial / Respiro**: un interruptor global reduce la extensión de las respuestas y prioriza lo imprescindible sin sobrecargar.
- **Memoria persistente local**: se guardan hasta 120 mensajes recientes por tutor, recuerdos permanentes elegidos por Julia, resúmenes diarios por perfil y memos del Consejo. Cada consulta utiliza los últimos 24 mensajes de ese tutor y añade hasta 20 recuerdos permanentes, 8 resúmenes y 12 memos recientes compartidos. Los resúmenes se actualizan automáticamente tras cada respuesta correcta del tutor.
- **El Consejo**: muestra un mensaje diario adaptado a la hora local, al check-in y al próximo examen, una síntesis estructurada de sesiones y una bitácora de coordinación inter-tutor. Los resúmenes automáticos condensan los últimos mensajes y el check-in; no son una evaluación clínica ni una transcripción completa.
- **Bienestar y accesibilidad**: ejercicio guiado de respiración suave de aproximadamente un minuto y lectura por voz de las respuestas mediante las funciones del navegador.
- **Privacidad**: antes de cada envío de chat o receta se solicita confirmar que se entiende qué contexto se transmite al proveedor externo de IA. No deben introducirse datos de pacientes ni información identificable.

### Límites de persistencia y seguridad

La persistencia añadida utiliza el `localStorage` del navegador: se conserva tras cerrar y volver a abrir la aplicación en el mismo navegador, pero no sincroniza dispositivos ni crea una memoria alojada en el servidor. Ese almacenamiento local no está cifrado y puede perderse al limpiar los datos del navegador; debe exportarse una copia de seguridad si se necesita conservarlo. El contexto seleccionado (incluidos ánimo, energía, notas, exámenes, turnos, calificaciones y recuerdos) se envía al proveedor de IA con cada consulta autorizada. Para sincronización multi-dispositivo, control de acceso y protección reforzada, hace falta incorporar autenticación, base de datos, cifrado y reglas de conservación/eliminación antes del despliegue público.

Tu Amore proporciona acompañamiento general y estrategias cotidianas, no evaluación clínica, diagnóstico ni tratamiento. Si el desánimo persiste o empeora, la aplicación recomienda apoyo de una persona adulta de confianza y de un profesional cualificado; ante peligro inmediato, indica contactar con una persona adulta cercana y con el 112 en España.
