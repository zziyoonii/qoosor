import React, { useState } from 'react';
import './App.css';
import { buildPrompt, getToneOptions, getToneDescription, detectLanguage } from './utils/buildPrompt';
import { API_CONFIG } from './config';

function App() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState('기본');
  const [outputTextKO, setOutputTextKO] = useState(''); // 한국어 답변
  const [outputTextEN, setOutputTextEN] = useState(''); // 영어 답변
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isCopiedKO, setIsCopiedKO] = useState(false);
  const [isCopiedEN, setIsCopiedEN] = useState(false);

  // 전문용어 사전 (실제로는 더 많은 용어들이 추가될 수 있습니다)
  const technicalTerms = {
    'API': '애플리케이션 프로그래밍 인터페이스 - 다른 프로그램과 데이터를 주고받는 방법',
    'SDK': '소프트웨어 개발 키트 - 개발자가 특정 기능을 쉽게 구현할 수 있도록 도와주는 도구 모음',
    'REST': '웹 서비스에서 데이터를 주고받는 표준 방식',
    'JSON': '데이터를 저장하고 전송하는 형식',
    'OAuth': '사용자 인증을 위한 보안 프로토콜',
    'SSL': '웹사이트와 브라우저 간의 안전한 통신을 위한 보안 기술',
    'CDN': '콘텐츠 전송 네트워크 - 웹사이트 속도를 빠르게 해주는 서비스',
    '캐시': '자주 사용하는 데이터를 임시로 저장해두는 공간',
    '서버': '웹사이트나 앱이 실행되는 컴퓨터',
    '데이터베이스': '정보를 체계적으로 저장하고 관리하는 시스템',
    '백엔드': '웹사이트나 앱의 뒤에서 작동하는 프로그램',
    '프론트엔드': '사용자가 직접 보고 사용하는 화면 부분',
    '버그': '프로그램에서 발생하는 오류나 문제',
    '배포': '개발한 프로그램을 실제로 사용할 수 있게 만드는 과정',
    '버전': '프로그램의 업데이트 단계',
    '인터페이스': '사용자가 프로그램을 사용할 수 있게 해주는 화면이나 방법',
    '모듈': '프로그램의 기능별로 나눈 부분',
    '플러그인': '기존 프로그램에 새로운 기능을 추가해주는 확장 프로그램',
    '템플릿': '반복적으로 사용할 수 있는 기본 형태',
    '스크립트': '자동으로 실행되는 작은 프로그램',
    '라이브러리': '재사용 가능한 기능들의 모음',
    '프레임워크': '개발을 위한 기본 구조와 도구',
    '파이썬': 'Python - 프로그래밍 언어',
    '자바': 'Java - 프로그래밍 언어',
    '자바스크립트': 'JavaScript - 웹 프로그래밍 언어',
    '실습 강의': '실습을 통한 학습 과정',
    '강의': '학습 과정',
    '코딩': '프로그래밍 작업',
    '개발 환경': '프로그래밍을 위한 도구와 설정'
  };

  // 전문용어를 카테고리별로 분류하는 함수
  const categorizeTerms = (terms) => {
    const categories = {
      'ㄱ-ㄴ': {},
      'ㄷ-ㄹ': {},
      'ㅁ-ㅂ': {},
      'ㅅ-ㅇ': {},
      'ㅈ-ㅊ': {},
      'ㅋ-ㅌ': {},
      'ㅍ-ㅎ': {},
      'A-C': {},
      'D-F': {},
      'G-I': {},
      'J-L': {},
      'M-O': {},
      'P-R': {},
      'S-U': {},
      'V-Z': {},
      '0-9': {}
    };

    // 한글 초성 매핑
    const getKoreanInitial = (char) => {
      const code = char.charCodeAt(0);
      if (code >= 0xAC00 && code <= 0xD7A3) {
        const initial = Math.floor((code - 0xAC00) / 28 / 21);
        const initials = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        return initials[initial];
      }
      return char;
    };

    Object.entries(terms).forEach(([term, definition]) => {
      const firstChar = term.charAt(0);
      const initial = getKoreanInitial(firstChar);
      
      // 한글 분류
      if (['ㄱ', 'ㄲ', 'ㄴ'].includes(initial)) {
        categories['ㄱ-ㄴ'][term] = definition;
      } else if (['ㄷ', 'ㄸ', 'ㄹ'].includes(initial)) {
        categories['ㄷ-ㄹ'][term] = definition;
      } else if (['ㅁ', 'ㅂ', 'ㅃ'].includes(initial)) {
        categories['ㅁ-ㅂ'][term] = definition;
      } else if (['ㅅ', 'ㅆ', 'ㅇ'].includes(initial)) {
        categories['ㅅ-ㅇ'][term] = definition;
      } else if (['ㅈ', 'ㅉ', 'ㅊ'].includes(initial)) {
        categories['ㅈ-ㅊ'][term] = definition;
      } else if (['ㅋ', 'ㅌ'].includes(initial)) {
        categories['ㅋ-ㅌ'][term] = definition;
      } else if (['ㅍ', 'ㅎ'].includes(initial)) {
        categories['ㅍ-ㅎ'][term] = definition;
      }
      // 영문 분류
      else if (/[A-C]/i.test(firstChar)) {
        categories['A-C'][term] = definition;
      } else if (/[D-F]/i.test(firstChar)) {
        categories['D-F'][term] = definition;
      } else if (/[G-I]/i.test(firstChar)) {
        categories['G-I'][term] = definition;
      } else if (/[J-L]/i.test(firstChar)) {
        categories['J-L'][term] = definition;
      } else if (/[M-O]/i.test(firstChar)) {
        categories['M-O'][term] = definition;
      } else if (/[P-R]/i.test(firstChar)) {
        categories['P-R'][term] = definition;
      } else if (/[S-U]/i.test(firstChar)) {
        categories['S-U'][term] = definition;
      } else if (/[V-Z]/i.test(firstChar)) {
        categories['V-Z'][term] = definition;
      }
      // 숫자 분류
      else if (/[0-9]/.test(firstChar)) {
        categories['0-9'][term] = definition;
      }
    });

    // 빈 카테고리 제거
    Object.keys(categories).forEach(key => {
      if (Object.keys(categories[key]).length === 0) {
        delete categories[key];
      }
    });

    return categories;
  };

  // 검색어에 따라 전문용어를 필터링하는 함수
  const filteredTechnicalTerms = () => {
    if (!searchTerm.trim()) {
      return technicalTerms;
    }
    
    const filtered = {};
    Object.entries(technicalTerms).forEach(([term, definition]) => {
      if (term.toLowerCase().includes(searchTerm.toLowerCase()) || 
          definition.toLowerCase().includes(searchTerm.toLowerCase())) {
        filtered[term] = definition;
      }
    });
    
    return filtered;
  };

  // 카테고리 토글 함수
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // 전문용어를 찾아서 쉬운 설명으로 교체하는 함수
  const simplifyTechnicalTerms = (text) => {
    let simplifiedText = text;
    
    // 전문용어를 찾아서 쉬운 설명으로 교체
    Object.keys(technicalTerms).forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      simplifiedText = simplifiedText.replace(regex, `${term}(${technicalTerms[term]})`);
    });

    return simplifiedText;
  };

  // 고객 친화적인 답변 생성 함수
  const generateCustomerFriendlyResponse = (input, tone = '기본', outputLang = 'auto') => {
    // 출력 언어 결정: 'auto'면 입력 언어 감지, 아니면 선택한 언어 사용
    let targetLanguage = outputLang === 'auto' ? detectLanguage(input) : outputLang;
    console.log('톤 변환 시작:', { input: input.substring(0, 50), tone, detectedLang: detectLanguage(input), outputLang, targetLanguage });
    let response = input;

    // 영어 처리
    if (targetLanguage === 'en') {
      // 1단계: 불필요한 기술적 세부사항 제거
      const removePatterns = [
        /server error \d+/gi,
        /database query/gi,
        /API call/gi,
        /cache/gi,
        /memory/gi,
        /authentication server/gi,
        /token expired/gi,
        /after cache initialization/gi,
        /temporary fix/gi,
        /root cause analysis/gi
      ];

      removePatterns.forEach(pattern => {
        response = response.replace(pattern, '');
      });

      // 2단계: 에러 코드 및 기술 용어 변환
      response = response.replace(/\b\d{3}\s*error\b/gi, 'system error');
      response = response.replace(/500\s*error/gi, 'system error');
      response = response.replace(/502\s*error/gi, 'system error');
      response = response.replace(/503\s*error/gi, 'system error');
      response = response.replace(/404\s*error/gi, 'page not found');
      response = response.replace(/401\s*error/gi, 'authentication error');
      response = response.replace(/403\s*error/gi, 'access denied');

      // 3단계: 개발자 용어를 고객 친화적으로 변경
      const replacements = [
        { pattern: /\bbug\b/gi, replacement: 'issue' },
        { pattern: /\btimeout\b/gi, replacement: 'processing delay' },
        { pattern: /\bdatabase\b/gi, replacement: 'data storage' },
        { pattern: /\bAPI\b/gi, replacement: 'external service' },
        { pattern: /\bcache\b/gi, replacement: 'temporary storage' },
        { pattern: /\bdeploy\b/gi, replacement: 'update' },
        { pattern: /\bdeployment\b/gi, replacement: 'update' },
        { pattern: /\bserver\b/gi, replacement: 'system' },
        { pattern: /\bquery\b/gi, replacement: 'data request' },
        { pattern: /\blibrary\b/gi, replacement: 'feature set' },
        { pattern: /\bframework\b/gi, replacement: 'development tool' },
        { pattern: /\bmodule\b/gi, replacement: 'feature' },
        { pattern: /\bplugin\b/gi, replacement: 'add-on' },
        { pattern: /\bSDK\b/gi, replacement: 'development tool' },
        { pattern: /\bpatch\b/gi, replacement: 'fix' },
        { pattern: /\bhotfix\b/gi, replacement: 'urgent fix' },
        { pattern: /\brollback\b/gi, replacement: 'revert' },
        { pattern: /\bdowntime\b/gi, replacement: 'service interruption' },
        { pattern: /\bperformance issue\b/gi, replacement: 'speed issue' },
        { pattern: /\bissue\b/gi, replacement: 'problem' },
        { pattern: /\bmemory leak\b/gi, replacement: 'system resource issue' },
        { pattern: /\bnetwork latency\b/gi, replacement: 'connection delay' }
      ];

      replacements.forEach(({ pattern, replacement }) => {
        response = response.replace(pattern, replacement);
      });

      // 4단계: 문장 정리
      response = response.replace(/,\s*,/g, ',');
      response = response.replace(/\s+/g, ' ');
      response = response.replace(/\.\s*\./g, '.');
      response = response.trim();

      // 5단계: 톤별 변환 적용
      switch (tone) {
        case '정중형':
          // Formal and polite tone
          if (!response.toLowerCase().includes('apologize') && !response.toLowerCase().includes('sorry')) {
            if (response.toLowerCase().includes('hello') || response.toLowerCase().includes('hi')) {
              response = response.replace(/(hello|hi)\./gi, '$1. We apologize for the inconvenience.');
            } else {
              response = 'We apologize for the inconvenience. ' + response;
            }
          }
          break;

        case '공감형':
          // Empathetic tone
          if (!response.toLowerCase().includes('apologize') && !response.toLowerCase().includes('sorry')) {
            if (response.toLowerCase().includes('hello') || response.toLowerCase().includes('hi')) {
              response = response.replace(/(hello|hi)\./gi, '$1. We sincerely apologize for the inconvenience.');
            } else {
              response = 'We sincerely apologize for the inconvenience. ' + response;
            }
          }
          break;

        case '간결형':
          // Brief and clear
          response = response.replace(/we (apologize|sincerely apologize) for the inconvenience\.?\s*/gi, 'Sorry. ');
          break;

        case '기본':
        default:
          // Natural and friendly tone
          break;
      }

      console.log('톤 변환 완료 (영어):', { tone, before: input.substring(0, 50), after: response.substring(0, 50) });
      return response.trim();
    }

    // 한국어 처리 (기존 로직)

    // 1단계: 불필요한 기술적 세부사항 제거
    const removePatterns = [
      /서버에서 \d+ 에러가 발생하고 있고/g,
      /데이터베이스 쿼리에서/g,
      /API 호출에서/g,
      /캐시에서/g,
      /메모리에서/g,
      /인증 서버에서/g,
      /토큰이 만료되어/g,
      /캐시 초기화 후/g,
      /임시 조치했고/g,
      /근본 원인 분석 중입니다/g
    ];

    removePatterns.forEach(pattern => {
      response = response.replace(pattern, '');
    });

    // 2단계: 에러 코드 및 기술 용어 변환
    response = response.replace(/\b\d{3}\s*에러\b/gi, '시스템 오류');
    response = response.replace(/\b\d{3}\s*오류\b/gi, '시스템 오류');
    response = response.replace(/500\s*에러/gi, '시스템 오류');
    response = response.replace(/502\s*에러/gi, '시스템 오류');
    response = response.replace(/503\s*에러/gi, '시스템 오류');
    response = response.replace(/404\s*에러/gi, '페이지를 찾을 수 없습니다');
    response = response.replace(/401\s*에러/gi, '인증 오류');
    response = response.replace(/403\s*에러/gi, '접근 권한 오류');

    // 3단계: 개발자 용어를 고객 친화적으로 변경
    // 주의: 긴 패턴부터 먼저 매칭해야 함 (예: "점검 중"이 "점검"보다 먼저)
    const replacements = [
      // 긴 패턴부터 (우선순위 높음)
      { pattern: '버그가 발생했습니다', replacement: '일시적인 문제가 발생했습니다' },
      { pattern: '타임아웃이 발생하고 있습니다', replacement: '처리 시간이 초과되고 있습니다' },
      { pattern: '데이터베이스 연결 실패', replacement: '정보를 불러오는 데 문제가 있었습니다' },
      { pattern: 'API 호출 실패', replacement: '외부 서비스와의 연결에 문제가 있었습니다' },
      { pattern: '캐시 문제', replacement: '저장된 정보에 문제가 있었습니다' },
      { pattern: '배포해서', replacement: '적용해서' },
      { pattern: '점검 중으로', replacement: '점검 중으로' }, // 점검 중은 그대로 유지
      { pattern: '점검 중', replacement: '점검 중' }, // 점검 중은 그대로 유지
      { pattern: '점검 완료', replacement: '점검 완료' }, // 점검 완료는 그대로 유지
      { pattern: '배포 중', replacement: '시스템 업데이트 중입니다' },
      { pattern: '서버 오류', replacement: '시스템에 일시적인 문제가 발생했습니다' },
      { pattern: '서버에서', replacement: '시스템에서' },
      { pattern: '라이브러리가 제공되고 있지 않아', replacement: '필요한 기능이 아직 준비되지 않아' },
      { pattern: '프로그래밍 언어', replacement: '개발 언어' },
      { pattern: '현재 지원되지 않습니다', replacement: '아직 준비되지 않았습니다' },
      { pattern: '기능이 없습니다', replacement: '기능이 아직 준비되지 않았습니다' },
      { pattern: '어려울 것 같습니다', replacement: '현재로서는 어려울 것 같습니다' },
      { pattern: '긴급 문제 해결를', replacement: '긴급 문제 해결을' },
      { pattern: '문제 해결를', replacement: '문제 해결을' },
      // 짧은 패턴 (나중에 매칭)
      { pattern: '데이터베이스', replacement: '정보 저장소' },
      { pattern: '타임아웃', replacement: '처리 시간 초과' },
      { pattern: 'API', replacement: '외부 연동 기능' },
      { pattern: '캐시', replacement: '임시 저장' },
      { pattern: '배포', replacement: '적용' },
      { pattern: '업데이트', replacement: '개선 작업' },
      { pattern: '패치', replacement: '문제 해결' },
      { pattern: '핫픽스', replacement: '긴급 문제 해결' },
      { pattern: '롤백', replacement: '이전 상태로 되돌리기' },
      { pattern: '다운타임', replacement: '서비스 중단 시간' },
      { pattern: '성능 이슈', replacement: '속도 문제' },
      { pattern: '이슈', replacement: '문제' },
      { pattern: '메모리 부족', replacement: '시스템 자원 부족' },
      { pattern: '네트워크 지연', replacement: '인터넷 연결 지연' },
      { pattern: '쿼리', replacement: '정보 요청' },
      { pattern: '라이브러리', replacement: '기능 모음' },
      { pattern: '프레임워크', replacement: '개발 도구' },
      { pattern: '모듈', replacement: '기능' },
      { pattern: '플러그인', replacement: '추가 기능' },
      { pattern: '확장 기능', replacement: '추가 기능' },
      { pattern: 'SDK', replacement: '개발 도구' },
      { pattern: '개발 환경', replacement: '개발 도구' },
      { pattern: '코딩', replacement: '프로그래밍' },
      { pattern: '버그', replacement: '문제' },
      // "점검"은 단독으로만 변환 (점검 중, 점검 완료 등은 제외)
      { pattern: /\b점검\b(?!\s*(?:중|완료|예정|시간))/g, replacement: '확인' }
    ];

    // 패턴 매칭 실행
    replacements.forEach(({ pattern, replacement }) => {
      if (pattern instanceof RegExp) {
        response = response.replace(pattern, replacement);
      } else {
        const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        response = response.replace(regex, replacement);
      }
    });

    // 4단계: 문장 구조 개선 (더 신중하게)
    // "~하고 있습니다" → "~중입니다" (단, 이미 자연스러운 문장은 제외)
    response = response.replace(/발생하고 있습니다/g, '발생했습니다');
    // "하고 있습니다"는 문맥에 따라 다르므로 제거
    // response = response.replace(/하고 있습니다/g, '중입니다');

    // 5단계: 중복 제거
    response = response.replace(/일시적인 문제가 발생했습니다\.?\s*,?\s*시스템에 일시적인 문제가 발생했습니다/gi, '시스템에 일시적인 문제가 발생했습니다');
    response = response.replace(/시스템에 일시적인 문제가 발생했습니다\.?\s*,?\s*일시적인 문제가 발생했습니다/gi, '시스템에 일시적인 문제가 발생했습니다');
    response = response.replace(/문제를 해결하겠습니다\.?\s*문제를 해결하겠습니다/gi, '문제를 해결하겠습니다');
    response = response.replace(/해결하겠습니다\.?\s*해결하겠습니다/gi, '해결하겠습니다');
    response = response.replace(/문제가 발생하고 있습니다\.?\s*문제가 발생하고 있습니다/gi, '문제가 발생하고 있습니다');
    response = response.replace(/문제를 해결하겠습니다\.?\s*문제를 해결하겠습니다/gi, '문제를 해결하겠습니다');

    // 6단계: 문장 정리
    response = response.replace(/,\s*,/g, ',');
    response = response.replace(/\s+/g, ' ');
    response = response.replace(/\.\s*\./g, '.');
    response = response.replace(/,\s*\./g, '.');
    response = response.replace(/\.\s*,/g, '.');
    response = response.replace(/^\s*,\s*/g, '');
    response = response.replace(/\s*,\s*$/g, '');
    response = response.trim();

    // 7단계: 기본적인 고객 친화적 표현 추가 (변환이 거의 없었을 경우)
    if (response === input || response.length === input.length) {
      // 입력과 거의 동일하면 기본 변환만 적용
      response = response
        .replace(/에러/gi, '오류')
        .replace(/버그/gi, '문제')
        .replace(/서버/gi, '시스템');
    }

    // 8단계: 톤별 변환 적용
    switch (tone) {
      case '정중형':
        // 정중하고 공식적인 말투 (합니다 체)
        response = response.replace(/해요/g, '합니다');
        response = response.replace(/있어요/g, '있습니다');
        response = response.replace(/돼요/g, '됩니다');
        response = response.replace(/중이에요/g, '중입니다');
        response = response.replace(/드릴게요/g, '드리겠습니다');
        response = response.replace(/해드릴게요/g, '해드리겠습니다');
        // 정중한 표현 추가 (안녕하세요가 있으면 그 뒤에, 없으면 앞에)
        if (!response.includes('죄송') && (response.includes('문제') || response.includes('오류'))) {
          if (response.includes('안녕하세요')) {
            // "안녕하세요" 뒤에 사과 표현 추가
            response = response.replace(/안녕하세요\./g, '안녕하세요. 불편을 드려 죄송합니다.');
          } else {
            // "안녕하세요"가 없으면 앞에 추가
            response = '불편을 드려 죄송합니다. ' + response;
          }
        }
        break;

      case '공감형':
        // 공감과 사과를 강조 (해요 체)
        // 먼저 합니다 → 해요 변환 (사과 표현 추가 전에)
        response = response.replace(/중입니다/g, '중이에요');
        response = response.replace(/합니다/g, '해요');
        response = response.replace(/있습니다/g, '있어요');
        response = response.replace(/됩니다/g, '돼요');
        response = response.replace(/드리겠습니다/g, '드릴게요');
        response = response.replace(/해드리겠습니다/g, '해드릴게요');
        
        // 사과 표현 추가 (안녕하세요가 있으면 그 뒤에, 없으면 앞에)
        if (!response.includes('죄송') && !response.includes('불편')) {
          if (response.includes('안녕하세요')) {
            // "안녕하세요" 뒤에 사과 표현 추가
            response = response.replace(/안녕하세요\./g, '안녕하세요. 불편을 드려 죄송해요.');
          } else {
            // "안녕하세요"가 없으면 앞에 추가
            response = '불편을 드려 죄송해요. ' + response;
          }
        } else {
          // 이미 사과 표현이 있으면 "죄송합니다" → "죄송해요"로 변경
          response = response.replace(/죄송합니다/g, '죄송해요');
        }
        
        // 문제 발생 시 공감 표현 강화
        response = response.replace(/문제가 발생했습니다/g, '문제가 발생하여 정말 죄송해요');
        response = response.replace(/오류가 발생했습니다/g, '오류가 발생하여 정말 죄송해요');
        
        // 문장을 더 자연스럽게 연결 (짧고 딱딱한 문장을 부드럽게)
        // "중이에요. 일시적으로 서비스 이용이 제한돼요." → "중이에요. 일시적으로 서비스 이용이 제한될 수 있어요."
        response = response.replace(/제한돼요\./g, '제한될 수 있어요.');
        // "중이에요. 일시적으로" → "중이에요. 다만 일시적으로" (더 자연스러운 연결)
        response = response.replace(/중이에요\.\s*일시적으로/g, '중이에요. 다만 일시적으로');
        // "중입니다. 일시적으로" → "중입니다. 다만 일시적으로"
        response = response.replace(/중입니다\.\s*일시적으로/g, '중입니다. 다만 일시적으로');
        break;

      case '간결형':
        // 짧고 명확하게 (하지만 고객 친화적으로)
        // 과도한 사과 표현만 간소화 (완전히 제거하지 않음)
        response = response.replace(/불편을 드려 죄송합니다\.?\s*/g, '죄송합니다. ');
        response = response.replace(/정말 죄송합니다\.?\s*/g, '죄송합니다. ');
        // 불필요한 수식어만 제거 (핵심 정보는 유지)
        response = response.replace(/일시적으로/g, '');
        response = response.replace(/일시적인/g, '');
        // 문장을 간결하게 만들되 완전한 문장 유지
        response = response.replace(/중이에요\./g, '중입니다.');
        // 중복된 표현 제거
        response = response.replace(/\.\s*\./g, '.');
        response = response.replace(/\s+/g, ' ');
        // 너무 짧게 만들지 않도록 최소 길이 보장
        // 간결하지만 완전한 문장으로 유지
        if (response.length < 30 && !response.includes('.')) {
          // 너무 짧고 문장이 없으면 기본 형태로 복원
          response = response.replace(/점검 중/g, '점검 중입니다');
          response = response.replace(/제한/g, '제한될 수 있습니다');
          if (!response.includes('죄송')) {
            response = '죄송합니다. ' + response;
          }
        }
        break;

      case '전문형':
        // 전문적이고 정확한 표현
        response = response.replace(/해요/g, '합니다');
        response = response.replace(/있어요/g, '있습니다');
        response = response.replace(/돼요/g, '됩니다');
        response = response.replace(/중이에요/g, '중입니다');
        // 전문 용어 사용
        response = response.replace(/문제/g, '이슈');
        response = response.replace(/오류/g, '에러');
        // 사과 표현 최소화
        response = response.replace(/불편을 드려 죄송합니다\.?\s*/g, '');
        break;

      case '친근형':
        // 친근하고 편안한 말투 (해요 체)
        response = response.replace(/중입니다/g, '중이에요');
        response = response.replace(/합니다/g, '해요');
        response = response.replace(/있습니다/g, '있어요');
        response = response.replace(/됩니다/g, '돼요');
        response = response.replace(/드리겠습니다/g, '드릴게요');
        response = response.replace(/해드리겠습니다/g, '해드릴게요');
        // 친근한 표현 추가
        if (response.includes('제한')) {
          response = response.replace(/제한됩니다/g, '제한돼요');
          response = response.replace(/제한됩니다\./g, '제한돼요.');
        }
        break;

      case '기본':
      default:
        // 기본 톤 (변환 최소화, 자연스러운 표현)
        // 기본적으로는 입력을 최대한 유지하되, 기술 용어만 변환
        break;
    }

    console.log('톤 변환 완료:', { tone, before: input.substring(0, 50), after: response.substring(0, 50) });
    return response.trim();
  };

  // Mock AI 응답 생성 함수 (테스트용)
  const generateMockAIResponse = async (text, tone = '기본', outputLang = 'auto') => {
    // 실제 API 호출을 시뮬레이션 (약간의 지연)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 출력 언어 결정: 'auto'면 입력 언어 감지, 아니면 선택한 언어 사용
    const targetLanguage = outputLang === 'auto' ? detectLanguage(text) : outputLang;
    const lowerText = text.toLowerCase();
    
    // 영어 처리
    if (targetLanguage === 'en') {
      // Database/Server error related Mock responses
      if (lowerText.includes('database') || lowerText.includes('query') || lowerText.includes('timeout') || lowerText.includes('500') || lowerText.includes('server')) {
        const dbErrorResponses = {
          '기본': 'Hello. A temporary system issue occurred. The service is currently available normally, and we will resolve it as soon as possible. We apologize for the inconvenience.',
          '정중형': 'Hello. We apologize for the inconvenience caused by a temporary system issue. The service is currently available normally, and we will resolve it as soon as possible.',
          '공감형': 'Hello. We sincerely apologize for the inconvenience. A temporary system issue occurred, but the service is now available normally. We will resolve it quickly.',
          '간결형': 'A temporary system issue occurred. The service is currently available. We will resolve it quickly.',
          '전문형': 'Hello. A temporary system issue occurred. The service is currently available normally, and we will resolve it as soon as possible.',
          '친근형': 'Hello! A temporary system issue occurred, but the service is now available normally. We will resolve it quickly!'
        };
        return dbErrorResponses[tone] || dbErrorResponses['기본'];
      }
      
      // 502 error related Mock responses
      if (lowerText.includes('502') || lowerText.includes('error') || lowerText.includes('token') || lowerText.includes('authentication') || lowerText.includes('cache') || lowerText.includes('root cause')) {
        const errorResponses = {
          '기본': 'Hello. A temporary system error occurred. The service is currently available normally, and we are checking to prevent recurrence. We apologize for the inconvenience.',
          '정중형': 'Hello. We apologize for the inconvenience caused by a temporary system error. The service is currently available normally, and we are checking to prevent recurrence.',
          '공감형': 'Hello. We sincerely apologize for the inconvenience. A temporary system error occurred, but the service is now available normally. We are checking to make sure this issue doesn\'t happen again.',
          '간결형': 'A temporary system error occurred. The service is currently available. Sorry.',
          '전문형': 'Hello. A temporary system error occurred. The service is currently available normally, and we are checking to prevent recurrence.',
          '친근형': 'Hello! A temporary system error occurred, but the service is now available normally. We are checking to make sure this issue doesn\'t happen again!'
        };
        return errorResponses[tone] || errorResponses['기본'];
      }
      
      // System maintenance related Mock responses
      if (lowerText.includes('maintenance') || lowerText.includes('inspection') || lowerText.includes('restricted') || lowerText.includes('limited')) {
        const maintenanceResponses = {
          '기본': 'Hello. The system is currently under maintenance. Service usage may be temporarily restricted. We apologize for the inconvenience.',
          '정중형': 'Hello. The system is currently under maintenance. Service usage may be temporarily restricted. We appreciate your understanding and apologize for the inconvenience.',
          '공감형': 'Hello. We sincerely apologize for the inconvenience. The system is currently under maintenance, and service usage may be temporarily restricted. We will resolve it quickly.',
          '간결형': 'System is under maintenance. Service usage may be restricted. Sorry.',
          '전문형': 'Hello. The system is currently under maintenance. Service usage may be temporarily restricted.',
          '친근형': 'Hello! The system is currently under maintenance, and service usage may be temporarily restricted. We appreciate your understanding!'
        };
        return maintenanceResponses[tone] || maintenanceResponses['기본'];
      }
      
      // Problem checking related Mock responses
      if (lowerText.includes('checking') && lowerText.includes('problem')) {
        const checkingResponses = {
          '기본': 'Hello. We are checking the issue you mentioned. Our technical team is finding a solution, so please wait a moment.',
          '정중형': 'Hello. We are checking the issue you mentioned. Our technical team is finding a solution, so please wait a moment.',
          '공감형': 'Hello. We are checking the issue you mentioned. Our technical team is finding a solution, so please wait a moment.',
          '간결형': 'Checking the issue. Please wait a moment.',
          '전문형': 'Hello. We are checking the issue you mentioned. Our technical team is finding a solution.',
          '친근형': 'Hello! We are checking the issue you mentioned. Our technical team is finding a solution, so please wait a moment!'
        };
        return checkingResponses[tone] || checkingResponses['기본'];
      }
      
      // Resolved related Mock responses
      if (lowerText.includes('resolved') || lowerText.includes('fixed') || (lowerText.includes('issue') && lowerText.includes('solved'))) {
        const resolvedResponses = {
          '기본': 'Hello. The issue you previously inquired about has been resolved. Please try using the service again. We apologize for the inconvenience.',
          '정중형': 'Hello. The issue you previously inquired about has been resolved. Please try using the service again. We apologize for the inconvenience.',
          '공감형': 'Hello. The issue you previously inquired about has been resolved. It should work normally now. We apologize for the inconvenience.',
          '간결형': 'The issue has been resolved. Please try using the service again.',
          '전문형': 'Hello. The issue you previously inquired about has been resolved. Please try using the service again.',
          '친근형': 'Hello! The issue you previously inquired about has been resolved. It should work normally now!'
        };
        return resolvedResponses[tone] || resolvedResponses['기본'];
      }
      
      // 기본 변환 로직 사용
      const baseResponse = generateCustomerFriendlyResponse(text, tone, outputLang);
      return baseResponse;
    }
    
    // 한국어 처리 (기존 로직)
    // 데이터베이스/서버 에러 관련 Mock 응답
    if (lowerText.includes('데이터베이스') || lowerText.includes('쿼리') || lowerText.includes('타임아웃') || lowerText.includes('500') || lowerText.includes('서버에서')) {
      const dbErrorResponses = {
        '기본': '안녕하세요. 일시적인 시스템 문제가 발생했습니다. 현재는 정상적으로 이용 가능하시며, 빠른 시일 내에 해결하도록 하겠습니다. 불편을 드려 죄송합니다.',
        '정중형': '안녕하세요. 일시적인 시스템 문제가 발생하여 불편을 드려 죄송합니다. 현재는 정상적으로 이용 가능하시며, 빠른 시일 내에 해결하도록 하겠습니다.',
        '공감형': '안녕하세요. 불편을 드려 죄송해요. 일시적인 시스템 문제가 발생했었는데, 지금은 정상적으로 이용 가능하세요. 빠르게 해결하도록 하겠습니다.',
        '간결형': '일시적인 시스템 문제가 발생했습니다. 현재는 정상 이용 가능합니다. 빠르게 해결하겠습니다.',
        '전문형': '안녕하세요. 일시적인 시스템 문제가 발생했습니다. 현재는 정상적으로 이용 가능하며, 빠른 시일 내에 해결하도록 하겠습니다.',
        '친근형': '안녕하세요! 일시적인 시스템 문제가 발생했었는데, 지금은 정상적으로 이용 가능해요. 빠르게 해결하도록 하겠습니다!'
      };
      return dbErrorResponses[tone] || dbErrorResponses['기본'];
    }
    
    // 502 에러 관련 Mock 응답
    if (lowerText.includes('502') || lowerText.includes('에러') || lowerText.includes('토큰') || lowerText.includes('인증 서버') || lowerText.includes('캐시') || lowerText.includes('근본 원인')) {
      const errorResponses = {
        '기본': '안녕하세요. 일시적인 시스템 오류가 발생했습니다. 지금은 정상적으로 이용 가능하시며, 재발 방지를 위해 확인 중입니다. 불편을 드려 죄송합니다.',
        '정중형': '안녕하세요. 일시적인 시스템 오류가 발생하여 불편을 드려 죄송합니다. 현재는 정상적으로 이용 가능하시며, 재발 방지를 위해 확인 중입니다.',
        '공감형': '안녕하세요. 불편을 드려 죄송해요. 일시적인 시스템 오류가 발생했었는데, 지금은 정상적으로 이용 가능하세요. 같은 문제가 생기지 않도록 확인하고 있어요.',
        '간결형': '일시적인 시스템 오류가 발생했습니다. 현재는 정상 이용 가능합니다. 죄송합니다.',
        '전문형': '안녕하세요. 일시적인 시스템 오류가 발생했습니다. 현재는 정상적으로 이용 가능하며, 재발 방지를 위해 확인 중입니다.',
        '친근형': '안녕하세요! 일시적인 시스템 오류가 발생했었는데, 지금은 정상적으로 이용 가능해요. 같은 문제가 생기지 않도록 확인 중이에요!'
      };
      return errorResponses[tone] || errorResponses['기본'];
    }
    
    // 시스템 점검 관련 Mock 응답
    if (lowerText.includes('점검') || lowerText.includes('제한')) {
      const maintenanceResponses = {
        '기본': '안녕하세요. 현재 시스템 점검 중입니다. 일시적으로 서비스 이용이 제한될 수 있습니다. 불편을 드려 죄송합니다.',
        '정중형': '안녕하세요. 현재 시스템 점검 중입니다. 일시적으로 서비스 이용이 제한될 수 있으니 양해 부탁드립니다. 불편을 드려 죄송합니다.',
        '공감형': '안녕하세요. 불편을 드려 죄송해요. 현재 시스템 점검 중이에요. 다만 일시적으로 서비스 이용이 제한될 수 있어요. 빠르게 해결하도록 하겠습니다.',
        '간결형': '시스템 점검 중입니다. 서비스 이용이 제한될 수 있습니다. 죄송합니다.',
        '전문형': '안녕하세요. 현재 시스템 점검 중입니다. 일시적으로 서비스 이용이 제한될 수 있습니다.',
        '친근형': '안녕하세요! 현재 시스템 점검 중이에요. 일시적으로 서비스 이용이 제한될 수 있어요. 양해 부탁드려요!'
      };
      return maintenanceResponses[tone] || maintenanceResponses['기본'];
    }
    
    // 문제 확인 중 관련 Mock 응답
    if (lowerText.includes('확인') && lowerText.includes('문제')) {
      const checkingResponses = {
        '기본': '안녕하세요. 말씀해 주신 문제를 확인하고 있습니다. 기술팀에서 해결 방법을 찾고 있으니 잠시만 기다려주세요.',
        '정중형': '안녕하세요. 말씀해 주신 문제를 확인하고 있습니다. 기술팀에서 해결 방법을 찾고 있으니 잠시만 기다려주시기 바랍니다.',
        '공감형': '안녕하세요. 말씀해 주신 문제를 확인하고 있어요. 기술팀에서 해결 방법을 찾고 있으니 조금만 기다려주세요.',
        '간결형': '문제를 확인 중입니다. 잠시만 기다려주세요.',
        '전문형': '안녕하세요. 말씀해 주신 문제를 확인하고 있습니다. 기술팀에서 해결 방법을 찾고 있습니다.',
        '친근형': '안녕하세요! 말씀해 주신 문제를 확인하고 있어요. 기술팀에서 해결 방법을 찾고 있으니 조금만 기다려주세요!'
      };
      return checkingResponses[tone] || checkingResponses['기본'];
    }
    
    // 해결 완료 관련 Mock 응답
    if (lowerText.includes('해결') && (lowerText.includes('완료') || lowerText.includes('되었'))) {
      const resolvedResponses = {
        '기본': '안녕하세요. 이전에 문의해 주신 문제가 해결되었습니다. 다시 이용해보시기 바랍니다. 불편을 드려 죄송했습니다.',
        '정중형': '안녕하세요. 이전에 문의해 주신 문제가 해결되었습니다. 다시 이용해보시기 바랍니다. 불편을 드려 죄송했습니다.',
        '공감형': '안녕하세요. 이전에 문의해 주신 문제가 해결되었어요. 다시 이용해보시면 정상적으로 작동할 거예요. 불편을 드려 죄송했어요.',
        '간결형': '문제가 해결되었습니다. 다시 이용해보시기 바랍니다.',
        '전문형': '안녕하세요. 이전에 문의해 주신 문제가 해결되었습니다. 다시 이용해보시기 바랍니다.',
        '친근형': '안녕하세요! 이전에 문의해 주신 문제가 해결되었어요. 다시 이용해보시면 정상적으로 작동할 거예요!'
      };
      return resolvedResponses[tone] || resolvedResponses['기본'];
    }
    
    // 기본 변환 로직 사용
    const baseResponse = generateCustomerFriendlyResponse(text, tone);
    return baseResponse;
  };

  // AI API를 사용한 고객 친화적 변환 함수
  const generateAICustomerFriendlyResponse = async (text, tone = '기본', outputLang = 'auto') => {
    // 출력 언어 결정
    const targetLanguage = outputLang === 'auto' ? detectLanguage(text) : outputLang;
    
    // Mock API 모드인 경우 Mock 응답 사용
    if (API_CONFIG.useMockAPI) {
      return generateMockAIResponse(text, tone, outputLang);
    }
    
    // API가 비활성화되어 있거나 토큰이 없으면 기본 변환 사용
    if (!API_CONFIG.useAPI || !API_CONFIG.apiKey) {
      const simplifiedText = simplifyTechnicalTerms(text);
      return generateCustomerFriendlyResponse(simplifiedText, tone, outputLang);
    }

    try {
      // 프롬프트 빌더를 사용해서 동적으로 프롬프트 생성
      const prompt = buildPrompt(text, tone, targetLanguage);
      
      // 🔑 API 호출 (토큰이 설정되어 있을 때만 실행됨)
      // src/config.js 파일에서 API_CONFIG.apiKey와 API_CONFIG.useAPI를 설정하세요
      const response = await fetch(API_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 필요시 Authorization 헤더 추가 가능
          // 'Authorization': `Bearer ${API_CONFIG.apiKey}`
        },
        body: JSON.stringify({
          input: text,
          tone: tone,
          outputLanguage: targetLanguage,
          apiKey: API_CONFIG.apiKey  // 서버에서 사용할 수 있도록 전달
        })
      });

      if (!response.ok) {
        throw new Error('AI API 호출 실패');
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('AI API 오류:', error);
      // AI API 실패 시 기존 로직으로 폴백
      const simplifiedText = simplifyTechnicalTerms(text);
      return generateCustomerFriendlyResponse(simplifiedText, tone, outputLang);
    }
  };

  // 답변 생성 함수
  const generateResponse = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setIsCopiedKO(false);
    setIsCopiedEN(false);
    
    try {
      // 한국어와 영어 두 가지 버전 모두 생성
      const [customerFriendlyTextKO, customerFriendlyTextEN] = await Promise.all([
        generateAICustomerFriendlyResponse(inputText, selectedTone, 'ko'),
        generateAICustomerFriendlyResponse(inputText, selectedTone, 'en')
      ]);
      setOutputTextKO(customerFriendlyTextKO);
      setOutputTextEN(customerFriendlyTextEN);
    } catch (error) {
      console.error('변환 오류:', error);
      // 오류 발생 시 기본 변환 사용
      const simplifiedText = simplifyTechnicalTerms(inputText);
      const customerFriendlyTextKO = generateCustomerFriendlyResponse(simplifiedText, selectedTone, 'ko');
      const customerFriendlyTextEN = generateCustomerFriendlyResponse(simplifiedText, selectedTone, 'en');
      setOutputTextKO(customerFriendlyTextKO);
      setOutputTextEN(customerFriendlyTextEN);
    } finally {
      setIsLoading(false);
    }
  };

  // 테스트 예시 목록
  const testExamples = [
    {
      text: '502 에러가 발생했습니다. 인증 서버에서 토큰이 만료되어 발생했습니다. 캐시 초기화 후 임시 조치했고, 근본 원인 분석 중입니다.'
    },
    {
      text: '데이터베이스 쿼리 타임아웃이 발생하고 있습니다. 현재 서버에서 500 에러가 발생하고 있고, API 호출에서도 문제가 확인되었습니다. 긴급 문제 해결를 배포해서 문제를 해결하겠습니다.'
    }
  ];

  // 테스트 예시 복사 함수
  const copyTestExample = (text) => {
    setInputText(text);
    setIsCopiedKO(false);
    setIsCopiedEN(false);
    // 입력 영역으로 포커스 이동
    setTimeout(() => {
      const textarea = document.getElementById('input-text');
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(text.length, text.length);
      }
    }, 100);
  };

  // 빠른 답변 템플릿
  const quickResponses = [
    {
      title: '서비스 점검 안내',
      template: '안녕하세요. 현재 시스템 점검 중으로 일시적으로 서비스 이용이 제한됩니다. 점검 완료 예정 시간은 [시간]입니다. 불편을 드려 죄송합니다.'
    },
    {
      title: '일시적 문제',
      template: '안녕하세요. 일시적인 시스템 문제가 발생했습니다. 빠른 시일 내에 해결해드리도록 하겠습니다. 잠시 후 다시 이용해보시기 바랍니다.'
    },
    {
      title: '문제 확인 중',
      template: '안녕하세요. 말씀해 주신 문제를 확인하고 있습니다. 기술팀에서 해결 방법을 찾고 있으니 잠시만 기다려주세요.'
    },
    {
      title: '해결 완료',
      template: '안녕하세요. 이전에 문의해 주신 문제가 해결되었습니다. 다시 이용해보시기 바랍니다. 불편을 드려 죄송했습니다.'
    }
  ];

  const useQuickResponse = async (template) => {
    setInputText(template);
    // 템플릿 선택 시 자동으로 변환 실행
    setIsLoading(true);
    setIsCopiedKO(false);
    setIsCopiedEN(false);
    
    try {
      // 한국어와 영어 두 가지 버전 모두 생성
      const [customerFriendlyTextKO, customerFriendlyTextEN] = await Promise.all([
        generateAICustomerFriendlyResponse(template, selectedTone, 'ko'),
        generateAICustomerFriendlyResponse(template, selectedTone, 'en')
      ]);
      setOutputTextKO(customerFriendlyTextKO);
      setOutputTextEN(customerFriendlyTextEN);
    } catch (error) {
      console.error('변환 오류:', error);
      const simplifiedText = simplifyTechnicalTerms(template);
      const customerFriendlyTextKO = generateCustomerFriendlyResponse(simplifiedText, selectedTone, 'ko');
      const customerFriendlyTextEN = generateCustomerFriendlyResponse(simplifiedText, selectedTone, 'en');
      setOutputTextKO(customerFriendlyTextKO);
      setOutputTextEN(customerFriendlyTextEN);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="header-title">
            <span className="icon">🤖</span>
            CX팀 봇
          </h1>
          <p className="header-subtitle">
            개발자들이 고객 문의에 쉽게 답변할 수 있도록 도와주는 도구
          </p>
        </div>
      </header>

      <div className="main-content">
        <div className="container">
          <div className="chat-container">
            {/* 입력 영역 */}
            <div className="input-section">
              <h3>개발자 답변 입력</h3>
              <div style={{ 
                marginBottom: '10px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {testExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => copyTestExample(example.text)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f0f7ff',
                      border: '1px solid #0066cc',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#0066cc',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#0066cc';
                      e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f0f7ff';
                      e.target.style.color = '#0066cc';
                    }}
                  >
                    💡 테스트 예시 {index + 1}
                  </button>
                ))}
              </div>
              <textarea
                            id="input-text"
                            name="input-text"
                            className="input-textarea"
                            placeholder="기술적인 답변을 입력하세요 💻"
                            value={inputText}
                            onChange={(e) => {
                              setInputText(e.target.value);
                              setIsCopiedKO(false);
                              setIsCopiedEN(false);
                            }}
                            rows={6}
                          />
              
              {/* 톤 선택 */}
              <div className="tone-selection">
                <h4>답변 톤 선택</h4>
                <div className="tone-buttons">
                  {getToneOptions().map((tone) => (
                    <button
                      key={tone}
                      className={`tone-btn ${selectedTone === tone ? 'active' : ''}`}
                      onClick={() => setSelectedTone(tone)}
                      title={getToneDescription(tone, 'ko')}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
                <p className="tone-description">{getToneDescription(selectedTone, 'ko')}</p>
              </div>

              {/* 프롬프트 미리보기 */}
              <div className="prompt-preview">
                <button
                  className="preview-btn"
                  onClick={() => setShowPromptPreview(!showPromptPreview)}
                >
                  {showPromptPreview ? '프롬프트 숨기기' : '프롬프트 미리보기'}
                </button>
                {showPromptPreview && inputText && (
                  <div className="preview-content">
                    <h5>AI에게 전달되는 프롬프트:</h5>
                    <pre>{buildPrompt(inputText, selectedTone)}</pre>
                </div>
                )}
                </div>

              {/* 빠른 답변 템플릿 */}
              <div className="quick-responses">
                <h4>
                  {API_CONFIG.useMockAPI 
                    ? '빠른 답변 템플릿 테스트 해보세요' 
                    : '빠른 답변 템플릿'}
                </h4>
                <div className="template-buttons">
                  {quickResponses.map((response, index) => (
                    <button
                      key={index}
                      className="template-btn"
                      onClick={() => useQuickResponse(response.template)}
                    >
                      {response.title}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="generate-btn"
                onClick={generateResponse}
                disabled={isLoading || !inputText.trim()}
              >
                {isLoading ? '변환 중...' : `${selectedTone} 톤으로 변환`}
              </button>
            </div>

            {/* 출력 영역 */}
            <div className="output-section">
              <h3>고객 친화적 답변</h3>
              {API_CONFIG.useAPI && API_CONFIG.apiKey ? (
                <div style={{ 
                  marginBottom: '10px', 
                  padding: '10px 12px', 
                  backgroundColor: '#d1ecf1', 
                  border: '1px solid #0c5460',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#0c5460'
                }}>
                  🤖 <strong>AI가 답변을 작성합니다.</strong> 한국어와 영어 두 가지 버전을 자동으로 생성합니다.
                </div>
              ) : API_CONFIG.useMockAPI ? (
                <div style={{ 
                  marginBottom: '10px', 
                  padding: '10px 12px', 
                  backgroundColor: '#e7f3ff', 
                  border: '1px solid #0066cc',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#004085'
                }}>
                  🧪 <strong>Mock AI 모드로 테스트 중입니다.</strong> 실제 API 호출 없이 AI 응답을 시뮬레이션합니다. 한국어와 영어 두 가지 버전을 생성합니다.
                </div>
              ) : (
                <div style={{ 
                  marginBottom: '10px', 
                  padding: '10px 12px', 
                  backgroundColor: '#fff3cd', 
                  border: '1px solid #ffc107',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#856404'
                }}>
                  💡 <strong>간단한 변환 규칙을 사용 중입니다.</strong> 한국어와 영어 두 가지 버전을 생성합니다.
                </div>
              )}
              
              {/* 한국어 답변 */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#333' }}>
                  🇰🇷 한국어
                </h4>
                <textarea
                  className="output-textarea"
                  value={outputTextKO}
                  onChange={(e) => {
                    setOutputTextKO(e.target.value);
                    setIsCopiedKO(false);
                  }}
                  placeholder="한국어 답변이 여기에 표시됩니다. 필요시 직접 수정할 수 있습니다."
                  rows={6}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    minHeight: '120px'
                  }}
                />
                {outputTextKO && (
                  <button
                    className="copy-btn"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(outputTextKO);
                        setIsCopiedKO(true);
                        setTimeout(() => setIsCopiedKO(false), 2000);
                      } catch (error) {
                        console.error('복사 실패:', error);
                      }
                    }}
                    style={{ marginTop: '8px' }}
                  >
                    {isCopiedKO ? '완료' : '한국어 복사'}
                  </button>
                )}
              </div>

              {/* 영어 답변 */}
              <div>
                <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#333' }}>
                  🇺🇸 English
                </h4>
                <textarea
                  className="output-textarea"
                  value={outputTextEN}
                  onChange={(e) => {
                    setOutputTextEN(e.target.value);
                    setIsCopiedEN(false);
                  }}
                  placeholder="English response will be displayed here. You can edit it if needed."
                  rows={6}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    minHeight: '120px'
                  }}
                />
                {outputTextEN && (
                  <button
                    className="copy-btn"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(outputTextEN);
                        setIsCopiedEN(true);
                        setTimeout(() => setIsCopiedEN(false), 2000);
                      } catch (error) {
                        console.error('복사 실패:', error);
                      }
                    }}
                    style={{ marginTop: '8px' }}
                  >
                    {isCopiedEN ? '완료' : 'English Copy'}
                  </button>
                )}
              </div>
            </div>
          </div>


          {/* 전문용어 사전 */}
          <div className="terms-dictionary">
            <h3>주요 전문용어 사전</h3>
            <div style={{ 
              position: 'relative',
              marginBottom: '1.5rem',
              maxWidth: '400px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              <input
                type="text"
                placeholder="용어나 설명을 검색하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  paddingRight: searchTerm ? '35px' : '12px',
                  border: '1px solid #0066cc',
                  borderRadius: '4px',
                  fontSize: '13px',
                  backgroundColor: '#f0f7ff',
                  color: '#0066cc',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0052a3';
                  e.target.style.boxShadow = '0 0 0 2px rgba(0, 102, 204, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#0066cc';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#0066cc',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '16px',
                    lineHeight: '1',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#0066cc';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#0066cc';
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            
            {searchTerm ? (
              // 검색 결과 표시
              <div className="search-results">
                <div className="terms-grid">
                  {Object.entries(filteredTechnicalTerms()).map(([term, definition]) => (
                    <div key={term} className="term-card">
                      <h4>{term}</h4>
                      <p>{definition}</p>
              </div>
            ))}
          </div>
                {Object.keys(filteredTechnicalTerms()).length === 0 && (
                  <div className="no-results">
                    <p>검색 결과가 없습니다.</p>
        </div>
                )}
            </div>
            ) : (
              // 카테고리별 분류 표시
              <div className="categories-container">
                {Object.entries(categorizeTerms(technicalTerms)).map(([category, terms]) => (
                  <div key={category} className="category-section">
                    <button
                      className="category-header"
                      onClick={() => toggleCategory(category)}
                    >
                      <span className="category-title">{category}</span>
                      <span className="category-count">({Object.keys(terms).length})</span>
                      <span className={`expand-icon ${expandedCategories[category] ? 'expanded' : ''}`}>
                        ▼
                      </span>
                    </button>
                    {expandedCategories[category] && (
                      <div className="category-content">
                        <div className="terms-grid">
                          {Object.entries(terms).map(([term, definition]) => (
                            <div key={term} className="term-card">
                              <h4>{term}</h4>
                              <p>{definition}</p>
            </div>
                          ))}
            </div>
          </div>
                    )}
        </div>
                ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 