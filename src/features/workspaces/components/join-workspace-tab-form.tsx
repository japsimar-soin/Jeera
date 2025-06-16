"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";
import { cn } from "@/lib/utils";

const joinWorkspaceSchema = z
	.object({
		joinType: z.enum(["inviteCode", "workspaceId"]),
		inviteCode: z.string().optional(),
		workspaceId: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.joinType === "inviteCode") {
			if (!data.inviteCode) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Please enter an invite link",
					path: ["inviteCode"],
				});
				return;
			}
			// Validate invite link format
			const match = data.inviteCode.match(
				/\/workspaces\/([^/]+)\/join\/([^/]+)$/
			);
			if (!match) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						"Invalid invite link format. Please paste the full invite link (e.g., http://localhost:3000/workspaces/123/join/abc)",
					path: ["inviteCode"],
				});
				return;
			}
		} else if (data.joinType === "workspaceId" && !data.workspaceId) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Please enter a workspace ID",
				path: ["workspaceId"],
			});
		}
	});

interface JoinWorkspaceTabFormProps {
	onCancel?: () => void;
}

export const JoinWorkspaceTabForm = ({
	onCancel,
}: JoinWorkspaceTabFormProps) => {
	const router = useRouter();
	const { mutate, isPending } = useJoinWorkspace();

	const form = useForm<z.infer<typeof joinWorkspaceSchema>>({
		resolver: zodResolver(joinWorkspaceSchema),
		defaultValues: {
			joinType: "inviteCode",
			inviteCode: "",
			workspaceId: "",
		},
		mode: "onChange",
	});

	const joinType = form.watch("joinType");

	const onSubmit = (values: z.infer<typeof joinWorkspaceSchema>) => {
		if (values.joinType === "inviteCode" && values.inviteCode) {
			const match = values.inviteCode.match(
				/\/workspaces\/([^/]+)\/join\/([^/]+)$/
			);
			const [, workspaceId, code] = match!;

			mutate(
				{
					param: { workspaceId },
					json: { code },
				},
				{
					onSuccess: ({ data }) => {
						form.reset();
						router.push(`/workspaces/${data.$id}`);
					},
					onError: (error) => {
						console.error("Failed to join workspace:", error);
						form.setError("inviteCode", {
							type: "manual",
							message: "Invalid or expired invite link",
						});
					},
				}
			);
		} else if (values.joinType === "workspaceId" && values.workspaceId) {
			form.setError("workspaceId", {
				type: "manual",
				message: "Please use the invite link to join the workspace",
			});
		}
	};

	return (
		<Card className="w-full h-full border-none shadow-none">
			<CardContent className="p-7">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
						<div className="flex flex-col gap-y-6">
							<FormField
								control={form.control}
								name="joinType"
								render={({ field }) => (
									<FormItem>
										<FormLabel>How would you like to join?</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={field.value}
												className="flex flex-col space-y-1"
											>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="inviteCode" />
													</FormControl>
													<FormLabel className="font-normal">
														I have an invite link
													</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="workspaceId" />
													</FormControl>
													<FormLabel className="font-normal">
														I have a workspace ID
													</FormLabel>
												</FormItem>
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{joinType === "inviteCode" ? (
								<FormField
									control={form.control}
									name="inviteCode"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Invite Link</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Paste the invite link here"
													className="font-mono"
												/>
											</FormControl>
											<FormDescription>
												Paste the invite link you received to join an existing
												workspace
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							) : (
								<FormField
									control={form.control}
									name="workspaceId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Workspace ID</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Enter the workspace ID"
													className="font-mono"
												/>
											</FormControl>
											<FormDescription>
												Enter the workspace ID you want to join
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
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
								Join Workspace
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
