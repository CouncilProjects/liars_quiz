<script lang="ts">
	import { Combobox, Portal, Slider, Switch, Tooltip, useListCollection, type ComboboxRootProps } from "@skeletonlabs/skeleton-svelte";
    const defaulting={mode:'normal',synth:{rate:1,pitch:1},customWords:false,timeLimit:240,maxQuestions:50}
    
	const synth = window.speechSynthesis;
	let ready = $state(false);
    let changes=$state(false);
    let originalState=$state(defaulting); //needed for the dirty checking. 
    let settingsState = $state(defaulting);

	function testSpeech() {
		const utterThis = new SpeechSynthesisUtterance('This is a test. Of voice Synthesis');
		utterThis.rate = settingsState.synth.rate
		utterThis.pitch = settingsState.synth.pitch
        synth.speak(utterThis);
	}

    let hasChanges = $derived(JSON.stringify(originalState)!==JSON.stringify(settingsState));
    $inspect(hasChanges);

	(() => {
		const settings = localStorage.getItem('magic-word-settings');
        
		if (settings) {
            
			const parsed = JSON.parse(settings);
            settingsState=parsed;
            originalState=parsed;
		} else {
            saveSettings();
        }

        
		ready = true;
	})();

	function saveSettings() {
		localStorage.setItem(
			'magic-word-settings',
			JSON.stringify(settingsState)
		);
        originalState= $state.snapshot(settingsState); // i need to take a snapshot or else they will syncronize. 

	}

    const data = [
		{ label: 'Normal', value: 'normal' },
		{ label: 'Fortune teller', value: 'fortune' },
		
	];



    


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
        settingsState.mode = event.value[0];
    }

    

</script>


{#if ready}
    <a class="btn preset-tonal-secondary" href="/magic-word">Home</a>
    <div class="flex flex-col space-y-3 card preset-filled-surface-400-600 m-3 p-4 w-full sm:w-[40%]">
        <div class="flex flex-col space-y-3 card preset-filled-surface-300-700 p-2">
            <h6 class="h6 self-center">Mode selection</h6>

            <Combobox class="max-w-md" placeholder="Search..." allowCustomValue={false} defaultInputValue={data.find((e)=>e.value==settingsState.mode)?.label} {collection} {onOpenChange} {onInputValueChange} {onValueChange}>
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
        </div>

        <div class="flex flex-col space-y-3 card preset-filled-surface-300-700 p-2 w-full">
            <h6 class="h6 self-center">Voice control</h6>
            <Slider value={[settingsState.synth.rate]} onValueChange={(e)=>{settingsState.synth.rate=e.value[0];}} defaultValue={[50]} min={0.1} max={1} step={0.1}>
                <Slider.Label>Rate = {settingsState.synth.rate}</Slider.Label>
                <Slider.Control>
                    <Slider.Track>
                    <Slider.Range />
                    </Slider.Track>
                    <Slider.Thumb index={0}>
                    <Slider.HiddenInput />
                    </Slider.Thumb>
                </Slider.Control>
            </Slider>

            <Slider value={[settingsState.synth.pitch]} onValueChange={(e)=>{settingsState.synth.pitch=e.value[0];}} defaultValue={[50]} min={0.1} max={1} step={0.1}>
                <Slider.Label>Pitch = {settingsState.synth.pitch}</Slider.Label>
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

        <div class="flex flex-col space-y-3 card preset-filled-surface-300-700 p-2 w-full">
            <h6 class="h6 self-center">Other settings</h6>
            <label class="label">
			    <span class="label-text">Time limit in seconds ({(settingsState.timeLimit/60).toFixed(1)} min)</span>
			    <input class="input" type="number" placeholder="Your prefered time limit" bind:value={settingsState.timeLimit} />
		    </label>

            <label class="label">
			    <span class="label-text">Max questions</span>
			    <input class="input" type="number" placeholder="Your prefered maximum questions" bind:value={settingsState.maxQuestions} />
		    </label>

            <Switch checked={settingsState.customWords} onCheckedChange={(details) => {settingsState.customWords = details.checked;}}>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>Allow custom words</Switch.Label>
                <Switch.HiddenInput />
            </Switch>
        </div>

        {#if hasChanges}
            <button class="btn preset-filled-primary-50-950" onclick={saveSettings}>Save changes</button>
        {/if}
    </div>
{:else}
<p>Loading</p>
{/if}