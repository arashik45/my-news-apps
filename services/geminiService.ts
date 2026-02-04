
import { GoogleGenAI, Type } from "@google/genai";
import { AICheckResult } from "../types";

const API_KEY = process.env.API_KEY;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!API_KEY) {
      throw new Error("API_KEY is missing from environment");
    }
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
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

    const response = await this.ai.models.generateContent({
      model: "