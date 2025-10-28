<script lang="ts">
	import { goto } from '$app/navigation';
	import { type entry } from '$lib/types/teamTypes';
	import AnswerCard from './AnswerCard.svelte';
	import VotingStage from './VotingStage.svelte';

	let { data } = $props();
    if(data.group==null){
        goto('/');
    }

    let group = $state(data.group);
    //$inspect(group);

    const names = group?.map((elem)=>elem.name);

	let imposterTimes = new Array(data.group?.length).fill(0);

	const questions = [
		'How many cups of coffee do you drink in a day?',
		'How many hours of sleep do you usually get per night?',
		'How many countries have you visited?',
		'How many books do you read in a year?',
		'How many messages do you send on your phone daily?',
		'How many tabs are open in your browser right now?',
		'How many minutes can you hold your breath?',
		'How many push-ups can you do in one set?',
		'How many songs are in your favorite playlist?',
		'How many pets have you had in your lifetime?'
	];

    let normalQuestion=-1;
    let stage=$state('quest');

   // $inspect(normalQuestion);
    let imposterQuestion=-1;
    //$inspect(imposterQuestion);
    let imposter=-1;
    //$inspect(imposter);

    let answers = $state( new Array(data.group?.length).fill(''));
    //$inspect(answers);
    
    let ready=$state(false);

    let current= $state(-1);

    const startRound=()=>{
        normalQuestion= Math.floor(Math.random() * questions.length);
        imposter= Math.floor(Math.random() * (group?.length||0));
        imposterQuestion= Math.floor(Math.random() * questions.length);
        current=0;
        ready=true;
    }
    startRound();

   
    const personVoted=(index:number)=>{
        if (!group) return;

        const tempGroup = group;

        if (index === imposter) {
            if (tempGroup[index].score > 0) {
                tempGroup[index].score--;
            }
        } else {
            if (tempGroup[index].score > 0) {
                tempGroup[index].score--;
            }
            tempGroup[imposter].score++;
        }

        localStorage.setItem(`group${data.groupId}`, JSON.stringify(tempGroup));

        
        goto(`/leaderboard/${data.groupId}`);
    }

</script>




{#if !ready || group==null}
    <div class="card w-[50%] h-[50%] preset-filled">
        Loading...
    </div>
{:else}
    {#if stage=="quest"}
        <div class="flex flex-col justify-center items-center">
            <AnswerCard question={questions[current!=imposter?normalQuestion:imposterQuestion]}
                imposter={current==imposter}
                player={group[current].name}
                bind:ansState={answers[current]}></AnswerCard> <!--I need to bind it so the component can use it as a 2-way communication-->
            {#if current==group.length-1}
                <button class="btn preset-filled-primary-300-700" onclick={()=>stage="inter"} >To Interogation</button>
            {:else}
                <button class="btn preset-filled-primary-300-700 contain-content w-fit" onclick={()=>{current++}}>Next</button>
            {/if}
        </div>
    {:else if stage=="inter"}
       <div class="flex flex-col justify-center items-center">
             <VotingStage question={questions[normalQuestion]} players={names} answers={answers} voteFunction={personVoted}>

            </VotingStage>
            
       </div>
    {/if}
    
{/if}