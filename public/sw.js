const CACHE_NAME = 'todo-app';
const CACHE_URLS = [
  '/',
  '/sw.js',
  '/index.html',
  '/favicon.ico',
  '/browserconfig.xml',
  '/manifest.json',
  '/static/js/main.js',
  '/static/media/marked.png',
  '/icons/favicon-32x32.png',
  '/icons/android-chrome-144x144.png',
  'https://todo-with-pwa.firebaseio.com',
  'https://console.firebase.google.com/project/todo-with-pwa/database/data/',
];

const getEndpoint = () => {
  return self.registration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.endpoint;
    }

    throw new Error('User not subscribed');
  });
}

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_URLS))
      .catch(console.log)
  );
});

self.addEventListener("activate", event => {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if(key !== CACHE_NAME) {
          return caches.delete(key);
        }
        return null;
      }));
    })
  )
});

self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)) );
});

self.addEventListener('push', event => {
  getEndpoint()
    .then(endpoint => {
      const uid = endpoint.split('gcm/send/')[1]
      return fetch(`https://todo-app-notify.herokuapp.com/notification/${uid}/fetch`)
    })
    .then(res => res.json())
    .then(body => {
      const { title, message } = body || {}
      if (!message || !title) {
        return;
      }

      self.registration.showNotification(title, {
        body: message,
        badge: 'https://todo-app-pwa.herokuapp.com/icons/favicon-32x32.png',
        icon: 'https://todo-app-pwa.herokuapp.com/icons/android-chrome-144x144.png',
      });
    })
    .catch(console.log);
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const url = './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === url && 'focus' in client) return client.focus()
      }
      if (self.clients.openWindow) return self.clients.openWindow(url)
    })
  );
});
