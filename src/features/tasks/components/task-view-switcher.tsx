"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, PlusIcon } from "lucide-react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useGetTasks } from "../api/use-get-tasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useQueryState } from "nuqs";
import { DataFilters } from "./data-filters";
import { useTaskFilters } from "../hooks/use-task-filters";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { DataKanban } from "./data-kanban";
import { useCallback } from "react";
import { TaskStatus } from "../types";
import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";
import { DataCalendar } from "./data-calendar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { TaskSuggestions } from "./task-suggestions";
import { useGetProject } from "@/features/projects/api/use-get-project";

interface TaskViewSwitcherProps {
	hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({
	hideProjectFilter,
}: TaskViewSwitcherProps) => {
	const [{ status, assigneeId, projectId, dueDate }] = useTaskFilters();
	const [view, setView] = useQueryState("task-view", {
		defaultValue: "table",
	});

	const workspaceId = useWorkspaceId();
	const paramProjectId = useProjectId();
	const { open } = useCreateTaskModal();

	// Get project data for task suggestions
	const { data: project } = useGetProject({
		projectId: paramProjectId || projectId || "",
	});

	const { mutate: bulkUpdate } = useBulkUpdateTasks();

	const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
		workspaceId,
		projectId: paramProjectId || projectId,
		assigneeId,
		status,
		dueDate,
	});

	const onKanbanChange = useCallback(
		(tasks: { $id: string; status: TaskStatus; position: number }[]) => {
			bulkUpdate({
				json: { tasks },
			});
		},
		[bulkUpdate]
	);

	return (
		<Tabs
			defaultValue={view}
			onValueChange={setView}
			className="flex-1 w-full border rounded-lg bg-muted dark:bg-neutral-900"
		>
			<div className="h-full flex flex-col overflow-auto p-4">
				<div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
					<TabsList className="w-full py-2 lg:w-auto bg-muted dark:bg-neutral-900 border rounded-md">
						<TabsTrigger
							className="h-7 w-full lg:w-auto transition-colors font-medium rounded-md dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:font-semibold"
							value="table"
						>
							Table
						</TabsTrigger>
						<TabsTrigger
							className="h-7 w-full lg:w-auto transition-colors font-medium rounded-md dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:font-semibold"
							value="kanban"
						>
							Kanban
						</TabsTrigger>
						<TabsTrigger
							className="h-7 w-full lg:w-auto transition-colors font-medium rounded-md dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:font-semibold"
							value="calendar"
						>
							Calendar
						</TabsTrigger>
					</TabsList>
					<Button size="sm" onClick={() => open()} className="w-full lg:w-auto">
						<PlusIcon className="size-4 mr-2" />
						New Task
					</Button>
				</div>
				{project && (
					<TaskSuggestions
						projectName={project.name}
						projectDescription={project.description}
					/>
				)}
				<DottedSeparator className="my-4" />
				<DataFilters hideProjectFilter={hideProjectFilter} />
				<DottedSeparator className="my-4" />
				{isLoadingTasks ? (
					<div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center bg-white dark:bg-neutral-900">
						<Loader className="size-5 animate-spin text-muted-foreground" />
					</div>
				) : (
					<>
						<TabsContent
							value="table"
							className="mt-0 bg-muted dark:bg-neutral-900"
						>
							<DataTable columns={columns} data={tasks?.documents ?? []} />
						</TabsContent>
						<TabsContent
							value="kanban"
							className="mt-0 bg-muted dark:bg-neutral-900"
						>
							<DataKanban
								onChange={onKanbanChange}
								data={tasks?.documents ?? []}
							/>
						</TabsContent>
						<TabsContent
							value="calendar"
							className="mt-0 h-full pb-4 bg-muted dark:bg-neutral-900"
						>
							<DataCalendar data={tasks?.documents ?? []} />
						</TabsContent>
					</>
				)}
			</div>
		</Tabs>
	);
};
