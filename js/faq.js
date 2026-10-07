/* ==========================================================================
   Espontáneos Travel — FAQ (SEO: sección visible 5 idiomas + FAQPage JSON-LD)
   ========================================================================== */
(function () {
  "use strict";
  const FAQ_UI = {
    es: { eyebrow: "Preguntas frecuentes", title: "Resolvemos tus dudas", sub: "Lo que más nos preguntan antes de viajar al Eje Cafetero." },
    en: { eyebrow: "FAQ", title: "Your questions answered", sub: "What travellers ask us most before visiting Colombia's Coffee Region." },
    fr: { eyebrow: "FAQ", title: "Vos questions, nos réponses", sub: "Ce qu'on nous demande le plus avant de visiter la région du café." },
    de: { eyebrow: "FAQ", title: "Ihre Fragen beantwortet", sub: "Was Reisende uns vor der Kaffeeregion am häufigsten fragen." },
    pt: { eyebrow: "Perguntas frequentes", title: "Tiramos suas dúvidas", sub: "O que mais perguntam antes de visitar a Região Cafeeira." }
  };
  const FAQ = [
    { q:{ es:"¿Cuál es la mejor época para visitar el Eje Cafetero?", en:"When is the best time to visit the Coffee Region?", fr:"Quelle est la meilleure période pour visiter la région du café ?", de:"Wann ist die beste Reisezeit für die Kaffeeregion?", pt:"Qual é a melhor época para visitar a Região Cafeeira?" },
      a:{ es:"¡Todo el año! El clima es primaveral (18–26 °C). Llueve a ratos en cualquier temporada; los meses más secos suelen ser diciembre–febrero y julio–agosto.", en:"All year round! The weather is spring-like (18–26 °C). Short rain can happen anytime; the driest months are usually December–February and July–August.", fr:"Toute l'année ! Climat printanier (18–26 °C). Pluie brève possible ; mois les plus secs : décembre–février et juillet–août.", de:"Das ganze Jahr! Frühlingshaftes Klima (18–26 °C). Kurzer Regen jederzeit; trockenste Monate: Dezember–Februar und Juli–August.", pt:"O ano todo! Clima primaveril (18–26 °C). Pode chover rápido; meses mais secos: dezembro–fevereiro e julho–agosto." } },
    { q:{ es:"¿Qué idiomas hablan sus guías?", en:"What languages do your guides speak?", fr:"Quelles langues parlent vos guides ?", de:"Welche Sprachen sprechen Ihre Guides?", pt:"Que idiomas seus guias falam?" },
      a:{ es:"Atendemos en español, inglés, francés, alemán y portugués. Indícanos tu idioma al reservar y asignamos un guía adecuado.", en:"We serve you in Spanish, English, French, German and Portuguese. Tell us your language when booking and we'll assign a suitable guide.", fr:"Nous vous accueillons en espagnol, anglais, français, allemand et portugais. Indiquez votre langue à la réservation.", de:"Wir betreuen Sie auf Spanisch, Englisch, Französisch, Deutsch und Portugiesisch. Nennen Sie Ihre Sprache bei der Buchung.", pt:"Atendemos em espanhol, inglês, francês, alemão e português. Informe seu idioma ao reservar." } },
    { q:{ es:"¿Ofrecen turismo accesible o sin barreras?", en:"Do you offer accessible / barrier-free tourism?", fr:"Proposez-vous un tourisme accessible / sans barrières ?", de:"Bieten Sie barrierefreien Tourismus an?", pt:"Vocês oferecem turismo acessível / sem barreiras?" },
      a:{ es:"Sí. Diseñamos experiencias con rutas, transporte y acompañamiento adaptados para personas con movilidad reducida u otras necesidades. Cuéntanos y lo preparamos a tu medida.", en:"Yes. We design experiences with adapted routes, transport and support for people with reduced mobility or other needs. Tell us and we'll tailor it.", fr:"Oui. Itinéraires, transport et accompagnement adaptés pour les personnes à mobilité réduite ou autres besoins. Dites-nous vos besoins.", de:"Ja. Angepasste Routen, Transport und Begleitung für Menschen mit eingeschränkter Mobilität oder anderen Bedürfnissen. Sagen Sie uns Ihren Bedarf.", pt:"Sim. Experiências com rotas, transporte e acompanhamento adaptados para mobilidade reduzida ou outras necessidades." } },
    { q:{ es:"¿Cómo reservo y cómo pago?", en:"How do I book and pay?", fr:"Comment réserver et payer ?", de:"Wie buche und bezahle ich?", pt:"Como reservo e pago?" },
      a:{ es:"Escríbenos por WhatsApp o el formulario con tus fechas y número de personas. Separas con un anticipo del 50% y pagas el resto el día del tour. Aceptamos Nequi/Daviplata, transferencia/PSE, efectivo y tarjeta (COP, USD y EUR).", en:"Message us on WhatsApp or the form with your dates and party size. Hold your spot with a 50% deposit and pay the rest on the tour day. We accept Nequi/Daviplata, bank transfer/PSE, cash and card (COP, USD and EUR).", fr:"Écrivez-nous sur WhatsApp ou via le formulaire. Acompte de 50 % pour réserver, solde le jour du tour. Nous acceptons Nequi/Daviplata, virement/PSE, espèces et carte (COP, USD, EUR).", de:"Schreiben Sie uns per WhatsApp oder Formular. 50 % Anzahlung zur Reservierung, Rest am Tourtag. Wir akzeptieren Nequi/Daviplata, Überweisung/PSE, Bargeld und Karte (COP, USD, EUR).", pt:"Fale no WhatsApp ou no formulário. Sinal de 50% para garantir, restante no dia do tour. Aceitamos Nequi/Daviplata, transferência/PSE, dinheiro e cartão (COP, USD e EUR)." } },
    { q:{ es:"¿Qué incluyen los tours?", en:"What's included in the tours?", fr:"Qu'incluent les tours ?", de:"Was ist in den Touren enthalten?", pt:"O que os tours incluem?" },
      a:{ es:"Según el plan: guía local, transporte, entradas y algunas comidas. En cada experiencia te confirmamos el detalle exacto.", en:"Depending on the plan: local guide, transport, entrances and some meals. We confirm the exact details for each experience.", fr:"Selon la formule : guide local, transport, entrées et certains repas. Nous confirmons le détail pour chaque expérience.", de:"Je nach Paket: lokaler Guide, Transport, Eintritte und einige Mahlzeiten. Details bestätigen wir pro Erlebnis.", pt:"Conforme o plano: guia local, transporte, entradas e algumas refeições. Confirmamos o detalhe de cada experiência." } },
    { q:{ es:"¿Recogen en el hotel o el aeropuerto?", en:"Do you offer hotel or airport pickup?", fr:"Proposez-vous la prise en charge à l'hôtel ou l'aéroport ?", de:"Bieten Sie Abholung am Hotel oder Flughafen?", pt:"Vocês buscam no hotel ou aeroporto?" },
      a:{ es:"Sí. Coordinamos traslados desde tu hotel o desde los aeropuertos El Edén (Armenia) y Matecaña (Pereira).", en:"Yes. We arrange transfers from your hotel or from El Edén (Armenia) and Matecaña (Pereira) airports.", fr:"Oui. Transferts depuis votre hôtel ou les aéroports El Edén (Armenia) et Matecaña (Pereira).", de:"Ja. Transfers von Ihrem Hotel oder den Flughäfen El Edén (Armenia) und Matecaña (Pereira).", pt:"Sim. Traslados do seu hotel ou dos aeroportos El Edén (Armenia) e Matecaña (Pereira)." } }
  ];

  function lang() { try { return (window.EspoApp && EspoApp.getLang()) || document.documentElement.lang || "es"; } catch (e) { return "es"; } }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m])); }

  function render() {
    const L = lang(); const ui = FAQ_UI[L] || FAQ_UI.es;
    const eb = document.getElementById("faq-eyebrow"); if (eb) eb.textContent = ui.eyebrow;
    const ti = document.getElementById("faq-title"); if (ti) ti.textContent = ui.title;
    const sb = document.getElementById("faq-sub"); if (sb) sb.textContent = ui.sub;
    const list = document.getElementById("faq-list"); if (!list) return;
    list.innerHTML = FAQ.map((f, i) => `
      <details class="faq-item reveal"${i === 0 ? " open" : ""}>
        <summary><span>${esc(f.q[L] || f.q.es)}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></summary>
        <div class="faq-a">${esc(f.a[L] || f.a.es)}</div>
      </details>`).join("");
    injectJsonLd();
    if (window.__revealScan) window.__revealScan();
  }
  function injectJsonLd() {
    const old = document.getElementById("jsonld-faq"); if (old) old.remove();
    const data = { "@context":"https://schema.org", "@type":"FAQPage",
      "mainEntity": FAQ.map(f => ({ "@type":"Question", "name": f.q.es, "acceptedAnswer": { "@type":"Answer", "text": f.a.es } })) };
    const s = document.createElement("script"); s.type = "application/ld+json"; s.id = "jsonld-faq";
    s.textContent = JSON.stringify(data); document.head.appendChild(s);
  }

  document.addEventListener("espo:lang", render);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render); else render();
})();
