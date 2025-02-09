// GamePlayCalculation.jsx
import React, { useState } from 'react';
import GameEnd from './GameEnd'; // GameEnd 컴포넌트를 임포트
import { useNavigate } from 'react-router-dom';

// Question data (10 questions total)
// For numeric answers, a tolerance of 0.01 is allowed.
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

// Create the financial statements content as a JSX element
// (Headers are center-aligned, and the rest is left-aligned)
const FinancialStatementsContent = () => (
  <div style={{ whiteSpace: 'normal' }}>
    <p style={{ textAlign: 'center', fontWeight: 'bold' }}>&lt;Given Financial Statements&gt;</p>
    
    <p style={{ textAlign: 'center' }}>Balance Sheet (as of a specific date):</p>
    <div style={{ textAlign: 'left', marginLeft: '20px' }}>
      <p>- Current Assets: $300,000</p>
      <p style={{ marginLeft: '20px', fontWeight: 'bold' }}>- Inventories: $80,000</p>
      <p>- Current Liabilities: $150,000</p>
      <p>- Total Liabilities: $400,000</p>
      <p>- Total Assets: $700,000</p>
      <p>- Shareholders' Equity: $300,000</p>
    </div>
    
    <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Income Statement (for the period):</p>
    <div style={{ textAlign: 'left', marginLeft: '20px' }}>
      <p>- Revenue: $1,500,000</p>
      <p>- Cost of Goods Sold (COGS): $1,200,000</p>
      <p>- Net Income: $300,000</p>
      <p>- Operating Income: $360,000</p>
      <p>- Interest Expense: $20,000</p>
      <p>- Income Taxes: $40,000</p>
      <p>- Depreciation: $50,000</p>
      <p>- Amortization: $10,000</p>
    </div>
  </div>
);

const GamePlayCalculation = () => {
  const totalQuestions = questionsData.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Settings modal
  // 결과 배열 저장 (각 문제 결과 객체)
  const [results, setResults] = useState([]);
  // 게임 종료 상태
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();

  const currentQuestion = questionsData[currentIndex];

  // Validate the answer (convert input to number and allow tolerance of 0.01)
  const checkAnswer = () => {
    const parsedAnswer = parseFloat(userAnswer);
    const correctAnswer = currentQuestion.answer;
    if (isNaN(parsedAnswer)) return false;
    return Math.abs(parsedAnswer - correctAnswer) < 0.01;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userAnswer === "") return;
    setIsSubmitted(true);
  };

  const handleNext = () => {
    // 저장할 결과 객체 구성
    const resultEntry = {
      id: currentQuestion.id,
      questionText: currentQuestion.question_text,
      userAnswer: userAnswer,
      correctAnswer: currentQuestion.answer,
      isCorrect: checkAnswer(),
      calculation: currentQuestion.calculation,
      formula: currentQuestion.formula
    };

    setResults([...results, resultEntry]);
    setIsSubmitted(false);
    setUserAnswer("");
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  // Settings modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleEndSession = () => {
    alert("Session ended. Redirecting to home screen...");
    setIsModalOpen(false);
    // 실제 앱에서는 리디렉션 처리 (예: using react-router)
  };

  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  // 게임 종료 시 GameEnd 컴포넌트 렌더링
  if (gameOver) {
    return <GameEnd results={results} />;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0' }}>
      {/* Top bar: Settings button and progress bar */}
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
        <div style={{ marginRight: '50px', fontSize: '16px' }}>
          {currentIndex + 1} / {totalQuestions}
        </div>
      </div>

      {/* Main content: Left financial statements area + Right question area */}
      <div style={{ display: 'flex', marginTop: '80px', padding: '20px', alignItems: 'center' }}>
        {/* Left: Financial statements box with extra left margin */}
        <div
          style={{
            width: '35%',
            minWidth: '300px',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#fafafa',
            position: 'sticky',
            top: '80px',
            marginRight: '20px',
            marginLeft: '200px'
          }}
        >
          <FinancialStatementsContent />
        </div>

        {/* Right: Question area */}
        <div
          style={{
            flex: 1,
            padding: '20px',
            border: '1px solid #eee',
            borderRadius: '8px',
            textAlign: 'center'
          }}
        >
          <h2>{currentQuestion.question_text}</h2>
          {!isSubmitted && (
            <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'center' }}>
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

          {isSubmitted && (
            <div style={{ marginTop: '20px' }}>
              {checkAnswer() ? (
                <p style={{ color: 'blue', fontSize: '18px' }}>Correct!</p>
              ) : (
                <div>
                  <p style={{ color: 'red', fontSize: '18px' }}>
                    Incorrect! The correct answer is: {currentQuestion.answer}
                  </p>
                  <p>
                    <strong>Calculation:</strong> {currentQuestion.calculation}
                  </p>
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

          {showHelp && (
            <div>
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

      {/* Settings modal */}
      {isModalOpen && (
        <div>
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

export default GamePlayCalculation;
