import React from 'react';
import { useNavigate } from 'react-router-dom';

const GameProgress = () => {
  const navigate = useNavigate();
  const num_days = 8; // Example: change this value as needed

  // Compute which days to show (if num_days > 5, show only the last 5 days)
  const startDay = num_days <= 5 ? 1 : num_days - 4;
  const daysToShow = [];
  for (let i = startDay; i <= num_days; i++) {
    daysToShow.push(i);
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center', background: '#f7f7f7', minHeight: '90vh' }}>
      {/* Define keyframes for animated background */}
      <style>
        {`
          @keyframes animatedBackground {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animated-box {
            background: linear-gradient(270deg, #ff7e5f, #feb47b, #ff7e5f);
            background-size: 600% 600%;
            animation: animatedBackground 8s ease infinite;
          }
          .platform:hover {
            transform: scale(1.05);
            transition: transform 0.2s;
          }
        `}
      </style>
      
      {/* Game board container */}
      <div
        className="animated-box"
        style={{
          position: 'relative',
          margin: '0 auto',
          padding: '2rem',
          borderRadius: '12px',
          width: '320px',
          background: '#fff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      >
        {/* Larger stick figure icon positioned above the platforms */}
        <div
          style={{
            position: 'absolute',
            top: '-90px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <div style={{ fontSize: '5rem' }}>🕴️</div>
        </div>
        {/* Platforms stack */}
        <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column-reverse', alignItems: 'center' }}>
          {daysToShow.map((day, index) => {
            const isTop = index === daysToShow.length - 1;
            const platformDiv = (
              <div
                key={day}
                className="platform"
                style={{
                  width: '260px',
                  height: '70px',
                  background: '#1E8449',
                  border: '3px solid #D5F5E3',
                  borderRadius: '8px',
                  margin: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  cursor: isTop ? 'pointer' : 'default'
                }}
              >
                Day {day}
              </div>
            );
            return isTop ? (
              <div key={day} onClick={() => navigate('/game/play')}>
                {platformDiv}
              </div>
            ) : (
              platformDiv
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameProgress;
