<script lang="ts">
	import { goto } from '$app/navigation';
	type gameType = {
		gameName: string;
		entryPoint: string;
		underConst: boolean;
		nsfw?: boolean;
	};
	const listOfGames: gameType[] = [
		{
			gameName: 'Who is the imposter',
			entryPoint: '/imposter',
			underConst: false
		},
		{
			gameName: 'Fake out',
			entryPoint: '/fake-out',
			underConst: false
		},
		{
			gameName: 'Say That Again ?',
			entryPoint: '/say-again',
			underConst: false,
			nsfw: true
		},
		{
			gameName: 'Shady truths',
			entryPoint: '/shady-truth',
			underConst: false
		},
		{
			gameName: 'Magic Word',
			entryPoint: '/magic-word',
			underConst: false
		},
		{
			gameName: 'Hive mind',
			entryPoint: '/hive-mind',
			underConst: false
		},
		{
			gameName: 'On the same page',
			entryPoint: '/same-page',
			underConst: true
		}
	];
</script>

{#snippet game(gameName: string, underConst: boolean, entryPoint: string, nsfw: boolean = false)}
	<button
		class="card {underConst
			? 'cursor-auto'
			: ''} preset-filled-surface-700-300 text-surface-contrast-700-300 {underConst
			? ''
			: 'hover:shadow-2xs hover:shadow-amber-500'} m-4 flex flex-col p-2 text-center"
		onclick={() => {
			if (!underConst) goto(entryPoint);
		}}
	>
		<span class="h6">Play the game : </span>
		<span class="h4 font-bold text-primary-contrast-600-400 uppercase">{gameName}</span>

		{#if underConst}
			<span class="caption text-warning-500">🚧 Under construction 🚧</span>
		{:else}
			<span>Click to play</span>
			{#if nsfw}
				<span class="text-red-500 uppercase">+18 !</span>
			{/if}
		{/if}
	</button>
{/snippet}

<div class="grid grid-cols-1 card preset-filled-surface-600-400 p-2 md:grid-cols-2">
	{#each listOfGames as onegame: gameType}
		<div class="flex w-full flex-col md:items-center">
			{@render game(onegame.gameName, onegame.underConst, onegame.entryPoint, onegame.nsfw)}
			{#if onegame.underConst == false}
				<button
					class="mt-1 mb-2 btn w-fit self-center preset-filled-primary-500"
					onclick={() => goto(`general${onegame.entryPoint}/description`)}>Description</button
				>
			{/if}
		</div>
	{/each}
</div>

