<script lang="ts">
	import { goto } from "$app/navigation";
    import {fade} from "svelte/transition"
    let showDescriptions = $state(false);

    type gameType={
        gameName:string,
        entryPoint:string,
        underConst:boolean,
        descr:string
        nsfw?:boolean
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
        },
        {
            gameName:"Say That Again ?",
            entryPoint:"/say-again",
            underConst:false,
            descr:"In this game there are no lies. Every round a player is chosen to become the judge. The other players get a prompt, with 2 different scenarios, they will need to respond to both with 1 answer. After all have written their answers the judge picks the one he likes best.",
            nsfw:true,
        },
        {
            gameName:"Shady truths",
            entryPoint:"/shady-truth",
            underConst:false,
            descr:"In this game, One player is the guesser, one is the truth teller and the rest are the red herrings. To a question the truth teller says the correct answer everyone else says a lie.Goals: The guesser needs to find all the liars, while the truth teller needs to try to make himself look like the liar. The liars need to be not found."
        },
        {
            gameName:"Intersecting meaning",
            entryPoint:"/intersect",
            underConst:true,
            descr:"In this game every round a judge is chosen, the players get 2 scenarios in an intersecting venn diagram, and they have to find something common. The judge picks his favorite answer and that player gets a point."
        }
    ]
</script>


{#snippet description(gameName: string, desc: string,nsfw:boolean=false)}
    {#if showDescriptions}
        <div
            in:fade={{duration:1500}}
            out:fade={{duration:500}}
            class="text-surface-contrast-700-300
                   flex flex-col text-center -mt-3
                   w-full max-w-md mx-auto p-4 sm:mr-4 sm:ml-4"
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
            {#if nsfw}
                <span class="bg-red-500">
                    This game contains adult theme elements so its not advised to be played with minors.
                </span>
            {/if}
        </div>
    {/if}
{/snippet}

{#snippet game(gameName:string,underConst:boolean,entryPoint:string,descr:string="",nsfw:boolean=false)}
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
        {@render description(gameName,descr,nsfw)}
        
    </button>
{/snippet}




<button class="btn preset-outlined-primary-500 mb-2" onclick={()=>{showDescriptions=!showDescriptions}}>{showDescriptions?"Hide":"Show"} Descriptions</button>
<div class="card preset-filled-surface-600-400 justify-center items-center flex flex-col">
    {#each listOfGames as onegame:gameType}
        {@render game(onegame.gameName,onegame.underConst,onegame.entryPoint,onegame.descr,onegame.nsfw)}
    {/each}
</div>