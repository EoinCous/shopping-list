import { supabase } from "./supabaseClient";

export const fetchItems = async () => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching items:", error);
    return [];
  }
  return data;
};

export const addItem = async (name, qty) => {
  const { error } = await supabase
    .from("items")
    .insert([{ name, quantity: qty, is_checked: false }]);

  if (error) {
    console.error("Error adding item:", error);
    return false;
  }
  return true;
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

export const saveUpdate = async (id, name, qty) => {
  const { error } = await supabase
    .from("items")
    .update({ name, quantity: qty })
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
    .neq("is_checked", true); // only those not checked

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

export const deleteAll = async () => {
  const { error } = await supabase.from("items").delete().not("id", "is", null);
  if (error) {
    console.error("Error deleting all:", error);
    return false;
  }
  return true;
};