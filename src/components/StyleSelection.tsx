"use client";
import { Target, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import { writingStyles } from "@/constants/writingStyles";

interface StyleObject {
  color: string;
  borderColor: string;
  label: string;
  bgColor: string;
  textColor: string;
}

// Define a proper interface for the component props
interface WritingStyleProps {
  setSelectedStyle: (style: string) => void;
  setSelectedScreen: (screen: number) => void;
  setWritingStyle: (style: string) => void;
  setBorderColor: (color: string) => void;
  setBgColor: (color: string) => void;
  setTextColor: (color: string) => void;
  setGeneratedPrompt: (prompt: string) => void;
  setIsGeneratingPrompt: (loading: boolean) => void;
  isGeneratingPrompt: boolean;
}

export default function StyleSelection({
  setSelectedStyle,
  setSelectedScreen,
  setWritingStyle,
  setBorderColor,
  setBgColor,
  setTextColor,
  setGeneratedPrompt,
  setIsGeneratingPrompt,
  isGeneratingPrompt,
}: WritingStyleProps) {
  const handleStyleChange = async (style: StyleObject) => {
    setSelectedStyle(style.color);
    setBorderColor(style.borderColor);
    setWritingStyle(style.label);
    setBgColor(style.bgColor);
    setTextColor(style.textColor);

    // Generate prompt using LLM
    setIsGeneratingPrompt(true);
    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          writingStyle: style.label.toLowerCase(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate prompt");
      }

      const data = await response.json();
      setGeneratedPrompt(data.prompt);

      // Move to the next screen after prompt is generated
      setSelectedScreen(1);
    } catch (error) {
      console.error("Error generating prompt:", error);
      // Fallback to default prompt on error
      setGeneratedPrompt(
        "Write a compelling piece that demonstrates your mastery of this writing style."
      );
      setSelectedScreen(1);
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  return (
    <Card className="border-teal-200  shadow-lg overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl text-teal-800  flex items-center gap-2">
          <Target className="h-5 w-5 text-teal-500" />
          Select Your Writing Style
        </CardTitle>
        <CardDescription className="text-teal-600 ">
          Choose a writing style to practice and receive tailored prompts and
          feedback
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {writingStyles.map((style) => (
            <div
              key={style.value}
              className={cn(
                "flex flex-col items-center p-6 rounded-lg border transition-all cursor-pointer transform hover:-translate-y-1",
                style.borderColor,
                style.bgColor,
                "hover:shadow-md hover:shadow-" + style.value + "-100",
                isGeneratingPrompt && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !isGeneratingPrompt && handleStyleChange(style)}
            >
              <div
                className={`p-3 rounded-full bg-gradient-to-br ${style.color} mb-3 shadow-md`}
              >
                {isGeneratingPrompt ? (
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                ) : (
                  style.icon
                )}
              </div>
              <h3 className="text-lg font-medium text-slate-900  mb-1">
                {style.label}
              </h3>
              <p className="text-sm text-slate-600  text-center">
                {style.description}
              </p>
              {isGeneratingPrompt && (
                <p className="text-xs text-slate-500 mt-2 animate-pulse">
                  Generating prompt...
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
