<script lang="ts">
	import TeamSelection from "$lib/components/TeamSelection.svelte";
    let {data} = $props();
    
</script>

<TeamSelection game="magic-word" teamData={data.teams} providesSettings={true}></TeamSelection>