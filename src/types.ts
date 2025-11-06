// src/types.ts
export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface Todo {
  id: string
  title: string
  completed: boolean
  // NEW optional priority field
  priority?: Priority
}
