import { gatherTeams } from '$lib/logic/gatherGameTeams';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    const teams = gatherTeams('say-again');
    
    
    return {
        teams:teams
    };
};