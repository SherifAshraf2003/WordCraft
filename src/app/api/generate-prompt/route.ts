import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const stylePrompts = {
  professional:
    "Generate a professional writing prompt that would be suitable for business communication, reports, or formal correspondence. The prompt should challenge the writer to use clear, concise language and proper business etiquette.",
  creative:
    "Generate a creative writing prompt that encourages imagination, storytelling, and artistic expression. The prompt should inspire vivid descriptions, character development, or innovative narrative techniques.",
  marketing:
    "Generate a marketing writing prompt that focuses on persuasive content, brand messaging, or customer engagement. The prompt should challenge the writer to create compelling, action-oriented content.",
  academic:
    "Generate an academic writing prompt that requires research-based arguments, critical analysis, or scholarly discussion. The prompt should challenge the writer to use formal language and evidence-based reasoning.",
};

export async function POST(req: NextRequest) {
  try {
    const { writingStyle } = await req.json();

    if (
      !writingStyle ||
      !stylePrompts[writingStyle as keyof typeof stylePrompts]
    ) {
      return NextResponse.json(
        { error: "Invalid writing style" },
        { status: 400 }
      );
    }

    const systemPrompt =
      stylePrompts[writingStyle as keyof typeof stylePrompts];

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-4-maverick:free",
      messages: [
        {
          role: "system",
          content: `You are a writing instructor creating prompts for WordCraft, an AI-powered writing skills enhancement platform. 

About WordCraft:
- Users select a writing style (Professional, Creative, Marketing, or Academic)
- They receive a custom prompt tailored to that style
- Users write a response to your prompt (typically 100-300 words)
- Their response gets analyzed by AI for clarity, structure, word choice, grammar, and style-specific criteria
- Users receive detailed feedback and scoring to improve their writing skills

Your task: ${systemPrompt}

Important guidelines:
- The prompt should encourage a response that can be meaningfully analyzed
- Make it specific enough to guide the writer but open enough for creativity
- Ensure the prompt naturally leads to demonstrating the key skills of the chosen style
- The user will write their response in a text area and submit it for AI evaluation
- Aim for prompts that would result in 100-300 word responses
- Keep the prompt concise (1-2 sentences) but engaging and clear
- Do not include instructions about word count or format - just the creative prompt itself

Return only the prompt itself with no additional commentary or explanation.`,
        },
        {
          role: "user",
          content: `Create a ${writingStyle} writing prompt that would challenge and engage a writer practicing this style.`,
        },
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    const generatedPrompt = completion.choices[0]?.message?.content?.trim();

    if (!generatedPrompt) {
      throw new Error("Failed to generate prompt");
    }

    return NextResponse.json({
      prompt: generatedPrompt,
      style: writingStyle,
    });
  } catch (error) {
    console.error("Error generating prompt:", error);
    return NextResponse.json(
      { error: "Failed to generate prompt" },
      { status: 500 }
    );
  }
}
