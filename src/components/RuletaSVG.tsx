import React, { useState, useRef } from 'react';
import { getNamePrize } from '../utils/fuzzyMatch';
import { useSpins } from '../hooks/useSpins';
import ConfettiEffect from './ConfettiEffect';
import './RuletaSVG.css';

interface RuletaSVGProps {
  userName: string;
}

const RuletaSVG: React.FC<RuletaSVGProps> = ({ userName }) => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [rotation, setRotation] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const ruletaRef = useRef<SVGSVGElement>(null);
  const { spinsLeft, totalSpins, spinsUsed, canSpin, useSpin } = useSpins(userName);

  // Premios disponibles en la ruleta
  const premios: string[] = [
    '🍕 Pipi',
    '☕ Un café',
    '🍰 Postres deliciosos',
    '🛶 Paseo en barco',
    '💎 Joyas',
    '🪂 Paseo en parapente', // 5
    '🛩️ Paseo en parapente',
    '🎤 Concierto de Miranda',
    '🪂 Salto en paracaídas',
    '🔥 Noche de pasión', // 9
    '🪂 Paseo en globo', // 10
    '🏔️✈️ Viaje a Berlín',
    '✈️🇪🇸 Viaje a Madrid',
    '💖 Beso en el cachete', // 13
    '💋 Beso en la boca', // 14
  ];

  // Colores para los segmentos
  const colors: string[] = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8',
    '#e17055', '#00b894', '#0984e3', '#fdcb6e', '#a29bfe', '#fd79a8', '#e84393'
  ];

  const girarRuleta = (): void => {
    if (isSpinning || !canSpin) return;

    // Usar una tirada
    useSpin();
    setIsSpinning(true);
    setResult('');
    
    // Verificar si el usuario tiene un premio determinado
    const determinedPrizeIdx = getNamePrize(userName);
    
    if (determinedPrizeIdx) {
      // Si tiene premio determinado, calcular la posición exacta
      const prizeIndex = determinedPrizeIdx % premios.length;
      const prize = premios[prizeIndex];
      // Calcular el ángulo exacto para que pare en el premio correcto
      const segmentAngle = 360 / premios.length;
      const targetAngle = prizeIndex * segmentAngle;
      
      // Agregar múltiples vueltas para que pare en la posición correcta
      const spins = Math.floor(Math.random() * 5) + 3; // Entre 3 y 7 vueltas completas
      const totalRotation = rotation + (spins * 360) + (360 - targetAngle);
      
      setRotation(totalRotation);
      
      // Mostrar el premio determinado después de la animación
      setTimeout((): void => {
        setResult(prize);
        setIsSpinning(false);
        setShowConfetti(true);
      }, 3000);
    } else {
      // Lógica normal de la ruleta
      const spins: number = Math.floor(Math.random() * 5) + 3; // Entre 3 y 7 vueltas completas
      const randomAngle: number = Math.random() * 360;
      const totalRotation: number = rotation + (spins * 360) + randomAngle;
      
      setRotation(totalRotation);
      
      // Calcular el premio basado en la posición final
      const segmentAngle: number = 360 / premios.length;
      const normalizedAngle: number = (360 - (totalRotation % 360)) % 360;
      const segmentIndex: number = Math.floor(normalizedAngle / segmentAngle);
      const premioGanado: string = premios[segmentIndex];
      
      // Mostrar resultado después de la animación
      setTimeout((): void => {
        setResult(premioGanado);
        setIsSpinning(false);
        setShowConfetti(true);
      }, 3000); // Duración de la animación
    }
  };

  const handleConfettiComplete = (): void => {
    setShowConfetti(false);
  };

  // Función para crear los segmentos SVG
  const createSegment = (index: number) => {
    const segmentAngle = 360 / premios.length;
    const startAngle = index * segmentAngle - 90; // -90 para empezar desde arriba
    const endAngle = startAngle + segmentAngle;
    
    // Convertir ángulos a radianes
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    // Radio de la ruleta (500px de diámetro = 250px de radio)
    const radius = 220;
    const innerRadius = 50; // Radio del círculo central
    
    // Calcular puntos para el arco
    const x1 = 250 + radius * Math.cos(startAngleRad);
    const y1 = 250 + radius * Math.sin(startAngleRad);
    const x2 = 250 + radius * Math.cos(endAngleRad);
    const y2 = 250 + radius * Math.sin(endAngleRad);
    
    const x3 = 250 + innerRadius * Math.cos(endAngleRad);
    const y3 = 250 + innerRadius * Math.sin(endAngleRad);
    const x4 = 250 + innerRadius * Math.cos(startAngleRad);
    const y4 = 250 + innerRadius * Math.sin(startAngleRad);
    
    // Determinar si el arco es mayor que 180 grados
    const largeArcFlag = segmentAngle > 180 ? 1 : 0;
    
    // Crear el path del segmento
    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');
    
    // Posición del texto
    const textAngle = startAngle + segmentAngle / 2;
    const textAngleRad = (textAngle * Math.PI) / 180;
    const textRadius = 150; // Radio donde se posiciona el texto
    const textX = 250 + textRadius * Math.cos(textAngleRad);
    const textY = 250 + textRadius * Math.sin(textAngleRad);
    
    return (
      <g key={index}>
        <path
          d={pathData}
          fill={colors[index % colors.length]}
          stroke="#fff"
          strokeWidth="2"
          className="segment-path"
        />
        <text
          x={textX}
          y={textY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="segment-text"
          transform={`rotate(${textAngle} ${textX} ${textY})`}
        >
          {premios[index]}
        </text>
      </g>
    );
  };

  const size = 500;

  return (
    <div className="ruleta-container">
      {/* Efecto de confeti con sonido */}
      <ConfettiEffect 
        isActive={showConfetti} 
        onComplete={handleConfettiComplete}
      />
      
      <div className="ruleta-wrapper">
        <svg
          ref={ruletaRef}
          width={size}
          height={size}
          viewBox="0 0 500 500"
          className={`ruleta-svg ${isSpinning ? 'spinning' : ''}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Definir gradientes */}
          <defs>
            <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#ffed4e" />
            </radialGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.3)"/>
            </filter>
          </defs>
          
          {/* Crear segmentos */}
          {premios.map((_, index) => createSegment(index))}
          
          {/* Círculo central */}
          <circle
            cx="250"
            cy="250"
            r="50"
            fill="url(#centerGradient)"
            stroke="#fff"
            strokeWidth="4"
            filter="url(#shadow)"
          />
        </svg>
        
        {/* Puntero fijo - separado del SVG que rota */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 500 500"
          className="pointer-container"
        >
          <defs>
            <filter id="pointerShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.3)"/>
            </filter>
          </defs>
          <polygon
            points="250,25 260,50 240,50"
            fill="#ff4757"
            stroke="#fff"
            strokeWidth="2"
            filter="url(#pointerShadow)"
            className="pointer"
          />
        </svg>
      </div>
      
      <div className="controls-section">
        {/* Contador de tiradas */}
        <div className="spins-counter">
          <div className="spins-info">
            <div className="spins-left">
              <span className="spins-number">{spinsLeft}</span>
              <span className="spins-label">Tiradas disponibles</span>
            </div>
            <div className="spins-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(spinsUsed / totalSpins) * 100}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {spinsUsed} de {totalSpins} tiradas usadas
              </span>
            </div>
          </div>
        </div>
        
        <button 
          className={`girar-btn ${isSpinning ? 'disabled' : ''} ${!canSpin ? 'no-spins' : ''}`}
          onClick={girarRuleta}
          disabled={isSpinning || !canSpin}
        >
          {isSpinning ? 'Girando...' : !canSpin ? '❌ Sin tiradas' : '🎯 ¡GIRAR!'}
        </button>
      </div>
      
      {result && (
        <div className="resultado">
          <h2>🎉 ¡Felicidades {userName}! 🎉</h2>
          <p>Has ganado: <strong>{result}</strong></p>
        </div>
      )}
    </div>
  );
};

export default RuletaSVG;
