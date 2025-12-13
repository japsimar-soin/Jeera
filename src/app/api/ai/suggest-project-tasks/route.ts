import { NextRequest, NextResponse } from "next/server";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
	token: process.env.COHERE_API_KEY!,
});

export async function POST(req: NextRequest) {
	try {
		const { projectName, projectDescription } = await req.json();
		if (!projectName) {
			return NextResponse.json(
				{ error: "Project name is required." },
				{ status: 400 }
			);
		}

		const context = projectDescription
			? `Project: ${projectName}\nDescription: ${projectDescription}`
			: `Project: ${projectName}`;

		const prompt = `You are a concise technical assistant. Given a project context, suggest 3-4 essential tasks needed to complete this project. Return ONLY short, precise task names (2-4 words each), one per line. Focus on single action items. Do NOT include numbers, bullet points, or any formatting.

Project Context:
${context}

Output:
`;

		const response = await cohere.chat({
			model: "command-r",
			message: prompt,
			temperature: 0.6,
			maxTokens: 80,
		});

		const tasksText = response.text?.trim() || "";

		// Parse the tasks into an array
		const taskNames = tasksText
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean)
			.slice(0, 4);

		const tasks = taskNames.map((name) => ({
			name,
			description: `Task related to ${projectName}`,
		}));

		return NextResponse.json({ tasks });
	} catch {
		return NextResponse.json(
			{ error: "Failed to generate task suggestions." },
			{ status: 500 }
		);
	}
}
