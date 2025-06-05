"use client";
import { Award, Check, Lightbulb, Pencil, Wand } from "lucide-react";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  selectedScreen: number;
  selectedStyle: string;
  textColor: string;
}

export default function ProgressBar({
  selectedScreen,
  selectedStyle,
  textColor,
}: ProgressBarProps) {
  const getProgress = () => {
    const progress = (selectedScreen / 3) * 100;
    return progress > 100 ? 100 : progress;
  };
  return (
    <div>
      <section className="container flex flex-col jusify-center items-center gap-2">
        <div className="w-full flex  justify-between">
          <div className="flex flex-col justify-center items-center gap-1 font-bold ">
            <div
              className={cn(
                " flex justify-center items-center h-10 w-10 rounded-full  ",
                selectedScreen === 0
                  ? cn(
                      " shadow-md text-white bg-gradient-to-br ",
                      selectedStyle
                    )
                  : selectedScreen > 0
                    ? cn("bg-gradient-to-br", selectedStyle)
                    : "bg-slate-100 "
              )}
            >
              {selectedScreen === 0 ? (
                <Wand className="h-5 w-5" />
              ) : (
                <Check className="h-5 w-5 text-white " />
              )}
            </div>
            <span
              className={cn(
                "text-xs",
                selectedScreen === 0
                  ? textColor
                  : selectedScreen > 0
                    ? textColor
                    : "text-slate-400"
              )}
            >
              Style Selection
            </span>
          </div>
          <div className="flex flex-col justify-center items-center gap-1 font-bold ">
            <div
              className={cn(
                " flex justify-center items-center h-10 w-10 rounded-full  ",
                selectedScreen === 1
                  ? cn(
                      " shadow-md text-white bg-gradient-to-br ",
                      selectedStyle
                    )
                  : selectedScreen > 1
                    ? cn("bg-gradient-to-br", selectedStyle)
                    : "bg-slate-100 "
              )}
            >
              {selectedScreen === 1 ? (
                <Pencil className="h-5 w-5" />
              ) : selectedScreen > 1 ? (
                <Check className="h-5 w-5 text-white " />
              ) : (
                <Pencil className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <span
              className={cn(
                "text-xs",
                selectedScreen === 1
                  ? textColor
                  : selectedScreen > 1
                    ? textColor
                    : "text-slate-400"
              )}
            >
              Prompt
            </span>
          </div>
          <div className="flex flex-col justify-center items-center gap-1 font-bold ">
            <div
              className={cn(
                " flex justify-center items-center h-10 w-10 rounded-full  ",
                selectedScreen === 2
                  ? cn(
                      " shadow-md text-white bg-gradient-to-br ",
                      selectedStyle
                    )
                  : selectedScreen > 2
                    ? cn("bg-gradient-to-br", selectedStyle)
                    : "bg-slate-100 "
              )}
            >
              {selectedScreen === 2 ? (
                <Lightbulb className="h-5 w-5" />
              ) : selectedScreen > 2 ? (
                <Check className="h-5 w-5 text-white " />
              ) : (
                <Lightbulb className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <span
              className={cn(
                "text-xs",
                selectedScreen === 2
                  ? textColor
                  : selectedScreen > 2
                    ? textColor
                    : "text-slate-400"
              )}
            >
              Analysis
            </span>
          </div>
          <div className="flex flex-col justify-center items-center gap-1 font-bold ">
            <div
              className={cn(
                " flex justify-center items-center h-10 w-10 rounded-full  ",
                selectedScreen === 3
                  ? cn(
                      " shadow-md text-white bg-gradient-to-br ",
                      selectedStyle
                    )
                  : selectedScreen > 3
                    ? cn("bg-gradient-to-br", selectedStyle)
                    : "bg-slate-100 "
              )}
            >
              {selectedScreen === 3 ? (
                <Award className="h-5 w-5" />
              ) : selectedScreen > 3 ? (
                <Check className="h-5 w-5 text-white " />
              ) : (
                <Award className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <span
              className={cn(
                "text-xs",
                selectedScreen === 3
                  ? textColor
                  : selectedScreen > 3
                    ? textColor
                    : "text-slate-400"
              )}
            >
              Leaderboard
            </span>
          </div>
        </div>
        <div className="w-full">
          <Progress progressStyle={selectedStyle} value={getProgress()} />
        </div>
      </section>
    </div>
  );
}
