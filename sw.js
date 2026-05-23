// SEISA Rutas — Service Worker
// Maneja clics en notificaciones con botones de acción ✅/❌

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('notificationclick', e => {
  e.notification.close();

  const action = e.action;          // 'entregada' | 'fallida' | ''
  const data   = e.notification.data || {};
  const idx    = data.idx;
  const url    = data.url || '/';

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      const msg = { tipo: 'notif_accion', action, idx };

      if (cs.length) {
        // App ya abierta → mandar mensaje y enfocar
        cs[0].postMessage(msg);
        cs[0].focus();
      } else {
        // App cerrada → abrirla y mandar mensaje cuando cargue
        clients.openWindow(url).then(c => {
          if (c) {
            // Esperar a que cargue antes de enviar el mensaje
            setTimeout(() => c.postMessage(msg), 1500);
          }
        });
      }
    })
  );
});
