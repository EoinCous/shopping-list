import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import {
  toggleItem as toggleItemSupabase,
  saveUpdate as saveUpdateSupabase,
  deleteItem as deleteItemSupabase,
  updateOrder as updateOrderSupabase,
} from "../supabase/supabaseService";
import "../css/ItemList.css";

const ItemList = ({ items, setItems }) => {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editQty, setEditQty] = useState(1);

  // Handle drag and drop reorder
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Reassign "order" values
    const updated = reordered.map((item, index) => ({
      ...item,
      order: index,
    }));

    setItems(updated);

    // Persist in Supabase
    try {
      await updateOrderSupabase(updated.map(({ id, order }) => ({ id, order })));
    } catch (err) {
      console.error("Error updating order:", err);
    }
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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="shopping-list">
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
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                        <input
                          type="number"
                          min="1"
                          value={editQty}
                          onChange={(e) =>
                            setEditQty(parseInt(e.target.value) || 1)
                          }
                        />
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
    </DragDropContext>
  );
};

export default ItemList;