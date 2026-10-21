import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMedicineAnalysis } from "../hooks/useMedicineAnalysis";

describe("useMedicineAnalysis", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with default state", () => {
    const { result } = renderHook(() => useMedicineAnalysis());

    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.medicineInfo).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("handles successful analysis via Replicate Gemini 2.5 Flash response", async () => {
    const mockOutput = [
      JSON.stringify({
        name: "Amoxicillin 500mg",
        type: "Antibiotic",
        dosage: "500mg three times daily",
        timing: "With or after food",
        uses: "Bacterial infections",
        sideEffects: "Nausea, diarrhea, rash",
        interactions: "Methotrexate, oral contraceptives",
        storage: "Store below 25°C in a dry place",
        warnings: "Do not take if allergic to penicillin",
      }),
    ];

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        id: "pred_12345",
        status: "succeeded",
        output: mockOutput,
      }),
    } as unknown as Response);

    const { result } = renderHook(() => useMedicineAnalysis());

    await act(async () => {
      await result.current.analyzeMedicine("data:image/jpeg;base64,samplebase64data", "English");
    });

    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.medicineInfo).not.toBeNull();
    expect(result.current.medicineInfo?.name).toBe("Amoxicillin 500mg");
    expect(result.current.medicineInfo?.type).toBe("Antibiotic");
    expect(result.current.medicineInfo?.warnings).toContain("penicillin");
  });

  it("resets state when reset is called", async () => {
    const { result } = renderHook(() => useMedicineAnalysis());

    act(() => {
      result.current.reset();
    });

    expect(result.current.medicineInfo).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
