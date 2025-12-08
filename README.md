# OCP Final Project - Frontend

블로그 콘텐츠 자동화 플랫폼의 프론트엔드 애플리케이션입니다.

> 🚀 **처음 시작하시나요?** [팀원을 위한 상세한 설정 가이드](./SETUP_GUIDE.md)를 확인하세요!

## 📚 기술 스택

- **Framework**: React 18.3 + Vite 5.4
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 3.4 + shadcn/ui
- **State Management**: TanStack Query 5.83
- **Routing**: React Router 6.30
- **Form**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Build Tool**: Vite

## 🚀 시작하기

### 필수 요구사항

- Node.js >= 22.0.0
- npm >= 10.0.0
- Docker (백엔드 데이터베이스용)

### 설치 및 실행

1. **Repository 클론**
```bash
git clone https://github.com/Kernel-Final-Project/Frontend.git
cd Frontend
```

2. **Node 버전 확인** (nvm 사용 시)
```bash
nvm use
# 또는
nvm install 22.19.0
nvm use 22.19.0
```

3. **의존성 설치**
```bash
npm install
```

4. **환경 변수 설정**
```bash
# .env 파일 생성
cp .env.example .env
```

`.env` 파일 내용:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_VERSION=v1
```

5. **백엔드 실행** (별도 터미널)
```bash
# MySQL + RabbitMQ 실행
cd ../Backend
docker start ocp-mysql ocp-rabbitmq

# Spring Boot 실행
./gradlew bootRun
```

6. **프론트엔드 개발 서버 실행**
```bash
npm run dev
```

서버 실행 후: http://localhost:3000

## 📦 주요 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 개발 모드 빌드
npm run build:dev

# ESLint 검사
npm run lint

# Prettier 포맷팅
npm run format

# Prettier 검사 (수정하지 않음)
npm run format:check

# 빌드된 앱 미리보기
npm run preview
```

## 🗂️ 프로젝트 구조

```
src/
├── components/       # 재사용 가능한 컴포넌트
│   └── ui/          # shadcn/ui 컴포넌트
├── pages/           # 페이지 컴포넌트
├── lib/             # 유틸리티 및 설정
│   └── api.ts       # Axios 클라이언트
├── services/        # API 서비스 레이어
│   └── authService.ts
├── hooks/           # 커스텀 React Hooks
├── assets/          # 정적 파일 (이미지, 폰트 등)
├── App.tsx          # 루트 컴포넌트
└── main.tsx         # 앱 진입점
```

## 🔗 API 통신

### 백엔드 연결

- **백엔드 URL**: http://localhost:8080
- **API Base Path**: /api/v1
- **Proxy 설정**: Vite에서 `/api/*` 요청을 자동으로 백엔드로 프록시

### API 클라이언트 사용

```typescript
import apiClient from '@/lib/api';

// GET 요청
const response = await apiClient.get('/users');

// POST 요청
const response = await apiClient.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});
```

### OAuth2 인증

지원하는 소셜 로그인:
- Google
- Naver
- Kakao

```typescript
import { getGoogleLoginUrl } from '@/services/authService';

// 로그인 페이지로 리다이렉트
window.location.href = getGoogleLoginUrl();
```

## 🎨 스타일링

### Tailwind CSS

```tsx
<button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
  Click me
</button>
```

### shadcn/ui 컴포넌트

```tsx
import { Button } from "@/components/ui/button";

<Button variant="default">Click me</Button>
```

## 🔧 개발 가이드

### 코드 포맷팅

프로젝트는 Prettier를 사용합니다. 커밋 전에 다음 명령어로 코드를 포맷팅하세요:

```bash
npm run format
```

### ESLint

```bash
npm run lint
```

### 환경 변수

- `.env`: 로컬 환경 변수 (Git 제외)
- `.env.example`: 환경 변수 예제 (Git 포함)

새로운 환경 변수 추가 시 `.env.example`도 업데이트해주세요.

## 🌐 배포

### 프로덕션 빌드

```bash
npm run build
```

빌드 결과물은 `dist/` 디렉토리에 생성됩니다.

### 빌드 미리보기

```bash
npm run preview
```

## 🤝 기여하기

1. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
2. 변경사항 커밋 (`git commit -m 'feat: Add some AmazingFeature'`)
3. 브랜치에 Push (`git push origin feature/AmazingFeature`)
4. Pull Request 생성

## 📝 커밋 컨벤션

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드
- `chore`: 빌드 업무 수정, 패키지 매니저 수정 등

## 🐛 문제 해결

### 포트 충돌

프론트엔드(3000)와 백엔드(8080) 포트가 이미 사용 중인 경우:

```bash
# Windows
npx kill-port 3000
npx kill-port 8080

# Mac/Linux
lsof -ti:3000 | xargs kill -9
lsof -ti:8080 | xargs kill -9
```

### Docker 컨테이너 문제

```bash
# 컨테이너 상태 확인
docker ps -a

# 컨테이너 재시작
docker restart ocp-mysql ocp-rabbitmq

# 컨테이너 로그 확인
docker logs ocp-mysql
docker logs ocp-rabbitmq
```

## 📚 추가 리소스

- [Vite 문서](https://vitejs.dev/)
- [React 문서](https://react.dev/)
- [Tailwind CSS 문서](https://tailwindcss.com/)
- [shadcn/ui 문서](https://ui.shadcn.com/)
- [TanStack Query 문서](https://tanstack.com/query/latest)

## 📄 라이센스

이 프로젝트는 팀 프로젝트로 진행되었습니다.

## 👥 팀원

- [팀원 이름 추가]

---

**Backend Repository**: [https://github.com/Kernel-Final-Project/Backend](https://github.com/Kernel-Final-Project/Backend)
