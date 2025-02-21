import { cn } from '@/lib/utils';

export type Status = 'not_started' | 'in_progress' | 'completed';
export type Priority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

interface BadgeProps {
  type: 'status' | 'priority';
  value: Status | Priority;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  not_started: 'bg-gray-200 text-gray-800',
  in_progress: 'bg-blue-200 text-blue-800',
  completed: 'bg-green-200 text-green-800',
};

const priorityStyles: Record<Priority, string> = {
  none: 'bg-gray-200 text-gray-800',
  low: 'bg-green-200 text-green-800',
  medium: 'bg-yellow-200 text-yellow-800',
  high: 'bg-orange-200 text-orange-800',
  urgent: 'bg-red-200 text-red-800',
};

export function StatusBadge({ type, value, className }: BadgeProps) {
  const styles =
    type === 'status'
      ? statusStyles[value as Status]
      : priorityStyles[value as Priority];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-xl px-3 py-2 font-medium text-xs',
        styles,
        className
      )}
    >
      {value.replace('_', ' ')}
    </span>
  );
}
