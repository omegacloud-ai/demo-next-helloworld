import { AddTodoForm } from "@/components/add-todo-form";
import { TodoItem } from "@/components/todo-item";
import { getTodos, Todo } from "./actions";

export default async function Home() {
  let todos: Todo[] = [];
  try {
    todos = await getTodos();
  } catch (error) {
    console.error("Failed to load todos:", error);
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-500">Keep track of your daily goals</p>
        </header>

        <AddTodoForm />

        <div className="space-y-1">
          {todos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No tasks yet. Add one above!</p>
            </div>
          ) : (
            todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
          )}
        </div>
      </div>
    </main>
  );
}
