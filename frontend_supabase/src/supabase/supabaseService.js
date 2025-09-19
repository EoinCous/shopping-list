// supabaseService.js
import { supabase } from './supabaseClient';

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
  const { data, error } = await supabase
    .from("items")
    .insert([{ name, quantity: qty, is_checked: false }])
    .select();

  if (error) {
    console.error("Error adding item:", error);
    return null;
  }
  return data[0];
};

export const toggleItem = async (id, isChecked) => {
  const { data, error } = await supabase
    .from("items")
    .update({ is_checked: !isChecked })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error toggling item:", error);
    return null;
  }
  return data[0];
};

export const deleteItem = async (id) => {
  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting item:", error);
    return false;
  }
  return true;
};

export const saveUpdate = async (id, name, qty) => {
  const { data, error } = await supabase
    .from("items")
    .update({ name, quantity: qty })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating item:", error);
    return null;
  }
  return data[0];
};