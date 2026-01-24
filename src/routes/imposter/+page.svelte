<script lang="ts">
	import TeamSelection from "$lib/components/TeamSelection.svelte";
    let {data} = $props();
    
    $inspect(data);
    
</script>

<TeamSelection game="imposter" teamData={data} providesSettings={true}></TeamSelection>