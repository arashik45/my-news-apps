import { GoogleGenAI } from "@google/genai";

// Vite এর জন্য নিচের লাইনটি ব্যবহার করুন
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY; 

export class GeminiService {
  private genAI: any;
  private model: any;

  constructor() {
    if (!API_KEY) {
      // এই এররটি কনসোলে দেখালে বুঝবেন API Key ঠিকমতো পায়নি
      console.error("API_KEY is missing! Check your Vercel Environment Variables.");
      return; 
    }
    this.genAI = new GoogleGenAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async verifyClaim(claim: string, context?: string) {
    if (!this.model) return { result: "Model not initialized", status: "error" };

    const prompt = `Fact-check this in Bengali: ${claim}. Context: ${context || ''}`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return { result: response.text(), status: "success" };
    } catch (error) {
      console.error("Gemini Error:", error);
      return { result: "Error occurred during fact-check", status: "error" };
    }
  }
}

export const geminiService = new GeminiService();
