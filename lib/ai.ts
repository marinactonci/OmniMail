import { GoogleGenerativeAI } from "@google/generative-ai";
import { authClient } from "./auth-client";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateEmailContent(prompt: string): Promise<string> {
  const { data: session } = await authClient.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result =
    await model.generateContent(`You are a professional email writing assistant. Write a single, well-formatted email based on this description. The email should:
- Don't include subject line in the response
- Use appropriate greetings and closings. User's name for closings is ${session.user.name}
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
  const { data: session } = await authClient.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = contextEmail
    ? `You are a professional email writing assistant. Continue this email based on the previous context and current text. The continuation should:
- Match the tone and style of the current text
- Use appropriate greetings and closings. User's name for closings is ${session.user.name}
- Be concise, kind, polite, respectful and professional
- Flow naturally from the current text
- Only include the continuation text, no explanations or options
- Consider the context of the previous email when relevant

Previous email for context:
${contextEmail}

Current text to continue:
${currentText}`
    : `You are a professional email writing assistant. Continue this email text professionally. The continuation should:
- Match the tone and style of the current text
- Use appropriate greetings and closings. User's name for closings is ${session.user.name}
- Be concise, kind, polite, respectful and professional
- Flow naturally from the current text
- Only include the continuation text, no explanations or options
- Maintain a clear and professional email structure

Current text to continue:
${currentText}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
