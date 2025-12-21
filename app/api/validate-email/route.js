import { validateEmail } from "@/utils/emailValidatorProduction.js";

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ message: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const validation = await validateEmail(email);
    
    return new Response(
      JSON.stringify({
        isValid: validation.isValid,
        errors: validation.errors
      }),
      { 
        status: validation.isValid ? 200 : 400, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        message: "Email validation failed", 
        error: error.message 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}