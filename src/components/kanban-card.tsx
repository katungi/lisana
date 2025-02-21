"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Task } from "@/lib/types";
import { getAvatarStyle } from "@/lib/users";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  task: Task;
  onClick?: () => void;
  className?: string;
}

export function KanbanCard({ task, onClick, className }: KanbanCardProps) {
  return (
    <motion.div
      layout
      className={className}
    >
      <Card
        className="cursor-pointer hover:border-primary/50 transition-colors"
        onClick={onClick}
      >
        <CardHeader className="p-4">
          <motion.h3 layout="position" className="text-sm font-medium">
            {task.title}
          </motion.h3>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {task.assignees.map((assignee, index) => {
                const style = getAvatarStyle(assignee.id);
                const initials = assignee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("");

                return (
                  <Avatar
                    key={assignee.id}
                    className={cn(
                        "h-8 w-8 border-2 border-background",
                        index > 0 && "-ml-3", // Stack effect
                        "transition-all duration-200 hover:ml-0", // Hover effect
                    )}
                  >
                    <AvatarImage src={assignee.avatar} />
                    <AvatarFallback
                      className={cn("text-xs", style.bg, style.text)}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <motion.span
              layout="position"
              className={`priority-${task.priority}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </motion.span>
            <motion.span
              layout="position"
              className={`status-${task.status.replace("_", "")}`}
            >
              {task.status.replace("_", " ")}
            </motion.span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
