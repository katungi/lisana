"use client"
import TableView from "@/components/table-view";
import { mockTasks } from "../../data/mock-tasks";
import { Button } from "@/components/ui/button";
import { SquareKanban, Table } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
      <h1 className="text-primary-100 text-8xl font-black tracking-tight leading-none">
        LISANA
      </h1>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant={"outline"}
              className="gap-2"
              onClick={() => alert("List view clicked")}
            >
              <Table size={24} />
            </Button>
            <Button
              variant={"outline"}
              className="gap-2"
              onClick={() => alert("Grid view clicked")}
            >
              <SquareKanban size={24} />
            </Button>
          </div>
        </div>
      </header>
      <main>
        <TableView tasks={mockTasks} />
      </main>
    </div>
  );
}
