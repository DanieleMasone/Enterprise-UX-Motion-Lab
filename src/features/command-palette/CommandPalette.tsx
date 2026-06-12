import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { motionTokens } from "../../motion/motion.tokens";
import { getTransition } from "../../motion/transitions";
import { EmptyState } from "../../ui";
import { filterCommandActions, type CommandAction } from "./command-palette";

export interface CommandPaletteProps {
  actions: CommandAction[];
  open: boolean;
  reduceMotion: boolean;
  onClose: () => void;
}

/**
 * Keyboard-first command palette for operational actions and view controls.
 */
export function CommandPalette({ actions, open, reduceMotion, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const filteredActions = useMemo(() => filterCommandActions(actions, query), [actions, query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    window.setTimeout(() => searchRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, open]);

  const runAction = (action: CommandAction) => {
    action.perform();
    onClose();
  };

  const runFirstAction = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || filteredActions.length === 0) {
      return;
    }

    event.preventDefault();
    runAction(filteredActions[0]);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="command-palette"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={getTransition("overlay", reduceMotion)}
        >
          <button aria-label="Close command palette" className="command-palette__scrim" onClick={onClose} />
          <motion.section
            aria-labelledby="command-palette-title"
            aria-modal="true"
            className="command-palette__dialog"
            initial={{ opacity: 0, y: reduceMotion ? 0 : motionTokens.distance.overlay }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : motionTokens.distance.subtle }}
            role="dialog"
            transition={getTransition("overlay", reduceMotion)}
          >
            <header className="command-palette__header">
              <div>
                <h2 id="command-palette-title">Command palette</h2>
                <p>Run view, filter, and data-state actions.</p>
              </div>
              <kbd>Esc</kbd>
            </header>
            <input
              aria-label="Command search"
              className="command-palette__search"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={runFirstAction}
              placeholder="Search commands"
              ref={searchRef}
              type="search"
              value={query}
            />
            <div className="command-palette__results">
              {filteredActions.length > 0 ? (
                <ul>
                  {filteredActions.map((action) => (
                    <li key={action.id}>
                      <button className="command-palette__action" onClick={() => runAction(action)} type="button">
                        <span>{action.label}</span>
                        <small>{action.description}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="No matching commands"
                  message="Try theme, density, loading, degraded, or filters."
                />
              )}
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
