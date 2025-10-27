<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import LightSwitch from '$lib/components/LightSwitch.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Liars Quiz</title>
</svelte:head>

<LightSwitch></LightSwitch>

{@render children?.()}
