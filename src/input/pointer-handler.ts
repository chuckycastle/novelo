import type { Position } from '../types';

const DRAG_THRESHOLD = 10; // pixels

interface PointerTracker {
  startX: number;
  startY: number;
  startPosition: Position | null;
  hasMoved: boolean;
}

let tracker: PointerTracker | null = null;

export interface PointerCallbacks {
  onTapStart: (pos: Position) => void;
  onTapEnd: (pos: Position) => void;
  onDragStart: (pos: Position) => void;
  onDragMove: (pos: Position) => void;
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

    // Capture pointer for tracking
    (e.target as Element).setPointerCapture?.(e.pointerId);

    tracker = {
      startX: e.clientX,
      startY: e.clientY,
      startPosition: pos,
      hasMoved: false,
    };

    // Immediately notify tap start (for visual feedback)
    callbacks.onTapStart(pos);
  };

  const onPointerMove = (e: PointerEvent): void => {
    if (!tracker || !tracker.startPosition) return;

    const dx = e.clientX - tracker.startX;
    const dy = e.clientY - tracker.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if we've crossed the drag threshold
    if (!tracker.hasMoved && distance > DRAG_THRESHOLD) {
      tracker.hasMoved = true;
      callbacks.onDragStart(tracker.startPosition);
    }

    if (tracker.hasMoved) {
      const pos = getPositionFromElement(document.elementFromPoint(e.clientX, e.clientY));
      if (pos) {
        callbacks.onDragMove(pos);
      }
    }
  };

  const onPointerUp = (e: PointerEvent): void => {
    if (!tracker) return;

    if (tracker.hasMoved) {
      // End drag
      callbacks.onDragEnd();
    } else {
      // It was a tap - get the end position
      const pos = getPositionFromElement(e.target as Element);
      if (pos) {
        callbacks.onTapEnd(pos);
      }
    }

    tracker = null;
  };

  const onPointerCancel = (): void => {
    tracker = null;
    callbacks.onCancel();
  };

  // Add event listeners
  gridElement.addEventListener('pointerdown', onPointerDown);
  gridElement.addEventListener('pointermove', onPointerMove);
  gridElement.addEventListener('pointerup', onPointerUp);
  gridElement.addEventListener('pointercancel', onPointerCancel);
  gridElement.addEventListener('pointerleave', onPointerCancel);

  // Prevent context menu on long press
  gridElement.addEventListener('contextmenu', (e) => e.preventDefault());

  // Return cleanup function
  return () => {
    gridElement.removeEventListener('pointerdown', onPointerDown);
    gridElement.removeEventListener('pointermove', onPointerMove);
    gridElement.removeEventListener('pointerup', onPointerUp);
    gridElement.removeEventListener('pointercancel', onPointerCancel);
    gridElement.removeEventListener('pointerleave', onPointerCancel);
  };
}
