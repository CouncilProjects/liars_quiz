import {gatherTeams} from "$lib/logic/gatherGameTeams"
export function load(){
    
    const teams = gatherTeams("magic-word");

    return {teams:teams};
}