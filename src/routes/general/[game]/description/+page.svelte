<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { PageProps } from './$types';
	import { ArrowBigLeftDash, ChevronDownIcon } from '@lucide/svelte';
	import { slide } from 'svelte/transition';

	const { params }: PageProps = $props();
	type role = {
		name: string;
		purpose: string;
		color: string;
	};

	type desc = {
		prompt: string;
		nsfw?: boolean;
		promptExamples?: string[];
		baseIdea: string;
		baseRoles?: role[];
		modes: {
			name: string;
			descr: string;
			roles: role[];
		}[];
	};

	const imposterDesc: desc = {
		baseIdea:
			"All players except one get the same prompt, after all the players have answered try to find the <span class='text-red-500'>imposter.</span>",
		prompt: 'Open text questions',
		promptExamples: [
			'How many pets have you had in your lifetime?',
			'How many countries have you visited?',
			"What's the longest book you've ever read?"
		],
		baseRoles: [
			{
				name: 'Imposter',
				color: 'text-red-500',
				purpose: 'To not get found out'
			},
			{
				name: 'Normal player',
				color: 'text-primary-500',
				purpose: 'To find the imposter'
			}
		],
		modes: [
			{
				name: 'Normal',
				descr:
					'The imposter gets a different question but they know they are the imposter, thus allowing them to plan accordingly',
				roles: []
			},
			{
				name: 'Hidden',
				descr:
					'The imposter gets a different question but they do not know they are the imposter, only after the question is revealed they find out',
				roles: [
					{
						name: 'Imposter',
						color: 'text-red-500',
						purpose: 'The imposter will not know whether they are one while answering'
					}
				]
			}
		]
	};

	const fakeoutDesc: desc = {
		baseIdea: `Players will secretly look at a card with words. All players will have the same word marked, except the <span class='text-red-500'>SPY</span>.
        After all the players have seen the word list, the game will have them say something related to the word in some order. The <span class='text-red-500'>SPY</span> needs to figure out the word before the <span class='text-primary-500'>Players</span> find him`,
		prompt: 'Card of words',
		promptExamples: [],
		baseRoles: [
			{
				name: 'Player',
				purpose: 'Convince the other players he knows the word, while not revealing it to the spy',
				color: 'text-primary-500'
			},
			{
				name: 'Spy',
				purpose: 'Convince the other players he knows the word, while trying to figure it out',
				color: 'text-red-500'
			}
		],
		modes: [
			{
				name: 'Normal',
				descr:
					'Each player has unlimited time to look at the card of words and also have access to a hint button in case they dont know the word. [Disclaimer: this feature is dependant on googles image search and might not work in the future]',
				roles: []
			},
			{
				name: 'Counter Intelligence',
				descr: 'The counter intelligence department has blocked the spy from seeing the card.',
				roles: [
					{
						name: 'Spy',
						purpose: 'The spy will not be able to look at the card list before the game starts',
						color: 'text-red-500'
					}
				]
			},
			{
				name: 'Sabotage',
				descr:
					"The <span class='text-red-500'>SPY</span> has sabotaged communications ! all players have limited time to look at the card and the <span class='text-red-500'>SPY</span> has a smaller list",
				roles: [
					{
						name: 'Spy',
						purpose: 'The spy has a smaller list of possible words',
						color: 'text-red-500'
					},
					{
						name: 'Player',
						purpose: 'The players have limited time to look at the words',
						color: 'text-primary-500'
					}
				]
			}
		]
	};

	const sayagainDesc: desc = {
		baseIdea:
			'One player becomes the judge, the rest get a prompt which they have to answer, the judge picks their favorite',
		nsfw: true,
		prompt: 'Open text questions combining 2 scenarios',
		promptExamples: [
			'Something you can say at a pottery class ...and while giving birth',
			'Something you can say at a gender reveal party ...and at an orgy',
			'Something you can say as a reporter on the news ...and in jail'
		],
		baseRoles: [
			{ name: 'Judge', purpose: 'Pick their favorite', color: 'text-primary-500' },
			{
				name: 'Player',
				purpose: 'Answer the prompt creatively to win the judge over',
				color: 'text-secondary-500'
			}
		],
		modes: [
			{
				name: 'Normal',
				descr: 'The judge picks their favorite answer and that person gets a point',
				roles: []
			}
		]
	};

	const shadytruthDesc: desc = {
		baseIdea: `One player the <span class='text-primary-500'>GUESSER</span> will be tasked with finding the <span class='text-green-500'>TRUTH TELLER</span> while the rest of the players are <span class='text-red-500'>RED HERRINGS</span>.
        During the round, a question will be displayed, the <span class='text-red-500'>RED HERRINGS</span> will each answer with a lie, while the <span class='text-green-500'>TRUTH TELLER</span> will say the truth.`,
		prompt: 'Trivia question',
		promptExamples: [
			'Which blood type is known as the universal donor?',
			'What is the smallest unit of life?',
			'Which city hosted the 2008 Summer Olympics?'
		],
		baseRoles: [
			{
				name: 'guesser',
				color: 'text-primary-500',
				purpose: 'wants to correctly find all the liars without accusing the truth teller as a liar'
			},
			{
				name: 'red herring',
				color: 'text-red-500',
				purpose: 'wants to not get voted as a liar'
			},
			{
				name: 'truth teller',
				color: 'text-green-500',
				purpose: 'wants to convince the guesser to vote them as the liar'
			}
		],
		modes: [
			{
				name: 'Normal',
				descr:
					"The <span class='text-primary-500'>GUESSER</span> needs to accuse all the liars and not the truth teller. The guesser also has the right to bank their gathered points and finish the round early.",
				roles: [
					{
						name: 'guesser',
						color: 'text-primary-500',
						purpose:
							'+1 point for every correctly identified red herring, loses all points if he accuses the truth teller but has the chance to end the round early. They get +1 bonus point if they find all the red herrings'
					},
					{
						name: 'red herring',
						color: 'text-red-500',
						purpose: '+1 point if the round ends and they havent been identified.'
					},
					{
						name: 'truth teller',
						color: 'text-green-500',
						purpose:
							'+1 point for every red herring still in the game after the round has finished.'
					}
				]
			}
		]
	};

	const magicwordDesc: desc = {
		baseIdea:
			"The <span class='text-primary-500'>CHIEF</span> chooses one secret word. Then the <span class='text-red-500'>DARK MAGICIAN</span> takes a look at the word. Then all players open their eyes and in order ask questions to the <span class='text-primary-500'>CHIEF</span> that have answers YES/MAYBE/NO. The players need to find the word while the <span class='text-red-500'>DARK MAGICIAN</span> needs to divert them.",
		prompt: 'Singular secret word',
		promptExamples: ['Country', 'USB drive', 'Mop'],
		baseRoles: [
			{
				name: 'Player',
				color: 'text-primary-500',
				purpose: 'Ask questions and try to guess the secret word'
			}
		],
		modes: [
			{
				name: 'Normal',
				descr:
					"In normal game there is one <span class='text-red-500'>DARK MAGICIAN</span> and one <span class='text-red-500'>CHIEF</span>. The players have 4 minutes to try to find the magic word.",
				roles: [
					{
						name: 'Dark magician',
						color: 'text-red-500',
						purpose:
							'Wants to divert the attention of the players so they dont find the word. Will get +1 point if the players dont find the word. Will also get +1 point if the chief does not find him.'
					},
					{
						name: 'chief',
						color: 'text-primary-500',
						purpose:
							'The chief will be selecting the word and will also be the one giving answers to the players. If the players find the word then everyone except the dark magician gets +1 point, if the players fail to find the word the chief can try to find the dark magician getting +1 points if successful'
					}
				]
			},
			{
				name: 'Fortune teller',
				descr:
					"In this game mode the players have a <span class='text-green-500'>FORTUNE TELLER</span> on their side, the fortune teller knows the first 1-3 letters of the magic word",
				roles: [
					{
						name: 'fortune teller',
						color: 'text-green-500',
						purpose:
							'[MODE SPECIFIC] Wants to help the players reach the word, will receive +1 point if the players find the word but the dark magician must not find him'
					},
					{
						name: 'Dark magician',
						color: 'text-red-500',
						purpose:
							'In this game mode if the players find the word the dark magician has a chance to gain +1 point if he uncovers the fortune teller'
					}
				]
			}
		]
	};

	const hivemindDesc: desc = {
		baseIdea: 'All players must answer the question, those whose answers match gain a point',
		prompt: 'A free-text question',
		promptExamples: ['Name a movie with an alien', 'Name a rap song', 'Name a male movie actor'],
		baseRoles: [
			{
				name: 'Guesser',
				color: 'text-green-500',
				purpose:
					'All players are guessers, those that have the same answer as another player get a point.'
			}
		],
		modes: [
			{
				name: 'normal',
				descr:
					'A prompt appears on screen each player must then write their response, those with matching answers get a point',
				roles: []
			}
		]
	};

	const descriptions = {
		imposter: imposterDesc,
		'fake-out': fakeoutDesc,
		'say-again': sayagainDesc,
		'shady-truth': shadytruthDesc,
		'magic-word': magicwordDesc,
		'hive-mind': hivemindDesc
	};

	const actual_names = {
		imposter: 'Who is the imposter',
		'fake-out': 'Fake Out',
		'say-again': 'Say that again ?',
		'shady-truth': 'Shady truth',
		'magic-word': 'Magic word',
		'hive-mind': 'Hive Mind'
	};

	let description = $derived(descriptions[params.game as keyof typeof descriptions]);
</script>

<a class="mb-2 btn preset-tonal-primary" href="/"
	>Game selection <ArrowBigLeftDash color="#11f111" /></a
>
<div
	class="flex h-full w-full flex-col items-center justify-center card preset-filled-surface-100-900 p-2 text-center md:max-w-[50%]"
>
	<span class="h4 md:h2">{actual_names[params.game as keyof typeof actual_names]} description</span>
	<div>
		<hr class="my-2 hr" />
		<p class="text-md md:text-xl">{@html description.baseIdea}</p>
		{#if description.nsfw}
			<span class="bg-red-500">
				This game contains adult theme elements so its not advised to be played with minors.
			</span>
		{/if}
		<hr class="my-2 hr" />
		<p class="text-md">Prompt type</p>
		<p class="text-xl">{description.prompt}</p>

		<Accordion collapsible>
			<Accordion.Item value={'1'}>
				<h3>
					<Accordion.ItemTrigger class="flex items-center justify-between gap-2 font-bold">
						Show Examples
						<Accordion.ItemIndicator class="group">
							<ChevronDownIcon class="h-5 w-5 transition group-data-[state=open]:rotate-180" />
						</Accordion.ItemIndicator>
					</Accordion.ItemTrigger>
				</h3>
				<Accordion.ItemContent>
					{#snippet element(attributes)}
						{#if !attributes.hidden}
							<div {...attributes} transition:slide={{ duration: 150 }}>
								{#if description.promptExamples?.length == 0}
									No examples
								{:else}
									{#each description.promptExamples as example, i}
										<p class="uppercase">[{i + 1}] {example}</p>
									{/each}
								{/if}
							</div>
						{/if}
					{/snippet}
				</Accordion.ItemContent>
			</Accordion.Item>
		</Accordion>
		<hr class="my-2 hr" />

		Basic roles
		{#each description.baseRoles as role}
			<div>
				<span class="{role.color} uppercase">{role.name}</span>
				<span>{role.purpose}</span>
			</div>
		{/each}

		<hr class="my-2 hr" />
		<p class="h4">Modes to chose from</p>
		<Accordion collapsible>
			{#each description.modes as mode, i}
				{#if i !== 0}
					<hr class="hr" />
				{/if}
				<Accordion.Item value={mode.name}>
					<h3>
						<Accordion.ItemTrigger class="flex items-center justify-between gap-2 font-bold">
							<span class="uppercase">{mode.name}</span>
							<Accordion.ItemIndicator class="group">
								<ChevronDownIcon class="h-5 w-5 transition group-data-[state=open]:rotate-180" />
							</Accordion.ItemIndicator>
						</Accordion.ItemTrigger>
					</h3>
					<Accordion.ItemContent>
						{#snippet element(attributes)}
							{#if !attributes.hidden}
								<div {...attributes} transition:slide={{ duration: 150 }}>
									<p class="mb-1 self-start text-left font-bold">Mode description</p>
									{@html mode.descr}
									<p class="mb-1 self-start text-left font-bold">Special role changes</p>
									{#if mode.roles.length == 0}
										<p>No special role changes</p>
									{:else}
										<div class="overflow-x-auto">
											<table
												class="min-w-full table-fixed divide-y divide-surface-200 dark:divide-surface-700"
											>
												<thead class="bg-surface-100 dark:bg-surface-800">
													<tr class="text-center">
														<th class="w-1/3 px-4 py-3 text-center text-sm font-semibold">
															Role
														</th>
														<th class="w-2/3 px-4 py-3 text-center text-sm font-semibold">
															Purpose
														</th>
													</tr>
												</thead>

												<tbody class="divide-y divide-surface-200 dark:divide-surface-700">
													{#each mode.roles as role}
														<tr
															class="transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/50"
														>
															<td class="w-1/3 px-4 py-3">
																<span class="font-medium uppercase {role.color}">
																	{role.name}
																</span>
															</td>
															<td
																class="w-2/3 px-4 py-3 text-sm text-surface-600 dark:text-surface-300"
															>
																{role.purpose}
															</td>
														</tr>
													{/each}
												</tbody>
											</table>
										</div>
									{/if}
								</div>
							{/if}
						{/snippet}
					</Accordion.ItemContent>
				</Accordion.Item>
			{/each}
		</Accordion>
	</div>
</div>

