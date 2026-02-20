<script lang="ts">
	import { onMount } from 'svelte';
    import {type PageProps} from './$types';
	import { goto } from '$app/navigation';
	import { useTTS } from '$lib/logic/voice';
	import type { team } from '$lib/types/teamTypes';
	import { online } from 'svelte/reactivity/window';
    import {wordCategories,words} from '$lib/types/categories'
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { pickRoles } from '$lib/logic/assignRoles';

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
    let wordArray:number =0;
    let stage = $state(0);
    let throwAways = $state<Set<number>>(new Set([]));
    let order=[];
    let targetEL:HTMLElement|null = $state(null);
    let openModal = $state(true);

    $inspect(imposter);
    $inspect(category);
    $inspect(word);

    // note onMount will run AFTER the first render, so either i use onMount and a placeholder for the first render or i immidiatelly execure code.
    (()=>{
        if(data.group==undefined){
            return

        }
        

        category = Math.floor(Math.random() * wordCategories.length);
        wordArray = Math.floor(Math.random() * words[category].length);
        word = Math.floor(Math.random() * words[category][wordArray].length);
        
        const temp = $state.snapshot(data.group);

        const role = pickRoles(temp,['impostor'],5);
        imposter=role[0];

        if(data.mode=='sabotage'){
            throwAways.add(word);
            for (;throwAways.size<5;){
                throwAways.add(Math.floor(Math.random() * words[category][wordArray].length));
            }
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
    if(data.mode=='espionage'){
        useTTS("The spy has done espionage",data.rate,data.pitch);
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
                stage=1;
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
        let curWord = words[category][wordArray][word];
        url[1] = "&q="+encodeURIComponent(curWord);
        if(online.current){
            urlDone=true
        }
    })();

    const cellModes = {
        normal : "bg-surface-400",
        colored : "bg-primary-600-400/70",
        known : "bg-success-300-700",
        throaway : "bg-secondary-200-800 underline"
    }
</script>

{#snippet cell(word:string,mode:string)}

    <span class={[
                mode,
                "text-center justify-center flex flex-col col-span-1"
            ]}>{word.toLocaleLowerCase()}</span>
{/snippet}

{#snippet wordcard(words:string[],word:number,spy:boolean,throwAways:Set<number>)}
    <div class="card preset-filled-surface-300-700 grid-cols-2 grid w-full h-full md:grid-cols-4 lg:w-[30dvw] lg:h-[40dvh]">
        {#each words as singleWord,index}
            {@const colorit=(index%2)===(Math.floor(index/4)%2)}
            {#if spy && throwAways && throwAways.has(index)}
                {@render cell(singleWord,cellModes.throaway)}
            {:else if !spy && index==word}
                {@render cell(singleWord,cellModes.known)}
            {:else}
                {@render cell(singleWord,colorit ? cellModes.colored : cellModes.normal)}
            {/if}
            
        {/each}
    </div>
{/snippet}


{#snippet envelope(name:string,spy:boolean,mission:string|null)}
    <div class={["card p-4 m-2",spy ? 'preset-filled-error-300-700':'preset-filled-primary-300-700']}>
        <p>For {name}'s eyes only</p>
        {#if spy}
            <p>You are the spy.</p>
        {:else}
            <p>You are not the spy.</p>
        {/if}
        
        {#if spy && data.mode=='counter_int'}
            The enemies counter intelligence blocked you from looking at the words
        {:else}
            {@render wordcard(words[category][wordArray],word,spy,throwAways)}
        {/if}
        <p class="caption-bottom">Category {wordCategories[category]}</p>
        {#if !spy}
            <button class={[`btn preset-tonal-secondary`,(showHint==true ||data.mode!='normal' || !online.current) && 'hidden']} onclick={()=>{showHint=true;}}>Show hint</button>
        {/if}
        
    </div>
{/snippet}
<!-- -->



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

<div class="card preset-filled-surface-500 max-w-[80%] p-2">
    {#if stage==0}
        {#if currentTurn>-1}
            <div class="text-center items-center justify-center flex flex-col">
                {#if currentTurn!=imposter}
                    {@render envelope(group[currentTurn].name,false,'a')}
                {:else}
                    {@render envelope(group[currentTurn].name,true,'a')}
                {/if}
                {#if ['normal','counter_int'].includes(data.mode)}
                    <button class="btn preset-filled-primary-50-950" onclick={nextTurn}>Next</button>
                {:else}
                    <p>SABOTAGE ! You have {timeLim} seconds left</p>
                {/if}
                
            </div>
        {/if}
    {:else if stage==2}
        <div class="card preset-outlined-primary-300-700 p-3 text-center">
            <h3 class='h3'>Who is the spy ?</h3>
            {#each order as name,i}
                <div class="m-1">
                    <button class="btn preset-filled-error-200-800" onclick={()=>personVoted(i)}>{name} is the spy</button>
                </div>
            {/each}
            <button class="btn preset-filled-success-500 mt-4"  onclick={()=>{personVoted(0)}}>Spy figured it out</button> <!--This is kind of hacky because i "know" the first person is never the spy-->
        </div>
    {:else}
        {@render wordcard(words[category][wordArray],-1,false,throwAways)}
        <div bind:this={targetEL}></div>
        <Dialog open={openModal} modal={true} onOpenChange={(e)=>{openModal=e.open}}>
            
            <Portal target={targetEL}>
                <Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
                <Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center p-4">
                    <Dialog.Content class="card bg-surface-800 w-[80%] h-[60dvh] max-w-xl max-h-xl p-4 space-y-4 shadow-xl">
                        <header class="flex justify-between items-center">
                            <Dialog.Title class="text-lg font-bold">Hello players</Dialog.Title>
                            <Dialog.CloseTrigger class="btn preset-outlined-error-500 hover:preset-tonal">
                                X
                            </Dialog.CloseTrigger>
                        </header>
                        <Dialog.Description class=" max-h-[70%] overflow-y-auto">
                            In this order start giving hints
                            {#each order as name,i}
                                
                                <p class="h4">{name}</p>
                                
                            {/each}
                        </Dialog.Description>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog>

        <div class="flex flex-col mt-2 sm:flex-row">
            <button class="btn preset-filled-secondary-500 self-center" onclick={()=>{openModal=true}}>Remind order</button>
            <button class="btn preset-filled-primary-500 self-center" onclick={()=>{stage=2}}>To Voting</button>
        </div>
        
    {/if}
</div>
{#if urlDone && data.mode=='normal'}
    <iframe class=" m-2 w-screen h-[50vh] {(currentTurn==imposter)||(stage>0)||(showHint==false) ? 'hidden':''}" src={url[0]+url[1]+url[2]}></iframe>
{/if}
