<script lang="ts">
	import '../app.css';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

  let { children } = $props();

  //register SW
  onMount(()=>{
    if(browser && 'serviceWorker' in navigator){
      //register sw
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration)=>{console.log("[Service worker]:Registered "+registration)})
        .catch((error)=>{console.error('SW registration failed:', error);})
    }
  })
</script>

<svelte:head>
  <link rel="icon" href="/favicon.png" />
	<title>Liars Quiz</title>
	<link rel="manifest" href="/manifest.webmanifest">
</svelte:head>

<LightSwitch></LightSwitch>

<div class="w-full h-full m-0 p-4 flex flex-col justify-center items-center">
{@render children?.()}

</div>

