"use client";
import TableView from "@/components/table-view";
import { mockTasks } from "../../data/mock-tasks";
import { Button } from "@/components/ui/button";
import { SquareKanban, Table } from "lucide-react";
import { useTheme } from "next-themes";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-primary-100 text-8xl font-black tracking-tight leading-none">
            LISANA
          </h1>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 mt-3">
            <Button
              variant={"outline"}
              className="gap-2"
              onClick={() => alert("List view clicked")}
            >
              <Table size={24} />
              Table
            </Button>
            <Button
              variant={"outline"}
              className="gap-2"
              onClick={() => alert("Grid view clicked")}
            >
              <SquareKanban size={24} />
              Kanban
            </Button>
          </div>
        </div>
      </header>
      <main>
        <TableView tasks={[]} />
      </main>
    </div>
  );
}
