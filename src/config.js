// ============================================
// 🔑 API 설정 파일
// ============================================
// 
// 나중에 API 토큰을 추가하려면 아래 설정을 변경하세요:
// 
// 1. apiKey: API 토큰을 여기에 입력
// 2. useAPI: true로 변경하면 API 사용, false면 기본 변환만 사용
// 3. apiUrl: API 서버 주소 (로컬 개발: http://localhost:3001/api/gpt, Vercel: /api/gpt)

export const API_CONFIG = {
  // 🔑 API 토큰을 여기에 추가하세요
  apiKey: '',
  
  // API 서버 주소
  // 로컬 개발: 'http://localhost:3001/api/gpt'
  // Vercel 배포: '/api/gpt'
  apiUrl: 'http://localhost:3001/api/gpt',
  
  // ⚙️ API 사용 여부
  // true: 실제 AI API 사용 (토큰 필요)
  // false: Mock AI 모드 또는 규칙 기반 변환 사용
  useAPI: false,
  
  // 🧪 Mock AI 모드 (기본값: true, 추천!)
  // true: AI 응답을 시뮬레이션 (토큰 불필요, 톤별 다른 응답 제공)
  useMockAPI: true
};

// ============================================
// 💡 사용 방법
// ============================================
// 
// 1. Mock AI 모드 (기본값, 추천!)
//    - useMockAPI: true (현재 설정)
//    - 실제 API 호출 없이 AI 응답 시뮬레이션
//    - 톤별로 다른 응답을 확인할 수 있음
//    - 토큰 불필요, 즉시 사용 가능
// 2. 실제 AI API 사용
//    - apiKey에 토큰 입력: apiKey: 'your-api-key-here'
//    - useAPI를 true로 변경: useAPI: true
//    - useMockAPI: false (또는 true 유지해도 됨, useAPI가 우선)
//    - 서버 재시작
//
// 예시 (Mock AI 모드 - 기본값):
// export const API_CONFIG = {
//   apiKey: '',
//   apiUrl: 'http://localhost:3001/api/gpt',
//   useAPI: false,
//   useMockAPI: true  // 🧪 Mock AI 모드 (기본값)
// };
//
// 예시 (실제 AI API):
// export const API_CONFIG = {
//   apiKey: 'sk-proj-...',
//   apiUrl: 'http://localhost:3001/api/gpt',
//   useAPI: true,
//   useMockAPI: false
// };

