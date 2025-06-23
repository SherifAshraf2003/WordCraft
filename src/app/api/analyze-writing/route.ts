import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

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

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-4-maverick:free",
      messages: [
        {
          role: "system",
          content: `You are an expert writing instructor and evaluator for WordCraft, an AI-powered writing skills enhancement platform.

About WordCraft & Your Role:
- Users select a writing style and receive a custom prompt
- They write a response (typically 100-300 words) to demonstrate their skills
- You provide detailed, fair, and constructive analysis to help them improve
- Your evaluation directly impacts their learning and motivation

EVALUATION STYLE: ${writingStyle.toUpperCase()}
Focus Areas: ${styleAnalysis.criteria}
Special Attention: ${styleAnalysis.focus}

STRICT EVALUATION GUIDELINES:
- Be fair but discerning - not everyone deserves 90+
- Score 0-100 where:
  * 90-100: Exceptional, publication-ready quality
  * 80-89: Strong, skilled writing with minor areas for improvement
  * 70-79: Good attempt, demonstrates competence but needs refinement
  * 60-69: Basic understanding shown, significant improvement needed
  * 50-59: Weak attempt, major deficiencies in multiple areas
  * Below 50: Poor quality, substantial problems throughout

SCORING CRITERIA:
- Clarity: Is the message clear and easy to understand?
- Structure: Is the writing well-organized and logical?
- Word Choice: Are words precise, appropriate, and varied?
- Grammar: Are there errors in grammar, punctuation, spelling?
- Style-Specific: Does it excel in the chosen writing style's requirements?

IMPORTANT RULES:
- Judge against professional standards, not just effort
- Give specific, actionable feedback in strengths/weaknesses
- Style-specific tips should be concrete and practical
- Be honest about deficiencies while remaining encouraging
- Consider the prompt complexity when evaluating response appropriateness

Respond ONLY with valid JSON in this exact format (no other text):

{
  "overallScore": [number from 0-100],
  "metrics": {
    "clarity": [number from 0-100],
    "structure": [number from 0-100],
    "wordChoice": [number from 0-100],
    "grammar": [number from 0-100]
  },
  "styleSpecificScore": [number from 0-100],
  "strengths": [
    "specific strength 1",
    "specific strength 2",
    "specific strength 3"
  ],
  "weaknesses": [
    "specific weakness 1",
    "specific weakness 2"
  ],
  "styleSpecificTips": [
    "actionable tip 1",
    "actionable tip 2",
    "actionable tip 3"
  ]
}`,
        },
        {
          role: "user",
          content: `Original Prompt: "${prompt}"

Writer's Response: "${userResponse}"

Please analyze this ${writingStyle} writing response and provide detailed, strict, and fair feedback in the specified JSON format.`,
        },
      ],
      max_tokens: 800,
      temperature: 0.3,
    });

    const analysisResult = completion.choices[0]?.message?.content?.trim();

    if (!analysisResult) {
      throw new Error("Failed to generate analysis");
    }

    let analysis;
    try {
      analysis = JSON.parse(
        analysisResult.replace("```json\n", "").replace("\n```", "")
      );
      console.log(analysis);
    } catch (parseError) {
      console.error("Failed to parse analysis JSON:", parseError);
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
