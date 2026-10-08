#!/usr/bin/env node
/* =====================================================================
   tools/build-geo.js — Espontáneos Travel
   Genera data/geo.json: hubs, lugares por tour, pueblos, matriz de
   distancias y rutas precalculadas (para js/maps.js).

   Fuentes (nada se inventa):
     · Coordenadas: OpenStreetMap Nominatim (geocodificación) y, para
       cabeceras municipales, verificación cruzada con Wikidata (P625).
     · Rutas y distancias: OSRM (router.project-osrm.org, perfil driving).
   Ambos servicios se consultan a ≤ 1 petición/segundo con User-Agent
   descriptivo, y TODO se guarda en caché (tools/.cache/geo-cache.json):
   volver a ejecutar el script no vuelve a golpear las APIs.

   Uso:
     node tools/build-geo.js             # usa caché + consulta lo nuevo
     node tools/build-geo.js --offline   # solo caché (falla si falta algo)
     node tools/build-geo.js --refresh   # ignora la caché y re-consulta todo

   Para un tour nuevo o el portafolio 2027: añade/edita la entrada en
   LUGARES (abajo) usando el id_web de data/yenny.json y vuelve a correr.
   Ver docs/MAPAS.md.
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'geo.json');
const YENNY = path.join(ROOT, 'data', 'yenny.json');
const CACHE_FILE = path.join(__dirname, '.cache', 'geo-cache.json');
const UA = 'EspontaneosTravel-geo/1.0 (info@espontaneostravel.com)';
const NOMINATIM = 'https://nominatim.openstreetmap.org';
const OSRM = 'https://router.project-osrm.org';
const WIKIDATA = 'https://www.wikidata.org/w/api.php';
// Caja Eje Cafetero ampliada (lon_min, lat_max, lon_max, lat_min)
const VIEWBOX = '-76.3,5.6,-74.9,3.9';
const SIMPLIFY_M = 22;          // tolerancia Douglas–Peucker (metros)
const WD_MAX_KM = 1.5;          // si Nominatim y Wikidata difieren más, se usa Wikidata

const ARGS = process.argv.slice(2);
const OFFLINE = ARGS.includes('--offline');
const REFRESH = ARGS.includes('--refresh');

/* ---------------------------------------------------------------------
   1) HUBS (puntos de salida / llegada)
   --------------------------------------------------------------------- */
const HUBS = [
  { id: 'axm', tipo: 'aeropuerto', nombre: 'Aeropuerto Internacional El Edén (AXM)', municipio: 'La Tebaida', departamento: 'Quindío',
    q: 'Aeropuerto Internacional El Edén', pick: r => r.type === 'aerodrome' },
  { id: 'pei', tipo: 'aeropuerto', nombre: 'Aeropuerto Internacional Matecaña (PEI)', municipio: 'Pereira', departamento: 'Risaralda',
    q: 'Aeropuerto Internacional Matecaña', pick: r => r.type === 'aerodrome' },
  { id: 'armenia', tipo: 'ciudad', nombre: 'Armenia · Plaza de Bolívar', municipio: 'Armenia', departamento: 'Quindío',
    q: 'Plaza de Bolívar, Armenia' },
  { id: 'pereira', tipo: 'ciudad', nombre: 'Pereira · Plaza de Bolívar', municipio: 'Pereira', departamento: 'Risaralda',
    q: 'Plaza de Bolívar, Pereira' },
  { id: 'manizales', tipo: 'ciudad', nombre: 'Manizales · Plaza de Bolívar (Catedral)', municipio: 'Manizales', departamento: 'Caldas',
    q: 'Plaza de Bolívar, Manizales' },
  { id: 'parquevida', tipo: 'encuentro', nombre: 'Parque de la Vida (Armenia)', municipio: 'Armenia', departamento: 'Quindío',
    q: 'Parque de la Vida, Armenia', nota: 'Punto de encuentro del Tour Compartido (8:10 a.m.).' }
];
// Ciudades base para "≈ X km · Y min desde …"
const BASES = ['armenia', 'pereira', 'manizales'];

/* ---------------------------------------------------------------------
   2) PUNTOS DE INTERÉS (geocodificados con Nominatim)
   q: consulta Nominatim · pick: elige entre resultados · extensa: área grande
   (sin matriz) · validar: requiere confirmación. Si el lugar no existe en
   OSM se puede usar { lat, lon, fuente: 'Pin enviado por la finca, 2027-01-10' }.
   --------------------------------------------------------------------- */
const PUNTOS = {
  cocora:      { nombre: 'Valle de Cocora', municipio: 'Salento', departamento: 'Quindío', q: 'Cocora, Salento', pick: r => r.type === 'village',
                 nota: 'Caserío de Cocora, fin de la vía vehicular y entrada al valle de las palmas de cera.' },
  acaime:      { nombre: 'Reserva Natural Acaime (Casa de los Colibríes)', municipio: 'Salento', departamento: 'Quindío', q: 'Reserva Natural Acaime', pick: r => r.type === 'nature_reserve' },
  carbonera:   { nombre: 'La Carbonera · Santuario de Palma de Cera', municipio: 'Cajamarca', departamento: 'Tolima', q: 'La Carbonera',
                 pick: r => /Cajamarca/.test(r.display_name) && r.type === 'farm' },
  termales_santarosa:  { nombre: 'Termales de Santa Rosa de Cabal', municipio: 'Santa Rosa de Cabal', departamento: 'Risaralda', q: 'Termales de Santa Rosa de Cabal' },
  termales_sanvicente: { nombre: 'Termales San Vicente', municipio: 'Santa Rosa de Cabal', departamento: 'Risaralda', q: 'Termales San Vicente' },
  termales_otono:      { nombre: 'Termales El Otoño', municipio: 'Villamaría', departamento: 'Caldas', q: 'Termales El Otoño' },
  termales_tierraviva: { nombre: 'Termales Tierra Viva', municipio: 'Manizales', departamento: 'Caldas', q: 'Termales Tierra Viva' },
  parquecafe:  { nombre: 'Parque del Café', municipio: 'Montenegro', departamento: 'Quindío', q: 'Parque del Café, Montenegro', pick: r => r.type === 'theme_park' },
  panaca:      { nombre: 'PANACA', municipio: 'Quimbaya', departamento: 'Quindío', q: 'PANACA, Quimbaya', pick: r => r.type === 'theme_park' },
  recuca:      { nombre: 'RECUCA · Recorrido de la Cultura Cafetera', municipio: 'Calarcá', departamento: 'Quindío', q: 'Recuca, Calarcá' },
  ukumari:     { nombre: 'Bioparque Ukumarí', municipio: 'Pereira', departamento: 'Risaralda', q: 'Bioparque Ukumarí' },
  arrieros:    { nombre: 'Parque Los Arrieros', municipio: 'Montenegro', departamento: 'Quindío', q: 'Parque Arrieros', pick: r => r.type === 'theme_park',
                 nota: 'OSM lo ubica sobre la vía a La Julia (jurisdicción de Montenegro).' },
  botanico:    { nombre: 'Jardín Botánico y Mariposario del Quindío', municipio: 'Calarcá', departamento: 'Quindío', q: 'Jardín Botánico del Quindío' },
  laberinto:   { nombre: 'Laberinto Mil Caminos (vereda Morelia Alta)', municipio: 'Quimbaya', departamento: 'Quindío', q: 'Morelia Alta, Quimbaya',
                 validar: true,
                 nota: 'VALIDAR: el laberinto no está en OpenStreetMap. Punto = vía de la vereda Morelia Alta (Quimbaya), donde lo ubica la prensa (El País, "El Laberinto Mil Caminos: qué es y dónde queda"). Precisión de vereda.' },
  museooro:    { nombre: 'Museo del Oro Quimbaya', municipio: 'Armenia', departamento: 'Quindío', q: 'Museo del Oro Quimbaya' },
  barbas:      { nombre: 'Reserva Natural Barbas-Bremen', municipio: 'Filandia', departamento: 'Quindío', q: 'Barbas Bremen', pick: r => r.type === 'nature_reserve' },
  otun:        { nombre: 'Santuario de Fauna y Flora Otún Quimbaya', municipio: 'Pereira', departamento: 'Risaralda', q: 'Otún Quimbaya', pick: r => r.category === 'place' },
  patasola:    { nombre: 'Reserva Natural La Patasola', municipio: 'Salento', departamento: 'Quindío', q: 'La Patasola', pick: r => /Reserva/.test(r.display_name) },
  nevados:     { nombre: 'PNN Los Nevados', municipio: 'Varios (Caldas, Risaralda, Quindío, Tolima)', departamento: 'Eje Cafetero / Tolima', q: 'Parque Nacional Natural Los Nevados',
                 extensa: true, nota: 'Área protegida extensa: el punto es la etiqueta del parque en OSM, no un sendero.' },
  chili:       { nombre: 'Páramo del Chilí', municipio: 'Pijao / Roncesvalles', departamento: 'Quindío / Tolima', q: 'Páramo del Chilí',
                 extensa: true, nota: 'Ecosistema extenso entre Quindío y Tolima: el punto es la etiqueta de OSM, no un sendero.' }
};

/* ---------------------------------------------------------------------
   3) PUEBLOS (cabeceras municipales; Nominatim + verificación Wikidata)
   Armenia, Pereira y Manizales usan su Plaza de Bolívar (= hub).
   --------------------------------------------------------------------- */
const PUEBLOS = {
  armenia:      { nombre: 'Armenia', departamento: 'Quindío', hub: 'armenia' },
  pereira:      { nombre: 'Pereira', departamento: 'Risaralda', hub: 'pereira' },
  manizales:    { nombre: 'Manizales', departamento: 'Caldas', hub: 'manizales' },
  salento:      { nombre: 'Salento', departamento: 'Quindío', wikidata: 'Q1576707' },
  filandia:     { nombre: 'Filandia', departamento: 'Quindío', wikidata: 'Q1525384' },
  montenegro:   { nombre: 'Montenegro', departamento: 'Quindío', wikidata: 'Q1256403' },
  quimbaya:     { nombre: 'Quimbaya', departamento: 'Quindío', wikidata: 'Q2433472' },
  calarca:      { nombre: 'Calarcá', departamento: 'Quindío', wikidata: 'Q2240918' },
  circasia:     { nombre: 'Circasia', departamento: 'Quindío', wikidata: 'Q958855' },
  santarosa:    { nombre: 'Santa Rosa de Cabal', departamento: 'Risaralda', wikidata: 'Q955068' },
  pijao:        { nombre: 'Pijao', departamento: 'Quindío', wikidata: 'Q636738' },
  cordoba:      { nombre: 'Córdoba', departamento: 'Quindío', wikidata: 'Q1883426' },
  buenavista:   { nombre: 'Buenavista', departamento: 'Quindío', wikidata: 'Q607290' },
  cartago:      { nombre: 'Cartago', departamento: 'Valle del Cauca', wikidata: 'Q2004074' },
  latebaida:    { nombre: 'La Tebaida', departamento: 'Quindío', wikidata: 'Q2432300' },
  caicedonia:   { nombre: 'Caicedonia', departamento: 'Valle del Cauca', wikidata: 'Q2430520' }
};

/* ---------------------------------------------------------------------
   4) LUGARES POR TOUR (clave = id_web de data/yenny.json)
   tipo:
     'fijo'  → lugar concreto (punto) + ruta OSRM desde el hub (o por paradas).
     'zona'  → varía según el hotel/condiciones. Con `punto`: centro
               representativo + alternativas + ruta. Con `generica:true`:
               no hay un lugar documentado → solo área de servicio, SIN ruta
               (dibujarla sería inventar). Marcado VALIDAR.
     'movil' → se realiza en el hotel/alojamiento del viajero (sin ruta).
   Campos: punto, paradas[], acceso (fin de vía si el lugar es a pie), publico{es,en,fr,de,pt}
   (nota visible para el viajero; `nota` es interna para operaciones),
   alternativas[], hub (si se omite: la base más cercana por tiempo OSRM),
   en_ciudad (city tours sin circuito documentado), servicio[] (bases
   desde las que se presta), radio_km, nota, validar.
   --------------------------------------------------------------------- */
const LUGARES = {
  // ---------- Tradicionales ----------
  finca: { tipo: 'zona', generica: true, servicio: ['armenia', 'pereira', 'manizales'], validar: true,
    nombre_lugar: 'Finca cafetera tradicional (según tu hotel)',
    nota: 'VALIDAR: la finca se asigna según la ubicación del hotel (Armenia, Pereira o Manizales). El mapa muestra el área de servicio, no una finca concreta.' },
  cocorasalento: { tipo: 'fijo', punto: 'cocora', paradas: ['salento', 'cocora'], hub: 'armenia',
    nombre_lugar: 'Salento y Valle de Cocora', municipio: 'Salento', departamento: 'Quindío',
    nota: 'Ruta por carretera hasta Salento y luego al caserío de Cocora (fin de la vía).' },
  fulldayfcs: { tipo: 'fijo', publico: { es: 'El orden de las paradas es orientativo; el guía puede ajustarlo.', en: 'The order of stops is indicative; your guide may adjust it.', fr: 'L’ordre des arrêts est indicatif ; le guide peut l’adapter.', de: 'Die Reihenfolge der Stopps ist unverbindlich; der Guide kann sie anpassen.', pt: 'A ordem das paradas é indicativa; o guia pode ajustá-la.' },
    punto: 'cocora', paradas: ['filandia', 'salento', 'cocora'], hub: 'armenia',
    nombre_lugar: 'Filandia · Salento · Valle de Cocora', municipio: 'Filandia / Salento', departamento: 'Quindío',
    nota: 'Orden de paradas ilustrativo (Filandia → Salento → Cocora); el guía puede ajustarlo.' },
  filandia: { tipo: 'fijo', punto: 'filandia',
    nombre_lugar: 'Filandia', municipio: 'Filandia', departamento: 'Quindío' },
  cordillera: { tipo: 'fijo', publico: { es: 'Parte del trayecto puede hacerse en Jeep Willys, según el estado de las vías.', en: 'Part of the journey may be by Jeep Willys, depending on road conditions.', fr: 'Une partie du trajet peut se faire en Jeep Willys, selon l’état des routes.', de: 'Ein Teil der Strecke kann je nach Straßenzustand im Jeep Willys gefahren werden.', pt: 'Parte do trajeto pode ser feita de Jeep Willys, conforme as condições das estradas.' },
    punto: 'pijao', paradas: ['cordoba', 'pijao', 'buenavista'], hub: 'armenia',
    nombre_lugar: 'Córdoba · Pijao · Buenavista', municipio: 'Córdoba / Pijao / Buenavista', departamento: 'Quindío',
    nota: 'Paradas en el orden del nombre del tour; parte del trayecto puede hacerse en Jeep Willys.' },
  compartidocs: { tipo: 'fijo', publico: { es: 'Puntos de encuentro: Plaza de Bolívar de Armenia 8:00 a.m. o Parque de la Vida 8:10 a.m.; salida 8:15 a.m.', en: 'Meeting points: Plaza de Bolívar in Armenia at 8:00 a.m. or Parque de la Vida at 8:10 a.m.; departure 8:15 a.m.', fr: 'Points de rendez-vous : Plaza de Bolívar d’Armenia à 8 h 00 ou Parque de la Vida à 8 h 10 ; départ à 8 h 15.', de: 'Treffpunkte: Plaza de Bolívar in Armenia um 8:00 Uhr oder Parque de la Vida um 8:10 Uhr; Abfahrt 8:15 Uhr.', pt: 'Pontos de encontro: Plaza de Bolívar de Armenia às 8h00 ou Parque de la Vida às 8h10; saída às 8h15.' },
    punto: 'cocora', paradas: ['parquevida', 'salento', 'cocora'], hub: 'armenia',
    nombre_lugar: 'Salento y Valle de Cocora (salida desde Armenia)', municipio: 'Salento', departamento: 'Quindío',
    nota: 'Encuentro: Plaza de Bolívar de Armenia 8:00 a.m. y Parque de la Vida 8:10 a.m.; salida 8:15 a.m.' },

  // ---------- Naturaleza ----------
  cocoraacaime: { tipo: 'fijo', punto: 'acaime', acceso: 'cocora', paradas: ['salento', 'cocora'], hub: 'armenia',
    nombre_lugar: 'Valle de Cocora → Reserva Acaime', municipio: 'Salento', departamento: 'Quindío',
    nota: 'El vehículo llega hasta Cocora; desde allí se camina hasta Acaime (tramo a pie, sin ruta vehicular).' },
  aves: { tipo: 'zona', punto: 'barbas', alternativas: ['otun', 'nevados'],
    nombre_lugar: 'Reservas Barbas-Bremen, Otún Quimbaya o PNN Los Nevados', departamento: 'Quindío / Risaralda',
    nota: 'La reserva se elige según la ubicación del hotel. Centro representativo: Barbas-Bremen (primera opción del portafolio); alternativas marcadas en el mapa.' },
  palmacera: { tipo: 'zona', publico: { es: 'El vehículo llega a Pijao; desde allí se sigue en Jeep Willys hacia la reserva (entre 2.200 y 2.600 msnm).', en: 'Vehicles reach Pijao; from there you continue by Jeep Willys to the reserve (2,200–2,600 m a.s.l.).', fr: 'Les véhicules arrivent à Pijao ; on continue ensuite en Jeep Willys vers la réserve (2 200 à 2 600 m d’altitude).', de: 'Fahrzeuge fahren bis Pijao; von dort geht es im Jeep Willys weiter zum Reservat (2.200–2.600 m ü. M.).', pt: 'Os veículos chegam a Pijao; de lá segue-se de Jeep Willys até a reserva (entre 2.200 e 2.600 m de altitude).' },
    punto: 'pijao', radio_km: 10,
    nombre_lugar: 'Pijao · inmediaciones de la Reserva Páramo del Chilí', municipio: 'Pijao', departamento: 'Quindío',
    nota: 'La ruta llega a Pijao (acceso); el recorrido sigue en Jeep Willys hacia la reserva, entre 2.200 y 2.600 msnm. Círculo = área aproximada.' },
  orquideas: { tipo: 'zona', generica: true, servicio: ['armenia'], validar: true,
    nombre_lugar: 'Reserva en el Quindío (cerca de Armenia)',
    nota: 'VALIDAR: el portafolio solo indica "en el Quindío". Se muestra el área de servicio desde Armenia.' },
  ranas: { tipo: 'zona', punto: 'pijao', alternativas: ['cordoba', 'caicedonia', 'filandia'],
    nombre_lugar: 'Pijao, Córdoba, Caicedonia o Filandia', departamento: 'Quindío / Valle del Cauca',
    nota: 'El hábitat (ranas de cristal, chocolate o venenosas) se elige según el interés. Centro representativo: Pijao (primero de la lista).' },
  trekreservas: { tipo: 'zona', punto: 'barbas', alternativas: ['otun', 'acaime', 'nevados', 'chili'],
    nombre_lugar: 'Barbas-Bremen, Otún, Acaime, PNN Los Nevados o Páramo del Chilí', departamento: 'Quindío / Risaralda',
    nota: 'Reserva según la ubicación del hotel y el estado físico (senderos de 8 a 15 km). Centro representativo: Barbas-Bremen.' },
  cocoraacaime2: { tipo: 'fijo', punto: 'carbonera',
    nombre_lugar: 'La Carbonera · Santuario de Palma de Cera', municipio: 'Cajamarca', departamento: 'Tolima',
    nota: 'Punto = finca La Carbonera en OSM (Cajamarca, Tolima). Altura máxima del recorrido: 3.370 msnm.' },
  paramo: { tipo: 'zona', generica: true, servicio: ['armenia'], validar: true,
    nombre_lugar: 'Páramo (destino por confirmar)',
    nota: 'VALIDAR: el portafolio no indica qué páramo se visita. No se dibuja ruta hasta confirmarlo.' },

  // ---------- Rurales ----------
  campesino: { tipo: 'zona', generica: true, servicio: ['armenia', 'pereira'], validar: true,
    nombre_lugar: 'Finca campesina (según tu hotel)', nota: 'VALIDAR: finca anfitriona por confirmar; se muestra el área de servicio.' },
  cacao: { tipo: 'zona', generica: true, servicio: ['armenia', 'pereira', 'manizales'], validar: true,
    nombre_lugar: 'Finca cacaotera cercana a tu hotel', nota: 'Fincas cercanas según la ubicación del hotel (vehículo de turismo o Jeep Willys). VALIDAR finca concreta.' },
  cana: { tipo: 'zona', generica: true, servicio: ['armenia', 'pereira'], validar: true,
    nombre_lugar: 'Finca con trapiche cercana a tu hotel', nota: 'Fincas cercanas según la ubicación del hotel. VALIDAR finca concreta.' },
  abejas: { tipo: 'zona', generica: true, servicio: ['armenia'], validar: true,
    nombre_lugar: 'Finca apícola en el Quindío', nota: 'VALIDAR: apiario por confirmar; se muestra el área de servicio.' },
  frutas: { tipo: 'zona', generica: true, servicio: ['armenia'], validar: true,
    nombre_lugar: 'Hacienda frutícola cercana a tu hotel', nota: 'Haciendas de piña, guayaba o cítricos cercanas al hotel. VALIDAR hacienda concreta.' },
  platano: { tipo: 'zona', generica: true, servicio: ['armenia'], validar: true,
    nombre_lugar: 'Finca platanera en el Quindío', nota: 'VALIDAR: finca por confirmar; se muestra el área de servicio.' },

  // ---------- Bienestar ----------
  termales: { tipo: 'fijo', publico: { es: 'Hoteles en Quindío y Risaralda: Termales de Santa Rosa o San Vicente. Hoteles en Caldas: El Otoño o Tierra Viva.', en: 'Hotels in Quindío and Risaralda: Santa Rosa or San Vicente hot springs. Hotels in Caldas: El Otoño or Tierra Viva.', fr: 'Hôtels au Quindío et au Risaralda : thermes de Santa Rosa ou San Vicente. Hôtels au Caldas : El Otoño ou Tierra Viva.', de: 'Hotels in Quindío und Risaralda: Thermen Santa Rosa oder San Vicente. Hotels in Caldas: El Otoño oder Tierra Viva.', pt: 'Hotéis em Quindío e Risaralda: termas de Santa Rosa ou San Vicente. Hotéis em Caldas: El Otoño ou Tierra Viva.' },
    punto: 'termales_santarosa', alternativas: ['termales_sanvicente', 'termales_otono', 'termales_tierraviva'],
    nombre_lugar: 'Termales de Santa Rosa de Cabal (o San Vicente, El Otoño, Tierra Viva)', municipio: 'Santa Rosa de Cabal', departamento: 'Risaralda',
    nota: 'Hoteles en Quindío y Risaralda: Santa Rosa o San Vicente. Hoteles en Caldas: El Otoño o Tierra Viva.' },
  conexion: { tipo: 'zona', generica: true, servicio: ['armenia', 'pereira'], validar: true,
    nombre_lugar: 'Reserva de bienestar (por confirmar)', nota: 'VALIDAR: lugar del "Sendero de la vida" por confirmar; se muestra el área de servicio.' },
  yoga: { tipo: 'movil', modalidad: 'hotel_o_reserva', servicio: ['armenia', 'pereira'],
    nombre_lugar: 'En tu hotel o en la reserva natural más cercana', nota: 'Se realiza en la reserva natural más cercana al hotel o en el mismo hotel si sus instalaciones lo permiten.' },
  senderovida: { tipo: 'zona', generica: true, servicio: ['armenia', 'pereira'], validar: true,
    nombre_lugar: 'Sendero de la Vida (por confirmar)', nota: 'VALIDAR: ubicación del sendero por confirmar; se muestra el área de servicio.' },
  equino: { tipo: 'zona', generica: true, servicio: ['armenia', 'pereira'], validar: true,
    nombre_lugar: 'Finca de equinoterapia en el Quindío', nota: 'VALIDAR: finca por confirmar; se muestra el área de servicio.' },
  rituales: { tipo: 'movil', modalidad: 'hotel_o_reserva', servicio: ['armenia', 'pereira'],
    nombre_lugar: 'En tu hotel o en la reserva natural más cercana', nota: 'Se realiza en la reserva natural más cercana al hotel o en el mismo hotel si sus instalaciones lo permiten.' },
  respiracion: { tipo: 'movil', modalidad: 'hotel_o_reserva', servicio: ['armenia', 'pereira'],
    nombre_lugar: 'En tu hotel o en la reserva natural más cercana', nota: 'Se realiza en la reserva natural más cercana al hotel o en el mismo hotel si sus instalaciones lo permiten.' },

  // ---------- Aventura ----------
  parapente: { tipo: 'zona', generica: true, servicio: ['armenia', 'pereira'], validar: true,
    nombre_lugar: 'Punto de despegue (por confirmar)', nota: 'VALIDAR: punto de despegue por confirmar con el proveedor; depende del clima.' },
  cabalgatamaria: { tipo: 'zona', generica: true, servicio: ['armenia', 'pereira'], validar: true,
    nombre_lugar: 'Cabalgata "La María" (por confirmar)', nota: 'VALIDAR: el sitio web la llama "La María" pero el portafolio no da la ubicación.' },
  cabalgatadeluxe: { tipo: 'zona', generica: true, servicio: ['armenia', 'pereira'], validar: true,
    nombre_lugar: 'Cordillera del Quindío (por confirmar)', nota: 'VALIDAR: el portafolio solo indica "en la cordillera".' },
  paratrike: { tipo: 'zona', generica: true, servicio: ['armenia', 'pereira'], validar: true,
    nombre_lugar: 'Punto de despegue (por confirmar)', nota: 'VALIDAR: punto de despegue por confirmar con el proveedor; depende del clima.' },

  // ---------- Parques ----------
  parquecafe: { tipo: 'fijo', punto: 'parquecafe', nombre_lugar: 'Parque del Café', municipio: 'Montenegro', departamento: 'Quindío' },
  panaca:     { tipo: 'fijo', punto: 'panaca', nombre_lugar: 'PANACA', municipio: 'Quimbaya', departamento: 'Quindío' },
  recuca:     { tipo: 'fijo', punto: 'recuca', nombre_lugar: 'RECUCA', municipio: 'Calarcá', departamento: 'Quindío' },
  ukumari:    { tipo: 'fijo', punto: 'ukumari', nombre_lugar: 'Bioparque Ukumarí', municipio: 'Pereira', departamento: 'Risaralda' },
  arrieros:   { tipo: 'fijo', punto: 'arrieros', nombre_lugar: 'Parque Los Arrieros', municipio: 'Montenegro', departamento: 'Quindío' },
  botanico:   { tipo: 'fijo', punto: 'botanico', nombre_lugar: 'Jardín Botánico y Mariposario del Quindío', municipio: 'Calarcá', departamento: 'Quindío' },
  laberinto:  { tipo: 'fijo', punto: 'laberinto', nombre_lugar: 'Laberinto Mil Caminos', municipio: 'Quimbaya', departamento: 'Quindío', validar: true },

  // ---------- Ciudades ----------
  armenia: { tipo: 'fijo', punto: 'armenia', paradas: ['museooro', 'parquevida'], hub: 'armenia', en_ciudad: true,
    nombre_lugar: 'Armenia: Plaza de Bolívar · Museo del Oro Quimbaya · Parque de la Vida', municipio: 'Armenia', departamento: 'Quindío',
    nota: 'Circuito urbano con las visitas incluidas (Museo del Oro Quimbaya y Parque de la Vida).' },
  cuyabro: { tipo: 'fijo', punto: 'armenia', hub: 'armenia', en_ciudad: true,
    nombre_lugar: 'Armenia (recorrido urbano)', municipio: 'Armenia', departamento: 'Quindío',
    nota: 'Recorrido dentro de Armenia; el circuito exacto lo define el guía.' },
  cartago: { tipo: 'fijo', punto: 'cartago', nombre_lugar: 'Cartago', municipio: 'Cartago', departamento: 'Valle del Cauca' },
  pereira: { tipo: 'fijo', punto: 'pereira', hub: 'pereira', en_ciudad: true,
    nombre_lugar: 'Pereira (recorrido urbano)', municipio: 'Pereira', departamento: 'Risaralda',
    nota: 'Recorrido dentro de Pereira; el circuito exacto lo define el guía.' },
  manizales: { tipo: 'fijo', punto: 'manizales', hub: 'manizales', en_ciudad: true,
    nombre_lugar: 'Manizales: Catedral, cable aéreo y mirador', municipio: 'Manizales', departamento: 'Caldas',
    nota: 'Recorrido dentro de Manizales (Catedral, cable aéreo y mirador).' },

  // ---------- Alto valor / incentivos ----------
  catacafe: { tipo: 'movil', modalidad: 'hotel_o_locacion', servicio: ['armenia', 'pereira'],
    nombre_lugar: 'En tu hotel o una locación a ≤ 20 min de Armenia/Pereira', nota: 'Se realiza en Armenia, Pereira o municipios a máximo 20 minutos; puede hacerse en el hotel.' },
  gastronomica: { tipo: 'zona', generica: true, servicio: ['armenia', 'pereira'], validar: true,
    nombre_lugar: 'Restaurante / locación por confirmar', nota: 'VALIDAR: locación por confirmar; se muestra el área de servicio.' },
  cajaviajera: { tipo: 'movil', modalidad: 'hotel', servicio: ['armenia', 'pereira'], nombre_lugar: 'En tu hotel o alojamiento', nota: 'Actividad móvil: se realiza en el hotel o locación donde estés alojado.' },
  cataquesos:  { tipo: 'movil', modalidad: 'hotel', servicio: ['armenia', 'pereira'], nombre_lugar: 'En tu hotel o alojamiento', nota: 'Actividad móvil: se realiza en el hotel o locación donde estés alojado.' },
  catacocteles: { tipo: 'zona', generica: true, servicio: ['armenia', 'pereira'], validar: true,
    nombre_lugar: 'Zona urbana de la ciudad', nota: 'Se realiza en la zona urbana de la ciudad. VALIDAR locación concreta.' },
  greenteam: { tipo: 'zona', generica: true, servicio: ['armenia', 'pereira'], validar: true,
    nombre_lugar: 'Finca anfitriona en el Quindío (por confirmar)', nota: 'VALIDAR: finca por confirmar; se muestra el área de servicio.' },
  artesanos: { tipo: 'movil', modalidad: 'hotel', servicio: ['armenia', 'pereira'], nombre_lugar: 'En tu hotel o alojamiento', nota: 'Actividad móvil: se realiza en el hotel o locación donde estés alojado.' },
  siembra: { tipo: 'zona', punto: 'barbas', alternativas: ['otun', 'patasola'],
    nombre_lugar: 'Reserva privada cerca de Barbas-Bremen, Otún o La Patasola', departamento: 'Quindío / Risaralda',
    nota: 'Reserva natural privada en las inmediaciones de Barbas-Bremen, la Reserva Otún y La Patasola (Salento). Centro representativo: Barbas-Bremen.' },
  tallerrespiracion: { tipo: 'movil', modalidad: 'hotel', servicio: ['armenia', 'pereira'], nombre_lugar: 'En tu hotel o alojamiento', nota: 'Actividad móvil: se realiza en el hotel o locación donde estés alojado.' }
};
// Radio (km) del área de servicio que se dibuja para zonas genéricas.
const RADIO_SERVICIO_KM = 20;

/* =====================================================================
   Infraestructura: caché, throttling, HTTP
   ===================================================================== */
let CACHE = {};
try { CACHE = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')); } catch (e) { CACHE = {}; }
function saveCache() {
  fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(CACHE));
}
const lastHit = {};
const sleep = ms => new Promise(r => setTimeout(r, ms));
let netCalls = 0;

async function getJSON(url) {
  if (!REFRESH && Object.prototype.hasOwnProperty.call(CACHE, url)) return CACHE[url];
  if (OFFLINE) throw new Error('--offline y no está en caché: ' + url);
  const host = new URL(url).host;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const wait = (lastHit[host] || 0) + 1100 - Date.now();
    if (wait > 0) await sleep(wait);
    lastHit[host] = Date.now();
    netCalls++;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'es' } });
      if (res.status === 429 || res.status >= 500) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      CACHE[url] = json; saveCache();
      return json;
    } catch (e) {
      if (attempt === 4) throw new Error(url + ' → ' + e.message);
      await sleep(2000 * attempt);
    }
  }
}

/* =====================================================================
   Geometría: haversine, polyline (precisión 5), Douglas–Peucker
   ===================================================================== */
function haversineKm(a, b) {
  const R = 6371, t = x => x * Math.PI / 180;
  const dLat = t(b[0] - a[0]), dLon = t(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(t(a[0])) * Math.cos(t(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function decodePolyline(str) {
  const pts = []; let i = 0, lat = 0, lon = 0;
  while (i < str.length) {
    for (const k of [0, 1]) {
      let shift = 0, result = 0, b;
      do { b = str.charCodeAt(i++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
      const d = (result & 1) ? ~(result >> 1) : (result >> 1);
      if (k === 0) lat += d; else lon += d;
    }
    pts.push([lat / 1e5, lon / 1e5]);
  }
  return pts;
}
function encodePolyline(pts) {
  let out = '', pLat = 0, pLon = 0;
  const enc = v => { v = v < 0 ? ~(v << 1) : (v << 1); let s = ''; while (v >= 0x20) { s += String.fromCharCode((0x20 | (v & 0x1f)) + 63); v >>= 5; } return s + String.fromCharCode(v + 63); };
  for (const [la, lo] of pts) {
    const iLat = Math.round(la * 1e5), iLon = Math.round(lo * 1e5);
    out += enc(iLat - pLat) + enc(iLon - pLon); pLat = iLat; pLon = iLon;
  }
  return out;
}
function simplify(pts, tolM) {
  if (pts.length < 3) return pts.slice();
  const lat0 = pts[0][0] * Math.PI / 180, mLat = 111320, mLon = 111320 * Math.cos(lat0);
  const xy = pts.map(p => [p[1] * mLon, p[0] * mLat]);
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop(); let maxD = 0, idx = -1;
    const [x1, y1] = xy[s], [x2, y2] = xy[e], dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy;
    for (let i = s + 1; i < e; i++) {
      const [x, y] = xy[i];
      let t = L2 ? ((x - x1) * dx + (y - y1) * dy) / L2 : 0; t = Math.max(0, Math.min(1, t));
      const d = Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > tolM && idx > 0) { keep[idx] = 1; stack.push([s, idx], [idx, e]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const r5 = n => Math.round(n * 1e5) / 1e5;
const r1 = n => Math.round(n * 10) / 10;

/* =====================================================================
   Geocodificación
   ===================================================================== */
function inBox(lat, lon) { return lat > 3.9 && lat < 5.6 && lon > -76.3 && lon < -74.9; }
function shortName(d) { return String(d || '').split(',').slice(0, 3).join(',').trim(); }

async function geocodePOI(id, def) {
  // Coordenadas manuales (p. ej. finca privada que no está en OSM): exigir fuente verificable
  if (def.lat != null && def.lon != null) {
    if (!def.fuente) throw new Error(`El punto ${id} tiene coordenadas manuales sin 'fuente'.`);
    return { lat: r5(+def.lat), lon: r5(+def.lon), fuente: 'Manual · ' + def.fuente };
  }
  const url = `${NOMINATIM}/search?format=jsonv2&limit=5&countrycodes=co&addressdetails=0&accept-language=es&viewbox=${VIEWBOX}&bounded=1&q=${encodeURIComponent(def.q)}`;
  const res = await getJSON(url);
  const list = (res || []).filter(r => inBox(+r.lat, +r.lon));
  const hit = (def.pick && list.find(def.pick)) || list[0];
  if (!hit) throw new Error(`No se pudo geocodificar "${def.q}" (${id}). Añade una regla 'pick' o revisa la consulta.`);
  return {
    lat: r5(+hit.lat), lon: r5(+hit.lon),
    fuente: `OSM Nominatim · ${hit.osm_type}/${hit.osm_id} · ${shortName(hit.display_name)}`
  };
}

async function geocodeTown(id, def) {
  const url = `${NOMINATIM}/search?format=jsonv2&limit=5&countrycodes=co&featureType=settlement&extratags=1&accept-language=es&q=${encodeURIComponent(def.nombre + ', ' + def.departamento)}`;
  const res = (await getJSON(url)) || [];
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const cands = res.filter(r => /city|town|village/.test(r.addresstype || '') && inBox(+r.lat, +r.lon));
  const hit = cands.find(r => (r.extratags || {}).wikidata === def.wikidata) || cands.find(r => norm(r.name) === norm(def.nombre)) || cands[0];
  // Verificación cruzada con Wikidata P625 (coordenada de la cabecera)
  const wd = await getJSON(`${WIKIDATA}?action=wbgetclaims&entity=${def.wikidata}&property=P625&format=json`);
  const v = wd && wd.claims && wd.claims.P625 && wd.claims.P625[0].mainsnak.datavalue.value;
  if (!hit && !v) throw new Error('Sin coordenadas para el pueblo ' + id);
  if (hit && v) {
    const d = haversineKm([+hit.lat, +hit.lon], [v.latitude, v.longitude]);
    if (d <= WD_MAX_KM) return { lat: r5(+hit.lat), lon: r5(+hit.lon), fuente: `OSM Nominatim · ${hit.osm_type}/${hit.osm_id} (verificado con Wikidata ${def.wikidata}, Δ ${d.toFixed(2)} km)` };
    return { lat: r5(v.latitude), lon: r5(v.longitude), fuente: `Wikidata ${def.wikidata} (P625); Nominatim difería ${d.toFixed(1)} km (centroide municipal)` };
  }
  if (v) return { lat: r5(v.latitude), lon: r5(v.longitude), fuente: `Wikidata ${def.wikidata} (P625)` };
  return { lat: r5(+hit.lat), lon: r5(+hit.lon), fuente: `OSM Nominatim · ${hit.osm_type}/${hit.osm_id}`, validar: true };
}

/* =====================================================================
   OSRM
   ===================================================================== */
const ll = p => `${p.lon},${p.lat}`;
async function osrmTable(points) {
  // points: [{id,lat,lon}] → matriz NxN (km, min). Troceado para no superar límites del servidor público.
  const n = points.length, km = [...Array(n)].map(() => Array(n).fill(null)), min = [...Array(n)].map(() => Array(n).fill(null));
  const CH = 25;
  for (let a = 0; a < n; a += CH) {
    for (let b = 0; b < n; b += CH) {
      const src = points.slice(a, a + CH), dst = points.slice(b, b + CH);
      const coords = src.concat(dst);
      const url = `${OSRM}/table/v1/driving/${coords.map(ll).join(';')}?sources=${src.map((_, i) => i).join(';')}&destinations=${dst.map((_, i) => i + src.length).join(';')}&annotations=distance,duration`;
      const j = await getJSON(url);
      if (!j || j.code !== 'Ok') throw new Error('OSRM table falló: ' + (j && j.code));
      src.forEach((_, i) => dst.forEach((__, k) => {
        const dist = j.distances[i][k], dur = j.durations[i][k];
        km[a + i][b + k] = dist == null ? null : r1(dist / 1000);
        min[a + i][b + k] = dur == null ? null : Math.round(dur / 60);
      }));
    }
  }
  return { km, min };
}
async function osrmRoute(seq) {
  const url = `${OSRM}/route/v1/driving/${seq.map(ll).join(';')}?overview=full&geometries=polyline&steps=false`;
  const j = await getJSON(url);
  if (!j || j.code !== 'Ok' || !j.routes || !j.routes[0]) throw new Error('OSRM route falló: ' + (j && j.code));
  const r = j.routes[0];
  const raw = decodePolyline(r.geometry);
  const simp = simplify(raw, SIMPLIFY_M);
  return {
    km: r1(r.distance / 1000), min: Math.round(r.duration / 60),
    polyline: encodePolyline(simp), puntos: simp.length, puntos_original: raw.length,
    tramos: r.legs.map(l => ({ km: r1(l.distance / 1000), min: Math.round(l.duration / 60) })),
    ajuste_m: j.waypoints.map(w => Math.round(w.distance))
  };
}

/* =====================================================================
   Principal
   ===================================================================== */
(async function main() {
  const yenny = JSON.parse(fs.readFileSync(YENNY, 'utf8'));
  const tours = yenny.tours || [];
  const ids = tours.map(t => t.id_web);
  const missing = ids.filter(id => !LUGARES[id]);
  const extra = Object.keys(LUGARES).filter(id => !ids.includes(id));
  if (missing.length) { console.error('✗ Tours de yenny.json sin entrada en LUGARES:', missing.join(', ')); process.exit(1); }
  if (extra.length) console.warn('! Entradas en LUGARES que no existen en yenny.json:', extra.join(', '));
  // Categorías del sitio (js/data.js) para colorear marcadores sin depender de la página
  const CAT = {};
  try {
    const src = fs.readFileSync(path.join(ROOT, 'js', 'data.js'), 'utf8');
    const T = new Function(src + '\n;return typeof TOURS !== "undefined" ? TOURS : [];')();
    for (const x of T) CAT[x.id] = x.cat;
    const sinGeo = T.map(x => x.id).filter(id => !LUGARES[id]);
    if (sinGeo.length) console.warn('! Tours de js/data.js sin datos en yenny.json (no se mapean):', sinGeo.join(', '));
  } catch (e) { console.warn('! No se pudo leer js/data.js para categorías:', e.message); }

  // 1) Geocodificar
  const P = {}; // id → {id,nombre,lat,lon,fuente,…}
  const hubs = [];
  for (const h of HUBS) {
    const g = await geocodePOI(h.id, h);
    const o = { id: h.id, tipo: h.tipo, nombre: h.nombre, municipio: h.municipio, departamento: h.departamento, lat: g.lat, lon: g.lon, fuente: g.fuente };
    if (h.nota) o.nota = h.nota;
    hubs.push(o); P[h.id] = o;
    console.log('hub   ', h.id.padEnd(20), g.lat, g.lon);
  }
  for (const [id, def] of Object.entries(PUNTOS)) {
    const g = await geocodePOI(id, def);
    P[id] = { id, nombre: def.nombre, municipio: def.municipio, departamento: def.departamento, lat: g.lat, lon: g.lon, fuente: g.fuente };
    if (def.extensa) P[id].extensa = true;
    if (def.validar) P[id].validar = true;
    if (def.nota) P[id].nota = def.nota;
    console.log('punto ', id.padEnd(20), g.lat, g.lon);
  }
  for (const [id, def] of Object.entries(PUEBLOS)) {
    if (def.hub) { const h = P[def.hub]; P[id] = P[id] || { id, nombre: def.nombre, departamento: def.departamento, lat: h.lat, lon: h.lon, fuente: h.fuente + ' (Plaza de Bolívar)' }; continue; }
    const g = await geocodeTown(id, def);
    P[id] = { id, nombre: def.nombre, municipio: def.nombre, departamento: def.departamento, lat: g.lat, lon: g.lon, fuente: g.fuente };
    if (g.validar) P[id].validar = true;
    console.log('pueblo', id.padEnd(20), g.lat, g.lon, g.fuente.slice(0, 60));
  }

  // 2) Matriz de distancias OSRM (todas contra todas, sin áreas extensas)
  const matIds = Object.keys(P).filter(id => !P[id].extensa);
  const tbl = await osrmTable(matIds.map(id => P[id]));
  const idx = Object.fromEntries(matIds.map((id, i) => [id, i]));
  const dist = (a, b) => (idx[a] == null || idx[b] == null) ? null : { km: tbl.km[idx[a]][idx[b]], min: tbl.min[idx[a]][idx[b]] };
  const desdeBases = id => {
    const o = {};
    for (const h of ['armenia', 'pereira', 'manizales', 'axm', 'pei']) { const d = dist(h, id); if (d && d.km != null) o[h] = d; }
    return o;
  };
  const nearestBase = (id, allowed) => {
    let best = null;
    for (const b of (allowed && allowed.length ? allowed : BASES)) { const d = dist(b, id); if (d && d.min != null && (!best || d.min < best.min)) best = { id: b, min: d.min }; }
    return best ? best.id : 'armenia';
  };

  // 3) Lugares por tour + rutas
  const lugares = {}; const validar = [];
  const routeCache = {};
  for (const t of tours) {
    const id = t.id_web, L = LUGARES[id];
    const base = { tipo: L.tipo, nombre_lugar: L.nombre_lugar, tour: t.nombre, codigo: t.codigo, cat: CAT[id] || null, duracion_h: t.duracion_horas == null ? null : t.duracion_horas };
    if (L.tipo === 'movil') {
      lugares[id] = Object.assign(base, { modalidad: L.modalidad || 'hotel', servicio: L.servicio || ['armenia'], ruta: null, fuente: 'data/yenny.json (notas del portafolio 2026)', nota: L.nota });
      continue;
    }
    if (L.generica) {
      const s = (L.servicio || ['armenia']);
      const c = P[s[0]];
      lugares[id] = Object.assign(base, {
        generica: true, municipio: null, departamento: null,
        lat: c.lat, lon: c.lon, radio_km: RADIO_SERVICIO_KM, servicio: s, hub: s[0], ruta: null,
        fuente: 'Área de servicio (centro = Plaza de Bolívar de la base; radio fijo ' + RADIO_SERVICIO_KM + ' km). Sin lugar documentado.',
        nota: L.nota, validar: true
      });
      validar.push(id);
      continue;
    }
    const pt = P[L.punto];
    if (!pt) throw new Error('Punto desconocido ' + L.punto + ' en ' + id);
    const hub = L.hub || nearestBase(L.acceso || L.punto);
    const o = Object.assign(base, {
      municipio: L.municipio || pt.municipio || null, departamento: L.departamento || pt.departamento || null,
      lat: pt.lat, lon: pt.lon, punto: L.punto, hub,
      fuente: pt.fuente, nota: L.nota || pt.nota || ''
    });
    if (L.acceso) { const a = P[L.acceso]; o.acceso = { id: L.acceso, nombre: a.nombre, lat: a.lat, lon: a.lon, a_pie_km: r1(haversineKm([a.lat, a.lon], [pt.lat, pt.lon])) }; }
    if (L.paradas) o.paradas = L.paradas.map(pid => ({ id: pid, nombre: P[pid].nombre, lat: P[pid].lat, lon: P[pid].lon }));
    if (L.alternativas) {
      o.alternativas = L.alternativas.map(aid => {
        const a = P[aid]; const x = { id: aid, nombre: a.nombre, municipio: a.municipio, lat: a.lat, lon: a.lon, fuente: a.fuente };
        if (a.extensa) { x.extensa = true; x.nota = a.nota; } else x.desde = desdeBases(aid);
        return x;
      });
    }
    if (L.tipo === 'zona') {
      // Radio: el indicado o el que abarca las alternativas no extensas (mín. 5 km, máx. 40 km)
      let rad = L.radio_km || 5;
      if (!L.radio_km && o.alternativas) for (const a of o.alternativas) if (!a.extensa) rad = Math.max(rad, haversineKm([pt.lat, pt.lon], [a.lat, a.lon]) + 3);
      o.radio_km = Math.min(40, Math.round(rad));
    }
    if (L.en_ciudad) o.en_ciudad = true;
    if (L.publico) o.publico = L.publico; // nota para el viajero (5 idiomas); `nota` es interna
    o.desde = desdeBases(L.acceso || L.punto);
    // Ruta: hub → paradas… (o hub → acceso/punto)
    let seqIds = [hub].concat(L.paradas || [L.acceso || L.punto]);
    seqIds = seqIds.filter((v, i, arr) => i === 0 || v !== arr[i - 1]);
    if (seqIds.length >= 2 && !(L.en_ciudad && !L.paradas)) {
      const key = seqIds.join('>');
      routeCache[key] = routeCache[key] || await osrmRoute(seqIds.map(s => P[s]));
      const r = routeCache[key];
      o.ruta = { desde: hub, via: seqIds.slice(1), km: r.km, min: r.min, polyline: r.polyline, tramos: r.tramos, fuente: 'OSRM' };
      console.log('ruta  ', id.padEnd(20), key.padEnd(40), r.km + ' km', r.min + ' min', r.puntos + '/' + r.puntos_original + ' pts');
    } else {
      o.ruta = null;
    }
    if (L.validar || pt.validar) { o.validar = true; validar.push(id); }
    lugares[id] = o;
  }

  // 4) Pueblos con matriz desde Armenia, Pereira y Manizales
  const pueblos = {};
  for (const id of Object.keys(PUEBLOS)) {
    const p = P[id];
    pueblos[id] = { nombre: PUEBLOS[id].nombre, departamento: PUEBLOS[id].departamento, lat: p.lat, lon: p.lon, fuente: p.fuente, desde: {} };
    for (const b of BASES) { const d = dist(b, id); if (d) pueblos[id].desde[b] = d; }
  }

  // 5) Puntos de interés (para alternativas, itinerarios y matriz)
  const puntos = {};
  for (const id of Object.keys(PUNTOS)) { const p = P[id]; puntos[id] = Object.assign({}, p); delete puntos[id].id; }

  // 6) Salida
  const count = { fijo: 0, zona: 0, zona_generica: 0, movil: 0, con_ruta: 0 };
  for (const l of Object.values(lugares)) { if (l.generica) count.zona_generica++; else count[l.tipo]++; if (l.ruta) count.con_ruta++; }
  const out = {
    _meta: {
      descripcion: 'Geodatos de Espontáneos Travel para js/maps.js: hubs, lugares por tour, pueblos y distancias por carretera precalculadas.',
      generado: new Date().toISOString(),
      generador: 'tools/build-geo.js',
      tours_fuente: 'data/yenny.json (vigencia ' + (yenny._meta && yenny._meta.vigencia) + ')',
      vigencia: (yenny._meta && yenny._meta.vigencia) || null,
      nota_vigencia: 'Distancias y tiempos de OSRM sin tráfico (vías de montaña: pueden tardar más). Zonas genéricas y lugares marcados validar:true deben confirmarse con el área de operaciones. Regenerar con: node tools/build-geo.js',
      fuentes: [
        'OpenStreetMap Nominatim (geocodificación) — https://nominatim.openstreetmap.org',
        'Wikidata P625 (verificación de cabeceras municipales) — https://www.wikidata.org',
        'OSRM, perfil driving (rutas y matriz) — https://router.project-osrm.org',
        'El País (Cali): ubicación del Laberinto Mil Caminos en la vereda Morelia Alta, Quimbaya'
      ],
      atribucion: {
        datos: '© OpenStreetMap contributors (ODbL 1.0)',
        teselas: '© OpenStreetMap contributors © CARTO',
        rutas: 'Rutas: OSRM (Project OSRM), datos © OpenStreetMap contributors',
        html: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> · Rutas: <a href="https://project-osrm.org/">OSRM</a>'
      },
      unidades: { km: 'kilómetros por carretera (1 decimal)', min: 'minutos estimados (OSRM)', polyline: 'Google encoded polyline, precisión 5, simplificada (Douglas–Peucker ' + SIMPLIFY_M + ' m)' },
      conteo: count,
      validar
    },
    hubs,
    lugares,
    pueblos,
    puntos,
    matriz: { ids: matIds, km: tbl.km, min: tbl.min }
  };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  const size = fs.statSync(OUT).size;
  console.log(`\n✓ ${path.relative(ROOT, OUT)} — ${(size / 1024).toFixed(1)} KB · ${Object.keys(lugares).length} tours · ${JSON.stringify(count)} · llamadas de red: ${netCalls}`);
  if (validar.length) console.log('  VALIDAR:', validar.join(', '));
})().catch(e => { console.error('✗', e.message); process.exit(1); });
