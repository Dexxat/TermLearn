# 🚀 TermLearn | Plataforma Didáctica de Terminal Linux

Plataforma educativa interactiva diseñada para aprender comandos y servicios de Linux de forma didáctica, fluida y visual, combinando un **layout de 2 paneles (Split-Screen)**, un **modelo de tutorial guiado paso a paso** con anatomía de comandos, y un **motor de ejecución Linux en WebAssembly**.

---

## 📸 Vista Rápida del Diseño y Decisiones de Arquitectura

```
+-----------------------------------------------------------------------------------------+
| [>_ TermLearn]  [Módulo: 1. Navegación ▼]  [Lección 1 de 18]     [★ 120 XP] [WASM Kernel] |
+--------------------------------------------+--------------------------------------------+
| PANEL DIDÁCTICO (42%)                      | PANEL PRÁCTICO (58%)                       |
|                                            |                                            |
| 🏷️ Módulo 1: Navegación Básica             | 🔴 🟡 🟢 term@wasm-linux:~                 |
| 📖 ¿Dónde estoy? El comando pwd            | ------------------------------------------ |
|                                            | Linux 6.1.0-wasm-x86_64 GNU/BusyBox        |
| 🧬 Anatomía del Comando                    |                                            |
|   [ pwd ]  -> [Comando] Print Working Dir  | aprendiz@wasm:~$ pwd                       |
|                                            | /home/aprendiz                             |
| 🎯 Tu Misión                               |                                            |
|   Escribe `pwd` y presiona Enter           | aprendiz@wasm:~$ ls -la                    |
|   [ ¡Completado! ✓ ]                       | total 24                                   |
|                                            | drwxr-xr-x 4 aprendiz aprendiz 4096 Oct 30 |
| 💡 Pistas & Errores Comunes                | aprendiz@wasm:~$ █                         |
| [ < Anterior ]     [ Siguiente Lección > ] | [Historial: ↑↓] [Tab: Autocompletar]       |
+--------------------------------------------+--------------------------------------------+
```

---

## ⚡ ¿Cómo Probar el Proyecto de Inmediato?

El proyecto cuenta con una versión interactiva **completamente funcional y autocontenida** en `index.html`. Puedes probarla sin necesidad de instalar dependencias pesadas:

### Opción 1: Abrir directamente en el navegador (macOS)
```bash
open /Users/dexxa/.gemini/antigravity/scratch/terminal-academy/index.html
```

### Opción 2: Iniciar un servidor local ultraligero
```bash
cd /Users/dexxa/.gemini/antigravity/scratch/terminal-academy
python3 -m http.server 3000
```
Luego abre tu navegador en: [http://localhost:3000](http://localhost:3000)

---

## 🧩 Decisiones Técnicas Implementadas

### 1. Motor de Ejecución: Linux en WebAssembly (WASM)
* **Arquitectura de Doble Capa:**
  * **Capa 1 (POSIX WASM Engine - Instantánea):** Emulador interactivo en memoria con árbol de directorios real (`/home/aprendiz`, `/etc`, `/var/log`, `/bin`), pipes (`|`), redirección (`>`), filtrado (`grep`), manipulación de procesos (`ps aux`, `kill`), permisos (`chmod +x`), y autocompletado con tecla `Tab`.
  * **Capa 2 (v86 x86 Linux VM via WebAssembly):** Especificación e interfaz para arrancar un kernel Linux real (Alpine/Buildroot) vía WASM usando el bus serie (`/dev/ttyS0`).
* **Seguridad y Costo Cero:** Todo se ejecuta en el navegador del usuario. Cero latencia, cero servidores backend, 100% inmune a ataques remotos.

### 2. Método Didáctico: Modo Tutorial Guiado Paso a Paso
* **Anatomía del Comando:** Cada lección desglosa visualmente qué es el comando base, qué significa cada flag (`-l`, `-a`, `-r`, etc.) y qué rol juegan los argumentos o rutas.
* **Validador Automático en Tiempo Real:** Intercepta la ejecución en la terminal, valida el objetivo pedagógico, otorga XP y reproduce retroalimentación sonora sutil mediante la API de Web Audio.
* **Sistema de Pistas Progresivas:** Acordeón de pistas para no arruinar el aprendizaje, complementado con notas *"Pro-Tip"* de buenas prácticas.

### 3. Layout: 2 Paneles (Split-Screen)
* **Panel Izquierdo (Didáctico):** Guía teórica concisa, objetivo de la misión, anatomía del comando, pistas y controles de navegación.
* **Panel Derecho (Terminal):** Emulación de terminal oscura (Fira Code / JetBrains Mono), soporte ANSI, colores semánticos (azul para carpetas, verde para ejecutables, rojo para errores), histórico de comandos (`↑` / `↓`), y barra de herramientas rápida (solución rápida, limpiar, resetear sistema de archivos).

---

## 📚 El Currículum MVP (18 Lecciones / 5 Módulos)

1. **Módulo 1: Perdiendo el miedo (Navegación e Inspección)**
   * `pwd` — Orientándote en el árbol de directorios.
   * `ls` — Inspeccionar el contenido actual.
   * `ls -la` — Archivos ocultos (`.bashrc`) y permisos detallados.
   * `cd proyectos` — Moverte hacia directorios hijos con autocompletado (`Tab`).
   * `cd ..` y `cd ~` — Subir de nivel y volver al HOME.

2. **Módulo 2: Manipulación de Archivos y Carpetas**
   * `mkdir laboratorio` — Creación de directorios.
   * `touch notas.txt` — Creación de archivos vacíos.
   * `cp notas.txt copia.txt` — Duplicar archivos de origen a destino.
   * `mv copia.txt backup.txt` — Renombrar y mover archivos.
   * `rm backup.txt` — Eliminación definitiva y advertencia sobre `rm -rf`.

3. **Módulo 3: Inspección, Filtros y Tuberías (UNIX Power)**
   * `cat servidor.log` y `head` — Lectura rápida sin editores.
   * `grep ERROR servidor.log` — Búsqueda de patrones en logs.
   * `cat servidor.log | grep 404` — La tubería (`|`) conectando programas.
   * `echo 'Servicio Activo' > estado.txt` — Redirección a archivos.

4. **Módulo 4: Permisos y Seguridad**
   * `chmod +x script.sh` — Entender `rwxr-xr-x` y activar ejecución.
   * `whoami` — Roles de usuario, multiusuario y concepto de `sudo` / `root`.

5. **Módulo 5: Procesos y Servicios Básicos**
   * `ps aux` — Monitorear procesos en ejecución y consumo de CPU/Memoria.
   * `kill 1337` — Finalizar procesos desbocados por PID.

---

## 📁 Estructura del Proyecto

```
terminal-academy/
├── index.html                   # Aplicación completa interactiva lista para usar
├── README.md                    # Esta guía y documentación
├── docs/
│   └── wasm-linux-architecture.md # Especificación técnica del kernel Linux en WebAssembly
└── src/
    ├── types.ts                 # Definición de tipos TypeScript para lecciones y VFS
    └── curriculum.json          # Datos estructurados del temario y validadores
```
