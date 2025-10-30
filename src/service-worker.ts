// Disables access to DOM typings like `HTMLElement` which are not available
// inside a service worker and instantiates the correct globals
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import {version,files,build} from "$service-worker";

// This gives `self` the correct types
const self = globalThis.self as unknown as ServiceWorkerGlobalScope;

const CACHE = `liars-quiz-${version}`;

const ASSETS = [
    ...build,
    ...files
]

//when i am installed i want to cashe everything so i have 100% offline. 

self.addEventListener('install', (event : ExtendableEvent) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
        console.log('[SERVICE-WORKER]: cashed '+ASSETS.length+' files');
	}

    event.waitUntil(
        addFilesToCache()
            .then(() => {
                console.log("[SERVICE-WORKER]: Completed");
                return self.skipWaiting();
            })
    );
});

// delete old cashes
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating version:', version);
    async function deleteOldCache(){
        const cachesNames = await caches.keys;

        for(const singlecache in cachesNames){
            if(singlecache!=CACHE){
                console.log('[SERVICE-WORKER] Deleting old cache:', name);
                await caches.delete(name);
            }
        }

        console.log('[SERVICE-WORKER] Claiming clients');
        await self.clients.claim();
    }
});

self.addEventListener('fetch',(event)=>{
    //get the request
    const {request} =event;
    const url= new URL(request.url);

    //i will only handle get request form the origin
    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }

    async function createResponse() {
        //open the cache (we will go for a cache first strategy)
        const cache = await caches.open(CACHE);

        // first we have the easy one, an exact match
        const cachedResp = await cache.match(request);
        if(cachedResp){
            return cachedResp;
        }

        //else try network
        try {
            const networkResp = await fetch(request);
            if(networkResp.ok){
                //put it in cache
                cache.put(request,networkResp.clone()); //macth the request to a resource
                return networkResp;
            }
            return undefined;
        } catch (error) {
            if(event.request.mode=='navigate'){
                return cache.match('/index.html'); //let the sveltekit take care of it. 
            }
            throw new Error('Network failed');
        }   
    }
    event.respondWith(createResponse());
})
