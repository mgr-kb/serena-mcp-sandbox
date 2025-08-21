export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTodoRequest = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateTodoRequest = Partial<Pick<Todo, 'title' | 'description' | 'completed' | 'priority'>>;

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoFilter {
  type: FilterType;
  searchQuery?: string;
}