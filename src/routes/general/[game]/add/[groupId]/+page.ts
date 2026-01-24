import type { team } from '$lib/types/teamTypes';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }): { group: team | null } => {
    const group = localStorage.getItem(`${params.game}-group${params.groupId}`);
    if (group == null) return { group: null };
    const retgroup : team = JSON.parse(group);
    return { group: retgroup };

};