// push-sw.js
// Este archivo tiene que estar en la RAÍZ de tu sitio (junto a index.html)
// para que sea accesible en https://tu-dominio.netlify.app/push-sw.js
//
// Es un service worker de Web Push "de toda la vida" (el estándar del
// navegador), sin ninguna dependencia de Firebase. Recibe el aviso que
// manda nuestra función de Netlify y lo muestra como notificación,
// aunque la web esté cerrada.

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "Notificación", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "Notificación";
  const body = data.body || "";
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: data.data || {}
    })
  );
});

// Si el usuario toca la notificación, abrimos (o enfocamos) la app.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("/");
    })
  );
});
