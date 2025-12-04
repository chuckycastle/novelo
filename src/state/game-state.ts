import type { GameState } from '../types';

/**
 * Create initial game state
 */
export function createInitialState(): GameState {
  return {
    phase: 'start',
    foundWords: new Set<string>(),
    startTime: null,
    endTime: null,
  };
}

/**
 * Transition to playing phase
 */
export function startGame(state: GameState): GameState {
  return {
    ...state,
    phase: 'playing',
    startTime: performance.now(),
    endTime: null,
  };
}

/**
 * Mark a word as found
 */
export function markWordFound(
  state: GameState,
  word: string,
  totalWords: number,
): GameState {
  const newFoundWords = new Set(state.foundWords);
  newFoundWords.add(word);

  const isComplete = newFoundWords.size === totalWords;

  return {
    ...state,
    foundWords: newFoundWords,
    phase: isComplete ? 'complete' : state.phase,
    endTime: isComplete ? performance.now() : state.endTime,
  };
}

/**
 * Reset game to start state
 */
export function resetGame(): GameState {
  return createInitialState();
}

/**
 * Get elapsed time in milliseconds
 */
export function getElapsedTime(state: GameState): number {
  if (state.startTime === null) return 0;

  const endTime = state.endTime ?? performance.now();
  return endTime - state.startTime;
}

/**
 * Check if the game is complete
 */
export function isGameComplete(state: GameState): boolean {
  return state.phase === 'complete';
}

/**
 * Check if the game is playing
 */
export function isGamePlaying(state: GameState): boolean {
  return state.phase === 'playing';
}
