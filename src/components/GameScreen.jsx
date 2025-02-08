import React from 'react';
import { Outlet } from 'react-router-dom';

const GameScreen = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h2>Game</h2>
      <p>This is the game section. Choose an option from above.</p>
      <Outlet />
    </div>
  );
};

export default GameScreen;
