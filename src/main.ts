import { Priority } from './types';
import './style.css';

// ---------- helpers & DOM refs ----------
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoList  = document.getElementById('todo-list') as HTMLUListElement;
const sortBtn   = document.getElementById('sortByPriority') as HTMLButtonElement;

const dueDateInput = document.getElementById('due-date') as HTMLInputElement;
const prioritySelect = document.getElementById('priority-select') as HTMLSelectElement;

const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

// pick current priority from the dropdown
const getSelectedPriority = (): Priority =>
  (prioritySelect.value as Priority);

// detect overdue (today after due date, and not completed)
const isOverdue = (todo: Todo): boolean => {
  if (!todo.dueDate || todo.completed) return false;
  const due = new Date(`${todo.dueDate}T23:59:59`);
  return !Number.isNaN(due.getTime()) && due.getTime() < Date.now();
};

// ---------- types & state ----------
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority?: Priority;
}

export let todos: Todo[] = [];

// ---------- core actions ----------
export const addTodo = (text: string, dueDate?: string): void => {
  const newTodo: Todo = {
    id: Date.now(),
    text,
    completed: false,
    dueDate,
    priority: getSelectedPriority(),
  };
  todos.push(newTodo);
  renderTodos();
};

export const removeTodo = (id: number): void => {
  todos = todos.filter(t => t.id !== id);
  renderTodos();
};

// ---------- render ----------
const renderTodos = (): void => {
  todoList.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    // basic content
    li.innerHTML = `
      <span>${todo.text}</span>
      <button>Remove</button>
      <button id="editBtn">Edit</button>
    `;

    // show due date
    if (todo.dueDate) {
      const due = document.createElement('span');
      due.style.marginLeft = '8px';
      due.textContent = `(due: ${todo.dueDate})`;
      li.appendChild(due);
    }

    // highlight overdue
    if (isOverdue(todo)) {
      li.style.color = 'red';
      li.style.fontWeight = '600';
      li.title = 'Overdue';
    } else {
      li.style.removeProperty('color');
      li.style.removeProperty('font-weight');
      li.removeAttribute('title');
    }

    // show priority badge
    const priorityBadge = document.createElement('span');
    priorityBadge.style.marginLeft = '8px';
    priorityBadge.textContent = `[${todo.priority ?? 'medium'}]`;
    li.appendChild(priorityBadge);

    addRemoveButtonListener(li, todo.id);
    addEditButtonListener(li, todo.id);

    todoList.appendChild(li);
  });
};

// attach ONCE (outside functions): sort high → medium → low
sortBtn?.addEventListener('click', () => {
  const rank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  todos = [...todos].sort(
    (a, b) => rank[a.priority ?? 'medium'] - rank[b.priority ?? 'medium']
  );
  renderTodos();
});

// initial render
renderTodos();

// ---------- events ----------
todoForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  const dueDate = dueDateInput?.value;

  if (text !== '') {
    todoInput.classList.remove('input-error');
    if (errorMessage) errorMessage.style.display = 'none';

    addTodo(text, dueDate);

    todoInput.value = '';
    if (dueDateInput) dueDateInput.value = '';
  } else {
    console.log('Please enter a todo item');
    todoInput.classList.add('input-error');
    if (errorMessage) errorMessage.style.display = 'block';
  }
});

// ---------- small DOM utils ----------
const addRemoveButtonListener = (li: HTMLLIElement, id: number): void => {
  const removeButton = li.querySelector('button');
  removeButton?.addEventListener('click', () => removeTodo(id));
};

const addEditButtonListener = (li: HTMLLIElement, id: number) => {
  const editButton = li.querySelector('#editBtn') as HTMLButtonElement | null;
  editButton?.addEventListener('click', () => editTodo(id));
};

const editTodo = (id: number) => {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    const text = prompt('Edit todo', todo.text);
    if (text) {
      todo.text = text;
      renderTodos();
    }
  }
};

// ---------- color picker ----------
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

document.addEventListener('DOMContentLoaded', initializeColorPicker);
