
import { GoogleGenAI, GenerateContentResponse, Chat, Part, GenerateContentParameters, Content, GenerateContentRequest } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants';
import { GroundingChunk } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set. Please set the process.env.API_KEY environment variable.");
  // Potentially throw an error or handle this state in the UI
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // Use non-null assertion as we've checked

// Generic function to generate content
export const generateGeminiText = async (
  prompt: string | Part | (string | Part)[],
  systemInstruction?: string,
  enableThinking: boolean = true,
  useGoogleSearch: boolean = false
): Promise<{text: string, groundingChunks?: GroundingChunk[]}> => {
  if (!API_KEY) return { text: "خطا: کلید API تنظیم نشده است."};
  try {
    const modelConfig: GenerateContentParameters['config'] = {};
    if (systemInstruction) {
      modelConfig.systemInstruction = systemInstruction;
    }
    if (GEMINI_TEXT_MODEL === "gemini-2.5-flash-preview-04-17") {
        modelConfig.thinkingConfig = { thinkingBudget: enableThinking ? undefined : 0 };
    }
    if (useGoogleSearch) {
      modelConfig.tools = [{googleSearch: {}}];
      // responseMimeType: "application/json" is not compatible with googleSearch
    } else {
      // modelConfig.responseMimeType = "application/json"; // only if you expect JSON structure and will parse it.
    }


    const request: GenerateContentRequest = {
      model: GEMINI_TEXT_MODEL,
      contents: typeof prompt === 'string' ? [{role: 'user', parts: [{text: prompt}] }] : Array.isArray(prompt) ? [{role: 'user', parts: prompt.map(p => typeof p === 'string' ? {text:p} : p) }] : [{role: 'user', parts: [prompt] }],
      config: modelConfig,
    };
    
    const response: GenerateContentResponse = await ai.models.generateContent(request);
    
    let text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const groundingChunks: GroundingChunk[] | undefined = groundingMetadata?.groundingChunks;

    return { text, groundingChunks };

  } catch (error) {
    console.error("Gemini API error:", error);
    return { text: `خطا در ارتباط با هوش مصنوعی: ${error instanceof Error ? error.message : 'Unknown error'}`};
  }
};

// Function to start a new chat session
export const startNewChat = (systemInstruction?: string): Chat => {
  if (!API_KEY) {
    // This case should ideally be handled before calling, but as a fallback:
    throw new Error("API_KEY for Gemini is not set.");
  }
  return ai.chats.create({
    model: GEMINI_TEXT_MODEL,
    config: {
      systemInstruction: systemInstruction || "شما یک دستیار هوش مصنوعی مفید و مثبت‌نگر هستید.",
    },
  });
};

// Function to send a message in an existing chat
export const sendMessageInChat = async (chat: Chat, message: string): Promise<string> => {
  if (!API_KEY) return "خطا: کلید API تنظیم نشده است.";
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini chat error:", error);
    return `خطا در ارسال پیام: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

// Helper to parse JSON from Gemini, removing markdown fences
export const parseJsonFromGeminiResponse = <T,>(responseText: string): T | null => {
  try {
    let jsonStr = responseText.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", e, "Original text:", responseText);
    return null;
  }
};
