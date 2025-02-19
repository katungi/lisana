import TableView from "@/components/table-view";
import { mockTasks } from "../../data/mock-tasks";


export default function Home() {

  return (
   <TableView tasks={mockTasks} />
  );
}
