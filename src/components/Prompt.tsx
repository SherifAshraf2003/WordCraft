import { ArrowRight, BookOpen, ChevronLeft, Pencil } from "lucide-react";
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
}: PropmtProps) {
  const handleSubmit = () => {
    // Handle the submission of the user's response
    // You can add your logic here to process the response

    // Optionally, you can navigate to another screen or show a success message
    setSelectedScreen(2);
  };

  return (
    <Card className={cn("border shadow-lg overflow-hidden", borderColor)}>
      <div
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${selectedStyle}`}
      />
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle
            className={cn("text-2xl flex items-center gap-2", textColor)}
          >
            <Pencil className={cn("h-5 w-5", textColor)} />
            Writing Challenge
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
        <CardDescription className={cn("", textColor)}>
          Rewrite the prompt below in the most articulate way possible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "mb-6 p-4 rounded-lg  border bg-gradient-to-br",
            selectedStyle,
            bgColor
          )}
        >
          <div className="flex items-center mb-2">
            <BookOpen className={cn("h-4 w-4 mr-2", textColor)} />
            <h3 className={cn("text-sm font-medium", textColor)}>Prompt:</h3>
          </div>
          <p className="text-slate-700 ">
            &quot;Write a short story about a time traveler who accidentally
            alters a significant event in history.&quot;
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
            className={cn("min-h-[150px]", borderColor, {
              "focus:!border-current focus:!ring-0": true,
            })}
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setSelectedScreen(0)}
          className={cn(
            "border transition-all   cursor-pointer hover:scale-110 ",
            borderColor,
            textColor,
            bgColor
          )}
        >
          <ChevronLeft className="h-4 w-4" /> Change Style
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!userResponse.trim()}
          className={cn(
            "hover:opacity-90 cursor-pointer hover:scale-110 text-white bg-gradient-to-r",
            selectedStyle
          )}
        >
          Submit for Analysis <ArrowRight className=" h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
