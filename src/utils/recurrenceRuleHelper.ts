import { RecurrenceRuleDto } from '@/services/workflowService';

/**
 * 요일 숫자를 한글로 변환
 * @param days - 요일 배열 (0=일요일, 1=월요일, ..., 6=토요일)
 * @returns 한글 요일 문자열 (예: "월, 수, 금")
 */
export function formatDaysOfWeek(days: number[]): string {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  return days
    .sort((a, b) => a - b)
    .map(day => dayNames[day])
    .join(', ');
}

/**
 * 날짜 배열을 문자열로 변환
 * @param days - 날짜 배열 (1-31)
 * @returns 날짜 문자열 (예: "1일, 15일, 31일")
 */
export function formatDaysOfMonth(days: number[]): string {
  return days
    .sort((a, b) => a - b)
    .map(day => `${day}일`)
    .join(', ');
}

/**
 * 실행 시간 정렬 및 포맷
 * @param times - 시간 배열 (예: ["15:00", "09:00", "21:00"])
 * @returns 정렬된 시간 문자열 (예: "09:00, 15:00, 21:00")
 */
export function formatTimesOfDay(times: string[]): string {
  return times
    .sort()
    .join(', ');
}

/**
 * RecurrenceRuleDto를 읽기 쉬운 한글 문자열로 변환
 * @param rule - 반복 규칙 DTO
 * @returns 읽기 쉬운 규칙 문자열
 */
export function formatRecurrenceRule(rule: RecurrenceRuleDto): string {
  const { repeatType, repeatInterval, daysOfWeek, daysOfMonth, timesOfDay, startAt, endAt } = rule;

  let description = '';

  // 반복 유형에 따른 설명
  switch (repeatType) {
    case 'ONCE':
      description = '한번만';
      if (startAt) {
        const date = new Date(startAt);
        description += ` (${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일)`;
      }
      break;

    case 'DAILY':
      if (repeatInterval && repeatInterval > 1) {
        description = `${repeatInterval}일마다`;
      } else {
        description = '매일';
      }
      break;

    case 'WEEKLY':
      if (daysOfWeek && daysOfWeek.length > 0) {
        const interval = repeatInterval && repeatInterval > 1 ? `${repeatInterval}주마다 ` : '매주 ';
        description = interval + formatDaysOfWeek(daysOfWeek) + '요일';
      } else {
        description = '매주';
      }
      break;

    case 'MONTHLY':
      if (daysOfMonth && daysOfMonth.length > 0) {
        const interval = repeatInterval && repeatInterval > 1 ? `${repeatInterval}개월마다 ` : '매월 ';
        description = interval + formatDaysOfMonth(daysOfMonth);
      } else {
        description = '매월';
      }
      break;

    case 'CUSTOM':
      if (daysOfMonth && daysOfMonth.length > 0) {
        description = '매월 ' + formatDaysOfMonth(daysOfMonth);
      } else if (daysOfWeek && daysOfWeek.length > 0) {
        description = '매주 ' + formatDaysOfWeek(daysOfWeek) + '요일';
      } else if (repeatInterval && repeatInterval > 1) {
        description = `${repeatInterval}일마다`;
      } else {
        description = '사용자 정의';
      }
      break;

    default:
      description = '반복';
  }

  // 실행 시간 추가
  if (timesOfDay && timesOfDay.length > 0) {
    description += ` ${formatTimesOfDay(timesOfDay)}에`;
  }

  description += ' 실행';

  // 기간 정보 추가
  if (startAt && endAt) {
    const start = new Date(startAt);
    const end = new Date(endAt);
    description += ` (${start.getFullYear()}.${start.getMonth() + 1}.${start.getDate()} ~ ${end.getFullYear()}.${end.getMonth() + 1}.${end.getDate()})`;
  }

  return description;
}

/**
 * 다음 실행 날짜들을 미리보기로 생성 (최대 5개)
 * @param rule - 반복 규칙 DTO
 * @returns 실행 날짜 배열
 */
export function getNextExecutionDates(rule: RecurrenceRuleDto, maxDates: number = 5): Date[] {
  const { repeatType, daysOfWeek, daysOfMonth, startAt, endAt } = rule;
  const dates: Date[] = [];
  const start = new Date(startAt);
  const end = endAt ? new Date(endAt) : null;

  if (repeatType === 'ONCE') {
    return [start];
  }

  if (repeatType === 'MONTHLY' && daysOfMonth && daysOfMonth.length > 0) {
    // 매월 특정 날짜들
    let monthOffset = 0;
    while (dates.length < maxDates && monthOffset < 12) {
      const year = start.getFullYear();
      const month = start.getMonth() + monthOffset;

      for (const day of daysOfMonth.sort((a, b) => a - b)) {
        if (dates.length >= maxDates) break;

        const date = new Date(year, month, day);
        if (date >= start && (!end || date <= end)) {
          dates.push(new Date(date));
        }
      }
      monthOffset++;
    }
  } else if (repeatType === 'WEEKLY' && daysOfWeek && daysOfWeek.length > 0) {
    // 매주 특정 요일들
    let dayOffset = 0;
    while (dates.length < maxDates && dayOffset < 70) {
      const date = new Date(start);
      date.setDate(start.getDate() + dayOffset);

      if (daysOfWeek.includes(date.getDay()) && date >= start && (!end || date <= end)) {
        dates.push(new Date(date));
      }
      dayOffset++;
    }
  } else if (repeatType === 'DAILY') {
    // 매일
    for (let i = 0; i < maxDates; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      if (!end || date <= end) {
        dates.push(date);
      } else {
        break; // endAt을 넘어가면 더 이상 추가하지 않음
      }
    }
  }

  return dates;
}

/**
 * RecurrenceRuleDto 유효성 검사
 * @param rule - 반복 규칙 DTO
 * @returns 에러 메시지 또는 null
 */
export function validateRecurrenceRule(rule: RecurrenceRuleDto): string | null {
  const { repeatType, timesOfDay, daysOfWeek, daysOfMonth, startAt, endAt } = rule;

  // startAt 필수
  if (!startAt) {
    return '시작 날짜와 시간을 입력해주세요.';
  }

  // ONCE를 제외하고는 endAt 필수
  if (repeatType !== 'ONCE' && !endAt) {
    return '종료 날짜를 선택해주세요.';
  }

  // endAt이 startAt보다 이전이면 안됨
  if (endAt && new Date(endAt) < new Date(startAt)) {
    return '종료 날짜는 시작 날짜보다 늦어야 합니다.';
  }

  // 실행 시간 필수 (모든 타입)
  if (!timesOfDay || timesOfDay.length === 0) {
    return '실행 시간을 최소 1개 이상 입력해주세요.';
  }

  // WEEKLY는 요일 필수
  if (repeatType === 'WEEKLY' && (!daysOfWeek || daysOfWeek.length === 0)) {
    return '반복할 요일을 선택해주세요.';
  }

  // MONTHLY는 날짜 필수
  if (repeatType === 'MONTHLY' && (!daysOfMonth || daysOfMonth.length === 0)) {
    return '반복할 날짜를 선택해주세요.';
  }

  // 요일 유효성 검사 (0-6)
  if (daysOfWeek && daysOfWeek.length > 0) {
    const invalidDays = daysOfWeek.filter(day => day < 0 || day > 6);
    if (invalidDays.length > 0) {
      return '요일은 0(일요일)부터 6(토요일) 사이의 값이어야 합니다.';
    }
  }

  // 날짜 유효성 검사 (1-31)
  if (daysOfMonth && daysOfMonth.length > 0) {
    const invalidDays = daysOfMonth.filter(day => day < 1 || day > 31);
    if (invalidDays.length > 0) {
      return '날짜는 1일부터 31일 사이의 값이어야 합니다.';
    }
  }

  // 시간 형식 유효성 검사
  if (timesOfDay && timesOfDay.length > 0) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const invalidTimes = timesOfDay.filter(time => !timeRegex.test(time));
    if (invalidTimes.length > 0) {
      return '시간은 HH:mm 형식이어야 합니다. (예: 09:00)';
    }
  }

  return null;
}
