/**
 * Espontáneos Travel — Guarda en Google Sheets cada cliente que atiende Yenny
 * (escaneos de QR de itinerario, resúmenes y envíos a WhatsApp). Gratis, sin servidor.
 *
 * INSTALACIÓN (≈5 minutos):
 * 1. Crea una hoja de cálculo en Google Sheets (ej. "Clientes Yenny").
 * 2. Menú Extensiones → Apps Script. Borra lo que haya y pega TODO este archivo.
 * 3. Cambia CLAVE_PANEL por una clave tuya: es la que escribirás en el panel del
 *    anfitrión para ver los clientes. No la compartas.
 * 4. Implementar → Nueva implementación → tipo "Aplicación web".
 *      Ejecutar como: Yo · Quién tiene acceso: Cualquier usuario.
 *    Autoriza los permisos y copia la URL que termina en /exec.
 * 5. Pega esa URL en js/plans.js → BIZ.leadsEndpoint y publica el sitio.
 *
 * Si luego cambias este código: Implementar → Gestionar implementaciones → Editar →
 * Versión: "Nueva versión" (la URL se mantiene).
 */
const CLAVE_PANEL = "CAMBIA-ESTA-CLAVE";
const HOJA = "Clientes";
const COLUMNAS = ["fecha", "etapa", "leadId", "itinerario", "experiencia", "nombre", "inicio", "personas",
  "alojamiento", "accesible", "alimentacion", "notas", "kit", "origen", "idioma", "enlace", "pagina"];
const ETAPAS = ["qr_visita", "resumen", "whatsapp"];

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(HOJA);
  if (!sh) { sh = ss.insertSheet(HOJA); sh.appendRow(COLUMNAS); sh.setFrozenRows(1); }
  return sh;
}

// Recorta el texto y evita que se interprete como fórmula (=, +, -, @)
function limpio_(v, max) {
  const s = (v == null ? "" : String(v)).slice(0, max || 300);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// Lo envía el sitio (Yenny) con cada evento
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const d = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (ETAPAS.indexOf(d.stage) < 0) return texto_("ignorado");
    hoja_().appendRow([
      new Date(), d.stage, limpio_(d.leadId, 30), limpio_(d.plan, 80), limpio_(d.tour, 80), limpio_(d.name, 60),
      limpio_(d.date, 10), limpio_(d.party, 3), limpio_(d.hotel, 80), d.access ? "sí" : "", limpio_(d.diet, 80),
      limpio_(d.notes, 160), d.kit ? "sí" : "", limpio_(d.src, 40), limpio_(d.lang, 2), limpio_(d.link, 3000), limpio_(d.page, 40)
    ]);
    return texto_("ok");
  } catch (err) {
    return texto_("error");
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

// Lectura para el panel del anfitrión (requiere la clave)
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (CLAVE_PANEL === "CAMBIA-ESTA-CLAVE" || p.key !== CLAVE_PANEL) return json_({ error: "no autorizado" });
  const datos = hoja_().getDataRange().getValues();
  const cab = datos.shift();
  const filas = datos.slice(-300).reverse().map(function (r) {
    const o = {};
    cab.forEach(function (h, i) { o[h] = r[i] instanceof Date ? r[i].toISOString() : r[i]; });
    return o;
  });
  return json_({ total: datos.length, rows: filas });
}

function texto_(s) { return ContentService.createTextOutput(s); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
