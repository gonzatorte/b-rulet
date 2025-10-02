import React, { useState, useEffect } from 'react';
import RuletaSVG from './components/RuletaSVG';
import Modal from './components/Modal';
import './App.css';

const App: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>('');
  const [isGameReady, setIsGameReady] = useState<boolean>(false);

  useEffect(() => {
    // Verificar si hay un query parameter con el nombre
    const urlParams = new URLSearchParams(window.location.search);
    const nameFromUrl = urlParams.get('nombre') || urlParams.get('name');
    
    if (nameFromUrl) {
      setUserName(nameFromUrl);
      setShowModal(false);
      setIsGameReady(true);
    }
  }, []);

  const handleModalClose = (name: string) => {
    setUserName(name);
    setShowModal(false);
    setIsGameReady(true);
  };

  return (
    <div className="App">
      {showModal && (
        <Modal 
          isOpen={showModal} 
          onClose={handleModalClose}
          initialName={userName}
        />
      )}
      
      {isGameReady && (
        <>
          <header className="App-header">
            <h1>🎁 Ruleta de Regalo 🎁</h1>
            <p>¡Hola <strong>{userName}</strong>! Gira la ruleta y descubre tu premio!</p>
          </header>
          <main>
            <RuletaSVG userName={userName} />
          </main>
        </>
      )}
    </div>
  );
};

export default App;