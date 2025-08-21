import React, { useState } from 'react';
import type { FilterType, TodoFilter } from '../types/todo';

interface TodoFilterProps {
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  activeTodosCount: number;
  completedTodosCount: number;
  onClearCompleted: () => Promise<void>;
  onMarkAllCompleted: (completed?: boolean) => Promise<void>;
  disabled?: boolean;
}

export const TodoFilterComponent: React.FC<TodoFilterProps> = ({
  filter,
  onFilterChange,
  activeTodosCount,
  completedTodosCount,
  onClearCompleted,
  onMarkAllCompleted,
  disabled = false,
}) => {
  const [searchQuery, setSearchQuery] = useState(filter.searchQuery || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilterTypeChange = (type: FilterType) => {
    if (disabled || isProcessing) return;
    
    onFilterChange({
      type,
      searchQuery: searchQuery.trim() || undefined,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (!disabled && !isProcessing) {
      onFilterChange({
        type: filter.type,
        searchQuery: value.trim() || undefined,
      });
    }
  };

  const handleClearCompleted = async () => {
    if (disabled || isProcessing || completedTodosCount === 0) return;
    
    if (!confirm(`${completedTodosCount}個の完了済みTODOを削除しますか？`)) {
      return;
    }

    setIsProcessing(true);
    try {
      await onClearCompleted();
    } catch (err) {
      console.error('Error clearing completed todos:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkAllCompleted = async () => {
    if (disabled || isProcessing) return;
    
    const hasActiveTodos = activeTodosCount > 0;
    const message = hasActiveTodos 
      ? `${activeTodosCount}個のTODOを完了済みにしますか？`
      : `${completedTodosCount}個のTODOを未完了にしますか？`;
    
    if (!confirm(message)) {
      return;
    }

    setIsProcessing(true);
    try {
      await onMarkAllCompleted(hasActiveTodos);
    } catch (err) {
      console.error('Error marking all todos:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalTodos = activeTodosCount + completedTodosCount;
  const isControlsDisabled = disabled || isProcessing;

  const filterButtons: Array<{ type: FilterType; label: string; count?: number }> = [
    { type: 'all', label: 'すべて', count: totalTodos },
    { type: 'active', label: 'アクティブ', count: activeTodosCount },
    { type: 'completed', label: '完了済み', count: completedTodosCount },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            検索
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={handleSearchChange}
            disabled={isControlsDisabled}
            placeholder="タイトルまたは説明で検索..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterButtons.map(({ type, label, count }) => (
          <button
            key={type}
            onClick={() => handleFilterTypeChange(type)}
            disabled={isControlsDisabled}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed ${
              filter.type === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100'
            }`}
          >
            {label}
            {count !== undefined && (
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                filter.type === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {totalTodos > 0 && (
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-200">
          <button
            onClick={handleMarkAllCompleted}
            disabled={isControlsDisabled}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm transition-colors duration-200"
          >
            {isProcessing ? '処理中...' : (activeTodosCount > 0 ? 'すべて完了' : 'すべて未完了')}
          </button>
          
          {completedTodosCount > 0 && (
            <button
              onClick={handleClearCompleted}
              disabled={isControlsDisabled}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm transition-colors duration-200"
            >
              {isProcessing ? '削除中...' : '完了済みを削除'}
            </button>
          )}
        </div>
      )}

      {totalTodos > 0 && (
        <div className="text-sm text-gray-600 pt-2 border-t border-gray-200">
          合計: {totalTodos}個のTODO
          {activeTodosCount > 0 && ` (${activeTodosCount}個が未完了)`}
        </div>
      )}
    </div>
  );
};