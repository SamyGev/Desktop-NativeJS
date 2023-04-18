const OFFLINE_VERSION = 1;
const CACHE_NAME = "offline";
const ORIGIN_URL = `${location.protocol}//${location.host}`;
// Customize this with a different URL if needed.
const OFFLINE_URL = "index.html";
const CACHED_FILES = [
  OFFLINE_URL,
  `${ORIGIN_URL}/assets/images/pendu/image1x1.png`,
  `${ORIGIN_URL}/assets/images/pendu/image2x1.png`,
  `${ORIGIN_URL}/assets/images/pendu/image3x1.png`,
  `${ORIGIN_URL}/assets/images/pendu/image4x1.png`,
  `${ORIGIN_URL}/assets/images/pendu/image5x1.png`,
  `${ORIGIN_URL}/assets/images/pendu/image6x1.png`,
  `${ORIGIN_URL}/assets/images/pendu/image7x1.png`,
  `${ORIGIN_URL}/assets/images/icons/icon-192x192.png`,
  `${ORIGIN_URL}/assets/js/battery.js`,
  `${ORIGIN_URL}/assets/js/geoloc.js`,
  `${ORIGIN_URL}/assets/js/network.js`,
  `${ORIGIN_URL}/assets/js/os.js`,
  `${ORIGIN_URL}/assets/js/platform.js`,
  `${ORIGIN_URL}/assets/js/userAgent.js`
];
/** Fetch */

const sendOfflinePage = (resolve) => {
  caches.open(CACHE_NAME).then((cache) => {
    cache.match(OFFLINE_URL).then((cachedResponse) => {
      resolve(cachedResponse);
    });
  });
};

const respondWithFetchPromiseNavigate = (event) =>
  new Promise((resolve) => {
    event.preloadResponse
      .then((preloadResponse) => {
        if (preloadResponse) {
          resolve(preloadResponse);
        }

        // Always try the network first.
        fetch(event.request)
          .then((networkResponse) => {
            resolve(networkResponse);
          })
          // send cache offline.html
          .catch(() => sendOfflinePage(resolve));
      })
      .catch(() => sendOfflinePage(resolve));
  });

const fetchSW = (event) => {
  // We only want to call event.respondWith() if this is a navigation request
  // for an HTML page.
  if (event.request.mode === "navigate") {
    event.respondWith(respondWithFetchPromiseNavigate(event));
  } else if (CACHED_FILES.includes(event.request.url)) {
    event.respondWith(caches.match(event.request));
  }
};

/*********************************** */

/** Activate */
const deleteOldCaches = () =>
  new Promise((resolve) => {
    caches.keys().then((keys) => {
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            caches.delete(key);
          }
        })
      ).finally(resolve);
    });
  });

const waitUntilActivatePromise = () =>
  new Promise((resolve) => {
    deleteOldCaches().then(() => {
      // Enable navigation preload if it's supported.
      // See https://developers.google.com/web/updates/2017/02/navigation-preload
      if ("navigationPreload" in self.registration) {
        self.registration.navigationPreload.enable().finally(resolve);
      }
    });
  });

const activate = (event) => {
  event.waitUntil(waitUntilActivatePromise());
  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
};

/*********************************** */

/** Install */
const waitUntilInstallationPromise = () =>
  new Promise((resolve) => {
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(CACHED_FILES).then(resolve);
    });
  });

const installSW = (event) => {
  event.waitUntil(waitUntilInstallationPromise());
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
};
/*********************************** */

/** INIT */
self.addEventListener("install", installSW);
self.addEventListener("activate", activate);
self.addEventListener("fetch", fetchSW);