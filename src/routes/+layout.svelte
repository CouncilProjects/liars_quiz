<script lang="ts">
  import '../app.css';
  import LightSwitch from '$lib/components/LightSwitch.svelte';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  	import { page } from '$app/state';
	import { Toast,createToaster } from '@skeletonlabs/skeleton-svelte';

  let { children } = $props();
  let installable = $state(false);
  let installPrompt:any|null=null;
  let updateToast = $state(false);

  const toaster = createToaster({placement:'top'});

  function  registerSW() {
    if(browser && 'serviceWorker' in navigator){
      //register sw
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration)=>{console.log("[Service worker]:Registered "+registration)})
        .catch((error)=>{console.error('SW registration failed:', error);})
    }
  }

  function isRunningAsPWA() {
    return window.matchMedia('(display-mode: standalone)').matches
        || (navigator as any).standalone === true;
  }

  function notifySWRunPWA(){
    navigator.serviceWorker.controller?.postMessage({type:"As PWA"});
    console.log("[LOG] SW notified to act like a PWA.");
  }

  function notifySWForInstall(){
    navigator.serviceWorker.controller?.postMessage({type:"Install PWA"});
    console.log("[LOG] SW notified to act like a PWA.");
  }


  //register SW
  onMount(()=>{
    registerSW();
    if(isRunningAsPWA()){
      notifySWRunPWA();
    }
    navigator.serviceWorker.addEventListener('message',(event)=>{
      if(event.data?.type=="new-update"){
        toaster.info({title:'Update successfull',description:"You have recieved a new update"});
      }

      if(event.data?.type=="installed"){
        toaster.success({title:'Install complete',description:"You have recieved the app"});
      }
    })
  })

  

  function installableHandler(event:Event){
    event.preventDefault();
    installable=true;
    installPrompt=event;
  }

  async function installPressed(){
    if(installPrompt==null){
      return;
    }

    const result = await installPrompt.prompt();

    removeInstallButton();
  }

  function removeInstallButton(){
    installPrompt=null;
    installable=false;
  }

  
</script>

<!--appinstalled when its aready installed, beforeinstallprompt when its installable-->
<svelte:window  
onbeforeinstallprompt={installableHandler}
onappinstalled={()=>{removeInstallButton();notifySWForInstall();}}
/>



<svelte:head>
  <link rel="icon" href="/favicon.png" />
	<title>Liars Quiz</title>
	<link rel="manifest" href="/manifest.webmanifest">
</svelte:head>

{#if page.url.pathname.match("/") || ['general','settings'].some(part=>page.url.pathname.includes(part))}
  <div class="flex flex-row w-full">
    <LightSwitch></LightSwitch>
    <button class="btn preset-filled-primary-300-700 ml-auto" hidden={installable==false} onclick={installPressed}>Install</button>
  </div>

{/if}

<div class="w-full h-full m-0 p-4 flex flex-col justify-center items-center">
{@render children?.()}

</div>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast toast={toast}>
			<Toast.Message>
			<Toast.Title>{toast.title}</Toast.Title>
			<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>