"use server";

import { createClient } from "@/app/utils/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function joinWaitlist(email: string) {
  try {
    const supabase = await createClient();

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("waitlist")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return {
        success: false,
        error:
          "You're already on our waitlist! We'll notify you when WordCraft launches.",
      };
    }

    // Insert new email into waitlist
    const { error } = await supabase
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

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        error: "Failed to join waitlist. Please try again.",
      };
    }

    // Get total waitlist count
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    // Send welcome email
    try {
      await resend.emails.send({
        from: "WordCraft <hello@wordcraft.app>", // Replace with your domain
        to: [email],
        subject: "🎉 Welcome to the WordCraft Waitlist!",
        html: generateWelcomeEmail(count || 0),
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail the whole operation if email fails
    }

    return {
      success: true,
      position: count || 0,
      message: "Successfully joined the waitlist!",
    };
  } catch (error) {
    console.error("Waitlist signup error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

function generateWelcomeEmail(position: number): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to WordCraft!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="background: linear-gradient(135deg, #9333ea, #ec4899); padding: 20px; border-radius: 20px; display: inline-block; margin-bottom: 20px;">
            <div style="width: 40px; height: 40px; background: white; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center;">
              ✨
            </div>
          </div>
          <h1 style="color: #1f2937; font-size: 28px; margin: 0; font-weight: bold;">
            Welcome to WordCraft! 🎉
          </h1>
        </div>

        <!-- Main Content -->
        <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin-bottom: 32px;">
          
          <!-- Position Badge -->
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 16px 24px; border-radius: 12px; display: inline-block;">
              <div style="font-size: 32px; font-weight: bold; margin-bottom: 4px;">
                #${position}
              </div>
              <div style="font-size: 14px; opacity: 0.9;">
                Your position on the waitlist
              </div>
            </div>
          </div>

          <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 16px; text-align: center;">
            You're officially on the list! 
          </h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 24px; text-align: center;">
            Thank you for joining the WordCraft waitlist! We're building something amazing to help you master articulate communication through AI-powered feedback and competitive challenges.
          </p>

          <!-- Features -->
          <div style="margin-bottom: 24px;">
            <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 16px;">What to expect:</h3>
            
            <div style="margin-bottom: 12px; display: flex; align-items: center;">
              <div style="background: #f3e8ff; color: #9333ea; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px;">✨</div>
              <span style="color: #4b5563;">AI-powered writing analysis and feedback</span>
            </div>
            
            <div style="margin-bottom: 12px; display: flex; align-items: center;">
              <div style="background: #fce7f3; color: #ec4899; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px;">🏆</div>
              <span style="color: #4b5563;">Competitive writing challenges and leaderboards</span>
            </div>
            
            <div style="margin-bottom: 12px; display: flex; align-items: center;">
              <div style="background: #ede9fe; color: #9333ea; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px;">📈</div>
              <span style="color: #4b5563;">Personalized progress tracking and insights</span>
            </div>
          </div>

          <div style="text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Expected launch: <strong style="color: #9333ea;">Q2 2024</strong>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; color: #6b7280; font-size: 14px;">
          <p style="margin-bottom: 16px;">
            We'll keep you updated on our progress and notify you the moment WordCraft launches.
          </p>
          <p style="margin: 0;">
            Questions? Reply to this email - we'd love to hear from you!
          </p>
          <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 12px;">
              WordCraft Team<br>
              Building the future of articulate communication
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
