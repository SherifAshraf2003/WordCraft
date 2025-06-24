import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

interface GameData {
  username?: string;
  promptText: string;
  userResponse: string;
  writingStyle: string;
  analysisResult: {
    overallScore: number;
    styleSpecificScore: number;
    metrics: {
      clarity: number;
      structure: number;
      wordChoice: number;
      grammar: number;
    };
    strengths: string[];
    weaknesses: string[];
    styleSpecificTips: string[];
  };
}

export async function POST(req: NextRequest) {
  try {
    const gameData: GameData = await req.json();
    // Get access token from Authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const supabase = await createClient(token);

    // Validate required fields
    if (
      !gameData.promptText ||
      !gameData.userResponse ||
      !gameData.writingStyle ||
      !gameData.analysisResult
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate scores are within range
    const { overallScore, styleSpecificScore, metrics } =
      gameData.analysisResult;
    if (
      overallScore < 0 ||
      overallScore > 100 ||
      styleSpecificScore < 0 ||
      styleSpecificScore > 100 ||
      metrics.clarity < 0 ||
      metrics.clarity > 100 ||
      metrics.structure < 0 ||
      metrics.structure > 100 ||
      metrics.wordChoice < 0 ||
      metrics.wordChoice > 100 ||
      metrics.grammar < 0 ||
      metrics.grammar > 100
    ) {
      return NextResponse.json(
        { error: "Invalid score values" },
        { status: 400 }
      );
    }

    let userId: string | undefined;

    // Try to get the authenticated user from Supabase Auth
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      // Use the authenticated user's ID to look up the users table
      const { data: dbUser, error: dbUserError } = await supabase
        .from("users")
        .select("id")
        .eq("email", authUser.email)
        .eq("is_guest", false)
        .single();
      if (dbUserError || !dbUser) {
        // If not found, create a new user row
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({
            username: gameData.username || authUser.email,
            email: authUser.email,
            display_name: gameData.username || authUser.email,
            is_guest: false,
          })
          .select("id")
          .single();
        if (createError) {
          console.error("User creation error:", createError);
          return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
          );
        }
        userId = newUser.id;
      } else {
        userId = dbUser.id;
      }
    } else {
      // Guest user logic (no authenticated user)
      const { data: guestUserId, error: guestError } = await supabase.rpc(
        "get_or_create_guest_user",
        {
          guest_username: gameData.username || null,
        }
      );
      if (guestError) {
        console.error("Guest user creation error:", guestError);
        return NextResponse.json(
          { error: "Failed to create guest user" },
          { status: 500 }
        );
      }
      userId = guestUserId;
    }

    // Save the game result
    const { data: gameResult, error: gameError } = await supabase
      .from("games")
      .insert({
        user_id: userId,
        prompt_text: gameData.promptText,
        user_response: gameData.userResponse,
        writing_style: gameData.writingStyle,
        overall_score: Math.round(overallScore),
        style_specific_score: Math.round(styleSpecificScore),
        clarity_score: Math.round(metrics.clarity),
        structure_score: Math.round(metrics.structure),
        word_choice_score: Math.round(metrics.wordChoice),
        grammar_score: Math.round(metrics.grammar),
        strengths: gameData.analysisResult.strengths,
        weaknesses: gameData.analysisResult.weaknesses,
        style_specific_tips: gameData.analysisResult.styleSpecificTips,
      })
      .select("id, created_at")
      .single();

    if (gameError) {
      console.error("Game save error:", gameError);
      return NextResponse.json(
        { error: "Failed to save game result" },
        { status: 500 }
      );
    }

    // Refresh leaderboard asynchronously (don't wait for it)
    (async () => {
      try {
        await supabase.rpc("refresh_leaderboard");
        console.log("Leaderboard refreshed after new game");
      } catch (err) {
        console.error("Failed to refresh leaderboard:", err);
      }
    })();

    return NextResponse.json({
      success: true,
      gameId: gameResult.id,
      userId,
      savedAt: gameResult.created_at,
      message: "Game result saved successfully",
    });
  } catch (error) {
    console.error("Save game API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
