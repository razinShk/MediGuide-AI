import { Pill } from "lucide-react";
import { ImageUploader } from "@/components/MedicineScanner/ImageUploader";
import { MedicineResults } from "@/components/MedicineScanner/MedicineResults";
import { LoadingState } from "@/components/MedicineScanner/LoadingState";
import { QuickTips } from "@/components/MedicineScanner/QuickTips";
import { LanguageSelector } from "@/components/MedicineScanner/LanguageSelector";
import { useMedicineAnalysis } from "@/hooks/useMedicineAnalysis";
import { useState } from "react";

const Index = () => {
  const { isAnalyzing, medicineInfo, analyzeMedicine, reset } = useMedicineAnalysis();
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const handleImageCapture = (base64Image: string) => {
    analyzeMedicine(base64Image, selectedLanguage);
  };

  const handleScanAnother = () => {
    reset();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2.5">
              <Pill className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MediGuide AI</h1>
              <p className="text-xs text-muted-foreground">AI Medicine Scanner</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-lg mx-auto px-4 py-6">
        {medicineInfo ? (
          <MedicineResults
            medicineInfo={medicineInfo}
            onScanAnother={handleScanAnother}
          />
        ) : isAnalyzing ? (
          <LoadingState />
        ) : (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Scan Your Medicine
              </h2>
              <p className="text-muted-foreground">
                Take a photo or upload an image of your medicine to get detailed information
              </p>
            </div>

            {/* Language Selection & Image Uploader */}
            <div className="space-y-4">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                disabled={isAnalyzing}
              />
              <ImageUploader
                onImageCapture={handleImageCapture}
                isAnalyzing={isAnalyzing}
              />
            </div>

            {/* Quick Tips */}
            <QuickTips />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t border-border py-3">
        <p className="text-center text-xs text-muted-foreground font-semibold">
          MADE BY SOHAIL AND SANA
        </p>
      </footer>
    </div>
  );
};

export default Index;
