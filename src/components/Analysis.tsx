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
} from "lucide-react";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";

interface AnalysisProps {
  selectedStyle: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  writingStyle: string;
  userResponse: string;
  setSelectedScreen: (screen: number) => void;
}

// Function to get analysis data based on selected style
function getAnalysis(style: string) {
  // Default analysis data that could be modified based on style
  return {
    metrics: {
      clarity: 90,
      structure: 85,
      wordChoice: 80,
      grammar: 95,
    },
    styleSpecific: {
      score: 87,
      tips: [
        "Strengthen your literature review section",
        "Add more counterarguments to demonstrate critical thinking",
        "Consider more recent scholarly sources to support your claims",
      ],
    },
  };
}

// Function to get style-specific colors
function getStyleColors() {
  return {
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    color: "from-teal-500 to-emerald-500",
  };
}

export default function Analysis({
  selectedStyle,
  bgColor,
  textColor,
  borderColor,
  writingStyle,
  userResponse,
  setSelectedScreen,
}: AnalysisProps) {
  const data = {
    strengths: [
      "Well-structured argument",
      "Appropriate citation of sources",
      "Formal academic tone",
    ],
    weaknesses: [
      "Some claims need stronger evidence",
      "Thesis statement could be more specific",
    ],
    styleSpecific: {
      score: 87,
      tips: [
        "Strengthen your literature review section",
        "Add more counterarguments to demonstrate critical thinking",
        "Consider more recent scholarly sources to support your claims",
      ],
    },
  };

  const baseAnalysis = {
    score: 85,
    metrics: {
      clarity: 90,
      structure: 85,
      wordChoice: 80,
      grammar: 95,
    },
  };

  return (
    <Card className={cn("border shadow-lg overflow-hidden", borderColor)}>
      <div
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${selectedStyle}`}
      ></div>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle
            className={cn("text-2xl  flex items-center gap-2", textColor)}
          >
            <Lightbulb className="h-5 w-5 " />
            Analysis Results
          </CardTitle>
          <div className="flex flex-col items-end">
            <div className={cn("text-2xl font-bold ", textColor)}>
              {data.styleSpecific.score}/100
            </div>
            <Badge
              className={cn("capitalize mt-1 bg-gradient-to-r ", selectedStyle)}
            >
              {writingStyle} Style
            </Badge>
          </div>
        </div>
        <CardDescription className={cn(textColor)}>
          AI evaluation of your writing response
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div
          className={cn(
            "p-4 bg-white rounded-lg border ",
            borderColor,
            bgColor
          )}
        >
          <h3 className={cn("text-sm font-medium  mb-2", textColor)}>
            Your Response:
          </h3>
          <p className="text-slate-600">{userResponse}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={cn("p-4  rounded-lg border bg-emerald-50 ", borderColor)}
          >
            <h3
              className={cn(
                "text-sm font-medium   mb-2 flex items-center",
                textColor
              )}
            >
              <Check className="mr-1 h-4 w-4" /> Strengths
            </h3>
            <ul className="list-disc pl-5 text-slate-700  space-y-1">
              {data.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-amber-50  rounded-lg border border-amber-200 ">
            <h3 className="text-sm font-medium text-amber-800  mb-2 flex items-center">
              <AlertCircle className="mr-1 h-4 w-4" /> Areas for Improvement
            </h3>
            <ul className="list-disc pl-5 text-slate-700  space-y-1">
              {data.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={cn("p-4 bg-white  rounded-lg border ", borderColor)}>
          <h3
            className={cn(
              "text-sm font-medium  mb-3 flex items-center",
              textColor
            )}
          >
            <BarChart3 className="mr-1 h-4 w-4" /> Metrics Breakdown
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600 ">Clarity</span>
                <span className={cn("text-sm font-medium ", textColor)}>
                  {baseAnalysis.metrics.clarity}%
                </span>
              </div>
              <Progress
                value={baseAnalysis.metrics.clarity}
                progressStyle={selectedStyle}
                className="h-2 bg-slate-200 "
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Structure</span>
                <span className={cn("text-sm font-medium ", textColor)}>
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
                <span className="text-sm text-slate-600">Word Choice</span>
                <span className={cn("text-sm font-medium ", textColor)}>
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
                <span className="text-sm text-slate-600">Grammar</span>
                <span className={cn("text-sm font-medium ", textColor)}>
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

        <div className={cn("p-4 rounded-lg border", bgColor, borderColor)}>
          <h3
            className={cn(
              "text-sm font-medium mb-2 flex items-center",
              textColor
            )}
          >
            <Zap className="mr-1 h-4 w-4" />
            <span className="capitalize">{writingStyle}</span> Style Feedback
          </h3>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-slate-600">
                Style-Specific Score
              </span>
              <span className={cn("text-sm font-medium", textColor)}>
                {data.styleSpecific.score}%
              </span>
            </div>
            <Progress
              value={data.styleSpecific.score}
              progressStyle={selectedStyle}
              className="h-2 bg-slate-200"
            />
          </div>
          <div>
            <h4 className={cn("text-xs font-medium mb-1", textColor)}>
              Style-Specific Tips:
            </h4>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              {data.styleSpecific.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setSelectedScreen(1)}
          className={cn(
            "border transition-all   cursor-pointer hover:scale-110 ",
            borderColor,
            textColor,
            bgColor
          )}
        >
          <ChevronLeft className="h-4 w-4" /> Try Again
        </Button>
        <Button
          onClick={() => setSelectedScreen(3)}
          className={cn(
            "hover:opacity-90 cursor-pointer hover:scale-110 text-white bg-gradient-to-r",
            selectedStyle
          )}
        >
          View Leaderboard <ArrowRight className=" h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
