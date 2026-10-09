/* ==========================================================================
   Espontáneos Travel — Jenny, asistente de pre-venta del sitio
   Lee la MISMA fuente que el sitio y el conserje: data/jenny.json (+ i18n).
   Reglas: no inventa datos (null/POR_VALIDAR → asesor), nunca muestra tarifas
   netas, cada respuesta termina con una siguiente acción, 5 idiomas, y el
   mensaje a WhatsApp lleva tour + código, personas, fecha, hotel e idioma.
   ========================================================================== */
(function () {
  "use strict";

  const LANGNAME = { es: "Español", en: "English", fr: "Français", de: "Deutsch", pt: "Português", it: "Italiano" };
  const UI = {
    es: {
      launch: "¿Te ayudo?", close: "Cerrar", title: "Jenny", subtitle: "Tu anfitriona · en línea",
      menu_prompt: "Elige un tema o escríbeme tu pregunta 👇", more: "➕ Más temas", back: "↩ Menú", other: "Otra pregunta",
      foot: "Información oficial del portafolio · un asesor confirma los detalles", ask_ph: "Escribe tu pregunta…", send: "Enviar",
      m_reservar: "📅 Reservar", m_horarios: "🕘 Horarios", m_duracion: "⏱️ Duración", m_incluye: "✅ Qué incluye", m_llevar: "🎒 Qué llevar",
      m_precios: "💲 Precios", m_pagos: "💳 Pagos", m_plans: "🗺️ Itinerarios", m_scan: "📷 Escanear QR", m_asesor: "💬 Hablar con un asesor",
      m_traslados: "🚐 Traslados", m_ninos: "👨‍👩‍👧 Niños y mayores", m_access: "♿ Accesibilidad", m_idiomas: "🗣️ Idiomas", m_clima: "🌦️ Clima",
      m_temporadas: "📆 Temporadas", m_cancel: "↩️ Cancelaciones", m_sost: "🌿 Sostenibilidad", m_empresa: "🏡 Quiénes somos", m_redes: "📱 Redes", m_compartido: "🚐 Tour compartido Cocora + Salento",
      pick_cat: "¿Sobre qué experiencia? Elige una categoría 👇", pick_tour: "Elige la experiencia:",
      hub: "*{tour}* · {code}\n¿Qué quieres saber?", see_card: "🔎 Ver ficha completa", book_this: "📅 Reservar esta", another_tour: "Otra experiencia",
      a_horario: "*{tour}*: {h}.", a_dur: "*{tour}* dura aprox. *{d}* desde la recogida en tu hotel.",
      a_incl: "*{tour}* incluye:", a_noincl: "No incluye:", a_tbd: "Ese dato te lo confirma un asesor 💬",
      a_price_pub: "Precio de venta 2026: *{p}*.", forecast: "🌦️ Pronóstico para tu fecha:",
      rain: "🌧️ Lluvia probable ese día: lleva ropa impermeable.", uv: "☀️ Índice UV muy alto: bloqueador, gorra y gafas.", cold: "🧥 Mañana fría: lleva abrigo.",
      f_guide: "Idioma del guía", no_match: "No tengo esa respuesta exacta 🙈 Te paso con un asesor por WhatsApp para que te ayude.",
      wa_q: "¡Hola Espontáneos Travel! Tengo una pregunta:", wa_default: "¡Hola Espontáneos Travel! Me gustaría más información sobre sus experiencias.",
      open_wa: "Abrir WhatsApp", go_sust: "Ver sección Sostenibilidad", go_tours: "Ver experiencias", pay_btn: "💳 Pagar anticipo",
      wa_tour: "🌿 Experiencia:", wa_guide: "🧭 Idioma del guía:", confirm_book: "¿Quieres reservar *{tour}*?", wa_lead_tour: "¡Hola Espontáneos Travel! Quiero reservar:", consent: "Autorizo el tratamiento de mis datos según la {link} (Ley 1581 de 2012).", consent_link: "política de privacidad", consent_req: "Para continuar, acepta la política de datos 🙂", greet_fallback: "¡Hola! Soy Jenny, de Espontáneos Travel 🌿 ¿En qué te ayudo?"
    },
    en: {
      launch: "Need help?", close: "Close", title: "Jenny", subtitle: "Your host · online",
      menu_prompt: "Pick a topic or type your question 👇", more: "➕ More topics", back: "↩ Menu", other: "Another question",
      foot: "Official portfolio information · an advisor confirms the details", ask_ph: "Type your question…", send: "Send",
      m_reservar: "📅 Book", m_horarios: "🕘 Schedules", m_duracion: "⏱️ Duration", m_incluye: "✅ What's included", m_llevar: "🎒 What to bring",
      m_precios: "💲 Prices", m_pagos: "💳 Payments", m_plans: "🗺️ Itineraries", m_scan: "📷 Scan QR", m_asesor: "💬 Talk to an advisor",
      m_traslados: "🚐 Transfers", m_ninos: "👨‍👩‍👧 Kids & seniors", m_access: "♿ Accessibility", m_idiomas: "🗣️ Languages", m_clima: "🌦️ Weather",
      m_temporadas: "📆 Seasons", m_cancel: "↩️ Cancellations", m_sost: "🌿 Sustainability", m_empresa: "🏡 About us", m_redes: "📱 Social media", m_compartido: "🚐 Shared tour Cocora + Salento",
      pick_cat: "Which experience? Pick a category 👇", pick_tour: "Pick the experience:",
      hub: "*{tour}* · {code}\nWhat would you like to know?", see_card: "🔎 See full details", book_this: "📅 Book this", another_tour: "Another experience",
      a_horario: "*{tour}*: {h}.", a_dur: "*{tour}* takes about *{d}* from hotel pickup.",
      a_incl: "*{tour}* includes:", a_noincl: "Not included:", a_tbd: "An advisor will confirm that for you 💬",
      a_price_pub: "2026 retail price: *{p}*.", forecast: "🌦️ Forecast for your date:",
      rain: "🌧️ Rain likely that day: bring waterproof clothing.", uv: "☀️ Very high UV: sunscreen, cap and sunglasses.", cold: "🧥 Chilly morning: bring a jacket.",
      f_guide: "Guide language", no_match: "I don't have that exact answer 🙈 Let me connect you with an advisor on WhatsApp.",
      wa_q: "Hi Espontáneos Travel! I have a question:", wa_default: "Hi Espontáneos Travel! I'd like more information about your experiences.",
      open_wa: "Open WhatsApp", go_sust: "See the Sustainability section", go_tours: "See experiences", pay_btn: "💳 Pay deposit",
      wa_tour: "🌿 Experience:", wa_guide: "🧭 Guide language:", confirm_book: "Would you like to book *{tour}*?", wa_lead_tour: "Hi Espontáneos Travel! I'd like to book:", consent: "I authorise the processing of my data under the {link} (Colombian Law 1581 of 2012).", consent_link: "privacy policy", consent_req: "To continue, please accept the data policy 🙂", greet_fallback: "Hi! I'm Jenny from Espontáneos Travel 🌿 How can I help?"
    },
    fr: {
      launch: "Besoin d'aide ?", close: "Fermer", title: "Jenny", subtitle: "Votre hôte · en ligne",
      menu_prompt: "Choisissez un sujet ou écrivez votre question 👇", more: "➕ Plus de sujets", back: "↩ Menu", other: "Autre question",
      foot: "Informations officielles du portefeuille · un conseiller confirme les détails", ask_ph: "Écrivez votre question…", send: "Envoyer",
      m_reservar: "📅 Réserver", m_horarios: "🕘 Horaires", m_duracion: "⏱️ Durée", m_incluye: "✅ Ce qui est inclus", m_llevar: "🎒 Quoi emporter",
      m_precios: "💲 Prix", m_pagos: "💳 Paiements", m_plans: "🗺️ Itinéraires", m_scan: "📷 Scanner un QR", m_asesor: "💬 Parler à un conseiller",
      m_traslados: "🚐 Transferts", m_ninos: "👨‍👩‍👧 Enfants et seniors", m_access: "♿ Accessibilité", m_idiomas: "🗣️ Langues", m_clima: "🌦️ Météo",
      m_temporadas: "📆 Saisons", m_cancel: "↩️ Annulations", m_sost: "🌿 Durabilité", m_empresa: "🏡 Qui sommes-nous", m_redes: "📱 Réseaux", m_compartido: "🚐 Tour partagé Cocora + Salento",
      pick_cat: "Quelle expérience ? Choisissez une catégorie 👇", pick_tour: "Choisissez l'expérience :",
      hub: "*{tour}* · {code}\nQue voulez-vous savoir ?", see_card: "🔎 Voir la fiche", book_this: "📅 Réserver celle-ci", another_tour: "Autre expérience",
      a_horario: "*{tour}* : {h}.", a_dur: "*{tour}* dure environ *{d}* depuis la prise en charge à l'hôtel.",
      a_incl: "*{tour}* comprend :", a_noincl: "Non inclus :", a_tbd: "Un conseiller vous le confirmera 💬",
      a_price_pub: "Prix de vente 2026 : *{p}*.", forecast: "🌦️ Prévisions pour votre date :",
      rain: "🌧️ Pluie probable ce jour-là : prévoyez des vêtements imperméables.", uv: "☀️ UV très élevé : crème solaire, casquette et lunettes.", cold: "🧥 Matin frais : prévoyez une veste.",
      f_guide: "Langue du guide", no_match: "Je n'ai pas cette réponse exacte 🙈 Je vous mets en contact avec un conseiller sur WhatsApp.",
      wa_q: "Bonjour Espontáneos Travel ! J'ai une question :", wa_default: "Bonjour Espontáneos Travel ! Je souhaite plus d'informations sur vos expériences.",
      open_wa: "Ouvrir WhatsApp", go_sust: "Voir la section Durabilité", go_tours: "Voir les expériences", pay_btn: "💳 Payer l'acompte",
      wa_tour: "🌿 Expérience :", wa_guide: "🧭 Langue du guide :", confirm_book: "Voulez-vous réserver *{tour}* ?", wa_lead_tour: "Bonjour Espontáneos Travel ! Je souhaite réserver :", consent: "J'autorise le traitement de mes données selon la {link} (loi colombienne 1581 de 2012).", consent_link: "politique de confidentialité", consent_req: "Pour continuer, acceptez la politique de données 🙂", greet_fallback: "Bonjour ! Je suis Jenny, d'Espontáneos Travel 🌿 Comment puis-je vous aider ?"
    },
    de: {
      launch: "Hilfe?", close: "Schließen", title: "Jenny", subtitle: "Ihre Gastgeberin · online",
      menu_prompt: "Wählen Sie ein Thema oder schreiben Sie Ihre Frage 👇", more: "➕ Weitere Themen", back: "↩ Menü", other: "Andere Frage",
      foot: "Offizielle Portfolio-Informationen · ein Berater bestätigt die Details", ask_ph: "Ihre Frage…", send: "Senden",
      m_reservar: "📅 Buchen", m_horarios: "🕘 Uhrzeiten", m_duracion: "⏱️ Dauer", m_incluye: "✅ Inklusive", m_llevar: "🎒 Was mitnehmen",
      m_precios: "💲 Preise", m_pagos: "💳 Zahlung", m_plans: "🗺️ Reisepläne", m_scan: "📷 QR scannen", m_asesor: "💬 Mit Berater sprechen",
      m_traslados: "🚐 Transfers", m_ninos: "👨‍👩‍👧 Kinder & Senioren", m_access: "♿ Barrierefreiheit", m_idiomas: "🗣️ Sprachen", m_clima: "🌦️ Wetter",
      m_temporadas: "📆 Saisons", m_cancel: "↩️ Stornierung", m_sost: "🌿 Nachhaltigkeit", m_empresa: "🏡 Über uns", m_redes: "📱 Soziale Medien", m_compartido: "🚐 Gruppentour Cocora + Salento",
      pick_cat: "Welches Erlebnis? Wählen Sie eine Kategorie 👇", pick_tour: "Wählen Sie das Erlebnis:",
      hub: "*{tour}* · {code}\nWas möchten Sie wissen?", see_card: "🔎 Details ansehen", book_this: "📅 Dieses buchen", another_tour: "Anderes Erlebnis",
      a_horario: "*{tour}*: {h}.", a_dur: "*{tour}* dauert ca. *{d}* ab Abholung am Hotel.",
      a_incl: "*{tour}* beinhaltet:", a_noincl: "Nicht inklusive:", a_tbd: "Das bestätigt Ihnen ein Berater 💬",
      a_price_pub: "Verkaufspreis 2026: *{p}*.", forecast: "🌦️ Vorhersage für Ihr Datum:",
      rain: "🌧️ An diesem Tag ist Regen wahrscheinlich: wasserfeste Kleidung mitnehmen.", uv: "☀️ Sehr hoher UV-Index: Sonnencreme, Kappe und Brille.", cold: "🧥 Kühler Morgen: Jacke mitnehmen.",
      f_guide: "Sprache des Guides", no_match: "Darauf habe ich keine genaue Antwort 🙈 Ich verbinde Sie per WhatsApp mit einem Berater.",
      wa_q: "Hallo Espontáneos Travel! Ich habe eine Frage:", wa_default: "Hallo Espontáneos Travel! Ich hätte gern mehr Informationen zu Ihren Erlebnissen.",
      open_wa: "WhatsApp öffnen", go_sust: "Bereich Nachhaltigkeit ansehen", go_tours: "Erlebnisse ansehen", pay_btn: "💳 Anzahlung leisten",
      wa_tour: "🌿 Erlebnis:", wa_guide: "🧭 Sprache des Guides:", confirm_book: "Möchten Sie *{tour}* buchen?", wa_lead_tour: "Hallo Espontáneos Travel! Ich möchte buchen:", consent: "Ich stimme der Verarbeitung meiner Daten gemäß der {link} zu (kolumbianisches Gesetz 1581 von 2012).", consent_link: "Datenschutzerklärung", consent_req: "Bitte akzeptieren Sie die Datenschutzerklärung, um fortzufahren 🙂", greet_fallback: "Hallo! Ich bin Jenny von Espontáneos Travel 🌿 Wie kann ich helfen?"
    },
    pt: {
      launch: "Posso ajudar?", close: "Fechar", title: "Jenny", subtitle: "Sua anfitriã · online",
      menu_prompt: "Escolha um tema ou escreva sua pergunta 👇", more: "➕ Mais temas", back: "↩ Menu", other: "Outra pergunta",
      foot: "Informação oficial do portfólio · um consultor confirma os detalhes", ask_ph: "Escreva sua pergunta…", send: "Enviar",
      m_reservar: "📅 Reservar", m_horarios: "🕘 Horários", m_duracion: "⏱️ Duração", m_incluye: "✅ O que inclui", m_llevar: "🎒 O que levar",
      m_precios: "💲 Preços", m_pagos: "💳 Pagamentos", m_plans: "🗺️ Roteiros", m_scan: "📷 Escanear QR", m_asesor: "💬 Falar com um consultor",
      m_traslados: "🚐 Traslados", m_ninos: "👨‍👩‍👧 Crianças e idosos", m_access: "♿ Acessibilidade", m_idiomas: "🗣️ Idiomas", m_clima: "🌦️ Clima",
      m_temporadas: "📆 Temporadas", m_cancel: "↩️ Cancelamentos", m_sost: "🌿 Sustentabilidade", m_empresa: "🏡 Quem somos", m_redes: "📱 Redes sociais", m_compartido: "🚐 Tour compartilhado Cocora + Salento",
      pick_cat: "Sobre qual experiência? Escolha uma categoria 👇", pick_tour: "Escolha a experiência:",
      hub: "*{tour}* · {code}\nO que você quer saber?", see_card: "🔎 Ver detalhes", book_this: "📅 Reservar esta", another_tour: "Outra experiência",
      a_horario: "*{tour}*: {h}.", a_dur: "*{tour}* dura aprox. *{d}* desde a busca no hotel.",
      a_incl: "*{tour}* inclui:", a_noincl: "Não inclui:", a_tbd: "Um consultor confirma isso para você 💬",
      a_price_pub: "Preço de venda 2026: *{p}*.", forecast: "🌦️ Previsão para a sua data:",
      rain: "🌧️ Chuva provável nesse dia: leve roupa impermeável.", uv: "☀️ UV muito alto: protetor, boné e óculos.", cold: "🧥 Manhã fria: leve um casaco.",
      f_guide: "Idioma do guia", no_match: "Não tenho essa resposta exata 🙈 Vou passar você para um consultor no WhatsApp.",
      wa_q: "Olá Espontáneos Travel! Tenho uma pergunta:", wa_default: "Olá Espontáneos Travel! Gostaria de mais informações sobre as experiências.",
      open_wa: "Abrir WhatsApp", go_sust: "Ver seção Sustentabilidade", go_tours: "Ver experiências", pay_btn: "💳 Pagar sinal",
      wa_tour: "🌿 Experiência:", wa_guide: "🧭 Idioma do guia:", confirm_book: "Quer reservar *{tour}*?", wa_lead_tour: "Olá Espontáneos Travel! Quero reservar:", consent: "Autorizo o tratamento dos meus dados conforme a {link} (Lei colombiana 1581 de 2012).", consent_link: "política de privacidade", consent_req: "Para continuar, aceite a política de dados 🙂", greet_fallback: "Olá! Sou a Jenny, da Espontáneos Travel 🌿 Como posso ajudar?"
    }
  };

  // Temas del árbol (id del nodo en jenny.json → etiqueta del menú)
  const PRIMARY = ["reservar", "horarios", "duracion", "que_incluye", "que_llevar", "precios", "pagos", "plans", "asesor"];
  const MORE = ["compartido", "traslados", "ninos_mayores", "accesibilidad", "idiomas", "clima", "temporadas", "cancelacion", "sostenibilidad", "empresa", "redes", "scan"];
  const LABEL = { reservar: "m_reservar", horarios: "m_horarios", duracion: "m_duracion", que_incluye: "m_incluye", que_llevar: "m_llevar", precios: "m_precios",
    pagos: "m_pagos", plans: "m_plans", asesor: "m_asesor", traslados: "m_traslados", ninos_mayores: "m_ninos", accesibilidad: "m_access", idiomas: "m_idiomas",
    clima: "m_clima", temporadas: "m_temporadas", cancelacion: "m_cancel", sostenibilidad: "m_sost", empresa: "m_empresa", redes: "m_redes", compartido: "m_compartido", scan: "m_scan" };
  const TOUR_Q = ["horarios", "duracion", "que_incluye", "que_llevar"];          // preguntas que necesitan una experiencia
  // Palabras clave para el texto libre (se suman a pregunta_tipo de jenny.json)
  const KW = {
    horarios: ["hora", "horario", "a que hora", "a que horas sale", "recogen", "pickup", "what time", "schedule", "heure", "uhrzeit"],
    duracion: ["dura", "cuanto tiempo", "cuantas horas", "duracion", "how long", "duration", "duree", "dauer", "duracao"],
    que_incluye: ["incluye", "include", "inclus", "inklusive", "inclui"],
    que_llevar: ["llevar", "ropa", "empacar", "bring", "pack", "emporter", "mitnehmen", "levar"],
    precios: ["precio", "cuesta", "valor", "tarifa", "cotiz", "price", "cost", "prix", "preis", "preco", "quanto"],
    reservar: ["reserv", "book", "buchen"],
    pagos: ["pago", "pagar", "anticipo", "nequi", "daviplata", "tarjeta", "payment", "pay", "deposit", "paiement", "zahlung", "pagamento"],
    traslados: ["traslado", "aeropuerto", "transfer", "airport", "aeroport", "flughafen", "aeroporto"],
    ninos_mayores: ["nino", "bebe", "adulto mayor", "abuel", "kid", "child", "senior", "enfant", "kinder", "crianca"],
    accesibilidad: ["accesib", "silla de ruedas", "discapacidad", "movilidad", "invidente", "wheelchair", "accessib", "barriere", "acessib"],
    idiomas: ["idioma", "ingles", "language", "english", "langue", "sprache"],
    clima: ["clima", "lluvia", "llueve", "frio", "calor", "weather", "rain", "meteo", "wetter", "chuva"],
    temporadas: ["temporada", "semana santa", "season", "saison", "temporada alta"],
    cancelacion: ["cancel", "reembols", "refund", "annul", "storn"],
    sostenibilidad: ["sostenib", "comunidad", "ambiental", "sustainab", "durabl", "nachhaltig", "sustent"],
    empresa: ["quienes son", "empresa", "about you", "who are", "qui etes", "wer seid", "quem sao"],
    redes: ["instagram", "facebook", "redes", "social"],
    compartido: ["compartido", "shared", "partage", "gruppentour", "compartilhado"],
    asesor: ["asesor", "humano", "advisor", "human", "conseiller", "berater", "consultor"]
  };

  /* ---------- Estado ---------- */
  let lang = (window.EspoApp && EspoApp.getLang()) || "es";
  let started = false, opened = false, busy = false;
  const ctx = {};
  const HAS_PLANS = typeof window.EspoPlans !== "undefined";
  const D = () => window.EspoData;
  const U = () => UI[lang] || UI.es;
  const P = () => (HAS_PLANS ? EspoPlans.ui(lang) : {});
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z"/></svg>';
  let launch, panel, body, quick, headTitle, headSub, launchTxt, badge, askForm, askIn;

  /* ---------- Interfaz ---------- */
  function build() {
    launch = el("button", "espo-launch", `<span class="espo-launch__ava">J<span class="espo-badge">1</span></span><span class="espo-launch__txt"></span>`);
    launch.setAttribute("aria-label", "Jenny");
    launchTxt = launch.querySelector(".espo-launch__txt");
    badge = launch.querySelector(".espo-badge");
    panel = el("div", "espo-panel");
    panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Jenny");
    panel.innerHTML =
      `<div class="espo-head">
         <span class="espo-head__ava">J</span>
         <span class="espo-head__t"><b class="espo-h-title"></b><span class="espo-h-sub"></span></span>
         <button class="espo-head__close" aria-label="✕"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
       </div>
       <div class="espo-body" aria-live="polite"></div>
       <div class="espo-quick"></div>
       <form class="espo-ask" autocomplete="off"><input type="text" maxlength="200" aria-label="Pregunta"><button type="submit" aria-label="Enviar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button></form>
       <div class="espo-foot"></div>`;
    document.body.appendChild(launch);
    document.body.appendChild(panel);
    body = panel.querySelector(".espo-body");
    quick = panel.querySelector(".espo-quick");
    headTitle = panel.querySelector(".espo-h-title");
    headSub = panel.querySelector(".espo-h-sub");
    askForm = panel.querySelector(".espo-ask"); askIn = askForm.querySelector("input");
    launch.addEventListener("click", openPanel);
    panel.querySelector(".espo-head__close").addEventListener("click", closePanel);
    askForm.addEventListener("submit", (e) => { e.preventDefault(); const q = askIn.value.trim(); if (!q || busy) return; askIn.value = ""; addBubble(esc(q), "user"); freeText(q); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && opened) closePanel(); });
    document.addEventListener("click", (e) => {
      if (!opened) return;
      // composedPath: los chips que se re-pintan siguen contando como "dentro del panel"
      const path = (typeof e.composedPath === "function") ? e.composedPath() : [];
      if (path.some(n => n && n.hasAttribute && n.hasAttribute("data-plan-jenny"))) return;   // botones que abren a Jenny
      if (path.length) { if (path.indexOf(panel) === -1 && path.indexOf(launch) === -1) closePanel(); }
      else if (!panel.contains(e.target) && !launch.contains(e.target)) closePanel();
    });
    refreshStatic();
  }
  function refreshStatic() {
    launchTxt.textContent = U().launch; headTitle.textContent = U().title; headSub.textContent = U().subtitle;
    panel.querySelector(".espo-foot").textContent = U().foot;
    askIn.placeholder = U().ask_ph; askIn.setAttribute("aria-label", U().ask_ph);
    panel.querySelector(".espo-head__close").setAttribute("aria-label", U().close || "✕");
    askForm.querySelector("button").setAttribute("aria-label", U().send);
  }
  function openPanel() {
    opened = true; panel.classList.add("open"); launch.classList.add("hide");
    if (badge) badge.style.display = "none";
    if (!started) { started = true; start(); }
  }
  function closePanel() { opened = false; panel.classList.remove("open"); launch.classList.remove("hide"); }

  function addBubble(html, who) {
    const b = el("div", "espo-msg " + who);
    b.innerHTML = String(html).replace(/\*(.+?)\*/g, "<b>$1</b>");
    body.appendChild(b); scrollDown(); return b;
  }
  function scrollDown() { body.scrollTop = body.scrollHeight; }
  function typing() { const t = el("div", "espo-typing", "<span></span><span></span><span></span>"); body.appendChild(t); scrollDown(); return t; }
  function botSay(messages) {
    return new Promise((resolve) => {
      busy = true; quick.innerHTML = "";
      const list = (Array.isArray(messages) ? messages : [messages]).filter(Boolean);
      const next = () => {
        if (!list.length) { busy = false; resolve(); return; }
        const t = typing(); const msg = list.shift();
        setTimeout(() => { t.remove(); addBubble(msg, "bot"); setTimeout(next, 160); }, 380 + Math.min(520, String(msg).length * 5));
      };
      next();
    });
  }
  function renderChips(chips) {
    quick.innerHTML = "";
    chips.forEach(c => {
      const btn = el("button", "espo-chip" + (c.kind ? " espo-chip--" + c.kind : ""));
      btn.type = "button";
      btn.innerHTML = (c.kind === "wa" ? WA_ICON : "") + "<span>" + esc(c.label) + "</span>";
      btn.addEventListener("click", () => onChip(c));
      quick.appendChild(btn);
    });
  }
  function onChip(c) {
    if (busy) return;
    addBubble(esc(c.userLabel || c.label), "user");
    if (c.scan) { scanQR(); return; }
    if (c.wa) { EspoApp.openWhatsApp(c.waMsg || composeWA()); if (HAS_PLANS && ctx.leadId && ctx.consent) EspoPlans.sendLead(leadData("whatsapp")); }
    if (c.open) { EspoApp.openTour(c.open); closePanel(); }
    if (c.href) { window.open(c.href, "_blank", "noopener"); }
    if (c.anchor) { closePanel(); const s = document.querySelector(c.anchor); if (s) s.scrollIntoView({ behavior: "smooth" }); }
    if (c.share) { window.open("https://wa.me/?text=" + encodeURIComponent(c.share), "_blank", "noopener"); }
    if (c.set) Object.assign(ctx, c.set);
    if (c.to) go(c.to);
    else if (c.keep) renderChips(c.keep);
    else if (c.wa || c.href) renderChips(nextChips());
  }
  // Un nodo puede ser asíncrono (pronóstico) y puede pedir el formulario en vez de chips
  function go(id) {
    busy = true;
    Promise.resolve(buildNode(id)).then(node => botSay(node.msgs).then(() => { if (node.form) renderForm(); else renderChips(node.chips || menuChips()); }));
  }
  function greeting() { return (D() && D().ready() && (D().node("saludo", lang) || {}).jenny) || U().greet_fallback; }
  function start() {
    refreshStatic(); body.innerHTML = "";
    const say = () => botSay([greeting(), U().menu_prompt]).then(() => renderChips(menuChips()));
    if (D() && !D().ready()) D().load().then(say, say); else say();
  }

  /* ---------- Menús y siguientes acciones ---------- */
  function menuChips(all) {
    const ids = all ? PRIMARY.concat(MORE) : PRIMARY;
    const arr = ids.filter(id => id !== "scan" || window.EspoQR).filter(id => id !== "plans" || HAS_PLANS)
      .map(id => id === "scan" ? { label: U().m_scan, scan: true } : { label: U()[LABEL[id]], to: "n:" + id, kind: id === "reservar" ? "primary" : "" });
    if (!all) arr.push({ label: U().more, to: "more" });
    return arr;
  }
  // Regla 3: toda respuesta termina con una siguiente acción
  function nextChips(salida) {
    const out = [];
    String(salida || "reservar|asesor").split("|").forEach(w => {
      if (w === "reservar") out.push({ label: U().m_reservar, kind: "primary", to: "n:reservar" });
      else if (w === "asesor") out.push({ label: U().m_asesor, kind: "wa", wa: true });
      else if (w === "que_llevar") out.push({ label: U().m_llevar, to: "n:que_llevar" });
      else if (w === "precios") out.push({ label: U().m_precios, to: "n:precios" });
      else if (w === "horarios") out.push({ label: U().m_horarios, to: "n:horarios" });
      else if (w === "accesibilidad") out.push({ label: U().m_access, to: "n:accesibilidad" });
      else if (w === "experiencias") out.push({ label: U().go_tours, anchor: "#experiencias" });
      else if (/sostenibilidad/i.test(w)) out.push({ label: U().go_sust, anchor: "#sostenibilidad" });
    });
    if (!out.some(c => c.wa)) out.push({ label: U().m_asesor, kind: "wa", wa: true });
    out.push({ label: U().other, to: "menu" });
    return out;
  }

  /* ---------- Árbol ---------- */
  function buildNode(id) {
    if (id === "menu" || id === "more") ctx.intent = null;
    if (id === "menu") return { msgs: [U().menu_prompt], chips: menuChips() };
    if (id === "more") return { msgs: [U().menu_prompt], chips: menuChips(true).filter(c => !PRIMARY.some(p => c.to === "n:" + p)).concat([{ label: U().back, to: "menu" }]) };
    if (!D() || !D().ready()) return { msgs: [U().no_match], chips: nextChips("asesor") };

    if (id.startsWith("n:")) {
      const n = id.slice(2);
      if (n === "plans") return buildNode("plans");
      if (n === "asesor") return { msgs: [(D().node("asesor", lang) || {}).respuesta], chips: [{ label: U().open_wa, kind: "wa", wa: true }, { label: U().back, to: "menu" }] };
      if (n === "compartido") return tourNode("compartidocs", "compartido");
      if (n === "reservar") {
        const node = D().node("reservar", lang);
        if (ctx.tourId || ctx.planId) {
          const what = ctx.planId ? EspoPlans.name(EspoPlans.planById(ctx.planId), lang) : ctx.tourName;
          return { msgs: [node.respuesta, U().confirm_book.replace("{tour}", what)], chips: [
            { label: U().book_this, kind: "primary", to: "form" },
            { label: U().another_tour, to: "cats", set: { tourId: null, tourName: null, tourCode: null, planId: null, intent: "reservar" } },
            { label: U().back, to: "menu" }] };
        }
        ctx.intent = "reservar";
        return { msgs: [node.respuesta, U().pick_cat], chips: catChips() };
      }
      if (TOUR_Q.indexOf(n) >= 0) {
        if (n === "que_llevar" && !ctx.tourId && !ctx.planId) {
          ctx.intent = n;
          return { msgs: [D().general("que_llevar", lang), U().pick_cat], chips: catChips().concat(HAS_PLANS ? [{ label: U().m_plans, to: "plans" }] : []) };
        }
        if (ctx.tourId) return tourAnswer(ctx.tourId, n);
        if (ctx.planId && n === "que_llevar") return buildNode("pack:" + ctx.planId);
        ctx.intent = n;
        return { msgs: [U().pick_cat], chips: catChips() };
      }
      if (n === "precios") {
        const msgs = [(D().node("precios", lang) || {}).respuesta];
        const ti = ctx.tourId && D().tour(ctx.tourId, lang);
        if (ti && ti.precio_publico) msgs.push(U().a_price_pub.replace("{p}", esc(ti.precio_publico)));
        return { msgs, chips: [{ label: U().book_this, kind: "primary", to: ctx.tourId || ctx.planId ? "form" : "n:reservar" }].concat(nextChips("asesor")) };
      }
      const node = D().node(n, lang);
      if (!node || !node.respuesta) return { msgs: [U().no_match], chips: nextChips("asesor") };
      const chips = nextChips(node.salida);
      if (n === "pagos" && HAS_PLANS && EspoPlans.cfg.payLink) chips.unshift({ label: U().pay_btn, href: EspoPlans.cfg.payLink });
      if (n === "accesibilidad") ctx.access = true;
      return { msgs: [node.respuesta], chips };
    }

    if (id === "cats") return { msgs: [U().pick_cat], chips: catChips() };
    if (id.startsWith("cat:")) {
      const cid = id.slice(4);
      const tours = EspoApp.tours().filter(x => x.cat === cid);
      return { msgs: [U().pick_tour], chips: tours.map(x => ({ label: EspoApp.tourText(x).name, to: "tour:" + x.id })).concat([{ label: U().back, to: "cats" }]) };
    }
    if (id.startsWith("tour:")) return tourNode(id.slice(5));
    if (id.startsWith("ta:")) { const parts = id.split(":"); return tourAnswer(parts[1], parts[2]); }

    /* ----- Itinerarios (QR) ----- */
    if (id === "plans") {
      const chips = EspoPlans.plans().map(p => ({ label: EspoPlans.name(p, lang) + " · " + P().days.replace("{n}", p.days), to: "plan:" + p.id }));
      chips.push({ label: U().back, to: "menu" });
      return { msgs: [P().plans_q], chips };
    }
    if (id.startsWith("plan:")) {
      const plan = EspoPlans.planById(id.slice(5));
      if (!plan) return { msgs: [P().scan_bad], chips: menuChips() };
      ctx.planId = plan.id; ctx.tourId = null; ctx.tourName = null; ctx.tourCode = null;
      if (plan.access) ctx.access = true;
      const name = EspoPlans.name(plan, lang);
      const msgs = [];
      if (ctx.fromQR) { msgs.push(P().from_qr.replace("{plan}", name)); ctx.fromQR = false; }
      msgs.push(P().plan_intro.replace("{plan}", name).replace("{days}", P().days.replace("{n}", plan.days)) + "\n" + planLines(plan) +
        (plan.priceFrom ? "\n\n" + P().price_from.replace("{p}", plan.priceFrom) : ""));
      return { msgs, chips: [{ label: P().choose, kind: "primary", to: "form" }, { label: P().pack_for, to: "pack:" + plan.id }, { label: P().others, to: "plans" }, { label: U().back, to: "menu" }] };
    }
    if (id.startsWith("pack:")) {
      const plan = EspoPlans.planById(id.slice(5)); if (plan) { ctx.planId = plan.id; ctx.tourId = null; ctx.tourName = null; }
      return EspoPlans.packFor(currentStops(), lang).then(pack => {
        const list = packText(pack);
        const chips = [{ label: U().book_this, kind: "primary", to: "form" }, { label: P().share, share: list.replace(/\*/g, "") }, { label: U().back, to: "menu" }];
        chips[1].keep = chips;
        return { msgs: [list, weatherText(pack)].filter(Boolean), chips };
      });
    }
    if (id === "form") return { msgs: [P().form_intro], form: true };
    if (id === "summary") return summaryNode();
    return { msgs: [U().menu_prompt], chips: menuChips() };
  }
  function catChips() {
    const vis = EspoApp.tours();
    return EspoApp.categories().filter(c => c.id !== "all" && vis.some(t => t.cat === c.id))
      .map(c => ({ label: c[lang] || c.es, to: "cat:" + c.id })).concat([{ label: U().back, to: "menu" }]);
  }
  function tourNode(tid, special) {
    const base = EspoApp.tours().find(x => x.id === tid);
    const info = D().tour(tid, lang);
    if (!base || !info) return { msgs: [U().no_match], chips: nextChips("asesor") };
    ctx.tourId = tid; ctx.tourName = info.nombre; ctx.tourCode = info.codigo; ctx.planId = null;
    if (ctx.intent) { const q = ctx.intent; ctx.intent = null; if (q === "reservar") return { msgs: [P().form_intro], form: true }; return tourAnswer(tid, q); }
    const msgs = [];
    if (special === "compartido") {
      const n = D().node("tour_compartido", lang) || {};
      msgs.push("*" + info.nombre + "* · " + info.codigo + "\n" + (n.itinerario || ""));
      if (n.precio_publico) msgs.push(U().a_price_pub.replace("{p}", n.precio_publico));
      if (n.puntos_encuentro) msgs.push("📍 " + n.puntos_encuentro.map(p => p.lugar + " — " + D().hhmm(p.hora, lang)).join("\n📍 "));
      if (n.operacion) msgs.push("🗓️ " + n.operacion + (n.no_opera ? "\n🚫 " + n.no_opera.join(" · ") : ""));
    } else msgs.push(U().hub.replace("{tour}", info.nombre).replace("{code}", info.codigo));
    return { msgs, chips: tourChips(tid) };
  }
  function tourChips(tid) {
    return [
      { label: U().book_this, kind: "primary", to: "form" },
      { label: U().m_horarios, to: "ta:" + tid + ":horarios" }, { label: U().m_duracion, to: "ta:" + tid + ":duracion" },
      { label: U().m_incluye, to: "ta:" + tid + ":que_incluye" }, { label: U().m_llevar, to: "ta:" + tid + ":que_llevar" },
      { label: U().m_precios, to: "n:precios" }, { label: U().see_card, open: tid },
      { label: U().another_tour, to: "cats" }, { label: U().back, to: "menu" }
    ];
  }
  // Respuesta sobre una experiencia concreta (regla 1: si falta el dato → asesor)
  function tourAnswer(tid, q) {
    const i = D().tour(tid, lang); if (!i) return { msgs: [U().no_match], chips: nextChips("asesor") };
    ctx.tourId = tid; ctx.tourName = i.nombre; ctx.tourCode = i.codigo; ctx.planId = null;
    const msgs = [];
    if (q === "horarios") {
      if (!i.horario) msgs.push(U().a_tbd);
      else msgs.push(U().a_horario.replace("{tour}", i.nombre).replace("{h}", D().fmtHorario(i.horario, lang)) + (i.horario_nota ? "\n" + i.horario_nota : ""));
      const key = i.notas.find(n => /horario|ingreso|opera|schedule|open|horaire|uhr|horár/i.test(n)); if (key) msgs.push("ℹ️ " + key);
    } else if (q === "duracion") {
      msgs.push(i.dur == null ? U().a_tbd : U().a_dur.replace("{tour}", i.nombre).replace("{d}", D().fmtDur(i.dur, lang)));
    } else if (q === "que_incluye") {
      msgs.push(U().a_incl.replace("{tour}", i.nombre) + "\n" + i.incluye.map(x => "✅ " + x).join("\n"));
      msgs.push((i.no_incluye.length ? U().a_noincl + " " + i.no_incluye.join(" · ") + ". " : "") + D().general("no_incluye_siempre", lang));
    } else if (q === "que_llevar") {
      if (i.rec.items.length) msgs.push("*" + i.rec.titulo + "*\n" + i.rec.items.join("\n"));
      else msgs.push(D().general("que_llevar", lang));
      if (ctx.date && HAS_PLANS && EspoPlans.forecastFor) {
        return EspoPlans.forecastFor(tid, ctx.date).then(f => ({ msgs: msgs.concat(forecastLines(f)), chips: tourChips(tid) }));
      }
    }
    return { msgs, chips: tourChips(tid) };
  }
  function forecastLines(f) {
    if (!f) return [];
    const out = [U().forecast + " " + EspoPlans.fcText(f)];
    if (f.rain >= 40) out.push(U().rain);
    if (f.uv >= 8) out.push(U().uv);
    if (f.tmin <= 12) out.push(U().cold);
    return [out.join("\n")];
  }

  /* ---------- Texto libre ---------- */
  // Palabras genéricas que no identifican una experiencia (evita "quiero reservar" → "yoga en reserva natural")
  const STOP = ["tour", "experiencia", "experience", "visita", "parque", "city", "cata", "full", "day", "reserva", "reservas", "natural",
    "naturales", "colombia", "quindio", "local", "locales", "mundo", "world", "total", "coffee", "cafe", "plato", "sesion", "tradicional",
    "experiencial", "especial", "origen", "bienestar", "conexion", "manjares", "senderismo", "ecosistema", "unico", "aficionados", "trek"];
  const esc_re = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const hasWord = (t, w) => new RegExp("(^|[^a-z0-9ñ])" + esc_re(w) + "([^a-z0-9ñ]|$)").test(t);   // palabra completa
  const hasStem = (t, w) => new RegExp("(^|[^a-z0-9ñ])" + esc_re(w)).test(t);                     // inicio de palabra
  function freeText(q) {
    if (!D() || !D().ready()) { const no = () => noMatch(q); D() ? D().load().then(() => freeText(q), no) : no(); return; }
    const t = norm(q);
    // 1) ¿menciona una experiencia? (palabras completas y distintivas del nombre)
    let best = null, bestScore = 0;
    EspoApp.tours().forEach(x => {
      const words = norm(x.name + " " + EspoApp.tourText(x).name).split(/[^a-z0-9ñ]+/).filter(w => w.length > 4 && STOP.indexOf(w) < 0);
      const s = words.filter((w, i, a) => a.indexOf(w) === i).reduce((a, w) => a + (hasWord(t, w) ? w.length : 0), 0);
      if (s > bestScore) { bestScore = s; best = x.id; }
    });
    // 2) ¿qué pregunta? (palabras clave + pregunta_tipo de jenny.json, salvo las frases genéricas del tour compartido)
    let topic = null, tScore = 0;
    Object.keys(KW).forEach(id => {
      let kws = KW[id].slice();
      const node = id === "compartido" ? null : D().node(id, lang);
      if (node && node.pregunta_tipo) kws = kws.concat(node.pregunta_tipo);
      const s = kws.reduce((a, k) => { const nk = norm(k).replace(/[¿?¡!]/g, "").trim(); return a + (nk && hasStem(t, nk) ? nk.length : 0); }, 0);
      if (s > tScore) { tScore = s; topic = id; }
    });
    if (best && bestScore >= 5) {
      if (topic && TOUR_Q.indexOf(topic) >= 0) { go("ta:" + best + ":" + topic); return; }
      const info = D().tour(best, lang);
      Object.assign(ctx, { tourId: best, tourName: info ? info.nombre : EspoApp.tourText(EspoApp.tours().find(x => x.id === best)).name, tourCode: info ? info.codigo : "", planId: null, intent: null });
      if (topic === "precios" || topic === "reservar") { go("n:" + topic); return; }
      go("tour:" + best); return;
    }
    if (topic) { go("n:" + topic); return; }
    noMatch(q);
  }
  function noMatch(q) {
    const waMsg = U().wa_q + " " + q;
    botSay([U().no_match]).then(() => renderChips([{ label: U().open_wa, kind: "wa", wa: true, waMsg }, { label: U().back, to: "menu" }]));
  }

  /* ---------- Escanear QR → itinerario ---------- */
  function scanQR() {
    const T = P();
    EspoQR.scan({ title: T.scan_title, hint: T.scan_hint, file: T.scan_file, nocam: T.scan_nocam, bad: T.scan_bad, close: T.scan_close }).then(text => {
      if (!text) { renderChips(menuChips()); return; }
      const r = EspoPlans.parseQR(text);
      if (!r) { botSay([T.scan_bad]).then(() => renderChips(menuChips())); return; }
      if (r.type === "plan") { ctx.planId = r.id; ctx.src = r.src || "QR"; ctx.fromQR = true; trackVisit(); go("plan:" + r.id); }
      else if (r.type === "tour") { ctx.src = r.src || "QR"; go("tour:" + r.id); }
      else { const q = r.type === "code" ? "code=" + encodeURIComponent(r.code) : r.query; botSay([T.scan_trip]).then(() => { location.href = "viaje.html?" + q; }); }
    });
  }

  /* ---------- Formulario de datos (dentro del chat) ---------- */
  function renderForm() {
    const T = P();
    quick.innerHTML = "";
    const today = EspoPlans.localISO();
    const guide = ctx.guide || lang;
    const f = el("form", "espo-form");
    f.setAttribute("autocomplete", "on");
    f.innerHTML =
      `<label>${esc(T.f_name)}<input name="name" required maxlength="60" autocomplete="name" value="${esc(ctx.name || "")}"></label>
       <div class="espo-form__row">
         <label>${esc(T.f_date)}<input name="date" type="date" min="${today}" value="${esc(ctx.date || "")}"></label>
         <label>${esc(T.f_people)}<input name="people" type="number" min="1" max="60" value="${esc(ctx.party || 2)}"></label>
       </div>
       <label>${esc(T.f_hotel)}<input name="hotel" maxlength="80" value="${esc(ctx.hotel || "")}"></label>
       <label>${esc(U().f_guide)}<select name="guide">${["es", "en", "fr", "de", "pt", "it"].map(c => `<option value="${c}"${c === guide ? " selected" : ""}>${LANGNAME[c]}</option>`).join("")}</select></label>
       <label>${esc(T.f_diet)}<input name="diet" maxlength="80" value="${esc(ctx.diet || "")}"></label>
       <label>${esc(T.f_notes)}<input name="notes" maxlength="160" value="${esc(ctx.notes || "")}"></label>
       <label class="espo-form__chk"><input type="checkbox" name="access"${ctx.access ? " checked" : ""}> ${esc(T.f_access)}</label>
       <label class="espo-form__chk"><input type="checkbox" name="kit"${ctx.kit ? " checked" : ""}> ${esc(T.f_kit)}</label>
       <label class="espo-form__chk espo-form__consent"><input type="checkbox" name="consent"${ctx.consent ? " checked" : ""}> <span>${esc(U().consent).replace("{link}", `<a href="privacidad.html" target="_blank" rel="noopener">${esc(U().consent_link)}</a>`)}</span></label>
       <p class="espo-form__err" hidden>${esc(T.f_req)}</p>
       <button class="btn btn--primary btn--sm" type="submit">${esc(T.f_send)}</button>`;
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (n) => (f.elements[n].value || "").trim();
      const err = f.querySelector(".espo-form__err");
      if (!v("name")) { err.textContent = T.f_req; err.hidden = false; f.elements.name.focus(); return; }
      if (!f.elements.consent.checked) { err.textContent = U().consent_req; err.hidden = false; f.elements.consent.focus(); return; }
      Object.assign(ctx, { consent: true, name: v("name"), date: v("date"), party: parseInt(v("people"), 10) || 1, hotel: v("hotel"), guide: v("guide"),
        diet: v("diet"), notes: v("notes"), access: f.elements.access.checked, kit: f.elements.kit.checked });
      f.remove();
      addBubble(esc(ctx.name + " · " + ctx.party + " · " + (ctx.date ? fmtDate(ctx.date) : T.flexible)), "user");
      go("summary");
    });
    body.appendChild(f); scrollDown();
    setTimeout(() => { try { f.elements.name.focus({ preventScroll: true }); } catch (e) {} }, 50);
  }

  /* ---------- Resumen + WhatsApp ---------- */
  function fmtDate(iso) { try { return new Date(iso + "T12:00:00").toLocaleDateString(lang, { weekday: "short", day: "numeric", month: "short", year: "numeric" }); } catch (e) { return iso; } }
  function planLines(plan) { return plan.stops.map(s => (plan.days > 1 ? P().day + " " + s.d + " · " : "") + s.t + " — " + EspoPlans.stopTitle(s, lang)).join("\n"); }
  function currentStops() {
    if (ctx.planId) { const plan = EspoPlans.planById(ctx.planId); return ctx.date ? EspoPlans.planToItinerary(plan, ctx.date) : plan.stops; }
    if (ctx.tourId) return [{ tour: ctx.tourId, tourId: ctx.tourId, date: ctx.date || "", time: "09:00", title: ctx.tourName }];
    return [];
  }
  function packText(pack) {
    let s = "*" + P().pack_title + "*\n" + pack.items.map(x => (x.i ? x.i + " " : "") + x.label).join("\n");
    if (pack.tips.length) s += "\n\n*" + P().pack_tips + "*\n" + pack.tips.map(x => "• " + x).join("\n");
    return s;
  }
  function weatherText(pack) {
    const rows = pack.days.filter(d => d.fc);
    if (rows.length) return "*" + P().fc_title + "*\n" + rows.map(d => "• " + (d.date ? fmtDate(d.date) + " · " : "") + d.title + "\n   " + EspoPlans.fcText(d.fc)).join("\n");
    return pack.days.length ? P().fc_na : "";
  }
  function provisionalLink() {
    if (!ctx.date || !(ctx.planId || ctx.tourId)) return "";
    const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let code = "PRE-"; for (let i = 0; i < 5; i++) code += c[Math.floor(Math.random() * c.length)];
    const itin = ctx.planId ? EspoPlans.planToItinerary(EspoPlans.planById(ctx.planId), ctx.date)
      : [{ date: ctx.date, time: "09:00", tourId: ctx.tourId, title: ctx.tourName, maps: "" }];
    const booking = { code, lang, name: ctx.name, party: ctx.party, status: "pendiente", region: "Eje Cafetero · Quindío",
      host: { name: "Espontáneos Travel", phone: "573187200023" }, guide: { name: "—", langs: [ctx.guide || lang] },
      hotel: { name: ctx.hotel || "", area: "Quindío" }, prefs: { accessible: !!ctx.access, diet: ctx.diet || "" }, itinerary: itin };
    const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(booking)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return location.origin + location.pathname.replace(/[^/]*$/, "") + "viaje.html?d=" + b64;
  }
  function summaryNode() {
    const T = P();
    return EspoPlans.packFor(currentStops(), lang).then(pack => {
      const link = provisionalLink(); ctx.link = link;
      if (!ctx.leadId) ctx.leadId = EspoPlans.newLeadId();
      if (ctx.consent) EspoPlans.sendLead(leadData("resumen"));      // solo con autorización (Ley 1581)
      const what = ctx.planId ? EspoPlans.name(EspoPlans.planById(ctx.planId), lang) : (ctx.tourName + (ctx.tourCode ? " (" + ctx.tourCode + ")" : ""));
      const sum = [
        "*" + (ctx.planId ? T.wa_plan : T.wa_tour) + "* " + esc(what || "—"),
        "*" + T.wa_date + "* " + (ctx.date ? fmtDate(ctx.date) : T.flexible),
        "*" + T.wa_people + "* " + ctx.party,
        "*" + U().wa_guide + "* " + (LANGNAME[ctx.guide] || LANGNAME[lang])
      ];
      if (ctx.hotel) sum.push("*" + T.wa_hotel + "* " + esc(ctx.hotel));
      if (ctx.access) sum.push(T.wa_access);
      if (ctx.diet) sum.push("*" + T.wa_diet + "* " + esc(ctx.diet));
      if (ctx.kit) sum.push(T.wa_kit);
      const chips = [{ label: T.send_wa, kind: "wa", wa: true }];
      if (link) chips.push({ label: T.prov, href: link });
      chips.push({ label: T.share, share: packText(pack).replace(/\*/g, "") });
      chips.push({ label: U().m_pagos, to: "n:pagos" }, { label: U().back, to: "menu" });
      chips.forEach(c => { if (!c.to) c.keep = chips; });
      return { msgs: [T.sum_ready.replace("{name}", esc(ctx.name)), sum.join("\n"), packText(pack), weatherText(pack)].filter(Boolean), chips };
    });
  }

  /* ---------- Clientes → Google Sheets / backend (no hace nada si no está configurado) ---------- */
  function planLabel() { const p = ctx.planId && EspoPlans.planById(ctx.planId); return p ? EspoPlans.name(p, "es") + " (" + p.id + ")" : ""; }
  function leadData(stage) {
    return { stage, leadId: ctx.leadId || "", plan: planLabel(), tour: ctx.tourName ? ctx.tourName + (ctx.tourCode ? " (" + ctx.tourCode + ")" : "") : "",
      name: ctx.name || "", date: ctx.date || "", party: ctx.party || "", hotel: ctx.hotel || "", access: !!ctx.access, diet: ctx.diet || "",
      notes: [ctx.notes, ctx.guide ? "Guía: " + (LANGNAME[ctx.guide] || ctx.guide) : ""].filter(Boolean).join(" · "), kit: !!ctx.kit,
      src: ctx.src || "web", lang, link: ctx.link || "" };
  }
  function trackVisit() {
    const key = "esp_v_" + ctx.planId + "_" + ctx.src;
    try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, "1"); } catch (e) {}
    EspoPlans.sendLead({ stage: "qr_visita", plan: planLabel(), src: ctx.src, lang });
  }
  // Regla 5: tour + código, personas, fecha, hotel e idioma
  function composeWA() {
    if (!HAS_PLANS || !ctx.name) {
      const parts = [U().wa_default];
      if (ctx.tourName) parts.push("", U().wa_tour + " " + ctx.tourName + (ctx.tourCode ? " (" + ctx.tourCode + ")" : ""));
      return parts.join("\n");
    }
    const T = P(); const parts = [ctx.planId ? T.wa_lead : U().wa_lead_tour, ""];
    if (ctx.planId) { const plan = EspoPlans.planById(ctx.planId); parts.push(T.wa_plan + " " + EspoPlans.name(plan, lang) + " (" + plan.days + "d · " + plan.id + ")"); }
    else if (ctx.tourName) parts.push(T.wa_tour + " " + ctx.tourName + (ctx.tourCode ? " (" + ctx.tourCode + ")" : ""));
    parts.push(T.wa_name + " " + ctx.name);
    parts.push(T.wa_date + " " + (ctx.date ? ctx.date + " (" + fmtDate(ctx.date) + ")" : T.flexible));
    parts.push(T.wa_people + " " + ctx.party);
    if (ctx.hotel) parts.push(T.wa_hotel + " " + ctx.hotel);
    parts.push(U().wa_guide + " " + (LANGNAME[ctx.guide] || LANGNAME[lang]));
    if (ctx.access) parts.push(T.wa_access);
    if (ctx.diet) parts.push(T.wa_diet + " " + ctx.diet);
    if (ctx.notes) parts.push(T.wa_notes + " " + ctx.notes);
    if (ctx.kit) parts.push(T.wa_kit);
    if (ctx.src) parts.push(T.wa_src + " " + ctx.src);
    parts.push(T.wa_lang + " " + (LANGNAME[lang] || "Español"));
    if (ctx.link) parts.push("", T.wa_link, ctx.link);
    return parts.join("\n");
  }

  /* ---------- Cambio de idioma ---------- */
  document.addEventListener("espo:lang", (e) => {
    const newLang = e.detail; if (newLang === lang) return;
    lang = newLang; if (!launchTxt) return;      // idioma fijado antes de construir el widget
    refreshStatic();
    if (opened && started) { for (const k in ctx) delete ctx[k]; start(); } else started = false;
  });

  /* ---------- Arranque (QR impreso: index.html?plan=ID&src=aliado) ---------- */
  function startAt(id) {
    opened = true; started = true; panel.classList.add("open"); launch.classList.add("hide");
    if (badge) badge.style.display = "none";
    refreshStatic(); body.innerHTML = "";
    botSay([greeting()]).then(() => go(id));
  }
  window.EspoBot = {
    openPlan: (id) => { if (!panel) return; ctx.planId = id; startAt("plan:" + id); },
    openTour: (id) => { if (!panel) return; startAt("tour:" + id); }
  };
  function boot() {
    if (window.EspoApp) lang = EspoApp.getLang();
    build();
    const qs = new URLSearchParams(location.search);
    const src = (qs.get("src") || "").slice(0, 40);
    const whenReady = (fn) => { if (D() && !D().ready()) D().load().then(fn, fn); else fn(); };
    if (HAS_PLANS && EspoPlans.planById(qs.get("plan"))) {
      const plan = EspoPlans.planById(qs.get("plan"));
      ctx.planId = plan.id; ctx.src = src || "QR"; ctx.fromQR = true; trackVisit();
      whenReady(() => setTimeout(() => startAt("plan:" + plan.id), 400));
    } else if (qs.get("tour") && EspoApp.tours().some(x => x.id === qs.get("tour"))) {
      ctx.src = src || "QR";
      whenReady(() => setTimeout(() => startAt("tour:" + qs.get("tour")), 400));
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
