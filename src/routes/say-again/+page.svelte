<script lang="ts">
	import TeamSelection from '$lib/components/TeamSelection.svelte';
    	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<TeamSelection game="say-again" teamData={data.teams} providesSettings={false}></TeamSelection>