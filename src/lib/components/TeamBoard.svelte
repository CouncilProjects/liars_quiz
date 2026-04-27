<script lang="ts">
    
    let { groupid,teamdata,game } = $props();
    const sorted = [...teamdata.group].sort((a, b) => b.score - a.score);
    import { Star, XIcon } from '@lucide/svelte';
	import { CircleQuestionMark } from '@lucide/svelte';
	import { Dialog, Popover, Portal } from '@skeletonlabs/skeleton-svelte';
    let warnDiagOpen = $state(false);
</script>






<div class=" w-full md:w-[50%] card preset-filled-surface-300-700 p-2">
    <p class="h4">Ranking</p>
    <div class="table-wrap">
        <table class="table caption-bottom space-y-2">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Stars 
                        <Popover>
                            <Popover.Trigger class="btn-icon"><CircleQuestionMark></CircleQuestionMark></Popover.Trigger>
                            <Portal>
                                <Popover.Positioner>
                                    <Popover.Content class="card max-w-96 p-4 bg-surface-100-900 shadow-xl">
                                        <div class="space-y-4">
                                            <Popover.Description>Gain a star for every 100 points</Popover.Description>
                                        </div>
                                        <Popover.Arrow class="[--arrow-size:--spacing(2)] [--arrow-background:var(--color-surface-100-900)]">
                                            <Popover.ArrowTip />
                                        </Popover.Arrow>
                                    </Popover.Content>
                                </Popover.Positioner>
                            </Portal>
                        </Popover>
                    </th>
                </tr>
            </thead>
            <tbody class="[&>tr]:hover:preset-tonal-primary">
            
               {#each sorted as row}
                    <tr>
                        <td>{row.name}</td>
                        <td>
                            {row.score%100}
                        </td>
                        <td>
                            {#if Math.floor(row.score/100)>0}
                                {#if Math.floor(row.score/100)<6}
                                    <div class="flex flex-row items-center">
                                        {#each Array.from({length:Math.floor(row.score/100)}) as _,i }
                                            <Star class="text-yellow-400 inline" fill="yellow"></Star>
                                        {/each}
                                   </div>
                               {:else}
                                    <div class="flex flex-row items-center">
                                        <Star class="text-yellow-400 inline" fill="yellow"></Star> x{Math.floor(row.score/100)} 
                                    </div>
                                {/if}
                                
                            {:else}
                                -
                            {/if}
                        </td>
                    </tr>
               {/each} 
            </tbody>
        </table>
    </div>
    <span class="grid grid-cols-2 gap-1 md:gap-2 *:h-full justify-evenly mt-3">
        <a class="btn preset-tonal-secondary" href="/{game}">Home</a>
        <a class="btn preset-tonal-secondary" href={`/general/${game}/add/${groupid}`}>Edit team</a>
        <a class="btn preset-filled-primary-400-600 col-span-2" href="/{game}/round/{groupid}">Play again</a>
    </span>
</div>