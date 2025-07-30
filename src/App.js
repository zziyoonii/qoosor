import React, { useState } from 'react';
import './App.css';
import { buildPrompt, getToneOptions, getToneDescription } from './utils/buildPrompt';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedTone, setSelectedTone] = useState('기본');
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

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
  const generateCustomerFriendlyResponse = (input) => {
    let response = input;

    // 불필요한 기술적 세부사항 제거 (먼저 실행)
    const removePatterns = [
      /서버에서 \d+ 에러가 발생하고 있고/g,
      /데이터베이스 쿼리에서/g,
      /API 호출에서/g,
      /캐시에서/g,
      /메모리에서/g
    ];

    removePatterns.forEach(pattern => {
      response = response.replace(pattern, '');
    });

    // 개발자 용어를 고객 친화적으로 변경
    const replacements = {
      '버그가 발생했습니다': '일시적인 문제가 발생했습니다',
      '서버 오류': '시스템에 일시적인 문제가 발생했습니다',
      '500 에러': '시스템 오류',
      '데이터베이스 연결 실패': '정보를 불러오는 데 문제가 있었습니다',
      '타임아웃이 발생하고 있습니다': '처리 시간이 초과되고 있습니다',
      'API 호출 실패': '외부 서비스와의 연결에 문제가 있었습니다',
      '캐시 문제': '저장된 정보에 문제가 있었습니다',
      '배포 중': '시스템 업데이트 중입니다',
      '점검 중': '시스템 점검 중입니다',
      '업데이트': '개선 작업',
      '패치': '문제 해결',
      '핫픽스': '긴급 문제 해결',
      '롤백': '이전 상태로 되돌리기',
      '다운타임': '서비스 중단 시간',
      '성능 이슈': '속도 문제',
      '메모리 부족': '시스템 자원 부족',
      '네트워크 지연': '인터넷 연결 지연',
      '쿼리': '정보 요청',
      '배포': '적용',
      '배포해서': '적용해서',
      // 일반적인 개발 용어들
      '라이브러리가 제공되고 있지 않아': '필요한 기능이 아직 준비되지 않아',
      '라이브러리': '기능 모음',
      '프레임워크': '개발 도구',
      '모듈': '기능',
      '플러그인': '추가 기능',
      '확장 기능': '추가 기능',
      'API': '외부 연동 기능',
      'SDK': '개발 도구',
      '개발 환경': '개발 도구',
      '코딩': '프로그래밍',
      '프로그래밍 언어': '개발 언어',
      '파이썬': 'Python',
      '자바': 'Java',
      '자바스크립트': 'JavaScript',
      '어려울 것 같습니다': '현재로서는 어려울 것 같습니다',
      '현재 지원되지 않습니다': '아직 준비되지 않았습니다',
      '기능이 없습니다': '기능이 아직 준비되지 않았습니다'
    };

    Object.keys(replacements).forEach(term => {
      response = response.replace(new RegExp(term, 'g'), replacements[term]);
    });

    // 중복된 문제 설명 통합
    if (response.includes('일시적인 문제가 발생했습니다') && response.includes('시스템에 일시적인 문제가 발생했습니다')) {
      response = response.replace(/일시적인 문제가 발생했습니다\.?\s*,?\s*시스템에 일시적인 문제가 발생했습니다/g, '시스템에 일시적인 문제가 발생했습니다');
      response = response.replace(/시스템에 일시적인 문제가 발생했습니다\.?\s*,?\s*일시적인 문제가 발생했습니다/g, '시스템에 일시적인 문제가 발생했습니다');
    }

    // 중복된 해결 의지 표현 통합
    response = response.replace(/문제를 해결하겠습니다\.?\s*문제를 해결하겠습니다/g, '문제를 해결하겠습니다');
    response = response.replace(/해결하겠습니다\.?\s*해결하겠습니다/g, '해결하겠습니다');

    // 문장 정리
    response = response.replace(/,\s*,/g, ',');
    response = response.replace(/\s+/g, ' ');
    response = response.replace(/\.\s*\./g, '.');
    response = response.replace(/,\s*\./g, '.');
    response = response.replace(/\.\s*,/g, '.');
    response = response.trim();

    return response;
  };

  // AI API를 사용한 고객 친화적 변환 함수
  const generateAICustomerFriendlyResponse = async (text, tone = '기본') => {
    try {
      // 프롬프트 빌더를 사용해서 동적으로 프롬프트 생성
      const prompt = buildPrompt(text, tone);
      
      // 실제 AI API 호출 (예: OpenAI, Claude, 또는 다른 AI 서비스)
                        const response = await fetch('http://localhost:3001/api/gpt', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      input: text,
                      tone: tone
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
      return generateCustomerFriendlyResponse(simplifiedText);
    }
  };

  // 답변 생성 함수
  const generateResponse = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    
    try {
      // AI API를 사용한 변환 시도
      const customerFriendlyText = await generateAICustomerFriendlyResponse(inputText, selectedTone);
      
      const newChat = {
        id: Date.now(),
        input: inputText,
        output: customerFriendlyText,
        timestamp: new Date().toLocaleString()
      };

      setChatHistory(prev => [...prev, newChat]);
      setOutputText(customerFriendlyText);
    } catch (error) {
      console.error('변환 오류:', error);
      // 오류 발생 시 기본 변환 사용
      const simplifiedText = simplifyTechnicalTerms(inputText);
      const customerFriendlyText = generateCustomerFriendlyResponse(simplifiedText);
      
      const newChat = {
        id: Date.now(),
        input: inputText,
        output: customerFriendlyText,
        timestamp: new Date().toLocaleString()
      };

      setChatHistory(prev => [...prev, newChat]);
      setOutputText(customerFriendlyText);
    } finally {
      setIsLoading(false);
    }
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

  const useQuickResponse = (template) => {
    setInputText(template);
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
                                        <textarea
                            id="input-text"
                            name="input-text"
                            className="input-textarea"
                            placeholder="기술적인 답변을 입력하세요..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
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
                      title={getToneDescription(tone)}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
                <p className="tone-description">{getToneDescription(selectedTone)}</p>
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
                <h4>빠른 답변 템플릿</h4>
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
              <div className="output-textarea">
                {outputText ? (
                  <div className="output-content">
                    {outputText.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
          </div>
                ) : (
                  <p className="placeholder">변환된 답변이 여기에 표시됩니다.</p>
                )}
              </div>
              
              {outputText && (
                <button
                  className="copy-btn"
                  onClick={() => navigator.clipboard.writeText(outputText)}
                >
                  복사하기
                </button>
              )}
            </div>
          </div>

          {/* 대화 기록 */}
          {chatHistory.length > 0 && (
            <div className="chat-history">
              <h3>대화 기록</h3>
              <div className="history-list">
                {chatHistory.map((chat) => (
                  <div key={chat.id} className="history-item">
                    <div className="history-header">
                      <span className="timestamp">{chat.timestamp}</span>
            </div>
                    <div className="history-content">
                      <div className="original">
                        <strong>원본:</strong>
                        <p>{chat.input}</p>
            </div>
                      <div className="converted">
                        <strong>변환:</strong>
                        <p>{chat.output}</p>
            </div>
          </div>
        </div>
                ))}
              </div>
            </div>
          )}

          {/* 전문용어 사전 */}
          <div className="terms-dictionary">
            <h3>주요 전문용어 사전</h3>
            <div className="search-container">
              <input
                type="text"
                placeholder="용어나 설명을 검색하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
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