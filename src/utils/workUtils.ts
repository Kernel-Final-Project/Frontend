import { Work } from '@/services/workService';

export interface BlogLink {
  id: number;
  blogLink: string;
  product: string;
  executionTime: string;
  status: string;
  statusDisplay: "발행 완료" | "발행중" | "발행 실패";
}

// Work 상태를 한글로 변환
export const mapWorkStatusToKorean = (status: Work['status']): string => {
  const statusMap: Record<Work['status'], string> = {
    'PENDING': '대기',
    'REQUESTED': '요청됨',
    'TREND_KEYWORD_DONE': '키워드 완료',
    'PRODUCT_SELECTED': '상품 선택됨',
    'CONTENT_GENERATED': '컨텐츠 생성됨',
    'BLOG_UPLOAD_PENDING': '업로드 대기중',
    'COMPLETED': '완료',
    'FAILED': '실패',
  };
  return statusMap[status] || status;
};

// Work 상태를 프론트엔드 표시용 상태로 변환 (배지 색상용)
export const mapWorkStatusToDisplay = (
  status: Work['status']
): BlogLink['statusDisplay'] => {
  switch (status) {
    case 'COMPLETED':
      return '발행 완료';
    case 'FAILED':
      return '발행 실패';
    case 'PENDING':
    case 'REQUESTED':
    case 'TREND_KEYWORD_DONE':
    case 'PRODUCT_SELECTED':
    case 'CONTENT_GENERATED':
    case 'BLOG_UPLOAD_PENDING':
      return '발행중';
    default:
      return '발행중';
  }
};

// ISO 날짜를 "YYYY.MM.DD HH:mm" 포맷으로 변환
export const formatDateTime = (isoString: string | null): string => {
  if (!isoString) return '-';

  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

// RecurrenceRule을 상세한 한글 문자열로 변환
export const formatRecurrenceRule = (rule: {
  repeatType: string;
  daysOfWeek?: number[] | null;
  daysOfMonth?: number[] | null;
  timesOfDay?: string[] | null;
  startAt: string;
}): string => {
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  let result = '';

  switch (rule.repeatType) {
    case 'ONCE':
      result = '1회 실행';
      break;
    case 'DAILY':
      result = '매일';
      break;
    case 'WEEKLY':
      if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
        const days = rule.daysOfWeek.map(d => weekDays[d]).join(', ');
        result = `매주 ${days}요일`;
      } else {
        result = '매주';
      }
      break;
    case 'MONTHLY':
      if (rule.daysOfMonth && rule.daysOfMonth.length > 0) {
        const days = rule.daysOfMonth.join(', ');
        result = `매월 ${days}일`;
      } else {
        result = '매월';
      }
      break;
    case 'CUSTOM':
      result = '사용자 정의';
      break;
    default:
      result = rule.repeatType;
  }

  // 시간 정보 추가
  if (rule.timesOfDay && rule.timesOfDay.length > 0) {
    const times = rule.timesOfDay.join(', ');
    result += ` ${times}`;
  }

  return result;
};

// Work를 BlogLink로 변환
export const convertWorkToBlogLink = (work: Work): BlogLink => {
  return {
    id: work.workId,
    blogLink: work.postingUrl || '-',
    product: work.choiceProduct || '-',
    executionTime: formatDateTime(work.completedAt),
    status: mapWorkStatusToKorean(work.status),
    statusDisplay: mapWorkStatusToDisplay(work.status),
  };
};
