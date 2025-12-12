import { Work } from '@/services/workService';

export interface BlogLink {
  id: number;
  blogLink: string;
  product: string;
  executionTime: string;
  status: "성공" | "진행중" | "실패";
}

// Work 상태를 프론트엔드 표시용 상태로 변환
export const mapWorkStatusToDisplay = (
  status: Work['status']
): BlogLink['status'] => {
  switch (status) {
    case 'COMPLETED':
      return '성공';
    case 'FAILED':
      return '실패';
    case 'PENDING':
    case 'REQUESTED':
    case 'TREND_KEYWORD_DONE':
    case 'PRODUCT_SELECTED':
    case 'CONTENT_GENERATED':
    case 'BLOG_UPLOAD_PENDING':
      return '진행중';
    default:
      return '진행중';
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

// Work를 BlogLink로 변환
export const convertWorkToBlogLink = (work: Work): BlogLink => {
  return {
    id: work.workId,
    blogLink: work.postingUrl || '-',
    product: work.choiceProduct || '-',
    executionTime: formatDateTime(work.completedAt),
    status: mapWorkStatusToDisplay(work.status),
  };
};
