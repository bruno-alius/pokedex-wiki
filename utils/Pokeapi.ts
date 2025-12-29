import { MainClient, Move } from 'pokenode-ts';


const filterMoveData = async (moveData: Move): Promise<any[]> => {
    let result = [];
    for (let i = 0; i < moveData.past_values.length; i++) {
        let versionUrl = moveData.past_values[i].version_group.url;
        const response = await fetch(versionUrl);
        if (!response.ok) throw new Error(`Failed to fetch ${versionUrl}`);
        const versionData = await response.json();
        console.log("versionData", versionData.generation.url.split('/').filter(Boolean).pop(), "move", moveData.name);
        if (versionData.generation.url.split('/').filter(Boolean).pop() > 4)
            result.push(moveData.past_values[i]);
    }
    return result;
};

const getMoveTypeImgFromMoveName = async (moveName: string): Promise<string> => {
    const api = new MainClient();

    try {
        const moveData = await api.move.getMoveByName(moveName);
        let moveId;

        const filteredMoveData = await filterMoveData(moveData);

        if (filteredMoveData && filteredMoveData.length > 0 && filteredMoveData[filteredMoveData.length - 1].type && filteredMoveData[filteredMoveData.length - 1].type.url) {
            console.log("update", moveName, moveData.past_values);
            moveId = filteredMoveData[filteredMoveData.length - 1].type.url.split('/').filter(Boolean).pop();
        } else {
            moveId = moveData.type.url.split('/').filter(Boolean).pop();
        }
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-iv/platinum/${moveId}.png`;
    } catch (error) {
        console.error(`Error fetching move data for ${moveName}:`, error);
        throw error;
    }
};

export { getMoveTypeImgFromMoveName };