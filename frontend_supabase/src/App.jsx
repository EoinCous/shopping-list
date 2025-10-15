import { useEffect, useState } from "react";
import "./css/App.css";
import {
  fetchItems as fetchItemsSupabase,
  fetchLists as fetchListsSupabase,
  addList as addListSupabase
} from "./supabase/supabaseService";
import { supabase } from './supabase/supabaseClient';
import AddItemForm from "./components/AddItemForm";
import BulkActions from "./components/BulkActions";
import ItemList from "./components/ItemList";
import ListMenu from "./components/ListMenu";

function App() {
  const [items, setItems] = useState([]);
  const [checkedHidden, setCheckedHidden] = useState(false);
  const [currentList, setCurrentList] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleItems = checkedHidden 
    ? items.filter((item) => !item.is_checked) 
    : items;

  // Fetch lists and items on load
  useEffect(() => {
    (async () => {
      const lists = await fetchListsSupabase();

      let activeList = lists[0];
      if (!activeList) {
        const [newList] = await addListSupabase("Default List");
        activeList = newList;
      }

      setCurrentList(activeList);
      
      const data = await fetchItemsSupabase(activeList.id);
      setItems(data);
    })();

    // Realtime subscription
    const channel = supabase
      .channel("items-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        (payload) => {
          setItems((prev) => {
            switch (payload.eventType) {
              case "INSERT":
                return [...prev, payload.new];
              case "UPDATE":
                return prev.map((i) =>
                  i.id === payload.new.id ? payload.new : i
                );
              case "DELETE":
                return prev.filter((i) => i.id !== payload.old.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
    <div className="app">
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

      {currentList && (
        <>
          <AddItemForm listId={currentList.id} />
          <BulkActions 
            checkedHidden={checkedHidden} 
            setCheckedHidden={setCheckedHidden}
            listId={currentList.id}
          />
          <ItemList
            items={visibleItems}
            setItems={setItems}
          />
        </>
      )}
    </div>
  );
}

export default App;