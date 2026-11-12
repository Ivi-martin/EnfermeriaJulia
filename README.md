# Campus Enfermería Toledo 2.0 (UCLM) - App de Julia 🩺✨

Aplicación integral para Julia, estudiante de 1º de Grado en Enfermería en la Facultad de Fisioterapia y Enfermería de Toledo (Campus Tecnológico de la Fábrica de Armas, UCLM).

---

## 🚀 Cómo ponerlo en marcha en local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno (opcional para IA en vivo):**
   Copia `.env.example` a `.env` y añade tu clave de Google Gemini:
   ```bash
   cp .env.example .env
   ```
   *(La app incluye respuestas inteligentes offline si no tienes clave configurada).*

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📤 Cómo subirlo a tu repositorio de GitHub

Si has descargado y descomprimido este archivo `.zip` en tu ordenador, sigue estos sencillos pasos desde la terminal dentro de la carpeta:

```bash
# 1. Si no es un repositorio git iniciado:
git init

# 2. Conecta con tu repositorio de GitHub:
git remote add origin https://github.com/Ivi-martin/EnfermeriaJulia.git
# (O si ya existía origin: git remote set-url origin https://github.com/Ivi-martin/EnfermeriaJulia.git)

# 3. Añade todos los archivos actualizados:
git add .

# 4. Haz el commit con los cambios:
git commit -m "feat: Bienestar con historial, gráficas y tutores IA Manitas y Chef"

# 5. Sube los cambios a la rama principal:
git branch -M main
git push -u origin main --force
```

---

## 🌟 Novedades implementadas

- **Bienestar "¿Cómo estás hoy?":**
  - Corrección de la zona horaria en España (resuelve el desfase entre las 00:00 y las 02:00).
  - Selector de horas de sueño (`< 5h`, `5-6h`, `7-8h`, `> 8h`).
  - Gráfica interactiva de evolución de ánimo y energía a 7 y 14 días.
  - Cruce con turnos de prácticas hospitalarias y fechas de exámenes.
  - Consejos empáticos adaptativos con recordatorio de desconexión y mensaje de Mamá e Ivi ante fatiga sostenida.
  - Historial y mini-diario para consultar y editar días pasados.

- **Nuevos Tutores IA:**
  - **🛠️ Manolo el Manitas**: Especialista en fontanería, electricidad básica segura y bricolaje de piso en Toledo.
  - **🍳 Chef Nutri**: Experto en cocina de piso, tuppers de hospital y nutrición para turnos. Incluye la herramienta interactiva **"¿Qué cocino con mi nevera?"**.
