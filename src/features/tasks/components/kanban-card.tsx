import { MoreHorizontal } from "lucide-react";
import { Task } from "../types";
import { TaskActions } from "./task-actions";
import { DottedSeparator } from "@/components/dotted-separator";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

interface KanbanCardProps {
	task: Task;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
	return (
		<div className="bg-neutral-50 dark:bg-neutral-900 p-2.5 mb-1.5 rounded shadow-sm border space-y-3">
			<div className="flex items-start justify-between gap-x-2">
				<p className="text-sm line-clamp-2 text-neutral-900 dark:text-neutral-100">
					{task.name}
				</p>
				<TaskActions id={task.$id} projectId={task.projectId}>
					<MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 dark:text-neutral-300 hover:opacity-75 transition" />
				</TaskActions>
			</div>
			<DottedSeparator />
			<div className="flex items-center gap-x-1.5">
				<MemberAvatar
					name={task.assignee.name}
					fallbackClassName="text-[10px]"
				/>
				<div className="size-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
				<TaskDate value={task.dueDate} className="text-xs" />
			</div>
			<div className="flex items-center gap-x-1.5 min-w-0">
				<ProjectAvatar
					name={task.project.name}
					image={task.project.imageUrl}
					fallbackClassName="text-[10px]"
				/>
				<span className="text-xs font-medium truncate max-w-20 text-neutral-700 dark:text-neutral-200">
					{task.project.name}
				</span>
			</div>
		</div>
	);
};
