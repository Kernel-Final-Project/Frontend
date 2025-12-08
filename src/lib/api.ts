import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // OAuth2를 위한 쿠키 전송 허용
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // 필요시 인증 토큰 추가
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 에러 처리
    if (error.response) {
      // 서버 응답이 있는 경우
      switch (error.response.status) {
        case 401:
          // 인증 실패
          console.error('Unauthorized - Please login');
          // 필요시 로그인 페이지로 리다이렉트
          break;
        case 403:
          // 권한 없음
          console.error('Forbidden - Access denied');
          break;
        case 404:
          // Not Found
          console.error('Resource not found');
          break;
        case 500:
          // 서버 에러
          console.error('Server error');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    } else if (error.request) {
      // 요청은 보냈으나 응답을 받지 못한 경우
      console.error('No response from server');
    } else {
      // 요청 설정 중 에러 발생
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
