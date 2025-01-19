import { NextResponse } from 'next/server';
import { DynamicRetrievalMode, GoogleGenerativeAI } from '@google/generative-ai';
import { CREATE_PROMPT } from './_prompt.const';

export async function POST(req: Request) {
	const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
	const model = genAI.getGenerativeModel(
		{
			model: 'gemini-1.5-flash',
			tools: [
				{
					googleSearchRetrieval: {
						dynamicRetrievalConfig: {
							mode: DynamicRetrievalMode.MODE_DYNAMIC,
							dynamicThreshold: 0.7,
						},
					},
				},
			],
		},
		{ apiVersion: 'v1beta' }
	);
	try {
		const { message, productName } = await req.json();

		const prompt = CREATE_PROMPT(productName, message);
		const result = await model.generateContent(prompt);
		const reply = result.response.text();

		return NextResponse.json({ message: reply });
	} catch (error) {
		console.error('Error:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
