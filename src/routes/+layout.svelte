<script lang="ts">
  import '../app.css';
  import LightSwitch from '$lib/components/LightSwitch.svelte';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let { children } = $props();
  let installable = $state(false);

  let installPrompt:any|null=null;

  function  registerSW() {
    if(browser && 'serviceWorker' in navigator){
      //register sw
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration)=>{console.log("[Service worker]:Registered "+registration)})
        .catch((error)=>{console.error('SW registration failed:', error);})
    }
  }

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
    notInstall();
  }

  function notInstall(){
    installPrompt=null;
    installable=false;
  }

  //register SW
  onMount(()=>{
    registerSW();
  })
</script>

<!--appinstalled when its aready installed, beforeinstallprompt when its installable-->
<svelte:window  
onbeforeinstallprompt={installableHandler}
onappinstalled={notInstall}
/>



<svelte:head>
  <link rel="icon" href="/favicon.png" />
	<title>Liars Quiz</title>
	<link rel="manifest" href="/manifest.webmanifest">
</svelte:head>

<div class="flex flex-row w-full">
<LightSwitch></LightSwitch>
<button class="btn preset-filled-primary-300-700 ml-auto" hidden={installable==false} onclick={installPressed}>Install</button>
</div>


<div class="w-full h-full m-0 p-4 flex flex-col justify-center items-center">
{@render children?.()}

</div>

