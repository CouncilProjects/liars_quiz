
<script lang="ts">
	import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import {type team,type entry} from "$lib/types/teamTypes.js"
    import {ChevronDown,ChevronUp} from "@lucide/svelte"
	import type { PageProps } from './$types';
	const id = $derived(page.params.groupId);
    const game = $derived(page.params.game);
    const isSmall=$derived(window.innerWidth<640);
    let people:team = $state([]);
    $inspect(people);
    let form:entry=$state({name:'',score:0,impostor:0});
    let formErrors = $state('');

    let {params,data}:PageProps = $props();

    
    if(data.group!=null){
        people = data.group;
    }

    const moveUp=(index:number)=>{
        if(index==0) return;
        [people[index],people[index-1]] = [people[index-1],people[index]]
    }

    const moveDown=(index:number)=>{
        if(index==people.length-1) return;
        [people[index],people[index+1]] = [people[index+1],people[index]]
    }

    const onclick=()=>{
        if(people.find((eleme)=>eleme.name==form.name)){
            formErrors="Name exists";
            setTimeout(()=>{
                formErrors='';
            },2000);
        }
        else {
            people.push({name:form.name,score:form.score,impostor:form.impostor});
        }
        form.name='';
        form.score=0;
        form.impostor=0;
    }

    const remove=(removes:string)=>{
        people=people.filter((elem)=>elem.name!=removes)
    }

    const save=()=>{
        if(people.length>0)
            localStorage.setItem(`${game}-group${id}`,JSON.stringify(people));
        else
            localStorage.removeItem(`${game}-group${id}`);
        goto(`/${game}`);
    }
</script>

{#snippet entry(player:entry,index:number)}
    <div class="contain-content w-fit items-center" >
        <span class="flex flex-row">
             <p>Player {index+1}</p>
             <span class="flex flex-col">
                <button onclick={()=>moveUp(index)}><ChevronUp size=16/></button>
                <button onclick={()=>moveDown(index)}><ChevronDown size=16/></button>
             </span>
        </span>
        <label class="label">
            <span class="flex flex-row p:2">
                <input class="input bg-gray-400 text-black mr-4 cursor-default" type="text" value={!isSmall?player.name+" Score: "+player.score:player.name} readonly onclick={()=>{form=player;remove(player.name);}}/>
                <button class="btn preset-filled-error-500" onclick={()=>remove(player.name)}>Remove</button>
            </span>
        </label>
    </div>
{/snippet}



<div class="w-full p-4 lg:w-[70%] preset-filled-surface-300-700 m-4 space-y-3 min-h-[60%] lg:min-h-[30%] flex flex-col">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-y-2">
            {#each people as singleEntry, index}
                {@render entry(singleEntry,index)}
            {/each}
        </div>
        <span class="flex flex-col md:flex-row p-2 space-x-1">
            <label class="label flex-8">
                <span class="label-text {formErrors && 'text-error-500'}">{formErrors?formErrors:'Name'}</span>
                <input class="input bg-surface-400-600 {formErrors && 'ring-error-500'} flex-8" bind:value={form.name} type="text" />
            </label>
                    
            <label class="label flex-2">
                <span class="label-text {formErrors && 'text-error-500'}">{formErrors?formErrors:'Score'}</span>
                <span class="flex flex-row">
                    <input class="input bg-surface-400-600 {formErrors && 'ring-error-500'} flex-2 mr-1" bind:value={form.score} type="text" />
                <button class="btn preset-tonal-primary" {onclick} disabled={!form}>Add</button>
                </span>
            </label>
            
        </span>
        <span class="flex flex-row self-center space-x-3">
            <button class="btn preset-filled-warning-400-600 self-center" onclick={()=>{people=[];}}>Clear All</button>
        <button class="btn preset-filled-success-400-600 self-center" onclick={save}>Save</button>
        </span>
    
</div>