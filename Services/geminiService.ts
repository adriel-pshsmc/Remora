
import { GoogleGenAI, Type } from "@google/genai";
import { SKU, Warehouse, Route, OptimizationPlan } from "../types";

export class GeminiLogisticsService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = typeof process !== 'undefined' && process.env.API_KEY 
      ? process.env.API_KEY 
      : (window as any).GEMINI_API_KEY || '';
    
    if (!apiKey) {
      console.warn('Gemini API key not found. Set VITE_API_KEY in .env.local');
    }
    
    this.ai = new GoogleGenAI({ apiKey });
  }

  async analyzeLogistics(skus: SKU[], warehouses: Warehouse[], routes: Route[]): Promise<OptimizationPlan> {
    const prompt = `
      Analyze the following logistics data for a business. 
      Identify inventory risks (stockouts, overstock), evaluate route efficiencies, and suggest strategic improvements.
      Consider nearby issues like capacity utilization and risk levels.

      SKUs: ${JSON.stringify(skus)}
      Warehouses: ${JSON.stringify(warehouses)}
      Routes: ${JSON.stringify(routes)}

      Provide the analysis in a structured JSON format.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: "Overall logistics health score (0-100)" },
              insights: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                    impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                    type: { type: Type.STRING, enum: ["Inventory", "Route", "Risk"] }
                  },
                  required: ["title", "recommendation", "impact", "type"]
                }
              },
              suggestedRoutes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of route IDs that need adjustment or activation"
              },
              reorderAlerts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of SKU IDs requiring immediate reorder"
              }
            },
            required: ["score", "insights", "suggestedRoutes", "reorderAlerts"]
          }
        }
      });

      const text = response.text || "{}";
      return JSON.parse(text) as OptimizationPlan;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      throw error;
    }
  }
}