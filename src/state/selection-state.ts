import { positionsEqual } from '../core/geometry';
import type { Position, SelectionState } from '../types';

/**
 * Create initial selection state
 */
export function createInitialSelection(): SelectionState {
  return {
    isActive: false,
    startPosition: null,
    currentPath: [],
    mode: 'tap',
  };
}

/**
 * Start a new selection
 */
export function startSelection(pos: Position, mode: 'tap' | 'drag'): SelectionState {
  return {
    isActive: true,
    startPosition: pos,
    currentPath: [pos],
    mode,
  };
}

/**
 * Clear current selection
 */
export function clearSelection(): SelectionState {
  return createInitialSelection();
}

/**
 * Handle tap selection - either set start or complete the line
 */
export function handleTapSelection(
  state: SelectionState,
  pos: Position,
): { state: SelectionState; shouldCheck: boolean } {
  // If no active selection, start one
  if (!state.isActive || state.startPosition === null) {
    return {
      state: startSelection(pos, 'tap'),
      shouldCheck: false,
    };
  }

  // If tapping the same cell, cancel selection
  if (positionsEqual(state.startPosition, pos)) {
    return {
      state: clearSelection(),
      shouldCheck: false,
    };
  }

  // Complete the selection with the end position
  return {
    state: {
      ...state,
      currentPath: [state.startPosition, pos],
    },
    shouldCheck: true,
  };
}

/**
 * Handle drag move - set the path directly (geometric calculation done by pointer handler)
 */
export function handleDragMove(state: SelectionState, path: readonly Position[]): SelectionState {
  if (!state.isActive) return state;

  return {
    ...state,
    currentPath: path,
  };
}

/**
 * Complete a drag selection
 */
export function completeDragSelection(state: SelectionState): {
  state: SelectionState;
  shouldCheck: boolean;
} {
  return {
    state,
    shouldCheck: state.currentPath.length >= 2,
  };
}
