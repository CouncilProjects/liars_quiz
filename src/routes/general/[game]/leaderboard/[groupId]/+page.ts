import type { team } from '$lib/types/teamTypes';
import type { PageLoad } from './$types';


export const load: PageLoad = ({ params }) => {
    const group = localStorage.getItem(`${params.game}-group${params.groupId}`);
    if (group == null) return { group: [] as team };
    const myGroup:team = JSON.parse(group);
    return { group:  myGroup};
};