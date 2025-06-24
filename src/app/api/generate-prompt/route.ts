import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";
//
// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENROUTER_API_KEY,
// });

// Gemini 2.5 Flash integration
import { GoogleGenAI } from "@google/genai";
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

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

    // Gemini 2.5 Flash API call
    const result = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a writing instructor creating prompts for WordCraft, an AI-powered writing skills enhancement platform.\n\nAbout WordCraft:\n- Users select a writing style (Professional, Creative, Marketing, or Academic)\n- They receive a custom prompt tailored to that style\n- Users write a response to your prompt (typically 100-300 words)\n- Their response gets analyzed by AI for clarity, structure, word choice, grammar, and style-specific criteria\n- Users receive detailed feedback and scoring to improve their writing skills\n\nYour task: ${systemPrompt}\n\nImportant guidelines:\n- The prompt should encourage a response that can be meaningfully analyzed\n- Make it specific enough to guide the writer but open enough for creativity\n- Ensure the prompt naturally leads to demonstrating the key skills of the chosen style\n- The user will write their response in a text area and submit it for AI evaluation\n- Aim for prompts that would result in 100-300 word responses\n- Keep the prompt concise (1-2 sentences) but engaging and clear\n- Do not include instructions about word count or format - just the creative prompt itself\n\nReturn only the prompt itself with no additional commentary or explanation.`,
            },
          ],
        },
      ],
    });

    const generatedPrompt =
      result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

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
