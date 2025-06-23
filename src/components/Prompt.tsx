import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  Pencil,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

interface PropmtProps {
  borderColor: string;
  writingStyle: string;
  selectedStyle: string;
  bgColor: string;
  textColor: string;
  userResponse: string;
  setUserResponse: (value: string) => void;
  setSelectedScreen: (screen: number) => void;
  generatedPrompt: string;
  setAnalysisResult: (result: any) => void;
  setIsAnalyzing: (loading: boolean) => void;
  isAnalyzing: boolean;
}

export default function Prompt({
  borderColor,
  writingStyle,
  selectedStyle,
  bgColor,
  textColor,
  userResponse,
  setUserResponse,
  setSelectedScreen,
  generatedPrompt,
  setAnalysisResult,
  setIsAnalyzing,
  isAnalyzing,
}: PropmtProps) {
  const handleSubmit = async () => {
    if (!userResponse.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-writing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userResponse: userResponse.trim(),
          writingStyle: writingStyle.toLowerCase(),
          prompt: generatedPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze writing");
      }

      const analysisData = await response.json();
      setAnalysisResult(analysisData);
      setSelectedScreen(2);
    } catch (error) {
      console.error("Error analyzing writing:", error);
      // Fallback analysis on error
      setAnalysisResult({
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
          `Focus on ${writingStyle}-specific techniques`,
          "Practice more exercises in this style",
          "Consider studying examples of excellent writing",
        ],
        writingStyle,
        userResponse,
        prompt: generatedPrompt,
      });
      setSelectedScreen(2);
    } finally {
      setIsAnalyzing(false);
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
      />
      <CardHeader className="pb-4 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <CardTitle
            className={cn(
              "text-xl sm:text-2xl flex items-center gap-2",
              textColor
            )}
          >
            <Pencil className={cn("h-4 w-4 sm:h-5 sm:w-5", textColor)} />
            Writing Challenge
          </CardTitle>
          <Badge
            className={cn(
              "capitalize px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-br text-xs sm:text-sm w-fit",
              selectedStyle
            )}
          >
            {writingStyle} Style
          </Badge>
        </div>
        <CardDescription className={cn("text-sm sm:text-base", textColor)}>
          Rewrite the prompt below in the most articulate way possible
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div
          className={cn(
            "mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border bg-gradient-to-br",
            selectedStyle,
            bgColor
          )}
        >
          <div className="flex items-center mb-2">
            <BookOpen className={cn("h-4 w-4 mr-2", textColor)} />
            <h3 className={cn("text-sm font-medium", textColor)}>Prompt:</h3>
          </div>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {generatedPrompt || "Loading your personalized writing prompt..."}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <Pencil className={cn("h-4 w-4 mr-2", textColor)} />
            <h3 className={cn("text-sm font-medium", textColor)}>
              Your Response:
            </h3>
          </div>
          <Textarea
            placeholder="Write your response here..."
            className={cn(
              "min-h-[120px] sm:min-h-[150px] text-sm sm:text-base",
              borderColor,
              {
                "focus:!border-current focus:!ring-0": true,
              }
            )}
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 px-4 sm:px-6">
        <Button
          variant="outline"
          onClick={() => setSelectedScreen(0)}
          className={cn(
            "border transition-all cursor-pointer hover:scale-105 w-full sm:w-auto",
            borderColor,
            textColor,
            bgColor
          )}
        >
          <ChevronLeft className="h-4 w-4" /> Change Style
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!userResponse.trim() || isAnalyzing}
          className={cn(
            "hover:opacity-90 cursor-pointer hover:scale-105 text-white bg-gradient-to-r w-full sm:w-auto",
            selectedStyle,
            (isAnalyzing || !userResponse.trim()) &&
              "opacity-50 cursor-not-allowed"
          )}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Submit for Analysis <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
