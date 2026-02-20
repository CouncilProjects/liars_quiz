export function pickRole(original:any[],groupdata: any[], role: string) {

    console.log("Group " + JSON.stringify(groupdata));
    groupdata.sort((a, b) => b[role] - a[role]);
    console.log("Group after" + JSON.stringify(groupdata));

    let index = Math.floor(Math.random() * (groupdata.length));
    console.log(index);

    if (groupdata[index][role] - groupdata[groupdata.length - 1][role] > 3) {
        index = groupdata.length - 1;
    }
    let name = groupdata[index]['name'];
    groupdata.splice(index, 1);
    return original.findIndex((elem)=>elem.name==name);
}

//for each role it will pick a random candindate, forcing the list picked for that role candincate if it is above the ceil.
export function pickRoles(groupdata: any[], role: string[],randomnessCeil:number=3) {
    const ogCopy = [...groupdata];
    const response:number[]=[];

    role.forEach((role,i)=>{
        groupdata.sort((a, b) => b[role] - a[role]);

        let index = Math.floor(Math.random() * (groupdata.length));
        
        if (groupdata[index][role] - groupdata[groupdata.length - 1][role] > randomnessCeil) {
            index = groupdata.length - 1;
        }
        
        response[i]=ogCopy.findIndex((elem)=>elem.name==groupdata[index].name);
        groupdata.splice(index, 1);
    });
    return response;
}