"use client";
import { Award, Lightbulb, Pencil, Wand } from "lucide-react";
import { Progress } from "./ui/progress";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ProgressBar() {
  const [onboardingStep, setOnboardingStep] = useState(0);

  return (
    <div>
      <section className="container flex flex-col jusify-center items-center gap-2">
        <div className="w-full flex  justify-between">
          <div className="flex flex-col justify-center items-center gap-1 font-bold ">
            <div
              className={cn(
                " flex justify-center items-center h-10 w-10 rounded-full  ",
                onboardingStep === 0
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 shadow-md text-white"
                  : "bg-slate-100 text-slate-400"
              )}
            >
              <Wand className="h-5 w-5" />
            </div>
            <span
              className={cn(
                "text-xs",
                onboardingStep === 0 ? "text-teal-600" : "text-slate-400"
              )}
            >
              Style Selection
            </span>
          </div>
          <div className="flex flex-col justify-center items-center gap-1 font-bold ">
            <div
              className={cn(
                " flex justify-center items-center h-10 w-10 rounded-full  ",
                onboardingStep === 1
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 shadow-md text-white"
                  : "bg-slate-100 text-slate-400"
              )}
            >
              <Pencil className="h-5 w-5" />
            </div>
            <span
              className={cn(
                "text-xs",
                onboardingStep === 1 ? "text-teal-600" : "text-slate-400"
              )}
            >
              Prompt
            </span>
          </div>
          <div className="flex flex-col justify-center items-center gap-1 font-bold ">
            <div
              className={cn(
                " flex justify-center items-center h-10 w-10 rounded-full  ",
                onboardingStep === 2
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 shadow-md text-white"
                  : "bg-slate-100 text-slate-400"
              )}
            >
              <Lightbulb className="h-5 w-5" />
            </div>
            <span
              className={cn(
                "text-xs",
                onboardingStep === 2 ? "text-teal-600" : "text-slate-400"
              )}
            >
              Analysis
            </span>
          </div>
          <div className="flex flex-col justify-center items-center gap-1 font-bold ">
            <div
              className={cn(
                " flex justify-center items-center h-10 w-10 rounded-full  ",
                onboardingStep === 3
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 shadow-md text-white"
                  : "bg-slate-100 text-slate-400"
              )}
            >
              <Award className="h-5 w-5" />
            </div>
            <span
              className={cn(
                "text-xs",
                onboardingStep === 3 ? "text-teal-600" : "text-slate-400"
              )}
            >
              Leaderboard
            </span>
          </div>
        </div>
        <div className="w-full">
          <Progress />
        </div>
      </section>
    </div>
  );
}
