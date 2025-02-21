'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Task } from '@/lib/types';
import { getAvatarStyle } from '@/lib/users';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/store/task-store';
import { motion } from 'framer-motion';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { StatusBadge } from './status-badge';
import { Checkbox } from '@/components/ui/checkbox';

interface KanbanCardProps {
  task: Task;
  onClick?: () => void;
  className?: string;
  isSelected?: boolean;
  selectionMode?: boolean;
  onSelect?: (taskId: number) => void;
}

export function KanbanCard({
  task,
  onClick,
  className,
  isSelected = false,
  selectionMode = false,
  onSelect
}: KanbanCardProps) {
  const updateTask = useTaskStore((state) => state.updateTask);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (title.trim() && title !== task.title) {
      updateTask({ ...task, title });
      toast.success('Task title updated!');
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleBlur = () => handleSave();

  const handleSelectionChange = (checked: boolean) => {
    if (checked) {
      onSelect && onSelect(task.id);
    } else {
      onSelect && onSelect(-1); 
    }
  };

  return (
    <motion.div
      layout
      className={className}
      initial={isSelected ? { scale: 0.98 } : { scale: 1 }}
      animate={isSelected ? { scale: 1, backgroundColor: 'rgb(243, 232, 255)' } : { scale: 1 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Card
        className={cn(
          "cursor-pointer transition-all",
          isSelected
            ? "border-purple-300 bg-purple-50"
            : "hover:border-primary/50",
          selectionMode && !isSelected && isHovering && "hover:border-purple-200 hover:bg-purple-50/50"
        )}
        onClick={onClick}
      >
        <CardHeader className="p-4 flex flex-row items-start justify-between">
          <div className="flex items-start gap-2">
            {isEditing ? (
              <motion.input
                layout="position"
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="w-full rounded border bg-white px-2 py-1 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <motion.h3
                layout="position"
                className={cn(
                  "cursor-text font-medium text-lg hover:underline",
                  isSelected && "text-purple-700"
                )}
                onClick={(e) => {
                  if (!selectionMode) {
                    e.stopPropagation();
                    setIsEditing(true);
                  }
                }}
              >
                {task.title}
              </motion.h3>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2 p-4 pt-0">
          <div className="flex items-center gap-2">
            <div className="-space-x-2 flex">
              {task.assignees.map((assignee, index) => {
                const style = getAvatarStyle(assignee.id);
                const initials = assignee.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('');

                return (
                  <Avatar
                    key={assignee.id}
                    className={cn(
                      'h-8 w-8 border-2 border-background',
                      index > 0 && '-ml-3',
                      'transition-all duration-200 hover:ml-0'
                    )}
                  >
                    <AvatarImage src={assignee.avatar} />
                    <AvatarFallback
                      className={`bg-purple-100 text-xs ${style.text}`}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <motion.span layout="position">
              <StatusBadge type="priority" value={task.priority} />
            </motion.span>
            <motion.span
              layout="position"
              className={`status-${task.status.replace('_', '')}`}
            >
              <StatusBadge type="status" value={task.status} />
            </motion.span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
