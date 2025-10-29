<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import { onMount } from 'svelte';

	

	onMount(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (err) {
        console.error('SW registration failed:', err);
      }
    }
  });
  let { children } = $props();
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

