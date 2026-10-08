# Mapas, rutas y distancias (EspoMaps)

Mapas interactivos para el sitio (vista general y ficha de cada experiencia) y para el conserje del viajero (`viaje.html`). Los datos geográficos se **precalculan** en `data/geo.json`. En tiempo de ejecución el sitio no consulta ningún servicio de rutas.

| Archivo | Para qué sirve |
|---|---|
| `js/maps.js` | Módulo clásico que expone `window.EspoMaps`. Carga Leaflet 1.9.4 (unpkg, con SRI) solo cuando un mapa entra en pantalla. |
| `css/maps.css` | Estilos del mapa, los marcadores, los popups, las insignias, la leyenda, la lista de respaldo y el modo oscuro. Usa las variables del sitio. |
| `data/geo.json` | Hubs, lugar de cada tour, pueblos, matriz de distancias y rutas (polilíneas simplificadas). Pesa unos 107 KB. |
| `tools/build-geo.js` | Script reproducible que geocodifica, calcula las rutas y escribe `data/geo.json`. |
| `tools/.cache/geo-cache.json` | Caché de las respuestas de Nominatim, Wikidata y OSRM. Con ella, `--offline` reconstruye el archivo sin conexión. |

---

## 1. Qué datos son reales y cuáles aproximados

**Fuentes (no se inventó ninguna coordenada ni distancia):**

- **Coordenadas:** OpenStreetMap Nominatim. Cada punto guarda su `fuente` (`osm_type/osm_id` y nombre).
- **Cabeceras municipales:** se verifican contra Wikidata (P625). Si Nominatim devuelve el centroide del municipio y no el del pueblo (diferencia > 1,5 km), se usa la coordenada de Wikidata y así queda anotado.
- **Rutas, distancias y tiempos:** OSRM (`router.project-osrm.org`, perfil *driving*). Los tiempos son **sin tráfico**; en vías de montaña y en Jeep pueden ser mayores.
- **Laberinto Mil Caminos:** no aparece en OSM. Se ubicó en la vereda Morelia Alta (Quimbaya) según la prensa (El País) y quedó marcado como `validar`.

### Clasificación de los 52 tours de `data/jenny.json`

| Tipo | Qué significa | Tours |
|---|---|---|
| **fijo** (20) | Lugar concreto, con ruta OSRM desde el hub (o por paradas). | cocorasalento, fulldayfcs, filandia, cordillera, compartidocs, cocoraacaime, cocoraacaime2 (La Carbonera), termales, parquecafe, panaca, recuca, ukumari, arrieros, botanico, laberinto ⚠, armenia, cuyabro, cartago, pereira, manizales |
| **zona** (5) | El portafolio nombra varias opciones según el hotel. Se usa un centro representativo (la primera opción citada), un círculo y las alternativas marcadas, con ruta hasta el centro. | aves, trekreservas, siembra (centro Barbas-Bremen), ranas (Pijao), palmacera (Pijao, acceso al Páramo del Chilí) |
| **zona genérica** (19) | El portafolio **no dice dónde** es: la finca depende del hotel o del proveedor. Solo se dibuja el **área de servicio** (círculo de 20 km alrededor de Armenia, Pereira o Manizales). **No se dibuja ruta**, porque sería inventarla. Todas llevan `validar: true`. | finca, orquideas, paramo, campesino, cacao, cana, abejas, frutas, platano, conexion, senderovida, equino, parapente, cabalgatamaria, cabalgatadeluxe, paratrike, gastronomica, catacocteles, greenteam |
| **movil** (8) | Se realiza en el hotel del viajero, o en la reserva más cercana. En vez de un mapa se muestra un mensaje. | yoga, rituales, respiracion, catacafe, cajaviajera, cataquesos, artesanos, tallerrespiracion |

Casos particulares:

- Los *city tours* `cuyabro`, `pereira` y `manizales` (`en_ciudad: true`) no tienen ruta porque su circuito no está documentado. El de `armenia` sí tiene circuito: Plaza de Bolívar → Museo del Oro Quimbaya → Parque de la Vida.
- `cocoraacaime` termina en coche en Cocora. El tramo hasta Acaime es a pie y se dibuja punteado, como línea recta.
- Las áreas protegidas extensas (PNN Los Nevados y Páramo del Chilí) aparecen solo como alternativas (`extensa: true`). No entran en la matriz, porque su punto es una etiqueta y no un sendero.
- `rodizio` y `alimentacion` existen en `js/data.js` pero no en `jenny.json`, así que no se mapean.

### Pendientes `VALIDAR` (el equipo de operaciones debe confirmarlos)

Están listados en `geo.json → _meta.validar` y en el campo `nota` de cada lugar:

- **Lugar real por confirmar (zonas genéricas):** finca, orquideas, paramo, campesino, cacao, cana, abejas, frutas, platano, conexion, senderovida, equino, parapente, cabalgatamaria ("La María"), cabalgatadeluxe, paratrike, gastronomica, catacocteles, greenteam.
- **Precisión de vereda:** laberinto.
- **Revisión recomendada:** el punto de La Carbonera es la finca "La Carbonera" de OSM (Cajamarca, Tolima). Ruta desde Armenia: 50,6 km.

### Comprobaciones de plausibilidad (OSRM)

| Trayecto | Distancia / tiempo |
|---|---|
| Armenia → Salento | 23,7 km / 31 min |
| Armenia → Valle de Cocora | 34,3 km / 47 min (34,9 km pasando por Salento) |
| Pereira → Termales de Santa Rosa de Cabal | 25,4 km / 42 min |
| Armenia → Pereira | 45,2 km / 66 min |
| Pereira → Manizales | 51,9 km / 50 min |
| Aeropuerto El Edén (AXM) → Armenia | 15,4 km / 17 min |
| Armenia → Filandia | 29,2 km / 43 min |
| Manizales → Termales El Otoño | 15,4 km / 19 min |

---

## 2. Cómo regenerar `data/geo.json`

Requisitos: Node 18 o superior (usa `fetch`). No hace falta `npm install`.

```bash
node tools/build-geo.js             # usa la caché y consulta solo lo nuevo
node tools/build-geo.js --offline   # solo caché, sin red (falla si falta algo)
node tools/build-geo.js --refresh   # ignora la caché y vuelve a consultar todo
```

- El script respeta **≤ 1 petición/segundo por servicio** (pausa de 1,1 s) y se identifica con el User-Agent `EspontaneosTravel-geo/1.0 (info@espontaneostravel.com)`.
- La caché queda en `tools/.cache/geo-cache.json`. Conviene versionarla, así cualquiera puede reconstruir el archivo con `--offline` sin volver a pedir datos a las APIs.
- El script **falla** si un tour de `jenny.json` no tiene entrada en `LUGARES`. Así nunca se publica un tour sin ubicación definida.

### Portafolio 2027 o tour nuevo

1. Actualiza `data/jenny.json` (nuevo `id_web`).
2. En `tools/build-geo.js`, añade la entrada en `LUGARES`. Ejemplos:

```js
// Lugar concreto que existe en OSM
PUNTOS.miReserva = { nombre: 'Reserva X', municipio: 'Salento', departamento: 'Quindío', q: 'Reserva X, Salento' };
LUGARES.nuevotour = { tipo: 'fijo', punto: 'miReserva', nombre_lugar: 'Reserva X' };

// Con paradas (la ruta pasa por ellas en orden)
LUGARES.otro = { tipo: 'fijo', punto: 'cocora', paradas: ['filandia', 'salento', 'cocora'], hub: 'armenia', nombre_lugar: '…' };

// Varía según el hotel, con opciones nombradas
LUGARES.z = { tipo: 'zona', punto: 'barbas', alternativas: ['otun', 'patasola'], nombre_lugar: '…', nota: '…' };

// Sin lugar documentado → solo área de servicio (sin ruta)
LUGARES.g = { tipo: 'zona', generica: true, servicio: ['armenia', 'pereira'], validar: true, nombre_lugar: '…', nota: 'VALIDAR: …' };

// En el hotel
LUGARES.m = { tipo: 'movil', modalidad: 'hotel', servicio: ['armenia', 'pereira'], nombre_lugar: 'En tu hotel', nota: '…' };
```

3. Corre `node tools/build-geo.js` y revisa la consola (rutas, km y minutos).

### Corregir un `VALIDAR`

Si la finca no está en OSM, usa coordenadas manuales **con fuente verificable**. El script exige el campo `fuente`.

```js
PUNTOS.fincaCafe = { nombre: 'Finca El Ejemplo', municipio: 'Circasia', departamento: 'Quindío',
                     lat: 4.6123, lon: -75.6456, fuente: 'Pin de Google Maps enviado por la finca, 2027-01-10' };
LUGARES.finca = { tipo: 'fijo', punto: 'fincaCafe', nombre_lugar: 'Finca El Ejemplo' };
```

Campos útiles:

- `publico: { es, en, fr, de, pt }`: nota que **sí** ve el viajero (por ejemplo, puntos de encuentro).
- `nota`: texto interno para operaciones. No se muestra en el sitio.

---

## 3. Atribución y políticas de uso

- **OpenStreetMap (ODbL):** la atribución "© OpenStreetMap contributors" aparece en el control del mapa. **No la quites.**
- **Teselas OpenStreetMap (predeterminadas):** se muestra "© OpenStreetMap". Su política permite el uso normal en un sitio web con atribución; el modo oscuro se logra con un filtro CSS sobre las teselas (`css/maps.css`). Las teselas de **CARTO** (Voyager / Dark Matter) son más bonitas, pero las gratuitas son solo para uso no comercial: si se obtiene licencia, se activan sin tocar el código definiendo antes de `js/maps.js`:

  ```html
  <script>
    window.ESPO_MAP_TILES = {
      light: 'https://{s}.proveedor.com/claro/{z}/{x}/{y}.png',
      dark:  'https://{s}.proveedor.com/oscuro/{z}/{x}/{y}.png',
      subdomains: 'abc',
      attribution: '&copy; OpenStreetMap contributors &copy; Proveedor'
    };
  </script>
  ```

- **OSRM:** el servidor público es de uso justo y no apto para producción. Por eso solo se usa al **generar** los datos y nunca desde el navegador. En el mapa se muestra "Rutas: OSRM".
- **Nominatim:** como máximo 1 petición/segundo, User-Agent identificable y sin uso masivo. Solo se usa en el script.
- **Wikidata:** datos CC0.
- **Google Maps:** se usa **solo con enlaces** del tipo `https://www.google.com/maps/dir/?api=1&…`. No requiere clave ni facturación. Si se omite `origin`, Google usa la ubicación del usuario ("Desde mi ubicación"). Un enlace admite como mucho unas 9 paradas intermedias; el itinerario genera un enlace por día.
- **Google Maps JavaScript API (opcional, no implementado):** si algún día se define `window.ESPO_GOOGLE_MAPS_KEY`, se podría sustituir la capa de teselas por la de Google (por ejemplo, con el plugin Leaflet.GridLayer.GoogleMutant) o migrar a Google Maps JS. Requiere cuenta de facturación, restringir la clave por *HTTP referrer* y cumplir los términos de Google (datos de Google sobre mapa de Google). **No es necesario**: hoy todo funciona sin clave.

---

## 4. API `window.EspoMaps`

Carga (en `<head>` o al final del `<body>`):

```html
<link rel="stylesheet" href="css/maps.css">
<script src="js/maps.js" defer></script>
```

`geo.json` se resuelve en relación con `js/maps.js` (`../data/geo.json`). Se puede cambiar con `window.ESPO_GEO_URL`.

| Llamada | Qué hace |
|---|---|
| `EspoMaps.load()` → `Promise<geo>` | Descarga `geo.json` una sola vez y lo cachea. Al terminar emite el evento `espomaps:ready` en `document`. Para que `distanceText` y `place` respondan pronto, también se precarga en reposo tras `window.load`; se desactiva con `window.ESPO_MAPS_PREFETCH = false`. |
| `EspoMaps.overview(el, { lang, tours, categories, filter, onFilter, onSelect, chips })` | Mapa de toda la región. Marcadores por categoría, con un solo popup cuando varias experiencias comparten lugar. Aeropuertos y ciudades base tienen iconos propios. Los chips de categoría sirven también de leyenda, y las experiencias "En tu hotel o cerca de él" aparecen como lista. **Si se vuelve a llamar sobre el mismo `el`, se actualiza en el sitio** (sin parpadeo). Devuelve un controlador con `setFilter(cat)`, `focusTour(id)` y `destroy()`. |
| `EspoMaps.tour(el, tourId, { lang, name })` | Ruta desde el hub hasta el lugar, con salida, paradas numeradas, destino, insignia de km/min y tramos. Botones "Abrir ruta en Google Maps" y "Desde mi ubicación". Una **zona** muestra círculo y alternativas; una **zona genérica**, el área de servicio; un tour **móvil**, un mensaje sin mapa (y sin cargar Leaflet). |
| `EspoMaps.itinerary(el, stops, { lang, hotel, onSelect })` | Itinerario del viajero. `stops` tiene la forma `[{ tourId?, title?, date?, time?, lat?, lon?, placeId? }]`. Dibuja marcadores numerados. Cada tramo usa la ruta precalculada si existe; si no, una línea punteada con km por carretera (matriz OSRM) o "aprox. en línea recta" (haversine). Genera un enlace multiparada de Google Maps (uno por día si hay hotel). `hotel` puede ser `{name, lat, lon}`, `{name, area: 'Pereira'}` o un id (`'armenia'`, `'axm'`…). |
| `EspoMaps.distanceText(tourId, lang)` | Texto corto: "≈ 34 km · 45 min desde Armenia", "En Armenia", "Cerca de tu hotel" o "En tu hotel". Devuelve `''` si los datos aún no cargaron (escucha `espomaps:ready` para volver a pintar). |
| `EspoMaps.place(tourId)` | Entrada de `geo.lugares`, o `null` (también `null` mientras no ha cargado). |
| `EspoMaps.directionsUrl(tourId, { fromMyLocation })` | Enlace de Google Maps para ese tour. |
| `EspoMaps.destroy(el)` | Elimina el mapa y libera los observadores. |

**Idiomas:** `es`, `en`, `fr`, `de`, `pt`, mediante `opts.lang`.

**Tema:** usa las teselas de OpenStreetMap; en modo oscuro se invierten con un filtro CSS. Cambia solo cuando cambia el tema.

**Accesibilidad:**

- Cada contenedor tiene `role="region"` y `aria-label`.
- Los marcadores se alcanzan con Tab; Enter abre el popup y lleva el foco a su primer botón, y Esc lo cierra.
- La rueda del ratón no "secuestra" el scroll. En móvil se desplaza con dos dedos.
- Hay una lista de texto oculta visualmente con lugares y distancias. Si Leaflet o las teselas no cargan (sin conexión), esa lista se muestra en lugar de una caja vacía.

---

## 5. Integración en `index.html` (copiar y pegar)

**Vista de mapa en Experiencias** (`#tours-map`; `main.js` ya lo hace):

```js
EspoMaps.overview(document.getElementById('tours-map'), {
  lang: currentLang,
  tours: list.map(x => ({ id: x.id, cat: x.cat, name: tourName(x), dur: '4 h' })), // lista ya filtrada
  categories: CATEGORIES.map(c => ({ id: c.id, label: c[currentLang] || c.es })),
  onSelect: openModal,                       // botón "Ver experiencia"
  onFilter: cat => setActiveCategory(cat)    // opcional: sincroniza los filtros externos
});
// Al cambiar filtros o idioma basta con volver a llamar overview(): se actualiza en el sitio.
```

**Modal de la experiencia** (`#modal-map-wrap` / `#modal-map`):

```js
function showModalMap(id) {
  const wrap = document.getElementById('modal-map-wrap');
  if (!window.EspoMaps) { wrap.hidden = true; return; }
  wrap.hidden = false;                       // tour() resuelve solo los casos móvil o desconocido
  EspoMaps.tour(document.getElementById('modal-map'), id, { lang: currentLang, name: tourName(id) });
}
function closeModal() { EspoMaps.destroy(document.getElementById('modal-map')); /* … */ }
```

> Si condicionas el mapa a `EspoMaps.place(id)`, ten en cuenta que devuelve `null` mientras `geo.json` no ha cargado (por ejemplo, al abrir `#tour-xyz` directamente). Es preferible llamar a `tour()` siempre, o hacerlo dentro de `EspoMaps.load().then(…)`.

**Distancia en las tarjetas o en el modal:**

```js
const dist = EspoMaps.distanceText(id, currentLang);           // '' si aún no hay datos
document.addEventListener('espomaps:ready', () => renderCards()); // repintar al cargar
```

## 6. Integración en `viaje.html` (conserje)

```html
<link rel="stylesheet" href="css/maps.css">
<section class="c-card">
  <h2 class="c-card__title" id="c-map-title">Tu ruta</h2>
  <div id="c-map"></div>
</section>
<script src="js/maps.js" defer></script>
```

```js
// En concierge.js, después de cargar la reserva:
if (window.EspoMaps) {
  EspoMaps.itinerary(document.getElementById('c-map'), booking.itinerary, {
    lang,
    hotel: booking.hotel   // { name, area: 'Pereira' } o, mejor, { name, lat, lon }
  });
}
```

- Los ítems del itinerario ya traen `tourId`, `title` (texto o `{es,en,…}`), `date` y `time`.
- Para tramos exactos desde el hotel conviene añadir `lat` y `lon` al `hotel` en `data/bookings.json`. Con solo `area` se usa el centro de ese municipio y se indica "aprox.".
- Si el *service worker* (`sw.js`) debe funcionar sin conexión, agrega `js/maps.js`, `css/maps.css` y `data/geo.json` a su lista de caché. Las teselas y Leaflet no se cachean; sin conexión se muestra la lista de texto.

---

## 7. Verificación realizada

- `node --check js/maps.js` y `node --check tools/build-geo.js`.
- `data/geo.json` se parsea bien y cubre los 52 `id_web`. Todas las rutas son `fuente: "OSRM"`, y la matriz de 37×37 no tiene vacíos.
- Prueba sin navegador (DOM simulado y Leaflet simulado): los 52 tours × 5 idiomas pasan por `tour()`, además de `overview()` (incluida la actualización en el sitio), `itinerary()` con la reserva de ejemplo, `destroy()` y el modo sin conexión. Resultado: sin errores y sin textos `undefined` o `NaN`.
