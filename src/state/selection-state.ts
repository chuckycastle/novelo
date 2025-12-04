import {
  findPositionInPath,
  getDirection,
  isAdjacent,
  isSameDirection,
  positionsEqual,
} from '../core/geometry';
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
 * Handle drag move - extend or backtrack the path
 */
export function handleDragMove(state: SelectionState, pos: Position): SelectionState {
  if (!state.isActive) return state;

  const path = state.currentPath;

  // If position is already in path, backtrack to that point
  const existingIndex = findPositionInPath(path, pos);
  if (existingIndex >= 0) {
    return {
      ...state,
      currentPath: path.slice(0, existingIndex + 1),
    };
  }

  // Check if this is a valid extension
  if (path.length === 0) {
    return {
      ...state,
      currentPath: [pos],
    };
  }

  const last = path[path.length - 1];
  if (!last) return state;

  // Must be adjacent
  if (!isAdjacent(last, pos)) {
    return state;
  }

  // If path has 2+ cells, must continue in same direction
  if (path.length >= 2) {
    const first = path[0];
    const second = path[1];
    if (!first || !second) return state;

    const currentDirection = getDirection(first, second);
    const newDirection = getDirection(last, pos);

    if (!isSameDirection(currentDirection, newDirection)) {
      return state;
    }
  }

  return {
    ...state,
    currentPath: [...path, pos],
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
