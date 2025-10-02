import Fuse from 'fuse.js';

// Configuración de nombres y sus premios correspondientes (premios existentes en la ruleta)
export interface NamePrizeMapping {
  names: string[];
  prizeIdx: number;
}

export const namePrizeMappings: NamePrizeMapping[] = [
  {
    names: ['nati', 'natalia', 'nat', 'naty'],
    prizeIdx: 5
  },
  {
    names: ['damian', 'dami', 'damian', 'dam'],
    prizeIdx: 13
  },
  {
    names: ['pau', 'pauli', 'paula'],
    prizeIdx: 9
  },
];

// Configuración de Fuse.js para búsqueda fuzzy
const fuseOptions = {
  keys: ['names'],
  threshold: 0.3, // Umbral de similitud (0 = exacto, 1 = muy diferente)
  includeScore: true,
  findAllMatches: true
};

// Crear instancia de Fuse
const fuse = new Fuse(namePrizeMappings, fuseOptions);

/**
 * Busca si el nombre del usuario tiene un premio determinado
 * @param userName - Nombre del usuario a verificar
 * @returns El mapeo de premio si hay coincidencia, null si no
 */
export const findNamePrizeMapping = (userName: string): NamePrizeMapping | null => {
  if (!userName || userName.trim() === '') {
    return null;
  }

  const cleanName = userName.toLowerCase().trim();
  
  // Buscar coincidencias fuzzy
  const results = fuse.search(cleanName);
  
  if (results.length > 0 && results[0].score !== undefined && results[0].score <= 0.3) {
    return results[0].item;
  }

  // También verificar coincidencias exactas en los nombres
  for (const mapping of namePrizeMappings) {
    for (const name of mapping.names) {
      if (cleanName === name.toLowerCase() || 
          cleanName.includes(name.toLowerCase()) || 
          name.toLowerCase().includes(cleanName)) {
        return mapping;
      }
    }
  }

  return null;
};

/**
 * Verifica si un nombre tiene un premio determinado
 * @param userName - Nombre del usuario
 * @returns true si tiene premio determinado, false si no
 */
export const hasNamePrizeMapping = (userName: string): boolean => {
  return findNamePrizeMapping(userName) !== null;
};

/**
 * Obtiene el premio determinado para un usuario
 * @param userName - Nombre del usuario
 * @returns El premio determinado o null
 */
export const getNamePrize = (userName: string) => {
  const mapping = findNamePrizeMapping(userName);
  return mapping ? mapping.prizeIdx : null;
};
