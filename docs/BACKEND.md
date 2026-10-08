# Backend y portal B2B — Espontáneos Travel

Guía para poner en marcha y operar el **portal privado** (`portal.html`) y la base de datos del negocio.
Está escrita para personas sin conocimientos de programación. No necesitas instalar nada en tu computador.

---

## 1. ¿Qué es y para qué sirve?

El portal es una página privada del sitio (`https://…/portal.html`) donde:

| Quién | Qué puede hacer |
|---|---|
| **Agencias aliadas (DMC)** | Pedir acceso, ver **tarifas netas** por año (vigencia) con la información de cada tour, ver las **condiciones para agencias**, exportar a CSV, **solicitar reservas**, ver sus solicitudes y reservas (con el enlace y QR del viajero) y guardar a sus clientes. Pantallas en **español e inglés**. |
| **Asesores** | Bandeja de **leads** del chatbot Yenny, **CRM de clientes**, **reservas** (genera el código, el enlace `viaje.html?code=…` y el **QR**), y responder **solicitudes** de agencias. |
| **Administración** | Todo lo anterior, más: aprobar agencias y usuarios, crear cuentas de asesores, administrar agencias, **importar tarifas** (CSV/JSON) y **condiciones** (JSON), y descargar **respaldos**. |

Todo se guarda en **Firebase** (de Google), en el **plan gratuito Spark**: Firebase Authentication (inicio de sesión) + Cloud Firestore (base de datos).
El sitio sigue publicado en GitHub Pages como hasta ahora.

> **Regla de oro de los datos:** el portal **no inventa** tarifas ni condiciones. Todo lo que ven las agencias sale de los archivos que la administración importa.

---

## 2. Puesta en marcha (una sola vez, ~30 minutos)

### Paso 1 — Proyecto de Firebase
1. Entra a <https://console.firebase.google.com> con la cuenta de Google de la empresa.
2. Si ya existe el proyecto que usaba la web anterior, ábrelo. Si no, pulsa **Agregar proyecto**, ponle un nombre (ej. `espontaneos-travel`) y puedes desactivar Google Analytics.
3. Verifica que el proyecto esté en el plan **Spark (gratis)** (abajo a la izquierda dice "Spark").

### Paso 2 — Conectar el sitio (copiar la configuración)
1. En la consola: engranaje ⚙ → **Configuración del proyecto** → pestaña **General**.
2. En **Tus apps**, si no hay una app web, pulsa el icono **`</>`** (Web), ponle un nombre (ej. `sitio`) y **no** marques Firebase Hosting.
3. Copia los valores del bloque `firebaseConfig` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).
4. Abre el archivo **`js/firebase-config.js`** del repositorio (en GitHub puedes editarlo con el lápiz ✏️) y pega cada valor entre las comillas. Guarda (commit).

> Estos valores **no son secretos**: solo identifican el proyecto y pueden estar en el repositorio público. La seguridad la dan las reglas (paso 5) y las contraseñas.

### Paso 3 — Activar el inicio de sesión con correo
1. Menú **Authentication** → **Comenzar** → pestaña **Método de inicio de sesión** → **Correo electrónico/contraseña** → **Habilitar** → Guardar. (No actives "vínculo por correo".)
2. Pestaña **Configuración** → **Dominios autorizados** → agrega los dominios donde se abre el portal:
   - `droko1982.github.io`
   - `espontaneostravel.com` y `www.espontaneostravel.com` (cuando el dominio esté conectado)
3. (Recomendado) Pestaña **Plantillas** → cambia el idioma de las plantillas a **español** y revisa el remitente. El portal pide los correos en el idioma de cada persona (español o inglés).

### Paso 4 — Crear la base de datos (Cloud Firestore)
1. Menú **Firestore Database** → **Crear base de datos**.
2. Si pregunta la edición, elige **Standard**. Deja el ID de la base como **(default)**.
3. Ubicación: elige una región cercana a Colombia, por ejemplo **`southamerica-east1` (São Paulo)** o **`us-east1` (Carolina del Sur)**. ⚠️ La región **no se puede cambiar** después.
4. Modo: **producción** (todo cerrado). En el siguiente paso pegamos las reglas.

### Paso 5 — Publicar las reglas de seguridad (copiar y pegar)
1. Abre el archivo **`firestore.rules`** del repositorio y copia **todo** su contenido.
2. En la consola: **Firestore Database** → pestaña **Reglas** → borra lo que haya → pega → **Publicar**.
3. Cada vez que el archivo `firestore.rules` cambie en el repositorio, repite este paso (las reglas del repositorio **no** se aplican solas).

**Índices.** El portal está hecho para funcionar con los índices automáticos. El archivo `firestore.indexes.json` trae un índice recomendado (tarifas por `vigencia` + `dmcId`). Si algún día aparece el mensaje *"Falta un índice en Firestore"*, el mismo mensaje trae un enlace: ábrelo con la sesión de la consola iniciada y pulsa **Crear índice** (tarda unos minutos). Para crearlo a mano: **Firestore → Índices → Compuesto → Crear**: colección `tarifas`, campos `vigencia` (Ascendente) y `dmcId` (Ascendente), alcance *Colección*.

### Paso 6 — Crear la primera cuenta de administración
1. Publica el sitio (con el `firebase-config.js` ya lleno) y abre `portal.html`.
2. Pulsa **Solicitar acceso** y llena el formulario con tus datos (en "agencia" puedes poner *Espontáneos Travel SAS*). Quedará "en revisión".
3. En la consola: **Firestore Database** → pestaña **Datos** → colección **`users`** → abre el documento cuyo campo `email` es el tuyo.
4. Edita dos campos (lápiz ✏️ junto a cada uno):
   - `rol` → `admin`
   - `estado` → `activo`
   (Deja `dmcId` en `null`.)
5. En el portal pulsa **Revisar de nuevo** (o recarga). Ya entras como administración.

A partir de aquí **todo se hace desde el portal**, sin volver a la consola.

### Paso 7 — Crear las cuentas del equipo
Pestaña **Asesores** → **Crear cuenta de asesor** (o **Usuarios** → **Crear cuenta**). Escribe nombre y correo; la persona recibe un correo de Firebase para **crear su propia contraseña** (que revise spam). Puedes elegir el rol *Asesor* o *Administrador*.

---

## 3. Operación diaria

### Aprobar una agencia (DMC)
1. La agencia abre `portal.html` → **Solicitar acceso** y llena: sus datos, nombre de la agencia, **NIT / Tax ID**, país, contacto y la **autorización de datos**.
2. Verás un aviso "Tienes N solicitudes de acceso pendientes" → pestaña **Usuarios** (filtra *Pendientes*).
3. Revisa los datos y pulsa **Aprobar agencia**: crea la agencia con esos datos (si no existe), vincula al usuario y activa el acceso. Si la agencia ya existía (por ejemplo, un segundo usuario de la misma agencia), elígela en **Agencia** antes de aprobar.
4. Avísale a la agencia por correo o WhatsApp (el portal no envía avisos automáticos de aprobación).

Para **quitar el acceso**: *Bloquear* al usuario, o *Desactivar* la agencia en **Agencias** (todos sus usuarios pierden el acceso de inmediato).

### Leads del chatbot (Yenny)
Pestaña **Leads**: filtra por fechas, etapa (*Visita por QR*, *Dejó sus datos*, *Pasó a WhatsApp*), origen y "solo sin contactar". Puedes **marcar contactado**, abrir el enlace que dejó el cliente y **crear el cliente** en el CRM (te pide confirmar la autorización de datos).

### Clientes (CRM)
Pestaña **Clientes**: crear, editar, filtrar, exportar y eliminar. **Al crear un cliente es obligatorio** confirmar que el viajero autorizó el tratamiento de sus datos y por qué medio (WhatsApp, formulario, correo…). La autorización queda guardada con fecha y versión y no se puede editar.

### Reservas y enlace del viajero
Pestaña **Reservas** → **Nueva reserva** (o desde un cliente o una solicitud de agencia). Al guardar, el portal:
- genera un **código aleatorio de 10 caracteres** (imposible de adivinar),
- muestra el enlace **`viaje.html?code=CÓDIGO`**, el **QR** para imprimir o enviar, y un botón para enviarlo por **WhatsApp**.

⚠️ **Quien tenga el código ve toda la reserva.** No escribas notas internas ni datos sensibles en la reserva (usa las notas del cliente). Para que el conserje (`viaje.html`) lea las reservas desde Firebase, ver la sección 7.

### Solicitudes de agencias
Pestaña **Solicitudes DMC**: cambia el estado (*Nueva → En proceso → Confirmada / No disponible*), escribe una **respuesta** (la agencia la ve en su portal) y usa **Crear reserva desde esta solicitud** para armar la reserva con los datos ya llenos.

---

## 4. Tarifas netas y condiciones

### Cargar las tarifas 2026
1. Pestaña **Tarifas** → descarga la **plantilla CSV** (`data/plantillas/tarifas-dmc-plantilla.csv`).
2. Llénala en Excel o Google Sheets (una fila por tarifa) y **borra las filas de EJEMPLO**:

| Columna | Qué poner | Ejemplo |
|---|---|---|
| `vigencia` | Año de la tarifa (puede ir vacío: se usa el año elegido al importar) | 2026 |
| `codigo` | Código del portafolio | ETHD001 |
| `tour_id` | Identificador web del tour (si lo dejas vacío y el código existe en el portafolio, se llena solo) | finca |
| `nombre` | Nombre del tour (vacío = se toma del portafolio) | Visita finca cafetera |
| `temporada` | Texto libre: alta, baja, festivos… (vacío = todas) | alta |
| `pax_desde` / `pax_hasta` | Rango de pasajeros (enteros, `pax_hasta` máx. 999) | 2 / 3 |
| `moneda` | 3 letras | COP |
| `tarifa_neta` | Número. Acepta `185000`, `185.000`, `45,50`… | 185000 |
| `dmc_id` | **Vacío** = tarifa general para todas las agencias. Con el identificador de una agencia = **tarifa especial** solo para ella | viajes-andinos |
| `notas` | Texto que verá la agencia (máx. 500) | Incluye almuerzo |

3. Guarda como **CSV UTF-8** (en Excel: *Guardar como → CSV UTF-8 (delimitado por comas)*). El portal también acepta punto y coma (`;`) y archivos JSON con las mismas columnas.
4. En el portal: elige la **vigencia**, carga el archivo y revisa la **vista previa** (que los miles y decimales se lean bien). Si hay errores, el portal dice en qué línea y **no importa nada** hasta corregirlos.
5. Pulsa **Importar tarifas**.

- Importar otra vez **actualiza** las tarifas iguales (mismo tour, temporada, pasajeros, moneda y agencia); no las duplica.
- La casilla **Reemplazar** borra las tarifas de esa vigencia (de la general y/o de las agencias que vienen en el archivo) que **ya no estén** en el archivo.
- Si una agencia tiene tarifa especial para el mismo tour, temporada, pasajeros y moneda, **esa agencia ve solo la especial**.
- En la misma pestaña puedes consultar lo cargado y **exportarlo** en el formato de importación.

### Cargar las condiciones para agencias
Pestaña **Condiciones** → carga `privado/condiciones-agencia-2026.json` (formato `{ "vigencia": 2026, "condiciones": { "tour_id": { "codigo", "nombre", "notas_agencia": [ … ] } } }`) → revisa → **Importar condiciones**. Las agencias las ven dentro de cada tour.

### Año nuevo (2027)
1. Prepara el CSV de tarifas con `vigencia` = **2027** e impórtalo eligiendo **2027**. Las de 2026 se conservan.
2. Importa `privado/condiciones-agencia-2027.json` (con `"vigencia": 2027`).
3. Las agencias ven un selector de **Vigencia** que abre por defecto el año más reciente con tarifas.
4. Cuando el equipo actualice el portafolio público (`data/yenny.json` con `vigencia` 2027), la duración, horarios e "incluye" que ven las agencias saldrán del portafolio nuevo.

---

## 5. Costos y límites del plan gratuito (Spark)

El plan Spark **no cobra**: si se alcanza un límite, ese servicio se detiene hasta el día siguiente (las cuotas diarias se reinician a la medianoche, hora del Pacífico de EE. UU.).

| Recurso (Cloud Firestore) | Límite gratis |
|---|---|
| Datos guardados | 1 GiB |
| Lecturas de documentos | 50.000 por día |
| Escrituras | 20.000 por día |
| Borrados | 20.000 por día |
| Transferencia de salida | 10 GiB por mes |

Referencias para este portal:
- Cada vez que una agencia abre sus tarifas se lee **un documento por tarifa** de ese año (ej. 300 tarifas = ~300 lecturas). Con 50.000 lecturas diarias alcanza para muchas consultas al día.
- Cada lead del chatbot es **1 escritura**. Importar 1.000 tarifas son 1.000 escrituras.
- Las reglas de seguridad leen el perfil del usuario en cada consulta (cuenta como lectura).
- El inicio de sesión con correo y contraseña no tiene costo en Spark. Firebase limita la cantidad de correos automáticos (verificación y contraseña) por día; para este uso es suficiente.

Puedes ver el consumo en **Firestore → Uso**. Si algún día se queda corto, se puede pasar al plan Blaze (pago por uso, con alertas de presupuesto).

---

## 6. Respaldos

El plan gratuito no incluye copias automáticas. Por eso:
- Pestaña **Respaldo** → elige la colección → **Descargar CSV** o **JSON**, o **Todo en un JSON**.
- Hazlo **al menos una vez al mes** y guarda los archivos en una carpeta **privada** (Google Drive de la empresa o tu computador). **Nunca** en el repositorio.
- Las tarifas se pueden restaurar importando su CSV de nuevo (la exportación de la pestaña Tarifas usa el formato de importación).

---

## 7. Para desarrolladores: `js/backend.js` (páginas públicas, sin inicio de sesión)

```html
<script type="module" src="js/backend.js"></script>
```

Expone `window.EspoBackend` y luego lanza el evento `espo:backend`:

| Método | Devuelve | Qué hace |
|---|---|---|
| `enabled` | `boolean` | `true` si `js/firebase-config.js` tiene `apiKey`. |
| `saveLead(data)` | `Promise<boolean>` | Crea un documento en `leads` (solo crear). Recorta textos a los límites de las reglas. `data.stage` debe ser `qr_visita`, `resumen` o `whatsapp`. Campos: `leadId, plan, tour, name, date, party, hotel, access, diet, notes, kit, src, lang, link, page`. Nunca lanza error: devuelve `false` si no se pudo. |
| `getBooking(code)` | `Promise<objeto \| null>` | Lee `reservas/{CÓDIGO}` (mayúsculas). Devuelve la reserva con el mismo formato de `data/bookings.json` (fechas como texto ISO, `payLink` tomado de `pago.enlace` si hace falta, sin campos internos) o `null`. |

Si Firebase no está configurado, existe la misma API: `saveLead` → `false`, `getBooking` → `null`. El SDK de Firebase solo se descarga la primera vez que se llama a un método.

Los scripts clásicos (no módulos) corren **antes** que los módulos, así que deben esperar:

```js
function conBackend(cb) {
  if (window.EspoBackend) cb(window.EspoBackend);
  else window.addEventListener("espo:backend", function () { cb(window.EspoBackend); }, { once: true });
}
// Ejemplos de integración (archivos del sitio público):
// js/plans.js → dentro de sendLead(data): conBackend(function (B) { B.saveLead(data); });
// js/concierge.js → si el código no está en data/bookings.json:
//   conBackend(function (B) { B.getBooking(code).then(function (b) { if (b) { booking = b; } renderAll(); }); });
```

Los límites de texto de `saveLead` (en `js/backend.js`) deben coincidir con los de `match /leads` en `firestore.rules`.

---

## 8. Modelo de datos (colecciones)

Todas las fechas `creado` / `actualizado` las pone el servidor. Los años (`vigencia`) son números.

**`users/{uid}`** — cuentas del portal
`email, nombre, rol ('admin'|'asesor'|'dmc'), dmcId (solo rol dmc), estado ('pendiente'|'activo'|'bloqueado'), whatsapp, idiomas[], solicitud{agencia, nit, pais, ciudad, contacto, telefono, web, mensaje, aceptaDatos, versionPolitica, idioma}, creado, actualizado`.
El auto-registro solo crea `rol: 'dmc'` + `estado: 'pendiente'` + `dmcId: null`. Solo administración cambia `rol`, `estado` o `dmcId`; cada persona edita su `nombre`, `whatsapp` e `idiomas`.

**`dmcs/{dmcId}`** — agencias (el ID es el `dmc_id` del CSV, ej. `viajes-andinos`)
`nombre, nit, pais, ciudad, contacto, email, telefono, notas, activo, creado, actualizado`.

**`tarifas/{id}`** — tarifas netas
`vigencia, codigo, tour_id, nombre, temporada, pax_desde, pax_hasta, moneda, tarifa_neta, dmcId (null = general; 'x' = especial de la agencia x), notas, actualizado`.
El ID es `vigencia_agencia_tour_temporada_pax_moneda` (por eso reimportar actualiza en vez de duplicar). Las agencias leen con dos consultas: `dmcId == null` y `dmcId == suAgencia`.

**`condiciones/{vigencia}_{tour_id}`** — `vigencia, tour_id, codigo, nombre, notas_agencia[], actualizado`.

**`clientes/{id}`** — CRM
`nombre, email, telefono, pais, idioma, origen ('web'|'qr'|'dmc'|'referido'|'whatsapp'), dmcId, asesorId, consentimiento{habeasData: true, fecha, version, medio, registradoPor}, notas, etiquetas[], creadoPor, creado, actualizado`.
Staff: lee y escribe todo. Agencia: crea, lee y edita solo los de su `dmcId` (no borra).

**`reservas/{codigo}`** — compatible con `data/bookings.json`
`code, lang, name, party, status, region, host{name, phone}, driver{name, phone}, guide{name, langs[]}, hotel{name, area, maps}, prefs{accessible, babySeat, diet}, itinerary[{date, time, tourId, title, maps}], phone, payLink` + `clienteId, dmcId, asesorId, solicitudId, estado ('borrador'|'pendiente'|'confirmada'|'en_curso'|'finalizada'|'cancelada'), pago{anticipo, saldo, moneda, enlace}, creadoPor, creado, actualizado`.
Lectura pública **solo por código exacto**; listar está prohibido salvo staff o la agencia dueña.

**`solicitudes/{id}`** — solicitudes de reserva de agencias
`dmcId, creadoPor, creadoPorEmail, clienteId, viajero, tours[{tour_id, codigo, nombre}], fecha_inicio, fecha_fin, pax, hotel, idioma, necesidades, notas, estado ('nueva'|'en_proceso'|'confirmada'|'rechazada'|'cancelada'), respuesta, asesorId, reservaId, creado, actualizado`.

**`leads/{id}`** — contactos del chatbot
`stage ('qr_visita'|'resumen'|'whatsapp'), leadId, plan, tour, name, date, party, hotel, access, diet, notes, kit, src, lang, link, page, creado` + (staff) `contactado, contactadoPor, contactadoEn, notaAsesor, clienteId`.
El público solo puede **crear** (lista cerrada de campos y tamaños).

**`config/vigencias`** — `{ lista: [2026, 2027…] }` años con tarifas cargadas (lo actualiza la importación).

---

## 9. Seguridad

- **El repositorio es público.** Nunca subas: tarifarios, la carpeta `privado/`, respaldos CSV/JSON, ni datos de clientes. `.gitignore` ya excluye `privado/` y archivos `*.tarifario.*`; aun así, revisa antes de cada commit.
- `js/firebase-config.js` **sí** puede estar en el repositorio (no es una contraseña).
- Las **reglas** (`firestore.rules`) son las que protegen los datos: mínimo privilegio, listas cerradas de campos, tamaños máximos, y nadie puede subirse de rol. Publícalas siempre que cambien.
- Una agencia solo ve: tarifas generales + las especiales de **su** agencia, condiciones, y sus propios clientes, solicitudes y reservas.
- **Reservas:** cualquiera con el código ve la reserva completa (así funciona el conserje). Los códigos nuevos tienen 10 caracteres aleatorios; no compartas listas de códigos.
- El QR se dibuja con el servicio externo `api.qrserver.com` (recibe el enlace del viajero).
- Usa contraseñas largas y únicas; bloquea de inmediato a quien salga del equipo o de una agencia; revisa la pestaña **Usuarios** cada mes.
- Opcional (más adelante): **App Check** (reCAPTCHA) para frenar spam en `leads`, y restringir la API key por dominio en Google Cloud Console → Credenciales.

---

## 10. Habeas data (Ley 1581 de 2012)

- **Autorización:** el portal exige la casilla de autorización al **solicitar acceso** (datos de la persona de la agencia) y al **crear un cliente**. Se guarda con fecha, versión del texto (`CONSENT_VERSION` en `js/portal.js`) y medio por el que se obtuvo.
- **Política de tratamiento:** el portal enlaza `privacidad.html` junto a cada autorización (constante `PRIVACY_URL` al inicio de `js/portal.js`). Verifica que esa política mencione el portal de agencias, el CRM y el uso de Firebase/Google Cloud. Si cambias la política, sube `CONSENT_VERSION`.
- **Derechos del titular** (conocer, actualizar, rectificar, suprimir): edita el cliente en **Clientes**; para **suprimir** pulsa *Eliminar* (y, si aplica, borra sus leads desde la consola o pídeselo a administración). Si el titular **revoca** la autorización, elimina el cliente.
- **Minimización:** no guardes datos de salud ni otros datos sensibles. En las reservas la accesibilidad se registra solo como "sí/no"; en solicitudes y notas pide solo lo necesario para operar el tour (sin diagnósticos) y coordina el detalle por WhatsApp.
- **Dónde están los datos:** en los servidores de Google Cloud de la región elegida en el paso 4 (fuera de Colombia). Menciónalo en tu política (transferencia/transmisión internacional) y, si aplica a la empresa, revisa la inscripción de las bases de datos en el **Registro Nacional de Bases de Datos (SIC)**. Ante dudas, consulta con tu asesor legal.
- Los **respaldos** contienen datos personales: guárdalos con acceso restringido.

---

## 11. Problemas frecuentes

| Mensaje / síntoma | Solución |
|---|---|
| "Falta conectar Firebase" | Falta llenar `js/firebase-config.js` (paso 2) o no se ha publicado el sitio. |
| "No tienes permiso para esta acción" | Reglas sin publicar (paso 5), usuario no activo, agencia inactiva o sin agencia asignada. |
| "Este dominio no está autorizado" | Agrega el dominio en Authentication → Configuración → Dominios autorizados. |
| "El acceso con correo y contraseña no está activado" | Paso 3. |
| "Falta un índice en Firestore" | Abre el enlace del mensaje y pulsa **Crear índice** (ver paso 5). |
| No llega el correo de contraseña | Revisar spam; verificar que el correo esté bien escrito. |
| Una importación grande falla a mitad | Lo ya guardado queda guardado; corrige y vuelve a importar el mismo archivo (no duplica). Si se repite, baja `BATCH_SIZE` en `js/portal.js` (ej. 200). |
| "Se alcanzó el límite diario" | Cuota gratuita agotada; se reinicia al día siguiente (sección 5). |

---

## 12. Opcional: publicar reglas e índices con la línea de comandos

Solo si alguien del equipo usa la terminal (no es necesario):

```bash
npm install -g firebase-tools
firebase login
firebase use --add            # elige el proyecto
firebase deploy --only firestore:rules,firestore:indexes
```

`firebase.json` ya apunta a `firestore.rules` y `firestore.indexes.json`.

---

## Archivos

| Archivo | Para qué |
|---|---|
| `portal.html`, `js/portal.js`, `css/portal.css` | El portal (no indexado por buscadores). |
| `js/firebase-config.js` | Configuración del proyecto de Firebase. |
| `js/backend.js` | Conexión mínima para páginas públicas (leads y reservas por código). |
| `firestore.rules`, `firestore.indexes.json`, `firebase.json` | Seguridad, índices y configuración de la CLI. |
| `data/plantillas/tarifas-dmc-plantilla.csv` | Plantilla de importación de tarifas (solo ejemplos falsos). |
