// Disables access to DOM typings like `HTMLElement` which are not available
// inside a service worker and instantiates the correct globals
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />

import {version,files,build} from "$service-worker";

// This gives `self` the correct types
const self = globalThis.self as unknown as ServiceWorkerGlobalScope;

const CACHE = `liars-quiz-${version}`;

const swConfig = `liarsQuiz-installed`;

const ASSETS = [
    ...build,
    ...files,
    '/'
]

let pwa=false;

//when i am installed i want to cashe everything so i have 100% offline. 

self.addEventListener('install', () => {
    console.log('[SW] installed successfully');
    self.skipWaiting();
});


// delete old cashes
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating version:', version);

    event.waitUntil((async () => {
        await self.clients.claim();

        // Optional: if you want to recreate cache on activation
        const config = await caches.open(swConfig);
        const offlineOK = await config.match('installed');
        if (offlineOK) {
            await addFilesToCache();
            const clients = await self.clients.matchAll({
                type: "window",
                includeUncontrolled: true
            });

            for (const client of clients) {
                client.postMessage({
                    type: "new-update",
                    version
                });
            }
        }

        const cacheNames = await caches.keys();

        for (const cacheName of cacheNames) {
            if (cacheName !== CACHE && cacheName.includes('liars-quiz')) {
                console.log('[SW] Deleting old cache:', cacheName);
                await caches.delete(cacheName);
            }
        }
    })());
});


async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    try {
        await cache.addAll(ASSETS);
    } catch (error) {
        console.error("Assets failed: " + ASSETS);
    }
    console.log('[SERVICE-WORKER]: cashed ' + ASSETS.length + ' files');
}

self.addEventListener('message',async (event)=>{
    if(event.data?.type=="Install PWA"){
    (async ()=>{
            await addFilesToCache();
            console.log("Files cashed");
            const config = await caches.open(swConfig);
            await config.put('installed',new Response('true'));
            console.log("DONE");

            const clients = await self.clients.matchAll({
                type: "window",
                includeUncontrolled: true
            });

            for (const client of clients) {
                client.postMessage({
                    type: "installed",
                    version
                });
            }
        })();
    }

    if(event.data.type=="As PWA"){
        pwa=true;
        console.log("Running PWA");
    }
})

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Only GET from our origin
    if (request.method !== 'GET' || url.origin !== self.location.origin) return;

    event.respondWith((async () => {
        const cache = await caches.open(CACHE);

        // Try cache first
        const cached = await cache.match(request);
        if(!cached) console.log("I didnt cache that "+ request.url);
        if (cached) return cached;

        try {
            const network = await fetch(request);

            if (network.ok) {
                if(pwa){
                    cache.put(request, network.clone());
                }
                
                return network;
            }

            return Response.error();
        } catch (err) {
            // Offline fallback for navigation requests
            if (request.mode === 'navigate') {
                console.log("navigations");
                return (await cache.match('/')) || Response.error();
            }

            return Response.error();
        }
    })());
});
