"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface Todo {
  id: number;
  text: string;
  completed: number; // SQLite uses 0/1 for booleans
  created_at: string;
}

const MAX_TEXT_LENGTH = 50;

export async function getTodos(): Promise<Todo[]> {
  try {
    const stmt = db.prepare("SELECT * FROM todos ORDER BY created_at DESC");
    const results = stmt.all();
    return results as Todo[];
  } catch (error) {
    console.error("Failed to get todos:", error);
    return [];
  }
}

export async function addTodo(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const text = formData.get("text");
    if (!text || typeof text !== "string") {
      return { success: false, error: "Invalid input" };
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return { success: false, error: "Text cannot be empty" };
    }

    if (trimmedText.length > MAX_TEXT_LENGTH) {
      return { success: false, error: `Text must be less than ${MAX_TEXT_LENGTH} characters` };
    }

    const stmt = db.prepare("INSERT INTO todos (text) VALUES (?)");
    stmt.run(trimmedText);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to add todo:", error);
    return { success: false, error: "Failed to add todo" };
  }
}

export async function toggleTodo(
  id: number,
  completed: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    if (typeof id !== "number" || id <= 0) {
      return { success: false, error: "Invalid todo ID" };
    }

    const stmt = db.prepare("UPDATE todos SET completed = ? WHERE id = ?");
    const result = stmt.run(completed ? 1 : 0, id);

    if (result.changes === 0) {
      return { success: false, error: "Todo not found" };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle todo:", error);
    return { success: false, error: "Failed to update todo" };
  }
}

export async function deleteTodo(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    if (typeof id !== "number" || id <= 0) {
      return { success: false, error: "Invalid todo ID" };
    }

    const stmt = db.prepare("DELETE FROM todos WHERE id = ?");
    const result = stmt.run(id);

    if (result.changes === 0) {
      return { success: false, error: "Todo not found" };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete todo:", error);
    return { success: false, error: "Failed to delete todo" };
  }
}
