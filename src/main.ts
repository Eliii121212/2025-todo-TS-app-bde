// 1) Styles
import './style.css';

// 2) Types
type Priority = 'low' | 'medium' | 'high';
type StatusFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority?: Priority;
}

// 3) State
export let todos: Todo[] = [];
let statusFilter: StatusFilter = 'all';
let searchQuery = '';

// 4) Helpers
const isOverdue = (todo: Todo): boolean => {
  if (!todo.dueDate || todo.completed) return false;
  const due = new Date(`${todo.dueDate}T23:59:59`);
  return !Number.isNaN(due.getTime()) && due.getTime() < Date.now();
};

const getSelectedPriority = (): Priority => {
  const el = document.getElementById('priority-select') as HTMLSelectElement | null;
  return (el?.value as Priority) ?? 'medium';
};

// Pure helper for testing
export const filterByQueryAndStatus = (list: Todo[], query: string, status: StatusFilter): Todo[] => {
  const q = (query ?? '').toLowerCase();
  let visible = list.filter(t => t.text.toLowerCase().includes(q));
  if (status === 'active')    visible = visible.filter(t => !t.completed);
  if (status === 'completed') visible = visible.filter(t =>  t.completed);
  return visible;
};

// 5) DOM refs
const todoInput    = document.getElementById('todo-input') as HTMLInputElement;
const todoForm     = document.querySelector('.todo-form') as HTMLFormElement;
const todoList     = document.getElementById('todo-list') as HTMLUListElement;
const sortBtn      = document.getElementById('sortByPriority') as HTMLButtonElement;
const clearBtn     = document.getElementById('clearCompleted') as HTMLButtonElement;
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;
const searchInput  = document.getElementById('search') as HTMLInputElement | null;

// 6) Storage (stub for now; real implementation in Feature 3)
const saveTodos = (): void => {};
const loadTodos = (): void => {};

// 7) Add todo
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

// 8) Render
const renderTodos = (): void => {
  todoList.innerHTML = '';

  // search + status filter
  const visible = filterByQueryAndStatus(todos, searchQuery, statusFilter);

  visible.forEach((todo) => {
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

    // text + buttons
    li.innerHTML += `
      <span>${todo.text}</span>
      <button>Remove</button>
      <button id="editBtn">Edit</button>
    `;

    // priority badge
    const priorityBadge = document.createElement('span');
    priorityBadge.className = `priority-badge ${todo.priority ?? 'medium'}`;
    priorityBadge.textContent = `${todo.priority ?? 'medium'}`;
    li.appendChild(priorityBadge);

    // due date badge
    if (todo.dueDate) {
      const due = document.createElement('span');
      due.className = 'due-badge';
      due.textContent = `due: ${todo.dueDate}`;
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

    // completed style
    if (todo.completed) {
      li.style.opacity = '0.6';
      const txt = li.querySelector('span') as HTMLSpanElement | null;
      if (txt) txt.style.textDecoration = 'line-through';
    }

    // buttons
    const removeButton = li.querySelector('button') as HTMLButtonElement | null;
    removeButton?.addEventListener('click', () => removeTodo(todo.id));

    const editButton = li.querySelector('#editBtn') as HTMLButtonElement | null;
    editButton?.addEventListener('click', () => editTodo(todo.id));

    todoList.appendChild(li);
  });
};

// 9) Initial render
loadTodos();
renderTodos();

// 10) Submit handler
todoForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  const dueDate = (document.getElementById('due-date') as HTMLInputElement)?.value;

  if (text !== '') {
    todoInput.classList.remove('input-error');
    if (errorMessage) errorMessage.style.display = 'none';

    addTodo(text, dueDate);

    todoInput.value = '';
    const due = document.getElementById('due-date') as HTMLInputElement | null;
    if (due) due.value = '';
  } else {
    console.log('Please enter a todo item');
    todoInput.classList.add('input-error');
    if (errorMessage) errorMessage.style.display = 'block';
  }
});

// 11) Remove
export const removeTodo = (id: number): void => {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
};

// 12) Edit
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

// 13) Sort by priority
sortBtn?.addEventListener('click', () => {
  const rank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  todos = [...todos].sort(
    (a, b) => rank[a.priority ?? 'medium'] - rank[b.priority ?? 'medium']
  );
  // optional: saveTodos(); // if you want to persist order
  renderTodos();
});

// 14) Clear completed
clearBtn?.addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  renderTodos();
});

// 15) Search (live)
searchInput?.addEventListener('input', () => {
  searchQuery = searchInput.value.toLowerCase();
  renderTodos();
});
