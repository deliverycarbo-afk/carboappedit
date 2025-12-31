
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Strictly follow initialization guidelines (named parameter and direct env access)
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCarbonInsights = async (metrics: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyse the following carbon metrics and provide 3 professional, actionable sustainability recommendations for a corporate ESG report. Data: ${JSON.stringify(metrics)}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              impact: { type: Type.STRING }
            },
            required: ['title', 'description', 'impact']
          }
        }
      }
    });
    
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error fetching carbon insights:", error);
    return [];
  }
};
