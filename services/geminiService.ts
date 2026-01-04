
import { GoogleGenAI } from "@google/genai";
import mammoth from "mammoth";

const SYSTEM_INSTRUCTION = `
You are a professional document-to-HTML conversion expert specializing in legal terms and conditions.
Your task is to take the provided document (text, DOCX extraction, or PDF file) and convert it into high-quality, structured HTML.

Rules:
1. WRAP everything inside a single <div class="termsInner"> tag.
2. DO NOT include <html>, <head>, or <body> tags.
3. USE ONLY these tags: h1, h2, h3, h4, h5, h6, p, ul, ol, li, table, thead, tbody, tr, th, td.
4. PRESERVE THE EXACT WORDING. Do not summarize, skip, or modify any text.
5. PRESERVE THE STRUCTURE. If the text looks like a heading, use h1-h6. If it's a list, use ul/ol.
6. RETURN ONLY THE HTML CODE. No conversational text or markdown blocks.
7. If the input contains a table structure, ensure it is represented as a <table>.
8. For PDF files, read the content carefully and transcribe it exactly.
`;

/**
 * Basic utility to clean up potential binary junk from legacy .doc files read as text.
 */
const cleanLegacyText = (text: string): string => {
  return text.replace(/[^\x20-\x7E\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\s]/g, '');
};

/**
 * Helper to convert file to base64 for Gemini inlineData
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const convertDocToHtml = async (file: File): Promise<string> => {
  const fileName = file.name.toLowerCase();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let contents: any;

  try {
    if (fileName.endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const extractedContent = result.value;
      contents = [
        {
          parts: [
            {
              text: `Below is content extracted from a DOCX legal document. Please convert it into clean HTML inside <div class="termsInner">. Literal transcription only.\n\nCONTENT:\n${extractedContent}`
            }
          ]
        }
      ];
    } else if (fileName.endsWith('.pdf')) {
      const base64Data = await fileToBase64(file);
      contents = [
        {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "application/pdf"
              }
            },
            {
              text: "Please convert this PDF legal document into clean HTML inside <div class=\"termsInner\">. Remember: literal transcription of all clauses, preserve structure with h1-h6, p, ul, ol, and table tags."
            }
          ]
        }
      ];
    } else if (fileName.endsWith('.doc')) {
      const rawText = await file.text();
      const extractedContent = cleanLegacyText(rawText);
      if (!extractedContent.trim()) {
        throw new Error("파일에서 텍스트를 추출할 수 없습니다. .docx 또는 PDF 형식으로 시도해 주세요.");
      }
      contents = [
        {
          parts: [
            {
              text: `Below is content extracted from a legacy .doc file. Please extract the legible legal clauses and convert them into clean HTML inside <div class="termsInner">. Literal transcription only.\n\nEXTRACTED CONTENT:\n${extractedContent}`
            }
          ]
        }
      ];
    } else {
      throw new Error("지원되지 않는 파일 형식입니다. .docx 또는 .pdf 파일을 권장합니다.");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1,
      },
    });

    const text = response.text || '';
    // Clean up potential markdown blocks
    return text.replace(/```html/g, '').replace(/```/g, '').trim();
  } catch (err: any) {
    console.error("Conversion error:", err);
    throw new Error(err.message || "문서 변환 중 오류가 발생했습니다. 파일 형식을 확인해 주세요.");
  }
};
