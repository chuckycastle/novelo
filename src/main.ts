import { familyPuzzle } from './config/puzzle';
import { getLineCells, isValidLine } from './core/geometry';
import { tryMatch } from './core/matching';
import { PrecisionTimer } from './core/timer';
import { setupPointerHandlers } from './input/pointer-handler';
import {
  clearSelection,
  completeDragSelection,
  createInitialSelection,
  handleDragMove,
  handleTapSelection,
  startSelection,
} from './state/selection-state';
import { positionsEqual } from './core/geometry';
import {
  createInitialState,
  markWordFound,
  startGame,
} from './state/game-state';
import {
  markCellsFound,
  renderGrid,
  updateSelectionHighlight,
} from './ui/grid';
import { renderWordList, updateProgress } from './ui/word-list';
import { initTimerDisplay, updateTimerDisplay } from './ui/timer-display';
import { showCompletionScreen, showGameScreen, showStartScreen } from './ui/screens';
import type { GameState, Position, SelectionState } from './types';
import './styles/main.css';

// Global state
let gameState: GameState = createInitialState();
let selectionState: SelectionState = createInitialSelection();
let timer: PrecisionTimer | null = null;
let foundCells: Set<string> = new Set();

// DOM elements
let gridContainer: HTMLElement | null = null;
let wordListContainer: HTMLElement | null = null;
let progressContainer: HTMLElement | null = null;
let timerContainer: HTMLElement | null = null;

/**
 * Initialize the application
 */
function init(): void {
  // Get DOM elements
  gridContainer = document.getElementById('grid');
  wordListContainer = document.getElementById('word-list');
  progressContainer = document.getElementById('progress');
  timerContainer = document.getElementById('timer');

  if (!gridContainer || !wordListContainer || !progressContainer || !timerContainer) {
    console.error('Required DOM elements not found');
    return;
  }

  // Show start screen
  showStartScreen(handleStartGame);
}

/**
 * Handle starting the game
 */
function handleStartGame(): void {
  // Reset state
  gameState = startGame(createInitialState());
  selectionState = createInitialSelection();
  foundCells = new Set();

  // Show game screen
  showGameScreen();

  // Render initial state
  renderGrid(gridContainer!, familyPuzzle.grid, foundCells);
  renderWordList(wordListContainer!, familyPuzzle.words, gameState.foundWords);
  updateProgress(progressContainer!, 0, familyPuzzle.words.length);
  initTimerDisplay(timerContainer!);

  // Setup input handlers
  setupPointerHandlers(gridContainer!, {
    onTapStart: handleTapStart,
    onTapEnd: handleTapEnd,
    onDragStart: handleDragStart,
    onDragMove: handleDragMoveEvent,
    onDragEnd: handleDragEnd,
    onCancel: handleCancel,
  });

  // Start timer
  timer = new PrecisionTimer((time) => {
    updateTimerDisplay(timerContainer!, time);
  });
  timer.start();
}

/**
 * Handle tap start (visual feedback)
 */
function handleTapStart(pos: Position): void {
  // Just provide visual feedback for the first tap
  if (!selectionState.isActive) {
    selectionState = startSelection(pos, 'tap');
    updateSelectionHighlight(gridContainer!, selectionState.currentPath);
  }
}

/**
 * Handle tap end (complete selection or set second point)
 */
function handleTapEnd(pos: Position): void {
  // If this is the first tap completing (pointerup on same cell as pointerdown),
  // the selection is already set by handleTapStart - just keep it highlighted
  if (selectionState.currentPath.length === 1) {
    const firstCell = selectionState.currentPath[0];
    if (firstCell && positionsEqual(firstCell, pos)) {
      // First tap completion - selection already set, nothing more to do
      return;
    }
  }

  const result = handleTapSelection(selectionState, pos);
  selectionState = result.state;

  if (result.shouldCheck) {
    // We have start and end - check if it's a valid line and matches a word
    const path = selectionState.currentPath;
    if (path.length === 2) {
      const [start, end] = path;
      if (start && end && isValidLine(start, end)) {
        const cells = getLineCells(start, end);
        checkForMatch(cells);
      }
    }
    // Clear selection after checking
    selectionState = clearSelection();
    updateSelectionHighlight(gridContainer!, []);
  } else {
    // Update highlight for first tap
    updateSelectionHighlight(gridContainer!, selectionState.currentPath);
  }
}

/**
 * Handle drag start
 */
function handleDragStart(pos: Position): void {
  selectionState = startSelection(pos, 'drag');
  updateSelectionHighlight(gridContainer!, selectionState.currentPath);
}

/**
 * Handle drag move - receives pre-computed path from pointer handler
 */
function handleDragMoveEvent(path: readonly Position[]): void {
  selectionState = handleDragMove(selectionState, path);
  updateSelectionHighlight(gridContainer!, selectionState.currentPath);
}

/**
 * Handle drag end
 */
function handleDragEnd(): void {
  const result = completeDragSelection(selectionState);

  if (result.shouldCheck) {
    checkForMatch(selectionState.currentPath);
  }

  selectionState = clearSelection();
  updateSelectionHighlight(gridContainer!, []);
}

/**
 * Handle cancel (pointer left grid, etc.)
 */
function handleCancel(): void {
  selectionState = clearSelection();
  updateSelectionHighlight(gridContainer!, []);
}

/**
 * Check if a selection matches a word
 */
function checkForMatch(cells: readonly Position[]): void {
  const matchResult = tryMatch(
    familyPuzzle.grid,
    cells,
    familyPuzzle.words,
    gameState.foundWords,
  );

  if (matchResult.matched && matchResult.word) {
    // Update game state
    gameState = markWordFound(gameState, matchResult.word, familyPuzzle.words.length);

    // Update found cells
    matchResult.cells.forEach((pos) => {
      foundCells.add(`${pos.row},${pos.col}`);
    });

    // Update UI
    markCellsFound(gridContainer!, matchResult.cells);
    renderWordList(wordListContainer!, familyPuzzle.words, gameState.foundWords);
    updateProgress(progressContainer!, gameState.foundWords.size, familyPuzzle.words.length);

    // Check for completion
    if (gameState.phase === 'complete') {
      handleGameComplete();
    }
  }
}

/**
 * Handle game completion
 */
function handleGameComplete(): void {
  const finalTime = timer?.stop() ?? '00:00.00';
  showCompletionScreen(finalTime, handlePlayAgain);
}

/**
 * Handle play again
 */
function handlePlayAgain(): void {
  handleStartGame();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
