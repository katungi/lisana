export type Status = 'not_started' | 'in_progress' | 'completed';
export type Priority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

export type Task = {
  id: number;
  title: string;
  status: Status;
  priority: Priority;
  assignees: User[];
  createdAt: string;
  updatedAt: string;
  order?: number;
  customFields: any[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
  style: {
    bg: string;
    text: string;
  };
};

export interface ActiveFilters {
  search: string;
  status: Status[];
  priority: Priority[];
  users: string[];
  sort: string;
}
