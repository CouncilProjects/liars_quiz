import type { team } from '$lib/types/teamTypes';
import type { PageLoad } from './$types';
export const prerender = false;
export const load: PageLoad = ({ params }) => {
    const group = localStorage.getItem(`fake-out-group${params.groupId}`);
    if (group == null) return { group: null };
    const myGroup:team = JSON.parse(group);
    
    const settings = localStorage.getItem('fake-out-settings');
    if (settings) {
        const parsed = JSON.parse(settings);
            return { 
                group:  myGroup,
                groupId:params.groupId,
                mode:parsed.mode,
                rate:parsed.sRate,
                pitch:parsed.sPitch};
    }
    
    return { group:  myGroup,groupId:params.groupId,mode:'normal'};
};