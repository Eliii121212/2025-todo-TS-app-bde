import type { Todo } from './types';

export let todos: Todo[] = [];

export const loadTodos = (): Todo[] => {
  try {
    const raw = localStorage.getItem('todos');
    return raw ? (JSON.parse(raw) as Todo[]) : [];
  } catch {
    return [];
  }
};

export const saveTodos = (): void => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

export const saveBackgroundColor = (color: string): void => {
    localStorage.setItem('backgroundColor', color);
  };
  
  export const loadBackgroundColor = (): string | null => {
    return localStorage.getItem('backgroundColor');
  };
todos = loadTodos();
