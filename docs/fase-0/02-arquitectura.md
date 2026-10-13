# Arquitectura y estructura del repo

**Resumen:** una app de React Native con Expo que nunca sabe si habla con un badge real o simulado, y un backend en Supabase que confirma los PINGs y protege los datos privados.

## Estructura del repo

```text
/app          App de iPhone (Expo + TypeScript)
/backend      Supabase: migraciones SQL, funciones y datos de prueba
/firmware     Firmware del badge (trabajo aparte; por ahora solo README y contrato)
/docs         Especificación, contrato y decisiones
/odd          Seguimiento de trabajo de Gentle AI
```

Cada carpeta principal es independiente: se puede separar en su propio repo más adelante sin reescribir nada.

## Cómo se ve todo junto

```text
 ┌──────────┐  ESP-NOW (sin internet)  ┌──────────┐
 │ Badge A  │ ◀──── PING / PONG ─────▶ │ Badge B  │
 └────┬─────┘                          └────┬─────┘
      │ BLE (solo en Modo Sync)              │ BLE
 ┌────▼─────┐                          ┌────▼─────┐
 │ iPhone A │                          │ iPhone B │
 └────┬─────┘                          └────┬─────┘
      │ HTTPS                                │ HTTPS
      └──────────────▶ Supabase ◀────────────┘
                 (cuentas, encuentros, perfiles, IA)
```

Un PING queda **confirmado** solo cuando los dos iPhones subieron el mismo `encounter_id`.

## La app (`/app`)

### Tecnologías

| Pieza | Elección | Para qué, en una línea |
|-------|----------|------------------------|
| Base | Expo (última versión estable) + TypeScript | Una sola base de código con tipos que atrapan errores antes de ejecutar |
| Navegación | Expo Router | Cada pantalla es un archivo; las pestañas salen de la estructura de carpetas |
| Estado local | Zustand + AsyncStorage | Guarda perfil y ajustes en el teléfono, sin configuración pesada |
| Validación | Zod | Revisa que los mensajes del badge y los formularios tengan la forma correcta |
| Backend | `@supabase/supabase-js` | Cliente oficial de Supabase |
| Traducciones | i18next + expo-localization | La app en español y los textos del badge en inglés, listos para traducir |
| BLE (Fase 8) | `react-native-ble-plx` con su *config plugin* de Expo | Librería BLE madura; requiere build de desarrollo, no funciona en Expo Go |
| Notificaciones | `expo-notifications` (solo locales) | Avisos de "nuevo PING" y "misión completada" sin servidor de push |
| Pruebas | Jest + React Native Testing Library | Pruebas automáticas de reglas y pantallas |

### Organización por funcionalidad

La carpeta grita qué hace la app (*screaming architecture*): se organiza por funcionalidad, no por tipo de archivo.

```text
/app
  app/                    Rutas de Expo Router (pantallas)
  src/
    features/
      profile/            Perfil
      sharing/            Datos a compartir
      blip/               Criatura, aspectos y emociones
      missions/           Misiones e insignias
      badge/              Pantalla "Mi badge" y Modo Sync
      network/            Red de PINGs por evento
      dev/                Pantalla de desarrollo (solo en builds de desarrollo)
    domain/               Reglas puras sin React: misiones, insignias, emociones, encuentros
    badge-link/           Comunicación con el badge (ver abajo)
    services/             Supabase y almacenamiento local
    i18n/                 es (app) y en (badge)
  assets/blip/            Sprites de Blip (placeholders hasta recibir los finales)
```

`domain/` no depende de React ni de Supabase. Por eso sus reglas se prueban rápido y se pueden reutilizar en el backend si hace falta.

### La capa de comunicación con el badge

Es la pieza más importante para cumplir "la app no debe saber cuál usa". Tiene dos niveles:

```text
 Pantallas
    │
 BadgeClient ─────────────── habla el protocolo (mensajes JSON del contrato)
    │
 Transport (interfaz) ────── solo mueve bytes
    ├── BleTransport          badge real por Bluetooth (Fase 8)
    └── SimTransport  ──▶ SimulatedBadge   badge falso en memoria (Fase 3)
```

- **`Transport`** es la interfaz común: conectar, enviar bytes, recibir bytes y desconectar.
- **`SimulatedBadge`** responde exactamente los mismos mensajes que el firmware real. Por eso, el día que llegue el hardware, el código de protocolo ya está probado.
- **La pantalla de desarrollo** controla al `SimulatedBadge`: dispara PINGs, cambia batería, fuerza emociones y simula Pong.
- La app elige el transporte con un ajuste (`simulado` o `real`). Ninguna pantalla lo consulta.

### Cómo probar PINGs sin hardware

| Caso | Cómo funciona |
|------|---------------|
| Un solo teléfono | El backend tiene **badges bot** de prueba. El simulador genera un PING con un bot y el bot "sube" su mitad automáticamente |
| Dos teléfonos | El teléfono A genera un PING y muestra un **código de 6 caracteres**. El teléfono B lo escribe y su badge simulado guarda el mismo `encounter_id` |

## El backend (`/backend`)

| Pieza | Para qué |
|-------|----------|
| Supabase Auth | Cuentas con código de 6 dígitos al correo (sin contraseñas) |
| Postgres + RLS | Datos y reglas de acceso: cada fila define quién puede leerla |
| Función `sync-encounters` | Recibe los PINGs de un badge, confirma los que tienen pareja y devuelve el estado |
| Función `generate-missions` (Fase 7) | Llama a la IA con el perfil y devuelve misiones válidas o las fijas |
| Función `b` (Fase 9) | Resuelve `https://blipz.app/b/{ID}` y redirige al perfil actual |

**RLS (Row Level Security):** reglas dentro de la base de datos que deciden qué filas ve cada usuario. Aunque la app tuviera un error, la base de datos no entrega lo que no corresponde.

### Llaves y secretos

- La app solo lleva la llave pública de Supabase (`anon key`), que está diseñada para estar en el cliente y funciona junto con RLS.
- La llave de la IA vive **solo** como secreto de la función `generate-missions`. Nunca entra a `/app`.

## IA de misiones (Fase 7)

- Modelo: Claude, llamado desde la función de Supabase con el SDK oficial de TypeScript y **salida estructurada** (la respuesta llega como JSON validado contra un esquema).
- La IA **no inventa reglas**: elige entre tipos de misión que la app sabe medir (por ejemplo, "PING con N personas de rol X") y escribe el título.
- El backend rechaza cualquier misión con título de más de 24 caracteres, caracteres que el OLED no puede dibujar o tipos desconocidos.
- Si la IA falla, tarda más de 5 segundos o devuelve algo inválido, se usan las misiones fijas.
- El modelo exacto se decide en [decisiones abiertas](07-decisiones-abiertas.md).
