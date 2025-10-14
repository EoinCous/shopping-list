import {
  checkAll as checkAllSupabase,
  uncheckAll as uncheckAllSupabase,
  deleteChecked as deleteCheckedSupabase
} from "../supabase/supabaseService";
import "../css/BulkActions.css";

const BulkActions = ({ checkedHidden, setCheckedHidden, listId }) => {
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

    return (
        <div className="bulk-actions">
        <button onClick={handleCheckAll}>Check All</button>
        <button onClick={handleUncheckAll}>Uncheck All</button>
        <button onClick={handleHideChecked}>
            {checkedHidden ? "Show Checked" : "Hide Checked"}
        </button>
        <button onClick={handleDeleteChecked}>Delete Checked</button>
        </div>
    );
};

export default BulkActions;