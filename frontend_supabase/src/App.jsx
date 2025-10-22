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
import TopBar from "./components/TopBar";

function App() {
  const [items, setItems] = useState([]);
  const [checkedHidden, setCheckedHidden] = useState(false);
  const [currentList, setCurrentList] = useState(null);

  const visibleItems = checkedHidden 
    ? items.filter((item) => !item.is_checked) 
    : items;

    // Initial list setup
  useEffect(() => {
    (async () => {
      const lists = await fetchListsSupabase();
      let activeList = lists[0];
      if (!activeList) {
        const [newList] = await addListSupabase("Default List");
        activeList = newList;
      }
      setCurrentList(activeList);
    })();
  }, []);

  useEffect(() => {
    if (!currentList) return; // Wait until a list is loaded

    (async () => {
      const data = await fetchItemsSupabase(currentList.id);
      setItems(data);
    })();

    // Realtime subscription for the current list
    const channel = supabase
      .channel(`items-changes-${currentList.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        (payload) => {
          setItems((prev) => {
            switch (payload.eventType) {
              case "INSERT":
                return payload.new.list_id === currentList.id
                  ? [...prev, payload.new]
                  : prev;

              case "UPDATE":
                if (
                  payload.old.list_id === currentList.id &&
                  payload.new.list_id !== currentList.id
                ) {
                  return prev.filter((i) => i.id !== payload.new.id);
                }
                if (
                  payload.old.list_id !== currentList.id &&
                  payload.new.list_id === currentList.id
                ) {
                  return [...prev, payload.new];
                }
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
  }, [currentList]);

  return (
    <div className="app">
      <TopBar 
        currentList={currentList} 
        setCurrentList={setCurrentList} 
        setItems={setItems}
      />

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