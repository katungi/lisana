import { Task } from "@/lib/types";
import {
    Table,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Edit, Filter, Settings, SortAsc, Trash2, Users } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { useState } from "react";

interface TableViewProps {
    tasks: Task[];
}

export default function TableView({ tasks }: TableViewProps) {
    const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTitleEdit = (id: number, title: string) => {
        console.log(`Editing task ${id} with title ${title}`);
    };
    return (
        <div className="rounded-lg border bg-background-card">
            <div className="p-4 flex justify-between items-center border-b">
                <Button
                    variant="default"
                    className="gap-2"
                >
                    + Add task
                </Button>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => alert("List view clicked")}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <SortAsc className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Users className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {tasks.length === 0
                ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <p className="text-muted-foreground mb-4">
                            No tasks yet. Create your first task!
                        </p>
                        <Button>Create Task</Button>
                    </div>
                )
                : (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Task Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead className="w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <tbody>
                            {tasks.map((task) => (
                                <TableRow key={task.id} className="group">
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedTasks.includes(
                                                task.id,
                                            )}
                                            onCheckedChange={(checked) => {
                                                setSelectedTasks(
                                                    checked
                                                        ? [
                                                            ...selectedTasks,
                                                            task.id,
                                                        ]
                                                        : selectedTasks.filter((
                                                            id,
                                                        ) => id !== task.id),
                                                );
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={task.title}
                                            onChange={(e) =>
                                                handleTitleEdit(
                                                    task.id,
                                                    e.target.value,
                                                )}
                                            className="bg-transparent border-none hover:bg-background focus:bg-background"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {task.status.replace("_", " ")}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`priority-${task.priority}`}
                                        >
                                            {task.priority}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setEditingTask(task);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </tbody>
                    </Table>
                )}
        </div>
    );
}
