import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "todos.db");

let db: Database.Database;

try {
  db = new Database(dbPath);

  // Initialize the database with the todos table
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
} catch (error) {
  console.error("Failed to initialize database:", error);
  throw new Error("Database initialization failed");
}

export default db;
