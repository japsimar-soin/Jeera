import { cn } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { FolderIcon, ListChecksIcon, UserIcon } from "lucide-react";
import { TaskStatus } from "../types";
import { useTaskFilters } from "../hooks/use-task-filters";
import { DatePicker } from "@/components/date-picker";

interface DataFiltersProps {
	hideProjectFilter?: boolean;
}

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
	const workspaceId = useWorkspaceId();
	const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
		workspaceId,
	});
	const { data: members, isLoading: isLoadingMembers } = useGetMembers({
		workspaceId,
	});

	const isLoading = isLoadingProjects || isLoadingMembers;

	const projectOptions = projects?.documents.map((project) => ({
		value: project.$id,
		label: project.name,
	}));
	const memberOptions = members?.documents.map((member) => ({
		value: member.$id,
		label: member.name,
	}));

	const [{ status, assigneeId, projectId, dueDate }, setFilters] =
		useTaskFilters();

	const onStatusChange = (value: string) => {
		setFilters({ status: value === "all" ? null : (value as TaskStatus) });
	};
	const onAssigneeChange = (value: string) => {
		setFilters({ assigneeId: value === "all" ? null : (value as string) });
	};
	const onProjectChange = (value: string) => {
		setFilters({ projectId: value === "all" ? null : (value as string) });
	};

	if (isLoading) {
		return null;
	}

	return (
		<div className="flex flex-col lg:flex-row gap-2">
			<Select
				defaultValue={status ?? undefined}
				onValueChange={(value) => onStatusChange(value)}
			>
				<SelectTrigger
					className={cn(
						"w-full lg:w-auto h-8 border border-neutral-200 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
						status
							? "text-neutral-900 dark:text-neutral-200"
							: "text-neutral-500 dark:text-neutral-400"
					)}
				>
					<div className="flex items-center pr-2">
						<ListChecksIcon className="size-4 mr-2" />
						<SelectValue placeholder="All statuses" />
					</div>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All statuses</SelectItem>
					<SelectSeparator />
					<SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
					<SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
					<SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
					<SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
					<SelectItem value={TaskStatus.DONE}>Done</SelectItem>
				</SelectContent>
			</Select>
			<Select
				defaultValue={assigneeId ?? undefined}
				onValueChange={(value) => onAssigneeChange(value)}
			>
				<SelectTrigger
					className={cn(
						"w-full lg:w-auto h-8 border border-neutral-200 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
						assigneeId
							? "text-neutral-900 dark:text-neutral-200"
							: "text-neutral-500 dark:text-neutral-400"
					)}
				>
					<div className="flex items-center pr-2">
						<UserIcon className="size-4 mr-2" />
						<SelectValue placeholder="All assignees" />
					</div>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All assignees</SelectItem>
					<SelectSeparator />
					{memberOptions?.map((member) => (
						<SelectItem key={member.value} value={member.value}>
							<span className="truncate max-w-60">{member.label}</span>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{!hideProjectFilter && (
				<Select
					defaultValue={projectId ?? undefined}
					onValueChange={(value) => onProjectChange(value)}
				>
					<SelectTrigger
						className={cn(
							"w-full lg:w-auto h-8 border border-neutral-200 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
							projectId
								? "text-neutral-900 dark:text-neutral-200"
								: "text-neutral-500 dark:text-neutral-400"
						)}
					>
						<div className="flex items-center pr-2">
							<FolderIcon className="size-4 mr-2" />
							<SelectValue placeholder="All projects" />
						</div>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All projects</SelectItem>
						<SelectSeparator />
						{projectOptions?.map((project) => (
							<SelectItem key={project.value} value={project.value}>
								<span className="truncate max-w-60">{project.label}</span>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
			<DatePicker
				placeholder="Due Date"
				className="h-8 w-full lg:w-auto"
				value={dueDate ? new Date(dueDate) : undefined}
				onChange={(date) => {
					setFilters({ dueDate: date ? date.toISOString() : null });
				}}
			/>
		</div>
	);
};
