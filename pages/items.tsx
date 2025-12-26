import { stringToSlug } from "@/utils/Utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaLink } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

export default function Items() {
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        reloadData();
    }, []);

    const storeItems = (itemsToStore: Item[]) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('items', JSON.stringify(itemsToStore));
        }
    };

    const reloadData = () => {
        if (typeof window !== 'undefined') {
            const storedItems = localStorage.getItem('items');
            const itemsData: Item[] = storedItems ? JSON.parse(storedItems) : [];
            setItems(itemsData);
        }
    };

    return (
        <div className="flex flex-col bg-bg top-0 ">
            <div className="w-full min-h-[100vh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-min p-2 gap-2">
                {items.map((item, index) => (item.editMode ?
                    <div className="card relative" key={"item" + index + "-edit"}>
                        <div className="gap-3 grid grid-cols-2">
                            <div className="flex flex-col col-span-2 gap-1">
                                <label>Item</label>
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => {
                                        const updatedItems = [...items];
                                        updatedItems[index].name = e.target.value;
                                        setItems(updatedItems);
                                    }}
                                />
                            </div>
                            <div className="col-span-2 grid grid-cols-2 gap-2">
                                <button className="bg-[#701f1f] border-[#cf4a4a] border-2 text-[white] hover:brightness-125 transition-all" onClick={() => { reloadData(); }}>Cancelar cambios</button>
                                <button data-blocked={item.name.trim() === ""} className="bg-[#005c39] border-[#4caf50] border-2 text-[white] hover:brightness-125 transition-all" onClick={() => { const updatedItems = [...items]; updatedItems[index].editMode = false; setItems(updatedItems); storeItems(updatedItems); reloadData(); }}>Guardar cambios</button>
                            </div>
                        </div>
                    </div>
                    :
                    <div key={index} className="card !p-2 items-center !gap-0 !flex-row">
                        <div className="flex flex-col w-full">
                            <div className="flex items-center justify-between w-full gap-2">
                                <Link className="w-full" href={`https://pokemondb.net/item/${stringToSlug(item.name)}`} target="_blank" key={item.name}>
                                    <div className="flex gap-2 items-center">
                                        <h5>{item.name}</h5>
                                        <FaLink className="" />
                                                                        
                                    </div>
                                </Link>
                                <MdDelete className=" cursor-pointer opacity-70 hover:opacity-100 transition-all" onClick={() => {
                                    const updatedItems = [...items];
                                    updatedItems.splice(index, 1);
                                    setItems(updatedItems);
                                    storeItems(updatedItems);
                                    reloadData();
                                }} />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="card flex !flex-row gap-1 items-center justify-center cursor-pointer hover:brightness-50 transition-all" onClick={() => setItems(items.concat({ name: "", editMode: true }))}><p>Añadir item</p><FaPlus /></div>
            </div>
        </div>
    );
}