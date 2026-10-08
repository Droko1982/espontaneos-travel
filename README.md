# Espontáneos Travel — Sitio web oficial

Sitio web de clase mundial para **Espontáneos Travel** (RNT 91795), operador de
turismo rural comunitario, de naturaleza, cultural y **sin barreras** en el
Paisaje Cultural Cafetero de Colombia.

**Autor:** Dr. Mauricio Rodríguez Herrera · mrodriguez@uniquindio.edu.co

## Características

- ⚡ **Estático** (HTML/CSS/JS vanilla) — rápido, sin dependencias, ideal para SEO y GitHub Pages.
- 🌗 **Modo claro / oscuro** con detección de sistema y preferencia guardada.
- 🌍 **5 idiomas**: Español · English · Français · Deutsch · Português (i18n en cliente).
- 🔎 **SEO mundial**: meta tags, Open Graph, Twitter Cards, `hreflang`, `sitemap.xml`,
  `robots.txt`, datos estructurados JSON-LD (`TravelAgency` + `ItemList` de tours), canónicos.
- 🧭 **Portafolio de experiencias** filtrable por categoría, con ficha detallada (modal) por tour.
- 🖼️ **Galería** tipo masonry con lightbox (teclado + swipe-friendly).
- ♿ **Turismo sin barreras** como pilar de marca y accesibilidad real (WCAG-friendly).
- 💬 **Reservas** por WhatsApp (+57 318 7200023) y formulario a Info@espontaneostravel.com.
- 📱 Responsive, animaciones al hacer scroll, respeta `prefers-reduced-motion`.

## Estructura

```
index.html            Página principal (contenido base en español para crawlers)
404.html              Página de error con marca
css/styles.css        Sistema de diseño (tokens claro/oscuro, layout, motion)
js/data.js            Tours y galería (multilingües) — EDITAR AQUÍ el portafolio
js/i18n.js            Diccionarios de interfaz (ES/EN/FR/DE/PT)
js/main.js            Lógica: render, i18n, tema, filtros, modal, lightbox, formulario, SEO
js/bot.js             Yenny en el sitio: itinerarios, QR, datos del cliente → WhatsApp
js/plans.js           EDITAR AQUÍ: configuración (BIZ), itinerarios armados, qué llevar y clima
js/qrscan.js          Lector de QR con la cámara
viaje.html + js/concierge.js   Conserje del viajero (funciona sin señal: sw.js)
anfitrion.html        Panel: QR, viajes personalizados, recordatorios, clientes
tools/leads-apps-script.gs     Google Sheets para guardar clientes (ver WHATSAPP-BOT.md)
assets/img/logo.png   Logo oficial
robots.txt, sitemap.xml, site.webmanifest, .nojekyll
```

## Cómo editar el contenido real

1. **Tours**: en `js/data.js` reemplaza nombres, resúmenes, descripciones, precios y
   `img` (palabras clave) por tus datos reales. Para usar fotos locales, pon el archivo en
   `assets/img/` y usa `img: "local:mi-foto.jpg"`.
2. **Fotos**: sustituye las imágenes de marcador por las reales de tu carpeta de Drive.
3. **Precios**: actualmente en USD "desde"; ajusta en `priceFrom`.
4. **OG image**: añade `assets/img/og-cover.jpg` (1200×630) para vistas previas al compartir.

## Despliegue

Publicado con **GitHub Pages**. Ver [`DEPLOY.md`](DEPLOY.md) para conectar el dominio
`espontaneostravel.com`.

---
© Espontáneos Travel. Hecho con orgullo en el Quindío, Colombia.
