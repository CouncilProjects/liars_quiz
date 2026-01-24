<script lang="ts">
	import TeamSelection from "$lib/components/TeamSelection.svelte";
    import type { PageProps } from './$types';

	let { data }: PageProps = $props();
    
    $inspect(data);
    
</script>

<TeamSelection game="fake-out" teamData={data} providesSettings={false}></TeamSelection>