type Status = "not_started" | "in_progress" | "completed";
type Priority = "none" | "low" | "medium" | "high" | "urgent";

export interface Task {
    id: number;
    title: string;
    status: Status;
    priority: Priority;
}
