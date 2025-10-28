<script lang="ts">
    let {question,imposter,player,ansState=$bindable()}=$props();

   
</script>

<div class="card {imposter?'preset-filled-error-300-700':'preset-filled-primary-300-700'} p-4 m-2">
	<p>For {player}</p>
	<p class="h4">{question}</p>
    {#if imposter}
        <p class="text-base">You are a fake</p>
    {/if}
	<label class="label">
		<span class="label-text">Your answers</span>
		<textarea class="textarea" rows="4" placeholder="" bind:value={ansState}></textarea>
	</label>
</div>
