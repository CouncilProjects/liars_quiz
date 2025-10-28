import { type team } from "$lib/types/teamTypes";
export function load(){
    const teamNumbers=[1,2,3,4,5,6];
    const groups:team[]|null[] = []
    teamNumbers.forEach(element => {
        const stored = localStorage.getItem("group"+element);
        if(stored){
            groups[element-1] = JSON.parse(stored);
        }
        else{
            groups[element-1]=null
        }
    });

    return {groups:groups};
}