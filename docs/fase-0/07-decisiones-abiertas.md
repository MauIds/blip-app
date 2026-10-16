# Decisiones abiertas

**Estado (16/10/2026):** Fase 0 aprobada con todas las recomendaciones (D2 a D7, D9 a D11). Siguen pendientes **D1** y **D8**, que no tenían recomendación.

## Decisiones

| # | Decisión | Mi recomendación | Por qué |
|---|----------|------------------|---------|
| D1 | ¿Qué sistema operativo tiene tu computadora? | — | Para darte los comandos exactos |
| D2 | Criterios de las 11 insignias ([tabla](05-blip-misiones-insignias.md#colección-10-insignias--1-secreta)) | Aprobar como están | Cubren PINGs, variedad, privacidad, exploración y el secreto Pong |
| D3 | `FIRST CRACK`, `HALF THAWED` y `FULLY THAWED` premian completar 1 misión, la mitad y todas | Así | Es lo que sugiere el dibujo: el hexágono se va llenando |
| D4 | Tiempos de Blip: hambre a los 20 min y congelado a los 45 min sin actividad | Así, y 2/4 min para la demo en vivo | En un evento real, 45 min sin conocer a nadie es una señal clara |
| D5 | ¿Las misiones cuentan PINGs pendientes o solo confirmados? | El badge muestra progreso provisional; el oficial cuenta solo confirmados | Se ve el avance al instante sin romper la regla del `encounter_id` |
| D6 | ¿Se puede hacer PING más de una vez con la misma persona? | No: una vez por pareja por evento | La red muestra personas, no repeticiones |
| D7 | Pong en el badge: ¿contra la máquina o entre 2 badges? | Contra la máquina en el mismo badge | Es local y el más simple; no cambia nada en la app |
| D8 | ¿Qué es DD26? Nombre, fechas y tipo del evento | — | Para cargarlo como primer evento de prueba |
| D9 | Modelo de IA para misiones (Fase 7) | **Claude Opus 5.5** por calidad; **Claude Haiku 5.5** si prefieres ahorrar | Costo aproximado por persona: USD 0,016 con Opus 5.5 y USD 0,0004 con Haiku 5.5 |
| D10 | ¿Ya tienen el dominio `blipz.app`? | Comprarlo antes de grabar etiquetas NFC | Una etiqueta grabada con un dominio que no controlan no se puede corregir |
| D11 | ¿Cómo aplicamos cambios a Supabase en la Fase 4? | Tú corres `npx supabase db push` desde tu PC con el comando que te paso | No hay que dejar llaves de tu cuenta en el entorno en la nube |

## Imágenes pendientes

- La escena del evento ya está en [`referencias/escena-evento.jpg`](../referencias/escena-evento.jpg). Confirma el contrato: el badge que inicia muestra `PING!` y el que responde, `PONG!`.
- Falta la animación "PING!/PONG!" detallada; se agrega cuando exista.

## Decisiones que ya tomé (dime si no estás de acuerdo)

| Tema | Decisión |
|------|----------|
| Inicio de sesión | Código de 6 dígitos al correo, sin contraseña |
| Notificaciones | Solo locales (nuevo PING y misión completada); sin servidor de push |
| Edad | Se guarda el año de nacimiento, en una tabla que solo ve su dueño |
| ID del badge | Últimos 3 bytes de la MAC en hexadecimal (`7F3A2C`) |
| Reglas de misiones e insignias | Se calculan en la app a partir de los encuentros confirmados que da el backend. Rápido de construir; en un prototipo no importa que alguien experto pueda falsear su propio progreso |
| Hora del badge | La app se la envía en cada Sync; los PINGs anteriores usan la hora de sincronización |
| Pantalla OLED (SSD1309 o SSD1306) | Lo resuelve el firmware; la app no cambia |
| Expo Go hasta la Fase 7 | El Bluetooth real entra en la Fase 8, así que no pagas Apple antes de tiempo |
