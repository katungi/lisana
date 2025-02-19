import { Task } from "@/lib/types";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface TableViewProps {
    tasks: Task[];
}

export default function TableView({ tasks }: TableViewProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                </TableRow>
            </TableHeader>
            <tbody>
                {tasks.map((task) => (
                    <TableRow key={task.id}>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>{task.priority}</TableCell>
                    </TableRow>
                ))}
            </tbody>
        </Table>
    );
}
