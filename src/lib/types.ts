type Status = "not_started" | "in_progress" | "completed";
type Priority = "none" | "low" | "medium" | "high" | "urgent";

export type Task = {
    id: number
    title: string
    status: "not_started" | "in_progress" | "completed"
    priority: "none" | "low" | "medium" | "high"
    assignees: User[]
    description?: string
    createdAt: string
    updatedAt: string
    order?: number
    customFields: any[]
  }

export type User = {
    id: string
    name: string
    email: string
    avatar?: string
    color: string, 
    style: {
      bg: string
      text: string
    }
  }
  