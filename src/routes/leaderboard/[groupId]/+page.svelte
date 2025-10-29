<script lang="ts">
	import { goto } from '$app/navigation';
    import type { PageProps } from './$types';
    
    let { params,data }:PageProps = $props();
    const sorted = [...data.group].sort((a, b) => b.score - a.score);
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
        <a class="btn preset-tonal-secondary" href="/">Home</a>
        <a class="btn preset-tonal-secondary" href="/add/{params.groupId}">Edit Team</a>
        <a class="btn preset-filled-primary-400-600" href="/round/{params.groupId}">Play again</a>

    </span>
</div>