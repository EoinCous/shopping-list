import { useEffect, useState } from "react";
import "./css/App.css";
import {
  fetchItems as fetchItemsSupabase
} from "./supabase/supabaseService";
import { supabase } from './supabase/supabaseClient';
import AddItemForm from "./components/AddItemForm";
import BulkActions from "./components/BulkActions";
import ItemList from "./components/ItemList";

function App() {
  const [items, setItems] = useState([]);
  const [checkedHidden, setCheckedHidden] = useState(false);

  const visibleItems = checkedHidden 
    ? items.filter((item) => !item.is_checked) 
    : items;

  // Fetch items on load
  useEffect(() => {
    (async () => {
      const data = await fetchItemsSupabase();
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

  return (
    <div className="app">
      <h1 className="title">Shopping List</h1>

      <AddItemForm />
      <BulkActions 
        checkedHidden={checkedHidden} 
        setCheckedHidden={setCheckedHidden} 
      />

      <ItemList
        items={visibleItems}
        setItems={setItems}
      />
    </div>
  );
}

export default App;