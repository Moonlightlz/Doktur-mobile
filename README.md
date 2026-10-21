# Doktur — app móvil (Android e iOS)

App de pacientes de Doktur con Expo SDK 57 (React Native 0.86), sobre la misma API (`Doktur-back`)
y los mismos tokens de diseño que la web (`Doktur-front`).

> **Demostración con datos sintéticos.** Una franja visible en todas las pantallas lo recuerda.
> No publicar en tiendas ni usar con datos reales antes de la puerta G3 del comité
> (`Doktur-back/docs/comite/`). El identificador `pe.doktur.demo` es provisional.

## Qué hace

- Registro con código por SMS, ingreso con celular y contraseña.
- Signos de alarma → números de emergencia y pedido de llamada de la IPRESS (plazo de 15 min).
- Reserva (audio primero), detalle de la cita, cancelación, indicaciones del profesional al cierre.
- Sala de consulta con LiveKit: solo audio al entrar, cámara opcional, sin grabación.
  **No es cifrado de extremo a extremo** (pasa por el servidor de medios) y la app no lo afirma.
- Consentimientos, documento de identidad (N1), apariencia clara/oscura, cerrar sesión en todos los equipos.
- **Mi región:** enfermedades frecuentes, ocasionales y raras por región (cifras del CDC-Minsa), clima
  esperado y si hay SAMU. La región se guarda solo en el teléfono (no se envía a la API).
- **Qué puede pasar con El Niño:** escenarios por periodo; cada afirmación indica si es un hecho, un
  pronóstico oficial, una estimación o una posibilidad, con su fuente. No es un pronóstico oficial.
- **Hospitales y centros de salud** de cada región (Renipress, Susalud): dirección, horario, botón para
  llamar y "Cómo llegar" (abre la app de mapas del teléfono). Se entra desde "Mi región".
- Región, escenarios y establecimientos también se abren sin cuenta, desde "Ingresar". Contenido en borrador hasta
  la validación médica (H-054).

Pestañas: Inicio · Mi región · Alarma · Citas · Cuenta. Reservar se abre desde Inicio y Citas.
Íconos: Lucide (los mismos de la web), importados uno por uno para no cargar toda la librería.

El personal de salud trabaja en el **portal web** (con segundo factor). Si un profesional ingresa
aquí, la app se lo indica y no muestra pantallas de trabajo.

## Seguridad

- Sesión móvil: token opaco enviado como `Bearer`, guardado solo en el almacenamiento seguro del
  sistema (Keychain/Keystore) con `WHEN_UNLOCKED_THIS_DEVICE_ONLY`; sin cookies; `allowBackup: false`.
- Nada secreto va dentro de la app: la única configuración es `EXPO_PUBLIC_DOKTUR_API_URL`.
- Sin analítica ni SDK de terceros; permisos de ubicación y contactos bloqueados.
- `npm run auditoria`: falla ante cualquier aviso de seguridad que no tenga una excepción
  justificada y vigente (ver `scripts/auditoria.mjs`). Hoy hay 4 excepciones (sin versión
  corregida publicada, solo en herramientas). `scripts/paquetes-en-bundle.mjs` comprueba con el
  mapa de fuentes que esos paquetes **no** entran en la app.
- `parches/decode-uri-component`: copia en CommonJS de la versión corregida 0.5.0 (MIT), porque
  `expo-router` usa `query-string@7`, que no puede cargar la versión corregida (solo ESM).

## Colores

Todos los colores salen de `@doktur/tokens`. Para cambiar la paleta:

1. Edita `Doktur-front/packages/tokens/tokens.json` y ejecuta `npm run tokens` allí (valida contraste WCAG).
2. Aquí: `npm run sincronizar` (copia tokens, números de emergencia, salud por región, escenarios de El Niño y tipos de la API).

`npm run check` falla si algún componente usa un color literal.

## Requisitos

- Node.js 24 (`.nvmrc`).
- `Doktur-front` y `Doktur-back` en carpetas hermanas (para `npm run sincronizar`).
- Para ejecutar en un teléfono o emulador: Android Studio (Android) o Xcode en macOS (iOS).
  La app usa módulos nativos (WebRTC), así que **no funciona en Expo Go**: se usa un *development build*.

## Comandos

```bash
npm ci
npm run sincronizar    # tokens, emergencias, regiones, escenarios y tipos de la API desde los otros repositorios
npm run verificar      # tipos, colores, pruebas, auditoría y bundles de Android e iOS
npm run android        # compila e instala el development build (requiere Android SDK)
npm start              # servidor de desarrollo para el development build
```

La API local debe ser accesible desde el teléfono: en el emulador de Android `http://10.0.2.2:3180`;
en un teléfono físico, la IP de la computadora (`EXPO_PUBLIC_DOKTUR_API_URL`, ver `.env.example`).

## Qué se verificó y qué no

| Verificado | Cómo |
|---|---|
| Tipos y contrato con la API | `tsc` con los tipos generados desde `openapi.json` |
| Lógica del cliente de API, sesión segura, fechas en hora de Perú, tema | `jest` (11 pruebas) |
| La app empaqueta para Android e iOS (Hermes) | `expo export` |
| Paquetes con avisos aceptados fuera de la app | `scripts/paquetes-en-bundle.mjs` |

**No verificado todavía:** ejecución en un dispositivo o emulador (no hay Android SDK ni Xcode en
este equipo) y videollamada real (falta un servidor LiveKit). Antes del piloto: pruebas en
teléfonos Android de gama baja, con TalkBack/VoiceOver, y con conexión 3G simulada.

## Versiones

Exactas y con al menos dos semanas de publicadas (`npm install --before=AAAA-MM-DD`). Se eligió
SDK 57 porque SDK 58 estaba en beta en la fecha de corte. `npx expo install --check` sugiere
parches de SDK 57 publicados entre el 12 y el 15 de octubre de 2026: aplicarlos desde el 2026-10-29.
