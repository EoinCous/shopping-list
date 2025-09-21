import { useEffect, useState } from "react";
import "./css/App.css";
import {
  fetchItems as fetchItemsSupabase,
  toggleItem as toggleItemSupabase,
  deleteItem as deleteItemSupabase,
  saveUpdate as saveUpdateSupabase
} from "./supabase/supabaseService";
import { supabase } from './supabase/supabaseClient';
import AddItemForm from "./components/AddItemForm";
import BulkActions from "./components/BulkActions";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function App() {
  const [items, setItems] = useState([]);
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

  // Sorting (unchecked first)
  const sortedItems = [...items].sort((a, b) =>
    a.is_checked === b.is_checked ? 0 : a.is_checked ? 1 : -1
  );

  // Handle drag and drop reorder
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(sortedItems);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setItems(reordered);

    // TODO: If you want persistence:
    // Save the new order to Supabase (e.g. store an "order" column)
  };

  return (
    <div className="app">
      <h1 className="title">Shopping List</h1>

      <AddItemForm />
      <BulkActions />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="shopping-list">
          {(provided) => (
            <ul
              className="list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {sortedItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;