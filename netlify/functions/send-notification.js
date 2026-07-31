const webpush = require("web-push");

const VAPID_PUBLIC_KEY = "BOlozAKUr25UXMhCdW3RekIiSRZPSGnwZaMyJuLmO5N8Z9UOrjYXZ5H8KPX6CrH4RnRhY5Bxzaau-oM8DPTa1J4";
const VAPID_PRIVATE_KEY = "TEuP0nzTdlmNl15z-ObqZcBwV4JusQiYZ0KZK1Q7XGc";
const VAPID_CONTACT_EMAIL = "mailto:opostracker@example.com";

webpush.setVapidDetails(VAPID_CONTACT_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: "JSON inválido" };
  }

  const { subscription, title, body } = payload;
  if (!subscription || !subscription.endpoint) {
    return { statusCode: 400, body: "Falta la suscripción push" };
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: title || "Notificación",
        body: body || ""
      })
    );
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("Error enviando notificación push:", err);
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: false, error: err && err.message })
    };
  }
};
