import { GoogleGenAI } from "@google/genai";
import { AICheckResult } from "../types";

const API_KEY = process.env.GEMINI_API_KEY; 

export class GeminiService {
  private genAI: any;
  private model: any;

  constructor() {
    if (!API_KEY) {
      throw new Error("API_KEY is missing from environment variables");
    }
    this.genAI = new GoogleGenAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async verifyClaim(claim: string, context?: string): Promise<AICheckResult> {
    const prompt = `
      You are an expert fact-checker in Bangladesh. 
      Analyze the following claim and provide a structured fact-check in Bengali.
      CLAIM: "${claim}"
      CONTEXT: "${context || 'No additional context'}"
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      
      return {
        result: responseText,
        status: "success"
      } as any;
      
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("Failed to verify claim");
    }
  }
}

// এই লাইনটি খুবই গুরুত্বপূর্ণ, এটি যোগ করুন:
export const geminiService = new GeminiService();
