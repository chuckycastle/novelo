# Manual Testing Checklist

Quick pass you can run after touch/mouse input changes.

- **Tap selection (mobile iOS/Android)**: First tap highlights a cell, second tap on another cell completes a line if valid; tapping the same cell twice clears the highlight.
- **Tap selection (desktop mouse)**: Same behavior as mobile; clicks should not scroll or select text.
- **Short wobble tap**: Small finger wiggle should remain a tap (no accidental drag end).
- **Drag directions**: Drag in all 8 directions; highlight follows finger/cursor, including up/left and diagonals.
- **Drag cancellation**: Begin a drag, move out of the grid, release—selection should clear without errors.
- **Found cells**: After matching a word, green cells stay green; they should not be re-highlighted as active during new drags/taps.
- **Scrolling outside grid**: Page still scrolls normally outside the grid; grid itself does not scroll during interaction.
