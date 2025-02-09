import React, { useState, useEffect } from "react";

const GamePlay = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [userInput, setUserInput] = useState(""); // For calculation questions

  useEffect(() => {
    fetch("http://localhost:8080/api/problems/random?type=1")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  const handleAnswerClick = (optionIndex) => {
    if (questions[currentIndex].category === "calculation") {
      return;
    }
    const isAnswerCorrect = optionIndex === questions[currentIndex].correct_option;
    setIsCorrect(isAnswerCorrect);
    setSelectedAnswer(optionIndex);
  };

  const handleSubmitCalculation = () => {
    if (questions[currentIndex].category !== "calculation") return;
    const correctAnswer = questions[currentIndex].answer;
    const isAnswerCorrect = Math.abs(parseFloat(userInput) - correctAnswer) < 0.01;
    setIsCorrect(isAnswerCorrect);
    setSelectedAnswer(true); // Mark as answered
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setUserInput("");
    } else {
      alert("🎉 모든 문제를 풀었습니다!");
    }
  };

  if (questions.length === 0) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      {/* Progress Bar */}
      <div className="relative w-full bg-gray-200 h-4 rounded-full mb-4">
        <div
          className="absolute bg-blue-500 h-4 rounded-full"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question */}
      <h2 className="text-lg font-semibold mb-4">{currentQuestion.question_text}</h2>

      {/* Answer Options for definition/judgement */}
      {currentQuestion.options && currentQuestion.category !== "calculation" ? (
        <div className="flex flex-col gap-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`p-3 rounded-md border ${
                selectedAnswer === index
                  ? isCorrect
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-gray-100"
              }`}
              onClick={() => handleAnswerClick(index)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        // Answer input for calculation problems
        <div className="text-center">
          <p className="text-gray-500 mb-2">{currentQuestion.formula_hint || "No formula provided"}</p>
          <input
            type="number"
            step="any"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your answer"
            className="p-2 border rounded w-full mb-3"
          />
          <button
            onClick={handleSubmitCalculation}
            className="p-2 bg-blue-500 text-white rounded w-full"
            disabled={selectedAnswer !== null}
          >
            제출
          </button>
        </div>
      )}

      {/* Explanation when incorrect */}
      {selectedAnswer !== null && (
        <div className={`mt-4 text-lg font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
          {isCorrect ? "✅ 정답입니다!" : `❌ 틀렸습니다.`}
          {!isCorrect && (
            <p className="text-gray-600 mt-2">{currentQuestion.explanation || "No explanation provided."}</p>
          )}
        </div>
      )}

      {/* Next Button */}
      <button
        className="mt-6 p-3 bg-blue-500 text-white w-full rounded-md"
        onClick={handleNext}
        disabled={selectedAnswer === null}
      >
        {currentIndex < questions.length - 1 ? "다음 문제" : "완료"}
      </button>
    </div>
  );
};

export default GamePlay;
