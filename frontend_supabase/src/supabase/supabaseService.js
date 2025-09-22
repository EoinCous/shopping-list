import { supabase } from "./supabaseClient";

export const fetchItems = async () => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching items:", error);
    return [];
  }
  return data;
};

export const addItem = async (name, quantity) => {
  // Find current max order
  const { data: maxResult, error: maxError } = await supabase
    .from("items")
    .select("order")
    .order("order", { ascending: false })
    .limit(1);

  if (maxError) throw maxError;

  const maxOrder = maxResult.length > 0 ? maxResult[0].order : 0;

  const { data, error } = await supabase
    .from("items")
    .insert([{ name, quantity, order: maxOrder + 1 }]);

  if (error) throw error;
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

export const updateOrder = async (updates) => {
  // Run updates sequentially
  for (const { id, order } of updates) {
    const { error } = await supabase
      .from("items")
      .update({ order })
      .eq("id", id);

    if (error) throw error;
  }
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