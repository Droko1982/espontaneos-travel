/* ==========================================================================
   Espontáneos Travel — Conserje con Jenny (motor). Zero-cost, estático.
   Carga data/bookings.json por ?code=, arma itinerario + chat multilingüe.
   ========================================================================== */
(function () {
  "use strict";
  const LANGS = [
    { code:"es", name:"ES" }, { code:"en", name:"EN" }, { code:"fr", name:"FR" },
    { code:"de", name:"DE" }, { code:"pt", name:"PT" }
  ];
  const SUPPORTED = LANGS.map(l => l.code);
  const $ = (s, c = document) => c.querySelector(s);
  const el = (t, cls, html) => { const e = document.createElement(t); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
  const bold = (s) => esc(s).replace(/\*(.+?)\*/g, "<b>$1</b>").replace(/\n/g, "<br>");

  let lang = "es", booking = null, busy = false;
  const U = () => CUI[lang] || CUI.es;
  const HAS_PLANS = typeof window.EspoPlans !== "undefined";
  const P = () => (HAS_PLANS ? EspoPlans.ui(lang) : {});

  function fill(str) {
    if (!booking) return str;
    const g = booking.guide || {}; const h = booking.hotel || {};
    const gl = (g.langs || []).map(c => (LANGS.find(x => x.code === c) || {}).name || c).join(" · ");
    return String(str)
      .replace(/{name}/g, booking.name || "")
      .replace(/{code}/g, booking.code || "")
      .replace(/{region}/g, booking.region || "")
      .replace(/{guide}/g, g.name || "—")
      .replace(/{guideLangs}/g, gl)
      .replace(/{host}/g, (booking.host || {}).name || "")
      .replace(/{hotel}/g, h.name || "")
      .replace(/{hotelArea}/g, h.area || "");
  }
  function waHost(msg) {
    const num = ((booking && booking.host && booking.host.phone) || "573187200023").replace(/\D/g, "");
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(fill(msg));
  }
  function mapsUrl(q) {
    const area = (booking && booking.hotel && booking.hotel.area) || "Eje Cafetero";
    return "https://www.google.com/maps/search/" + encodeURIComponent(q + " " + area);
  }
  function titleOf(it) { const t = it.title; if (typeof t === "string") return t; return (t && (t[lang] || t.es || t.en)) || ""; }

  /* ---------- Self-contained booking links (?d=base64) ---------- */
  function b64urlDecode(s) { s = String(s).replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; try { return decodeURIComponent(escape(atob(s))); } catch (e) { return null; } }
  function decodeBooking(s) { try { const j = b64urlDecode(s); return j ? JSON.parse(j) : null; } catch (e) { return null; } }

  /* ---------- Add to calendar (.ics) ---------- */
  const CAL_LABEL = { es: "Añadir a mi calendario", en: "Add to my calendar", fr: "Ajouter à mon calendrier", de: "Zu meinem Kalender", pt: "Adicionar ao meu calendário" };
  function pad2(n) { return String(n).padStart(2, "0"); }
  function icsFmt(d) { return d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()) + "T" + pad2(d.getHours()) + pad2(d.getMinutes()) + "00"; }
  const CAL_REMIND = {
    es: "Mañana viajas con Espontáneos Travel: revisa tu itinerario y qué llevar 🎒",
    en: "Tomorrow you travel with Espontáneos Travel: check your itinerary and what to pack 🎒",
    fr: "Demain vous voyagez avec Espontáneos Travel : vérifiez votre itinéraire et quoi emporter 🎒",
    de: "Morgen reist du mit Espontáneos Travel: prüfe deinen Reiseplan und was du mitnimmst 🎒",
    pt: "Amanhã você viaja com a Espontáneos Travel: confira seu roteiro e o que levar 🎒"
  };
  function icsText(s) { return String(s).replace(/\\/g, "\\\\").replace(/[,;]/g, m => "\\" + m).replace(/\n/g, "\\n"); }
  // RFC 5545: lines longer than 75 octets are folded (continuation lines start with a space)
  function icsFold(line) { const p = []; for (let i = 0; i < line.length; i += 70) p.push(line.slice(i, i + 70)); return p.join("\r\n "); }
  function buildICS() {
    const o = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Espontaneos Travel//Concierge//EN", "CALSCALE:GREGORIAN"];
    const items = booking.itinerary || [];
    items.forEach((it, i) => {
      const s = itemDate(it), e = new Date(s.getTime() + 90 * 60000);
      const title = icsText(fill(titleOf(it)));
      o.push("BEGIN:VEVENT", "UID:esp-" + ((booking.code || "x") + "-" + i) + "@espontaneostravel.com",
        "DTSTAMP:" + icsFmt(new Date()), "DTSTART:" + icsFmt(s), "DTEND:" + icsFmt(e),
        "SUMMARY:" + title,
        "LOCATION:" + icsText(booking.region || ""),
        "DESCRIPTION:" + icsText("Espontáneos Travel · " + (booking.code || "") + "\n" + location.href),
        "URL:" + location.href,
        "BEGIN:VALARM", "ACTION:DISPLAY", "TRIGGER:-PT1H", "DESCRIPTION:" + title, "END:VALARM");
      // Evening-before reminder, once per day (14 h before the first stop of the day)
      if (i === 0 || items[i - 1].date !== it.date)
        o.push("BEGIN:VALARM", "ACTION:DISPLAY", "TRIGGER:-PT14H", "DESCRIPTION:" + icsText(CAL_REMIND[lang] || CAL_REMIND.es), "END:VALARM");
      o.push("END:VEVENT");
    });
    o.push("END:VCALENDAR"); return o.map(icsFold).join("\r\n");
  }
  function downloadICS() {
    try { const blob = new Blob([buildICS()], { type: "text/calendar;charset=utf-8" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "mi-viaje-espontaneos.ics"; document.body.appendChild(a); a.click(); a.remove(); } catch (e) {}
  }

  /* ---------- Theme ---------- */
  function initTheme() {
    let s = null; try { s = localStorage.getItem("esp_theme"); } catch (e) {}
    if (s) document.documentElement.setAttribute("data-theme", s);
    paintThemeIcon();
  }
  function effTheme() { const a = document.documentElement.getAttribute("data-theme"); return a || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); }
  function paintThemeIcon() {
    const b = $("#c-theme"); if (!b) return;
    b.innerHTML = effTheme() === "dark"
      ? "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='5'/><path d='M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4'/></svg>"
      : "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z'/></svg>";
  }

  /* ---------- Dates ---------- */
  // Fechas tolerantes: acepta "8:00", "08:00", "8:00 am" y fechas AAAA-MM-DD
  function itemDate(it) {
    const d = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(String(it.date || "")); if (!d) return new Date(NaN);
    const m = /(\d{1,2})(?::(\d{2}))?\s*([ap])?\.?\s*m?/i.exec(String(it.time || "0:00")) || [];
    let h = +(m[1] || 0); const mi = +(m[2] || 0); if (m[3] && /p/i.test(m[3]) && h < 12) h += 12; if (m[3] && /a/i.test(m[3]) && h === 12) h = 0;
    return new Date(+d[1], +d[2] - 1, +d[3], h, mi, 0);
  }
  function fmtDay(it) {
    const d = itemDate(it); const now = new Date();
    const sameDay = (a, b) => a.toDateString() === b.toDateString();
    const tmr = new Date(now); tmr.setDate(now.getDate() + 1);
    if (sameDay(d, now)) return U().today;
    if (sameDay(d, tmr)) return U().tomorrow;
    try { return d.toLocaleDateString(lang, { weekday: "short", day: "numeric", month: "short" }); } catch (e) { return it.date; }
  }
  function nextIndex() {
    if (!booking || !booking.itinerary) return -1;
    const now = new Date();
    for (let i = 0; i < booking.itinerary.length; i++) { if (itemDate(booking.itinerary[i]) >= now) return i; }
    return -1;
  }

  /* ---------- Render ---------- */
  function renderHeader() {
    $("#c-langs").innerHTML = LANGS.map(l => `<button class="c-lang${l.code === lang ? " active" : ""}" data-l="${l.code}">${l.name}</button>`).join("");
    $$(".c-lang", $("#c-langs")).forEach(b => b.addEventListener("click", () => { lang = b.getAttribute("data-l"); renderAll(); }));
  }
  function renderBooking() {
    const g = booking.guide || {}; const h = booking.hotel || {};
    const gl = (g.langs || []).map(c => (LANGS.find(x => x.code === c) || {}).name || c).join(" · ");
    $("#c-welcome").innerHTML = `
      <div class="c-hello">${esc(U().brand)}</div>
      <h1>${esc(booking.name)} 👋</h1>
      <p class="c-region">📍 ${esc(booking.region || "")}</p>
      ${/pendiente|pending/i.test(booking.status || "") && P().pending ? `<p class="c-pending">${esc(P().pending)}</p>` : ""}
      <div class="c-chips-info">
        <span class="c-pill">${esc(U().status)}: <b>${esc(booking.code)}</b></span>
        <span class="c-pill">${esc(U().party)}: <b>${esc(booking.party || 1)}</b></span>
        <span class="c-pill">${esc(U().guide)}: <b>${esc(g.name || "—")}</b> ${gl ? "· " + esc(gl) : ""}</span>
        <span class="c-pill">${esc(U().hotel)}: <b>${esc(h.name || "—")}</b></span>
      </div>`;

    renderReview();

    // next stop
    const ni = nextIndex();
    const nextWrap = $("#c-next");
    if (ni >= 0) {
      const it = booking.itinerary[ni];
      nextWrap.style.display = "";
      nextWrap.innerHTML = `
        <span class="c-next__label">⏭️ ${esc(U().next_stop)}</span>
        <div class="c-next__row">
          <div><b>${esc(fill(titleOf(it)))}</b><span>${esc(fmtDay(it))} · ${esc(it.time || "")}</span></div>
          ${it.maps ? `<a class="c-mini" href="${esc(it.maps)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></a>` : ""}
        </div>${nextTips(it)}`;
    } else { nextWrap.style.display = "none"; }

    // itinerary
    $("#c-itin-title").textContent = U().itinerary;
    $("#c-itin").innerHTML = booking.itinerary.map((it, i) => `
      <li class="c-step${i === ni ? " now" : ""}">
        <span class="c-step__time">${esc(it.time || "")}<small>${esc(fmtDay(it))}</small></span>
        <span class="c-step__dot"></span>
        <span class="c-step__body">
          <b>${esc(fill(titleOf(it)))}</b>${stepFacts(it)}
          ${it.maps ? `<a href="${esc(it.maps)}" target="_blank" rel="noopener" class="c-step__map">${esc(U().maps_btn)} →</a>` : ""}
        </span>
      </li>`).join("");
    const calBtn = $("#c-cal"); if (calBtn) { const cl = $("#c-cal-label"); if (cl) cl.textContent = CAL_LABEL[lang] || CAL_LABEL.es; calBtn.onclick = downloadICS; }
    renderPack();
    renderRoute();

    // actions (sticky)
    const host = booking.host || {}; const drv = booking.driver || {};
    $("#c-actions").innerHTML = `
      <a class="btn btn--wa btn--sm" href="${waHost(U().wa_generic)}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z"/></svg>
        ${esc(U().wa_host)}</a>
      ${host.phone ? `<a class="btn btn--ghost btn--sm" href="tel:+${esc(host.phone.replace(/\D/g,''))}">${esc(U().call_host)}</a>` : ""}
      ${HAS_PLANS && EspoPlans.safePayLink(booking.payLink) ? `<a class="btn btn--primary btn--sm" href="${esc(EspoPlans.safePayLink(booking.payLink))}" target="_blank" rel="noopener">${esc(P().pay_deposit)}</a>` : ""}`;
  }

  /* ---------- Chat ---------- */
  function addMsg(html, who) { const m = el("div", "espo-msg " + who); m.innerHTML = html; $("#c-chat").appendChild(m); scroll(); return m; }
  function scroll() { const c = $("#c-chat"); c.scrollTop = c.scrollHeight; }
  function typing() { const t = el("div", "espo-typing", "<span></span><span></span><span></span>"); $("#c-chat").appendChild(t); scroll(); return t; }
  function botSay(list) {
    return new Promise(res => {
      busy = true; $("#c-chips").innerHTML = ""; const arr = Array.isArray(list) ? list.slice() : [list];
      const next = () => { if (!arr.length) { busy = false; res(); return; } const t = typing(); const msg = arr.shift(); setTimeout(() => { t.remove(); addMsg(bold(fill(msg)), "bot"); setTimeout(next, 150); }, 380 + Math.min(500, msg.length * 6)); };
      next();
    });
  }
  function chips(list) {
    const wrap = $("#c-chips"); wrap.innerHTML = "";
    list.forEach(c => {
      const b = el("button", "espo-chip" + (c.kind ? " espo-chip--" + c.kind : ""));
      b.innerHTML = (c.kind === "wa" ? "<svg viewBox='0 0 24 24' fill='currentColor'><path d='M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z'/></svg>" : "") + "<span>" + esc(c.label) + "</span>";
      b.addEventListener("click", () => onChip(c));
      wrap.appendChild(b);
    });
  }
  const PRIMARY = ["schedule", "change", "taxi", "lost", "restaurants", "money", "weather", "access", "health", "reco"];
  function menuChips(all) {
    const src = all ? CKB : CKB.filter(k => PRIMARY.indexOf(k.id) >= 0);
    const arr = src.map(k => ({ label: U()[k.menu], topic: k.id }));
    if (HAS_PLANS) arr.unshift({ label: P().m_pack, pack: true });
    if (HAS_PLANS && tripEnded()) arr.unshift({ label: P().review_btn, href: EspoPlans.reviewUrl() });
    if (!all) arr.push({ label: U().more_topics || "➕", more: true });
    return arr;
  }
  function startChat() {
    $("#c-chat").innerHTML = "";
    botSay([U().greet, U().menu_prompt]).then(() => chips(menuChips()));
  }
  function onChip(c) {
    if (busy) return;
    if (c.more) { chips(menuChips(true)); return; }
    if (c.pack) { addMsg("<span>" + esc(c.label) + "</span>", "user"); packChat(); return; }
    if (c.share) { window.open("https://wa.me/?text=" + encodeURIComponent(c.share), "_blank", "noopener"); backMenu(); return; }
    if (c.topic) {
      addMsg("<span>" + esc(U()[CKB.find(k => k.id === c.topic).menu]) + "</span>", "user");
      runTopic(c.topic);
    } else if (c.wa) { window.open(waHost(c.waMsg), "_blank", "noopener"); backMenu(); }
    else if (c.href) { window.open(c.href, "_blank", "noopener"); backMenu(); }
    else backMenu();
  }
  function backMenu() { botSay([U().more]).then(() => chips(menuChips())); }

  function allTopics() { return CKB.concat(typeof CKB_EXTRA !== "undefined" ? CKB_EXTRA : []); }
  function topicById(id) { return allTopics().find(x => x.id === id); }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function matchTopic(text) {
    const t = norm(text); if (!t || typeof CKB_KW === "undefined") return null;
    let best = null, score = 0;
    Object.keys(CKB_KW).forEach(id => {
      let s = 0; (CKB_KW[id] || []).forEach(k => { const nk = norm(k); if (nk && t.indexOf(nk) >= 0) s += nk.length > 3 ? 2 : 1; });
      if (s > score) { score = s; best = id; }
    });
    return score > 0 ? best : null;
  }
  // Temas que tienen respuesta oficial en data/jenny.json: se responde con esa (misma fuente que el sitio)
  const OFFICIAL = { weather: "clima", rain: "clima", access: "accesibilidad", children: "ninos_mayores", travelers: "ninos_mayores",
    payment: "pagos", cancellation: "cancelacion", airport: "traslados" };
  const ED = () => (window.EspoData && EspoData.ready() ? EspoData : null);
  const ROUTE_T = { es: "Tu ruta y distancias", en: "Your route & distances", fr: "Votre itinéraire et distances", de: "Ihre Route & Entfernungen", pt: "Sua rota e distâncias" };
  const TIPS_T = { es: "Para esta experiencia", en: "For this experience", fr: "Pour cette expérience", de: "Für dieses Erlebnis", pt: "Para esta experiência" };
  // Respaldo: temas oficiales de Jenny (data/jenny.json) por palabras clave + pregunta_tipo traducido
  const OFFICIAL_KW = {
    clima: ["clima", "lluvia", "llover", "llueve", "frio", "calor", "temperatura", "weather", "rain", "cold", "meteo", "pluie", "wetter", "regen", "chuva", "tempo"],
    pagos: ["pago", "pagar", "anticipo", "saldo", "nequi", "daviplata", "tarjeta", "payment", "pay", "deposit", "paiement", "zahlung", "pagamento"],
    cancelacion: ["cancel", "reembols", "refund", "annul", "storn"],
    accesibilidad: ["accesib", "silla de ruedas", "movilidad", "invidente", "wheelchair", "accessib", "barriere", "acessib"],
    ninos_mayores: ["nino", "bebe", "adulto mayor", "kid", "child", "senior", "enfant", "kinder", "crianca"],
    idiomas: ["idioma", "ingles", "language", "english", "langue", "sprache"],
    traslados: ["traslado", "aeropuerto", "airport", "aeroport", "flughafen", "aeroporto"],
    temporadas: ["temporada", "semana santa", "season", "saison"],
    sostenibilidad: ["sostenib", "sustainab", "durabl", "nachhaltig", "sustent"],
    empresa: ["quienes son", "empresa", "who are", "about you"],
    redes: ["instagram", "facebook", "redes sociales", "social media"],
    que_llevar: ["llevar", "empacar", "maleta", "ropa", "bring", "pack", "emporter", "mitnehmen", "levar"]
  };
  function officialMatch(q) {
    const D = ED(); if (!D) return null;
    const n = (x) => String(x || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[¿?¡!]/g, "").trim();
    const t = n(q); let best = null, score = 0;
    Object.keys(OFFICIAL_KW).forEach(id => {
      const node = id === "que_llevar" ? null : D.node(id, lang);
      const kws = OFFICIAL_KW[id].concat((node && node.pregunta_tipo) || []);
      const s = kws.reduce((a, k) => { const nk = n(k); return a + (nk && t.indexOf(nk) >= 0 ? nk.length : 0); }, 0);
      if (s > score) { score = s; best = id; }
    });
    return best;
  }
  function tripTours() {
    const D = ED(); if (!D || !booking) return [];
    const seen = {};
    return (booking.itinerary || []).map(it => it.tourId && !seen[it.tourId] && (seen[it.tourId] = 1) && D.tour(it.tourId, lang)).filter(Boolean);
  }
  function tripFacts(kind) {
    const D = ED(), list = tripTours();
    if (!list.length) return false;
    const msgs = kind === "duration"
      ? [list.map(i => "• *" + i.nombre + "*: " + D.fmtDur(i.dur, lang) + " · " + D.fmtHorario(i.horario, lang)).join("\n")]
      : list.map(i => "*" + i.nombre + "*\n" + i.incluye.map(x => "✅ " + x).join("\n")).concat([D.general("no_incluye_siempre", lang)]);
    botSay(msgs).then(() => chips([{ label: U().wa_host, kind: "wa", wa: true, waMsg: U().wa_generic }, { label: U().back }]));
    return true;
  }
  function runTopic(id) {
    const k = topicById(id); if (!k) return;
    const act = k.action || "info";
    if (ED()) {
      if (id === "pack" || id === "clothing") { packChat(); return; }
      if ((id === "includes" || id === "duration") && tripFacts(id)) return;
      const node = OFFICIAL[id] && ED().node(OFFICIAL[id], lang);
      if (node && node.respuesta) { botSay([node.respuesta]).then(() => chips([{ label: U().wa_host, kind: "wa", wa: true, waMsg: U().wa_generic }, { label: U().back }])); return; }
    }
    if (act === "dyn:schedule") {
      const lines = booking.itinerary.map(it => "• " + (it.time || "") + " · " + fmtDay(it) + " — " + (titleOf(it))).join("\n");
      botSay([U().itinerary + ":\n" + lines, U().more]).then(() => chips([{ label: U().m_change, topic: "change" }].concat(menuChips().filter(m => m.topic !== "schedule"))));
      return;
    }
    if (act === "dyn:guide") {
      const g = booking.guide || {}; const gl = (g.langs || []).map(c => (LANGS.find(x => x.code === c) || {}).name || c).join(", ");
      const msg = (lang === "en" ? `Your guide is *${g.name}* and speaks: ${gl}.` : lang === "fr" ? `Votre guide est *${g.name}* et parle : ${gl}.` : lang === "de" ? `Ihr Guide ist *${g.name}* und spricht: ${gl}.` : lang === "pt" ? `Seu guia é *${g.name}* e fala: ${gl}.` : `Tu guía es *${g.name}* y habla: ${gl}.`);
      botSay([msg]).then(() => chips([{ label: U().wa_host, kind: "wa", wa: true, waMsg: U().wa_generic }, { label: U().back, topic0: true }].map(x => x.topic0 ? { label: U().back } : x)));
      return;
    }
    // answer text
    const ans = (k.a && (k.a[lang] || k.a.es)) || "";
    const after = [];
    if (act.startsWith("wa:")) {
      const waKey = act.slice(3);
      after.push({ label: U().wa_open, kind: "wa", wa: true, waMsg: U()[waKey] });
    } else if (act.startsWith("maps:")) {
      after.push({ label: U().maps_btn, href: mapsUrl(act.slice(5)) });
    }
    after.push({ label: U().back });
    botSay([ans]).then(() => chips(after.length === 1 ? menuChips() : after.concat([])));
  }

  /* ---------- Qué llevar (clima + pronóstico por parada) ---------- */
  let packToken = 0;
  function packPlain(pack) {
    return P().pack_title + "\n" + pack.items.map(x => (x.i ? x.i + " " : "") + x.label).join("\n") +
      (pack.tips.length ? "\n\n" + P().pack_tips + "\n" + pack.tips.map(x => "• " + x).join("\n") : "");
  }
  function renderPack() {
    const box = $("#c-pack"); if (!box) return;
    if (!HAS_PLANS) { box.style.display = "none"; return; }
    const my = ++packToken;
    EspoPlans.packFor(booking.itinerary || [], lang).then(pack => {
      if (my !== packToken) return; // language changed meanwhile
      if (!pack.items.length) { box.style.display = "none"; return; }
      const days = pack.days.map(d => `
        <li><b>${esc(fill(d.title))}</b><span>${d.date ? esc(fmtDay({ date: d.date })) + " · " : ""}${esc(d.fc ? EspoPlans.fcText(d.fc) : d.climate)}</span></li>`).join("");
      const noFc = pack.days.some(d => !d.fc);
      box.style.display = "";
      box.innerHTML = `
        <div class="c-itin-head"><h2 class="c-card__title">${esc(P().pack_title)}</h2>
          <button class="c-cal-btn" type="button" id="c-pack-share">${esc(P().share)}</button></div>
        <ul class="c-pack__days">${days}</ul>
        ${noFc ? `<p class="c-pack__note">${esc(P().fc_na)}</p>` : ""}
        <ul class="c-pack__items">${pack.items.map(x => `<li>${x.i ? x.i + " " : ""}${esc(x.label)}</li>`).join("")}</ul>
        ${pack.tips.length ? `<div class="c-pack__tips"><b>${esc(P().pack_tips)}</b>${pack.tips.map(x => `<p>${esc(x)}</p>`).join("")}</div>` : ""}`;
      $("#c-pack-share").onclick = () => window.open("https://wa.me/?text=" + encodeURIComponent(packPlain(pack)), "_blank", "noopener");
    });
  }
  function packChat() {
    busy = true; $("#c-chips").innerHTML = "";
    EspoPlans.packFor(booking.itinerary || [], lang).then(pack => {
      busy = false;
      if (!pack.items.length) { backMenu(); return; }
      const fc = pack.days.filter(d => d.fc).map(d => "• " + fill(d.title) + ": " + EspoPlans.fcText(d.fc)).join("\n");
      const msgs = ["*" + P().pack_title + "*\n" + pack.items.map(x => (x.i ? x.i + " " : "") + x.label).join("\n")];
      if (pack.tips.length) msgs.push("*" + P().pack_tips + "*\n" + pack.tips.map(x => "• " + x).join("\n"));
      if (fc) msgs.push("*" + P().fc_title + "*\n" + fc);
      botSay(msgs).then(() => chips([{ label: P().share, share: packPlain(pack) }, { label: U().back }]));
    });
  }
  function scanFromGate() {
    const t = P();
    EspoQR.scan({ title: t.scan_title, hint: t.scan_hint, file: t.scan_file, nocam: t.scan_nocam, bad: t.scan_bad }).then(text => {
      if (!text) return;
      const r = EspoPlans.parseQR(text);
      if (!r) { showGate(t.scan_bad); return; }
      if (r.type === "trip") location.search = "?" + r.query;
      else if (r.type === "code") location.search = "?code=" + encodeURIComponent(r.code);
      else location.href = "index.html?" + (r.type === "plan" ? "plan=" : "tour=") + encodeURIComponent(r.id) + (r.src ? "&src=" + encodeURIComponent(r.src) : "");
    });
  }

  /* ---------- Datos oficiales por parada (duración, recomendaciones) ---------- */
  function stepFacts(it) {
    const D = ED(); const i = D && it.tourId && D.tour(it.tourId, lang);
    return i ? `<small class="c-step__facts">⏱ ${esc(D.fmtDur(i.dur, lang))} · ${esc(i.codigo)}</small>` : "";
  }
  // Recomendación oficial de la próxima experiencia si es hoy o mañana (la "víspera")
  function nextTips(it) {
    const D = ED(); const i = D && it.tourId && D.tour(it.tourId, lang);
    if (!i || !i.rec.items.length) return "";
    const days = Math.round((itemDate(it).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000);
    if (days > 1) return "";
    return `<div class="c-next__tips"><b>${esc(i.rec.titulo || TIPS_T[lang] || TIPS_T.es)}</b><ul>${i.rec.items.slice(0, 5).map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
  }
  /* ---------- Mapa del recorrido (js/maps.js) ---------- */
  function renderRoute() {
    const box = $("#c-route"); if (!box) return;
    if (!window.EspoMaps || !EspoMaps.itinerary || !(booking.itinerary || []).length) { box.style.display = "none"; return; }
    box.style.display = "";
    $("#c-route-title").textContent = ROUTE_T[lang] || ROUTE_T.es;
    const stops = booking.itinerary.map(it => ({ tourId: it.tourId || "", title: fill(titleOf(it)), date: it.date, time: it.time }));
    try { EspoMaps.itinerary($("#c-route-map"), stops, { lang, hotel: booking.hotel || null }); } catch (e) { box.style.display = "none"; }
  }

  /* ---------- After the trip: ask for a review ---------- */
  function tripEnded() {
    const it = (booking && booking.itinerary) || [];
    if (!it.length) return false;
    const last = itemDate(it[it.length - 1]);
    return !isNaN(last) && Date.now() > last.getTime() + 3 * 3600000;
  }
  function renderReview() {
    const box = $("#c-review"); if (!box) return;
    if (!HAS_PLANS || !tripEnded()) { box.style.display = "none"; return; }
    const t = P();
    box.style.display = "";
    box.innerHTML = `
      <h2 class="c-card__title">${esc(t.review_title)}</h2>
      <p class="c-review__txt">${esc(t.review_text)}</p>
      <div class="c-review__btns">
        <a class="btn btn--primary btn--sm" href="${esc(EspoPlans.reviewUrl())}" target="_blank" rel="noopener">${esc(t.review_btn)}</a>
        <a class="btn btn--ghost btn--sm" href="${esc(waHost(t.review_wa_msg))}" target="_blank" rel="noopener">${esc(t.review_wa)}</a>
      </div>`;
  }

  /* ---------- Remember the last trip (works offline / from the home screen) ---------- */
  // Se recuerda el último viaje en este dispositivo solo hasta 7 días después de la última actividad
  function lastTrip() {
    let v = null; try { v = JSON.parse(localStorage.getItem("esp_last_trip") || "null"); } catch (e) { v = null; }
    if (!v || typeof v !== "object" || !v.q || !(v.exp > Date.now())) { try { localStorage.removeItem("esp_last_trip"); } catch (e) {} return ""; }
    return /^\?(code|d)=/.test(v.q) && v.q !== location.search ? v.q : "";
  }
  function saveTrip() {
    try {
      if (!/^\?(code|d)=/.test(location.search)) return;
      const it = (booking && booking.itinerary) || [];
      const last = it.length ? itemDate(it[it.length - 1]).getTime() : Date.now();
      localStorage.setItem("esp_last_trip", JSON.stringify({ q: location.search, exp: (isNaN(last) ? Date.now() : last) + 7 * 86400000 }));
    } catch (e) {}
  }

  /* ---------- Gate (no/invalid code) ---------- */
  function showGate(msg) {
    $("#c-app").style.display = "none";
    const gate = $("#c-gate"); gate.style.display = "";
    gate.innerHTML = `
      <img src="assets/img/logo.png" alt="Espontáneos Travel" width="70" height="70">
      <h2>${esc(U().brand)}</h2>
      ${msg ? `<p class="c-err">${esc(msg)}</p>` : ""}
      <form id="c-gate-form" class="c-gate-form">
        <input type="text" id="c-code-in" placeholder="${esc(U().enter_code)}" value="" autocomplete="off">
        <button class="btn btn--primary" type="submit">${esc(U().go)}</button>
      </form>
      ${HAS_PLANS && window.EspoQR ? `<button class="btn btn--ghost" type="button" id="c-scan">${esc(P().m_scan)}</button>` : ""}
      ${lastTrip() ? `<a class="btn btn--primary" href="viaje.html${esc(lastTrip())}">${esc(P().last_trip || "↩")}</a>` : ""}
      <a class="c-gate-wa" href="https://wa.me/573187200023" target="_blank" rel="noopener">WhatsApp +57 318 7200023</a>`;
    const scanBtn = $("#c-scan"); if (scanBtn) scanBtn.addEventListener("click", scanFromGate);
    $("#c-gate-form").addEventListener("submit", e => { e.preventDefault(); const v = $("#c-code-in").value.trim().toUpperCase(); if (v) location.search = "?code=" + encodeURIComponent(v); });
  }

  function renderAll() {
    try { localStorage.setItem("esp_lang", lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.title = (booking ? booking.name + " · " : "") + "Espontáneos Travel";
    renderHeader();
    if (!booking) { showGate(U().not_found && getParam("code") ? U().not_found : ""); return; }
    $("#c-gate").style.display = "none"; $("#c-app").style.display = "";
    saveTrip();
    $("#c-brand-sub").textContent = U().brand;
    $("#c-foot").textContent = U().foot;
    const ai = $("#c-ask-in"); if (ai && U().ask_ph) ai.placeholder = U().ask_ph;
    renderBooking();
    startChat();
  }

  /* ---------- Boot ---------- */
  function getParam(k) { return new URLSearchParams(location.search).get(k); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  // Un enlace ?d= no está firmado: cualquiera puede armarlo. Por eso el WhatsApp/teléfono solo puede ser un
  // número oficial, nunca se toma un enlace de pago de ahí y los enlaces de mapa deben ser https.
  const OFFICIAL_PHONE = () => (window.EspoPlans && EspoPlans.cfg.officialPhones[0]) || "573187200023";
  const isOfficial = (p) => (window.EspoPlans ? EspoPlans.isOfficialPhone(p) : String(p || "").replace(/\D/g, "") === "573187200023");
  const https = (u) => (window.EspoPlans ? EspoPlans.safeHttps(u) : (/^https:\/\//i.test(String(u || "")) ? String(u) : ""));
  function cleanLinks(b) {
    b.itinerary = (b.itinerary || []).map(it => Object.assign({}, it, { maps: https(it.maps) }));
    if (b.hotel) b.hotel = Object.assign({}, b.hotel, { maps: https(b.hotel.maps) });
    return b;
  }
  function fromLink(b) {
    b = cleanLinks(Object.assign({}, b));
    b.host = Object.assign({}, b.host || {}, { phone: isOfficial(b.host && b.host.phone) ? b.host.phone : OFFICIAL_PHONE() });
    if (b.driver) b.driver = Object.assign({}, b.driver, { phone: isOfficial(b.driver.phone) ? b.driver.phone : OFFICIAL_PHONE() });
    delete b.payLink;
    b._fromLink = true;
    return b;
  }
  function useBooking(b) {
    booking = cleanLinks(b);
    if (SUPPORTED.includes(booking.lang)) { try { if (!localStorage.getItem("esp_lang")) lang = booking.lang; } catch (e) { lang = booking.lang; } }
  }
  // Reservas creadas en el portal (Firestore). Si el backend no está configurado, devuelve null.
  function fromBackend(code) {
    const dataReady = window.EspoData ? EspoData.load().catch(() => null) : Promise.resolve(null);
    if (!code) { dataReady.then(renderAll); return; }
    const ask = () => window.EspoBackend.getBooking(code).catch(() => null).then(b => { if (b) useBooking(b); return dataReady; }).then(renderAll);
    if (window.EspoBackend) ask();
    else {
      let done = false;
      window.addEventListener("espo:backend", () => { if (!done) { done = true; ask(); } }, { once: true });
      setTimeout(() => { if (!done) { done = true; dataReady.then(renderAll); } }, 6000);   // sin backend: no esperar más
    }
  }
  function boot() {
    initTheme();
    if (typeof CUI_EXTRA !== "undefined") { SUPPORTED.forEach(l => { if (CUI[l] && CUI_EXTRA[l]) Object.assign(CUI[l], CUI_EXTRA[l]); }); }
    $("#c-theme").addEventListener("click", () => { const n = effTheme() === "dark" ? "light" : "dark"; document.documentElement.setAttribute("data-theme", n); try { localStorage.setItem("esp_theme", n); } catch (e) {} paintThemeIcon(); });
    const askForm = $("#c-ask");
    if (askForm) askForm.addEventListener("submit", (e) => {
      e.preventDefault(); const inp = $("#c-ask-in"); const q = (inp.value || "").trim();
      if (!q || busy) return; inp.value = ""; addMsg("<span>" + esc(q) + "</span>", "user");
      const m = matchTopic(q);
      const o = m ? null : officialMatch(q);
      if (m) runTopic(m);
      else if (o === "que_llevar") packChat();
      else if (o) { const node = ED().node(o, lang); botSay([node.respuesta]).then(() => chips([{ label: U().wa_host, kind: "wa", wa: true, waMsg: U().wa_generic }, { label: U().back }])); }
      else botSay([U().no_match]).then(() => chips([{ label: U().wa_host, kind: "wa", wa: true, waMsg: (U().wa_q || U().wa_generic) + " " + q }, { label: U().back }]));
    });
    let storedLang = null; try { storedLang = localStorage.getItem("esp_lang"); } catch (e) {}
    if (SUPPORTED.includes(storedLang)) lang = storedLang;
    // Datos oficiales de Jenny (duraciones, recomendaciones); si no cargan, el conserje funciona igual
    const dataReady = window.EspoData ? EspoData.load().catch(() => null) : Promise.resolve(null);
    const dparam = getParam("d");
    if (dparam) { const b = decodeBooking(dparam); if (b) { booking = fromLink(b); if (!storedLang && SUPPORTED.includes(b.lang)) lang = b.lang; } dataReady.then(renderAll); return; }
    const code = (getParam("code") || "").trim().toUpperCase();
    fetch("data/bookings.json", { cache: "no-store" })
      .then(r => r.json())
      .then(db => {
        if (code && db.bookings && db.bookings[code]) { useBooking(db.bookings[code]); dataReady.then(renderAll); return; }
        fromBackend(code);
      })
      .catch(() => fromBackend(code));
    // El mapa carga diferido: cuando esté listo, se pinta la ruta
    addEventListener("load", () => { if (booking) renderRoute(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
