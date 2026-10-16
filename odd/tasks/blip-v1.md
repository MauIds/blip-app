# blip-v1 — Blip app prototype v1 (app + backend + badge contract)

Objective: complete the 6-step journey with 2 badges and 2 iPhones, first simulated, then real. Branch: `claude/quirky-davinci-pqwpl4`. Delivery strategy: `ask-on-risk` (one phase per approval). Test runner: Jest (`app/`), to be set up in T1.
Human-readable spec (Spanish): `docs/fase-0/`. Phase gate: no phase starts without the user's approval of the previous one.

## Specs

- S1 — Journey. "Que un usuario complete este recorrido con 2 badges y 2 iPhones:" "Abre la app y llena su perfil: nombre, puesto, intereses, edad, evento al que va y datos de contacto (GitHub, LinkedIn, CV, correo)." "Recibe misiones según su perfil y el evento." "Ve a Blip y cambia su aspecto." "Ve en otra pantalla lo mismo que muestra el badge." "Elige qué datos comparte al hacer PING." "Ve la red de PINGs del evento y el perfil de cada persona." Acceptance: "Se completa el recorrido de los 6 pasos, primero con el simulador y luego con 2 badges reales."
- S2 — Age privacy. "La edad nunca se comparte. Es una regla fija." / "La edad nunca aparece en perfiles de otros." Check: automated test that no shared-profile response contains age.
- S3 — Sharing defaults. "Los datos visibles para otros los elige el usuario. Por defecto solo nombre y puesto."
- S4 — PING validity. "Un PING es válido solo si los dos badges reportan el mismo encounter_id." / "Un PING solo se registra si ambos badges reportan el mismo encounter_id." "Cada encuentro se asocia al evento activo del usuario."
- S5 — Network by event. "La red se ve por evento, con los datos que cada persona decidió compartir."
- S6 — Secrets. "Ninguna llave de API vive dentro de la app." "IA de misiones: API de un modelo de IA, llamada solo desde el backend."
- S7 — Demo missions. "Las misiones de la demo funcionan sin IA." "Si la IA falla, se usan las misiones fijas."
- S8 — Mission titles. "Cada título debe caber en el OLED: máximo 24 caracteres, con progreso numérico (por ejemplo “Meet 3 devs w/ agents”, 2/3)."
- S9 — Simulator. "Construye una capa de comunicación con una interfaz común y dos implementaciones:" "La app no debe saber cuál usa. Incluye una pantalla de desarrollo para disparar PINGs, cambiar batería y emociones, y probar el flujo completo."
- S10 — Modes. "Modo Evento (normal): BLE apagado, ESP-NOW activo." "Modo Sync: se activa desde el menú o con pulsación larga. Prende BLE, sincroniza y se apaga solo."
- S11 — Blip. "3 aspectos: el predeterminado más 2 por crear." "Emociones: felicidad, hambre y congelamiento." "Blip empieza normal y se congela solo por inactividad (sin completar misiones ni hacer PING durante un tiempo)." "En el simulador, las emociones se pueden forzar para probar."
- S12 — NFC format. "https://blipz.app/b/{ID}, donde {ID} es el ID único del badge (ejemplo: 7F3A2C)." "Desde el inicio, diseña la tabla devices (ID corto del badge → usuario) para que contemple este formato."
- S13 — Languages. "La app va en español. Los textos del badge y de las insignias van en inglés. Deja la estructura lista para traducir."
- S14 — Repo layout. "El repo incluye firmware, pero con carpetas separadas (/app, /backend, /firmware, /docs) para poder separarlo después."
- S15 — Collaboration. "Commits pequeños, uno por avance." "Al terminar cada fase, dime qué se hizo, qué probar y qué sigue." "Ante decisiones grandes o ambiguas, pregúntame antes de decidir. Lo pequeño lo decides tú y me avisas."

## Tasks

| ID | Phase | Specs | Route | Status | Evidence |
|----|-------|-------|-------|--------|----------|
| T0 | Fase 0: plan y especificación | S1–S15 | inline | done, approved 2026-10-16 | 8228510, 09ac1d0 |
| T1 | Fase 1: base, navegación y perfil | S1, S3, S13, S14 | inline | in progress | — |
| T2 | Fase 2: Blip, aspectos y emociones | S11 | — | pending | — |
| T3 | Fase 3: simulador y sincronización | S9, S10 | — | pending | — |
| T4 | Fase 4: backend | S2, S3, S4, S6, S12 | — | pending | — |
| T5 | Fase 5: misiones fijas e insignias | S7, S8 | — | pending | — |
| T6 | Fase 6: red de PINGs | S4, S5, S2 | — | pending | — |
| T7 | Fase 7: misiones con IA | S6, S7, S8 | — | pending | — |
| T8 | Fase 8: hardware real e iPhone | S1, S4, S10 | — | pending | — |
| T9 | Fase 9 (opcional): NFC y perfil público | S12, S2 | — | pending | — |

## Log

- L1 (2026-10-13) — Original request, verbatim:

```text
Proyecto Blipz: ciclo de desarrollo de la app Blip (prototipo v1)

1. Contexto

Blipz es el proyecto. Blip es la mascota y el nombre del badge: una credencial electrónica con una criatura pixel art, más una app de iPhone que la acompaña. Es para eventos de networking (conferencias, charlas, meetups) y para ingenieros y emprendedores jóvenes.
Idea central: cuando dos badges están cerca hacen PING automáticamente, las criaturas comparten una animación y se construye una red de contactos organizada por evento.
Secreto: al hacer PING, el otro badge responde PONG y se desbloquea el juego Pong dentro del badge, con los botones. Es local, no online.
Tu rol: eres el desarrollador principal de la app y del backend. Yo (Mau) llevo tiempo sin programar y no tengo Mac, así que explícame todo en español, simple y paso a paso.

2. Imágenes de referencia (adjuntas en este mensaje)

Junto con este prompt te adjunto imágenes del concepto. Úsalas como referencia visual y de comportamiento:
Hoja de insignias: sección “Missions” (First Crack, Half Thawed, Fully Thawed) y sección “Collection” (First Ping, Icebreaker, Node, Hub, Bridge, Open Card, Curious, Logbook, Never Frozen, DD26 y una bloqueada “?”). Son hexágonos pixel art en blanco sobre negro.
Badge físico: carcasa transparente, tarjeta superior con logo de la empresa, nombre y puesto, y el ícono NFC. Abajo, la pantalla OLED y 3 botones con iconos de Blip, medalla y red.
Pantallas del badge: Blip en reposo, la animación “PING!/PONG!”, la notificación “NEW BADGE! FIRST PING 1/10” y la pantalla de misiones (“MISSIONS 3/5”, misión activa con barra de progreso y “COLLECTION 4/10”).
Escena de uso: dos personas en un evento cuyos badges hacen PING al acercarse.
Las imágenes son conceptos. Toma de ellas el estilo y la información que muestra cada pantalla, no medidas exactas.

3. Objetivo del prototipo

Que un usuario complete este recorrido con 2 badges y 2 iPhones:
Abre la app y llena su perfil: nombre, puesto, intereses, edad, evento al que va y datos de contacto (GitHub, LinkedIn, CV, correo).
Recibe misiones según su perfil y el evento.
Ve a Blip y cambia su aspecto.
Ve en otra pantalla lo mismo que muestra el badge.
Elige qué datos comparte al hacer PING.
Ve la red de PINGs del evento y el perfil de cada persona.
Prioridad: llegar lo antes posible sin perder calidad. Nada complejo por ahora.

4. Alcance

Incluye: perfil, datos a compartir, pantalla de Blip, pantalla espejo del badge, misiones e insignias, historial de PINGs por evento, sincronización por Bluetooth LE, backend y simulador de badge.
No incluye: firmware (se trabaja aparte, pero aquí se define el contrato de comunicación), Pong online, chat, pagos, personalización del logo de la tarjeta.

5. Pantallas de la app (en español)
Perfil: datos personales y de contacto. La edad solo se usa para personalizar misiones.
Datos a compartir: el usuario marca qué campos verán los demás.
Blip: la criatura, su emoción actual y el selector de aspecto.
Misiones e insignias: misiones activas con progreso y colección de insignias, siguiendo la hoja de insignias adjunta.
Mi badge: réplica de las 3 pantallas del badge que se ven en las imágenes, con batería y botón de sincronizar.
Red de PINGs: lista por evento y detalle del perfil de cada persona.
6. Criatura Blip
Vive en la app y en el badge.
3 aspectos: el predeterminado más 2 por crear. Se elige en la app y se envía al badge. Usa placeholders hasta que mi socio entregue los sprites.
Emociones: felicidad, hambre y congelamiento.
Blip empieza normal y se congela solo por inactividad (sin completar misiones ni hacer PING durante un tiempo).
En el simulador, las emociones se pueden forzar para probar.
7. Misiones e insignias

Las insignias siguen la hoja adjunta. Los textos del badge y de las insignias van en inglés.
Misiones de la demo (fijas y sencillas): crea un conjunto pequeño y fijo para presentar en el evento. Deben funcionar sin depender de la IA.
Misiones con IA (después): el backend recibe perfil y tipo de evento y devuelve misiones distintas por rol (CEO, CTO, Full Stack Jr, PM...). Cada título debe caber en el OLED: máximo 24 caracteres, con progreso numérico (por ejemplo “Meet 3 devs w/ agents”, 2/3). Si la IA falla, se usan las misiones fijas.
Misiones de descongelamiento: First Crack, Half Thawed, Fully Thawed.
Colección de 10 insignias + 1 secreta: propón los criterios de cada una en la Fase 0 para que yo los apruebe.
8. PING y encuentros
Automático por proximidad entre dos badges, por ESP-NOW (sin router ni internet).
Al ocurrir: animación conjunta, insignia “First Ping” y el secreto PING/PONG que desbloquea Pong.
Los encuentros se guardan en el badge y la app los recoge en Modo Sync.
Un PING es válido solo si los dos badges reportan el mismo encounter_id.
Cada encuentro se asocia al evento activo del usuario.
9. Hardware y comunicación
Placa: Seeed Studio XIAO ESP32-S3 (Wi-Fi 2.4 GHz, BLE 5.0).
Pantalla: OLED monocromática de 2.42", 128×64, I²C 0x3C (controlador SSD1309 o SSD1306, por confirmar).
Botones: 3, con iconos de Blip, medalla (insignias y misiones) y red (PINGs). Cada uno abre su pantalla.
Badge ↔ badge: ESP-NOW. App ↔ badge: Bluetooth LE.
Dos modos que no se mezclan:
Modo Evento (normal): BLE apagado, ESP-NOW activo.
Modo Sync: se activa desde el menú o con pulsación larga. Prende BLE, sincroniza y se apaga solo.
Dato Dirección Para qué
ID del badge (MAC) + versión de firmware Badge → App Emparejar el badge con el usuario
Nivel de batería Badge → App Mostrarlo en la app
PINGs pendientes (con encounter_id) Badge → App Conexiones aún no sincronizadas
Confirmación de sincronización App → Badge Marcar qué encuentros ya se guardaron
Perfil y configuración App → Badge Nombre visible, aspecto, vibración
Misiones y logros App → Badge Progreso actualizado
Aspecto y emoción de Blip App → Badge Lo que muestra la criatura
10. NFC (fase opcional, pero el formato se decide desde ya)
La tarjeta superior lleva una etiqueta NFC pasiva con un link fijo y corto que nunca cambia: https://blipz.app/b/{ID}, donde {ID} es el ID único del badge (ejemplo: 7F3A2C).
El link no apunta al perfil: apunta a nuestro servidor, que busca a quién pertenece ese badge y redirige a su perfil actual.
La etiqueta se graba una sola vez, al armar el badge. Si cambia el perfil o el dueño del badge, solo se actualiza la base de datos. Si cambia el dominio, se cambia la redirección en un solo lugar.
Desde el inicio, diseña la tabla devices (ID corto del badge → usuario) para que contemple este formato.
En la fase opcional se agrega una ruta que lea el ID y redirija, y una página pública de solo lectura con los datos que el usuario decidió compartir (nunca la edad).
La etiqueta se graba con el iPhone y una app gratuita como NFC Tools, o desde nuestra app más adelante.
11. Stack
App: React Native + Expo (TypeScript), con build de desarrollo en la nube (EAS Build). No tengo Mac y Expo Go no sirve para BLE. Valida en la Fase 0 las librerías de BLE compatibles con Expo.
Backend: Supabase (autenticación, base de datos, funciones). Puedo pagar un servicio en la nube unos días.
IA de misiones: API de un modelo de IA, llamada solo desde el backend.
Dime en la Fase 0 qué necesito para instalar la app en mi iPhone (cuenta de Apple Developer).
12. Privacidad
Los datos visibles para otros los elige el usuario. Por defecto solo nombre y puesto.
La edad nunca se comparte. Es una regla fija.
Permisos: Bluetooth y notificaciones sencillas (nuevo PING, misión completada).
La app va en español. Los textos del badge y de las insignias van en inglés. Deja la estructura lista para traducir.
13. Simulador de badge (obligatorio)
Todavía no hay hardware. Construye una capa de comunicación con una interfaz común y dos implementaciones:
Simulada: imita al badge (batería, PINGs falsos con encounter_id, confirmaciones).
Real (BLE): se conecta cuando lleguen las piezas.
La app no debe saber cuál usa. Incluye una pantalla de desarrollo para disparar PINGs, cambiar batería y emociones, y probar el flujo completo.

14. Forma de trabajo

Metodología: Gentle AI con ODD (Organic Driven Development). Si te faltan sus reglas, pregúntame antes de asumir.
Trabajamos por fases y no avanzas sin mi aprobación:
Fase 0: plan y especificación, sin código. Incluye estructura del repo, arquitectura, modelo de datos (con devices), contrato BLE, criterios de insignias y decisiones abiertas.
Fase 1: base del proyecto, navegación y perfil.
Fase 2: Blip, aspectos y emociones.
Fase 3: simulador de badge y sincronización.
Fase 4: backend (cuentas, eventos, encuentros, perfiles).
Fase 5: misiones fijas de la demo e insignias.
Fase 6: red de PINGs por evento y perfiles.
Fase 7: misiones con IA.
Fase 8: integración con el hardware real, pruebas en iPhone y pulido.
Fase 9 (opcional): NFC y perfil público.
15. Reglas de colaboración
Español, simple y sin jerga innecesaria. Explica cada concepto técnico nuevo en una línea.
Dime exactamente qué comandos correr y dónde.
Ante decisiones grandes o ambiguas, pregúntame antes de decidir. Lo pequeño lo decides tú y me avisas.
Commits pequeños, uno por avance.
Al terminar cada fase, dime qué se hizo, qué probar y qué sigue.
El repo incluye firmware, pero con carpetas separadas (/app, /backend, /firmware, /docs) para poder separarlo después.
16. Criterios de “terminado” para la v1
Se completa el recorrido de los 6 pasos, primero con el simulador y luego con 2 badges reales.
Un PING solo se registra si ambos badges reportan el mismo encounter_id.
La red se ve por evento, con los datos que cada persona decidió compartir.
La edad nunca aparece en perfiles de otros.
Ninguna llave de API vive dentro de la app.
Las misiones de la demo funcionan sin IA.
17. Primera tarea
Empieza con la Fase 0. Revisa las imágenes adjuntas y el repo actual, y entrégame el plan y la especificación para que los apruebe. No escribas código todavía.
```

- L2 (2026-10-13) — T0 analysis. Repo was empty apart from the Gentle AI setup. Verified: BLE needs a development build (Expo Go cannot load native BLE modules); `react-native-ble-plx` ships an Expo config plugin. EAS internal distribution to an iPhone requires a paid Apple Developer account (docs.expo.dev/build/internal-distribution). Key design calls: phases 1–7 run in Expo Go with a protocol-level badge simulator, so the paid Apple account is needed only in phase 8; age stored as `birth_year` in an owner-only table with no share toggle; `encounter_id` = initiator's 8-byte nonce echoed in PONG; confirmation needs both halves server-side. Only 4 of the reference images arrived (PING/PONG animation and event scene missing). Open decisions D1–D11 in `docs/fase-0/07-decisiones-abiertas.md`. Next: user approval of T0.
- L3 (2026-10-16) — User, verbatim: "aquí está la imagen ilustrativa, no tengo la imagen de ping pong aun, pero te comparto estas, y si apruebo la fase 0". Phase 0 approved with all recommendations; D1 (computer OS) and D8 (DD26 details) still unanswered. Event scene saved as `docs/referencias/escena-evento.jpg` (initiator shows PING!, responder PONG!). Starting T1.
