"use client";
import { Target } from "lucide-react";
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
}

export default function StyleSelection({
  setSelectedStyle,
  setSelectedScreen,
  setWritingStyle,
  setBorderColor,
  setBgColor,
  setTextColor,
}: WritingStyleProps) {
  const handleStyleChange = (style: StyleObject) => {
    setSelectedStyle(style.color);
    setBorderColor(style.borderColor);
    setWritingStyle(style.label);
    setBgColor(style.bgColor);
    setTextColor(style.textColor);
    // Set the selected screen to 1 to show the prompt
    setSelectedScreen(1);
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
                "hover:shadow-md hover:shadow-" + style.value + "-100 "
              )}
              onClick={() => handleStyleChange(style)}
            >
              <div
                className={`p-3 rounded-full bg-gradient-to-br ${style.color} mb-3 shadow-md`}
              >
                {style.icon}
              </div>
              <h3 className="text-lg font-medium text-slate-900  mb-1">
                {style.label}
              </h3>
              <p className="text-sm text-slate-600  text-center">
                {style.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
