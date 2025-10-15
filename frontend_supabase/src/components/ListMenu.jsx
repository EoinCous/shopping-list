import { useEffect, useState } from "react";
import "../css/ListMenu.css";
import { 
    fetchLists as fetchListsSupabase,
    addList as addListSupabase,
    deleteList as deleteListSupabase
} from "../supabase/supabaseService";
import { FaTrash } from "react-icons/fa";

const ListMenu = ({ 
  currentList, 
  onSelect, 
  onClose,
}) => {
  const [newListName, setNewListName] = useState("");
  const [adding, setAdding] = useState(false);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    refreshLists();
  }, []);

  const refreshLists = async () => {
    const fetchedLists = await fetchListsSupabase();
    setLists(fetchedLists);
  };

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    await addListSupabase(newListName.trim());
    setNewListName("");
    setAdding(false);
    refreshLists();
  };

  const handleDeleteList = async (listId) => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      await deleteListSupabase(listId);
      refreshLists();
    }
  };

  return (
    <div className="list-menu-overlay" onClick={onClose}>
      <div className="list-menu" onClick={(e) => e.stopPropagation()}>
        <div className="menu-header">
          <h3>My Lists</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="list-menu-content">
          <ul className="list-list">
            {lists.map((list) => (
              <li 
                key={list.id} 
                className={list.id === currentList?.id ? "active" : ""}
                onClick={() => onSelect(list)}
              >
                <span>{list.name}</span>
                {list.id !== currentList?.id && (
                  <button 
                    className="delete-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteList(list.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="menu-footer">
          {adding ? (
            <form onSubmit={handleAddList} className="add-list-form">
              <input 
                type="text"
                placeholder="List name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                autoFocus
              />
              <button type="submit">Add</button>
            </form>
          ) : (
            <button className="add-list-btn" onClick={() => setAdding(true)}>
              + Add New List
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListMenu;