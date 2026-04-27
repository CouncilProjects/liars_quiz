import type { hiveMindTeamEntry } from '$lib/types/teamTypes';
import type { PageLoad } from './$types';
export const prerender = false;
export const load: PageLoad = ({ params }) => {
    const group = localStorage.getItem(`hive-mind-group${params.groupId}`);
    if (group == null) return { group: null };
    const myGroup:hiveMindTeamEntry = JSON.parse(group);
    
    return { group:  myGroup,groupId:params.groupId,mode:'normal'};
};