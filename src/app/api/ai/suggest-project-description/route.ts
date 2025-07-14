// import { NextRequest, NextResponse } from "next/server";
// import { CohereClient } from "cohere-ai";

// const cohere = new CohereClient({
// 	token: process.env.COHERE_API_KEY!,
// });

// export async function POST(req: NextRequest) {
// 	try {
// 		const { name } = await req.json();
// 		if (!name) {
// 			return NextResponse.json(
// 				{ error: "Project name is required." },
// 				{ status: 400 }
// 			);
// 		}
// 		const prompt = `Project description for "${name}" in bullet points. Return only bullet points, no introductory text:`;
// 		const response = await cohere.generate({
// 			model: "command",
// 			prompt,
// 			maxTokens: 120,
// 			temperature: 0.7,
// 		});
// 		let description = response.generations[0]?.text?.trim() || "";

// 		// Clean up the response to extract only the description
// 		description = description
// 			.replace(/^["""]/, "") // Remove opening quotes
// 			.replace(/["""]$/, "") // Remove closing quotes
// 			.replace(/^Certainly,?.*?:/, "") // Remove "Certainly," patterns
// 			.replace(/^Here is.*?:/, "") // Remove "Here is" patterns
// 			.replace(/^Here's.*?:/, "") // Remove "Here's" patterns
// 			.replace(/^A revised version.*?:/, "") // Remove "A revised version" patterns
// 			.replace(/^Based on.*?:/, "") // Remove "Based on" patterns
// 			.replace(/^Here's a suggestion for.*?:/, "") // Remove introductory text
// 			.replace(/^A concise.*?:/, "") // Remove other intro patterns
// 			.replace(/^Description:?/, "") // Remove "Description:" prefix
// 			.replace(/^Project Purpose:?/, "") // Remove "Project Purpose:" prefix
// 			.replace(/^Key Features:?/, "") // Remove "Key Features:" prefix
// 			.replace(/^Key:?/, "") // Remove "Key:" prefix
// 			.replace(/^in bullet points:?/, "") // Remove "in bullet points:" prefix
// 			.replace(/^Certainly,?[\s\S]*?Project Purpose:/, "") // Remove multi-line patterns
// 			.replace(/^Here is[\s\S]*?Project Purpose:/, "") // Remove multi-line patterns
// 			.replace(/^Certainly,?[\s\S]*?bullet points:/, "") // Remove multi-line patterns with bullet points
// 			.replace(/^Here is[\s\S]*?bullet points:/, "") // Remove multi-line patterns with bullet points
// 			.trim();

// 		console.log(description);
// 		return NextResponse.json({ description });
// 	} catch {
// 		return NextResponse.json(
// 			{ error: "Failed to generate project description." },
// 			{ status: 500 }
// 		);
// 	}
// }


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
