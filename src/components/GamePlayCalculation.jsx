import React, { useState } from "react";

const GamePlayCalculation = ({ problem }) => {
  if (!problem) return <p>Loading...</p>;

  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const checkAnswer = () => Math.abs(parseFloat(userAnswer) - problem.answer) < 0.01;

  return (
    <div style={{ textAlign: "center", padding: "1rem", marginBottom: "1.5rem", backgroundColor: "#fff", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "8px", padding: "20px" }}>
      <h3 style={{ color: "#333" }}>{problem.question_text}</h3>
      <p style={{ fontStyle: "italic", color: "#555" }}>{problem.formula_hint || "No formula provided"}</p>

      <input
        type="number"
        step="any"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Enter answer"
        style={{
          padding: "10px",
          width: "80%",
          margin: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={() => setIsSubmitted(true)}
        style={{
          padding: "10px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>

      {isSubmitted && (
        <p style={{ marginTop: "10px", fontWeight: "bold", color: checkAnswer() ? "green" : "red", fontSize: "18px" }}>
          {checkAnswer() ? "✅ Correct!" : `❌ Wrong! Correct Answer: ${problem.answer}`}
        </p>
      )}
    </div>
  );
};

export default GamePlayCalculation;
