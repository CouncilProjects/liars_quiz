<script lang="ts">
	import { goto } from '$app/navigation';
	import type { shadyTruthTeamEntry } from '$lib/types/teamTypes';
    import type { PageProps } from './$types';
    import {triviaQuestions} from '$lib/types/shadytruthQuestions'
	import { Progress } from '@skeletonlabs/skeleton-svelte';
    import { Fish } from '@lucide/svelte';
    import { CircleQuestionMark } from '@lucide/svelte';
    import { UserRoundSearch } from '@lucide/svelte';
	import { pickRoles } from '$lib/logic/assignRoles';

    const stages = {
        LOADING:-1,
        PROMPT:1,
        ANSWERING:2,
        GUESSING:3,
        GAMEOVER:4
    }

	let { data,params }: PageProps = $props();
    let group:shadyTruthTeamEntry[] = [];
    if(data.teams==null)
    {
        goto('/shady-truth');
    } 
    else 
    {
        group = data.teams;
    }

    const icons={
        'g':{comp:UserRoundSearch,props:{class:"text-primary-700 dark:text-primary-400 inline"}},
        't':{comp:Fish,props:{class:"text-green-700 dark:text-green-400 inline"}},
        'rh':{comp:Fish,props:{class:"text-red-700 dark:text-red-400 inline"}}
    }

    let pointsGotten:any = new Array(group.length).fill(0);

    let gameState = $state({stage:stages.LOADING,guesser:-1,question:-1,truthTeller:-1,unflipped:[] as number[],pointsGathered:0,showHint:false});
    $inspect(gameState);

    (()=>{
        gameState.question = Math.floor(Math.random()*(triviaQuestions.length-1));
        let temp = $state.snapshot(data.teams);

        const role = pickRoles(temp,['guesser','truthTeller'],5);
        gameState.guesser = role[0];
        gameState.truthTeller=role[1];
        
        
        let ind=[];
        for (let i = 0; i < group.length; i++) {
            if (i !== gameState.guesser) ind.push(i);
        }
        gameState.unflipped=ind;

        gameState.stage=stages.PROMPT
    })();

    const helper = (ind:number)=>{
        if(gameState.guesser==ind){
            return 'g';
        } else if (gameState.truthTeller==ind){
            return 't';
        } else {
            return 'rh';
        }
    }
    const calculatePoints = (win:boolean)=>{
        console.log("calculating with "+win);

        if(win)//guesser won (or used bank) he will simple get all points gathered
        {
            // guesser gets 1 point for each liar they found
            

            pointsGotten[gameState.guesser] = (gameState.pointsGathered + (gameState.unflipped.length==1? 2 : 0));
            group[gameState.guesser].score+= pointsGotten[gameState.guesser]; //extra point if he found all

            //and the truth teller will get one point for each unflipped fis.
            

            pointsGotten[gameState.truthTeller] =  (gameState.unflipped.length-1);
            group[gameState.truthTeller].score += pointsGotten[gameState.truthTeller];

            gameState.unflipped.forEach(e=>{
                if(gameState.truthTeller!=e){
                    pointsGotten[e]=1;
                    group[e].score++; //one point for every hidden red herring
                }
            });
        }
        else
        {
            // guesser gets 0 points because they flipped the truth.

            //and the truth teller will get one point for each unflipped fish.
            pointsGotten[gameState.truthTeller] =  gameState.unflipped.length + 1; //bonus point if he was flipped
            group[gameState.truthTeller].score += pointsGotten[gameState.truthTeller];

            gameState.unflipped.forEach(e=>{
                if(gameState.truthTeller!=e){
                    pointsGotten[e]=1;
                    group[e].score++; //one point for every hidden red herring
                }
            });
        }

        group[gameState.guesser].guesser++;
        group[gameState.truthTeller].truthTeller++;

        localStorage.setItem(`shady-truth-group${params.groupId}`,JSON.stringify(group));
        pointsGotten = pointsGotten.map((value:number,index:number)=>({s:value,n:group[index].name,r:helper(index)}));
        pointsGotten.sort((a:any,b:any)=>b.s-a.s);
        console.log(pointsGotten);

        gameState.stage=stages.GAMEOVER
    }

    const voted = (index:number)=>{
        if(gameState.truthTeller!=index){

            gameState.pointsGathered++;
            gameState.unflipped.splice(gameState.unflipped.indexOf(index),1);
            new Audio('/win.mp3').play();
        }

        if(gameState.unflipped.length==1){
            calculatePoints(true);
        }

        if(gameState.truthTeller==index){
            new Audio('/lose.mp3').play();
            gameState.unflipped.splice(gameState.unflipped.indexOf(index),1);
            calculatePoints(false);
        }


    }

</script>

{#if gameState.stage==stages.LOADING}
    <Progress class="items-center w-fit" value={null}>
        <Progress.Circle>
            <Progress.CircleTrack />
            <Progress.CircleRange />
        </Progress.Circle>
        <Progress.ValueText />
    </Progress>
{:else if gameState.stage==stages.PROMPT}
    <div class="card preset-filled-surface-400-600 flex flex-col text-center justify-center items-center">
        <p class="h6">The guesser for this round is <span class="text-primary-700-300 font-bold h5">{group[gameState.guesser].name}</span></p>
        Question
        <p class="h5">{triviaQuestions[gameState.question][0]}</p>
        <button class="btn my-3 preset-outlined-secondary-500" onclick={()=>{gameState.showHint=true}} hidden={gameState.showHint}>What now <CircleQuestionMark class="inline"></CircleQuestionMark></button>
        {#if gameState.showHint}
            <p>When the guesser is ready, place the device infront of the other players and have them press the button so that the truth teller is revealed then start questioning them.</p>
        {/if}
        <button class="btn mt-2 preset-filled-primary-500 w-fit" onclick={()=>{gameState.stage=stages.ANSWERING}}>Start interrogation</button>
    </div>
{:else if gameState.stage==stages.ANSWERING}
    <div class="card preset-filled-surface-400-600 flex flex-col text-center justify-center items-center">
        <p class="underline decoration-red-500 font-bold">For non guesser eyes only</p>
        <p class="h6">The truth teller for this round is <span class="text-primary-700-300 font-bold h5">{group[gameState.truthTeller].name}</span></p>
        Question
        <p class="h5">{triviaQuestions[gameState.question][0]}</p>
        Answer
        <p class="h5">{triviaQuestions[gameState.question][1]}</p>

        
        <button class="btn my-3 preset-outlined-secondary-500" onclick={()=>{gameState.showHint=true}} hidden={gameState.showHint}>What now <CircleQuestionMark class="inline"></CircleQuestionMark></button>
        {#if gameState.showHint}
            <p>After the guesser has asked everyone press the button so the guesser can start voting.</p>
        {/if}
        
        <button class="btn mt-2 preset-filled-primary-500 w-fit" onclick={()=>{gameState.stage=stages.GUESSING}}>Start voting</button>
    </div>
{:else if gameState.stage==stages.GUESSING}
    <div class="card p-2 m-1 preset-filled-surface-400-600 flex flex-col text-center justify-center items-center max-w-[60dvw] max-h-[80dvh]">
        <p class="h5">{triviaQuestions[gameState.question][0]}</p>
        <div class="max-h-[60dvh] overflow-y-auto">
            {#each group as player,index}
            {#if index!=gameState.guesser}
                <div class={['flex flex-col w-full mt-2',!gameState.unflipped.includes(index) && gameState.truthTeller==index && 'bg-primary-200-800',!gameState.unflipped.includes(index) && 'bg-error-200-800' ]}>
                    <p class="h4">Player {player.name}</p>
                    {#if !gameState.unflipped.includes(index)}
                        {#if gameState.truthTeller!=index}
                            <span>Was a red herring <Fish class="text-red-700 dark:text-red-400 inline"></Fish></span>
                        {:else}
                            <span>Was the truth teller <Fish class="text-green-700 dark:text-green-400 inline"></Fish></span>
                        {/if}
                    {/if}
                    <button class="btn preset-filled-tertiary-400-600 text-wrap break-all" onclick={()=>{voted(index);}} hidden={!gameState.unflipped.includes(index)}>Vote {player.name} as a liar</button>
                </div>
            {/if}
        {/each}
        </div>

        <p>Total points accumilated: {gameState.pointsGathered}</p>
        <button class="btn preset-filled-secondary-400-600" onclick={()=>{calculatePoints(true);}}>Bank it</button>
    </div>
{:else if gameState.stage==stages.GAMEOVER}
    <div class="card p-2 m-1 preset-filled-surface-400-600 flex flex-col text-center justify-center items-center max-w-[80dvw]">
        Points awarded
        
        <div class="table-wrap overflow-y-auto max-h-[60dvh] snap-y">
            <table class="table caption-bottom">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Points</th>
                    </tr>
                    
                </thead>
                <tbody class="[&>tr]:hover:preset-tonal-primary">
                    {#each pointsGotten as row}
                        {@const Icon = icons[row.r].comp}
                        <tr class="snap-start">
                            <td>{row.n} <Icon class={icons[row.r].props.class}/></td>
                            <td>awarded {row.s} points</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        
        <button class="btn preset-tonal-primary" onclick={()=>{goto(`/general/shady-truth/leaderboard/${params.groupId}`);}}>OK</button>
    </div>
{/if}