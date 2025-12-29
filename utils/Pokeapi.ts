import { MainClient, Move, Pokemon } from 'pokenode-ts';


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
        let typeId;

        const filteredMoveData = await filterMoveData(moveData);

        if (filteredMoveData && filteredMoveData.length > 0 && filteredMoveData[filteredMoveData.length - 1].type && filteredMoveData[filteredMoveData.length - 1].type.url) {
            console.log("update", moveName, moveData.past_values);
            typeId = filteredMoveData[filteredMoveData.length - 1].type.url.split('/').filter(Boolean).pop();
        } else {
            typeId = moveData.type.url.split('/').filter(Boolean).pop();
        }
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-iv/platinum/${typeId}.png`;
    } catch (error) {
        console.error(`Error fetching move data for ${moveName}:`, error);
        throw error;
    }
};


const filterPokemonData = async (pokemonData: Pokemon): Promise<any[]> => {
    let result = [];
    for (let i = 0; i < pokemonData.past_types.length; i++) {
        if ((pokemonData as any).past_types[i].generation.url.split('/').filter(Boolean).pop() as number > 4)
            result.push(pokemonData.past_types[i]);
    }
    return result;
};

const getPokemonTypesImgFromPokemonName = async (pokemonName: string): Promise<string[]> => {
    const api = new MainClient();

    try {
        const pokemonData = await api.pokemon.getPokemonByName(pokemonName);
        let typeIds: number[] = [];

        const filteredPokemonData = await filterPokemonData(pokemonData);

        if (filteredPokemonData && filteredPokemonData.length > 0 && filteredPokemonData[filteredPokemonData.length - 1].types) {
            typeIds = filteredPokemonData[filteredPokemonData.length - 1].types.map((typeInfo: any) => typeInfo.type.url.split('/').filter(Boolean).pop());
        } else {
            typeIds = pokemonData.types.map((typeInfo: any) => typeInfo.type.url.split('/').filter(Boolean).pop());
        }
        return typeIds.map((typeId: number) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-iv/platinum/${typeId}.png`);
    } catch (error) {
        console.error(`Error fetching pokemon data for ${pokemonName}:`, error);
        throw error;
    }
};


export { getMoveTypeImgFromMoveName, getPokemonTypesImgFromPokemonName };