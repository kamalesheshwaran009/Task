// task.model.ts
export interface Task {
  _id?: string;
  title: string;
  dueDate?: Date;
  description?: string;
  category?: string;
  status: 'to-do' | 'in-progress' | 'completed';
  userId: string;
}
