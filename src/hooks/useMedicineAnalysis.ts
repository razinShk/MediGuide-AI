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

    // Read replicate_api_key from environment variables
    const apiKey =
      import.meta.env.replicate_api_key ||
      import.meta.env.VITE_REPLICATE_API_KEY ||
      "";

    if (!apiKey) {
      const message = "replicate_api_key is not configured in .env";
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

    // Format image as Data URI if not already
    const formattedImage = base64Image.startsWith("data:")
      ? base64Image
      : `data:image/jpeg;base64,${base64Image}`;

    const prompt = `You are a medical information assistant and pharmacist. Analyze the medicine packaging, blister pack, bottle, tablet, or label shown in this image and provide detailed, reliable information in a structured JSON format.
IMPORTANT: The values of the JSON object MUST be written in ${language} language.

Provide the following information:
1. name: The medicine name (generic and brand name if visible)
2. type: The type/category of medicine (e.g., antibiotic, analgesic, antacid, antihistamine, etc.)
3. dosage: Recommended dosage information or strength visible on the packaging
4. timing: When to take the medicine (e.g., before meals, after meals, morning/night)
5. uses: What conditions this medicine is used to treat
6. sideEffects: Common side effects to be aware of
7. interactions: Known drug interactions and what to avoid
8. storage: How to properly store this medicine
9. warnings: Important precautions, contraindications, and warnings

IMPORTANT: Respond ONLY with a valid JSON object in this exact format, with no extra commentary or markdown:
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

If you cannot identify the medicine with certainty, provide your best assessment based on what is visible, and clearly state precautions in the warnings field. All values must be in ${language}.`;

    try {
      console.log(`Calling Replicate google/gemini-2.5-flash for medicine analysis in ${language}...`);

      const requestBody = {
        input: {
          prompt,
          system_instruction: "You are an expert pharmacist and medical assistant. You analyze medicine packaging, tablets, capsules, labels, and prescriptions accurately and provide information strictly in valid JSON format in the requested language.",
          images: [formattedImage],
          temperature: 0.2,
          max_output_tokens: 4096,
        },
      };

      const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        "Prefer": "wait=20",
      };
      if (apiKey) {
        requestHeaders["Authorization"] = `Bearer ${apiKey}`;
      }

      // Always route through /api/replicate to avoid CORS restrictions in browsers
      const endpoint = "/api/replicate/v1/models/google/gemini-2.5-flash/predictions";
      let response = await fetch(endpoint, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(requestBody),
      });

      // Handle Replicate rate limits (429) with a short retry
      if (response.status === 429) {
        console.log("Rate limit encountered, retrying after delay...");
        await new Promise((resolve) => setTimeout(resolve, 2500));
        response = await fetch(endpoint, {
          method: "POST",
          headers: requestHeaders,
          body: JSON.stringify(requestBody),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Replicate API error:", response.status, errorText);
        let errorJson: { detail?: string } = {};
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          // not json
        }
        throw new Error(errorJson.detail || `Failed to analyze medicine: ${response.statusText} (${response.status})`);
      }

      let prediction = await response.json();
      console.log("Replicate API initial response status:", prediction.status);

      // If prediction is still processing, poll until complete
      if (prediction.status === "starting" || prediction.status === "processing") {
        const pollUrl = prediction.urls?.get
          ? prediction.urls.get.replace("https://api.replicate.com", "/api/replicate")
          : `/api/replicate/v1/predictions/${prediction.id}`;

        const maxPollAttempts = 30; // 30 * 2s = 60s max
        for (let attempt = 0; attempt < maxPollAttempts; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const pollResponse = await fetch(pollUrl, {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          });

          if (pollResponse.ok) {
            prediction = await pollResponse.json();
            if (
              prediction.status === "succeeded" ||
              prediction.status === "failed" ||
              prediction.status === "canceled"
            ) {
              break;
            }
          }
        }
      }

      if (prediction.status === "failed" || prediction.error) {
        throw new Error(prediction.error || "Replicate prediction failed to complete.");
      }

      if (prediction.status === "canceled") {
        throw new Error("Medicine analysis was canceled.");
      }

      // Extract output text
      const output = prediction.output;
      if (!output) {
        throw new Error("No output received from Gemini 2.5 Flash model.");
      }

      const rawContent = Array.isArray(output) ? output.join("") : String(output);
      console.log("Raw output from Gemini 2.5 Flash:", rawContent);

      // Clean markdown code blocks if any
      const cleanedContent = rawContent
        .replace(/```json\s*/gi, "")
        .replace(/```\s*$/gi, "")
        .trim();

      // Extract JSON object safely
      let parsedInfo: MedicineInfo;
      try {
        const firstBrace = cleanedContent.indexOf("{");
        const lastBrace = cleanedContent.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          const jsonString = cleanedContent.substring(firstBrace, lastBrace + 1);
          parsedInfo = JSON.parse(jsonString);
        } else {
          parsedInfo = JSON.parse(cleanedContent);
        }
      } catch (parseError) {
        console.error("Failed to parse Gemini response as JSON:", rawContent, parseError);
        throw new Error("Could not parse medicine information from the AI response.");
      }

      // Normalize fields to ensure full MedicineInfo compliance
      const normalizedInfo: MedicineInfo = {
        name: parsedInfo.name || "Unknown Medicine",
        type: parsedInfo.type || "N/A",
        dosage: parsedInfo.dosage || "Consult a healthcare professional",
        timing: parsedInfo.timing || "As prescribed",
        uses: parsedInfo.uses || "N/A",
        sideEffects: parsedInfo.sideEffects || "None listed",
        interactions: parsedInfo.interactions || "None listed",
        storage: parsedInfo.storage || "Store in a cool, dry place",
        warnings: parsedInfo.warnings || "Keep out of reach of children. Consult doctor before use.",
      };

      setMedicineInfo(normalizedInfo);
      toast({
        title: "Analysis Complete!",
        description: `Successfully identified: ${normalizedInfo.name}`,
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

