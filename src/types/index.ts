export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: 'alta' | 'media' | 'baja';
  completed: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
  priority?: 'alta' | 'media' | 'baja';
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  priority?: 'alta' | 'media' | 'baja';
  completed?: boolean;
}
