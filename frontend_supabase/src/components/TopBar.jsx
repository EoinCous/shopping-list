import { useState } from "react";
import ListMenu from "../components/ListMenu";
import { fetchItems as fetchItemsSupabase } from "../supabase/supabaseService";
  

const TopBar = ({ currentList, setCurrentList, setItems }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleOnSelect = async (list) => {
        if(currentList.id === list.id){
        setMenuOpen(false);
        return;
        } 
        setCurrentList(list); 
        setItems([])
        setMenuOpen(false);

        const data = await fetchItemsSupabase(list.id);
        setItems(data);
    }

    return (
        <>
            <div className="top-bar">
                <h1 className="title">{currentList?.name || "Shopping List"}</h1>
                <button className="burger" onClick={() => setMenuOpen(true)}>☰</button>
            </div>

            {menuOpen && (
                <ListMenu
                    currentList={currentList}
                    onSelect={(list) => handleOnSelect(list)}
                    onClose={() => setMenuOpen(false)}
                />
            )}
        </>
        
    )
}

export default TopBar;