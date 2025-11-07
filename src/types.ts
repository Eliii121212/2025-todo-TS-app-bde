export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority?: Priority;
}
