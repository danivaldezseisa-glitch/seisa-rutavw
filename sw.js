// SEISA Rutas — Service Worker
// Maneja clics en notificaciones con botones de acción ✅/❌
// Al tocar Entregada o Fallida → solo marca la parada, sin abrir Maps.
// Al tocar el cuerpo de la notificación → enfoca la app en pantalla de seguimiento.

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

      if (action === 'entregada' || action === 'fallida') {
        // Botón de acción tocado → mandar mensaje para marcar la parada
        // No se abre Maps, solo se ejecuta la acción en la app
        const msg = { tipo: 'notif_accion', action, idx };

        if (cs.length) {
          cs[0].postMessage(msg);
          cs[0].focus();
        } else {
          // App cerrada → abrirla, navegar a seguimiento y ejecutar acción
          clients.openWindow(url).then(c => {
            if (c) setTimeout(() => c.postMessage(msg), 1500);
          });
        }

      } else {
        // Toque en el cuerpo de la notificación → ir a pantalla de seguimiento
        const msg = { tipo: 'ir_seguimiento' };

        if (cs.length) {
          cs[0].postMessage(msg);
          cs[0].focus();
        } else {
          clients.openWindow(url);
        }
      }
    })
  );
});
