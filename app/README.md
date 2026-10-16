# App de Blip (iPhone)

App de Expo + TypeScript. Hasta la Fase 7 se prueba en **Expo Go**, sin pagar nada.

## Probarla en tu iPhone

### Una sola vez

1. Instala en tu computadora **Node.js LTS** (nodejs.org) y **Git** (git-scm.com).
2. Instala **Expo Go** en el iPhone desde el App Store.
3. En una terminal, clona el repo en la rama de trabajo:

   ```bash
   git clone -b claude/quirky-davinci-pqwpl4 https://github.com/MauIds/blip-app.git
   cd blip-app/app
   npm install
   ```

### Cada vez que quieras probar

```bash
cd blip-app/app
git pull               # trae los últimos cambios
npm install            # solo si cambiaron dependencias; no hace daño correrlo siempre
npx expo start         # muestra un código QR
```

Escanea el QR con la cámara del iPhone y se abre en Expo Go. El teléfono y la computadora tienen que estar en la **misma red Wi-Fi**; si no se puede, usa `npx expo start --tunnel`.

Si Expo Go dice que el proyecto es incompatible, actualiza Expo Go desde el App Store: este proyecto usa **Expo SDK 58**.

## Qué probar en la Fase 1

1. Abre la pestaña **Blip** y toca **Completa tu perfil**.
2. Toca **Guardar perfil** sin llenar nada: deben marcarse en rojo los 5 campos obligatorios.
3. Llena nombre, nombre en el badge, puesto, rol y código del evento (por ejemplo `DD26`) y guarda: aparece **Perfil guardado**.
4. Pega tu link de GitHub completo: al guardar queda solo tu usuario.
5. Toca **Elegir qué datos compartes**: por defecto solo están activos nombre y puesto.
6. Activa GitHub: aparece en **Así te verán**. La fila **Edad** siempre está apagada y bloqueada.
7. Cierra Expo Go y vuelve a abrir la app: tu perfil y tus elecciones siguen ahí.

## Comandos de desarrollo

| Comando | Qué hace |
|---------|----------|
| `npm test` | Corre las pruebas automáticas |
| `npm run typecheck` | Revisa los tipos de TypeScript |
| `npm run lint` | Revisa el estilo del código |

## Estructura

```text
src/
  app/        Pantallas y navegación (cada archivo es una ruta)
  features/   Código por funcionalidad: profile, sharing, ...
  domain/     Reglas puras con sus pruebas (perfil, privacidad)
  services/   Almacenamiento en el teléfono
  ui/         Componentes visuales reutilizables
  i18n/       Textos: app en español, badge en inglés
```
