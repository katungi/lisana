type Priority = 'low' | 'medium' | 'high' | 'none';

export interface Task {
    id: number;
    title: string;
    status: string;
    priority: Priority;
}