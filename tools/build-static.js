/* Genera el HTML base en español dentro de index.html (SEO / sin JavaScript).
   Uso:  node tools/build-static.js
   Rellena los bloques <!-- BUILD:x:start --> … <!-- BUILD:x:end --> con las mismas
   plantillas que usa el navegador (js/render.js). Volver a ejecutar tras cambiar
   data/jenny.json, js/data.js o las fotos (tools/localize_images.py). */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

// Contexto tipo navegador para los scripts clásicos
const ctx = { window: {}, console };
ctx.window = ctx; ctx.self = ctx; ctx.location = { pathname: "/index.html", href: "https://www.espontaneostravel.com/" };
vm.createContext(ctx);
const run = (p, tail) => vm.runInContext(read(p) + (tail || ""), ctx, { filename: p });
run("js/data.js", "\n;globalThis.TOURS=TOURS;globalThis.CATEGORIES=CATEGORIES;globalThis.GALLERY=typeof GALLERY!=='undefined'?GALLERY:[];");
run("js/i18n.js", "\n;globalThis.I18N=I18N;");
run("js/i18n-2026.js", "\n;globalThis.I18N_2026=I18N_2026;");
if (fs.existsSync(path.join(ROOT, "js/img-local.js"))) run("js/img-local.js");
run("js/plans.js");
const IMG = ctx.IMG_LOCAL || { drive: {}, local: {}, tours: {} };
const { TOURS, CATEGORIES, GALLERY, EspoPlans } = ctx;
const T = Object.assign({}, ctx.I18N.es, (typeof ctx.I18N_EXTRA !== "undefined" && ctx.I18N_EXTRA.es) || {}, ctx.I18N_2026.es);
const t = (k) => T[k] || k;

const D = require("../js/jenny-data.js").use(JSON.parse(read("data/jenny.json")), {});
const R = require("../js/render.js");
const FAQ = require("../js/faq.js");
const esc = R.esc;
const PENDING = ["rodizio", "alimentacion"];

function photo(tour) {
  const n = IMG.tours && IMG.tours[tour.id];
  if (n) return { src: `assets/img/t/${tour.id}-1-640.webp`, srcset: `assets/img/t/${tour.id}-1-640.webp 640w, assets/img/t/${tour.id}-1-1600.webp 1600w` };
  if (tour.cover && tour.cover.startsWith("local:")) {
    const name = tour.cover.slice(6), base = "assets/img/" + name.replace(/\.(jpe?g|png)$/i, "");
    return IMG.local && IMG.local[name] ? { src: base + "-640.webp", srcset: `${base}-640.webp 640w, ${base}-1600.webp 1600w` } : { src: "assets/img/" + name };
  }
  if (tour.cover && tour.cover.startsWith("url:")) return { src: tour.cover.slice(4) };
  if (!(tour.imgs || []).length && tour.fb && tour.fb.startsWith("local:") && tour.fb !== "local:laberinto.jpg") {
    const name = tour.fb.slice(6), base = "assets/img/" + name.replace(/\.(jpe?g|png)$/i, "");
    return IMG.local && IMG.local[name] ? { src: base + "-640.webp", srcset: `${base}-640.webp 640w, ${base}-1600.webp 1600w` } : { src: "assets/img/" + name };
  }
  const id = (tour.imgs || [])[0];
  if (id && IMG.drive && IMG.drive[id]) return { src: `assets/img/d/${id}-640.webp`, srcset: `assets/img/d/${id}-640.webp 640w, assets/img/d/${id}-1600.webp 1600w` };
  if (id) return { src: `https://lh3.googleusercontent.com/d/${id}=w800`, attrs: ` data-drive="${id}" data-w="800" data-h="560" data-stage="0" onerror="window.__imgErr&&window.__imgErr(this)"` };
  return { src: "assets/img/icon-512.png" };
}
const catLabel = (c) => { const x = CATEGORIES.find(k => k.id === c); return x ? x.es : c; };

const tours = TOURS.filter(x => PENDING.indexOf(x.id) < 0 && D.published(x.id));
const cards = tours.map((tour, i) => R.card(tour, D.tour(tour.id, "es"), {
  t, lang: "es", catLabel, summary: (tour.sum && tour.sum.es) || "", delay: (i % 3) + 1,
  fmtDur: n => D.fmtDur(n, "es"), fmtHorario: h => D.fmtHorario(h, "es"), durBucket: n => D.durBucket(n),
  img: photo(tour)
})).join("\n");

const sug = EspoPlans.plans().map(p => ({ id: p.id, days: p.days, nombre: EspoPlans.name(p, "es"),
  stops: p.stops.filter(s => s.tour).map(s => (p.days > 1 ? "Día " + s.d + " · " : "") + ((D.tour(s.tour, "es") || {}).nombre || s.tour)) }));
const planes = R.planes(D.planes("es"), sug, { t, noIncluye: D.planesNoIncluye("es"),
  waPlan: name => "https://wa.me/573187200023?text=" + encodeURIComponent(t("wa_plan_msg").replace("{plan}", name)) });

const sost = R.sost(D.sost("es"), { t });
const faq = R.faq(FAQ.items(D, "es"));

const gal = [["palma2.jpg", "Palmas de cera"], ["paramo.jpg", "Páramo"], ["termales.jpg", "Aguas termales"],
  ["botanico.jpg", "Jardín Botánico del Quindío"], ["manizales.jpg", "Manizales"], ["cartago.jpg", "Cartago"], ["palma1.jpg", "Palma de cera"], ["pereira.jpg", "Pereira"]]
  .filter(([n]) => IMG.local && IMG.local[n])
  .map(([n, cap], i) => { const b = "assets/img/" + n.replace(/\.jpe?g$/i, ""); return `<figure class="gallery__item" data-idx="${i}"><img src="${b}-640.webp" srcset="${b}-640.webp 640w, ${b}-1600.webp 1600w" sizes="(max-width: 700px) 92vw, 380px" alt="${esc(cap)}" loading="lazy" decoding="async" width="640" height="480"><figcaption class="gallery__cap">${esc(cap)}</figcaption></figure>`; })
  .join("\n");

let html = read("index.html");
function put(name, content) {
  const re = new RegExp(`(<!-- BUILD:${name}:start -->)[\\s\\S]*?(<!-- BUILD:${name}:end -->)`);
  if (!re.test(html)) throw new Error("Falta el bloque BUILD:" + name);
  html = html.replace(re, `$1\n${content}\n$2`);
}
put("tours", cards); put("planes", planes); put("sost", sost); put("faq", faq); put("gallery", gal);
fs.writeFileSync(path.join(ROOT, "index.html"), html);
console.log(`index.html: ${tours.length} tarjetas, ${D.planes("es").length} planes + ${sug.length} itinerarios, ${FAQ.items(D, "es").length} preguntas, galería ${gal ? gal.split("<figure").length - 1 : 0}`);
void GALLERY;
