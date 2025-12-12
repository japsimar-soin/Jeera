"use client";

import { cn } from "@/lib/utils";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
	return (
		<footer
			className={cn(
				"w-full border-t mt-10",
				"bg-background text-muted-foreground"
			)}
		>
			<div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
				<p className="text-sm">© {new Date().getFullYear()} Japsimar Soin</p>

				<div className="flex items-center gap-4">
					<a
						href="https://github.com/japsimar-soin"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-primary transition"
					>
						<Github className="h-5 w-5" />
					</a>

					<a
						href="https://linkedin.com/in/japsimar-soin"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-primary transition"
					>
						<Linkedin className="h-5 w-5" />
					</a>

					<a
						href="mailto:japsimarsoin2003@gmail.com"
						className="hover:text-primary transition"
					>
						<Mail className="h-5 w-5" />
					</a>
				</div>
			</div>
		</footer>
	);
}
