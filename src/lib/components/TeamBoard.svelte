<script lang="ts">
    
    let { groupid,teamdata,game } = $props();
    const sorted = [...teamdata.group].sort((a, b) => b.score - a.score);
</script>


<div class=" w-full md:w-[50%] card preset-filled-surface-300-700 p-2">
    <p class="h4">Ranking</p>
    <div class="table-wrap">
        <table class="table caption-bottom space-y-2">
            <tbody class="[&>tr]:hover:preset-tonal-primary">
            
               {#each sorted as row}
                <tr>
                        <td>{row.name}</td>
                        <td>{row.score}</td>
                    </tr>
               {/each} 
            </tbody>
        </table>
    </div>
    <span class="flex flex-wrap justify-evenly mt-3">
        <a class="btn preset-tonal-secondary" href="/{game}">Home</a>
        <a class="btn preset-tonal-secondary" href={`/general/${game}/add/${groupid}`}>Edit team</a>
        <a class="btn preset-filled-primary-400-600" href="/{game}/round/{groupid}">Play again</a>

    </span>
</div>