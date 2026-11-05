// Reseñas de Google para la landing de Diego Barber Studio.
// Lee la ficha de Google del estudio con Places API (New) y devuelve las reseñas
// en un formato simple. Vercel guarda la respuesta en caché 12 horas.
//
// Variables de entorno (Vercel → Settings → Environment Variables):
//   GOOGLE_PLACES_API_KEY  clave de Google Cloud con "Places API (New)" activada
//   GOOGLE_PLACE_ID        ID de la ficha de Google del estudio (empieza con "ChIJ")
// Si falta alguna, responde una lista vacía y la landing muestra la invitación a dejar reseña.

module.exports = async (req, res) => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (!key || !placeId) {
    res.setHeader("Cache-Control", "s-maxage=600");
    return res.status(200).send(JSON.stringify({ configured: false, reviews: [] }));
  }

  try {
    const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=es`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri,googleMapsLinks"
      }
    });
    if (!r.ok) throw new Error(`Places API respondió ${r.status}`);
    const p = await r.json();

    const reviews = (p.reviews || [])
      .filter(v => v.rating && (v.text?.text || v.originalText?.text))
      .map(v => ({
        nombre: v.authorAttribution?.displayName || "Cliente de Google",
        foto: v.authorAttribution?.photoUri || "",
        perfil: v.authorAttribution?.uri || "",
        estrellas: v.rating,
        texto: v.text?.text || v.originalText?.text,
        hace: v.relativePublishTimeDescription || ""
      }));

    res.setHeader("Cache-Control", "s-maxage=43200, stale-while-revalidate=86400");
    return res.status(200).send(JSON.stringify({
      configured: true,
      rating: p.rating || null,
      total: p.userRatingCount || 0,
      verTodas: p.googleMapsLinks?.reviewsUri || p.googleMapsUri || "",
      escribir: p.googleMapsLinks?.writeAReviewUri || `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
      reviews
    }));
  } catch (e) {
    console.error("resenas:", e.message);
    res.setHeader("Cache-Control", "s-maxage=300");
    return res.status(200).send(JSON.stringify({ configured: true, error: true, reviews: [] }));
  }
};
