
import React, { useEffect, useState } from 'react';

interface ParticleProps {
  id: number;
}

const Particle: React.FC<ParticleProps> = ({ id }) => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const size = Math.random() * 5 + 2; // 2px to 7px
    const duration = Math.random() * 10 + 10; // 10s to 20s
    const delay = Math.random() * 5; // 0s to 5s
    
    setStyle({
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDuration: `${duration}s, ${duration / 2}s`, // separate for float and opacity
      animationDelay: `${delay}s`,
      animationName: `float, fadeInOut`, // Custom fadeInOut
    });
  }, [id]);

  return <div className="particle" style={style}></div>;
};


const ParticleBackground: React.FC<{ count?: number }> = ({ count = 30 }) => {
  // Add a specific keyframe for opacity to avoid issues with multiple animations on 'animation' shorthand
  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    try {
      styleSheet.insertRule(`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          25%, 75% { opacity: 0.7; }
          50% { opacity: 0.5; }
        }
      `, styleSheet.cssRules.length);
    } catch (e) {
      console.warn("Could not insert fadeInOut keyframe:", e);
    }
  }, []);
  
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <Particle key={i} id={i} />
      ))}
    </div>
  );
};

export default ParticleBackground;
