"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { SettingsIcon, UsersIcon } from "lucide-react";
import {
	GoHome,
	GoHomeFill,
	GoCheckCircle,
	GoCheckCircleFill,
} from "react-icons/go";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { usePathname } from "next/navigation";

const routes = [
	{
		label: "Home",
		href: "/",
		icon: GoHome,
		activeIcon: GoHomeFill,
	},
	{
		label: "My Tasks",
		href: "/tasks",
		icon: GoCheckCircle,
		activeIcon: GoCheckCircleFill,
	},
	{
		label: "Settings",
		href: "/settings",
		icon: SettingsIcon,
		activeIcon: SettingsIcon,
	},
	{
		label: "Members",
		href: "/members",
		icon: UsersIcon,
		activeIcon: UsersIcon,
	},
];

export const Navigation = () => {
	const workspaceId = useWorkspaceId();
	const pathname = usePathname();

	return (
		<ul className="flex flex-col">
			{routes.map((item) => {
				const fullHref = `/workspaces/${workspaceId}${item.href}`;
				const isActive = pathname === fullHref;
				const Icon = isActive ? item.activeIcon : item.icon;

				return (
					<Link key={item.href} href={fullHref}>
						<div
							className={cn(
								"group flex items-center gap-2.5 p-2.5 rounded-md font-medium transition-colors duration-200 text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary",
								isActive &&
									"bg-white dark:bg-neutral-800 shadow-sm text-primary"
							)}
						>
							<Icon className="size-5 transition-colors duration-200 text-neutral-500 dark:text-neutral-400 group-hover:text-primary dark:group-hover:text-primary" />
							{item.label}
						</div>
					</Link>
				);
			})}
		</ul>
	);
};
