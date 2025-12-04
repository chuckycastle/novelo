// Position in the grid
export interface Position {
  readonly row: number;
  readonly col: number;
}

// Game phases
export type GamePhase = 'start' | 'playing' | 'complete';

// Main game state
export interface GameState {
  readonly phase: GamePhase;
  readonly foundWords: ReadonlySet<string>;
  readonly startTime: number | null;
  readonly endTime: number | null;
}

// Selection state for tracking user input
export interface SelectionState {
  readonly isActive: boolean;
  readonly startPosition: Position | null;
  readonly currentPath: readonly Position[];
  readonly mode: 'tap' | 'drag';
}

// Direction for line validation
export interface Direction {
  readonly dRow: number;
  readonly dCol: number;
}

// Result of attempting to match a word
export interface MatchResult {
  readonly matched: boolean;
  readonly word: string | null;
  readonly cells: readonly Position[];
}

// Puzzle configuration
export interface PuzzleConfig {
  readonly title: string;
  readonly description: string;
  readonly grid: readonly string[];
  readonly words: readonly string[];
}

// Cell state for rendering
export interface CellState {
  readonly letter: string;
  readonly position: Position;
  readonly isActive: boolean;
  readonly isFound: boolean;
  readonly isInCurrentPath: boolean;
}
