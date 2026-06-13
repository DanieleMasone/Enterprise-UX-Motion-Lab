/**
 * Governed motion values for enterprise workflows.
 *
 * Durations are intentionally short because this interface is meant for
 * repeated operational use, not occasional brand storytelling.
 */
export const motionTokens = {
  duration: {
    instant: 0.01,
    fast: 0.12,
    standard: 0.18,
    deliberate: 0.24
  },
  easing: {
    productive: [0.2, 0, 0, 1] as const,
    entrance: [0, 0, 0.2, 1] as const,
    exit: [0.4, 0, 1, 1] as const
  },
  distance: {
    subtle: 4,
    panel: 8,
    overlay: 12
  },
  stagger: {
    listItem: 0.025
  },
  scale: {
    press: 0.985,
    affordance: 1.01
  }
} as const;

export type MotionIntent = "feedback" | "panel" | "overlay" | "list";
