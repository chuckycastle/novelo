import { formatWordForDisplay } from '../core/matching';

/**
 * Render the word list sidebar
 */
export function renderWordList(
  container: HTMLElement,
  words: readonly string[],
  foundWords: ReadonlySet<string>,
): void {
  container.innerHTML = '';

  const list = document.createElement('ul');
  list.className = 'grid grid-cols-2 gap-x-4 gap-y-1 text-sm';

  words.forEach((word) => {
    const isFound = foundWords.has(word);
    const li = document.createElement('li');
    li.className = `
      flex items-center gap-2
      ${isFound ? 'text-green-700 line-through' : 'text-gray-700'}
    `.trim().replace(/\s+/g, ' ');

    const icon = document.createElement('span');
    icon.textContent = isFound ? '✓' : '•';
    icon.className = isFound ? 'text-green-600 font-bold' : 'text-gray-400';

    const text = document.createElement('span');
    text.textContent = formatWordForDisplay(word);

    li.appendChild(icon);
    li.appendChild(text);
    list.appendChild(li);
  });

  container.appendChild(list);
}

/**
 * Update the progress display
 */
export function updateProgress(
  container: HTMLElement,
  found: number,
  total: number,
): void {
  const isComplete = found === total;

  container.innerHTML = `
    <span class="${isComplete ? 'text-green-600' : 'text-purple-600'} font-semibold">
      ${found} / ${total}
    </span>
    <span class="text-gray-600"> names found</span>
    ${isComplete ? '<span class="ml-2">🎉</span>' : ''}
  `;
}
