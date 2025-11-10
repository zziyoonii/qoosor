# CX팀 봇 - 고객 문의 답변 도우미

개발자들이 고객 문의에 답변할 때 전문용어를 쉽게 풀어서 고객 친화적인 답변으로 변환해주는 도구입니다.

## 🎯 주요 기능

- **AI 기반 지능형 변환**: OpenAI GPT를 활용한 맥락에 맞는 자연스러운 변환
- **전문용어 자동 변환**: 개발 용어를 고객이 이해하기 쉬운 언어로 자동 변환
- **빠른 답변 템플릿**: 자주 사용하는 답변 패턴을 미리 정의하여 빠른 응답
- **대화 기록 관리**: 변환된 답변들의 히스토리를 저장하고 관리
- **전문용어 사전**: 주요 기술 용어들의 쉬운 설명 제공
- **폴백 시스템**: AI API 실패 시 기본 변환 로직으로 자동 전환

## 🚀 시작하기

### 설치

```bash
npm install
```

### 환경 설정

1. `env.example` 파일을 `.env`로 복사합니다:
```bash
cp env.example .env
```

2. `.env` 파일에서 OpenAI API 키를 설정합니다:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 개발 서버 실행

#### 프론트엔드만 실행
```bash
npm start
```

#### 백엔드 서버만 실행
```bash
npm run server
```

#### 프론트엔드 + 백엔드 동시 실행
```bash
npm run dev:full
```

### 빌드

```bash
npm run build
```

## 🌐 배포

### Vercel 배포 (권장)

1. **Vercel CLI 설치** (선택사항):
```bash
npm i -g vercel
```

2. **GitHub에 코드 푸시**:
```bash
git add .
git commit -m "Add Vercel deployment support"
git push origin main
```

3. **Vercel 대시보드에서 배포**:
   - [Vercel](https://vercel.com)에 로그인
   - "New Project" 클릭
   - GitHub 저장소 연결
   - 자동으로 배포됨

4. **또는 Vercel CLI로 배포**:
```bash
vercel
```

### 로컬 개발 vs Vercel 배포

- **로컬 개발**: `npm run dev:full` (Express 서버 + React 개발 서버)
- **Vercel 배포**: 서버리스 함수 사용 (Express 서버 불필요)

## 💡 사용법

1. **개발자 답변 입력**: 기술적인 내용을 포함한 답변을 입력합니다.
2. **빠른 템플릿 사용**: 미리 정의된 답변 템플릿을 선택하여 빠르게 시작할 수 있습니다.
3. **변환 실행**: "고객 친화적으로 변환" 버튼을 클릭합니다.
4. **결과 확인**: 변환된 고객 친화적인 답변을 확인합니다.
5. **복사 및 사용**: 변환된 답변을 복사하여 고객에게 전달합니다.

## 🔧 기술 스택

- **Frontend**: React 18
- **Styling**: CSS3 with modern design
- **Build Tool**: Webpack 5
- **Font**: Inter (Google Fonts)

## 📝 지원하는 전문용어

- API, SDK, REST, JSON, OAuth, SSL, CDN
- 서버, 데이터베이스, 백엔드, 프론트엔드
- 버그, 배포, 버전, 인터페이스, 모듈
- 플러그인, 템플릿, 스크립트 등

## 🎨 주요 특징

- **반응형 디자인**: 모바일과 데스크톱에서 모두 최적화된 사용자 경험
- **직관적인 UI**: 깔끔하고 사용하기 쉬운 인터페이스
- **실시간 변환**: 입력과 동시에 변환 결과를 확인
- **히스토리 관리**: 이전 변환 기록을 저장하고 참조 가능

## 🔮 향후 계획

- [ ] AI 기반 더 정교한 변환 기능
- [ ] 커스텀 전문용어 사전 추가 기능
- [ ] 팀 협업 기능
- [ ] 다양한 언어 지원
- [ ] API 연동 기능

## 📄 라이선스

MIT License

## 🤝 기여하기

이 프로젝트에 기여하고 싶으시다면 Pull Request를 보내주세요!

---

개발자들이 고객과 더 나은 소통을 할 수 있도록 도와주는 CX팀 봇입니다. 🚀 