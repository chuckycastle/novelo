/**
 * Show the start screen
 */
export function showStartScreen(onStart: () => void): void {
  const screen = document.getElementById('start-screen');
  const gameScreen = document.getElementById('game-screen');
  const completeScreen = document.getElementById('complete-screen');

  if (screen) screen.classList.remove('hidden');
  if (gameScreen) gameScreen.classList.add('hidden');
  if (completeScreen) completeScreen.classList.add('hidden');

  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    // Remove old listener and add new one
    const newBtn = startBtn.cloneNode(true) as HTMLButtonElement;
    startBtn.parentNode?.replaceChild(newBtn, startBtn);
    newBtn.addEventListener('click', onStart);
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
export function showCompletionScreen(finalTime: string, onPlayAgain: () => void): void {
  const screen = document.getElementById('start-screen');
  const gameScreen = document.getElementById('game-screen');
  const completeScreen = document.getElementById('complete-screen');
  const timeDisplay = document.getElementById('final-time');

  if (screen) screen.classList.add('hidden');
  if (gameScreen) gameScreen.classList.add('hidden');
  if (completeScreen) completeScreen.classList.remove('hidden');
  if (timeDisplay) timeDisplay.textContent = finalTime;

  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    // Remove old listener and add new one
    const newBtn = playAgainBtn.cloneNode(true) as HTMLButtonElement;
    playAgainBtn.parentNode?.replaceChild(newBtn, playAgainBtn);
    newBtn.addEventListener('click', onPlayAgain);
  }
}
