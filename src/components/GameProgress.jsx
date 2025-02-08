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
      {/* Local CSS for hover effect only on the latest day */}
      <style>
        {`
          .platform {
            transition: transform 0.2s;
          }
          .platform.latest:hover {
            transform: scale(1.1);
          }
        `}
      </style>
      
      <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Game Progress</h2>
      
      {/* Game board container */}
      <div
        style={{
          margin: '0 auto',
          padding: '2rem',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '600px',
          background: '#fff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {daysToShow.map((day, index) => {
            const isLatest = index === daysToShow.length - 1;
            const platformStyle = {
              width: '120px',
              height: '40px',
              background: '#1E8449',
              border: '2px solid #D5F5E3',
              borderRadius: '6px',
              margin: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              color: '#fff',
              cursor: isLatest ? 'pointer' : 'default',
              position: 'relative'
            };

            if (isLatest) {
              return (
                <div key={day} style={{ position: 'relative' }} onClick={() => navigate('/game/play')}>
                  <div className="platform latest" style={platformStyle}>
                    Day {day}
                  </div>
                  {/* Man emoji positioned so his feet are on top of the latest day */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translate(-50%, 0)',
                      fontSize: '2rem'
                    }}
                  >
                    🕴️
                  </div>
                </div>
              );
            } else {
              return (
                <div key={day}>
                  <div className="platform" style={platformStyle}>
                    Day {day}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default GameProgress;
