import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export interface MedicineInfo {
  name: string;
  type: string;
  dosage: string;
  timing: string;
  uses: string;
  sideEffects: string;
  interactions: string;
  storage: string;
  warnings: string;
}

export function useMedicineAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeMedicine = async (base64Image: string, language: string = "English") => {
    setIsAnalyzing(true);
    setError(null);

    const apiKey = import.meta.env.VITE_FIREWORKS_API_KEY;

    if (!apiKey) {
      const message = "VITE_FIREWORKS_API_KEY is not configured";
      console.error(message);
      setError(message);
      toast({
        title: "Configuration Error",
        description: message,
        variant: "destructive",
      });
      setIsAnalyzing(false);
      return;
    }

    // Extract base64 data from data URL if present
    const base64Data = base64Image.includes("base64,")
      ? base64Image.split("base64,")[1]
      : base64Image;

    const prompt = `You are a medical information assistant. Analyze the medicine shown in this image and provide detailed information in a structured JSON format.
IMPORTANT: The values of the JSON object MUST be in ${language} language.

Provide the following information:
1. name: The medicine name (generic and brand name if visible)
2. type: The type/category of medicine (e.g., antibiotic, analgesic, antacid, etc.)
3. dosage: Recommended dosage information
4. timing: When to take the medicine (e.g., before meals, after meals, morning/night)
5. uses: What conditions this medicine is used to treat
6. sideEffects: Common side effects to be aware of
7. interactions: Drug interactions and what to avoid
8. storage: How to properly store this medicine
9. warnings: Important precautions and warnings

IMPORTANT: Respond ONLY with a valid JSON object in this exact format, no other text:
{
  "name": "Medicine Name",
  "type": "Medicine Type",
  "dosage": "Dosage information",
  "timing": "When to take",
  "uses": "Medical uses",
  "sideEffects": "Side effects",
  "interactions": "Drug interactions",
  "storage": "Storage instructions",
  "warnings": "Important warnings"
}

If you cannot identify the medicine clearly, provide your best assessment based on what's visible, or indicate that the image is unclear. All values must be in ${language}.`;

    try {
      console.log(`Calling Fireworks API for medicine analysis in ${language}...`);

      const response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "accounts/fireworks/models/qwen3-vl-30b-a3b-instruct",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Data}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 2048,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Fireworks API error:", response.status, errorText);
        throw new Error(`Failed to analyze medicine: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fireworks API response received");

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI model");
      }

      // Try to extract JSON from the response
      let parsedInfo;
      try {
        // First, try to find JSON in the response (handling thinking tokens or markdown code blocks)
        const jsonMatch = content.match(/\{[\s\S]*"name"[\s\S]*"warnings"[\s\S]*\}/);
        if (jsonMatch) {
          parsedInfo = JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON found, try parsing the whole content
          parsedInfo = JSON.parse(content);
        }
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", content);
        throw new Error("Could not parse medicine information from the response.");
      }

      setMedicineInfo(parsedInfo);
      toast({
        title: "Analysis Complete!",
        description: `Successfully identified: ${parsedInfo.name}`,
      });

    } catch (err) {
      console.error("Error in analyzeMedicine:", err);
      const message = err instanceof Error ? err.message : "Failed to analyze medicine";
      setError(message);
      toast({
        title: "Analysis Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setMedicineInfo(null);
    setError(null);
  };

  return {
    isAnalyzing,
    medicineInfo,
    error,
    analyzeMedicine,
    reset,
  };
}
