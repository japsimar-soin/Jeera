"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { JoinWorkspaceTabForm } from "./join-workspace-tab-form";

export const WorkspaceOnboardingForm = () => {
	const [activeTab, setActiveTab] = useState("create");

	return (
		<Card className="w-full h-full border-none shadow-none">
			<CardHeader className="flex p-7">
				<CardTitle className="text-xl font-bold">
					{activeTab === "create"
						? "Create a new workspace"
						: "Join a workspace"}
				</CardTitle>
			</CardHeader>
			<CardContent className="p-7">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-2 mb-7">
						<TabsTrigger
							value="create"
							className={
								activeTab === "create"
									? "bg-primary text-primary-foreground"
									: ""
							}
						>
							Create Workspace
						</TabsTrigger>
						<TabsTrigger
							value="join"
							className={
								activeTab === "join" ? "bg-primary text-primary-foreground" : ""
							}
						>
							Join Workspace
						</TabsTrigger>
					</TabsList>
					<TabsContent value="create" className="mt-0">
						<CreateWorkspaceForm />
					</TabsContent>
					<TabsContent value="join" className="mt-0">
						<JoinWorkspaceTabForm />
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};
