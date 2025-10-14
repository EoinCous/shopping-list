import { supabase } from "./supabaseClient";

/** =========================
 *  ITEMS
 * ========================= */

export const fetchItems = async (listId) => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("list_id", listId)
    .order("category", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching items:", error);
    return [];
  }
  return data;
};

export const addItem = async (name, quantity, category, listId) => {
  const { data, error } = await supabase
    .from("items")
    .insert([{ name, quantity, category, list_id: listId }])
    .select();

  if (error) {
    console.error("Error adding item:", error);
    throw error;
  }
  return data;
};

export const toggleItem = async (id, isChecked) => {
  const { error } = await supabase
    .from("items")
    .update({ is_checked: !isChecked })
    .eq("id", id);

  if (error) {
    console.error("Error toggling item:", error);
    return false;
  }
  return true;
};

export const deleteItem = async (id) => {
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) {
    console.error("Error deleting item:", error);
    return false;
  }
  return true;
};

export const saveUpdate = async (id, name, quantity, category) => {
  const { error } = await supabase
    .from("items")
    .update({ name, quantity, category })
    .eq("id", id);

  if (error) {
    console.error("Error updating item:", error);
    return false;
  }
  return true;
};

export const checkAll = async (listId) => {
  const { error } = await supabase
    .from("items")
    .update({ is_checked: true })
    .eq("list_id", listId)
    .neq("is_checked", true);

  if (error) {
    console.error("Error checking all:", error);
    return false;
  }
  return true;
};

export const uncheckAll = async (listId) => {
  const { error } = await supabase
    .from("items")
    .update({ is_checked: false })
    .eq("list_id", listId)
    .neq("is_checked", false);

  if (error) {
    console.error("Error unchecking all:", error);
    return false;
  }
  return true;
};

export const deleteChecked = async (listId) => {
  const { error } = await supabase
    .from("items")
    .delete()
    .eq("is_checked", true)
    .eq("list_id", listId);

  if (error) {
    console.error("Error deleting checked:", error);
    return false;
  }
  return true;
};


/** =========================
 *  LISTS
 * ========================= */

export const fetchLists = async () => {
  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching lists:", error);
    return [];
  }
  return data;
};

export const addList = async (name) => {
  const { data, error } = await supabase
    .from("lists")
    .insert([{ name }])
    .select();

  if (error) {
    console.error("Error adding list:", error);
    throw error;
  }
  return data;
};

export const deleteList = async (id) => {
  const { error } = await supabase.from("lists").delete().eq("id", id);
  if (error) {
    console.error("Error deleting list:", error);
    return false;
  }
  return true;
};