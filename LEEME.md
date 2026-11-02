# Diego Barber Studio · landing

Sitio estático (HTML + imágenes). No necesita instalar nada ni compilar.

## Publicar en Vercel
**Opción A, con GitHub**
1. Sube esta carpeta a un repositorio nuevo.
2. En vercel.com → Add New → Project → importa el repositorio.
3. Framework Preset: **Other**. Deja vacíos Build Command y Output Directory. Deploy.

**Opción B, desde la terminal**
```
npm i -g vercel
cd diego-barber-studio
vercel --prod
```

## Dominio
En el proyecto de Vercel → Settings → Domains → agrega el dominio .cl y copia los registros DNS en NIC Chile.

## Qué editar (todo está al inicio del script en index.html, en `CONFIG`)
- `whatsapp`: número con código de país, sin + ni espacios.
- `reservas`: link de la agenda de Setmore.
- `video`: video del estudio para el hero. Ej: sube `video/estudio.mp4` y escribe `video: "video/estudio.mp4"`.
- `pago`: link de cobro de Mercado Pago (si está vacío, el botón no aparece).
- `mapa`: link de la ficha de Google Maps.
- Precios: arreglo `PRECIOS`. Galería: arreglo `FOTOS` (fotos en `img/galeria/`). Estudio: `ESTUDIO` (fotos en `img/estudio/`).
