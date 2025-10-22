import {
  checkAll as checkAllSupabase,
  uncheckAll as uncheckAllSupabase,
  deleteChecked as deleteCheckedSupabase,
  moveItemsToList as moveItemsToListSupabase,
} from "../supabase/supabaseService";
import "../css/BulkActions.css";
import MoveItemsModal from "../components/MoveItemsModal";
import { useState } from "react";

const BulkActions = ({ checkedHidden, setCheckedHidden, listId }) => {
    const [showMoveModal, setShowMoveModal] = useState(false);

    const handleCheckAll = async () => {
        await checkAllSupabase(listId);
    };

    const handleUncheckAll = async () => {
        await uncheckAllSupabase(listId);
    };

    const handleHideChecked = () => {
        setCheckedHidden(!checkedHidden);
    };

    const handleDeleteChecked = async () => {
        await deleteCheckedSupabase(listId);
    };

    const handleMoveChecked = async (targetListId) => {
        try {
            await moveItemsToListSupabase(listId, targetListId);
        } catch (err) {
            console.error("Error moving items:", err);
        } finally {
            setShowMoveModal(false);
        }
    };

  return (
    <div>
        <div className="bulk-actions">
        <button onClick={handleCheckAll}>Check All</button>
        <button onClick={handleUncheckAll}>Uncheck All</button>
        <button onClick={handleHideChecked}>
            {checkedHidden ? "Show Checked" : "Hide Checked"}
        </button>
        <button onClick={() => setShowMoveModal(true)}>Move Checked</button>
        <button onClick={handleDeleteChecked}>Delete Checked</button>
        </div>

        {showMoveModal && (
            <MoveItemsModal
                currentListId={listId}
                onConfirm={handleMoveChecked}
                onClose={() => setShowMoveModal(false)}
            />
        )}
    </div>
  );
};

export default BulkActions;