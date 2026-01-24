<script lang="ts">
    import {ArrowBigLeftDash,Settings,PlusIcon} from "@lucide/svelte";
    import {type team} from "$lib/types/teamTypes";
    import {goto} from '$app/navigation'

    let {game,teamData,providesSettings=false} : {game:string,teamData:{groups:any},providesSettings:boolean}= $props();
</script>

<a class="btn preset-tonal-primary mb-2" href="/">Game selection <ArrowBigLeftDash color="#11f111"/></a>
{#if providesSettings}
    <a class="btn preset-tonal-primary" href="/{game}/settings">Settings <Settings/></a>
{/if}

{#snippet teamCard(names:team|null,index:number)}
    <button class="card preset-tonal-primary flex justify-center items-center min-h-32 flex-col hover:preset-filled" onclick={()=>{goto(names?`/general/${game}/leaderboard/${(index+1)}`:`/general/${game}/add/${(index+1)}`)}}>
        {#if names}
            {#each names as name,i}
                {#if i<2}
                    <p>{name.name} score: {name.score}</p>
                {/if}
            {/each}
            ...
        {:else}
            <PlusIcon size=64></PlusIcon>
        {/if}
        
    </button>
{/snippet}

<p class=" h3 lg:h1">Select or create a group</p>

<div class=" min-w-64 lg:w-[40%] self-center grid grid-cols-2 gap-x-2 gap-y-3">
    {#each teamData.groups as num,i}
        {@render teamCard(num,i)}
    {/each}

    
</div>