import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingScreen.module.css';

const LandingScreen = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Understanding Financial Statements</h2>
      <p
        className={styles.description}
        style={{
          whiteSpace: 'nowrap',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        Explore interactive visualizations and engaging games to enhance your financial literacy 💨
      </p>
      <div className={styles.buttonGroup} style={{ marginTop: '2rem' }}>
        <Link to="/game/progress">
          <button className={styles.gameButton}>🎮 Learning Game</button>
        </Link>
        <Link to="/sheets">
          <button className={styles.analysisButton}>📊 Graph Analysis</button>
        </Link>
      </div>
      {/* New About Button */}
      <div className={styles.aboutContainer} style={{ marginTop: '1.5rem' }}>
        <Link to="/about">
          <button className={styles.aboutButton}>About</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingScreen;
