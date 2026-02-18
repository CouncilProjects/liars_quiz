import { gatherTeams } from '$lib/logic/gatherGameTeams';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    const teams = gatherTeams('shady-truth');


    return {
        teams: teams
    };
};