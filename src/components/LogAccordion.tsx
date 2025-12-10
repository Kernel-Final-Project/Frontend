import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LogAccordionProps {
  id: number;
  title: string;
  status: "success" | "progress" | "pending";
  log: string;
  result: string;
}

const statusColors = {
  success: "border-l-[hsl(var(--status-success))]",
  progress: "border-l-[hsl(var(--status-warning))]",
  pending: "border-l-muted-foreground",
};

export function LogAccordion({ id, title, status, log, result }: LogAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div 
          className={cn(
            "flex items-center justify-between w-full px-6 py-4 bg-card border border-border rounded-xl card-shadow transition-all hover:shadow-card-hover cursor-pointer border-l-4",
            statusColors[status]
          )}
        >
          <span className="text-base font-medium text-foreground">
            {id}. {title}
          </span>
          <ChevronDown 
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="animate-accordion-down">
        <div className="mt-2 mx-1 p-6 bg-secondary/50 rounded-xl border border-border">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">실행 로그</h4>
            <pre className="text-xs text-muted-foreground bg-background p-4 rounded-lg border border-border overflow-x-auto whitespace-pre-wrap font-mono">
              {log}
            </pre>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">결과</h4>
            <p className="text-sm text-muted-foreground bg-background p-4 rounded-lg border border-border">
              {result}
            </p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
