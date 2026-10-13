# Contrato de comunicación (versión de protocolo 1)

**Resumen:** los badges se encuentran entre sí por ESP-NOW, sin internet. La app y el badge hablan por BLE solo en Modo Sync, con mensajes JSON cortos. Este documento es el acuerdo entre la app y el firmware: si los dos lo cumplen, se entienden.

**ESP-NOW:** protocolo de Espressif para que dos ESP32 se manden mensajes directos, sin router.
**BLE (Bluetooth Low Energy):** Bluetooth de bajo consumo; el que usan los relojes y sensores.

## Dos modos que no se mezclan

| | Modo Evento (normal) | Modo Sync |
|---|---|---|
| ESP-NOW | Encendido: busca badges y hace PING | Pausado |
| BLE | Apagado | Encendido mientras dura la sincronización |
| Cómo se entra | Al prender el badge | Desde el menú o manteniendo presionado el botón de red 3 segundos |
| Cómo se sale | — | Solo: al terminar la sincronización o tras 90 s sin conexión |

## Parte 1: badge ↔ badge (ESP-NOW)

Solo lo implementa el firmware. Se documenta aquí porque de él sale el `encounter_id` que la app y el backend validan.

### Paquetes

Todos empiezan con `"BZ"` (2 bytes), versión `1` (1 byte) y tipo (1 byte). Canal Wi-Fi fijo: 1.

| Tipo | Envío | Contenido después del encabezado |
|------|-------|----------------------------------|
| `0x01 BEACON` | Difusión cada 2 s (± 0,5 s al azar) | `short_id` (3 bytes), `role_code` (1 byte) |
| `0x02 PING` | Directo al otro badge | `nonce` (8 bytes al azar), `role_code` (1 byte) |
| `0x03 PONG` | Directo, en respuesta | el mismo `nonce` (8 bytes), `role_code` (1 byte) |

### Cómo ocurre un PING

```text
Badge A (short_id menor)                 Badge B
   │ ◀────────── BEACON ──────────────────── │   B está cerca
   │ ─── PING (nonce = 9C41…) ─────────────▶ │   B guarda el encuentro
   │ ◀── PONG (nonce = 9C41…) ────────────── │
   │  A guarda el encuentro                  │
   ▼  animación "PING!"                      ▼  animación "PONG!"
```

1. **Cerca** significa señal (RSSI) de al menos −60 dBm en 2 BEACON seguidos dentro de 5 s. El número se calibra con los badges reales en la Fase 8.
2. **Inicia el que tiene el `short_id` menor.** Así nunca empiezan los dos a la vez.
3. **Una vez por pareja por evento.** El badge recuerda con quién ya hizo PING en el evento activo.
4. Si no llega el PONG, A reintenta hasta 3 veces cada 300 ms con **el mismo nonce**. B responde siempre igual, sin duplicar.
5. **`encounter_id` = el nonce en 16 caracteres hexadecimales en mayúsculas**, por ejemplo `9C41A07B3E2D5F10`. Los dos badges guardan el mismo.
6. Si solo uno de los dos guardó el encuentro (por ejemplo, se perdió el PONG), nunca se confirma. Es el comportamiento esperado.
7. El primer PING de la vida del badge desbloquea **Pong** en el badge (el secreto PING/PONG).

### Registro que guarda cada badge

| Campo | Ejemplo | Nota |
|-------|---------|------|
| `eid` | `9C41A07B3E2D5F10` | `encounter_id` |
| `peer` | `A1B2C3` | `short_id` del otro badge |
| `peer_role` | `3` | `role_code` del otro |
| `ts` | `1792512000` | Hora real si el badge ya la recibió de la app; si no, `0` |
| `up` | `5321` | Segundos desde que se prendió el badge |
| `rssi` | `-54` | Fuerza de la señal |
| `ev` | `DD26` | Evento activo del badge |
| `init` | `true` | Si este badge inició el PING |

Capacidad mínima: 200 registros pendientes en la memoria del badge.

## Parte 2: app ↔ badge (BLE)

### Identificación

- El badge en Modo Sync se anuncia con el nombre **`BLIP-7F3A2C`** (prefijo + `short_id`).
- **iOS no deja ver la MAC de otros dispositivos BLE.** Por eso el badge envía su ID y su MAC dentro del mensaje `info`, no en el anuncio.

### Servicio GATT

**GATT:** la forma estándar en que un dispositivo BLE expone sus datos, organizados en "servicios" y "características".

| Elemento | UUID | Propiedades |
|----------|------|-------------|
| Servicio Blipz | `8CD0EBC4-599D-4A63-B78B-FD1608B094CB` | — |
| `RX` (app → badge) | `7D8EC315-34AC-4C35-A370-FEEEDE39D9AA` | Write |
| `TX` (badge → app) | `46F2CE29-94B8-472E-9D3F-342F7FC098A0` | Notify |

### Formato de mensajes

- Cada mensaje es **JSON en UTF-8 terminado en `\n`**, de máximo 4 KB.
- Si no cabe en un paquete BLE, se parte en trozos del tamaño permitido. El que recibe junta trozos hasta ver `\n`.
- Toda petición lleva `t` (tipo) e `id` (número de petición). La respuesta lleva `re` con el mismo `id`.

### Mensajes

| Dirección | `t` | Contenido | Respuesta |
|-----------|-----|-----------|-----------|
| App → badge | `hello` | `proto`, `time` (hora actual, segundos Unix) | `info` |
| Badge → app | `info` | `proto`, `id`, `mac`, `fw`, `battery` (0–100), `pending`, `pong` (`unlocked`, `played`, `best`) | — |
| App → badge | `get_encounters` | `limit` (máx. 10), `cursor` | `encounters` |
| Badge → app | `encounters` | `items` (registros de arriba), `next` (cursor o `null`) | — |
| App → badge | `ack_encounters` | `eids` (lista de `encounter_id`) | `ok` con `removed` |
| App → badge | `set_profile` | `badge_name` (máx. 12), `role_code`, `event_code`, `vibration` | `ok` |
| App → badge | `set_missions` | `missions` (`code`, `title` ≤ 24, `kind`, `param`, `progress`, `target`), `done`, `total`, `badges` (códigos ganados), `collection_total` | `ok` |
| App → badge | `set_blip` | `aspect` (0–2), `emotion`, `last_activity`, `hungry_after_min`, `frozen_after_min` | `ok` |
| App → badge | `end_sync` | — | `ok`; luego el badge apaga BLE |
| Badge → app | `error` | `code`, `msg` | — |

Ejemplo:

```json
{"t":"hello","id":1,"proto":1,"time":1792512000}
{"t":"info","re":1,"proto":1,"id":"7F3A2C","mac":"34:85:18:7F:3A:2C","fw":"0.1.0","battery":87,"pending":3,"pong":{"unlocked":true,"played":2,"best":7}}
```

### Una sincronización completa

1. La persona activa Modo Sync en el badge y toca **Sincronizar** en la app.
2. `hello` → `info`: la app sabe qué badge es, su batería y cuántos PINGs pendientes tiene.
3. `get_encounters` hasta que `next` sea `null`.
4. La app **guarda los encuentros en el teléfono** y recién entonces manda `ack_encounters`. Si el teléfono se apaga a mitad de camino, no se pierde nada.
5. La app sube los encuentros al backend cuando haya internet (puede ser después).
6. `set_profile`, `set_missions` y `set_blip` con el estado actualizado.
7. `end_sync`: el badge apaga BLE y vuelve a Modo Evento.

### Progreso de misiones dentro del badge

Durante el evento el badge no tiene internet, así que cuenta por su cuenta las misiones que puede medir solo:

| `kind` | `param` | El badge suma 1 cuando… |
|--------|---------|-------------------------|
| `ping_count` | — | hace cualquier PING |
| `ping_role` | lista de `role_code` | hace PING con alguien de esos roles |
| otros | — | no cuenta; muestra el progreso de la última sincronización |

En el siguiente Sync, la app reemplaza ese progreso por el oficial (solo PINGs confirmados).

## Pantallas del badge

Son las que replica la pantalla **Mi badge** de la app. OLED de 128×64, textos en inglés y en mayúsculas.

| Pantalla | Botón | Muestra |
|----------|-------|---------|
| Blip | Blip | La criatura con su aspecto y emoción, ícono de red y batería |
| Misiones | Medalla | `MISSIONS 3/5` con 5 casillas, misión activa con ícono, título, barra y `2/3`, y `COLLECTION 4/10` con 10 hexágonos (ganadas, vacías y `?`) |
| Red | Red | `PINGS` del evento y los roles de los últimos 3 contactos |
| Aviso PING | — | Animación conjunta: `PING!` en quien inicia y `PONG!` en quien responde |
| Aviso insignia | — | `NEW BADGE!`, el hexágono, el nombre y `n/10` |
| Sync | Pulsación larga | `SYNC MODE`, ícono Bluetooth y cuenta regresiva |

Fuente pixel de 5 px de ancho: los 24 caracteres de un título ocupan 120 de los 128 px.
