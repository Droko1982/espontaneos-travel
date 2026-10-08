# Despliegue y dominio — Espontáneos Travel

## Estado actual (8 de octubre de 2026)

- **Sitio:** https://www.espontaneostravel.com (GitHub Pages, rama `main`, carpeta raíz `/`).
  `espontaneostravel.com` sin www redirige a www. El archivo `CNAME` del repositorio lo crea GitHub: no borrarlo.
- **Repositorio:** https://github.com/Droko1982/espontaneos-travel
- **Dominio registrado en:** GoDaddy (vence el 22-feb-2027).
- **DNS administrado en:** GoDaddy (servidores `ns77/ns78.domaincontrol.com`).
- **Correo (info@):** sigue en **Hostinger**. No cancelar ese servicio de correo.

## Registros DNS en GoDaddy (no cambiar sin revisar)

| Tipo | Nombre | Valor | Para qué |
|---|---|---|---|
| A | @ | 185.199.108.153 · 185.199.109.153 · 185.199.110.153 · 185.199.111.153 | Web (GitHub Pages) |
| CNAME | www | droko1982.github.io | Web (GitHub Pages) |
| TXT | _github-pages-challenge-Droko1982 | (código de GitHub) | Verificación del dominio en GitHub |
| MX | @ | mx1.hostinger.com (5) · mx2.hostinger.com (10) | **Correo** |
| TXT | @ | v=spf1 include:_spf.mail.hostinger.com ~all | **Correo** (SPF) |
| CNAME | hostingermail-a/b/c._domainkey | hostingermail-a/b/c.dkim.mail.hostinger.com | **Correo** (DKIM) |
| CNAME | autodiscover / autoconfig | autodiscover / autoconfig.mail.hostinger.com | **Correo** (configuración automática) |

## HTTPS

En https://github.com/Droko1982/espontaneos-travel/settings/pages, cuando GitHub emita el certificado
(de minutos a 24 h), marcar **Enforce HTTPS**.

## Volver atrás (solo en emergencia)

En GoDaddy → Dominio → DNS → Servidores de nombres, volver a `ns1.dns-parking.com` y `ns2.dns-parking.com`
(Hostinger) reactiva la configuración anterior, incluido el sitio viejo, si la cuenta de Hostinger
que lo administra sigue activa.
