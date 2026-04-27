<script lang="ts">
    import type { PageProps } from './$types';
    import {pickRoles} from '$lib/logic/assignRoles';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import {magicWords} from '$lib/types/categories';
	import { useTTS } from '$lib/logic/voice';
    import { Check,X,CircleQuestionMark } from '@lucide/svelte';
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

	let { data,params }: PageProps = $props();
    type tokens={
        yes:number,
        no:number,
        maybe:number
    }[]

    let groupCopy = $state.snapshot(data.team);

    const stages = {
        LOADING:1,
        ROLE_ASSIGN:2,
        WORD_PICK:3,
        QNA:4,
        WORDFOUND:5,
        WORDNOT:6
    }
    let roles;
    let selectedMagicWords=selectRandom(magicWords,5);

    let gameState = $state({stage:stages.LOADING,chief:-1,darkmagician:-1,fortune:-1,questionsAnsered:0,timeLeft:-1,tokens:[] as tokens,chosenWord:''});

    let roleAssignmentState = $state({viewing:0,hidden:true,next:false});
    let wordSelectionState = $state({stage:-1});
    (()=>{
        let tempArr = $state.snapshot(data.team);
        let findroles = ['chief','darkMage'];
        if(data.settings.mode=='fortune') findroles.push('fortuneTell');
        roles = pickRoles(tempArr,findroles);
        
        let tok:tokens=[];
        for(let i=0;i<data.team.length;i++){
            tok[i]={yes:0,maybe:0,no:0};
        }

        let time = data.settings.timeLimit;
        if(time<0) time=240;

        console.log(selectRandom(magicWords,5));


        gameState.chief=roles[0];
        gameState.darkmagician=roles[1];
        if(data.settings.mode=='fortune') gameState.fortune=roles[2];
        gameState.tokens=tok;
        gameState.timeLeft=time;
        gameState.stage=stages.ROLE_ASSIGN;
    })();

    const roleIS=$derived(
        roleAssignmentState.viewing==gameState.chief ?
            "The CHIEF"
        : roleAssignmentState.viewing==gameState.darkmagician ?
            "The DARK MAGICIAN"
        : roleAssignmentState.viewing==gameState.fortune ?
            "The FORTUNE TELLER"
        :
            "A normal villager"
    );

    const colorlookup = {
        [roles[0]]:'text-primary-500',
        [roles[1]]:'text-red-500',
        [roles[2]]:'text-green-500',
    };

    function selectRandom(inputArr:any[],idxNum:number=2,){
        //based on the fisher-yates shuffle https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
        let array = [...inputArr]
        if(array.length<idxNum) return [];
        for (let i = array.length - 1; i >= idxNum; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.slice(array.length-idxNum);
    }

    const wordSelectionStages = {
        eyesclose:-1,
        mayorchose:0,
        darkmagesee:1,
        fortunesee:2
    }

    let qnaState = $state({current:-1});
    let activePlayers = data.team.map((_,i)=>i).filter((i)=>i!=gameState.chief); // and array of the valid indices/active players
    let currentActivePlayer =$derived(activePlayers[qnaState.current]);
    // any player not there is considared inactive (for now just the chief)
    //qnaState.current is an index on the valid

    function progressQNA(tokType:number){
        if(tokType==1) gameState.tokens[currentActivePlayer].yes++;
        else if (tokType==2) gameState.tokens[currentActivePlayer].maybe++;
        else if (tokType==3) gameState.tokens[currentActivePlayer].no++;

        if(tokType!=-1) gameState.questionsAnsered++;

        if(qnaState.current==activePlayers.length-1) qnaState.current=0;
        else qnaState.current++;

    }

    let intervalID:number|null=null;

    $effect(()=>{
        if(intervalID!=null) return;
        if(gameState.timeLeft>0)
        if(gameState.stage==stages.QNA){
            intervalID = setInterval(()=>{
                gameState.timeLeft--;
                if(gameState.timeLeft==60){
                    useTTS('Last minute remaining',data.settings.synth.rate,data.settings.synth.pitch);
                } else if(gameState.timeLeft==4){
                    new Audio('/countdown.mp3').play();
                } else if(gameState.timeLeft<60 && gameState.timeLeft%10==0){
                    new Audio('/confirm.mp3').play();
                }
            },1000)
        }
    })

    onDestroy(()=>{
        if(intervalID)
            clearInterval(intervalID);
    });

    function magicWordFound(){
        if(intervalID)
            clearInterval(intervalID);
        intervalID=null;

        if(data.settings.mode=='fortune' && gameState.stage!=stages.WORDFOUND)
            gameState.stage=stages.WORDFOUND;

        groupCopy.forEach((elem,i)=>{if(i!=gameState.darkmagician) elem.score++;});
        if(data.settings.mode=='normal'){
            saveScores();
        }
    }

    function darkMageKill(index:number){
        if(gameState.fortune!=index){
            groupCopy[gameState.fortune].score++;
        } else {
            groupCopy[gameState.darkmagician].score++;
            new Audio('/win.mp3').play();
        }
        saveScores();
    }

    function chiefKill(index:number){
        if(gameState.darkmagician!=index){
            groupCopy[gameState.darkmagician].score++;
        } else {
            groupCopy[gameState.chief].score++;
            new Audio('/win.mp3').play();
        }
        saveScores();
    }

    $effect(
        ()=>{
            if(gameState.stage==stages.QNA){
                if(gameState.timeLeft<=0 || gameState.questionsAnsered==data.settings.maxQuestions){
                    if(intervalID)
                        clearInterval(intervalID);
                    intervalID=null;
                    new Audio('/lose.mp3').play();
                    groupCopy[gameState.darkmagician].score++;
                    gameState.stage=stages.WORDNOT;
                }
            }
        }
    )

    function saveScores(){
        groupCopy[gameState.chief].chief++;
        groupCopy[gameState.darkmagician].darkMage++;
        if(data.settings.mode=='fortune')
            groupCopy[gameState.fortune].fortuneTell++;
        localStorage.setItem(`magic-word-group${params.groupId}`,JSON.stringify(groupCopy));
        goto(`/general/magic-word/leaderboard/${params.groupId}`);
    }


    const assignWord=(word:string)=>{
        gameState.chosenWord=word;
    }

    function progressWordSelect(){
        switch (wordSelectionState.stage) {
            case wordSelectionStages.eyesclose:
                useTTS('Everyone close your eyes',data.settings.synth.rate,data.settings.synth.pitch);
                setTimeout(()=>{
                    wordSelectionState.stage=wordSelectionStages.mayorchose;
                    useTTS('Chief Open your eyes',data.settings.synth.rate,data.settings.synth.pitch);
                },2000);
                break;
            case wordSelectionStages.mayorchose:
                useTTS('Chief close your eyes',data.settings.synth.rate,data.settings.synth.pitch);
                setTimeout(()=>{
                    wordSelectionState.stage=wordSelectionStages.darkmagesee;
                    useTTS('Dark magician Open your eyes',data.settings.synth.rate,data.settings.synth.pitch);
                },2000);
                break;
            case wordSelectionStages.darkmagesee:
                useTTS('Dark magician close your eyes',data.settings.synth.rate,data.settings.synth.pitch);
                if(data.settings.mode=='fortune')
                {
                    setTimeout(()=>{
                        wordSelectionState.stage=wordSelectionStages.fortunesee;
                        useTTS('Fortune teller Open your eyes',data.settings.synth.rate,data.settings.synth.pitch);
                    },2000);
                }
                else 
                {
                    progressQNA(-1);
                    gameState.stage=stages.QNA;
                    useTTS('Everyone open your eyes',data.settings.synth.rate,data.settings.synth.pitch);
                }
                    
                break;
            case wordSelectionStages.fortunesee:
                progressQNA(-1);
                gameState.stage=stages.QNA;
                useTTS('Everyone open your eyes',data.settings.synth.rate,data.settings.synth.pitch);
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
{:else if gameState.stage==stages.ROLE_ASSIGN}
    <div class="card preset-filled-surface-300-700 fex flex-col p-2 rounded-2xl text-center w-full md:w-[30dvw]">
        <p class="h5">Hello player {data.team[roleAssignmentState.viewing].name}</p>
        
        {#if !roleAssignmentState.hidden}
            <span class="my-3">Your role is <span class='{colorlookup[roleAssignmentState.viewing]}'>{roleIS}</span></span>
            {#if roleAssignmentState.viewing+1<data.team.length}
                <div class="card preset-filled-surface-400-600">
                    <p>Press the button bellow to hide your role and pass the phone to {data.team[roleAssignmentState.viewing+1].name}</p>
                <button class="btn preset-tonal-primary m-1" onclick={()=>{roleAssignmentState.hidden=true; roleAssignmentState.viewing++;}}>Hide role</button>
                </div>
            {:else}
                <p>Now that everyone has seen their role place the phone on the table and start the selection</p>
                <button class="btn preset-filled-primary-500 m-2" onclick={()=>{gameState.stage=stages.WORD_PICK; progressWordSelect();}}>Start selection</button>
            {/if}
            
        {:else}
            <button class="btn preset-tonal-primary text-wrap wrap-break-word m-2" onclick={()=>{roleAssignmentState.hidden=false}}>Press to reveal your role.</button>
            
        {/if}
    </div>
{:else if gameState.stage==stages.WORD_PICK}
    <div class="card preset-filled-surface-400-600 p-2 text-center">
        {#if wordSelectionState.stage==wordSelectionStages.mayorchose}
            <p class="h6">Hello chief {data.team[gameState.chief].name} pick a word</p>
            {#each selectedMagicWords as mWord}
                <div class="flex flex-row">
                    <p class="uppercase"></p>
                    <button class="uppercase btn preset-filled-secondary-300-700 w-full my-2" onclick={()=>{assignWord(mWord); progressWordSelect();}}>{mWord}</button>
                </div>
            {/each}
            {#if true}
                <p class="h5 font-bold">OR</p>
                <p>Make your own</p>
                <div class="flex flex-row">
                    <input id="customW" class="input min-w-0 grow-2 {gameState.chosenWord.length>4 && "rounded-r-none"}" type="text" bind:value={gameState.chosenWord} placeholder="write custom...">
                    <button class='btn grow preset-filled-primary-200-800 {gameState.chosenWord.length>4 && "rounded-l-none"}' hidden={gameState.chosenWord.length<=4} onclick={()=>{progressWordSelect();}}>Use</button>
                </div>
            {/if}
        {:else if wordSelectionState.stage==wordSelectionStages.darkmagesee}
           <div class="card preset-tonal-error p-1 flex flex-col">
                <p>Dark magician, look at the magic word</p>
                <div class="card preset-filled-surface-200-800 flex flex-row m-2 p-3 overflow-x-auto max-w-[90dvw] justify-center items-center">
                    
                        <div class="card preset-filled-error-300-700 p-2 mx-1 h5 self-center">{gameState.chosenWord}</div>
                    
                </div>
                <button class="btn preset-filled-primary-200-800" onclick={progressWordSelect}>OK</button>
            </div>
        {:else if wordSelectionState.stage==wordSelectionStages.fortunesee}
            <div class="card preset-tonal-success p-1 flex flex-col">
                <p>Fortune teller, look at part of the magic word</p>
                <div class="card preset-filled-surface-200-800 flex flex-row m-2 p-3 overflow-x-auto max-w-[90dvw]">
                    {#each gameState.chosenWord as letter,index}
                        <div class="card preset-filled-success-300-700 p-2 mx-1">{index<Math.max(gameState.chosenWord.length/5)?letter:'?'}</div>
                    {/each}
                </div>
                <button class="btn preset-filled-primary-200-800" onclick={progressWordSelect}>OK</button>
            </div>
        {/if}
    </div>
{:else if gameState.stage==stages.QNA}
    <div class="w-dvw h-dvh relative -m-4">
        <div class="z-10 absolute left-1/2 transform -translate-x-1/2 font-bold w-full text-center flex flex-col justify-center items-center">
            <p>Time left : {gameState.timeLeft} seconds</p>
            <p >Players {data.team[currentActivePlayer].name} question with {data.settings.maxQuestions-gameState.questionsAnsered} questions left</p>
            <button class="btn preset-filled-primary-500" onclick={()=>{magicWordFound();}}>Magic word !</button>
        </div>
        <div class="h-full w-full flex flex-col sm:flex-row">
            
            <button onclick={()=>{progressQNA(1);}} class="btn btn-icon min-h-1/3 min-w-full sm:min-h-full rounded-none p-0 sm:min-w-1/3 bg-green-600 m-0" title="Yes button">
                <div class="flex flex-col justify-center items-center h-full w-full">
                    <span>YES</span>
                    <Check />
                </div>
            </button>

            
            <button onclick={()=>{progressQNA(2);}} class="btn btn-icon min-h-1/3 min-w-full sm:min-h-full rounded-none p-0 sm:min-w-1/3 bg-blue-400 m-0" title="Maybe button">
                <div class="flex flex-col justify-center items-center h-full w-full">
                    <span>MAYBE</span>
                    <CircleQuestionMark />
                </div>
            </button>

            
            <button onclick={()=>{progressQNA(3);}} class="btn btn-icon min-h-1/3 min-w-full sm:min-h-full rounded-none p-0 sm:min-w-1/3 bg-red-800 m-0" title="No button">
                <div class="flex flex-col justify-center items-center h-full w-full">
                    <span>NO</span>
                    <X />
                </div>
            </button>
            </div>
    </div>

{:else if gameState.stage==stages.WORDFOUND && data.settings.mode=='fortune'}
    <div class="card preset-tonal-error p-3 text-center flex flex-col max-h-[80dvh] overflow-y-auto">
        <span>{data.team[gameState.darkmagician].name} IS THE DARK MAGICIAN</span>
        <p>He will try to kill the fortune teller</p>
        <div>
            <table class="table preset-filled-surface-400-600">
                <caption class="pt-4">The players guesses</caption>
                <tbody class="[&>tr]:hover:preset-tonal-primary">
                    {#each activePlayers as idx}
                        {#if idx!=gameState.darkmagician}
                            <tr>
                                <td>{data.team[idx].name}</td>
                                <td class="text-green-600">{gameState.tokens[idx].yes} <Check class="inline"></Check></td>
                                <td class="text-blue-400">{gameState.tokens[idx].maybe} <CircleQuestionMark class="inline"></CircleQuestionMark></td>
                                <td class="text-red-800">{gameState.tokens[idx].no} <X class="inline"></X></td>
                            </tr>
                        {/if}
                    {/each}
                </tbody>
            </table>
        </div>
        <hr class="hr my-1"/>
        <p class="my-2">Kill list</p>
        {#each activePlayers as idx}
            {#if gameState.darkmagician!=idx}
                <button onclick={()=>{darkMageKill(idx)}} class=" mb-2 btn preset-filled-error-800-200">Kill {data.team[idx].name}</button>
            {/if}
        {/each}
    </div>
{:else if gameState.stage==stages.WORDNOT}
    <div class="card preset-tonal-primary p-3 text-center flex flex-col max-h-[80dvh] overflow-y-auto">
        <span class="text-red-500">You didnt find the word !</span>
        <p>The chief will try to find the dark magician</p>
        <div>
            <table class="table preset-filled-surface-400-600">
                <caption class="pt-4">The players guesses</caption>
                <tbody class="[&>tr]:hover:preset-tonal-success">
                    {#each activePlayers as idx}
                        
                            <tr>
                                <td>{data.team[idx].name}</td>
                                <td class="text-green-600">{gameState.tokens[idx].yes} <Check class="inline"></Check></td>
                                <td class="text-blue-400">{gameState.tokens[idx].maybe} <CircleQuestionMark class="inline"></CircleQuestionMark></td>
                                <td class="text-red-800">{gameState.tokens[idx].no} <X class="inline"></X></td>
                            </tr>
                        
                    {/each}
                </tbody>
            </table>
        </div>
        <hr class="hr my-1"/>
        <p class="my-2">Suspect list</p>
        {#each activePlayers as idx}
            
            <button onclick={()=>{chiefKill(idx)}} class=" mb-2 btn preset-filled-primary-800-200">{data.team[idx].name} is the mage</button>
            
        {/each}
    </div>
{/if}