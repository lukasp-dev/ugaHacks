/////

// GamePlay.jsx
import React, { useState } from 'react';


// Sample quiz data (using the "definition" category) with options replaced to: ["Option A", "Option B", "Option C"]
const sampleData = {
  "concept": "Current Ratio",
  "questions": {
    "definition": [
      {
        "question_id": 1,
        "question_text": "What is the current ratio?",
        "options": [
          "Option A",
          "Option B",
          "Option C"
        ],
        "correct_option": 0,
        "picture_url": "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      {
        "question_id": 2,
        "question_text": "How do you define current ratio?",
        "options": [
          "Option A",
          "Option B",
          "Option C"
        ],
        "correct_option": 0,
        "picture_url": "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      // Dummy questions to make total 10 questions
      {
        "question_id": 3,
        "question_text": "Dummy question 3",
        "options": [
          "Option A",
          "Option B",
          "Option C"
        ],
        "correct_option": 0,
        "picture_url": "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      {
        "question_id": 4,
        "question_text": "Dummy question 4",
        "options": [
          "Option A",
          "Option B",
          "Option C"
        ],
        "correct_option": 0,
        "picture_url": "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      {
        "question_id": 5,
        "question_text": "Dummy question 5",
        "options": [
          "Option A",
          "Option B",
          "Option C"
        ],
        "correct_option": 0,
        "picture_url": "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      {
        "question_id": 6,
        "question_text": "Dummy question 6",
        "options": [
          "Option A",
          "Option B",
          "Option C"
        ],
        "correct_option": 0,
        "picture_url": "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      {
        "question_id": 7,
        "question_text": "Dummy question 7",
        "options": [
          "Option A",
          "Option B",
          "Option C"
        ],
        "correct_option": 0,
        "picture_url": "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      {
        "question_id": 8,
        "question_text": "Dummy question 8",
        "options": [
          "Option A",
          "Option B",
          "Option C"
        ],
        "correct_option": 0,
        "picture_url": "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      {
        "question_id": 9,
        "question_text": "Dummy question 9",
        "options": [
          "Option A",
          "Option B",
          "Option C"
        ],
        "correct_option": 0,
        "picture_url": "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      },
      {
        "question_id": 10,
        "question_text": "Dummy question 10",
        "options": [
          "Option A",
          "Option B",
          "Option C"
        ],
        "correct_option": 0,
        "picture_url": "https://uga-hack.s3.us-east-2.amazonaws.com/sean-pollock-PhYq704ffdA-unsplash.jpg"
      }
    ]
  }
};

const GamePlay = () => {
  const questions = sampleData.questions.definition;
  const totalQuestions = 10; // Total questions count
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Handler for option selection
  const handleOptionClick = (optionIndex) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
  };

  // Style for option buttons, giving them a button-like 3D effect
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

  // Next question handler
  const handleNext = () => {
    setSelectedOption(null);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Quiz completed!");
      setCurrentIndex(0);
    }
  };

  // Calculate progress percentage (each question = 10%)
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  // Modal handlers for Settings
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEndSession = () => {
    alert("Session ended. Redirecting to home screen...");
    // Redirect to home screen, e.g., using react-router (history.push('/') or similar)
    // For now, we simply close the modal.
    setIsModalOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Top Bar with Settings Button and Progress Bar */}
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
  {/* Settings Button */}
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
  {/* Progress Bar Container */}
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
  {/* Progress Text with extra right margin */}
  <div style={{ marginRight: '50px' }}>
    {currentIndex + 1} / {totalQuestions}
  </div>
</div>

      {/* Main Content */}
      <div style={{ textAlign: 'center', marginTop: '80px' }}>
        <h2>Game Play</h2>
        <div>
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
            <div>
              {selectedOption === currentQuestion.correct_option ? (
                <p style={{ color: 'blue' }}>Correct!</p>
              ) : (
                <p style={{ color: 'red' }}>
                  Incorrect! The correct answer is: Option A
                </p>
              )}
              <button 
                onClick={handleNext} 
                style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '10px' }}
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Settings */}
      {isModalOpen && (
        <div>
          {/* Overlay */}
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
          {/* Modal Content */}
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
    </div>
  );
};

export default GamePlay;
