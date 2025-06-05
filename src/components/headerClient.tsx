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
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/app/schemas/loginSchema";
import { signupSchema } from "@/app/schemas/signupSchema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";

export default function HeaderClient() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoggedin] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
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

  return (
    <div>
      {isLoggedin ? (
        <div>logged in</div>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer !py-5  ">
              Login
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Tabs className="w-full p-4 ">
              <TabsList className="w-full grid grid-cols-2 ">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent className="py-4" value="login">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Login to WordCraft
                  </DialogTitle>
                  <DialogDescription className="text-lg">
                    Sign in to track your progress and compete on the
                    leaderboard.
                  </DialogDescription>
                </DialogHeader>
                <Form {...loginForm}>
                  <form
                    className="grid gap-4 py-4"
                    // onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  >
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your username"
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
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your password"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <DialogFooter className=" mt-4 ">
                      <Button
                        type="submit"
                        className="bg-teal-600  w-full  text-white hover:bg-teal-700  cursor-pointer !py-5  "
                      >
                        Login
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent className="py-4" value="signup">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Create an Account
                  </DialogTitle>
                  <DialogDescription className="text-lg">
                    Join WordCraft to save your progress and compete with
                    others.
                  </DialogDescription>
                </DialogHeader>
                <Form {...signupForm}>
                  <form
                    className="grid gap-4 py-4"
                    // onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                  >
                    <FormField
                      control={signupForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your username"
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
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your password"
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <DialogFooter className="mt-4 ">
                      <Button
                        type="submit"
                        className="bg-teal-600 w-full  text-white hover:bg-teal-700 cursor-pointer !py-5"
                      >
                        Sign Up
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
