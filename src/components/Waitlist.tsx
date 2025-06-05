"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Users,
  ArrowRight,
  CheckCircle,
  Play,
  Target,
  Zap,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/app/utils/supabase/client";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(127);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userPosition, setUserPosition] = useState(0);

  const supabase = createClient();

  // Get current waitlist count on component mount
  useEffect(() => {
    const getWaitlistCount = async () => {
      const { count } = await supabase
        .from("waitlist")
        .select("*", { count: "exact", head: true });

      if (count !== null && count > 10) {
        setWaitlistCount(count);
      }
    };

    getWaitlistCount();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from("waitlist")
        .select("id")
        .eq("email", email)
        .single();

      if (existingUser) {
        setError(
          "You're already on our waitlist! We'll notify you when WordCraft launches."
        );
        setIsLoading(false);
        return;
      }

      // Insert new email into waitlist
      const { data, error: insertError } = await supabase
        .from("waitlist")
        .insert([
          {
            email,
            joined_at: new Date().toISOString(),
            status: "active",
          },
        ])
        .select("id")
        .single();

      if (insertError) {
        console.error("Supabase error:", insertError);
        setError("Failed to join waitlist. Please try again.");
        setIsLoading(false);
        return;
      }

      // Get updated waitlist count
      const { count } = await supabase
        .from("waitlist")
        .select("*", { count: "exact", head: true });

      const newPosition = waitlistCount + 1;
      setUserPosition(newPosition);
      setWaitlistCount(newPosition);
      setIsSubmitted(true);

      // Send welcome email (non-blocking)
      try {
        await fetch("/api/send-welcome-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            position: newPosition,
          }),
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't show error to user - they're still on the waitlist
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Waitlist submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Feedback",
      description:
        "Get instant, intelligent suggestions to improve your writing style and clarity.",
      color: "purple",
    },
    {
      icon: Users,
      title: "Competitive Challenges",
      description:
        "Participate in writing challenges and compete with other writers to improve.",
      color: "pink",
    },
    {
      icon: Target,
      title: "Personalized Growth",
      description:
        "Track your progress with personalized insights and writing improvement plans.",
      color: "gradient",
    },
  ];

  // Success Screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-3xl shadow-xl mb-8 inline-block animate-bounce">
              <Sparkles className="h-16 w-16 text-white" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Welcome to WordCraft! 🎉
            </h1>

            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-2xl mb-8">
              <div className="text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                #{userPosition}
              </div>
              <p className="text-gray-700 mb-6 text-lg">
                You're number <strong>{userPosition}</strong> on our waitlist!
              </p>
              <Badge className="bg-gradient-to-r mx-auto from-purple-600 to-pink-600 text-white px-6 py-2 text-sm">
                Early Access Guaranteed
              </Badge>
            </Card>

            <p className="text-gray-600 mb-8 leading-relaxed">
              We'll notify you as soon as WordCraft launches.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                ✅ Check your email! We've sent you a welcome message with more
                details.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Waitlist Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative">
      {/* Full page background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div
          className="absolute top-1/4 left-1/4 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/2 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="ml-4 text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              WordCraft
            </h1>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Ditch vague phrases that{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              waste your message
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Master the art of articulate communication with AI-powered feedback,
            competitive challenges, and personalized writing improvement.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mb-12">
          <div className="flex items-center gap-2 text-purple-600">
            <Users className="w-5 h-5" />
            <span className="font-semibold text-lg">
              {waitlistCount.toLocaleString()} writers waiting
            </span>
          </div>
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 text-sm font-medium">
            Limited Beta Access
          </Badge>
        </div>

        {/* Main Card */}
        <Card className="max-w-md mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm mb-16">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Join the Waitlist
              </h3>
              <p className="text-gray-600">
                Be among the first to experience the future of writing
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Joining...
                  </div>
                ) : (
                  <>
                    Join Waitlist
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No spam, ever. Unsubscribe anytime.</span>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all duration-200"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  feature.color === "purple"
                    ? "bg-purple-100"
                    : feature.color === "pink"
                      ? "bg-pink-100"
                      : "bg-gradient-to-r from-purple-100 to-pink-100"
                }`}
              >
                <feature.icon
                  className={`w-6 h-6 ${
                    feature.color === "purple"
                      ? "text-purple-600"
                      : feature.color === "pink"
                        ? "text-pink-600"
                        : "text-purple-600"
                  }`}
                />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <p className="text-gray-700 italic max-w-2xl mx-auto text-lg">
            "This is exactly what I needed to improve my writing. The AI
            feedback is incredibly insightful and the gamified element makes it
            addictive!"
          </p>
          <p className="text-purple-600 font-semibold mt-3">
            - Sarah Chen, Content Writer
          </p>
        </div>
      </div>
    </div>
  );
}
