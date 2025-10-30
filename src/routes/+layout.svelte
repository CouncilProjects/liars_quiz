<script lang="ts">
	import '../app.css';
	import LightSwitch from '$lib/components/LightSwitch.svelte';

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

