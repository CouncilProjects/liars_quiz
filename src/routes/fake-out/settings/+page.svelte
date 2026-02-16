<script lang="ts">
	import { Combobox, Portal, Slider, Switch, Tooltip, useListCollection, type ComboboxRootProps } from "@skeletonlabs/skeleton-svelte";
    
	const synth = window.speechSynthesis;

	let speechsetting = $state({ rate: 1, pitch: 1 });
    
	let mode = $state('normal');
	let ready = $state(false);
    let changes=$state(false);
	function testSpeech() {
		const utterThis = new SpeechSynthesisUtterance('This is a test. Of voice Synthesis');
		utterThis.rate = speechsetting.rate;
		utterThis.pitch = speechsetting.pitch;
        synth.speak(utterThis);
	}

	(() => {
		const settings = localStorage.getItem('fake-out-settings');
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
			'fake-out-settings',
			JSON.stringify({ mode: mode, sRate: speechsetting.rate, sPitch: speechsetting.pitch })
		);
        changes=false;
	}

    const data = [
		{ label: 'Normal', value: 'normal' },
		{ label: 'Counter intelligence', value: 'counter_int' },
		{ label: 'Sabotage', value: 'sabotage' },
		
	];
    const descriptions = {
        normal:
        "In normal mode players can take as much time as they need to read the word and even get hints.",

        sabotage:
        "SABOTAGE! In this gamemode the spy destroyed communications. Each player only has limited time to look at the word without hints, while the spy knows the list of possible words.",

        counter_int:
        "Counter Intelligence! In this gamemode the counter intelligence department has blocked the spy from looking at the word list."
    };

    let items = $state(data);
    

	const collection = $derived(
		useListCollection({
			items: items,
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	);

	const onOpenChange = () => {
		items = data;
	};

	const onInputValueChange: ComboboxRootProps['onInputValueChange'] = (event) => {
		const filtered = data.filter((item) => item.value.toLowerCase().includes(event.inputValue.toLowerCase()));
		if (filtered.length > 0) {
			items = filtered;
		} else {
			items = data;
		}
	};

    const onValueChange:ComboboxRootProps['onValueChange'] = (event) => {
        mode = event.value[0];
        changes=true;
    }
</script>


{#if ready}
    <a class="btn preset-tonal-secondary" href="/fake-out">Home</a>
<div class="flex flex-col space-y-3 card preset-filled-surface-400-600 m-3 p-4 w-full sm:w-[40%]">
	<div class="flex flex-col space-y-3 card preset-filled-surface-300-700 p-2">
        <h6 class="h6 self-center">Mode selection</h6>

        <Combobox class="max-w-md" placeholder="Search..." defaultInputValue={mode} {collection} {onOpenChange} {onInputValueChange} {onValueChange}>
            <Combobox.Label>Label</Combobox.Label>
            <Combobox.Control>
                <Combobox.Input />
                <Combobox.Trigger />
            </Combobox.Control>
            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content>
                        {#each items as item (item.value)}
                            <Combobox.Item {item}>
                                <Combobox.ItemText>{item.label}</Combobox.ItemText>
                                <Combobox.ItemIndicator />
                            </Combobox.Item>
                        {/each}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox>
        <!--
		<Switch checked={checked} 
            onCheckedChange={
                    ()=>{
                        checked=!checked;
                        checked?mode="sabotage":mode="normal";
                        changes=true;
                    }
                }>
			<Switch.Control class="data-[state=checked]:preset-filled-success-500">
				<Switch.Thumb />
			</Switch.Control>
            <Switch.Label>
                <Tooltip>
                    <Tooltip.Trigger>{mode}</Tooltip.Trigger>
                    <Portal>
                        <Tooltip.Positioner>
                        <Tooltip.Content class="card max-w-md p-2 bg-surface-100-900 shadow-xl">
                            {
                                descriptions[mode]
                            }
                        </Tooltip.Content>
                        </Tooltip.Positioner>
                    </Portal>
                </Tooltip>
            </Switch.Label>
			<Switch.HiddenInput />
		</Switch>-->
        <p class="text-center">{descriptions[mode]}</p>
	</div>

	<div class="flex flex-col space-y-3 card preset-filled-surface-300-700 p-2 w-full">
        <h6 class="h6 self-center">Voice control</h6>
        <Slider value={[speechsetting.rate]} onValueChange={(e)=>{speechsetting.rate=e.value[0]; changes=true;}} defaultValue={[50]} min={0.1} max={1} step={0.1}>
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

        <Slider value={[speechsetting.pitch]} onValueChange={(e)=>{speechsetting.pitch=e.value[0]; changes=true;}} defaultValue={[50]} min={0.1} max={1} step={0.1}>
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

        <button class="btn preset-filled-tertiary-300-700 w-fit self-center" onclick={testSpeech}>Test voice</button>
    </div>

    {#if changes}
        <button class="btn preset-filled-primary-50-950" onclick={saveSettings}>Save changes</button>
    {/if}
</div>
{:else}
<p>Loading</p>
{/if}
