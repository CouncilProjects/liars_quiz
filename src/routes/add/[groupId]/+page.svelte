
<script lang="ts">
	import { goto } from '$app/navigation';
    import { type team } from '../../+page.svelte';
    import { page } from '$app/state';
	const id = $derived(page.params.groupId);
    let people:string[] = $state([]);
    let form:string=$state('');
    let formErrors = $state('');

    const onclick=()=>{
        if(people.find((eleme)=>eleme==form)){
            formErrors="Name exists";
            setTimeout(()=>{
                formErrors='';
            },2000);
        }
        else {
            people.push(form);
        }
        form='';
    }

    const remove=(removes:string)=>{
        people=people.filter((elem)=>elem!=removes)
    }

    const save=()=>{
        let group:team = [];
        people.forEach((name)=>{
            group.push({name:name,score:"0"});
        });

        localStorage.setItem(`group${id}`,JSON.stringify(group));
        goto('/');
    }
</script>

{#snippet entry(name:string,index:number)}
    <div class="contain-content w-fit items-center" >
        <p>Player {index+1}</p>
        <label class="label">
            <span class="flex flex-row p:2">
                <input class="input bg-gray-400 text-black mr-4 cursor-default" type="text" value={name} readonly onclick={()=>{form=name;remove(name);}}/>
                <button class="btn preset-filled-error-500" onclick={()=>remove(name)}>Remove</button>
            </span>
        </label>
    </div>
{/snippet}



<div class="w-full p-4 lg:w-[70%] preset-filled-secondary-300-700 m-4 space-y-3 min-h-[60%] lg:min-h-[30%] flex flex-col">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-y-2">
            {#each people as name, index}
                {@render entry(name,index)}
            {/each}
        </div>
        <label class="label">
            <span class="label-text {formErrors && 'text-error-500'}">{formErrors?formErrors:'Name'}</span>
            <span class="flex flex-row p:2">
                <input class="input bg-gray-400 text-black mr-4 {formErrors && 'ring-error-500'}" bind:value={form} type="text" />
                <button class="btn preset-filled-primary-500" {onclick} disabled={!form}>Add</button>
            </span>
        </label>
        <button class="btn preset-filled-success-500 self-center" onclick={save}>Add and play</button>
    
</div>