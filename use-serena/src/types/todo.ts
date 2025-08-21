export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTodoRequest = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateTodoRequest = Partial<Pick<Todo, 'title' | 'description' | 'completed'>>;

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoFilter {
  type: FilterType;
  searchQuery?: string;
}