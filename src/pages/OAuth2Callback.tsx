// src/pages/OAuth2Callback.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refetchUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const success = searchParams.get('success');
      const error = searchParams.get('error');

      if (success === 'true') {
        // 로그인 성공
        await refetchUser();  // 사용자 정보 다시 로드
        
        toast({
          title: '로그인 성공',
          description: '환영합니다!',
        });

        // 메인 페이지로 리다이렉트
        navigate('/', { replace: true });
      } else {
        // 로그인 실패
        toast({
          title: '로그인 실패',
          description: error || '로그인 중 오류가 발생했습니다.',
          variant: 'destructive',
        });

        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, navigate, refetchUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">로그인 처리 중...</p>
      </div>
    </div>
  );
}