import { useEffect, useState } from "react";
import "./App.css";
import {
  fetchItems as fetchItemsSupabase,
  addItem as addItemSupabase,
  toggleItem as toggleItemSupabase,
  deleteItem as deleteItemSupabase,
  saveUpdate as saveUpdateSupabase,
  checkAll as checkAllSupabase,
  uncheckAll as uncheckAllSupabase,
  deleteAll as deleteAllSupabase
} from "./supabase/supabaseService";
import { supabase } from './supabase/supabaseClient';

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editQty, setEditQty] = useState(1);

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

  const handleAddItem = async (e) => {
    e.preventDefault();
    await addItemSupabase(newItemName, newItemQty);
    setNewItemName("");
    setNewItemQty(1);
  };

  const handleToggleItem = async (id, isChecked) => {
    await toggleItemSupabase(id, isChecked);
  };

  const handleSaveUpdate = async (id) => {
    await saveUpdateSupabase(id, editName, editQty);
    setEditingId(null);
  };

  const handleDeleteItem = async (id) => {
    await deleteItemSupabase(id);
  };

  const handleCheckAll = async () => {
    await checkAllSupabase();
  };

  const handleUncheckAll = async () => {
    await uncheckAllSupabase();
  };

  const handleDeleteAll = async () => {
    await deleteAllSupabase();
  };

  // Sorting (unchecked first)
  const sortedItems = [...items].sort((a, b) =>
    a.is_checked === b.is_checked ? 0 : a.is_checked ? 1 : -1
  );

  return (
    <div className="app">
      <h1 className="title">Shopping List</h1>

      <form onSubmit={handleAddItem} className="add-form">
        <input
          type="text"
          placeholder="Item name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          value={newItemQty}
          onChange={(e) => setNewItemQty(parseInt(e.target.value))}
          required
        />
        <button type="submit">Add</button>
      </form>

      <div className="bulk-actions">
        <button onClick={handleCheckAll}>Check All</button>
        <button onClick={handleUncheckAll}>Uncheck All</button>
        <button onClick={handleDeleteAll}>Delete All</button>
      </div>

      <ul className="list">
        {sortedItems.map((item) => (
          <li key={item.id} className={item.is_checked ? "checked" : ""}>
            {editingId === item.id ? (
              <div className="editing">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  type="number"
                  min="1"
                  value={editQty}
                  onChange={(e) => setEditQty(parseInt(e.target.value))}
                />
                <div className="editing-actions">
                  <button className="save-btn" onClick={() => handleSaveUpdate(item.id)}>Save</button>
                  <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={item.is_checked}
                  onChange={() => handleToggleItem(item.id, item.is_checked)}
                />
                <span className="item-text">
                  {item.name} (x{item.quantity})
                </span>
                <div className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingId(item.id);
                      setEditName(item.name);
                      setEditQty(item.quantity);
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;