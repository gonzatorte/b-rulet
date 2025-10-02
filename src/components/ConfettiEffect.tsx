import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import './ConfettiEffect.css';

interface ConfettiEffectProps {
  isActive: boolean;
  onComplete?: () => void;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ isActive, onComplete }) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isActive) {
      // Detener el confeti después de 8 segundos
      const timer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="confetti-container">
      {/* Capa principal de confeti */}
      <Confetti
        width={windowDimensions.width}
        height={windowDimensions.height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.3}
        initialVelocityY={25}
        initialVelocityX={0}
        wind={0.05}
        colors={[
          '#ff6b6b',
          '#4ecdc4',
          '#45b7d1',
          '#f9ca24',
          '#6c5ce7',
          '#fd79a8',
          '#00b894',
          '#fdcb6e',
          '#e17055',
          '#74b9ff',
          '#ffd700',
          '#ff1493',
          '#00ff00',
          '#ff4500',
          '#8a2be2'
        ]}
        confettiSource={{
          x: windowDimensions.width / 2,
          y: windowDimensions.height / 2,
          w: 20,
          h: 20
        }}
      />
      
      {/* Capa secundaria de confeti hacia la izquierda */}
      <Confetti
        width={windowDimensions.width}
        height={windowDimensions.height}
        recycle={false}
        numberOfPieces={300}
        gravity={0.25}
        initialVelocityY={20}
        initialVelocityX={-20}
        wind={-0.1}
        colors={[
          '#ff6b6b',
          '#4ecdc4',
          '#45b7d1',
          '#f9ca24',
          '#6c5ce7',
          '#fd79a8',
          '#00b894',
          '#fdcb6e',
          '#e17055',
          '#74b9ff'
        ]}
        confettiSource={{
          x: windowDimensions.width / 2,
          y: windowDimensions.height / 2,
          w: 15,
          h: 15
        }}
      />
      
      {/* Capa terciaria de confeti hacia la derecha */}
      <Confetti
        width={windowDimensions.width}
        height={windowDimensions.height}
        recycle={false}
        numberOfPieces={300}
        gravity={0.25}
        initialVelocityY={20}
        initialVelocityX={20}
        wind={0.1}
        colors={[
          '#ff6b6b',
          '#4ecdc4',
          '#45b7d1',
          '#f9ca24',
          '#6c5ce7',
          '#fd79a8',
          '#00b894',
          '#fdcb6e',
          '#e17055',
          '#74b9ff'
        ]}
        confettiSource={{
          x: windowDimensions.width / 2,
          y: windowDimensions.height / 2,
          w: 15,
          h: 15
        }}
      />
    </div>
  );
};

export default ConfettiEffect;
