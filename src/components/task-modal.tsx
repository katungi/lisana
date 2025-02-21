"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, ChevronsUpDown } from "lucide-react";
import type { Priority, Status, Task, User } from "@/lib/types";
import { getAvatarStyle, users } from "@/lib/users";
import { cn } from "@/lib/utils";

const taskSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    status: z.enum(["not_started", "in_progress", "completed"]),
    priority: z.enum(["none", "low", "medium", "high", "urgent"]),
    description: z.string().optional(),
    assignees: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            email: z.string().email(),
        }),
    ),
    customFields: z.array(
        z.object({
            fieldId: z.string(),
            value: z.any(),
        }),
    ),
});

type TaskFormValues = z.infer<typeof taskSchema>;

type TaskModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
    task?: Task;
    customFields?: any[];
    onAddCustomField?: (field: any) => void;
    onRemoveCustomField?: (fieldId: string) => void;
};

export function TaskModal({
    isOpen,
    onClose,
    onSave,
    task,
    customFields = [],
    onAddCustomField,
    onRemoveCustomField,
}: TaskModalProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: task?.title || "",
            status: task?.status || "not_started",
            priority: task?.priority || "none",
            description: task?.description || "",
            assignees: task?.assignees || [],
            customFields: task?.customFields || [],
        },
    });

    useEffect(() => {
        if (task) {
            form.reset({
                title: task.title,
                status: task.status,
                priority: task.priority,
                description: task.description || "",
                assignees: task.assignees,
                customFields: task.customFields,
            });
        } else {
            form.reset({
                title: "",
                status: "not_started",
                priority: "none",
                description: "",
                assignees: [],
                customFields: [],
            });
        }
    }, [task, form]);

    const onSubmit = (values: TaskFormValues) => {
        onSave({
            title: values.title,
            status: values.status,
            priority: values.priority,
            description: values.description,
            assignees: values.assignees as any,
            customFields: values.customFields,
        });
        onClose();
    };

    const toggleAssignee = (user: User) => {
        const currentAssignees = form.getValues("assignees");
        const isAssigned = currentAssignees.some((a) => a.id === user.id);

        if (isAssigned) {
            form.setValue(
                "assignees",
                currentAssignees.filter((a) => a.id !== user.id),
            );
        } else {
            form.setValue("assignees", [...currentAssignees, user]);
        }
    };

    const handleCustomFieldChange = (
        fieldId: string,
        value: string | number | boolean,
    ) => {
        const currentCustomFields = form.getValues("customFields");
        const index = currentCustomFields.findIndex(
            (field) => field.fieldId === fieldId,
        );

        if (index !== -1) {
            const newValues = [...currentCustomFields];
            newValues[index] = { ...newValues[index], value };
            form.setValue("customFields", newValues);
        } else {
            form.setValue("customFields", [
                ...currentCustomFields,
                { fieldId, value },
            ]);
        }
    };

    const priorities: Priority[] = ["none", "low", "medium", "high", "urgent"];
    const stati: Status[] = ["not_started", "in_progress", "completed"];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {task ? "Edit Task" : "Create New Task"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label
                                className="text-sm font-medium"
                                htmlFor="title"
                            >
                                Title
                            </label>
                            <Input
                                id="title"
                                placeholder="Task title"
                                {...form.register("title")}
                            />
                            {form.formState.errors.title && (
                                <p className="text-red-500 text-sm">
                                    {form.formState.errors.title.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Assignees
                            </label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between"
                                    >
                                        {form.watch("assignees").length > 0
                                            ? `${
                                                form.watch("assignees").length
                                            } assignee${
                                                form.watch("assignees")
                                                        .length === 1
                                                    ? ""
                                                    : "s"
                                            } selected`
                                            : "Select assignees..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0 bg-background">
                                    <Command>
                                        <CommandInput placeholder="Search users..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                No users found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {users.map((user) => {
                                                    const style = user.style ||
                                                        getAvatarStyle(user.id);
                                                    const initials = user.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("");

                                                    return (
                                                        <CommandItem
                                                            key={user.id}
                                                            onSelect={() =>
                                                                toggleAssignee(
                                                                    user,
                                                                )}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    form
                                                                            .watch(
                                                                                "assignees",
                                                                            )
                                                                            .some(
                                                                                (
                                                                                    a,
                                                                                ) => a
                                                                                    .id ===
                                                                                    user.id,
                                                                            )
                                                                        ? "opacity-100"
                                                                        : "opacity-0",
                                                                )}
                                                            />
                                                            <div
                                                                className={cn(
                                                                    "h-6 w-6 mr-2 rounded-full flex items-center justify-center",
                                                                    style.bg,
                                                                )}
                                                            >
                                                                <span
                                                                    className={style
                                                                        .text}
                                                                >
                                                                    {initials}
                                                                </span>
                                                            </div>
                                                            {user.name}
                                                        </CommandItem>
                                                    );
                                                })}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {form.watch("assignees").length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {form.watch("assignees").map((assignee) => (
                                        <div
                                            key={assignee.id}
                                            className="flex items-center gap-2 bg-background rounded-full px-3 py-1"
                                        >
                                            <Avatar className={`h-6 w-6`}>
                                                <AvatarFallback>
                                                    {assignee.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">
                                                {assignee.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="status"
                                >
                                    Status
                                </label>
                                <Select
                                    value={form.watch("status")}
                                    onValueChange={(value) =>
                                        form.setValue("status", value as Status)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background">
                                        {stati.map((status) => (
                                            <SelectItem
                                                key={status}
                                                value={status}
                                            >
                                                {status
                                                    .split("_")
                                                    .map((word) => {
                                                        return word.charAt(0)
                                                            .toUpperCase() +
                                                            word.slice(1);
                                                    })
                                                    .join(" ")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="priority"
                                >
                                    Priority
                                </label>
                                <Select
                                    value={form.watch("priority")}
                                    onValueChange={(value) =>
                                        form.setValue("priority", value as Priority)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background">
                                        {priorities.map((priority) => (
                                            <SelectItem
                                                key={priority}
                                                value={priority}
                                            >
                                                {priority.charAt(0)
                                                    .toUpperCase() +
                                                    priority.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                className="text-sm font-medium"
                                htmlFor="description"
                            >
                                Description
                            </label>
                            <Textarea
                                id="description"
                                placeholder="Add a description..."
                                rows={4}
                                {...form.register("description")}
                            />
                        </div>

                        {customFields.map((field) => (
                            <div key={field.id} className="space-y-2">
                                <label className="text-sm font-medium">
                                    {field.name}
                                </label>
                                {field.type === "text" && (
                                    <Input
                                        value={(form.watch("customFields").find(
                                            (f) => f.fieldId === field.id,
                                        )?.value as string) || ""}
                                        onChange={(e) =>
                                            handleCustomFieldChange(
                                                field.id,
                                                e.target.value,
                                            )}
                                    />
                                )}
                                {field.type === "number" && (
                                    <Input
                                        type="number"
                                        value={(form.watch("customFields").find(
                                            (f) => f.fieldId === field.id,
                                        )?.value as number) || ""}
                                        onChange={(e) =>
                                            handleCustomFieldChange(
                                                field.id,
                                                Number.parseFloat(
                                                    e.target.value,
                                                ),
                                            )}
                                    />
                                )}
                                {field.type === "checkbox" && (
                                    <input
                                        type="checkbox"
                                        checked={(form.watch("customFields")
                                            .find(
                                                (f) => f.fieldId === field.id,
                                            )?.value as boolean) || false}
                                        onChange={(e) =>
                                            handleCustomFieldChange(
                                                field.id,
                                                e.target.checked,
                                            )}
                                    />
                                )}
                            </div>
                        ))}

                        {
                            /* {onAddCustomField && onRemoveCustomField && (
              <CustomFieldsEditor
                customFields={customFields}
                onAddField={onAddCustomField}
                onRemoveField={onRemoveCustomField}
              />
            )} */
                        }
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
