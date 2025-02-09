// GameEnd.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Helper function to format answers (e.g., convert boolean values to "True"/"False")
const formatAnswer = (answer) => {
  if (typeof answer === "boolean") {
    return answer ? "True" : "False";
  }
  return answer;
};

const GameEnd = ({ results }) => {
  const navigate = useNavigate();

  // Calculate the number of correct answers
  const correctCount = results.filter((r) => r.isCorrect).length;
  // Filter out incorrect results
  const wrongResults = results.filter((r) => !r.isCorrect);

  // State to track which wrong question is being reviewed (null if none)
  const [reviewIndex, setReviewIndex] = useState(null);

  // When "End Quiz" is clicked, navigate to the Game Progress page
  const onEndQuiz = () => {
    navigate("/game/progress");
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "800px",
        margin: "80px auto",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h2>Game Over!</h2>
      <p>
        You answered {correctCount} out of {results.length} questions correctly.
      </p>
      {wrongResults.length > 0 ? (
        <div>
          <h3>Review Incorrect Questions:</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {wrongResults.map((r, idx) => (
              <li key={r.id} style={{ marginBottom: "10px" }}>
                <button
                  onClick={() => setReviewIndex(idx)}
                  style={{
                    padding: "8px 12px",
                    fontSize: "16px",
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                  }}
                >
                  Question {r.id}
                </button>
              </li>
            ))}
          </ul>
          {reviewIndex !== null && (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#fafafa",
              }}
            >
              <h4>Question {wrongResults[reviewIndex].id}</h4>
              <p>
                <strong>Question:</strong> {wrongResults[reviewIndex].questionText}
              </p>
              <p>
                <strong>Your Answer:</strong>{" "}
                {formatAnswer(wrongResults[reviewIndex].userAnswer)}
              </p>
              <p>
                <strong>Correct Answer:</strong>{" "}
                {formatAnswer(wrongResults[reviewIndex].correctAnswer)}
              </p>
              {wrongResults[reviewIndex].explanation && (
                <p style={{ fontStyle: "italic" }}>
                  {wrongResults[reviewIndex].explanation}
                </p>
              )}
              {wrongResults[reviewIndex].calculation && (
                <p>
                  <strong>Calculation:</strong> {wrongResults[reviewIndex].calculation}
                </p>
              )}
              {wrongResults[reviewIndex].formula && (
                <p>
                  <strong>Formula:</strong> {wrongResults[reviewIndex].formula}
                </p>
              )}
              <button
                onClick={() => setReviewIndex(null)}
                style={{
                  padding: "8px 12px",
                  fontSize: "16px",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#2196f3",
                  color: "#fff",
                  marginTop: "10px",
                }}
              >
                Close Review
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>All answers are correct. Great job!</p>
      )}
      <button
        onClick={onEndQuiz}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "20px",
          border: "none",
          borderRadius: "4px",
          backgroundColor: "#4caf50",
          color: "#fff",
        }}
      >
        End Quiz
      </button>
    </div>
  );
};

export default GameEnd;
