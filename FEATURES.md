# 🎁 Ruleta de Regalo - Funcionalidades

## ✨ Nuevas Características Implementadas

### 1. 🎯 Modal de Bienvenida
- **Modal automático**: Se muestra al cargar la aplicación pidiendo el nombre del usuario
- **Validación**: No permite continuar sin ingresar un nombre
- **Diseño atractivo**: Gradientes, animaciones y efectos visuales
- **Responsive**: Se adapta a diferentes tamaños de pantalla

### 2. 🔗 Soporte para Query Parameters
- **Detección automática**: Si hay un parámetro `nombre` o `name` en la URL, se omite el modal
- **Ejemplos de uso**:
  - `http://localhost:3000?nombre=Juan`
  - `http://localhost:3000?name=Maria`
- **Personalización**: El nombre se muestra en toda la aplicación

### 3. 🎯 Determinación de Resultado por Nombre
- **Nombres configurados**:
  - **Nati/Natalia/Nat/Naty** → 🪂 Paseo en parapente
  - **Damian/Dami/Dam** → 💖 Beso en la mejilla
- **Lógica inteligente**: El nombre determina qué premio de la ruleta va a ganar
- **Animación realista**: La ruleta gira normalmente pero para en el premio correcto

### 4. 🔍 Comparación Fuzzy Inteligente
- **Librería Fuse.js**: Comparación aproximada de strings
- **Umbral configurable**: 0.3 (ajustable para mayor/menor precisión)
- **Múltiples variantes**: Reconoce diferentes formas de escribir el mismo nombre
- **Case insensitive**: No importa mayúsculas o minúsculas

### 5. 🎨 Experiencia Transparente
- **Sin indicadores**: No se muestra que el resultado está predeterminado
- **Animación natural**: La ruleta gira y para en la posición correcta
- **Resultado consistente**: Mismo mensaje para todos los usuarios

### 6. 🎯 Sistema de Tiradas por Persona con Fuzzy Matching
- **Contador individual**: Cada persona tiene su propio contador de tiradas
- **Identificación fuzzy**: Se identifica a la persona usando comparación fuzzy de nombres
- **Normalización inteligente**: "Nati" y "Natalia" se identifican como la misma persona
- **Persistencia independiente**: Cada persona mantiene sus tiradas en localStorage
- **Indicador visual**: Muestra tiradas disponibles y progreso por persona
- **Bloqueo automático**: No permite girar cuando no hay tiradas disponibles
- **Barra de progreso**: Visualización del uso de tiradas por persona

### 7. 🎉 Efecto de Confeti
- **Animación celebratoria**: Confeti que aparece al ganar un premio
- **Origen central**: El confeti sale desde el centro de la pantalla
- **Múltiples capas**: 3 capas de confeti para mayor impacto visual
- **Expansión radial**: Se expande desde el centro hacia todas las direcciones
- **Posicionamiento sticky**: Se mantiene fijo en toda la pantalla
- **Duración extendida**: Se detiene después de 8 segundos
- **Colores vibrantes**: 15 colores diferentes para mayor impacto visual
- **Efecto de brillo**: Gradiente radial para hacer el confeti más notorio
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Rendimiento optimizado**: Se desactiva automáticamente para evitar problemas de rendimiento

## 🚀 Cómo Usar

### Uso Normal
1. Abrir la aplicación
2. Ingresar nombre en el modal
3. Verificar tiradas disponibles en el contador
4. Girar la ruleta (si hay tiradas disponibles)
5. ¡Disfrutar del premio y el confeti! 🎉

### Uso con Query Parameter
1. Acceder a: `http://localhost:3000?nombre=TuNombre`
2. La aplicación detectará automáticamente el nombre
3. Verificar tiradas disponibles en el contador
4. Girar la ruleta (si hay tiradas disponibles)
5. ¡Disfrutar del premio y el confeti! 🎉

### Resultados Determinados por Nombre
- Si el nombre coincide con los nombres configurados, se garantiza el premio correspondiente
- La ruleta gira normalmente pero para en la posición correcta del premio
- No hay indicadores visuales, la experiencia es transparente

## ⚙️ Configuración

### Agregar Nuevos Mapeos de Nombre-Premio
Editar el archivo `src/utils/fuzzyMatch.ts`:

```typescript
export const namePrizeMappings: NamePrizeMapping[] = [
  {
    names: ['nuevo', 'nombre', 'variantes'],
    prize: '🎁 Nuevo Premio' // Debe existir en la lista de premios de la ruleta
  }
];
```

**Importante**: El premio debe existir exactamente en la lista de premios de la ruleta para que funcione correctamente.

### Normalización Fuzzy de Personas
El sistema usa fuzzy matching para identificar a la misma persona con diferentes variaciones de nombre:
- **Nati/Natalia/Nat/Naty** → Se identifican como la misma persona
- **Damian/Dami/Dam** → Se identifican como la misma persona  
- **Pau/Pauli/Paula** → Se identifican como la misma persona

La normalización se basa en los mapeos definidos en `src/utils/fuzzyMatch.ts`.

### Configurar Tiradas Disponibles
En `src/hooks/useSpins.ts`, modificar la constante `DEFAULT_SPINS`:
```typescript
const DEFAULT_SPINS = 1; // Cambiar por el número deseado
```

### Ajustar Sensibilidad Fuzzy
En `src/utils/fuzzyMatch.ts`, modificar el `threshold`:
- `0.0` = Coincidencia exacta
- `0.3` = Coincidencia aproximada (recomendado)
- `1.0` = Coincidencia muy flexible

## 🎯 Casos de Prueba

### Nombres que determinan resultado específico:
- **Nati**: ✅ Siempre gana "🪂 Paseo en parapente"
- **Natalia**: ✅ Siempre gana "🪂 Paseo en parapente"  
- **nati**: ✅ Siempre gana "🪂 Paseo en parapente"
- **NATI**: ✅ Siempre gana "🪂 Paseo en parapente"
- **Naty**: ✅ Siempre gana "🪂 Paseo en parapente"
- **Damian**: ✅ Siempre gana "💖 Beso en la mejilla"
- **Dami**: ✅ Siempre gana "💖 Beso en la mejilla"
- **dami**: ✅ Siempre gana "💖 Beso en la mejilla"

### Nombres normales:
- **Juan**: ❌ Premio aleatorio de la ruleta
- **Maria**: ❌ Premio aleatorio de la ruleta
- **Pedro**: ❌ Premio aleatorio de la ruleta

### Sistema de Tiradas por Persona con Fuzzy Matching:
- **Juan - Primera visita**: ✅ 1 tirada disponible
- **Juan - Después de girar**: ❌ 0 tiradas disponibles, botón bloqueado
- **María - Primera visita**: ✅ 1 tirada disponible (independiente de Juan)
- **Juan - Recarga de página**: ❌ Mantiene 0 tiradas (persistencia individual)
- **María - Después de girar**: ❌ 0 tiradas disponibles (independiente de Juan)
- **Nati - Primera visita**: ✅ 1 tirada disponible
- **Natalia - Después de girar**: ❌ 0 tiradas disponibles (misma persona que Nati)
- **Identificación fuzzy**: "Nati", "Natalia", "Nat", "Naty" → misma persona

## 🛠️ Tecnologías Utilizadas

- **React 18** con TypeScript
- **Fuse.js** para comparación fuzzy
- **react-confetti** para efectos de confeti
- **CSS3** con gradientes y animaciones
- **Vite** como bundler
- **ESLint** para linting

## 📱 Responsive Design

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)  
- ✅ Mobile (320px - 767px)
- ✅ Modal adaptativo
- ✅ Ruleta escalable
- ✅ Botones táctiles optimizados
