# Cómo instalar la app en tu iPhone sin Mac

**Respuesta corta:** hasta la Fase 7 no necesitas pagar nada; usas **Expo Go**, gratis en el App Store. Para la Fase 8 (Bluetooth real) necesitas el **Apple Developer Program (USD 99 al año)**, porque instalar una app propia fuera de Expo Go requiere una cuenta de desarrollador pagada ([documentación de Expo](https://docs.expo.dev/build/internal-distribution/)).

## Fases 1 a 7: Expo Go (gratis)

**Expo Go:** app que abre tu proyecto en el iPhone mientras lo desarrollas, sin compilar nada.

Lo que necesitas en tu computadora (Windows o Linux sirven):

1. **Node.js LTS**, desde nodejs.org.
2. **Git**, desde git-scm.com.
3. El repo clonado: `git clone https://github.com/mauids/blip-app.git`
4. En el iPhone: instalar **Expo Go** desde el App Store.

Cada vez que quieras probar, desde la carpeta `app/` del repo:

```bash
npm install          # solo la primera vez o cuando cambian dependencias
npx expo start       # muestra un código QR
```

Escaneas el QR con la cámara del iPhone y se abre en Expo Go. El teléfono y la computadora tienen que estar en la **misma red Wi-Fi**. Si no es posible, usa `npx expo start --tunnel`.

## Fase 8: build de desarrollo con EAS (pagado)

**EAS Build:** servicio de Expo que compila la app de iPhone en la nube. Reemplaza la Mac.

**Build de desarrollo:** tu propia versión de "Expo Go" que incluye el módulo de Bluetooth.

### Qué necesitas

| Qué | Costo | Cuándo tramitarlo |
|-----|-------|-------------------|
| Cuenta de Expo | Gratis | Cuando quieras |
| Apple Developer Program | USD 99/año | **2 semanas antes de la Fase 8**: la aprobación puede tardar, y en cuentas nuevas un iPhone recién registrado puede tardar en poder instalar builds |

### Pasos (te los guiaré cuando lleguemos)

1. `npm install -g eas-cli` y `eas login`.
2. `eas device:create`: abre un link en tu iPhone que lo registra para poder instalar tu app.
3. `eas build --profile development --platform ios`: EAS compila en la nube y te da un link para instalarla.
4. En el iPhone, activar **Ajustes → Privacidad y seguridad → Modo de desarrollador**.
5. `npx expo start --dev-client` y abrir la app instalada.

Cada iPhone que quiera instalar la app (por ejemplo, el segundo de la demo) se registra con el paso 2 antes de compilar.
