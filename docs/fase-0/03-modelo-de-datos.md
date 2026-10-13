# Modelo de datos (Supabase / Postgres)

**Resumen:** los datos privados (edad y contactos) viven en una tabla que solo ve su dueño. Lo que otros ven sale de una función que aplica los ajustes de "Datos a compartir". La edad no tiene interruptor para compartirse, así que no hay forma de exponerla.

## Mapa de tablas

```text
auth.users ─┬─ profiles ─────────── share_settings
            ├─ profile_private  (solo el dueño)
            ├─ event_members ──── events
            ├─ devices  (badge ↔ dueño, base del link NFC)
            ├─ encounter_reports ─▶ encounters (confirmados)
            ├─ user_missions ──── missions
            ├─ user_badges ────── badges
            ├─ blip_state
            └─ profile_views
```

## Tablas

### Personas

| Tabla | Columnas principales | Quién la lee |
|-------|----------------------|--------------|
| `profiles` | `id` (= usuario), `display_name`, `badge_name` (máx. 12, solo mayúsculas y números para el OLED), `role_title` (texto libre), `role_code`, `seniority`, `interests[]` | El dueño. Los demás, solo a través de `shared_profile()` |
| `profile_private` | `user_id`, `birth_year`, `email`, `github`, `linkedin`, `cv_url` | **Solo el dueño** |
| `share_settings` | `user_id`, `name` (sí), `role` (sí), `interests` (no), `github` (no), `linkedin` (no), `cv` (no), `email` (no) | Solo el dueño |

- Entre paréntesis está el valor por defecto: **solo nombre y puesto**.
- `share_settings` **no tiene columna de edad**. La regla fija se cumple por diseño, no por una validación que alguien pueda olvidar.
- Se guarda el **año de nacimiento** y no la edad, porque la edad cambia sola con el tiempo.
- `role_code` es un catálogo corto que también viaja en el PING: 1 Founder/CEO, 2 CTO, 3 Full Stack, 4 Frontend, 5 Backend, 6 Mobile, 7 Data/IA, 8 Producto (PM), 9 Diseño, 10 Estudiante, 11 Otro.
- `seniority`: estudiante, junior, semi-senior, senior o lead.

### Eventos

| Tabla | Columnas principales | Notas |
|-------|----------------------|-------|
| `events` | `id`, `code` (ej. `DD26`), `name`, `kind` (conferencia, charla, meetup), `starts_at`, `ends_at`, `badge_code` | `badge_code` es la insignia propia del evento, si la tiene |
| `event_members` | `event_id`, `user_id`, `is_active`, `joined_at` | Cada usuario tiene **un solo evento activo** a la vez |

### Badges físicos (`devices`)

| Columna | Tipo | Regla |
|---------|------|-------|
| `short_id` | texto, **clave primaria** | Exactamente 6 caracteres hexadecimales en mayúsculas, ej. `7F3A2C` |
| `mac` | texto, único | MAC completa del ESP32-S3 |
| `fw_version` | texto | Versión de firmware reportada en el último Sync |
| `owner_id` | usuario o vacío | Vacío = badge sin dueño |
| `paired_at`, `last_sync_at`, `battery` | | Se actualizan en cada Sync |

**Por qué así:**

- `short_id` son los últimos 3 bytes de la MAC. Es corto, fijo y es lo que va grabado en la etiqueta NFC: `https://blipz.app/b/7F3A2C`.
- **El link no se guarda en la base de datos**; se arma con el dominio, que vive en un solo lugar de configuración. Si cambia el dominio, se cambia la redirección y listo.
- Si cambia el dueño del badge, solo se actualiza `owner_id`. La etiqueta NFC nunca se vuelve a grabar.
- Dos badges con los mismos últimos 3 bytes de MAC es muy improbable. Si pasa, la clave primaria lo detecta al emparejar y se resuelve a mano.

### Encuentros (PINGs)

| Tabla | Columnas principales | Para qué |
|-------|----------------------|----------|
| `encounter_reports` | `encounter_id`, `reporter_device`, `peer_device`, `reporter_user`, `event_id`, `occurred_at`, `rssi` | Cada badge sube **su mitad**. Única por (`encounter_id`, `reporter_device`) |
| `encounters` | `encounter_id`, `device_a`, `device_b`, `user_a`, `user_b`, `confirmed_at` | Se crea **solo** cuando llegan las dos mitades y coinciden en sentido contrario (A dice que vio a B y B dice que vio a A) |

- Un reporte sin pareja queda **pendiente**. No cuenta para la red, las misiones oficiales ni las insignias.
- Solo el dueño de un badge puede subir reportes de ese badge.
- El evento sale de cada reporte: cada persona ve el encuentro dentro de su evento activo.

### Misiones, insignias y Blip

| Tabla | Columnas principales |
|-------|----------------------|
| `missions` | `id`, `code`, `title_en` (**máx. 24**, validado en la base de datos), `description_es`, `kind`, `param`, `target`, `source` (demo o ia), `event_kind`, `role_code` |
| `user_missions` | `user_id`, `event_id`, `mission_id`, `progress`, `completed_at` |
| `badges` | `code` (ej. `FIRST_PING`), `name_en`, `description_es`, `is_secret`, `sort` |
| `user_badges` | `user_id`, `badge_code`, `event_id`, `earned_at` |
| `blip_state` | `user_id`, `aspect` (0 a 2), `emotion`, `last_activity_at` |
| `profile_views` | `viewer_id`, `viewed_id`, `viewed_at` (para la insignia Curious) |

## Reglas de acceso (RLS)

| Dato | Dueño | Persona con PING confirmado en común | Cualquier otro |
|------|:-----:|:------------------------------------:|:--------------:|
| Perfil propio completo | ✅ | — | — |
| Edad (`birth_year`) | ✅ | ❌ nunca | ❌ nunca |
| Campos marcados para compartir | ✅ | ✅ | ❌ (✅ en la página pública NFC, Fase 9) |
| Campos no marcados | ✅ | ❌ | ❌ |
| Mis encuentros y reportes | ✅ | Solo el encuentro compartido | ❌ |

`shared_profile(user_id)` es la **única** puerta para ver a otra persona: revisa que haya un encuentro confirmado y devuelve solo los campos marcados. Las pruebas automáticas de la Fase 4 verifican que la edad nunca aparezca en ninguna respuesta.
