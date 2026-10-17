# Plan por fases del prototipo v1

**Meta:** que dos personas, cada una con su badge y su iPhone, completen el recorrido de 6 pasos. Primero con el badge simulado y después con badges reales.

**Regla de avance:** no se empieza una fase sin tu aprobación de la anterior.

## El recorrido que tiene que funcionar

1. Abre la app y llena su perfil.
2. Recibe misiones según su perfil y el evento.
3. Ve a Blip y cambia su aspecto.
4. Ve en otra pantalla lo mismo que muestra el badge.
5. Elige qué datos comparte al hacer PING.
6. Ve la red de PINGs del evento y el perfil de cada persona.

## Fases

| Fase | Qué se entrega | Cómo lo pruebas | Necesitas pagar algo |
|------|----------------|-----------------|----------------------|
| 0 | Esta especificación | La lees y apruebas | No |
| 1 | Proyecto Expo, navegación con pestañas, pantalla de Perfil y de Datos a compartir (guardados en el teléfono) | Abres la app en tu iPhone con **Expo Go** y llenas tu perfil | No |
| 2 | Pantalla de Blip: 3 aspectos (placeholders), 4 estados de ánimo y sus reglas | Cambias el aspecto y fuerzas emociones desde la pantalla de desarrollo | No |
| 3 | Capa de comunicación con el badge + **badge simulado** + pantalla Mi badge + Modo Sync simulado + pantalla de desarrollo | Disparas PINGs falsos, cambias la batería y sincronizas | No |
| 4 | Backend en Supabase: cuentas, eventos, badges (`devices`), encuentros confirmados y perfiles compartidos | Creas cuenta con tu correo y tus PINGs simulados aparecen en la base de datos | Supabase gratis alcanza |
| 5 | Misiones fijas de la demo e insignias | Completas misiones con PINGs simulados y ganas insignias | No |
| 6 | Red de PINGs por evento y perfil de cada persona | Dos teléfonos se hacen PING simulado y cada uno ve al otro solo con lo que eligió compartir | No |
| 7 | Misiones con IA desde el backend, con respaldo a las fijas | Cambias tu rol y recibes misiones distintas | Créditos de la API de Claude (centavos por usuario) |
| 8 | Conexión BLE real, build de desarrollo en la nube (EAS) y pruebas con 2 badges | El recorrido completo con hardware | **Apple Developer: USD 99/año** |
| 9 (opcional) | Link NFC `https://blipz.app/b/{ID}` y perfil público de solo lectura | Acercas el iPhone a la tarjeta y abre el perfil | Dominio `blipz.app` |

## Por qué este orden

- ~~**Las fases 1 a 7 funcionan en Expo Go**, una app gratuita del App Store. Como el badge simulado reemplaza al Bluetooth, no necesitas pagar Apple hasta la Fase 8.~~

> **Corrección (17/10/2026):** esto era falso. Expo Go del App Store solo soporta hasta el **SDK 54** ([documentación de Expo](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/)) y el proyecto usa el SDK 58. Para probar en un iPhone hace falta una build propia, que requiere Apple Developer. El camino a seguir está pendiente de decisión: ver [decisiones abiertas](07-decisiones-abiertas.md).

- **El simulador va antes que el backend** para que el contrato con el badge quede probado sin depender de internet.
- **La IA va al final** porque las misiones fijas ya cubren la demo. Si la IA falla, nada se rompe.

## Qué recibes al cerrar cada fase

1. Qué se hizo, en 3 a 5 líneas.
2. Los comandos exactos para probarlo y dónde correrlos.
3. Qué sigue y qué necesito de ti.

Cada avance va en un commit pequeño con mensaje en formato Conventional Commits (por ejemplo, `feat(profile): add sharing settings screen`).

## Fuera de alcance de la v1

Firmware (se trabaja aparte; aquí solo se define el contrato), Pong online, chat, pagos y personalización del logo de la tarjeta.
