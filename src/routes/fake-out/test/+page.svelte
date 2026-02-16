<script lang="ts">
    import {wordCategories,words} from '$lib/types/categories'
    let cat = 3;
    let arr= 1;
    let chosenwords = words[cat][arr];
    let word = chosenwords[4];

    const cellModes = {
        normal : "bg-surface-400",
        colored : "bg-primary-600-400/70",
        known : "bg-success-300-700",
        throaway : "bg-secondary-200-800 text-red-500 underline"
    }
</script>



{#snippet cell(word:string,mode:string)}

    <span class={[
                mode,
                "text-center justify-center flex flex-col col-span-1"
            ]}>{word.toLocaleLowerCase()}</span>
{/snippet}

{#snippet wordcard(name:string,words:string[],category:string,word:number,spy:boolean,throwAways:number[]|null)}
    <div class="card preset-filled-surface-300-700 grid-cols-2 grid w-dvw h-dvh md:grid-cols-4 lg:w-[30dvw] lg:h-[40dvh]">
        {#each words as singleWord,index}
            {@const colorit=(index%2)===(Math.floor(index/4)%2)}
            {#if spy && throwAways && throwAways.includes(index)}
                {@render cell(singleWord,cellModes.throaway)}
            {:else if !spy && index==word}
                {@render cell(singleWord,cellModes.known)}
            {:else}
                {@render cell(singleWord,colorit ? cellModes.colored : cellModes.normal)}
            {/if}
            
        {/each}
    </div>
{/snippet}

<div class="w-full h-full">
{@render wordcard('steve',chosenwords,wordCategories[3],4,false,[5,4,1,9,10])}
</div>
