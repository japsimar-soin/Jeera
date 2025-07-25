"use client";

import { Analytics } from "@/components/analytics";
import { DottedSeparator } from "@/components/dotted-separator";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Member } from "@/features/members/types";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { Project } from "@/features/projects/types";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { Task } from "@/features/tasks/types";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";

export const WorkspaceIdClient = () => {
	const workspaceId = useWorkspaceId();

	const { data: analytics, isLoading: isLoadingAnalytics } =
		useGetWorkspaceAnalytics({ workspaceId });
	const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
		workspaceId,
	});
	const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
		workspaceId,
	});
	const { data: members, isLoading: isLoadingMembers } = useGetMembers({
		workspaceId,
	});

	const isLoading =
		isLoadingAnalytics ||
		isLoadingTasks ||
		isLoadingProjects ||
		isLoadingMembers;

	if (isLoading) {
		return <PageLoader />;
	}

	if (!analytics || !tasks || !projects || !members) {
		return <PageError message="Failed to load workspace data" />;
	}

	return (
		<div className="h-full flex flex-col space-y-4">
			<Analytics data={analytics} />
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
				<TaskList data={tasks.documents} total={tasks.total} />
				<ProjectList data={projects.documents} total={projects.total} />
				<MemberList data={members.documents} total={members.total} />
			</div>
		</div>
	);
};

interface TaskListProps {
	data: Task[];
	total: number;
}

export const TaskList = ({ data, total }: TaskListProps) => {
	const workspaceId = useWorkspaceId();
	const { open: createTask } = useCreateTaskModal();

	return (
		<div className="flex flex-col gap-y-4 col-span-1">
			<div className="bg-muted dark:bg-neutral-800 rounded-lg p-4">
				<div className="flex items-center justify-between">
					<p className="text-lg font-semibold">Tasks ({total})</p>
					<Button size="icon" onClick={() => createTask()} variant={"muted"}>
						<PlusIcon className="size-4 text-neutral-400" />
					</Button>
				</div>
				<DottedSeparator className="my-4" />
				<ul className="flex flex-col gap-y-4">
					{data.map((task) => (
						<li key={task.$id}>
							<Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
								<Card className="shadow-none rounded-lg hover:opacity-75 transition">
									<CardContent className="p-4">
										<p className="text-lg font-medium truncate">{task.name}</p>
										<div className="flex items-center gap-x-2 min-w-0">
											<p className="truncate max-w-24">{task.project?.name}</p>
											<div className="size-1 rounded-full bg-neutral-300 dark:bg-neutral-600 flex-shrink-0" />
											<div className="text-sm text-muted-foreground flex items-center min-w-0">
												<CalendarIcon className="size-3 mr-1 flex-shrink-0" />
												<span className="truncate max-w-20">
													{formatDistanceToNow(new Date(task.dueDate))}
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							</Link>
						</li>
					))}
					<li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
						No tasks found
					</li>
				</ul>
				<Button variant={"muted"} className="mt-4 w-full">
					<Link href={`/workspaces/${workspaceId}/tasks`}></Link>
					Show All
				</Button>
			</div>
		</div>
	);
};

interface ProjectListProps {
	data: Project[];
	total: number;
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
	const workspaceId = useWorkspaceId();
	const { open: createProject } = useCreateProjectModal();

	return (
		<div className="flex flex-col gap-y-4 col-span-1">
			<div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-lg p-4">
				<div className="flex items-center justify-between">
					<p className="text-lg font-semibold">Projects ({total})</p>
					<Button size="icon" onClick={createProject} variant={"secondary"}>
						<PlusIcon className="size-4 text-neutral-400" />
					</Button>
				</div>
				<DottedSeparator className="my-4" />
				<ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{data.map((project) => (
						<li key={project.$id}>
							<Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
								<Card className="shadow-none rounded-lg hover:opacity-70 transition">
									<CardContent className="p-4 flex items-center gap-x-2.5">
										<ProjectAvatar
											className="size-12"
											name={project.name}
											image={project.imageUrl}
											fallbackClassName="text-lg"
										/>
										<p className="text-lg font-medium truncate">
											{project.name}
										</p>
									</CardContent>
								</Card>
							</Link>
						</li>
					))}
					<li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
						No projects found
					</li>
				</ul>
			</div>
		</div>
	);
};

interface MemberListProps {
	data: Member[];
	total: number;
}

export const MemberList = ({ data, total }: MemberListProps) => {
	const workspaceId = useWorkspaceId();

	return (
		<div className="flex flex-col gap-y-4 col-span-1">
			<div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-lg p-4">
				<div className="flex items-center justify-between">
					<p className="text-lg font-semibold">Members ({total})</p>
					<Button asChild size="icon" variant={"secondary"}>
						<Link href={`/workspaces/${workspaceId}/members`}>
							<SettingsIcon className="size-4 text-neutral-400" />
						</Link>
					</Button>
				</div>
				<DottedSeparator className="my-4" />
				<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{data.map((member) => (
						<li key={member.$id}>
							<Card className="shadow-none rounded-lg overflow-hidden">
								<CardContent className="p-3 flex flex-col items-center gap-x-2.5">
									<MemberAvatar className="size-12" name={member.name} />
									<div className="flex flex-col items-center overflow-hidden w-full">
										<p className="text-lg font-medium truncate max-w-24">
											{member.name}
										</p>
										<p className="text-sm text-muted-foreground truncate max-w-24">
											{member.email}
										</p>
									</div>
								</CardContent>
							</Card>
						</li>
					))}
					<li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
						No members found
					</li>
				</ul>
			</div>
		</div>
	);
};
