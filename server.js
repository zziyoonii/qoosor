const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어
app.use(cors());
app.use(express.json());

// AI API 변환 엔드포인트 (목업 버전)
app.post('/api/gpt', async (req, res) => {
  try {
    const { input, tone } = req.body;

    if (!input) {
      return res.status(400).json({ error: '입력 텍스트가 필요합니다.' });
    }

    // 💡 목업 응답 로직
    const mockResponses = {
      기본: {
        '시스템 점검': '지금은 안정적으로 접속할 수 있어요. 같은 문제가 생기지 않도록 추가 확인도 진행 중입니다!',
        '서버 오류': '시스템에 일시적인 문제가 있었는데, 지금은 해결해드렸어요. 안정적으로 이용하실 수 있습니다.',
        'API 오류': '외부 서비스와의 연결에 잠깐 문제가 있었는데, 지금은 정상적으로 작동하고 있어요.',
        '데이터베이스': '정보 처리에 잠깐 지연이 있었는데, 지금은 정상적으로 작동하고 있어요.',
        '타임아웃': '처리 시간이 예상보다 오래 걸렸는데, 지금은 정상적으로 작동하고 있어요.',
        '기본': '요청하신 내용을 처리하는 중 잠깐 문제가 있었는데, 지금은 정상적으로 작동하고 있어요.'
      },
      정중형: {
        '시스템 점검': '접속 오류는 인증이 일시적으로 만료되어 발생한 것으로 확인되었습니다. 현재는 정상적으로 이용 가능하시며, 재발 방지를 위한 점검도 진행 중입니다.',
        '서버 오류': '서버에 일시적인 문제가 발생한 것으로 확인되었습니다. 현재는 정상적으로 이용 가능하시며, 재발 방지를 위한 점검도 진행 중입니다.',
        'API 오류': '외부 서비스 연결에 일시적인 문제가 있었던 것으로 확인되었습니다. 현재는 정상적으로 작동하고 있습니다.',
        '데이터베이스': '정보 처리에 일시적인 지연이 있었던 것으로 확인되었습니다. 현재는 정상적으로 작동하고 있습니다.',
        '타임아웃': '처리 시간이 예상보다 오래 걸렸던 것으로 확인되었습니다. 현재는 정상적으로 작동하고 있습니다.',
        '기본': '요청하신 내용을 처리하는 중 일시적인 문제가 있었던 것으로 확인되었습니다. 현재는 정상적으로 작동하고 있습니다.'
      },
      공감형: {
        '시스템 점검': '구름 이용에 불편을 드려 죄송합니다. 접속 오류는 인증이 일시적으로 끊겨 발생한 것으로 확인되었고, 지금은 안정적으로 이용 가능하십니다. 같은 문제가 생기지 않도록 추가 확인도 진행 중입니다.',
        '서버 오류': '갑작스러운 오류로 당황하셨을 것 같아요. 시스템에 일시적인 문제가 있었는데, 지금은 해결해드렸습니다. 같은 문제가 생기지 않도록 추가 확인도 진행 중입니다.',
        'API 오류': '외부 서비스 연결에 문제가 있어서 불편하셨겠어요. 현재는 정상적으로 작동하고 있으니 안심하세요. 같은 문제가 생기지 않도록 추가 확인도 진행 중입니다.',
        '데이터베이스': '정보 처리에 지연이 있어서 답답하셨을 것 같아요. 현재는 정상적으로 작동하고 있습니다. 같은 문제가 생기지 않도록 추가 확인도 진행 중입니다.',
        '타임아웃': '처리 시간이 오래 걸려서 불편하시겠어요. 현재는 정상적으로 작동하고 있습니다. 더 빠르게 개선해드리도록 하겠습니다.',
        '기본': '이용 중 불편을 드려서 정말 죄송합니다. 현재는 정상적으로 작동하고 있으니 안심하세요. 같은 문제가 생기지 않도록 추가 확인도 진행 중입니다.'
      },
      간결형: {
        '시스템 점검': '인증이 잠시 끊겨서 오류가 발생했고, 지금은 정상화된 상태입니다.',
        '서버 오류': '서버에 일시적인 문제가 있었고, 지금은 정상화된 상태입니다.',
        'API 오류': '외부 서비스 연결에 문제가 있었고, 지금은 정상화된 상태입니다.',
        '데이터베이스': '정보 처리에 지연이 있었고, 지금은 정상화된 상태입니다.',
        '타임아웃': '처리 시간이 초과되었고, 지금은 정상화된 상태입니다.',
        '기본': '일시적인 문제가 있었고, 지금은 정상화된 상태입니다.'
      }
    };

    // 입력 텍스트에서 키워드 찾기
    const findKeyword = (text) => {
      const keywords = ['시스템 점검', '서버 오류', 'API 오류', '데이터베이스', '타임아웃'];
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return keyword;
        }
      }
      return '기본';
    };

    const keyword = findKeyword(input);
    const toneResponses = mockResponses[tone] || mockResponses['기본'];
    const result = toneResponses[keyword] || toneResponses['기본'];

    res.json({
      result,
      originalText: input,
      tone: tone || '기본',
      timestamp: new Date().toISOString(),
      note: '목업 응답을 사용했습니다.'
    });

  } catch (error) {
    console.error('목업 API 오류:', error);

    // 오류 발생 시 기본 변환 로직 사용
    const basicTransformation = performBasicTransformation(req.body.text);

    res.json({
      transformedText: basicTransformation,
      originalText: req.body.text,
      tone: req.body.tone || '기본',
      timestamp: new Date().toISOString(),
      note: '오류 발생으로 기본 변환을 사용했습니다.'
    });
  }
});

// 기본 변환 로직 (AI API 실패 시 폴백)
function performBasicTransformation(text) {
  let transformed = text;

  // 기본적인 기술 용어 변환
  const basicReplacements = {
    'API': 'API(외부 연동 기능)',
    'SDK': 'SDK(개발 도구)',
    '서버': '서버(시스템)',
    '데이터베이스': '데이터베이스(정보 저장소)',
    '버그': '문제',
    '배포': '적용',
    '라이브러리': '기능 모음',
    '프레임워크': '개발 도구',
    '파이썬': 'Python',
    '자바': 'Java',
    '자바스크립트': 'JavaScript'
  };

  Object.entries(basicReplacements).forEach(([term, replacement]) => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    transformed = transformed.replace(regex, replacement);
  });

  return transformed;
}

// 헬스체크 엔드포인트
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    aiAvailable: !!process.env.OPENAI_API_KEY 
  });
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`AI API 상태: ${process.env.OPENAI_API_KEY ? '사용 가능' : 'API 키 없음'}`);
}); 