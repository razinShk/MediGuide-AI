import { 
  Pill, 
  Clock, 
  AlertTriangle, 
  Activity, 
  Thermometer, 
  Shield,
  Info,
  RotateCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MedicineInfo {
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

interface MedicineResultsProps {
  medicineInfo: MedicineInfo;
  onScanAnother: () => void;
}

export function MedicineResults({ medicineInfo, onScanAnother }: MedicineResultsProps) {
  const sections = [
    {
      title: "Medicine Name & Type",
      icon: Pill,
      content: `${medicineInfo.name}\n${medicineInfo.type}`,
      bgClass: "bg-medicine-peach",
      iconClass: "text-primary",
    },
    {
      title: "Dosage & Timing",
      icon: Clock,
      content: `${medicineInfo.dosage}\n\nTiming: ${medicineInfo.timing}`,
      bgClass: "bg-medicine-mint",
      iconClass: "text-accent",
    },
    {
      title: "Uses",
      icon: Activity,
      content: medicineInfo.uses,
      bgClass: "bg-secondary",
      iconClass: "text-secondary-foreground",
    },
    {
      title: "Side Effects",
      icon: AlertTriangle,
      content: medicineInfo.sideEffects,
      bgClass: "bg-destructive/10",
      iconClass: "text-destructive",
    },
    {
      title: "Drug Interactions",
      icon: Shield,
      content: medicineInfo.interactions,
      bgClass: "bg-medicine-peach",
      iconClass: "text-primary",
    },
    {
      title: "Storage Instructions",
      icon: Thermometer,
      content: medicineInfo.storage,
      bgClass: "bg-medicine-mint",
      iconClass: "text-accent",
    },
    {
      title: "Warnings & Precautions",
      icon: Info,
      content: medicineInfo.warnings,
      bgClass: "bg-destructive/10",
      iconClass: "text-destructive",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Analysis Complete</h2>
        <p className="text-muted-foreground">Here's what we found about your medicine</p>
      </div>

      <ScrollArea className="h-[60vh]">
        <div className="space-y-4 pr-4">
          {sections.map((section, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-md">
              <CardHeader className={`${section.bgClass} py-3 px-4`}>
                <CardTitle className="flex items-center gap-3 text-base font-semibold">
                  <div className={`rounded-full bg-card p-2`}>
                    <section.icon className={`h-5 w-5 ${section.iconClass}`} />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-card">
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Button 
        onClick={onScanAnother}
        className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg"
        size="lg"
      >
        <RotateCcw className="mr-2 h-5 w-5" />
        Scan Another Medicine
      </Button>
    </div>
  );
}
