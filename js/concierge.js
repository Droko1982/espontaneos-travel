/* ==========================================================================
   Espontáneos Travel — Conserje "Espo" (motor). Zero-cost, estático.
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
  function itemDate(it) { try { return new Date(it.date + "T" + (it.time || "00:00") + ":00"); } catch (e) { return new Date(it.date); } }
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
      <div class="c-chips-info">
        <span class="c-pill">${esc(U().status)}: <b>${esc(booking.code)}</b></span>
        <span class="c-pill">${esc(U().party)}: <b>${esc(booking.party || 1)}</b></span>
        <span class="c-pill">${esc(U().guide)}: <b>${esc(g.name || "—")}</b> ${gl ? "· " + esc(gl) : ""}</span>
        <span class="c-pill">${esc(U().hotel)}: <b>${esc(h.name || "—")}</b></span>
      </div>`;

    // next stop
    const ni = nextIndex();
    const nextWrap = $("#c-next");
    if (ni >= 0) {
      const it = booking.itinerary[ni];
      nextWrap.style.display = "";
      nextWrap.innerHTML = `
        <span class="c-next__label">⏭️ ${esc(U().next_stop)}</span>
        <div class="c-next__row">
          <div><b>${esc(fill(it.title[lang] || it.title.es))}</b><span>${esc(fmtDay(it))} · ${esc(it.time || "")}</span></div>
          ${it.maps ? `<a class="c-mini" href="${esc(it.maps)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></a>` : ""}
        </div>`;
    } else { nextWrap.style.display = "none"; }

    // itinerary
    $("#c-itin-title").textContent = U().itinerary;
    $("#c-itin").innerHTML = booking.itinerary.map((it, i) => `
      <li class="c-step${i === ni ? " now" : ""}">
        <span class="c-step__time">${esc(it.time || "")}<small>${esc(fmtDay(it))}</small></span>
        <span class="c-step__dot"></span>
        <span class="c-step__body">
          <b>${esc(fill(it.title[lang] || it.title.es))}</b>
          ${it.maps ? `<a href="${esc(it.maps)}" target="_blank" rel="noopener" class="c-step__map">${esc(U().maps_btn)} →</a>` : ""}
        </span>
      </li>`).join("");

    // actions (sticky)
    const host = booking.host || {}; const drv = booking.driver || {};
    $("#c-actions").innerHTML = `
      <a class="btn btn--wa btn--sm" href="${waHost(U().wa_generic)}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z"/></svg>
        ${esc(U().wa_host)}</a>
      ${host.phone ? `<a class="btn btn--ghost btn--sm" href="tel:+${esc(host.phone.replace(/\D/g,''))}">${esc(U().call_host)}</a>` : ""}`;
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
  function runTopic(id) {
    const k = topicById(id); if (!k) return;
    const act = k.action || "info";
    if (act === "dyn:schedule") {
      const lines = booking.itinerary.map(it => "• " + (it.time || "") + " · " + fmtDay(it) + " — " + (it.title[lang] || it.title.es)).join("\n");
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
      <a class="c-gate-wa" href="https://wa.me/573187200023" target="_blank" rel="noopener">WhatsApp +57 318 7200023</a>`;
    $("#c-gate-form").addEventListener("submit", e => { e.preventDefault(); const v = $("#c-code-in").value.trim().toUpperCase(); if (v) location.search = "?code=" + encodeURIComponent(v); });
  }

  function renderAll() {
    try { localStorage.setItem("esp_lang", lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.title = (booking ? booking.name + " · " : "") + "Espontáneos Travel";
    renderHeader();
    if (!booking) { showGate(U().not_found && getParam("code") ? U().not_found : ""); return; }
    $("#c-gate").style.display = "none"; $("#c-app").style.display = "";
    $("#c-brand-sub").textContent = U().brand;
    $("#c-foot").textContent = U().foot;
    const ai = $("#c-ask-in"); if (ai && U().ask_ph) ai.placeholder = U().ask_ph;
    renderBooking();
    startChat();
  }

  /* ---------- Boot ---------- */
  function getParam(k) { return new URLSearchParams(location.search).get(k); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  function boot() {
    initTheme();
    if (typeof CUI_EXTRA !== "undefined") { SUPPORTED.forEach(l => { if (CUI[l] && CUI_EXTRA[l]) Object.assign(CUI[l], CUI_EXTRA[l]); }); }
    $("#c-theme").addEventListener("click", () => { const n = effTheme() === "dark" ? "light" : "dark"; document.documentElement.setAttribute("data-theme", n); try { localStorage.setItem("esp_theme", n); } catch (e) {} paintThemeIcon(); });
    const askForm = $("#c-ask");
    if (askForm) askForm.addEventListener("submit", (e) => {
      e.preventDefault(); const inp = $("#c-ask-in"); const q = (inp.value || "").trim();
      if (!q || busy) return; inp.value = ""; addMsg("<span>" + esc(q) + "</span>", "user");
      const m = matchTopic(q);
      if (m) runTopic(m);
      else botSay([U().no_match]).then(() => chips([{ label: U().wa_host, kind: "wa", wa: true, waMsg: (U().wa_q || U().wa_generic) + " " + q }, { label: U().back }]));
    });
    const code = (getParam("code") || "").trim().toUpperCase();
    try { const s = localStorage.getItem("esp_lang"); if (SUPPORTED.includes(s)) lang = s; } catch (e) {}
    fetch("data/bookings.json", { cache: "no-store" })
      .then(r => r.json())
      .then(db => {
        if (code && db.bookings && db.bookings[code]) { booking = db.bookings[code]; if (SUPPORTED.includes(booking.lang)) { try { if (!localStorage.getItem("esp_lang")) lang = booking.lang; } catch (e) { lang = booking.lang; } } }
        renderAll();
      })
      .catch(() => { renderAll(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
