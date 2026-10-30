# Arquitectura del Motor: Linux en WebAssembly (WASM)

Este documento detalla la arquitectura técnica para ejecutar un entorno Linux real dentro del navegador web mediante WebAssembly, y cómo se comunica con la capa de tutoriales didácticos.

---

## 1. Diagrama de la Arquitectura

```
+-------------------------------------------------------------------------------+
| NAVEGADOR DEL USUARIO (Client-Side Only)                                      |
|                                                                               |
|  +---------------------------+       +-------------------------------------+  |
|  | PANEL DIDÁCTICO           |       | TERMINAL EMULATOR (xterm.js / DOM)  |  |
|  | - Estado de Lecciones     |       | - Colores ANSI, Teclado, Buffer      |  |
|  | - Validador de Objetivos  |       | - Historial, Prompt Interactivo     |  |
|  +-------------^-------------+       +------------------^------------------+  |
|                |                                        |                     |
|                +------------------+                     |                     |
|                                   |                     | (I/O Stream)        |
|                                   v                     v                     |
|                       +-------------------------------------+                 |
|                       |  INTERCEPTOR Y MIDDLEWARE DIDÁCTICO |                 |
|                       |  - Inspección de comandos en vuelo  |                 |
|                       |  - Detección de sintaxis y flags    |                 |
|                       |  - Cálculo de XP y sonido chimes    |                 |
|                       +------------------+------------------+                 |
|                                          |                                    |
|                   +----------------------+----------------------+             |
|                   |                                             |             |
|                   v                                             v             |
|  +--------------------------------+             +--------------------------+  |
|  | MODO 1: MOTOR POSIX WASM FAST  |             | MODO 2: KERNEL LINUX v86 |  |
|  | - Latencia < 5ms               |             | - Emulador x86 en WASM   |  |
|  | - Carga instantánea (0 KB)     |             | - Kernel Alpine/Buildroot|  |
|  | - Soporte de comandos del MVP  |             | - Serial Port /dev/ttyS0 |  |
|  +--------------------------------+             +--------------------------+  |
+-------------------------------------------------------------------------------+
```

---

## 2. Tecnologías y Enfoques para Linux en WASM

### Enfoque A: v86 (x86 Hardware Virtualization en WASM)
* **Repositorio:** [github.com/copy/v86](https://github.com/copy/v86)
* **Cómo opera:**
  1. Compila un emulador de arquitectura x86 a WebAssembly (`v86.wasm`).
  2. Carga un BIOS ligero (`seabios.bin`) y un Linux kernel comprimido (`bzImage` + `rootfs.cpio.gz` o imagen de Alpine Linux / Buildroot).
  3. Tamaño de descarga: ~4 MB a 8 MB (comprimido con gzip/brotli).
  4. La salida no necesita lienzo gráfico (canvas), sino que se canaliza el puerto serie 0 (`/dev/ttyS0`) directamente a la terminal de texto.

```javascript
// Ejemplo de inicialización con v86
import { V86Starter } from "v86";

const emulator = new V86Starter({
  wasm_path: "/wasm/v86.wasm",
  memory_size: 64 * 1024 * 1024, // 64 MB RAM
  vga_memory_size: 2 * 1024 * 1024,
  bios: { url: "/wasm/seabios.bin" },
  cmdline: "console=ttyS0 root=/dev/ram0 rw quiet",
  bzimage: { url: "/wasm/bzImage" },
  initrd: { url: "/wasm/rootfs.cpio.gz" },
  autostart: true,
});

// Conectar serial a la terminal
emulator.add_listener("serial0-output-char", function(char) {
  terminal.write(char);
});

terminal.onData(function(data) {
  emulator.serial0_send(data);
});
```

### Enfoque B: WebAssembly BusyBox / Emscripten POSIX
* Un binario de `BusyBox` compilado directamente a WebAssembly con WASI o Emscripten.
* Ventaja: Arranca en menos de 50 milisegundos, pesa menos de 1.5 MB y soporta más de 200 utilidades estándar de UNIX (`ls`, `cat`, `grep`, `awk`, `sed`, `find`, `sh`, `tar`, etc.).

---

## 3. El Interceptor Didáctico (Cómo evaluar al usuario)

Una de las dificultades al usar un kernel real en WASM es saber **cuándo el alumno ha cumplido el objetivo**, dado que el kernel es una caja negra.

Implementamos una estrategia de **Evaluación de Doble Vía**:
1. **Inspección de Entrada (Input Interception):**
   * El interceptor captura la línea de comando antes o simultáneamente a su envío al kernel.
   * Valida sintaxis, flags usados (por ejemplo si usó `-la` o `-l -a`) y argumentos.
2. **Sondeo de Salida (Output Hooking) & Estado:**
   * La terminal analiza si el comando devolvió error (exit code != 0) o produjo la salida esperada.
   * Con el sistema de archivos virtual, el estado de los archivos creados (`mkdir`, `touch`, `cp`) se verifica directamente en el árbol de nodos.

---

## 4. Ventajas para el Modelo Educativo

* **Seguridad Absoluta:** Al ejecutarse en WebAssembly dentro de la sandbox del navegador del usuario, es técnicamente imposible que un usuario cause daño a tu servidor, a otros alumnos o a su propia computadora real.
* **Costo de Servidores = $0:** A diferencia de plataformas que arrancan un contenedor Docker por usuario (que consumen CPU y RAM de pago cada segundo), el cómputo aquí ocurre en el dispositivo del estudiante. La plataforma puede escalar a 100,000 usuarios concurrentes alojada en un hosting estático gratuito (GitHub Pages, Vercel, Cloudflare Pages).
* **Funciona Offline:** Una vez descargados los assets o el ServiceWorker, los estudiantes pueden aprender Linux incluso en un avión o sin conexión a internet.
