import { Task } from "@/lib/types";

interface TableViewProps {
    tasks: Task[];
}

export default function TableView({ tasks }: TableViewProps) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((task) => (
                    <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>{task.status}</td>
                        <td>{task.priority}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
