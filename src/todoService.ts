// src/todoService.ts
import type { Todo } from './types'
import { Priority } from './types'

/** Set/overwrite priority on a todo (pure, immutable) */
export function setPriority(todo: Todo, p: Priority): Todo {
  return { ...todo, priority: p }
}

/** Sorts: High → Medium → Low (defaults to Medium if missing) */
export function sortByPriority(todos: Todo[]): Todo[] {
  const rank: Record<Priority, number> = {
    [Priority.High]: 0,
    [Priority.Medium]: 1,
    [Priority.Low]: 2,
  }
  return [...todos].sort(
    (a, b) =>
      rank[a.priority ?? Priority.Medium] - rank[b.priority ?? Priority.Medium]
  )
}

export { Priority }
