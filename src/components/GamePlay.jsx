import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { increment } from "../store/dateSlice";
import "./GamePlay.css"; // Import our CSS file

const GamePlay = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [userInput, setUserInput] = useState(""); // For calculation questions
  const [showFormulaHint, setShowFormulaHint] = useState(false); // Toggle hint

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/problems/random?type=1")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  const handleAnswerClick = (optionIndex) => {
    // Only applicable for non-calculation questions
    if (questions[currentIndex].category === "calculation") return;
    const correct = optionIndex === questions[currentIndex].correct_option;
    setIsCorrect(correct);
    setSelectedAnswer(optionIndex);
  };

  const handleSubmitCalculation = () => {
    if (questions[currentIndex].category !== "calculation") return;
    const correctAnswer = questions[currentIndex].answer;
    const correct = Math.abs(parseFloat(userInput) - correctAnswer) < 0.01;
    setIsCorrect(correct);
    setSelectedAnswer(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setUserInput("");
      setShowFormulaHint(false);
    } else {
      dispatch(increment());
      navigate("/game/progress");
    }
  };

  if (questions.length === 0) {
    return <p className="text-center">Loading...</p>;
  }

  const currentQuestion = questions[currentIndex];

  // Layout for Calculation Questions (with Given Statement)
  if (currentQuestion.category === "calculation") {
    return (
      <div className="gameplay-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
        <div className="two-column">
          {/* Left Column: Given Statement */}
          <div className="given-statement-box">
            <h3>Given Statement</h3>
            <p>{currentQuestion.given_statement}</p>
          </div>
          {/* Right Column: Question, Answer Input, Hint, and Next Button */}
          <div className="right-column">
            <div>
              <h2 className="question-title">{currentQuestion.question_text}</h2>
              <input
                type="number"
                step="any"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter your answer"
                className="input-field"
              />
              <button
                onClick={handleSubmitCalculation}
                disabled={selectedAnswer !== null}
                className="button btn-blue"
              >
                Submit Answer
              </button>
            </div>
            <button
              onClick={() => setShowFormulaHint(!showFormulaHint)}
              className="button btn-yellow"
            >
              💡 Show Hint
            </button>
            {showFormulaHint && (
              <p className="hint-text">
                {currentQuestion.formula_hint || "No hint provided."}
              </p>
            )}
            {selectedAnswer !== null && (
              <div className="explanation">
                <span className={isCorrect ? "correct-text" : "incorrect-text"}>
                  {isCorrect ? "✅ Correct!" : "❌ Incorrect."}
                </span>
                {currentQuestion.explanation && (
                  <p>{currentQuestion.explanation}</p>
                )}
              </div>
            )}
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="button btn-blue next-button"
            >
              {currentIndex < questions.length - 1 ? "Next Question" : "Finish"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Layout for Non-Calculation Questions (No Given Statement)
  return (
    <div className="gameplay-container single-column">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
          }}
        ></div>
      </div>
      <h2 className="question-title">{currentQuestion.question_text}</h2>
      {currentQuestion.options && (
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={selectedAnswer !== null}
              className={`option-button ${
                selectedAnswer === index
                  ? isCorrect
                    ? "correct"
                    : "incorrect"
                  : ""
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setShowFormulaHint(!showFormulaHint)}
        className="button btn-yellow"
      >
        💡 Show Hint
      </button>
      {showFormulaHint && (
        <p className="hint-text">
          {currentQuestion.formula_hint || "No hint provided."}
        </p>
      )}
      {selectedAnswer !== null && (
        <div className="explanation">
          <span className={isCorrect ? "correct-text" : "incorrect-text"}>
            {isCorrect ? "✅ Correct!" : "❌ Incorrect."}
          </span>
          {currentQuestion.explanation && (
            <p>{currentQuestion.explanation}</p>
          )}
        </div>
      )}
      <button
        onClick={handleNext}
        disabled={selectedAnswer === null}
        className="button btn-blue next-button"
      >
        {currentIndex < questions.length - 1 ? "Next Question" : "Finish"}
      </button>
    </div>
  );
};

export default GamePlay;
