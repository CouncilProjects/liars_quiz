<script lang="ts">
	import { page } from '$app/state';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import { handleUpdate } from '$lib/updater';
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	let { children } = $props();
	//let installable = $state(false);
	//let installPrompt: any | null = null;

	const toaster = createToaster({ placement: 'top' });

	/*
	function registerSW() {
		//this practically goes and sees if there is a SW if there is a new SW it downloads it and then installs it.
		/*
		if (browser && 'serviceWorker' in navigator) {
			//register sw
			navigator.serviceWorker
				.register('/service-worker.js')
				.then((registration) => {
					console.log('[Service worker]:Registered ' + registration);
				})
				.catch((error) => {
					console.error('SW registration failed:', error);
				});
		}
  }
		*/

	let update = false;
	/*
	function isRunningAsPWA() {
		return (
			window.matchMedia('(display-mode: standalone)').matches ||
			(navigator as any).standalone === true
		);
	}
  

	function notifySWRunPWA() {
		 navigator.serviceWorker.controller?.postMessage({ type: 'As PWA' });
		 console.log('[LOG] SW notified to act like a PWA.');
	}

	function notifySWForInstall() {
		 navigator.serviceWorker.controller?.postMessage({ type: 'Install PWA' });
		 console.log('[LOG] SW notified to act like a PWA.');
	}
  */

	//register SW
	onMount(() => {
		handleUpdate((a) => {
			if (update == false) {
				update = true;
				toaster.info({
					title: 'Update available',
					description: 'Downloading update, install when prompted'
				});
			}
		});

		/*
		registerSW();
		if (isRunningAsPWA()) {
			notifySWRunPWA();
		}
		
		navigator.serviceWorker.addEventListener('message', (event) => {
			if (event.data?.type == 'new-update') {
				toaster.info({ title: 'Update available', description: 'Downloading latest version install it when prompted' });
				setTimeout(() => {
					window.location.href = '/'; // Navigate + reload
				}, 1500);
			}

			if (event.data?.type == 'installed') {
				toaster.success({ title: 'Install complete', description: 'You have recieved the app' });
			}
		});
		*/
	});

	/*
	function installableHandler(event: Event) {
		event.preventDefault();
		installable = true;
		installPrompt = event;
	}

	async function installPressed() {
		if (installPrompt == null) {
			return;
		}

		const result = await installPrompt.prompt();

		removeInstallButton();
	}

	function removeInstallButton() {
		installPrompt = null;
		installable = false;
	}
  */
</script>

<!--appinstalled when its aready installed, beforeinstallprompt when its installable
<svelte:window
	onbeforeinstallprompt={installableHandler}
	onappinstalled={() => {
		removeInstallButton();
		notifySWForInstall();
	}}
/>
-->

<svelte:head>
	<link rel="icon" href="/favicon.png" />
	<title>Liars Quiz</title>
	<!--<link rel="manifest" href="/manifest.webmanifest" />-->
</svelte:head>

{#if page.url.pathname.match('/') || ['general', 'settings'].some( (part) => page.url.pathname.includes(part) )}
	<div class="flex w-full flex-row px-4 pt-[env(safe-area-inset-top)]">
		<LightSwitch></LightSwitch>
	</div>
{/if}

<div
	class="m-0 flex h-full w-full flex-col items-center justify-center p-4 pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]"
>
	{@render children?.()}
</div>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>
