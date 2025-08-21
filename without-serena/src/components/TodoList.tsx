import React, { useState, useMemo } from 'react';
import type { Todo, CreateTodoRequest, UpdateTodoRequest, TodoFilter, Priority } from '../types/todo';
import { TodoForm } from './TodoForm';
import { TodoItem } from './TodoItem';
import { TodoFilterComponent } from './TodoFilter';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filter: TodoFilter;
  activeTodosCount: number;
  completedTodosCount: number;
  onFilterChange: (filter: TodoFilter) => void;
  onAddTodo: (todoData: CreateTodoRequest) => Promise<void>;
  onUpdateTodo: (id: string, updateData: UpdateTodoRequest) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
  onToggleCompleted: (id: string) => Promise<void>;
  onClearCompleted: () => Promise<void>;
  onMarkAllCompleted: (completed?: boolean) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  error,
  filter,
  activeTodosCount,
  completedTodosCount,
  onFilterChange,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
  onToggleCompleted,
  onClearCompleted,
  onMarkAllCompleted,
  onRefresh,
}) => {
  const [sortBy, setSortBy] = useState<'default' | 'priority' | 'created' | 'updated'>('default');

  const getPriorityOrder = (priority: Priority): number => {
    switch (priority) {
      case 'high':
        return 3;
      case 'medium':
        return 2;
      case 'low':
        return 1;
      default:
        return 2;
    }
  };

  const sortedTodos = useMemo(() => {
    if (sortBy === 'default') {
      return todos;
    }

    return [...todos].sort((a, b) => {
      switch (sortBy) {
        case 'priority': {
          const priorityDiff = getPriorityOrder(b.priority) - getPriorityOrder(a.priority);
          if (priorityDiff !== 0) return priorityDiff;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });
  }, [todos, sortBy]);

  const handleRefresh = async () => {
    try {
      await onRefresh();
    } catch (err) {
      console.error('Error refreshing todos:', err);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">読み込み中...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-800 font-medium">エラーが発生しました</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            >
              再試行
            </button>
          </div>
        </div>
      );
    }

    if (sortedTodos.length === 0) {
      const isFiltered = filter.type !== 'all' || filter.searchQuery;
      
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h5.586a1 1 0 00.707-.293l5.414-5.414a1 1 0 00.293-.707V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isFiltered ? '該当するTODOがありません' : 'TODOがありません'}
          </h3>
          <p className="text-gray-600 text-sm">
            {isFiltered 
              ? 'フィルターや検索条件を変更してみてください'
              : '最初のTODOを追加してみましょう'
            }
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {sortedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleCompleted={onToggleCompleted}
            onUpdateTodo={onUpdateTodo}
            onDeleteTodo={onDeleteTodo}
            disabled={loading}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">TODOリスト</h1>
        <p className="text-gray-600">タスクを管理して生産性を向上させましょう</p>
      </header>

      <TodoForm 
        onAddTodo={onAddTodo}
        disabled={loading}
      />

      <TodoFilterComponent
        filter={filter}
        onFilterChange={onFilterChange}
        activeTodosCount={activeTodosCount}
        completedTodosCount={completedTodosCount}
        onClearCompleted={onClearCompleted}
        onMarkAllCompleted={onMarkAllCompleted}
        disabled={loading}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
            並び順:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'default' | 'priority' | 'created' | 'updated')}
            disabled={loading}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="default">デフォルト</option>
            <option value="priority">優先度順</option>
            <option value="created">作成日順</option>
            <option value="updated">更新日順</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        {renderContent()}
      </div>

      {!loading && !error && sortedTodos.length > 0 && (
        <div className="text-center">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm transition-colors duration-200"
          >
            更新
          </button>
        </div>
      )}
    </div>
  );
};