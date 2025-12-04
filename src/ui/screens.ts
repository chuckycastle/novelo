/**
 * Show the start screen
 */
export function showStartScreen(onStart: (playerName: string) => void): void {
  const screen = document.getElementById('start-screen');
  const gameScreen = document.getElementById('game-screen');
  const completeScreen = document.getElementById('complete-screen');

  if (screen) screen.classList.remove('hidden');
  if (gameScreen) gameScreen.classList.add('hidden');
  if (completeScreen) completeScreen.classList.add('hidden');

  const nameInput = document.getElementById('player-name') as HTMLInputElement;
  const startBtn = document.getElementById('start-btn') as HTMLButtonElement;

  if (nameInput && startBtn) {
    // Clear previous value
    nameInput.value = '';
    startBtn.disabled = true;

    // Remove old listeners
    const newInput = nameInput.cloneNode(true) as HTMLInputElement;
    nameInput.parentNode?.replaceChild(newInput, nameInput);

    const newBtn = startBtn.cloneNode(true) as HTMLButtonElement;
    startBtn.parentNode?.replaceChild(newBtn, startBtn);

    // Enable button when name is entered
    newInput.addEventListener('input', () => {
      const name = newInput.value.trim();
      newBtn.disabled = name.length === 0;
    });

    // Handle enter key
    newInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !newBtn.disabled) {
        onStart(newInput.value.trim());
      }
    });

    // Handle start button click
    newBtn.addEventListener('click', () => {
      const name = newInput.value.trim();
      if (name.length > 0) {
        onStart(name);
      }
    });

    // Focus the input
    newInput.focus();
  }
}

/**
 * Show the game screen
 */
export function showGameScreen(): void {
  const screen = document.getElementById('start-screen');
  const gameScreen = document.getElementById('game-screen');
  const completeScreen = document.getElementById('complete-screen');

  if (screen) screen.classList.add('hidden');
  if (gameScreen) gameScreen.classList.remove('hidden');
  if (completeScreen) completeScreen.classList.add('hidden');
}

/**
 * Show the completion screen
 */
export function showCompletionScreen(
  finalTime: string,
  rank: number | null,
  onPlayAgain: () => void,
): void {
  const screen = document.getElementById('start-screen');
  const gameScreen = document.getElementById('game-screen');
  const completeScreen = document.getElementById('complete-screen');
  const timeDisplay = document.getElementById('final-time');
  const rankDisplay = document.getElementById('rank-display');

  if (screen) screen.classList.add('hidden');
  if (gameScreen) gameScreen.classList.add('hidden');
  if (completeScreen) completeScreen.classList.remove('hidden');
  if (timeDisplay) timeDisplay.textContent = finalTime;

  // Show rank if in top 5
  if (rankDisplay) {
    if (rank !== null && rank <= 5) {
      rankDisplay.textContent = `You placed #${rank}!`;
      rankDisplay.classList.remove('hidden');
    } else {
      rankDisplay.classList.add('hidden');
    }
  }

  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    // Remove old listener and add new one
    const newBtn = playAgainBtn.cloneNode(true) as HTMLButtonElement;
    playAgainBtn.parentNode?.replaceChild(newBtn, playAgainBtn);
    newBtn.addEventListener('click', onPlayAgain);
  }
}
