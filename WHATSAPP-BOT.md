# Kit de WhatsApp — Espontáneos Travel

Dos piezas trabajan juntas:

1. **Jenny, la asistente web** (ya en el sitio): responde al instante con la misma
   información del portafolio (`data/jenny.json`): horarios, duración, qué incluye, qué
   llevar, pagos, traslados… y **abre WhatsApp con el resumen ya redactado** (experiencia
   y código, personas, fecha, hotel e idioma). Funciona en 5 idiomas.
2. **WhatsApp Business app** (gratis): configura los mensajes automáticos de abajo para
   que, apenas te escriban, reciban un menú y la info clave aunque no estés conectado.

> ℹ️ Regla de oro: **no se publican tarifas netas** (el tarifario 2026 es para agencias y
> va en el portal DMC). Al público solo se le da precio de venta aprobado — hoy, el Tour
> Compartido Cocora + Salento: $307.000 COP por persona (2026). Lo demás se cotiza.
>
> La app gratuita de WhatsApp Business **no responde sola según el número** que elija el
> cliente (eso requiere la *API de WhatsApp Cloud* + un servidor). Lo que sí hace gratis:
> **mensaje de bienvenida**, **mensaje de ausencia** y **respuestas rápidas**.

---

## 1) Mensaje de bienvenida
*(WhatsApp Business → Ajustes → Herramientas para la empresa → Mensaje de bienvenida)*

```
¡Hola! 👋 Soy Jenny, de *Espontáneos Travel* 🌿☕
Experiencias rurales, culturales, de naturaleza y sin barreras en el Paisaje Cultural Cafetero (RNT 91795).

Cuéntanos qué buscas o escribe el número de una opción:
1️⃣ Ver experiencias (horarios, duración y qué incluyen)
2️⃣ Cotizar o reservar
3️⃣ Turismo accesible / sin barreras ♿
4️⃣ Traslados desde el aeropuerto
5️⃣ Formas de pago
6️⃣ Hablar con un asesor

Atendemos en 🇪🇸 🇬🇧 🇫🇷 🇩🇪 🇧🇷. Respondemos en menos de 24 h. ✨
```

## 2) Mensaje de ausencia
*(Herramientas para la empresa → Mensaje de ausencia)*

```
¡Gracias por escribir a Espontáneos Travel! 🌿
En este momento no estamos conectados, pero te respondemos muy pronto (máx. 24 h).

Para cotizar más rápido, cuéntanos:
• ¿Qué experiencia te interesa?
• ¿Cuántas personas y qué fecha?
• ¿Dónde te hospedas (hotel o zona)?
• ¿En qué idioma prefieres el guía?
```

---

## 3) Respuestas rápidas
*(Herramientas para la empresa → Respuestas rápidas → Agregar. El "atajo" se escribe
precedido de "/". Los textos son los mismos de Jenny para que nunca se contradigan.)*

**Atajo `/experiencias`**
```
Tenemos 52 experiencias en el Paisaje Cultural Cafetero ☕🌿: fincas cafeteras, Valle de Cocora y Salento, pueblos patrimonio, aves y naturaleza, bienestar, cabalgatas, parques y catas.
Míralas con duración, horario y qué incluye cada una aquí 👉 https://www.espontaneostravel.com/#experiencias
¿Cuál te interesa? Dime personas, fecha y hotel y te cotizo 😊
```

**Atajo `/precios`**
```
El valor depende del número de personas y de dónde te hospedas. Dime cuántas personas y la fecha y te cotizo. 😊
```

**Atajo `/reservar`**
```
¡Es muy sencillo! Para confirmar tu reserva necesitamos los nombres completos y documentos de identidad de los pasajeros, junto con el soporte de pago del anticipo. Al recibirlo te enviamos la confirmación formal de tu viaje. 🎒
```

**Atajo `/pagos`**
```
Para garantizar la disponibilidad pedimos un anticipo del 50%; el saldo y las fechas límite te los informamos en la cotización. Aceptamos transferencia bancaria, Nequi, Daviplata y tarjeta débito o crédito con enlace de pago seguro. 💳
```

**Atajo `/accesible`**
```
¡Sí! Contamos con opciones adaptadas y vehículos especiales para que todos disfruten de la región sin barreras. También tenemos guía para personas invidentes. Cuéntanos y te asesoramos de forma personalizada. ♿
```

**Atajo `/traslados`**
```
Hacemos traslados desde el aeropuerto El Edén (Armenia) y Matecaña (Pereira) a hoteles del Quindío y Risaralda, y entre Armenia, Pereira y Manizales. Trayecto aprox. 1 h. ✈️
```

**Atajo `/compartido`**
```
Tour Compartido Valle del Cocora y Salento 🌴 — $307.000 COP por persona (2026).
Sale de Armenia a las 8:15 a.m. (puntos de encuentro: Plaza de Bolívar 8:00 a.m. / Parque de la Vida 8:10 a.m.). Incluye transporte, guía en español, entrada al Bosque de Palmas / mirador, visita a Salento, hidratación o café y tarjeta de asistencia médica. No incluye almuerzo.
Opera todos los días desde 2 pasajeros; confirma antes de las 8:00 p.m. del día anterior.
```

**Atajo `/llevar`**
```
Para disfrutar al máximo del Paisaje Cultural Cafetero lleva ropa muy cómoda, bloqueador solar, repelente, buena hidratación y tu documento de identidad a la mano. ☀️💧 Te damos agua en cada recorrido y capa reutilizable para la lluvia.
```

**Atajo `/gracias`**
```
¡Gracias por elegir Espontáneos Travel! 🌿 Será un gusto recibirte en el Paisaje Cultural Cafetero. Cualquier cosa, aquí estoy. ☕✨
```

---

## 4) Enlace "click-to-WhatsApp"

Para campañas, redes o firma de correo:

```
https://wa.me/573187200023?text=Hola%20Espont%C3%A1neos%20Travel%2C%20quiero%20informaci%C3%B3n%20de%20sus%20experiencias
```

> VALIDAR: la web anterior enlazaba a 318 **730** 0023; aquí se usa 318 **720** 0023.

---

## 5) ¿Quieres un bot 100% automático en WhatsApp? (opcional, a futuro)

Requiere la **API de WhatsApp Cloud (Meta)**:
- Número de WhatsApp dedicado (no el personal) + cuenta de **Meta Business** verificada.
- Un proveedor/servicio (p. ej. **Meta Cloud API** directo, **Twilio** o **360dialog**)
  y un pequeño servidor o automatización (n8n / Make) que responda los menús.
- Costo por conversación según Meta + el proveedor.

Con eso, el cliente escribe "1" y recibe la respuesta automática, flujos de reserva,
etc. Si lo quieres, lo planeamos e implementamos como fase aparte.

---

## 6) QR de itinerarios + Jenny (ya en el sitio)

1. En `anfitrion.html` → **"QR de itinerario"**: eliges el itinerario y escribes el
   origen/aliado (ej. `HOTEL-SAZAGUA`). Imprime el QR en hoteles, flyers o redes.
2. El cliente lo escanea con la cámara del celular (o con **📷 Escanear QR** dentro de
   Jenny) → Jenny le muestra el itinerario; puede elegirlo o ver otros.
3. Deja sus datos (nombre, fecha, personas, alojamiento, accesibilidad, alimentación)
   y Jenny arma el **resumen para WhatsApp**: incluye el origen del QR y un enlace a su
   **itinerario provisional**, que puedes abrir y reenviar.
4. Jenny le da la lista de **qué llevar** según el clima de cada destino (gorra,
   bloqueador, repelente, impermeable…). Si el viaje es en los próximos ~15 días, usa
   el **pronóstico real** (Open-Meteo, gratis) y ajusta la lista.

Los itinerarios, los artículos y los perfiles de clima se editan en `js/plans.js`.

## 7) Configuración del negocio (`js/plans.js` → `BIZ`)

| Campo | Para qué | Si se deja vacío |
|---|---|---|
| `leadsEndpoint` | Guarda cada cliente en Google Sheets (escaneos de QR, resúmenes, envíos a WhatsApp). Instalación: `tools/leads-apps-script.gs`. | No se guarda nada |
| `payLink` | Botón **💳 Pagar anticipo** en "Formas de pago" de Jenny. | No aparece el botón |
| `reviewUrl` | Enlace "Escribir reseña" de tu Perfil de Empresa en Google (`g.page/r/…/review`). | Abre tu ficha en Google Maps |
| `priceFrom` (en cada itinerario) | Muestra "Desde USD X por persona". | Se cotiza a la medida |

| `officialPhones` | Números oficiales de WhatsApp. Un enlace de viaje que traiga otro número se corrige al oficial (evita enlaces falsos que desvíen clientes). | Se usa +57 318 720 0023 |
| `payLinkPrefixes` | Prefijos **exactos** de tus enlaces de pago (p. ej. `https://checkout.bold.co/payment/LNK_TUCOMERCIO`). Solo esos enlaces se muestran como botón de pago en una reserva. | Nunca se muestra un botón de pago desde una reserva |

Por seguridad, un enlace de viaje generado en el panel (`?d=`) **nunca** muestra botón de pago ni otro WhatsApp que el oficial: para cobrar, usa reservas creadas en el portal.

## 8) Herramientas del panel (`anfitrion.html`)

- **Enlace de pago por reserva**: en "Crear viaje personalizado", el campo *Enlace de pago*
  pone el botón **💳 Pagar anticipo** en el conserje de ese viajero. Cóbralo después de
  confirmar disponibilidad.
- **Recordatorio de víspera**: pega el enlace o código del viajero. Se arma el mensaje del
  día en su idioma, con horarios, pronóstico y qué llevar, listo para enviar por WhatsApp.
- **Clientes de Jenny**: con la clave de tu Apps Script ves los últimos clientes y cuántos
  escaneos, resúmenes y envíos trae cada aliado o QR.

## 9) Para el viajero

- **Sin señal**: el conserje guarda la última copia y funciona sin internet (Cocora,
  páramo). En el celular: menú del navegador → *Agregar a pantalla de inicio*.
- **Calendario**: "Añadir a mi calendario" incluye un aviso la noche anterior y una hora
  antes de cada parada.
- **Después del viaje**: el conserje muestra la tarjeta para dejar una reseña en Google o
  contarle al anfitrión cómo le fue.

---
Autor: Dr. Mauricio Rodríguez Herrera · mrodriguez@uniquindio.edu.co
Espontáneos Travel · RNT 91795 · WhatsApp +57 318 7200023
