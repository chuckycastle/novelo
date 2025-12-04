import { describe, it, expect } from 'vitest';
import { classifyInteraction } from '../input/pointer-handler';

describe('classifyInteraction', () => {
  it('treats simple taps as tap', () => {
    expect(classifyInteraction(false, false)).toBe('tap');
    expect(classifyInteraction(true, false)).toBe('tap'); // moved but no drag path emitted
  });

  it('treats true drags as drag', () => {
    expect(classifyInteraction(true, true)).toBe('drag');
  });
});
