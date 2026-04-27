<script lang="ts">
	import { goto } from "$app/navigation";
    import type { PageProps } from ".$types";
    let { data }:PageProps = $props();
    $inspect(data)
    const categories=["movies","music","scenarios","food","geography"];

    const questions=[
        [
            "Name a movie with an alien in it",
            "Name an old classic",
            "Name a tv series with a bad ending",
            "Name a movie with a female protagonist",

            "Name a movie with time travel",
            "Name a horror movie everyone knows",
            "Name a movie with a plot twist",
            "Name a movie based on a true story",
            "Name a movie with a superhero",
            "Name a comedy movie",
            "Name a movie with a robot",
            "Name a movie set in space",
            "Name a movie with a talking animal",
            "Name a romantic movie",
            "Name a movie with a villain everyone loves",
            "Name a movie that made you cry",
            "Name a movie with a sequel",
            "Name a movie set in high school",
            "Name a movie with a famous quote",
            "Name a movie with a car chase",
            "Name a movie released in the last 5 years",
            "Name a movie with a child protagonist",
            "Name a movie with magic",
            "Name a movie longer than 2.5 hours"
        ],
        [
            "Name a popular rap song",
            "Name a musitian that went to jail",
            "Name a musician that is dead",

            "Name a band from the 90s",
            "Name a pop song everyone knows",
            "Name a song with a number in the title",
            "Name a musician with a stage name",
            "Name a one-hit wonder",
            "Name a song about love",
            "Name a sad song",
            "Name a song with a color in the title",
            "Name a rock band",
            "Name a female singer",
            "Name a male solo artist",
            "Name a song you hear at parties",
            "Name a song from a movie",
            "Name a DJ or electronic artist",
            "Name a musician with tattoos",
            "Name a controversial musician",
            "Name a song older than 20 years",
            "Name a song with a person's name in it",
            "Name a song you know all the lyrics to",
            "Name a viral song",
            "Name a band with more than 3 members"
        ],
        [
            "You are on a plane and someone next to you is playing loud music, do you say something ?",
            "A friend says he wants a snack and you also want one but have only one candy bar, do you share it ?",
            "You have a cleaning job where you can clean either houses or storage units, what do you chose ?",

            "You see someone drop money on the street, do you tell them ?",
            "Your friend is late again, do you wait or leave ?",
            "You get the wrong food order but it's better than yours, do you keep it ?",
            "Someone cuts in line, do you confront them ?",
            "You find a wallet, do you open it ?",
            "Your boss is wrong, do you correct them ?",
            "You accidentally break something at a store, do you report it ?",
            "A friend tells a bad joke, do you laugh anyway ?",
            "You see cheating on a test, do you report it ?",
            "Someone spoils a movie for you, do you get upset ?",
            "You forgot a birthday, do you admit it or pretend ?",
            "You see a stray animal, do you approach it ?",
            "You are given too much change, do you return it ?",
            "You receive a gift you don't like, do you say it ?",
            "You overhear gossip about you, do you confront it ?",
            "You can take a day off without being noticed, do you ?",
            "A friend asks for money, do you lend it ?",
            "You see someone crying in public, do you help ?",
            "You get credit for someone else's work, do you correct it ?",
            "You can skip a long queue illegally, do you take the chance ?"
        ],
        [
            "What is the best fruit",
            "What is the least liked vegetable",
            "What side dish goes great with chicken",

            "What is the best comfort food",
            "What is the worst fast food item",
            "What is the best breakfast food",
            "What is the most overrated food",
            "What is the best dessert",
            "What food do most people hate",
            "What is the best pizza topping",
            "What is the worst food combination",
            "What is the best street food",
            "What food is best eaten cold",
            "What is the best soup",
            "What is the healthiest snack",
            "What is the best food for a party",
            "What food is hardest to cook",
            "What is the best sandwich",
            "What is the best drink with a meal",
            "What food smells the worst",
            "What is the best comfort drink",
            "What food is best grilled",
            "What is the best midnight snack",
            "What is the best holiday food"
        ],
        [
            "What is the best country for summer vacation",
            "What country has the best climate",
            "What country has the best culture",

            "What country has the best food",
            "What country is the most expensive to visit",
            "What country has the nicest people",
            "What country is the safest",
            "What country has the best beaches",
            "What country has the best nightlife",
            "What country has the best history",
            "What country is the most underrated",
            "What country is the most overrated",
            "What country has the best nature",
            "What country is best for road trips",
            "What country has the best cities",
            "What country is hardest to live in",
            "What country has the best public transport",
            "What country would you move to",
            "What country has the best landmarks",
            "What country has the best festivals",
            "What country is best for adventure",
            "What country has the best architecture",
            "What country is best for food lovers",
            "What country has the best islands"
        ]
    ]
    const stages = {
        LOAD:0,
        READING:1,
        RESPONDING:2,
        CHOSING:3
    }
    let currentResponse= $state(0);
    let stage = $state(stages.LOAD)

    let responses = $state(new Array<String>(data.group.length));

    let sameResponses:number[] = $state([])

    let question=0;
    let category=0;
    


    (()=>{
        category = Math.floor(Math.random() * categories.length);
        question = Math.floor(Math.random() * questions[category].length)
        stage = stages.READING
    })()

    function voteFunction(){
        let groupCopy = $state.snapshot(data.group)
        for(let i=0;i<sameResponses.length;i++){
            groupCopy[sameResponses[i]].score++
        }
        localStorage.setItem(`hive-mind-group${data.groupId}`,JSON.stringify(groupCopy));
        goto(`/general/hive-mind/leaderboard/${data.groupId}`);
    }
</script>

{#if stage==stages.LOAD}
    <span>Loadind...</span>
{:else if stage==stages.READING}
    <div class="card p-4 preset-outlined-primary-300-700 items-center flex flex-col">
        <span>{questions[category][question]}</span>
        <button class="btn preset-filled-primary-100-900 -mb-4 mt-2" onclick={()=>{stage=stages.RESPONDING}}>OK</button>
    </div>
{:else if stage==stages.RESPONDING}
    <div class="card preset-filled-primary-300-700 p-4 m-2">
        <p>For {data.group[currentResponse].name}</p>
        <p class="h4 uppercase">{questions[category][question]}</p>
        <label class="label">
            <span class="label-text">Your answers</span>
            <textarea class="textarea" rows="4" placeholder="" bind:value={responses[currentResponse]}></textarea>
        </label>
        <button class="btn preset-tonal-success" onclick={()=>{if(++currentResponse==data.group.length){stage=stages.CHOSING}}}>Done</button>
    </div>
{:else if stage==stages.CHOSING}
    <span>Now chose all players that had the same(or similar) responses</span>
    {#each responses as resp,index}
           {@const selected=sameResponses.find((e)=>e==index)!=undefined?true:false}
           <div class="card mt-2 preset-filled-primary-200-800 {selected&&'border border-solid border-amber-200'} flex flex-col text-center text-lg md:text-2xl self-center justify-center items-center p-2">
                <p>{data.group[index].name} says:</p>
                <p>{resp}</p>
                <button class="btn {!selected? 'preset-filled-tertiary-400-600':'preset-filled-secondary-400-600' } w-fit text-xs" onclick={
                ()=>{
                    if(!selected){
                        sameResponses.push(index)
                    } else {
                        sameResponses = sameResponses.filter((e)=>e!=index);
                    }
                }}>{selected?'-1':'+1'}</button>
            </div>
    {/each}
    <button class="btn mt-2 preset-filled-primary-400-600 w-fit text-xs" onclick={()=>voteFunction()}>Done</button>
{/if}