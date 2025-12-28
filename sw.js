const CACHE_NAME = 'life-adventure-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/game-state.js',
    '/data.js',
    '/game.js',
    '/script.js',
    '/manifest.json',
    '/assets/sounds/click.mp3',
    '/assets/sounds/success.mp3',
    '/assets/images/icons/coin.png',
    '/assets/images/icons/brain.png',
    '/assets/images/icons/heart.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});