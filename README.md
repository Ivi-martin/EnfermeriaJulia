# Campus Enfermería Toledo · Julia

Aplicación PWA de apoyo académico y organización personal para el Grado en Enfermería de la UCLM (Toledo).

## Desarrollo local

Requisitos: Node.js 22.16 o superior compatible con la versión de Vite del proyecto.

```bash
npm ci
npm run lint
npm run build
npm run dev
```

Configura las claves exclusivamente en variables de entorno del servidor siguiendo `.env.example`. No publiques claves API en el frontend.

## Módulos principales

- Mi Día y Mi Semana Inteligente.
- Plan UCLM y Academia.
- Biblioteca / Buscador de Evidencia Científica.
- Tutor IA con perfiles virtuales ficticios.
- Entrenador ECOE y recursos clínicos con estado de revisión.
- Prácticas 360 y Pasaporte de Prácticas.
- Toledo en mi Bolsillo y Gestor del TFG.

## Datos y privacidad

La aplicación conserva almacenamiento local en `localStorage`, que no está cifrado. No introduzcas datos identificables de pacientes ni guardes documentos sanitarios o identificadores personales reales en la bóveda. Los filtros de texto de IA son heurísticos y no sustituyen la desidentificación.

Consulta `IMPLEMENTACION.md` para el detalle de migraciones, límites conocidos, endpoints de Vercel y pruebas realizadas.
