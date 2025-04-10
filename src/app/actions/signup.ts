"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { loginSchema } from "../schemas/loginSchema";
import { z } from "zod";
import { signupSchema } from "../schemas/signupSchema";

export async function signup(data: z.infer<typeof signupSchema>) {
  const supabase = await createClient();

  // Check if the user already exists
  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
