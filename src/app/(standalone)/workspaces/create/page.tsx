import { getCurrent } from "@/features/auth/queries";
import { WorkspaceOnboardingForm } from "@/features/workspaces/components/workspace-onboarding-form";
import { redirect } from "next/navigation";

const WorkspaceCreatePage = async () => {
	const user = await getCurrent();
	if (!user) redirect("/sign-in");

	return (
		<div className="w-full md:max-w-lg lg:max-w-xl">
			<WorkspaceOnboardingForm />
		</div>
	);
};

export default WorkspaceCreatePage;
