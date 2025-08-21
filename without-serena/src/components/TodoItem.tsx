import React, { useState } from 'react';
import type { Todo, UpdateTodoRequest, Priority } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggleCompleted: (id: string) => Promise<void>;
  onUpdateTodo: (id: string, updateData: UpdateTodoRequest) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
  disabled?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleCompleted,
  onUpdateTodo,
  onDeleteTodo,
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleCompleted = async () => {
    if (disabled || isUpdating) return;
    
    try {
      setError(null);
      await onToggleCompleted(todo.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : '完了状態の変更に失敗しました';
      setError(message);
    }
  };

  const handleEdit = () => {
    if (disabled || isUpdating) return;
    setIsEditing(true);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setError(null);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      setError('タイトルを入力してください');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      await onUpdateTodo(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        priority: editPriority,
      });
      setIsEditing(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'TODOの更新に失敗しました';
      setError(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (disabled || isUpdating) return;
    
    if (!confirm('このTODOを削除しますか？')) {
      return;
    }

    try {
      setError(null);
      await onDeleteTodo(todo.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'TODOの削除に失敗しました';
      setError(message);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '中';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const isItemDisabled = disabled || isUpdating;

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isItemDisabled}
            placeholder="タイトル"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            maxLength={100}
          />
          
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            disabled={isItemDisabled}
            placeholder="説明（任意）"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 resize-vertical"
            maxLength={500}
          />

          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as Priority)}
            disabled={isItemDisabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-2">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={isItemDisabled}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
            >
              {isUpdating ? '保存中...' : '保存'}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isItemDisabled}
              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-opacity duration-200 ${todo.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggleCompleted}
          disabled={isItemDisabled}
          className="mt-1 w-5 h-5 border-2 border-gray-300 rounded-md flex items-center justify-center hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
          aria-label={todo.completed ? '未完了にする' : '完了にする'}
        >
          {todo.completed && (
            <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(todo.priority)}`}>
              {getPriorityLabel(todo.priority)}
            </span>
          </div>
          
          {todo.description && (
            <p className={`mt-1 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {todo.description}
            </p>
          )}
          
          <div className="mt-2 text-xs text-gray-400 space-y-1">
            <div>作成: {formatDate(todo.createdAt)}</div>
            {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
              <div>更新: {formatDate(todo.updatedAt)}</div>
            )}
          </div>

          {error && (
            <div className="mt-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-2">
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            disabled={isItemDisabled}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
            aria-label="編集"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isItemDisabled}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed"
            aria-label="削除"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};