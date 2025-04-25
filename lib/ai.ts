import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateEmailContent(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result =
    await model.generateContent(`You are a professional email writing assistant. Write a single, well-formatted email based on this description. The email should:
- Don't include subject line in the response
- Use appropriate greetings and closings
- Be concise, kind, polite, respectful and professional
- Use proper paragraph spacing (use double newlines between paragraphs)
- Match the tone to the context
- Include only the final email, no options or explanations

Description: ${prompt}`);
  const response = await result.response;
  return response.text();
}

export async function getEmailCompletion(
  currentText: string,
  contextEmail: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result =
    await model.generateContent(`You are an email writing assistant. Based on the context of this previous email and the current text, suggest a natural continuation that matches the tone and context. Only return the continuation text, without any explanations or options.

Previous email for context:
${contextEmail}

Current text to complete:
${currentText}`);

  const response = await result.response;
  return response.text();
}
