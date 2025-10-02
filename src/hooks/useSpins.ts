import { useState, useEffect } from 'react';
import { findNamePrizeMapping } from '../utils/fuzzyMatch';

interface UseSpinsReturn {
  spinsLeft: number;
  totalSpins: number;
  spinsUsed: number;
  canSpin: boolean;
  useSpin: () => void;
  resetSpins: () => void;
}

const STORAGE_KEY = 'ruleta-spins-by-person';
const DEFAULT_SPINS = 1;

export const useSpins = (userName: string): UseSpinsReturn => {
  // Normalizar el nombre usando fuzzy matching para identificar personas
  const normalizeName = (name: string): string => {
    const cleanName = name.toLowerCase().trim();
    
    // Verificar si el nombre tiene un mapeo especial (como Nati/Natalia)
    const nameMapping = findNamePrizeMapping(cleanName);
    if (nameMapping) {
      // Si tiene mapeo especial, usar el primer nombre de la lista como clave única
      return nameMapping.names[0];
    }
    
    // Si no tiene mapeo especial, usar el nombre normalizado
    return cleanName;
  };

  const normalizedUserName = normalizeName(userName);
  console.log(`Normalizando nombre: "${userName}" → "${normalizedUserName}"`);

  // Función para cargar spins realizados del localStorage por persona
  const loadSpinsUsed = () => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    console.log('Cargando spins por persona del localStorage:', savedData);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        console.log('Datos de spins por persona parseados:', data);
        return data[normalizedUserName] || 0;
      } catch (error) {
        console.error('Error al cargar datos de tiradas por persona:', error);
        return 0;
      }
    }
    return 0;
  };

  const initialSpinsUsed = loadSpinsUsed();
  const [spinsUsed, setSpinsUsed] = useState<number>(initialSpinsUsed);
  const totalSpins = DEFAULT_SPINS;
  const spinsLeft = totalSpins - spinsUsed;

  // Guardar spins realizados en localStorage por persona cuando cambien
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    let allSpinsData: Record<string, any> = {};
    
    if (savedData) {
      try {
        allSpinsData = JSON.parse(savedData);
      } catch (error) {
        console.error('Error al parsear datos existentes:', error);
        allSpinsData = {};
      }
    }
    
    // Actualizar solo los datos de esta persona
    allSpinsData[normalizedUserName] = spinsUsed;
    allSpinsData.lastUpdated = new Date().toISOString();
    
    console.log('Guardando spins por persona en localStorage:', allSpinsData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allSpinsData));
  }, [spinsUsed, normalizedUserName]);

  const useSpin = (): void => {
    if (spinsLeft > 0) {
      setSpinsUsed(prev => prev + 1);
    }
  };

  const resetSpins = (): void => {
    setSpinsUsed(0);
    
    // Solo resetear los spins de esta persona, mantener los de otras personas
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const allSpinsData: Record<string, any> = JSON.parse(savedData);
        delete allSpinsData[normalizedUserName];
        allSpinsData.lastUpdated = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allSpinsData));
      } catch (error) {
        console.error('Error al resetear spins de la persona:', error);
      }
    }
  };

  const canSpin = spinsLeft > 0;

  return {
    spinsLeft,
    totalSpins,
    spinsUsed,
    canSpin,
    useSpin,
    resetSpins
  };
};
