import type { Position } from '../types';

/**
 * Render the word search grid
 */
export function renderGrid(
  container: HTMLElement,
  grid: readonly string[],
  foundCells: ReadonlySet<string>,
): void {
  container.innerHTML = '';

  grid.forEach((row, rowIndex) => {
    [...row].forEach((letter, colIndex) => {
      const cellKey = `${rowIndex},${colIndex}`;
      const isFound = foundCells.has(cellKey);

      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `
        flex items-center justify-center
        border border-gray-200
        font-semibold uppercase
        select-none
        transition-colors duration-100
        focus:outline-none
        ${isFound ? 'bg-green-200 border-green-400 text-green-800' : 'bg-white hover:bg-purple-50'}
      `.trim().replace(/\s+/g, ' ');

      cell.textContent = letter;
      cell.dataset.row = String(rowIndex);
      cell.dataset.col = String(colIndex);

      if (isFound) {
        cell.dataset.found = 'true';
      }

      container.appendChild(cell);
    });
  });
}

/**
 * Update cell highlighting for current selection path
 */
export function updateSelectionHighlight(
  container: HTMLElement,
  path: readonly Position[],
): void {
  // Clear all active states first
  container.querySelectorAll('[data-active]').forEach((cell) => {
    cell.removeAttribute('data-active');
    cell.classList.remove('bg-purple-100', 'border-purple-500');
    if (!cell.hasAttribute('data-found')) {
      cell.classList.add('bg-white', 'hover:bg-purple-50');
    }
  });

  // Apply active state to path cells
  path.forEach((pos) => {
    const cell = container.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`);
    if (cell && !cell.hasAttribute('data-found')) {
      cell.setAttribute('data-active', 'true');
      cell.classList.remove('bg-white', 'hover:bg-purple-50');
      cell.classList.add('bg-purple-100', 'border-purple-500');
    }
  });
}

/**
 * Mark cells as found (permanently green)
 */
export function markCellsFound(container: HTMLElement, cells: readonly Position[]): void {
  cells.forEach((pos) => {
    const cell = container.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`);
    if (cell) {
      cell.setAttribute('data-found', 'true');
      cell.removeAttribute('data-active');
      cell.classList.remove('bg-white', 'hover:bg-purple-50', 'bg-purple-100', 'border-purple-500');
      cell.classList.add('bg-green-200', 'border-green-600', 'text-green-800');
    }
  });
}

/**
 * Generate a Set of found cell keys from positions
 */
export function createFoundCellsSet(positions: readonly Position[]): Set<string> {
  return new Set(positions.map((p) => `${p.row},${p.col}`));
}
