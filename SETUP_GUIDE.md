# 🚀 OCP 프로젝트 시작 가이드

팀원들을 위한 프로젝트 세팅 및 개발 가이드입니다.

## 📋 목차

1. [개발 환경 준비](#1-개발-환경-준비)
2. [프로젝트 클론 및 설치](#2-프로젝트-클론-및-설치)
3. [백엔드 실행](#3-백엔드-실행)
4. [프론트엔드 실행](#4-프론트엔드-실행)
5. [개발 워크플로우](#5-개발-워크플로우)
6. [코드 작성 가이드](#6-코드-작성-가이드)
7. [문제 해결](#7-문제-해결)

---

## 1. 개발 환경 준비

### 1.1 필수 프로그램 설치

#### Node.js 설치 (v22.19.0)

**Windows:**
1. [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) 다운로드 및 설치
2. 터미널(PowerShell 또는 CMD)을 **관리자 권한**으로 실행
3. 다음 명령어 실행:
```bash
nvm install 22.19.0
nvm use 22.19.0
node --version  # v22.19.0 확인
```

**Mac/Linux:**
```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 터미널 재시작 후
nvm install 22.19.0
nvm use 22.19.0
node --version  # v22.19.0 확인
```

#### Git 설치

- **Windows**: [Git for Windows](https://git-scm.com/download/win)
- **Mac**: `brew install git`
- **Linux**: `sudo apt-get install git`

#### Docker Desktop 설치 (백엔드 데이터베이스용)

- [Docker Desktop 다운로드](https://www.docker.com/products/docker-desktop/)
- 설치 후 Docker Desktop 실행

#### IDE 설치 (선택)

- [VS Code](https://code.visualstudio.com/) (권장)
- [WebStorm](https://www.jetbrains.com/webstorm/)
- [Cursor](https://cursor.sh/)

**VS Code 추천 확장 프로그램:**
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets

### 1.2 Git 설정

```bash
# 사용자 정보 설정 (GitHub 계정 정보)
git config --global user.name "본인이름"
git config --global user.email "본인이메일@example.com"

# 설정 확인
git config --list
```

---

## 2. 프로젝트 클론 및 설치

### 2.1 Repository 클론

```bash
# 작업할 디렉토리로 이동
cd C:\workspace  # Windows
cd ~/workspace   # Mac/Linux

# Frontend 클론
git clone https://github.com/Kernel-Final-Project/Frontend.git

# Backend 클론 (별도 디렉토리)
git clone https://github.com/Kernel-Final-Project/Backend.git
```

### 2.2 Frontend 설치

```bash
cd Frontend

# Node 버전 자동 적용 (nvm 사용 시)
nvm use

# 의존성 설치
npm install

# 환경 변수 파일 생성
cp .env.example .env
```

**⚠️ 중요: .env 파일 수정하지 말 것**
- 로컬 개발 환경에서는 `.env.example`의 기본값 사용
- 배포 환경에서만 수정 필요

---

## 3. 백엔드 실행

### 3.1 Docker 컨테이너 시작

```bash
cd ../Backend

# 처음 실행하는 경우 (컨테이너 생성 및 시작)
docker-compose up -d

# 이미 컨테이너가 있는 경우 (시작만)
docker start ocp-mysql ocp-rabbitmq

# 컨테이너 상태 확인
docker ps
```

**확인 사항:**
- `ocp-mysql` 컨테이너: 포트 3306
- `ocp-rabbitmq` 컨테이너: 포트 5672, 15672

### 3.2 Spring Boot 실행

**Windows (CMD/PowerShell):**
```bash
gradlew bootRun
```

**Mac/Linux:**
```bash
./gradlew bootRun
```

**실행 확인:**
- 콘솔에 `Started OcpFinalProjectApplication in X seconds` 메시지 확인
- 브라우저에서 http://localhost:8080/swagger-ui/index.html 접속 확인

---

## 4. 프론트엔드 실행

### 4.1 개발 서버 시작

```bash
cd ../Frontend  # Backend 디렉토리에서 Frontend로 이동

npm run dev
```

### 4.2 접속 확인

브라우저에서 다음 URL 접속:
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui/index.html
- **RabbitMQ 관리**: http://localhost:15672 (guest/guest)

---

## 5. 개발 워크플로우

### 5.1 브랜치 전략

```
main          (프로덕션, 배포용)
  └── dev     (개발 통합 브랜치)
       ├── feature/기능명  (새 기능 개발)
       ├── fix/버그명      (버그 수정)
       └── refactor/내용   (리팩토링)
```

### 5.2 작업 시작하기

#### Step 1: 최신 코드 받기

```bash
# dev 브랜치로 이동
git checkout dev

# 최신 코드 pull
git pull origin dev
```

#### Step 2: 새 브랜치 생성

```bash
# 기능 개발
git checkout -b feature/로그인페이지

# 버그 수정
git checkout -b fix/로그인버튼오류

# 리팩토링
git checkout -b refactor/api-client-구조개선
```

#### Step 3: 개발 진행

```bash
# 코드 작성...

# 변경된 파일 확인
git status

# 코드 포맷팅 (커밋 전에 항상 실행!)
npm run format

# ESLint 검사
npm run lint
```

### 5.3 커밋하기

#### 커밋 메시지 규칙

```
타입: 제목 (50자 이내)

본문 (선택사항, 72자 이내로 줄바꿈)

예시:
feat: 로그인 페이지 UI 구현

- Google 로그인 버튼 추가
- 로그인 폼 레이아웃 구성
- 반응형 디자인 적용
```

**타입 종류:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드
- `chore`: 빌드, 패키지 매니저 수정

#### 커밋 명령어

```bash
# 변경된 파일 스테이징
git add .

# 커밋 (영어)
git commit -m "feat: Implement login page UI"

# 커밋 (한글)
git commit -m "feat: 로그인 페이지 UI 구현"

# 커밋 확인
git log --oneline -5
```

### 5.4 Push 및 Pull Request

#### Step 1: Push

```bash
# 처음 push할 때
git push -u origin feature/로그인페이지

# 이후 push
git push
```

#### Step 2: Pull Request 생성

1. GitHub에서 Repository로 이동
2. "Compare & pull request" 버튼 클릭
3. PR 정보 작성:

```markdown
## 📁 관련 이슈
#이슈번호 (예: #12)

## 🔥 작업 내용
- 로그인 페이지 UI 구현
- Google OAuth 버튼 추가
- 반응형 레이아웃 적용

## 🧪 테스트 결과
- [ ] 로컬 실행 확인
- [ ] 반응형 테스트 (모바일, 태블릿, 데스크톱)
- [ ] OAuth 로그인 테스트

## 📌 추가 확인 사항
없음
```

4. "Create pull request" 클릭
5. 팀원에게 리뷰 요청

#### Step 3: 코드 리뷰 및 병합

- 리뷰어의 피드백 확인
- 필요시 수정 후 다시 push
- 승인 후 "Squash and merge" 또는 "Merge" 선택

---

## 6. 코드 작성 가이드

### 6.1 디렉토리 구조

```
src/
├── components/          # 재사용 컴포넌트
│   ├── ui/             # shadcn/ui 컴포넌트 (수정 X)
│   ├── layout/         # 레이아웃 컴포넌트 (Header, Footer 등)
│   └── common/         # 공통 컴포넌트 (Button, Input 등)
├── pages/              # 페이지 컴포넌트
│   ├── Login/
│   ├── Dashboard/
│   └── ...
├── services/           # API 서비스
│   ├── authService.ts
│   ├── userService.ts
│   └── ...
├── lib/                # 유틸리티
│   ├── api.ts         # Axios 클라이언트
│   └── utils.ts       # 유틸 함수
├── hooks/              # 커스텀 Hooks
│   └── useAuth.ts
└── types/              # TypeScript 타입 정의
    └── index.ts
```

### 6.2 컴포넌트 작성 예시

**기본 구조:**

```tsx
// src/components/common/LoginButton.tsx
import { Button } from "@/components/ui/button";

interface LoginButtonProps {
  provider: "google" | "naver" | "kakao";
  onClick: () => void;
}

export const LoginButton = ({ provider, onClick }: LoginButtonProps) => {
  return (
    <Button onClick={onClick} className="w-full">
      {provider} 로그인
    </Button>
  );
};
```

**페이지 컴포넌트:**

```tsx
// src/pages/Login/index.tsx
import { LoginButton } from "@/components/common/LoginButton";
import { getGoogleLoginUrl } from "@/services/authService";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = getGoogleLoginUrl();
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-bold">로그인</h1>
        <LoginButton provider="google" onClick={handleGoogleLogin} />
      </div>
    </div>
  );
}
```

### 6.3 API 호출 예시

```tsx
// src/services/userService.ts
import apiClient from "@/lib/api";

export interface User {
  id: number;
  email: string;
  name: string;
}

export const getUserInfo = async (): Promise<User> => {
  const response = await apiClient.get<User>("/users/me");
  return response.data;
};

export const updateUser = async (userId: number, data: Partial<User>): Promise<User> => {
  const response = await apiClient.put<User>(`/users/${userId}`, data);
  return response.data;
};
```

**컴포넌트에서 사용:**

```tsx
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/services/userService";

export default function ProfilePage() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: getUserInfo,
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
    </div>
  );
}
```

### 6.4 스타일링 가이드

**Tailwind CSS 사용:**

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900">제목</h2>
  <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
    버튼
  </button>
</div>
```

**반응형 디자인:**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 모바일: 1열, 태블릿: 2열, 데스크톱: 3열 */}
</div>
```

---

## 7. 문제 해결

### 7.1 포트 충돌

**증상:** "Port 3000 is already in use"

**해결:**
```bash
# Windows
npx kill-port 3000

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### 7.2 npm install 오류

**증상:** 패키지 설치 실패

**해결:**
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json  # Mac/Linux
rmdir /s node_modules && del package-lock.json  # Windows

npm install
```

### 7.3 Docker 컨테이너 문제

**증상:** MySQL 또는 RabbitMQ 연결 실패

**해결:**
```bash
# 컨테이너 상태 확인
docker ps -a

# 컨테이너 재시작
docker restart ocp-mysql ocp-rabbitmq

# 컨테이너 로그 확인
docker logs ocp-mysql
docker logs ocp-rabbitmq

# 컨테이너 완전히 삭제 후 재생성
docker-compose down
docker-compose up -d
```

### 7.4 백엔드 연결 오류

**증상:** API 호출 시 CORS 오류 또는 404

**확인 사항:**
1. 백엔드 서버가 실행 중인지 확인 (http://localhost:8080)
2. `.env` 파일의 `VITE_API_BASE_URL` 확인
3. Vite 개발 서버 재시작

### 7.5 Git 충돌 해결

**증상:** Pull 또는 Merge 시 충돌 발생

**해결:**
```bash
# 1. 충돌 파일 확인
git status

# 2. 충돌 파일 열어서 수정
# <<<<<<< HEAD
# 내 코드
# =======
# 다른 사람 코드
# >>>>>>> branch-name
# 위 마커를 삭제하고 최종 코드만 남기기

# 3. 수정 완료 후
git add .
git commit -m "fix: 충돌 해결"
```

### 7.6 ESLint/Prettier 오류

**증상:** 코드에 빨간 줄이 생기거나 포맷이 안 맞음

**해결:**
```bash
# 코드 자동 포맷팅
npm run format

# ESLint 오류 확인
npm run lint
```

---

## 📞 도움이 필요할 때

1. **이슈 생성**: GitHub Issues에 문제 상황 기록
2. **팀원에게 문의**: Slack/Discord에서 질문
3. **문서 참고**:
   - [React 공식 문서](https://react.dev/)
   - [Tailwind CSS 문서](https://tailwindcss.com/)
   - [TanStack Query 문서](https://tanstack.com/query/latest)

---

## ✅ 체크리스트

작업 시작 전 확인:
- [ ] Node.js v22.19.0 설치됨
- [ ] Docker Desktop 실행 중
- [ ] Backend 서버 실행 중 (localhost:8080)
- [ ] Frontend 서버 실행 중 (localhost:3000)
- [ ] dev 브랜치에서 최신 코드 pull 받음
- [ ] 새 브랜치 생성함

커밋 전 확인:
- [ ] `npm run format` 실행
- [ ] `npm run lint` 실행
- [ ] 로컬에서 테스트 완료
- [ ] 커밋 메시지 규칙 준수

PR 생성 전 확인:
- [ ] PR 템플릿 작성 완료
- [ ] 스크린샷 첨부 (UI 변경 시)
- [ ] 리뷰어 지정

---

**질문이 있으면 언제든지 팀원들에게 물어보세요! 🙋‍♂️**
