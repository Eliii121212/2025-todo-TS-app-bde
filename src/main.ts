// 1 Import the CSS file: This ensures that the styles are applied to the HTML elements.
import './style.css';

// Step 2: Define the Todo interface
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
}

// Step 3: Initialize an empty array to store todos
export let todos: Todo[] = [];

// helper: is overdue
const isOverdue = (todo: Todo): boolean => {
  if (!todo.dueDate || todo.completed) return false;
  const due = new Date(`${todo.dueDate}T23:59:59`);
  return !Number.isNaN(due.getTime()) && due.getTime() < Date.now();
};

// Step 4: Get references to the HTML elements
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
// NEW: Clear completed button
const clearBtn = document.getElementById('clearCompleted') as HTMLButtonElement;

// Step 5: Function to add a new todo
export const addTodo = (text: string, dueDate?: string): void => {
  const newTodo: Todo = {
    id: Date.now(),
    text,
    completed: false,
    dueDate,
  };

  todos.push(newTodo);
  renderTodos();
};

// Step 6: Function to render the list of todos
const renderTodos = (): void => {
  // Clear the current list
  todoList.innerHTML = '';

  // Build each <li>
  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    // ✅ (1) Completion checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
      todo.completed = checkbox.checked;
      renderTodos();
    });
    li.appendChild(checkbox);

    // Task text
    const textSpan = document.createElement('span');
    textSpan.textContent = todo.text;
    li.appendChild(textSpan);

    // Remove button (keeps your existing listeners working)
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    li.appendChild(removeButton);

    // Edit button (id kept so your listener finds it)
    const editButton = document.createElement('button');
    editButton.id = 'editBtn';
    editButton.textContent = 'Edit';
    li.appendChild(editButton);

    // Show due date badge (existing behavior)
    if (todo.dueDate) {
      const due = document.createElement('span');
      due.style.marginLeft = '8px';
      due.textContent = `(due: ${todo.dueDate})`;
      li.appendChild(due);
    }

    // Highlight overdue (existing)
    if (isOverdue(todo)) {
      li.style.color = 'red';
      li.style.fontWeight = '600';
      li.title = 'Overdue';
    } else {
      li.style.removeProperty('color');
      li.style.removeProperty('font-weight');
      li.removeAttribute('title');
    }

    // Wire up existing helpers (they look for the first button and #editBtn)
    addRemoveButtonListener(li, todo.id);
    addEditButtonListener(li, todo.id);

    // Append to the list
    todoList.appendChild(li);
  });
};

// Step 6.1: Initial render
renderTodos();

// Step 7: Form submit
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

todoForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  const dueDate = (document.getElementById('due-date') as HTMLInputElement).value;

  if (text !== '') {
    todoInput.classList.remove('input-error');
    errorMessage.style.display = 'none';

    addTodo(text, dueDate);

    todoInput.value = '';
    (document.getElementById('due-date') as HTMLInputElement).value = '';
  } else {
    console.log('Please enter a todo item');
    todoInput.classList.add('input-error');
    errorMessage.style.display = 'block';
  }
});

// Step 8: Remove button listener helper
const addRemoveButtonListener = (li: HTMLLIElement, id: number): void => {
  const removeButton = li.querySelector('button');
  removeButton?.addEventListener('click', () => removeTodo(id));
};

// Step 8: Remove todo by ID
export const removeTodo = (id: number): void => {
  todos = todos.filter((todo) => todo.id !== id);
  renderTodos();
};

// Edit button listener helper
const addEditButtonListener = (li: HTMLLIElement, id: number) => {
  const editButton = li.querySelector('#editBtn');
  editButton?.addEventListener('click', () => editTodo(id));
};

// Edit function
const editTodo = (id: number) => {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    const text = prompt('Edit todo', todo.text);
    if (text) {
      todo.text = text;
      renderTodos();
    }
  }
};

/**
 * color picker
 */
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

// ✅ NEW: Clear completed button handler
clearBtn?.addEventListener('click', () => {
  todos = todos.filter((t) => !t.completed);
  renderTodos();
});
