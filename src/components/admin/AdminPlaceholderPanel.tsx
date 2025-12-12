import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { ReactNode } from "react";

type AdminPlaceholderPanelProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

export function AdminPlaceholderPanel({ title, description, icon }: AdminPlaceholderPanelProps) {
  return (
    <Card className="card-shadow overflow-hidden">
      <CardHeader className="bg-muted/40 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {icon}
          <span>{title}</span>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-border p-4 text-muted-foreground">
          <CheckCircle className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="font-medium text-foreground">준비 중</p>
            <p className="text-sm text-muted-foreground">추후 세부 기능이 추가됩니다.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
