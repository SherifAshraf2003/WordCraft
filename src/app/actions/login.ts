"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { loginSchema } from "../schemas/loginSchema";
import { z } from "zod";

export async function login(data: z.infer<typeof loginSchema>) {
  // TODO: change username to email
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
