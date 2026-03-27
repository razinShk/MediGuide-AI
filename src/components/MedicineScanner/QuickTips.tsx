import { Lightbulb, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickTips() {
  const tips = [
    "Capture the medicine name clearly",
    "Include the dosage information",
    "Good lighting helps accuracy",
    "Avoid blurry images",
  ];

  return (
    <Card className="border-none bg-secondary/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-secondary-foreground">
          <Lightbulb className="h-5 w-5" />
          Quick Tips for Best Results
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="grid grid-cols-2 gap-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 mt-0.5 text-accent shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
