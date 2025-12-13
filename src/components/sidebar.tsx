import Link from "next/link";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Projects } from "./projects";
import { Logo } from "./logo";

export const Sidebar = () => {
	return (
		<aside className="h-full bg-neutral-100 dark:bg-neutral-900 p-4 w-full lg:w-64 lg:min-w-64 lg:max-w-64 overflow-hidden">
			<Link href="/">
				<Logo />
			</Link>
			<DottedSeparator className="my-4" />
			<WorkspaceSwitcher />
			<DottedSeparator className="my-4" />
			<Navigation />
			<DottedSeparator className="my-4" />
			<Projects />
		</aside>
	);
};
