import type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
} from "../../types/todo";
import { dbManager, DB_CONFIG } from "../config";

interface SerializedTodo {
  id: string;
  title: string;
  description?: string;
  completed: number; // 0 or 1
  priority: 'high' | 'medium' | 'low';
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export class TodoRepository {
  private get storeName() {
    return DB_CONFIG.stores.todos.name;
  }

  async getAll(): Promise<Todo[]> {
    const transaction = await dbManager.getTransaction(
      this.storeName,
      "readonly"
    );
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.getAll();

      request.onsuccess = () => {
        const todos = request.result.map(this.deserializeTodo);
        resolve(todos);
      };

      request.onerror = () => {
        reject(new Error("Failed to get todos"));
      };
    });
  }

  async getById(id: string): Promise<Todo | null> {
    const transaction = await dbManager.getTransaction(
      this.storeName,
      "readonly"
    );
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? this.deserializeTodo(result) : null);
      };

      request.onerror = () => {
        reject(new Error("Failed to get todo"));
      };
    });
  }

  async create(todoData: CreateTodoRequest): Promise<Todo> {
    const todo: Todo = {
      id: crypto.randomUUID(),
      ...todoData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const transaction = await dbManager.getTransaction(
      this.storeName,
      "readwrite"
    );
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.add(this.serializeTodo(todo));

      request.onsuccess = () => {
        resolve(todo);
      };

      request.onerror = () => {
        reject(new Error("Failed to create todo"));
      };
    });
  }

  async update(
    id: string,
    updateData: UpdateTodoRequest
  ): Promise<Todo | null> {
    const existingTodo = await this.getById(id);
    if (!existingTodo) {
      return null;
    }

    const updatedTodo: Todo = {
      ...existingTodo,
      ...updateData,
      updatedAt: new Date(),
    };

    const transaction = await dbManager.getTransaction(
      this.storeName,
      "readwrite"
    );
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.put(this.serializeTodo(updatedTodo));

      request.onsuccess = () => {
        resolve(updatedTodo);
      };

      request.onerror = () => {
        reject(new Error("Failed to update todo"));
      };
    });
  }

  async delete(id: string): Promise<boolean> {
    const transaction = await dbManager.getTransaction(
      this.storeName,
      "readwrite"
    );
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        reject(new Error("Failed to delete todo"));
      };
    });
  }

  async getByCompleted(completed: boolean): Promise<Todo[]> {
    const transaction = await dbManager.getTransaction(
      this.storeName,
      "readonly"
    );
    const store = transaction.objectStore(this.storeName);
    const index = store.index("completed");

    return new Promise((resolve, reject) => {
      const request = index.getAll(IDBKeyRange.only(completed ? 1 : 0));

      request.onsuccess = () => {
        const todos = request.result.map(this.deserializeTodo);
        resolve(todos);
      };

      request.onerror = () => {
        reject(new Error("Failed to get todos by completed status"));
      };
    });
  }

  private serializeTodo(todo: Todo): SerializedTodo {
    return {
      ...todo,
      completed: todo.completed ? 1 : 0,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    };
  }

  private deserializeTodo(data: SerializedTodo): Todo {
    return {
      ...data,
      completed: Boolean(data.completed),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
}

export const todoRepository = new TodoRepository();
