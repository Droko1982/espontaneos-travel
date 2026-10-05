/* ==========================================================================
   Espontáneos Travel — App engine
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Config ---------- */
  const CFG = {
    whatsapp: "573187200023",            // +57 318 7200023
    phoneDisplay: "+57 318 7200023",
    email: "Info@espontaneostravel.com",
    siteUrl: "https://www.espontaneostravel.com",
    instagram: "https://instagram.com/espontaneostravel/",
    facebook: "https://facebook.com/espontaneostravel",
    formEndpoint: "https://formsubmit.co/ajax/Info@espontaneostravel.com"
  };
  const SUPPORTED = ["es", "en", "fr", "de", "pt"];
  const DEFAULT_LANG = "es";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));

  let currentLang = DEFAULT_LANG;
  let activeFilter = "all";

  /* ---------- Images: topical placeholder CDN with robust fallback ---------- */
  function imgUrl(kw, seed, w, h) {
    if (kw && kw.startsWith("local:")) return "assets/img/" + kw.slice(6);
    if (kw && kw.startsWith("url:")) return kw.slice(4);
    if (kw && kw.startsWith("drive:")) return "https://lh3.googleusercontent.com/d/" + kw.slice(6) + "=w" + w + "-h" + h;
    return `https://loremflickr.com/${w}/${h}/${encodeURIComponent(kw)}?lock=${seed}`;
  }
  function driveUrl(id, w, h) { return "https://lh3.googleusercontent.com/d/" + id + "=w" + w + "-h" + h; }
  function svgFallback(w, h, label) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='%233f5a2b'/><stop offset='1' stop-color='%231d2a14'/></linearGradient></defs>
      <rect width='100%' height='100%' fill='url(%23g)'/>
      <text x='50%' y='50%' fill='%23ffb44d' font-family='Georgia,serif' font-size='${Math.round(w/16)}' text-anchor='middle' dominant-baseline='middle' opacity='0.9'>${label}</text>
    </svg>`;
    return "data:image/svg+xml;charset=utf-8," + svg.replace(/\s{2,}/g, " ").trim();
  }
  // Fallback chain: Drive lh3 -> Drive thumbnail -> svg ; loremflickr -> picsum -> svg
  window.__imgErr = function (el) {
    const stage = el.getAttribute("data-stage") || "0";
    const drive = el.getAttribute("data-drive");
    const seed = el.getAttribute("data-seed") || "1";
    const w = el.getAttribute("data-w") || 1200, h = el.getAttribute("data-h") || 800;
    if (drive) {
      if (stage === "0") { el.setAttribute("data-stage", "1"); el.src = "https://drive.google.com/thumbnail?id=" + drive + "&sz=w" + w; return; }
      el.setAttribute("data-stage", "2"); el.onerror = null; el.src = svgFallback(w, h, "Espontáneos Travel"); return;
    }
    if (stage === "0") { el.setAttribute("data-stage", "1"); el.src = `https://picsum.photos/seed/esp${seed}/${w}/${h}`; }
    else { el.setAttribute("data-stage", "2"); el.onerror = null; el.src = svgFallback(w, h, "Espontáneos Travel"); }
  };
  function imgTag(kw, seed, w, h, alt, cls, loading) {
    const drive = kw && kw.startsWith("drive:") ? kw.slice(6) : "";
    return `<img src="${imgUrl(kw, seed, w, h)}" alt="${esc(alt)}" class="${cls || ""}"
      loading="${loading || "lazy"}" decoding="async" width="${w}" height="${h}"
      ${drive ? `data-drive="${drive}"` : `data-seed="${seed}"`} data-w="${w}" data-h="${h}" data-stage="0" onerror="window.__imgErr(this)">`;
  }
  // Tour helpers for the real data model
  function coverKw(tour) { if (tour.cover) return tour.cover; return (tour.imgs && tour.imgs.length) ? "drive:" + tour.imgs[0] : tour.fb; }
  function tourImgList(tour) {
    const list = (tour.imgs && tour.imgs.length)
      ? tour.imgs.map(id => ({ drive: id }))
      : [{ kw: tour.fb, seed: (tour.id.charCodeAt(0) + tour.id.length) }];
    if (tour.cover) list.unshift({ kw: tour.cover, seed: 0 });
    return list;
  }

  /* ---------- Language helpers ---------- */
  function t(key) { return (I18N[currentLang] && I18N[currentLang][key]) || I18N[DEFAULT_LANG][key] || key; }
  function tourSummary(tour) { return (tour.sum && (tour.sum[currentLang] || tour.sum.en || tour.sum.es)) || ""; }
  function tourText(tour) { return { name: tour.name, summary: tourSummary(tour) }; }
  function catLabel(cat) { const c = CATEGORIES.find(x => x.id === cat); return c ? (c[currentLang] || c.es) : cat; }

  function detectLang() {
    const params = new URLSearchParams(location.search);
    const q = (params.get("lang") || "").toLowerCase();
    if (SUPPORTED.includes(q)) return q;
    try { const s = localStorage.getItem("esp_lang"); if (SUPPORTED.includes(s)) return s; } catch (e) {}
    const nav = (navigator.language || "es").slice(0, 2).toLowerCase();
    return SUPPORTED.includes(nav) ? nav : DEFAULT_LANG;
  }

  function waLink(msg) { return `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(msg || t("wa_default"))}`; }

  /* ---------- Render: filters ---------- */
  function renderFilters() {
    const wrap = $("#filters");
    if (!wrap) return;
    wrap.innerHTML = CATEGORIES.map(c =>
      `<button class="filter${c.id === activeFilter ? " active" : ""}" data-filter="${c.id}" type="button">${esc(c[currentLang] || c.es)}</button>`
    ).join("");
    $$(".filter", wrap).forEach(b => b.addEventListener("click", () => {
      activeFilter = b.getAttribute("data-filter");
      renderFilters(); renderTours();
    }));
  }

  /* ---------- Render: tours ---------- */
  function renderTours() {
    const grid = $("#tours-grid");
    if (!grid) return;
    const list = TOURS.filter(x => activeFilter === "all" || x.cat === activeFilter);
    if (!list.length) { grid.innerHTML = `<p class="tours-empty">${esc(t("tours_empty"))}</p>`; return; }
    grid.innerHTML = list.map((tour, i) => {
      const tx = tourText(tour);
      const nphoto = (tour.imgs && tour.imgs.length) || 0;
      return `<article class="tour-card reveal" data-delay="${(i % 3) + 1}" data-id="${tour.id}" tabindex="0" role="button" aria-label="${esc(tx.name)}">
        <div class="tour-card__media">
          ${imgTag(coverKw(tour), (tour.id.charCodeAt(0) + tour.id.length), 800, 560, tx.name, "", "lazy")}
          <span class="tour-card__cat">${esc(catLabel(tour.cat))}</span>
          ${nphoto ? `<span class="tour-card__count"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="15" rx="2"/><circle cx="12" cy="12.5" r="3.2"/><path d="M8 5l1.5-2h5L16 5"/></svg>${nphoto}</span>` : ""}
        </div>
        <div class="tour-card__body">
          <div class="tour-card__meta">
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${esc(t("loc_region"))}</span>
          </div>
          <h3>${esc(tx.name)}</h3>
          <p class="tour-card__desc">${esc(tx.summary)}</p>
          <div class="tour-card__foot">
            <div class="tour-card__price"><b class="quote">${esc(t("card_quote"))}</b></div>
            <span class="tour-card__more">${esc(t("card_details"))}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
          </div>
        </div>
      </article>`;
    }).join("");
    $$(".tour-card", grid).forEach(card => {
      const open = () => openModal(card.getAttribute("data-id"));
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
    observeReveals();
  }

  /* ---------- Render: tour select in form ---------- */
  function renderTourSelect() {
    const sel = $("#f-tour");
    if (!sel) return;
    const cur = sel.value;
    sel.innerHTML = `<option value="">${esc(t("f_tour_opt"))}</option>` +
      TOURS.map(x => `<option value="${esc(tourText(x).name)}">${esc(tourText(x).name)}</option>`).join("");
    if (cur) sel.value = cur;
  }

  /* ---------- Render: gallery ---------- */
  function renderGallery() {
    const wrap = $("#gallery");
    if (!wrap) return;
    const list = GALLERY.map(g => ({ drive: g.id, cap: g.cap }));
    wrap.innerHTML = GALLERY.map((g, i) => {
      return `<figure class="gallery__item" data-idx="${i}" tabindex="0" role="button" aria-label="${esc(g.cap)}">
        ${imgTag("drive:" + g.id, i, 700, (i % 3 === 0 ? 900 : 560), g.cap, "", "lazy")}
        <figcaption class="gallery__cap">${esc(g.cap)}</figcaption>
      </figure>`;
    }).join("");
    $$(".gallery__item", wrap).forEach(f => {
      const idx = +f.getAttribute("data-idx");
      f.addEventListener("click", () => openLightbox(list, idx));
      f.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(list, idx); } });
    });
  }

  /* ---------- Tour modal ---------- */
  function openModal(id) {
    const tour = TOURS.find(x => x.id === id);
    if (!tour) return;
    const tx = tourText(tour);
    const m = $("#modal");
    const imgs = tourImgList(tour);
    const heroUrl = imgs[0].drive ? driveUrl(imgs[0].drive, 1200, 700) : imgUrl(imgs[0].kw, imgs[0].seed, 1200, 700);
    $("#modal-hero").style.backgroundImage = `url('${heroUrl}')`;
    $("#modal-cat").textContent = catLabel(tour.cat);
    $("#modal-title").textContent = tx.name;
    const photoMeta = (tour.imgs && tour.imgs.length)
      ? `<span class="m"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="15" rx="2"/><circle cx="12" cy="12.5" r="3.2"/></svg>${tour.imgs.length} ${esc(t("card_photos"))}</span>` : "";
    $("#modal-meta").innerHTML =
      `<span class="m"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${esc(t("loc_region"))}</span>
       ${photoMeta}
       <span class="m price"><b>${esc(t("card_quote"))}</b></span>`;
    $("#modal-desc").textContent = tx.summary + "\n\n" + t("modal_tagline");
    // gallery strip
    const gal = $("#modal-gallery");
    const lbData = imgs.map(im => ({ drive: im.drive, kw: im.kw, seed: im.seed, cap: tx.name }));
    gal.innerHTML = imgs.map((im, ix) => {
      const tag = im.drive ? imgTag("drive:" + im.drive, ix, 320, 240, tx.name, "", "lazy") : imgTag(im.kw, im.seed, 320, 240, tx.name, "", "lazy");
      return `<button class="modal__thumb" data-ix="${ix}" aria-label="${esc(tx.name)}">${tag}</button>`;
    }).join("");
    $$(".modal__thumb", gal).forEach(b => b.addEventListener("click", () => openLightbox(lbData, +b.getAttribute("data-ix"))));
    $("#modal-incl-title").textContent = t("modal_includes");
    $("#modal-incl").innerHTML = ["inc1", "inc2", "inc3", "inc4", "inc5"].map(k =>
      `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>${esc(t(k))}</li>`).join("");
    const wa = $("#modal-wa");
    wa.href = waLink(`${t("wa_tour")} ${tx.name}`);
    wa.querySelector("span").textContent = t("modal_wa");
    const q = $("#modal-quote");
    q.querySelector("span").textContent = t("modal_quote");
    q.onclick = (e) => { e.preventDefault(); closeModal(); const sel = $("#f-tour"); if (sel) sel.value = tx.name; location.hash = "#contacto"; };
    m.classList.add("open");
    $("#modal-body-scroll") && ($("#modal-body-scroll").scrollTop = 0);
    document.body.style.overflow = "hidden";
    $("#modal-close").focus();
  }
  function closeModal() { $("#modal").classList.remove("open"); document.body.style.overflow = ""; }

  /* ---------- Lightbox (generic list) ---------- */
  let lbList = [], lbIndex = 0;
  function openLightbox(list, i) {
    lbList = list || []; lbIndex = i || 0; updateLightbox();
    $("#lightbox").classList.add("open"); document.body.style.overflow = "hidden";
  }
  function updateLightbox() {
    const g = lbList[lbIndex]; if (!g) return;
    const img = $("#lightbox-img");
    img.removeAttribute("data-drive"); img.removeAttribute("data-seed");
    img.setAttribute("data-w", 1400); img.setAttribute("data-h", 950); img.setAttribute("data-stage", "0");
    img.onerror = function () { window.__imgErr(this); };
    if (g.drive) { img.setAttribute("data-drive", g.drive); img.src = driveUrl(g.drive, 1400, 950); }
    else { img.setAttribute("data-seed", g.seed || 1); img.src = imgUrl(g.kw, g.seed || 1, 1400, 950); }
    img.alt = g.cap || ""; $("#lightbox-cap").textContent = g.cap || "";
  }
  function lbNav(d) { if (!lbList.length) return; lbIndex = (lbIndex + d + lbList.length) % lbList.length; updateLightbox(); }
  function closeLightbox() { $("#lightbox").classList.remove("open"); document.body.style.overflow = ""; }

  /* ---------- Apply i18n ---------- */
  function applyI18n() {
    $$("[data-i18n]").forEach(el => { const k = el.getAttribute("data-i18n"); const v = t(k); if (v) el.textContent = v; });
    $$("[data-i18n-ph]").forEach(el => { const k = el.getAttribute("data-i18n-ph"); const v = t(k); if (v) el.setAttribute("placeholder", v); });
    $$("[data-i18n-aria]").forEach(el => { const k = el.getAttribute("data-i18n-aria"); const v = t(k); if (v) el.setAttribute("aria-label", v); });

    document.documentElement.lang = currentLang;
    document.title = t("doc_title");
    setMeta("name", "description", t("doc_desc"));
    setMeta("property", "og:title", t("doc_title"));
    setMeta("property", "og:description", t("doc_desc"));
    setMeta("property", "og:locale", ({ es:"es_CO", en:"en_US", fr:"fr_FR", de:"de_DE", pt:"pt_BR" })[currentLang]);
    setMeta("name", "twitter:title", t("doc_title"));
    setMeta("name", "twitter:description", t("doc_desc"));

    // WhatsApp/contact links that depend on language
    $$("[data-wa]").forEach(a => a.href = waLink());
    const waFloat = $("#wa-float"); if (waFloat) waFloat.setAttribute("aria-label", "WhatsApp");

    // language button label
    const lb = $("#lang-current"); if (lb) { const L = LANGS.find(x => x.code === currentLang); lb.textContent = L.name; }
    $$(".lang__item").forEach(it => it.classList.toggle("active", it.getAttribute("data-lang") === currentLang));

    renderFilters(); renderTours(); renderGallery(); renderTourSelect(); injectTourJsonLd();
    document.dispatchEvent(new CustomEvent("espo:lang", { detail: currentLang }));
  }
  function setMeta(attr, key, val) {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute("content", val);
  }

  function setLang(lang, persist) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    currentLang = lang;
    if (persist !== false) { try { localStorage.setItem("esp_lang", lang); } catch (e) {} }
    const url = new URL(location.href); url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
    applyI18n();
  }

  /* ---------- Theme ---------- */
  function effectiveTheme() {
    const set = document.documentElement.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function setThemeIcon() {
    const dark = effectiveTheme() === "dark";
    const btn = $("#theme-toggle");
    if (!btn) return;
    btn.innerHTML = dark
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`;
  }
  function initTheme() {
    let stored = null; try { stored = localStorage.getItem("esp_theme"); } catch (e) {}
    if (stored) document.documentElement.setAttribute("data-theme", stored);
    setThemeIcon();
  }
  function toggleTheme() {
    const next = effectiveTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("esp_theme", next); } catch (e) {}
    setThemeIcon();
  }

  /* ---------- Reveal on scroll ---------- */
  let io;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach(el => el.classList.add("in")); return; }
    if (!io) io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal:not(.in)").forEach(el => io.observe(el));
  }

  /* ---------- Hero slideshow ---------- */
  function initHero() {
    const slides = $$(".hero__slide");
    if (slides.length < 2) return;
    let idx = 0;
    setInterval(() => {
      slides[idx].classList.remove("active");
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add("active");
    }, 6000);
  }

  /* ---------- JSON-LD for tours (structured data) ---------- */
  function injectTourJsonLd() {
    const old = $("#jsonld-tours"); if (old) old.remove();
    const items = TOURS.map((x, i) => ({
      "@type": "ListItem", "position": i + 1,
      "item": {
        "@type": "TouristTrip", "name": x.name, "description": tourSummary(x),
        "touristType": catLabel(x.cat), "provider": { "@type": "TravelAgency", "name": "Espontáneos Travel" }
      }
    }));
    const data = { "@context": "https://schema.org", "@type": "ItemList", "name": t("tours_title"), "itemListElement": items };
    const s = document.createElement("script"); s.type = "application/ld+json"; s.id = "jsonld-tours";
    s.textContent = JSON.stringify(data); document.head.appendChild(s);
  }

  /* ---------- Toast ---------- */
  function toast(msg) {
    const el = $("#toast"); $("#toast-msg").textContent = msg;
    el.classList.add("show"); clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 4500);
  }

  /* ---------- Form ---------- */
  function initForm() {
    const form = $("#contact-form");
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = $("#f-submit"); const original = btn.textContent;
      btn.disabled = true; btn.textContent = "…";
      const data = Object.fromEntries(new FormData(form).entries());
      data._subject = "Nueva solicitud — Espontáneos Travel";
      try {
        const res = await fetch(CFG.formEndpoint, {
          method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        });
        if (res.ok) { form.reset(); renderTourSelect(); toast(t("toast_sent")); }
        else throw new Error("bad");
      } catch (err) {
        // Fallback: open WhatsApp with the message prefilled
        const msg = `${t("wa_default")}%0A%0A${encodeURIComponent(`${data.name || ""} · ${data.email || ""} · ${data.phone || ""}%0A${data.tour || ""}%0A${data.message || ""}`)}`;
        window.open(`https://wa.me/${CFG.whatsapp}?text=${msg}`, "_blank");
      } finally { btn.disabled = false; btn.textContent = original; }
    });
  }

  /* ---------- Header / nav / scroll ---------- */
  function initChrome() {
    const header = $("#header");
    const totop = $("#totop");
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("scrolled", y > 40);
      totop.classList.toggle("show", y > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Active nav link via sections
    const links = $$(".nav__link");
    const sections = links.map(l => $(l.getAttribute("href"))).filter(Boolean);
    if ("IntersectionObserver" in window && sections.length) {
      const navIo = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            const id = "#" + en.target.id;
            links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === id));
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(s => navIo.observe(s));
    }

    // Theme
    $("#theme-toggle").addEventListener("click", toggleTheme);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", setThemeIcon);

    // Language dropdown
    const lang = $("#lang");
    $("#lang-btn").addEventListener("click", (e) => { e.stopPropagation(); lang.classList.toggle("open"); });
    document.addEventListener("click", () => lang.classList.remove("open"));
    $$(".lang__item").forEach(it => it.addEventListener("click", () => { setLang(it.getAttribute("data-lang")); lang.classList.remove("open"); }));

    // Mobile menu
    const mm = $("#mobile-menu");
    $("#burger").addEventListener("click", () => { mm.classList.add("open"); document.body.style.overflow = "hidden"; });
    $("#mm-close").addEventListener("click", closeMM);
    $$("#mobile-menu a").forEach(a => a.addEventListener("click", closeMM));
    function closeMM() { mm.classList.remove("open"); document.body.style.overflow = ""; }

    // Mobile lang chips
    $$(".mm-lang").forEach(b => b.addEventListener("click", () => { setLang(b.getAttribute("data-lang")); }));

    // Modal / lightbox close
    $("#modal-close").addEventListener("click", closeModal);
    $("#modal-backdrop").addEventListener("click", closeModal);
    $("#lightbox-close").addEventListener("click", closeLightbox);
    $("#lightbox-prev").addEventListener("click", () => lbNav(-1));
    $("#lightbox-next").addEventListener("click", () => lbNav(1));
    $("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLightbox(); });
    $("#totop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeModal(); closeLightbox(); $("#lang").classList.remove("open"); }
      if ($("#lightbox").classList.contains("open")) {
        if (e.key === "ArrowLeft") lbNav(-1);
        if (e.key === "ArrowRight") lbNav(1);
      }
    });
  }

  /* ---------- Init ---------- */
  // Public API for the Espo assistant (bot.js) and others
  window.EspoApp = {
    getLang: () => currentLang,
    tours: () => TOURS,
    categories: () => CATEGORIES,
    tourText: (tour) => tourText(tour),
    catLabel: (cat) => catLabel(cat),
    openTour: (id) => openModal(id),
    waLink: (msg) => waLink(msg),
    openWhatsApp: (msg) => window.open(waLink(msg), "_blank", "noopener"),
    filterTo: (cat) => {
      activeFilter = cat || "all"; renderFilters(); renderTours();
      const sec = document.getElementById("experiencias");
      if (sec) sec.scrollIntoView({ behavior: "smooth" });
    },
    t: (k) => t(k)
  };

  function init() {
    // merge generated tour-UI strings into I18N (I18N_EXTRA is a top-level const in data.js)
    if (typeof I18N_EXTRA !== "undefined") { SUPPORTED.forEach(lg => { if (I18N[lg] && I18N_EXTRA[lg]) Object.assign(I18N[lg], I18N_EXTRA[lg]); }); }
    currentLang = detectLang();
    initTheme();
    initChrome();
    initHero();
    initForm();
    applyI18n();
    observeReveals();
    // Reveal above-the-fold immediately
    requestAnimationFrame(() => $$(".hero .reveal").forEach(el => el.classList.add("in")));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
