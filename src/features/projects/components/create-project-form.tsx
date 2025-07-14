"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createProjectSchema } from "../schemas";
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
import { useCreateProject } from "../api/use-create-project";
import { useRef, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon, X, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Textarea } from "@/components/ui/textarea";

interface CreateProjectFormProps {
	onCancel?: () => void;
}

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const { mutate, isPending } = useCreateProject();
	const [isSuggesting, setIsSuggesting] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	//EXTRA CODE WRITTEN TO REMOVE ERROR FOR RESOLVER
	const createProjectFormSchema = createProjectSchema.omit({
		workspaceId: true,
	});

	const form = useForm<z.infer<typeof createProjectFormSchema>>({
		resolver: zodResolver(createProjectFormSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = (values: z.infer<typeof createProjectFormSchema>) => {
		const finalValues = {
			...values,
			workspaceId,
			image: values.image instanceof File ? values.image : "",
		};
		mutate(
			{ form: finalValues },
			{
				onSuccess: ({ data }) => {
					form.reset();
					router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
				},
			}
		);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			form.setValue("image", file);
		}
	};

	const handleSuggestClick = async () => {
		const projectName = form.getValues("name");
		if (!projectName.trim()) {
			form.setError("name", { message: "Please enter a project name first" });
			return;
		}

		setIsSuggesting(true);
		try {
			const response = await fetch("/api/ai/suggest-project-description", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: projectName }),
			});

			if (!response.ok) {
				throw new Error("Failed to get suggestions");
			}

			const data = await response.json();

			if (data.description) {
				form.setValue("description", data.description);
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
				<CardTitle className="text-xl font-bold">
					Create a new project
				</CardTitle>
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
										<FormLabel>Project name</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Enter project name" />
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
													placeholder="Enter project description (or click Suggest to get AI-generated description)"
													className="min-h-[100px] pr-12"
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={handleSuggestClick}
													disabled={isSuggesting || isPending}
													title="Get AI suggestions for project description"
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
								name="image"
								render={({ field }) => (
									<div className="flex flex-col gap-y-2">
										<div className="flex items-center gap-x-5">
											{field.value ? (
												<div className="size-[72px] relative rounded-md overflow-hidden group">
													<Image
														alt="logo"
														fill
														className="object-cover"
														src={
															field.value instanceof File
																? URL.createObjectURL(field.value)
																: field.value
														}
													/>
													<Button
														type="button"
														onClick={() => {
															field.onChange(null);
															if (inputRef.current) {
																inputRef.current.value = "";
															}
														}}
														className="absolute top-1 right-1 h-5 w-5 z-10 p-0 bg-neutral-200 rounded-full text-neutral-700 hover:bg-neutral-50 group-hover:opacity-100 opacity-0 transition"
														variant="ghost"
														title="Remove image"
													>
														<X className="h-2 w-2" />
													</Button>
												</div>
											) : (
												<Avatar className="size-[72px]">
													<AvatarFallback>
														<ImageIcon className="size-[36px] text-neutral-400" />
													</AvatarFallback>
												</Avatar>
											)}

											<div className="flex flex-col">
												<p className="ext-sm">Project Icon</p>
												<p className="text-sm text-muted-foreground">
													{" "}
													JPG/PNG/SVG/JPEG (max 1MB)
												</p>
												<input
													placeholder="Select image"
													className="hidden"
													type="file"
													accept=".jpg, .png, .jpeg, .svg"
													ref={inputRef}
													onChange={handleImageChange}
													disabled={isPending}
												/>
												<Button
													type="button"
													disabled={isPending}
													variant="tertiary"
													size="xs"
													className="w-fit mt-2"
													onClick={() => inputRef.current?.click()}
												>
													Upload Image
												</Button>
											</div>
										</div>
									</div>
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
								Create Project
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
