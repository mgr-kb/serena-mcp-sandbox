import { useState, useEffect, useCallback } from 'react';
import type { Todo, CreateTodoRequest, UpdateTodoRequest, TodoFilter } from '../types/todo';
import { todoService } from '../db/services/todoService';

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filter: TodoFilter;
  activeTodosCount: number;
  completedTodosCount: number;
  setFilter: (filter: TodoFilter) => void;
  addTodo: (todoData: CreateTodoRequest) => Promise<void>;
  updateTodo: (id: string, updateData: UpdateTodoRequest) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodoCompleted: (id: string) => Promise<void>;
  clearCompletedTodos: () => Promise<void>;
  markAllCompleted: (completed?: boolean) => Promise<void>;
  refreshTodos: () => Promise<void>;
}

export const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>({ type: 'all' });
  const [activeTodosCount, setActiveTodosCount] = useState(0);
  const [completedTodosCount, setCompletedTodosCount] = useState(0);

  const handleError = useCallback((err: unknown, action: string) => {
    const message = err instanceof Error ? err.message : `Unknown error during ${action}`;
    setError(message);
    console.error(`Error ${action}:`, err);
  }, []);

  const updateCounts = useCallback(async () => {
    try {
      const [activeCount, completedCount] = await Promise.all([
        todoService.getActiveTodosCount(),
        todoService.getCompletedTodosCount(),
      ]);
      setActiveTodosCount(activeCount);
      setCompletedTodosCount(completedCount);
    } catch (err) {
      handleError(err, 'updating counts');
    }
  }, [handleError]);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filteredTodos = await todoService.filterTodos(filter);
      setTodos(filteredTodos);
      await updateCounts();
    } catch (err) {
      handleError(err, 'loading todos');
    } finally {
      setLoading(false);
    }
  }, [filter, handleError, updateCounts]);

  const refreshTodos = useCallback(async () => {
    await loadTodos();
  }, [loadTodos]);

  const addTodo = useCallback(async (todoData: CreateTodoRequest) => {
    try {
      setError(null);
      await todoService.createTodo(todoData);
      await loadTodos();
    } catch (err) {
      handleError(err, 'adding todo');
      throw err;
    }
  }, [loadTodos, handleError]);

  const updateTodo = useCallback(async (id: string, updateData: UpdateTodoRequest) => {
    try {
      setError(null);
      const updated = await todoService.updateTodo(id, updateData);
      if (!updated) {
        throw new Error('Todo not found');
      }
      await loadTodos();
    } catch (err) {
      handleError(err, 'updating todo');
      throw err;
    }
  }, [loadTodos, handleError]);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      setError(null);
      const success = await todoService.deleteTodo(id);
      if (!success) {
        throw new Error('Todo not found');
      }
      await loadTodos();
    } catch (err) {
      handleError(err, 'deleting todo');
      throw err;
    }
  }, [loadTodos, handleError]);

  const toggleTodoCompleted = useCallback(async (id: string) => {
    try {
      setError(null);
      const updated = await todoService.toggleTodoCompleted(id);
      if (!updated) {
        throw new Error('Todo not found');
      }
      await loadTodos();
    } catch (err) {
      handleError(err, 'toggling todo completion');
      throw err;
    }
  }, [loadTodos, handleError]);

  const clearCompletedTodos = useCallback(async () => {
    try {
      setError(null);
      await todoService.clearCompletedTodos();
      await loadTodos();
    } catch (err) {
      handleError(err, 'clearing completed todos');
      throw err;
    }
  }, [loadTodos, handleError]);

  const markAllCompleted = useCallback(async (completed: boolean = true) => {
    try {
      setError(null);
      await todoService.markAllCompleted(completed);
      await loadTodos();
    } catch (err) {
      handleError(err, 'marking all todos as completed');
      throw err;
    }
  }, [loadTodos, handleError]);

  const setFilterWithRefresh = useCallback((newFilter: TodoFilter) => {
    setFilter(newFilter);
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return {
    todos,
    loading,
    error,
    filter,
    activeTodosCount,
    completedTodosCount,
    setFilter: setFilterWithRefresh,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompleted,
    clearCompletedTodos,
    markAllCompleted,
    refreshTodos,
  };
};