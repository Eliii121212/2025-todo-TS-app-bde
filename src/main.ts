// 1) Styles
import './style.css';

// 2) Types
type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority?: Priority;
}

// 3) State + storage helpers
export let todos: Todo[] = [];

const loadTodos = (): Todo[] => {
  try {
    const raw = localStorage.getItem('todos');
    return raw ? (JSON.parse(raw) as Todo[]) : [];
  } catch {
    return [];
  }
};

const saveTodos = (): void => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

// init from storage
todos = loadTodos();

// 4) Helpers
const isOverdue = (todo: Todo): boolean => {
  if (!todo.dueDate || todo.completed) return false;
  const due = new Date(`${todo.dueDate}T23:59:59`);
  return !Number.isNaN(due.getTime()) && due.getTime() < Date.now();
};

const getSelectedPriority = (): Priority => {
  return (document.getElementById('priority-select') as HTMLSelectElement)
    .value as Priority;
};

// 5) DOM refs
const todoInput  = document.getElementById('todo-input') as HTMLInputElement;
const todoForm   = document.querySelector('.todo-form') as HTMLFormElement;
const todoList   = document.getElementById('todo-list') as HTMLUListElement;
const clearBtn   = document.getElementById('clearCompleted') as HTMLButtonElement;
const sortBtn    = document.getElementById('sortByPriority') as HTMLButtonElement;
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

// 6) Add todo
export const addTodo = (text: string, dueDate?: string): void => {
  const newTodo: Todo = {
    id: Date.now(),
    text,
    completed: false,
    dueDate,
    priority: getSelectedPriority(),
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();
};

// 7) Render list
const renderTodos = (): void => {
  todoList.innerHTML = '';

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    // completion checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });
    li.appendChild(checkbox);

    // text
    const textSpan = document.createElement('span');
    textSpan.textContent = todo.text;
    li.appendChild(textSpan);

    // priority badge (optional visual)
    const badge = document.createElement('span');
    badge.style.marginLeft = '8px';
    badge.textContent = `[${todo.priority ?? 'medium'}]`;
    li.appendChild(badge);

    // due date
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

    // remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeTodo(todo.id));
    li.appendChild(removeButton);

    // edit button
    const editButton = document.createElement('button');
    editButton.id = 'editBtn';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editTodo(todo.id));
    li.appendChild(editButton);

    todoList.appendChild(li);
  });
};

// 8) Initial render
renderTodos();

// 9) Form submit
todoForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  const dueDate = (document.getElementById('due-date') as HTMLInputElement).value;

  if (text !== '') {
    todoInput.classList.remove('input-error');
    if (errorMessage) errorMessage.style.display = 'none';

    addTodo(text, dueDate);

    todoInput.value = '';
    (document.getElementById('due-date') as HTMLInputElement).value = '';
  } else {
    console.log('Please enter a todo item');
    todoInput.classList.add('input-error');
    if (errorMessage) errorMessage.style.display = 'block';
  }
});

// 10) Remove todo by ID
export const removeTodo = (id: number): void => {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderTodos();
};

// 11) Edit todo
const editTodo = (id: number) => {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    const text = prompt('Edit todo', todo.text);
    if (text) {
      todo.text = text;
      saveTodos();
      renderTodos();
    }
  }
};

// 12) Clear completed
clearBtn?.addEventListener('click', () => {
  todos = todos.filter((t) => !t.completed);
  saveTodos();
  renderTodos();
});

// 13) Sort by priority
sortBtn?.addEventListener('click', () => {
  const rank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  todos = [...todos].sort(
    (a, b) => rank[a.priority ?? 'medium'] - rank[b.priority ?? 'medium']
  );
  saveTodos();
  renderTodos();
});

// 14) Color picker (unchanged)
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
