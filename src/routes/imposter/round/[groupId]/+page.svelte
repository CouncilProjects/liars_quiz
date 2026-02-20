<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';
	import AnswerCard from './AnswerCard.svelte';
	import VotingStage from './VotingStage.svelte';
    import {useTTS} from '$lib/logic/voice'
	import { pickRoles } from '$lib/logic/assignRoles';
	let { data }:PageProps = $props();

    $inspect(data.mode);
    if(data.group==null){
        goto('/imposter');
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
    // === NUMERICAL QUESTIONS ===
    
    // Personal counts & quantities
    [
        'How many cups of coffee do you drink in a day?',
        'How many hours of sleep do you usually get per night?',
        'How many books do you read in a year?',
        'How many messages do you send on your phone daily?',
        'How many tabs are open in your browser right now?',
        'How many push-ups can you do in one set?',
        'How many songs are in your favorite playlist?',
        'How many pets have you had in your lifetime?',
        'How many siblings do you have?',
        'How many languages can you speak?',
        'How many times have you moved houses in your life?',
        'How many pairs of shoes do you own?',
        'How many unread emails are in your inbox?',
        'How many times do you check your phone per hour?',
        'How many different jobs have you had?',
        'How many alarms do you have set and active on your phone right now?'
    ],
    
    // Physical capabilities & limits
    [
        'How many minutes can you hold your breath?',
        'How many kilometers can you run in ten minutes?',
        'How many hotdogs can you eat in 1 hour?',
        'How many 10 year olds can you take in a fight?',
        'Number of days you could go without pooping?',
        'How many jumping jacks can you do without stopping?',
        'How many flights of stairs can you climb before getting tired?',
        'How many hours can you focus on work before needing a break?',
        'How many consecutive movies can you watch in one sitting?'
    ],
    
    // Social & experience counts
    [
        'How many countries have you visited?',
        'How many dates do you go on before kissing?',
        'How many people would show up to your birthday party?',
        'How many close friends do you have?',
        'How many weddings have you attended?',
        'How many people have you dated seriously?',
        'How many social events do you attend per month?',
        'How many followers do you have across all social media?',
        'How many group chats are you actively participating in?'
    ],
    
    // Random number selection
    [
        'Pick a number between one and one hundred',
        'Pick a number between 9 and 15',
        'Pick a number between 50 and 100',
        'Pick a number between 1 and 20',
        'Pick a number between 25 and 75',
        'Pick a number between 100 and 500',
        'Pick a number between 5 and 25',
        'Pick a number between 75 and 150'
    ],

    // === FREE TEXT - MEDIA & ENTERTAINMENT ===
    
    // Music & concerts
    [
        "If you could see the concert of any artist dead or alive who would it be?",
        "What is the best concert you have been to?",
        "What musician do you want to listen to more of?",
        "What is your pump-up song?",
        "What is your best sad song?",
        "Who has the best Discord Bio?",
        "What artist would you want to write a song about your life?",
        "What decade had the best music?",
        "What song always gets stuck in your head?",
        "What musician has the best stage presence?"
    ],
    
    // TV, movies & video games
    [
        "What is your favorite TV show of the year?",
        "What is your favorite TV show of all time?",
        "What show/movie would be uncomfortable to watch with your parents?",
        "Whats a TV show you watched that you would not recomend to a friend?",
        "Whats a TV show you watched that you would recomend to a friend?",
        "Whats a movie you watched that you would not recomend to a friend?",
        "Whats a movie you watched that you would recomend to a friend?",
        "What video game requires the most skill?",
        "Best video game in history?",
        "Worst video game in history?",
        "If you could be a contestant in any reality show what would it be?"
    ],
    
    // Books & reading
    [
        "What is your favorite book of the year?",
        "What book has had the biggest impact on your life?",
        "What book would you make required reading for everyone?",
        "What author would you want to write your biography?",
        "What fictional character do you most relate to?",
        "What book made you cry the most?",
        "What book genre do you avoid completely?",
        "What's the longest book you've ever read?",
        "What book changed your perspective on life?"
    ],

    // === FREE TEXT - PERSONAL PREFERENCES & LIFESTYLE ===
    
    // Personal advice & reflections
    [
        "What would you tell your ten year old self if you could go back in time?",
        "What advice would you give to a dog if you could talk to it?",
        "What's the most valuable life lesson you've learned?",
        "What's your favorite way to spend a lazy Sunday?",
        "What is one thing in your house you cannot live without?",
        "What is your goto drink at a bar?",
        "What job outside of your field of study would you be good at?",
        "What habit are you trying to build right now?",
        "What small thing always makes your day better?",
        "What personal quality are you most proud of?"
    ],
    
    // Countries & travel
    [
        "What is the best country to visit?",
        "What is the best country to party in?",
        "What is the best country to work at?",
        "What is the worst country to visit?",
        "What is the worst country to party in?",
        "What is the worst country to work at?",
        "What's the best age to travel the world?",
        "What country has the most beautiful landscapes?",
        "What country has the friendliest people?",
        "What country has the best food in your opinion?",
        "what is the most overated tourist destination in the world",
        "what is your dream destination to visit"
    ],
    
    // Hypotheticals & imagination
    [
        "Where would you hide buried treasure?",
        "If you could gain the abilities of any animal what would it be?",
        "If you could have dinner with any historical figure, who would it be?",
        "What superpower would be most useful in your daily life?",
        "If you could instantly master any skill, what would it be?",
        "If you could live in any fictional universe, which would you choose?",
        "If you could show a medieval peasant a modern day item what would it be?",
        "If you could show one thing to the people of the future to represent the people of 2025 what would it be?",
        "If you could eliminate one invention from existence, what would it be?",
        "If you could solve one world problem, which would you choose?",
        "IF YOU COULD MAKE ANYTHING INTO A CHRISTMAS TRADITION, WHAT WOULD IT BE?",
        "What is the most dangerous activity you would do for fun."
    ],

    // === FREE TEXT - POP CULTURE & CELEBRITY ===
    
    // Celebrities & public figures
    [
        "Who is the most attractive female actress?",
        "Who is the most attractive male actor?",
        "What celebrity would you want to be president?",
        "Who is the most overated celebrity?",
        "What influencer do you think you can beat in a fight?",
        "Which celebrity would make the best teacher?",
        "What celebrity has the best style?",
        "Which famous person would you want as a sibling?",
        "What celebrity seems most down-to-earth?",
        "Which celebrity would be worst at keeping secrets?"
    ],
    
    // Memes & internet culture
    [
        "What is the best meme you have seen?",
        "What is the worst meme you have seen in the last few years?",
        "What is the worst emoji to respond to the FBI with?",
        "What is the worst emoji to send as a reaction to a partners selfie?",
        "What viral trend do you wish would come back?",
        "What internet slang do you use unironically?",
        "What YouTube channel deserves more subscribers?",
        "What TikTok trend needs to disappear forever?",
        "What's the funniest meme format of all time?"
    ],

    // === FREE TEXT - CONSPIRACY & UNUSUAL BELIEFS ===
    [
        "What is a harmless conspiracy theory you believe in?",
        "What is a dark conspiracy theory you believe in?",
        "What is a harmful conspiracy theory you believe in?",
        "What is a popular conspiracy theory you dont believe in?",
        "What is the most insane conspiracy theory you have heard?",
        "What conspiracy theory would make the best movie plot?",
        "What historical mystery do you wish we could solve?",
        "What supernatural creature do you wish was real?",
        "What urban legend scared you as a child?"
    ],

    // === FREE TEXT - ANIMALS & NATURE ===
    [
        "What animal are you irrationally afraid of?",
        "What animal do you think you could take in a fight?",
        "What advice would you give to a dog if you could talk to it?",
        "What animal would be the worst pet?",
        "What extinct animal would you want to bring back?",
        "What animal has the best lifestyle?",
        "What insect deserves to go extinct?",
        "What marine creature fascinates you the most?",
        "What bird has the most annoying sound?"
    ],

    // === FREE TEXT - PERSONAL LIFE & IDENTITY ===
    [
        "What is your best halloween costume?",
        "What would you name your child if you had one?",
        "What piece of modern tech could you not live without?",
        "What is the most fragile thing in your house?",
        "What family tradition is most important to you?",
        "What childhood memory makes you happiest?",
        "What skill did you learn during quarantine?",
        "What smell brings back strong memories for you?",
        "What random fact do you know that surprises people?",
    ],

    // === TIME DURATIONS ===
    
    // Survival & endurance
    [
        "How long could you survive in the woods?",
        "How much time could you survive in prison?",
        "How much time could you survive without eating?",
        "What is the longest amount of time you have slept?",
        "What is the longest amount of time you have been awake?",
        "How long could you go without your phone?",
        "How long could you tolerate complete silence?",
        "How long could you stay in a crowded mall during holiday season?",
        "How long could you listen to baby shark on repeat?"
    ],
    
    // Daily life & routines
    [
        "How long does your average shower take?",
        "What's the ideal length for a vacation?",
        "How much time do you spend on social media daily?",
        "What's the perfect commute time to work?",
        "How long does it take you to fall asleep?",
        "What is the perfect amount of time to grill a burger?",
        "How long do you spend getting ready in the morning?",
        "What's the ideal movie length?",
        "How long should a workout session last?"
    ],
    
    // Social timing
    [
        "How long should a first date last?",
        "What's the maximum time you'd wait for food delivery?",
        "How long is too long to wait for a text reply?",
        "How long should a job interview last?",
        "What's the perfect duration for a phone call?",
        "How long should someone wait before proposing?",
        "How long is the ideal friendship before becoming roommates?"
    ],
    
    // Life & mortality
    [
        "How many more years do you have to live?",
        "How long do you want to live?",
        "How many years until you achieve your biggest goal?",
        "How long would you want to be famous for?",
        "How many years of your life would you trade for wealth?"
    ],

    // === AGE-RELATED QUESTIONS ===
    
    // Life milestones
    [
        "At what age did you throw your first party?",
        "At what age did you get your first phone?",
        "What age did you receive your first allowance from your parents?",
        "What age did your parents buy you your first video game?",
        "What's the perfect age to get your first car?",
        "What age were you when you had your first kiss?",
        "What age were you when you felt most confident?",
        "What age did you learn to ride a bike?",
        "What age were you when you got your first job?",
         "What is the best age to start puberty?",
        "At what age should people be getting their first phone?",
        "At what age should you stop going to the club?",
        "Best age to retire?",
        "What age would you want to have kids?",
        "At what age should someone move out of their parents' house?",
        "What's the ideal age to start learning an instrument?",
        "At what age do people become adults?",
        "What's the best age to get married?",
        "At what age should someone start saving for retirement?"
    ],

    // === MONEY AMOUNTS ===
    
    // Daily expenses & costs
    [
        "How much should you pay for car insurance per month?",
        "How much should a decent apartment cost per month?",
        "What's a reasonable price for a good smartphone?",
        "How much would you pay for the perfect meal?",
        "How much is too much for a cup of coffee?",
        "How much should a good pair of shoes cost?",
        "What's a fair price for a haircut?",
        "How much would you pay for reliable internet per month?",
        "What's the most you'd spend on a pair of jeans?",
        "How much should someone save for emergencies?",
        "What's a fair hourly wage for your dream job?",
        "How much should recent graduates expect to earn?",
        "How much money constitutes 'rich' in your opinion?",
        "How much should someone have saved by age 30?",
        "What's the ideal salary for a comfortable life?",
        "How much is too much to spend on hobbies monthly?"
    ],
    // Social spending
    [
        "How much should you pay on the first date?",
        "What's the most you'd spend on a concert ticket?",
        "How much is appropriate to spend on a wedding gift?",
        "How much would you pay for a best friend's birthday present?",
        "What's the most you'd spend on a fancy dinner?",
        "How much is too much for a bottle of wine?",
        "What should a nice birthday dinner cost?",
                "How much money would it take for you to reveal your internet search history to the world including the deleted one?",
        "How much money would it take for you to drop out of uni?",
        "How much money would it take for you to give access to all your social to the group for 1 day?",
        "How much money would it take for you to run the block naked right now?",
        "How much money would it take for you to stay seated for 24 hours?",
        "How much would it take for you to delete all your social media forever?",
        "How much would you need to be paid to wear the same outfit every day for a year?"
    ],

    // === PERSON SELECTION (FROM GROUP) ===
    
    // Skills & abilities
    [
        "Who is the most responsible person in the group?",
        "Who has the most responsibilities in the group?",
        "Who is the best driver in the group?",
        "Who would survive longest in a zombie apocalypse?",
        "Who would be the best leader?",
        "Who is the best cook in the group?",
        "Who has the best fashion sense?",
        "Who is the most organized?",
        "Who would win in a fitness competition?"
    ],
    
    // Media consumption
    [
        "Who has watched the most movies in the group?",
        "Who has watched the most series in the group?",
        "Who has watched the most animes in the group?",
        "Who has watched the most TV in the group?",
        "Who has the best taste in music?",
        "Who has read the most books?",
        "Who plays the most video games?",
        "Who knows the most about pop culture?",
        "Who has the most niche entertainment taste?"
    ],
    
    // Social dynamics
    [
        "Who would you call first from the group if you won the lottery?",
        "Who would you trust the most from the group with a secret?",
        "Who in the group tells the best stories?",
        "Who makes the group laugh the most?",
        "Who would you want as your roommate?",
        "Who would be the most fun at a party?",
        "Who gives the best advice?",
        "Who would you want with you in an emergency?",
        "Who remembers everyone's birthdays?"
    ],
    
    // Personal qualities
    [
        "Who has the most interesting life stories?",
        "Who has the most unusual talent?",
        "Who has traveled to the most places?",
        "Who has the most unique hobby?",
        "Who has the best memory?",
        "Who is the most creative?",
        "Who is the most spontaneous?",
        "Who is the most reliable?",
        "Who has the most surprising skill?"
    ],

    // === MEASUREMENTS WITH UNITS ===
    
    // Physical measurements
    [
        "What is the highest kilometers per hour you can achieve?",
        "What's the maximum weight you can lift?",
        "What's your average typing speed in words per minute?",
        "What's the farthest distance you've ever walked?",
        "How tall are you in centimeters?",
        "How fast can you solve a Rubik's cube?",
        "What's your vertical jump height?",
        "How many meters can you swim without stopping?",
        "What's your 100-meter sprint time?",
        "How many liters of water do you drink per day?",
        "How many calories do you typically eat in a day?",
        "What is the lowest amount of water you have consumed in one day?",
        "How much icecream can you eat in 1 hour?",
        "How many grams of protein do you eat daily?",
        "How many cups of tea or coffee do you drink weekly?",
        "How many servings of vegetables do you eat per day?",
        "How many milliliters of soda do you drink in a week?",
        "How many pieces of fruit do you eat daily?"
    ],
    
    // Digital & data
    [
        "How many gigabytes of data do you use per month?",
        "How many megabytes are your typical photos?",
        "How many terabytes of storage do you own?",
        "How many hours of video do you watch online weekly?",
        "How many emails do you send per day?",
        "How many minutes of phone calls do you make daily?",
        "How many apps do you have installed on your phone?",
        "How many WiFi networks is your device connected to?"
    ]
];

    

    let normalQuestion=-1;
    let imposterQuestion=-1;
    let imposter=-1;
    let type=-1;
    
    const startRound=()=>{
        useTTS("Everyone Close your eyes and wait",data.rate,data.pitch);
        type = Math.floor(Math.random() * questions.length);
        normalQuestion= Math.floor(Math.random() * questions[type].length); //find random normal question

        imposterQuestion= Math.floor(Math.random() * questions[type].length); //find imposter question
        while(imposterQuestion==normalQuestion){
            imposterQuestion= Math.floor(Math.random() * questions[type].length); //find imposter question
        }

        
       
        const temp=$state.snapshot(data.group!); //get a snapshot of the team 
        const role = pickRoles(temp,['impostor'],5);
        imposter=role[0];
        
        // give time before starting for all to close their eyes
        setTimeout(() => {
            ready=true;
            useTTS(`Open your eyes ${data.group![current+1].name} `,data.rate,data.pitch)
            current++;
        }, 4000);
    }
    startRound();

    

    const moveQuestioning=()=>{
        visibleNextButton=false;
        const sound = new Audio('/confirm.mp3');
        sound.play();
        setTimeout(()=>{
            useTTS(`Open your eyes ${data.group![current+1].name} `,data.rate,data.pitch);
            current++;
            visibleNextButton=true;
        },3000);
    }

    const moveToVoting=()=>{
        stage="inter";
        useTTS("Find the Imposter",data.rate,data.pitch);
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
            tempGroup[imposter].score++;
        }
        tempGroup[imposter].impostor++;
        localStorage.setItem(`imposter-group${data.groupId}`, JSON.stringify(tempGroup));

        knownImp=imposter;
        
        setTimeout(() => {
            goto(`/general/imposter/leaderboard/${data.groupId}`);
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
             <VotingStage question={questions[type][normalQuestion]} players={data.group?.map((elem)=>elem.name)} answers={answers} voteFunction={personVoted} impostor={knownImp}>

            </VotingStage>
            
       </div>
    {/if}
    
{/if}