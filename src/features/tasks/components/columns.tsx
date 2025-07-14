"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Task } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { TaskActions } from "./task-actions";

export const columns: ColumnDef<Task>[] = [
	{
		accessorKey: "name",
		sortingFn: (rowA, rowB) => {
			const a = rowA.original.name.toLowerCase();
			const b = rowB.original.name.toLowerCase();
			return a.localeCompare(b);
		},
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="border-0 pl-1 dark:border-0 hover:bg-transparent"
				>
					Task Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const name = row.original.name;
			return (
				<p className="line-clamp-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] xl:max-w-[400px]">
					{name}
				</p>
			);
		},
	},
	{
		id: "project",
		accessorFn: (row) => row.project.name,
		sortingFn: (rowA, rowB) => {
			const a = rowA.original.project.name.toLowerCase();
			const b = rowB.original.project.name.toLowerCase();
			return a.localeCompare(b);
		},
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="border-0 pl-1 dark:border-0 hover:bg-transparent"
				>
					Project
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const project = row.original.project;
			return (
				<div className="flex items-center gap-x-2 text-sm font-medium">
					<ProjectAvatar
						className="size-6"
						name={project.name}
						image={project.imageUrl}
					/>
					<p className="line-clamp-1">{project.name}</p>
				</div>
			);
		},
	},
	{
		id: "assignee",
		accessorFn: (row) => row.assignee.name,
		sortingFn: (rowA, rowB) => {
			const a = rowA.original.assignee.name.toLowerCase();
			const b = rowB.original.assignee.name.toLowerCase();
			return a.localeCompare(b);
		},
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="border-0 pl-1 dark:border-0 hover:bg-transparent"
				>
					Assignee
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const assignee = row.original.assignee;
			return (
				<div className="flex items-center gap-x-2 text-sm font-medium">
					<MemberAvatar
						className="size-6"
						fallbackClassName="text-xs"
						name={assignee.name}
					/>
					<p className="line-clamp-1">{assignee.name}</p>
				</div>
			);
		},
	},
	{
		accessorKey: "dueDate",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="border-0 pl-1 dark:border-0 hover:bg-transparent"
				>
					Due Date
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const dueDate = row.original.dueDate;
			return <TaskDate value={dueDate} />;
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="border-0 pl-1 dark:border-0 hover:bg-transparent"
				>
					Status
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const status = row.original.status;
			return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const id = row.original.$id;
			const projectId = row.original.projectId;

			return (
				<TaskActions id={id} projectId={projectId}>
					<Button
						variant="ghost"
						className="size-8 hover:bg-transparent border-0 p-0"
					>
						<MoreVertical className="size-4" />
					</Button>
				</TaskActions>
			);
		},
	},
];
