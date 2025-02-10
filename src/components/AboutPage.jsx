import React from 'react';
import styles from './AboutPage.module.css';

// Helper function to transition between two colors
function interpolateColor(color1, color2, factor) {
  // Extract integer components of hex number
  const c1 = {
    r: parseInt(color1.slice(1, 3), 16),
    g: parseInt(color1.slice(3, 5), 16),
    b: parseInt(color1.slice(5, 7), 16),
  };
  const c2 = {
    r: parseInt(color2.slice(1, 3), 16),
    g: parseInt(color2.slice(3, 5), 16),
    b: parseInt(color2.slice(5, 7), 16),
  };

  // Interpolate between numbers
  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));

  // Convert back to hex
  const toHex = (n) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Color each letter individually
const GradientText = ({ text, startColor, endColor }) => {

  return (
    <>
      {text.split('').map((char, index, arr) => {
        if (char === ' ') {
          return ' ';
        }
        // Calculate a factor between 0 and 1 based on the character's position
        const factor = arr.length > 1 ? index / (arr.length - 1) : 0;
        const color = interpolateColor(startColor, endColor, factor);
        return (
          <span key={index} style={{ color }}>
            {char}
          </span>
        );
      })}
    </>
  );
};

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h2>About Us !!</h2>
          <p>
            Our project, pioneered by{' '}
            <GradientText text="Jewook Park" startColor="#7879FF" endColor="#A020F0" />,{' '}
            <GradientText text="Jiyoon Shin" startColor="#ff9ff3" endColor="#f368e0" />,{' '}
            <GradientText text="Yoonju Jung" startColor="#74b9ff" endColor="#0984e3" />, and{' '}
            <GradientText text="Matthew Lim" startColor="#55efc4" endColor="#00b894" />, started as a challenge posted by{' '}
            <span className={styles.truist}>Truist Financial</span> during the exciting{' '}
            <span className={styles.hackathon}>UGAHacks X</span> hackathon.
            We set out to create a user-friendly, gamified tool that makes exploring key financial items -{' '}
            <span className={styles.statement}>balance sheets </span> &amp;{' '}
            <span className={styles.statement}>income statements</span> - an easy learning experience!
          </p>
          <p>Check out some of its awesome features:</p>
          <ul>
            <li>
              <strong>Interactive Analysis Tool:</strong> Easily upload CSV, Excel, or image files to transform raw data into comprehensive and interactive visual charts and graphs. With a simple drag &amp; drop interface, you can quickly compare metrics and spot trends.
            </li>
            <li>
              <strong>Guided Learning Game:</strong> Perfect for beginners and master financers alike, this interactive game breaks down the basics of financial analysis through engaging challenges, turning complex concepts into a playful learning experience.
            </li>
          </ul>
          <p>
            Together, these tools empower you to master financial insights effortlessly—transforming complex data into easy-to-grasp knowledge!
          </p>
        </div>
        <div className={styles.image}>
          <span role="img" aria-label="Dancing Man" className={styles.dancingEmoji}>🕺</span>
        </div>
      </div>
      <div className={styles.creatorInfo}>
        <p>
          <strong>Jewook Park</strong> is a Computer Science major at Georgia Tech |{' '}
          <strong>Matthew Lim</strong> is a Computer Science major at Georgia Tech |{' '}
          <strong>Jiyoon Shin</strong> is a Statistics and Urban Planning &amp; Engineering double major at UGA |{' '}
          <strong>Yoonju Jung</strong> is a Statistics major at UGA
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
