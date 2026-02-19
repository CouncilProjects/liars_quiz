<script lang="ts">
	import { goto } from "$app/navigation";
    import {fade} from "svelte/transition"
    let showDescriptions = $state(false);

    type gameType={
        gameName:string,
        entryPoint:string,
        underConst:boolean,
        nsfw?:boolean
    }
    const listOfGames:gameType[]=[
        {
            gameName:"Who is the imposter",
            entryPoint:"/imposter",
            underConst:false,
        },
        {
            gameName:"Fake out",
            entryPoint:"/fake-out",
            underConst:false,
        },
        {
            gameName:"Say That Again ?",
            entryPoint:"/say-again",
            underConst:false,
            nsfw:true,
        },
        {
            gameName:"Shady truths",
            entryPoint:"/shady-truth",
            underConst:false,
        },
        {
            gameName:"Magic Word",
            entryPoint:"/magic-word",
            underConst:false,
        }
    ]
</script>

{#snippet game(gameName:string,underConst:boolean,entryPoint:string,nsfw:boolean=false)}
    <button class="card {underConst?'cursor-auto':''} preset-filled-surface-700-300 text-surface-contrast-700-300 {underConst?'':'hover:shadow-amber-500 hover:shadow-2xs'} m-4 p-2 flex flex-col text-center" 
        onclick={()=>{if(!underConst) goto(entryPoint);}}
    >
        <span class="h6">Play the game : </span>
        <span class="font-bold h4 uppercase text-primary-contrast-600-400">{gameName}</span>
        
        {#if underConst}
            <span class="text-warning-500 caption">🚧 Under construction 🚧</span>
        {:else}
            <span>Click to play</span>
            {#if nsfw}
                <span class="uppercase text-red-500">+18 !</span>
            {/if}
        {/if}
    </button>
{/snippet}





<div class="card p-2 preset-filled-surface-600-400 grid grid-cols-1 md:grid-cols-2">
    {#each listOfGames as onegame:gameType}
        <div class="flex flex-col  md:items-center w-full">
            {@render game(onegame.gameName,onegame.underConst,onegame.entryPoint,onegame.nsfw)}
            <button class="btn preset-filled-primary-500 mt-1 mb-2 w-fit self-center" onclick={()=>goto(`general${onegame.entryPoint}/description`)}>Description</button>
        </div>
        
    {/each}
</div>