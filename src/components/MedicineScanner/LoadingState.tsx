import { Pill } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        <div className="relative rounded-full bg-primary/10 p-6">
          <Pill className="h-12 w-12 text-primary animate-pulse-soft" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground">
          Analyzing your medicine...
        </h3>
        <p className="text-muted-foreground">
          Our AI is identifying the medicine and gathering detailed information
        </p>
      </div>

      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-3 w-3 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
