import type { team } from '$lib/types/teamTypes';
import type { PageLoad } from './$types';
export const prerender = false;
export const load: PageLoad = ({ params }) => {
    const group = localStorage.getItem(`group${params.groupId}`);
    if (group == null) return { group: null };
    const myGroup:team = JSON.parse(group);
    console.log("LOADING: "+JSON.stringify(myGroup));
    return { group:  myGroup,groupId:params.groupId};
};