// GamePlay2.jsx
import React, { useState } from 'react';

// 문제 데이터 (총 10문제)
// 숫자형 정답의 경우, 오차 허용범위 0.01로 판별합니다.
const questionsData = [
  {
    id: 1,
    question_text: "Calculate the Current Ratio",
    formula: "Current Ratio = Current Assets / Current Liabilities",
    calculation: "300,000 / 150,000 = 2.0",
    answer: 2.0
  },
  {
    id: 2,
    question_text: "Calculate the Quick Ratio",
    formula: "Quick Ratio = (Current Assets - Inventories) / Current Liabilities",
    calculation: "(300,000 - 80,000) / 150,000 = 220,000 / 150,000 ≈ 1.47",
    answer: 1.47
  },
  {
    id: 3,
    question_text: "Calculate the Debt Ratio",
    formula: "Debt Ratio = Total Liabilities / Total Assets",
    calculation: "400,000 / 700,000 ≈ 0.57",
    answer: 0.57
  },
  {
    id: 4,
    question_text: "Calculate the Debt-to-Equity Ratio",
    formula: "Debt-to-Equity Ratio = Total Liabilities / Shareholders' Equity",
    calculation: "400,000 / 300,000 ≈ 1.33",
    answer: 1.33
  },
  {
    id: 5,
    question_text: "Calculate the Net Profit Margin",
    formula: "Net Profit Margin = (Revenue - COGS) / Revenue",
    calculation: "(1,500,000 - 1,200,000) / 1,500,000 = 300,000 / 1,500,000 = 0.20 (or 20%)",
    // 정답은 퍼센트 표기이므로 숫자 20 (즉, 20%)로 비교
    answer: 20
  },
  {
    id: 6,
    question_text: "Calculate the Return on Assets (ROA)",
    formula: "ROA = Net Income / Total Assets",
    calculation: "300,000 / 700,000 ≈ 0.4286 (or 42.86%)",
    answer: 42.9
  },
  {
    id: 7,
    question_text: "Calculate the EBITDA",
    formula: "EBITDA = Net Income + Interest Expense + Income Taxes + Depreciation + Amortization",
    calculation: "300,000 + 20,000 + 40,000 + 50,000 + 10,000 = 420,000",
    answer: 420000
  },
  {
    id: 8,
    question_text: "Calculate the EBITDA Margin",
    formula: "EBITDA Margin = EBITDA / Revenue",
    calculation: "420,000 / 1,500,000 = 0.28 (or 28%)",
    answer: 28
  },
  {
    id: 9,
    question_text: "Calculate Non-Current Assets",
    formula: "Non-Current Assets = Total Assets - Current Assets",
    calculation: "700,000 - 300,000 = 400,000",
    answer: 400000
  },
  {
    id: 10,
    question_text: "Return on Equity (ROE)",
    formula: "ROE = Net Income / Shareholders' Equity",
    calculation: "300,000 / 300,000 = 1.0 (or 100%)",
    answer: 100
  }
];

// 왼쪽에 표시될 재무제표 텍스트 (고정)
const financialStatements = `
**Given Financial Statements**

Balance Sheet (as of a specific date):

- Current Assets: $300,000
    - Inventories: $80,000
- Current Liabilities: $150,000
- Total Liabilities: $400,000
- Total Assets: $700,000
- Shareholders' Equity: $300,000

Income Statement (for the period):

- Revenue: $1,500,000
- Cost of Goods Sold (COGS): $1,200,000
- Net Income: $300,000
- Operating Income: $360,000
- Interest Expense: $20,000
- Income Taxes: $40,000
- Depreciation: $50,000
- Amortization: $10,000
`;

const GamePlay2 = () => {
  const totalQuestions = questionsData.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Settings modal

  const currentQuestion = questionsData[currentIndex];

  // 정답 판별 (숫자로 변환하여 오차 0.01 이내면 정답)
  const checkAnswer = () => {
    const parsedAnswer = parseFloat(userAnswer);
    const correctAnswer = currentQuestion.answer;
    // 만약 입력이 숫자로 변환되지 않으면 오답 처리
    if (isNaN(parsedAnswer)) return false;
    return Math.abs(parsedAnswer - correctAnswer) < 0.01;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userAnswer === "") return;
    setIsSubmitted(true);
  };

  const handleNext = () => {
    setIsSubmitted(false);
    setUserAnswer("");
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Quiz completed!");
      setCurrentIndex(0);
    }
  };

  // 토글: 도움말(공식) 모달
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  // Settings 모달 핸들러
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleEndSession = () => {
    alert("Session ended. Redirecting to home screen...");
    setIsModalOpen(false);
    // 실제 앱에서는 리디렉션 처리 필요 (예: react-router 사용)
  };

  // 진행률 계산
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* 상단바: Settings 버튼 및 진행률 바 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#f5f5f5',
          padding: '10px 20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <button
          onClick={openModal}
          style={{
            backgroundColor: 'grey',
            color: '#fff',
            border: 'none',
            padding: '10px 15px',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          Settings
        </button>
        <div style={{ flex: 1, marginLeft: '20px', marginRight: '20px' }}>
          <div
            style={{
              backgroundColor: '#ddd',
              height: '10px',
              borderRadius: '5px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${progressPercentage}%`,
                height: '10px',
                backgroundColor: '#4caf50'
              }}
            ></div>
          </div>
        </div>
        <div style={{ marginRight: '50px' }}>
          {currentIndex + 1} / {totalQuestions}
        </div>
      </div>

      {/* 메인 콘텐츠: 왼쪽 고정 재무제표 박스 + 오른쪽 문제 영역 */}
      <div style={{ display: 'flex', marginTop: '80px', padding: '20px' }}>
        {/* 왼쪽: 재무제표 고정 박스 */}
        <div
          style={{
            width: '35%',
            minWidth: '300px',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#fafafa',
            height: 'fit-content',
            position: 'sticky',
            top: '80px',
            marginRight: '20px',
            whiteSpace: 'pre-wrap'
          }}
        >
          {financialStatements}
        </div>

        {/* 오른쪽: 문제 영역 */}
        <div style={{ flex: 1, padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h2>{currentQuestion.question_text}</h2>

          {/* 숫자 입력 폼 */}
          {!isSubmitted && (
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                step="any"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer"
                style={{
                  padding: '10px',
                  fontSize: '16px',
                  width: '200px',
                  marginRight: '10px'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Submit
              </button>
            </form>
          )}

          {/* 제출 후 피드백 */}
          {isSubmitted && (
            <div style={{ marginTop: '20px' }}>
              {checkAnswer() ? (
                <p style={{ color: 'blue', fontSize: '18px' }}>Correct!</p>
              ) : (
                <div>
                  <p style={{ color: 'red', fontSize: '18px' }}>
                    Incorrect! The correct answer is: {currentQuestion.answer}
                  </p>
                  <p><strong>Calculation:</strong> {currentQuestion.calculation}</p>
                </div>
              )}
              <button
                onClick={handleNext}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Next Question
              </button>
            </div>
          )}

          {/* 전구 아이콘 버튼 (도움말: 공식) */}
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={toggleHelp}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px'
              }}
              title="Show Formula"
            >
              💡
            </button>
          </div>

          {/* 도움말(공식) 모달 */}
          {showHelp && (
            <div>
              {/* 모달 오버레이 */}
              <div
                onClick={toggleHelp}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  zIndex: 1000
                }}
              ></div>
              <div
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  zIndex: 1001,
                  minWidth: '300px',
                  textAlign: 'center'
                }}
              >
                <h3>Formula</h3>
                <p>{currentQuestion.formula}</p>
                <button
                  onClick={toggleHelp}
                  style={{
                    backgroundColor: '#ccc',
                    color: '#333',
                    border: 'none',
                    padding: '10px 15px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    marginTop: '10px'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings 모달 */}
      {isModalOpen && (
        <div>
          {/* 오버레이 */}
          <div
            onClick={closeModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1000
            }}
          ></div>
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              zIndex: 1001,
              minWidth: '300px',
              textAlign: 'center'
            }}
          >
            <h3>Settings</h3>
            <button
              onClick={handleEndSession}
              style={{
                backgroundColor: '#f44336',
                color: '#fff',
                border: 'none',
                padding: '10px 15px',
                cursor: 'pointer',
                borderRadius: '4px',
                margin: '10px'
              }}
            >
              END SESSION
            </button>
            <button
              onClick={closeModal}
              style={{
                backgroundColor: '#ccc',
                color: '#333',
                border: 'none',
                padding: '10px 15px',
                cursor: 'pointer',
                borderRadius: '4px',
                margin: '10px'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePlay2;
