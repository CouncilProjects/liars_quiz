export type entry={
    name:string,
    score:number,
}


export const teamSchemas={
    FAKEOUT:1,
    IMPOSTER:2,
    SAYAGAIN:3
};

export type impostorTeamEntry = entry & {
    impostor:number
}

export type shadyTruthTeamEntry = entry & {
    guesser:number,
    truthTeller:number
}
export const createImposterMember = (name: string, score: number): impostorTeamEntry => {
    return { name: name, score: score, impostor: 0 };
}

export const createSchetchyTruthMember = (name: string, score: number): shadyTruthTeamEntry => {
    return { name: name, score: score, guesser:0,truthTeller:0 };
}


export const addEntryFunctionLookup: Record<string, (name: string, score: number) => any> = {
    "fake-out":createImposterMember,
    "imposter": createImposterMember,
    "say-again": createImposterMember,
    "shady-truth":createSchetchyTruthMember
}


export type team = (impostorTeamEntry|shadyTruthTeamEntry)[]
