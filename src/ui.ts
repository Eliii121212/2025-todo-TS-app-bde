import { addTodo, renderTodos } from './todos';
import { todos, saveTodos, saveBackgroundColor, loadBackgroundColor } from './storage';
import { todoForm, todoInput, clearBtn, sortBtn, errorMessage } from './dom';
import type { Priority } from './types';

export const initUI = (): void => {
  renderTodos();


  const savedColor = loadBackgroundColor();
  if (savedColor) {
    document.body.style.backgroundColor = savedColor;
    const colorPicker = document.getElementById('colorPicker') as HTMLInputElement;
    if (colorPicker) colorPicker.value = savedColor;
  }

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

 
  clearBtn?.addEventListener('click', () => {
    todos.splice(0, todos.length, ...todos.filter(t => !t.completed));
    saveTodos();
    renderTodos();
  });

  
  sortBtn?.addEventListener('click', () => {
    const rank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    todos.sort(
      (a, b) => rank[a.priority ?? 'medium'] - rank[b.priority ?? 'medium']
    );
    saveTodos();
    renderTodos();
  });


  const colorPicker = document.getElementById('colorPicker') as HTMLInputElement;
  if (colorPicker) {
    colorPicker.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const color = target.value;
      document.body.style.backgroundColor = color;
      saveBackgroundColor(color); // uloží do localStorage
    });
  }
};
