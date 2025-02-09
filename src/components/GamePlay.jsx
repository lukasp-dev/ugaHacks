import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { increment } from "../store/dateSlice";
import GameEnd from "./GameEnd"; // Import the GameEnd component
import "./GamePlay.css"; // Import our CSS file

const GamePlay = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // For non-calculation questions: stores selected option index
  const [userInput, setUserInput] = useState(""); // For calculation questions: numeric input
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFormulaHint, setShowFormulaHint] = useState(false);
  const [results, setResults] = useState([]); // To store each question's result
  const [gameOver, setGameOver] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Settings modal

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch questions on mount
  useEffect(() => {
    fetch("http://localhost:8080/api/problems/random?type=1")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  if (questions.length === 0) {
    return <p className="text-center">Loading...</p>;
  }

  const currentQuestion = questions[currentIndex];

  // For non-calculation questions: handle option click
  const handleAnswerClick = (optionIndex) => {
    if (currentQuestion.category === "calculation") return;
    const correct = optionIndex === currentQuestion.correct_option;
    setIsCorrect(correct);
    setSelectedAnswer(optionIndex);
  };

  // For calculation questions: submit answer from user input
  const handleSubmitCalculation = () => {
    if (currentQuestion.category !== "calculation") return;
    const correctAnswer = currentQuestion.answer;
    const parsed = parseFloat(userInput);
    const correct = !isNaN(parsed) && Math.abs(parsed - correctAnswer) < 0.01;
    setIsCorrect(correct);
    // For calculation questions, we simply mark an answer as submitted
    setSelectedAnswer(true);
  };

  // Function to check calculation answer (used in result entry)
  const checkCalculation = () => {
    const parsed = parseFloat(userInput);
    if (isNaN(parsed)) return false;
    return Math.abs(parsed - currentQuestion.answer) < 0.01;
  };

  // Handler for Next Question button
  const handleNext = () => {
    // Create a result entry object for the current question.
    // For calculation questions, userAnswer is the input; for others, it's the option text.
    const resultEntry = {
      id: currentQuestion.id,
      questionText: currentQuestion.question_text,
      userAnswer:
        currentQuestion.category === "calculation"
          ? userInput
          : currentQuestion.options[selectedAnswer],
      correctAnswer:
        currentQuestion.category === "calculation"
          ? currentQuestion.answer
          : currentQuestion.options[currentQuestion.correct_option],
      isCorrect:
        currentQuestion.category === "calculation"
          ? checkCalculation()
          : selectedAnswer === currentQuestion.correct_option,
      explanation: currentQuestion.explanation,
      calculation: currentQuestion.calculation,
      formula: currentQuestion.formula
    };

    setResults([...results, resultEntry]);
    // Reset state for the next question
    setSelectedAnswer(null);
    setIsCorrect(null);
    setUserInput("");
    setShowFormulaHint(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Optionally, you can dispatch an increment if needed
      dispatch(increment());
      setGameOver(true);
    }
  };

  // Toggle formula hint visibility
  const toggleHelp = () => {
    setShowFormulaHint(!showFormulaHint);
  };

  // Settings modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleEndSession = () => {
    alert("Session ended. Redirecting to home screen...");
    setIsModalOpen(false);
    // In a real app, redirect using react-router (e.g., navigate("/"))
  };

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  // When the game is over, render the GameEnd component
  if (gameOver) {
    return <GameEnd results={results} />;
  }

  // Layout for calculation questions (with a given statement)
  if (currentQuestion.category === "calculation") {
    return (
      <div className="gameplay-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="two-column">
          {/* Left Column: Given Statement */}
          <div className="given-statement-box">
            <h3>Given Statement</h3>
            <p>{currentQuestion.given_statement}</p>
          </div>
          {/* Right Column: Question, Input, Hint, Next Button */}
          <div className="right-column">
            <div>
              <h2 className="question-title">
                {currentQuestion.question_text}
              </h2>
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
              onClick={toggleHelp}
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
              disabled={
                (currentQuestion.category === "calculation" && userInput === "") ||
                (currentQuestion.category !== "calculation" && selectedAnswer === null)
              }
              className="button btn-blue next-button"
            >
              {currentIndex < questions.length - 1 ? "Next Question" : "Finish"}
            </button>
          </div>
        </div>
        {isModalOpen && (
          <div>
            <div
              onClick={closeModal}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1000,
              }}
            ></div>
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                zIndex: 1001,
                minWidth: "300px",
                textAlign: "center",
              }}
            >
              <h3>Settings</h3>
              <button
                onClick={handleEndSession}
                style={{
                  backgroundColor: "#f44336",
                  color: "#fff",
                  border: "none",
                  padding: "10px 15px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  margin: "10px",
                }}
              >
                END SESSION
              </button>
              <button
                onClick={closeModal}
                style={{
                  backgroundColor: "#ccc",
                  color: "#333",
                  border: "none",
                  padding: "10px 15px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  margin: "10px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Layout for non-calculation questions (single-column)
  return (
    <div className="gameplay-container single-column">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
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
      <button onClick={toggleHelp} className="button btn-yellow">
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
      {isModalOpen && (
        <div>
          <div
            onClick={closeModal}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1000,
            }}
          ></div>
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              zIndex: 1001,
              minWidth: "300px",
              textAlign: "center",
            }}
          >
            <h3>Settings</h3>
            <button
              onClick={handleEndSession}
              style={{
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                padding: "10px 15px",
                cursor: "pointer",
                borderRadius: "4px",
                margin: "10px",
              }}
            >
              END SESSION
            </button>
            <button
              onClick={closeModal}
              style={{
                backgroundColor: "#ccc",
                color: "#333",
                border: "none",
                padding: "10px 15px",
                cursor: "pointer",
                borderRadius: "4px",
                margin: "10px",
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
