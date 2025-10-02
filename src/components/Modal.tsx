import React, { useState, useEffect } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: (name: string) => void;
  initialName?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, initialName = '' }) => {
  const [name, setName] = useState<string>(initialName);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setError('');
    }
  }, [isOpen, initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError('Por favor, ingresa tu nombre');
      return;
    }
    
    onClose(trimmedName);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>🎁 ¡Bienvenido a la Ruleta de Regalo! 🎁</h2>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">¿Cuál es tu nombre?</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu nombre aquí..."
              autoFocus
              className={error ? 'error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              🎯 ¡Comenzar a jugar!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
