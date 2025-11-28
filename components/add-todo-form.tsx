"use client";

import { addTodo } from "@/app/actions";
import { useRef, useState } from "react";

export function AddTodoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        setError(null);
        const result = await addTodo(formData);
        if (result.success) {
          formRef.current?.reset();
        } else {
          setError(result.error || "Failed to add todo");
        }
      }}
      className="mb-8"
    >
      <div className="relative">
        <input
          type="text"
          name="text"
          placeholder="What needs to be done?"
          maxLength={1000}
          className="w-full p-4 pr-16 rounded-xl border-none shadow-sm bg-white text-lg focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
          required
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Add
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
