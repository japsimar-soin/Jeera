import { NextRequest, NextResponse } from "next/server";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
	token: process.env.COHERE_API_KEY!,
});

export async function POST(req: NextRequest) {
	try {
		const { name } = await req.json();
		if (!name) {
			return NextResponse.json(
				{ error: "Project name is required." },
				{ status: 400 }
			);
		}

		const prompt = `You are a concise technical assistant. Given a project name, return ONLY bullet points that clearly describe the project's scope and purpose. Do NOT include any introductory phrases or explanations.

Project: ${name}
Output:
-`;

		const response = await cohere.generate({
			model: "command",
			prompt,
			maxTokens: 150,
			temperature: 0.6,
			stopSequences: ["\n\n"], // stops when a section ends
		});

		let description = response.generations[0]?.text?.trim() || "";

		// Optional: further strip if you still find some junk at start
		description = description.replace(/^(?:[-•])?\s*/, "");

		return NextResponse.json({ description });
	} catch {
		return NextResponse.json(
			{ error: "Failed to generate project description." },
			{ status: 500 }
		);
	}
}
