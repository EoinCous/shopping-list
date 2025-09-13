import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);

  const baseUrl = "https://shopping-list-uqzm.onrender.com/";
  // const baseUrl = "http://localhost:5173/";

  // Fetch items on load
  useEffect(() => {
    fetch(`${baseUrl}api/items`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  const addItem = (e) => {
    e.preventDefault();
    const item = { name: newItemName, quantity: newItemQty, isChecked: false };

    fetch(`${baseUrl}api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
      .then((res) => res.json())
      .then((savedItem) => {
        setItems([...items, savedItem]);
        setNewItemName("");
        setNewItemQty(1);
      });
  };

  const toggleItem = (id, isChecked) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const updated = { ...item, isChecked: !isChecked };

    fetch(`${baseUrl}api/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then((res) => res.json())
      .then((saved) => {
        setItems(items.map((i) => (i.id === id ? saved : i)));
      });
  };

  const updateItem = (id, name, quantity) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const updated = { ...item, name, quantity };

    fetch(`${baseUrl}api/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then((res) => res.json())
      .then((saved) => {
        setItems(items.map((i) => (i.id === id ? saved : i)));
      });
  };

  const deleteItem = (id) => {
    fetch(`${baseUrl}api/items/${id}`, { method: "DELETE" }).then(() => {
      setItems(items.filter((i) => i.id !== id));
    });
  };

  return (
    <div className="app">
      <h1 className="title">Shopping List</h1>

      <form onSubmit={addItem} className="add-form">
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

      <ul className="list">
        {items.map((item) => (
          <li key={item.id} className={item.isChecked ? "checked" : ""}>
            <input
              type="checkbox"
              checked={item.isChecked}
              onChange={() => toggleItem(item.id, item.isChecked)}
            />
            <span className="item-text">
              {item.name} (x{item.quantity})
            </span>
            <div className="actions">
              <button
                onClick={() =>
                  updateItem(
                    item.id,
                    prompt("New name:", item.name) || item.name,
                    parseInt(prompt("New quantity:", item.quantity)) ||
                      item.quantity
                  )
                }
              >
                Edit
              </button>
              <button onClick={() => deleteItem(item.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;