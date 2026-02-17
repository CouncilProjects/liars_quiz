import { goto } from '$app/navigation';
import type { PageLoad } from './$types';
import { type team } from '$lib/types/teamTypes';
export const load: PageLoad = ({ params }) => {
    const storedteam = localStorage.getItem(`say-again-group${params.groupId}`);
    if(!storedteam){
        goto('/say-again');
        return;
    }
    const team:team = JSON.parse(storedteam);
    console.log(team);
    if(!team){
        goto('say-again');
        return;
    }
    
    return {teamData:team};
    
};