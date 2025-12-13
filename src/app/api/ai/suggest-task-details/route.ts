import { NextRequest, NextResponse } from "next/server";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
	token: process.env.COHERE_API_KEY!,
});

export async function POST(req: NextRequest) {
	try {
		const { name, projectDescription } = await req.json();

		if (!name) {
			return NextResponse.json(
				{ error: "Task name is required." },
				{ status: 400 }
			);
		}

		const prompt = `Given the task name: "${name}"${
			projectDescription
				? ` and the project description: "${projectDescription}"`
				: ""
		}, generate a **concise, clear, and actionable task description**. 
Return only the plain task description, no extra explanation, no introductory phrases, no formatting.`;

		const response = await cohere.chat({
			model: "command-a-03-2025",
			message: prompt,
			temperature: 0.7,
			maxTokens: 80,
		});

		const description = response.text?.trim() || "";

		return NextResponse.json({ description });
	} catch {
		return NextResponse.json(
			{ error: "Failed to generate task description." },
			{ status: 500 }
		);
	}
}
