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

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editQty, setEditQty] = useState(1);

  // Fetch on load
  useEffect(() => {
    (async () => {
      const data = await fetchItemsSupabase();
      setItems(data);
    })();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    const newItem = await addItemSupabase(newItemName, newItemQty);
    if (newItem) setItems([...items, newItem]);
    setNewItemName("");
    setNewItemQty(1);
  };

  const handleToggleItem = async (id, isChecked) => {
    const updated = await toggleItemSupabase(id, isChecked);
    if (updated) {
      setItems(items.map((i) => (i.id === id ? updated : i)));
    }
  };

  const handleSaveUpdate = async (id) => {
    const updated = await saveUpdateSupabase(id, editName, editQty);
    if (updated) {
      setItems(items.map((i) => (i.id === id ? updated : i)));
      setEditingId(null);
    }
  };

  const handleDeleteItem = async (id) => {
    const success = await deleteItemSupabase(id);
    if (success) setItems(items.filter((i) => i.id !== id));
  };

  const handleCheckAll = async () => {
    const updated = await checkAllSupabase();
    if (updated) {
      // merge updated rows into state
      const newItems = items.map(
        (i) => updated.find((u) => u.id === i.id) || i
      );
      setItems(newItems);
    }
  };

  const handleUncheckAll = async () => {
    const updated = await uncheckAllSupabase();
    if (updated) {
      const newItems = items.map(
        (i) => updated.find((u) => u.id === i.id) || i
      );
      setItems(newItems);
    }
  };

  const handleDeleteAll = async () => {
    const success = await deleteAllSupabase();
    if (success) setItems([]);
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
                  <button onClick={() => handleSaveUpdate(item.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
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
                    onClick={() => {
                      setEditingId(item.id);
                      setEditName(item.name);
                      setEditQty(item.quantity);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
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