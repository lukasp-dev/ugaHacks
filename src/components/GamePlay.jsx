import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { increment } from "../store/dateSlice";
import GameEnd from "./GameEnd"; // Import the GameEnd component
import "./GamePlay.css"; // Import our CSS file

const GamePlay = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // For non-calculation questions: stores the selected option index.
  // For calculation questions, we use `selectedAnswer` as a boolean to indicate
  // whether an answer was submitted.
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // For calculation questions: numeric input from the user.
  const [userInput, setUserInput] = useState("");

  const [isCorrect, setIsCorrect] = useState(null);

  // Controls visibility of formula hints
  const [showFormulaHint, setShowFormulaHint] = useState(false);

  // Stores each question's result (correct/incorrect, explanation, etc.)
  const [results, setResults] = useState([]);

  // Flag to determine if the game has ended
  const [gameOver, setGameOver] = useState(false);

  // Controls the settings modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch questions on mount
  useEffect(() => {
    fetch("http://localhost:8080/api/problems/random?type=1")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  // If no questions are loaded yet, show a loading indicator
  if (questions.length === 0) {
    return <p className="text-center">Loading...</p>;
  }

  const currentQuestion = questions[currentIndex];

  // Handle option click for non-calculation questions
  const handleAnswerClick = (optionIndex) => {
    if (currentQuestion.category === "calculation") return;
    const correct = optionIndex === currentQuestion.correct_option;
    setIsCorrect(correct);
    setSelectedAnswer(optionIndex);
  };

  // Submit user input for calculation questions
  const handleSubmitCalculation = () => {
    if (currentQuestion.category !== "calculation") return;
    const correctAnswer = currentQuestion.answer;
    const parsed = parseFloat(userInput);
    const correct = !isNaN(parsed) && Math.abs(parsed - correctAnswer) < 0.01;
    setIsCorrect(correct);

    // Mark an answer as submitted (so Next button can be enabled)
    setSelectedAnswer(true);
  };

  // Check calculation correctness (used in the result entry)
  const checkCalculation = () => {
    const parsed = parseFloat(userInput);
    if (isNaN(parsed)) return false;
    return Math.abs(parsed - currentQuestion.answer) < 0.01;
  };

  // Handle moving to the next question
  const handleNext = () => {
    // Create a result entry object for the current question
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
      formula: currentQuestion.formula,
    };

    setResults([...results, resultEntry]);

    // Reset state for the next question
    setSelectedAnswer(null);
    setIsCorrect(null);
    setUserInput("");
    setShowFormulaHint(false);

    // Go to the next question or end the game
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Optionally dispatch an increment
      dispatch(increment());
      setGameOver(true);
    }
  };

  // Toggle the formula hint
  const toggleHelp = () => {
    setShowFormulaHint(!showFormulaHint);
  };

  // Settings modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleEndSession = () => {
    alert("Session ended. Redirecting to home screen...");
    setIsModalOpen(false);
    // In a real app, you might redirect using react-router, e.g.: navigate("/")
  };

  // Calculate progress percentage
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  // If the game is over, render the GameEnd component
  if (gameOver) {
    return <GameEnd results={results} />;
  }

  // Layout for calculation questions (two-column view)
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

          {/* Right Column: Question, user input, buttons */}
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
                // If not submitted yet, user can press submit
                disabled={selectedAnswer !== null}
                className="button btn-blue"
              >
                Submit Answer
              </button>
            </div>

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

            {/* Next button is enabled only after submitting (selectedAnswer !== null) */}
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
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

  // Layout for non-calculation questions (single-column view)
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
