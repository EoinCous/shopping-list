import { useState } from "react";
import { addItem as addItemSupabase } from "../supabase/supabaseService";
import "../css/AddItemForm.css";

const AddItemForm = () => {
    const [newItemName, setNewItemName] = useState("");
    const [newItemQty, setNewItemQty] = useState(1);

    const handleAddItem = async (e) => {
        e.preventDefault();
        await addItemSupabase(newItemName, newItemQty);
        setNewItemName("");
        setNewItemQty(1);
    };

    return (
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
    )
}

export default AddItemForm;