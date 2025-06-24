import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Check,
  ChevronLeft,
  Lightbulb,
  Zap,
  Loader2,
} from "lucide-react";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

interface AnalysisProps {
  selectedStyle: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  writingStyle: string;
  userResponse: string;
  setSelectedScreen: (screen: number) => void;
  analysisResult: any;
  generatedPrompt?: string;
  userInfo?: any;
}

export default function Analysis({
  selectedStyle,
  bgColor,
  textColor,
  borderColor,
  writingStyle,
  userResponse,
  setSelectedScreen,
  analysisResult,
  generatedPrompt,
  userInfo,
}: AnalysisProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Use real analysis data or fallback to default
  const data = analysisResult || {
    overallScore: 75,
    metrics: {
      clarity: 75,
      structure: 75,
      wordChoice: 75,
      grammar: 80,
    },
    styleSpecificScore: 75,
    strengths: [
      "Good attempt at the writing task",
      "Shows understanding of the prompt",
      "Demonstrates effort and engagement",
    ],
    weaknesses: [
      "Could benefit from more detailed analysis",
      "May need refinement in style-specific elements",
    ],
    styleSpecificTips: [
      "Focus on writing-specific techniques",
      "Practice more exercises in this style",
      "Consider studying examples of excellent writing",
    ],
  };

  const baseAnalysis = {
    score: data.overallScore || 85,
    metrics: data.metrics || {
      clarity: 90,
      structure: 85,
      wordChoice: 80,
      grammar: 95,
    },
  };

  const handleViewLeaderboard = async () => {
    // Save the game result before proceeding to leaderboard
    setIsSaving(true);
    setSaveError(null);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const gameData = {
        username: userInfo?.username || "Guest", // If you have userInfo in props/context, use it
        promptText: generatedPrompt || data.prompt || "Default prompt",
        userResponse: userResponse,
        writingStyle: writingStyle.toLowerCase(),
        analysisResult: {
          overallScore: data.overallScore,
          styleSpecificScore: data.styleSpecificScore,
          metrics: {
            clarity: data.metrics.clarity,
            structure: data.metrics.structure,
            wordChoice: data.metrics.wordChoice,
            grammar: data.metrics.grammar,
          },
          strengths: data.strengths,
          weaknesses: data.weaknesses,
          styleSpecificTips: data.styleSpecificTips,
        },
      };

      const response = await fetch("/api/save-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error("Failed to save game result");
      }

      const result = await response.json();

      if (result.success) {
        console.log("Game saved successfully:", result.gameId);
        // Proceed to leaderboard
        setSelectedScreen(3);
      } else {
        throw new Error(result.error || "Failed to save game");
      }
    } catch (error) {
      console.error("Error saving game:", error);
      setSaveError(
        "Failed to save your score. Proceeding to leaderboard anyway."
      );
      // Still proceed to leaderboard even if save fails
      setTimeout(() => {
        setSelectedScreen(3);
      }, 2000);
    } finally {
      setIsSaving(false);
    }
  };

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
            <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
            Analysis Results
          </CardTitle>
          <div className="flex flex-col items-start sm:items-end">
            <div className={cn("text-xl sm:text-2xl font-bold", textColor)}>
              {data.styleSpecificScore}/100
            </div>
            <Badge
              className={cn(
                "capitalize mt-1 bg-gradient-to-r text-xs sm:text-sm",
                selectedStyle
              )}
            >
              {writingStyle} Style
            </Badge>
          </div>
        </div>
        <CardDescription className={cn("text-sm sm:text-base", textColor)}>
          AI evaluation of your writing response
          {saveError && (
            <div className="mt-2 text-red-500 text-sm">{saveError}</div>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        <div
          className={cn(
            "p-3 sm:p-4 bg-white rounded-lg border",
            borderColor,
            bgColor
          )}
        >
          <h3 className={cn("text-sm font-medium mb-2", textColor)}>
            Your Response:
          </h3>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {userResponse}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div
            className={cn(
              "p-3 sm:p-4 rounded-lg border bg-emerald-50",
              borderColor
            )}
          >
            <h3
              className={cn(
                "text-sm font-medium mb-2 flex items-center",
                textColor
              )}
            >
              <Check className="mr-1 h-4 w-4" /> Strengths
            </h3>
            <ul className="list-disc pl-4 sm:pl-5 text-slate-700 space-y-1 text-sm sm:text-base">
              {data.strengths.map((strength: string, index: number) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="text-sm font-medium text-amber-800 mb-2 flex items-center">
              <AlertCircle className="mr-1 h-4 w-4" /> Areas for Improvement
            </h3>
            <ul className="list-disc pl-4 sm:pl-5 text-slate-700 space-y-1 text-sm sm:text-base">
              {data.weaknesses.map((weakness: string, index: number) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={cn("p-3 sm:p-4 bg-white rounded-lg border", borderColor)}
        >
          <h3
            className={cn(
              "text-sm font-medium mb-3 flex items-center",
              textColor
            )}
          >
            <BarChart3 className="mr-1 h-4 w-4" /> Metrics Breakdown
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs sm:text-sm text-slate-600">
                  Clarity
                </span>
                <span
                  className={cn("text-xs sm:text-sm font-medium", textColor)}
                >
                  {baseAnalysis.metrics.clarity}%
                </span>
              </div>
              <Progress
                value={baseAnalysis.metrics.clarity}
                progressStyle={selectedStyle}
                className="h-2 bg-slate-200"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs sm:text-sm text-slate-600">
                  Structure
                </span>
                <span
                  className={cn("text-xs sm:text-sm font-medium", textColor)}
                >
                  {baseAnalysis.metrics.structure}%
                </span>
              </div>
              <Progress
                value={baseAnalysis.metrics.structure}
                progressStyle={selectedStyle}
                className="h-2 bg-slate-200"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs sm:text-sm text-slate-600">
                  Word Choice
                </span>
                <span
                  className={cn("text-xs sm:text-sm font-medium", textColor)}
                >
                  {baseAnalysis.metrics.wordChoice}%
                </span>
              </div>
              <Progress
                value={baseAnalysis.metrics.wordChoice}
                progressStyle={selectedStyle}
                className="h-2 bg-slate-200"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs sm:text-sm text-slate-600">
                  Grammar
                </span>
                <span
                  className={cn("text-xs sm:text-sm font-medium", textColor)}
                >
                  {baseAnalysis.metrics.grammar}%
                </span>
              </div>
              <Progress
                value={baseAnalysis.metrics.grammar}
                progressStyle={selectedStyle}
                className="h-2 bg-slate-200"
              />
            </div>
          </div>
        </div>

        <div
          className={cn("p-3 sm:p-4 rounded-lg border", bgColor, borderColor)}
        >
          <h3
            className={cn(
              "text-sm font-medium mb-2 flex items-start sm:items-center flex-col sm:flex-row gap-1 sm:gap-2",
              textColor
            )}
          >
            <div className="flex items-center">
              <Zap className="mr-1 h-4 w-4" />
              <span className="capitalize">{writingStyle}</span>
            </div>
            <span className="text-xs sm:text-sm">Style Feedback</span>
          </h3>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-xs sm:text-sm text-slate-600">
                Style-Specific Score
              </span>
              <span className={cn("text-xs sm:text-sm font-medium", textColor)}>
                {data.styleSpecificScore}%
              </span>
            </div>
            <Progress
              value={data.styleSpecificScore}
              progressStyle={selectedStyle}
              className="h-2 bg-slate-200"
            />
          </div>
          <div>
            <h4 className={cn("text-xs font-medium mb-1", textColor)}>
              Style-Specific Tips:
            </h4>
            <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-slate-700 space-y-1">
              {data.styleSpecificTips.map((tip: string, index: number) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 px-4 sm:px-6">
        <Button
          variant="outline"
          onClick={() => setSelectedScreen(1)}
          disabled={isSaving}
          className={cn(
            "border transition-all cursor-pointer hover:scale-105 w-full sm:w-auto",
            borderColor,
            textColor,
            bgColor
          )}
        >
          <ChevronLeft className="h-4 w-4" /> Try Again
        </Button>
        <Button
          onClick={handleViewLeaderboard}
          disabled={isSaving}
          className={cn(
            "hover:opacity-90 cursor-pointer hover:scale-105 text-white bg-gradient-to-r w-full sm:w-auto",
            selectedStyle,
            isSaving && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              View Leaderboard <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
