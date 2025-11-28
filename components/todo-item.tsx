"use client";

import { deleteTodo, Todo, toggleTodo } from "@/app/actions";
import { clsx } from "clsx";
import { useState, useTransition } from "react";
import { twMerge } from "tailwind-merge";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div
      className={twMerge(
        "flex items-center justify-between p-4 mb-3 bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md relative",
        todo.completed && "bg-gray-50"
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          checked={!!todo.completed}
          onChange={(e) => {
            setError(null);
            startTransition(async () => {
              const result = await toggleTodo(todo.id, e.target.checked);
              if (!result.success) {
                setError(result.error || "Failed to update todo");
                // Revert checkbox state on error
                e.target.checked = !!todo.completed;
              }
            });
          }}
          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
        />
        <span
          className={clsx(
            "text-lg text-gray-800 transition-all",
            todo.completed && "text-gray-400 line-through"
          )}
        >
          {todo.text}
        </span>
      </div>

      <button
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await deleteTodo(todo.id);
            if (!result.success) {
              setError(result.error || "Failed to delete todo");
            }
          });
        }}
        disabled={isPending}
        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
        aria-label="Delete todo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
      {error && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-red-50 text-red-600 text-xs rounded-b-xl">
          {error}
        </div>
      )}
    </div>
  );
}
