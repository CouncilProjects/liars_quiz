<script lang="ts">
	import { goto } from '$app/navigation';
	import type { impostorTeamEntry, team } from '$lib/types/teamTypes';
    import type { PageProps } from './$types';
    import {safeCards,riskyCards} from '$lib/types/same-different-scenarios';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import { pickRoles } from '$lib/logic/assignRoles';
	let { data,params }: PageProps = $props();
    const stages = {
        Showing: 1,
        Answering: 2,
        Voting: 3,
        Waiting: 4,
    };
    let gameState = $state({stage:stages.Waiting,judge:-1,safe:-1,risky:-1,remindPrompt:false,currentlyWriting:-1});
    let recordedAns = $state<string[]>([]);
    let input = $state('');
    $inspect(gameState);
    let group:impostorTeamEntry[] = [];
    if(!data.teamData){
        goto("/fake-out");
    } else {
        group = data.teamData as impostorTeamEntry[];
    }
    
    (()=>{

        
        let tempArr = [...group];
        const role = pickRoles(tempArr,['impostor'],5);
        gameState.judge=role[0];

        gameState.safe = Math.floor(Math.random()*(safeCards.length-1));
        gameState.risky = Math.floor(Math.random()*(riskyCards.length-1));
        //note svelte 5 will batch the updates on the object.

        gameState.stage=stages.Showing;
        gameState.currentlyWriting = gameState.judge==0 ? 1 : 0;

    })();

    const handleSubmit=()=>{
        recordedAns[gameState.currentlyWriting]=input;
        input='';
        if(gameState.currentlyWriting==group.length-1)//we done
        {
            gameState.stage=stages.Voting;
        } else if(gameState.currentlyWriting+1 == gameState.judge){
            if(gameState.currentlyWriting+1==group.length-1)
                gameState.stage=stages.Voting;
            else
                gameState.currentlyWriting+=2;
        }
        else {
            gameState.currentlyWriting++;
        }
    }

    const voted = (player:number)=>{
        group[player].score++;
        group[gameState.judge].impostor++;
        localStorage.setItem(`say-again-group${params.groupId}`,JSON.stringify(group));
        const sound = new Audio('/win.mp3');
        sound.play();
        goto(`/general/say-again/leaderboard/${params.groupId}`);
    }

</script>

{#snippet showPrompt()}
    <div class="card preset-filled-surface-800-200 p-2 text-center">
        <h6 class="h6">Your judge : {group[gameState.judge].name}</h6>
        <div class="flex flex-row">
            <div class="bg-green-600 p-1">
                <span>{safeCards[gameState.safe]}</span>
            </div>
            <div class="bg-red-600 p-1">
                <span>{riskyCards[gameState.risky]}</span>
            </div>
        </div>
    </div>
{/snippet}

{#snippet showArea()}
    <div class="card preset-filled-surface-800-200 p-2 text-center mt-3">
        <h6 class="h6">Waiting for {group[gameState.currentlyWriting].name} to write</h6>
        <div class="flex flex-col">
            <form>
                <label class="label">
                    <span class="label-text">Answering Area</span>
                    <textarea bind:value={input} class="textarea rounded-container" rows="4" placeholder="What did you say ?"></textarea>
		        </label>
                <button class="btn preset-tonal-primary mt-1" onclick={handleSubmit}>Done</button>
            </form>
        </div>
    </div>
{/snippet}

{#if gameState.stage!=stages.Waiting}
    {#if gameState.stage==stages.Showing}
        {@render showPrompt()}
        <button class="btn preset-outlined-primary-600-400 mt-1" onclick={()=>{gameState.stage=stages.Answering}}>Start writing</button>
    {:else if gameState.stage==stages.Answering}
        
        {@render showPrompt()}
        
        {@render showArea()}
    {:else}
        <div class="card preset-filled-surface-300-700 rounded-3xl p-3 max-h-[90dvh] max-w-[90dvw] overflow-y-auto text-center">
            <p class="h3">Supreme judge {group[gameState.judge].name}</p>
            <p class="h3">Will now chose their favorite</p>
            {@render showPrompt()}
            {#each recordedAns as playerAns,index}
            {#if index!=gameState.judge}
                <hr class="hr my-1" />
                <div class="flex text-center flex-col mt-2">
                    <p>{group[index].name} says</p>
                    <p class="m-1 border-2 font-bold max-w-full text-wrap">{playerAns}</p>
                    <button class="btn preset-tonal-primary" onclick={()=>{voted(index);}}>Vote as best</button>
                </div>
            {/if}
        {/each}
        </div>
    {/if}
{:else}
    <Progress class="items-center w-fit" value={null}>
	<Progress.Circle>
		<Progress.CircleTrack />
		<Progress.CircleRange />
	</Progress.Circle>
	<Progress.ValueText />
</Progress>
{/if}