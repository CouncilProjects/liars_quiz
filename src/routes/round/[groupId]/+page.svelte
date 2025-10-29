<script lang="ts">
	import { goto } from '$app/navigation';
	import AnswerCard from './AnswerCard.svelte';
	import VotingStage from './VotingStage.svelte';
    const synth = window.speechSynthesis;
	let { data } = $props();
    if(data.group==null){
        goto('/');
    } else{
        console.log(data.group);
    }

    let visibleNextButton=$state(true);
    let stage=$state('quest');
    let answers = $state( new Array(data.group?.length).fill(''));
    let current= $state(-1);
    let knownImp=$state<number|null>(null);
    let ready=$state(false);

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

    const useTTS=(message:string)=>{
        const utterThis = new SpeechSynthesisUtterance(message);
        utterThis.rate=0.3;
        utterThis.pitch=0.5;
        try {

            // Check if there are voices loaded
            if (synth.getVoices().length > 0) {
                synth.speak(utterThis);
            } else {
            // No voices loaded — fallback
                const beep = new Audio('/confirm.mp3');
                beep.play();
            }
        } catch (e) {
            // Any other error — fallback
            const beep = new Audio('/confirm.mp3');
            beep.play();
        }
    }

    let normalQuestion=-1;
    let imposterQuestion=-1;
    let imposter=-1;
    
    const startRound=()=>{
        useTTS("Everyone Close your eyes and wait");
            
        normalQuestion= Math.floor(Math.random() * questions.length); //find random normal question
        imposterQuestion= Math.floor(Math.random() * questions.length); //find imposter question
        imposter= Math.floor(Math.random() * (data.group?.length||0)); //find random impostor
       
        const temp=$state.snapshot(data.group!); //get a snapshot of the team 
        temp.sort((a,b)=>b.impostor-a.impostor); //sort based on times each were an impostor
        
        if(data.group![imposter].impostor-temp[temp?.length-1].impostor>=2){ //if the chosen person was the impostor 2 times more than the least picked person pick the last one.
            imposter = data.group!.findIndex((elem)=>elem.name==temp[temp?.length-1].name);
        }
        
        // give time before starting for all to close their eyes
        setTimeout(() => {
            ready=true;
            useTTS(`Open your eyes ${data.group![current+1].name} `)
            current++;
        }, 3000);
    }
    startRound();

    

    const moveQuestioning=()=>{
        visibleNextButton=false;
        const sound = new Audio('/confirm.mp3');
        sound.play();
        setTimeout(()=>{
            useTTS(`Open your eyes ${data.group![current+1].name} `);
            current++;
            visibleNextButton=true;
        },3000);
    }

    const moveToVoting=()=>{
        stage="inter";
        useTTS("Find the Imposter");
    }

   
    const personVoted=(index:number)=>{

        const tempGroup = data.group!;

        if (index === imposter) {
            const sound = new Audio('/win.mp3');
            sound.play();
            if (tempGroup[index].score > 0) {
                tempGroup[index].score--;
            }
        } else {
            const sound = new Audio('/lose.mp3');
            sound.play();
            if (tempGroup[index].score > 0) {
                tempGroup[index].score--;
            }
            tempGroup[imposter].score++;
        }
        tempGroup[imposter].impostor++;
        localStorage.setItem(`group${data.groupId}`, JSON.stringify(tempGroup));

        knownImp=imposter;
        
        setTimeout(() => {
            goto(`/leaderboard/${data.groupId}`);
        }, 3000);
    }

</script>




{#if ready==false || data.group==null}
    <div class="card w-[50%] h-[50%] preset-filled">
        Loading...
    </div>
{:else}
    {#if stage=="quest"}
        <div class="flex flex-col justify-center items-center">
            <AnswerCard question={questions[current!=imposter?normalQuestion:imposterQuestion]}
                imposter={current==imposter}
                player={data.group[current].name}
                bind:ansState={answers[current]}></AnswerCard> <!--I need to bind it so the component can use it as a 2-way communication-->
            {#if current==data.group.length-1}
                <button class="btn preset-filled-primary-300-700" onclick={moveToVoting} >To Interogation</button>
            {:else}
                <button class="btn preset-filled-primary-300-700 contain-content w-fit" onclick={moveQuestioning} disabled={answers[current].length==0} hidden={!visibleNextButton}>Next</button>
            {/if}
        </div>
    {:else if stage=="inter"}
       <div class="flex flex-col justify-center items-center">
             <VotingStage question={questions[normalQuestion]} players={data.group?.map((elem)=>elem.name)} answers={answers} voteFunction={personVoted} impostor={knownImp}>

            </VotingStage>
            
       </div>
    {/if}
    
{/if}