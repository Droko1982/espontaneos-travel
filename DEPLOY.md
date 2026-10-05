# Despliegue y dominio — Espontáneos Travel

## Estado actual

- **Preview en vivo (GitHub Pages):** https://droko1982.github.io/espontaneos-travel/
- Repo: https://github.com/Droko1982/espontaneos-travel
- Rama publicada: `main` (carpeta raíz `/`).

## Conectar el dominio espontaneostravel.com

> ⚠️ No subas el archivo `CNAME` hasta tener el DNS apuntando a GitHub Pages;
> de lo contrario el enlace `*.github.io` dejará de funcionar como preview.

### 1. En tu proveedor de dominio (DNS)

**Opción A — dominio raíz `espontaneostravel.com`** (registros A):

```
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
```

**Subdominio `www`** (recomendado como principal):

```
CNAME   www   droko1982.github.io.
```

### 2. Crear el archivo CNAME

Crea un archivo llamado `CNAME` (sin extensión) en la raíz del repo con una sola línea:

```
www.espontaneostravel.com
```

Súbelo (`git add CNAME && git commit && git push`). GitHub detectará el dominio.

### 3. En GitHub → Settings → Pages

- **Custom domain:** `www.espontaneostravel.com` → Save.
- Marca **Enforce HTTPS** cuando el certificado esté listo (unos minutos).

### 4. SEO

Las URLs canónicas, `hreflang`, Open Graph y `sitemap.xml` ya apuntan a
`https://www.espontaneostravel.com/`. Al terminar:

- Verifica el dominio en **Google Search Console** y envía `sitemap.xml`.
- Añade `assets/img/og-cover.jpg` (1200×630) para las vistas previas al compartir.

---
Autor: Dr. Mauricio Rodríguez Herrera · mrodriguez@uniquindio.edu.co
