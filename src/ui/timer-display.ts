/**
 * Update the timer display
 */
export function updateTimerDisplay(container: HTMLElement, time: string): void {
  container.textContent = time;
}

/**
 * Create initial timer display
 */
export function initTimerDisplay(container: HTMLElement): void {
  container.textContent = '00:00.00';
  container.className = 'font-mono text-2xl sm:text-3xl font-bold text-purple-600';
}
