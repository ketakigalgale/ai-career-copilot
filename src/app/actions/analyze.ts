"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from "pdf-parse-new";
import { ANALYSIS_PROMPT } from "@/lib/ai/prompts";

export async function analyzeResumeAction(formData: FormData) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY missing");
    return getFallbackData();
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const file = formData.get("resume") as File;
  const jd = formData.get("jd") as string;

  if (!file || !jd) {
    return getFallbackData();
  }

  try {
    // PDF extraction
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text;

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

    let result;

    // Retry logic (handles Gemini 503)
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
      return getFallbackData();
    }

    let parsed;

    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return getFallbackData();
    }

    // Ensure structure is correct
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

// 🔥 Fallback (SUPER IMPORTANT)
function getFallbackData() {
  return {
    score: 0,
    missingSkills: [],
    questions: [],
  };
}
