import { Priority } from './types';
import './style.css';

/**
 * NOTE to self
 * Make a module and import the functions from the module
 * Seperate the functions into different files
 * Logical grouping of functions - for example, all functions related to adding a todo item can be in one file
 */

/** -------- DOM refs -------- */
const todoForm  = document.querySelector('.todo-form') as HTMLFormElement;
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoList  = document.getElementById('todo-list') as HTMLUListElement;

const prioritySelect = document.getElementById('priority-select') as HTMLSelectElement;
const sortBtn        = document.getElementById('sortByPriority') as HTMLButtonElement | null;
const errorMessage   = document.getElementById('error-message') as HTMLParagraphElement;

/** -------- Types & State -------- */
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority?: Priority; // optional for KW video
}

export let todos: Todo[] = [];

/** -------- Helpers -------- */
const getSelectedPriority = (): Priority => {
  return (prioritySelect?.value as Priority) || 'medium';
};

/** -------- Add Todo -------- */
export const addTodo = (text: string): void => {
  const priority = getSelectedPriority();

  const newTodo: Todo = {
    id: Date.now(),
    text,
    completed: false,
    priority,
  };

  todos.push(newTodo);
  renderTodos();
};

/** -------- Render Todos -------- */
const renderTodos = (): void => {
  // Clear current list
  todoList.innerHTML = '';

  // Build items
  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    // main content
    li.innerHTML = `
      <span>${todo.text}</span>
      <button>Remove</button>
      <button id="editBtn">Edit</button>
    `;

    // priority badge
    const priorityBadge = document.createElement('span');
    priorityBadge.style.marginLeft = '8px';
    priorityBadge.textContent = `[${todo.priority ?? 'medium'}]`;
    li.appendChild(priorityBadge);

    // listeners for buttons
    addRemoveButtonListener(li, todo.id);
    addEditButtonListener(li, todo.id);

    // mount
    todoList.appendChild(li);
  });
};

/** attach sort button ONCE (outside render/add) */
sortBtn?.addEventListener('click', () => {
  const rank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  todos = [...todos].sort(
    (a, b) => rank[a.priority ?? 'medium'] - rank[b.priority ?? 'medium']
  );
  renderTodos();
});

/** initial render */
renderTodos();

/** -------- Submit handler (single, with validation) -------- */
todoForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (text !== '') {
    // ok
    todoInput.classList.remove('input-error');
    if (errorMessage) errorMessage.style.display = 'none';

    addTodo(text);

    // reset inputs
    todoInput.value = '';
    if (prioritySelect) prioritySelect.value = 'medium';
  } else {
    // error
    console.log('Please enter a todo item');
    todoInput.classList.add('input-error');
    if (errorMessage) errorMessage.style.display = 'block';
  }
});

/** -------- Remove / Edit -------- */
const addRemoveButtonListener = (li: HTMLLIElement, id: number): void => {
  const removeButton = li.querySelector('button');
  removeButton?.addEventListener('click', () => removeTodo(id));
};

export const removeTodo = (id: number): void => {
  todos = todos.filter((t) => t.id !== id);
  renderTodos();
};

const addEditButtonListener = (li: HTMLLIElement, id: number): void => {
  const editButton = li.querySelector('#editBtn');
  editButton?.addEventListener('click', () => editTodo(id));
};

const editTodo = (id: number): void => {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  const text = prompt('Edit todo', todo.text);
  if (text) {
    todo.text = text;
    renderTodos();
  }
};

/** -------- Color picker (existing feature) -------- */
const changeBackgroundColor = (color: string): void => {
  document.body.style.backgroundColor = color;
};

const initializeColorPicker = (): void => {
  const colorPicker = document.getElementById('colorPicker') as HTMLInputElement;
  if (colorPicker) {
    colorPicker.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      changeBackgroundColor(target.value);
    });
  } else {
    console.error('Color picker element not found');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initializeColorPicker();
});
