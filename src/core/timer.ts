export type TimerCallback = (formatted: string) => void;

/**
 * High-precision timer using performance.now() and requestAnimationFrame
 * Displays time in MM:SS.ss format (centisecond precision)
 */
export class PrecisionTimer {
  private startTime: number = 0;
  private animationFrameId: number | null = null;
  private onTick: TimerCallback;
  private stopped: boolean = false;

  constructor(onTick: TimerCallback) {
    this.onTick = onTick;
  }

  /**
   * Start the timer
   */
  start(): void {
    this.startTime = performance.now();
    this.stopped = false;
    this.tick();
  }

  /**
   * Stop the timer and return the final formatted time
   */
  stop(): string {
    this.stopped = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    return this.format(performance.now() - this.startTime);
  }

  /**
   * Get current elapsed time in milliseconds
   */
  getElapsed(): number {
    return performance.now() - this.startTime;
  }

  /**
   * Animation frame tick
   */
  private tick = (): void => {
    if (this.stopped) return;

    const elapsed = performance.now() - this.startTime;
    this.onTick(this.format(elapsed));
    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  /**
   * Format milliseconds as MM:SS.ss
   */
  private format(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  }
}

/**
 * Format milliseconds as MM:SS.ss (static utility)
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}
