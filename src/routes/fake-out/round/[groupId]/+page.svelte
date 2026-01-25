<script lang="ts">
	import { onMount } from 'svelte';
    import {type PageProps} from './$types';
	import { goto } from '$app/navigation';
	import { useTTS } from '$lib/logic/voice';
	import type { team } from '$lib/types/teamTypes';
	import { online } from 'svelte/reactivity/window';

    let {data}:PageProps = $props();
    let group:team;    
    if(!data.group){
        goto("/fake-out");
    } else {
        group = data.group as team;
    }

    $inspect(data.group);
    const categories = ["Movie", "Series", "Characters", "Food", "Meme", "Place", "Country"];

    let wordslist = [
        // Movies (original entries updated with years + 10 new entries)
        [
            "Zootopia (2016)",
            "Barbie (2023)",
            "Oppenheimer (2023)",
            "A Minecraft Movie (2025)",
            "Lilo & Stitch (2025)",
            "How to Train Your Dragon (2010)",
            "The Fellowship of the Ring (2001)",
            "The Two Towers (2002)",
            "The Return of the King (2003)",
            "The Dark Knight (2008)",
            "Inception (2010)",
            "Parasite (2019)",
            "Spirited Away (2001)",
            "Interstellar (2014)",
            "La La Land (2016)",
            "Everything Everywhere All at Once (2022)"
        ],

        // Series (original entries + 10 new entries)
        [
            "Game of Thrones",
            "Better Call Saul",
            "Breaking Bad",
            "Rick and Morty",
            "Silicon Valley",
            "House M.D.",
            "Stranger Things",
            "The Crown",
            "The Office",
            "Friends",
            "The Mandalorian",
            "Black Mirror",
            "The Witcher",
            "Bridgerton",
            "Wednesday",
            "The Boys"
        ],

        // Characters (original entries + 10 new entries)
        [
            "Judy Hopps from Zootopia",
            "Nick Wilde from Zootopia",
            "Barbie from Barbie",
            "Ken from Barbie",
            "J. Robert Oppenheimer from Oppenheimer",
            "Lewis Strauss from Oppenheimer",
            "Steve from A Minecraft Movie",
            "Alex from A Minecraft Movie",
            "Lilo Pelekai from Lilo & Stitch",
            "Stitch from Lilo & Stitch",
            "Hiccup Horrendous Haddock III from How to Train Your Dragon",
            "Toothless from How to Train Your Dragon",
            "Frodo Baggins from The Lord of the Rings",
            "Batman from The Dark Knight",
            "The Joker from The Dark Knight",
            "Eleven from Stranger Things"
        ],

        // Food (original entries + 10 new entries)
        [
            "Pizza",
            "Sushi",
            "Tacos",
            "Paella",
            "Pad Thai",
            "Hamburger",
            "Ramen",
            "Croissant",
            "Gelato",
            "Dim Sum",
            "Cheesecake",
            "Bibimbap",
            "Pho",
            "Poutine",
            "Fish and Chips",
            "Churrasco"
        ],

        // Meme (original entries + 10 new entries)
        [
            "Distracted Boyfriend",
            "Drake Hotline Bling",
            "Woman Yelling at Cat",
            "Two Buttons",
            "Change My Mind",
            "Bernie Sanders Mittens",
            "Wojak",
            "Pepe the Frog",
            "Dogecoin Dog",
            "Grumpy Cat",
            "Success Kid",
            "This Is Fine",
            "Side Eyeing Chloe",
            "Ight, Imma Head Out",
            "Always Has Been",
            "Arthur Fist"
        ],

        // Place (original entries + 10 new entries)
        [
            "Eiffel Tower",
            "Great Wall of China",
            "Taj Mahal",
            "Grand Canyon",
            "Machu Picchu",
            "Colosseum",
            "Statue of Liberty",
            "Sydney Opera House",
            "Niagara Falls",
            "Santorini",
            "Pyramids of Giza",
            "Times Square",
            "Christ the Redeemer",
            "Buckingham Palace",
            "Mount Fuji",
            "Angkor Wat"
        ],

        // Country (original entries + 10 new entries)
        [
            "Japan",
            "Italy",
            "France",
            "Brazil",
            "Australia",
            "Canada",
            "Egypt",
            "India",
            "Mexico",
            "Spain",
            "Thailand",
            "United Kingdom",
            "Germany",
            "Greece",
            "South Korea",
            "New Zealand"
        ]
    ];

    let imposter:number=$state(-1);
    let category:number=$state(-1);
    let word:number=$state(-1);
    let votingStage = $state(false);
    let order=[];

    $inspect(imposter);
    $inspect(category);
    $inspect(word);

    // note onMount will run AFTER the first render, so either i use onMount and a placeholder for the first render or i immidiatelly execure code.
    (()=>{
        if(data.group==undefined){
            return

        }
        

        category = Math.floor(Math.random() * categories.length);
        word = Math.floor(Math.random() * wordslist[category].length);

        
        imposter = Math.floor(Math.random() * data.group.length);
        //get a snapshot of the data to manipulate
        let temp = $state.snapshot(data.group);
        temp.sort((a,b)=>b.impostor-a.impostor);
        if( (data.group[imposter].impostor - temp[temp.length-1].impostor) > Math.floor(Math.random()*3+2)){
            imposter = data.group.findIndex((player)=>player.name==temp[temp.length-1].name);
        }


    
        //get an array with only the normal players first
        let normals = data.group?.filter((_,i)=>i!=imposter);

        //pick a random normal to be put first.
        let temp2 = Math.floor(Math.random()*normals!.length);
        order.push(normals![temp2].name);
        normals?.splice(temp2,1,data.group![imposter])//then replace that normal with the spy

        do {
            temp2 = Math.floor(Math.random()*normals!.length);
            order.push(normals![temp2].name);
            normals?.splice(temp2,1);
        } while (normals!.length>0) // and then start placing them at random until they all are in order.
    })();

    useTTS("Everyone close your eyes and wait",data.rate,data.pitch);
    if(data.mode=='sabotage'){
        useTTS("The spy has done sabotage",data.rate,data.pitch);
    }
    
    

    //result is that order now contains all player names with the first one Never being the spy
    
    let currentTurn = $state(-1);
    
    setTimeout(()=>{
        currentTurn=0;
        useTTS(`Open your eyes ${group[currentTurn].name}`,data.rate,data.pitch);
        if(data.mode=='sabotage') countDown();
    },4000);

    const personVoted=(index:number)=>{

        const tempGroup = data.group!;

        if (order[index] === group[imposter].name) {
            const sound = new Audio('/win.mp3');
            sound.play();
            if (tempGroup[imposter].score > 0) {
                tempGroup[imposter].score--;
            }
        } else {
            const sound = new Audio('/lose.mp3');
            sound.play();
            tempGroup[imposter].score++;
        }
        tempGroup[imposter].impostor++;
        localStorage.setItem(`fake-out-group${data.groupId}`, JSON.stringify(tempGroup));

        
        setTimeout(() => {
            goto(`/general/fake-out/leaderboard/${data.groupId}`);
        }, 3000);
    }

    function nextTurn(){
        useTTS(`Close your eyes ${group[currentTurn].name}`,data.rate,data.pitch);
        
        setTimeout(()=>{
            showHint=false;
            if(currentTurn==group.length-1){
                votingStage=true;
                useTTS(`Open your eyes everyone`,data.rate,data.pitch);
                return;
            }
            currentTurn++;
            useTTS(`Open your eyes ${group[currentTurn].name}`, data.rate,data.pitch);
            if(data.mode=='sabotage') countDown();
        },3000);
    }

    let timeLim = $state(-1);
    function countDown(){
        timeLim=3;
        let intervalID = setInterval(()=>{
            timeLim--;
            if(timeLim==0) {
                nextTurn();
                clearInterval(intervalID);
                return;
            }
        },1000);
        
    }

    let url = ["https://www.google.com/search?igu=1","&q=judy+hops","&tbm=isch"];
    let urlDone=$state(false);
    let showHint = $state(false);
    (()=>{
        if(data.mode!='normal') return;
        let curWord = wordslist[category][word];
        url[1] = "&q="+encodeURIComponent(curWord);
        if(online.current){
            urlDone=true
        }
    })();

</script>

{#snippet envelope(name:string,word:string,category:string)}
    <div class="card preset-filled-primary-300-700 p-4 m-2">
        <p>For {name}'s eyes only</p>
        <p>You are not the spy.</p>
        <p class="h4 uppercase">{word}</p>
        <p class="caption-bottom">Category {category}</p>
        <button class={`btn preset-tonal-secondary ${showHint==true ||data.mode!='normal' || !online.current ? 'hidden' : ''}`} onclick={()=>{showHint=true;}}>Show hint</button>
    </div>
{/snippet}


{#snippet mission(name:string,mission:string,category:string|null)}
    <div class="card preset-filled-error-300-700 p-4 m-2">
        <p>For {name}'s eyes only</p>
        <p>You are the spy.</p>
        <p class="h4 uppercase">{mission}</p>
        {#if category}
            <p class="caption-bottom">SABOTAGE ! You found out its <span class="uppercase underline">Category {category}</span></p>
        {/if}
    </div>
{/snippet}

<div class="card preset-filled-surface-500 max-w-[80%]">
    {#if !votingStage}
        {#if currentTurn>-1}
            <div class="text-center items-center justify-center flex flex-col">
                {#if currentTurn!=imposter}
                    {@render envelope(group[currentTurn].name,wordslist[category][word],categories[category])}
                {:else}
                    {@render mission(group[currentTurn].name,"Try to find the secret word",data.mode=='normal'?null:categories[category])}
                {/if}
                {#if data.mode=='normal'}
                    <button class="btn preset-filled-primary-50-950" onclick={nextTurn}>Next</button>
                {:else}
                    <p>SABOTAGE ! You have {timeLim} seconds left</p>
                {/if}
                
            </div>
        {/if}
    {:else}
        <div class="card preset-outlined-primary-300-700 p-3 text-center">
            <p>In this order say hint</p>
            <p>Try to find the spy before the spy figures it out</p>
            {#each order as name,i}
                <div>
                    <p class="h4">{name}</p>
                    <button class="btn preset-filled-error-200-800" onclick={()=>personVoted(i)}>Vote</button>
                </div>
            {/each}
            <button class="btn preset-filled-success-500 mt-4"  onclick={()=>{personVoted(0)}}>Spy figured it out</button> <!--This is kind of hacky because i "know" the first person is never the spy-->
        </div>
    {/if}
</div>
{#if urlDone && data.mode=='normal'}
    <iframe class=" m-2 w-[100vw] h-[50vh] {(currentTurn==imposter)||(votingStage==true)||(showHint==false) ? 'hidden':''}" src={url[0]+url[1]+url[2]}></iframe>
{/if}
