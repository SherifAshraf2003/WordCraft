import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Award, ChevronLeft, RefreshCw } from "lucide-react";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface LeaderboardEntry {
  username: string;
  display_name?: string;
  writing_style: string;
  best_score: number;
  best_style_score: number;
  total_games: number;
  avg_score: number;
  style_rank?: number;
  overall_rank?: number;
  last_played: string;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  borderColor: string;
  writingStyle: string;
  selectedStyle: string;
  bgColor: string;
  textColor: string;
  setUserResponse: (value: string) => void;
  setSelectedScreen: (screen: number) => void;
  setSelectedStyle: (style: string) => void;
  setTextColor: (color: string) => void;
  analysisResult: any;
  setGeneratedPrompt: (prompt: string) => void;
}

export default function Leaderboard({
  borderColor,
  writingStyle,
  selectedStyle,
  bgColor,
  textColor,
  setUserResponse,
  setSelectedScreen,
  setSelectedStyle,
  setTextColor,
  analysisResult,
  setGeneratedPrompt,
}: LeaderboardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username] = useState("Guest");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setUserResponse("");
    setSelectedScreen(0);
    setIsLoggedIn(false);
    setSelectedStyle("from-teal-500 to-emerald-500");
    setTextColor("text-teal-600");
    setGeneratedPrompt("");
  };

  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const style = writingStyle.toLowerCase() || "all";
      const response = await fetch(
        `/api/leaderboard?style=${encodeURIComponent(style)}&limit=20`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }

      const result = await response.json();

      if (result.success) {
        let data = result.data || [];

        // Add current user to the leaderboard if they have a score
        if (analysisResult?.overallScore) {
          const userScore = analysisResult.overallScore;
          const userEntry: LeaderboardEntry = {
            username: isLoggedIn ? username : "Guest",
            display_name: isLoggedIn ? username : "Guest",
            writing_style: writingStyle,
            best_score: userScore,
            best_style_score: analysisResult.styleSpecificScore || userScore,
            total_games: 1,
            avg_score: userScore,
            last_played: new Date().toISOString(),
            isCurrentUser: true,
          };

          // Insert user at appropriate position based on score
          const insertIndex = data.findIndex(
            (entry: LeaderboardEntry) => entry.best_score < userScore
          );
          if (insertIndex !== -1) {
            data.splice(insertIndex, 0, userEntry);
          } else {
            data.push(userEntry);
          }
        }

        setLeaderboardData(data);
      } else {
        setError(result.error || "Failed to load leaderboard");
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      setError("Failed to load leaderboard. Please try again.");

      // Fallback to mock data in case of error
      const fallbackData: LeaderboardEntry[] = [
        {
          username: "Jamie Smith",
          display_name: "Jamie Smith",
          writing_style: "creative",
          best_score: 95,
          best_style_score: 97,
          total_games: 8,
          avg_score: 89,
          last_played: new Date().toISOString(),
        },
        {
          username: "Taylor Wilson",
          display_name: "Taylor Wilson",
          writing_style: "marketing",
          best_score: 92,
          best_style_score: 94,
          total_games: 3,
          avg_score: 88,
          last_played: new Date().toISOString(),
        },
      ];
      setLeaderboardData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshLeaderboard = async () => {
    try {
      // Refresh the materialized view first
      await fetch("/api/leaderboard", { method: "POST" });
      // Then fetch the updated data
      await fetchLeaderboardData();
    } catch (err) {
      console.error("Failed to refresh leaderboard:", err);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, [writingStyle]); // Refetch when writing style changes

  const getFilteredLeaderboard = () => {
    if (!writingStyle || writingStyle === "") {
      return leaderboardData;
    }
    return leaderboardData.filter(
      (entry) =>
        entry.writing_style.toLowerCase() === writingStyle.toLowerCase()
    );
  };

  const displayData = getFilteredLeaderboard();

  return (
    <Card
      className={cn(
        "border shadow-lg overflow-hidden w-full max-w-4xl mx-auto",
        borderColor
      )}
    >
      <div
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${selectedStyle}`}
      ></div>
      <CardHeader className="pb-4 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <CardTitle
            className={cn(
              "text-xl sm:text-2xl flex items-center gap-2",
              textColor
            )}
          >
            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "capitalize px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-br text-xs sm:text-sm w-fit",
                selectedStyle
              )}
            >
              {writingStyle || "All"} Style{writingStyle ? "" : "s"}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={refreshLeaderboard}
              disabled={isLoading}
              className="p-2"
            >
              <RefreshCw
                className={cn("h-3 w-3", isLoading && "animate-spin")}
              />
            </Button>
          </div>
        </div>
        <CardDescription className={cn("text-sm sm:text-base", textColor)}>
          {error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            "Top performers ranked by their writing scores"
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[300px] sm:h-[350px] lg:h-[400px] pr-2 sm:pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-500">
                  Loading leaderboard...
                </span>
              </div>
            </div>
          ) : displayData.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Award className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  No entries yet for this style
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Be the first to set a score!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {displayData.map((entry, index) => (
                <div
                  key={`${entry.username}-${index}`}
                  className={cn(
                    "flex flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border gap-2 sm:gap-0",
                    entry?.isCurrentUser
                      ? `${bgColor} ${borderColor}`
                      : "bg-white border-slate-200"
                  )}
                >
                  <div className="flex items-center flex-1">
                    <div
                      className={cn(
                        "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-medium mr-3 text-sm sm:text-base",
                        index < 3
                          ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
                          : "bg-slate-100 text-slate-700"
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span
                          className={`font-medium text-sm sm:text-base truncate ${
                            entry.isCurrentUser ? textColor : "text-slate-700"
                          }`}
                        >
                          {entry.display_name || entry.username}
                          {entry.isCurrentUser && " (You)"}
                        </span>
                        <div className="flex items-center gap-2">
                          {entry.writing_style && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs text-white capitalize bg-gradient-to-r w-fit",
                                selectedStyle
                              )}
                            >
                              {entry.writing_style}
                            </Badge>
                          )}
                          {entry.total_games > 1 && (
                            <span className="text-xs text-gray-500">
                              {entry.total_games} games
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={index < 3 ? "default" : "outline"}
                    className={cn(
                      "px-2 sm:px-2.5 text-sm sm:text-base w-fit sm:ml-auto",
                      index < 3
                        ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
                        : ""
                    )}
                  >
                    {entry.best_score}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 px-4 sm:px-6">
        <Button
          variant="outline"
          onClick={() => setSelectedScreen(2)}
          className={cn(
            "border-slate-200 hover:bg-slate-50 transition-all hover:scale-105 w-full sm:w-auto",
            textColor
          )}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Analysis
        </Button>
        <Button
          onClick={handleReset}
          className={`bg-gradient-to-r ${selectedStyle} hover:opacity-90 text-white transition-all hover:scale-105 w-full sm:w-auto`}
        >
          Start New Challenge
        </Button>
      </CardFooter>
    </Card>
  );
}
