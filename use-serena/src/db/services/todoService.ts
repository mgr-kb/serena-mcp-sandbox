import type { Todo, CreateTodoRequest, UpdateTodoRequest, TodoFilter } from '../../types/todo';
import { todoRepository } from '../repositories/todoRepository';

export class TodoService {
  async getAllTodos(): Promise<Todo[]> {
    const todos = await todoRepository.getAll();
    return todos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTodoById(id: string): Promise<Todo | null> {
    return todoRepository.getById(id);
  }

  async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    if (!todoData.title.trim()) {
      throw new Error('Todo title cannot be empty');
    }

    const cleanedData: CreateTodoRequest = {
      ...todoData,
      title: todoData.title.trim(),
      description: todoData.description?.trim() || undefined,
    };

    return todoRepository.create(cleanedData);
  }

  async updateTodo(id: string, updateData: UpdateTodoRequest): Promise<Todo | null> {
    if (updateData.title !== undefined && !updateData.title.trim()) {
      throw new Error('Todo title cannot be empty');
    }

    const cleanedData: UpdateTodoRequest = {
      ...updateData,
    };

    if (updateData.title !== undefined) {
      cleanedData.title = updateData.title.trim();
    }

    if (updateData.description !== undefined) {
      cleanedData.description = updateData.description.trim() || undefined;
    }

    return todoRepository.update(id, cleanedData);
  }

  async deleteTodo(id: string): Promise<boolean> {
    return todoRepository.delete(id);
  }

  async toggleTodoCompleted(id: string): Promise<Todo | null> {
    const todo = await todoRepository.getById(id);
    if (!todo) {
      return null;
    }

    return todoRepository.update(id, { completed: !todo.completed });
  }

  async filterTodos(filter: TodoFilter): Promise<Todo[]> {
    let todos: Todo[];

    switch (filter.type) {
      case 'active':
        todos = await todoRepository.getByCompleted(false);
        break;
      case 'completed':
        todos = await todoRepository.getByCompleted(true);
        break;
      case 'all':
      default:
        todos = await todoRepository.getAll();
        break;
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase().trim();
      todos = todos.filter(todo =>
        todo.title.toLowerCase().includes(query) ||
        (todo.description && todo.description.toLowerCase().includes(query))
      );
    }

    return todos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getActiveTodosCount(): Promise<number> {
    const activeTodos = await todoRepository.getByCompleted(false);
    return activeTodos.length;
  }

  async getCompletedTodosCount(): Promise<number> {
    const completedTodos = await todoRepository.getByCompleted(true);
    return completedTodos.length;
  }

  async clearCompletedTodos(): Promise<number> {
    const completedTodos = await todoRepository.getByCompleted(true);
    let deletedCount = 0;

    for (const todo of completedTodos) {
      const success = await todoRepository.delete(todo.id);
      if (success) {
        deletedCount++;
      }
    }

    return deletedCount;
  }

  async markAllCompleted(completed: boolean = true): Promise<Todo[]> {
    const todos = await todoRepository.getAll();
    const updatedTodos: Todo[] = [];

    for (const todo of todos) {
      if (todo.completed !== completed) {
        const updated = await todoRepository.update(todo.id, { completed });
        if (updated) {
          updatedTodos.push(updated);
        }
      }
    }

    return updatedTodos;
  }
}

export const todoService = new TodoService();