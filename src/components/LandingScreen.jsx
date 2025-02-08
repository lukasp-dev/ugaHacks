import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingScreen = () => {
  const navigate = useNavigate();
  const buttonStyle = {
    padding: '1rem 2rem',
    margin: '1rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <button
        style={{ ...buttonStyle, backgroundColor: '#D5F5E3', color: '#1E8449' }}
        onClick={() => navigate('/sheets')}
      >
        Analysis
      </button>
      <button
        style={{ ...buttonStyle, backgroundColor: '#FADBD8', color: '#C0392B' }}
        onClick={() => navigate('/game/progress')}
      >
        Game
      </button>
    </div>
  );
};

export default LandingScreen;
