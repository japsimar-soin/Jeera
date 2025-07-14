"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { useJoinWorkspaceModal } from "@/features/workspaces/hooks/use-join-workspace-modal";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusIcon } from "lucide-react";

export const WorkspaceSwitcher = () => {
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const { data: workspaces } = useGetWorkspaces();
	const { open: openCreateModal } = useCreateWorkspaceModal();
	const { open: openJoinModal } = useJoinWorkspaceModal();

	const onSelect = (id: string) => {
		router.push(`/workspaces/${id}`);
	};

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex items-center justify-between">
				<p className="text-xs uppercase text-neutral-500 dark:text-neutral-400">
					Workspaces
				</p>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							className="size-5 text-neutral-500 dark:text-neutral-400 cursor-pointer hover:opacity-75 transition"
							title="Add workspace"
							aria-label="Add workspace"
						>
							<PlusIcon className="size-5" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={openCreateModal}>
							Create Workspace
						</DropdownMenuItem>
						<DropdownMenuItem onClick={openJoinModal}>
							Join Workspace
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<Select onValueChange={onSelect} value={workspaceId}>
				<SelectTrigger className="w-full bg-neutral-200 dark:bg-neutral-700 font-medium p-1 max-w-full">
					<SelectValue placeholder="Select a workspace" className="truncate" />
				</SelectTrigger>
				<SelectContent>
					{workspaces?.documents.map((workspace) => (
						<SelectItem key={workspace.$id} value={workspace.$id}>
							<div className="flex justify-start items-center gap-3 font-medium w-full">
								<WorkspaceAvatar
									name={workspace.name}
									image={workspace.imageUrl}
									className="size-7"
								/>
								<span className="truncate max-w-32">{workspace.name}</span>
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
