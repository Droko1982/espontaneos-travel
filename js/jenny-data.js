/* ==========================================================================
   Espontáneos Travel — Fuente única de datos de Jenny (data/jenny.json)
   Lo usan: el sitio (tarjetas, FAQ, sostenibilidad), Jenny (bot.js), el
   conserje (concierge.js), el panel y el portal. También funciona en Node
   (tools/build-static.js) para generar el HTML base en español (SEO).
   Traducciones: data/jenny.i18n.json (en, fr, de, pt). Español = fuente.
   ========================================================================== */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.EspoData = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  let Y = null, I = null, loading = null;

  /* ---------- Carga ---------- */
  function load(base) {
    if (Y) return Promise.resolve(api);
    if (loading) return loading;
    base = base || "";
    const get = (u) => fetch(base + u, { cache: "no-cache" }).then(r => (r.ok ? r.json() : null)).catch(() => null);
    loading = Promise.all([get("data/jenny.json"), get("data/jenny.i18n.json")]).then(([y, i]) => {
      if (!y) throw new Error("jenny.json");
      Y = y; I = i || {};
      return api;
    });
    return loading;
  }
  function use(y, i) { Y = y; I = i || {}; return api; }     // para Node / pruebas
  const ready = () => !!Y;

  /* ---------- Traducción con respaldo en español ---------- */
  function tr(lang) { return (lang && lang !== "es" && I && I[lang]) || null; }
  function pick(es, t) {
    if (t == null) return es;
    if (Array.isArray(es)) return Array.isArray(t) && t.length === es.length ? t : es;
    if (typeof es === "string") return typeof t === "string" && t ? t : es;
    return t;
  }

  /* ---------- Tours ---------- */
  function rawTour(id) { return Y && Y.tours.find(t => t.id_web === id) || null; }
  function published(id) { return !Y || !!rawTour(id); }
  function tour(id, lang) {
    const t = rawTour(id); if (!t) return null;
    const x = (tr(lang) && tr(lang).tours && tr(lang).tours[id]) || {};
    const rec = t.recomendacion || {}; const xr = x.recomendacion || {};
    return {
      id: t.id_web, codigo: t.codigo, dur: t.duracion_horas, horario: t.horario || null,
      nombre: pick(t.nombre, x.nombre),
      incluye: pick(t.incluye || [], x.incluye),
      no_incluye: pick(t.no_incluye || [], x.no_incluye),
      notas: pick(t.notas || [], x.notas),
      horario_nota: t.horario && t.horario.nota ? pick(t.horario.nota, x.horario && x.horario.nota) : "",
      precio_publico: t.precio_publico ? pick(t.precio_publico, x.precio_publico) : "",
      rec: { fuente: rec.fuente || "", titulo: pick(rec.titulo || "", xr.titulo), items: pick(rec.items || [], xr.items) }
    };
  }
  function tours(lang) { return Y ? Y.tours.map(t => tour(t.id_web, lang)) : []; }

  /* ---------- Árbol, planes, textos generales ---------- */
  function node(id, lang) {
    const n = Y && Y.arbol.find(a => a.id === id); if (!n) return null;
    const x = (tr(lang) && tr(lang).arbol && tr(lang).arbol[id]) || {};
    const out = Object.assign({}, n);
    ["respuesta", "jenny", "itinerario", "precio_publico", "operacion"].forEach(k => { if (n[k]) out[k] = pick(n[k], x[k]); });
    ["pregunta_tipo", "incluye", "no_incluye", "no_opera"].forEach(k => { if (n[k]) out[k] = pick(n[k], x[k]); });
    return out;
  }
  function planes(lang) {
    if (!Y) return [];
    const x = (tr(lang) && tr(lang).planes) || {};
    return Y.planes.map(p => Object.assign({}, p, { nombre: pick(p.nombre, x[p.id] && x[p.id].nombre), incluye: pick(p.incluye, x[p.id] && x[p.id].incluye) }));
  }
  function planesNoIncluye(lang) { return Y ? pick(Y.planes_no_incluye, tr(lang) && tr(lang).planes_no_incluye) : ""; }
  function general(key, lang) { return Y ? pick(Y.general[key], tr(lang) && tr(lang).general && tr(lang).general[key]) : ""; }
  function sost(lang) {
    if (!Y) return null;
    const s = Y.sostenibilidad, x = (tr(lang) && tr(lang).sostenibilidad) || {};
    const xp = x.pilares || {}, xh = x.historias || {};
    return {
      eyebrow: pick(s.eyebrow, x.eyebrow), titulo: pick(s.titulo, x.titulo), intro: pick(s.intro, x.intro),
      pilares: s.pilares.map(p => ({ id: p.id, icono: p.icono, nombre: pick(p.nombre, xp[p.id] && xp[p.id].nombre),
        titulo: pick(p.titulo, xp[p.id] && xp[p.id].titulo), acciones: pick(p.acciones, xp[p.id] && xp[p.id].acciones) })),
      historias: s.historias.map(h => ({ nombre: h.nombre, rol: pick(h.rol, xh[h.nombre] && xh[h.nombre].rol), texto: pick(h.texto, xh[h.nombre] && xh[h.nombre].texto) }))
    };
  }
  function contacto() { return (Y && Y.contacto) || { whatsapp: "573187200023", rnt: "91795", correo: "info@espontaneostravel.com" }; }
  function meta() { return (Y && Y._meta) || {}; }

  /* ---------- Formatos ---------- */
  function hhmm(s, lang) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(s || ""); if (!m) return s || "";
    const h = +m[1], mi = m[2];
    if (lang === "en") return ((h % 12) || 12) + ":" + mi + (h < 12 ? " AM" : " PM");
    if (lang === "fr") return h + " h " + mi;
    if (lang === "de") return h + ":" + mi + " Uhr";
    if (lang === "pt") return h + "h" + (mi === "00" ? "" : mi);
    return ((h % 12) || 12) + ":" + mi + (h < 12 ? " a. m." : " p. m.");
  }
  const L = {
    es: { fijo1: "Recogida a las {h}", fijoN: "Recogida: {h}", ventana: "Inicio entre {a} y {b}", desde: "Desde las {h}", tbd: "Horario a convenir", and: " o ", dur: "{n} h" },
    en: { fijo1: "Pickup at {h}", fijoN: "Pickup: {h}", ventana: "Start between {a} and {b}", desde: "From {h}", tbd: "Time to be arranged", and: " or ", dur: "{n} h" },
    fr: { fijo1: "Départ à {h}", fijoN: "Départ : {h}", ventana: "Début entre {a} et {b}", desde: "À partir de {h}", tbd: "Horaire à convenir", and: " ou ", dur: "{n} h" },
    de: { fijo1: "Abholung um {h}", fijoN: "Abholung: {h}", ventana: "Start zwischen {a} und {b}", desde: "Ab {h}", tbd: "Uhrzeit nach Absprache", and: " oder ", dur: "{n} Std." },
    pt: { fijo1: "Saída às {h}", fijoN: "Saída: {h}", ventana: "Início entre {a} e {b}", desde: "A partir das {h}", tbd: "Horário a combinar", and: " ou ", dur: "{n} h" }
  };
  function fmtHorario(h, lang) {
    const l = L[lang] || L.es;
    if (!h) return l.tbd;
    if (h.tipo === "fijo" && h.horas && h.horas.length) {
      const hs = h.horas.map(x => hhmm(x, lang));
      return hs.length === 1 ? l.fijo1.replace("{h}", hs[0]) : l.fijoN.replace("{h}", hs.join(l.and));
    }
    if (h.tipo === "ventana") return l.ventana.replace("{a}", hhmm(h.desde, lang)).replace("{b}", hhmm(h.hasta, lang));
    if (h.tipo === "desde") return l.desde.replace("{h}", hhmm(h.hora, lang));
    return l.tbd;
  }
  function fmtDur(n, lang) {
    if (n == null) return "";
    const v = Number.isInteger(n) ? String(n) : String(n).replace(".", lang === "en" ? "." : ",");
    return (L[lang] || L.es).dur.replace("{n}", v);
  }
  // Agrupación por duración para filtros: corta (≤2 h), media (3–5 h), día completo (≥6 h)
  function durBucket(n) { if (n == null) return ""; return n <= 2 ? "corta" : n <= 5 ? "media" : "completa"; }

  const api = { load, use, ready, published, tour, tours, node, planes, planesNoIncluye, general, sost, contacto, meta, fmtHorario, fmtDur, hhmm, durBucket };
  return api;
});
