import apiClient from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  // 추가 필드는 백엔드 응답에 맞춰 수정
}

export interface LoginResponse {
  user: User;
  token?: string;
}

/**
 * 현재 로그인한 사용자 정보 조회
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
};

/**
 * Google OAuth2 로그인 URL 생성
 */
export const getGoogleLoginUrl = (): string => {
  return `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
};

/**
 * Naver OAuth2 로그인 URL 생성
 */
export const getNaverLoginUrl = (): string => {
  return `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/naver`;
};

/**
 * Kakao OAuth2 로그인 URL 생성
 */
export const getKakaoLoginUrl = (): string => {
  return `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
  localStorage.removeItem('accessToken');
};
