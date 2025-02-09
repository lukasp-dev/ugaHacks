import React from 'react';
import { Link } from 'react-router-dom';

const LandingScreen = () => {
  return (
    <div
      style={{
        height: 'calc(100vh - 121px)', // account for header/subheader if needed
        overflow: 'hidden',           // prevent scrolling
        marginTop: '-60px',           // shift content upward
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',     // center content vertically
        alignItems: 'center',         // center content horizontally
        textAlign: 'center',
      }}
    >
      <h2 style={{ marginBottom: '2rem', color: '#4B286D' }}>Welcome</h2>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/game/progress" style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              background: '#00549C',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            GAME
          </button>
        </Link>
        <Link to="/sheets" style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              background: '#4B286D',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ANALYSIS
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingScreen;
