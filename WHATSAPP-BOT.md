# Kit de WhatsApp — Espontáneos Travel

Dos piezas trabajan juntas:

1. **Asistente web "Espo"** (ya en el sitio): el botón verde flotante abre un chat
   guiado con preguntas, responde al instante y **abre WhatsApp con el mensaje ya
   redactado** (experiencia, n.º de personas, fecha e idioma). Funciona en los 5 idiomas.
2. **WhatsApp Business app** (gratis): configura los mensajes automáticos de abajo para
   que, apenas te escriban, reciban un menú y la info clave aunque no estés conectado.

> ℹ️ La app gratuita de WhatsApp Business **no responde solo según el número** que elija
> el cliente (eso requiere la *API de WhatsApp Cloud* + un servidor). Lo que sí hace gratis:
> **mensaje de bienvenida**, **mensaje de ausencia** y **respuestas rápidas**. El menú guía
> al cliente y un asesor responde. Si más adelante quieres automatización total, se hace
> con la API (ver el final).

---

## 1) Mensaje de bienvenida
*(WhatsApp Business → Ajustes → Herramientas para la empresa → Mensaje de bienvenida)*

```
¡Hola! 👋 Bienvenid@ a *Espontáneos Travel* — Tradiciones y Orígenes 🌿☕
Turismo rural, cultural, de naturaleza y sin barreras en el Eje Cafetero (RNT 917395).

Cuéntanos qué buscas o escribe el número de una opción:
1️⃣ Ver experiencias y precios
2️⃣ Reservar (separas con el 50%)
3️⃣ Turismo accesible / sin barreras ♿
4️⃣ Cómo llegar y punto de encuentro
5️⃣ Formas de pago
6️⃣ Hablar con un asesor

Atendemos en 🇪🇸 🇬🇧 🇫🇷 🇩🇪 🇧🇷. Respondemos en menos de 24 h. ✨
```

## 2) Mensaje de ausencia
*(Herramientas para la empresa → Mensaje de ausencia)*

```
¡Gracias por escribir a Espontáneos Travel! 🌿
En este momento no estamos conectados, pero te responderemos muy pronto (máx. 24 h).

Mientras tanto, cuéntanos:
• ¿Qué experiencia te interesa?
• ¿Para cuántas personas y qué fechas?
• ¿Necesitas turismo accesible?

Reserva tu cupo con el 50% de anticipo. ¡Te esperamos en el Paisaje Cafetero! ☕
```

---

## 3) Respuestas rápidas
*(Herramientas para la empresa → Respuestas rápidas → Agregar. El "atajo" se escribe
precedido de "/". Escribe el atajo en el chat y la app inserta el texto.)*

**Atajo `/experiencias`**
```
Nuestras experiencias ☕🌿 (precios por persona, desde):
• Experiencia Cafetera de Origen — USD 48
• Valle de Cocora y Palma de Cera — USD 42
• Salento & Filandia Coloniales — USD 38
• Senderismo a Cascadas y Páramo — USD 65
• Un Día Campesino (comunitario) — USD 55
• Paisaje Cafetero Sin Barreras ♿ — USD 50
• Avistamiento de Aves del Quindío — USD 72
• Ruta de la Panela y el Trapiche — USD 40
• Gran Eje Cafetero · 3 días — USD 390
¿Cuál te late? Dime personas y fechas y lo armamos 😊
```

**Atajo `/precios`**
```
Las experiencias van desde USD 38 por persona (planes de varios días desde USD 390).
El valor depende del grupo, el transporte y lo que incluya cada plan.
Separas tu cupo con el *50% de anticipo* y pagas el resto el día del tour. 💚
```

**Atajo `/reservar`**
```
¡Reservar es fácil! 📅
1) Eliges la experiencia  2) Me dices fecha y n.º de personas
3) Separas con el 50% de anticipo  4) Pagas el resto el día del tour
¿Qué experiencia y para cuándo? 😊
```

**Atajo `/pagos`**
```
Formas de pago 💳
• Nequi / Daviplata
• Transferencia / PSE
• Efectivo
• Tarjeta / pago internacional
Recibimos pesos (COP), dólares (USD) y euros (EUR).
Anticipo del 50% para separar tu cupo.
```

**Atajo `/accesible`**
```
En Espontáneos Travel creemos en el turismo sin barreras ♿
Adaptamos rutas, transporte y ritmos, con acompañamiento especializado, para que
todas las personas disfruten el Paisaje Cafetero con autonomía y seguridad.
Cuéntame tus necesidades y lo planeamos a tu medida. 💚
```

**Atajo `/comollego`**
```
Estamos en Armenia, Quindío — corazón del Eje Cafetero 🇨🇴
Aeropuertos cercanos: El Edén (AXM, Armenia) y Matecaña (PEI, Pereira).
Coordinamos el transporte desde tu alojamiento. Te confirmo el punto de encuentro
exacto al reservar. 📍
```

**Atajo `/gracias`**
```
¡Gracias por elegir Espontáneos Travel! 🌿 Será un gusto recibirte en el
Paisaje Cultural Cafetero. Cualquier cosa, aquí estoy. ☕✨
```

---

## 4) Enlace "click-to-WhatsApp"

Para campañas, redes o firma de correo:

```
https://wa.me/573187200023?text=Hola%20Espont%C3%A1neos%20Travel%2C%20quiero%20informaci%C3%B3n%20de%20sus%20experiencias
```

El sitio ya usa este enlace en todos los botones y en el asistente Espo (con el
mensaje prellenado según lo que elija el visitante).

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
Autor: Dr. Mauricio Rodríguez Herrera · mrodriguez@uniquindio.edu.co
Espontáneos Travel · RNT 917395 · WhatsApp +57 318 7200023
