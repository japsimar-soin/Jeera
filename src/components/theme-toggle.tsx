"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			variant="ghost"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
			className="h-8 w-8 sm:h-10 sm:w-10 rounded-full relative border-0 p-0 [&_svg]:!size-4 sm:[&_svg]:!size-5"
		>
			<Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
