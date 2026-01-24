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
self.addEventListener('activate', async (event) => {
    console.log('[SW] Activating version:', version);
    console.log('[SERVICE-WORKER] Claiming clients');
    await self.clients.claim();
    async function deleteOldCache(){
        let newRequired = false;
        const cachesNames = await caches.keys;

        for(const singlecache in cachesNames){
            if(singlecache!=CACHE && singlecache.includes("liars-quiz")){
                console.log('[SERVICE-WORKER] Deleting old cache:', name);
                await caches.delete(name);
                newRequired=true; //if there is a previous chach then i am propable installed
            }
        }

        if(newRequired){
            await addFilesToCache();
        }

    }

    deleteOldCache();
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

self.addEventListener('message',(event)=>{
    if(event.data?.type=="Install PWA"){
        event.waitUntil(
            addFilesToCache()
                .then(() => {
                    console.log("[SERVICE-WORKER]: Completed");
                })
        );
    }

    if(event.data.type=="As PWA"){
        console.log("Running PWA");
        pwa=true;
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
