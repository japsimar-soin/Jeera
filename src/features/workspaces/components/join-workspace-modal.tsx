"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { JoinWorkspaceTabForm } from "./join-workspace-tab-form";
import { useJoinWorkspaceModal } from "../hooks/use-join-workspace-modal";

export const JoinWorkspaceModal = () => {
	const { isOpen, setIsOpen, close } = useJoinWorkspaceModal();

	return (
		<ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
			<JoinWorkspaceTabForm onCancel={close} />
		</ResponsiveModal>
	);
};
