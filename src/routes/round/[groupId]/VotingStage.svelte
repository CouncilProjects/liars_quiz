<script lang="ts">
    let {question,players,answers,voteFunction} = $props();
</script>



<div class="card preset-filled-primary-300-700 p-4">
    <p class="h4 md:h2">{question}</p>
    <p>Each player answered</p>
    <div class="grid grid-cols-1 md:grid-cols-2 p-2 gap-y-2 gap-x-3">
        {#each players as name,i}
           <div class="card preset-filled-primary-200-800 flex flex-col text-center text-lg md:text-2xl self-center justify-center items-center p-2">
                <p>{name} says:</p>
                <p>{answers[i]}</p>
                <button class="btn preset-filled-tertiary-400-600 w-fit text-xs" onclick={()=>voteFunction(i)}>Vote</button>
            </div>
            
        {/each}
        
    </div>
</div>