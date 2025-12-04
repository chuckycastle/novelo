import type { MatchResult, Position } from '../types';

/**
 * Extract a word from the grid given a list of positions
 */
export function extractWord(grid: readonly string[], cells: readonly Position[]): string {
  return cells.map(({ row, col }) => grid[row]?.[col] ?? '').join('');
}

/**
 * Check if a word matches any target word (forward or reversed)
 */
export function matchWord(
  candidate: string,
  targetWords: readonly string[],
): { matched: boolean; word: string | null } {
  const reversed = candidate.split('').reverse().join('');

  for (const word of targetWords) {
    if (word === candidate || word === reversed) {
      return { matched: true, word };
    }
  }

  return { matched: false, word: null };
}

/**
 * Try to match a selection against the word list
 */
export function tryMatch(
  grid: readonly string[],
  cells: readonly Position[],
  targetWords: readonly string[],
  foundWords: ReadonlySet<string>,
): MatchResult {
  if (cells.length < 2) {
    return { matched: false, word: null, cells: [] };
  }

  const candidate = extractWord(grid, cells);
  const result = matchWord(candidate, targetWords);

  // Don't match already found words
  if (result.matched && result.word && foundWords.has(result.word)) {
    return { matched: false, word: null, cells: [] };
  }

  return {
    matched: result.matched,
    word: result.word,
    cells: result.matched ? cells : [],
  };
}

/**
 * Format a word for display (capitalize first letter)
 */
export function formatWordForDisplay(word: string): string {
  return word.charAt(0) + word.slice(1).toLowerCase();
}
