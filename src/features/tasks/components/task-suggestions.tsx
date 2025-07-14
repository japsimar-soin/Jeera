"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { Loader2, Sparkles } from "lucide-react";
import { useGetTasks } from "../api/use-get-tasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

interface TaskSuggestion {
	name: string;
	description: string;
}

interface TaskSuggestionsProps {
	projectName: string;
	projectDescription?: string;
}

export const TaskSuggestions = ({
	projectName,
	projectDescription,
}: TaskSuggestionsProps) => {
	const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { open } = useCreateTaskModal();
	const workspaceId = useWorkspaceId();
	const projectId = useProjectId();

	// Get existing tasks to filter out
	const { data: existingTasks } = useGetTasks({
		workspaceId,
		projectId,
	});

	useEffect(() => {
		const fetchSuggestions = async () => {
			setIsLoading(true);
			try {
				const response = await fetch("/api/ai/suggest-project-tasks", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						projectName,
						projectDescription,
					}),
				});

				if (response.ok) {
					const data = await response.json();
					setSuggestions(data.tasks || []);
				}
			} catch (error) {
				console.error("Error fetching task suggestions:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (projectName) {
			fetchSuggestions();
		}
	}, [projectName, projectDescription]);

	const handleSuggestionClick = (taskName: string) => {
		// Open the task creation modal with the task name pre-filled
		open({ prefillName: taskName });
	};

	// Filter out tasks that already exist
	const existingTaskNames =
		existingTasks?.documents.map((task) => task.name.toLowerCase()) || [];
	const filteredSuggestions = suggestions.filter(
		(suggestion) => !existingTaskNames.includes(suggestion.name.toLowerCase())
	);

	if (isLoading) {
		return (
			<div className="flex items-center gap-x-2 py-2 text-sm text-muted-foreground">
				<Loader2 className="h-4 w-4 animate-spin" />
				Generating task suggestions...
			</div>
		);
	}

	if (filteredSuggestions.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
				<Sparkles className="h-4 w-4" />
				Suggested tasks for this project:
			</div>
			<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
				{filteredSuggestions.map((suggestion, index) => (
					<Button
						key={index}
						variant="outline"
						size="sm"
						onClick={() => handleSuggestionClick(suggestion.name)}
						className="text-xs h-8 px-3 border whitespace-nowrap flex-shrink-0"
					>
						{suggestion.name}
					</Button>
				))}
			</div>
		</div>
	);
};
