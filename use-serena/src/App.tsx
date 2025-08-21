import { TodoList } from './components/TodoList';
import { useTodos } from './hooks/useTodos';

function App() {
  const {
    todos,
    loading,
    error,
    filter,
    sortBy,
    activeTodosCount,
    completedTodosCount,
    setFilter,
    setSortBy,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompleted,
    clearCompletedTodos,
    markAllCompleted,
    refreshTodos,
  } = useTodos();

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <TodoList
        todos={todos}
        loading={loading}
        error={error}
        filter={filter}
        sortBy={sortBy}
        activeTodosCount={activeTodosCount}
        completedTodosCount={completedTodosCount}
        onFilterChange={setFilter}
        onSortChange={setSortBy}
        onAddTodo={addTodo}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        onToggleCompleted={toggleTodoCompleted}
        onClearCompleted={clearCompletedTodos}
        onMarkAllCompleted={markAllCompleted}
        onRefresh={refreshTodos}
      />
    </div>
  );
}

export default App;
