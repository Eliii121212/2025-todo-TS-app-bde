import type { Todo, Priority } from './types';

export const isOverdue = (todo: Todo): boolean => {
  if (!todo.dueDate || todo.completed) return false;
  const due = new Date(`${todo.dueDate}T23:59:59`);
  return !Number.isNaN(due.getTime()) && due.getTime() < Date.now();
};

export const getSelectedPriority = (): Priority => {
  return (document.getElementById('priority-select') as HTMLSelectElement)
    .value as Priority;
};
