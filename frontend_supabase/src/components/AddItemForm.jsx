import { useState } from "react";
import { addItem as addItemSupabase } from "../supabase/supabaseService";
import "../css/AddItemForm.css";

const AddItemForm = () => {
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemCategory, setNewItemCategory] = useState("Uncategorised");
  const [isOpen, setIsOpen] = useState(true);

  const handleAddItem = async (e) => {
    e.preventDefault();
    await addItemSupabase(newItemName, newItemQty, newItemCategory);
    setNewItemName("");
    setNewItemQty(1);
    setNewItemCategory("Uncategorised");
  };

  return (
    <div className="add-item-container">
      <h3 
        className="add-item-header" 
        onClick={() => setIsOpen(!isOpen)}
      >
        Add Item {isOpen ? "▸" : "▾"}
      </h3>

      {isOpen && (
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
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
          >
            <option value="Uncategorised">Uncategorised</option>
            <option value="Fruit & Veg">Fruit & Veg</option>
            <option value="Meat">Meat</option>
            <option value="Dairy">Dairy</option>
            <option value="Bakery">Bakery</option>
            <option value="Household">Household</option>
            <option value="Frozen">Frozen</option>
          </select>

          <button type="submit">Add</button>
        </form>
      )}
    </div>
  );
};

export default AddItemForm;