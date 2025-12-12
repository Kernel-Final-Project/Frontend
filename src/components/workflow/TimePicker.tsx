import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TimePickerProps {
  value: string;  // "HH:mm" 형식
  onChange: (time: string) => void;
  onRemove?: () => void;
}

export function TimePicker({ value, onChange, onRemove }: TimePickerProps) {
  return (
    <div className="flex gap-2 items-center">
      <Input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-32"
      />
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
