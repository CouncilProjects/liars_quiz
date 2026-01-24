import { type team } from "$lib/types/teamTypes";
export function gatherTeams(forGame:string){
    const teamNumbers=[1,2,3,4,5,6];
    const groups:(team|null)[] = []
    teamNumbers.forEach(element => {
        const stored = localStorage.getItem(`${forGame}-group`+element);
        if(stored){
            groups[element-1] = JSON.parse(stored);
        }
        else{
            groups[element-1]=null
        }
    });

    return {groups:groups};
}