import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    const group = localStorage.getItem(`group${params.groupId}`);
    if (group == null) return { group: null };
    return { group: JSON.parse(group) };
};
