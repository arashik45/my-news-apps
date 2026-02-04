import { GoogleGenAI } from "@google/genai";
import { AICheckResult } from "../types";

// আপনার API Key সরাসরি এখানে দিবেন না, এটি .env ফাইল বা Vercel থেকে আসবে
const API_KEY = process.env.GEMINI_API_KEY; 

export class GeminiService {
  private genAI: any;
  private model: any;

  constructor() {
    if (!API_KEY) {
      throw new Error("API_KEY is missing from environment variables");
    }
    // GoogleGenAI সেটআপ
    this.genAI = new GoogleGenAI(API_KEY);
    // মডেল সিলেক্ট করা (gemini-1.5-flash সবচেয়ে ভালো ও দ্রুত কাজ করে)
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async verifyClaim(claim: string, context?: string): Promise<AICheckResult> {
    const prompt = `
      You are an expert fact-checker in Bangladesh. 
      Analyze the following claim and provide a structured fact-check.
      CLAIM: "${claim}"
      CONTEXT: "${context || 'No additional context'}"
      
      Requirements:
      1. Use Google Search to find current information if needed.
      2. Provide the result in Bengali.
      3. Categorize it as Verified (সত্য), Fake (ভুয়া), or Misleading (বিভ্রান্তিকর).
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      
      // আপনার AICheckResult টাইপ অনুযায়ী রিটার্ন করুন
      return {
        result: responseText,
        status: "success"
        // আপনার টাইপ অনুযায়ী আরও ডাটা থাকলে এখানে যোগ করুন
      } as unknown as AICheckResult;
      
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("Failed to verify claim");
    }
  }
}
