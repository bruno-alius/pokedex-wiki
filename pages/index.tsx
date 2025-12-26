import { useState } from "react";
import Pokemons from "./pokemons";
import Items from "./items";

export default function Home() {

  const [activeMenu, setActiveMenu] = useState<"pokemons" | "items" | "moves">("pokemons");
  const menus: ("pokemons" | "items")[] = ["pokemons", "items"];

  return <div className="flex flex-col">
    <div className="flex gap- p-2 bg-[black] text-[white]">
      {menus.map((menu) => (
        <div className="cursor-pointer p-2 capitalize" key={menu} style={{fontWeight: menu == activeMenu? 800 : 400}} onClick={() => setActiveMenu(menu)}>{menu}</div>
      ))}
    </div>
    {activeMenu === "pokemons" && <Pokemons />}
    {activeMenu === "items" && <Items />}
  </div>
}
