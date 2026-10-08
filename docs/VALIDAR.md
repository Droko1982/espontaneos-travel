# Pendientes por validar antes de publicar

Regla del brief: **no inventar datos**. Todo lo de esta lista lo confirma Carolina Toro (gerente)
antes de mover el dominio `espontaneostravel.com` al sitio nuevo. Cuando un punto quede resuelto,
márcalo con `[x]` y, si cambia un dato, edítalo en el archivo indicado.

## A. Acciones necesarias (sin esto, algo no funciona)

- [ ] **Fotos de Drive no son públicas.** Las 375 fotos de los tours están en una cuenta de Google
      Workspace y piden iniciar sesión: hoy los visitantes ven un recuadro de reemplazo. Opciones:
      (1) compartir la carpeta como "Cualquier persona con el enlace" y ejecutar
      `python tools/localize_images.py`, o (2) descargar las fotos en carpetas por tour
      (`fotos/finca/…`, `fotos/cocorasalento/…`) y ejecutar
      `python tools/localize_images.py --from-folder fotos`. Luego `node tools/build-static.js`.
- [ ] **Backend del portal (Firebase):** crear o reutilizar el proyecto, pegar la configuración en
      `js/firebase-config.js` y publicar `firestore.rules` (pasos en `docs/BACKEND.md`).
- [ ] **Tarifas netas 2026** para DMC: importarlas en el portal (Admin → Importar tarifas) con la
      plantilla `data/plantillas/tarifas-dmc-plantilla.csv`. **Nunca** subir el tarifario al repositorio
      (es público). Las condiciones de agencia están en `privado/` (ignorado por Git).
- [ ] **Google Sheets para clientes** (opcional si se usa Firebase): `tools/leads-apps-script.gs`.
- [ ] **Enlace de reseñas de Google**, **enlace de pago** del anticipo y **prefijos de tus enlaces de pago**
      (`payLinkPrefixes`) y números oficiales de WhatsApp (`officialPhones`): `js/plans.js` → `BIZ`.
- [ ] Confirmar que "Laura Gómez" y "James Parker" en `data/bookings.json` son reservas de demostración (ficticias).

## B. Datos del negocio

- [ ] WhatsApp: el sitio usa **318 720 0023**; la web anterior enlazaba a 318 **730** 0023.
- [ ] Correo de reservas: la web anterior decía `Consultor@espontaneostravel.com`; el sitio nuevo usa
      `info@espontaneostravel.com`.
- [ ] NIT de Espontáneos Travel SAS (falta en `privacidad.html`).
- [ ] Autor en metadatos: sigue "Dr. Mauricio Rodríguez Herrera · Espontáneos Travel". El brief
      pregunta si se deja o se cambia a "Espontáneos Travel SAS".
- [ ] Vigencia del portafolio 2026: el sitio la marca hasta el **31 de marzo de 2027**
      (`data/yenny.json` → `_meta.valida_hasta`).

## C. Portafolio y Yenny (`data/yenny.json`)

- [ ] **47 recomendaciones** marcadas "propuesta (VALIDAR)" (5 vienen del documento oficial de ET).
- [ ] Tours `rodizio` (Rodizio Gaucho Brasil) y `alimentacion` (Alimentación Consciente): no están en
      el portafolio ni en el tarifario 2026. **Ocultos** en el sitio hasta confirmar.
- [ ] Tour Compartido: duración 8 h (regreso 4:00 p.m.) según Carolina vs. 7 h (3:30 p.m.) en la base
      de conocimiento; traslado Montenegro $100.000 (portafolio) vs. $115.000 (base).
- [ ] % de anticipo (50 %), medios de pago y **política de cancelación** con plazos y porcentajes.
      La web anterior decía: "50 % para reservar y 50 % restante 48 horas antes de la fecha de viaje"
      y "reservas con mínimo 48 horas"; la base de conocimiento dice "el saldo y las fechas límite se
      informan en la cotización". El sitio nuevo usa la base de conocimiento.
- [ ] Exención de IVA para extranjeros: la web anterior citaba los sellos "PIP5, PTP5 o visa TP-11".
      El sitio nuevo lo dice de forma general; confirmar el texto vigente con el contador.
- [ ] Precio "desde" (PVP) por tour o por itinerario, si se quiere mostrar (`js/plans.js` → `priceFrom`).
- [ ] Los 7 **itinerarios sugeridos** (`js/plans.js`) los armó el equipo web con tours reales del
      portafolio: confirmar que se pueden ofrecer así.

## D. Sostenibilidad

- [ ] Permiso y foto de **David, Juan, Doralba y Mauricio** ("Nuestras historias"). Hoy se muestran
      solo con nombre e inicial, sin foto.
- [ ] Política de Sostenibilidad en PDF corregida y actualizada a 2026 (la de 2024 tiene un texto de
      plantilla en inglés). Cuando exista, agregar el botón "Descarga nuestra política".

## E. Traducciones (EN · FR · DE · PT)

- [ ] Revisar `data/yenny.i18n.json` (52 tours, árbol, planes, sostenibilidad) y `js/i18n-2026.js`.
      Puntos dudosos anotados por el traductor: "Valle de Cocora" vs. "Cocora Valley"; "almuerzo
      viajero"; "ranas chocolate"; panela; nombres que podrían ser marca ("La Caja Viajera del Café").
- [x] Alemán unificado en "Sie" (formal) en el sitio, Yenny, itinerarios y "qué llevar". Revisar estilo.

## F. Fotos de reemplazo (Wikimedia Commons)

- [ ] `laberinto.jpg` era un laberinto de **Inglaterra** (Longleat), no el Laberinto Mil Caminos: ya
      no se muestra. Falta foto real.
- [ ] Parque de los Arrieros usa una foto del pueblo de Quimbaya; Cata de cócteles, un mojito genérico.
      Reemplazar por fotos propias cuando estén disponibles (créditos en `terminos.html#creditos`).

## G. Portal de asesores y DMC (`portal.html`, `docs/BACKEND.md`)

- [ ] **Tarifa especial:** si una agencia tiene tarifa especial para el mismo tour, temporada, rango de
      pasajeros y moneda, ve solo la especial (no la general). ¿Es la regla deseada?
- [ ] El registro de agencias pide **NIT** (las extranjeras ponen su identificación tributaria).
- [ ] **Privacidad de reservas:** quien tenga el código de una reserva puede ver toda la reserva,
      incluidos montos de pago (así funciona el enlace del viajero). No escribir notas internas ahí.
- [ ] El QR se genera con `api.qrserver.com` (recibe el enlace del viajero). Alternativa: generar el QR
      en el navegador.
- [ ] Las reservas de ejemplo de `data/bookings.json` no se importan solas a Firestore.
- [ ] Antispam del chat: activar **Firebase App Check** cuando el portal esté en producción.
- [ ] Probar las reglas en Firebase real (importación de muchas tarifas a la vez: si falla, bajar
      `BATCH_SIZE` en `js/portal.js`).

## H. Mapas (`data/geo.json`, `docs/MAPAS.md`)

- [ ] **19 experiencias sin lugar documentado** (fincas, cabalgatas, parapente, bienestar, etc.): el
      portafolio dice "según la ubicación del hotel". Se muestran como zona de servicio de 20 km, sin
      ruta. Si hay fincas o puntos fijos, agregarlos y regenerar con `node tools/build-geo.js`.
- [ ] **Laberinto Mil Caminos** no está en OpenStreetMap: ubicado en la vereda Morelia Alta (Quimbaya)
      según una nota de prensa. Confirmar el punto exacto.
- [ ] **La Carbonera:** ubicada en la finca "La Carbonera" de OpenStreetMap (Cajamarca, Tolima).
- [ ] City tours de Cuyabro, Pereira y Manizales: falta el recorrido para dibujar la ruta.
- [ ] Hoteles en las reservas: si se agregan `lat`/`lon` del hotel, las distancias del conserje salen
      exactas (hoy se calculan desde el centro del municipio).
- [ ] Mapas con teselas de OpenStreetMap (uso normal permitido con atribución). Si el tráfico crece
      mucho, contratar un proveedor de teselas (p. ej. CARTO con licencia comercial o MapTiler).
- [ ] Agregar una política de seguridad de contenido (CSP) a `portal.html` y probar el portal completo
      en Firebase real antes de darle acceso a agencias (la revisión de seguridad quedó a medias:
      reservas públicas separadas, correo verificado y QR local ya están hechos).
