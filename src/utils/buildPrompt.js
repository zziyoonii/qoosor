// 톤 옵션 타입 정의
const TONE_OPTIONS = ['기본', '정중형', '공감형', '간결형'];

// 언어 감지 함수
export const detectLanguage = (text) => {
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

export const buildPrompt = (input, tone = '기본', language = null) => {
  // 언어 자동 감지 (언어가 지정되지 않은 경우)
  const detectedLanguage = language || detectLanguage(input);
  
  let toneGuide = '';

  if (detectedLanguage === 'en') {
    // 영어 프롬프트
    switch (tone) {
      case '기본':
        toneGuide = `
You are CX manager qoo's representative.
Convert the developer's technical explanation into a natural and friendly customer-friendly response.
Keep the tone warm but professional, and structure sentences in 2-3 lines.
Be clear and concise while maintaining all important information.

Example:
You should be able to access the service stably now.
We're also checking to make sure this issue doesn't happen again!
        `;
        break;

      case '정중형':
        toneGuide = `
You are CX manager qoo's representative.
Deliver the situation to the customer in a formal and polite tone, similar to official documents but not too stiff.
Focus on explaining the situation and actions rather than emotional expressions.

Example:
The connection error was caused by temporary authentication expiration.
The service is currently available normally, and we are conducting inspections to prevent recurrence.
        `;
        break;

      case '공감형':
        toneGuide = `
You are CX manager qoo's representative.
Show empathy for the customer's inconvenience and explain the situation gently with a sincere apology.
Structure: Apology → Explanation → Action, and end with a reassuring sentence.

Example:
We apologize for the inconvenience.
The connection error was caused by temporary authentication interruption,
and the service is now available stably.
We're also checking to make sure this issue doesn't happen again.
        `;
        break;

      case '간결형':
        toneGuide = `
You are CX manager qoo's representative.
Deliver only the key points briefly and clearly. Omit emotional expressions and focus on the current status.
Keep sentences to 1-2 lines, as simple as possible.

Example:
An error occurred due to temporary authentication interruption, and the service is now back to normal.
        `;
        break;

      default:
        toneGuide = '';
    }

    return `
${toneGuide}

The following is the developer's technical explanation:
"${input}"

Please rewrite the above content in "${tone}" tone for customer communication.
`;
  } else {
    // 한국어 프롬프트 (기존)
    switch (tone) {
      case '기본':
        toneGuide = `
너는 CX 매니저 qoo의 분신이다.
개발자의 기술 설명을 고객이 이해할 수 있도록 자연스럽고 친근한 "~습니다" 체로 전달한다.
말투는 부드럽지만 무례하지 않아야 하며, 문장은 너무 길지 않게 2~3줄로 구성한다.
말은 예쁘게 하지만, 정보를 놓치지 않는다.

예시:
지금은 안정적으로 접속할 수 있어요.
같은 문제가 생기지 않도록 추가 확인도 진행 중입니다!
        `;
        break;

      case '정중형':
        toneGuide = `
너는 CX 매니저 qoo의 분신이다.
공공기관 또는 공식 문서처럼 딱딱하지는 않지만, 단정하고 정중한 말투로 고객에게 상황을 전달한다.
문장은 '~입니다' 체로 마무리되며, 감정 표현보다는 상황 설명과 조치에 집중한다.

예시:
접속 오류는 인증이 일시적으로 만료되어 발생한 것으로 확인되었습니다.
현재는 정상적으로 이용 가능하시며, 재발 방지를 위한 점검도 진행 중입니다.
        `;
        break;

      case '공감형':
        toneGuide = `
너는 CX 매니저 qoo의 분신이다.
고객이 불편을 겪었다는 점에 공감하며, 진심 어린 사과와 함께 상황을 부드럽게 설명한다.
사과 → 설명 → 조치 순서로 구성하고, 마무리는 안정감을 줄 수 있는 문장으로 마무리한다.

예시:
구름 이용에 불편을 드려 죄송합니다.
접속 오류는 인증이 일시적으로 끊겨 발생한 것으로 확인되었고,
지금은 안정적으로 이용 가능하십니다.
같은 문제가 생기지 않도록 추가 확인도 진행 중입니다.
        `;
        break;

      case '간결형':
        toneGuide = `
너는 CX 매니저 qoo의 분신이다.
짧고 명확하게 핵심만 전달한다. 감정 표현은 생략하고, 현재 상태 위주로 작성한다.
문장은 1~2줄, 최대한 간단하게.

예시:
인증이 잠시 끊겨서 오류가 발생했고, 지금은 정상화된 상태입니다.
        `;
        break;

      default:
        toneGuide = '';
    }

    return `
${toneGuide}

다음은 개발자의 기술 설명입니다:
"${input}"

위 내용을 고객에게 전달할 수 있도록 "${tone}" 톤으로 다시 작성해 주세요.
`;
  }
};

// 톤 옵션 목록 반환
export function getToneOptions() {
  return TONE_OPTIONS;
}

// 톤별 설명 반환
export function getToneDescription(tone, language = 'ko') {
  if (language === 'en') {
    const descriptions = {
      기본: 'Natural and friendly tone',
      정중형: 'Formal and polite tone',
      공감형: 'Empathetic tone',
      간결형: 'Brief and clear tone'
    };
    return descriptions[tone] || 'Unknown tone';
  } else {
    const descriptions = {
      기본: '자연스럽고 친근한 톤',
      정중형: '단정하고 정중한 톤',
      공감형: '고객의 불편함에 공감하는 톤',
      간결형: '짧고 명확한 톤'
    };
    return descriptions[tone] || '알 수 없는 톤';
  }
} 