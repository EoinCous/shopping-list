import { supabase } from "./supabaseClient";

export const fetchItems = async () => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("category", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching items:", error);
    return [];
  }
  return data;
};

export const addItem = async (name, quantity, category) => {
  const { data, error } = await supabase
    .from("items")
    .insert([{ name, quantity, category }])
    .select(); // return the inserted row

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

export const checkAll = async () => {
  const { error } = await supabase
    .from("items")
    .update({ is_checked: true })
    .neq("is_checked", true);

  if (error) {
    console.error("Error checking all:", error);
    return false;
  }
  return true;
};

export const uncheckAll = async () => {
  const { error } = await supabase
    .from("items")
    .update({ is_checked: false })
    .neq("is_checked", false);

  if (error) {
    console.error("Error unchecking all:", error);
    return false;
  }
  return true;
};

export const deleteChecked = async () => {
  const { error } = await supabase.from("items").delete().eq("is_checked", true);
  if (error) {
    console.error("Error deleting checked:", error);
    return false;
  }
  return true;
};