<script lang="ts">
	import { goto } from "$app/navigation";
    import {fade} from "svelte/transition"
    let showDescriptions = $state(false);

    type gameType={
        gameName:string,
            entryPoint:string,
            underConst:boolean,
            descr:string
    }
    const listOfGames:gameType[]=[
        {
            gameName:"Who is the imposter",
            entryPoint:"/imposter",
            underConst:false,
            descr:"In this game all the players except one get the same question, while the imposter gets a different question. After all answers are written the players have to find the impostor."
        },
        {
            gameName:"Fake out",
            entryPoint:"/fake-out",
            underConst:false,
            descr:"In this game all the players except one get a word the secret,and one player is the 'SPY', then each round each player says a word that describes the secret, the 'SPY' wins if he figures out the secret while the players win if they find the 'SPY'."
        }
    ]
</script>


{#snippet description(gameName: string, desc: string)}
    {#if showDescriptions}
        <div
            in:fade={{duration:1500}}
            out:fade={{duration:500}}
            class="text-surface-contrast-700-300
                   flex flex-col text-center -mt-3
                   w-full max-w-md mx-auto p-4 mr-4 ml-4"
        >
            <span class="h6 mb-2">
                Description for {gameName}
            </span>

            <span
                class="font-bold body text-primary-contrast-600-400
                       wrap-break-word whitespace-normal overflow-hidden"
            >
                {desc}
            </span>
        </div>
    {/if}
{/snippet}

{#snippet game(gameName:string,underConst:boolean,entryPoint:string,descr:string="")}
    <button class="card {underConst?'cursor-auto':''} preset-filled-surface-700-300 text-surface-contrast-700-300 {underConst?'':'hover:shadow-amber-500 hover:shadow-2xs'} m-4 p-2 flex flex-col text-center" 
        onclick={()=>{goto(entryPoint);}}
    >
        <span class="h6">Play the game : </span>
        <span class="font-bold h4 uppercase text-primary-contrast-600-400">{gameName}</span>
        {#if underConst}
            <span class="text-warning-500 caption">🚧 Under construction 🚧</span>
        {:else}
            <span>Click to play</span>
        {/if}
        {@render description(gameName,descr)}
        
    </button>
{/snippet}




<button class="btn preset-outlined-primary-500 mb-2" onclick={()=>{showDescriptions=!showDescriptions}}>{showDescriptions?"Hide":"Show"} Descriptions</button>
<div class="card preset-filled-surface-600-400 justify-center items-center flex flex-col">
    {#each listOfGames as onegame:gameType}
        {@render game(onegame.gameName,onegame.underConst,onegame.entryPoint,onegame.descr)}
    {/each}
</div>