"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/app/schemas/loginSchema";
import { signupSchema } from "@/app/schemas/signupSchema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { createClient } from "@/app/utils/supabase/client";

export default function HeaderClient({
  setUserInfo,
}: {
  setUserInfo?: (user: { username: string; email?: string } | null) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userInfo, setUserInfoLocal] = useState<{
    username: string;
    email?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"login" | "signup">("login");

  const loginForm = useForm<{ email: string; password: string }>({
    resolver: zodResolver(
      z.object({
        email: z.string().email({ message: "Invalid email address" }),
        password: z
          .string()
          .min(8, { message: "Password must be at least 8 characters" })
          .max(50, { message: "Password must be less than 50 characters" }),
      })
    ),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // Supabase client
  const supabase = createClient();

  // Session handling: check for existing session on mount
  useEffect(() => {
    let ignore = false;
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session && session.user && !ignore) {
        const email = session.user.email || "";
        // Try to fetch username from users table
        let username = "";
        const { data: userRow } = await supabase
          .from("users")
          .select("username")
          .eq("email", email)
          .single();
        if (userRow?.username) {
          username = userRow.username;
        }
        setIsLoggedin(true);
        setUserInfoLocal({ username, email });
        setBothUserInfo({ username, email });
      }
    };
    getSession();
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && session.user) {
          const email = session.user.email || "";
          // Fetch username from users table
          supabase
            .from("users")
            .select("username")
            .eq("email", email)
            .single()
            .then(({ data: userRow }) => {
              setIsLoggedin(true);
              setUserInfoLocal({ username: userRow?.username || "", email });
              setBothUserInfo({ username: userRow?.username || "", email });
            });
        } else {
          setIsLoggedin(false);
          setUserInfoLocal(null);
          setBothUserInfo(null);
        }
      }
    );
    return () => {
      ignore = true;
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Login handler
  const onLoginSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { error: loginError, data } =
        await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
      if (loginError) {
        setError(loginError.message || "Login failed");
        setLoading(false);
        return;
      }
      // Optionally, fetch username from users table
      let username = "";
      const { data: userRow } = await supabase
        .from("users")
        .select("username")
        .eq("email", values.email)
        .single();
      if (userRow?.username) {
        username = userRow.username;
      }
      setIsLoggedin(true);
      setUserInfoLocal({ username, email: values.email });
      setBothUserInfo({ username, email: values.email });
      setIsDialogOpen(false);
      loginForm.reset();
    } catch (e: any) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Signup handler
  const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true);
    setError(null);
    try {
      // Supabase signUp expects email and password
      const { error: signupError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { username: values.username },
        },
      });
      if (signupError) {
        setError(signupError.message || "Sign up failed");
        setLoading(false);
        return;
      }
      // Optionally, insert username into users table
      await supabase.from("users").insert({
        username: values.username,
        email: values.email,
        is_guest: false,
      });
      setIsLoggedin(true);
      setUserInfoLocal({ username: values.username, email: values.email });
      setBothUserInfo({ username: values.username, email: values.email });
      setIsDialogOpen(false);
      signupForm.reset();
    } catch (e: any) {
      setError(e.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await supabase.auth.signOut();
      setIsLoggedin(false);
      setUserInfoLocal(null);
      setBothUserInfo(null);
    } catch (e: any) {
      setError(e.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const setBothUserInfo = (
    user: { username: string; email?: string } | null
  ) => {
    setUserInfoLocal(user);
    if (setUserInfo) setUserInfo(user);
  };

  return (
    <div>
      {isLoggedin && userInfo ? (
        <div className="flex items-center gap-2">
          <span className="text-sm">Hello, {userInfo.username}</span>
          <Button
            className=" px-2 py-1 text-xs bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
            onClick={handleLogout}
            disabled={loading}
            size="lg"
          >
            Logout
          </Button>
        </div>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base">
              Login
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <Tabs
              className="w-full p-2 sm:p-4"
              value={tab}
              onValueChange={(v) => setTab(v as "login" | "signup")}
            >
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="login" className="text-xs sm:text-sm">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-xs sm:text-sm">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent className="py-3 sm:py-4" value="login">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">
                    Login to WordCraft
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    Sign in to track your progress and compete on the
                    leaderboard.
                  </DialogDescription>
                </DialogHeader>
                <Form {...loginForm}>
                  <form
                    className="grid gap-3 sm:gap-4 py-3 sm:py-4"
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  >
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your password"
                              className="text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {error && tab === "login" && (
                      <div className="text-red-500 text-xs mt-1">{error}</div>
                    )}
                    <DialogFooter className="mt-3 sm:mt-4">
                      <Button
                        type="submit"
                        className="bg-teal-600 w-full text-white hover:bg-teal-700 cursor-pointer py-2 sm:py-3 text-sm sm:text-base"
                        disabled={loading}
                      >
                        {loading ? "Logging in..." : "Login"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent className="py-3 sm:py-4" value="signup">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">
                    Create an Account
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    Join WordCraft to save your progress and compete with
                    others.
                  </DialogDescription>
                </DialogHeader>
                <Form {...signupForm}>
                  <form
                    className="grid gap-3 sm:gap-4 py-3 sm:py-4"
                    onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                  >
                    <FormField
                      control={signupForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your username"
                              className="text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your password"
                              className="text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {error && tab === "signup" && (
                      <div className="text-red-500 text-xs mt-1">{error}</div>
                    )}
                    <DialogFooter className="mt-3 sm:mt-4">
                      <Button
                        type="submit"
                        className="bg-teal-600 w-full text-white hover:bg-teal-700 cursor-pointer py-2 sm:py-3 text-sm sm:text-base"
                        disabled={loading}
                      >
                        {loading ? "Signing up..." : "Sign Up"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
