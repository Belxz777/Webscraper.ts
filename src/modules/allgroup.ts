import fs from 'fs';

 function extractGroupNames(data: Array<{ groupName: string; pairs: Array<any> }>): string[] {
    return data.map(group => group.groupName);
}

export function getGroupNames(){
     const groupsData = fs.readFileSync(`data/example.json`, 'utf8');
const groupNames = extractGroupNames(JSON.parse(groupsData));
return groupNames
}
