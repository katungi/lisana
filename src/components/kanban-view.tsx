"use client";

import { useEffect, useState } from "react";
import {
    DragDropContext,
    Draggable,
    Droppable,
    type DropResult,
} from "@hello-pangea/dnd";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { Task } from "@/lib/types";
import { TaskModal } from "./task-modal";
import { KanbanCard } from "./kanban-card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTaskStore } from "@/store/task-store";

type Column = {
    id: Task["status"];
    title: string;
};

export function KanbanView() {
    const { tasks, addTask, updateTask } = useTaskStore();
    const [columns] = useState<Column[]>([
        { id: "not_started", title: "Not Started" },
        { id: "in_progress", title: "In Progress" },
        { id: "completed", title: "Completed" },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"priority" | "title" | "created">(
        "created",
    );

    const handleAddTask = (newTask: Omit<Task, "id">) => {
        const task = { ...newTask, id: Date.now() }; // Generate a unique ID
        addTask(task);
    };

    const handleUpdateTask = (updatedTask: Task) => {
        updateTask(updatedTask);
    };

    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const taskId = parseInt(draggableId);
        const taskToMove = tasks.find((task) => task.id === taskId);

        if (!taskToMove) return;

        const updatedTask = {
            ...taskToMove,
            status: destination.droppableId as Task["status"],
        };

        updateTask(updatedTask);
    };

    const filteredAndSortedTasks = tasks
        .filter(
            (task) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "priority":
                    return (
                        ["high", "medium", "low", "none"].indexOf(a.priority) -
                        ["high", "medium", "low", "none"].indexOf(b.priority)
                    );
                case "title":
                    return a.title.localeCompare(b.title);
                case "created":
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
                default:
                    return 0;
            }
        });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={searchTerm}
                            size={48}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select
                        value={sortBy}
                        onValueChange={(value: typeof sortBy) =>
                            setSortBy(value)}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="priority">Priority</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                            <SelectItem value="created">
                                Created Date
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map((column) => (
                        <div key={column.id} className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold">
                                        {column.title}
                                    </h3>
                                    <span className="text-sm text-muted-foreground">
                                        {filteredAndSortedTasks.filter((task) =>
                                            task.status === column.id
                                        ).length}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setSelectedColumn(column);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`bg-background p-4 rounded-lg min-h-[500px] border transition-colors ${
                                            snapshot.isDraggingOver
                                                ? "border-primary/50"
                                                : ""
                                        }`}
                                    >
                                        <div>
                                            {filteredAndSortedTasks
                                                .filter((task) =>
                                                    task.status === column.id
                                                )
                                                .map((task, index) => (
                                                    <Draggable
                                                        key={task.id}
                                                        draggableId={task.id
                                                            .toString()}
                                                        index={index}
                                                    >
                                                        {(
                                                            provided,
                                                            snapshot,
                                                        ) => (
                                                            <div
                                                                ref={provided
                                                                    .innerRef}
                                                                {...provided
                                                                    .draggableProps}
                                                                {...provided
                                                                    .dragHandleProps}
                                                                style={{
                                                                    ...provided
                                                                        .draggableProps
                                                                        .style,
                                                                    opacity:
                                                                        snapshot
                                                                                .isDragging
                                                                            ? 0.8
                                                                            : 1,
                                                                }}
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    setSelectedTask(
                                                                        task,
                                                                    );
                                                                }}
                                                            >
                                                                <KanbanCard
                                                                    task={task}
                                                                    className="mb-3"
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                        </div>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedColumn(null);
                }}
                onSave={(newTask) => {
                    if (selectedTask) {
                        handleUpdateTask({ ...selectedTask, ...newTask });
                    }
                    setIsModalOpen(false);
                    setSelectedColumn(null);
                    setSelectedTask(null);
                }}
                task={selectedTask || undefined}
            />
        </div>
    );
}
