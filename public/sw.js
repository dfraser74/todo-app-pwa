const CACHE_NAME = 'cc-cache-2';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/media/logo.5d5d9eef.svg',
];

self.addEventListener("install", event => {
  // event.waitUntil(
  //   caches.open(CACHE_NAME)
  //     .then(cache => {
  //       console.log("SW Caching...")
  //       cache.addAll(CACHE_URLS);
  //     })
  //     .catch(err => console.log('ERROR: ', err))
  // );
});

self.addEventListener("activate", event => {
  // event.waitUntil(
  //   caches.keys().then(keys => {
  //     return Promise.all(keys.map(key => {
  //       if(key !== CACHE_NAME) {
  //         console.log("SW removing old cache", key);
  //         return caches.delete(key);
  //       }
  //       return null;
  //     }));
  //   })
  // )
});

self.addEventListener("fetch", event => {
  console.log("SW Fetch", event.request.url);
  // event.respondWith(
  //   caches.open(CACHE_NAME)
  //     .then(cache => cache.match(event.request))
  //     .then(res => {
  //       if (res) {
  //         console.log("SW found in cache")
  //         return Promise.resolve(res);
  //       }

  //       return fetch(event.request).then(rs => {
  //         if (!rs) {
  //           console.log("SW No response from fetch", event.request.url);
  //           return Promise.resolve(rs.clone());
  //         }

  //         caches.open(CACHE_NAME).then(cache => {
  //           cache.put(event.request, rs);
  //         });
  //       }).catch(console.log);
  //     })
  // );
});
