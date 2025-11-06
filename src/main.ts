// 1) Styles
import './style.css';

// 2) Types
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
}
type Filter = 'all' | 'active' | 'completed';

// 3) State
const STORAGE_KEY = 'todos-v1';
export let todos: Todo[] = [];
let currentFilter: Filter = 'all';

// 4) Helpers
const isOverdue = (todo: Todo): boolean => {
  if (!todo.dueDate || todo.completed) return false;
  const due = new Date(`${todo.dueDate}T23:59:59`);
  return !Number.isNaN(due.getTime()) && due.getTime() < Date.now();
};

const saveTodos = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};
const loadTodos = (): Todo[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Todo[]) : [];
  } catch {
    return [];
  }
};

// 5) DOM refs
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;

const clearBtn = document.getElementById('clearCompleted') as HTMLButtonElement;
const filterAllBtn = document.getElementById('filterAll') as HTMLButtonElement;
const filterActiveBtn = document.getElementById('filterActive') as HTMLButtonElement;
const filterCompletedBtn = document.getElementById('filterCompleted') as HTMLButtonElement;

// 6) Add todo
export const addTodo = (text: string, dueDate?: string): void => {
  const newTodo: Todo = {
    id: Date.now(),
    text,
    completed: false,
    dueDate,
  };
  todos.push(newTodo);
  saveTodos();
  renderTodos();
};

// 7) Render
const renderTodos = (): void => {
  todoList.innerHTML = '';

  const filtered = todos.filter((t) => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  filtered.forEach((todo) => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    // checkbox to toggle completion
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });
    li.appendChild(checkbox);

    // task text
    const textSpan = document.createElement('span');
    textSpan.textContent = todo.text;
    textSpan.style.marginLeft = '8px';
    li.appendChild(textSpan);

    // remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => removeTodo(todo.id));
    li.appendChild(removeBtn);

    // edit button
    const editBtn = document.createElement('button');
    editBtn.id = 'editBtn';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      const text = prompt('Edit todo', todo.text);
      if (text) {
        todo.text = text;
        saveTodos();
        renderTodos();
      }
    });
    li.appendChild(editBtn);

    // due date badge
    if (todo.dueDate) {
      const due = document.createElement('span');
      due.style.marginLeft = '8px';
      due.textContent = `(due: ${todo.dueDate})`;
      li.appendChild(due);
    }

    // overdue highlight
    if (isOverdue(todo)) {
      li.style.color = 'red';
      li.style.fontWeight = '600';
      li.title = 'Overdue';
    } else {
      li.style.removeProperty('color');
      li.style.removeProperty('font-weight');
      li.removeAttribute('title');
    }

    todoList.appendChild(li);
  });

  // update active state on filter buttons (simple)
  [filterAllBtn, filterActiveBtn, filterCompletedBtn].forEach((b) =>
    b?.classList.remove('is-active')
  );
  if (currentFilter === 'all') filterAllBtn?.classList.add('is-active');
  if (currentFilter === 'active') filterActiveBtn?.classList.add('is-active');
  if (currentFilter === 'completed') filterCompletedBtn?.classList.add('is-active');
};

// 8) Initial load + render
todos = loadTodos();
renderTodos();

// 9) Submit handler
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

todoForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  const dueDate = (document.getElementById('due-date') as HTMLInputElement)?.value;

  if (text !== '') {
    todoInput.classList.remove('input-error');
    if (errorMessage) errorMessage.style.display = 'none';

    addTodo(text, dueDate);

    todoInput.value = '';
    const due = document.getElementById('due-date') as HTMLInputElement;
    if (due) due.value = '';
  } else {
    todoInput.classList.add('input-error');
    if (errorMessage) errorMessage.style.display = 'block';
  }
});

// 10) Remove todo
export const removeTodo = (id: number): void => {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
};

// 11) Clear completed
clearBtn?.addEventListener('click', () => {
  const before = todos.length;
  todos = todos.filter((t) => !t.completed);
  if (todos.length !== before) {
    saveTodos();
    renderTodos();
  }
});

// 12) Filters
filterAllBtn?.addEventListener('click', () => {
  currentFilter = 'all';
  renderTodos();
});
filterActiveBtn?.addEventListener('click', () => {
  currentFilter = 'active';
  renderTodos();
});
filterCompletedBtn?.addEventListener('click', () => {
  currentFilter = 'completed';
  renderTodos();
});

// 13) Color picker (unchanged)
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
