<script lang="ts">
	import { useTTS } from '$lib/logic/voice';
	import { Portal, Slider, Switch, Tooltip } from '@skeletonlabs/skeleton-svelte';

	let speechsetting = $state({ rate: 1, pitch: 1 });
	$inspect(speechsetting);
	let mode = $state('normal');
	let checked = $derived(mode == 'normal' ? false : true);
	let ready = $state(false);
	let changes = $state(false);
	function testSpeech() {
		useTTS('This is a test of voice Synthesis', speechsetting.rate, speechsetting.pitch);
	}

	(() => {
		const settings = localStorage.getItem('imposter-settings');
		if (settings) {
			const parsed = JSON.parse(settings);
			console.log(parsed);
			mode = parsed.mode;
			speechsetting = { rate: parsed.sRate, pitch: parsed.sPitch };
		}
		ready = true;
	})();

	function saveSettings() {
		localStorage.setItem(
			'imposter-settings',
			JSON.stringify({ mode: mode, sRate: speechsetting.rate, sPitch: speechsetting.pitch })
		);
		changes = false;
	}
</script>

{#if ready}
	<a class="btn preset-tonal-secondary" href="/imposter">Home</a>
	<div class="m-3 flex w-full flex-col space-y-3 card preset-filled-surface-400-600 p-4 sm:w-[40%]">
		<div class="flex flex-col space-y-3 card preset-filled-surface-300-700 p-2">
			<h6 class="self-center h6">Mode change</h6>
			<Switch
				{checked}
				onCheckedChange={() => {
					checked = !checked;
					checked ? (mode = 'hidden') : (mode = 'normal');
					changes = true;
				}}
			>
				<Switch.Control class="data-[state=checked]:preset-filled-success-500">
					<Switch.Thumb />
				</Switch.Control>
				<Switch.Label>
					<Tooltip>
						<Tooltip.Trigger>{mode}</Tooltip.Trigger>
						<Portal>
							<Tooltip.Positioner>
								<Tooltip.Content class="max-w-md card bg-surface-100-900 p-2 shadow-xl">
									{mode == 'normal'
										? 'In this gamemode the impostor knows they are one and can mentally prepare'
										: 'In this gamemode the impostor does not know they are one, only at the end will they learn that'}
								</Tooltip.Content>
							</Tooltip.Positioner>
						</Portal>
					</Tooltip>
				</Switch.Label>
				<Switch.HiddenInput />
			</Switch>
		</div>

		<div class="flex w-full flex-col space-y-3 card preset-filled-surface-300-700 p-2">
			<h6 class="self-center h6">Voice control</h6>
			<Slider
				value={[speechsetting.rate]}
				onValueChange={(e) => {
					speechsetting.rate = e.value[0];
					changes = true;
				}}
				defaultValue={[50]}
				min={0.1}
				max={1}
				step={0.1}
			>
				<Slider.Label>Rate = {speechsetting.rate}</Slider.Label>
				<Slider.Control>
					<Slider.Track>
						<Slider.Range />
					</Slider.Track>
					<Slider.Thumb index={0}>
						<Slider.HiddenInput />
					</Slider.Thumb>
				</Slider.Control>
			</Slider>

			<Slider
				value={[speechsetting.pitch]}
				onValueChange={(e) => {
					speechsetting.pitch = e.value[0];
					changes = true;
				}}
				defaultValue={[50]}
				min={0.1}
				max={1}
				step={0.1}
			>
				<Slider.Label>Pitch = {speechsetting.pitch}</Slider.Label>
				<Slider.Control>
					<Slider.Track>
						<Slider.Range />
					</Slider.Track>
					<Slider.Thumb index={0}>
						<Slider.HiddenInput />
					</Slider.Thumb>
				</Slider.Control>
			</Slider>

			<button class="btn w-fit self-center preset-filled-tertiary-300-700" onclick={testSpeech}
				>Test voice</button
			>
		</div>

		{#if changes}
			<button class="btn preset-filled-primary-50-950" onclick={saveSettings}>Save changes</button>
		{/if}
	</div>
{:else}
	<p>Loading</p>
{/if}
