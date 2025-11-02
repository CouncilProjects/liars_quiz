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
    // Numbers (counts, quantities, measurements) - Original + 7 new
    [
        'How many cups of coffee do you drink in a day?',
        'How many hours of sleep do you usually get per night?',
        'How many countries have you visited?',
        'How many books do you read in a year?',
        'How many messages do you send on your phone daily?',
        'How many tabs are open in your browser right now?',
        'How many minutes can you hold your breath?',
        'How many push-ups can you do in one set?',
        'How many songs are in your favorite playlist?',
        'How many pets have you had in your lifetime?',
        'How many kilometers can you run in ten minutes?',
        'How many dates do you go on before kissing?',
        'How many alarms do you have set up on your phone right now?',
        'How many alarms do you have set and active on your phone right now?',
        'How many people would show up to your birthday party?',
        'How many hotdogs can you eat in 1 hour?',
        'How many 10 year olds can you take in a fight?',
        'Number of days you could go without pooping?',
        // New questions
        'How many siblings do you have?',
        'How many languages can you speak?',
        'How many times have you moved houses in your life?',
        'How many pairs of shoes do you own?',
        'How many unread emails are in your inbox?',
        'How many times do you check your phone per hour?',
        'How many different jobs have you had?'
    ],
    
    // Specific number ranges - Original + 6 new
    [
        'Pick a number between one and one hundred',
        'Pick a number between 9 and 15',
        // New questions
        'Pick a number between 50 and 100',
        'Pick a number between 1 and 20',
        'Pick a number between 25 and 75',
        'Pick a number between 100 and 500',
        'Pick a number between 5 and 25',
        'Pick a number between 75 and 150'
    ],
    
    // Free text (open-ended answers) - Original + 7 new
    [
        "What would you tell your ten year old self if you could go back in time?",
        "What advice would you give to a dog if you could talk to it?",
        "Where would you hide buried treasure?",
        "If you could see the concert of any artist dead or alive who would it be?",
        "What is the best concert you have been to?",
        "Who has the best Discord Bio?",
        "What is one thing in your house you cannot live without?",
        "What is the most fragile thing in your house?",
        "What musician do you want to listen to more of?",
        "If you could gain the abilities of any animal what would it be?",
        "What animal are you irrationally afraid of?",
        "What is the best country to visit?",
        "What is the best country to party in?",
        "What is the best country to work at?",
        "What is the worst country to visit?",
        "What is the worst country to party in?",
        "What is the worst country to work at?",
        "If you could be a contestant in any reality show what would it be?",
        "What is your best halloween costume?",
        "What would you name your child if you had one?",
        "What job outside of your field of study would you be good at?",
        "What is your goto drink at a bar?",
        "What is the best meme you have seen?",
        "What is the worst meme you have seen in the last few years?",
        "Who is the most attractive female actress?",
        "Who is the most attractive male actor?",
        "What is a harmless conspiracy theory you believe in?",
        "What is a dark conspiracy theory you believe in?",
        "What is a harmful conspiracy theory you believe in?",
        "What is a popular conspiracy theory you dont believe in?",
        "What is the most insane conspiracy theory you have heard?",
        "If you could show a medieval peasant a modern day item what would it be?",
        "What piece of modern tech could you not live without?",
        "If you could show one thing to the people of the future to represent the people of 2025 what would it be?",
        "What is your favorite TV show of the year?",
        "What is your favorite TV show of all time?",
        "What is your favorite book of the year?",
        "What video game requires the most skill?",
        "Best video game in history?",
        "Worst video game in history?",
        "What is your pump-up song?",
        "What is your best sad song?",
        "What show/movie would be uncomfortable to watch with your parents?",
        "Whats a TV show you watched that you would not recomend to a friend?",
        "Whats a TV show you watched that you would recomend to a friend?",
        "Whats a movie you watched that you would not recomend to a friend?",
        "Whats a movie you watched that you would recomend to a friend?",
        "What influencer do you think you can beat in a fight?",
        "What is the worst emoji to respond to the FBI with?",
        "What is the worst emoji to send as a reaction to a partners selfie?",
        "What celebrity would you want to be president?",
        "Who is the most overated celebrity?",
        "What animal do you think you could take in a fight?",
        // New questions
        "If you could have dinner with any historical figure, who would it be?",
        "What superpower would be most useful in your daily life?",
        "What's the most valuable life lesson you've learned?",
        "If you could instantly master any skill, what would it be?",
        "What's your favorite way to spend a lazy Sunday?",
        "What book has had the biggest impact on your life?",
        "If you could live in any fictional universe, which would you choose?"
    ],
    
    // Time durations - Original + 7 new
    [
        "What is the perfect amount of time to grill a burger?",
        "What is the longest amount of time you have slept?",
        "What is the longest amount of time you have been awake?",
        "How long could you survive in the woods?",
        "How much time could you survive in prison?",
        "How much time could you survive without eating?",
        "How many more years do you have to live?",
        // New questions
        "How long does your average shower take?",
        "What's the ideal length for a vacation?",
        "How much time do you spend on social media daily?",
        "What's the perfect commute time to work?",
        "How long should a first date last?",
        "What's the maximum time you'd wait for food delivery?",
        "How long does it take you to fall asleep?"
    ],
    
    // Age-related - Original + 7 new
    [
        "What is the best age to start puberty?",
        "At what age did you throw your first party?",
        "At what age did you get your first phone?",
        "At what age should people be getting their first phone?",
        "At what age should you stop going to the club?",
        "What age did you receive your first allowance from your parents?",
        "What age did your parents buy you your first video game?",
        "Best age to retire?",
        "What age would you want to have kids?",
        // New questions
        "What's the perfect age to get your first car?",
        "At what age should someone move out of their parents' house?",
        "What age were you when you had your first kiss?",
        "What's the ideal age to start learning an instrument?",
        "At what age do people become adults?",
        "What age were you when you felt most confident?",
        "What's the best age to travel the world?"
    ],
    
    // Money amounts - Original + 7 new
    [
        "How much should you pay for car insurance per month?",
        "How much should you pay on the first date?",
        "How much money would it take for you to reveal your internet search history to the world included the deleted one?",
        "How much money would it take for you to drop out of uni?",
        "How much money would it take for you to give access to all your social to the group for 1 day?",
        "How much money would it take for you to run the block naked right now?",
        "How much money would it take for you to stay seated for 24 hours?",
        // New questions
        "How much should a decent apartment cost per month?",
        "What's a reasonable price for a good smartphone?",
        "How much would you pay for the perfect meal?",
        "What's the most you'd spend on a concert ticket?",
        "How much should someone save for emergencies?",
        "What's a fair hourly wage for your dream job?",
        "How much is too much for a cup of coffee?"
    ],
    
    // Person selection (from group) - Original + 7 new
    [
        "Who is the most responsible person in the group?",
        "Who has the most responsibilities in the group?",
        "Who is the best driver in the group?",
        "Who has watched the most movies in the group?",
        "Who has watched the most series in the group?",
        "Who has watched the most animes in the group?",
        "Who has watched the most TV in the group?",
        "Who would you call first from the group if you won the lottery?",
        "Who would you trust the most from the group with a secret?",
        // New questions
        "Who in the group tells the best stories?",
        "Who would survive longest in a zombie apocalypse?",
        "Who has the best taste in music?",
        "Who would be the best leader?",
        "Who makes the group laugh the most?",
        "Who has the most interesting life stories?",
        "Who would you want as your roommate?"
    ],
    
    // Measurements/quantities with units - Original + 6 new
    [
        "How much icecream can you eat in 1 hour?",
        "What is the lowest amount of water you have consumed in one day?",
        "What is the highest kilometers per hour you can achieve?",
        // New questions
        "How many liters of water do you drink per day?",
        "What's the maximum weight you can lift?",
        "How many gigabytes of data do you use per month?",
        "What's your average typing speed in words per minute?",
        "How many calories do you typically eat in a day?",
        "What's the farthest distance you've ever walked?"
    ]
];

    const useTTS=(message:string)=>{
        const utterThis = new SpeechSynthesisUtterance(message);
        utterThis.rate=data.rate || 1;
        utterThis.pitch=data.pitch || 1;
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
    let type=-1;
    
    const startRound=()=>{
        useTTS("Everyone Close your eyes and wait");
        type = Math.floor(Math.random() * questions.length);
        normalQuestion= Math.floor(Math.random() * questions[type].length); //find random normal question

        imposterQuestion= Math.floor(Math.random() * questions[type].length); //find imposter question
        while(imposterQuestion==normalQuestion){
            imposterQuestion= Math.floor(Math.random() * questions[type].length); //find imposter question
        }

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
        }, 4000);
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
            <AnswerCard question={questions[type][current!=imposter?normalQuestion:imposterQuestion]}
                imposter={current==imposter && data.mode=="normal"}
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