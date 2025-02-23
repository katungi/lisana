import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { ActiveFilters, Priority, Status, Task, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleX, Search, Trash, Users } from 'lucide-react';
import { useState } from 'react';

interface TableFiltersProps {
  tasks: Task[];
  users: User[];
  onFiltersChange: (filters: ActiveFilters) => void;
  statusFilter: Status[];
  priorityFilter: Priority[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (statuses: Status[]) => void;
  onPriorityFilterChange: (priorities: Priority[]) => void;
  showClearFilters?: boolean;
  bulkAction: boolean;
  onBulkActionChange: () => void;
}

const TableFilters = ({
  tasks,
  users,
  onFiltersChange,
  statusFilter,
  priorityFilter,
  searchValue,
  onSearchChange,
  onStatusFilterChange,
  onPriorityFilterChange,
  showClearFilters,
  bulkAction,
  onBulkActionChange,
}: TableFiltersProps) => {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    search: searchValue,
    status: statusFilter,
    priority: priorityFilter,
    users: [],
    sort: '',
  });

  // Function to toggle user filter
  const toggleUserFilter = (userId: string) => {
    const currentUsers = [...activeFilters.users];
    const newUsers = currentUsers.includes(userId)
      ? currentUsers.filter((id) => id !== userId)
      : [...currentUsers, userId];

    const updated = { ...activeFilters, users: newUsers };
    setActiveFilters(updated);
    onFiltersChange(updated);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      status: [],
      priority: [],
      users: [],
      sort: '',
    };
    setActiveFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    onSearchChange('');
    onStatusFilterChange([]);
    onPriorityFilterChange([]);
  };

  const hasActiveFilters =
    showClearFilters ||
    searchValue ||
    statusFilter.length > 0 ||
    priorityFilter.length > 0 ||
    activeFilters.users.length > 0;

  const renderUserAvatar = (user: User, index = 0) => (
    <Avatar
      className={cn(
        'h-8 w-8 border-2 border-background',
        index > 0 && '-ml-3', // Stack effect
        'transition-all duration-200 hover:ml-0' // Hover effect
      )}
    >
      <AvatarImage src={user.avatar} />
      <AvatarFallback
        className={cn(
          `bg-purple-300 ${user.style.text}`,
          'font-medium text-sm'
        )}
      >
        {user.name
          .split(' ')
          .map((n) => n[0])
          .join('')}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <div className="flex items-center gap-2">
      {/* Clear filters button */}
      <AnimatePresence>
        {hasActiveFilters && (
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


      {bulkAction && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => onBulkActionChange()}
              className='bg-red-600'
            >
              <Trash size={18} className='text-white' />
            </Button>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Search input */}
      <div className="relative flex items-center">
        <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-[200px] pl-8 lg:w-64"
        />
      </div>

      {/* User filter */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                activeFilters.users.length > 0 &&
                'bg-purple-100 text-purple-600'
              )}
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
                  className={cn(
                    'justify-start gap-2',
                    activeFilters.users.includes(user.id) &&
                    'bg-purple-100 text-purple-600'
                  )}
                  onClick={() => toggleUserFilter(user.id)}
                >
                  {renderUserAvatar(user)}
                  {user.name}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <AnimatePresence>
          {activeFilters.users.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <div className="flex">
                {activeFilters.users.map((userId, index) => {
                  const user = users.find((u) => u.id === userId);
                  if (!user) return null;
                  return (
                    <motion.div
                      key={userId}
                      initial={{
                        opacity: 0,
                        scale: 0.5,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.5,
                        x: -20,
                      }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.1,
                      }}
                    >
                      {renderUserAvatar(user, index)}
                    </motion.div>
                  );
                })}
              </div>
              {activeFilters.users.length > 0 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-2 text-muted-foreground text-sm"
                >
                  {activeFilters.users.length} selected
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TableFilters;
