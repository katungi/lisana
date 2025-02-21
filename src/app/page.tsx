"use client";
import TableView from "@/components/table-view";
import { mockTasks } from "../../data/mock-tasks";
import { Button } from "@/components/ui/button";
import { SquareKanban, Table } from "lucide-react";
import { useTheme } from "next-themes";
import { useTaskStore } from "@/store/task-store";
import { Toaster } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Home() {
  const tasks = useTaskStore((state) => state.tasks);
  const [activeView, setActiveView] = useState("table");

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  return (
    <div className="min-h-screen p-8">
      <Toaster position="top-right" richColors />
      <header className="mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-primary-100 text-8xl font-black tracking-tight leading-none">
            LISANA
          </h1>
        </div>

        <div className="bg-gray-100 p-1 rounded-lg inline-flex items-center mt-8">
          <motion.button
            onClick={() => handleViewChange("table")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all",
              activeView === "table"
                ? "bg-purple-100 text-primary shadow-sm"
                : "text-muted-foreground hover:text-primary",
            )}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Table size={18} />
            <span className="font-medium">List View</span>
          </motion.button>

          <motion.button
            onClick={() => handleViewChange("kanban")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all",
              activeView === "kanban"
                ? "bg-purple-100 text-primary shadow-sm"
                : "text-muted-foreground hover:text-primary",
            )}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SquareKanban size={18} />
            <span className="font-medium">Kanban View</span>
          </motion.button>
        </div>
      </header>
      <main>
        <TableView tasks={tasks} />
      </main>
    </div>
  );
}
