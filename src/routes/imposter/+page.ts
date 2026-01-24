import { type team } from "$lib/types/teamTypes";
import {gatherTeams} from "$lib/logic/gatherGameTeams"
export function load(){
    
    const teams = gatherTeams("imposter");

    return teams;
}