// src/services/authService.ts
import api from '@/lib/api';

export interface User {
  email: string;
  name: string;
  provider: string;
  picture?: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: User;
  message?: string;
}

export const authService = {
  // 현재 로그인한 사용자 정보 조회
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<AuthResponse>('/api/v1/auth/me');
      return response.data.data || null;
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      return null;
    }
  },

  // 로그아웃
  async logout(): Promise<void> {
    await api.post('/api/v1/auth/logout');
  },

  // 회원 탈퇴
  async withdraw(): Promise<void> {
    await api.delete('/api/v1/auth/withdraw');
  },

  // OAuth2 로그인 URL 생성
  getOAuth2LoginUrl(provider: 'google' | 'naver' | 'kakao'): string {
    // Vite 프록시를 통해 요청하도록 상대 경로 사용
    return `/oauth2/authorization/${provider}`;
  },
};