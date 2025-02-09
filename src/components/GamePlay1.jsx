// GamePlayDefinition.jsx
import React, { useState } from 'react';
import GameEnd from './GameEnd'; // GameEnd 컴포넌트를 임포트
import { useNavigate } from 'react-router-dom';

// Sample quiz data (using the "definition" category)
const sampleData = {
  concept: "Current Ratio",
  questions: {
    definition: [
      {
        question_id: 1,
        question_text: "What is the current ratio?",
        options: ["Option A", "Option B", "Option C"],
        correct_option: 0,
        picture_url: "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      {
        question_id: 2,
        question_text: "How do you define current ratio?",
        options: ["Option A", "Option B", "Option C"],
        correct_option: 0,
        picture_url: "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      // Dummy questions to make total 10 questions
      {
        question_id: 3,
        question_text: "Dummy question 3",
        options: ["Option A", "Option B", "Option C"],
        correct_option: 0,
        picture_url: "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      {
        question_id: 4,
        question_text: "Dummy question 4",
        options: ["Option A", "Option B", "Option C"],
        correct_option: 0,
        picture_url: "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      {
        question_id: 5,
        question_text: "Dummy question 5",
        options: ["Option A", "Option B", "Option C"],
        correct_option: 0,
        picture_url: "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      {
        question_id: 6,
        question_text: "Dummy question 6",
        options: ["Option A", "Option B", "Option C"],
        correct_option: 0,
        picture_url: "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      {
        question_id: 7,
        question_text: "Dummy question 7",
        options: ["Option A", "Option B", "Option C"],
        correct_option: 0,
        picture_url: "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      {
        question_id: 8,
        question_text: "Dummy question 8",
        options: ["Option A", "Option B", "Option C"],
        correct_option: 0,
        picture_url: "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      {
        question_id: 9,
        question_text: "Dummy question 9",
        options: ["Option A", "Option B", "Option C"],
        correct_option: 0,
        picture_url: "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      {
        question_id: 10,
        question_text: "Dummy question 10",
        options: ["Option A", "Option B", "Option C"],
        correct_option: 0,
        picture_url: "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      }
    ]
  }
};

const GamePlayDefinition = () => {
  const questions = sampleData.questions.definition;
  const totalQuestions = questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  // 결과 저장: 각 문제 결과를 객체로 저장
  const [results, setResults] = useState([]);
  // 게임 종료 상태
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();

  const currentQuestion = questions[currentIndex];

  // 옵션 버튼 스타일 (선택된 옵션과 정답에 따라 스타일이 달라짐)
  const getOptionStyle = (optionIndex) => {
    const style = {
      cursor: 'pointer',
      padding: '15px 20px',
      margin: '10px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
      transition: 'all 0.3s',
      display: 'inline-block',
      backgroundColor: '#fff'
    };

    if (selectedOption === null) return style;

    if (optionIndex === selectedOption && optionIndex === currentQuestion.correct_option) {
      style.border = '2px solid blue';
      style.backgroundColor = '#e0f0ff';
    } else if (optionIndex === selectedOption && optionIndex !== currentQuestion.correct_option) {
      style.border = '2px solid red';
      style.backgroundColor = '#ffe0e0';
    } else if (selectedOption !== currentQuestion.correct_option && optionIndex === currentQuestion.correct_option) {
      style.border = '2px solid blue';
      style.backgroundColor = '#e0f0ff';
    }
    return style;
  };

  // 옵션 선택 핸들러
  const handleOptionClick = (optionIndex) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
  };

  // Next Question 핸들러
  const handleNext = () => {
    const resultEntry = {
      id: currentQuestion.question_id,
      questionText: currentQuestion.question_text,
      userAnswer: currentQuestion.options[selectedOption],
      correctAnswer: currentQuestion.options[currentQuestion.correct_option],
      isCorrect: selectedOption === currentQuestion.correct_option
    };

    setResults([...results, resultEntry]);
    setSelectedOption(null);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  // 진행률 계산 (각 문제 = 10%)
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  // 게임 종료 시 GameEnd 컴포넌트 렌더링
  if (gameOver) {
    return <GameEnd results={results} />;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      {/* Top Bar: Settings button and progress bar */}
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

      {/* Main Content */}
      <div style={{ textAlign: 'center', marginTop: '80px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '20px' }}>Game Play</h2>
        <img
          src={currentQuestion.picture_url}
          alt="question"
          style={{ width: '300px', height: '200px', objectFit: 'cover' }}
        />
        <h3>{currentQuestion.question_text}</h3>
        <div>
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              style={getOptionStyle(index)}
              onClick={() => handleOptionClick(index)}
            >
              {option}
            </div>
          ))}
        </div>
        {selectedOption !== null && (
          <div style={{ marginTop: '20px' }}>
            {selectedOption === currentQuestion.correct_option ? (
              <p style={{ color: 'blue', fontSize: '18px' }}>Correct!</p>
            ) : (
              <p style={{ color: 'red', fontSize: '18px' }}>
                Incorrect! The correct answer is: {currentQuestion.options[currentQuestion.correct_option]}
              </p>
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

      {/* Settings Modal */}
      {/** 동일한 모달 코드 사용 (필요 시 수정) **/}
      {/*
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
          <div style={{
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
          }}>
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
      */}
    </div>
  );
};

export default GamePlayDefinition;
