"use client";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
	const pathname = usePathname();
	const isSignedIn = pathname === "/sign-in";

	return (
		<main className="bg-neutral-100 min-h-screen">
			<div className="mx-auto max-w-screen-2xl p-4">
				<nav className="flex justify-between items-center">
					<Image src="/logo.svg" alt="logo" width={157} height={68} />
					<Button asChild variant="secondary">
						<Link href={isSignedIn ? "/sign-up" : "/sign-in"}>
							{isSignedIn ? "Sign Up" : "Sign In"}
						</Link>
					</Button>
				</nav>
				<div className="flex flex-col items-center justify-center pt-4 md:pt-14">
					{children}
				</div>
			</div>
		</main>
	);
};

export default AuthLayout;
