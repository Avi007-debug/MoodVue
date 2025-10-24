import { Sparkles, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RelaxationTipProps {
  tip: string;
  onDismiss?: () => void;
}

export default function RelaxationTip({ tip, onDismiss }: RelaxationTipProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 flex-shrink-0">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        
        <div className="flex-1 space-y-2">
          <h4 className="font-heading font-semibold text-lg">Wellness Tip</h4>
          <p className="text-lg font-light leading-relaxed text-foreground/90">
            {tip}
          </p>
        </div>
        
        {onDismiss && (
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={onDismiss}
            data-testid="button-dismiss-tip"
            className="flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
