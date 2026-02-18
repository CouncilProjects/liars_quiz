import type { PageLoad } from './$types';
import { type shadyTruthTeamEntry } from '$lib/types/teamTypes';
export const load: PageLoad = ({ params }) => {
    const recorded = JSON.parse(localStorage.getItem(`shady-truth-group${params.groupId}`) || '') || null;



    return {
        teams: recorded as shadyTruthTeamEntry[] || null
    };
};