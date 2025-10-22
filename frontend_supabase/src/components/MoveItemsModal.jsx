import { useEffect, useState } from "react";
import { fetchLists } from "../supabase/supabaseService";
import "../css/MoveItemsModal.css";

const MoveItemsModal = ({ onConfirm, onClose, currentListId }) => {
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState("");

  useEffect(() => {
    const loadLists = async () => {
      const allLists = await fetchLists();
      setLists(allLists.filter((l) => l.id !== currentListId));
    };

    loadLists();
  }, [currentListId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Move Checked Items</h3>

        <select
          value={selectedListId}
          onChange={(e) => setSelectedListId(e.target.value)}
        >
          <option value="">Select a list</option>
          {lists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            disabled={!selectedListId}
            onClick={() => {
              onConfirm(selectedListId);
              setSelectedListId("");
            }}
          >
            Move
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveItemsModal;