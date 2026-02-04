import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY; 

export class GeminiService {
  private genAI: any;
  private model: any;

  constructor() {
    if (!API_KEY) {
      throw new Error("API_KEY is missing");
    }
    this.genAI = new GoogleGenAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async verifyClaim(claim: string, context?: string) {
    const prompt = `Fact-check this in Bengali: ${claim}. Context: ${context || ''}`;
    try {
      const result = await this.model.generateContent(prompt);
      return { result: result.response.text(), status: "success" };
    } catch (error) {
      return { result: "Error occurred", status: "error" };
    }
  }
}

// এই লাইনটি অবশ্যই থাকতে হবে
export const geminiService = new GeminiService();
