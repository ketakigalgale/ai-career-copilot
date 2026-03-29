"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from "pdf-parse-new";
import { ANALYSIS_PROMPT } from "@/lib/ai/prompts";

export async function analyzeResumeAction(formData: FormData) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY missing");
    return { error: "Server Configuration Error: API Key missing." };
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const file = formData.get("resume") as File;
  const jd = formData.get("jd") as string;

  if (!file || !jd) {
    return { error: "Please upload a PDF and provide Job Description." };
  }

  try {
    // Extract PDF text
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text;

    // Stable Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const fullPrompt = `
${ANALYSIS_PROMPT}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jd}
`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const rawText = response.text();

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return {
        error: "AI response format invalid. Please retry.",
      };
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error("Detailed Error:", error);

    return {
      error: error.message || "Analysis failed.",
    };
  }
}
