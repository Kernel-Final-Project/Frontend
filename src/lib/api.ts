// src/lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // OAuth2 세션 쿠키 전송 (JSESSIONID)
});

// ========== Request Interceptor ==========
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 개발 환경에서만 요청 로그 출력
    if (import.meta.env.DEV) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        config.data ? config.data : ''
      );
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

// ========== Response Interceptor ==========
apiClient.interceptors.response.use(
  (response) => {
    // 개발 환경에서만 응답 로그 출력
    if (import.meta.env.DEV) {
      console.log(
        `[API Response] ${response.config.url} - ${response.status}`,
        response.data
      );
    }

    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      const url = error.config?.url;

      // 에러 메시지 추출
      const errorMessage = (data as any)?.message || '알 수 없는 오류가 발생했습니다';

      switch (status) {
        case 401:
          console.error('[401 Unauthorized]', url, '- 인증이 필요합니다');
          
          // 로그인 페이지가 아닌 경우에만 리다이렉트
          if (!window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/oauth2/callback')) {
            window.location.href = '/login';
          }
          break;

        case 403:
          console.error('[403 Forbidden]', url, '- 접근 권한이 없습니다');
          break;

        case 404:
          console.error('[404 Not Found]', url, '- 리소스를 찾을 수 없습니다');
          break;

        case 500:
          console.error('[500 Server Error]', url, '-', errorMessage);
          break;

        default:
          console.error(`[${status} Error]`, url, '-', errorMessage);
      }
    } else if (error.request) {
      console.error('[Network Error] 서버 응답 없음 - 네트워크를 확인해주세요');
    } else {
      console.error('[Request Error]', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;