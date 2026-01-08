import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-pro",
});

export const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

export async function getEmbedding(text: string) {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Request timeout after ${timeoutMs}ms`)),
        timeoutMs,
      ),
    ),
  ]);
}

async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 2,
  delayMs: number = 1000,
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error);

      if (attempt === maxAttempts) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error("Max attempts reached");
}

export async function analyzeWithGemini(
  prompt: string,
  timeoutMs: number = 45000,
) {
  const generateContent = async () => {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  };

  const text = await withRetry(
    () => withTimeout(generateContent(), timeoutMs),
    2,
    2000,
  );

  try {
    return JSON.parse(text.replace(/```json\n?/g, "").replace(/```\n?/g, ""));
  } catch (parseError) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Invalid JSON response from AI");
  }
}
