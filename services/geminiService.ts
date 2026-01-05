
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY is not defined");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async *generateTrumpAnswerStream(question: string) {
    const chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.9,
      },
    });

    const streamResponse = await chat.sendMessageStream({ message: question });
    
    for await (const chunk of streamResponse) {
      const c = chunk as GenerateContentResponse;
      yield c.text;
    }
  }

  async generateTrumpSpeech(text: string): Promise<Uint8Array | null> {
    try {
      // We instruct the model specifically on the Trumpian cadence: 
      // Forceful, rhythmic pauses, high energy on superlatives.
      const speechPrompt = `
        Speak this text exactly like Donald J. Trump would. 
        Use a forceful, high-energy, and confident tone. 
        Incorporate his signature rhythmic pauses and emphasize the superlatives. 
        The text to speak is: "${text}"
      `;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: speechPrompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Puck' }, // Puck is best for assertive, high-energy male delivery
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) return null;

      return this.decodeBase64(base64Audio);
    } catch (error) {
      console.error("Speech generation failed:", error);
      return null;
    }
  }

  private decodeBase64(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}

export const geminiService = new GeminiService();
