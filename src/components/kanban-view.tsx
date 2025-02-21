'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Task } from '@/lib/types';
import { users } from '@/lib/users';
import { useTaskStore } from '@/store/task-store';
import {
  DragDropContext,
  Draggable,
  type DropResult,
  Droppable,
} from '@hello-pangea/dnd';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleX, FilterIcon, Plus, Search, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { KanbanCard } from './kanban-card';
import { TaskModal } from './task-modal';

type Column = {
  id: Task['status'];
  title: string;
};

export function KanbanView() {
  const { tasks, addTask, updateTask } = useTaskStore();
  const [columns] = useState<Column[]>([
    { id: 'not_started', title: 'Not Started' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'completed', title: 'Completed' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'priority' | 'title' | 'created'>(
    'created'
  );
  const [activeUserFilters, setActiveUserFilters] = useState<string[]>([]);

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
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

    const taskId = Number.parseInt(draggableId);
    const taskToMove = tasks.find((task) => task.id === taskId);

    if (!taskToMove) return;

    const updatedTask = {
      ...taskToMove,
      status: destination.droppableId as Task['status'],
    };

    updateTask(updatedTask);
  };

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch = task.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesUserFilter =
          activeUserFilters.length === 0 ||
          task.assignees.some((assignee) =>
            activeUserFilters.includes(assignee.id)
          );
        return matchesSearch && matchesUserFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'priority':
            return (
              ['high', 'medium', 'low', 'none'].indexOf(a.priority) -
              ['high', 'medium', 'low', 'none'].indexOf(b.priority)
            );
          case 'title':
            return a.title.localeCompare(b.title);
          case 'created':
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          default:
            return 0;
        }
      });
  }, [tasks, searchTerm, sortBy, activeUserFilters]);

  const toggleUserFilter = (userId: string) => {
    setActiveUserFilters((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveUserFilters([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <div className="flex justify-end gap-4">
          {/* Clear Filters Button */}
          <AnimatePresence>
            {(searchTerm || activeUserFilters.length > 0) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground text-xs hover:text-foreground"
                >
                  <CircleX size={16} />
                  Clear filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="relative w-64">
            <div className="flex items-center">
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8 pl-9"
              />
              <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="-translate-y-1/2 absolute top-1/2 right-3 transform text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <Select
            value={sortBy}
            onValueChange={(value: typeof sortBy) => setSortBy(value)}
          >
            <SelectTrigger className="flex w-40 items-center gap-2">
              <FilterIcon className="h-4 w-4" />
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">A-Z</SelectItem>
              <SelectItem value="created">Newest First</SelectItem>
            </SelectContent>
          </Select>
          {/* User Filter */}
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={
                    activeUserFilters.length > 0
                      ? 'bg-purple-100 text-purple-600'
                      : ''
                  }
                >
                  <Users className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="flex flex-col gap-1">
                  {users.map((user) => (
                    <Button
                      key={user.id}
                      variant="ghost"
                      className={`justify-start gap-2 ${
                        activeUserFilters.includes(user.id)
                          ? 'bg-purple-100 text-purple-600'
                          : ''
                      }`}
                      onClick={() => toggleUserFilter(user.id)}
                    >
                      <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-purple-300 font-medium text-sm">
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      {user.name}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <AnimatePresence>
              {activeUserFilters.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <div className="ml-2 flex">
                    {activeUserFilters.map((userId) => {
                      const user = users.find((u) => u.id === userId);
                      return user ? (
                        <Avatar
                          key={userId}
                          className="-ml-3 h-8 w-8 border-2 border-background transition-all duration-200 hover:ml-0"
                        >
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-purple-300 font-medium text-sm">
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                      ) : null;
                    })}
                  </div>
                  <span className="ml-2 text-muted-foreground text-sm">
                    {activeUserFilters.length} selected
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{column.title}</h3>
                  <span className="text-muted-foreground text-sm">
                    {
                      filteredAndSortedTasks.filter(
                        (task) => task.status === column.id
                      ).length
                    }
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
                    className={`min-h-[500px] rounded-lg border bg-background p-4 transition-colors ${
                      snapshot.isDraggingOver ? 'border-primary/50' : ''
                    }`}
                  >
                    <div>
                      {filteredAndSortedTasks
                        .filter((task) => task.status === column.id)
                        .map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  opacity: snapshot.isDragging ? 0.8 : 1,
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedTask(task);
                                }}
                              >
                                <KanbanCard task={task} className="mb-3" />
                                {snapshot.draggingOver && (
                                  <div className="mt-2 h-24 rounded-md bg-purple-100" />
                                )}
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
          } else {
            handleAddTask({
              ...newTask,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
          setIsModalOpen(false);
          setSelectedColumn(null);
          setSelectedTask(null);
        }}
        task={{
          id: new Date().getTime(),
          title: '',
          priority: 'none',
          status: selectedColumn?.id || 'not_started',
          assignees: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          customFields: [],
        }}
      />
    </div>
  );
}
