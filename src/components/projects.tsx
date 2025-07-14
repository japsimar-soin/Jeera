"use client";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusIcon } from "lucide-react";

export const Projects = () => {
	const workspaceId = useWorkspaceId();
	const pathname = usePathname();
	const { open } = useCreateProjectModal();
	const { data } = useGetProjects({ workspaceId });

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex items-center justify-between">
				<p className="text-xs uppercase text-neutral-500 dark:text-neutral-400">
					Projects
				</p>
				<button
					className="size-5 text-neutral-500 dark:text-neutral-400 cursor-pointer hover:opacity-75 transition"
					title="Add project"
					aria-label="Add project"
					onClick={open}
				>
					<PlusIcon className="size-5" />
				</button>
			</div>

			{data?.documents.map((project) => {
				const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
				const isActive = pathname === href;

				return (
					<Link href={href} key={project.$id}>
						<div
							className={cn(
								"flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500 dark:text-neutral-400 w-full",
								isActive &&
									"bg-white dark:bg-neutral-800 shadow-sm text-primary"
							)}
						>
							<ProjectAvatar
								image={project.imageUrl}
								name={project.name}
								className="size-6"
							/>
							<span className="truncate text-sm max-w-32">{project.name}</span>
						</div>
					</Link>
				);
			})}
		</div>
	);
};
