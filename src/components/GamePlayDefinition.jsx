import React, { useState } from 'react';

const GamePlayDefinition = ({ problem }) => {
  if (!problem) return <p>Loading...</p>;

  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOptionClick = (optionIndex) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    setIsSubmitted(true);
  };

  return (
    <div style={{ textAlign: "center", padding: "1rem", marginBottom: "1.5rem", backgroundColor: "#fff", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "8px", padding: "20px" }}>
      <h3 style={{ color: "#333" }}>{problem.question_text}</h3>
      <div>
        {problem.options.map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionClick(index)}
            style={{
              cursor: 'pointer',
              padding: '15px 20px',
              margin: '10px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
              transition: 'all 0.3s',
              display: 'inline-block',
              backgroundColor: selectedOption === index ? (index === problem.correct_option ? "#4caf50" : "#f44336") : "#ddd",
              color: selectedOption === index ? "#fff" : "#000",
            }}
          >
            {option}
          </div>
        ))}
      </div>
      {isSubmitted && (
        <p style={{ color: selectedOption === problem.correct_option ? "green" : "red", fontSize: "18px", fontWeight: "bold" }}>
          {selectedOption === problem.correct_option ? "✅ Correct!" : `❌ Incorrect! Answer: ${problem.options[problem.correct_option]}`}
        </p>
      )}
    </div>
  );
};

export default GamePlayDefinition;
