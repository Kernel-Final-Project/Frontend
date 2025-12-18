import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TimePickerProps {
  value: string;  // "HH:mm" 형식
  onChange: (time: string) => void;
  onRemove?: () => void;
  minTime?: string; // 최소 시간 추가
  selectedDate?: Date; // 선택된 날짜 추가
}


export function TimePicker({ value, onChange, onRemove, minTime, selectedDate }: TimePickerProps) {
  // 선택된 날짜가 오늘이면 최소 시간 적용
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = selectedDate && selectedDate.getTime() === today.getTime();

  return (
    <div className="flex gap-2 items-center">
      <Input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={isToday && minTime ? minTime : undefined}
        className="w-40 text-center font-mono text-base" // 더 넓고 중앙 정렬, 읽기 쉬운 폰트
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