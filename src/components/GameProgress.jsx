import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProblemsStart, fetchProblemsSuccess, fetchProblemsFailure } from "../store/problemSlice";
import { getRandomProblems } from "../api/problems";

const GameProgress = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentDate = useSelector((state) => state.date.value);

  const daysToShow = Array.from({ length: currentDate }, (_, i) => i + 1);

  const handleDayClick = async (day) => {
    try {
      dispatch(fetchProblemsStart());
      const problems = await getRandomProblems(day);
      console.log("📌 API 응답 데이터:", problems);
      dispatch(fetchProblemsSuccess(problems));
      navigate("/game/play");
    } catch (error) {
      dispatch(fetchProblemsFailure(error.message));
      console.error("❌ API 호출 실패:", error);
      alert("문제를 불러오지 못했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center", background: "#f7f7f7", minHeight: "90vh" }}>
      <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>Game Progress</h2>

      <div
        style={{
          margin: "0 auto",
          padding: "2rem",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "600px",
          background: "#fff",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          {daysToShow.map((day) => {
            const isDisabled = day < currentDate;
            const isLatest = day === currentDate;

            const platformStyle = {
              width: "120px",
              height: "40px",
              background: isDisabled ? "#ccc" : "#1E8449",
              border: isDisabled ? "2px solid #999" : "2px solid #D5F5E3",
              borderRadius: "6px",
              margin: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              color: isDisabled ? "#666" : "#fff",
              cursor: isDisabled ? "not-allowed" : "pointer",
              position: "relative",
            };

            return (
              <div key={day} style={{ position: "relative" }} onClick={() => isLatest && handleDayClick(day)}>
                <div className={`platform ${isLatest ? "latest" : ""}`} style={platformStyle}>
                  Day {day}
                </div>
                {isLatest && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "100%",
                      left: "50%",
                      transform: "translate(-50%, 0)",
                      fontSize: "2rem",
                    }}
                  >
                    🕴️
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameProgress;
