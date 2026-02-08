import type { Context } from "hono";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use a separate API key for edits if available, otherwise fallback to the main key
const API_KEY = process.env.GEMINI_EDIT_API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn(
    "WARNING: No API key found for AI Edit Controller (GEMINI_EDIT_API_KEY or GEMINI_API_KEY)",
  );
}

const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

export const editComponent = async (c: Context) => {
  console.log("[AI Edit] Request received");
  try {
    let body;
    try {
      body = await c.req.json();
    } catch (e) {
      console.error("[AI Edit] Failed to parse JSON body", e);
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    const { code, instruction, library } = body;
    console.log(`[AI Edit] Library: ${library}, Instruction: ${instruction}`);

    if (!code || !instruction) {
      return c.json({ error: "Code and instruction are required" }, 400);
    }

    const prompt = `
      You are an expert React developer.
      Here is a component file using ${library || "React"}:
      \`\`\`tsx
      ${code}
      \`\`\`

      The user wants to modify it: "${instruction}".

      **CRITICAL INSTRUCTIONS**:
      1. This code runs in a **Sandbox environment**. files like "@/components/ui/..." do NOT exist.
      2. If the component imports local UI components (e.g. Button, Card, Input), you MUST ONE of:
         - **Replace** them with standard HTML/Tailwind elements (e.g. <button className="..."> instead of <Button>).
         - **Inline** the missing component definitions at the top or bottom of the file.
      3. Return the **COMPLETE** runnable file code including all imports.
      4. Do NOT strip imports from libraries like 'lucide-react', 'framer-motion', or 'react'.
      5. Do NOT return markdown formatting (like \`\`\`tsx). Just return the raw code.

      Make the requested changes while ensuring the component is self-contained.
    `;

    console.log("[AI Edit] Sending prompt to Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    console.log("[AI Edit] Received response from Gemini");

    // Clean up markdown if present
    text = text
      .replace(/^```(tsx|jsx|typescript|javascript)?\s*/i, "")
      .replace(/```$/, "")
      .trim();

    return c.json({ modifiedCode: text });
  } catch (error: any) {
    console.error("[AI Edit] Internal Error:", error);
    return c.json(
      { error: "Failed to edit component", details: error.message },
      500,
    );
  }
};
