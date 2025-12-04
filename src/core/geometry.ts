import type { Direction, Position } from '../types';

/**
 * Check if two positions form a valid straight line (horizontal, vertical, or diagonal)
 */
export function isValidLine(start: Position, end: Position): boolean {
  const dRow = Math.abs(end.row - start.row);
  const dCol = Math.abs(end.col - start.col);

  // Same position is not a valid line
  if (dRow === 0 && dCol === 0) return false;

  // Horizontal, vertical, or diagonal (45 degrees)
  return dRow === 0 || dCol === 0 || dRow === dCol;
}

/**
 * Get the direction vector between two positions
 */
export function getDirection(start: Position, end: Position): Direction {
  const dRow = end.row - start.row;
  const dCol = end.col - start.col;

  return {
    dRow: dRow === 0 ? 0 : dRow / Math.abs(dRow),
    dCol: dCol === 0 ? 0 : dCol / Math.abs(dCol),
  };
}

/**
 * Check if two directions are the same
 */
export function isSameDirection(a: Direction, b: Direction): boolean {
  return a.dRow === b.dRow && a.dCol === b.dCol;
}

/**
 * Get all positions along a line from start to end (inclusive)
 */
export function getLineCells(start: Position, end: Position): Position[] {
  if (!isValidLine(start, end)) return [];

  const cells: Position[] = [];
  const direction = getDirection(start, end);
  const length = Math.max(Math.abs(end.row - start.row), Math.abs(end.col - start.col)) + 1;

  for (let i = 0; i < length; i++) {
    cells.push({
      row: start.row + direction.dRow * i,
      col: start.col + direction.dCol * i,
    });
  }

  return cells;
}

/**
 * Check if a position is adjacent to another (including diagonals)
 */
export function isAdjacent(a: Position, b: Position): boolean {
  const dRow = Math.abs(a.row - b.row);
  const dCol = Math.abs(a.col - b.col);
  return dRow <= 1 && dCol <= 1 && !(dRow === 0 && dCol === 0);
}

/**
 * Check if a position is within grid bounds
 */
export function isInBounds(pos: Position, gridSize: number): boolean {
  return pos.row >= 0 && pos.row < gridSize && pos.col >= 0 && pos.col < gridSize;
}

/**
 * Check if two positions are equal
 */
export function positionsEqual(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

/**
 * Find position index in a path
 */
export function findPositionInPath(path: readonly Position[], pos: Position): number {
  return path.findIndex((p) => positionsEqual(p, pos));
}

/**
 * Snap pointer delta to one of 8 cardinal/diagonal directions.
 * Uses slope thresholds to determine if movement is horizontal, vertical, or diagonal.
 */
export function snapToDirection(dx: number, dy: number): Direction {
  // Handle zero movement
  if (dx === 0 && dy === 0) {
    return { dRow: 0, dCol: 0 };
  }

  // Handle pure vertical
  if (dx === 0) {
    return { dRow: dy > 0 ? 1 : -1, dCol: 0 };
  }

  // Handle pure horizontal
  if (dy === 0) {
    return { dRow: 0, dCol: dx > 0 ? 1 : -1 };
  }

  const slope = Math.abs(dy / dx);

  // Determine if diagonal (slope near 1) or axis-aligned
  // Thresholds: < 0.5 = horizontal, > 2.0 = vertical, else diagonal
  if (slope < 0.5) {
    // Horizontal
    return { dRow: 0, dCol: dx > 0 ? 1 : -1 };
  } else if (slope > 2.0) {
    // Vertical
    return { dRow: dy > 0 ? 1 : -1, dCol: 0 };
  } else {
    // Diagonal
    return {
      dRow: dy > 0 ? 1 : -1,
      dCol: dx > 0 ? 1 : -1,
    };
  }
}

/**
 * Project pointer movement onto a locked direction line and compute the end cell.
 * Returns the grid cell that the projection points to.
 */
export function projectToGridCell(
  startCell: Position,
  dx: number,
  dy: number,
  direction: Direction,
  cellSize: number,
  gridSize: number,
): Position {
  // If no direction, return start
  if (direction.dRow === 0 && direction.dCol === 0) {
    return startCell;
  }

  // Project the pointer delta (in cells) onto the locked direction vector.
  // This yields a signed scalar that matches the intended drag direction for all quadrants.
  const deltaCols = dx / cellSize;
  const deltaRows = dy / cellSize;
  const steps = deltaCols * direction.dCol + deltaRows * direction.dRow;

  // Round to nearest cell
  const cellSteps = Math.round(steps);

  // Calculate end position
  const endRow = startCell.row + direction.dRow * cellSteps;
  const endCol = startCell.col + direction.dCol * cellSteps;

  // Clamp to grid bounds
  return {
    row: Math.max(0, Math.min(gridSize - 1, endRow)),
    col: Math.max(0, Math.min(gridSize - 1, endCol)),
  };
}
