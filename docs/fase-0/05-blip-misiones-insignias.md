# Blip, misiones e insignias

**Resumen:** Blip se alimenta de conexiones. Si haces PING y completas misiones está feliz; si te quedas quieto, primero le da hambre y después se congela. Las misiones de la demo son fijas y funcionan sin IA. Las insignias siguen la hoja de referencia.

## Blip

### Aspectos

| # | Nombre | Estado |
|---|--------|--------|
| 0 | `CLASSIC` (predeterminado) | Placeholder hasta recibir el sprite |
| 1 | `ASPECT 2` | Placeholder; nombre final a definir con tu socio |
| 2 | `ASPECT 3` | Placeholder; nombre final a definir con tu socio |

Se elige en la app y viaja al badge en el siguiente Sync (`set_blip`).

### Emociones

```text
            PING o misión                   sin actividad
 ┌──────────┐ ◀──────────── ┌────────┐ ───────────────▶ ┌──────────┐
 │  HAPPY   │               │ NORMAL │                  │  HUNGRY  │
 └────┬─────┘ ─────────────▶└────────┘                  └────┬─────┘
      ▲         pasan 10 min                    sigue sin     │
      │                                          actividad    ▼
      └─────────────── PING o misión ─────────────────── ┌──────────┐
                                                          │  FROZEN  │
                                                          └──────────┘
```

| Emoción | Cuándo |
|---------|--------|
| `NORMAL` | Estado inicial y el de reposo |
| `HAPPY` | Durante 10 min después de un PING o de completar una misión |
| `HUNGRY` | Tras **20 min** sin PING ni misiones |
| `FROZEN` | Tras **45 min** sin PING ni misiones |

- Cualquier PING o misión completada lo vuelve a `HAPPY`, incluso desde `FROZEN`.
- Los tiempos corren **solo con un evento activo**, para que Blip no se congele de noche.
- Los minutos son configurables por evento. Para la demo en vivo se pueden bajar a 2 y 4 minutos.
- En el simulador, cualquier emoción se puede forzar desde la pantalla de desarrollo.

### Sprites que necesita tu socio

| Qué | Cantidad |
|-----|----------|
| Tamaño | 48×48 px, 1 bit (solo blanco y negro), PNG |
| Combinaciones | 3 aspectos × 4 emociones × 2 cuadros de animación = **24 sprites** |
| Nombre de archivo | `blip-<aspecto>-<emocion>-<cuadro>.png`, ej. `blip-0-happy-1.png` |

La app los dibuja ampliados sin suavizar (pixel art nítido). El firmware los convierte a arreglos en C con un script que se agrega en la Fase 8.

## Misiones de la demo (fijas)

Cinco misiones, como en `MISSIONS 3/5` de la referencia. Títulos en inglés, todos de 24 caracteres o menos.

| # | Título (badge) | Caracteres | Qué cuenta | Meta |
|---|----------------|:----------:|------------|:----:|
| 1 | `First ping` | 10 | Cualquier PING | 1 |
| 2 | `Ping 3 people` | 13 | Cualquier PING | 3 |
| 3 | `Meet 2 devs` | 11 | PING con roles técnicos (CTO, Full Stack, Frontend, Backend, Mobile, Data/IA) | 2 |
| 4 | `Meet a founder` | 14 | PING con Founder/CEO | 1 |
| 5 | `Share a contact link` | 20 | Activar al menos un dato de contacto en "Datos a compartir" | 1 |

Las misiones 1 a 4 las puede contar el badge solo durante el evento. La 5 se mide en la app.

### Misiones de descongelamiento

Son la fila **Missions** de la hoja de insignias y premian el avance en las misiones del evento:

| Insignia | Se gana al… | Dibujo |
|----------|-------------|--------|
| `FIRST CRACK` | completar 1 misión | Hexágono vacío |
| `HALF THAWED` | completar la mitad (3 de 5) | Hexágono medio relleno |
| `FULLY THAWED` | completar todas (5 de 5) | Blip brillando |

### Misiones con IA (Fase 7)

- La IA elige **tipo, parámetro y meta** de una lista que la app sabe medir, y escribe el título.
- Tipos permitidos en la v1: `ping_count`, `ping_role`, `ping_interest` (PING con alguien que comparte un interés), `share_field` y `view_profiles`.
- Siempre se entregan 5 misiones. Si la respuesta no es válida, se usan las fijas.

## Colección: 10 insignias + 1 secreta

**Tu aprobación es necesaria aquí.** Todas cuentan solo PINGs **confirmados**.

| # | Insignia | Criterio propuesto | Rareza |
|---|----------|--------------------|--------|
| 1 | `FIRST PING` | Tu primer PING | Común |
| 2 | `ICEBREAKER` | Haces PING mientras Blip está congelado: rompes el hielo literalmente | Común |
| 3 | `NODE` | 5 PINGs en un mismo evento | Común |
| 4 | `HUB` | 15 PINGs en un mismo evento | **Rara** (brilla) |
| 5 | `BRIDGE` | PING con personas de 3 roles distintos en un mismo evento | Común |
| 6 | `OPEN CARD` | Compartes al menos un dato de contacto (GitHub, LinkedIn, CV o correo) | Común |
| 7 | `CURIOUS` | Abres 5 perfiles de tu red de PINGs | Común |
| 8 | `LOGBOOK` | Sincronizas tus PINGs con la app por primera vez | Común |
| 9 | `NEVER FROZEN` | Termina un evento sin que Blip se haya congelado | **Rara** (brilla) |
| 10 | `DD26` | Insignia del evento DD26: haces al menos 1 PING en ese evento | **Rara** (brilla) |
| ? | `PONG` (secreta) | Juegas tu primera partida de Pong en el badge | Secreta |

- Las "raras" son las que en la hoja de referencia tienen rayos alrededor.
- `DD26` es una **insignia de evento**: cada evento puede tener la suya, definida en `events.badge_code`.
- El badge puede mostrar `NEW BADGE! FIRST PING` al instante. El resto se confirma en el siguiente Sync.
