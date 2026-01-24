<script lang="ts">
	import TeamBoard from '$lib/components/TeamBoard.svelte';
    import type { PageProps } from './$types';
    
    let { params,data }:PageProps = $props();
</script>


<TeamBoard teamdata={data} game={params.game} groupid={params.groupId}></TeamBoard>