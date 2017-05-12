const CACHE_NAME = 'todo-app-v1';
const CACHE_URLS = [
  '/',
  '/sw.js',
  '/favicon.ico',
  '/browserconfig.xml',
  '/manifest.json',
  '/static/js/main.js',
  '/static/media/marked.png',
  '/icons/favicon-16x16.png',
  '/icons/favicon-32x32.png',
  '/icons/mstile-144x144.png',
  '/static/media/header_bg.png',
  '/icons/android-chrome-192x192.png',
  '/sockjs-node/info?t=1494484164820',
  '/icons/android-chrome-144x144.png',
  'https://todo-with-pwa.firebaseio.com',
  'wss://s-usc1c-nss-124.firebaseio.com/.ws',
  'https://apis.google.com/js/api.js?onload=__iframefcb646503',
  'https://console.firebase.google.com/project/todo-with-pwa/database/data/',
  'https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=AIzaSyDDo_RzQ9KvJM4rr0oMSrtPnV_ePVediYA&cb=1494484166859',
  'https://todo-app-pwa.herokuapp.com/icons/favicon-32x32.png',
  'https://todo-app-pwa.herokuapp.com/icons/android-chrome-144x144.png'
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
  const request = event.request;
  event.respondWith(
    caches.match(request).then((cacheResponse) => {
      return cacheResponse || fetch(request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, networkResponse);
        })
        return networkResponse.clone();
      })
    })
  );
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
