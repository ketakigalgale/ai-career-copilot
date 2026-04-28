"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFParser from "pdf2json";
import { ANALYSIS_PROMPT } from "@/lib/ai/prompts";

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err: any) => {
      reject(err);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      const text = pdfData.Pages.map((page: any) =>
        page.Texts.map((t: any) => decodeURIComponent(t.R[0].T)).join(" "),
      ).join("\n");
      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
}

export async function analyzeResumeAction(formData: FormData) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY missing");
    return getFallbackData();
  }

  const file = formData.get("resume") as File;
  const jd = formData.get("jd") as string;

  if (!file || !jd) {
    return getFallbackData();
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let resumeText = "";
    try {
      resumeText = await extractTextFromPDF(buffer);
    } catch (pdfError) {
      console.error("PDF extraction failed:", pdfError);
      return getFallbackData();
    }

    if (!resumeText || resumeText.trim().length < 50) {
      console.error("Extracted text too short, PDF may be image-based");
      return getFallbackData();
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const fullPrompt = `
${ANALYSIS_PROMPT}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jd}
`;

    let result;
    try {
      result = await model.generateContent(fullPrompt);
    } catch (err) {
      console.log("Retrying Gemini...");
      result = await model.generateContent(fullPrompt);
    }

    const response = await result.response;
    const rawText = response.text();

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in Gemini response:", rawText);
      return getFallbackData();
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      console.error("JSON parse failed");
      return getFallbackData();
    }

    return {
      score: parsed.score ?? 0,
      missingSkills: parsed.missingSkills ?? [],
      questions: parsed.questions ?? [],
    };
  } catch (error: any) {
    console.error("Detailed Error:", error);
    return getFallbackData();
  }
}

function getFallbackData() {
  return {
    score: 0,
    missingSkills: [],
    questions: [],
  };
}
