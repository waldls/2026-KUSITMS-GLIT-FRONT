self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function () {
  console.log("fcm sw activate..");
});

self.addEventListener("push", function (e) {
  if (!e.data) return;
  const payload = e.data.json();
  const { title, body } = payload.notification;
  const link = payload.webpush?.fcm_options?.link || "/";
  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icon-192x192.png",
      data: { link },
    }),
  );
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  const link = e.notification.data?.link || "/";
  e.waitUntil(clients.openWindow(link));
});
