import { useState, useEffect } from "react";
import { RecurrenceRuleDto, RepeatType } from "@/services/workflowService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TimePicker } from "@/components/workflow/TimePicker";
import { formatRecurrenceRule, getNextExecutionDates } from "@/utils/recurrenceRuleHelper";
import { toast } from "@/hooks/use-toast";

interface RecurrenceRuleFormProps {
  value: RecurrenceRuleDto;
  onChange: (rule: RecurrenceRuleDto) => void;
}

const REPEAT_TYPES: { value: RepeatType; label: string }[] = [
  { value: 'ONCE', label: '한번만' },
  { value: 'DAILY', label: '매일' },
  { value: 'WEEKLY', label: '매주' },
  { value: 'MONTHLY', label: '매월' },
  { value: 'CUSTOM', label: '사용자 정의' },
];

const DAYS_OF_WEEK = [
  { value: 0, label: '일' },
  { value: 1, label: '월' },
  { value: 2, label: '화' },
  { value: 3, label: '수' },
  { value: 4, label: '목' },
  { value: 5, label: '금' },
  { value: 6, label: '토' },
];

export function RecurrenceRuleForm({ value, onChange }: RecurrenceRuleFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    value.startAt ? new Date(value.startAt) : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    value.endAt ? new Date(value.endAt) : undefined
  );

  // 날짜 변경 시 value 업데이트 및 유효성 검사
  useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      toast({
        title: "날짜 오류",
        description: "종료 날짜는 시작 날짜보다 늦어야 합니다.",
        variant: "destructive",
      });
      // 종료 날짜를 시작 날짜로 재설정합니다.
      setEndDate(startDate);
      // endDate 상태 변경 후 다음 렌더링에서 이 useEffect가 다시 실행되므로 여기서 종료합니다.
      return;
    }

    onChange({
      ...value,
      startAt: startDate ? startDate.toISOString() : new Date().toISOString(),
      endAt: endDate ? endDate.toISOString() : null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, onChange]);

  const handleRepeatTypeChange = (type: RepeatType) => {
    onChange({
      ...value,
      repeatType: type,
      repeatInterval: type === 'ONCE' ? null : (value.repeatInterval || 1),
      daysOfWeek: type === 'WEEKLY' ? (value.daysOfWeek || []) : null,
      daysOfMonth: type === 'MONTHLY' ? (value.daysOfMonth || []) : null,
      timesOfDay: value.timesOfDay || ['09:00'], // ONCE도 시간 필요
      endAt: type === 'ONCE' ? null : value.endAt, // ONCE는 종료 날짜 불필요
    });
  };

  const handleIntervalChange = (interval: number) => {
    onChange({
      ...value,
      repeatInterval: interval > 0 ? interval : 1,
    });
  };

  const handleDayOfWeekToggle = (day: number) => {
    const currentDays = value.daysOfWeek || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort((a, b) => a - b);

    onChange({
      ...value,
      daysOfWeek: newDays,
    });
  };

  const handleDayOfMonthToggle = (day: number) => {
    const currentDays = value.daysOfMonth || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort((a, b) => a - b);

    onChange({
      ...value,
      daysOfMonth: newDays,
    });
  };

  const handleAddTime = () => {
    const currentTimes = value.timesOfDay || [];
    onChange({
      ...value,
      timesOfDay: [...currentTimes, '09:00'],
    });
  };

  const handleTimeChange = (index: number, time: string) => {
    const currentTimes = value.timesOfDay || [];
    const newTimes = [...currentTimes];
    newTimes[index] = time;
    onChange({
      ...value,
      timesOfDay: newTimes,
    });
  };

  const handleRemoveTime = (index: number) => {
    const currentTimes = value.timesOfDay || [];
    onChange({
      ...value,
      timesOfDay: currentTimes.filter((_, i) => i !== index),
    });
  };

  // 대한민국 현재 시간 기준 2시간 후 계산
  const getMinimumDateTime = () => {
    const now = new Date();
    const koreaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    koreaTime.setHours(koreaTime.getHours() + 2);
    return koreaTime;
  };

  const minDateTime = getMinimumDateTime();

  return (
    <div className="space-y-6">
      {/* 반복 유형 선택 */}
      <div className="space-y-3">
        <Label>반복 유형</Label>
        <div className="flex gap-2 flex-wrap">
          {REPEAT_TYPES.map(type => (
            <Button
              key={type.value}
              type="button"
              variant={value.repeatType === type.value ? 'default' : 'outline'}
              onClick={() => handleRepeatTypeChange(type.value)}
              className="flex-1 min-w-[100px]"
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* ONCE 선택 시 */}
      {value.repeatType === 'ONCE' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              실행 날짜
              <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "yyyy-MM-dd") : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              실행 시간
              <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              현재 시간으로부터 2시간 이후부터 실행 가능합니다
            </p>
            <TimePicker
              value={(value.timesOfDay && value.timesOfDay[0]) || '09:00'}
              onChange={(time) => {
                // 선택된 날짜가 오늘이면 최소 시간 검증
                const now = new Date();
                const koreaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
                const today = new Date(koreaTime);
                today.setHours(0, 0, 0, 0);

                const selectedDay = new Date(startDate || new Date());
                selectedDay.setHours(0, 0, 0, 0);

                if (selectedDay.getTime() === today.getTime()) {
                  const minDateTime = getMinimumDateTime();
                  const minTimeStr = `${String(minDateTime.getHours()).padStart(2, '0')}:${String(minDateTime.getMinutes()).padStart(2, '0')}`;

                  if (time < minTimeStr) {
                    toast({
                      title: "시간 오류",
                      description: "현재 시간으로부터 2시간 이후의 시간을 선택해주세요.",
                      variant: "destructive",
                    });
                    return;
                  }
                }

                onChange({
                  ...value,
                  timesOfDay: [time],
                });
              }}
              selectedDate={startDate}
              minTime={(() => {
                const minDateTime = getMinimumDateTime();
                return `${String(minDateTime.getHours()).padStart(2, '0')}:${String(minDateTime.getMinutes()).padStart(2, '0')}`;
              })()}
            />
          </div>
        </div>
      )}

      {/* DAILY, WEEKLY, MONTHLY, CUSTOM 공통 */}
      {value.repeatType !== 'ONCE' && (
        <>
          {/* 반복 간격 */}
          {(value.repeatType === 'DAILY' || value.repeatType === 'WEEKLY' || value.repeatType === 'MONTHLY' || value.repeatType === 'CUSTOM') && (
            <div className="space-y-2">
              <Label>
                반복 간격
                {value.repeatType === 'DAILY' && ' (일)'}
                {value.repeatType === 'WEEKLY' && ' (주)'}
                {value.repeatType === 'MONTHLY' && ' (개월)'}
              </Label>
              <Input
                type="number"
                min="1"
                value={value.repeatInterval || 1}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
              />
            </div>
          )}

          {/* 요일 선택 (WEEKLY, CUSTOM) */}
          {(value.repeatType === 'WEEKLY' || value.repeatType === 'CUSTOM') && (
            <div className="space-y-2">
              <Label>반복 요일</Label>
              <div className="flex gap-2">
                {DAYS_OF_WEEK.map(day => (
                  <div key={day.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={(value.daysOfWeek || []).includes(day.value)}
                      onCheckedChange={() => handleDayOfWeekToggle(day.value)}
                    />
                    <label
                      htmlFor={`day-${day.value}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {day.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 날짜 선택 (MONTHLY, CUSTOM) - 달력 형태 */}
          {(value.repeatType === 'MONTHLY' || value.repeatType === 'CUSTOM') && (
            <div className="space-y-3">
              <Label>반복 날짜 (매월 며칠에 실행할지 선택)</Label>

              {/* 날짜 그리드 */}
              <div className="border border-border rounded-lg p-4 bg-card">
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                    const isSelected = (value.daysOfMonth || []).includes(day);

                    return (
                      <Button
                        key={day}
                        type="button"
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleDayOfMonthToggle(day)}
                        className={cn(
                          "h-10 w-full font-medium",
                          isSelected && "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                      >
                        {day}
                      </Button>
                    );
                  })}
                  {/* 빈 칸 채우기 (31일까지만 있으므로 35-31=4칸 빈칸) */}
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={`empty-${i}`} className="h-10" />
                  ))}
                </div>

                {/* 빠른 선택 버튼 */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // 모든 날짜 선택
                      onChange({
                        ...value,
                        daysOfMonth: Array.from({ length: 31 }, (_, i) => i + 1),
                      });
                    }}
                    className="flex-1"
                  >
                    모두 선택
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // 월초 (1-10일)
                      onChange({
                        ...value,
                        daysOfMonth: Array.from({ length: 10 }, (_, i) => i + 1),
                      });
                    }}
                    className="flex-1"
                  >
                    월초
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // 월중 (11-20일)
                      onChange({
                        ...value,
                        daysOfMonth: Array.from({ length: 10 }, (_, i) => i + 11),
                      });
                    }}
                    className="flex-1"
                  >
                    월중
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // 월말 (21-31일)
                      onChange({
                        ...value,
                        daysOfMonth: Array.from({ length: 11 }, (_, i) => i + 21),
                      });
                    }}
                    className="flex-1"
                  >
                    월말
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // 모두 해제
                      onChange({
                        ...value,
                        daysOfMonth: [],
                      });
                    }}
                    className="flex-1"
                  >
                    초기화
                  </Button>
                </div>
              </div>

              {/* 선택된 날짜 표시 */}
              {(value.daysOfMonth || []).length > 0 && (
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <span className="font-medium">선택된 날짜:</span>{' '}
                  {(value.daysOfMonth || []).sort((a, b) => a - b).map(d => `${d}일`).join(', ')}
                  <span className="ml-2 text-xs">
                    (총 {(value.daysOfMonth || []).length}일)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 실행 시간 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>실행 시간</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTime}
              >
                <Plus className="h-4 w-4 mr-1" />
                시간 추가
              </Button>
            </div>
            <div className="space-y-2">
              {(value.timesOfDay || []).map((time, index) => (
                <TimePicker
                  key={index}
                  value={time}
                  onChange={(newTime) => handleTimeChange(index, newTime)}
                  onRemove={
                    (value.timesOfDay || []).length > 1
                      ? () => handleRemoveTime(index)
                      : undefined
                  }
                />
              ))}
            </div>
          </div>

          {/* 시작/종료 날짜 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                시작 날짜
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "yyyy-MM-dd") : "날짜 선택"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => {
                      // 오늘보다 이전 날짜는 선택 불가
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                종료 날짜
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "yyyy-MM-dd") : "날짜 선택"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => {
                      // 시작 날짜보다 이전 날짜는 선택 불가
                      if (startDate) {
                        return date < startDate;
                      }
                      return false;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

            </div>
          </div>
        </>
      )}

      {/* 미리보기 */}
      <div className="space-y-3">
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <Label className="text-sm text-muted-foreground">반복 규칙 미리보기</Label>
          <p className="mt-2 font-medium text-foreground">
            {formatRecurrenceRule(value)}
          </p>
        </div>

        {/* 다음 실행 날짜 미리보기 */}
        {value.repeatType !== 'ONCE' && (value.daysOfMonth || value.daysOfWeek || value.repeatType === 'DAILY') && (
          <div className="rounded-lg border border-border bg-blue-50 dark:bg-blue-950/20 p-4">
            <Label className="text-sm text-blue-600 dark:text-blue-400">다음 실행 예정일</Label>
            <div className="mt-2 space-y-1">
              {getNextExecutionDates(value, 5).map((date, idx) => (
                <div key={idx} className="text-sm text-foreground flex items-center gap-2">
                  <span className="font-mono font-medium">
                    {date.getFullYear()}.{String(date.getMonth() + 1).padStart(2, '0')}.{String(date.getDate()).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({['일', '월', '화', '수', '목', '금', '토'][date.getDay()]})
                  </span>
                  {value.timesOfDay && value.timesOfDay.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {value.timesOfDay.join(', ')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}