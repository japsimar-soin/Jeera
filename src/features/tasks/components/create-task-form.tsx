"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createTaskSchema } from "../schemas";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateTask } from "../api/use-create-task";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { DatePicker } from "@/components/date-picker";
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectItem,
} from "@/components/ui/select";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskStatus } from "../types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

interface CreateTaskFormProps {
	onCancel?: () => void;
	projectOptions: { id: string; name: string; imageUrl: string }[];
	memberOptions: { id: string; name: string }[];
}

export const CreateTaskForm = ({
	onCancel,
	projectOptions,
	memberOptions,
}: CreateTaskFormProps) => {
	const workspaceId = useWorkspaceId();
	const { mutate, isPending } = useCreateTask();
	const [isSuggesting, setIsSuggesting] = useState(false);
	const { prefillName } = useCreateTaskModal();

	const form = useForm<z.infer<typeof createTaskSchema>>({
		resolver: zodResolver(createTaskSchema),
		defaultValues: {
			workspaceId,
			name: prefillName || "",
		},
	});

	const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
		mutate(
			{ json: { ...values, workspaceId } },
			{
				onSuccess: () => {
					form.reset();
					onCancel?.();
				},
			}
		);
	};

	const handleSuggestClick = async () => {
		const taskName = form.getValues("name");
		if (!taskName.trim()) {
			form.setError("name", { message: "Please enter a task name first" });
			return;
		}

		setIsSuggesting(true);
		try {
			const response = await fetch("/api/ai/suggest-task-details", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: taskName }),
			});

			if (!response.ok) {
				throw new Error("Failed to get suggestions");
			}

			const data = await response.json();

			if (data.description) {
				form.setValue("description", data.description);
			}

			if (data.suggestedDueDate) {
				// Convert suggested date string to actual date
				const suggestedDate = new Date();
				if (data.suggestedDueDate.includes("days")) {
					const days = parseInt(data.suggestedDueDate.match(/\d+/)?.[0] || "3");
					suggestedDate.setDate(suggestedDate.getDate() + days);
				} else if (data.suggestedDueDate.includes("week")) {
					const weeks = parseInt(
						data.suggestedDueDate.match(/\d+/)?.[0] || "1"
					);
					suggestedDate.setDate(suggestedDate.getDate() + weeks * 7);
				}
				form.setValue("dueDate", suggestedDate);
			}
		} catch (error) {
			console.error("Error getting AI suggestions:", error);
			// You could add a toast notification here
		} finally {
			setIsSuggesting(false);
		}
	};

	return (
		<Card className="w-full h-full border-none shadow-none">
			<CardHeader className="flex p-7">
				<CardTitle className="text-xl font-bold">Create a new task</CardTitle>
			</CardHeader>
			<div className="px-7">
				<DottedSeparator />
			</div>
			<CardContent className="p-7">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex flex-col gap-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Task name</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Enter task name" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<div className="relative">
												<Textarea
													{...field}
													placeholder="Enter task description (or click Suggest to get AI-generated description)"
													className="min-h-[100px] pr-12"
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={handleSuggestClick}
													disabled={isSuggesting || isPending}
													title="Get AI suggestions for description and due date"
													className="absolute bottom-2 right-2 h-8 w-8 p-0"
												>
													{isSuggesting ? (
														<Loader2 className="h-4 w-4 animate-spin" />
													) : (
														<Sparkles className="h-4 w-4" />
													)}
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="dueDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Due Date</FormLabel>
										<FormControl>
											<DatePicker {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="assigneeId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Assignee</FormLabel>
										<Select
											defaultValue={field.value}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select assignee" />
												</SelectTrigger>
											</FormControl>
											<FormMessage />
											<SelectContent>
												{memberOptions.map((member) => (
													<SelectItem key={member.id} value={member.id}>
														<div className="flex items-center gap-x-2 min-w-0">
															<MemberAvatar
																className="size-6 flex-shrink-0"
																name={member.name}
															/>
															<span className="truncate max-w-32">
																{member.name}
															</span>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select
											defaultValue={field.value}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select status" />
												</SelectTrigger>
											</FormControl>
											<FormMessage />
											<SelectContent>
												<SelectItem value={TaskStatus.BACKLOG}>
													Backlog
												</SelectItem>
												<SelectItem value={TaskStatus.IN_PROGRESS}>
													In Progress
												</SelectItem>
												<SelectItem value={TaskStatus.IN_REVIEW}>
													In Review
												</SelectItem>
												<SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
												<SelectItem value={TaskStatus.DONE}>Done</SelectItem>
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="projectId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Project</FormLabel>
										<Select
											defaultValue={field.value}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select project" />
												</SelectTrigger>
											</FormControl>
											<FormMessage />
											<SelectContent>
												{projectOptions.map((project) => (
													<SelectItem key={project.id} value={project.id}>
														<div className="flex items-center gap-x-2 min-w-0">
															<ProjectAvatar
																className="size-6 flex-shrink-0"
																name={project.name}
																image={project.imageUrl}
															/>
															<span className="truncate max-w-32">
																{project.name}
															</span>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
						</div>
						<DottedSeparator className="py-7" />
						<div className="flex items-center justify-between">
							<Button
								type="button"
								size="lg"
								variant="secondary"
								onClick={onCancel}
								disabled={isPending}
								className={cn(!onCancel && "invisible")}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								size="lg"
								variant="primary"
								disabled={isPending}
							>
								Create Task
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
