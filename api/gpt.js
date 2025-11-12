// 언어 감지 함수
const detectLanguage = (text) => {
  if (!text || text.trim().length === 0) return 'ko';
  
  // 한글이 포함되어 있으면 한국어
  const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  if (koreanRegex.test(text)) {
    return 'ko';
  }
  
  // 영어가 주로 포함되어 있으면 영어
  const englishRegex = /[a-zA-Z]/;
  if (englishRegex.test(text)) {
    return 'en';
  }
  
  // 기본값은 한국어
  return 'ko';
};

export default function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { input, tone, outputLanguage } = req.body;

  // 출력 언어 결정: outputLanguage가 있으면 사용, 없으면 자동 감지
  const targetLanguage = outputLanguage && outputLanguage !== 'auto' ? outputLanguage : detectLanguage(input);

  // 영어 처리
  if (targetLanguage === 'en') {
    const responseEN = {
      기본: `The error was caused by temporary internal authentication expiration. The service is currently available normally, and we are checking to prevent recurrence.`,
      정중형: `The error was caused by temporary internal authentication expiration. The service is currently available normally, and we are checking to prevent recurrence.`,
      공감형: `We apologize for the inconvenience. The error was caused by temporary authentication interruption, and the service is now available stably. We are also checking the cause.`,
      간결형: `The error was caused by temporary authentication interruption, and the service is now back to normal.`,
    };

    const text = responseEN[tone] ?? responseEN.기본;
    return res.status(200).json({ result: text });
  }

  // 한국어 처리 (기존 로직)
  // 간단한 목업 응답 로직
  const response = {
    기본: `오류는 내부 인증이 일시적으로 만료되어 발생한 것으로 확인되었습니다. 지금은 정상적으로 이용 가능하시며, 재발 방지를 위해 확인 중입니다.`,
    정중형: `오류는 내부 인증이 일시적으로 만료되어 발생한 것으로 확인되었습니다. 현재 정상적으로 이용 가능하시며, 재발 방지를 위해 확인 중입니다.`,
    공감형: `불편하셨을 것 같아요. 해당 오류는 인증이 일시적으로 끊긴 탓으로 확인되었고, 지금은 안정적으로 이용 가능하십니다. 원인도 함께 확인하고 있어요.`,
    간결형: `오류는 인증이 일시적으로 끊긴 것으로 확인되었으며, 현재는 정상화된 상태입니다.`,
  };

  const text = response[tone] ?? response.기본;
  
  return res.status(200).json({ result: text });
} 