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

export type magicWordTeamEntry = entry & {
    chief: number,
    darkMage: number,
    fortuneTell:number
}

export const createImposterMember = (name: string, score: number): impostorTeamEntry => {
    return { name: name, score: score, impostor: 0 };
}

export const createSchetchyTruthMember = (name: string, score: number): shadyTruthTeamEntry => {
    return { name: name, score: score, guesser:0,truthTeller:0 };
}

export const createMagicWordMember = (name: string, score: number): magicWordTeamEntry => {
    return { name: name, score: score, chief:0,darkMage:0,fortuneTell:0 };
}


export const addEntryFunctionLookup: Record<string, (name: string, score: number) => any> = {
    "fake-out":createImposterMember,
    "imposter": createImposterMember,
    "say-again": createImposterMember,
    "shady-truth":createSchetchyTruthMember,
    "magic-word":createMagicWordMember
}


export type team = (impostorTeamEntry|shadyTruthTeamEntry|magicWordTeamEntry)[]
