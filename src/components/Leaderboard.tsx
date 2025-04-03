import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Award, ChevronLeft } from "lucide-react";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
import { Button } from "./ui/button";

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
}: LeaderboardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Guest");

  const handleReset = () => {
    setUserResponse("");
    setSelectedScreen(0);
    setIsLoggedIn(false);
    setSelectedStyle("from-teal-500 to-emerald-500");
    setTextColor("text-teal-600");
  };

  const getLeaderboard = () => {
    const defaultLeaderboard: Array<{
      name: string;
      score: number;
      style: string;
      isCurrentUser?: boolean;
    }> = [
      { name: "Alex Johnson", score: 98, style: "technical" },
      { name: "Jamie Smith", score: 95, style: "creative" },
      { name: "Taylor Wilson", score: 92, style: "marketing" },
      { name: "Morgan Lee", score: 90, style: "professional" },
      { name: "Casey Brown", score: 88, style: "academic" },
      { name: "Jordan Miller", score: 82, style: "professional" },
      { name: "Riley Davis", score: 80, style: "creative" },
      { name: "Quinn Thomas", score: 78, style: "technical" },
      { name: "Avery Martin", score: 75, style: "marketing" },
    ];

    // Add the current user to the leaderboard
    const userEntry = {
      name: isLoggedIn ? username : "Guest",
      score: 85,
      isCurrentUser: true,
      style: selectedStyle,
    };

    // Insert the user at position 6 (index 5)
    const updatedLeaderboard = [...defaultLeaderboard];
    updatedLeaderboard.splice(5, 0, userEntry);

    return updatedLeaderboard;
  };
  return (
    <Card className={cn("border shadow-lg overflow-hidden", borderColor)}>
      <div
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${selectedStyle}`}
      ></div>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle
            className={cn("text-2xl flex items-center gap-2", textColor)}
          >
            <Award className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
          <Badge
            className={cn(
              "capitalize px-3 py-1 bg-gradient-to-br",
              selectedStyle
            )}
          >
            {writingStyle} Style
          </Badge>
        </div>
        <CardDescription className={textColor}>
          Top performers ranked by their writing scores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-2">
            {getLeaderboard()
              .filter(
                (entry) =>
                  writingStyle === "" ||
                  entry.style === writingStyle.toLowerCase()
              )
              .map((entry, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    entry?.isCurrentUser
                      ? `${bgColor} ${borderColor}`
                      : "bg-white border-slate-200"
                  )}
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full font-medium mr-3",
                        index < 3
                          ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
                          : "bg-slate-100 text-slate-700"
                      )}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <span
                        className={`font-medium ${
                          entry.isCurrentUser ? textColor : "text-slate-700"
                        }`}
                      >
                        {entry.name}
                      </span>
                      {entry.style && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "ml-2 text-xs text-white capitalize bg-gradient-to-r ",
                            selectedStyle
                          )}
                        >
                          {entry.style}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={index < 3 ? "default" : "outline"}
                    className={cn(
                      "px-2.5",
                      index < 3
                        ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
                        : ""
                    )}
                  >
                    {entry.score}
                  </Badge>
                </div>
              ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setSelectedScreen(2)}
          className={cn("border-slate-200 hover:bg-slate-50", textColor)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Analysis
        </Button>
        <Button
          onClick={handleReset}
          className={`bg-gradient-to-r ${selectedStyle} hover:opacity-90 text-white`}
        >
          Start New Challenge
        </Button>
      </CardFooter>
    </Card>
  );
}
