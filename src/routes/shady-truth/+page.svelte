<script lang="ts">
	import TeamSelection from '$lib/components/TeamSelection.svelte';


    import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<TeamSelection game='shady-truth' providesSettings={false} teamData={data.teams}></TeamSelection>