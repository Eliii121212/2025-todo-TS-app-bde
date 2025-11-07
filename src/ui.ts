import { addTodo, renderTodos } from './todos';
import { todos, saveTodos } from './storage';
import { todoForm, todoInput, clearBtn, sortBtn, errorMessage } from './dom';
import type { Priority } from './types';

export const initUI = (): void => {
  renderTodos();

  // Form submit
  todoForm.addEventListener('submit', (event: Event) => {
    event.preventDefault();
    const text = todoInput.value.trim();
    const dueDate = (document.getElementById('due-date') as HTMLInputElement).value;

    if (text) {
      todoInput.classList.remove('input-error');
      if (errorMessage) errorMessage.style.display = 'none';
      addTodo(text, dueDate);
      todoInput.value = '';
      (document.getElementById('due-date') as HTMLInputElement).value = '';
    } else {
      todoInput.classList.add('input-error');
      if (errorMessage) errorMessage.style.display = 'block';
    }
  });

  // Clear completed
  clearBtn?.addEventListener('click', () => {
    todos.splice(0, todos.length, ...todos.filter(t => !t.completed));
    saveTodos();
    renderTodos();
  });

  // Sort by priority
  sortBtn?.addEventListener('click', () => {
    const rank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    todos.sort(
      (a, b) => rank[a.priority ?? 'medium'] - rank[b.priority ?? 'medium']
    );
    saveTodos();
    renderTodos();
  });

  // Color picker
  const colorPicker = document.getElementById('colorPicker') as HTMLInputElement;
  if (colorPicker) {
    colorPicker.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      document.body.style.backgroundColor = target.value;
    });
  }
};
