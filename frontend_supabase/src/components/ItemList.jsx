import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import {
  toggleItem as toggleItemSupabase,
  saveUpdate as saveUpdateSupabase,
  deleteItem as deleteItemSupabase
} from "../supabase/supabaseService";
import confetti from "canvas-confetti";
import CelebrationBanner from "./CelebrationBanner";
import "../css/ItemList.css";

const ItemList = ({ items, setItems }) => {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editQty, setEditQty] = useState(1);
  const [editCategory, setEditCategory] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (items.length > 0 && items.every((i) => i.is_checked)) {
      // Fire confetti
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });

      // Show banner
      setShowBanner(true);
    }
  }, [items]);

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      // Reorder inside same category
      const reordered = Array.from(
        items.filter((i) => i.category === source.droppableId)
      );
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
    } else {
      // Move item between categories
      const movedItem = items.find((i) => i.id === result.draggableId);
      const updatedItem = { ...movedItem, category: destination.droppableId };

      setItems((prev) =>
        prev.map((i) => (i.id === movedItem.id ? updatedItem : i))
      );

      try {
        await saveUpdateSupabase(movedItem.id, updatedItem.name, updatedItem.quantity, destination.droppableId);
      } catch (err) {
        console.error("Error updating item category:", err);
      }
    }
  };

  const handleToggleItem = async (id, isChecked) => {
    await toggleItemSupabase(id, isChecked);
  };

  const handleSaveUpdate = async (id) => {
    await saveUpdateSupabase(id, editName, editQty, editCategory);
    setEditingId(null);
  };

  const handleDeleteItem = async (id) => {
    await deleteItemSupabase(id);
  };

  const toggleCollapse = (category) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category || "Uncategorised"]) acc[item.category || "Uncategorised"] = [];
    acc[item.category || "Uncategorised"].push(item);
    return acc;
  }, {});

  return (
    <>
      {showBanner && <CelebrationBanner onClose={() => setShowBanner(false)} />}
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="category-group">
            <h2 
              className="category-header" 
              onClick={() => toggleCollapse(category)}
            >
              {category} {collapsedCategories[category] ? "▸" : "▾"}
            </h2>
            
            {!collapsedCategories[category] && (
            <Droppable droppableId={category}>
            {(provided) => (
              <ul
                className="list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={item.is_checked ? "checked" : ""}
                      >
                        {editingId === item.id ? (
                          <div className="editing">
                            <div className="edit-fields">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                              />

                              <div className="edit-subfields">
                                <input
                                  type="number"
                                  min="1"
                                  value={editQty}
                                  onChange={(e) => setEditQty(parseInt(e.target.value) || 1)}
                                />
                                <select
                                  value={editCategory}
                                  onChange={(e) => setEditCategory(e.target.value)}
                                >
                                  <option value="Uncategorised">Uncategorised</option>
                                  <option value="Fruit & Veg">Fruit & Veg</option>
                                  <option value="Meat">Meat</option>
                                  <option value="Dairy">Dairy</option>
                                  <option value="Bakery">Bakery</option>
                                  <option value="Household">Household</option>
                                  <option value="Frozen">Frozen</option>
                                </select>
                              </div>
                            </div>
                            <div className="editing-actions">
                              <button
                                className="save-btn"
                                onClick={() => handleSaveUpdate(item.id)}
                              >
                                Save
                              </button>
                              <button
                                className="cancel-btn"
                                onClick={() => setEditingId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <input
                              type="checkbox"
                              checked={item.is_checked}
                              onChange={() =>
                                handleToggleItem(item.id, item.is_checked)
                              }
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
                                  setEditCategory(item.category || "Uncategorised");
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
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
            )}
        </div>
        ))}
      </DragDropContext>
    </>
    
  );
};

export default ItemList;