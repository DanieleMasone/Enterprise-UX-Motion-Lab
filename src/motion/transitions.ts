import type { Transition } from "motion/react";
import { motionTokens, type MotionIntent } from "./motion.tokens";

/**
 * Maps semantic interaction intent to a Motion transition.
 *
 * Components should request an intent instead of hardcoding duration/easing
 * values. Reduced motion collapses animated movement while preserving state.
 */
export function getTransition(intent: MotionIntent, reduceMotion: boolean): Transition {
  if (reduceMotion) {
    return { duration: motionTokens.duration.instant };
  }

  switch (intent) {
    case "feedback":
      return {
        duration: motionTokens.duration.fast,
        ease: motionTokens.easing.productive
      };
    case "panel":
      return {
        duration: motionTokens.duration.standard,
        ease: motionTokens.easing.entrance
      };
    case "overlay":
      return {
        duration: motionTokens.duration.deliberate,
        ease: motionTokens.easing.entrance
      };
    case "list":
      return {
        duration: motionTokens.duration.standard,
        ease: motionTokens.easing.productive
      };
  }
}
