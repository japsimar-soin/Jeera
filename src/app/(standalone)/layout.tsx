import Link from "next/link";
import { UserButton } from "@/features/auth/components/user-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

interface StandaloneLayoutProps {
	children: React.ReactNode;
}

const StandaloneLayout = ({ children }: StandaloneLayoutProps) => {
	return (
		<main className="bg-neutral-100 dark:bg-neutral-900 min-h-screen">
			<div className="mx-auto max-w-screen-2xl p-4 px-4 sm:px-6 lg:px-8">
				<nav className="flex items-center justify-between h-[73px] px-4 sm:px-6">
					<Link href="/">
						{/* <Image src="/logo.svg" alt="logo" height={56} width={152} /> */}
						<Logo />
					</Link>
					<div className="flex items-center gap-2">
						<ThemeToggle />
						<UserButton />
					</div>
				</nav>
				<div className="flex flex-col items-center justify-center py-4">
					{children}
				</div>
			</div>
		</main>
	);
};

export default StandaloneLayout;
