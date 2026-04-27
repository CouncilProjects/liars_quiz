<script lang="ts">
	import TeamSelection from "$lib/components/TeamSelection.svelte";
    let {data} = $props();
    
    $inspect(data);
    
</script>

<TeamSelection game="hive-mind" teamData={data} providesSettings={false}></TeamSelection>