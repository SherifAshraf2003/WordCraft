import Header from "@/components/header";
import ProgressBar from "@/components/progressBar";
import WritingStyle from "@/components/writingStyle";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className=" flex flex-col bg-gradient-to-b from-teal-50 via-white to-teal-50 min-h-screen">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6 md:py-12 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-teal-900 dark:text-teal-50 sm:text-4xl flex items-center justify-center gap-2">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              WordCraft
            </h1>
            <p className="mt-2 text-lg text-teal-700 dark:text-teal-300">
              Enhance your writing skills through AI-powered analysis
            </p>
          </div>

          <ProgressBar />

          <section className="container">
            <WritingStyle />
          </section>
        </div>
      </main>
    </div>
  );
}
