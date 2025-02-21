"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Task } from "@/lib/types";
import { getAvatarStyle } from "@/lib/users";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { useTaskStore } from "@/store/task-store";
import { toast } from "sonner";

interface KanbanCardProps {
  task: Task;
  onClick?: () => void;
  className?: string;
}

export function KanbanCard({ task, onClick, className }: KanbanCardProps) {
  const updateTask = useTaskStore((state) => state.updateTask);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
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
      toast.success("Task title updated!");
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleBlur = () => handleSave();

  return (
    <motion.div layout className={className}>
      <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={onClick}>
        <CardHeader className="p-4">
          {isEditing ? (
            <motion.input
              layout="position"
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="w-full text-sm font-medium border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            />
          ) : (
            <motion.h3
              layout="position"
              className="text-lg font-medium hover:underline cursor-text"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              {task.title}
            </motion.h3>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {task.assignees.map((assignee, index) => {
                const style = getAvatarStyle(assignee.id);
                const initials = assignee.name.split(" ").map((n) => n[0]).join("");

                return (
                  <Avatar
                    key={assignee.id}
                    className={cn(
                      "h-8 w-8 border-2 border-background",
                      index > 0 && "-ml-3",
                      "transition-all duration-200 hover:ml-0"
                    )}
                  >
                    <AvatarImage src={assignee.avatar} />
                    <AvatarFallback className={`text-xs bg-purple-100 ${style.text}`}>
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
            <motion.span layout="position" className={`status-${task.status.replace("_", "")}`}>
              <StatusBadge type="status" value={task.status} />
            </motion.span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
