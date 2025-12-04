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
