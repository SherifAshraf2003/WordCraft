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

const analysisPrompts = {
  professional: {
    criteria:
      "clarity, conciseness, professional tone, business appropriateness, structure, and formal language usage",
    focus:
      "business communication standards, professional etiquette, and workplace-appropriate language",
  },
  creative: {
    criteria:
      "creativity, imagination, narrative flow, character development, descriptive language, and artistic expression",
    focus:
      "storytelling techniques, literary devices, and creative word choice",
  },
  marketing: {
    criteria:
      "persuasiveness, audience engagement, call-to-action effectiveness, brand voice, and compelling messaging",
    focus: "marketing effectiveness, audience appeal, and conversion potential",
  },
  academic: {
    criteria:
      "formal tone, logical argumentation, evidence-based reasoning, scholarly language, and research depth",
    focus:
      "academic writing conventions, critical analysis, and scholarly discourse",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { userResponse, writingStyle, prompt } = await req.json();

    if (!userResponse || !writingStyle || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const styleAnalysis =
      analysisPrompts[writingStyle as keyof typeof analysisPrompts];

    if (!styleAnalysis) {
      return NextResponse.json(
        { error: "Invalid writing style" },
        { status: 400 }
      );
    }

    // Gemini 2.5 Flash API call
    const result = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an expert writing instructor and evaluator for WordCraft, an AI-powered writing skills enhancement platform.\n\nAbout WordCraft & Your Role:\n- Users select a writing style and receive a custom prompt\n- They write a response (typically 100-300 words) to demonstrate their skills\n- You provide detailed, fair, and constructive analysis to help them improve\n- Your evaluation directly impacts their learning and motivation\n\nEVALUATION STYLE: ${writingStyle.toUpperCase()}\nFocus Areas: ${styleAnalysis.criteria}\nSpecial Attention: ${styleAnalysis.focus}\n\nSTRICT EVALUATION GUIDELINES:\n- Be fair but discerning - not everyone deserves 90+\n- Score 0-100 where:\n  * 90-100: Exceptional, publication-ready quality\n  * 80-89: Strong, skilled writing with minor areas for improvement\n  * 70-79: Good attempt, demonstrates competence but needs refinement\n  * 60-69: Basic understanding shown, significant improvement needed\n  * 50-59: Weak attempt, major deficiencies in multiple areas\n  * Below 50: Poor quality, substantial problems throughout\n\nSCORING CRITERIA:\n- Clarity: Is the message clear and easy to understand?\n- Structure: Is the writing well-organized and logical?\n- Word Choice: Are words precise, appropriate, and varied?\n- Grammar: Are there errors in grammar, punctuation, spelling?\n- Style-Specific: Does it excel in the chosen writing style's requirements?\n\nIMPORTANT RULES:\n- Judge against professional standards, not just effort\n- Give specific, actionable feedback in strengths/weaknesses\n- Style-specific tips should be concrete and practical\n- Be honest about deficiencies while remaining encouraging\n- Consider the prompt complexity when evaluating response appropriateness\n\nRespond ONLY with valid JSON in this exact format (no other text):\n\n{\n  "overallScore": [number from 0-100],\n  "metrics": {\n    "clarity": [number from 0-100],\n    "structure": [number from 0-100],\n    "wordChoice": [number from 0-100],\n    "grammar": [number from 0-100]\n  },\n  "styleSpecificScore": [number from 0-100],\n  "strengths": [\n    "specific strength 1",\n    "specific strength 2",\n    "specific strength 3"\n  ],\n  "weaknesses": [\n    "specific weakness 1",\n    "specific weakness 2"\n  ],\n  "styleSpecificTips": [\n    "actionable tip 1",\n    "actionable tip 2",\n    "actionable tip 3"\n  ]\n}`,
            },
            {
              text: `Original Prompt: "${prompt}"\n\nWriter's Response: "${userResponse}"\n\nPlease analyze this ${writingStyle} writing response and provide detailed, strict, and fair feedback in the specified JSON format.`,
            },
          ],
        },
      ],
    });

    const analysisResult =
      result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    console.log("analysisResult", analysisResult);

    if (!analysisResult) {
      throw new Error("Failed to generate analysis");
    }

    let analysis;
    try {
      if (
        analysisResult.includes("```json") &&
        analysisResult.includes("```")
      ) {
        analysis = JSON.parse(
          analysisResult.replace("```json\n", "").replace("\n```", "")
        );
      } else {
        analysis = JSON.parse(analysisResult);
      }
    } catch (parseError) {
      console.error("Failed to parse analysis JSON:", parseError);
      return NextResponse.json(
        { error: "Failed to parse analysis JSON" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...analysis,
      writingStyle,
      userResponse,
      prompt,
    });
  } catch (error) {
    console.error("Error analyzing writing:", error);
    return NextResponse.json(
      { error: "Failed to analyze writing" },
      { status: 500 }
    );
  }
}
