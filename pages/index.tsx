import { stringToSlug } from "@/utils/Utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaLink } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

export default function Home() {

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [activeTag, setActiveTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  // const examplePokemons: Pokemon[] = [
  //   { name: "Pikachu", alias: "Electric Mouse", moves: ["Thunder Shock", "Quick Attack"] },
  //   { name: "Charmander", alias: "Lizard", moves: ["Ember", "Scratch"] },
  //   { name: "Bulbasaur", alias: "Seed", moves: ["Vine Whip", "Tackle"] },
  // ];

  useEffect(() => {
    reloadData();
  }, []);

  const storePokemons = (pokemonsToStore: Pokemon[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokemon', JSON.stringify(pokemonsToStore));
    }
  };

  const reloadData = () => {
    if (typeof window !== 'undefined') {
      const storedPokemons = localStorage.getItem('pokemon');
      const pokemonData : Pokemon[]= storedPokemons ? JSON.parse(storedPokemons) : [];
      setPokemons(pokemonData);

      const storedTags = pokemonData.map(pokemon => pokemon.tags.split(",").map(tag => tag.trim())).flat().filter((tag, index, self) => self.indexOf(tag) === index && tag !== "");
      if (storedTags) setTags(storedTags); else setTags([]);
      if (activeTag !== "" && !storedTags.includes(activeTag)) {
        setActiveTag("");
      }
    }
  };

  const isPokemonBlocked = (pokemon: Pokemon) => {
    return pokemon.name.trim() === "" || pokemon.alias.trim() === "" || pokemon.moves.some(move => move.trim() === "");
  }

  const isPokemonMoveEmpty = (pokemon: Pokemon) => {
    return pokemon.moves.some(move => move.trim() === "");
  }


  return (
    <div className="flex flex-col bg-bg top-0 ">
      <div className="flex gap-2 p-2 gap-2">
        {([""].concat(tags)).map((tag, tagIndex) => (
          <div key={"tag-filter-" + tagIndex} className={`px-2 py-1 rounded cursor-pointer hover:brightness-125 border-2 transition-all ${activeTag === tag ? "bg-[black] text-[white] border-[darkgray]" : "bg-option border-option-border"}`} onClick={() => {
            setActiveTag(tag);
            reloadData();
          }}>{tag || "Todos"}</div>
        ))}
      </div>
      <div className="w-full min-h-[100vh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 auto-rows-min p-2 gap-2">
        {pokemons.filter(pokemon => activeTag === "" || pokemon.tags.split(",").map(tag => tag.trim()).includes(activeTag)).map((pokemon, pokemonIndex) => (pokemon.editMode ?
          <div className="card relative" key={"pokemon" + pokemonIndex + "-edit"}>
            <div className="gap-3 grid grid-cols-2">
              <div className="flex flex-col gap-1">
                <label>Pokemon</label>
                <input
                  type="text"
                  value={pokemon.name}
                  onChange={(e) => {
                    const updatedPokemons = [...pokemons];
                    updatedPokemons[pokemonIndex].name = e.target.value;
                    setPokemons(updatedPokemons);
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="">Alias</label>
                <input type="text" value={pokemon.alias}
                  onChange={(e) => {
                    const updatedPokemons = [...pokemons];
                    updatedPokemons[pokemonIndex].alias = e.target.value;
                    setPokemons(updatedPokemons);
                  }}
                />
              </div>
              {pokemon.moves.map((move, moveIndex) => (
                <div className="flex gap-1 justify-center items-end" key={"pokemon" + pokemonIndex + "move" + moveIndex + "-edit"}>
                  <div className="flex flex-col gap-1 flex-1" >
                    <label htmlFor="">Movimiento {moveIndex + 1}</label>
                    <input type="text" value={move}
                      onChange={(e) => {
                        const updatedPokemons = [...pokemons];
                        updatedPokemons[pokemonIndex].moves[moveIndex] = e.target.value;
                        setPokemons(updatedPokemons);
                      }}
                    />
                  </div>
                  <MdDelete className="transition-all h-[36px] text-[24px] cursor-pointer opacity-70 hover:opacity-100"
                    onClick={() => {
                      const updatedPokemons = [...pokemons];
                      updatedPokemons[pokemonIndex].moves.splice(moveIndex, 1);
                      setPokemons(updatedPokemons);
                    }}
                  />
                </div>
              ))}
              <button data-blocked={isPokemonMoveEmpty(pokemon)} className="bg-[black] text-[white] h-[56px] flex gap-1 items-center justify-center hover:brightness-150 transition-all" onClick={() => { const updatedPokemons = [...pokemons]; updatedPokemons[pokemonIndex].moves.push(""); setPokemons(updatedPokemons) }}>Añadir movimiento <FaPlus /></button>
              <div className="flex flex-col gap-1 col-span-2">
                <label htmlFor="">Tags</label>
                <input type="text" value={pokemon.tags}
                  onChange={(e) => {
                    const updatedPokemons = [...pokemons];
                    updatedPokemons[pokemonIndex].tags = e.target.value;
                    setPokemons(updatedPokemons);
                  }}
                />
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-2">
                <button className="bg-[#701f1f] border-[#cf4a4a] border-2 text-[white] hover:brightness-125 transition-all" onClick={() => { reloadData(); }}>Cancelar cambios</button>
                <button data-blocked={isPokemonBlocked(pokemon)} className="bg-[#005c39] border-[#4caf50] border-2 text-[white] hover:brightness-125 transition-all" onClick={() => { const updatedPokemons = [...pokemons]; updatedPokemons[pokemonIndex].editMode = false; setPokemons(updatedPokemons); storePokemons(updatedPokemons); reloadData(); }}>Guardar cambios</button>
              </div>
            </div>
          </div>
          :
          <div key={pokemonIndex} className="card !pl-0 items-center !gap-0 !flex-row">
            {/* <div className="absolute top-2 right-2 cursor-pointer" onClick={() => {
              const updatedPokemons = [...pokemons];
              updatedPokemons[pokemonIndex].editMode = true;
              setPokemons(updatedPokemons);
            }}><RiEdit2Fill className="text-[1.5em]" /></div> */}
            <img className="object-cover h-[80px]" src={`https://img.pokemondb.net/sprites/diamond-pearl/normal/${stringToSlug(pokemon.name)}.png`} alt="" />
            <div className="flex flex-col w-full min-h-[80px] h-full justify-between">
              <div className="flex justify-center w-full gap-2">
                <Link href={`https://pokemondb.net/pokedex/${stringToSlug(pokemon.name)}`} target="_blank" key={pokemon.name}>
                  <div className="mb-2 flex gap-2 items-center">
                    <h5>{pokemon.alias} ({pokemon.name})</h5>
                    <FaLink className="" />
                  </div>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {pokemon.moves.map((move) => (
                  <Link href={`https://pokemondb.net/move/${stringToSlug(move)}`} target="_blank" key={move}>
                    <div className="transition-all cursor-pointer hover:brightness-110 bg-option border-option-border border-2 flex justify-between items-center rounded p-1 px-2" key={move}>{move}<FaLink className="text-[0.8em]" /></div>
                  </Link>
                ))}
              </div>
              <div className="flex w-full items-center gap-2 justify-between pt-4">
                <MdDelete className=" cursor-pointer opacity-70 hover:opacity-100 transition-all" onClick={() => {
                  const updatedPokemons = [...pokemons];
                  updatedPokemons.splice(pokemonIndex, 1);
                  setPokemons(updatedPokemons);
                  storePokemons(updatedPokemons);
                  reloadData();
                }} />
                <RiEdit2Fill
                  className="cursor-pointer opacity-70 hover:opacity-100 transition-all"
                  onClick={() => {
                    const updatedPokemons = [...pokemons];
                    updatedPokemons[pokemonIndex].editMode = true;
                    setPokemons(updatedPokemons);
                  }} />
              </div>
            </div>
          </div>
        ))}
        <div className="card flex !flex-row gap-1 items-center justify-center cursor-pointer hover:brightness-50 transition-all" onClick={() => setPokemons(pokemons.concat({ name: "", alias: "", moves: [], tags: activeTag, editMode: true }))}><p>Añadir pokemon</p><FaPlus /></div>
      </div>
    </div>
  );
}
