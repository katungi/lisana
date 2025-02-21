import { Task } from '@/lib/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TaskStore {
    tasks: Task[];
    addTask: (task: Task) => void;
    updateTask: (task: Task) => void;
    deleteTask: (taskId: number) => void;
}

export const useTaskStore = create(
    persist<TaskStore>((set) => ({
        tasks: [],
        addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
        updateTask: (task) => set((state) => ({
            tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
        })),
        deleteTask: (taskId) => set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== taskId),
        })),
    }), { name: 'task-store' })
)