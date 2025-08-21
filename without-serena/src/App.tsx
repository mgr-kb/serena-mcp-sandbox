import { TodoList } from './components/TodoList';
import { useTodos } from './hooks/useTodos';

function App() {
  const {
    todos,
    loading,
    error,
    filter,
    activeTodosCount,
    completedTodosCount,
    setFilter,
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
        activeTodosCount={activeTodosCount}
        completedTodosCount={completedTodosCount}
        onFilterChange={setFilter}
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
