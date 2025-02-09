import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const GameScreen = () => {
  const location = useLocation();
  // Do not render the top UI of GameScreen when the current path is /game/play
  const isGamePlay = location.pathname === '/game/play';

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      {!isGamePlay && (
        <>
          <h2>Game</h2>
          <p>This is the game section. Choose an option from above.</p>
        </>
      )}
      <Outlet />
    </div>
  );
};

export default GameScreen;
