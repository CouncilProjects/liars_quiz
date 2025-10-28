<script lang="ts">
	import { goto } from "$app/navigation";

    import {PlusIcon} from "@lucide/svelte"
    import {type team,type entry} from "$lib/types/teamTypes.js"
    
    let {data} = $props();
    
    $inspect(data);
    
</script>


{#snippet teamCard(names:team|null,index:number)}
    <button class="card preset-tonal-primary flex justify-center items-center min-h-32 flex-col hover:preset-filled" onclick={()=>{goto(`/add/${(index+1)}`)}}>
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
    {#each data.groups as num,i}
        {@render teamCard(num,i)}
    {/each}

    
</div>