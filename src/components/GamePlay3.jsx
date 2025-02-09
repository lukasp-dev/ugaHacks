// GamePlayTrueFalse.jsx
import React, { useState } from 'react';
import GameEnd from './GameEnd'; // GameEnd 컴포넌트를 임포트

// Question data for True/False quiz
const questionsData = [
  {
    id: 1,
    question_text:
      "If a company’s current ratio is 2.0, it means the company has twice as many current assets as current liabilities, indicating it can comfortably cover its short-term obligations.",
    answer: true,
    explanation: ""
  },
  {
    id: 2,
    question_text:
      "An equity ratio of 55% means that 55% of a company’s assets are financed by shareholders’ equity, which generally reflects a strong financial foundation with moderate reliance on debt.",
    answer: true,
    explanation: ""
  },
  {
    id: 3,
    question_text:
      "A gross profit margin of 60% implies that after deducting the cost of goods sold, 60% of revenue remains to cover operating expenses and generate profit, which is considered very healthy.",
    answer: true,
    explanation: ""
  },
  {
    id: 4,
    question_text:
      "A net profit margin of 5% is generally considered extremely high and indicates exceptional profitability in most industries.",
    answer: false,
    explanation:
      "Explanation: In many industries, a 5% net profit margin is actually quite low and may indicate challenges in profitability."
  },
  {
    id: 5,
    question_text:
      "An operating profit margin of 15% means that 15% of revenue remains after covering operating expenses, which is typically seen as robust, especially in capital-intensive sectors.",
    answer: true,
    explanation: ""
  },
  {
    id: 6,
    question_text:
      "An interest coverage ratio of 1.5 is usually sufficient for a company to cover its interest expenses comfortably.",
    answer: false,
    explanation:
      "Explanation: An interest coverage ratio below 2 indicates that a company may struggle to cover its interest obligations, signaling potential financial risk."
  },
  {
    id: 7,
    question_text:
      "An ROE of 25% means that the company generates 25 cents of net income for every dollar of shareholders’ equity, which is generally considered a positive performance indicator.",
    answer: true,
    explanation: ""
  },
  {
    id: 8,
    question_text:
      "An ROA of 10% is universally regarded as too low, suggesting the company is not effectively using its assets to generate profit.",
    answer: false,
    explanation:
      "Explanation: An ROA of 10% is generally considered moderate to good, depending on the industry."
  },
  {
    id: 9,
    question_text:
      "An EBITDA margin of 20% indicates that 20% of the company’s revenue is converted into EBITDA, which is usually a sign of healthy operational efficiency.",
    answer: true,
    explanation: ""
  },
  {
    id: 10,
    question_text:
      "A debt-to-equity ratio of 1.5 means the company has $1.50 of debt for every dollar of equity, which is always considered a safe capital structure.",
    answer: false,
    explanation:
      "Explanation: While a debt-to-equity ratio of 1.5 may be acceptable in some industries, it is not universally considered safe, as optimal levels vary by sector and business model."
  }
];

const GamePlayTrueFalse = () => {
  const totalQuestions = questionsData.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // User's selected answer: true or false
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Array to store results: each entry contains result info for a question
  const [results, setResults] = useState([]);
  // Game over state
  const [gameOver, setGameOver] = useState(false);

  const currentQuestion = questionsData[currentIndex];

  // Check if the selected answer is correct
  const checkAnswer = () => selectedAnswer === currentQuestion.answer;

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    const resultEntry = {
      id: currentQuestion.id,
      questionText: currentQuestion.question_text,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.answer,
      isCorrect: selectedAnswer === currentQuestion.answer,
      explanation: currentQuestion.explanation
    };

    setResults([...results, resultEntry]);
    setIsSubmitted(false);
    setSelectedAnswer(null);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

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
          onClick={() => alert("Settings clicked!")}
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

      {/* Main content: Question area */}
      <div style={{ marginTop: '80px', textAlign: 'center', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '20px' }}>{currentQuestion.question_text}</h2>

        {/* Answer buttons */}
        {!isSubmitted && (
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => handleAnswer(true)}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                marginRight: '10px',
                cursor: 'pointer',
                backgroundColor: '#4caf50',
                border: 'none',
                borderRadius: '4px',
                color: '#fff'
              }}
            >
              ✔️ True
            </button>
            <button
              onClick={() => handleAnswer(false)}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: '#f44336',
                border: 'none',
                borderRadius: '4px',
                color: '#fff'
              }}
            >
              ❌ False
            </button>
          </div>
        )}

        {/* Feedback */}
        {isSubmitted && (
          <div style={{ marginTop: '20px' }}>
            {checkAnswer() ? (
              <p style={{ color: 'blue', fontSize: '18px' }}>Correct!</p>
            ) : (
              <div>
                <p style={{ color: 'red', fontSize: '18px' }}>
                  Incorrect! The correct answer is: {currentQuestion.answer ? "True" : "False"}
                </p>
                {currentQuestion.explanation && (
                  <p style={{ fontSize: '16px' }}>{currentQuestion.explanation}</p>
                )}
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
      </div>
    </div>
  );
};

export default GamePlayTrueFalse;
