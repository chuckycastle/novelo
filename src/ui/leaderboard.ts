import type { LeaderboardEntry } from '../services/supabase';

/**
 * Render the leaderboard in the given container
 */
export function renderLeaderboard(
  container: HTMLElement,
  entries: LeaderboardEntry[],
): void {
  if (entries.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-xs italic">No scores yet. Be the first!</p>';
    return;
  }

  const listHtml = entries
    .map(
      (entry, index) => `
      <li class="flex justify-between items-center py-1">
        <span class="flex items-center gap-2">
          <span class="font-mono text-gray-400 w-4">${index + 1}.</span>
          <span class="truncate max-w-[100px]">${escapeHtml(entry.player_name)}</span>
        </span>
        <span class="font-mono text-purple-600 font-medium">${entry.time_display}</span>
      </li>
    `,
    )
    .join('');

  container.innerHTML = `<ol class="space-y-0.5">${listHtml}</ol>`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
