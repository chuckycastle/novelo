import { describe, it, expect } from 'vitest';
import { snapToDirection, projectToGridCell } from '../core/geometry';

describe('snapToDirection', () => {
  it('snaps to horizontal when slope is shallow', () => {
    expect(snapToDirection(20, 5)).toEqual({ dRow: 0, dCol: 1 });
    expect(snapToDirection(-10, 1)).toEqual({ dRow: 0, dCol: -1 });
  });

  it('snaps to vertical when slope is steep', () => {
    expect(snapToDirection(1, 15)).toEqual({ dRow: 1, dCol: 0 });
    expect(snapToDirection(-2, -30)).toEqual({ dRow: -1, dCol: 0 });
  });

  it('snaps to diagonals when slope is near 1', () => {
    expect(snapToDirection(10, 12)).toEqual({ dRow: 1, dCol: 1 });
    expect(snapToDirection(-8, 6)).toEqual({ dRow: 1, dCol: -1 });
    expect(snapToDirection(6, -8)).toEqual({ dRow: -1, dCol: 1 });
    expect(snapToDirection(-5, -6)).toEqual({ dRow: -1, dCol: -1 });
  });
});

describe('projectToGridCell', () => {
  const start = { row: 5, col: 5 };
  const cellSize = 40;
  const gridSize = 20;

  it('advances horizontally based on delta and direction', () => {
    expect(projectToGridCell(start, 80, 0, { dRow: 0, dCol: 1 }, cellSize, gridSize)).toEqual({
      row: 5,
      col: 7,
    });
    expect(projectToGridCell(start, -120, 0, { dRow: 0, dCol: -1 }, cellSize, gridSize)).toEqual({
      row: 5,
      col: 2,
    });
  });

  it('advances vertically based on delta and direction', () => {
    expect(projectToGridCell(start, 0, 80, { dRow: 1, dCol: 0 }, cellSize, gridSize)).toEqual({
      row: 7,
      col: 5,
    });
    expect(projectToGridCell(start, 0, -80, { dRow: -1, dCol: 0 }, cellSize, gridSize)).toEqual({
      row: 3,
      col: 5,
    });
  });

  it('advances diagonally respecting direction sign', () => {
    expect(
      projectToGridCell(start, 80, 80, { dRow: 1, dCol: 1 }, cellSize, gridSize),
    ).toEqual({
      row: 9,
      col: 9,
    });
    expect(
      projectToGridCell(start, -80, -80, { dRow: -1, dCol: -1 }, cellSize, gridSize),
    ).toEqual({
      row: 1,
      col: 1,
    });
  });
});
