'use client';
import { KanbanView } from '@/components/kanban-view';
import TableView from '@/components/table-view';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { SquareKanban, Table } from 'lucide-react';
import { useState } from 'react';
import { Toaster } from 'sonner';

export default function Home() {
  const [activeView, setActiveView] = useState('table');

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  return (
    <div className="min-h-screen p-8">
      <Toaster position="top-right" richColors />
      <header className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="font-black text-8xl text-primary-100 leading-none tracking-tight">
            LISANA
          </h1>
        </div>

        <div className="mt-8 inline-flex items-center rounded-lg bg-gray-100 p-1">
          <motion.button
            onClick={() => handleViewChange('table')}
            className={cn(
              'flex items-center gap-2 rounded-md px-4 py-2 transition-all',
              activeView === 'table'
                ? 'bg-purple-100 text-primary shadow-sm'
                : 'text-muted-foreground hover:text-primary'
            )}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Table size={18} />
            <span className="font-medium">List View</span>
          </motion.button>

          <motion.button
            onClick={() => handleViewChange('kanban')}
            className={cn(
              'flex items-center gap-2 rounded-md px-4 py-2 transition-all',
              activeView === 'kanban'
                ? 'bg-purple-100 text-primary shadow-sm'
                : 'text-muted-foreground hover:text-primary'
            )}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SquareKanban size={18} />
            <span className="font-medium">Kanban View</span>
          </motion.button>
        </div>
      </header>
      <main>{activeView === 'table' ? <TableView /> : <KanbanView />}</main>
    </div>
  );
}
