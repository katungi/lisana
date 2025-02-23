'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ActiveFilters, Priority, Status, Task } from '@/lib/types';
import { getAvatarStyle, users } from '@/lib/users';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/store/task-store';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Edit,
  Filter,
  MoveRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { StatusBadge } from './status-badge';
import TableFilters from './table-filters';
import { TaskModal } from './task-modal';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

type SortDirection = 'asc' | 'desc';
type SortField = 'title' | 'status' | 'priority' | 'created';

export default function TableView() {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [allSelected, setAllSelected] = useState<boolean>(false);

  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [title, setTitle] = useState(selectedTask?.title);
  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);

  const inputRef = useRef<HTMLInputElement>(null);
  // Filtering and sorting state
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    search: '',
    status: [],
    priority: [],
    users: [],
    sort: 'created_desc',
  });
  const [sortField, setSortField] = useState<SortField>('created');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [titleFilter, setTitleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<Priority[]>([]);

  // Pagination state
  const tasksPerPage = 10;
  const [pageSize, setPageSize] = useState(tasksPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  // Update filtered tasks when filters or tasks change
  useEffect(() => {
    const updatedFilters: ActiveFilters = {
      search: titleFilter,
      status: statusFilter,
      priority: priorityFilter,
      users: activeFilters.users,
      sort: `${sortField}_${sortDirection}`,
    };
    setActiveFilters(updatedFilters);
    setFilteredTasks(filterTasks(updatedFilters));
  }, [
    titleFilter,
    statusFilter,
    priorityFilter,
    activeFilters.users,
    sortField,
    sortDirection,
    tasks,
  ]);

  const handleSave = async () => {
    if (title?.trim() && title !== selectedTask?.title) {
      updateTask({ ...selectedTask, title } as Task);
      toast.success('Task title updated!');
    }
    setEditingTitleId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setTitle(selectedTask?.title); // Reset title if editing is canceled
      setEditingTitleId(null);
    }
  };

  const handleBlur = () => handleSave();

  const handleDeleteSingleTask = (id: number) => {
    deleteTask(id);
    toast.success('Task deleted');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if already sorting by this field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-1 inline h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 inline h-4 w-4" />
    );
  };

  const filterTasks = (filters: ActiveFilters): Task[] => {
    return tasks
      .filter((task) => {
        // Search filter
        if (
          filters.search &&
          !task.title.toLowerCase().includes(filters.search.toLowerCase())
        ) {
          return false;
        }

        // Status filter
        if (
          filters.status.length > 0 &&
          !filters.status.includes(task.status)
        ) {
          return false;
        }

        // Priority filter
        if (
          filters.priority.length > 0 &&
          !filters.priority.includes(task.priority)
        ) {
          return false;
        }

        // User filter
        if (
          filters.users.length > 0 &&
          !task.assignees.some((assignee) =>
            filters.users.includes(assignee.id)
          )
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sorting logic
        switch (filters.sort) {
          case 'title_asc':
            return a.title.localeCompare(b.title);
          case 'title_desc':
            return b.title.localeCompare(a.title);
          case 'status_asc':
            return a.status.localeCompare(b.status);
          case 'status_desc':
            return b.status.localeCompare(a.status);
          case 'priority_asc':
            const priorityOrder = {
              none: 0,
              low: 1,
              medium: 2,
              high: 3,
              urgent: 4,
            };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          case 'priority_desc':
            const priorityOrderDesc = {
              none: 0,
              low: 1,
              medium: 2,
              high: 3,
              urgent: 4,
            };
            return (
              priorityOrderDesc[b.priority] - priorityOrderDesc[a.priority]
            );
          case 'created_asc':
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case 'created_desc':
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          default:
            return 0;
        }
      });
  };

  // Helper to get all unique status values
  const getUniqueStatuses = () => {
    return [...new Set(tasks.map((task) => task.status))];
  };

  // Helper to get all unique priority values
  const getUniquePriorities = () => {
    return [...new Set(tasks.map((task) => task.priority))];
  };

  const showClearFilters = (): boolean => {
    return priorityFilter.length > 0 || statusFilter.length > 0;
  };

  return (
    <div className="rounded-lg border border-gray-100 bg-background-card">
      <div className="flex items-center justify-between border-b p-4">
        <Button
          variant="default"
          className="flex items-center gap-2 px-4 py-2"
          size="lg"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Add task
        </Button>
        <TableFilters
          tasks={tasks}
          users={users}
          onFiltersChange={(filters) => {
            setActiveFilters({
              ...activeFilters,
              users: filters.users,
            });
          }}
          searchValue={titleFilter}
          onSearchChange={setTitleFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          showClearFilters={showClearFilters()}
          bulkAction={allSelected}
          onBulkActionChange={() => {
            setAllSelected(!allSelected);
            console.log(selectedTasks)
            selectedTasks.forEach((id) => {
              deleteTask(id);
            });
          }}
        />
      </div>
      {tasks.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center">
          <p className="mb-4 text-muted-foreground">
            No tasks yet. Create your first task!
          </p>
          <Button onClick={() => setIsModalOpen(true)} className="px-4 py-2 ">
            Create Task
          </Button>
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableCell>
                  <Checkbox
                    checked={
                      selectedTasks.length === currentTasks.length &&
                      currentTasks.length > 0
                    }
                    onCheckedChange={(checked) => {
                      setSelectedTasks(
                        checked ? currentTasks.map((task) => task.id) : []
                      );
                      setAllSelected(true);
                    }}
                  />
                </TableCell>
                <TableHead
                  className="cursor-pointer font-bold text-lg"
                  onClick={() => handleSort('title')}
                >
                  Task Name {getSortIcon('title')}
                </TableHead>
                <TableHead>
                  <div className="flex items-center font-bold text-lg">
                    <span
                      className="mr-2 cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      Status {getSortIcon('status')}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {getUniqueStatuses().map((status) => (
                          <DropdownMenuItem key={status}>
                            <Checkbox
                              id={`status-${status}`}
                              checked={statusFilter.includes(status)}
                              onCheckedChange={(checked) => {
                                setStatusFilter(
                                  checked
                                    ? [...statusFilter, status]
                                    : statusFilter.filter((s) => s !== status)
                                );
                              }}
                              className="mr-2"
                            />
                            <label htmlFor={`status-${status}`}>
                              {status.replace('_', ' ')}
                            </label>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center font-bold text-lg">
                    <span
                      className="mr-2 cursor-pointer"
                      onClick={() => handleSort('priority')}
                    >
                      Priority {getSortIcon('priority')}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {getUniquePriorities().map((priority) => (
                          <DropdownMenuItem key={priority}>
                            <Checkbox
                              id={`priority-${priority}`}
                              checked={priorityFilter.includes(priority)}
                              onCheckedChange={(checked) => {
                                setPriorityFilter(
                                  checked
                                    ? [...priorityFilter, priority]
                                    : priorityFilter.filter(
                                      (p) => p !== priority
                                    )
                                );
                              }}
                              className="mr-2"
                            />
                            <label htmlFor={`priority-${priority}`}>
                              {priority}
                            </label>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
                <TableHead className="w-64 font-bold text-lg">
                  Assignee
                </TableHead>
                <TableHead className="w-24 font-bold text-lg">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center">
                    No tasks match your filters
                  </TableCell>
                </TableRow>
              ) : (
                currentTasks.map((task) => (
                  <TableRow key={task.id} className="group">
                    <TableCell>
                      <Checkbox
                        checked={selectedTasks.includes(task.id)}
                        onCheckedChange={(checked) => {
                          setSelectedTasks(
                            checked
                              ? [...selectedTasks, task.id]
                              : selectedTasks.filter((id) => id !== task.id)
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {editingTitleId === task.id.toString() ? (
                        <motion.input
                          layout="position"
                          ref={inputRef}
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          onKeyDown={handleKeyDown}
                          onBlur={handleBlur}
                          className="w-full rounded border bg-white px-2 py-1 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <motion.h3
                          layout="position"
                          className="cursor-text font-medium text-lg hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                            setTitle(task.title);
                            setEditingTitleId(task.id.toString());
                          }}
                        >
                          {task.title}
                        </motion.h3>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge type="status" value={task.status} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge type="priority" value={task.priority} />
                    </TableCell>
                    <TableCell className="w-48 md:w-64">
                      <div className="-space-x-3 flex justify-start transition-all duration-300 hover:space-x-1">
                        {task.assignees.length > 0 ? (
                          task.assignees.map((assignee, index) => {
                            const style = getAvatarStyle(assignee.id);
                            const initials = assignee.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('');

                            return (
                              <Avatar
                                key={assignee.id}
                                className={cn(
                                  'flex h-8 w-8 items-center border-2 border-background bg-purple-100 transition-all duration-200',
                                  index >= 4 && 'hidden md:flex'
                                )}
                                title={assignee.name}
                              >
                                <AvatarFallback className={`ml-1.5 text-md`}>
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Unassigned
                          </span>
                        )}
                        {task.assignees.length > 4 && (
                          <Avatar className="h-8 w-8 border-2 border-background">
                            <AvatarFallback className="bg-gray-200 text-xs">
                              +{task.assignees.length - 4}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSingleTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="flex items-center justify-between p-4">
        <div>
          Showing {indexOfFirstTask + 1} to{' '}
          {Math.min(indexOfLastTask, tasks.length)} of {tasks.length} tasks
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={indexOfLastTask >= tasks.length}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(undefined);
        }}
        onSave={() => {
          setIsModalOpen(false);
          setEditingTask(undefined);
        }}
        customFields={[]}
        onAddCustomField={() => { }}
        onRemoveCustomField={() => { }}
      />
    </div>
  );
}
