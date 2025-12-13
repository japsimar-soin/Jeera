"use client";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
	const pathname = usePathname();
	const isSignedIn = pathname === "/sign-in";

	return (
		<main className="bg-neutral-100 dark:bg-neutral-900 min-h-screen">
			<div className="mx-auto max-w-screen-2xl p-4">
				<nav className="flex justify-between items-center">
					<Logo />
					<div className="flex items-center gap-2">
						<ThemeToggle />
						<Button asChild variant="secondary">
							<Link href={isSignedIn ? "/sign-up" : "/sign-in"}>
								{isSignedIn ? "Sign Up" : "Sign In"}
							</Link>
						</Button>
					</div>
				</nav>
				<div className="flex flex-col items-center justify-center pt-4 md:pt-14">
					{children}
				</div>
			</div>
		</main>
	);
};

export default AuthLayout;
