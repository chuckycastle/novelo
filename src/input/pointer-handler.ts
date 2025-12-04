import type { Direction, Position } from '../types';
import { getLineCells, snapToDirection, projectToGridCell } from '../core/geometry';
import { GRID_SIZE } from '../config/puzzle';

const DRAG_THRESHOLD = 10; // pixels

interface PointerTracker {
  startX: number;
  startY: number;
  startPosition: Position | null;
  hasMoved: boolean;
  // Direction locking for geometric drag
  lockedDirection: Direction | null;
  cellSize: number;
}

let tracker: PointerTracker | null = null;

export interface PointerCallbacks {
  onTapStart: (pos: Position) => void;
  onTapEnd: (pos: Position) => void;
  onDragStart: (pos: Position) => void;
  onDragMove: (path: readonly Position[]) => void; // Changed: now receives computed path
  onDragEnd: () => void;
  onCancel: () => void;
}

/**
 * Get grid position from pointer event
 */
function getPositionFromElement(element: Element | null): Position | null {
  if (!element) return null;

  const cell = element.closest('[data-row][data-col]');
  if (!cell) return null;

  const row = parseInt(cell.getAttribute('data-row') ?? '', 10);
  const col = parseInt(cell.getAttribute('data-col') ?? '', 10);

  if (isNaN(row) || isNaN(col)) return null;

  return { row, col };
}

/**
 * Setup pointer event handlers on the grid element
 */
export function setupPointerHandlers(
  gridElement: HTMLElement,
  callbacks: PointerCallbacks,
): () => void {
  const onPointerDown = (e: PointerEvent): void => {
    const pos = getPositionFromElement(e.target as Element);
    if (!pos) return;

    // Prevent default to stop scrolling/text selection
    e.preventDefault();

    // Calculate cell size from grid dimensions
    const gridRect = gridElement.getBoundingClientRect();
    const cellSize = gridRect.width / GRID_SIZE;

    // Store pointer info for drag detection
    tracker = {
      startX: e.clientX,
      startY: e.clientY,
      startPosition: pos,
      hasMoved: false,
      lockedDirection: null,
      cellSize,
    };

    // Immediately notify tap start (for visual feedback)
    callbacks.onTapStart(pos);
  };

  const onPointerMove = (e: PointerEvent): void => {
    if (!tracker || !tracker.startPosition) return;

    // Prevent default to stop scrolling while dragging
    e.preventDefault();

    const dx = e.clientX - tracker.startX;
    const dy = e.clientY - tracker.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if we've crossed the drag threshold
    if (!tracker.hasMoved && distance > DRAG_THRESHOLD) {
      tracker.hasMoved = true;
      // Lock direction based on initial movement vector
      tracker.lockedDirection = snapToDirection(dx, dy);
      // Only capture pointer once drag starts (not on tap)
      gridElement.setPointerCapture(e.pointerId);
      callbacks.onDragStart(tracker.startPosition);
    }

    if (tracker.hasMoved && tracker.lockedDirection) {
      // Project pointer position onto locked direction to get end cell
      const endPos = projectToGridCell(
        tracker.startPosition,
        dx,
        dy,
        tracker.lockedDirection,
        tracker.cellSize,
        GRID_SIZE,
      );

      // Build path geometrically from start to projected end
      const path = getLineCells(tracker.startPosition, endPos);
      if (path.length > 0) {
        callbacks.onDragMove(path);
      }
    }
  };

  const onPointerUp = (e: PointerEvent): void => {
    if (!tracker) return;

    if (tracker.hasMoved) {
      // End drag
      callbacks.onDragEnd();
    } else {
      // It was a tap - try multiple methods to get the cell position
      // 1. Try elementFromPoint (works on desktop)
      // 2. Fall back to e.target (might work on some mobile)
      // 3. Fall back to start position (user didn't move, so same cell)
      let pos = getPositionFromElement(document.elementFromPoint(e.clientX, e.clientY));
      if (!pos) {
        pos = getPositionFromElement(e.target as Element);
      }
      if (!pos) {
        pos = tracker.startPosition;
      }
      if (pos) {
        callbacks.onTapEnd(pos);
      }
    }

    tracker = null;
  };

  const onPointerCancel = (): void => {
    if (tracker) {
      tracker = null;
      callbacks.onCancel();
    }
  };

  const onPointerLeave = (): void => {
    // Only cancel if we don't have an active tracker (pointer not captured)
    // With pointer capture on grid, this shouldn't fire during active interaction
    if (!tracker) {
      callbacks.onCancel();
    }
  };

  // Add event listeners
  gridElement.addEventListener('pointerdown', onPointerDown);
  gridElement.addEventListener('pointermove', onPointerMove);
  gridElement.addEventListener('pointerup', onPointerUp);
  gridElement.addEventListener('pointercancel', onPointerCancel);
  gridElement.addEventListener('pointerleave', onPointerLeave);

  // Prevent context menu on long press
  gridElement.addEventListener('contextmenu', (e) => e.preventDefault());

  // Prevent touch scrolling on the grid
  const onTouchMove = (e: TouchEvent): void => {
    if (tracker) {
      e.preventDefault();
    }
  };
  gridElement.addEventListener('touchmove', onTouchMove, { passive: false });

  // Return cleanup function
  return () => {
    gridElement.removeEventListener('pointerdown', onPointerDown);
    gridElement.removeEventListener('pointermove', onPointerMove);
    gridElement.removeEventListener('pointerup', onPointerUp);
    gridElement.removeEventListener('pointercancel', onPointerCancel);
    gridElement.removeEventListener('pointerleave', onPointerLeave);
    gridElement.removeEventListener('touchmove', onTouchMove);
  };
}
