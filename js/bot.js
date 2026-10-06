/* ==========================================================================
   Espontáneos Travel — "Espo" web assistant → WhatsApp handoff
   Guided, multilingual quick-reply bot. No backend: funnels to wa.me with a
   fully composed message. Payments & 50% deposit reflect the agency's setup.
   ========================================================================== */
(function () {
  "use strict";
  if (!window.EspoApp) { console.warn("EspoApp not ready"); }

  const LANGNAME = { es:"Español", en:"English", fr:"Français", de:"Deutsch", pt:"Português" };

  const BOT = {
    es: {
      launch:"¿Te ayudo?", title:"Manuela", subtitle:"Tu anfitriona",
      greet:"¡Hola! 👋 Soy *Manuela*, tu anfitriona de Espontáneos Travel. Encantada de recibirte 💚",
      menu_prompt:"¿Con qué te ayudo hoy? Elige una opción 👇",
      m_exp:"🌿 Ver experiencias", m_prices:"💲 Precios", m_book:"📅 Cómo reservar",
      m_access:"♿ Turismo sin barreras", m_howget:"📍 Cómo llego", m_pay:"💳 Formas de pago",
      m_lang:"🗣️ Idiomas", m_advisor:"💬 Hablar con un asesor",
      back:"↩ Menú", all_web:"Ver todas en la web", see_web:"Verlas en la web",
      details_web:"Ver detalles", open_wa:"Abrir WhatsApp",
      exp_q:"¡Genial! ¿Qué tipo de experiencia te late?",
      list_intro:"Estas son nuestras experiencias de {cat}:",
      from:"desde", pp:"/persona",
      tour_q:"Buena elección 👌 ¿Reservamos «{tour}» o ves primero los detalles?",
      book_this:"Reservar esta",
      people_q:"¿Para cuántas personas?", p1:"1–2", p2:"3–4", p3:"5 o más",
      when_q:"¿Para cuándo lo planeas?", w1:"Esta semana", w2:"Este mes", w3:"Más adelante", w4:"Fechas flexibles",
      handoff:"¡Perfecto! Aquí está tu resumen 👇 Toca el botón y te atiende un asesor por WhatsApp (respondemos en menos de 24 h).",
      s_exp:"Experiencia", s_people:"Personas", s_when:"Fecha", s_access:"Accesibilidad: sí",
      prices_text:"Cada experiencia se cotiza *a tu medida* 💚 El valor depende del plan, el número de personas, el transporte y lo que incluya.\n\nCuéntanos qué te interesa y te damos una *cotización personalizada sin compromiso*. Para separar tu cupo se paga un *anticipo del 50%* y el resto el día de la experiencia.",
      book_text:"Reservar es muy fácil:\n1️⃣ Eliges tu experiencia\n2️⃣ Nos escribes por WhatsApp con fecha y n.º de personas\n3️⃣ Separas tu cupo con el *50% de anticipo*\n4️⃣ Pagas el resto el día del tour\n\n¿Te paso con un asesor?",
      access_text:"En Espontáneos Travel creemos en un *turismo sin barreras* ♿\n\nAdaptamos rutas, transporte y ritmos, con acompañamiento especializado, para que todas las personas disfruten el Paisaje Cafetero con autonomía y seguridad. Cuéntanos tus necesidades y lo planeamos a tu medida.",
      access_book:"Quiero una experiencia accesible",
      howget_text:"Estamos en *Armenia, Quindío* — el corazón del Eje Cafetero 🇨🇴\n\nAeropuertos cercanos: *El Edén (AXM, Armenia)* y *Matecaña (PEI, Pereira)*. Coordinamos el transporte desde tu alojamiento o punto de llegada. El punto de encuentro exacto lo confirma tu asesor al reservar.",
      pay_text:"Aceptamos:\n• *Nequi / Daviplata*\n• *Transferencia / PSE*\n• *Efectivo*\n• *Tarjeta / pago internacional*\n\nRecibimos pesos (COP), dólares (USD) y euros (EUR). Para separar tu cupo se paga el *50% de anticipo*.",
      lang_text:"Atendemos en 5 idiomas: 🇪🇸 Español · 🇬🇧 English · 🇫🇷 Français · 🇩🇪 Deutsch · 🇧🇷 Português. Puedes cambiar el idioma del sitio arriba a la derecha 🌐",
      advisor_text:"¡Con gusto! Toca el botón y te atiende un asesor por WhatsApp 👇",
      wa_lead:"¡Hola Espontáneos Travel! Vengo del sitio web y quiero información/reservar:",
      wa_exp:"• Experiencia:", wa_people:"• Personas:", wa_when:"• Fecha:", wa_access:"• Requiero turismo accesible", wa_lang:"• Idioma:",
      foot:"Respuestas guiadas · un asesor confirma los detalles"
    },
    en: {
      launch:"Need help?", title:"Manuela", subtitle:"Your travel host",
      greet:"Hi! 👋 I'm *Manuela*, your Espontáneos Travel host. So glad to have you 💚",
      menu_prompt:"How can I help you today? Pick an option 👇",
      m_exp:"🌿 See experiences", m_prices:"💲 Prices", m_book:"📅 How to book",
      m_access:"♿ Barrier-free tourism", m_howget:"📍 How to get there", m_pay:"💳 Payment methods",
      m_lang:"🗣️ Languages", m_advisor:"💬 Talk to an advisor",
      back:"↩ Menu", all_web:"See all on the site", see_web:"See them on the site",
      details_web:"View details", open_wa:"Open WhatsApp",
      exp_q:"Great! What kind of experience do you fancy?",
      list_intro:"Here are our {cat} experiences:",
      from:"from", pp:"/person",
      tour_q:"Great pick 👌 Shall we book \"{tour}\" or see the details first?",
      book_this:"Book this one",
      people_q:"For how many people?", p1:"1–2", p2:"3–4", p3:"5 or more",
      when_q:"When are you planning it?", w1:"This week", w2:"This month", w3:"Later on", w4:"Flexible dates",
      handoff:"Perfect! Here's your summary 👇 Tap the button and an advisor will help you on WhatsApp (we reply within 24 h).",
      s_exp:"Experience", s_people:"People", s_when:"Date", s_access:"Accessibility: yes",
      prices_text:"Every experience is *tailored and quoted for you* 💚 The price depends on the plan, number of people, transport and what's included.\n\nTell us what you're interested in and we'll send a *free personalised quote*. To hold your spot you pay a *50% deposit* and the rest on the day of the experience.",
      book_text:"Booking is easy:\n1️⃣ Choose your experience\n2️⃣ Message us on WhatsApp with date & number of people\n3️⃣ Hold your spot with a *50% deposit*\n4️⃣ Pay the rest on the tour day\n\nShall I connect you with an advisor?",
      access_text:"At Espontáneos Travel we believe in *barrier-free tourism* ♿\n\nWe adapt routes, transport and pacing, with specialised support, so everyone can enjoy the Coffee Landscape with autonomy and safety. Tell us your needs and we'll tailor it for you.",
      access_book:"I'd like an accessible experience",
      howget_text:"We're in *Armenia, Quindío* — the heart of the Coffee Region 🇨🇴\n\nNearest airports: *El Edén (AXM, Armenia)* and *Matecaña (PEI, Pereira)*. We arrange transport from your lodging or arrival point. Your advisor confirms the exact meeting point when you book.",
      pay_text:"We accept:\n• *Nequi / Daviplata*\n• *Bank transfer / PSE*\n• *Cash*\n• *Card / international payment*\n\nWe take Colombian pesos (COP), US dollars (USD) and euros (EUR). A *50% deposit* holds your spot.",
      lang_text:"We serve you in 5 languages: 🇪🇸 Español · 🇬🇧 English · 🇫🇷 Français · 🇩🇪 Deutsch · 🇧🇷 Português. You can switch the site language at the top right 🌐",
      advisor_text:"Of course! Tap the button and an advisor will help you on WhatsApp 👇",
      wa_lead:"Hello Espontáneos Travel! I'm coming from your website and I'd like info / to book:",
      wa_exp:"• Experience:", wa_people:"• People:", wa_when:"• Date:", wa_access:"• I need accessible tourism", wa_lang:"• Language:",
      foot:"Guided replies · an advisor confirms the details"
    },
    fr: {
      launch:"Besoin d'aide ?", title:"Manuela", subtitle:"Votre hôtesse",
      greet:"Bonjour ! 👋 Je suis *Manuela*, votre hôtesse chez Espontáneos Travel. Ravie de vous accueillir 💚",
      menu_prompt:"Comment puis-je vous aider ? Choisissez une option 👇",
      m_exp:"🌿 Voir les expériences", m_prices:"💲 Tarifs", m_book:"📅 Comment réserver",
      m_access:"♿ Tourisme sans barrières", m_howget:"📍 Comment venir", m_pay:"💳 Moyens de paiement",
      m_lang:"🗣️ Langues", m_advisor:"💬 Parler à un conseiller",
      back:"↩ Menu", all_web:"Tout voir sur le site", see_web:"Les voir sur le site",
      details_web:"Voir les détails", open_wa:"Ouvrir WhatsApp",
      exp_q:"Super ! Quel type d'expérience vous tente ?",
      list_intro:"Voici nos expériences de {cat} :",
      from:"dès", pp:"/pers.",
      tour_q:"Excellent choix 👌 On réserve « {tour} » ou vous voyez d'abord les détails ?",
      book_this:"Réserver celle-ci",
      people_q:"Pour combien de personnes ?", p1:"1–2", p2:"3–4", p3:"5 et +",
      when_q:"Pour quand le prévoyez-vous ?", w1:"Cette semaine", w2:"Ce mois-ci", w3:"Plus tard", w4:"Dates flexibles",
      handoff:"Parfait ! Voici votre récapitulatif 👇 Touchez le bouton et un conseiller vous répond sur WhatsApp (réponse sous 24 h).",
      s_exp:"Expérience", s_people:"Personnes", s_when:"Date", s_access:"Accessibilité : oui",
      prices_text:"Chaque expérience est *sur mesure et sur devis* 💚 Le prix dépend de la formule, du nombre de personnes, du transport et du contenu.\n\nDites-nous ce qui vous intéresse et nous vous enverrons un *devis personnalisé gratuit*. Pour réserver, un *acompte de 50%* est demandé, le solde le jour de l'expérience.",
      book_text:"Réserver est très simple :\n1️⃣ Choisissez votre expérience\n2️⃣ Écrivez-nous sur WhatsApp (date et nombre de personnes)\n3️⃣ Réservez avec un *acompte de 50%*\n4️⃣ Payez le solde le jour du tour\n\nJe vous mets en relation avec un conseiller ?",
      access_text:"Chez Espontáneos Travel, nous croyons au *tourisme sans barrières* ♿\n\nNous adaptons itinéraires, transport et rythme, avec un accompagnement spécialisé, pour que chacun profite du Paysage du Café en autonomie et sécurité. Dites-nous vos besoins.",
      access_book:"Je veux une expérience accessible",
      howget_text:"Nous sommes à *Armenia, Quindío* — au cœur de la Région du Café 🇨🇴\n\nAéroports proches : *El Edén (AXM, Armenia)* et *Matecaña (PEI, Pereira)*. Nous organisons le transport depuis votre hébergement. Le point de rendez-vous exact est confirmé par votre conseiller.",
      pay_text:"Nous acceptons :\n• *Nequi / Daviplata*\n• *Virement / PSE*\n• *Espèces*\n• *Carte / paiement international*\n\nNous prenons pesos (COP), dollars (USD) et euros (EUR). Un *acompte de 50%* réserve votre place.",
      lang_text:"Nous vous accueillons en 5 langues : 🇪🇸 Español · 🇬🇧 English · 🇫🇷 Français · 🇩🇪 Deutsch · 🇧🇷 Português. Changez la langue du site en haut à droite 🌐",
      advisor_text:"Avec plaisir ! Touchez le bouton et un conseiller vous répond sur WhatsApp 👇",
      wa_lead:"Bonjour Espontáneos Travel ! Je viens de votre site et je souhaite des infos / réserver :",
      wa_exp:"• Expérience :", wa_people:"• Personnes :", wa_when:"• Date :", wa_access:"• J'ai besoin d'un tourisme accessible", wa_lang:"• Langue :",
      foot:"Réponses guidées · un conseiller confirme les détails"
    },
    de: {
      launch:"Brauchen Sie Hilfe?", title:"Manuela", subtitle:"Ihre Gastgeberin",
      greet:"Hallo! 👋 Ich bin *Manuela*, Ihre Gastgeberin bei Espontáneos Travel. Schön, dass Sie da sind 💚",
      menu_prompt:"Wie kann ich helfen? Wählen Sie eine Option 👇",
      m_exp:"🌿 Erlebnisse ansehen", m_prices:"💲 Preise", m_book:"📅 So buchen Sie",
      m_access:"♿ Barrierefreier Tourismus", m_howget:"📍 Anreise", m_pay:"💳 Zahlungsarten",
      m_lang:"🗣️ Sprachen", m_advisor:"💬 Mit Berater sprechen",
      back:"↩ Menü", all_web:"Alle auf der Website", see_web:"Auf der Website ansehen",
      details_web:"Details ansehen", open_wa:"WhatsApp öffnen",
      exp_q:"Super! Welche Art von Erlebnis reizt Sie?",
      list_intro:"Das sind unsere {cat}-Erlebnisse:",
      from:"ab", pp:"/Person",
      tour_q:"Gute Wahl 👌 Buchen wir «{tour}» oder möchten Sie zuerst die Details?",
      book_this:"Dieses buchen",
      people_q:"Für wie viele Personen?", p1:"1–2", p2:"3–4", p3:"5 oder mehr",
      when_q:"Für wann planen Sie es?", w1:"Diese Woche", w2:"Diesen Monat", w3:"Später", w4:"Flexible Daten",
      handoff:"Perfekt! Hier ist Ihre Zusammenfassung 👇 Tippen Sie auf den Button und ein Berater hilft Ihnen auf WhatsApp (Antwort binnen 24 Std.).",
      s_exp:"Erlebnis", s_people:"Personen", s_when:"Datum", s_access:"Barrierefreiheit: ja",
      prices_text:"Jedes Erlebnis wird *individuell für Sie kalkuliert* 💚 Der Preis hängt vom Programm, der Personenzahl, dem Transport und den Leistungen ab.\n\nSagen Sie uns, was Sie interessiert, und wir senden ein *kostenloses persönliches Angebot*. Zur Reservierung wird eine *Anzahlung von 50%* fällig, der Rest am Tag des Erlebnisses.",
      book_text:"Buchen ist ganz einfach:\n1️⃣ Erlebnis wählen\n2️⃣ Per WhatsApp mit Datum & Personenzahl schreiben\n3️⃣ Platz mit *50% Anzahlung* sichern\n4️⃣ Rest am Tourtag zahlen\n\nSoll ich Sie mit einem Berater verbinden?",
      access_text:"Bei Espontáneos Travel glauben wir an *barrierefreien Tourismus* ♿\n\nWir passen Routen, Transport und Tempo an, mit spezialisierter Begleitung, damit alle die Kaffeelandschaft selbstbestimmt und sicher genießen. Sagen Sie uns Ihre Bedürfnisse.",
      access_book:"Ich möchte ein barrierefreies Erlebnis",
      howget_text:"Wir sind in *Armenia, Quindío* — im Herzen der Kaffeeregion 🇨🇴\n\nNächste Flughäfen: *El Edén (AXM, Armenia)* und *Matecaña (PEI, Pereira)*. Wir organisieren den Transport von Ihrer Unterkunft. Den genauen Treffpunkt bestätigt Ihr Berater bei der Buchung.",
      pay_text:"Wir akzeptieren:\n• *Nequi / Daviplata*\n• *Überweisung / PSE*\n• *Bargeld*\n• *Karte / internationale Zahlung*\n\nWir nehmen Pesos (COP), US-Dollar (USD) und Euro (EUR). Eine *Anzahlung von 50%* sichert Ihren Platz.",
      lang_text:"Wir beraten Sie in 5 Sprachen: 🇪🇸 Español · 🇬🇧 English · 🇫🇷 Français · 🇩🇪 Deutsch · 🇧🇷 Português. Die Sprache ändern Sie oben rechts 🌐",
      advisor_text:"Sehr gern! Tippen Sie auf den Button und ein Berater hilft Ihnen auf WhatsApp 👇",
      wa_lead:"Hallo Espontáneos Travel! Ich komme von Ihrer Website und möchte Infos / buchen:",
      wa_exp:"• Erlebnis:", wa_people:"• Personen:", wa_when:"• Datum:", wa_access:"• Ich benötige barrierefreien Tourismus", wa_lang:"• Sprache:",
      foot:"Geführte Antworten · ein Berater bestätigt die Details"
    },
    pt: {
      launch:"Precisa de ajuda?", title:"Manuela", subtitle:"Sua anfitriã",
      greet:"Olá! 👋 Sou a *Manuela*, sua anfitriã da Espontáneos Travel. Que bom ter você aqui 💚",
      menu_prompt:"Como posso ajudar hoje? Escolha uma opção 👇",
      m_exp:"🌿 Ver experiências", m_prices:"💲 Preços", m_book:"📅 Como reservar",
      m_access:"♿ Turismo sem barreiras", m_howget:"📍 Como chegar", m_pay:"💳 Formas de pagamento",
      m_lang:"🗣️ Idiomas", m_advisor:"💬 Falar com um consultor",
      back:"↩ Menu", all_web:"Ver todas no site", see_web:"Ver no site",
      details_web:"Ver detalhes", open_wa:"Abrir WhatsApp",
      exp_q:"Ótimo! Que tipo de experiência você curte?",
      list_intro:"Estas são nossas experiências de {cat}:",
      from:"a partir de", pp:"/pessoa",
      tour_q:"Ótima escolha 👌 Reservamos «{tour}» ou você vê os detalhes primeiro?",
      book_this:"Reservar esta",
      people_q:"Para quantas pessoas?", p1:"1–2", p2:"3–4", p3:"5 ou mais",
      when_q:"Para quando você planeja?", w1:"Esta semana", w2:"Este mês", w3:"Mais adiante", w4:"Datas flexíveis",
      handoff:"Perfeito! Aqui está seu resumo 👇 Toque no botão e um consultor te atende pelo WhatsApp (respondemos em até 24 h).",
      s_exp:"Experiência", s_people:"Pessoas", s_when:"Data", s_access:"Acessibilidade: sim",
      prices_text:"Cada experiência é *sob medida e com orçamento próprio* 💚 O valor depende do plano, do número de pessoas, do transporte e do que inclui.\n\nConte o que te interessa e enviamos um *orçamento personalizado sem compromisso*. Para garantir sua vaga paga-se um *sinal de 50%* e o restante no dia da experiência.",
      book_text:"Reservar é muito fácil:\n1️⃣ Escolha sua experiência\n2️⃣ Fale no WhatsApp com data e n.º de pessoas\n3️⃣ Garanta a vaga com *50% de sinal*\n4️⃣ Pague o restante no dia do tour\n\nQuer que eu te passe para um consultor?",
      access_text:"Na Espontáneos Travel acreditamos no *turismo sem barreiras* ♿\n\nAdaptamos rotas, transporte e ritmo, com acompanhamento especializado, para que todos aproveitem a Paisagem Cafeeira com autonomia e segurança. Conte suas necessidades.",
      access_book:"Quero uma experiência acessível",
      howget_text:"Estamos em *Armenia, Quindío* — no coração da Região Cafeeira 🇨🇴\n\nAeroportos próximos: *El Edén (AXM, Armenia)* e *Matecaña (PEI, Pereira)*. Organizamos o transporte desde sua hospedagem. O ponto de encontro exato é confirmado pelo consultor ao reservar.",
      pay_text:"Aceitamos:\n• *Nequi / Daviplata*\n• *Transferência / PSE*\n• *Dinheiro*\n• *Cartão / pagamento internacional*\n\nRecebemos pesos (COP), dólares (USD) e euros (EUR). Um *sinal de 50%* garante sua vaga.",
      lang_text:"Atendemos em 5 idiomas: 🇪🇸 Español · 🇬🇧 English · 🇫🇷 Français · 🇩🇪 Deutsch · 🇧🇷 Português. Troque o idioma do site no canto superior direito 🌐",
      advisor_text:"Com prazer! Toque no botão e um consultor te atende pelo WhatsApp 👇",
      wa_lead:"Olá Espontáneos Travel! Vim do site e gostaria de informações / reservar:",
      wa_exp:"• Experiência:", wa_people:"• Pessoas:", wa_when:"• Data:", wa_access:"• Preciso de turismo acessível", wa_lang:"• Idioma:",
      foot:"Respostas guiadas · um consultor confirma os detalhes"
    }
  };

  /* ---------- State & elements ---------- */
  let lang = (window.EspoApp && EspoApp.getLang()) || "es";
  let L = BOT[lang] || BOT.es;
  let started = false, opened = false, busy = false;
  const ctx = {};

  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z"/></svg>';

  let launch, panel, body, quick, headTitle, headSub, launchTxt, badge;

  function build() {
    launch = el("button", "espo-launch", `<span class="espo-launch__ava">M<span class="espo-badge">1</span></span><span class="espo-launch__txt"></span>`);
    launch.setAttribute("aria-label", "Espo");
    launchTxt = launch.querySelector(".espo-launch__txt");
    badge = launch.querySelector(".espo-badge");

    panel = el("div", "espo-panel");
    panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Espo");
    panel.innerHTML =
      `<div class="espo-head">
         <span class="espo-head__ava">M</span>
         <span class="espo-head__t"><b class="espo-h-title"></b><span class="espo-h-sub"></span></span>
         <button class="espo-head__close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
       </div>
       <div class="espo-body"></div>
       <div class="espo-quick"></div>
       <div class="espo-foot"></div>`;
    document.body.appendChild(launch);
    document.body.appendChild(panel);
    body = panel.querySelector(".espo-body");
    quick = panel.querySelector(".espo-quick");
    headTitle = panel.querySelector(".espo-h-title");
    headSub = panel.querySelector(".espo-h-sub");

    launch.addEventListener("click", openPanel);
    panel.querySelector(".espo-head__close").addEventListener("click", closePanel);
    // Robust closing: Esc key and clicking outside the panel
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && opened) closePanel(); });
    document.addEventListener("click", (e) => {
      if (opened && !panel.contains(e.target) && !launch.contains(e.target)) closePanel();
    });
    refreshStatic();
  }

  function refreshStatic() {
    L = BOT[lang] || BOT.es;
    launchTxt.textContent = L.launch;
    headTitle.textContent = L.title;
    headSub.textContent = L.subtitle;
    panel.querySelector(".espo-foot").textContent = L.foot;
  }

  function openPanel() {
    opened = true; panel.classList.add("open"); launch.classList.add("hide");
    if (badge) badge.style.display = "none";
    if (!started) { started = true; start(); }
  }
  function closePanel() { opened = false; panel.classList.remove("open"); launch.classList.remove("hide"); }

  /* ---------- Message rendering ---------- */
  function addBubble(text, who) {
    const b = el("div", "espo-msg " + who);
    // bold with *...*
    b.innerHTML = String(text).replace(/\*(.+?)\*/g, "<b>$1</b>");
    body.appendChild(b); scrollDown(); return b;
  }
  function scrollDown() { body.scrollTop = body.scrollHeight; }
  function typing() {
    const t = el("div", "espo-typing", "<span></span><span></span><span></span>");
    body.appendChild(t); scrollDown(); return t;
  }
  function botSay(messages) {
    return new Promise((resolve) => {
      busy = true; quick.innerHTML = "";
      const list = Array.isArray(messages) ? messages.slice() : [messages];
      const next = () => {
        if (!list.length) { busy = false; resolve(); return; }
        const t = typing();
        const msg = list.shift();
        setTimeout(() => { t.remove(); addBubble(msg, "bot"); setTimeout(next, 180); }, 480 + Math.min(600, msg.length * 7));
      };
      next();
    });
  }
  function renderChips(chips) {
    quick.innerHTML = "";
    chips.forEach(c => {
      const btn = el("button", "espo-chip" + (c.kind ? " espo-chip--" + c.kind : ""));
      btn.innerHTML = (c.kind === "wa" ? WA_ICON : "") + "<span>" + c.label + "</span>";
      btn.addEventListener("click", () => onChip(c));
      quick.appendChild(btn);
    });
  }
  function onChip(c) {
    if (busy) return;
    addBubble(c.userLabel || c.label, "user");
    if (c.wa) { const msg = composeWA(); EspoApp.openWhatsApp(msg); }
    if (c.open) { EspoApp.openTour(c.open); }
    if (c.filter !== undefined) { EspoApp.filterTo(c.filter); closePanel(); return; }
    if (c.set) Object.assign(ctx, c.set);
    if (c.to) go(c.to);
    else if (c.wa || c.open) { /* stay: re-show current chips minus none → offer back */ renderChips([{ label: L.back, to: "menu" }]); }
  }
  function go(id) { const node = buildNode(id); botSay(node.msgs).then(() => renderChips(node.chips)); }

  /* ---------- Flow ---------- */
  function start() { refreshStatic(); body.innerHTML = ""; const n = buildNode("menu", true); botSay(n.msgs).then(() => renderChips(n.chips)); }

  function menuChips() {
    return [
      { label: L.m_exp, to: "exp" }, { label: L.m_prices, to: "prices" },
      { label: L.m_book, to: "book" }, { label: L.m_access, to: "access" },
      { label: L.m_howget, to: "howget" }, { label: L.m_pay, to: "pay" },
      { label: L.m_lang, to: "lang" }, { label: L.m_advisor, to: "advisor" }
    ];
  }

  function buildNode(id, first) {
    if (id === "menu") return { msgs: first ? [L.greet, L.menu_prompt] : [L.menu_prompt], chips: menuChips() };

    if (id === "exp") {
      const cats = EspoApp.categories().filter(c => c.id !== "all").map(c => ({ label: c[lang] || c.es, to: "cat:" + c.id }));
      cats.push({ label: L.all_web, filter: "all" });
      cats.push({ label: L.back, to: "menu" });
      return { msgs: [L.exp_q], chips: cats };
    }

    if (id.startsWith("cat:")) {
      const cid = id.slice(4);
      const catName = EspoApp.catLabel(cid);
      const tours = EspoApp.tours().filter(x => x.cat === cid);
      const lines = tours.map(x => "• " + EspoApp.tourText(x).name).join("\n");
      const chips = tours.map(x => ({ label: EspoApp.tourText(x).name, to: "tour:" + x.id }));
      chips.push({ label: L.see_web, filter: cid });
      chips.push({ label: L.back, to: "exp" });
      return { msgs: [L.list_intro.replace("{cat}", catName), lines], chips: chips };
    }

    if (id.startsWith("tour:")) {
      const tid = id.slice(5);
      const tour = EspoApp.tours().find(x => x.id === tid);
      const tx = EspoApp.tourText(tour);
      ctx.tourName = tx.name; ctx.tourId = tid;
      return {
        msgs: [tx.summary, L.tour_q.replace("{tour}", tx.name)],
        chips: [
          { label: L.book_this, kind: "primary", to: "q_people" },
          { label: L.details_web, open: tid },
          { label: L.back, to: "exp" }
        ]
      };
    }

    if (id === "q_people") return {
      msgs: [L.people_q],
      chips: [
        { label: L.p1, set: { people: L.p1 }, to: "q_when" },
        { label: L.p2, set: { people: L.p2 }, to: "q_when" },
        { label: L.p3, set: { people: L.p3 }, to: "q_when" }
      ]
    };

    if (id === "q_when") return {
      msgs: [L.when_q],
      chips: [
        { label: L.w1, set: { when: L.w1 }, to: "handoff" },
        { label: L.w2, set: { when: L.w2 }, to: "handoff" },
        { label: L.w3, set: { when: L.w3 }, to: "handoff" },
        { label: L.w4, set: { when: L.w4 }, to: "handoff" }
      ]
    };

    if (id === "handoff") {
      const sum = [];
      if (ctx.tourName) sum.push("*" + L.s_exp + ":* " + ctx.tourName);
      if (ctx.people) sum.push("*" + L.s_people + ":* " + ctx.people);
      if (ctx.when) sum.push("*" + L.s_when + ":* " + ctx.when);
      if (ctx.access) sum.push("*" + L.s_access + "*");
      return { msgs: [L.handoff, sum.join("\n")], chips: [
        { label: L.open_wa, kind: "wa", wa: true },
        { label: L.m_pay, to: "pay" }, { label: L.back, to: "menu" }
      ] };
    }

    if (id === "prices") return { msgs: [L.prices_text], chips: [
      { label: L.m_exp, to: "exp" }, { label: L.m_book, to: "book" }, { label: L.m_pay, to: "pay" }, { label: L.back, to: "menu" } ] };

    if (id === "book") return { msgs: [L.book_text], chips: [
      { label: L.open_wa, kind: "wa", wa: true }, { label: L.m_pay, to: "pay" }, { label: L.m_exp, to: "exp" }, { label: L.back, to: "menu" } ] };

    if (id === "access") return { msgs: [L.access_text], chips: [
      { label: L.access_book, kind: "primary", set: { access: true }, to: "q_people" },
      { label: L.open_wa, kind: "wa", wa: true, set: { access: true } }, { label: L.back, to: "menu" } ] };

    if (id === "howget") return { msgs: [L.howget_text], chips: [
      { label: L.m_book, to: "book" }, { label: L.open_wa, kind: "wa", wa: true }, { label: L.back, to: "menu" } ] };

    if (id === "pay") return { msgs: [L.pay_text], chips: [
      { label: L.m_book, to: "book" }, { label: L.open_wa, kind: "wa", wa: true }, { label: L.back, to: "menu" } ] };

    if (id === "lang") return { msgs: [L.lang_text], chips: [ { label: L.back, to: "menu" } ] };

    if (id === "advisor") return { msgs: [L.advisor_text], chips: [
      { label: L.open_wa, kind: "wa", wa: true }, { label: L.back, to: "menu" } ] };

    return { msgs: [L.menu_prompt], chips: menuChips() };
  }

  /* ---------- Compose WhatsApp message ---------- */
  function composeWA() {
    const parts = [L.wa_lead, ""];
    if (ctx.tourName) parts.push(L.wa_exp + " " + ctx.tourName);
    if (ctx.people) parts.push(L.wa_people + " " + ctx.people);
    if (ctx.when) parts.push(L.wa_when + " " + ctx.when);
    if (ctx.access) parts.push(L.wa_access);
    parts.push(L.wa_lang + " " + (LANGNAME[lang] || "Español"));
    return parts.join("\n");
  }

  /* ---------- Language change ---------- */
  document.addEventListener("espo:lang", (e) => {
    const newLang = e.detail;
    if (newLang === lang) return;
    lang = newLang; refreshStatic();
    if (opened && started) { for (const k in ctx) delete ctx[k]; start(); }
    else { started = false; }
  });

  /* ---------- Boot ---------- */
  function boot() { if (window.EspoApp) lang = EspoApp.getLang(); build(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
