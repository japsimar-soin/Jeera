// import { NextRequest, NextResponse } from "next/server";
// import { CohereClient } from "cohere-ai";

// const cohere = new CohereClient({
// 	token: process.env.COHERE_API_KEY!,
// });

// export async function POST(req: NextRequest) {
// 	try {
// 		const { name, projectDescription } = await req.json();
// 		if (!name) {
// 			return NextResponse.json(
// 				{ error: "Task name is required." },
// 				{ status: 400 }
// 			);
// 		}
// 		const prompt = `Given the task name: "${name}"${
// 			projectDescription
// 				  and the project description: "${projectDescription}"
// 				: ""
// 		}, suggest a concise, actionable task description and a likely completion date (e.g., in 3 days, in 1 week). Respond in JSON with keys 'description' and 'suggestedDueDate'.`;
// 		const response = await cohere.generate({
// 			model: "command",
// 			prompt,
// 			maxTokens: 100,
// 			temperature: 0.7,
// 		});
// 		// Try to parse the JSON from the response
// 		let description = "",
// 			suggestedDueDate = "";
// 		try {
// 			const json = JSON.parse(response.generations[0]?.text?.trim() || "{}");
// 			description = json.description || "";
// 			suggestedDueDate = json.suggestedDueDate || "";
// 		} catch {
// 			// fallback: just return the text
// 			description = response.generations[0]?.text?.trim() || "";
// 		}
//         console.log(description);
// 		return NextResponse.json({ description, suggestedDueDate });
// 	} catch {
// 		return NextResponse.json(
// 			{ error: "Failed to generate task details." },
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

		const response = await cohere.generate({
			model: "command",
			prompt,
			maxTokens: 80,
			temperature: 0.7,
		});

		const description = response.generations[0]?.text?.trim() || "";

		return NextResponse.json({ description });
	} catch {
		return NextResponse.json(
			{ error: "Failed to generate task description." },
			{ status: 500 }
		);
	}
}
