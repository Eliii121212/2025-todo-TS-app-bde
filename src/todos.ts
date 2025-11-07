import { todos, saveTodos } from './storage';
import { isOverdue, getSelectedPriority } from './helpers';
import { Todo } from './types';
import { todoList } from './dom';

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

export const renderTodos = (): void => {
  todoList.innerHTML = '';

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    // checkbox
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

    // priority badge
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
    }

    // buttons
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeTodo(todo.id));
    li.appendChild(removeButton);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editTodo(todo.id));
    li.appendChild(editButton);

    todoList.appendChild(li);
  });
};

export const removeTodo = (id: number): void => {
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  }
};

export const editTodo = (id: number): void => {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    const text = prompt('Edit todo', todo.text);
    if (text) {
      todo.text = text;
      saveTodos();
      renderTodos();
    }
  }
};
