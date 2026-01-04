
import { GoogleGenAI } from "@google/genai";
import mammoth from "mammoth";

const SYSTEM_INSTRUCTION = `
You are a professional document-to-HTML conversion expert specializing in legal terms and conditions.
Your task is to take the provided text content and convert it into high-quality, structured HTML.

Rules:
1. WRAP everything inside a single <div class="termsInner"> tag.
2. DO NOT include <html>, <head>, or <body> tags.
3. USE ONLY these tags: h1, h2, h3, h4, h5, h6, p, ul, ol, li, table, thead, tbody, tr, th, td.
4. PRESERVE THE EXACT WORDING. Do not summarize, skip, or modify any text.
5. PRESERVE THE STRUCTURE. If the text looks like a heading, use h1-h6. If it's a list, use ul/ol.
6. RETURN ONLY THE HTML CODE. No conversational text or markdown blocks.
7. If the input contains a table structure, ensure it is represented as a <table>.
8. If the input text contains binary artifacts or strange characters (common in legacy .doc files), ignore the junk and focus on extracting the legible Korean/English legal text.
`;

/**
 * Basic utility to clean up potential binary junk from legacy .doc files read as text.
 */
const cleanLegacyText = (text: string): string => {
  // Remove non-printable characters except common whitespace
  return text.replace(/[^\x20-\x7E\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\s]/g, '');
};

export const convertDocToHtml = async (file: File): Promise<string> => {
  const fileName = file.name.toLowerCase();
  let extractedContent = "";

  try {
    if (fileName.endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      extractedContent = result.value; 
    } else if (fileName.endsWith('.doc')) {
      // Legacy .doc is binary. mammoth doesn't support it.
      // We read as text as a fallback. It will contain binary junk,
      // but Gemini is surprisingly good at finding text within junk.
      const rawText = await file.text();
      extractedContent = cleanLegacyText(rawText);
      
      if (!extractedContent.trim()) {
          throw new Error("파일에서 텍스트를 추출할 수 없습니다. .docx 형식으로 저장 후 다시 시도해 주세요.");
      }
    } else {
      throw new Error("지원되지 않는 파일 형식입니다. .docx 파일을 권장합니다.");
    }
  } catch (err: any) {
    console.error("Extraction error:", err);
    throw new Error(err.message || "문서 내용을 읽는 중 오류가 발생했습니다. .docx 파일로 변환하여 업로드하는 것을 권장합니다.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            text: `Below is the content extracted from a legal document. It may contain some formatting artifacts. Please convert the legible legal text into clean HTML inside <div class="termsInner">. Remember: literal transcription of all legal clauses, only h1-h6, p, ul, ol, table tags.\n\nEXTRACTED CONTENT:\n${extractedContent}`
          }
        ]
      }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.1,
    },
  });

  const text = response.text || '';
  
  // Clean up potential markdown blocks if Gemini includes them
  return text.replace(/```html/g, '').replace(/```/g, '').trim();
};
