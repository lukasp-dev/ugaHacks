import React, { useState } from "react";

const GamePlayTrueFalse = ({ problem }) => {
  if (!problem) return <p>Loading...</p>;

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setIsSubmitted(true);
  };

  const checkAnswer = () => selectedAnswer === problem.correct_option;

  return (
    <div style={{ textAlign: "center", padding: "1rem", marginBottom: "1.5rem", backgroundColor: "#fff", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "8px", padding: "20px" }}>
      <h3 style={{ color: "#333" }}>{problem.question_text}</h3>
      <div>
        <button
          onClick={() => handleAnswer(0)}
          style={{
            padding: "15px 20px",
            margin: "5px",
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor: selectedAnswer === 0 ? (checkAnswer() ? "#4caf50" : "#f44336") : "#ddd",
            color: selectedAnswer === 0 ? "#fff" : "#000",
            fontSize: "16px",
            border: "1px solid #ccc",
          }}
        >
          True
        </button>
        <button
          onClick={() => handleAnswer(1)}
          style={{
            padding: "15px 20px",
            margin: "5px",
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor: selectedAnswer === 1 ? (checkAnswer() ? "#4caf50" : "#f44336") : "#ddd",
            color: selectedAnswer === 1 ? "#fff" : "#000",
            fontSize: "16px",
            border: "1px solid #ccc",
          }}
        >
          False
        </button>
      </div>

      {isSubmitted && (
        <p style={{ marginTop: "10px", fontWeight: "bold", color: checkAnswer() ? "green" : "red", fontSize: "18px" }}>
          {checkAnswer() ? "✅ Correct!" : `❌ Wrong! Correct Answer: ${problem.correct_option === 0 ? "True" : "False"}`}
        </p>
      )}
    </div>
  );
};

export default GamePlayTrueFalse;
