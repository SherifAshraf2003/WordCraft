import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const style = searchParams.get("style");
    const limit = parseInt(searchParams.get("limit") || "50");

    const supabase = await createClient();

    let query;

    if (style && style !== "all") {
      // Get leaderboard for specific style
      const { data, error } = await supabase.rpc("get_leaderboard_by_style", {
        style_filter: style,
        limit_count: limit,
      });

      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json(
          { error: "Failed to fetch leaderboard data" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: data || [],
        style,
        total: data?.length || 0,
      });
    } else {
      // Get overall leaderboard (best score per user across all styles)
      const { data, error } = await supabase
        .from("leaderboard_view")
        .select(
          `
          username,
          display_name,
          writing_style,
          best_score,
          best_style_score,
          total_games,
          avg_score,
          overall_rank,
          last_played
        `
        )
        .order("best_score", { ascending: false })
        .order("last_played", { ascending: true })
        .limit(limit);

      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json(
          { error: "Failed to fetch leaderboard data" },
          { status: 500 }
        );
      }

      // Group by username to get unique users with their best performance
      const uniqueUsers = new Map();
      data?.forEach((entry) => {
        const existing = uniqueUsers.get(entry.username);
        if (!existing || entry.best_score > existing.best_score) {
          uniqueUsers.set(entry.username, entry);
        }
      });

      const result = Array.from(uniqueUsers.values())
        .sort((a, b) => {
          if (b.best_score === a.best_score) {
            return (
              new Date(a.last_played).getTime() -
              new Date(b.last_played).getTime()
            );
          }
          return b.best_score - a.best_score;
        })
        .slice(0, limit);

      return NextResponse.json({
        success: true,
        data: result,
        style: "all",
        total: result.length,
      });
    }
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST endpoint to refresh the leaderboard materialized view
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.rpc("refresh_leaderboard");

    if (error) {
      console.error("Refresh leaderboard error:", error);
      return NextResponse.json(
        { error: "Failed to refresh leaderboard" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Leaderboard refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh leaderboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
