"use client";
import Analysis from "@/components/Analysis";
import Header from "@/components/header";
import Leaderboard from "@/components/Leaderboard";
import ProgressBar from "@/components/progressBar";
import Prompt from "@/components/Prompt";
import StyleSelection from "@/components/StyleSelection";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [selectedStyle, setSelectedStyle] = useState(
    "from-teal-500 to-emerald-500"
  );
  const [borderColor, setBorderColor] = useState("border-teal-200");
  const [writingStyle, setWritingStyle] = useState("");
  const [bgColor, setBgColor] = useState(
    "bg-gradient-to-br from-teal-50 to-emerald-50 "
  );
  const [textColor, setTextColor] = useState("text-teal-600");

  const [userResponse, setUserResponse] = useState("");
  const [selectedScreen, setSelectedScreen] = useState(0);

  return (
    <div className=" flex flex-col bg-gradient-to-b from-teal-50 via-white to-teal-50 min-h-screen">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6 md:py-12 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-teal-900 dark:text-teal-50 sm:text-4xl flex items-center justify-center gap-2">
              <div
                className={cn(
                  "p-2 rounded-lg shadow-lg bg-gradient-to-r ",
                  selectedStyle
                )}
              >
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              WordCraft
            </h1>
            <p className="mt-2 text-lg text-teal-700 dark:text-teal-300">
              Enhance your writing skills through AI-powered analysis
            </p>
          </div>

          <ProgressBar
            selectedScreen={selectedScreen}
            selectedStyle={selectedStyle}
            textColor={textColor}
          />

          <section className="container mt-8 ">
            {selectedScreen === 0 && (
              <StyleSelection
                setSelectedStyle={setSelectedStyle}
                setSelectedScreen={setSelectedScreen}
                setWritingStyle={setWritingStyle}
                setBorderColor={setBorderColor}
                setBgColor={setBgColor}
                setTextColor={setTextColor}
              />
            )}
            {selectedScreen === 1 && (
              <Prompt
                borderColor={borderColor}
                writingStyle={writingStyle}
                selectedStyle={selectedStyle}
                bgColor={bgColor}
                textColor={textColor}
                userResponse={userResponse}
                setUserResponse={setUserResponse}
                setSelectedScreen={setSelectedScreen}
              />
            )}

            {selectedScreen === 2 && (
              <Analysis
                borderColor={borderColor}
                writingStyle={writingStyle}
                selectedStyle={selectedStyle}
                bgColor={bgColor}
                textColor={textColor}
                userResponse={userResponse}
                setSelectedScreen={setSelectedScreen}
              />
            )}

            {selectedScreen === 3 && (
              <Leaderboard
                borderColor={borderColor}
                writingStyle={writingStyle}
                selectedStyle={selectedStyle}
                bgColor={bgColor}
                textColor={textColor}
                setUserResponse={setUserResponse}
                setSelectedScreen={setSelectedScreen}
                setSelectedStyle={setSelectedStyle}
                setTextColor={setTextColor}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
