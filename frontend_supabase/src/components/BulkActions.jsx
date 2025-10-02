import {
  checkAll as checkAllSupabase,
  uncheckAll as uncheckAllSupabase,
  deleteAll as deleteAllSupabase
} from "../supabase/supabaseService";
import "../css/BulkActions.css";

const BulkActions = ({ checkedHidden, setCheckedHidden }) => {
    const handleCheckAll = async () => {
        await checkAllSupabase();
    };

    const handleUncheckAll = async () => {
        await uncheckAllSupabase();
    };

    const handleHideChecked = () => {
        setCheckedHidden(!checkedHidden);
    };

    const handleDeleteAll = async () => {
        await deleteAllSupabase();
    };

    return (
        <div className="bulk-actions">
        <button onClick={handleCheckAll}>Check All</button>
        <button onClick={handleUncheckAll}>Uncheck All</button>
        <button onClick={handleHideChecked}>
            {checkedHidden ? "Show Checked" : "Hide Checked"}
        </button>
        <button onClick={handleDeleteAll}>Delete All</button>
        </div>
    );
};

export default BulkActions;